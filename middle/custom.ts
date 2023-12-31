import { Request } from 'express';

export interface CustomRequest extends Request {
  landlordId?: number;
  tenantId?: number;
  propertyId?: number;
}