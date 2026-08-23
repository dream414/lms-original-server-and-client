const Book = require("../models/Book");

// Add Book

exports.addBook = async(req,res)=>{

try{

const book = await Book.create({

title:req.body.title,
author:req.body.author,
category:req.body.category,
isbn:req.body.isbn,
quantity:req.body.quantity,
availableCopies:req.body.quantity,
description:req.body.description,
image:req.file ? req.file.filename : ""

});

res.status(201).json(book);

}catch(err){

res.status(500).json({message:err.message});

}

};


// Get All Books

exports.getBooks = async(req,res)=>{

try{

const books = await Book.find();

res.json(books);

}catch(err){

res.status(500).json({message:err.message});

}

};


// Get Single Book

exports.getBook = async(req,res)=>{

try{

const book = await Book.findById(req.params.id);

res.json(book);

}catch(err){

res.status(500).json({message:err.message});

}

};


// Update Book

exports.updateBook = async(req,res)=>{

try{

const book = await Book.findByIdAndUpdate(

req.params.id,

req.body,

{new:true}

);

res.json(book);

}catch(err){

res.status(500).json({message:err.message});

}

};


// Delete Book

exports.deleteBook = async(req,res)=>{

try{

await Book.findByIdAndDelete(req.params.id);

res.json({

message:"Book Deleted"

});

}catch(err){

res.status(500).json({message:err.message});

}

};


// Search Book

exports.searchBook = async(req,res)=>{

try{

const keyword=req.query.keyword;

const books=await Book.find({

title:{

$regex:keyword,

$options:"i"

}

});

res.json(books);

}catch(err){

res.status(500).json({message:err.message});

}

};