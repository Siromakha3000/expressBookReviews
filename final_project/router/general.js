const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    // Check if both username and password are provided
    if (username && password) {
        // Check if the user does not already exist
        if (!isValid(username)) {
            // Add the new user to the users array
            users.push({ "username": username, "password": password });
            return res.status(200).json({ message: "User successfully registered. Now you can login" });
        } else {
            return res.status(404).json({ message: "User already exists!" });
        }
    }
    // Return error if username or password is missing
    return res.status(404).json({ message: "Unable to register user." });
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
    return res.send(JSON.stringify(books));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    if (!isbn) {
        return res.status(401).json({ message: "no isbn" });
    }
    if (!books[isbn]) {
        return res.status(404).json({ message: "no book with such isbn" });
    }
    return res.send(JSON.stringify(books[isbn]));
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author;
    const authorsBooks = Object.fromEntries(
        Object.entries(books).filter(([isbn, book]) => book.author === author)
    );
    return res.send(JSON.stringify(authorsBooks));
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title;
    const titledBooks = Object.fromEntries(
        Object.entries(books).filter(([isbn, book]) => book.title === title)
    );
    return res.send(JSON.stringify(titledBooks));
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    if (!isbn) {
        return res.status(401).json({ message: "no isbn" });
    }
    if (!books[isbn]) {
        return res.status(404).json({ message: "no book with such isbn" });
    }
    return res.send(JSON.stringify(books[isbn].reviews));
});


// TASK 10: Get all books using async/await
const getAllBooks = async () => {
    try {
        const response = await axios.get('http://localhost:5000/');
        console.log("Task 10: All Books:\n", response.data);
    } catch (error) {
        console.error("Error fetching all books:", error.message);
    }
};

// TASK 11: Get book details by ISBN using Promises
const getBookByISBN = (isbn) => {
    axios.get(`http://localhost:5000/isbn/${isbn}`)
        .then(response => {
            console.log(`Task 11: Book with ISBN ${isbn}:\n`, response.data);
        })
        .catch(error => {
            console.error(`Error fetching book with ISBN ${isbn}:`, error.message);
        });
};

// TASK 12: Get books by author using async/await
const getBooksByAuthor = async (author) => {
    try {
        const response = await axios.get(`http://localhost:5000/author/${author}`);
        console.log(`Task 12: Books by ${author}:\n`, response.data);
    } catch (error) {
        console.error(`Error fetching books by ${author}:`, error.message);
    }
};

// TASK 13: Get books by title using Promises
const getBooksByTitle = (title) => {
    axios.get(`http://localhost:5000/title/${title}`)
        .then(response => {
            console.log(`Task 13: Books titled "${title}":\n`, response.data);
        })
        .catch(error => {
            console.error(`Error fetching books titled "${title}":`, error.message);
        });
};

module.exports.general = public_users;
