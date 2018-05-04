const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

var message = 'this is the plain text';
var hash = SHA256(message).toString();

console.log('Message: ', message);
console.log('Hash: ', hash);


var data = {
    id: 4
};

var token = {
    data,
    hash: SHA256(JSON.stringify(data + 'secrete')).toString()
}

// token.data.id = 5;
// token.hash = SHA256(JSON.stringify(token.data)).toString();

var resultHash = SHA256(JSON.stringify(token.data + 'secrete')).toString();

if(token.hash === resultHash){
    console.log('data is not changed.');
} else {
    console.log('data is changed, do not trust it');
}

var jwttoken = jwt.sign(data, 'secrete');
console.log('jwttoken: ', jwttoken);

var decode = jwt.verify(jwttoken, 'secrete');
console.log('decoded: ', decode);

var pwd = '123abc!';

// bcrypt.genSalt(10, (err, salt) => {
//     bcrypt.hash(pwd, salt, (err, hash) => {
//         console.log(hash);
//     });
// });

var hashedPwd = '$2a$10$FdE2Wf1ZzdOicUGDO1mylu7ZFIDRBkRfenfWVqu/aTXwYaP1nc6SG'

bcrypt.compare(pwd, hashedPwd, (err, res) => {
    console.log(res);
});