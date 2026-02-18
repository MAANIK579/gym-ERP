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
    const { title, trainerName, startTime, endTime, capacity, memberId } = req.body;

    if (!title || !startTime || !endTime || !capacity) {
        return res.status(400).json({ error: 'All fields are required.' });
    }

    try {
        console.log('Received payload for class creation:', req.body);
        const newClass = await prisma.class.create({
            data: {
                title,
                trainerName,
                startTime: new Date(startTime),
                endTime: new Date(endTime),
                capacity: parseInt(capacity),
            },
        });

        // If a valid memberId is provided, create a MemberSchedule for that member
        const memberIdInt = parseInt(memberId);
        console.log('Parsed memberId:', memberIdInt);
        if (!isNaN(memberIdInt) && memberIdInt > 0) {
            const scheduleData = {
                title: title,
                description: `Trainer: ${trainerName || 'TBA'} | Class`,
                date: new Date(startTime),
                startTime: new Date(startTime).toISOString().slice(11, 16),
                endTime: new Date(endTime).toISOString().slice(11, 16),
                type: 'Class',
                memberId: memberIdInt,
            };
            console.log('Creating MemberSchedule with:', scheduleData);
            await prisma.memberSchedule.create({ data: scheduleData });
        }

        res.status(201).json(newClass);
    } catch (error) {
        console.error(error);
        res.status(400).json({ error: "Could not create class." });
    }
});

export default router;