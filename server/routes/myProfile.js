import express from 'express';
import { PrismaClient } from '@prisma/client';
import moment from 'moment';

const prisma = new PrismaClient();
const router = express.Router();

router.get('/:memberId', async (req, res) => {
    const { memberId } = req.params;
    try {
        const memberDetails = await prisma.member.findUnique({
            where: { id: parseInt(memberId) },
            include: {
                plan: true,
                bookings: {
                    where: { class: { startTime: { gte: new Date() } } },
                    include: { class: true },
                    orderBy: { class: { startTime: 'asc' } },
                },
                workoutPlans: { orderBy: { createdAt: 'desc' }, take: 1 }, // Get the latest workout plan
                dietPlans: { orderBy: { createdAt: 'desc' }, take: 1 },    // Get the latest diet plan
            },
        });

        if (!memberDetails) {
            return res.status(404).json({ error: 'Member not found.' });
        }

        const invoices = await prisma.invoice.findMany({
            where: { memberId: parseInt(memberId) },
            orderBy: { dueDate: 'desc' },
        });

        const pendingInvoicesCount = invoices.filter(inv => inv.status === 'Pending').length;
        
        const totalAmountPaidResult = await prisma.invoice.aggregate({
            _sum: { amount: true },
            where: { memberId: parseInt(memberId), status: 'Paid' },
        });
        const totalAmountPaid = totalAmountPaidResult._sum.amount || 0;

        // Calculate plan expiry date based on the most recent paid invoice
        let planExpiryDate = null;
        let daysRemaining = null;
        if (memberDetails.plan) {
            const lastPaidInvoice = await prisma.invoice.findFirst({
                where: { memberId: parseInt(memberId), status: 'Paid' },
                orderBy: { dueDate: 'desc' },
            });

            if (lastPaidInvoice) {
                const expiry = moment(lastPaidInvoice.dueDate).add(memberDetails.plan.durationDays, 'days');
                planExpiryDate = expiry.toDate();
                daysRemaining = expiry.diff(moment(), 'days');
            }
        }

        res.json({
            memberDetails,
            invoices,
            kpis: {
                pendingInvoicesCount,
                totalAmountPaid,
                planExpiryDate,
                daysRemaining,
            }
        });

    } catch (error) {
        console.error("Error fetching profile data:", error);
        res.status(500).json({ error: 'Could not fetch member profile.' });
    }
});

export default router;