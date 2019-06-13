

setInterval(function(){
    let d = (new Date()).getTime();
    postMessage(d)
},50);

// on reflector side
// const w = new Worker("/timer.js");
      
// // Update timer div with output from Web Worker
// w.onmessage = function (event) {
//           let message = JSON.stringify({ 
//             parameters: [],
//             time: 'tick'//hb
//         });

//     gun.put({ tick: message});

// }