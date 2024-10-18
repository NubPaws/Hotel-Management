import { Router } from "express";
import CounterModel from "../models/Counter.js";
import { dataValidate, verifyUser } from "./Validator.js";
import { StatusCode } from "../utils/StatusCode.js";

const router = Router();

/**
 * @swagger
 * /api/Counters/increment:
 *   post:
 *     summary: Increment a counter by a given value
 *     tags: [Counters]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the counter to increment
 *               value:
 *                 type: number
 *                 description: The amount to increment the counter by. Default is 1.
 *                 example: 1
 *     responses:
 *       200:
 *         description: Counter incremented successfully
 *       400:
 *         description: Invalid request
 */
router.post("/increment", verifyUser, async (req, res, next) => {
	const { name, value = 1 } = req.body;
	
	const validation = dataValidate({ name });
	if (validation.status) {
		return validation.respond(res);
	}
	
	try {
		const newValue = await CounterModel.increment(name, value);
		res.status(StatusCode.Ok).json({ newValue });
	} catch (err) {
		next(err);
	}
});

/**
 * @swagger
 * /api/Counters/decrement:
 *   post:
 *     summary: Decrement a counter by a given value
 *     tags: [Counters]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the counter to decrement
 *               value:
 *                 type: number
 *                 description: The amount to decrement the counter by. Default is 1.
 *                 example: 1
 *     responses:
 *       200:
 *         description: Counter decremented successfully
 *       400:
 *         description: Invalid request
 */
router.post("/decrement", verifyUser, async (req, res, next) => {
	const { name, value = 1 } = req.body;
	
	const validation = dataValidate({ name });
	if (validation.status) {
		return validation.respond(res);
	}
	
	try {
		const newValue = await CounterModel.decrement(name, value);
		res.status(StatusCode.Ok).json({ newValue });
	} catch (err) {
		next(err);
	}
});

/**
 * @swagger
 * /api/Counters/{name}:
 *   get:
 *     summary: Get the current value of a counter
 *     tags: [Counters]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *           description: The name of the counter to retrieve
 *     responses:
 *       200:
 *         description: Counter value retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 value:
 *                   type: number
 *                   description: The current value of the counter
 *       404:
 *         description: Counter not found
 */
router.get("/:name", verifyUser, async (req, res, next) => {
	const { name } = req.params;
	
	try {
		const value = await CounterModel.get(name);
		if (value === -1) {
			return res.status(StatusCode.NotFound).json({ message: "Counter not found" });
		}
		res.status(StatusCode.Ok).json({ value });
	} catch (err) {
		next(err);
	}
});

/**
 * @swagger
 * /api/Counters/set:
 *   post:
 *     summary: Set the value of a counter
 *     tags: [Counters]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the counter to set
 *               value:
 *                 type: number
 *                 description: The value to set for the counter
 *                 example: 10
 *     responses:
 *       200:
 *         description: Counter value set successfully
 *       400:
 *         description: Invalid request
 */
router.post("/set", verifyUser, async (req, res, next) => {
	const { name, value } = req.body;
	
	const validation = dataValidate({ name, value });
	if (validation.status) {
		return validation.respond(res);
	}
	
	try {
		await CounterModel.set(name, value);
		res.status(StatusCode.Ok).send("Counter value set successfully");
	} catch (err) {
		next(err);
	}
});

export const CountersRouter = router;
