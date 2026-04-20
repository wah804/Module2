const Authors = require("../models/Authors")


const getAllAuthor = async (req, res) => {
    const authors = await Authors.find({});
    res.status(200).json({success:true, message: `${req.method} - Request to Author endpoint`})
};

const getAuthorById = (req, res) => {
    const { id } = req.params;
    res.status(200).json({
        data: authors, 
        id,
        success:true, 
        message: `${req.method} - Request to Author endpoint`})
};

const createAuthorById = async (req, res) => {
    const { author } = req.body;
    const newAuthor = await Authors.create(author);
    console.log("data >>>", newAuthor);
    
    const { id } = req.params;
    res.status(200).json({
        id,
        success:true, 
        message: `${req.method} - Request to Author endpoint`})
};

const updateAuthorById = (req, res) => {
    const { id } = req.params;
    res.status(200).json({
        id,
        success:true, 
        message: `${req.method} - Request to Author endpoint`})
};

const deleteAuthorById = (req, res) => {
    const { id } = req.params;
    res.status(200).json({
        id,
        success:true, 
        message: `${req.method} - Request to Author endpoint`})
};

module.exports = {
    createAuthorById,
    getAllAuthor,
    getAuthorById,
    updateAuthorById,
    deleteAuthorById

};