const express = require('express');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const router = express.Router();

// GET all members
router.get('/', async (req, res) => {
    const members = await prisma.member.findMany();
    res.json(members);
});

// POST a new member
router.post('/', async (req, res) => {
    const { fullName, email, phoneNumber } = req.body;
    try {
        const newMember = await prisma.member.create({
            data: {
                fullName,
                email,
                phoneNumber,
            },
        });
        res.status(201).json(newMember);
    } catch (error) {
        res.status(400).json({ error: "Email already exists or invalid data." });
    }
});

// --- UPDATE A MEMBER ---
// Handles PUT requests to /api/members/:id
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { fullName, email, phoneNumber, status } = req.body;

    try {
        const updatedMember = await prisma.member.update({
            where: { id: parseInt(id) }, // Find the member by their ID
            data: {
                fullName,
                email,
                phoneNumber,
                status,
            },
        });
        res.json(updatedMember);
    } catch (error) {
        console.error(error);
        res.status(400).json({ error: "Could not update member. Email may already be in use." });
    }
});

// --- DELETE A MEMBER ---
// Handles DELETE requests to /api/members/:id
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.member.delete({
            where: { id: parseInt(id) },
        });
        res.status(204).send(); // 204 means "No Content", a standard success response for delete
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Could not delete member" });
    }
});

module.exports = router;
