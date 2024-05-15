const Manager = require('../models/Manager');
module.exports = function (app) {
  app.get('/admins/managers', async (req, res) => {
    const managers = await Manager.findAll();
    res.render('admin/managers', { managers });
  });
  // Reset occurrence route
  app.put('/admins/reset/:managerId', async (req, res) => {
    const managerId = req.params.managerId;
    await Manager.update({ occurrence: 1 }, { where: { id: managerId } });
    res.send('Occurrence reset');
  });
};
