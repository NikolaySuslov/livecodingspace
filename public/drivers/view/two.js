/*
The MIT License (MIT)
Copyright (c) 2014-2020 Nikolai Suslov and the Krestianstvo.org project contributors. (https://github.com/NikolaySuslov/livecodingspace/blob/master/LICENSE.md)

This driver includes the port and some code parts from the "Croquet synced video demo" for implementing video elements syncing within LiveCoding.space applications and LCS Reflector / Luminary.

Croquet synced video demo License 
Copyright 2020 Croquet Corporation

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

*/

// TWO JS view driver

import { Fabric } from '/core/vwf/fabric.js';

class TwoView extends Fabric {

    constructor(module) {
        console.log("TwoView constructor");
        super(module, 'View');
    }

    factory() {

        let _self_ = this;

        return this.load(this.module,
            {

                // == Module Definition ====================================================================

                initialize: function (options) {
                    let self = this;
                    this.fabric = _self_;
                    this.nodes = {};
                    this.overChilds = [];

                    this.state.appInitialized = false;

                    if (options === undefined) { options = {}; }

                    if (typeof options == "object") {

                        this.rootSelector = options["application-root"];
                    }
                    else {
                        this.rootSelector = options;
                    }

                    this.lastStatusCheck = vwf.time() * 1000 + 500;
                    this.clicked = false;
                    this.isIOS = [
                        'iPad Simulator',
                        'iPhone Simulator',
                        'iPod Simulator',
                        'iPad',
                        'iPhone',
                        'iPod'
                    ].includes(navigator.platform)
                        // iPad on iOS 13 detection
                        || (navigator.userAgent.includes("Mac") && "ontouchend" in document);

                    function videostepping() {
                        let twodriver = vwf.views["/drivers/view/two"];

                        if (!twodriver.clicked)
                            twodriver.clicked = true;

                        let videos = Object.values(twodriver.state.nodes).filter(el => el.fillType == "video");
                        videos.forEach(el => {
                            let viewNode = twodriver.nodes[el.ID];
                            if (viewNode.isStepping) {
                                console.log(`exiting step mode`);
                                el.muted = false;
                                viewNode.isStepping = false;
                                _self_.applyPlayState(el.ID);
                                //document.body.removeEventListener("click", videostepping, false);
                                //document.body.removeEventListener("touchstart", videostepping, false);
                                //return;
                            }
                        })
                    }

                    document.body.addEventListener("click", videostepping, false);
                    document.body.addEventListener("touchstart", videostepping, false);

                },

                createdNode: function (nodeID, childID, childExtendsID, childImplementsIDs,
                    childSource, childType, childIndex, childName, callback /* ( ready ) */) {
                    let self = this;
                    var node = this.state.nodes[childID];

                    // If the "nodes" object does not have this object in it, it must not be one that
                    // this driver cares about
                    if (!node) {
                        return;
                    }

                    if (this.state.scenes[childID]) {
                        let scene = this.state.scenes[childID];
                        let space = scene.obj;

                        _self_.resizeScene(childID);
                        //
                        space.bind('update', function (frameCount) {
                            // This code is called everytime two.update() is called.
                            // Effectively 60 times per second.
                            _self_.update(frameCount);

                        }).play();  // Finally, start the animation loop

                        //TODO: FIX

                        let avatarName = 'avatar-' + self.kernel.moniker();

                        console.log("creating avatar...");
                        var newNode = {
                            "id": avatarName,
                            "uri": avatarName,
                            "extends": "proxy/two/player.vwf",
                            "properties": {}
                        }

                        if (!self.state.nodes[avatarName]) {
                            vwf_view.kernel.createChild(childID, avatarName, newNode);
                            vwf_view.kernel.callMethod(avatarName, "createPlayerBody", []);
                        }
                    }



                    if (this.state.nodes[childID] && this.state.nodes[childID].obj) {
                        this.nodes[childID] = {
                            id: childID,
                            extends: childExtendsID,
                            liveBindings: {}
                            // lastTransformStep: 0,
                            // lastAnimationStep: 0 
                        };

                        if (this.nodes[childID].extends == "proxy/two/scene.vwf") {

                            this.nodes[childID].mouse = new Two.Vector();

                            window.addEventListener('mousemove', function (e) {
                                e.preventDefault();
                                let scene = self.state.nodes[childID].obj.renderer.scene;
                                let x = e.offsetX / scene.scale;
                                let y = e.offsetY / scene.scale;
                                self.nodes[childID].mouse.set(x, y);
                                //vwf_view.kernel.callMethod(el.nodeID, "mousedownEvent", []);  
                            });

                            window.addEventListener('touchstart', function (e) {
                                //e.preventDefault();
                                let touch = e.changedTouches[0];
                                let scene = self.state.nodes[childID].obj.renderer.scene;

                                const { x, y, width, height } = e.target.getBoundingClientRect();

                                self.nodes[childID].mouse.set(touch.pageX / scene.scale, touch.pageY / scene.scale);
                                _self_.updateAvatarPosition();
                                _self_.mouseDown(node, touch.pageX, touch.pageY);

                            }, { passive: false });

                            window.addEventListener('touchend', function (e) {

                                //e.preventDefault();

                                let touch = e.changedTouches[0];
                                //let scene = self.state.nodes[childID].obj.renderer.scene;
                                let x = touch.pageX;
                                let y = touch.pageY;
                                // _self_.updateAvatarPosition();
                                _self_.mouseUp(node, x, y);
                                //return false;
                            }, { passive: false });

                            window.addEventListener('touchmove', function (e) {

                                e.preventDefault();
                                let touch = e.changedTouches[0];
                                let scene = self.state.nodes[childID].obj.renderer.scene;
                                let x = touch.pageX / scene.scale;
                                let y = touch.pageY / scene.scale;
                                self.nodes[childID].mouse.set(x, y);

                            }, { passive: false });

                            //resize event
                            window.addEventListener("resize", function (event) {
                                _self_.resizeScene(childID);
                            });

                            //node.scene.obj.update();
                            node.obj.renderer.domElement.addEventListener('mousedown', function (e) {
                                var x = e.clientX;
                                var y = e.clientY;
                                //let nodes = self.state.nodes;
                                _self_.mouseDown(node, x, y);
                            }, false);

                            node.obj.renderer.domElement.addEventListener('mouseup', function (e) {
                                var x = e.clientX;
                                var y = e.clientY;
                                // let nodes = self.state.nodes;
                                _self_.mouseUp(node, x, y);

                            }, false);


                        }

                        // IF RENDERER SVG
                        // if(node.prototypes.includes("proxy/two/path.vwf")) {
                        // let elm = node.obj;

                        // node.scene.obj.update();
                        // elm._renderer.elem.addEventListener('click', function() {
                        //     vwf_view.kernel.callMethod(childID, "svgClickEvent", []);
                        //   },false);

                        // }

                    }
                },

                executed: function (nodeID, scriptText, scriptType) {
                    let self = this;
                    let node = this.state.nodes[nodeID];

                    if (!(node)) {
                        return;
                    }


                },


                initializedNode: function (nodeID, childID) {
                    let self = this;
                    var node = this.state.nodes[childID];
                    if (!node) {
                        return;
                    }


                },

                createdProperty: function (nodeId, propertyName, propertyValue) {
                    return this.satProperty(nodeId, propertyName, propertyValue);
                },

                initializedProperty: function (nodeId, propertyName, propertyValue) {
                    return this.satProperty(nodeId, propertyName, propertyValue);
                },

                gotProperty: function (nodeId, propertyName, propertyValue) {

                    var node = this.state.nodes[nodeId];

                    if (!(node && node.aframeObj)) {
                        return;
                    }

                },

                satProperty: function (nodeId, propertyName, propertyValue) {
                    let self = this;

                    var node = this.state.nodes[nodeId];
                    const viewNode = this.nodes[nodeId];

                    if (!(node && node.obj)) {
                        return;
                    }

                    if (propertyName == "startOffset" || propertyName == "pausedTime" || propertyName == "isPlaying") {

                        if (!viewNode.latestPlayState) {
                            viewNode.latestPlayState = {
                                "startOffset": null,
                                "pausedTime": null,
                                "isPlaying": false
                            }
                        }

                        viewNode.latestPlayState[propertyName] = propertyValue;


                        if (propertyName == "isPlaying") {
                            viewNode.isPlaying = propertyValue;
                            _self_.applyPlayState(nodeId);
                        }

                    }


                    if (propertyName == 'mask') {

                        let mask = Object.values(this.state.nodes).filter(el => (el.name == propertyValue))[0];
                        if (mask) {
                            node.obj.mask = mask.obj;
                            self.kernel.setProperty(mask.ID, "maskedNode", node.name)
                        }

                    }

                    if (propertyName == "bodyNode") {

                        let bodyNode = Object.values(this.state.nodes).filter(el => (el.name == propertyValue) && (el["ID"].includes("avatar") !== true))[0];
                        if (bodyNode)
                            node.bodyNode = bodyNode.ID;
                    }

                    if (propertyName == "motionData") {
                        let url = propertyValue;
                        if (url) {
                            fetch(url)
                                .then(response => response.json())
                                .then(data => {
                                    //console.log(data);
                                    node.motionData = data;
                                });
                        }
                    }

                    if (propertyName == "bodyTrack") {
                        viewNode.bodyTrack = propertyValue;
                    }


                    if (propertyName == "fill") {

                        if (node.obj.fill instanceof Two.Texture) {
                            if (node.obj.fill.image.nodeName == 'VIDEO') {
                                const video = node.obj.fill.image;
                                viewNode.playbackBoost = 0;
                                //_self_.applyPlayState(nodeId);    
                                viewNode.lastTimingCheck = vwf.time() * 1000 + 500;

                                viewNode.isPlaying = false;
                                viewNode.isBlocked = false;

                                //video.requestVideoFrameCallback(_self_.animate);

                                // video.addEventListener('timeupdate', (event) => {
                                //     if(viewNode.bodyTrack){
                                //        // console.log('time: ', video.currentTime);
                                //     }

                                //   });
                            }
                        }
                    }

                },

                deletedNode: function (childID) {
                    delete this.nodes[childID];
                },

                firedEvent: function (nodeID, eventName, eventParameters) {
                    let self = this;
                    var node = this.state.nodes[nodeID];

                    if (!(node)) {
                        return;
                    }
                    var clientThatSatProperty = self.kernel.client();
                    var me = self.kernel.moniker();

                    var avatarName = 'avatar-' + self.kernel.moniker();

                    // if (eventName == "clickEvent" ||
                    //     eventName == 'mousedownEvent' ||
                    //     eventName == 'mouseupEvent') {

                    //     if (clientThatSatProperty == me) {

                    //         let methodName = eventName + 'Method';
                    //         self.kernel.callMethod(nodeID, methodName, eventParameters);

                    //         if (eventName == "clickEvent") {

                    //             let mode = vwf.getProperty(avatarName, 'selectMode');
                    //             if (mode) {
                    //                 console.log("allow to click!!!")
                    //                 vwf_view.kernel.setProperty(avatarName, 'selectMode', false);

                    //                 let editorDriver = vwf.views["/drivers/view/editor"];
                    //                 if (editorDriver) {
                    //                     let selectSwitch = document.querySelector('#selectNodeSwitch');
                    //                     // const selectSwitchComp = new mdc.iconButton.MDCIconButtonToggle(selectSwitch); //new mdc.select.MDCIconToggle
                    //                     selectSwitch._comp.on = false;

                    //                     let currentNodeDIV = document.querySelector('#currentNode');
                    //                     if (currentNodeDIV) currentNodeDIV._setNode(nodeID);


                    //                 }
                    //             }

                    //         }

                    //     }
                    // }


                    // if (eventName == "clickEvent") {
                    //     if (self.kernel.moniker() == eventParameters[0]) {
                    //         let avatar = self.nodes[avatarName];
                    //         let mode = vwf.getProperty(avatarName, 'selectMode');
                    //         vwf_view.kernel.callMethod(nodeID, "clickEventMethod", [])
                    //     }
                    // }
                },

                ticked: function (vwfTime) {
                    let self = this;

                    _self_.updateAvatarPosition();

                    // _self_.updateFilters();
                    //lerpTick ();
                },

                calledMethod: function (nodeID, methodName, methodParameters, methodValue) {
                    let self = this;
                    var node = this.state.nodes[nodeID];
                    const viewNode = this.nodes[nodeID];

                    if (!(node && node.obj)) {
                        return;
                    }

                    // if(methodName == "setMask"){
                    //     let mask = this.state.nodes[methodParameters[0]];
                    //     node.obj.mask = mask.obj;
                    // }

                    if (methodName == "setScale") {
                        if (!node.obj.matrix.manual)
                            node.obj.matrix.manual = true;

                        node.obj.matrix.scale(methodParameters[0], methodParameters[1])
                    }

                    if (methodName == "unmute") {
                        node.obj.fill.image.muted = false;
                    }

                    if (methodName == "syncVideoState") {
                        _self_.applyPlayState(nodeID);
                    }

                    if (methodName == "setVideoState") {

                        if (!viewNode.latestPlayState)
                            viewNode.latestPlayState = {}

                        // "isPlaying",
                        // "startOffset",
                        // "pausedTime"

                        viewNode.latestPlayState["isPlaying"] = methodParameters[0];
                        viewNode.latestPlayState["startOffset"] = methodParameters[1];
                        viewNode.latestPlayState["pausedTime"] = methodParameters[2];

                        _self_.applyPlayState(nodeID);

                    }

                    if (methodName == "playVideo") {

                        if (node.obj.fill instanceof Two.Texture) {
                            if (node.obj.fill.image.nodeName == 'VIDEO') {
                                const video = node.obj.fill.image;
                                //video.currentTime = _self_.wrappedTime(videoTime, true);
                                //video.play();

                                if (!viewNode.latestPlayState) {
                                    viewNode.latestPlayState = {
                                        "isPlaying": false,
                                        "startOffset": null,
                                        "pausedTime": 0,
                                    }
                                }

                                const wantsToPlay = !viewNode.latestPlayState.isPlaying; // toggle
                                //viewNode.isPlaying = wantsToPlay;

                                if (!wantsToPlay) {
                                    viewNode.isPlaying = false;
                                    _self_.pause(undefined, video, nodeID);
                                } // immediately!


                                const videoTime = video.currentTime;
                                const sessionTime = vwf.time() * 1000; // the session time corresponding to the video time
                                const startOffset = wantsToPlay ? sessionTime - 1000 * videoTime : null;
                                const pausedTime = wantsToPlay ? 0 : videoTime;

                                vwf_view.kernel.callMethod(nodeID, "setVideoState", [wantsToPlay, startOffset, pausedTime]);

                            }

                        }
                    }


                    if (methodName == "viewTroughFilter") {

                        var clientThatSatProperty = self.kernel.client();
                        var me = self.kernel.moniker();
                        //let avatarID = methodParameters[0];
                        //&& avatarID.includes(me)
                        if (clientThatSatProperty == me) {

                            console.log("MY VIEW!!!");
                            let maskedNode = self.state.nodes[methodParameters[0]];
                            if (maskedNode) {
                                //maskedNode.obj.visible = methodParameters[1]
                                if (maskedNode.obj.fill.image) {

                                    if (!self.isIOS) {  //TODO: IOS
                                        if (self.clicked) {
                                            //maskedNode.obj.fill.image.muted = methodParameters[1]; 
                                            if (methodParameters[1]) {
                                                maskedNode.obj.fill.image.volume = 0
                                            } else {

                                                if (maskedNode.obj.fill.image.muted)
                                                    maskedNode.obj.fill.image.muted = false

                                                maskedNode.obj.fill.image.volume = 1

                                            }
                                        }
                                    }

                                }
                            }
                        }
                    }

                    if (methodName == "checkOver") {

                        var clientThatSatProperty = self.kernel.client();
                        var me = self.kernel.moniker();


                        // If the transform property was initially updated by this view....
                        if (clientThatSatProperty == me) {

                            let scene = node.scene.obj.scene;
                            let scale = scene.scale;

                            var x = methodParameters[0] * scale;
                            var y = methodParameters[1] * scale;

                            let allChilds = _self_.getOverlayChilds(node.scene.obj.scene, x, y).map(x => {
                                return x.nodeID;
                            });

                            if (JSON.stringify(allChilds) !== JSON.stringify(self.overChilds)) {
                                //console.log(allChilds);

                                let end = self.overChilds.filter(x => !allChilds.includes(x));
                                //console.log("END OVERLAY..", end);
                                end.map(x => {
                                    vwf_view.kernel.callMethod(x, "overendEvent", ['avatar-', me]);
                                })

                                let start = allChilds.filter(x => !self.overChilds.includes(x));
                                //console.log("START OVERLAY..", start);
                                start.map(x => {
                                    vwf_view.kernel.callMethod(x, "overstartEvent", ['avatar-', me]);
                                })

                                self.overChilds = allChilds;
                            }

                            //let still = self.overChilds.filter(x => allChilds.includes(x));
                            //if (still.length > 0)
                            //    console.log("STILL OVERLAY..", still)

                        }
                    }
                }
            });
    }


