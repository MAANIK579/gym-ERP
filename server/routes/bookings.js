import express from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const router = express.Router();

// --- CREATE A NEW BOOKING ---
router.post('/', async (req, res) => {
    const { classId, memberId } = req.body;

    if (!classId || !memberId) {
        return res.status(400).json({ error: 'Class ID and Member ID are required.' });
    }

    try {
        // Find the class to check its capacity
        const targetClass = await prisma.class.findUnique({
            where: { id: parseInt(classId) },
        });

        if (!targetClass) {
            return res.status(404).json({ error: "Class not found." });
        }

        // Count how many bookings already exist for this class
        const existingBookings = await prisma.booking.count({
            where: { classId: parseInt(classId) },
        });

        // The core business logic: check for available spots
        if (existingBookings >= targetClass.capacity) {
            return res.status(409).json({ error: "This class is already full." }); // 409 Conflict
        }

        // If there's space, create the new booking
        const newBooking = await prisma.booking.create({
            data: {
                classId: parseInt(classId),
                memberId: parseInt(memberId),
            },
        });

        res.status(201).json(newBooking);
    } catch (error) {
        // This will also catch the unique constraint error if a member tries to book twice
        if (error.code === 'P2002') {
             return res.status(409).json({ error: "Member is already booked for this class." });
        }
        console.error(error);
        res.status(500).json({ error: "Could not create booking." });
    }
});

export default router;