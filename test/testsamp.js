
var samp = require('../lib/sampwebclient');

console.log("in testsamp");

s = new samp();
s.subscriptions["table.load.votable"] = s.handler_echo;
s.connect();

setTimeout(s.disconnect.bind(s), 100000)
