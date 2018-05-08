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

            // this.tickTime = 0;
            // this.realTickDif = 50;
            // this.lastrealTickDif = 50;
            // this.lastRealTick = performance.now();

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

                if (this.wmrleft == true) {
                    console.log("CREATE WMR LEFT HERE!!");
                    if (AFRAME.utils.device.checkHasPositionalTracking()) {
                        let nodeName = 'wmrvr-left-' + self.kernel.moniker();
                        createWMRVRControls('left');
                        createWMRVR.call(this, childID, nodeName);
                    }
                }

            }

            if (this.state.nodes[childID] && this.state.nodes[childID].aframeObj) {
                this.nodes[childID] = { 
                    id: childID, 
                    extends: childExtendsID,
                    // lastTransformStep: 0,
                    // lastAnimationStep: 0 
                };
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

            if (node.extendsID == "http://vwf.example.com/aframe/gearvrcontroller.vwf"){
                    console.log("gearVR controller initialized")
            }


        },

        createdProperty: function (nodeId, propertyName, propertyValue) {
            return this.satProperty(nodeId, propertyName, propertyValue);
        },

        initializedProperty: function (nodeId, propertyName, propertyValue) {
            return this.satProperty(nodeId, propertyName, propertyValue);
        },

        gotProperty: function (nodeId, propertyName, propertyValue) {
            var selfs = this;

            var node = this.state.nodes[nodeId];

            if (!(node && node.aframeObj)) {
                return;
            }

            


        },

        satProperty: function (nodeId, propertyName, propertyValue) {
            var selfs = this;

            var node = this.state.nodes[nodeId];

            if (!(node && node.aframeObj)) {
                return;
            }

            // if (node.aframeObj.nodeName == "AUDIO" && propertyName == 'itemSrc') {

            //     //console.log("sat new item");
            //     let elID = '#' + node.aframeObj.getAttribute('id');
            //     Object.entries(this.state.nodes).forEach(el => {
            //         let src = el[1].aframeObj.getAttribute('src');
            //         if (src){
            //            // console.log("my: " + src);
            //             if (src == elID)
            //             self.kernel.callMethod(el[0], "updateSrc", [elID])
            //         }
            //     })

            // }

            if (node.aframeObj.nodeName == "AUDIO" && propertyName == 'itemSrc') {

                //console.log("sat new item");
                let elID = '#' + node.aframeObj.getAttribute('id');
                Object.entries(this.state.nodes).forEach(el => {
                    let sound = el[1].aframeObj.getAttribute('sound');
                    if(sound) {
                   
                        let soundID = vwf.find(el[0], 'sound');
                        self.kernel.callMethod(soundID, "refreshSrc", [elID])

                    // if (sound.src !== ""){
                    //     let src = '#' + sound.src.id;
                    //     if (src == elID){
                    //         let soundID = vwf.find(el[0], 'sound');
                    //         self.kernel.callMethod(soundID, "updateSrc", [elID])
                    //     }
                        
                    // }

                }

                })
            }


            if (node.aframeObj.nodeName == "IMG" && propertyName == 'itemSrc') {

                //console.log("sat new item");
                let elID = '#' + node.aframeObj.getAttribute('id');
                Object.entries(this.state.nodes).forEach(el => {
                    let material = el[1].aframeObj.getAttribute('material');
                    if(material) {
                   
                    if (material.src !== ""){
                       // console.log("my: " + src);
                        let src = '#' + material.src.id;
                        if (src == elID){
                            let materialID = vwf.find(el[0], 'material');
                            self.kernel.callMethod(materialID, "updateSrc", [elID])
                        }
                        
                    }
                }

                })
            }

            if (node.aframeObj.nodeName == "VIDEO" && propertyName == 'itemSrc') {

                //console.log("sat new item");
                let elID = '#' + node.aframeObj.getAttribute('id');
                Object.entries(this.state.nodes).forEach(el => {
                    let material = el[1].aframeObj.getAttribute('material');
                    if(material) {
                   
                    if (material.src !== ""){
                       // console.log("my: " + src);
                        let src = '#' + material.src.id;
                        if (src == elID){
                            let materialID = vwf.find(el[0], 'material');
                            self.kernel.callMethod(materialID, "updateSrc", [elID])
                        }
                        
                    }
                }
                })
            }

            if (node.aframeObj.nodeName == "A-ASSET-ITEM" && propertyName == 'itemSrc') {

                //console.log("sat new item");
                let elID = '#' + node.aframeObj.getAttribute('id');
                Object.entries(this.state.nodes).forEach(el => {
                    let src = el[1].aframeObj.getAttribute('src');
                    let mtl = el[1].aframeObj.getAttribute('mtl');
                    if (src){
                       // console.log("my: " + src);
                        if (src == elID)
                        self.kernel.callMethod(el[0], "updateModel", [elID])
                    }
                    if (mtl){
                       // console.log("my: " + mtl);
                        if (mtl == elID)
                        self.kernel.callMethod(el[0], "updateModelMtl", [elID])
                    }
                })

            }
            
            //  if (node.aframeObj.nodeName == "A-BOX" && propertyName == 'color') {
                
            //     console.log("sat color");
            //     let materialName = '/' + node.name + '/material';
            //     let materialID = vwf.find('', materialName)[0];
            //     if (materialID) {

            //         vwf.setProperty(materialID, propertyName, propertyValue);
                    
            //     }  

            // }

            // if (propertyName == 'position') {
            //     this.nodes[nodeId].lastTransformStep = vwf.time();
            // }


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

        deletedNode: function(childID)
        {
            delete this.nodes[childID];
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
                        "displayName": 'Avatar '+ randId(),
                        "sharing": { audio: true, video: true },
                        "selectMode": false,
                        "position": "0 1.6 0"
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

            if (eventName == "clickEvent") {

               if (self.kernel.moniker() == eventParameters[0]){

                    let avatar = self.nodes[avatarName];
                    let mode = vwf.getProperty(avatarName, 'selectMode');

                    if(mode) {
                        console.log("allow to click!!!")
                        vwf_view.kernel.setProperty(avatarName, 'selectMode', false);

                        let editorDriver = vwf.views["vwf/view/editor-new"];
                        if (editorDriver){
                            let selectSwitch = document.querySelector('#selectNodeSwitch');
                            const selectSwitchComp = new mdc.iconToggle.MDCIconToggle(selectSwitch); //new mdc.select.MDCIconToggle
                            selectSwitchComp.on = false;

                            let currentNodeDIV = document.querySelector('#currentNode');
                            if (currentNodeDIV) currentNodeDIV._setNode(nodeID);
                            

                        }
                    }
               }
                

            }
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

           // console.log(vwfTime);
            //lerpTick ();
        },

        calledMethod: function( nodeID, methodName, methodParameters, methodValue ) {
    
            var node = this.state.nodes[nodeID];

            if (!(node && node.aframeObj)) {
                return;
            }

       
            if (this.nodes[nodeID].extends == "http://vwf.example.com/aframe/acamera.vwf"){
                if (methodName == "setCameraToActive"){
                    if (methodParameters[0] == vwf.moniker_){
                    console.log("set active");
                    let offsetComp = node.aframeObj.getAttribute('viewoffset');
                    if (offsetComp) {
                        let offsetCompID = vwf.find(nodeID, 'viewoffset');
                        self.kernel.callMethod(offsetCompID, "setParams", []);
                    }
                    node.aframeObj.setAttribute('camera', 'active', true);
                }
            }
        }

            if(methodName == "createGooglePoly"){


            }

            
        }


    });


    function compareCoordinates(a, b, delta) {
        return Math.abs(a.x - b.x) > delta || Math.abs(a.y - b.y) > delta || Math.abs(a.z - b.z) > delta

    }

    function getWorldRotation(el) {


        var worldQuat =  new THREE.Quaternion();
        el.object3D.getWorldQuaternion(worldQuat);
         
        //console.log(worldQuat);
        let angle = (new THREE.Euler()).setFromQuaternion(worldQuat, 'YXZ');
        let rotation = (new THREE.Vector3(THREE.Math.radToDeg(angle.x),
        THREE.Math.radToDeg(angle.y), THREE.Math.radToDeg(angle.z) ));

        return rotation
    }

    function updateAvatarPosition() {

        let delta = 0.0001;

        let avatarName = 'avatar-' + self.kernel.moniker();
        var node = self.state.nodes[avatarName];
        if (!node) return;
        if (!node.aframeObj) return;

        let el = document.querySelector('#avatarControl');
        if (el) {
            //let position = el.object3D.getWorldPosition(); //el.getAttribute('position');

            let position = new THREE.Vector3();
            el.object3D.getWorldPosition(position);

            let rotation = getWorldRotation(el);
           
           // console.log(rotation);
            //let rotation = el.getAttribute('rotation');

            let lastRotation = self.nodes[avatarName].selfTickRotation;
            let lastPosition = self.nodes[avatarName].selfTickPosition;

            // let currentPosition = node.aframeObj.getAttribute('position');
            // let currentRotation = node.aframeObj.getAttribute('rotation');

            if (position && rotation && lastPosition  && lastRotation) {
            if (compareCoordinates(position, lastPosition, delta) || Math.abs(rotation.y - lastRotation.y) > delta) {
                    console.log("not equal!!")
                    vwf_view.kernel.callMethod(avatarName, "followAvatarControl", [position, rotation]);
                }
            }
            self.nodes[avatarName].selfTickRotation = Object.assign({}, rotation);
            self.nodes[avatarName].selfTickPosition = Object.assign({}, position);
        }

    }


    function updateHandControllerVR(aName, aSelector) {
        //let avatarName = 'avatar-' + self.kernel.moniker();

        let delta = 0.0001

        let avatarName = aName + self.kernel.moniker();
        var node = self.state.nodes[avatarName];
        if (!node) return;
        if (!node.aframeObj) return;

        let el = document.querySelector(aSelector);
        if (el) {
            //let position = el.object3D.getWorldPosition() //el.getAttribute('position');
            
            let position = new THREE.Vector3();
            el.object3D.getWorldPosition(position);

            let rotation = getWorldRotation(el);

            //let rotation = el.getAttribute('rotation');

            let lastRotation = self.nodes[avatarName].selfTickRotation;
            let lastPosition = self.nodes[avatarName].selfTickPosition;

           // let currentPosition = node.aframeObj.getAttribute('position');
            //let currentRotation = node.aframeObj.getAttribute('rotation');

            if (position && rotation && lastRotation && lastPosition) {
                if (compareCoordinates(position, lastPosition, delta) || compareCoordinates(rotation, lastRotation, delta)) {
                    console.log("not equal!!");
                    vwf_view.kernel.callMethod(avatarName, "updateVRControl", [position, rotation]);
                }
            }

          
            //vwf_view.kernel.callMethod(avatarName, "updateVRControl", [position, rotation]);

            self.nodes[avatarName].selfTickPosition = Object.assign({}, position);
            self.nodes[avatarName].selfTickRotation = Object.assign({}, rotation);

        }
    }


    function createAvatarControl(aScene) {

        let avatarName = 'avatar-' + self.kernel.moniker();

        let avatarEl = document.createElement('a-entity');
        avatarEl.setAttribute('id', 'avatarControlParent');
        

        if (AFRAME.utils.device.isGearVR()) {
            avatarEl.setAttribute('movement-controls', {});//{'controls': 'gamepad'});
            //avatarEl.setAttribute('position', '0 0 0');
        }
       

        let controlEl = document.createElement('a-camera');

        controlEl.setAttribute('id', 'avatarControl');
        //controlEl.setAttribute('wasd-controls', {});
        controlEl.setAttribute('look-controls', {pointerLockEnabled: false});
       //controlEl.setAttribute('gamepad-controls', {'controller': 0});
        

        //controlEl.setAttribute('gearvr-controls',{});
        
       // controlEl.setAttribute('camera', 'near', 0.51);

       
    //controlEl.setAttribute('position', '0 0 0');
    controlEl.setAttribute('camera', 'active', true);

        let cursorEl = document.createElement('a-cursor');
        cursorEl.setAttribute('id', 'cursor-' + avatarName);
        cursorEl.setAttribute('raycaster', {});
        cursorEl.setAttribute('raycaster', 'objects', '.intersectable');
        cursorEl.setAttribute('raycaster', 'showLine', false);

        if (AFRAME.utils.device.isGearVR()) {}

        // cursorEl.setAttribute('raycaster', {objects: '.intersectable', showLine: true, far: 100});
        // cursorEl.setAttribute('raycaster', 'showLine', true);
        controlEl.appendChild(cursorEl);

        avatarEl.appendChild(controlEl);
        aScene.appendChild(avatarEl);

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

        let avatarControl = document.querySelector('#avatarControlParent');

        let gearvr = document.createElement('a-entity');
        gearvr.setAttribute('id', 'gearvrcontrol');
        gearvr.setAttribute('gearvr-controls', {
            'hand': 'right',
        'model': true        });
       // gearvr.setAttribute('gearvr-controls', 'hand', 'right');

        gearvr.setAttribute('gearvrcontrol', {});
        avatarControl.appendChild(gearvr);

    }

    function createWMRVRControls(hand) {

        let sceneEl = document.querySelector('a-scene');

        let avatarControl = document.querySelector('#avatarControlParent');

        let wmrvr = document.createElement('a-entity');
        wmrvr.setAttribute('id', 'wmrvrcontrol' + hand);
        wmrvr.setAttribute('windows-motion-controls', '');
        wmrvr.setAttribute('windows-motion-controls', 'hand', hand);
        wmrvr.setAttribute('wmrvrcontrol', {'hand': hand});
        avatarControl.appendChild(wmrvr);
    }


});
