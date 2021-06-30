this.initialize = function () {

    if (Object.getPrototypeOf(this).id.includes('scene.vwf')) {
        console.log("Initialize of Scene...", this.id);

        this.watchPerformance();
        //this.globalTransport.init();

        this.back.back1.mask = "filter1";
        this.back.back2.mask = "filter2";
        this.back.back3.mask = "filter3";
        //this.back.back1.rectangle.fill = "https://localhost:3007/defaults/assets/test/test.mp4";

        //this.back.back1.rectangle.playVideo();


        this.back.back1.rectangle.setVideoState(true, null, 0);
        this.back.back1.rectangle.syncVideoState();
        this.back.back3.rectangle.setVideoState(false, null, 0);


        // this.tuning.syncStart();
        this.toneTransport.setTransportState(false, null, 0);

        this.filter1.el2.step();

        //this.toneGUI.toneText.step();

    } else {
        console.log("Initialize proto Scene..", this.id);
    }

}

this.setStartTime = function () {

    this.tuning.startTime = this.toneTransport.position;
}

this.watchPerformance = function () {
    let fixedTime = Number.parseFloat(this.time).toFixed();
    //this.timeText.text = fixedTime.toString();

    let secondsN = fixedTime//Math.floor(this.time/2);
    let minutesN = Math.floor(secondsN / 60);
    let hoursN = Math.floor(minutesN / 60);

    let seconds = Number.parseFloat(secondsN % 60).toFixed();
    let minutes = minutesN % 60;
    let hours = hoursN % 12;

    this.timeText.text = (hours ? (hours > 9 ? hours : "0" + hours) : "00") + ":" + (minutes ? (minutes > 9 ? minutes : "0" + minutes) : "00") + ":" + (seconds > 9 ? seconds : "0" + seconds);

    if (fixedTime == 45) {
        if (this.part2 !== "started") {
            this.part1 = "finished";
            this.back.back1.rectangle.fill = "black";
            if (this.toneTransport) {
                this.toneTransport.syncTransportState();
                this.toneTransport.toggleTransport();
                this.future(2).setStartTime();
                //this.tuning.future(2).syncStart(this.tuning.startTime);
                this.tuning.volume = -15;
            }
            this.part2 = "started";

            let tuningText = {
                "extends": "proxy/two/text.vwf",
                "properties": {
                    "size": 150,
                    "fill": "white",
                    "text": "",
                    "stroke": "normal",
                    "linewidth": 4,
                    "translation": [500, 300]
                }
            }
            this.children.create("tuningText", tuningText, function (child) { });

        }
        //84 - tuning
    }

    if (fixedTime == 99) {

        this.back.back2.logo_text.text = "";
        this.tuningText.text = 'what is this?'
    }

    if (fixedTime == 105) {
        this.tuningText.text = ''
    }

    if (fixedTime == 110) {
        this.tuningText.text = 'I don\'t know'
    }

    if (fixedTime == 115) {
        this.tuningText.text = ''
    }

    if (fixedTime == 126) {
        this.tuningText.text = ' toi toi toi'
    }


    if (fixedTime == 129) { //129

        if (this.part3 !== "started") {
            this.part2 = "finished";
            this.tuningText.text = ''

            if (this.toneTransport) {
                this.toneTransport.syncTransportState();
                this.toneTransport.toggleTransport();
            }

            this.back.back1.rectangle.fill = "black";
            this.back.back1.rectangle.playVideo();
            this.back.back1.visible = false;
            this.filter1.visible = false;
            this.filter2.visible = false;
            this.filter1.el1.drag = false;
            this.filter1.el2.drag = false;
            this.filter2.el2.drag = false;
            this.filter2.visible = false;


            //this.back.back3.rectangle.setVideoState(true, null, 0);
            //this.back.back3.rectangle.unmute();
            this.startPart3();

            this.part3 = "started"
        }

    }

    if (fixedTime == 202) { //205
        if (this.part4 !== "started") {
            this.part3 = "finished";
            this.back.back3.rectangle.playVideo();
            //this.back.back3.rectangle.fill = "black";
            this.back.back3.visible = false;
            this.body.visible = false;
            this.tuningText.text = "";
            this.tuningText.opacity = 0.3;
            this.tuningText.fill = "grey";

            this.startPart4();

            this.part4 = "started"
        }

    }

    this.future(1).watchPerformance();

}

this.resize = function () {

}

