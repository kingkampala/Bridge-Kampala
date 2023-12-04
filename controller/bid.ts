import { Request, Response } from 'express';
import { controller, httpGet, httpPost, httpPut, httpDelete, requestBody, response, request } from 'inversify-express-utils';
import { inject } from 'inversify';
import TYPES from '../main/types';
import { BidService } from '../service/bid';
import { PropertyService } from '../service/property';
import { authenticate } from '../middle/auth';
import propertyController from '../controller/property';
import { sendBidNotification } from '../nodemailer/config';
import { CustomRequest } from '../middle/custom';
import { UniqueConstraintError } from 'sequelize';

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
  async createBid(@request() req: CustomRequest, @requestBody() bidData: { propertyId: number; bidAmount: number, tenantEmail: string }, @response() res: Response) {
    try{
      if (!req.tenantId) {
        return res.status(403).json({ error: 'Forbidden! Only tenants can make bids.' });
      }

      const newBid = await this.bidService.createBid(req, req.body);

      const landlordEmail = await this.propertyService.getLandlordEmail(bidData.propertyId);
      if (landlordEmail === null) {
        throw new Error('Landlord email not found for property ID: ' + bidData.propertyId);
      }
      await sendBidNotification(bidData.tenantEmail, landlordEmail, newBid);

      res.status(201).json({ message: 'Bid placed successfully', newBid });
    } catch (error) {
      console.error(error);
      if (error instanceof UniqueConstraintError) {
        return res.status(400).json({ error: 'bid already exists.' });
      }
      res.status(500).json({ error: 'internal server error' });
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

  @httpPut('/accept/:id')
  async acceptBid(req: Request, res: Response) {
    const bidId = parseInt(req.params.id, 10);
    const acceptedBid = await this.bidService.acceptBid(bidId);

    if (acceptedBid) {
      res.status(200).json({ message: 'Bid accepted successfully', acceptedBid });
    } else {
      res.status(404).json({ error: 'Bid not found' });
    }
  }

  @httpPut('/reject/:id')
  async rejectBid(req: Request, res: Response) {
    const bidId = parseInt(req.params.id, 10);
    const rejectedBid = await this.bidService.acceptBid(bidId);

    if (rejectedBid) {
      res.status(200).json({ message: 'Bid rejected successfully', rejectedBid });
    } else {
      res.status(404).json({ error: 'Bid not found' });
    }
  }

  @httpPut('/counter/:id')
  async counterBid(req: Request, res: Response) {
    const bidId = parseInt(req.params.id, 10);
    const counterBidAmount = parseFloat(req.body.counterBidAmount);

    if (isNaN(counterBidAmount)) {
      return res.status(400).json({ error: 'Invalid counter bid amount' });
    }

    const counteredBid = await this.bidService.counterBid(bidId, counterBidAmount);

    if (counteredBid) {
      res.status(200).json({ message: 'Bid countered successfully', counteredBid });
    } else {
      res.status(404).json({ error: 'Bid not found' });
    }
  }

  @httpPut('/tenant/acb/:id')
  async tenantAcceptCounterBid(req: Request, res: Response) {
    const bidId = parseInt(req.params.id, 10);
    const acceptedCounterBid = await this.bidService.tenantAcceptCounterBid(bidId);

    if (acceptedCounterBid) {
      res.status(200).json({ message: 'Counter bid accepted successfully', acceptedCounterBid });
    } else {
      res.status(404).json({ error: 'Counter bid not found or invalid' });
    }
  }

  @httpPut('/tenant/rcb/:id')
  async tenantRejectCounterBid(req: Request, res: Response) {
    const bidId = parseInt(req.params.id, 10);
    const rejectedCounterBid = await this.bidService.tenantRejectCounterBid(bidId);

    if (rejectedCounterBid) {
      res.status(200).json({ message: 'Tenant rejected counter bid successfully', rejectedCounterBid });
    } else {
      res.status(404).json({ error: 'Bid not found or invalid' });
    }
  }

  @httpPut('/ebp/:id')
  async endBiddingProcess(req: Request, res: Response) {
    const bidId = parseInt(req.params.id, 10);

    try {
      const biddingProcessEnded = await this.bidService.endBiddingProcess(bidId);
      res.status(200).json({ message: 'Bidding process ended successfully', biddingProcessEnded });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}