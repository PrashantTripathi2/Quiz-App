var UserId = 1;
var users = [{
    id: 0,
    name: 'admin',
    pass: '123',
    type: 'admin'
}];

function isUser(name) {
    let len = users.length;
    for (let i = 0; i < len; i++) {
        if (users[i].name == name) return true;
    }
    return false;
}
function match(name, pass) {
    let len = users.length;
    for (let i = 0; i < len; i++) {
        if (users[i].name == name && users[i].pass == pass) return users[i];
    }
    return null;
}
function AddUser(name, pass, type = 'user') {
    if (isUser(name)) return null;
    users.push({id:UserId, name, pass, type });
    UserId+=1;
    return users[users.length - 1];
}

function getName(userId){
    const find = users.find(user=>{
        return user.id == userId;
    });
    return find.name;
}

module.exports = {
    match, AddUser,getName
};