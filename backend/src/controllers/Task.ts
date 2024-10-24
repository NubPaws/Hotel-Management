import { Router } from "express";
import TaskModel from "../models/Task.js";
import { AuthedRequest, dataValidate, verifyUser } from "./Validator.js";
import { Department, UnauthorizedUserError } from "../models/User.js";
import { StatusCode } from "../utils/StatusCode.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Tasks
 *   description: Endpoints for managing tasks
 */

/**
 * @swagger
 * /api/Tasks:
 *   post:
 *     summary: Create a new task
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - room
 *               - description
 *               - urgency
 *               - department
 *               - creator
 *             properties:
 *               room:
 *                 type: number
 *                 description: Room number
 *               description:
 *                 type: string
 *                 description: Task description
 *               urgency:
 *                 type: number
 *                 description: Urgency level (0-9)
 *               department:
 *                 type: string
 *                 description: Department to handle the task
 *               creator:
 *                 type: string
 *                 description: Task creator's username
 *     responses:
 *       201:
 *         description: Task created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       400:
 *         description: Invalid input
 */
router.post("/", verifyUser, async (req, res, next) => {
	const {
		room, description, urgency, department, creator
	} = req.body;
	
	const validation = dataValidate(
		{ room, description, urgency, department, creator}
	);
	if (validation.status) {
		return validation.respond(res);
	}
	
	try {
		const task = await TaskModel.create(
			room,
			description,
			urgency,
			department,
			creator
		);
		res.status(StatusCode.Created).json(task);
	} catch (error) {
		next(error);
	}
});

/**
 * @swagger
 * /api/Tasks/{taskId}:
 *   get:
 *     summary: Get a specific task by its ID
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: number
 *         description: Task ID
 *     responses:
 *       200:
 *         description: Task retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       404:
 *         description: Task not found
 */
router.get("/:taskId", verifyUser, async (req, res, next) => {
	const { taskId } = req.params;
	
	try {
		const task = await TaskModel.getTask(Number(taskId));
		res.status(StatusCode.Ok).json(task);
	} catch (error) {
		next(error);
	}
});

/**
 * @swagger
 * /api/Tasks/{taskId}:
 *   post:
 *     summary: Update a task's description, urgency, department, or status
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: number
 *         description: Task ID
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               description:
 *                 type: string
 *                 description: Updated description
 *               urgency:
 *                 type: number
 *                 description: Updated urgency level (0-9)
 *               department:
 *                 type: string
 *                 description: Updated department
 *               status:
 *                 type: string
 *                 description: Updated task status
 *     responses:
 *       200:
 *         description: Task updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       400:
 *         description: Invalid input
 */
router.post("/:taskId", verifyUser, async (req, res, next) => {
	const { user } = req as AuthedRequest;
	
	const { taskId } = req.params;
	const { description, urgency, department, status } = req.body;
	
	try {
		if (description) {
			await TaskModel.setDescription(Number(taskId), user.user, description);
		}
		if (urgency) {
			await TaskModel.setUrgency(Number(taskId), user.user, urgency);
		}
		if (department) {
			await TaskModel.setDepartment(Number(taskId), user.user, department);
		}
		if (status) {
			await TaskModel.setStatus(Number(taskId), user.user, status);
		}
		
		const task = await TaskModel.getTask(Number(taskId));
		res.status(StatusCode.Ok).json(task);
	} catch (error) {
		next(error);
	}
});

/**
 * @swagger
 * /api/Tasks/department/{department}:
 *   get:
 *     summary: Get tasks by department
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: department
 *         required: true
 *         schema:
 *           type: string
 *         description: Department name
 *     responses:
 *       200:
 *         description: List of tasks retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 */
router.get("/department/:department", verifyUser, async (req, res, next) => {
	const department = req.params.department as Department;
	
	try {
		const tasks = await TaskModel.getTasksByDepartment(department);
		res.status(StatusCode.Ok).json(tasks);
	} catch (error) {
		next(error);
	}
});

/**
 * @swagger
 * /api/Tasks/remove/{taskId}:
 *   post:
 *     summary: Remove a task by ID
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: number
 *         description: Task ID
 *     responses:
 *       200:
 *         description: Task removed successfully
 *       403:
 *         description: Forbidden - only admin users can remove tasks
 */
router.post("/remove/:taskId", verifyUser, async (req, res, next) => {
	const { isAdmin } = req as AuthedRequest;
	if (!isAdmin) {
		return next(new UnauthorizedUserError());
	}
	
	const taskId = Number(req.params.taskId);
	
	try {
		await TaskModel.remove(taskId);
		res.status(StatusCode.Ok).send("Task removed successfully");
	} catch (error) {
		next(error);
	}
});

export const TasksRouter = router;
