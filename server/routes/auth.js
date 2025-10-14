import express from 'express';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const router = express.Router();

// --- REGISTER A NEW USER (STAFF) ---
router.post('/register', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ msg: 'Please enter all fields' });
    }

    // Hash the password before saving
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    try {
        const newUser = await prisma.user.create({
            data: { email, password: hashedPassword },
        });
        res.status(201).json({ id: newUser.id, email: newUser.email });
    } catch (e) {
        res.status(400).json({ msg: 'User already exists' });
    }
});

// --- LOGIN A USER ---
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ msg: 'Please enter all fields' });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
        return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Compare the submitted password with the hashed password in the DB
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(400).json({ msg: 'Invalid credentials' });
    }

    res.json({ msg: 'Login successful!', user: { id: user.id, email: user.email } });
});

export default router;