this.startPart4 = function () {

    let self = this;

    let applause2 = {
        "extends": "proxy/two/ellipse.vwf",
        "properties": {
            "width": 200,
            "height": 200,
            "fill": "/defaults/assets/concert/hands.png",
            x: 220,
            y: 630,
            "drag": true,
            linewidth: 0,
            stroke: "transparent",
            opacity: 0.7,
            scale: 0.4
        }
    }

    let applause3 = {
        "extends": "proxy/two/ellipse.vwf",
        "properties": {
            "width": 200,
            "height": 200,
            "fill": "/defaults/assets/concert/hands.png",
            x: 460,
            y: 560,
            "drag": true,
            linewidth: 0,
            stroke: "transparent",
            opacity: 0.7,
            scale: 0.7
        }
    }
    let applause4 = {
        "extends": "proxy/two/ellipse.vwf",
        "properties": {
            "width": 200,
            "height": 200,
            "fill": "/defaults/assets/concert/hands.png",
            x: 740,
            y: 600,
            "drag": true,
            linewidth: 0,
            stroke: "transparent",
            opacity: 0.7,
            scale: 1
        }
    }

    let clapping2 = {
        "extends": "proxy/tonejs/player.vwf",
        "properties": {
            "url": "/defaults/assets/concert/clapping2.mp3",
            "volume": -10
        }
    }

    let clapping3 = {
        "extends": "proxy/tonejs/player.vwf",
        "properties": {
            "url": "/defaults/assets/concert/clapping3.mp3",
            "volume": -10
        }
    }
    let clapping4 = {
        "extends": "proxy/tonejs/player.vwf",
        "properties": {
            "url": "/defaults/assets/concert/clapping4.mp3",
            "volume": -10
        }
    }

    this.children.create("clapping2", clapping2);
    this.children.create("clapping3", clapping3);
    this.children.create("clapping4", clapping4);


    this.children.create("applause2", applause2, function (child) {

        child.mousedownEvent = function () {
            this.parent.clapping2.start();
        }

        child.mouseupEvent = function () {
            this.parent.clapping2.stop();
        }
    });

    this.children.create("applause3", applause3, function (child) {

        child.mousedownEvent = function () {
            this.parent.clapping3.start();
        }

        child.mouseupEvent = function () {
            this.parent.clapping3.stop();
        }
    });

    this.children.create("applause4", applause4, function (child) {

        child.mousedownEvent = function () {
            this.parent.clapping4.start();
        }

        child.mouseupEvent = function () {
            this.parent.clapping4.stop();
        }
    });

}

this.startPart3 = function () {

    //
    if (this.body.children.length == 0)
        this.createBody();

    //this.back.back3.rectangle.setVideoState(true, null, 0);
    this.back.back3.rectangle.syncVideoState();

    //this.back.back3.rectangle.syncVideoState();
    //this.back.back3.rectangle.isPlaying = true;
    this.back.back3.opacity = 1;
    this.filter3.el1.opacity = 0.35;
    this.filter3.el2.opacity = 0.35;

    this.filter3.el1.drag = true;
    this.filter3.el2.drag = true;

    this.back.back3.rectangle.playVideo();

    //this.back.back3.rectangle.unmute();


    //this.body.playBodyMotion("https://localhost:3007/defaults/assets/concert/motion.json");
}


this.playBodyMotion = function () {

    let initPose = this.body.getJointsAtTime(0);
    initPose.forEach((e, i) => {

        this.body.children["joint" + i].x = e.x * 1000;
        this.body.children["joint" + i].y = e.y * 1000;
    })


}

