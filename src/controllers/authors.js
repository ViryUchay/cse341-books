
import {
  getAllAuthors,
  getAuthorById,
  createAuthor,
  updateAuthor,
  deleteAuthor,
  authorExists,
  countBooksByAuthor
} from '../models/authors.js';

import { validateAuthorInput } from '../utils/validation.js';

const sendServerError = (res, error, route) => {
  console.error(`${route} failed:`, error);
  return res.status(500).json({
    error: 'Internal server error'
  });
};

export const getAuthorsHandler = async (req, res) => {
  try {
    const authors = await getAllAuthors();
    return res.status(200).json(authors);
  } catch (error) {
    return sendServerError(res, error, 'GET /authors');
  }
};

export const getAuthorByIdHandler = async (req, res) => {
  try {
    const author = await getAuthorById(req.params.id);

    if (!author) {
      return res.status(404).json({
        error: 'Author not found'
      });
    }

    return res.status(200).json(author);
  } catch (error) {
    return sendServerError(res, error, 'GET /authors/:id');
  }
};

export const createAuthorHandler = async (req, res) => {
  if (!req.is('application/json')) {
    return res.status(415).json({
      error: 'Content-Type must be application/json'
    });
  }

  const validation = validateAuthorInput(req.body);

  if (validation.error) {
    return res.status(400).json({
      error: validation.error
    });
  }

  try {
    const author = await createAuthor(validation.data);

    return res.status(201).json(author);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        error: 'An author with this ID already exists'
      });
    }

    return sendServerError(res, error, 'POST /authors');
  }
};

export const updateAuthorHandler = async (req, res) => {
  try {
    const exists = await authorExists(req.params.id);

    if (!exists) {
      return res.status(404).json({
        error: 'Author not found'
      });
    }

    if (!req.is('application/json')) {
      return res.status(415).json({
        error: 'Content-Type must be application/json'
      });
    }

    const validation = validateAuthorInput(req.body, false);

    if (validation.error) {
      return res.status(400).json({
        error: validation.error
      });
    }

    const author = await updateAuthor(
      req.params.id,
      validation.data
    );

    return res.status(200).json(author);
  } catch (error) {
    return sendServerError(res, error, 'PUT /authors/:id');
  }
};

export const deleteAuthorHandler = async (req, res) => {
  try {
    const exists = await authorExists(req.params.id);

    if (!exists) {
      return res.status(404).json({
        error: 'Author not found'
      });
    }

    const bookCount = await countBooksByAuthor(req.params.id);

    if (bookCount > 0) {
      return res.status(409).json({
        error: `Cannot delete author ${req.params.id} because ${bookCount} book(s) still reference this author.`
      });
    }

    await deleteAuthor(req.params.id);

    return res.status(204).send();
  } catch (error) {
    return sendServerError(res, error, 'DELETE /authors/:id');
  }
};
