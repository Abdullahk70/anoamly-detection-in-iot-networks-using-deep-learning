import express from "express"
import { getName } from "../controllers/Controllers.js";

const router=express.Router();

router.get("/name",getName);

export default router;