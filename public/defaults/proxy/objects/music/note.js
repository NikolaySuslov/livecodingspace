this.initialize = function(){
    //this.dragButton.init();
    this.positionChanged()
}

this.hitstartEventMethod = function(value){
     //console.log(value)
     this.material.color = "red"
}

this.hitendEventMethod = function(value){
    this.material.color = "green"
    //console.log(value)
    // if(this.synth){
    //     let scene = this.getScene();
    //     let synth = scene.findNodeByID(this.synth);
    //     synth.triggerRelease(this.note.note);
    // }
    // this.synth = null;
}

this.positionChanged = function(){

    let note = Tone.Frequency(Math.abs(this.worldPosition().y)*150).toNote();
    this.note.note = note;
    if(this.text)
        this.text.value = note;

}