import { Request, Response } from 'express';
import { controller, httpGet, httpPost, httpPut, httpDelete } from 'inversify-express-utils';
import { inject } from 'inversify';
import TYPES from '../main/types';
import { TransactionService } from '../service/transaction';

@controller('/transactions')
export class TransactionController {
  constructor(@inject(TYPES.TransactionService) private transactionService: TransactionService) {}

  @httpGet('/')
  async getAllTransactions(req: Request, res: Response) {
    const transactions = await this.transactionService.getAllTransactions();
    res.json(transactions);
  }

  @httpGet('/:id')
  async getTransactionById(req: Request, res: Response) {
    const transactionId = parseInt(req.params.id, 10);
    const transaction = await this.transactionService.getTransactionById(transactionId);
    res.json(transaction);
  }

  @httpPost('/')
  async createTransaction(req: Request, res: Response) {
    const newTransaction = await this.transactionService.createTransaction(req.body);
    res.status(201).json(newTransaction);
  }

  @httpPut('/:id')
  async updateTransaction(req: Request, res: Response) {
    const transactionId = parseInt(req.params.id, 10);
    const updatedTransaction = await this.transactionService.updateTransaction(transactionId, req.body);
    res.json(updatedTransaction);
  }

  @httpDelete('/:id')
  async deleteTransaction(req: Request, res: Response) {
    const transactionId = parseInt(req.params.id, 10);
    await this.transactionService.deleteTransaction(transactionId);
    res.sendStatus(204);
  }
}