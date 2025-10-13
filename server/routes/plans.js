import express from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const router = express.Router();

// --- GET ALL MEMBERSHIP PLANS ---
router.get('/', async (req, res) => {
    try {
        const plans = await prisma.membershipPlan.findMany({
            orderBy: { price: 'asc' }
        });
        res.json(plans);
    } catch (error) {
        res.status(500).json({ error: "Could not fetch plans." });
    }
});

// --- CREATE A NEW MEMBERSHIP PLAN ---
router.post('/', async (req, res) => {
    const { name, price, durationDays } = req.body;

    if (!name || !price || !durationDays) {
        return res.status(400).json({ error: 'Name, price, and duration are required.' });
    }

    try {
        const newPlan = await prisma.membershipPlan.create({
            data: {
                name,
                price: parseFloat(price),
                durationDays: parseInt(durationDays),
            },
        });
        res.status(201).json(newPlan);
    } catch (error) {
        console.error(error);
        res.status(400).json({ error: "Could not create plan." });
    }
});

export default router;