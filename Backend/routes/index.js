import express from "express";
import verifyToken from "../middleware/auth.js"

const router = express.Router();

router.get('/protected', verifyToken, (req, res) => {
    res.status(200).json({ message: 'Welcome to the protected route' });
});

export default router;