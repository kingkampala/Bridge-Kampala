import { Request, Response } from 'express';
import { controller, httpGet, httpPost, httpPut, httpDelete, requestBody, response } from 'inversify-express-utils';
import { inject } from 'inversify';
import TYPES from '../main/types';
import { BidService } from '../service/bid';
import { PropertyService } from '../service/property';
import { authenticate } from '../middle/auth';
import propertyController from '../controller/property';
import { sendBidNotification } from '../nodemailer/config';

@controller('/bids')
export class BidController {
  constructor(
    @inject(TYPES.BidService) private bidService: BidService,
    @inject(TYPES.PropertyService) private propertyService: PropertyService
    ) {}

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

  @httpPost('/', authenticate, propertyController.checkPropertyExists)
  async createBid(@requestBody() bidData: { propertyId: number; bidAmount: number, tenantEmail: string }, @response() res: Response) {
    try{
      const newBid = await this.bidService.createBid(bidData);

      const landlordEmail = await this.propertyService.getLandlordEmail(bidData.propertyId);
      if (landlordEmail === null) {
        throw new Error('Landlord email not found for property ID: ' + bidData.propertyId);
      }
      await sendBidNotification(bidData.tenantEmail, landlordEmail, newBid);

      res.status(201).json({ message: 'Bid placed successfully', newBid });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
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