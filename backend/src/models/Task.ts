import mongoose, { Document, Schema } from "mongoose";
import User, { Department, UserDoesNotExistError } from "./User.js";
import Room, { RoomDoesNotExistError } from "./Room.js";
import Counter from "./Counter.js";
import { dateToString, Time24 } from "../utils/Clock.js";
import Logger from "../utils/Logger.js";

export class TaskDoesNotExistError extends Error {
	constructor(taskId: number) {
		super(`Task ${taskId} does not exist in the system.`);
	}
}

export type Urgency = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

export enum TaskStatus {
	Pending = "Pending",
	Progress = "Progress",
	Finished = "Finished",
}

interface Task extends Document {
	taskId: number,				// Identifier to the task.
	timeCreated: Date			// Time the reservation was created.
	room: number,				// The room the task is for.
	description: string,		// The description of the task.
	urgency: Urgency,			// How urgent the task is.
	department: Department,		// The department the task was assigned for.
	creator: string,			// The username of the user who created the task.
	status: TaskStatus,			// The status of the task.
	history: string[],			// History of updates of the task.
}

const TaskSchema = new Schema<Task>({
	taskId: {
		type: Number,
		required: true,
		unique: true,
		index: true,
	},
	timeCreated: {
		type: Date,
		required: true,
	},
	room: {
		type: Number,
		ref: "RoomModel",
		required: true,
		index: true,
	},
	description: {
		type: String,
		required: true,
	},
	urgency: {
		type: Number,
		validate: {
			validator: (value: number) => 0 <= value && value <= 9,
			message: "Urgency can only be between 0 and 9 inclusive.",
		},
		required: true,
	},
	department: {
		type: String,
		enum: Object.values(Department),
		required: true,
	},
	creator: {
		type: String,
		ref: "UserModel",
		required: true,
	},
	status: {
		type: String,
		enum: Object.values(TaskStatus),
		default: TaskStatus.Pending,
		required: true,
	},
	history: [{
		type: String,
		required: true,
	}]
});

const TaskModel = mongoose.model<Task>("TaskModel", TaskSchema);

TaskSchema.pre("save", async function (next) {
	const doc = this;
	if (doc.isNew) {
		const counter = await Counter.increment("taskId");
		doc.taskId = counter;
	}
	next();
});

/**
 * Creates a string represting an action. This enforces a single format for action strings.
 * 
 * @param time time the action was made.
 * @param actor who did the action.
 * @param action the action that was done
 * @param message any extra information about the action, default is an empty string.
 * @returns string represting the action as a message.
 */
function actionString(time: Date, actor: string, action: string, message: string = "") {
	let str = `[${dateToString(time)}] (${actor}) ${action}`;
	if (message !== "") {
		str += `: ${message}`;
	}
	return str;
}

function actionStringNow(actor: string, action: string, message: string = "") {
	return `${actionString(new Date(), actor, action, message)}`;
}

/**
 * Creates a new task.
 * 
 * @param room The room number the task was assigned to.
 * @param description What the task is.
 * @param urgency How urgent it is from 0 to 9.
 * @param department The department that is required to handle the tas.
 * @param creator The user who created it.
 * 
 * @throws RoomDoesNotExistError - when the room is a non existant room.
 * @throws UserDoesNotExistError - when the creator is an invalid user.
 */
async function create(
	room: number,
	description: string,
	urgency: Urgency,
	department: Department,
	creator: string,
) {
	const [isRoomValid, isUserValid] = await Promise.all([
		Room.isValidRoom(room),
		User.doesUserExist(creator)
	]);
	
	if (!isRoomValid) {
		throw new RoomDoesNotExistError(room);
	}
	
	if (!isUserValid) {
		throw new UserDoesNotExistError(creator);
	}
	
	const timeCreated = new Date;
	
	await TaskModel.create({
		room,
		timeCreated,
		description,
		urgency,
		department,
		creator,
		status: TaskStatus.Pending,
		history: [actionString(timeCreated, creator, "task created")],
	});
}

/**
 * Returns a task based on a taskId, if the task doesn't exist then throws an error
 * @param taskId id of the task to return.
 * @returns task relevant to the taskId passed, if one exists.
 * @throws TaskDoesNotExistError if the taskId is of an invalid or nonexistant task
 */
