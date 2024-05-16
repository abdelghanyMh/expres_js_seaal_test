const { ensureAuthenticatedAndManager } = require('../middelware/middlewares');
const Manager = require('../models/Manager');
module.exports = function (app) {
  app.get('/manager/dashboard', ensureAuthenticatedAndManager, (req, res) => {
    // console.log(req.session.user);
    res.render('manager/dashboard', {
      user: req.session.user,
    });
  });
  // Reset occurrence route
  app.post('/manager/send', async (req, res) => {
    try {
      const manager = await Manager.findOne({
        where: { id: req.body.managerId },
      });
      // console.log('response___>' + manager.occurrence);

      if (!manager) {
        return res
          .status(404)
          .render('error', { message: 'Manager not found' });
      }
      const currentDate = new Date();
      const currentHour = currentDate.getHours();
      console.warn(currentHour >= 10 && manager.occurrence === 0);
      if (currentHour >= 10 && manager.occurrence === 0) {
        await Manager.update(
          { occurrence: 1 },
          { where: { id: req.body.managerId } }
        );
        return res.send('Your message has been sent to  your administrator !');
      }
      if (manager.occurrence === 1) {
        await Manager.update(
          { occurrence: 0 },
          { where: { id: req.body.managerId } }
        );
        return res.send('Your message has been sent to  your administrator !');
      } else {
        const nextResetTime = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          currentDate.getDate() + 1,
          10,
          0,
          0
        );
        return res.send(
          `Sorry, you have to wait until ${nextResetTime.toLocaleString()} for your next click or contact your administrator.`
        );
      }
    } catch (err) {
      console.error(err);
      return res
        .status(500)
        .render('error', { message: 'Internal server error' });
    }
  });
};