    ///

    mouseUp(node, x, y) {

        let self = this.instance;

        let avatarID = "avatar-" + vwf.moniker();
        vwf_view.kernel.setProperty(avatarID, "mouseevent", "mouseup");

        let allChilds = this.getOverlayChilds(node.obj.scene, x, y).map(x => {
            return x.nodeID;
        });

        allChilds.forEach(el => {
            vwf_view.kernel.callMethod(el, "mouseupEvent", []);
            vwf_view.kernel.callMethod(el, "checkForDragEnd", [avatarID]);
        })

    }

    mouseDown(node, x, y) {
        let self = this.instance;

        let avatarID = "avatar-" + vwf.moniker();
        vwf_view.kernel.setProperty(avatarID, "mouseevent", "mousedown");

        let allChilds = this.getOverlayChilds(node.obj.scene, x, y).map(x => {
            return x.nodeID;
        });

        allChilds.forEach(el => {
            vwf_view.kernel.callMethod(el, "mousedownEvent", []);
            vwf_view.kernel.callMethod(el, "checkForDragStart", [avatarID])
        })

    }

    resizeScene(childID) {
        let self = this.instance;
        let scene = self.state.nodes[childID].obj;
        let renderer = scene.renderer
        let elem = renderer.domElement;
        let scale = Math.min(
            elem.offsetWidth / 1280,
            elem.offsetHeight / 720
        );
        // var scale = //elem.offsetHeight / 1000;
        renderer.scene.scale = scale;
        renderer.setSize(elem.offsetWidth, elem.offsetHeight);
    }

