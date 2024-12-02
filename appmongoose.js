/**
 * @file appmongoose.js
 * @description This file contains a starter implementation of a RESTful API for managing student records using MongoDB.
 * @version 1.0.0
 * @date 2024-11-20
 * @author pedromoreira
 * @organization ESTG-IPVC
 */

// mongoose setup
import express from 'express';
import mongoose from 'mongoose';

const app = express();
app.use(express.json());
app.use(express.static('public')); // Serve static files from the 'public' directory

// Connect to MongoDB
mongoose.connect('mongodb+srv://luispaiva:1p2a3i4v5a@cluster0.wzuaz.mongodb.net/studentsdb?retryWrites=true&w=majority&appName=Cluster0', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Define the Student schema
const studentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    age: { type: Number, required: true },
    study: { type: String, required: true }
});

// Create the Student model
const Student = mongoose.model('Student', studentSchema);

// CRUD endpoints

// Get all students
app.get('/students', async (req, res) => {
    try {
        const students = await Student.find();
        res.json(students);
    } catch (err) {
        res.status(500).send(err);
    }
});

// Get a student by ID
app.get('/students/:id', async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);
        if (student) {
            res.json(student);
        } else {
            res.status(404).send('Student not found');
        }
    } catch (err) {
        res.status(500).send(err);
    }
});

// Create a new student
app.post('/students', async (req, res) => {
    try {
        const newStudent = new Student(req.body);
        await newStudent.save();
        res.status(201).json(newStudent);
    } catch (err) {
        res.status(400).send(err);
    }
});

// Update a student by ID
app.put('/students/:id', async (req, res) => {
    try {
        const updatedStudent = await Student.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true } // Return the updated document
        );
        if (updatedStudent) {
            res.json(updatedStudent);
        } else {
            res.status(404).send('Student not found');
        }
    } catch (err) {
        res.status(400).send(err);
    }
});

// Delete a student by ID
app.delete('/students/:id', async (req, res) => {
    try {
        const deletedStudent = await Student.findByIdAndDelete(req.params.id);
        if (deletedStudent) {
            res.json(deletedStudent);
        } else {
            res.status(404).send('Student not found');
        }
    } catch (err) {
        res.status(500).send(err);
    }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
