import express from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const router = express.Router();

// --- GET ALL MEMBER SCHEDULES FOR A SPECIFIC MEMBER ---
router.get('/member/:memberId', async (req, res) => {
    const { memberId } = req.params;
    
    try {
        const schedules = await prisma.memberSchedule.findMany({
            where: {
                memberId: parseInt(memberId)
            },
            orderBy: [
                {
                    date: 'asc'
                },
                {
                    startTime: 'asc'
                }
            ]
        });
        res.json(schedules);
    } catch (error) {
        console.error('Error fetching member schedules:', error);
        res.status(500).json({ error: "Could not fetch member schedules" });
    }
});

// --- GET UPCOMING MEMBER SCHEDULES (next 7 days) ---
router.get('/member/:memberId/upcoming', async (req, res) => {
    const { memberId } = req.params;
    const today = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7);
    
    try {
        const schedules = await prisma.memberSchedule.findMany({
            where: {
                memberId: parseInt(memberId),
                date: {
                    gte: today,
                    lte: nextWeek
                }
            },
            orderBy: [
                {
                    date: 'asc'
                },
                {
                    startTime: 'asc'
                }
            ]
        });
        res.json(schedules);
    } catch (error) {
        console.error('Error fetching upcoming schedules:', error);
        res.status(500).json({ error: "Could not fetch upcoming schedules" });
    }
});

// --- CREATE A NEW MEMBER SCHEDULE ---
router.post('/member/:memberId', async (req, res) => {
    const { memberId } = req.params;
    const { title, description, date, startTime, endTime, type, isRecurring, recurringDays } = req.body;

    if (!title || !date || !startTime || !endTime) {
        return res.status(400).json({ error: 'Title, date, start time, and end time are required.' });
    }

    try {
        const newSchedule = await prisma.memberSchedule.create({
            data: {
                title,
                description: description || null,
                date: new Date(date),
                startTime,
                endTime,
                type: type || 'Personal',
                isRecurring: isRecurring || false,
                recurringDays: recurringDays || null,
                memberId: parseInt(memberId)
            },
        });
        res.status(201).json(newSchedule);
    } catch (error) {
        console.error('Error creating member schedule:', error);
        res.status(400).json({ error: "Could not create member schedule." });
    }
});

// --- UPDATE A MEMBER SCHEDULE ---
router.put('/:scheduleId', async (req, res) => {
    const { scheduleId } = req.params;
    const { title, description, date, startTime, endTime, type, isRecurring, recurringDays } = req.body;

    try {
        const updatedSchedule = await prisma.memberSchedule.update({
            where: {
                id: parseInt(scheduleId)
            },
            data: {
                title,
                description,
                date: new Date(date),
                startTime,
                endTime,
                type,
                isRecurring,
                recurringDays
            },
        });
        res.json(updatedSchedule);
    } catch (error) {
        console.error('Error updating member schedule:', error);
        res.status(400).json({ error: "Could not update member schedule." });
    }
});

// --- DELETE A MEMBER SCHEDULE ---
router.delete('/:scheduleId', async (req, res) => {
    const { scheduleId } = req.params;

    try {
        await prisma.memberSchedule.delete({
            where: {
                id: parseInt(scheduleId)
            }
        });
        res.json({ message: "Member schedule deleted successfully" });
    } catch (error) {
        console.error('Error deleting member schedule:', error);
        res.status(400).json({ error: "Could not delete member schedule." });
    }
});

// --- GET SCHEDULES FOR A SPECIFIC DATE RANGE ---
router.get('/member/:memberId/range', async (req, res) => {
    const { memberId } = req.params;
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
        return res.status(400).json({ error: 'Start date and end date are required.' });
    }

    try {
        const schedules = await prisma.memberSchedule.findMany({
            where: {
                memberId: parseInt(memberId),
                date: {
                    gte: new Date(startDate),
                    lte: new Date(endDate)
                }
            },
            orderBy: [
                {
                    date: 'asc'
                },
                {
                    startTime: 'asc'
                }
            ]
        });
        res.json(schedules);
    } catch (error) {
        console.error('Error fetching schedules for date range:', error);
        res.status(500).json({ error: "Could not fetch schedules for the specified date range" });
    }
});

export default router;