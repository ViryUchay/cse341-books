import { getDb } from '../db/connect.js';
import { ObjectId } from 'mongodb';

export const getAllBooks = async () => {
    const db = getDb();
    const collection = db.collection('books');
    const books = await collection.find().toArray();
    return books;
};

export const getBookById = async (bookId) => {
    const db = getDb();
    const collection = db.collection('books');
    
    // Automatically handles MongoDB ObjectId or custom id fields
    if (ObjectId.isValid(bookId)) {
        return await collection.findOne({ _id: new ObjectId(bookId) });
    } else {
        return await collection.findOne({ id: bookId });
    }
};