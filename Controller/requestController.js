const express = require('express');

const Request = require('../models/Request');
const Book = require('../models/Book');


// create request (from -> to)
const createRequest = async (req, res) => {
  try {
    const { bookId } = req.body;

    const book = await Book.findById(bookId);
    if (!book) return res.status(404).json({ msg: "Book not found" });
    if (!book.available) return res.status(400).json({ msg: "Book not available" });

const newRequest = new Request({
  book: book._id,
  from: req.user.id,  // user requesting the book
  to: book.owner,     // book owner
  status: "pending",
});
await newRequest.save();
    res.json(newRequest);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};


// get requests received by current user
 const getRequests =async (req, res) => {
try {
const requests = await Request.find({ to: req.user.id }).populate('book from to');

res.json(requests);
} catch (err) { console.error(err); res.status(500).send('Server error'); }
}


// get requests made by current user
 const getMyRequests =async (req, res) => {
try {
const requests = await Request.find({ from: req.user.id }).populate('book from to');
res.json(requests);
} catch (err) { console.error(err); res.status(500).send('Server error'); }
}
// accept/decline
const acceptRequest = async (req, res) => {
  try {
    const { status } = req.body; // 'accepted' or 'declined'

    const r = await Request.findById(req.params.id);
    if (!r) return res.status(404).json({ msg: "Request not found" });

    // Check if the current user is the book owner (`to`)
    if (r.to.toString() !== req.user.id)
      return res.status(403).json({ msg: "Not authorized" });

    r.status = status;
    await r.save();

    // If accepted, mark the book as unavailable
    if (status === "accepted") {
      await Book.findByIdAndUpdate(r.book, { available: false });
    }

    res.json(r);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};




module.exports = {
    createRequest,
    getRequests,
    getMyRequests,
    acceptRequest
};  