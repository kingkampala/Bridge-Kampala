import { injectable } from 'inversify';
import { Bid } from '../models/schema';
import { CustomRequest } from '../middle/custom';
import { User } from '../models/schema';

@injectable()
export class BidService {
  async getAllBids() {
    return Bid.findAll();
  }

  async getBidById(bidId: number) {
    return Bid.findByPk(bidId);
  }

  async createBid(req: CustomRequest, bidData: { propertyId: number; bidAmount: number; tenantEmail: string }) {
    const bid = new Bid();
    bid.tenantId = req.tenantId;

    const tenant = await User.findByPk(req.tenantId);
    if (tenant) {
      bid.tenantId = tenant.id;
    } else {
      throw new Error('tenant not found.');
    }

    bid.propertyId = bidData.propertyId;
    bid.bidAmount = bidData.bidAmount;
    bid.tenantEmail = bidData.tenantEmail,
    bid.status = 'open';
    bid.counterBidAmount = null;
    return bid.save();
  }

  async updateBid(bidId: number, bidData: any) {
    await Bid.update(bidData, { where: { id: bidId } });
    return Bid.findByPk(bidId);
  }

  async deleteBid(bidId: number) {
    await Bid.destroy({ where: { id: bidId } });
  }

  async acceptBid(bidId: number) {
    const bid = await Bid.findByPk(bidId);
    if (bid) {
      bid.status = 'accepted';
      await bid.save();
      return bid;
    }
    return null;
  }
  
  async rejectBid(bidId: number) {
    const bid = await Bid.findByPk(bidId);
    if (bid) {
      bid.status = 'rejected';
      await bid.save();
      return bid;
    }
    return null;
  }
  
  async counterBid(bidId: number, counterBidAmount: number) {
    const bid = await Bid.findByPk(bidId);
    if (bid) {
      bid.status = 'countered';
      bid.counterBidAmount = counterBidAmount;
      await bid.save();
      return bid;
    }
    return null;
  }
  
  async tenantAcceptCounterBid(bidId: number) {
    const bid = await Bid.findByPk(bidId);
    if (bid && bid.status === 'countered') {
      bid.status = 'accepted';
      await bid.save();
      return bid;
    }
    return null;
  }
  
  async tenantRejectCounterBid(bidId: number) {
    const bid = await Bid.findByPk(bidId);
    if (bid && bid.status === 'countered') {
      bid.status = 'rejected';
      await bid.save();
      return bid;
    }
    return null;
  }

  async endBiddingProcess(bidId: number) {
    const bid = await Bid.findByPk(bidId);

    if (!bid) {
      throw new Error(`Bid not found for id: ${bidId}`);
    }

    if (bid && bid.status === 'accepted') {

      // Perform actions to end the bidding process
      // For example, initiate transaction and payment
      // Update the bid status accordingly

      await bid.update({ status: 'completed' });

      return true;
    } else {
      throw new Error(`Invalid bid status for id: ${bidId}`);
    }
  }  
}