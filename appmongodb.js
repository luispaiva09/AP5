/**
 * @file appmongodb.js
 * @description This file contains a starter implementation of a RESTful API for managing student records using MongoDB.
 * @version 1.0.0
 * @date 2024-11-20
 * @author pedromoreira
 * @organization ESTG-IPVC
 */

// mongodb native driver setup
import express from 'express';
import { MongoClient, ObjectId } from 'mongodb';

const app = express();
app.use(express.json());
app.use(express.static('public')); // Serve static files from the 'public' directory

const uri = MongoURI;
const dbName = 'studentsdb';
let db;

// Start the server
async function startServer() {
    try {
        const client = await MongoClient.connect(uri);
        db = client.db(dbName);
        console.log('Connected to MongoDB');

        // middleware to use connection in every route
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

// CRUD endpoints

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
        const result = await req.collection.insertOne(newStudent);
        res.status(201).json(result.ops[0]); // Send back the created student
    } catch (err) {
        res.status(500).send({ error: 'Failed to create student', details: err.message });
    }
});

// Update a student by ID
app.put('/students/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const updates = req.body;

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
