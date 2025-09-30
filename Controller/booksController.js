const express = require('express');

const Book = require('../models/Book');


// create book
const createBook = async (req, res) => {
  const { title, author, condition } = req.body;

  try {
    let imageUrl = "";
    if (req.file) {
      // ✅ Save full URL instead of relative path
      imageUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
    }

    const book = new Book({
      owner: req.user.id,
      title,
      author,
      condition,
      image: imageUrl,
    });

    await book.save();
    res.json(book);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

const ListBooks = async (req, res) => {
  try {
    const q = req.query.excludeMine === 'true' ? { owner: { $ne: req.user.id }, available: true } : { available: true };
    const books = await Book.find(q).populate('owner', 'name email');
    res.json(books);
  } catch (err) { console.error(err); res.status(500).send('Server error'); }
}

const getMyBooks = async (req, res) => {
  try {
    const books = await Book.find({ owner: req.user.id });
    res.json(books);
  } catch (err) { console.error(err); res.status(500).send('Server error'); }
}
// delete book
const deleteBook = async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) return res.status(404).json({ msg: 'Book not found' });
    if (book.owner.toString() !== req.user.id) return res.status(401).json({ msg: 'Not authorized' });
    res.json({ msg: 'Book Deleted' });
  } catch (err) { console.error(err); res.status(500).send('Server error'); }
}

module.exports = {
  createBook,
  ListBooks,
  getMyBooks,
  deleteBook
};  