async function getTask(taskId: number) {
	const task = await TaskModel.findOne({ taskId });
	
	if (!task) {
		throw new TaskDoesNotExistError(taskId);
	}
	
	return task;
}

/**
 * A generic function to update any field of a task and log the change.
 * 
 * @param taskId The ID of the task to update.
 * @param setter The username who changes the task.
 * @param field The field to update.
 * @param newValue The new value for the field.
 * @param actionDescription A description of the action for logging in the history.
 * @throws TaskDoesNotExistError if the taskId is invalid.
 */
async function setTaskValue<T extends keyof Task>(
	taskId: number,
	field: T,
	value: Task[T],
	setter: string
) {
	const task = await getTask(taskId);
	
	task.history.push(
		actionStringNow(setter, `${field} changed`, `${task[field]} => ${value}`)
	);
	
	task[field] = value;
	await task.save();
}

async function setDescription(taskId: number, setter: string, description: string) {
	setTaskValue(taskId, "description", description, setter);
}

async function setUrgency(taskId: number, setter: string, urgency: Urgency) {
	setTaskValue(taskId, "urgency", urgency, setter);
}

async function setDepartment(taskId: number, setter: string, department: Department) {
	setTaskValue(taskId, "department", department, setter);
}

async function setStatus(taskId: number, setter: string, status: TaskStatus) {
	setTaskValue(taskId, "status", status, setter);
}

/**
 * Retrieves all tasks for a specific department and returns them
 * sorted by urgency (high to low) and timeCreated (oldest to newest).
 * 
 * @param department The department to filter tasks by.
 * @returns A promise that resolves to an array of Task objects.
 */
async function getTasksByDepartment(department: Department): Promise<Task[]> {
	// Find tasks that match the department and sort them:
	// 1. First by urgency (descending, higher urgency comes first)
	// 2. Then by timeCreated (ascending, older tasks come first)
	const tasks = await TaskModel.find({ department })
	.sort({ urgency: -1, timeCreated: 1 })
	.exec();
	
	return tasks;

}

async function remove(taskId: number) {
	try {
		await TaskModel.deleteOne({ taskId });
	} catch (error) {
		Logger.error(`Failed deleting task ${taskId}. Task might not even exist.`);
	}
}

export default {
	getTask,
	create,
	setDescription,
	setUrgency,
	setDepartment,
	setStatus,
	getTasksByDepartment,
	remove,
}

/**
 * @swagger
 * components:
 *   schemas:
 *     Task:
 *       type: object
 *       required:
 *         - taskId
 *         - timeCreated
 *         - room
 *         - description
 *         - urgency
 *         - department
 *         - creator
 *         - status
 *         - history
 *       properties:
 *         taskId:
 *           type: integer
 *           description: The unique identifier for the task.
 *           example: 12345
 *         timeCreated:
 *           type: string
 *           format: date-time
 *           description: The time when the task was created.
 *           example: "2024-10-07T08:30:00.000Z"
 *         room:
 *           type: integer
 *           description: The room number associated with the task.
 *           example: 101
 *         description:
 *           type: string
 *           description: A brief description of the task.
 *           example: "Fix the air conditioner in the room."
 *         urgency:
 *           type: integer
 *           description: The urgency level of the task (0-9).
 *           minimum: 0
 *           maximum: 9
 *           example: 7
 *         department:
 *           type: string
 *           enum:
 *             - General
 *             - FrontDesk
 *             - HouseKeeping
 *             - Maintenance
 *             - Security
 *             - Concierge
 *           description: The department responsible for the task.
 *           example: "Maintenance"
 *         creator:
 *           type: string
 *           description: The username of the user who created the task.
 *           example: "john_doe"
 *         status:
 *           type: string
 *           enum:
 *             - Pending
 *             - Progress
 *             - Finished
 *           description: The current status of the task.
 *           example: "Pending"
 *         history:
 *           type: array
 *           items:
 *             type: string
 *           description: A list of updates or actions made to the task.
 *           example:
 *             - "[20/12/2024 08:35:00] (john_doe) Task created"
 *             - "[20/12/2024 10:15:00] (admin) Urgency changed: 5 => 7"
 */
