const express = require('express');
const router = express.Router();

const quizDB = require('./QuizDB');

router.get('/getallquizzes',(req,res)=>{
    res.json(quizDB.getAllQuizzes());
});

router.get('/getquiz',(req,res)=>{
    let {quizId} = req.query;
    let quiz = quizDB.getQuiz(parseInt(quizId));
    if(quiz){
        quiz = {
            id:quiz.id,
            title:quiz.title,
            marksEach:quiz.marksEach,
            questionCount:quiz.questionCount,
            questions:quiz.questions.map(qut=>{
                return {
                    id:qut.id,
                    des:qut.des,
                    options:qut.options
                };
            })
        }
        console.log(quiz);
        res.json({quiz});
    }
    else{
        res.json({quiz});
    }
});

router.get('/takequiz',(req,res)=>{
    const {quizId} = req.query;
    res.json(quizDB.TakeQuiz(parseInt(quizId),req?.session?.user?.id));
});

router.get('/addanswer',(req,res)=>{
    const userId = req?.session?.user?.id;
    const {quizId,optionId,questionId} = req.query;
    const response = quizDB.addAnswer(parseInt(quizId),userId,parseInt(questionId),parseInt(optionId));
    res.send({response});
});

router.get('/getmarks',(req,res)=>{
    const {quizId} = req.query;
    const userId = req?.session?.user?.id;
    res.json({marks:quizDB.getMarks(userId,parseInt(quizId))});
});

router.get('/getleaderboard',(req,res)=>{
    const {quizId} = req.query;
    res.json(quizDB.getLeaderBoard(parseInt(quizId)));
})

module.exports = router;