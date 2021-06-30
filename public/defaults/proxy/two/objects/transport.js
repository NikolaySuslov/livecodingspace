this.initialize = function () {
    //this.createTransportVis();

}

this.simpleVis = function () {
    return {
        "extends": "proxy/two/rectangle.vwf",
        "properties": {
            "height": 25,
            "width": 25,
            "fill": "#ddd"
        }
    }
}

this.stop = function () {

    this.animationStop();
    this.playing = false;
}

this.play = function () {

    this.beat = 0;
    this.animationPlay(0, this.animationDuration);
    this.playing = true;

}

this.setupTransport = function () {
    this.beat = 0;
    this.animationLoop = true;
    this.animationDuration = 1;
    this.animationRate = 1;
    this.animationTPS = 30;
    //this.animationPlay(0,1);
}

this.animationUpdate = function (time, duration) {
           //let sceneID = this.find("/")[0].id
           let rate = this.animationTPS / this.animationRate; // 60/1 by default

           var b = this.beat;
           //console.log('b: ' + this.beat + ' t: ' + time + ' ta: ' + this.time);
        
           if (time == this.animationDuration) { //time == 1 && 
               this.beat = 0;
               //this.doGlobalBeat(time, duration, b);
           } else {
            
            if(this.beat !== rate) {
                this.doGlobalBeat(time, duration, b)
            }

            this.beat = this.beat + 1;
           }
    

}

this.resetVisual = function(){
    this.vis.fill = "#ddd";
}

this.changeVisual = function(){
    this.vis.fill = "green";
    //this.future(0.5).resetVisual();
}

this.doGlobalBeat = function (time, duration, beat) {

this.changeVisual();

   let allChilds = this.find("//element(*,'proxy/two/node.vwf')"); //this.children
   allChilds.forEach(el => {
        if (el.globalBeat) {
            let obj = {
                name: this.name,
                time: time,
                duration: duration,
                beat: beat
            }
            el.onGlobalBeat(obj);
        }
    })
}

this.init = function () {


    this.children.create("vis", this.simpleVis(), function (child) {

        child.mousedownEvent = function () {
            if (this.parent.animationPlaying) {
                this.parent.stop();
                this.parent.resetVisual();
            } else {
                this.parent.play();
                this.parent.changeVisual();
            }
        }

    });
    this.setupTransport();
    //this.play();
}