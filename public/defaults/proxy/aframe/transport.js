this.initialize = function () {
    //this.createTransportVis();

}

this.simpleVis = function () {
    return {
        "extends": "proxy/aframe/abox.vwf",
        "properties": {
            "height": 0.3,
            "width": 0.3,
            "depth": 0.3,
            "class": "clickable"
        },
        "children": {
            "material": {
                "extends": "proxy/aframe/aMaterialComponent.vwf",
                "type": "component",
                "properties": {
                    "color": "red"
                }
            },
            "cursor-listener": {
                extends: "proxy/aframe/app-cursor-listener-component.vwf",
                type: "component"
            }

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
           
            this.doGlobalBeat(time, duration, b);
            this.beat = this.beat + 1;
           }
    

}

this.doGlobalBeat = function (time, duration, beat) {

   let allChilds = this.find("//element(*,'proxy/aframe/aentity.vwf')"); //this.children
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

        child.clickEventMethod = function () {
            if (this.parent.animationPlaying) {
                this.parent.stop();
            } else {
                this.parent.play();
            }
        }

    });
    this.setupTransport();
    //this.play();
}