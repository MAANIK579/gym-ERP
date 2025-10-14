import express from 'express';
import { PrismaClient } from '@prisma/client';
import moment from 'moment';

const prisma = new PrismaClient();
const router = express.Router();

// --- GET ENHANCED DASHBOARD STATS ---
router.get('/dashboard', async (req, res) => {
    try {
        // --- 1. Key Performance Indicators (KPIs) ---
        const totalActiveMembers = await prisma.member.count({ where: { status: 'Active' } });
        const monthlyRevenueResult = await prisma.invoice.aggregate({
            _sum: { amount: true },
            where: { status: 'Paid', dueDate: { gte: moment().startOf('month').toDate() } },
        });
        const monthlyRevenue = monthlyRevenueResult._sum.amount || 0;
        const newMembersThisMonth = await prisma.member.count({ where: { joinDate: { gte: moment().startOf('month').toDate() } } });
        const pendingInvoices = await prisma.invoice.count({ where: { status: 'Pending' } });

        // --- 2. Data for Charts (Last 6 Months) ---
        const sixMonthsAgo = moment().subtract(5, 'months').startOf('month');
        
        // Revenue per month
        const revenueData = await prisma.invoice.groupBy({
            by: ['dueDate'],
            _sum: { amount: true },
            where: { status: 'Paid', dueDate: { gte: sixMonthsAgo.toDate() } },
            orderBy: { dueDate: 'asc' },
        });
        
        // New members per month
        const memberData = await prisma.member.groupBy({
            by: ['joinDate'],
            _count: { id: true },
            where: { joinDate: { gte: sixMonthsAgo.toDate() } },
            orderBy: { joinDate: 'asc' },
        });
        
        // Helper function to format chart data
        const formatChartData = (data, valueField, countField) => {
            const result = {};
            for (let i = 0; i < 6; i++) {
                const month = moment(sixMonthsAgo).add(i, 'months').format('MMM');
                result[month] = 0;
            }
            data.forEach(item => {
                const month = moment(item.dueDate || item.joinDate).format('MMM');
                if (result.hasOwnProperty(month)) {
                    result[month] += item[valueField] ? item[valueField].amount : item[countField].id;
                }
            });
            return {
                labels: Object.keys(result),
                data: Object.values(result),
            };
        };

        res.json({
            kpis: { totalActiveMembers, monthlyRevenue, newMembersThisMonth, pendingInvoices },
            charts: {
                revenue: formatChartData(revenueData, '_sum', null),
                newMembers: formatChartData(memberData, null, '_count'),
            }
        });
    } catch (error) {
        console.error("Failed to fetch dashboard stats:", error);
        res.status(500).json({ error: "Could not fetch dashboard stats." });
    }
});

export default router;