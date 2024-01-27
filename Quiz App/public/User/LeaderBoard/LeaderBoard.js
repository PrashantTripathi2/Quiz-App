function CreateColumn(text) {
    const col = document.createElement('div');
    col.className = `column`;
    col.innerText = text;
    return col;
}


function CreateRow(columns, heading = false) {
    const row = document.createElement('div');
    row.className = `row ${heading ? 'heading' : ''}`;
    for (x of columns) {
        row.appendChild(x);
    }
    return row;
}

function CreateTable(table) {
    let cols;
    let Table = document.createElement('div');
    Table.className = 'table';
    for (const x of table) {
        cols = [];
        cols.push(CreateColumn(x.userId));
        cols.push(CreateColumn(x.name));
        cols.push(CreateColumn(x.marks));
        Table.appendChild(CreateRow(cols));
    }
    const first = Table.firstChild;
    const heading = CreateRow([CreateColumn('User ID'),CreateColumn('Name'),CreateColumn('Marks')],true);
    Table.insertBefore(heading,first);
    return Table;
}

window.onload = () => {
    const quizId = new URLSearchParams(window.location.search).get('id');
    fetch(`http://${window.location.hostname}:${window.location.port}/user/getleaderboard?quizId=${quizId}`)
        .then((res) => {
            return res.json();
        })
        .then(json => {
            document.querySelector('.main').appendChild(CreateTable(json));
        })
        .catch(err => {
            console.log(err);
        })
}