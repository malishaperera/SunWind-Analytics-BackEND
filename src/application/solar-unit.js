// const solarUnits = [
//     {
//         _id: "1",
//         userId: "1",
//         houseId: "1",
//         capacity: 1000,
//         serialNumber: "123456",
//         status: "ACTIVE",
//     },
//     {
//         _id: "2",
//         userId: "2",
//         houseId: "2",
//         capacity: 1500,
//         serialNumber: "123457",
//         status: "ACTIVE",
//     },
//     {
//         _id: "3",
//         userId: "3",
//         houseId: "3",
//         capacity: 1200,
//         serialNumber: "123458",
//         status: "INACTIVE",
//     },
//     {
//         _id: "4",
//         userId: "4",
//         houseId: "4",
//         capacity: 1800,
//         serialNumber: "123459",
//         status: "ACTIVE",
//     },
//     {
//         _id: "5",
//         userId: "5",
//         houseId: "5",
//         capacity: 2000,
//         serialNumber: "123460",
//         status: "MAINTENANCE",
//     },
//     {
//         _id: "6",
//         userId: "6",
//         houseId: "6",
//         capacity: 900,
//         serialNumber: "123461",
//         status: "ACTIVE",
//     },
//     {
//         _id: "7",
//         userId: "7",
//         houseId: "7",
//         capacity: 2500,
//         serialNumber: "123462",
//         status: "INACTIVE",
//     },
//     {
//         _id: "8",
//         userId: "8",
//         houseId: "8",
//         capacity: 1600,
//         serialNumber: "123463",
//         status: "ACTIVE",
//     },
//     {
//         _id: "9",
//         userId: "9",
//         houseId: "9",
//         capacity: 3000,
//         serialNumber: "123464",
//         status: "MAINTENANCE",
//     },
//     {
//         _id: "10",
//         userId: "10",
//         houseId: "10",
//         capacity: 1100,
//         serialNumber: "123465",
//         status: "ACTIVE",
//     },
// ];

import {solarUnits} from "../infrastructure/data.js";
import { v4 as uuidv4 } from 'uuid';

export const getAllSolarUnits = async (req,res) => {

    try {

    } catch (error) {

    }
    res.status(200).json(solarUnits);
}

export const createSolarUnit = async (req,res) => {
    const {userId,serialNumber,installationDate,capacity,status} = req.body;

    const newSolarUnit = {
        _id: uuidv4(),
        userId,
        serialNumber,
        installationDate,
        capacity,
        status,
    };
    solarUnits.push(newSolarUnit);
    res.status(201).json(newSolarUnit);
}

export const getSolarUnitById = async (req,res) => {
    const {id} = req.params;
    const solarUnit = solarUnits.find((solarUnit) => solarUnit._id === id);

    if (!solarUnit) {
        res.status(404).json({message: "Solar unit not found"})
    }
    res.status(200).json(solarUnit);
}

export const updateSolarUnit = async (req,res) => {
    const {id} = req.params;
    const {userId,serialNumber,installationDate,capacity,status} = req.body;
    const solarUnit = solarUnits.find((solarUnit) => solarUnit._id === id);

    if (!solarUnit) {
        res.status(404).json({message: "Solar unit not found"})
    }
    solarUnit.userId = userId;
    solarUnit.serialNumber = serialNumber;
    solarUnit.installationDate = installationDate;
    solarUnit.capacity = capacity;
    solarUnit.status = status;
    res.status(200).json(solarUnit);
}

export const deleteSolarUnit = async (req,res) => {
    const { id } = req.params;
    const index = solarUnits.findIndex((solarUnit) => solarUnit._id === id);
    if (index == -1) {
        res.status(404).json({message: "Solar unit not found"})
    }
    solarUnits.splice(index,1);
    res.status(200).json({message: "Solar unit deleted successfully"});
}