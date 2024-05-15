const { ensureAuthenticatedAndAdmin } = require('../middelware/middlewares');
const Manager = require('../models/Manager');
module.exports = function (app) {
  app.get('/admins/managers', ensureAuthenticatedAndAdmin, async (req, res) => {
    const managers = await Manager.findAll();
    res.render('admin/managers', { managers, user: req.session.user });
  });
  // Reset occurrence route
  app.put(
    '/admins/reset/:managerId',
    ensureAuthenticatedAndAdmin,
    async (req, res) => {
      const managerId = req.params.managerId;
      await Manager.update({ occurrence: 1 }, { where: { id: managerId } });
      res.send('Occurrence reset');
    }
  );
};
