import {SolarUnit} from "../infrastructure/entities/SolarUnit";
import {NextFunction, Request, Response} from "express";
import {createSolarUnitDTO, UpdateSolarUnitDto} from "../domain/dto/solar-unit";
import { z } from "zod";
import {NotFoundError, ValidationError} from "../domain/errors/errors";
import {User} from "../infrastructure/entities/User";
import {getAuth} from "@clerk/express";

export const getAllSolarUnits = async (req:Request,res:Response,next:NextFunction) => {
    try {
        const solarUnits = await SolarUnit.find();

        res.status(200).json(solarUnits);
    } catch (error) {
        next(error);
    }
}
export const createSolarUnitValidator = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const result = createSolarUnitDTO.safeParse(req.body);
    if (!result.success) {
        throw new ValidationError(result.error.message);
    }
    next();
};
export const createSolarUnit = async (req:Request,res:Response,next:NextFunction) => {
    try {
        const data: z.infer<typeof createSolarUnitDTO> = req.body;

        const newSolarUnit = {
            serialNumber: data.serialNumber,
            installationDate: new Date(data.installationDate),
            capacity: data.capacity,
            status: data.status,
        };

        const createdSolarUnit = await SolarUnit.create(newSolarUnit);
        res.status(201).json(createdSolarUnit);

    }catch (error) {
        next(error);
    }
}
export const getSolarUnitById = async (req:Request,res:Response,next:NextFunction) => {

    try {
        const {id} = req.params;
        const solarUnit = await SolarUnit.findById(id);
        if (!solarUnit) {
            throw new NotFoundError("Solar unit not found")
        }

        res.status(200).json(solarUnit);
    }catch (error) {
        next(error);
    }
}

export const getSolarUnitForUser = async (
    req:Request,
    res:Response,
    next:NextFunction
) => {
    try {
        const auth = getAuth(req);
        const clerkUserId = auth.userId;
        const user =await User.findOne({clerkUserId});
        if (!user) {
            throw new NotFoundError("User not found")
        }
        const solarUnits = await SolarUnit.find({ userId: user._id });
        console.log(solarUnits);
        res.status(200).json(solarUnits[0]);
    }catch (error) {
        next(error);
    }
}
export const updateSolarUnitValidator = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const result = UpdateSolarUnitDto.safeParse(req.body);
    if (!result.success) {
        throw new ValidationError(result.error.message);
    }
    next();
};
export const updateSolarUnit = async (req:Request,res:Response,next:NextFunction) => {

    try {
        const {id} = req.params;
        const {userId,serialNumber,installationDate,capacity,status} = req.body;
        const solarUnit = await SolarUnit.findById(id);
        if (!solarUnit) {
            throw new NotFoundError("Solar unit not found")
        }
        const updatedSolarUnit = await SolarUnit.findByIdAndUpdate(id,{
            userId,
            serialNumber,
            installationDate,
            capacity,
            status,
        });
        res.status(200).json(updatedSolarUnit);

    }catch (error) {
        next(error);
    }
}

export const deleteSolarUnit = async (req:Request,res:Response,next:NextFunction) => {
    try {
        const { id } = req.params;
        const solarUnit = await SolarUnit.findById(id);

        if (!solarUnit) {
            throw new NotFoundError("Solar unit not found")
        }
        await SolarUnit.findByIdAndDelete(id);
        res.status(204).send();
    } catch (error) {
        next(error);
    }
}