const { render } = require("ejs");
const express = require("express");
const router = express.Router();
const Author = require('../models/author');
const Book = require('../models/book');


// All Author Routes

router.get('/', async (req, res) => {
    let searchOptions = {}
    if(req.query.name != null && req.query.name !=''){//makai query karena method get mengirim parameter lewat url
        searchOptions.name = new RegExp(req.query.name, 'i') //regular expression, contoh di database ada nama john, tinggal search jo aja bisa muncul hasi pencarian, i disini case insensitive, jadi ngak masalah huruf besar/kecil
    }
    try{
        const authors = await Author.find(searchOptions) //kosong = semua, ngak ada parameter reuirement author apa yang mau dicari
        res.render('authors/index', {
            authors: authors, 
            searchOptions: req.query
        }) //ini view index.ejs
    } catch {
        res.redirect('/')
    }
    
})

// New Author Route
// for showing the view
router.get('/new', (req,res) => {
    res.render('authors/new', {author : new Author() });
})
// for actually creating new author (the function) / Create Author Route
router.post('/', async(req, res) => {
    const author = new Author({
        name: req.body.name,
    });
    try {
        const newAuthor = await author.save();
        res.redirect(`authors/${newAuthor.id}`)
    } catch { //jika ada error
        res.render('authors/new', {
            author: author,
            errorMessage: 'アップローダーの作成中にエラーが発生しました'
        })
    }
})

router.get('/:id', async (req, res) => {
    try{
        const author =  await Author.findById(req.params.id)
        const books = await Book.find({ author: author.id}).limit(6).exec()
        res.render('authors/show', {
            author: author,
            booksByAuthor: books
        })
    } catch {
        res.redirect('/')
    }
})

router.get('/:id/edit', async (req, res) => {
    try {
        const author = await Author.findById(req.params.id)
        res.render('authors/edit', {author : author });
    }catch {
        res.redirect('/authors')
    }
})

//UPDATE
router.put('/:id', async (req, res) => {
    let author
    try {
        author = await Author.findById(req.params.id)
        author.name = req.body.name
        await author.save();
        res.redirect(`/authors/${author.id}`)
    } catch { //jika ada error
        if(author == null) {
            res.redirect('/')
        } else {
            res.render('authors/new', {
                author: author,
                errorMessage: 'アップローダーの更新中にエラーが発生しました'
            })
        }
    }
})

router.delete('/:id', async (req, res) => {
    let author
    try {
        author = await Author.findById(req.params.id)
        await author.remove();
        res.redirect('/authors/')
    } catch { //jika ada error
        if(author == null) {
            res.redirect('/')
        } else {
            res.redirect(`/authors/${author.id}`)
        }
    }
})
// exporting this file so can be used in other .js file
module.exports = router