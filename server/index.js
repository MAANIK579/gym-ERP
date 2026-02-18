import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import bookingRoutes from './routes/bookings.js';
import memberRoutes from './routes/members.js'; 
import classRoutes from './routes/classes.js'; // 1. IMPORT the new routes
import planRoutes from './routes/plans.js';
import invoiceRoutes from './routes/invoices.js';
import reportRoutes from './routes/reports.js';
import authRoutes from './routes/auth.js';
import equipmentRoutes from './routes/equipment.js';
import memberAuthRoutes from './routes/memberAuth.js';
import myProfileRoutes from './routes/myProfile.js';
import scheduleRoutes from './routes/schedule.js';


const app = express();
const PORT = process.env.PORT || 5000;
// ... (keep prisma, PORT, middleware setup)
app.use(cors());
app.use(express.json());


// --- API ROUTES ---
app.use('/api/members', memberRoutes);
app.use('/api/classes', classRoutes);
app.use('/api/bookings', bookingRoutes); // 2. USE the new routes
app.use('/api/plans', planRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/reports', reportRoutes); // 3. USE the report routes
app.use('/api/auth', authRoutes); 
app.use('/api/equipment', equipmentRoutes);
app.use('/api/member-auth', memberAuthRoutes);
app.use('/api/my-profile', myProfileRoutes);
app.use('/api/schedule', scheduleRoutes);

// Health check route
app.get('/api/health', (req, res) => {
    res.json({ status: 'Server is running!' });
});


app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});