const express = require('express');
const db = require('./userDB');
const router = express.Router();

router.post('/login',(req,res)=>{
    console.log(req.body);
    var user = db.match(req.body.loginUsername,req.body.loginPassword); 
    if(user){
        req.session.user = user;
        if(user.type == 'admin'){
            res.redirect('/admin/QuizList/');
        }
        else{
            res.redirect('/user/QuizList');
        }
    }
    else{
        res.redirect('/');
    }
});

router.post('/signup',(req,res)=>{
    console.log(req.body);
    let user = db.AddUser(req.body.signupUsername,req.body.signupPassword);
    if(user){
        req.session.user = user;
        if(user.type == 'admin'){
            res.redirect('/admin/QuizList/');
        }
        else{
            res.redirect('/user/QuizList');
        }
    }
    else{
        res.send('Error');
    }
});

router.get('/logout',(req,res)=>{
    req.session.user = null;
    res.redirect('/');
});

module.exports = router;