const express = require('express');
const mongoose = require('mongoose');
const Note = require('../models/NotesModel');

const noteRoutes = express.Router();

function handleError(res, error) {
  console.error(error);
  const status = error.name === 'ValidationError' ? 400 : 500;
  return res.status(status).json({ message: error.message });
}

// Create a note
noteRoutes.post('/notes', async (req, res) => {
  if (!req.body.content || typeof req.body.content !== 'object') {
    return res.status(400).json({ message: 'Note content cannot be empty' });
  }

  try {
    const note = await Note.create(req.body.content);
    return res.status(201).json(note);
  } catch (error) {
    return handleError(res, error);
  }
});

// Get all notes
noteRoutes.get('/notes', async (req, res) => {
  try {
    const notes = await Note.find();
    return res.status(200).json(notes);
  } catch (error) {
    return handleError(res, error);
  }
});

// Get one note
noteRoutes.get('/notes/:noteId', async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.noteId)) {
    return res.status(400).json({ message: 'Invalid note ID' });
  }

  try {
    const note = await Note.findById(req.params.noteId);
    if (!note) return res.status(404).json({ message: 'Note not found' });
    return res.status(200).json(note);
  } catch (error) {
    return handleError(res, error);
  }
});

// Update a note
noteRoutes.put('/notes/:noteId', async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.noteId)) {
    return res.status(400).json({ message: 'Invalid note ID' });
  }
  if (!req.body.content || typeof req.body.content !== 'object') {
    return res.status(400).json({ message: 'Note content cannot be empty' });
  }

  try {
    const note = await Note.findByIdAndUpdate(
      req.params.noteId,
      { ...req.body.content, dateUpdated: new Date() },
      { new: true, runValidators: true }
    );
    if (!note) return res.status(404).json({ message: 'Note not found' });
    return res.status(200).json(note);
  } catch (error) {
    return handleError(res, error);
  }
});

// Delete a note
noteRoutes.delete('/notes/:noteId', async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.noteId)) {
    return res.status(400).json({ message: 'Invalid note ID' });
  }

  try {
    const note = await Note.findByIdAndDelete(req.params.noteId);
    if (!note) return res.status(404).json({ message: 'Note not found' });
    return res.status(200).json({ message: 'Note deleted successfully' });
  } catch (error) {
    return handleError(res, error);
  }
});

module.exports = noteRoutes;