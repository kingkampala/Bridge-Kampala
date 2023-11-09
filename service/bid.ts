import { injectable } from 'inversify';
import { Bid } from '../models/schema';

@injectable()
export class BidService {
  async getAllBids() {
    return Bid.findAll();
  }

  async getBidById(bidId: number) {
    return Bid.findByPk(bidId);
  }

  async createBid(bidData: any) {
    return Bid.create(bidData);
  }

  async updateBid(bidId: number, bidData: any) {
    await Bid.update(bidData, { where: { id: bidId } });
    return Bid.findByPk(bidId);
  }

  async deleteBid(bidId: number) {
    await Bid.destroy({ where: { id: bidId } });
  }
}