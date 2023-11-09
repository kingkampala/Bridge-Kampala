import { Request, Response } from 'express';
import { controller, httpGet, httpPost, httpPut, httpDelete } from 'inversify-express-utils';
import { inject } from 'inversify';
import TYPES from '../main/types';
import { PropertyService } from '../service/property';

@controller('/properties')
export class PropertyController {
  constructor(@inject(TYPES.PropertyService) private propertyService: PropertyService) {}

  @httpGet('/')
  async getAllProperties(req: Request, res: Response) {
    const properties = await this.propertyService.getAllProperties();
    res.json(properties);
  }

  @httpGet('/:id')
  async getPropertyById(req: Request, res: Response) {
    const propertyId = parseInt(req.params.id, 10);
    const property = await this.propertyService.getPropertyById(propertyId);
    res.json(property);
  }

  @httpPost('/')
  async createProperty(req: Request, res: Response) {
    const newProperty = await this.propertyService.createProperty(req.body);
    res.status(201).json(newProperty);
  }

  @httpPut('/:id')
  async updateProperty(req: Request, res: Response) {
    const propertyId = parseInt(req.params.id, 10);
    const updatedProperty = await this.propertyService.updateProperty(propertyId, req.body);
    res.json(updatedProperty);
  }

  @httpDelete('/:id')
  async deleteProperty(req: Request, res: Response) {
    const propertyId = parseInt(req.params.id, 10);
    await this.propertyService.deleteProperty(propertyId);
    res.sendStatus(204);
  }
}