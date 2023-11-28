import { injectable } from 'inversify';
import { Property } from '../models/schema';
import { CustomRequest } from '../middle/custom';
import { User } from '../models/schema';

@injectable()
export class PropertyService {
  async getAllProperties() {
    return Property.findAll();
  }

  async getPropertyById(propertyId: number) {
    return Property.findByPk(propertyId);
  }

  async createProperty(req: CustomRequest, propertyData: { price: number; location: string; rooms: number; amenities: string[]; images: string[]; videos: string[] }) {
    const property = new Property();
    property.landlordId = req.landlordId;

    const landlord = await User.findByPk(req.landlordId);
    if (landlord) {
      property.landlordId = landlord.id;
    } else {
      throw new Error('landlord not found.');
    }

    property.price = propertyData.price;
    property.location = propertyData.location;
    property.rooms = propertyData.rooms;
    property.amenities = propertyData.amenities;
    property.images = propertyData.images;
    property.videos = propertyData.videos;
    return property.save();
  }

  async updateProperty(propertyId: number, propertyData: any) {
    await Property.update(propertyData, { where: { id: propertyId } });
    return Property.findByPk(propertyId);
  }

  async deleteProperty(propertyId: number) {
    await Property.destroy({ where: { id: propertyId } });
  }

  async getLandlordEmail(propertyId: number): Promise<string | null> {
    const property = await Property.findByPk(propertyId);

    if (property) {
      const landlord = await User.findByPk(property.landlordId);

      if (landlord) {
        return landlord.email;
      }
    }

    return null;
  }

}