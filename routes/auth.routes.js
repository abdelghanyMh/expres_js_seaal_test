const Admin = require('../models/Admin');
const Manager = require('../models/Manager');
const { generateToken, comparePasswords } = require('../utils/auth');
module.exports = function (app) {
  // Admin login route
  app.get('/admin/login', (req, res) => {
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
      const token = generateToken({ adminId: admin.id });
      req.session.adminToken = token;
      return res.redirect('/admins/managers');
    } catch (err) {
      console.error(err);
      return res
        .status(500)
        .render('error', { message: 'Internal server error' });
    }
  });
  // Manager login route
  app.get('/manager/login', (req, res) => {
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
      const token = generateToken({ managerId: manager.id });
      req.session.managerToken = token;
      return res.redirect('/manager/dashboard');
    } catch (err) {
      console.error(err);
      return res
        .status(500)
        .render('error', { message: 'Internal server error' });
    }
  });
};
