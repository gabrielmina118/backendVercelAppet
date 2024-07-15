import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { getNextHour } from "../utils/getNextHour";

// Incializar o prisma. O prisma otimiza a busca de dados no MongoDB
const prisma = new PrismaClient();

// Busca todos os devices
export const getDevices = async (req: Request, res: Response) => {
    const devices = await prisma.device.findMany();
    res.json(devices);
};

// Busca o próximo horario
export const getHour = async (req: Request, res: Response) => {
    const { macAddress } = req.params;

    const device = await prisma.device.findFirst({
        where: { macAddress },
    });

    if (!device) {
        return res.status(404).json({ error: "Device not found" });
    }

    // Chamar a funcao que busca o próximo horario
    const horario = getNextHour(device.hourFeed);
    res.json({ horario, doorTime: device.doorTime });
};

// Busca o dispositivo cadastrado pelo email
export const getDevice = async (req: Request, res: Response) => {
    const { email } = req.params;

    const device = await prisma.device.findMany({ where: { email } });
    if (device) {
        res.json(device);
    } else {
        res.status(404).json({ error: "Device not found" });
    }
};

// Busco o dispositivo pelo ID/MacAddress
export const getDeviceById = async (req: Request, res: Response) => {
    const { mac } = req.params;
    const device = await prisma.device.findFirst({
        where: { macAddress: mac },
    });
    if (device) {
        res.json(device);
    } else {
        res.status(404).json({ error: "Device not found" });
    }
};

// Criar o dispositivo
export const createDevice = async (req: Request, res: Response) => {
    const { name, description, email, image, hourFeed, doorTime, macAddress } =
        req.body;

    const newDevice = await prisma.device.create({
        data: {
            name,
            macAddress,
            description,
            email,
            image,
            hourFeed,
            doorTime,
            amountFood: "VAZIO",
        },
    });

    res.status(201).json(newDevice);
};

// Atualiza as informaçõs do dispositivo
export const updateDevice = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, description, image, hourFeed, doorTime } = req.body;

    const updatedDevice = await prisma.device.update({
        where: { id },
        data: {
            name,
            description,
            image,
            hourFeed,
            doorTime,
        },
    });

    res.json(updatedDevice);
};

// Atualização do reservatório - (Quem faz essa requisição é somente o Arduino)
export const updateReservoir = async (req: Request, res: Response) => {
    const { macAddress } = req.params;
    const { amountFood } = req.body;

    try {
        const updatedDevice = await prisma.device.updateMany({
            where: { macAddress: macAddress },
            data: {
                amountFood,
            },
        });

        res.json(updatedDevice);
    } catch (error) {
        console.error("Error updating device:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// Deletar o dispositivo
export const deleteDevice = async (req: Request, res: Response) => {
    const { id } = req.params;

    await prisma.device.delete({ where: { id } });

    res.status(204).end();
};
