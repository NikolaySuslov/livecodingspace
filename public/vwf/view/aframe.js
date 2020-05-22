"use strict";
/*
The MIT License (MIT)
Copyright (c) 2014-2018 Nikolai Suslov and the Krestianstvo.org project contributors. (https://github.com/NikolaySuslov/livecodingspace/blob/master/LICENSE.md)

Virtual World Framework Apache 2.0 license  (https://github.com/NikolaySuslov/livecodingspace/blob/master/licenses/LICENSE_VWF.md)
*/

// VWF & A-Frame view driver

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
            this.state.showMobileJoystick = function(){
                let controlEl = document.querySelector('#avatarControl');
                if(controlEl){
                controlEl.setAttribute("virtual-gamepad-controls", {});
                controlEl.addEventListener("move", setJoystickMoveInput);
                }
            }
            this.state.hideMobileJoystick = function(){
                let controlEl = document.querySelector('#avatarControl');
                if(controlEl){
                controlEl.removeAttribute("virtual-gamepad-controls");
                controlEl.removeEventListener("move", setJoystickMoveInput);
                }
            }

            if (options === undefined) { options = {}; }

            if (typeof options == "object") {

                this.rootSelector = options["application-root"];
            }
            else {
                this.rootSelector = options;
            }

            // this.gearvr = options.gearvr !== undefined ? options.gearvr : false;
            // this.wmrright = options.wmrright !== undefined ? options.wmrright : false;
            // this.wmrleft = options.wmrleft !== undefined ? options.wmrleft : false;

            this.xrType = undefined;

            //TODO: FIX detection in better way! (now works for Oculus Browser only)

            this.hmd = false; 
            this.threeDoF = false;
            this.sixDoF = false;

            this.threeDoFMobile = AFRAME.utils.device.isMobileVR() && AFRAME.utils.device.checkHeadsetConnected() && !navigator.userAgent.includes('Quest');
            this.sixDoFMobile = AFRAME.utils.device.checkHeadsetConnected() && navigator.userAgent.includes('Quest');
            this.sixDoFDesktop = !AFRAME.utils.device.isMobileVR() && AFRAME.utils.device.checkHeadsetConnected();


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


                let prepairAvatar = new Promise((resolve, reject) => {
                    let createAvatarPromise = new Promise(r=> r(createAvatarControl(scene)));
                    return resolve(createAvatarPromise) 
                });

                prepairAvatar.then(res => {

                        console.log("CREATE GEARVR HERE!!");
                        if (self.threeDoFMobile || _app.config.d3DoF ) {
                            this.xrType = 'mobileVR';
                            let nodeName = 'gearvr-' + self.kernel.moniker();
                            createGearVRControls();
                            createGearVRController.call(self, childID, nodeName);
                        }
                    
                        console.log("CREATE WMR RIGHT HERE!!");
                       // if (!AFRAME.utils.device.isMobileVR()) {
                            if (self.sixDoFMobile || self.sixDoFDesktop || _app.config.d6DoF  ) {

                                let nodeRight = 'wmrvr-right-' + self.kernel.moniker();
                                createWMRVRControls('right');
                                createWMRVR.call(this, childID, nodeRight);

                                console.log("CREATE WMR LEFT HERE!!");
                       // if (!AFRAME.utils.device.isMobileVR()) {
  
                                let nodeLeft = 'wmrvr-left-' + self.kernel.moniker();
                                createWMRVRControls('left');
                                createWMRVR.call(this, childID, nodeLeft);
                            }
                       // }
                    

                     // console.log(res);
                     createAvatar.call(self, childID);                  
                     postLoadAction.call(self, childID);

                })
                // this.state.appInitialized  = true;

                document.body.appendChild(scene); //append is not working in Edge browser

            }

            if (this.state.nodes[childID] && this.state.nodes[childID].aframeObj) {
                this.nodes[childID] = {
                    id: childID,
                    extends: childExtendsID,
                    liveBindings: {}
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

        executed: function (nodeID, scriptText, scriptType) {

            var node = this.state.nodes[nodeID];

            if (!(node)) {
                return;
            }

            if (scriptText.includes('var print')) {
                let print = self.nodes[nodeID].liveBindings.print;

                let me = self.kernel.moniker();
                let sender = self.nodes[nodeID].liveBindings.sender;

                if (me == sender) {
                    let data = JSON.stringify(print); //lively.lang.obj.inspect(print); 
                    self.kernel.fireEvent(nodeID, "printEvent", [data]);
                }
            }

        },


        initializedNode: function (nodeID, childID) {

            var node = this.state.nodes[childID];
            if (!node) {
                return;
            }

            if (node.extendsID == "http://vwf.example.com/aframe/gearvrcontroller.vwf") {
                console.log("gearVR controller initialized")
            }


            // if (node.prototypes.includes("http://vwf.example.com/aframe/aentity.vwf")) {

            //     var clientThatSatProperty = self.kernel.client();
            //     var me = self.kernel.moniker();


            //     // If the transform property was initially updated by this view....
            //     if (clientThatSatProperty == me) {
            //         self.kernel.callMethod(childID, "setOwner", [me]);
            //     }
            // }


            // if (propertyName == 'ownedBy')
            // {
            //     // if (!node.aframeObj.el.getAttribute('ownedBy')){

            //     // }
            // }

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
            //var selfs = this;

            var node = this.state.nodes[nodeId];

            if (!(node && node.aframeObj)) {
                return;
            }

            // if (propertyName == 'arjs') {
            //     if(propertyValue) {
            //         node.aframeObj.setAttribute('arjs', {trackingMethod: "best", sourceType: "webcam", debugUIEnabled: "true"});

            //     // let sceneEl = document.querySelector('a-scene');
            //     // let marker = document.createElement('a-marker-camera');
            //     // marker.setAttribute('preset', 'hiro');
            //     // sceneEl.appendChild(marker);
            //         //<a-marker-camera preset='hiro'></a-marker-camera>

            //     } else {
            //         if(node.aframeObj.getAttribute('arjs')){
            //             node.aframeObj.removeAttribute('arjs')
            //         }
            //     }
            // }

            if (propertyName == 'position') {
                receiveModelTransformChanges(nodeId, 'position', propertyValue);
            }

            if (propertyName == 'rotation') {
                receiveModelTransformChanges(nodeId, 'rotation', propertyValue);
            }

            if (propertyName == 'scale') {
                receiveModelTransformChanges(nodeId, 'scale', propertyValue);
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

            // if ( propertyName == "position" ) {
            //     receiveModelTransformChanges( nodeId, propertyValue );
            // }

            if (node.aframeObj.nodeName == "A-TEXT" && propertyName == 'font') {

                //TODO: Temporary fix for font resource loading error
                console.log('Set font from view');
                self.kernel.callMethod(nodeId, "setFont", [propertyValue])

            }

            if (node.aframeObj.nodeName == "AUDIO" && propertyName == 'itemSrc') {

                //console.log("sat new item");
                let elID = '#' + node.aframeObj.getAttribute('id');
                Object.entries(this.state.nodes).forEach(el => {
                    let sound = el[1].aframeObj.getAttribute('sound');
                    if (sound) {

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
                updateMaterial(node);
            }

            if (node.aframeObj.nodeName == "VIDEO" && propertyName == 'itemSrc') {
                updateMaterial(node);
            }

            if (node.aframeObj.nodeName == "A-ASSET-ITEM" && propertyName == 'itemSrc') {

                //console.log("sat new item");
                let elID = '#' + node.aframeObj.getAttribute('id');
                Object.entries(this.state.nodes).forEach(el => {
                    let src = el[1].aframeObj.getAttribute('src');
                    let mtl = el[1].aframeObj.getAttribute('mtl');
                    if (src) {
                        // console.log("my: " + src);
                        if (src == elID)
                            self.kernel.callMethod(el[0], "updateModel", [elID])
                    }
                    if (mtl) {
                        // console.log("my: " + mtl);
                        if (mtl == elID)
                            self.kernel.callMethod(el[0], "updateModelMtl", [elID])
                    }
                })

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

        deletedNode: function (childID) {
            delete this.nodes[childID];
        },

        firedEvent: function (nodeID, eventName, eventParameters) {

            var node = this.state.nodes[nodeID];

            if (!(node)) {
                return;
            }

            if (eventName == "printIt") {

                var clientThatSatProperty = self.kernel.client();
                var me = self.kernel.moniker();


                // If the transform property was initially updated by this view....
                if (clientThatSatProperty == me) {


                    let selectedText = eventParameters[0];
                    let printText = _app.helpers.replaceSubStringALL(selectedText, 'this', 'me');

                    if (!self.nodes[nodeID].liveBindings) {
                        self.nodes[nodeID].liveBindings = {}
                    }

                    //let bindObject = self.nodes[nodeID].liveBindings;
                    let bindString = 'vwf.views["vwf/view/aframe"].nodes["' + nodeID + '"].liveBindings';
                    let sender = JSON.stringify(eventParameters[1]);

                    let scriptText = 'let binding = ' + bindString + '; binding.me = this; binding.sender = ' + sender + '; lively.vm.syncEval("var print = ' + printText + '",{topLevelVarRecorder: binding});';
                    vwf_view.kernel.execute(nodeID, scriptText);

                }

            }



            if (eventName == "changingTransformFromView") {
                var clientThatSatProperty = self.kernel.client();
                var me = self.kernel.moniker();

                // If the transform property was initially updated by this view....
                if (clientThatSatProperty == me) {
                    var node = this.state.nodes[nodeID];
                    node.ignoreNextTransformUpdate = true;
                }
            }

            //var avatarID = vwf_view.kernel.find("", avatarName)

            // if (eventName == "postLoadAction") {

            //     Object.entries(self.state.nodes).forEach(el => {
            //         if (el[1].prototypes.includes("http://vwf.example.com/aframe/aentity.vwf")) {
            //             vwf_view.kernel.callMethod(el[0], "setOwner", [self.kernel.moniker()]);
            //         }

            //     });
            // }

             var avatarName = 'avatar-' + self.kernel.moniker();


            let intersectEvents = ['hitstart', 'hitend', 'intersect', 'clearIntersect']; //'intersect', 

            let hitEvent = intersectEvents.filter(el=> el == eventName.slice(0,-5))[0]; //slice Event word
            if (hitEvent)
            {
                var clientThatSatProperty = self.kernel.client();
                var me = self.kernel.moniker();

                // If the transform property was initially updated by this view....
                if (clientThatSatProperty == me) {
                        let methodName = eventName +'Method';
                        vwf.callMethod(nodeID, methodName, [])
                }

            }
    


            if (eventName == "clickEvent") {

                if (self.kernel.moniker() == eventParameters[0]) {

                    let avatar = self.nodes[avatarName];
                    let mode = vwf.getProperty(avatarName, 'selectMode');


                    vwf_view.kernel.callMethod(nodeID, "clickEventMethod", [])

                    if (mode) {
                        console.log("allow to click!!!")
                        vwf_view.kernel.setProperty(avatarName, 'selectMode', false);

                        let editorDriver = vwf.views["vwf/view/editor-new"];
                        if (editorDriver) {
                            let selectSwitch = document.querySelector('#selectNodeSwitch');
                            // const selectSwitchComp = new mdc.iconButton.MDCIconButtonToggle(selectSwitch); //new mdc.select.MDCIconToggle
                            selectSwitch._comp.on = false;

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

            if(self.hmd){
                if(self.threeDoF )
                    updateHandControllerVR('gearvr-', '#gearvrcontrol');

                if(this.sixDoF ) {
                        updateHandControllerVR('wmrvr-right-', '#wmrvrcontrolright');
                        updateHandControllerVR('wmrvr-left-', '#wmrvrcontrolleft');
                }
            }

            
    
                
            

            //lerpTick ();
        },

        calledMethod: function (nodeID, methodName, methodParameters, methodValue) {

            var node = this.state.nodes[nodeID];

            if (!(node && node.aframeObj)) {
                return;
            }


            switch (methodName) {
                case "translateBy":
                case "translateTo":
                    //resetInterpolationFromViewDriver(nodeID, methodParameters, 'position')
                    break;
                // No need for rotateBy or rotateTo because they call the quaternion methods
                case "quaterniateBy":
                case "quaterniateTo":
                    //resetInterpolationFromViewDriver(nodeID, methodParameters, 'rotation')
                    break;
                case "scaleBy":
                case "scaleTo":
                // No need for transformBy or worldTransformBy because they call transformTo and worldTransformTo
                case "transformTo":
                case "worldTransformTo":
                    //resetInterpolationFromViewDriver(nodeID, methodParameters, 'rotation')
                    break;
            }

            if (this.nodes[nodeID].extends == "http://vwf.example.com/aframe/acamera.vwf") {
                if (methodName == "setCameraToActive") {
                    if (methodParameters[0] == vwf.moniker_) {
                        console.log("set active");
                        let offsetComp = node.aframeObj.getAttribute('viewoffset');
                        if (offsetComp) {
                            let offsetCompID = vwf.find(nodeID, 'viewoffset');
                            self.kernel.callMethod(offsetCompID, "setParams", []);
                        }
                        node.aframeObj.setAttribute('camera', 'active', true);

						document.querySelector('a-scene').emit('makeActiveCamera');
                    }
                }
            }

            // if (methodName == "createGooglePoly") {
            // }


        }


    });


    function resetInterpolationFromViewDriver(nodeID, methodParameters, propertyName) {

        if (methodParameters.length < 2 || methodParameters[1] == 0) {

            let viewNode = self.nodes[nodeID];
            if (viewNode.components.interpolation) {
                let interID = viewNode.components.interpolation;
                let viewComponentDriver = vwf.views["vwf/view/aframeComponent"];
                viewComponentDriver.resetInterpolation(interID, propertyName);
            }
        }
    }


    // Receive Model Transform Changes algorithm 
    // 1.0 If (own view changes) then IGNORE (only if no external changes have occurred since the user’s view 
    //       requested this change – otherwise, will need to treat like 1.1 or 1.2)
    // 1.1 Elseif (other external changes and no outstanding own view changes) then ADOPT
    // 1.2 Else Interpolate to the model’s transform (conflict b/w own view and external sourced model changes)

    function receiveModelTransformChanges(nodeID, propertyName, propertyValue) {

        var node = self.state.nodes[nodeID];

        // If the node does not exist in the state's list of nodes, then this update is from a prototype and we
        // should ignore it
        if (!node) {
            return;
        }

        // If the transform property was initially updated by this view....
        if (node.ignoreNextTransformUpdate) {
            node.outstandingTransformRequests.shift();
            node.ignoreNextTransformUpdate = false;
        } else {
            // adoptTransform( node, transformMatrix );

            let prop = self.state.setFromValue(propertyValue);

            if (propertyName == 'position') {
                let pos = goog.vec.Vec3.clone(prop);
                node.aframeObj.object3D.position.set(pos[0], pos[1], pos[2]);
            } else if (propertyName == 'rotation') {
                let rot = goog.vec.Vec3.clone(prop);

                node.aframeObj.object3D.rotation.set(
                    THREE.Math.degToRad(rot[0]),
                    THREE.Math.degToRad(rot[1]),
                    THREE.Math.degToRad(rot[2])
                )
                //node.aframeObj.object3D.rotation.set(rot[0], rot[1], rot[2]);
            } else if (propertyName == 'scale') {
                let scale = goog.vec.Vec3.clone(prop);
                node.aframeObj.object3D.scale.set(scale[0], scale[1], scale[2]);
            }

        }
    }


    function compareCoordinates(a, b, delta) {
        return Math.abs(a.x - b.x) > delta || Math.abs(a.y - b.y) > delta || Math.abs(a.z - b.z) > delta

    }

    function getWorldRotation(el, order) {

        var worldQuat = new THREE.Quaternion();
        el.object3D.getWorldQuaternion(worldQuat);

        //console.log(worldQuat);
        let angle = (new THREE.Euler()).setFromQuaternion(worldQuat, order);
        let rotation = (new THREE.Vector3(THREE.Math.radToDeg(angle.x),
            THREE.Math.radToDeg(angle.y), THREE.Math.radToDeg(angle.z)));

        return rotation
    }


    // function updateAvatarPosition() {
    //     let avatarName = 'avatar-' + self.kernel.moniker();
    //     var node = self.state.nodes[avatarName];
    //     if (!node) return;
    //     if (!node.aframeObj) return;

    //     let el = document.querySelector('#avatarControl');
    //     if (el) {
    //         //let position = el.object3D.getWorldPosition(); //el.getAttribute('position');

    //         let position = new THREE.Vector3();
    //         el.object3D.getWorldPosition(position);

    //         let rotation = getWorldRotation(el);
    //         vwf_view.kernel.callMethod(avatarName, "followAvatarControl", [position, rotation]);
    //     }


    // }

    function updateAvatarPosition() {

        let delta = 0.0001;

        let avatarName = 'avatar-' + self.kernel.moniker();
        var node = self.state.nodes[avatarName];
        if (!node) return;
        if (!node.aframeObj) return;

       let el = document.querySelector('#avatarControl');
        if (el) {
            //let position = el.object3D.getWorldPosition(); //el.getAttribute('position');

            var position;

            if((self.hmd && self.sixDoF) || _app.config.d6DoF){
                position = el.getAttribute('position');
            } else {
                position = new THREE.Vector3();
                el.object3D.getWorldPosition(position);
            }
            //let position = el.getAttribute('position');
            let rotation = el.getAttribute('rotation'); //getWorldRotation(el, 'YXZ');

            let lastRotation = self.nodes[avatarName].selfTickRotation;
            let lastPosition = self.nodes[avatarName].selfTickPosition;

            // let currentPosition = node.aframeObj.getAttribute('position');
            // let currentRotation = node.aframeObj.getAttribute('rotation');

            if (position && rotation && lastPosition && lastRotation) {
                if (compareCoordinates(position, lastPosition, delta) || Math.abs(rotation.y - lastRotation.y) > delta) {
                    console.log("not equal!!")
                    self.kernel.callMethod(avatarName, "followAvatarControl", [position, rotation]);
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

            let rotation = getWorldRotation(el, 'XYZ');

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


     function getMovementVector(el, vel) {
        var directionVector = new THREE.Vector3(0, 0, 0);
        var rotationEuler = new THREE.Euler(0, 0, 0, 'YXZ');
    
        
          var rotation = el.getAttribute('rotation');
          var velocity = vel;
    
          directionVector.copy(velocity);
          directionVector.multiplyScalar(0.05);
    
          // Absolute.
          if (!rotation) { return directionVector; }
    
          //xRotation = this.data.fly ? rotation.x : 0;
    
          // Transform direction relative to heading.
          rotationEuler.set(THREE.Math.degToRad(0), THREE.Math.degToRad(rotation.y), 0);
          directionVector.applyEuler(rotationEuler);
          return directionVector;
      }

    function setJoystickMoveInput (event) {
        const axes = event.detail.axis;
        //console.log(axes);
        let el = document.querySelector('#avatarControl');
        let position = new THREE.Vector3();
        el.object3D.getWorldPosition(position);
        let vel = new THREE.Vector3(axes[0], 0, -axes[1]);
        el.object3D.position.add(getMovementVector(el,vel));
    }

    function setJoystickRotateY (event) {
        const val = event.detail.value;
        //console.log(val);
        let el = document.querySelector('#avatarControl');
        let rotation = el.object3D.rotation;
        el.object3D.rotation.y += (-val)+rotation.y;
        //el.object3D.rotation.set(rotation.x,-val+rotation.y, rotation.z)
    }

    function setJoystickRotateX (event) {
        const val = event.detail.value;
        //console.log(val);
        let el = document.querySelector('#avatarControl');
        let rotation = el.object3D.rotation;
        el.object3D.rotation.x += val+rotation.x;
        //el.object3D.rotation.set(val+rotation.x, rotation.y, rotation.z)
    }

    async function createAvatarControl(aScene) {

        let avatarName = 'avatar-' + self.kernel.moniker();

        let avatarEl = document.createElement('a-entity');
        avatarEl.setAttribute('id', 'avatarControlParent');


        if (self.d3DoF || _app.config.d3DoF) {
            //avatarEl.setAttribute('gearvr-controls', {}); 
            avatarEl.setAttribute('movement-controls', {});//{'controls': 'gamepad'});
           // avatarEl.setAttribute("gamepad-controls", {});
            //avatarEl.setAttribute('position', '0 0 0');
        }

        //avatarEl.setAttribute('position', '0 1.6 0');

        let controlEl = document.createElement('a-camera');

        controlEl.setAttribute('id', 'avatarControl');
        controlEl.setAttribute('wasd-controls', {acceleration:20});
        controlEl.setAttribute('look-controls', { pointerLockEnabled: false});
        controlEl.setAttribute('look-controls', 'enabled', true );

        //controlEl.setAttribute('gamepad-controls', {'controller': 0});

        if (AFRAME.utils.device.isMobile()) {
            //self.state.showMobileJoystick()

            controlEl.setAttribute('look-controls', 'enabled', true );
            controlEl.setAttribute("virtual-gamepad-controls", {});
            controlEl.addEventListener("move", setJoystickMoveInput);
        }
        //controlEl.addEventListener("rotateY", setJoystickRotateY);
        //controlEl.addEventListener("rotateX", setJoystickRotateX);
        

        //controlEl.setAttribute('gearvr-controls',{});

        // controlEl.setAttribute('camera', 'near', 0.51);


        //controlEl.setAttribute('position', '0 0 0');


        let cursorEl = document.createElement('a-cursor');
        cursorEl.setAttribute('id', 'cursor-' + avatarName);
        cursorEl.setAttribute('raycaster', {});
        cursorEl.setAttribute('raycaster', 'objects', '.clickable');
        cursorEl.setAttribute('raycaster', 'showLine', false);

        // cursorEl.setAttribute('raycaster', {objects: '.intersectable', showLine: true, far: 100});
        // cursorEl.setAttribute('raycaster', 'showLine', true);
        controlEl.appendChild(cursorEl);

        avatarEl.appendChild(controlEl);
        aScene.appendChild(avatarEl);

        controlEl.setAttribute('camera', 'active', true);


        // let arControl = document.createElement('a-entity');
        // arControl.setAttribute('id', 'arControlParent');
        // arControl.setAttribute('camera', {
        //     active: true,
        //     "look-controls-enabled": false,
        //     "wasd-controls-enabled": false,
        //     "user-height": 0
        // });
        // aScene.appendChild(arControl);


        return "OK!"
       // cb();

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

    function createWMRVR(nodeID, nodeName) {

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

    function postLoadAction(nodeID) {

        //vwf_view.kernel.fireEvent(nodeID, "postLoadAction")
    }

    function createAvatar(nodeID) {


       // vwf_view.kernel.fireEvent(nodeID, "createAvatar");

       var avatarName = 'avatar-' + self.kernel.moniker();

           console.log("creating avatar...");

           // let avatarID = self.kernel.moniker();
           // var nodeName = 'avatar-' + avatarID;

           var newNode = {
               "id": avatarName,
               "uri": avatarName,
               "extends": "http://vwf.example.com/aframe/avatar.vwf",
               "properties": {
                   "localUrl": '',
                   "remoteUrl": '',
                  // "displayName": 'Avatar ' + randId(),
                   "sharing": { audio: true, video: true },
                   "selectMode": false,
                   "position": [0, 1.6, 0]
               }
           }

           if (!self.state.nodes[avatarName]) {
              

               if (_LCSDB.user().is) {

                _LCSDB.user().get('profile').get('alias').once(alias => {
                           if (alias){

                               newNode.properties.displayName = alias;
                               //vwf_view.kernel.callMethod(avatarName, "setMyName", [alias]);
                           }
                           vwf_view.kernel.createChild(nodeID, avatarName, newNode);
                           });

                           _LCSDB.user().get('profile').get('avatarNode').not(res=>{
                               //vwf_view.kernel.callMethod(avatarName, "createAvatarBody", []);
                           })

                           _LCSDB.user().get('profile').get('avatarNode').once(res => {
                                   var myNode = null;
                                   if (res) {
                                       //myNode = JSON.parse(res.avatarNode);

                                       var myNode = res;

                                       if (_app.helpers.testJSON(res)){
                                           myNode = JSON.parse(res);
                                       }  

                                       vwf_view.kernel.callMethod(avatarName, "createAvatarBody", [myNode, null]);
                                   } else {
                                       vwf_view.kernel.callMethod(avatarName, "createAvatarBody", []);
                                   }
                                  // newNode.properties.displayName = res.alias;
       
                                   
                                   //"/../assets/avatars/male/avatar1.gltf"
       
       
                                   //vwf_view.kernel.callMethod(avatarName, 'setUserAvatar', [res] );
                               });


                           
                 
               } else {

                   vwf_view.kernel.createChild(nodeID, avatarName, newNode);
                   vwf_view.kernel.callMethod(avatarName, "createAvatarBody", []);

                   //"/../assets/avatars/male/avatar1.gltf"
               }

               //
               

           }


           // if(_LCSUSER.is){
           //     _LCSUSER.get('profile').get('alias').once(res => {
           //         vwf_view.kernel.callMethod(avatarName, 'setUserAvatar', [res] );
           //     })
           // }




       



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
            'model': true
        });
    
        // gearvr.setAttribute('gearvr-controls', 'hand', 'right');

        gearvr.setAttribute('gearvrcontrol', {});
        avatarControl.appendChild(gearvr);

    }

    function createWMRVRControls(hand) {

        let sceneEl = document.querySelector('a-scene');

        let avatarControl = document.querySelector('#avatarControlParent');

        let wmrvr = document.createElement('a-entity');
        wmrvr.setAttribute('id', 'wmrvrcontrol' + hand);

        wmrvr.setAttribute('hand-controls', {
            'hand': hand,
            'handModelStyle': 'lowPoly',
            'color': '#ffcccc'
        });

        // wmrvr.setAttribute('windows-motion-controls', '');
        // wmrvr.setAttribute('windows-motion-controls', 'hand', hand);


        wmrvr.setAttribute('wmrvrcontrol', { 'hand': hand });
        avatarControl.appendChild(wmrvr);
    }


    function updateMaterial(node) {

        let elID = '#' + node.aframeObj.getAttribute('id');
        Object.entries(self.state.nodes).forEach(el => {
            let material = el[1].aframeObj.getAttribute('material');
            if (material) {
                if (!material.src) {
                    let materialID = vwf.find(el[0], 'material');
                    self.kernel.callMethod(materialID, "refreshSrc", []);
                }
                else if (material.src) {
                    if (material.src !== "") {
                        let src = '#' + material.src.id;
                        if (src == elID) {
                            let materialID = vwf.find(el[0], 'material');
                            self.kernel.callMethod(materialID, "updateSrc", [elID])
                        }
                    }
                }
            }

        })

    }


});
