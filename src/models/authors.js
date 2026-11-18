
import { getDb } from '../db/connect.js';

const getAuthorsCollection = () => getDb().collection('authors');
const getBooksCollection = () => getDb().collection('books');

const formatAuthor = (author) => {
  if (!author) return null;

  return {
    id: author.id,
    name: author.name,
    birthYear: author.birthYear
  };
};

export const getAllAuthors = async () => {
  const authors = await getAuthorsCollection()
    .find({})
    .toArray();

  return authors.map(formatAuthor);
};

export const getAuthorById = async (authorId) => {
  const author = await getAuthorsCollection().findOne({
    id: authorId
  });

  return formatAuthor(author);
};

export const createAuthor = async (authorData) => {
  await getAuthorsCollection().insertOne(authorData);

  return formatAuthor(authorData);
};

export const updateAuthor = async (authorId, authorData) => {
  const collection = getAuthorsCollection();

  await collection.updateOne(
    { id: authorId },
    { $set: authorData }
  );

  const updatedAuthor = await collection.findOne({
    id: authorId
  });

  return formatAuthor(updatedAuthor);
};

export const deleteAuthor = async (authorId) => {
  const result = await getAuthorsCollection().deleteOne({
    id: authorId
  });

  return result.deletedCount === 1;
};

export const authorExists = async (authorId) => {
  const author = await getAuthorsCollection().findOne(
    { id: authorId },
    { projection: { _id: 1 } }
  );

  return Boolean(author);
};

export const countBooksByAuthor = async (authorId) => {
  return getBooksCollection().countDocuments({
    authorId
  });
};
