// utils/cron.js
const cron = require('node-cron');
const Manager = require('../models/Manager');

const cronJob = cron.schedule('*/30 * * * * *', async () => {
  try {
    await Manager.update({ occurrence: 1 }, { where: {} });
    console.log('Occurrence updated successfully.');
  } catch (error) {
    console.error('Error updating occurrence:', error);
  }
});

module.exports = cronJob;
