//ロジックなど
const e = require('express');
const fs = require('fs');
const path = require('path');
// const archiver = require('archiver');
let dir2;
let error;
let passdata;

exports.renderHomePage = (req,res) => {
    let dir = path.join(__dirname,'/../../directory/');
    if(req.body.des){
        if(req.body.des.includes('¥'))
            dir = req.body.des //日本語OSのPATH
        else
            console.log(req.body.des)
            dir = req.body.des.replace(/\\/g, "/"); //英語OSのPATH
    }
    fs.readdir(dir, (err, files) => {
        if(err){
            console.log(err);
            res.redirect('/');
        }
        else{      
            let text = [];
            let folder = [];
            files.forEach(file =>{
                if(file.includes('.txt')){
                    text.push(file);
                }else if(!file.includes('.')){
                    folder.push(file);
                }
            })
            updateDir2(dir);
            res.render("index", {
                data1 : text,
                data2 : folder,
                location : dir,
                error: req.query.err
            })
        }
    });
}

exports.renderHomePage2 = (req,res) => {
    let dir = path.join(__dirname,'/../../directory/');
    if(dir2) {
        dir = dir2;
    }
    // let dir = 'C:/Users/AZHANDI USEMAHU/Desktop/Web Dev/FreeCodeCamp.org/Kadai/';
    // let dir = path.dirname(__filename);
    if(req.body.des){
        if(req.body.des.includes('¥'))
            dir = req.body.des //日本語OSのPATH
        else
            console.log(req.body.des)
            dir = req.body.des.replace(/\\/g, "/"); //英語OSのPATH
    }
    // console.log(req);
    fs.readdir(dir, (err, files) => {
        if(err){
            console.log(err);
            res.redirect('/home2');
        }
        else{      
            let text = [];
            let folder = [];
            files.forEach(file =>{
                if(file.includes('.txt')){
                    text.push(file);
                }else if(!file.includes('.')){
                    folder.push(file);
                }
            })
            updateDir2(dir);
            res.render("index", {
                data1 : text,
                data2 : folder,
                location : dir,
                error: req.query.err,
                success :req.query.succ
            })
        }
    });
}

exports.newFolder = (req,res) => {
    // console.log(req.body.name);
    if(req.body.name == '') {
        const msg = 'フォームに何も入力されていませんでした'
        showError(msg);
        res.redirect(`/home2?err=${error}`);
    }else {
        fs.mkdir(path.join(`${dir2}/${req.body.name}`),(err) => {
            if(err)
                console.log(err);
            else
                console.log('folder created');
        })
        const success = 'フォルダ作成しました。'
        res.redirect(`/home2?succ=${success}`);
        
    }
}

exports.renderDeleteData = (req,res) => {
    const data = req.params;
    if(data.file.includes('.')){
        fs.unlink(`${dir2}/${data.file}`, (err) => {
            if(err){
                console.log(err.code)
            }
            else{
                console.log('file deleted');
            }
        })
    }else {
        fs.rmdir(`${dir2}/${data.file}`, (err) => {
            if(err){
                showError('フォルダ内にファイルがあります。削除する前にフォルダを空にしてください');
            }else
                console.log('folder deleted')
        })
    }
    if(error) {
        res.redirect(`/home2?err=${error}`);
    }else {
        res.redirect('/home2?succ='+"削除しました。");
    }
}

// Copy==========================================================================================================================

exports.renderCopyPage = (req, res) => {
    const recievedData = req.params;
    updateData(recievedData);

    res.render('copy', {
        location : dir2
    });
}

exports.renderCopyData = (req, res) => {
    //passdata ok
    //dir2 ok

    const readStream = fs.createReadStream(`${dir2}/${passdata.file}`);
    const writeStream = fs.createWriteStream(`${req.body.destination}/${passdata.file}`)
    readStream.on('data', (chunk) => {
        writeStream.write(chunk);
    })

    

    res.redirect('/home2?succ='+"コピー完了");

}

// Move==========================================================================================================================

exports.renderMovePage = (req, res) => {
    const recievedData = req.params;
    updateData(recievedData);

    res.render('move', {
        location : dir2
    });
}

exports.renderMoveData = (req, res) => {
    //passdata ok
    //dir2 ok

    const readStream = fs.createReadStream(`${dir2}/${passdata.file}`);
    const writeStream = fs.createWriteStream(`${req.body.destination}/${passdata.file}`)
    readStream.on('data', (chunk) => {
        writeStream.write(chunk);
    })

    fs.unlink(`${dir2}/${passdata.file}`, (err) => {
        if(err)
            console.log(err.code)
        else
            console.log('file deleted');
    })

    res.redirect('/home2?succ='+"移動完了");

}

// About==========================================================================================================================
exports.renderAboutPage = (req, res) => {
 res.render('about');
}

//other Function(s)================================================================================================================
function showError(message) {
    error = message;
}

function updateDir2(dir) {
    dir2 = dir;
}

function updateData(data) {
    passdata = data;
}