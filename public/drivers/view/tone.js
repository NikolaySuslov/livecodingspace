/*
The MIT License (MIT)
Copyright (c) 2014-2020 Nikolai Suslov and the Krestianstvo.org project contributors. (https://github.com/NikolaySuslov/livecodingspace/blob/master/LICENSE.md)

This driver includes the port and some code parts from the "Croquet synced video demo" for implementing Player elements syncing within LiveCoding.space applications and LCS Reflector / Luminary.

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

// VWF & Tone driver


import { Fabric } from '/core/vwf/fabric.js';
//import * as Tone from '/drivers/view/tonejs/dist/Tone.js';

class ToneViewDriver extends Fabric {

    constructor(module) {
        console.log("ToneViewDriver constructor");
        super(module, 'View');
    }

    factory() {

        let _self_ = this;

        return this.load(this.module,
            {

                initialize: function () {

                    let self = this;

                    this.fabric = _self_;

                    this.nodes = {};

                    this.toneStarted = false;

                    function toneStart() {
                        if (!self.toneStarted) {
                            let ctx = Tone.getContext();
                            if (ctx.state == 'suspended') {
                                Tone.getContext().resume().then(r => {

                                    console.log("context started");
                                    self.toneStarted = true;

                                    let toneTransport = Object.values(self.state.nodes).filter(el => el.extendsID == "proxy/tonejs/transport.vwf")[0];
                                    if (toneTransport) {
                                        _self_.applyPlayState(toneTransport.ID);
                                    }

                                    
                                });
                            }
                            // Tone.start().then(r => {
                            //     let toneTransport = Object.values(self.state.nodes).filter(el => el.extendsID == "proxy/tonejs/transport.vwf")[0];
                            //     if (toneTransport) {
                            //         _self_.applyPlayState(toneTransport.ID);
                            //     }
                            //     console.log("context started");
                            //     self.toneStarted = true;
                            // });

                            document.body.removeEventListener("click", toneStart, false);
                        }
                    }

                    document.body.addEventListener("click", toneStart, false);
                    //window._Tone = Tone.default;
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

                    this.nodes[childID] = {
                        id: childID,
                        extends: childExtendsID,
                        parent: nodeID,
                        toneObj: node.toneObj

                    };

                    if (this.nodes[childID].extends == "proxy/tonejs/transport.vwf") {

                        this.nodes[childID].playbackBoost = 0;
                        //_self_.applyPlayState(nodeId);    
                        this.nodes[childID].lastTimingCheck = vwf.time() * 1000;

                    }


                },

                firedEvent: function (nodeID, eventName, eventParameters) {

                    //let self = this;
                },

                initializedProperty: function (nodeId, propertyName, propertyValue) {
                    return this.satProperty(nodeId, propertyName, propertyValue);
                },

                satProperty: function (nodeId, propertyName, propertyValue) {
                    let self = this;

                    var node = this.state.nodes[nodeId];
                    const viewNode = this.nodes[nodeId];

                    if (!(node && node.toneObj)) {
                        return;
                    }

                    // if(propertyName == "state"){
                    // 	//let toneState = node.toneObj.state;
                    // 	if(propertyValue == "started"){
                    // 		node.toneObj.start()
                    // 	} else if (!propertyValue || propertyValue== "stopped"){
                    // 		node.toneObj.stop()
                    // 	} else if (propertyValue == "paused"){
                    // 		node.toneObj.pause()
                    // 	}
                    // }

                    if (viewNode.extends == "proxy/tonejs/player.vwf") {

                        if (propertyName == "url") {

                            node.toneObj.load(propertyValue).then(r => { //buffer.load for GrainPLayer
                                console.log('LOADED: ', node);
                                if (node.toneObj.startTime && node.toneObj.state == "stopped") {
                                    node.toneObj.sync().start(node.toneObj.startTime);
                                }
                            })
                        }

                        if (propertyName == "startTime") {
                            if (node.toneObj.state == "stopped") {
                                if (node.toneObj.loaded == true)
                                    node.toneObj.sync().start(propertyValue);
                            }
                        }

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

                },

                /*
                 * Receives incoming messages
                 */
                calledMethod: function (nodeID, methodName, methodParameters, methodValue) {

                    let self = this;

                    let node = this.state.nodes[nodeID];
                    const viewNode = this.nodes[nodeID];

                    // If the "nodes" object does not have this object in it, it must not be one that
                    // this driver cares about
                    if (!node) {
                        return;
                    }


                    if (methodName == "syncTransportState") {
                        _self_.applyPlayState(nodeID);
                    }

                    if (methodName == "setTransportState") {

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

                    if (methodName == "toggleTransport") {

                        const obj = node.toneObj;

                        const wantsToPlay = !viewNode.latestPlayState.isPlaying; // toggle
                        //viewNode.isPlaying = wantsToPlay;

                        if (!wantsToPlay) {
                            viewNode.isPlaying = false;
                            _self_.pause(undefined, obj);
                        } // immediately!


                        const objTime = obj.seconds; //obj.position;
                        const sessionTime = vwf.time() * 1000; // the session time corresponding to the video time
                        const startOffset = wantsToPlay ? sessionTime - 1000 * objTime : null;
                        const pausedTime = wantsToPlay ? 0 : objTime;


                        vwf_view.kernel.callMethod(nodeID, "setTransportState", [wantsToPlay, startOffset, pausedTime]);

                    }

                    if (self.state.isPlayerDefinition(node.prototypes)) {

                        if (methodName == "syncStart") {
                            if (node.toneObj.state == "stopped") {
                                if (methodParameters[0] == "now") {
                                    node.toneObj.sync().start(Tone.Transport.seconds);
                                } else {
                                    node.toneObj.sync().start(methodParameters[0]);
                                }
                            }

                        }

                        if (methodName == "start") {

                            node.toneObj.start();
                        }

                        if (methodName == "stop") {

                            if (node.toneObj.state == "started")
                                node.toneObj.stop();
                        }

                        if (methodName == "syncStop") {

                            if (node.toneObj.state == "started")
                                node.toneObj.sync().stop();
                        }

                        // if (methodName == "pause") {

                        // 	node.toneObj.pause();
                        // }

                    }

                    if (self.state.isTransportDefinition(node.prototypes)) {

                        if (methodName == "start") {

                            node.toneObj.start();
                        }

                        if (methodName == "stop") {

                            if (node.toneObj.state == "started")
                                node.toneObj.stop();
                        }
                        if (methodName == "pause") {

                            node.toneObj.pause();
                        }

                    }

                    if (methodName == "sync") {
                        if (node.toneObj) {
                            node.toneObj.sync();
                        }
                    }

                    if (methodName == "scheduleRepeat") {
                        Tone.Transport.scheduleRepeat((time) => {
                            // use the callback time to schedule events
                            //node.toneObj.start(time).stop(time + 0.2);
                            node.toneObj.triggerAttackRelease("C4", "32n", time);
                        }, "8n");
                    }


                    if (methodName == "triggerAttackRelease") {

                        if (node.toneObj) {
                            const now = methodParameters[2] ? methodParameters[2] :
                                (node.toneObj._synced ? Tone.Transport.seconds : undefined);//Tone.now());

                            let notes = methodParameters[0];
                            // let notes = methodParameters[0].map(el=>{
                            // 	return Tone.Frequency(el).toNote();
                            // }) 

                            if (self.state.isMembraneSynthDefinition(node.prototypes)) {
                                node.toneObj.triggerAttackRelease(notes[0], methodParameters[1][0], now);
                            } else if (self.state.isNoiseSynthDefinition(node.prototypes)) {
                                node.toneObj.triggerAttackRelease("16n", now)
                            }
                            else {
                                node.toneObj.triggerAttackRelease(notes, methodParameters[1], now, methodParameters[3])
                            }


                        }

                    }

                    if (methodName == "triggerAttack") {

                        if (node.toneObj) {
                            const now = Tone.now()
                            node.toneObj.triggerAttack(methodParameters[0], now, methodParameters[1])
                        }

                    }

                    if (methodName == "triggerRelease") {

                        if (node.toneObj) {
                            node.toneObj.triggerRelease(methodParameters[0], "+0.1")
                        }

                    }



                }

            });

    }


    checkPlayStatusForTransportNode(nodeID) {

        const now = vwf.time() * 1000;
        let self = this.instance;
        let viewNode = self.nodes[nodeID];
        let node = self.state.nodes[nodeID];

        // 	let playerNodes = Object.values(self.state.nodes).filter(el=>(el.extendsID == "proxy/tonejs/player.vwf"));
        // 	let notloaded = playerNodes.filter(el=>(el.toneObj.loaded == false));

        // 	if(notloaded.length > 0) return

        //   let syncedPlayers =  playerNodes.filter(el=>(el.toneObj._synced == true));

        let video = node.toneObj;
        let duration = video.duration; //(video.loopEnd - video.loopStart); // //
        let currentTime = video.seconds;

        //if (this.videoView) {
        // this.adjustPlaybar();

        const lastTimingCheck = viewNode.lastTimingCheck || 0;

        // check video timing every 0.5s
        if (viewNode.isPlaying && (now - lastTimingCheck >= 500)) {
            viewNode.lastTimingCheck = now;
            const expectedTime = this.wrappedTime(this.calculateVideoTime(nodeID), false, duration);
            //const videoTime = video.seconds;
            const videoDiff = currentTime - expectedTime;
            const videoDiffMS = videoDiff * 1000; // +ve means *ahead* of where it should be
            if (videoDiff < duration / 2) { // otherwise presumably measured across a loop restart; just ignore.
                if (viewNode.jumpIfNeeded) { //this.jumpIfNeeded
                    viewNode.jumpIfNeeded = false;
                    // if there's a difference greater than 500ms, try to jump the video to the right place
                    if (Math.abs(videoDiffMS) > 500) {
                        console.log(`jumping video by ${-Math.round(videoDiffMS)}ms`);
                        video.pause();
                        video.seconds = this.wrappedTime(currentTime - videoDiff, true, duration); //+ 0.1
                        video.start();

                        // 0.1 to counteract the delay that the jump itself tends to introduce; true to ensure we're not jumping beyond the last video frame
                    }
                } else {
                    // every 3s, check video lag/advance, and set the playback rate accordingly.
                    // current adjustment settings:
                    //   > 150ms off: set playback 3% faster/slower than normal
                    //   > 50ms: 1% faster/slower
                    //   < 25ms: normal (i.e., hysteresis between 50ms and 25ms in the same sense)
                    //////
                    // const lastRateAdjust = viewNode.lastRateAdjust || 0;
                    // if (now - lastRateAdjust >= 3000) {
                    //     //console.log(`${Math.round(videoDiff*1000)}ms`);
                    //     const oldBoostPercent = viewNode.playbackBoost;
                    //     const diffAbs = Math.abs(videoDiffMS), diffSign = Math.sign(videoDiffMS);
                    //     const desiredBoostPercent = -diffSign * (diffAbs > 150 ? 3 : (diffAbs > 50 ? 1 : 0));
                    //     if (desiredBoostPercent !== oldBoostPercent) {
                    //         // apply hysteresis on the switch to boost=0.
                    //         // for example, if old boost was +ve (because video was lagging),
                    //         // and videoDiff is -ve (i.e., it's still lagging),
                    //         // and the magnitude (of the lag) is greater than 25ms,
                    //         // don't remove the boost yet.
                    //         const hysteresisBlock = desiredBoostPercent === 0 && Math.sign(oldBoostPercent) === -diffSign && diffAbs >= 25;
                    //         if (!hysteresisBlock) {
                    //             viewNode.playbackBoost = desiredBoostPercent;
                    //             const playbackRate = 1 + viewNode.playbackBoost * 0.01;
                    //             console.log(`video playback rate: ${playbackRate}`);

                    //             //video.bpm.value = playbackRate*video.initbpm;

                    //             //   video.bpm.rampTo(playbackRate*video.initbpm, 0.1);
                    //             // if(syncedPlayers.length > 0){
                    //             //     syncedPlayers.map(el=>{
                    //             //         el.toneObj.playbackRate = playbackRate;
                    //             //         console.log("change playbackRate for ", el.ID, playbackRate);
                    //             //     })
                    //             // }


                    //             //player.seek(progress * this.player.buffer.duration)

                    //             //video.playbackRate = playbackRate;

                    //         }
                    //     }
                    //     viewNode.lastRateAdjust = now;
                    // }
                }
            }
        }
        // }
    }


    wrappedTime(videoTime, guarded, duration) {
        if (duration) {
            while (videoTime > duration) videoTime -= duration; // assume it's looping, with no gap between plays
            if (guarded) videoTime = Math.min(duration, videoTime); // the video element freaks out on being told to seek very close to the end //- 0.1
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
        //console.log('Time: ', t)
        return t;
    }

    pause(videoTime, video) {
        //this.isPlaying = this.isBlocked = false; // might not be blocked next time.
        this.setStatic(videoTime, video);
    }

    setStatic(videoTime, video) {
        let duration = video.duration;// video.loopEnd - video.loopStart; //video.duration; //

        if (videoTime !== undefined) {



            if (video.state == "started") {
                video.pause(); // no return value; synchronous, instantaneous?
            }
            video.seconds = this.wrappedTime(videoTime, true, duration); // true => guarded from values too near the end
        }

    }

    async play(video, videoTime) {

        let self = this.instance;
        let playerNodes = Object.values(self.state.nodes).filter(el=>(el.extendsID == "proxy/tonejs/player.vwf"));
        let notloaded = playerNodes.filter(el=>(el.toneObj.loaded == false));
        if(notloaded.length > 0) return


        // return true if video play started successfully
        let duration = video.duration; //video.loopEnd - video.loopStart; //

        //this.isPlaying = true; // even if it turns out to be blocked by the browser
        // following guidelines from https://developer.mozilla.org/docs/Web/API/HTMLMediaElement/play
        // if(video.state == "stopped" || video.state == "paused") {
        let position = this.wrappedTime(videoTime, true, duration);

        if (video.state == "started") {
            video.pause();
            video.seconds = this.wrappedTime(videoTime, true, duration);
            video.start();
        }

        if (video.state == "stopped" || video.state == "paused") {
            video.start();
        }


        //video.toggle();

        //}

        // try {
        //     await video.start(); // will throw exception if blocked
        //     //this.isBlocked = false;
        // } catch (err) {
        //     console.warn("video play blocked");
        //     // this.isBlocked = this.isPlaying; // just in case isPlaying was set false while we were trying
        // }
        return true //!this.isBlocked;
    }

    applyPlayState(nodeID) {
        let self = this.instance;
        const node = self.state.nodes[nodeID];
        const viewNode = self.nodes[nodeID];
        const video = node.toneObj;

        if (viewNode.latestPlayState) {

            if (!viewNode.latestPlayState.isPlaying) {
                // this.iconVisible('play', true);
                // this.iconVisible('enableSound', false);
                this.pause(viewNode.latestPlayState.pausedTime, video);
            } else {
                //video.playbackRate = 1 + viewNode.playbackBoost * 0.01;

                //let playerNodes = Object.values(self.state.nodes).filter(el=>(el.extendsID == "proxy/tonejs/player.vwf"));
                //let notloaded = playerNodes.filter(el=>(el.toneObj.loaded == false));
                //if(notloaded.length > 0) return

                // let syncedPlayers =  playerNodes.filter(el=>(el.toneObj._synced == true));
                // let playbackRate = 1 + viewNode.playbackBoost * 0.01;

                //video.bpm.rampTo(playbackRate*video.initbpm, 0.1);
                //video.bpm.value = playbackRate*video.initbpm;

                //    video.bpm.rampTo(playbackRate*video.initbpm, 0.1);
                // if(syncedPlayers.length > 0){
                //     syncedPlayers.map(el=>{
                //         el.toneObj.playbackRate = playbackRate;
                //         console.log("change playbackRate for ", el.ID, playbackRate);
                //     })
                // }

                viewNode.lastRateAdjust = vwf.time() * 1000; // make sure we don't adjust rate until playback has settled in, and after any emergency jump we decide to do
                viewNode.jumpIfNeeded = false;
                // if the video is blocked from playing, enter a stepping mode in which we move the video forward with successive pause() calls
                viewNode.isPlaying = true;
                this.play(video, this.calculateVideoTime(nodeID)).then(playStarted => { // + 0.1

                    if (playStarted) {
                        // setTimeout(function () {
                        viewNode.jumpIfNeeded = true;
                        //  }, 250);
                    }

                    //this.iconVisible('enableSound', !playStarted || videoElem.muted);
                    //if (playStarted) this.future(250).triggerJumpCheck(); // leave it a little time to stabilise
                })
            }

        }

    }



}

export { ToneViewDriver as default }
