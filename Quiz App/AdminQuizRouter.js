const express = require('express');
const router = express.Router();

const quizDB = require('./QuizDB');



//Quiz related API

router.get('/addquiz',(req,res)=>{
    let quizId = quizDB.insertQuiz(req.query.title);
    res.json({quizId});
});

router.get('/updatequiz',(req,res)=>{
    let response = quizDB.updateQuiz(req.query.newtitle,parseInt(req.query.quizId));
    res.send({response});
});

router.get('/removequiz',(req,res)=>{
    let response = quizDB.removeQuiz(parseInt(req.query.quizId));
    res.send({response});
});

router.get('/getallquizzes',(req,res)=>{
    res.json(quizDB.getAllQuizzes());
});

router.get('/getquiz',(req,res)=>{
    res.json({quiz:quizDB.getQuiz(parseInt(req.query.quizId))});
});


//Quiz Question related api

router.get('/addquestion',(req,res)=>{
    var {quizId,questiondes} = req.query;
    var questionId = quizDB.insertQuestion(parseInt(quizId),questiondes);
    res.json({questionId});
});

router.get('/updatequestion',(req,res)=>{
    var {questionId,des} = req.query;
    var response = quizDB.updateQuestion(parseInt(questionId),des);
    res.json({response});
});

router.get('/removequestion',(req,res)=>{
    var {questionId} = req.query;
    var response = quizDB.removeQuestion(parseInt(questionId));
    res.json({response});
});

router.get('/adddumyquestion',(req,res)=>{
    let {quizId} = req.query;
    let question = quizDB.addDumyQuestion(parseInt(quizId))
    res.json({question});
});

//Quiz Option related Api

router.get('/addoption',(req,res)=>{
    var {questionId,optiondes} = req.query;
    let optionId = quizDB.insertOption(parseInt(questionId),optiondes);
    res.json({optionId});
});

router.get('/updateoption',(req,res)=>{
    let {optionId,des} = req.query;
    let response = quizDB.updateOption(parseInt(optionId),des);
    res.json({response});
});

//Quiz Right Option related Api

router.get('/addrightoption',(req,res)=>{
    let {questionId,rightoptionId} = req.query;
    let response = quizDB.insertRightOption(parseInt(questionId),parseInt(rightoptionId));
    res.json({response});
});


//Quiz Marks related Api

router.get('/addmarks',(req,res)=>{
    let {quizId,marks} = req.query;
    let response = quizDB.insertMarks(parseInt(quizId),parseInt(marks));
    res.json({response});
});


module.exports = router;