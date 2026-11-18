
import { getDb } from '../db/connect.js';

const getBooksCollection = () => getDb().collection('books');

const formatBook = (book) => {
  if (!book) return null;

  return {
    id: book.id,
    authorId: book.authorId,
    title: book.title,
    publicationDate: book.publicationDate
  };
};

export const getAllBooks = async () => {
  const books = await getBooksCollection()
    .find({})
    .toArray();

  return books.map(formatBook);
};

export const getBookById = async (bookId) => {
  const book = await getBooksCollection().findOne({
    id: bookId
  });

  return formatBook(book);
};

export const createBook = async (bookData) => {
  await getBooksCollection().insertOne(bookData);

  return formatBook(bookData);
};

export const updateBook = async (bookId, bookData) => {
  const collection = getBooksCollection();

  await collection.updateOne(
    { id: bookId },
    { $set: bookData }
  );

  const updatedBook = await collection.findOne({
    id: bookId
  });

  return formatBook(updatedBook);
};

export const deleteBook = async (bookId) => {
  const result = await getBooksCollection().deleteOne({
    id: bookId
  });

  return result.deletedCount === 1;
};

export const bookExists = async (bookId) => {
  const book = await getBooksCollection().findOne(
    { id: bookId },
    { projection: { _id: 1 } }
  );

  return Boolean(book);
};
