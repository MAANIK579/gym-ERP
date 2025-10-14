import express from 'express';
import { PrismaClient } from '@prisma/client';
import moment from 'moment';

const prisma = new PrismaClient();
const router = express.Router();

router.get('/:memberId', async (req, res) => {
    const { memberId } = req.params;
    
    try {
        // Fetch member details with relations
        const memberDetails = await prisma.member.findUnique({
            where: { id: parseInt(memberId) },
            include: {
                plan: true,
                bookings: {
                    where: { 
                        class: { 
                            startTime: { gte: new Date() } 
                        } 
                    },
                    include: { class: true },
                    orderBy: { class: { startTime: 'asc' } },
                },
            },
        });

        if (!memberDetails) {
            return res.status(404).json({ error: 'Member not found.' });
        }

        // Fetch invoices
        const invoices = await prisma.invoice.findMany({
            where: { memberId: parseInt(memberId) },
            orderBy: { dueDate: 'desc' },
        });

        // Calculate pending invoices count
        const pendingInvoicesCount = invoices.filter(inv => inv.status === 'Pending').length;
        
        // Calculate total amount paid
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

        // Return data with safe structure
        res.json({
            memberDetails: {
                ...memberDetails,
                workoutPlans: [], // Add these if you have workout/diet plan models
                dietPlans: [],    // Otherwise keep as empty arrays
            },
            invoices,
            kpis: {
                pendingInvoicesCount,
                totalAmountPaid,
                planExpiryDate,
                daysRemaining: daysRemaining !== null ? daysRemaining : 0,
            }
        });

    } catch (error) {
        console.error("Error fetching profile data:", error);
        res.status(500).json({ 
            error: 'Could not fetch member profile.',
            details: error.message 
        });
    }
});

export default router;