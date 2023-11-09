import { Container } from 'inversify';
import { InversifyExpressServer } from 'inversify-express-utils';
import './UserController';
import './PropertyController';
import './BidController';
import './TransactionController';

const container = new Container();

const server = new InversifyExpressServer(container);
const app = server.build();

export default app;