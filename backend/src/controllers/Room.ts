import { NextFunction, Request, Response, Router } from "express";
import { Department, UnauthorizedUserError, UserRole } from "../models/User.js";
import RoomModel, { InvalidRoomNumberError, RoomState, RoomTypeIsNotEmptyError } from "../models/Room.js";
import { AuthedRequest, verifyUser } from "./Validator.js";
import { StatusCode } from "../utils/StatusCode.js";
import Logger from "../utils/Logger.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Rooms
 *   description: Room management
 */

/**
 * Middleware to verify user and extract user information from JWT token.
 */

/**
 * @swagger
 * /api/Rooms/create-type/{type}:
 *   post:
 *     summary: Create a new room type
 *     tags: [Rooms]
 *     parameters:
 *       - name: type
 *         in: path
 *         description: Type of the room to create
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       description: Room type description
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               description:
 *                 type: string
 *                 description: Description of the room type
 *     responses:
 *       201:
 *         description: Room type created successfully
 *       403:
 *         description: Forbidden
 *       400:
 *         description: Invalid input
 */
router.post("/create-type/:type", verifyUser, async (req, res, next) => {
	const { isAdmin, isFrontDesk } = req as AuthedRequest;
	if (!isAdmin && !isFrontDesk) {
		return next(new UnauthorizedUserError());
	}
	
	const { type } = req.params;
	const { description } = req.body;
	
	await RoomModel.createType(type, description);
	res.status(StatusCode.Created).json({
		message: `Room type ${type} created successfully`
	});
});

/**
 * @swagger
 * /api/Rooms/create-room:
 *   post:
 *     summary: Create a new room
 *     tags: [Rooms]
 *     requestBody:
 *       description: Room details
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               type:
 *                 type: string
 *                 description: The type of the room
 *               room:
 *                 type: number
 *                 description: The room number
 *     responses:
 *       201:
 *         description: Room created successfully
 *       403:
 *         description: Forbidden
 *       400:
 *         description: Invalid input
 */
router.post("/create-room", verifyUser, async (req, res, next) => {
	const { isAdmin, isFrontDesk } = req as AuthedRequest;
	if (!isAdmin && !isFrontDesk) {
		return next(new UnauthorizedUserError());
	}
	
	const { type, room } = req.body;
	
	await RoomModel.createRoom(room, type);
	res.status(StatusCode.Created).json({
		message: `Room ${room} created successfully`
	});
});

/**
 * @swagger
 * /api/Rooms/remove-type/{type}:
 *   post:
 *     summary: Remove a room type
 *     tags: [Rooms]
 *     parameters:
 *       - name: type
 *         in: path
 *         description: Room type to remove
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       description: New room type for rooms of the removed type
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               newType:
 *                 type: string
 *                 description: The new room type to set on rooms of the removed type
 *     responses:
 *       200:
 *         description: Room type removed successfully
 *       403:
 *         description: Forbidden
 *       400:
 *         description: Invalid input
 */
router.post("/remove-type/:type", verifyUser, async (req, res, next) => {
	const { isAdmin, isFrontDesk } = req as AuthedRequest;
	if (!isAdmin && !isFrontDesk) {
		return next(new UnauthorizedUserError());
	}
	
	const { user } = req as AuthedRequest;
	const { type } = req.params;
	const { newType } = req.body;
	
	if (user.role !== UserRole.Admin && user.department !== Department.FrontDesk) {
		return res.status(403).json({ message: "Forbidden" });
	}
	
	const roomsOfType = await RoomModel.getRoomsByType(type);
	if (roomsOfType.length > 0) {
		throw new RoomTypeIsNotEmptyError(type)
	}
	
	await RoomModel.removeType(type, newType);
	res.status(StatusCode.Ok).json({
		message: `Room type ${type} removed successfully`
	});
});

/**
 * @swagger
 * /api/Rooms/remove-room/{room}:
 *   post:
 *     summary: Remove a room
 *     tags: [Rooms]
 *     parameters:
 *       - name: room
 *         in: path
 *         description: Room number to remove
 *         required: true
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: Room removed successfully
 *       403:
 *         description: Forbidden
 *       400:
 *         description: Invalid input
 */
