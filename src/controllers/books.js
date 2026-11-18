
import {
  getAllBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
  bookExists
} from '../models/books.js';

import { authorExists } from '../models/authors.js';
import { validateBookInput } from '../utils/validation.js';

const sendServerError = (res, error, route) => {
  console.error(`${route} failed:`, error);
  return res.status(500).json({
    error: 'Internal server error'
  });
};

const handleDuplicateId = (res) => {
  return res.status(400).json({
    error: 'A book with this ID already exists'
  });
};

export const getBooksHandler = async (req, res) => {
  try {
    const books = await getAllBooks();
    return res.status(200).json(books);
  } catch (error) {
    return sendServerError(res, error, 'GET /books');
  }
};

export const getBookByIdHandler = async (req, res) => {
  try {
    const book = await getBookById(req.params.id);

    if (!book) {
      return res.status(404).json({
        error: 'Book not found'
      });
    }

    return res.status(200).json(book);
  } catch (error) {
    return sendServerError(res, error, 'GET /books/:id');
  }
};

export const createBookHandler = async (req, res) => {
  if (!req.is('application/json')) {
    return res.status(415).json({
      error: 'Content-Type must be application/json'
    });
  }

  const validation = validateBookInput(req.body);

  if (validation.error) {
    return res.status(400).json({
      error: validation.error
    });
  }

  try {
    const exists = await authorExists(validation.data.authorId);

    if (!exists) {
      return res.status(400).json({
        error: 'The specified author does not exist'
      });
    }

    const book = await createBook(validation.data);

    return res.status(201).json(book);
  } catch (error) {
    if (error.code === 11000) {
      return handleDuplicateId(res);
    }

    return sendServerError(res, error, 'POST /books');
  }
};

export const updateBookHandler = async (req, res) => {
  try {
    const exists = await bookExists(req.params.id);

    if (!exists) {
      return res.status(404).json({
        error: 'Book not found'
      });
    }

    if (!req.is('application/json')) {
      return res.status(415).json({
        error: 'Content-Type must be application/json'
      });
    }

    const validation = validateBookInput(req.body, false);

    if (validation.error) {
      return res.status(400).json({
        error: validation.error
      });
    }

    const authorFound = await authorExists(
      validation.data.authorId
    );

    if (!authorFound) {
      return res.status(400).json({
        error: 'The specified author does not exist'
      });
    }

    const book = await updateBook(
      req.params.id,
      validation.data
    );

    return res.status(200).json(book);
  } catch (error) {
    return sendServerError(res, error, 'PUT /books/:id');
  }
};

export const deleteBookHandler = async (req, res) => {
  try {
    const deleted = await deleteBook(req.params.id);

    if (!deleted) {
      return res.status(404).json({
        error: 'Book not found'
      });
    }

    return res.status(204).send();
  } catch (error) {
    return sendServerError(res, error, 'DELETE /books/:id');
  }
};