    ///VIDEO & SOUND SYNC//////

    // doSomethingWithTheFrame = (now, metadata) => {
    //     // Do something with the frame.
    //     console.log(now, metadata);
    //     // Re-register the callback to be notified about the next frame.
    //     video.requestVideoFrameCallback(doSomethingWithTheFrame);
    //   };
    //   // Initially register the callback to be notified about the first frame.
    //   video.requestVideoFrameCallback(doSomethingWithTheFrame);


    update(frameCount) {
        let self = this.instance;
        const now = vwf.time() * 1000;

        this.animate(frameCount);

        if (now - self.lastStatusCheck > 100) {
            self.lastStatusCheck = now;
            this.checkPlayStatus();
        }

    }

    applyPlayState(nodeID) {
        let self = this.instance;
        const node = self.state.nodes[nodeID];
        const viewNode = self.nodes[nodeID];
        const video = node.obj.fill.image;

        if (!viewNode.latestPlayState.isPlaying) {
            // this.iconVisible('play', true);
            // this.iconVisible('enableSound', false);
            this.pause(viewNode.latestPlayState.pausedTime, video, nodeID);
        } else {
            video.playbackRate = 1 + viewNode.playbackBoost * 0.01;
            viewNode.lastRateAdjust = vwf.time() * 1000; // make sure we don't adjust rate until playback has settled in, and after any emergency jump we decide to do
            viewNode.jumpIfNeeded = false;
            // if the video is blocked from playing, enter a stepping mode in which we move the video forward with successive pause() calls
            viewNode.isPlaying = true;
            this.play(video, this.calculateVideoTime(nodeID) + 0.1, nodeID).then(playStarted => {

                if (playStarted) {
                    setTimeout(function () {
                        viewNode.jumpIfNeeded = true;
                    }, 250);
                }
                else if (!video.muted) {
                    console.log(`trying with mute`);
                    video.muted = true;
                    this.applyPlayState(nodeID);
                }
                else {
                    console.log(`reverting to stepped display`);
                    viewNode.isStepping = true;
                    this.stepWhileBlocked(nodeID);
                }

                //this.iconVisible('enableSound', !playStarted || videoElem.muted);
                //if (playStarted) this.future(250).triggerJumpCheck(); // leave it a little time to stabilise
            })
        }

    }