router.post("/remove-room/:room", verifyUser, async (req, res, next) => {
	const { isAdmin, isFrontDesk } = req as AuthedRequest;
	if (!isAdmin && !isFrontDesk) {
		return next(new UnauthorizedUserError());
	}
	
	const { room } = req.params;
	
	await RoomModel.removeRoom(Number(room));
	res.status(StatusCode.Ok).json({
		message: `Room ${room} removed successfully`
	});
});

/**
 * @swagger
 * /api/Rooms/room:
 *   get:
 *     summary: Get rooms with optional filtering
 *     tags: [Rooms]
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *         description: Filter rooms by type
 *       - in: query
 *         name: state
 *         schema:
 *           type: string
 *           enum: [Clean, Inspected, Dirty, OutOfOrder]
 *         description: Filter rooms by state
 *       - in: query
 *         name: occupied
 *         schema:
 *           type: boolean
 *         description: Filter rooms by occupation status
 *       - in: query
 *         name: reservationId
 *         schema:
 *           type: number
 *         description: Filter rooms by reservation ID
 *     responses:
 *       200:
 *         description: Rooms retrieved successfully
 *       400:
 *         description: Invalid input
 */
router.get("/room", verifyUser, async (req: Request, res: Response, next: NextFunction) => {
	const { type, state, occupied, reservationId } = req.query;
	
	const filters: any = {
		type: type ? String(type) : undefined,
		state: state ? String(state) as RoomState : undefined,
		occupied: occupied ? occupied === "true" : undefined,
		reservationId: reservationId ? Number(reservationId) : undefined
	};
	
	try {
		const rooms = await RoomModel.getFilteredRooms(filters);
		
		res.status(StatusCode.Ok).json(rooms);
	} catch (err) {
		next(err)
	}
});

/**
 * @swagger
 * /api/Rooms/update:
 *   post:
 *     summary: Update room state or occupation
 *     tags: [Rooms]
 *     security:
 *       - bearerAuth: []  # Assuming you are using JWT Bearer token for authentication
 *     requestBody:
 *       description: Data to update room state or occupation
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               room:
 *                 type: integer
 *                 description: The room number to update
 *               state:
 *                 type: string
 *                 enum:
 *                   - Clean
 *                   - Inspected
 *                   - Dirty
 *                   - OutOfOrder
 *                 description: The new state of the room
 *               occupied:
 *                 type: boolean
 *                 description: Whether the room is occupied or not
 *               reservationId:
 *                 type: number
 *                 description: The reservation ID if the room is being occupied
 *     responses:
 *       200:
 *         description: Room updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message
 *                   example: Room updated successfully
 *                 room:
 *                   $ref: '#/components/schemas/Room'
 *       400:
 *         description: Invalid request, missing required parameters or invalid state
 *       403:
 *         description: Unauthorized, user does not have permission
 *       404:
 *         description: Room not found
 *       500:
 *         description: Server error
 */
router.post("/update", verifyUser, async (req: Request, res: Response, next: NextFunction) => {
	const { isAdmin, isFrontDesk } = req as AuthedRequest;
	if (!isAdmin && !isFrontDesk) {
		return next(new UnauthorizedUserError());
	}
	
	const { room } = req.body;
	const { state, occupied, reservationId } = req.body;
	
	if (!room) {
		return next(new InvalidRoomNumberError());
	}
	
	try {
		// Update the room's state.
		if (state) {
			await RoomModel.changeRoomState(Number(room), state as RoomState);
		}
		
		// Update the room's occupation.
		if (typeof occupied !== "undefined" && reservationId) {
			await RoomModel.setRoomOccupation(Number(room), occupied, reservationId);
		}
		
		const updatedRoom = await RoomModel.getRoomById(Number(room));
		
		res.json({
			message: "Room updated successfully",
			room: updatedRoom,
		})
	} catch (err: any) {
		next(err);
	}
});

/**
 * @swagger
 * /api/Rooms/types:
 *   get:
 *     summary: Retrieve all room types
 *     description: Fetches a list of all room types available in the system.
 *     tags: [Rooms]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved the list of room types.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/RoomType'
 *       401:
 *         description: Unauthorized access.
 *       500:
 *         description: Internal server error.
 */
router.get("/types", verifyUser, async (req, res, next) => {
	try {
		const roomTypes = await RoomModel.getAllRoomTypes();
		
		res.status(StatusCode.Ok).json(roomTypes);
	} catch (error) {
		next(error);
	}
});

export const RoomsRouter = router;
