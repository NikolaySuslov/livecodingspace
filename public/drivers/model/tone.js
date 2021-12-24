/*
The MIT License (MIT)
Copyright (c) 2014-2020 Nikolai Suslov and the Krestianstvo.org project contributors. (https://github.com/NikolaySuslov/livecodingspace/blob/master/LICENSE.md)

*/

// VWF & ToneJS model driver

import { Fabric } from '/core/vwf/fabric.js';

class ToneModel extends Fabric {

    constructor(module) {

        console.log("ToneModel constructor");
        super(module, "Model");
    }

    factory() {
        let _self_ = this;

        return this.load(this.module,
            {

                // == Module Definition ====================================================================

                // -- pipeline -----------------------------------------------------------------------------

                // pipeline: [ log ], // vwf <=> log <=> scene

                // -- initialize ---------------------------------------------------------------------------

                initialize: function () {

                    var self = this;

                    this.state = {
                        nodes: {},
                        scenes: {},
                        prototypes: {},
                        createLocalNode: function (nodeID, childID, childExtendsID, childImplementsIDs,
                            childSource, childType, childIndex, childName, callback) {
                            return {
                                "parentID": nodeID,
                                "ID": childID,
                                "extendsID": childExtendsID,
                                "implementsIDs": childImplementsIDs,
                                "source": childSource,
                                "type": childType,
                                "name": childName,
                                "prototypes": undefined
                            };
                        },
                        isToneNodeComponent: function (prototypes) {
                            var found = false;
                            if (prototypes) {
                                for (var i = 0; i < prototypes.length && !found; i++) {
                                    found = (prototypes[i] === "proxy/tonejs/node.vwf");
                                }
                            }
                            return found;
                        },
                        isToneClass: function (prototypes, classID) {
                            if (prototypes) {
                                for (var i = 0; i < prototypes.length; i++) {
                                    if (prototypes[i] === classID) {
                                        //console.info( "prototypes[ i ]: " + prototypes[ i ] );
                                        return true;
                                    }
                                }
                            }
                            return false;
                        },
                        isTransportDefinition: function (prototypes) {
                            var found = false;
                            if (prototypes) {
                                for (var i = 0; i < prototypes.length && !found; i++) {
                                    found = (prototypes[i] == "proxy/tonejs/transport.vwf");
                                }
                            }
                            return found;
                        },
                        isPlayerDefinition: function (prototypes) {
                            var found = false;
                            if (prototypes) {
                                for (var i = 0; i < prototypes.length && !found; i++) {
                                    found = (prototypes[i] == "proxy/tonejs/player.vwf");
                                }
                            }
                            return found;
                        },
                        isSynthDefinition: function (prototypes) {
                            var found = false;
                            if (prototypes) {
                                for (var i = 0; i < prototypes.length && !found; i++) {
                                    found = (prototypes[i] == "proxy/tonejs/synth.vwf");
                                }
                            }
                            return found;
                        },
                        isMembraneSynthDefinition: function (prototypes) {
                            var found = false;
                            if (prototypes) {
                                for (var i = 0; i < prototypes.length && !found; i++) {
                                    found = (prototypes[i] == "proxy/tonejs/membraneSynth.vwf");
                                }
                            }
                            return found;
                        },
                        isNoiseSynthDefinition: function (prototypes) {
                            var found = false;
                            if (prototypes) {
                                for (var i = 0; i < prototypes.length && !found; i++) {
                                    found = (prototypes[i] == "proxy/tonejs/noiseSynth.vwf");
                                }
                            }
                            return found;
                        },
                        createToneObject: function (node, config) {

                            var protos = node.prototypes;
                            var toneObj = undefined;

                            if (this.isToneClass(protos, "proxy/tonejs/transport.vwf")) {
                                // global transport for now
                                toneObj = Tone.getTransport();
                            }

                            if (this.isToneClass(protos, "proxy/tonejs/player.vwf")) {
                                toneObj = new Tone.Player(); //GrainPlayer
                                toneObj.autostart = false;
                            }

                            if (this.isToneClass(protos, "proxy/tonejs/synth.vwf")) {
                                toneObj = new Tone.PolySynth(Tone.synth);
                            }

                            if (this.isToneClass(protos, "proxy/tonejs/membraneSynth.vwf")) {
                                toneObj = new Tone.PolySynth(Tone.MembraneSynth);
                                // toneObj.set({
                                //     envelope: {
                                //         release: 0.1
                                //     }
                                // });
                            }

                            if (this.isToneClass(protos, "proxy/tonejs/noiseSynth.vwf")) {
                                toneObj = new Tone.NoiseSynth();
                            }

                            if (this.isToneClass(protos, "proxy/tonejs/pluckSynth.vwf")) {
                                toneObj = new Tone.PolySynth(Tone.PluckSynth);
                            }


                            return toneObj
                        }
                    };

                    this.state.kernel = this.kernel.kernel.kernel;

                    //this.Tone = Tone;
                    //this.state.kernel = this.kernel.kernel.kernel;

                },
                // == Model API ============================================================================

                // -- creatingNode -------------------------------------------------------------------------

                creatingNode: function (nodeID, childID, childExtendsID, childImplementsIDs,
                    childSource, childType, childIndex, childName, callback /* ( ready ) */) {

                    // If the parent nodeID is 0, this node is attached directly to the root and is therefore either 
                    // the scene or a prototype.  In either of those cases, save the uri of the new node
                    var childURI = (nodeID === 0 ? childIndex : undefined);
                    var appID = this.kernel.application();

                    // If the node being created is a prototype, construct it and add it to the array of prototypes,
                    // and then return
                    var prototypeID = _self_.utility.ifPrototypeGetId(appID, this.state.prototypes, nodeID, childID);
                    if (prototypeID !== undefined) {

                        this.state.prototypes[prototypeID] = {
                            parentID: nodeID,
                            ID: childID,
                            extendsID: childExtendsID,
                            implementsID: childImplementsIDs,
                            source: childSource,
                            type: childType,
                            name: childName
                        };
                        return;
                    }

                    var protos = _self_.getPrototypes(this.kernel, childExtendsID);
                    //var kernel = this.kernel.kernel.kernel;
                    var node;

                    if (this.state.isToneNodeComponent(protos)) {

                        // Create the local copy of the node properties
                        if (this.state.nodes[childID] === undefined) {
                            this.state.nodes[childID] = this.state.createLocalNode(nodeID, childID, childExtendsID, childImplementsIDs,
                                childSource, childType, childIndex, childName, callback);
                        }

                        node = this.state.nodes[childID];
                        node.prototypes = protos;

                        //this.state.createToneObject(node);

                        let aframeDriver = vwf.views["/drivers/view/aframe"];
                        if (aframeDriver) {
                            let parentNode = aframeDriver.state.nodes[nodeID];
                            if (parentNode.aframeObj) {
                                let sceneEl = aframeDriver.state.nodes[nodeID].scene.sceneEl;
                                if (!sceneEl.audioListener) {
                                    sceneEl.audioListener = new THREE.AudioListener();
                                    sceneEl.camera && sceneEl.camera.add(sceneEl.audioListener);
                                    // sceneEl.addEventListener('camera-set-active', function (evt) {
                                    //     evt.detail.cameraEl.getObject3D('camera').add(sceneEl.audioListener);
                                    // });
                                    //this.gainNode = new Tone.Gain(0).toDestination();
                                    Tone.setContext(sceneEl.audioListener.context);
                                }
                                node.sound = new THREE.PositionalAudio(sceneEl.audioListener);
                                //Tone.setContext(node.sound.context);
                                //node.sound.context.resume();
                                node.toneObj = this.state.createToneObject(node);
                                //node.toneObj.connect(this.gainNode);
                                if (!this.state.isTransportDefinition(node.prototypes)) {
                                    node.sound.setNodeSource(node.toneObj);
                                    parentNode.aframeObj.object3D.add(node.sound);
                                }

                            }
                        } else {

                            node.toneObj = this.state.createToneObject(node);

                            if (!this.state.isTransportDefinition(node.prototypes)) {
                                node.toneObj.toDestination();
                            }

                            //node.sound.setNodeSource(node.toneObj);
                        }
                        //addNodeToHierarchy(node);
                        //notifyDriverOfPrototypeAndBehaviorProps();
                    }
                },

                // -- initializingNode -------------------------------------------------------------------------

                //   initializingNode: function( nodeID, childID, childExtendsID, childImplementsIDs,
                //     childSource, childType, childIndex, childName ) {

                // },

                // -- deletingNode -------------------------------------------------------------------------

                //deletingNode: function( nodeID ) {
                //},

                // -- initializingProperty -----------------------------------------------------------------

                initializingProperty: function (nodeID, propertyName, propertyValue) {

                    var value = undefined;
                    var node = this.state.nodes[nodeID];
                    if (node !== undefined) {
                        value = this.settingProperty(nodeID, propertyName, propertyValue);
                    }
                    return value;

                },

                // -- creatingProperty ---------------------------------------------------------------------

                creatingProperty: function (nodeID, propertyName, propertyValue) {
                    return this.initializingProperty(nodeID, propertyName, propertyValue);
                },


                // -- settingProperty ----------------------------------------------------------------------

                settingProperty: function (nodeID, propertyName, propertyValue) {

                    let self = this;
                    let node = this.state.nodes[nodeID];
                    var value = undefined;

                    if (node && node.toneObj && _self_.utility.validObject(propertyValue)) {

                        let toneObject = node.toneObj;

                        // if (self.state.isComponentNodeDefinition(node.prototypes)) {


                        //     value = propertyValue;
                        //     switch (propertyName) {

                        //         default:
                        //             value = undefined;
                        //             break;
                        //     }

                        // }


                        if (value === undefined && self.state.isTransportDefinition(node.prototypes)) {

                            value = propertyValue;

                            switch (propertyName) {


                                case "bpm":

                                    toneObject.bpm.value = propertyValue
                                    toneObject.initbpm = propertyValue
                                    break;

                                // case "state":

                                //     toneObject.state = propertyValue

                                //     break;

                                case "position":

                                    toneObject.position = propertyValue

                                    break;

                                case "loop":
                                    toneObject.loop = propertyValue
                                    break;

                                case "loopStart":

                                    if (typeof propertyValue == "string") {
                                        propertyValue = Tone.Time(propertyValue).toSeconds();
                                    }

                                    toneObject.loopStart = propertyValue
                                    break;

                                case "loopEnd":

                                    if (typeof propertyValue == "string") {
                                        propertyValue = Tone.Time(propertyValue).toSeconds();
                                    }

                                    toneObject.loopEnd = propertyValue
                                    break;

                                case "duration":
                                    if (typeof propertyValue == "string") {
                                        propertyValue = Tone.Time(propertyValue).toSeconds();
                                    }

                                    toneObject.duration = propertyValue
                                    break;

                                default:
                                    value = undefined;
                                    break;
                            }
                        }

                        if (value === undefined && self.state.isPlayerDefinition(node.prototypes)) {

                            value = propertyValue;

                            switch (propertyName) {


                                // case "url":

                                //     toneObject.load(propertyValue)
                                //     break;

                                // case "state":

                                //     toneObject.state = propertyValue

                                //     break;

                                case "startTime":

                                    toneObject.startTime = propertyValue

                                    break;

                                case "volume":

                                    toneObject.volume.value = propertyValue

                                    break;


                                case "mute":

                                    toneObject.mute = propertyValue

                                    break;

                                case "autostart":

                                    toneObject.autostart = propertyValue

                                    break;

                                case "loop":
                                    toneObject.loop = propertyValue
                                    break;

                                case "loopStart":
                                    toneObject.loopStart = propertyValue
                                    break;

                                case "loopEnd":
                                    toneObject.loopEnd = propertyValue
                                    break;

                                // case "duration":
                                //     toneObject.duration = propertyValue
                                //     break;

                                default:
                                    value = undefined;
                                    break;
                            }
                        }

                        if (value === undefined && self.state.isSynthDefinition(node.prototypes)) {

                            value = propertyValue;

                            switch (propertyName) {


                                case "type":

                                    toneObject.set({ oscillator: { type: propertyValue } })
                                    //"sine"; "square"; "triangle"; "sawtooth";

                                    break;

                                default:
                                    value = undefined;
                                    break;
                            }
                        }


                    }

                    return value;

                },

                // -- gettingProperty ----------------------------------------------------------------------

                gettingProperty: function (nodeID, propertyName, propertyValue) {

                    let self = this;
                    let node = this.state.nodes[nodeID];
                    let value = undefined;
                    if (node && node.toneObj) {

                        let toneObject = node.toneObj;

                        // if (self.state.isComponentNodeDefinition(node.prototypes)) {
                        //     switch (propertyName) {
                        //     }
                        // }


                        if (value === undefined && self.state.isTransportDefinition(node.prototypes)) {

                            switch (propertyName) {

                                case "bpm":
                                    value = toneObject.bpm.value
                                    break;

                                // case "state":
                                //     value = toneObject.state
                                //     break;

                                case "position":
                                    value = toneObject.position
                                    break;

                                case "loopStart":
                                    value = toneObject.loopStart
                                    break;

                                case "loopEnd":
                                    value = toneObject.loopEnd
                                    break;


                                case "duration":
                                    value = toneObject.duration
                                    break;

                                case "loop":
                                    value = toneObject.loop
                                    break;

                            }
                        }

                        if (value === undefined && self.state.isPlayerDefinition(node.prototypes)) {

                            switch (propertyName) {

                                case "autostart":
                                    value = toneObject.autostart
                                    break;

                                // case "state":
                                //     value = toneObject.state
                                //     break;

                                case "startTime":
                                    value = toneObject.startTime
                                    break;

                                case "volume":
                                    value = toneObject.volume.value
                                    break;

                                case "mute":
                                    value = toneObject.mute
                                    break;

                                case "loopStart":
                                    value = toneObject.loopStart
                                    break;

                                case "loopEnd":
                                    value = toneObject.loopEnd
                                    break;


                                case "duration":
                                    value = toneObject.buffer.duration
                                    break;

                                case "loop":
                                    value = toneObject.loop
                                    break;

                            }
                        }

                        if (value === undefined && self.state.isSynthDefinition(node.prototypes)) {

                            switch (propertyName) {

                                case "type":
                                    value = toneObject.options.oscillator.type
                                    break;
                            }
                        }


                    }

                    if (value !== undefined) {
                        propertyValue = value;
                    }

                    return value;


                }





            });

    }


    getPrototypes(kernel, extendsID) {
        var prototypes = [];
        var id = extendsID;

        while (id !== undefined) {
            prototypes.push(id);
            id = kernel.prototype(id);
        }
        return prototypes;
    }


}

export {
    ToneModel as default
}