    animate(frameCount, metadata) {

        let driver = vwf.views["/drivers/view/two"];

        if (driver) {
            let self = driver.instance;

            let videos = Object.values(self.state.nodes).filter(el => el.fillType == "video");
            videos.forEach(el => {

                let viewNode = self.nodes[el.ID];
                let node = self.state.nodes[el.ID];
                let video = node.obj.fill.image;
                let currentTime = video.currentTime;
                //console.log(video.currentTime);

                if (node.bodyNode) {
                    let bodyNode = self.state.nodes[node.bodyNode];
                    //if(metadata.presentedFrames % 5 == 0){
                    if (viewNode.bodyTrack && bodyNode.motionData) {

                        //console.log(currentTime);
                        let bodyFrameNumber = Object.keys(bodyNode.motionData).filter(n => (Math.abs(Number.parseFloat(n) - currentTime) < 0.02))[0];
                        let bodyFrame = bodyNode.motionData[bodyFrameNumber];

                        let mul = 950;
                        if (bodyFrame) {
                            bodyNode.obj.children.map((e, i) => {
                                if (e.nodeID.includes("joint")) {
                                    e.translation.x = bodyFrame[i].x * mul;
                                    e.translation.y = bodyFrame[i].y * mul;
                                }
                            })

                            //16-14-12-11-13-15 - topline
                            //12-24-23-11 - bottomline


                            //18,16,20 - rh // 16,22
                            //17,15,19 - lh // 15,21
                            //let faceArr = [10,8,6,4,1,3,7,9]

                            let ta = [16, 14, 12, 11, 13, 15];
                            let topline = bodyNode.obj.children.filter(e => (e.nodeID.includes("topline")))[0];
                            if (topline) {
                                ta.map((e, i) => {
                                    topline.vertices[i].set(bodyFrame[e].x * mul, bodyFrame[e].y * mul);
                                })
                            }

                            let rh = [18, 16, 20];
                            let rhline = bodyNode.obj.children.filter(e => (e.nodeID.includes("rhand")))[0];
                            if (rhline) {
                                rh.map((e, i) => {
                                    rhline.vertices[i].set(bodyFrame[e].x * mul, bodyFrame[e].y * mul);
                                })
                            }

                            let lh = [17, 15, 19];
                            let lhline = bodyNode.obj.children.filter(e => (e.nodeID.includes("lhand")))[0];
                            if (lhline) {
                                lh.map((e, i) => {
                                    lhline.vertices[i].set(bodyFrame[e].x * mul, bodyFrame[e].y * mul);
                                })
                            }

                            let rh2 = [16, 22];
                            let rhline2 = bodyNode.obj.children.filter(e => (e.nodeID.includes("rhand2")))[0];
                            if (rhline2) {
                                rh2.map((e, i) => {
                                    rhline2.vertices[i].set(bodyFrame[e].x * mul, bodyFrame[e].y * mul);
                                })
                            }

                            let lh2 = [15, 21];
                            let lhline2 = bodyNode.obj.children.filter(e => (e.nodeID.includes("lhand2")))[0];
                            if (lhline2) {
                                lh2.map((e, i) => {
                                    lhline2.vertices[i].set(bodyFrame[e].x * mul, bodyFrame[e].y * mul);
                                })
                            }

                            let faceArr = [10, 8, 6, 4, 1, 3, 7, 9, 10];
                            let faceline = bodyNode.obj.children.filter(e => (e.nodeID.includes("faceline")))[0];
                            if (faceline) {
                                faceArr.map((e, i) => {
                                    faceline.vertices[i].set(bodyFrame[e].x * mul, bodyFrame[e].y * mul);
                                })
                            }

                            // let ba = [11,23]; //[12,24,23,11];
                            // let bottomline = bodyNode.obj.children.filter(e=>(e.nodeID.includes("bottomline")))[0];
                            // if(bottomline){
                            //     ba.map((e,i)=>{
                            //         bottomline.vertices[i].set(bodyFrame[e].x*mul, bodyFrame[e].y*mul);
                            //     })
                            // }

                        }
                    }
                }
                //}

                //video.requestVideoFrameCallback(self.animate);
            })

        }
    }

