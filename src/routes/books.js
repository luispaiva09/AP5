import express from 'express';
import db from '../db/db.js'; // Importa o banco de dados lowDB

const router = express.Router();

// GET /books - Retrieve all books
router.get('/', async (req, res) => {
    await db.read();
    res.json(db.data.books);
});

// GET /books/:id - Retrieve a book by ID
router.get('/:id', async (req, res) => {
    await db.read();
    const book = db.data.books.find(s => s.id === parseInt(req.params.id));
    if (book) {
        res.json(book);
    } else {
        res.status(404).json({ message: 'book not found' });
    }
});

// POST /books - Add a new book
router.post('/', async (req, res) => {
    const newbook = { id: Date.now(), ...req.body };
    await db.read();
    db.data.books.push(newbook);
    await db.write();
    res.status(201).json(newbook);
});

// PUT /books/:id - Update a book by ID
router.put('/:id', async (req, res) => {
    await db.read();
    const book = db.data.books.find(s => s.id === parseInt(req.params.id));
    if (book) {
        Object.assign(book, req.body); // Update fields
        await db.write();
        res.json(book);
    } else {
        res.status(404).json({ message: 'book not found' });
    }
});

// DELETE /books/:id - Remove a book by ID
router.delete('/:id', async (req, res) => {
    await db.read();
    const index = db.data.books.findIndex(s => s.id === parseInt(req.params.id));
    if (index !== -1) {
        const deletedbook = db.data.books.splice(index, 1);
        await db.write();
        res.json(deletedbook);
    } else {
        res.status(404).json({ message: 'book not found' });
    }
});

export default router;
