import express from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const router = express.Router();

// --- GET ALL CLASSES ---
router.get('/', async (req, res) => {
    try {
        const classes = await prisma.class.findMany({
            orderBy: {
                startTime: 'asc', // Show classes in chronological order
            },
        });
        res.json(classes);
    } catch (error) {
        res.status(500).json({ error: "Could not fetch classes" });
    }
});

// --- CREATE A NEW CLASS ---
router.post('/', async (req, res) => {
    const { title, trainerName, startTime, endTime, capacity } = req.body;

    if (!title || !startTime || !endTime || !capacity) {
        return res.status(400).json({ error: 'All fields are required.' });
    }

    try {
        const newClass = await prisma.class.create({
            data: {
                title,
                trainerName,
                startTime: new Date(startTime), // Ensure string is converted to DateTime
                endTime: new Date(endTime),
                capacity: parseInt(capacity),
            },
        });
        res.status(201).json(newClass);
    } catch (error) {
        console.error(error);
        res.status(400).json({ error: "Could not create class." });
    }
});

export default router;