    checkPlayStatus() {
        let self = this.instance;
        //let scene = self.nodes[vwf.application()];

        let videos = Object.values(self.state.nodes).filter(el => el.fillType == "video");
        videos.forEach(el => {
            this.checkPlayStatusForNode(el.ID);
        })

        let toneJSDriver = vwf.views["/drivers/view/tone"];
        if (toneJSDriver) {
            let toneTransport = Object.values(toneJSDriver.state.nodes).filter(el => el.extendsID == "proxy/tonejs/transport.vwf")[0];
            if (toneTransport) {
                toneJSDriver.fabric.checkPlayStatusForTransportNode(toneTransport.ID);
            }
        }


    }

    checkPlayStatusForNode(nodeID) {
        let self = this.instance;
        let viewNode = self.nodes[nodeID];
        let node = self.state.nodes[nodeID];
        let video = node.obj.fill.image;

        //if (this.videoView) {
        // this.adjustPlaybar();

        const lastTimingCheck = viewNode.lastTimingCheck || 0;
        const now = vwf.time() * 1000;
        // check video timing every 0.5s
        if (viewNode.isPlaying && !viewNode.isBlocked && (now - lastTimingCheck >= 500)) {
            viewNode.lastTimingCheck = now;
            const expectedTime = this.wrappedTime(this.calculateVideoTime(nodeID), false, video.duration);
            const videoTime = video.currentTime;
            const videoDiff = videoTime - expectedTime;
            const videoDiffMS = videoDiff * 1000; // +ve means *ahead* of where it should be
            if (videoDiff < video.duration / 2) { // otherwise presumably measured across a loop restart; just ignore.
                if (viewNode.jumpIfNeeded) { //this.jumpIfNeeded
                    viewNode.jumpIfNeeded = false;
                    // if there's a difference greater than 500ms, try to jump the video to the right place
                    if (Math.abs(videoDiffMS) > 500) {
                        console.log(`jumping video by ${-Math.round(videoDiffMS)}ms`);
                        video.currentTime = this.wrappedTime(videoTime - videoDiff + 0.1, true, video.duration); // 0.1 to counteract the delay that the jump itself tends to introduce; true to ensure we're not jumping beyond the last video frame
                    }
                } else {
                    // every 3s, check video lag/advance, and set the playback rate accordingly.
                    // current adjustment settings:
                    //   > 150ms off: set playback 3% faster/slower than normal
                    //   > 50ms: 1% faster/slower
                    //   < 25ms: normal (i.e., hysteresis between 50ms and 25ms in the same sense)
                    const lastRateAdjust = viewNode.lastRateAdjust || 0;
                    if (now - lastRateAdjust >= 3000) {
                        //console.log(`${Math.round(videoDiff*1000)}ms`);
                        const oldBoostPercent = viewNode.playbackBoost;
                        const diffAbs = Math.abs(videoDiffMS), diffSign = Math.sign(videoDiffMS);
                        const desiredBoostPercent = -diffSign * (diffAbs > 150 ? 3 : (diffAbs > 50 ? 1 : 0));
                        if (desiredBoostPercent !== oldBoostPercent) {
                            // apply hysteresis on the switch to boost=0.
                            // for example, if old boost was +ve (because video was lagging),
                            // and videoDiff is -ve (i.e., it's still lagging),
                            // and the magnitude (of the lag) is greater than 25ms,
                            // don't remove the boost yet.
                            const hysteresisBlock = desiredBoostPercent === 0 && Math.sign(oldBoostPercent) === -diffSign && diffAbs >= 25;
                            if (!hysteresisBlock) {
                                viewNode.playbackBoost = desiredBoostPercent;
                                const playbackRate = 1 + viewNode.playbackBoost * 0.01;
                                console.log(`video playback rate: ${playbackRate}`);
                                video.playbackRate = playbackRate;
                            }
                        }
                        viewNode.lastRateAdjust = now;
                    }
                }
            }
        }
        // }
    }

