import { Request, Response } from "express";
import { Invoice } from "../../infrastructure/entities/Invoice";
import { getAuth } from "@clerk/express";

// 🔹 Get logged-in user's invoices
export const getMyInvoices = async (req: Request, res: Response) => {
    const { userId } = getAuth(req);

    if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    const invoices = await Invoice.find({ userId })
        .sort({ billingPeriodEnd: -1 });

    res.json(invoices);
};

// 🔹 Get single invoice by ID
export const getInvoiceById = async (req: Request, res: Response) => {
    const { userId } = getAuth(req);
    const { id } = req.params;

    if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    const invoice = await Invoice.findOne({ _id: id, userId });

    if (!invoice) {
        return res.status(404).json({ message: "Invoice not found" });
    }

    res.json(invoice);
};
