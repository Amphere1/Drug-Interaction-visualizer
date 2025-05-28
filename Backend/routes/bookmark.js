import express from 'express';
import Bookmark from '../models/bookmark.js';
import verifyToken from '../middleware/auth.js';

const router = express.Router();

// POST /api/bookmarks - Save a bookmark
router.post('/', verifyToken, async (req, res) => {
    try {
        const newBookmark = new Bookmark({
            userId: req.user.id,
            interactions: req.body.interactions,
        });
        const saved = await newBookmark.save();
        res.status(201).json(saved);
    } catch (err) {
        res.status(500).json({ error: 'Failed to save bookmark' });
    }
});

// GET /api/bookmarks - Get all bookmarks for user
router.get('/', verifyToken, async (req, res) => {
    try {
        const bookmarks = await Bookmark.find({ userId: req.user.id });
        res.json(bookmarks);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch bookmarks' });
    }
});

// DELETE /api/bookmarks/:id - Delete a bookmark by ID
router.delete('/:id', verifyToken, async (req, res) => {
    try {
        const bookmark = await Bookmark.findOne({
            _id: req.params.id,
            userId: req.user.id
        });

        if (!bookmark) {
            return res.status(404).json({ message: 'Bookmark not found' });
        }

        await Bookmark.findByIdAndDelete(req.params.id);
        res.json({ message: 'Bookmark deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete bookmark' });
    }
});

export default router;
