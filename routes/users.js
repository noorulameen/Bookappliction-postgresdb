var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res) {
  res.send('respond with a resource');
});

router.get('/login', function(req, res){
  var message = (!!req.session && !!req.session.messages) ? req.session.messages : '';
  if(message != null)
    req.session.messages = null 
	
  res.render('login', { user: req.user, message: message  });
});

router.post('/login', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) { return next(err) }
    if (!user) {
      req.session.messages =  [info.message];	  
      return res.redirect('/users/login')
    }
    req.logIn(user, function(err) {
      if (err) { return next(err); }
      return res.redirect('/');
    });
  })(req, res, next);
});

router.get('/logout', function(req, res){
	console.log(req.session);
	
  delete req.session.s_cus_list;
  delete req.session.s_sp_list;
  delete req.session.s_carr_list;
  delete req.session.s_period1;
  delete req.session.s_period2;
  delete req.session.s_location_org;
  delete req.session.s_location_dis;
  req.logout();
  res.redirect('/');
});

module.exports = router;
