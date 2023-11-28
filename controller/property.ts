import { Request, Response, NextFunction } from 'express';
import { controller, httpGet, httpPost, httpPut, httpDelete } from 'inversify-express-utils';
import { UniqueConstraintError } from 'sequelize';
import { inject } from 'inversify';
import TYPES from '../main/types';
import { PropertyService } from '../service/property';
import { authenticate } from '../middle/auth';
import { CustomRequest } from '../middle/custom';

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

  @httpPost('/', authenticate)
  async createProperty(req: CustomRequest, res: Response) {
    try {
      if (!req.landlordId) {
        return res.status(403).json({ error: 'Forbidden. Only landlords can post properties.' });
      }

      const newProperty = await this.propertyService.createProperty(req, req.body);
      res.status(201).json({ message: 'property created successfully', newProperty });
    } catch (error) {
      console.error(error);
      if (error instanceof UniqueConstraintError) {
        return res.status(400).json({ error: 'property already exists.' });
      }
      res.status(500).json({ error: 'internal server error' });
    }
  }

  @httpPut('/:id')
  async updateProperty(req: Request, res: Response) {
    const propertyId = parseInt(req.params.id, 10);
    const updatedProperty = await this.propertyService.updateProperty(propertyId, req.body);

    if (updatedProperty) {
      res.status(201).json({ message: 'property updated successfully', updatedProperty });
    } else {
      res.status(404).json({ error: 'property not found' });
    }
  }

  @httpDelete('/:id')
  async deleteProperty(req: Request, res: Response) {
    const propertyId = parseInt(req.params.id, 10);
    await this.propertyService.deleteProperty(propertyId);
    res.sendStatus(200).json({ message: 'property deleted successfully' });
  }


  public checkPropertyExists = async (req: CustomRequest, res: Response, next: NextFunction) => {
    const propertyId = req.body.propertyId;
  
    try {
      if (!propertyId) {
        return res.status(400).json({ error: 'Property ID is required.' });
      }
  
      /*if (!this.propertyService) {
        console.error('propertyService is not defined');
        return res.status(500).json({ error: 'Internal server error' });
      }*/
  
      const property = await this.propertyService.getPropertyById(propertyId);
  
      if (!property) {
        return res.status(404).json({ error: 'Property not found.' });
      }
  
      next();
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
}

const propertyService = new PropertyService();
const propertyController = new PropertyController(propertyService);

export default propertyController;