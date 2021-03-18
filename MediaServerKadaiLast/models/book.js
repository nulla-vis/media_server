const { Buffer } = require('buffer');
const mongoose = require('mongoose');
// const path = require('path');
// const coverImageBasePath = 'uploads/bookCovers';

// schema
const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    publishDate: {
        type: Date,
        required: true
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now()
    },
    coverImage: {
        type: Buffer,
        required: true
    },
    coverImageType: {
        type: String,
        required: true
    },
    author: {
       type: mongoose.Schema.Types.ObjectId, //referencing another object (telling mangoose to reference the object in another collection/table)
       required: true,
       ref: 'Author' //telling mangoose which collection/table we referring to (the name must same with the collection/table name "capitalized/nope")
    }
})

bookSchema.virtual('coverImagePath').get(function() {
    if(this.coverImage != null && this.coverImageType != null) {
        // return path.join('/', coverImageBasePath, this.coverImageName) //root, inside public folder
        return `data:${this.coverImageType};charset=utf-8;base64,${this.coverImage.toString('base64')}`;
    }
})
module.exports = mongoose.model('Book', bookSchema); //'book' disini = table
// module.exports.coverImageBasePath = coverImageBasePath;