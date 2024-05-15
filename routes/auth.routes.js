const Admin = require('../models/Admin');
const Manager = require('../models/Manager');
const { comparePasswords } = require('../utils/auth');

const { checkIsAuthenticated } = require('../middelware/middlewares.js');

module.exports = function (app) {
  // Admin login route
  app.get('/admin/login', checkIsAuthenticated, (req, res) => {
    res.render('admin/login');
  });
  app.post('/admin/login', async (req, res) => {
    console.log(req.body);
    const { email, password } = req.body;
    try {
      const admin = await Admin.findOne({ where: { email } });
      if (!admin) {
        return res.render('admin/login', {
          error: 'Invalid email !',
        });
      }
      const isValidPassword = await comparePasswords(password, admin.password);
      if (!isValidPassword) {
        return res.render('admin/login', {
          error: 'Invalid password',
        });
      }
      delete admin.dataValues.password;
      // console.log(admin.dataValues);

      req.session.user = admin.dataValues;
      req.session.user.isAdmin = true;
      return res.redirect('/admins/managers');
    } catch (err) {
      console.error(err);
      return res
        .status(500)
        .render('error', { message: 'Internal server error' });
    }
  });
  // Manager login route
  app.get('/manager/login', checkIsAuthenticated, (req, res) => {
    res.render('manager/login');
  });
  app.post('/manager/login', async (req, res) => {
    const { email, password } = req.body;
    try {
      const manager = await Manager.findOne({ where: { email } });
      if (!manager) {
        return res.render('manager/login', {
          error: 'Invalid email or password',
        });
      }
      const isValidPassword = await comparePasswords(
        password,
        manager.password
      );
      if (!isValidPassword) {
        return res.render('manager/login', {
          error: 'Invalid email or password',
        });
      }
      // Delete the password property
      delete manager.dataValues.password;
      // console.log(manager.dataValues);

      req.session.user = manager.dataValues;
      return res.redirect('/manager/dashboard');
    } catch (err) {
      console.error(err);
      return res
        .status(500)
        .render('error', { message: 'Internal server error' });
    }
  });

  //   logout route
  app.get('/logout', (req, res) => {
    // Clear session
    req.session.destroy((err) => {
      if (err) {
        console.error('Error destroying session:', err);
      }
      // Redirect to login page or any other appropriate action
      res.redirect('/');
    });
  });
};
