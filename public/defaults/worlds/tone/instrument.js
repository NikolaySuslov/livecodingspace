this.clickEventMethod = function() {
   this.synth.triggerAttackRelease(['C4'], ['8n'], null, 0.3);
}

this.doButtonTriggerdownAction = function(buttonID){

    let transportNode = this.find('//' + 'globalTransport')[0];

    if(this.playButton.displayName == "playButton"){
        //this.transportLine.playing
        this.globalBeat = this.globalBeat? false : true;

        if(this.globalBeat){
            this.playButton.baseColor = 'red';
            this.playButton.textNode.value = 'Stop'

            if(!transportNode.playing)
                transportNode.play()

        } else {
            this.playButton.baseColor = 'green';
            this.playButton.textNode.value = 'Play'
        }

    }

}

this.initialize = function(){
    this.playButton.init();
}

this.onGlobalBeat = function (obj) {
    //dispatch the beat example send OSC
    let transportNode = this.find('//' + obj.name)[0];
    let rate = transportNode.animationRate; // 1 by default
    let tps = transportNode.animationTPS; // 30 by default
    //this.transportLine.translateTo([obj.beat*0.2, 0, 0]);
    let end = this.transportLine.end;
    if(obj.beat == 0)
        this.transportLine.translateTo([end, 0, 0], rate - 0.1);
    if(obj.beat == tps - 1)
        this.transportLine.translateTo([0, 0, 0]);

}