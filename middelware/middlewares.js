// Middleware function to prevent access to the login page and index views if the user is already authenticated.
function checkIsAuthenticated(req, res, next) {
  if (!req.session.user) {
    // If the user is not authenticated, proceed to the next middleware.
    return next();
  }
  // If the user is authenticated, check if they are an admin.
  if (req.session.user.isAdmin) {
    // If the user is an admin, redirect to the admin dashboard.
    res.redirect('/admins/managers');
  } else {
    // If the user is not an admin, redirect to the manager dashboard.
    res.redirect('/manager/dashboard');
  }
}

// Middleware function to ensure that the user is authenticated.
// Use this middleware on any resource that needs to be protected.
// If the request is authenticated
// the request will proceed.
// Otherwise, the user will be redirected to the login page.
function ensureAuthenticated(req, res, next) {
  if (req.session.user) {
    return next();
  }
  res.redirect('/');
}

// Middleware function to ensure that the user is an admin.
// Use this middleware on any resource that requires admin privileges.
// If the request is from an admin (req.session.user.isAdmin == true see routes/auth.routes.js line 30),
// the request will proceed.
// Otherwise, the user will be redirected to the index page and from there to default view because he is authenticated .
function ensureAuthenticatedAndAdmin(req, res, next) {
  ensureAuthenticated(req, res, () => {
    if (req.session.user.isAdmin) {
      next();
    } else {
      res.redirect('/');
    }
  });
}

function ensureAuthenticatedAndManager(req, res, next) {
  ensureAuthenticated(req, res, () => {
    if (!req.session.user.isAdmin) {
      //! can be changed by adding isManager to the session Or adding userType
      next();
    } else {
      res.redirect('/');
    }
  });
}
module.exports = {
  ensureAuthenticated,
  ensureAuthenticatedAndAdmin,
  ensureAuthenticatedAndManager,
  checkIsAuthenticated,
};
