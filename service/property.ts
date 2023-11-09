import { injectable } from 'inversify';
import { Property } from '../models/schema';

@injectable()
export class PropertyService {
  async getAllProperties() {
    return Property.findAll();
  }

  async getPropertyById(propertyId: number) {
    return Property.findByPk(propertyId);
  }

  async createProperty(propertyData: any) {
    return Property.create(propertyData);
  }

  async updateProperty(propertyId: number, propertyData: any) {
    await Property.update(propertyData, { where: { id: propertyId } });
    return Property.findByPk(propertyId);
  }

  async deleteProperty(propertyId: number) {
    await Property.destroy({ where: { id: propertyId } });
  }
}