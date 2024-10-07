import { Document } from "mongoose";
import { Department } from "./User.js";

export type Urgency = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

interface Task extends Document {
	name: string,
	description: string,
	urgency: Urgency,
	department: Department
}


