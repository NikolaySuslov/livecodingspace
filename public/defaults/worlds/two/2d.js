this.initialize = function () {

    if (Object.getPrototypeOf(this).id.includes('scene.vwf')) {
        console.log("Initialize of Scene...", this.id);

        this.globalTransport.init();

        this.back.back2.mask = "filter2";
        this.back.back1.mask = "filter1";
        //this.back.back1.rectangle.fill = "https://localhost:3007/defaults/assets/test/test.mp4";

        //this.back.back1.rectangle.playVideo();

        this.back.back1.rectangle.setVideoState(false, null, 0);




        this.synth.sync();

        this.future(1).setStartTime();
        this.tuning.syncStart();


        //this.synth.scheduleRepeat();
        this.synth.triggerAttackRelease(["A3"], "32n", "4n", 0.8);
        this.synth.triggerAttackRelease(["E3"], "32n", "8n", 0.8);

        this.toneTransport.setTransportState(false, null, 0);


        this.toneGUI.toneText.step();

    } else {
        console.log("Initialize proto Scene..", this.id);
    }

}

this.resize = function () {

}

this.setStartTime = function () {

    this.tuning.startTime = this.toneTransport.position;
}

this.toneGUI.toneText.do = function () {
    let scene = this.getScene();

    if (scene && scene.toneTransport) {
        this.text = scene.toneTransport.position;
    }


}

this.toneGUI.tonePlay.mousedownEvent = function () {
    let scene = this.getScene();
    if (scene.toneTransport) {


        //scene.tuning.startTime = scene.toneTransport.position;
        //scene.future(1).setStartTime();
        //scene.tuning.startTime = scene.toneTransport.position;
        scene.toneTransport.syncTransportState();
        scene.toneTransport.toggleTransport();

    }


    // let scene = this.getScene();
    // if(!scene.toneTransport.state || scene.toneTransport.state  == "stopped"){
    //     scene.toneTransport.start();
    //     scene.toneTransport.state = "started";
    //     console.log("START Transport")
    // } else if(scene.toneTransport.state == "started"){
    //     scene.toneTransport.stop();
    //     scene.toneTransport.state = "stopped";
    //     console.log("STOP Transport")
    // } else if(scene.toneTransport.state == "paused"){
    //     scene.toneTransport.state = "paused";
    // }



}

this.audio.mousedownEvent = function () {

    this.parent.back.back1.rectangle.unmute();
}

this.play.mousedownEvent = function () {

    //this.parent.back.back1.rectangle.setVideoState(true, 0, 0);
    //this.parent.back.back1.rectangle.setVideoState(this.isPlaying, this.startOffset, this.pausedTime);
    this.parent.back.back1.rectangle.syncVideoState();
    this.parent.back.back1.rectangle.playVideo();
}

this.ellipse.clickEvent = function () {

    this.fill = this.getRandomColor();
    console.log('CLICK ', this.id);
}

this.ellipse.mousedownEvent = function () {

    this.fill = this.getRandomColor();
    console.log('Mouse Down ', this.id);
}

this.ellipse.mouseupEvent = function () {

    this.fill = this.getRandomColor();
    console.log('Mouse Up ', this.id);
}

this.ellipse.overstartEvent = function (avatarID) {
    this.fill = "#e3dd24"
}

this.ellipse.overendEvent = function (avatarID) {
    this.fill = "white"
}


this.filter2.el2.overstartEvent = function (avatarID) {
    let nodeName = this.parent.maskedNode;
    if (nodeName) {
        let node = this.getScene().findNode(nodeName);
        this.viewTroughFilter(node.id, true);
        //node.visible = true;
    }
}


this.filter2.el2.overendEvent = function (avatarID) {
    let nodeName = this.parent.maskedNode;
    if (nodeName) {
        let node = this.getScene().findNode(nodeName);
        this.viewTroughFilter(node.id, false);
        //node.visible = false;
    }
}

this.filter1.el1.overstartEvent = function (avatarID) {
    let nodeName = this.parent.maskedNode;
    if (nodeName) {
        let node = this.getScene().findNode(nodeName);
        //this.viewTroughFilter(node.id, true);
        //node.visible = true;
    }
}


this.filter1.el1.overendEvent = function (avatarID) {
    let nodeName = this.parent.maskedNode;
    if (nodeName) {
        let node = this.getScene().findNode(nodeName);
        //this.viewTroughFilter(node.id, false);
        //node.visible = false;
    }
}

this.filter1.el2.overstartEvent = function (avatarID) {
    let nodeName = this.parent.maskedNode;
    if (nodeName) {
        let node = this.getScene().findNode(nodeName);
        //this.viewTroughFilter(node.id, true);
        //node.visible = true;
    }
}


this.filter1.el2.overendEvent = function (avatarID) {
    let nodeName = this.parent.maskedNode;
    if (nodeName) {
        let node = this.getScene().findNode(nodeName);
        //this.viewTroughFilter(node.id, false);
        //node.visible = false;
    }
}