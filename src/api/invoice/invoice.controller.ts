import { Request, Response } from "express";
import { Invoice } from "../../infrastructure/entities/Invoice";
import {getAuth} from "@clerk/express";
import {User} from "../../infrastructure/entities/User";

// 🔹 Get logged-in user's invoices
export const getMyInvoices = async (req: Request, res: Response) => {
    const { userId: clerkUserId } = getAuth(req);

    if (!clerkUserId) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    // 🔹 1. Find internal user
    const user = await User.findOne({ clerkUserId });

    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    console.log("Fetching invoices for user:", user._id);
    // 🔹 2. Use MongoDB ObjectId
    const invoices = await Invoice.find({ userId: user._id })
        .sort({ billingPeriodEnd: -1 });

    res.json(invoices);
};


//  Get single invoice by ID
export const getInvoiceById = async (req: Request, res: Response) => {
    const { userId: clerkUserId } = getAuth(req);
    const { id } = req.params;

    if (!clerkUserId) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await User.findOne({ clerkUserId });

    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }
    console.log("Fetching invoice:", id, "for user:", user._id);

    const invoice = await Invoice.findOne({
        _id: id,
        userId: user._id
    });

    if (!invoice) {
        return res.status(404).json({ message: "Invoice not found" });
    }

    res.json(invoice);
};
