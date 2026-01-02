import {NextFunction, Request, Response} from "express";
import { Invoice } from "../../infrastructure/entities/Invoice";
import {getAuth} from "@clerk/express";
import {User} from "../../infrastructure/entities/User";

// 🔹 Get logged-in user's invoices
export const getMyInvoices = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { userId: clerkUserId } = getAuth(req);
        if (!clerkUserId) return res.status(401).json({ message: "Unauthorized" });

        const user = await User.findOne({ clerkUserId });
        if (!user) return res.status(404).json({ message: "User not found" });

        const { status } = req.query;

        const query: any = { userId: user._id };
        if (status) query.paymentStatus = status;

        const invoices = await Invoice.find(query)
            .sort({ billingPeriodEnd: -1 })
            .populate("solarUnitId");

        res.json(invoices);
    } catch (err) {
        next(err);
    }
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
