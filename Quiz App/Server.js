const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const fs = require('fs');


const auth = require('./Auth');
const admin = require('./Admin');
const Users = require('./User');
const adminQuizRoute = require('./AdminQuizRouter');
const userQuizRouter = require('./UserQuizRouter');

var app = express();

app.use(session({secret:'This is secret'}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());


app.use('/auth',auth);
app.use('/admin/*',admin);
app.use('/user/*',Users);
app.use('/admin',adminQuizRoute);
app.use('/user',userQuizRouter);

app.use('/admin/QuizList',express.static('public/Admin/QuizList'));
app.use('/admin/QuizEdit',express.static('public/Admin/QuizEdit'));

app.use('/user/QuizList',express.static('public/User/QuizList'));
app.use('/user/QuizView',express.static('public/User/QuizView'));
app.use('/user/LeaderBoard',express.static('public/User/LeaderBoard'));

app.get('/',(req,res)=>{
    if(req?.session?.user?.type == 'admin'){
        res.redirect('/admin/QuizList/');
    }
    else if(req?.session?.user?.type == 'user'){
        res.redirect('/user/QuizList');
    }
    else{
        fs.readFile('public/index.html',(err,data)=>{
            if(err){
                console.log(JSON.stringify);
                res.send('<p>Error occured</p>')
            }
            else{
                res.send(data.toString());
            }
        });
    }
});

const port = 3000;

app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
})