this.createBody = function () {
    let self = this;

    // let body = {
    //     "extends": "proxy/two/group.vwf",
    //     "properties": {
    //     "drag": false,
    //       "x": 239,
    //       "y": -57,
    //       "motionData": "https://localhost:3007/defaults/assets/concert/motion.json"
    //     },
    //     "methods":{
    //         "applyBodyMotion":{
    //             "parameters":["data"]
    //         },
    //         "getJointAtTime":{},
    //         "getJointsAtTime":{}
    //     }
    //   }

    let child = this.body;
    child.motionData = "/defaults/assets/concert/motion.json";

    //this.children.create("body", body, function( child ) {

    let hands = [18, 20, 22, 21, 19, 17, 15, 16];
    let face = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

    let topArr = [16, 14, 12, 11, 13, 15, 24, 23];
    let botArr = [24, 23];

    //let faceArr = [10,8,6,4,1,3,7,9]

    Array.from({ length: 25 }, (x, i) => {

        let d = 20;

        let joint = {
            "extends": "proxy/two/ellipse.vwf",
            "properties": {
                "width": d,
                "height": d,
                "fill": "yellow"
            }
        }

        if (face.includes(i)) {
            joint.properties.width = 5;
            joint.properties.height = 5;
            joint.properties.fill = "grey";
            joint.properties.opacity = 0.2;
        }

        if (hands.includes(i)) {
            joint.properties.width = 10;
            joint.properties.height = 10;
            joint.properties.fill = "grey";
            joint.properties.opacity = 0.5;
        }

        if (topArr.includes(i)) {
            joint.properties.opacity = 0.2;
        }

        if (botArr.includes(i)) {
            joint.properties.opacity = 0;
        }

        child.children.create("joint" + i, joint);
    });

    //16-14-12-11-13-15 - topline
    //12-24-23-11 - bottomline

    //18,16,20 - rh // 16,22
    //17,15,19 - lh // 15,21

    let rh = {
        "extends": "proxy/two/curve.vwf",
        "properties": {
            "vertices": [{ x: 0, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 0 }],
            "fill": "transparent",
            "linewidth": 1,
            "curved": true
        }
    }
    let rh2 = {
        "extends": "proxy/two/curve.vwf",
        "properties": {
            "vertices": [{ x: 0, y: 0 }, { x: 0, y: 0 }],
            "fill": "transparent",
            "linewidth": 1,
            "curved": true
        }
    }

    let lh = {
        "extends": "proxy/two/curve.vwf",
        "properties": {
            "vertices": [{ x: 0, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 0 }],
            "fill": "transparent",
            "linewidth": 1,
            "curved": true
        }
    }

    let lh2 = {
        "extends": "proxy/two/curve.vwf",
        "properties": {
            "vertices": [{ x: 0, y: 0 }, { x: 0, y: 0 }],
            "fill": "transparent",
            "linewidth": 1,
            "curved": true
        }
    }

    let topline = {
        "extends": "proxy/two/curve.vwf",
        "properties": {
            "vertices": [{ x: 0, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 0 }],
            "fill": "transparent",
            "linewidth": 3,
            "curved": true
        }
    }

    let bottomline = {
        "extends": "proxy/two/curve.vwf",
        "properties": {
            "vertices": [{ x: 0, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 0 }], //
            "fill": "transparent",
            "linewidth": 3,
            "curved": true
        }
    }

    let faceline = {
        "extends": "proxy/two/curve.vwf",
        "properties": {
            "vertices": [{ x: 0, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 0 },
            { x: 0, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 0 }], //
            "fill": "transparent",
            "linewidth": 1.5,
            "curved": true
        }
    }

    child.children.create("topline", topline);
    child.children.create("bottomline", bottomline);
    child.children.create("rhand", rh);
    child.children.create("lhand", lh);
    child.children.create("rhand2", rh2);
    child.children.create("lhand2", lh2);
    child.children.create("faceline", faceline);


    child.applyBodyMotion = function (data) {
        console.log(data);
    }

    //child.setScale(-1,1);

    self.back.back3.rectangle.bodyTrack = true;
    self.back.back3.rectangle.bodyNode = "body";
    //self.future(2).playBodyMotion();

    //});
}


this.filter2.el2.mousedownEvent = function () {

    this.fill = this.getRandomColor();
    console.log('CLICK ', this.id);
}


this.filter3.el1.overstartEvent = function (avatarID) {
    let scene = this.getScene();
    if (scene.part3 == "started") {
        let nodeName = this.parent.maskedNode;
        if (nodeName) {
            let node = scene.findNode(nodeName).rectangle;
            this.viewTroughFilter(node.id, false);
            //node.visible = true;
        }
    }
}

this.filter3.el1.overendEvent = function (avatarID) {
    let scene = this.getScene();
    if (scene.part3 == "started") {
        let nodeName = this.parent.maskedNode;
        if (nodeName) {
            let node = scene.findNode(nodeName).rectangle;
            this.viewTroughFilter(node.id, true);
            //node.visible = false;
        }
    }
}

this.filter1.el2.do = function () {
    this.rotation = this.rotation + 0.001;
}

this.filter3.el2.overstartEvent = function (avatarID) {
    let scene = this.getScene();
    if (scene.part3 == "started") {
        let nodeName = this.parent.maskedNode;
        if (nodeName) {
            let node = scene.findNode(nodeName).rectangle;
            this.viewTroughFilter(node.id, false);
            //node.visible = true;
        }
    }
}


this.filter3.el2.overendEvent = function (avatarID) {
    let scene = this.getScene();
    if (scene.part3 == "started") {
        let nodeName = this.parent.maskedNode;
        if (nodeName) {
            let node = scene.findNode(nodeName).rectangle;
            this.viewTroughFilter(node.id, true);
            //node.visible = false;
        }
    }
}

this.filter1.el2.overstartEvent = function (avatarID) {
    // let nodeName = this.parent.maskedNode;
    // if (nodeName) {
    //     let node = this.getScene().findNode(nodeName);
    //     //this.viewTroughFilter(node.id, true);
    //     //node.visible = true;
    // }
}


this.filter1.el2.overendEvent = function (avatarID) {

    // let nodeName = this.parent.maskedNode;
    // if (nodeName) {
    //     let node = this.getScene().findNode(nodeName);
    //     //this.viewTroughFilter(node.id, false);
    //     //node.visible = false;
    // }

}