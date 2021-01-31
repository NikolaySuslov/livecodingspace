/*
The MIT License (MIT)
Copyright (c) 2014-2020 Nikolai Suslov and the Krestianstvo.org project contributors. (https://github.com/NikolaySuslov/livecodingspace/blob/master/LICENSE.md)
*/

// VWF & A-Frame components view driver

import {Fabric} from '/core/vwf/fabric.js';

class AFrameComponentView extends Fabric {

  constructor(module) {
    console.log("AFrameComponentView constructor");
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
    
                this.tickTime = 0;
                this.realTickDif = 50;
                this.lastrealTickDif = 50;
                this.lastRealTick = performance.now();
                this.interpolateView = true;
    
                this.state.appInitialized = false;
    
                if (typeof options == "object") {
    
                    this.rootSelector = options["application-root"];
                }
                else {
                    this.rootSelector = options;
                }
    
                this.getRotation = function(id) {
                    let r = new THREE.Euler();
                    let rot = r.copy(self.state.nodes[id].aframeObj.el.object3D.rotation);
                    return rot;
                }
            
                this.getPosition = function (id) {
                    // let p = (new THREE.Vector3()).copy(self.state.nodes[id].aframeObj.el.object3D.position);
                    // let pos = goog.vec.Vec3.createFromValues(p.x, p.y, p.z)
                    return self.state.nodes[id].aframeObj.el.object3D.position.clone();
                }
            
               this.getScale = function (id) {
                    // let p = (new THREE.Vector3()).copy(self.state.nodes[id].aframeObj.el.object3D.scale);
                    // let data = goog.vec.Vec3.createFromValues(p.x, p.y, p.z)
                    return self.state.nodes[id].aframeObj.el.object3D.scale.clone();
                }
    
                // this.resetInterpolation = function (nodeID, propertyName) {
    
                //     if (propertyName == 'position') {
                //         self.nodes[nodeID].interpolate.position.lastTick = getPosition(nodeID);
                //         self.nodes[nodeID].interpolate.position.selfTick = goog.vec.Vec3.clone(self.nodes[nodeID].interpolate.position.lastTick);
                //     }
    
                //     if (propertyName == 'rotation') {
                //         self.nodes[nodeID].interpolate.rotation.lastTick = getRotation(nodeID);
                //         self.nodes[nodeID].interpolate.rotation.selfTick = self.nodes[nodeID].interpolate.rotation.lastTick;
                //     }
    
                // }
    
            },
    
            // initializedNode: function( nodeID, childID ) {
            // },
    
            createdNode: function (nodeID, childID, childExtendsID, childImplementsIDs,
                childSource, childType, childIndex, childName, callback /* ( ready ) */) {
    
                var node = this.state.nodes[childID];
    
                // If the "nodes" object does not have this object in it, it must not be one that
                // this driver cares about
                if (!node) {
                    return;
                }
    
    
                if (this.state.nodes[childID]) {
                    this.nodes[childID] = {
                        id: childID,
                        extends: childExtendsID,
                        entityID: this.state.nodes[childID].parentID,
                        liveBindings: {},
                        viewEdit: false
                    };
    
                    let entityID = this.state.nodes[childID].parentID;
                    let viewDriver = vwf.views["/drivers/view/aframe"];
                    let entityNode = Object.entries(viewDriver.nodes).find(el =>
                        el[1].id == entityID
                    )[1];
    
                    if (!entityNode.components)
                        entityNode.components = {}
    
    
                    entityNode.components[this.state.nodes[childID].name] = childID;
                    //console.log(entityNode);
    
    
                }
                // else if (this.state.nodes[childID] && this.state.nodes[childID].aframeObj) {
                //     this.nodes[childID] = {
                //         id:childID,
                //         extends:childExtendsID
                //     };
                // }
    
            },
    
            initializedNode: function (nodeID, childID) {
    
                let self = this;
                var node = this.state.nodes[childID];
    
                if (!node) {
                    return;
                }
    
                if (this.nodes[childID].extends == "proxy/aframe/a-sound-component.vwf") {
                    console.log(vwf.getProperty(childID, 'isPlaying'));
                    //self.kernel.callMethod(childID, "playSound");
                }
    
            },
    
            createdProperty: function (nodeId, propertyName, propertyValue) {
                return this.satProperty(nodeId, propertyName, propertyValue);
            },
    
            initializedProperty: function (nodeId, propertyName, propertyValue) {
                return this.satProperty(nodeId, propertyName, propertyValue);
            },
    
    
    
