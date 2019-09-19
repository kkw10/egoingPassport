const express = require('express');
const router = express.Router();
const template = require('../lib/template');

const authData = {
  email: 'test123@gmail.com',
  password: '123',
  nickname: 'tester'
}

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

router.post('/login_process', (req, res) => {
  let post = req.body;
  let email = post.email;
  let password = post.pwd;
  
  if(email === authData.email && password === authData.password) {
    req.session.is_logined = true;
    req.session.nickname = authData.nickname;
    req.session.save(() => {
      res.redirect(`/`)  
    })
    
  } else {
    res.send("Who are you?")
  }
})

router.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    res.redirect('/')
  })
})

module.exports = router;