/**
 * @file appmongodb.js
 * @description This file contains a RESTful API for managing student records using MongoDB.
 * @version 1.0.0
 * @date 2024-11-20
 * @author pedromoreira
 * @organization ESTG-IPVC
 */

import express from 'express';
import { MongoClient, ObjectId } from 'mongodb';

const app = express();
app.use(express.json());
app.use(express.static('public')); // Serve static files from the 'public' directory

const url = "mongodb+srv://luispaiva:1p2a3i4v5a@cluster0.wzuaz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const dbName = 'studentsdb';
let db;

// Start the server
async function startServer() {
    try {
        const client = new MongoClient(url);
        await client.connect();
        db = client.db(dbName);
        console.log('Connected to MongoDB');

        // Middleware to use the connection in every route
        function setCollection(req, res, next) {
            req.collection = db.collection('students');
            next();
        }
        app.use(setCollection);

        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (err) {
        console.error('Failed to connect to MongoDB', err);
        process.exit(1);
    }
}

await startServer();

// CRUD Endpoints

// Get all students
app.get('/students', async (req, res) => {
    try {
        const students = await req.collection.find().toArray();
        res.json(students);
    } catch (err) {
        res.status(500).send({ error: 'Failed to fetch students', details: err.message });
    }
});

// Get a student by ID
app.get('/students/:id', async (req, res) => {
    try {
        const student = await req.collection.findOne({ _id: new ObjectId(req.params.id) });
        if (student) {
            res.json(student);
        } else {
            res.status(404).send({ error: 'Student not found' });
        }
    } catch (err) {
        res.status(500).send({ error: 'Failed to fetch student', details: err.message });
    }
});

// Create a new student
app.post('/students', async (req, res) => {
    try {
        const newStudent = req.body;

        if (!newStudent || Object.keys(newStudent).length === 0) {
            return res.status(400).send({ error: 'Invalid student data' });
        }

        const result = await req.collection.insertOne(newStudent);
        res.status(201).json({ _id: result.insertedId, ...newStudent }); // Include the generated ID
    } catch (err) {
        res.status(500).send({ error: 'Failed to create student', details: err.message });
    }
});

// Update a student by ID
app.put('/students/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const updates = req.body;

        if (!updates || Object.keys(updates).length === 0) {
            return res.status(400).send({ error: 'Invalid update data' });
        }

        const result = await req.collection.findOneAndUpdate(
            { _id: new ObjectId(id) },
            { $set: updates },
            { returnDocument: 'after' } // Returns the updated document
        );

        if (result.value) {
            res.json(result.value);
        } else {
            res.status(404).send({ error: 'Student not found' });
        }
    } catch (err) {
        res.status(500).send({ error: 'Failed to update student', details: err.message });
    }
});

// Delete a student by ID
app.delete('/students/:id', async (req, res) => {
    try {
        const id = req.params.id;

        const result = await req.collection.findOneAndDelete({ _id: new ObjectId(id) });

        if (result.value) {
            res.json(result.value); // Send back the deleted student
        } else {
            res.status(404).send({ error: 'Student not found' });
        }
    } catch (err) {
        res.status(500).send({ error: 'Failed to delete student', details: err.message });
    }
});
