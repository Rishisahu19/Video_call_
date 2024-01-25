const path = require('path');

const loadIndex = async (req, res) => {
    try {
        // Assuming 'views' is your static HTML file directory
        const filePath = path.join(__dirname, '..', 'views', 'index.html');
        res.sendFile(filePath);
    } catch (error) {
        console.log(error.message);
        res.status(500).send('Internal Server Error');
    }
};

module.exports = {
    loadIndex
};

// const loadIndex = async (req, res) => {
//     try {
//         res.render('views/index.html');
//     }
//     catch (error) {
//         console.log(error.message);
//     }
// }
// module.exports =
// {
//     loadIndex
// }