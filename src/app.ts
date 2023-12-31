import 'reflect-metadata';
import express from 'express';
import { Sequelize } from 'sequelize';
import { InversifyExpressServer } from 'inversify-express-utils';
import dotenv from 'dotenv';
import container from '../main/inversify.config';

dotenv.config();

const app = express();

const server = new InversifyExpressServer(container, null, { rootPath: '/' });

server.setConfig((app) => {
  app.use(express.json());
  // Add any other middleware you need
});

const routes = server.build();

app.use('/', routes);

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