import express from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const invoices = await prisma.invoice.findMany({
            include: {
                member: { // Include the member details in the response
                    select: {
                        fullName: true,
                    },
                },
            },
            orderBy: {
                dueDate: 'desc',
            },
        });
        res.json(invoices);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch invoices.' });
    }
});

// --- MARK AN INVOICE AS PAID ---
router.put('/:id/pay', async (req, res) => {
    const { id } = req.params;
    try {
        const updatedInvoice = await prisma.invoice.update({
            where: { id: parseInt(id) },
            data: { status: 'Paid' },
        });
        res.json(updatedInvoice);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to update invoice status.' });
    }
});

// --- ASSIGN PLAN & CREATE INVOICE ---
router.post('/assign', async (req, res) => {
    const { memberId, planId } = req.body;

    if (!memberId || !planId) {
        return res.status(400).json({ error: 'Member ID and Plan ID are required.' });
    }

    try {
        // 1. Find the selected plan to get its price and duration
        const plan = await prisma.membershipPlan.findUnique({
            where: { id: parseInt(planId) },
        });
        if (!plan) {
            return res.status(404).json({ error: 'Plan not found.' });
        }

        // 2. Update the member to link them to this plan
        const updatedMember = await prisma.member.update({
            where: { id: parseInt(memberId) },
            data: {
                membershipPlanId: parseInt(planId),
            },
        });

        // 3. Create an invoice for this assignment
        const newInvoice = await prisma.invoice.create({
            data: {
                memberId: parseInt(memberId),
                amount: plan.price,
                status: 'Pending', // Invoice is pending until paid
                dueDate: new Date(), // Due immediately
            },
        });

        res.status(201).json({ updatedMember, newInvoice });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to assign plan and create invoice.' });
    }
});

export default router;