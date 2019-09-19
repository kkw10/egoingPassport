const express = require('express');
const router = express.Router();
const template = require('../lib/template');
const auth = require('../lib/auth');

router.get('/', (req, res) => {
    console.log('/', req.user);
    let fmsg = req.flash();
    let feedback = '';
  
    if(fmsg.success) {
      feedback = fmsg.success[0];
    }    

    let title = 'Welcome';
    let description = 'Hello, Node.js';
    let list = template.list(req.list);
    let html = template.HTML(title, list,
      `<div style="color:blue;">${feedback}</div>
       <h2>${title}</h2>${description}
       <img src="/images/room.jpg" style="width:500px; display:block; margin-top:10px" />
      `,
      `<a href="/topic/create">create</a>`,
      auth.statusUI(req, res)
    );
  
    res.send(html)
})

module.exports = router;