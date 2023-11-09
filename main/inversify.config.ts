import { Container } from 'inversify';
import { UserController } from '../controller/user';
import { UserService } from '../service/user';
import { PropertyController } from '../controller/property';
import { PropertyService } from '../service/property';
import { BidController } from '../controller/bid';
import { BidService } from '../service/bid';
import { TransactionController } from '../controller/transaction';
import { TransactionService } from '../service/transaction';
import TYPES from './types';

const container = new Container();

// User
container.bind<UserController>(TYPES.UserController).to(UserController);
container.bind<UserService>(TYPES.UserService).to(UserService);

// Property
container.bind<PropertyController>(TYPES.PropertyController).to(PropertyController);
container.bind<PropertyService>(TYPES.PropertyService).to(PropertyService);

// Bid
container.bind<BidController>(TYPES.BidController).to(BidController);
container.bind<BidService>(TYPES.BidService).to(BidService);

// Transaction
container.bind<TransactionController>(TYPES.TransactionController).to(TransactionController);
container.bind<TransactionService>(TYPES.TransactionService).to(TransactionService);

export default container;