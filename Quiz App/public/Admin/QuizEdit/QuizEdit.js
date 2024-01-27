// QuizeEdit.js
var Quiz = null;

window.onload = async (evt) => {
    const parameter = new URLSearchParams(window.location.search);
    await loadQuiz(parameter.get('id'));
    loadData();
    let isView = parameter.get('View');
    if(isView !='false'){
        var style = `
            .footer{
                display:none;
            }
            input{
                pointer-events: none;
            }
        `;
        var ele = document.createElement('style');
        ele.innerHTML+=style;
        document.body.appendChild(ele);
        document.getElementsByClassName('header')[0].innerHTML = 'Quiz View';
    }
}
async function loadQuiz(quizId) {
    // let quizId = sessionStorage.getItem('id');
    let res = await fetch(`http://${window.location.hostname}:${window.location.port}/admin/getQuiz?quizId=${quizId}`);
    let json = await res.json();
    if (json.quiz) {
        Quiz = json.quiz;
    }
    else {
        window.history.back();
    }
}
async function AddQuestion() {
    var questions = document.getElementById('Questions');
    questions.appendChild(Built());
}

function Built() {
    var questionsOptions = document.createElement('div');
    questionsOptions.className = 'Question-Options';
    var quize = `
        <div class='Question'>
           Q.<input  type='text' class='Edit-Question' placeholder='Enter Question'/>
        </div>
        <div class='Options'>
            <span class='Option'><input  type='text' class='Edit-Option' placeholder='Enter Option'/></span>
            <span class='Option'><input  type='text' class='Edit-Option' placeholder='Enter Option'/></span>
            <span class='Option'><input  type='text' class='Edit-Option' placeholder='Enter Option'/></span>
            <span class='Option'><input  type='text' class='Edit-Option' placeholder='Enter Option'/></span>
        </div>`;
    questionsOptions.innerHTML+=quize;
    return questionsOptions;
}




function loadData() {
    var questions = document.getElementById('Questions');
    var title = document.getElementById('title');
    var marks = document.getElementById('marks');
    title.value = Quiz.title;
    marks.value = Quiz.marksEach;
    for (let i = 0; i < Quiz.questionCount; i++) {
        questions.appendChild(Built());
    }
    let ques = document.getElementsByClassName('Edit-Question');
    let options = document.getElementsByClassName('Edit-Option');
    let optioncount = 0;
    for(let i=0;i<Quiz.questions.length;i++){
        ques[i].id = Quiz.questions[i].id;
        ques[i].value = Quiz.questions[i].des;
        options[i+optioncount].id = Quiz.questions[i]?.options[0]?.id;
        options[i+optioncount].value = Quiz.questions[i]?.options[0]?.des;
        options[i+optioncount+1].id = Quiz.questions[i]?.options[1]?.id;
        options[i+optioncount+1].value = Quiz.questions[i]?.options[1]?.des;
        options[i+optioncount+2].id = Quiz.questions[i]?.options[2]?.id;
        options[i+optioncount+2].value = Quiz.questions[i]?.options[2]?.des;
        options[i+optioncount+3].id = Quiz.questions[i]?.options[3]?.id;
        options[i+optioncount+3].value = Quiz.questions[i]?.options[3]?.des;
        optioncount+=3;
    }
    let len = options.length;
    let rightopt = Quiz.questions.map(q=>{
        return q?.rightOption?.id;
    })
    for(let i=0;i<len;i++){
        let f = rightopt.find(v=>{
            return v == parseInt(options[i].id);
        })
        if(f>=0){
            options[i].style.borderColor='green';
            options[i].style.borderWidth='5px';
        }
    }
}

async function updateMarks(ele) {
    let marks = ele.value;
    let res = await fetch(`http://${window.location.hostname}:${window.location.port}/admin/addmarks?quizId=${Quiz.id}&marks=${marks}`);
    let { response } = await res.json();
    if (!response) {
        ele.value = Quiz.marksEach;
    }
    else {
        Quiz.marksEach = ele.value;
    }
}

async function updateTitle(ele) {
    let title = ele.value;
    let res = await fetch(`http://${window.location.hostname}:${window.location.port}/admin/updatequiz?quizId=${Quiz.id}&newtitle=${title}`);
    let { response } = await res.json();
    if (!response) {
        ele.value = Quiz.title;
    }
    else {
        Quiz.title = ele.value;
    }
}

async function updateQuestion(ele) {
    let des = ele.value;
    if(ele.id){
        console.log('from updtae');
        let res = await fetch(`http://${window.location.hostname}:${window.location.port}/admin/updatequestion?questionId=${ele.id}&des=${des}`);
        let { response } = await res.json();
        if (response) {
            for (const question of Quiz.questions) {
                if (question.id == ele.id) {
                    question.des = ele.value;
                }
            }
        }
        else {
            for (const question of Quiz.questions) {
                if (question.id == ele.id) {
                    ele.value = question.des;
                }
            }
        }
    }
    else{
      await  insertQuestion(ele);
    }
}

async function insertQuestion(ele){
    let res = await fetch(`http://${window.location.hostname}:${window.location.port}/admin/addquestion?quizId=${Quiz.id}&questiondes=${ele.value}`);
    let {questionId} = await res.json();
    console.log('questionId:',questionId);
    if(questionId>=0){
        ele.id = questionId;
        console.log('ele id:',ele.id);
        const quest = {
            id:questionId,
            des:ele.value,
            options:[],
            rightOption:null
        }
        Quiz.questions.push(quest);
    }
    else{
        console.log('from else');
        ele.value = '';
    }
}

