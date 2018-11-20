"use strict";
/*
The MIT License (MIT)
Copyright (c) 2014-2018 Nikolai Suslov and the Krestianstvo.org project contributors. (https://github.com/NikolaySuslov/livecodingspace/blob/master/LICENSE.md)

Virtual World Framework Apache 2.0 license  (https://github.com/NikolaySuslov/livecodingspace/blob/master/licenses/LICENSE_VWF.md)
*/

// VWF & A-Frame components view driver

define(["module", "vwf/view"], function (module, view) {
    var self;

    return view.load(module, {

        // == Module Definition ====================================================================

        initialize: function (options) {
            self = this;
            this.nodes = {};

            this.tickTime = 0;
            this.realTickDif = 50;
            this.lastrealTickDif = 50;
            this.lastRealTick = performance.now();

            this.state.appInitialized = false;
            
                        if (typeof options == "object") {
            
                            this.rootSelector = options["application-root"];
                        }
                        else {
                            this.rootSelector = options;
                        }
         
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


            if(this.state.nodes[childID]) {
                this.nodes[childID] = {id:childID,extends:childExtendsID};
            } 
            else if (this.state.nodes[childID] && this.state.nodes[childID].aframeObj) {
                this.nodes[childID] = {
                    id:childID,
                    extends:childExtendsID
                };
            }
          
        },

        initializedNode: function( nodeID, childID ) {
            
                        var node = this.state.nodes[childID];

                        if (!node) {
                            return;
                        }

                        if (this.nodes[childID].extends == "http://vwf.example.com/aframe/a-sound-component.vwf"){
                            console.log(vwf.getProperty(childID, 'isPlaying'));
                            self.kernel.callMethod(childID, "playSound");
                    }

                    },

        createdProperty: function (nodeId, propertyName, propertyValue) {
            return this.satProperty(nodeId, propertyName, propertyValue);
        },

        initializedProperty: function (nodeId, propertyName, propertyValue) {
            return this.satProperty(nodeId, propertyName, propertyValue);
        },



        satProperty: function (nodeId, propertyName, propertyValue) {
           
            var node = this.state.nodes[ nodeId ];
            
                        if ( !( node && node.aframeObj ) ) {
                            return;
                        }

                        if (node.name == "material") {

                            if (propertyName == 'repeat') {

                                let src = node.aframeObj.el.getAttribute('material').src;
                                if (src) {
                                    let srcID = src.id;
                                    let elID = '#'+ srcID;
                                    if(srcID) self.kernel.callMethod(nodeId, "updateSrc", [elID])
                                }
                               
     
                             }

                             if (propertyName == 'src') {

                                console.log("set src for: " + nodeId)

                             }

                        } 

                        
            // if (node.name == "material" && propertyName == 'color') {
    
            //     console.log("sat color on material");
            //     // let nodeColor = vwf.getProperty(node.parentID, propertyName);
             

            // }             

            // switch (propertyName) {
            //     case "color":
            //         if (propertyValue) {
            //            // self.kernel.callMethod (nodeId, 'initLang');
            //           // console.log("sat color "+ propertyValue)
            //         }
            //         break;
            // }
            

        },

        // firedEvent: function (nodeID, eventName, eventParameters) {
        // },


        ticked: function (vwfTime) {

            lerpTick ();

        },


        gotProperty: function (nodeId, propertyName, propertyValue) {
            var selfs = this;

            var node = this.state.nodes[nodeId];

            if (!(node && node.aframeObj)) {
                return;
            }


            // if (this.nodes[nodeId].extends == "http://vwf.example.com/aframe/a-sound-component.vwf"){
            //     if (propertyName == "currentTime"){
            //         console.log(node.aframeObj.el.components.sound.listener.context.currentTime);
            //     }
            // }

        },

        calledMethod: function( nodeID, methodName, methodParameters, methodValue ) {

            var node = this.state.nodes[nodeID];

            if (!(node && node.aframeObj)) {
                return;
            }

       
            if (this.nodes[nodeID].extends == "http://vwf.example.com/aframe/a-sound-component.vwf"){
                if (methodName == "stopSound"){

                    console.log("stop sound");
                    node.aframeObj.el.components.sound.stopSound();
                    self.kernel.setProperty(nodeID, "isPlaying", false);
                    //node.aframeObj.stopSound();
                }

                if (methodName == "playSound"){

                    console.log("play sound");
                    node.aframeObj.el.components.sound.playSound();
                    self.kernel.setProperty(nodeID, "isPlaying", true);
                    //node.aframeObj.stopSound();
                }

                if (methodName == "pauseSound"){

                    console.log("pause sound");
                    node.aframeObj.el.components.sound.pauseSound();
                    self.kernel.setProperty(nodeID, "isPlaying", false);
                    //node.aframeObj.stopSound();
                }
            }

        }


    });

    function lerpTick () {
        var now = performance.now();
        self.realTickDif = now - self.lastRealTick;

        self.lastRealTick = now;
 
        //reset - loading can cause us to get behind and always but up against the max prediction value
       // self.tickTime = 0;

       let interNodes = Object.entries(self.nodes).filter(node => 
        node[1].extends == 'http://vwf.example.com/aframe/interpolation-component.vwf');

       interNodes.forEach(node => {
           let nodeID = node[0];
        if ( self.state.nodes[nodeID] ) {      
            self.nodes[nodeID].tickTime = 0;
            if(!self.nodes[nodeID].interpolate)
            {
                self.nodes[nodeID].interpolate = {
                    'position': {},
                    'rotation': {}
                }
            }
            self.nodes[nodeID].interpolate.position.lastTick = (self.nodes[nodeID].interpolate.position.selfTick);
            self.nodes[nodeID].interpolate.position.selfTick = getPosition(nodeID);

            self.nodes[nodeID].interpolate.rotation.lastTick = (self.nodes[nodeID].interpolate.rotation.selfTick);
            self.nodes[nodeID].interpolate.rotation.selfTick = getRotation(nodeID);
            //console.log(self.nodes[nodeID].interpolate.rotation.selfTick);
            //self.nodes[nodeID].lastTickTransform = self.nodes[nodeID].selfTickTransform;
            //self.nodes[nodeID].selfTickTransform = getTransform(nodeID);
        }
       })

        // for ( var nodeID in interNodes ) {
        //     if ( self.state.nodes[nodeID] ) {      
        //         self.nodes[nodeID].tickTime = 0;
        //         self.nodes[nodeID].lastTickTransform = self.nodes[nodeID].selfTickTransform;
        //         self.nodes[nodeID].selfTickTransform = getTransform(nodeID);
        //     }
        // }


    }

    function getRotation(id) {
        let r = new THREE.Euler();
        let rot = r.copy(self.state.nodes[id].aframeObj.el.object3D.rotation);
        //let rot = self.state.nodes[id].aframeObj.el.getAttribute('rotation');
        //let interp = (new THREE.Vector3()).fromArray(Object.values(rot))//goog.vec.Mat4.clone(self.state.nodes[id].threeObject.matrix.elements);
        
        return rot;
    }

    function getPosition(id) {
        let p = new THREE.Vector3();
        let pos = p.copy(self.state.nodes[id].aframeObj.el.object3D.position);
        //let pos = self.state.nodes[id].aframeObj.el.getAttribute('position');
        //let interp = (new THREE.Vector3()).fromArray(Object.values(pos))//goog.vec.Mat4.clone(self.state.nodes[id].threeObject.matrix.elements);
        
        return pos;
    }

});