    wrappedTime(videoTime, guarded, duration) {
        if (duration) {
            while (videoTime > duration) videoTime -= duration; // assume it's looping, with no gap between plays
            if (guarded) videoTime = Math.min(duration - 0.1, videoTime); // the video element freaks out on being told to seek very close to the end
        }
        return videoTime;
    }

    calculateVideoTime(nodeID) {

        let self = this.instance;
        const node = self.state.nodes[nodeID];
        const viewNode = self.nodes[nodeID];
        //const video = node.obj.fill.image;

        // const { isPlaying, startOffset } = this.latestPlayState;
        //if (!isPlaying) debugger;

        const sessionNow = vwf.time() * 1000;
        let t = (sessionNow - viewNode.latestPlayState.startOffset) / 1000;
        // console.log('Time: ', t)
        return t;
    }

    pause(videoTime, video, nodeID) {
        let self = this.instance;
        const node = self.state.nodes[nodeID];
        const viewNode = self.nodes[nodeID];

        viewNode.isPlaying = viewNode.isBlocked = false; // might not be blocked next time.
        this.setStatic(videoTime, video);
    }

    setStatic(videoTime, video) {
        if (video) {
            if (videoTime !== undefined) video.currentTime = this.wrappedTime(videoTime, true, video.duration); // true => guarded from values too near the end
            video.pause(); // no return value; synchronous, instantaneous?
        }
    }

