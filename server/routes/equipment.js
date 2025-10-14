import express from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const router = express.Router();

// --- GET ALL EQUIPMENT ---
router.get('/', async (req, res) => {
    const equipment = await prisma.equipment.findMany({
        orderBy: { name: 'asc' },
        include: { maintenanceLogs: { orderBy: { performedOn: 'desc' } } } // Also get logs
    });
    res.json(equipment);
});

// --- ADD NEW EQUIPMENT ---
router.post('/', async (req, res) => {
    const { name, purchaseDate } = req.body;
    const newEquipment = await prisma.equipment.create({
        data: { name, purchaseDate: purchaseDate ? new Date(purchaseDate) : null },
    });
    res.status(201).json(newEquipment);
});

// --- LOG A MAINTENANCE ACTIVITY ---
router.post('/:id/logs', async (req, res) => {
    const { id } = req.params;
    const { notes } = req.body;

    const newLog = await prisma.maintenanceLog.create({
        data: {
            notes,
            equipmentId: parseInt(id),
        },
    });

    // Also update the equipment's status and last maintenance date
    const updatedEquipment = await prisma.equipment.update({
        where: { id: parseInt(id) },
        data: {
            status: 'Operational', // Assume maintenance makes it operational
            lastMaintenance: new Date(),
        },
        include: { maintenanceLogs: { orderBy: { performedOn: 'desc' } } }
    });

    res.status(201).json(updatedEquipment);
});

export default router;