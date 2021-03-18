const express = require("express");
const router = express.Router();
const Book = require('../models/book');

router.get('/', async(req, res) => {
    let books
    try {
        books = await Book.find().sort({ createdAt: 'desc'}).limit(10).exec() //limit to only 10 books are shown
    } catch {
        books = [];
    }
    res.render('index', { books: books}) //ini view index.ejs
})

// exporting this file so can be used in other .js file
module.exports = router