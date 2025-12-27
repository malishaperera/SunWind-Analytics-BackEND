import express from "express";
import { getMyInvoices, getInvoiceById } from "./invoice.controller";
import {authenticationMiddleware} from "../middlewares/authentication-middleware";

const router = express.Router();

router.get("/", authenticationMiddleware,getMyInvoices);
router.get("/:id",authenticationMiddleware, getInvoiceById);

export default router;
