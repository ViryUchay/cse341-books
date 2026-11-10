
import app from './app.js';
import { connectToDb } from './src/db/connect.js';

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await connectToDb();

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server listening on port ${PORT}`);
    });
  } catch (error) {
    console.error('Database connection failed:', error.message);
    process.exit(1);
  }
};

await startServer();
