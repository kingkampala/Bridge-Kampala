import express from 'express';
import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

const db = process.env.DB_URL;

if (!db) {
  throw new Error('DB_URL environment variable is not defined.');
}

const sequelize = new Sequelize(db, {
    dialect: "postgres",
    logging: false,
    dialectOptions: {
        ssl: {
        require: true,
        rejectUnauthorized: false
        },
    }
});

sequelize.authenticate()
  .then(() => {
    console.log('database connection successful');
  })
  .catch(err => {
    console.error('database connection error:', err);
  });

app.listen(port, () => {
    console.log(`server is running on port ${port}.`);
});