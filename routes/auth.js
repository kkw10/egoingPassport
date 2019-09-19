const express = require('express');
const router = express.Router();
const template = require('../lib/template');

router.get('/login', (req, res) => {
  let title = 'WEB - login';
  let list = template.list(req.list);
  let html = template.HTML(title, list, `
    <form action="/auth/login_process" method="post">
      <p><input type="text" name="email" placeholder="email"></p>
      <p><input type="password" name="pwd" placeholder="password"></p>
      <p>
        <input type="submit" value="login">
      </p>
    </form>
  `, '');
  res.send(html);
})

router.get('/logout', (req, res) => {
  req.logout();
  
  req.session.save(() => {
    res.redirect('/')
  })
})

module.exports = router;