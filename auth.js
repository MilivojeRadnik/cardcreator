const jwt = require('jsonwebtoken');

exports.authenticateToken = (req, res, next) => {
  const token = req.cookies.jwt;

  if (token == null)
    return res.render('login', { title: 'Login', errors: ['Unauthorized!'] });

  jwt.verify(
    token,
    process.env.ACCESS_TOKEN_SECRET || 'topsecret',
    (err, user) => {
      if (err)
        return res.render('login', {
          title: 'Login',
          errors: ['Unauthorized!'],
        }); // Forbidden
      req.user = user;
      next();
    }
  );
};