async function updateOption(ele){
    console.log(ele.value);
    if(ele.id !== "undefined" && ele.id !== ''){
         let res = await fetch(`http://${window.location.hostname}:${window.location.port}/admin/updateoption?optionId=${ele.id}&des=${ele.value}`);
         let {response} = await res.json();
         if(response){
            let flag = false;
            for(const qut of Quiz.questions){
                for(const opt of qut.options){
                    if(opt.id == ele.id){
                        opt.des = ele.value;
                        flag = true;
                        break;
                    }
                }
                if(flag)break;
            }
         }
         else{
            let flag = false;
            for(const qut of Quiz.questions){
                for(const opt of qut.options){
                    if(opt.id == ele.id){
                        ele.value = opt.des;
                        flag = true;
                        break;
                    }
                }
                if(flag)break;
            }
         }
    }
    else{
        await insertOption(ele);
    }
}

async function insertOption(ele){
    let questionId = ele.parentElement.parentElement.parentElement.firstElementChild.firstElementChild.id;
    console.log(questionId);
    if(questionId){
        let res = await fetch(`http://${window.location.hostname}:${window.location.port}/admin/addoption?questionId=${questionId}&optiondes=${ele.value}`);
        let {optionId} = await res.json();
        console.log('option id:',optionId)
        if(optionId>=0){
            const opt = {
                id:optionId,
                des:ele.value
            }
            for(const qut of Quiz.questions){
                if(qut.id == questionId){
                    qut.options.push(opt);
                    break;
                }
            }
            ele.id = optionId;
        }
        else{
            ele.value = '';
        }
    }
    else{
        ele.value = 'first Enter question';
    }
}

function setOptionBorder(ele){
    let parent = ele.parentElement.parentElement;
    let allOptions = document.getElementsByClassName('Edit-Option');
    let len = allOptions.length;
    for(let i=0;i<len;i++){
        if(allOptions[i].parentElement.parentElement == parent && allOptions[i] != ele){
            allOptions[i].style.borderColor = 'black';
            allOptions[i].style.borderWidth = '1px';
        }
    }
    ele.style.borderColor='green';
    ele.style.borderWidth='3px';
}

async function addRightOption(ele){
    let optionId = ele.id;
    if(optionId){
        let questionId = ele.parentElement.parentElement.parentElement.firstElementChild.firstElementChild.id;
        let res = await fetch(`http://${window.location.hostname}:${window.location.port}/admin/addrightoption?questionId=${questionId}&rightoptionId=${ele.id}`);
        let {response} = await res.json();
        if(response){
            console.log('right option set');
            return true;
        }
        else{
            return false;
        }
    }
    else{
        return false;
    }
}

function inputShowEffect(ele,complete=false){
    if(complete){
        console.log('Completed');
    }
    else{
        console.log('not completed');
    }
}

document.getElementById('Add').addEventListener('click', () => {
    AddQuestion();
});

document.getElementsByTagName('body')[0].addEventListener('keypress', (evt) => {
    let ele = evt.target;
    if (ele.id == 'marks' && evt.keyCode == 13 ) {
        updateMarks(ele);
    }
    else if (ele.id == 'title' && evt.keyCode == 13 ) {
        updateTitle(ele)
    }
    else if (ele.className == 'Edit-Question' && evt.keyCode == 13 ) {
        updateQuestion(ele);
    }
    else if(ele.className == 'Edit-Option' && evt.keyCode == 13 ){
        updateOption(ele);
    }
    if(evt.keyCode == 13 ){
        inputShowEffect(ele,true);
    }
    else{
        inputShowEffect(ele);
    }
});

document.getElementsByTagName('body')[0].addEventListener('dblclick',async(evt)=>{
    let ele = evt.target;
    if(ele.className == 'Edit-Option'){
        if(await addRightOption(ele)){
            setOptionBorder(ele);
        }
    }
});

// document.body.addEventListener('contextmenu',(evt)=>{
//     evt.preventDefault();
//     const all = [...document.querySelectorAll('.Question-Options')];
//     const find = all.find(ele=>{
//         return ele.contains(evt.target);
//     })
//     if(find)
//     Menu.On(evt.clientX,evt.clientY);
// });

// document.body.addEventListener('click',(evt)=>{
//     if(evt.target.id != 'Cross' && document.body.contains(Menu.MenuElement))
//     Menu.Off();
// });


// const Menu = {
//     MenuElement:document.createElement('button'),
//     On:function(x,y){
//         const style = `
//         position:fixed;
//         top:${y}px;
//         left:${x}px;
//         dispaly:inline;
//         background-color:red;
//         color:Yellow;
//         font-size:1rem;
//         cursor:pointer;
//         `;
//         this.MenuElement.style = style;
//         this.MenuElement.innerText = 'X';
//         this.MenuElement.id = 'Cross';
//         document.body.appendChild(this.MenuElement);
//         this.MenuElement.onclick = this.addOnlick;
//     },
//     Off:function(){
//         document.body.removeChild(this.MenuElement);
//     },
//     addOnlick:function(evt){
//         Menu.Off();
//         console.log(evt);
//     }
// }