'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('bids', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      propertyId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      tenantId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      bidAmount: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM('open', 'accepted', 'rejected', 'countered'),
        allowNull: false,
        defaultValue: 'open',
      },
      counterBidAmount: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('bids');
  }
};