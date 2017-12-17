"use strict";

// VWF & A-Frame view driver
// Copyright 2017 Krestianstvo.org project
// 
// Copyright 2012 United States Government, as represented by the Secretary of Defense, Under
// Secretary of Defense (Personnel & Readiness).
// 
// Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except
// in compliance with the License. You may obtain a copy of the License at
// 
//   http://www.apache.org/licenses/LICENSE-2.0
// 
// Unless required by applicable law or agreed to in writing, software distributed under the License
// is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express
// or implied. See the License for the specific language governing permissions and limitations under
// the License.

/// vwf/view/lesson creates a view interface for instruction text. 
/// 
/// @module vwf/view/aframe
/// @requires vwf/view

define(["module", "vwf/view"], function (module, view) {
    var self;

    return view.load(module, {

        // == Module Definition ====================================================================

        initialize: function (options) {
            self = this;
            this.nodes = {};

            this.state.appInitialized = false;

            if (options === undefined) { options = {}; }

            if (typeof options == "object") {

                this.rootSelector = options["application-root"];
            }
            else {
                this.rootSelector = options;
            }

            this.gearvr = options.gearvr !== undefined ? options.gearvr : false;
            this.wmrright = options.wmrright !== undefined ? options.wmrright : false;
            this.wmrleft = options.wmrleft !== undefined ? options.wmrleft : false;
        },

        createdNode: function (nodeID, childID, childExtendsID, childImplementsIDs,
            childSource, childType, childIndex, childName, callback /* ( ready ) */) {

            var node = this.state.nodes[childID];

            // If the "nodes" object does not have this object in it, it must not be one that
            // this driver cares about
            if (!node) {
                return;
            }

            if (this.state.scenes[childID]) {
                let scene = this.state.scenes[childID];
                document.body.appendChild(scene); //append is not working in Edge browser
                createAvatarControl(scene);
                createAvatar.call(this, childID);

                // this.state.appInitialized  = true;

                if (this.gearvr == true) {
                    console.log("CREATE GEARVR HERE!!");
                    if (AFRAME.utils.device.isGearVR()) {
                        let nodeName = 'gearvr-' + self.kernel.moniker();
                        createGearVRControls();
                        createGearVRController.call(this, childID, nodeName);
                    }
                }

                if (this.wmrright == true) {
                    console.log("CREATE WMR RIGHT HERE!!");
                    if (AFRAME.utils.device.checkHasPositionalTracking()) {
                        let nodeName = 'wmrvr-right-' + self.kernel.moniker();
                        createWMRVRControls('right');
                        createWMRVR.call(this, childID, nodeName);
                    }
                }

                if (this.wmrright == true) {
                    console.log("CREATE WMR LEFT HERE!!");
                    if (AFRAME.utils.device.checkHasPositionalTracking()) {
                        let nodeName = 'wmrvr-left-' + self.kernel.moniker();
                        createWMRVRControls('left');
                        createWMRVR.call(this, childID, nodeName);
                    }
                }

            }

            if (this.state.nodes[childID] && this.state.nodes[childID].aframeObj) {
                this.nodes[childID] = { id: childID, extends: childExtendsID };
            }

            // if(this.state.nodes[childID]) {
            //     this.nodes[childID] = {id:childID,extends:childExtendsID};
            // } 
            // else if (this.state.nodes[childID] && this.state.nodes[childID].aframeObj.object3D instanceof THREE.Object3D) {
            //     this.nodes[childID] = {id:childID,extends:childExtendsID};
            // }

        },


        initializedNode: function (nodeID, childID) {

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

        satProperty: function (nodeId, propertyName, propertyValue) {
            var selfs = this;

            var node = this.state.nodes[nodeId];

            if (!(node && node.aframeObj)) {
                return;
            }

            // var aframeObject = node.aframeObj;
            // switch (propertyName) {
            //     case "clickable":
            //         if (propertyValue) {
            //             aframeObject.addEventListener('click', function (evt) {
            //                 let cursorID = 'cursor-avatar-'+selfs.kernel.moniker();
            //                if (evt.detail.cursorEl.id == cursorID) {
            //                     vwf_view.kernel.fireEvent(nodeId, "clickEvent")
            //                }
            //             });
            //         }
            //         break;
            // }
        },

        firedEvent: function (nodeID, eventName, eventParameters) {
            //var avatarID = vwf_view.kernel.find("", avatarName)

            var avatarName = 'avatar-' + self.kernel.moniker();

            if (eventName == "createAvatar") {
                console.log("!!!!");

                let avatarID = self.kernel.moniker();
                var nodeName = 'avatar-' + avatarID;

                var newNode = {
                    "id": avatarName,
                    "uri": avatarName,
                    "extends": "http://vwf.example.com/aframe/avatar.vwf",
                    "properties": {
                        "localUrl": '',
                        "remoteUrl": '',
                        "displayName": randId(),
                        "sharing": { audio: true, video: true }
                    }
                }


                if (!self.state.nodes[avatarName]) {

                    vwf_view.kernel.createChild(nodeID, avatarName, newNode);
                    vwf_view.kernel.callMethod(avatarName, "createAvatarBody", []);
                    //"/../assets/avatars/male/avatar1.gltf"
                }

            }

            // if (eventName == "setAvatarRotation") {
            //     vwf_view.kernel.setProperty(avatarName, "rotation", [eventParameters.x, eventParameters.y, eventParameters.z]);
            // }

            //  if (eventName == "setAvatarPosition") {
            //     vwf_view.kernel.setProperty(avatarName, "position", [eventParameters.x, eventParameters.y, eventParameters.z]);
            // }
        },

        ticked: function (vwfTime) {

            updateAvatarPosition();

            //update vr controllers
            if (this.gearvr == true) {
                updateHandControllerVR('gearvr-', '#gearvrcontrol');
            }
            if (this.wmrright == true) {
                updateHandControllerVR('wmrvr-right-', '#wmrvrcontrolright');
            }
            if (this.wmrleft == true) {
                updateHandControllerVR('wmrvr-left-', '#wmrvrcontrolleft');
            }


            //lerpTick ()
        }


    });

    function compareCoordinates(a, b) {
        return a.x !== b.x || a.y !== b.y || a.z !== b.z

    }

    function updateAvatarPosition() {

        let avatarName = 'avatar-' + self.kernel.moniker();
        var node = self.state.nodes[avatarName];
        if (!node) return;
        if (!node.aframeObj) return;

        let el = document.querySelector('#avatarControl');
        if (el) {
            let position = el.getAttribute('position');
            let rotation = el.getAttribute('rotation');

            let currentPosition = node.aframeObj.getAttribute('position');
            let currentRotation = node.aframeObj.getAttribute('rotation');

            if (position && rotation && currentPosition && currentRotation) {
                if (compareCoordinates(position, currentPosition) || rotation.y !== currentRotation.y) {
                    console.log("not equal!!")
                    vwf_view.kernel.callMethod(avatarName, "followAvatarControl", [position, rotation]);
                }
            }
        }
    }


    function updateHandControllerVR(aName, aSelector) {
        //let avatarName = 'avatar-' + self.kernel.moniker();
        let avatarName = aName + self.kernel.moniker();
        var node = self.state.nodes[avatarName];
        if (!node) return;
        if (!node.aframeObj) return;

        let el = document.querySelector(aSelector);
        if (el) {
            let position = el.getAttribute('position');
            let rotation = el.getAttribute('rotation');

            let currentPosition = node.aframeObj.getAttribute('position');
            let currentRotation = node.aframeObj.getAttribute('rotation');

            if (position && rotation && currentPosition && currentRotation) {
                if (compareCoordinates(position, currentPosition) || compareCoordinates(rotation, currentRotation)) {
                    console.log("not equal!!");

                    vwf_view.kernel.setProperty(avatarName, "rotation", AFRAME.utils.coordinates.stringify(rotation));
                    vwf_view.kernel.setProperty(avatarName, "position", AFRAME.utils.coordinates.stringify(position));
                }
            }

        }
    }


    function createAvatarControl(aScene) {

        let avatarName = 'avatar-' + self.kernel.moniker();

        let controlEl = document.createElement('a-camera');
        // controlEl.setAttribute('avatar', '');
        controlEl.setAttribute('id', 'avatarControl');
        controlEl.setAttribute('wasd-controls', {});
        controlEl.setAttribute('look-controls', {});
        controlEl.setAttribute('gamepad-controls', {});
        controlEl.setAttribute('camera', 'active', true);
        controlEl.setAttribute('camera', 'near', 0.51);

        aScene.appendChild(controlEl);

        let cursorEl = document.createElement('a-cursor');
        cursorEl.setAttribute('id', 'cursor-' + avatarName);
        cursorEl.setAttribute('raycaster', {});
        cursorEl.setAttribute('raycaster', 'objects', '.intersectable');
        cursorEl.setAttribute('raycaster', 'showLine', false);

        // cursorEl.setAttribute('raycaster', {objects: '.intersectable', showLine: true, far: 100});
        // cursorEl.setAttribute('raycaster', 'showLine', true);
        controlEl.appendChild(cursorEl);

        // let gearVRControlsEl = document.createElement('a-entity');
        // gearVRControlsEl.setAttribute('id', 'gearvr-'+avatarName);
        // gearVRControlsEl.setAttribute('gearvr-controls', {});
        // aScene.appendChild(gearVRControlsEl);



        //     controlEl.addEventListener('componentchanged', function (evt) {
        //     if (evt.detail.name === 'position') {
        //         var eventParameters = evt.detail.newData;
        //          vwf_view.kernel.setProperty(avatarName, "position", [eventParameters.x, eventParameters.y, eventParameters.z]);
        //     }

        //      if (evt.detail.name === 'rotation') {
        //         var eventParameters = evt.detail.newData;
        //            vwf_view.kernel.setProperty(avatarName, "rotation", [eventParameters.x, eventParameters.y, eventParameters.z]);
        //     }

        // });

    }

    function createWMRVR (nodeID, nodeName) { 

        var newNode = {
            "id": nodeName,
            "uri": nodeName,
            "extends": "http://vwf.example.com/aframe/wmrvrcontroller.vwf",
            "properties": {
            }
        }

        if (!self.state.nodes[nodeName]) {

            vwf_view.kernel.createChild(nodeID, nodeName, newNode);
            vwf_view.kernel.callMethod(nodeName, "createController", []);
            //"/../assets/controller/wmrvr.gltf"
        }
    }


    function createGearVRController(nodeID, nodeName) {

            var newNode = {
                "id": nodeName,
                "uri": nodeName,
                "extends": "http://vwf.example.com/aframe/gearvrcontroller.vwf",
                "properties": {
                }
            }

            if (!self.state.nodes[nodeName]) {

                vwf_view.kernel.createChild(nodeID, nodeName, newNode);
                vwf_view.kernel.callMethod(nodeName, "createController", []);
                //"/../assets/controller/gearvr.gltf"
            }
    }

    function createAvatar(nodeID) {

        vwf_view.kernel.fireEvent(nodeID, "createAvatar")

        // let avatarID = self.kernel.moniker();
        // var nodeName = 'avatar-' + avatarID;

        // var newNode = {
        //     "id": nodeName,
        //     "uri": nodeName,
        //     "extends": "http://vwf.example.com/aframe/avatar.vwf"
        // }


        // vwf_view.kernel.createChild(nodeID, nodeName, newNode);
        // vwf_view.kernel.callMethod(nodeName, "createAvatarBody");
    }

    function randId() {
        return '_' + Math.random().toString(36).substr(2, 9);
    }

    function createGearVRControls() {

        let sceneEl = document.querySelector('a-scene');
        let gearvr = document.createElement('a-entity');
        gearvr.setAttribute('id', 'gearvrcontrol');
        gearvr.setAttribute('gearvr-controls', '');
        gearvr.setAttribute('gearvr-controls', 'hand', 'right');
        gearvr.setAttribute('gearvrcontrol', '');
        sceneEl.appendChild(gearvr);

    }

    function createWMRVRControls(hand) {

        let sceneEl = document.querySelector('a-scene');
        let wmrvr = document.createElement('a-entity');
        wmrvr.setAttribute('id', 'wmrvrcontrol' + hand);
        wmrvr.setAttribute('windows-motion-controls', '');
        wmrvr.setAttribute('windows-motion-controls', 'hand', hand);
        wmrvr.setAttribute('wmrvrcontrol', {'hand': hand});
        sceneEl.appendChild(wmrvr);
    }



});
