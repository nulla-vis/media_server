const { render } = require("ejs");
const express = require("express");
// const path = require('path');
// const fs = require('fs');
const router = express.Router();
const Book = require('../models/book');
const Author = require('../models/author');
const { json } = require("body-parser");
// const uploadPath = path.join('public', Book.coverImageBasePath) //join 2 different path(s)
const imgageMimeTypes = ['image/jpeg', 'image/png'];
// const upload = multer({
//     dest: uploadPath,
//     fileFilter: (req, file, callback) => {
//         callback(null, imgageMimeTypes.includes(file.mimetype)); //1st param = null, cuz no error (this is error param), 2nd param: boolean true = file accepted
//     }
// });


// All Book Routes

router.get('/', async (req, res) => {
    let query = Book.find();
    if(req.query.title != null && req.query.title != '') {
        query = query.regex('title', new RegExp(req.query.title, 'i')) // regex('title') here to check the book.title with the req.query.title
    }
    if(req.query.publishedBefore != null && req.query.publishedBefore != '') {
        query = query.lte('publishDate', req.query.publishedBefore) //lte = less than or equal to <=
    }
    if(req.query.publishedAfter != null && req.query.publishedAfter != '') {
        query = query.gte('publishDate', req.query.publishedAfter) //lte = less than or equal to <=
    }
    try {
        const books = await query.exec(); //this just execute our query from above
        res.render('books/index', {
            books : books,
            searchOptions: req.query
        })
    } catch {
        res.redirect('/');
    }

})

// New Book Route
// for showing the view
router.get('/new', async (req,res) => {
    renderNewPage(res, new Book());
})

//  Create Book Route
router.post('/', async (req, res) => { //'cover' here same name as in ejs input name
    const fileName = req.file != null ? req.file.filename : null //file variable here was automatically added by the library multer(?)
    const book = new Book ({
        title: req.body.title,
        author: req.body.author,
        publishDate: new Date(req.body.publishDate), //convert string to Date
        // coverImageName : fileName,
        description: req.body.description
    });
    saveCover(book, req.body.cover)

    console.log('published date = '+ book.publishDate)
    try{
        const newBook = await book.save();
        res.redirect(`books/${newBook.id}`)
    } catch {
        renderNewPage(res, book, true);
    }
})

// Show Book Route
router.get('/:id', async (req, res) =>{
    try {
        const book = await Book.findById(req.params.id).populate('author').exec() //pass author information to books with populate
        res.render('books/show', { book: book })
    } catch {
        res.redirect('/')
    }
})

// Edit Book Route
router.get('/:id/edit', async (req,res) => {
    try {
        const book = await Book.findById(req.params.id)
        renderEditPage(res, book);
    } catch {
        res.redirect('/')
    }
})

//  Update Book Route
router.put('/:id', async (req, res) => { //'cover' here same name as in ejs input name
    let book
    try{
        book = await Book.findById(req.params.id);
        book.title = req.body.title
        book.author = req.body.author
        book.publishDate = new Date(req.body.publishDate)
        book.description = req.body.description
        if ( req.body.cover != null && req.body.cover !== '') {
            saveCover(book, req.body.cover)
        }
        await book.save()
        res.redirect(`/books/${book.id}`)
    } catch (err){
        console.log(err)
        if (book != null) {
            renderEditPage(res, book, true);

        } else {
            redirect('/')
        }
    }
})

// Delete book router
router.delete('/:id', async (req, res) => {
    let book
    try {
        book = await Book.findById(req.params.id)
        await book.remove()
        res.redirect('/books')
    } catch {
        if (book != null) {
            res.render('books/show', {
                book: book,
                errorMessage: '画像の削除に失敗しました'
            })
        }else {
            res.redirect('/')
        }
    }

})

async function renderNewPage(res, book, hasError = false) {
    renderFormPage(res, book, 'new', hasError)
}

async function renderEditPage(res, book, hasError = false) {
    renderFormPage(res, book, 'edit', hasError)
}
async function renderFormPage(res, book, form, hasError = false) {
    try{
        const authors = await Author.find({}) ;//must require Author model in order to use
        const params = {
            authors: authors,
            book: book
        }
        if(hasError) {
            if(form === 'edit') {
                params.errorMessage = '画像の更新中にエラーが発生しました'
            } else {
                params.errorMessage = '新しい画像の追加中にエラーが発生しました'
            }
        }
        res.render(`books/${form}`, params);
    } catch {
        res.redirect('/books');
    }
}

function saveCover(book, coverEncoded) {
    if(coverEncoded == null) return;
    const cover = JSON.parse(coverEncoded);
    if(cover != null &&  imgageMimeTypes.includes(cover.type)) {
        book.coverImage = new Buffer.from(cover.data, 'base64');
        book.coverImageType = cover.type
    };
}

// exporting this file so can be used in other .js file
module.exports = router