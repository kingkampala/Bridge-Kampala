import { Request, Response } from 'express';
import { controller, httpGet, httpPost, httpPut, httpDelete } from 'inversify-express-utils';
import { inject } from 'inversify';
import TYPES from '../main/types';
import { BidService } from '../service/bid';

@controller('/bids')
export class BidController {
  constructor(@inject(TYPES.BidService) private bidService: BidService) {}

  @httpGet('/')
  async getAllBids(req: Request, res: Response) {
    const bids = await this.bidService.getAllBids();
    res.json(bids);
  }

  @httpGet('/:id')
  async getBidById(req: Request, res: Response) {
    const bidId = parseInt(req.params.id, 10);
    const bid = await this.bidService.getBidById(bidId);
    res.json(bid);
  }

  @httpPost('/')
  async createBid(req: Request, res: Response) {
    const newBid = await this.bidService.createBid(req.body);
    res.status(201).json(newBid);
  }

  @httpPut('/:id')
  async updateBid(req: Request, res: Response) {
    const bidId = parseInt(req.params.id, 10);
    const updatedBid = await this.bidService.updateBid(bidId, req.body);
    res.json(updatedBid);
  }

  @httpDelete('/:id')
  async deleteBid(req: Request, res: Response) {
    const bidId = parseInt(req.params.id, 10);
    await this.bidService.deleteBid(bidId);
    res.sendStatus(204);
  }
}