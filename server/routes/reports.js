import express from 'express';
import { PrismaClient } from '@prisma/client';
import moment from 'moment'; // We need this to calculate date ranges

const prisma = new PrismaClient();
const router = express.Router();

// --- GET DASHBOARD STATS ---
router.get('/dashboard', async (req, res) => {
    try {
        const startOfMonth = moment().startOf('month').toDate();
        const endOfMonth = moment().endOf('month').toDate();

        // 1. Get total active members
        const totalActiveMembers = await prisma.member.count({
            where: { status: 'Active' },
        });

        // 2. Calculate revenue for the current month
        const monthlyRevenueResult = await prisma.invoice.aggregate({
            _sum: {
                amount: true,
            },
            where: {
                status: 'Paid',
                dueDate: {
                    gte: startOfMonth,
                    lte: endOfMonth,
                },
            },
        });
        const monthlyRevenue = monthlyRevenueResult._sum.amount || 0;

        // 3. Count new members this month
        const newMembersThisMonth = await prisma.member.count({
            where: {
                joinDate: {
                    gte: startOfMonth,
                    lte: endOfMonth,
                },
            },
        });
        
        // 4. Count pending invoices
        const pendingInvoices = await prisma.invoice.count({
            where: { status: 'Pending' },
        });

        // Combine all stats into a single object
        const stats = {
            totalActiveMembers,
            monthlyRevenue,
            newMembersThisMonth,
            pendingInvoices,
        };

        res.json(stats);
    } catch (error) {
        console.error("Failed to fetch dashboard stats:", error);
        res.status(500).json({ error: "Could not fetch dashboard stats." });
    }
});

export default router;