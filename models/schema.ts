const { Sequelize, DataTypes, Model } = require('sequelize');
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();

const db = process.env.DB_URL;

const sequelize = new Sequelize(db, {
  dialect: 'postgres',
});

export class User extends Model {
  id!: number;
  name!: string;
  email!: string;
  password!: string;
  userType!: 'landlord' | 'tenant';
}

User.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  userType: {
    type: DataTypes.ENUM('landlord', 'tenant'),
    allowNull: false,
  },
}, {
  sequelize,
  modelName: 'User',
  tableName: 'users',
  hooks: {
    beforeValidate: (user: User) => {
      if (user.changed('password')) {
        const hashedPassword = bcrypt.hashSync(user.password, 10);
        user.password = hashedPassword;
      }
    },
  }
});

export class Property extends Model {
  id!: number;
  landlordId!: number;
  price!: number;
  location!: string;
  rooms!: number;
  amenities!: string[] | null;
  images!: string[] | null;
  videos!: string[] | null;
}

Property.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  landlordId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  location: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  rooms: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  amenities: {
    type: DataTypes.ARRAY(DataTypes.STRING),
  },
  images: {
    type: DataTypes.ARRAY(DataTypes.STRING),
  },
  videos: {
    type: DataTypes.ARRAY(DataTypes.STRING),
  },
}, {
  sequelize,
  modelName: 'Property',
  tableName: 'properties'
});

export class Bid extends Model {
  id!: number;
  propertyId!: number;
  tenantId!: number;
  bidAmount!: number;
  status!: 'open' | 'accepted' | 'rejected' | 'countered';
  counterBidAmount!: number | null;
}

Bid.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  propertyId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  tenantId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  bidAmount: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('open', 'accepted', 'rejected', 'countered'),
    allowNull: false,
  },
  counterBidAmount: {
    type: DataTypes.FLOAT,
  },
}, {
  sequelize,
  modelName: 'Bid',
  tableName: 'bids'
});

User.hasMany(Property, { foreignKey: 'landlordId' });
User.hasMany(Bid, { foreignKey: 'tenantId' });

Property.belongsTo(User, { foreignKey: 'landlordId' });
Bid.belongsTo(User, { foreignKey: 'tenantId' });

Property.hasMany(Bid, { foreignKey: 'propertyId' });
Bid.belongsTo(Property, { foreignKey: 'propertyId' });

export class Transaction extends Model {
  id!: number;
  propertyId!: number;
  tenantId!: number;
  landlordId!: number;
  bidId!: number;
  transactionAmount!: number;
  status!: 'initiated' | 'completed';
}

Transaction.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  propertyId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  tenantId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  landlordId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  bidId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  transactionAmount: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('initiated', 'completed'),
    allowNull: false,
  },
}, {
  sequelize,
  modelName: 'Transaction',
  tableName: 'transactions'
});