//QuizeList.js

window.onload = async function load(){
    let res = await fetch('/user/getallquizzes');
    let j = await res.json();
    let len = j.length;
    for(let i=0;i<len;i++){
        appendQuiz(j[i].title,j[i].id);
    }
};

document.getElementsByClassName('main')[0].addEventListener('click',(evt)=>{
    let ele = evt.target;
    if(ele.className == 'Take'){
        gotoTake(ele);
    }
    else if(ele.className == 'LeaderBoard'){
        gotoLeaderBoard(ele);
    }
});


function appendQuiz(title,id){
    var div = document.createElement('div');
    div.className = 'Quize';
    div.id = id;
    var ele = `
        <span class='Title'>${title}</span>
        <span class='Take'>Take</span>
        <span class='LeaderBoard'>LeaderBoard</span>`;
        div.innerHTML=ele;
    document.getElementsByClassName('main')[0].appendChild(div);
}

function gotoTake(ele){
    // sessionStorage.setItem('id',ele.parentElement.id);
    let a = document.createElement('a');
    a.href = `/user/QuizView?id=${ele.parentElement.id}`;
    a.click();
}

function gotoLeaderBoard(ele){
    let a = document.createElement('a');
    a.href = `/user/LeaderBoard?id=${ele.parentElement.id}`;
    a.click();
}