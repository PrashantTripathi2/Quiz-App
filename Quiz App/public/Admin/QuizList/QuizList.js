//QuizeList.js

document.getElementById('Add').addEventListener('click',(evt)=>{
    var ele = document.getElementById('Title');
    var title = ele.value;
    if(title == '' || title == null)return;
    console.log(title);
    ele.value = '';
    AddQuize(title);
});

document.getElementById('Title').addEventListener('keypress',(evt)=>{
    if(evt.keyCode != 13) return;
    var title = evt.target.value;
    if(title == '' || title == null)return;
    console.log(title);
    evt.target.value = '';
    AddQuize(title);
});

document.getElementsByClassName('main')[0].addEventListener('click',(evt)=>{
    var target = evt.target;
    RemoveQuize(target);
    gotoView(target);
    gotoEdit(target);
},false);

window.onload = async function load(){
    let res = await fetch('/admin/getallquizzes');
    let j = await res.json();
    let len = j.length;
    for(let i=0;i<len;i++){
        appendQuiz(j[i].title,j[i].id);
    }
};

async function AddQuize(title){
    let res = await fetch(`/admin/addquiz?title=${title}`);
    var {quizId} = await res.json(); 
    if(quizId == null || quizId == undefined)return;
    let div = document.createElement('div');
    div.id = quizId;
    div.className = 'Quize';
    var ele = `
            <span class='Title'>${title}</span>
            <span class='Edit'>Edit</span>
            <span class='View'>View</span>
            <span class='Remove'>Remove</span>`;
    div.innerHTML = ele;
    document.getElementsByClassName('main')[0].appendChild(div);
}

function appendQuiz(title,id){
    let div = document.createElement('div');
    div.id = id;
    div.className = 'Quize';
    var ele = `
            <span class='Title'>${title}</span>
            <span class='Edit'>Edit</span>
            <span class='View'>View</span>
            <span class='Remove'>Remove</span>`;
    div.innerHTML = ele;
    document.getElementsByClassName('main')[0].appendChild(div);
}

async function RemoveQuize(ele){
    if(ele?.className == 'Remove'){
        ele = ele.parentElement;
        var parent = ele.parentElement;
        await fetch(`/admin/removequiz?quizId=${ele.id}`);  
        parent.removeChild(ele);
    }
}

function gotoView(ele){
    if(ele.className == 'View'){
        // sessionStorage.setItem('id',ele.parentElement.id);
        // sessionStorage.setItem('View',true);
        let a = document.createElement('a');
        a.href = `/admin/QuizEdit?id=${ele.parentElement.id}&View=${true}`;
        a.click();
    }
}

function gotoEdit(ele){
    if(ele.className == 'Edit'){
        // sessionStorage.setItem('id',ele.parentElement.id);
        // sessionStorage.setItem('View',false);
        let a = document.createElement('a');
        a.href = `/admin/QuizEdit?id=${ele.parentElement.id}&View=${false}`;
        a.click();
    }
}

// document.body.onfocus =async ()=>{
//     window.location.reload();
// }