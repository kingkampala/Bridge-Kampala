'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('transactions', {
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
      landlordId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      bidId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      transactionAmount: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM('initiated', 'completed'),
        allowNull: false,
        defaultValue: 'initiated',
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
    await queryInterface.dropTable('transactions');
  }
};