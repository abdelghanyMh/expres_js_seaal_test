'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Managers', [
      {
        name: 'manager_1',
        email: 'example1@example.com',
        password: 'usebcrypt_1',
        occurrence: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'manager_2',
        email: 'example2@example.com',
        password: 'usebcrypt_2',
        occurrence: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'manager_3',
        email: 'example3@example.com',
        password: 'usebcrypt_3',
        occurrence: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'manager_4',
        email: 'example4@example.com',
        password: 'usebcrypt_4',
        occurrence: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Managers', null, {});
  },
};
