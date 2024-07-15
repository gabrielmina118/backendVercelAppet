import { Router } from "express";
import {
    getDevices,
    getDevice,
    createDevice,
    updateDevice,
    deleteDevice,
    getDeviceById,
    getHour,
    updateReservoir,
} from "../controllers/deviceController";

const router = Router();

router.put("/amountFood/:macAddress", updateReservoir);
router.get("/", getDevices);
router.get("/proximo-horario/:id",getHour)
router.get("/:email", getDevice);
router.get("/getByMacAdress/:mac", getDeviceById);
router.post("/create", createDevice);
router.put("/:id", updateDevice);
router.delete("/:id", deleteDevice);

export default router;
