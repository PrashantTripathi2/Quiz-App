// QuizeView.js

function RandomSeq(to) {
    const set = new Set();
    while(set.size != to){
        set.add(parseInt(Math.random()*to));
    }
    return set;
}

function createQuize(quiz) {
    var Title = document.getElementById('title');
    var mark = document.getElementById('marks');
    var questions = document.getElementById('Questions');
    Title.innerHTML = quiz.title;
    mark.innerHTML = 'Each Questions:' + quiz.marksEach + ' Marks';
    const random_question = RandomSeq(quiz.questionCount);
    random_question.forEach((i)=>{
        let random_options = [...RandomSeq(4)];
        questions.appendChild(Built(quiz.questions[i], quiz.questions[i].options,random_options));
    })
}

function Built(question, options,random) {
    const ele = document.createElement('div');
    ele.className = 'Question-Options';
    ele.id=question.id;
    var question = `
        <div class='Question'>
           Q. ${question.des}
        </div>
        <div class='Options'>
            <span class='Option'><input type='radio' class='Tick' id=${options[random[0]].id} />${options[random[0]].des}</span>
            <span class='Option'><input type='radio' class='Tick' id=${options[random[1]].id} />${options[random[1]].des}</span>
            <span class='Option'><input type='radio' class='Tick' id=${options[random[2]].id} />${options[random[2]].des}</span>
            <span class='Option'><input type='radio' class='Tick' id=${options[random[3]].id} />${options[random[3]].des}</span>
        </div>`;
    ele.innerHTML = question;
    return ele;
}


function setOption(ele) {
    var parent = ele.parentElement.parentElement;
    var allRadio = document.getElementsByClassName('Tick');
    for (let i = 0; i < allRadio.length; i++) {
        if (allRadio[i].parentElement.parentElement == parent && allRadio[i] != ele) {
            allRadio[i].checked = false;
        }
    }
}


async function getQuiz() {
    const quizId = new URLSearchParams(window.location.search).get('id');
    const res = await fetch(`http://${window.location.hostname}:${window.location.port}/user/getquiz?quizId=${parseInt(quizId)}`);
    const {quiz} = await res.json();
    return quiz;
}

async function addAnswer(questionId,optionId){
    const quizId = new URLSearchParams(window.location.search).get('id');
    const query = `quizId=${quizId}&questionId=${questionId}&optionId=${optionId}`;
    const res = await fetch(`http://${window.location.hostname}:${window.location.port}/user/addanswer?${query}`);
    const {response} = await res.json();
    return response;
}

async function TakeQuiz(){
    const quizId = new URLSearchParams(window.location.search).get('id');
    const query = `quizId=${quizId}`;
    const res = await fetch(`http://${window.location.hostname}:${window.location.port}/user/takequiz?${query}`);
    const {answers} = await res.json();
    return answers;
}

async function OptionTick(ele){
    const quizId = new URLSearchParams(window.location.search).get('id');
    const optionId = ele.id;
    const all = [...document.querySelectorAll('.Question-Options')];
    const find = all.find(e=>{
        return e.contains(ele);
    });
    if(find){
        const questionId = find.id;
        const query = `quizId=${quizId}&questionId=${questionId}&optionId=${optionId}`;
        console.log(`QuizId:${quizId} and QuestionId:${find.id} and OptionId:${ele.id}`);
        const res = await fetch(`http://${window.location.hostname}:${window.location.port}/user/addanswer?${query}`);
        const {response} = await res.json();
        return response;
    }
}

document.body.addEventListener('click',async (evt)=>{
    const ele = evt.target;
    if(ele.className == 'Tick'){
        if(await OptionTick(ele))
        setOption(ele);
        else ele.checked = false;
    }
})

window.onload = async(evt)=>{
    const quiz = await getQuiz();
    const prevans = await TakeQuiz();
    createQuize(quiz);
    const alloptions = [...document.querySelectorAll('.Tick')];
    for(x of prevans){
        let tick = alloptions.find(e=>{
            return parseInt(e.id) == x.optionId; 
        });
        if(tick){
            tick.checked = true;
        }
    }
    console.log(quiz);
    console.log(prevans);
}

document.getElementById('Submit').addEventListener('click',async()=>{
    const quizId = new URLSearchParams(window.location.search).get('id');
    const res = await fetch(`http://${window.location.hostname}:${window.location.port}/user/getmarks?quizId=${quizId}`);
    const {marks} = await res.json();
    const score = document.getElementsByClassName('score')[0];
    score.innerHTML = `Marks is ${marks} `
    score.style.display = 'block';
    console.log('Mark is ',marks);
})