    triggerJumpCheck(nodeID) {
        let self = this.instance;
        //const node = self.state.nodes[nodeID];
        const viewNode = self.nodes[nodeID];

        viewNode.jumpIfNeeded = true;
    }

    stepWhileBlocked(nodeID) {
        let _self = this;
        let self = this.instance;
        const node = self.state.nodes[nodeID];
        const viewNode = self.nodes[nodeID];
        const video = node.obj.fill.image;

        if (!viewNode.isStepping) return; // we've left stepping mode
        if (!viewNode.isBlocked) {
            viewNode.isStepping = false;
            return;
        }
        this.setStatic(this.calculateVideoTime(nodeID), video);

        setTimeout(function () {
            _self.stepWhileBlocked(nodeID)
        }, 250);

        //this.future(250).stepWhileBlocked(); // jerky, but keeping up
    }

    async play(video, videoTime, nodeID) {

        let self = this.instance;
        const node = self.state.nodes[nodeID];
        const viewNode = self.nodes[nodeID];

        // return true if video play started successfully
        const duration = video.duration;
        video.currentTime = this.wrappedTime(videoTime, true, duration);
        viewNode.isPlaying = true;
        //this.isPlaying = true; // even if it turns out to be blocked by the browser
        // following guidelines from https://developer.mozilla.org/docs/Web/API/HTMLMediaElement/play
        try {
            await video.play(); // will throw exception if blocked
            viewNode.isBlocked = false;
        } catch (err) {
            console.warn("video play blocked");
            viewNode.isBlocked = viewNode.isPlaying; // just in case isPlaying was set false while we were trying
        }
        return !viewNode.isBlocked;
    }

