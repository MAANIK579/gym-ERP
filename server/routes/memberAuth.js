import express from 'express';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const router = express.Router();

// --- MEMBER LOGIN ---
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const member = await prisma.member.findUnique({ where: { email } });

    if (!member || !member.password) {
        return res.status(400).json({ msg: 'Invalid credentials or password not set.' });
    }

    const isMatch = await bcrypt.compare(password, member.password);
    if (!isMatch) {
        return res.status(400).json({ msg: 'Invalid credentials.' });
    }

    res.json({ msg: 'Login successful!', member: { id: member.id, email: member.email, fullName: member.fullName } });
});

// --- (Admin Action) SET/UPDATE MEMBER PASSWORD ---
router.post('/set-password', async (req, res) => {
    const { memberId, password } = req.body;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    try {
        await prisma.member.update({
            where: { id: parseInt(memberId) },
            data: { password: hashedPassword },
        });
        res.json({ msg: 'Member password updated successfully.' });
    } catch (error) {
        res.status(500).json({ msg: 'Failed to update password.' });
    }
});

export default router;