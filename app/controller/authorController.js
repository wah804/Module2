const getAllAuthor = (req, res) => {
    res.status(200).json({success:true, message: `${req.method} - Request to Author endpoint`})
};

const getAuthorById = (req, res) => {
    const { id } = req.params;
    res.status(200).json({
        id,
        success:true, 
        message: `${req.method} - Request to Author endpoint`})
};

const createAuthorById = (req, res) => {
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