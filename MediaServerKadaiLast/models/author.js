const mongoose = require('mongoose');
const book = require('./book');
const Book = require('./book')

// schema
const authorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    }
})

//run function before a remove-actuion occur
authorSchema.pre('remove', function(next) {
    Book.find({ author: this.id }, (err, books) => {
        if(err) {
            next(err)
        } else if (books.length > 0) {
            next(new Error('This author still has books'))
        } else {
            next()
        }
    })
})
module.exports = mongoose.model('Author', authorSchema); //'Author' disini = table
// module.exports = mongoose.model('testTable', authorSchema); //'Author' disini = table