            satProperty: function (nodeId, propertyName, propertyValue) {
                let self = this;
                var node = this.state.nodes[nodeId];
    
                if (!(node && node.aframeObj)) {
                    return;
                }
    
                if (node.prototypes.includes("proxy/aframe/aMaterialComponent.vwf")) {
    
                    if (propertyName == 'repeat') {
    
                        self.kernel.callMethod(nodeId, "refreshSrc", []);
    
                        // let src = node.aframeObj.el.getAttribute('material').src;
                        // if (src) {
                        //     let srcID = src.id;
                        //     let elID = '#'+ srcID;
                        //     if(srcID) self.kernel.callMethod(nodeId, "updateSrc", [elID])
                        // }
    
    
                    }
    
    
                }
    
    
            },
    
            firedEvent: function (nodeID, eventName, eventParameters) {
                let self = this;
                var node = this.state.nodes[nodeID];
    
                if (!(node)) {
                    return;
                }

    
            },
    
            executed: function (nodeID, scriptText, scriptType) {
                let self = this;
                var node = this.state.nodes[nodeID];
    
                if (!(node)) {
                    return;
                }
    
            },
    
            ticked: function (vwfTime) {
               
                    _self_.lerpTick();
                
            },
    
            tocked: function (vwfTime) {
    
                // lerpTock ();
    
            },
    
    
            gotProperty: function (nodeId, propertyName, propertyValue) {
    
                var node = this.state.nodes[nodeId];
    
                if (!(node && node.aframeObj)) {
                    return;
                }
    
    
                // if (this.nodes[nodeId].extends == "proxy/aframe/a-sound-component.vwf"){
                //     if (propertyName == "currentTime"){
                //         console.log(node.aframeObj.el.components.sound.listener.context.currentTime);
                //     }
                // }
    
            },
    
            calledMethod: function (nodeID, methodName, methodParameters, methodValue) {
                let self = this;
                var node = this.state.nodes[nodeID];
    
                if (!(node && node.aframeObj)) {
                    return;
                }
    
    
                if (this.nodes[nodeID].extends == "proxy/aframe/a-sound-component.vwf") {
                    if (methodName == "stopSound") {
    
                        console.log("stop sound");
                        node.aframeObj.el.components.sound.stopSound();
                        self.kernel.setProperty(nodeID, "isPlaying", false);
                        //node.aframeObj.stopSound();
                    }
    
                    if (methodName == "playSound") {
    
                        console.log("play sound");
                        node.aframeObj.el.components.sound.playSound();
                        self.kernel.setProperty(nodeID, "isPlaying", true);
                        //node.aframeObj.stopSound();
                    }
    
                    if (methodName == "pauseSound") {
    
                        console.log("pause sound");
                        node.aframeObj.el.components.sound.pauseSound();
                        self.kernel.setProperty(nodeID, "isPlaying", false);
                        //node.aframeObj.stopSound();
                    }
                }
    
            }
        });


    }


    lerpTick() {
        // var now = performance.now();
        // self.realTickDif = now - self.lastRealTick;

        // self.lastRealTick = now;

        //reset - loading can cause us to get behind and always but up against the max prediction value
        // self.tickTime = 0;

        let self = this.instance;

        let interNodes = Object.entries(self.nodes).filter(node =>
            node[1].extends == 'proxy/aframe/interpolation-component.vwf');

        interNodes.forEach(node => {
            let nodeID = node[0];
            if (self.state.nodes[nodeID]) {

                if (!self.nodes[nodeID].lastRealTick)
                    self.nodes[nodeID].lastRealTick = performance.now();

                var now = performance.now();
                self.nodes[nodeID].realTickDif = now - self.nodes[nodeID].lastRealTick;
                self.nodes[nodeID].lastRealTick = now;

                self.nodes[nodeID].tickTime = 0;
                //console.log(self.nodes[nodeID].realTickDif);

                if (!self.nodes[nodeID].interpolate) {
                    self.nodes[nodeID].interpolate = {
                        'position': {},
                        'rotation': {},
                        'scale': {}
                    }
                }

                self.nodes[nodeID].interpolate.position.lastTick = (self.nodes[nodeID].interpolate.position.selfTick);
                self.nodes[nodeID].interpolate.position.selfTick = self.getPosition(nodeID);

                self.nodes[nodeID].interpolate.rotation.lastTick = (self.nodes[nodeID].interpolate.rotation.selfTick);
                self.nodes[nodeID].interpolate.rotation.selfTick = self.getRotation(nodeID);

                self.nodes[nodeID].interpolate.scale.lastTick = (self.nodes[nodeID].interpolate.scale.selfTick);
                self.nodes[nodeID].interpolate.scale.selfTick = self.getScale(nodeID);
                //console.log(self.nodes[nodeID].interpolate.rotation.selfTick);
                //self.nodes[nodeID].lastTickTransform = self.nodes[nodeID].selfTickTransform;
                //self.nodes[nodeID].selfTickTransform = getTransform(nodeID);
            }
        })

    }

   

}

export { AFrameComponentView as default }

