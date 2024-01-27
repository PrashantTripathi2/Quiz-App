const {getName} = require('./userDB');

const max_question_count = 5;
const max_marks_each_question = 10;

var Quiz = [];
var QuizId = 0;
var QuestionId = 0;
var OptionId = 0;

var QuizAnswers = [];


// Quiz={
//     id:0,
//     title:'',
//     marksEach:0,
//     questionCount:0,
//     questions:[
//         {
//             id:0,
//             des:'',
//             options:[
//                 {
//                     id:0,
//                     des:'',
//                 }
//             ],
//             rightOption:{
//                 id:0,
//                 des:''
//             }
//         }
//     ],
// }

function insertQuiz(title) {
    let quiz = {
        id: QuizId,
        marksEach:10,
        title: title,
        questionCount: 0,
        questions: []
    };
    Quiz.push(quiz);
    QuizId += 1;
    return quiz.id;
}

function updateQuiz(newTitle, quizId) {
    let len = Quiz.length;
    for (let i = 0; i < len; i++) {
        if (Quiz[i].id == quizId) {
            Quiz[i].title = newTitle;
            return true;
        }
    }
    return false;
}

function removeQuiz(quizId) {
    let len = Quiz.length;
    Quiz = Quiz.filter((quiz) => {
        if (quiz.id != quizId) return true;
        return false;
    });
    if(Quiz.length != len)return true;
    return false;
}

function getAllQuizzes() {
    const q = Quiz.map((quiz) => {
        return { id: quiz.id, title: quiz.title };
    });
    return q;
}

function getQuiz(id) {
    const q = Quiz.find((quiz) => {
        if (quiz.id == id) return quiz;
    });
    if (q)
        return q;
    return null;
}

function insertQuestion(quizId, questionDescription = '') {
    const quiz = Quiz.find((quiz) => quiz.id === quizId);
    if (!quiz) {
        return null;
    }
    if (quiz.questionCount == max_question_count) return null;
    const question = {
        id: QuestionId,
        des: questionDescription,
        options: [],
        rightOption: null,
    };
    QuestionId += 1;
    quiz.questions.push(question);
    quiz.questionCount += 1;
    return question.id;
}

function updateQuestion(questionId, newDescription) {
    for (const quiz of Quiz) {
        const questionToUpdate = quiz.questions.find((question) => question.id === questionId);

        if (questionToUpdate) {
            questionToUpdate.des = newDescription;
            return true;
        }
    }
    return false;
}

function removeQuestion(questionId) {
    for (const quiz of Quiz) {
        const originalLength = quiz.questions.length;

        quiz.questions = quiz.questions.filter((question) => question.id !== questionId);

        if (quiz.questions.length !== originalLength) {
            quiz.questionCount -= 1;
            return true;
        }
    }
    return false;
}

function insertOption(questionId, optionDescription = '') {
    for (const quiz of Quiz) {
        const question = quiz.questions.find((q) => q.id === questionId);

        if (question) {
            const option = {
                id: OptionId,
                des: optionDescription,
            };

            OptionId += 1;

            question.options.push(option);

            return option.id;
        }
    }
    return null;
}

function updateOption(optionId, newDescription) {
    for (const quiz of Quiz) {
        for (const question of quiz.questions) {
            const optionToUpdate = question.options.find((option) => option.id === optionId);

            if (optionToUpdate) {
                optionToUpdate.des = newDescription;
                return true;
            }
        }
    }
    return false;
}

function removeOption(questionId, optionId) {
    for (const quiz of Quiz) {
        const question = quiz.questions.find((q) => q.id === questionId);

        if (question) {
            question.options = question.options.filter((option) => option.id !== optionId);
            return true;
        }
    }
    return false;
}

function insertRightOption(questionId, rightOptionId) {
    for (const quiz of Quiz) {
        const question = quiz.questions.find((q) => q.id === questionId);

        if (question) {
            for(const opt of question.options){
                if(opt.id == rightOptionId){
                    const rightOption = {
                        id: rightOptionId,
                    };
                    question.rightOption = rightOption;
                    return true;  
                }
            }
            return false;
        }
    }
    return false;
}

function updateRightOption(questionId, rightOptionId) {
    for (const quiz of Quiz) {
        const question = quiz.questions.find((q) => q.id === questionId);

        if (question) {
            if (question.rightOption) {
                question.rightOption.id = rightOptionId;
                return true;
            } else {
                const rightOption = {
                    id: rightOptionId,
                };
                question.rightOption = rightOption;
                return true;
            }
        }
    }
    return false;
}

function insertMarks(quizId,marks){
    if(marks > max_marks_each_question || marks < 0)return false;
    for(const quiz of Quiz){
        if(quiz.id == quizId){
            quiz.marksEach = marks;
            return true;
        }
    }
    return false;
}

//User Answers

// QuizAnswer = {
//     quizId:0,
//     userId:0,
//     marks:0,
//     answers:[
//         {
//             optionId:0,
//             questionId:0,
//         }
//     ]
// }


function TakeQuiz(quizId,userId){
    const quizanswer = QuizAnswers.find(ans=>{
        if(ans.quizId == quizId && ans.userId == userId)return true;
    });
    if(quizanswer) return {answers:quizanswer.answers};
    QuizAnswers.push({quizId,userId,marks:0,answers:[]});
    return {answers:QuizAnswers[QuizAnswers.length-1].answers};
}

function addAnswer(quizId,userId,questionId,optionId){
    const quizanswer = QuizAnswers.find(ans=>{
        if(ans.quizId == quizId && ans.userId == userId)return true;
    });
    if(quizanswer){
        const answer = quizanswer.answers.find(ans=>{
            if(ans.questionId == questionId)return true;
        });
        if(answer){
            answer.optionId = optionId;
        }
        else{
            const newanswer = {
                questionId,optionId
            };
            quizanswer.answers.push(newanswer);
        }
        return true;
    }
    else return false;
}

function getMarks(userId,quizId){
    let mark = 0;
    const quiz = Quiz.find(q=>{
        return q.id == quizId;
    });
    const ans = QuizAnswers.find(ans=>{
        return ans.userId == userId && ans.quizId == quizId
    });
    if(quiz !=null && ans != null){
        let count = 0;
        const rightOpt = quiz.questions.map(q=>{
            return q.rightOption;
        });
        for(let i=0;i<rightOpt.length;i++){
            for(let j=0;j<ans.answers.length;j++){
                if(rightOpt[i]?.id == ans.answers[j]?.optionId)count+=1;
            }
        }
        ans.marks = quiz.marksEach*count;
        return quiz.marksEach*count;
    }
    else
    return mark;
}

function getLeaderBoard(quizId){
    let quizanswers = QuizAnswers.filter(quizans=>{
        return quizans.quizId == quizId;
    });
    quizanswers = quizanswers.map(quizans=>{
        return {userId:quizans.userId,marks:quizans.marks,name:getName(quizans.userId)};
    });
    return quizanswers;
}

module.exports = {
    insertQuiz,
    updateQuiz,
    removeQuiz,
    getAllQuizzes,
    getQuiz,
    insertQuestion,
    updateQuestion,
    removeQuestion,
    insertOption,
    updateOption,
    removeOption,
    insertRightOption,
    updateRightOption,
    insertMarks,
    TakeQuiz,
    addAnswer,
    getMarks,
    getLeaderBoard
}