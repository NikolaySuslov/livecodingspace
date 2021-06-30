this.initialize = function(){
    //this.run();
}

this.fromhitstartEventMethod = function(value){

    let synth = this.parent.synth;
    
    let scene = this.getScene();
    let notes = value.map(el=>{
        let node = scene.findNodeByID(el);
        node.synth = synth.id;

        //let note = Tone.Frequency(node.worldPosition().y*150).toNote();
        //node.note.note = note;

        return {
            freq: node.note.note,
            velocity: node.radius,
            duration: node.height//node.note.duration,
        }
    })

    if(notes.length == 1){
        let note = notes[0];
        //synth.triggerAttack(note.freq, note.velocity);
        synth.triggerAttackRelease([note.freq], [note.duration], null, note.velocity);
    } else if (notes.length > 0){
        let chord = notes.map(el=>{
            return el.freq
        })
        let durations = notes.map(el=>{
            return el.duration
        })

         let velocity = notes[0].velocity;
         synth.triggerAttackRelease(chord, durations, null, velocity);
        // synth.triggerAttack(chord, velocity); //, durations
    }

   
}

this.fromhitendEventMethod = function(value){
    //console.log(value)
}

// this.stop = function(){
//     this.animationLoop = false;
//     this.position = [0,1.5,0];
// }

// this.play = function(){
//     this.animationLoop = true;
//     this.translateBy([5,0,0],1);
// }

// this.run = function(){
//     if(this.playing){
//     this.translateTo([this.end, 0, 0],this.delta - 0.1);
//     this.future(this.delta).position = [0,1.5,0];
//     }
//     this.future(this.delta).run();
// }