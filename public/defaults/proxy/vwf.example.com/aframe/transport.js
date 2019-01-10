this.initialize = function () {
    //this.createTransportVis();

}

this.simpleVis = function () {
    return {
        "extends": "http://vwf.example.com/aframe/abox.vwf",
        "properties": {
            "height": 0.3,
            "width": 0.3,
            "depth": 0.3,
            "class": "clickable"
        },
        "children": {
            "material": {
                "extends": "http://vwf.example.com/aframe/aMaterialComponent.vwf",
                "type": "component",
                "properties": {
                    "color": "red"
                }
            },
            "cursor-listener": {
                extends: "http://vwf.example.com/aframe/app-cursor-listener-component.vwf",
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
    //this.animationPlay(0,1);
}

this.animationUpdate = function (time, duration) {
    //let sceneID = this.find("/")[0].id
    let rate = this.animationTPS / this.animationRate; // 60/1 by default

    var b = this.beat;

    //console.log('time: ' + time + ' b: ' + this.beat + ' simTime: ' + this.time);

    if (b == rate + 1) { //time == 1 && 
        this.beat = 0;
    }
    else {

        this.doGlobalBeat(time, duration, b);
        //vwf_view.kernel.fireEvent(this.id, "transportTick", [time, duration, this.beat]);

        if (b / rate == 0) {
            this.vis.material.color = "white";
        } else if (b / rate == 1 / 2) {
            this.vis.material.color = "red";
        }

        this.beat = this.beat + 1;

    }




}

this.doGlobalBeat = function (time, duration, beat) {

    let allChilds = this.find("//element(*,'http://vwf.example.com/aframe/aentity.vwf')");
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