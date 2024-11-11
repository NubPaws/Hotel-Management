import { Router } from "express";
import { AuthedRequest, dataValidate, verifyUser } from "./Validator.js";
import { UnauthorizedUserError } from "../models/User.js";
import ExtraModel from "../models/Extra.js";
import { StatusCode } from "../utils/StatusCode.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Extras
 *   description: Endpoints for managing extras on reservations.
 */

/**
 * @swagger
 * /api/Extras/update:
 *   post:
 *     summary: Update the name, description, or price of an extra
 *     tags: [Extras]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               extraId:
 *                 type: integer
 *                 description: ID of the extra to update
 *               name:
 *                 type: string
 *                 description: Updated name of the extra
 *                 example: "Breakfast"
 *               description:
 *                 type: string
 *                 description: Updated description of the extra
 *                 example: "Continental breakfast."
 *               price:
 *                 type: number
 *                 description: Updated price of the extra
 *                 example: 15.50
 *     responses:
 *       200:
 *         description: Extra updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Extra'
 *       400:
 *         description: Invalid input or missing required fields
 *       403:
 *         description: Unauthorized, requires admin or food and beverage department
 */
router.post("/update", verifyUser, async (req, res, next) => {
	const { isAdmin, isFrontDesk, isFoodBeverage } = req as AuthedRequest;
	if (!isAdmin && !isFrontDesk && !isFoodBeverage) {
		return next(new UnauthorizedUserError());
	}
	
	const { extraId, name, description, price } = req.body;
	
	const validation = dataValidate({ extraId });
	if (validation.status) {
		return validation.respond(res);
	}
	
	try {
		// Check if the extra exists.
		await ExtraModel.getById(extraId);
		
		const updatePromises = [];
		
		if (name) {
			updatePromises.push(ExtraModel.setName(extraId, name));
		}
		if (description) {
			updatePromises.push(ExtraModel.setDescription(extraId, description));
		}
		if (price) {
			updatePromises.push(ExtraModel.setPrice(extraId, price));
		}
		
		await Promise.all(updatePromises);
		const extra = await ExtraModel.getById(extraId);
		
		return res.status(StatusCode.Ok).json(extra);
	} catch (error) {
		next(error);
	}
});



export const ExtrasRouter = router;
