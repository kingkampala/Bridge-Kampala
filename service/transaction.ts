import { injectable } from 'inversify';
import { Transaction } from '../models/schema';

@injectable()
export class TransactionService {
  async getAllTransactions() {
    return Transaction.findAll();
  }

  async getTransactionById(transactionId: number) {
    return Transaction.findByPk(transactionId);
  }

  async createTransaction(transactionData: any) {
    return Transaction.create(transactionData);
  }

  async updateTransaction(transactionId: number, transactionData: any) {
    await Transaction.update(transactionData, { where: { id: transactionId } });
    return Transaction.findByPk(transactionId);
  }

  async deleteTransaction(transactionId: number) {
    await Transaction.destroy({ where: { id: transactionId } });
  }
}