    /////


    getOverlayChilds(node, x, y) {
        //let childs = node.scene.obj.scene.children;
        var childs = [];
        node.children.forEach(el => {
            if (!el.nodeID.includes('avatar')) {
                let rect = el.getBoundingClientRect();
                if (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) {
                    childs.push(el);
                    if (el.nodeName == "group") {
                        childs = childs.concat(this.getOverlayChilds(el, x, y));
                    }
                }
            }
        })

        return childs

    }

    updateAvatarPosition() {
        let self = this.instance;
        let avatarName = 'avatar-' + self.kernel.moniker();
        var node = self.state.nodes[avatarName];
        var nodeView = self.nodes[avatarName];
        let scene = self.nodes[vwf.application()];

        if (!node) return;
        if (!node.obj) return;

        let position = scene.mouse;

        if (!nodeView.lastPosition) {
            nodeView.lastPosition = new Two.Vector(position.x, position.y);
        }

        let lastPosition = nodeView.lastPosition;

        if (position && !(position.equals(lastPosition))) {
            // self.kernel.setProperty(avatarName, "x", position.x);
            // self.kernel.setProperty(avatarName, "y", position.y);
            self.kernel.callMethod(avatarName, "move", [position.x, position.y]);
        }

        nodeView.lastPosition.set(position.x, position.y)

    }


    postLoadAction(nodeID) {

        //vwf_view.kernel.fireEvent(nodeID, "postLoadAction")
    }


}

export { TwoView as default }