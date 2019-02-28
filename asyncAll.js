// var Promise = require("bluebird");

// function PingPong() {

// }

// PingPong.prototype.ping = Promise.coroutine(function* (val) {
//     console.log("Ping?", val);
//     yield Promise.delay(500);
//     this.pong(val+1);
// });

// PingPong.prototype.pong = Promise.coroutine(function* (val) {
//     console.log("Pong!", val);
//     yield Promise.delay(500);
//     this.ping(val+1);
// });

// var a = new PingPong();
// a.ping(0);

// function* Add(x) {
//     yield x++;
//     var y = yield(null);
//     y = 6
//     return x + y;
//  }
 
//  var gen = Add(5);

//  console.log(gen.next());
// console.log( gen.next()); 
// console.log( gen.next()); 
// var gen2 = Add(5)

// const delay = (ms, result) =>
//   new Promise(resolve => setTimeout(() => resolve(result), ms));

// async function delays() {
//     let a = await delay(800, "Hello, I'm in an");
//     console.log(a);
  
//     let b = await delay(400, "async function!");
//     console.log(b);
//   }
  
//   delays();

// var Promise = require("bluebird");
// var fs = require("fs");

// var _ = (function() {
//     var promise = null;
//     Promise.coroutine.addYieldHandler(function(v) {
//         if (v === undefined && promise != null) {
//             return promise;
//         }
//         promise = null;
//     });
//     return function() {
//         var def = Promise.defer();
//         promise = def.promise;
//         return def.callback;
//     };
// })();


// var readFileJSON = Promise.coroutine(function* (fileName) {
//    var contents = yield fs.readFile('./kanika.txt', "utf8", _());
//    return JSON.parse(contents);
// });

var p = require('bluebird');

var d = p.coroutine(function* (v) {
    return yield p.resolve(v*2);
});

d(1).then(console.log);