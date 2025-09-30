 const express = require('express');
const router = express.Router();

const authMiddleware = require('../middleware/authMiddleware');
const { createBook, ListBooks, getMyBooks, deleteBook } = require('../Controller/booksController');
 const upload = require('../middleware/upload');

router.post('/create-book', authMiddleware, upload.single("image"), createBook);
router.get('/books', authMiddleware, ListBooks);
router.get('/books/mine', authMiddleware, getMyBooks);
router.delete('/book/:id', authMiddleware, deleteBook);       
module.exports = router;