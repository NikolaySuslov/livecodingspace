/*
The MIT License (MIT)
Copyright (c) 2014-2020 Nikolai Suslov and the Krestianstvo.org project contributors. (https://github.com/NikolaySuslov/livecodingspace/blob/master/LICENSE.md)
*/

// VWF & A-Frame view driver

import {Fabric} from '/core/vwf/fabric.js';

class AFrameView extends Fabric {

  constructor(module) {
    console.log("AFrameView constructor");
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
    
                // this.tickTime = 0;
                // this.realTickDif = 50;
                // this.lastrealTickDif = 50;
                // this.lastRealTick = performance.now();
    
                this.state.appInitialized = false;
                this.state.showMobileJoystick = function(){
                    let controlEl = document.querySelector('#avatarControl');
                    if(controlEl){
                    controlEl.setAttribute("virtual-gamepad-controls", {});
                    controlEl.addEventListener("move", _self_.setJoystickMoveInput.bind(_self_));
                    }
                }
                this.state.hideMobileJoystick = function(){
                    let controlEl = document.querySelector('#avatarControl');
                    if(controlEl){
                    controlEl.removeAttribute("virtual-gamepad-controls");
                    controlEl.removeEventListener("move", _self_.setJoystickMoveInput.bind(_self_));
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
                this.sixDoFDesktop = !AFRAME.utils.device.isMobile() && !AFRAME.utils.device.isMobileVR() && AFRAME.utils.device.checkHeadsetConnected();
    
                this.isDesktop = !this.threeDoFMobile && !this.sixDoFMobile && !this.sixDoFDesktop && !_app.config.d3DoF && !_app.config.d6DoF;
                this.isMobile = AFRAME.utils.device.isMobile() && !AFRAME.utils.device.isMobileVR()
                //!AFRAME.utils.device.isMobile() && 
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
                    //TODO: FIX
                    
    
                    let prepairAvatar = new Promise((resolve, reject) => {
                        document.body.appendChild(scene);
                        let createAvatarPromise = new Promise(r=> r(_self_.createAvatarControl(scene)));
                        return resolve(createAvatarPromise) 
                    });
    
                    prepairAvatar.then(res => {
    
                            if (self.threeDoFMobile || _app.config.d3DoF ) {
    
                                console.log("CREATE GEARVR HERE!!");
                                //this.xrType = 'mobileVR';
                                let nodeName = 'gearvr-' + self.kernel.moniker();
                                _self_.createGearVRControls();
                                _self_.createXR.call(self, childID, nodeName, {});
                                //_self_.createGearVRController.call(self, childID, nodeName);
                            }
                        
    
                           // if (!AFRAME.utils.device.isMobileVR()) {
                                else if (self.sixDoFMobile || self.sixDoFDesktop || _app.config.d6DoF  ) {
                                    console.log("CREATE XRController RIGHT HERE!!");
                                    let nodeRight = 'xrcontroller-right-' + self.kernel.moniker();
                                    _self_.createXRControls('right');
                                    _self_.createXR.call(this, childID, nodeRight, {});
    
                                
                           // if (!AFRAME.utils.device.isMobileVR()) {
                            console.log("CREATE XRController LEFT HERE!!");
                                    let nodeLeft = 'xrcontroller-left-' + self.kernel.moniker();
                                    _self_.createXRControls('left');
                                    _self_.createXR.call(this, childID, nodeLeft, {});
                                }

                                else if (this.isDesktop){
                                    let nodeName = 'mouse-' + self.kernel.moniker();
                                    _self_.createDesktopControls();
                                    _self_.createXR.call(this, childID, nodeName, {position: [0, 0, -0.8]});
                                }



                           // }
                        // console.log(res);
                        _self_.createAvatar.call(self, childID);    
                           _self_.postLoadAction.call(self, childID);
    
                    }).then(res=>{
                        //document.body.appendChild(scene);
                    })
                    // this.state.appInitialized  = true;
    
                    //document.body.appendChild(scene); //append is not working in Edge browser
    
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
    
                if (node.extendsID == "proxy/aframe/gearvrcontroller.vwf") {
                    console.log("gearVR controller initialized")
                }
    
    
                // if (node.extendsID == "proxy/aframe/atext.vwf") {
                //     console.log("Text component initialized");
                //     node.aframeObj.play();
    
                // }
    
                // if (node.prototypes.includes("proxy/aframe/aentity.vwf")) {
    
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

                var node = this.state.nodes[nodeId];
    
                if (!(node && node.aframeObj)) {
                    return;
                }
    
    
    
    
            },
    
            satProperty: function (nodeId, propertyName, propertyValue) {
                let self = this;
    
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
                    _self_.receiveModelTransformChanges(nodeId, 'position', propertyValue);
                }
    
                if (propertyName == 'rotation') {
                    _self_.receiveModelTransformChanges(nodeId, 'rotation', propertyValue);
                }
    
                if (propertyName == 'scale') {
                    _self_.receiveModelTransformChanges(nodeId, 'scale', propertyValue);
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
                    _self_.updateMaterial(node);
                }
    
                if (node.aframeObj.nodeName == "VIDEO" && propertyName == 'itemSrc') {
                    _self_.updateMaterial(node);
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
                let self = this;
                var node = this.state.nodes[nodeID];
    
                if (!(node)) {
                    return;
                }

                var clientThatSatProperty = self.kernel.client();
                var me = self.kernel.moniker();
    
                if (eventName == "changingTransformFromView") {
    
                    // If the transform property was initially updated by this view....
                    if (clientThatSatProperty == me) {
                        var node = this.state.nodes[nodeID];
                        node.ignoreNextTransformUpdate = true;
                    }
                }
    
                //var avatarID = vwf_view.kernel.find("", avatarName)
    
                // if (eventName == "postLoadAction") {
    
                //     Object.entries(self.state.nodes).forEach(el => {
                //         if (el[1].prototypes.includes("proxy/aframe/aentity.vwf")) {
                //             vwf_view.kernel.callMethod(el[0], "setOwner", [self.kernel.moniker()]);
                //         }
    
                //     });
                // }
    
                 var avatarName = 'avatar-' + self.kernel.moniker();
    
                 if (eventName == "clickEvent" ||
                    eventName == 'mousedownEvent' ||
                    eventName == 'mouseupEvent'){

                        if (clientThatSatProperty == me) {

                        let methodName = eventName +'Method';
                        self.kernel.callMethod(nodeID, methodName, eventParameters);

                        if (eventName == "clickEvent"){

                            let mode = vwf.getProperty(avatarName, 'selectMode');
                            if (mode) {
                                console.log("allow to click!!!")
                                vwf_view.kernel.setProperty(avatarName, 'selectMode', false);
        
                                let editorDriver = vwf.views["/drivers/view/editor"];
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
                    }



                let intersectEvents = ['fromhitstart', 'fromhitend', 'hitstart', 'hitend', 'intersect', 'clearIntersect']; //'intersect', 
    
                let hitEvent = intersectEvents.filter(el=> el == eventName.slice(0,-5))[0]; //slice Event word
                if (hitEvent)
                {
    
                    // If the transform property was initially updated by this view....
                    if (clientThatSatProperty == me) {
                            let methodName = eventName +'Method';
                            self.kernel.callMethod(nodeID, methodName, eventParameters);

                    }
    
                }
        
    
    
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
    
                //update vr controllers
    
                if(self.hmd){
                    if(self.threeDoF )
                            _self_.updateHandControllerVR('gearvr-', '#gearvrcontrol');
    
                    if(this.sixDoF ) {
                        _self_.updateHandControllerVR('xrcontroller-right-', '#xrcontrollerright');
                        _self_.updateHandControllerVR('xrcontroller-left-', '#xrcontrollerleft');
                    }
                }
    
                if (this.isDesktop){
                    _self_.updateDesktopController('mouse-', '#mouse');
                }
        
                    
                
    
                //lerpTick ();
            },
    
            calledMethod: function (nodeID, methodName, methodParameters, methodValue) {
                let self = this;
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
    
                if (this.nodes[nodeID].extends == "proxy/aframe/acamera.vwf") {
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

                if (methodName == "createLocalRaycaster") {

                    //var clientThatSatProperty = self.kernel.client();
                    var me = self.kernel.moniker();
    
                    // If the transform property was initially updated by this view....
                    if (nodeID.includes(me)) {
                        console.log('Creating raycaster for ME: ', nodeID);
                        let xrcontroller = document.querySelector('#'+nodeID);

                        xrcontroller.setAttribute('raycaster', {
                            objects: '.intersectable',
                            showLine: false,
                            far: 100,
                            recursive: false,
                            interval: 10});

                            // xrcontroller.addEventListener('raycaster-intersection', function (evt) {
                            //     let int = evt.detail.intersections[0];
                            //     let idata = {
                            //         point: int.point,
                            //         elID: int.object.el.id
                            //     }
                            //     console.log(idata)
                            // })
                        
                            // xrcontroller.addEventListener('raycaster-intersection-cleared', function (evt) {
                            // })
                    }

                   


                }
    
            }
        });
    }

    resetInterpolationFromViewDriver(nodeID, methodParameters, propertyName) {

        if (methodParameters.length < 2 || methodParameters[1] == 0) {

            let viewNode = self.nodes[nodeID];
            if (viewNode.components.interpolation) {
                let interID = viewNode.components.interpolation;
                let viewComponentDriver = vwf.views["/drivers/view/aframeComponent"];
                viewComponentDriver.resetInterpolation(interID, propertyName);
            }
        }
    }


    // Receive Model Transform Changes algorithm 
    // 1.0 If (own view changes) then IGNORE (only if no external changes have occurred since the user’s view 
    //       requested this change – otherwise, will need to treat like 1.1 or 1.2)
    // 1.1 Elseif (other external changes and no outstanding own view changes) then ADOPT
    // 1.2 Else Interpolate to the model’s transform (conflict b/w own view and external sourced model changes)

   receiveModelTransformChanges(nodeID, propertyName, propertyValue) {

        let self = this.instance;
        var node = self.state.nodes[nodeID];

        // If the node does not exist in the state's list of nodes, then this update is from a prototype and we
        // should ignore it
        if (!node ) {
            return;
        }

        if(node.aframeObj.object3D) {

        // If the transform property was initially updated by this view....
        if (node.ignoreNextTransformUpdate) {
            node.outstandingTransformRequests.shift();
            node.ignoreNextTransformUpdate = false;
        } else {
            // adoptTransform( node, transformMatrix );

            let prop = self.state.setFromValue(propertyValue);

            if (propertyName == 'position') {
                let pos = prop.clone();
                node.aframeObj.object3D.position.copy(pos);
            } else if (propertyName == 'rotation') {
                let rot = prop.clone();

                node.aframeObj.object3D.rotation.set(
                    THREE.Math.degToRad(rot.x),
                    THREE.Math.degToRad(rot.y),
                    THREE.Math.degToRad(rot.z)
                )
                //node.aframeObj.object3D.rotation.set(rot[0], rot[1], rot[2]);
            } else if (propertyName == 'scale') {
                let scale = prop.clone();
                node.aframeObj.object3D.scale.copy(scale);
            } 

        }
    }


    }


    compareCoordinates(a, b, delta) {
        return Math.abs(a.x - b.x) > delta || Math.abs(a.y - b.y) > delta || Math.abs(a.z - b.z) > delta

    }

    getWorldRotation(el, order) {

        var worldQuat = new THREE.Quaternion();
        el.object3D.getWorldQuaternion(worldQuat);

        //console.log(worldQuat);
        let angle = (new THREE.Euler()).setFromQuaternion(worldQuat, order);
        let rotation = (new THREE.Vector3(THREE.Math.radToDeg(angle.x),
            THREE.Math.radToDeg(angle.y), THREE.Math.radToDeg(angle.z)));

        return rotation
    }


    updateAvatarPosition() {

        let self = this.instance;
        let delta = 0.001;

        let avatarName = 'avatar-' + self.kernel.moniker();
        var node = self.state.nodes[avatarName];
        if (!node) return;
        if (!node.aframeObj) return;

       let el = document.querySelector('#avatarControl');
       let elA = document.querySelector('#avatarControlParent');
        if (el && elA) {

            var position;

             if((self.hmd && self.sixDoF) || (self.hmd && self.threeDoF) || _app.config.d6DoF || _app.config.d3DoF){

                let positionC = el.object3D.position.clone();
                let positionA = elA.object3D.position.clone();

                position = positionC.add(positionA);
            } else {
                position = el.object3D.position;
            }

            //let position = el.object3D.position.add(elA.object3D.position);
            let rotation = el.getAttribute('rotation'); //getWorldRotation(el, 'YXZ');

            let lastRotation = self.nodes[avatarName].selfTickRotation;
            let lastPosition = self.nodes[avatarName].selfTickPosition ? self.nodes[avatarName].selfTickPosition: new THREE.Vector3(0, 0, 0);

            // let currentPosition = node.aframeObj.getAttribute('position');
            // let currentRotation = node.aframeObj.getAttribute('rotation');

            
            // compareCoordinates(position, lastPosition, delta) 

            if(position && lastPosition ) {
                let distance = lastPosition.distanceTo(position);

                if (distance > delta)
                {
                   // console.log("position not equal");
                    self.kernel.setProperty(avatarName, "position", position);
                }
            }

            if (rotation && lastRotation) {
                let distance = Math.abs(rotation.y - lastRotation.y);
                if ( distance > delta) {
                    //console.log("rotation not equal")
                   if (self.isDesktop) {
                    self.kernel.callMethod(avatarName, "updateAvatarBodyRotation", [rotation]);
                   } else {
                    self.kernel.callMethod(avatarName, "updateAvatarRotation", [rotation]);
                   }
                    
                }
            }
            self.nodes[avatarName].selfTickRotation = Object.assign({}, rotation);
            //self.nodes[avatarName].selfTickPosition = Object.assign({}, position);
            self.nodes[avatarName].selfTickPosition = position.clone();
        }

    }

    updateDesktopController(aName, aSelector) {
        let self = this.instance;
         //let avatarName = 'avatar-' + self.kernel.moniker();
 
         let delta = 0.001
        
         let avatarID = 'avatar-' + self.kernel.moniker();
         let avatarName = aName + self.kernel.moniker();
         var node = self.state.nodes[avatarName];
         if (!node) return;
         if (!node.aframeObj) return;
 
         //let elA = document.querySelector('#avatarControlParent');
         let elA = document.querySelector('#avatarControl');
         let el = document.querySelector(aSelector);
         let xrController = document.querySelector('#' + avatarName);
         if (el && elA) {
 
            //  let positionC = el.object3D.position.clone();
            //  let positionA = elA.object3D.position.clone();
            //  let position = positionC.add(positionA);

            let position = elA.object3D.position;
            //new THREE.Vector3(elA.object3D.position.x, elA.object3D.position.y-0.05, elA.object3D.position.z);

            //let position = elA.object3D.position;

            // let mouse = el.components["desktop-controls"]._mouse;
            // self.kernel.callMethod(avatarName, "trackMouse",[mouse]);
            var rotation = el.getAttribute('rotation');
            var headRotation = el.object3D.quaternion;

            if (self.isMobile) {
                var headWorldQuat = new THREE.Quaternion();
                elA.object3D.getWorldQuaternion(headWorldQuat);

                rotation = this.getWorldRotation(elA, 'XYZ');
                headRotation = headWorldQuat;
            }
            
            //let rotation = el.getAttribute('rotation');
            //((AFRAME.utils.device.isMobile() && !AFRAME.utils.device.isMobileVR()) || self.isDesktop) ? elA.getAttribute('rotation') : el.getAttribute('rotation');
             //let rotation =  el.getAttribute('rotation'); //this.getWorldRotation(el, 'YXZ');


             let lastRotation = self.nodes[avatarName].selfTickRotation;
             let lastPosition = self.nodes[avatarName].selfTickPosition ? self.nodes[avatarName].selfTickPosition: new THREE.Vector3(0, 0, 0);
 
             // let currentPosition = node.aframeObj.getAttribute('position');
             //let currentRotation = node.aframeObj.getAttribute('rotation');
 
             if (position && lastPosition) {
                 let distance = lastPosition.distanceTo(position);
 
                 if (distance > delta)
                 {
                    // console.log("position not equal");

                    let idata = el.components["desktop-controls"].intersectionData;
                    //if(idata) console.log('Point to: ', idata.point, ' intersect ', idata.elID);

                    self.kernel.setProperty(avatarName, "position", position);
                     self.kernel.callMethod(avatarName, "moveVRController",[idata]);
                 }
             }
 
             if (rotation && lastRotation) {
                 let distance = this.compareCoordinates(rotation, lastRotation, delta)
 
                 if (distance)
                 {
                     //console.log("rotation not equal");


                    let idata =  el.components["desktop-controls"].intersectionData;
                    //if(idata) console.log('Point to: ', idata.point, ' intersect ', idata.elID);

                     self.kernel.setProperty(avatarName, "rotation", rotation);
                     self.kernel.callMethod(avatarName, "moveVRController",[idata]);

                     self.kernel.callMethod(avatarID, "moveHead", [headRotation]);
                 }
             }
 
            self.nodes[avatarName].selfTickPosition = position.clone();
             self.nodes[avatarName].selfTickRotation = Object.assign({}, rotation);
 
         }
     }


   updateHandControllerVR(aName, aSelector) {
       let self = this.instance;
        //let avatarName = 'avatar-' + self.kernel.moniker();

        let delta = 0.001

        let avatarName = aName + self.kernel.moniker();
        var node = self.state.nodes[avatarName];
        if (!node) return;
        if (!node.aframeObj) return;

        let elA = document.querySelector('#avatarControlParent');
        let el = document.querySelector(aSelector);
        if (el && elA) {

            let positionC = el.object3D.position.clone();
            let positionA = elA.object3D.position.clone();
            let position = positionC.add(positionA);

            let rotation = el.getAttribute('rotation'); //getWorldRotation(el, 'YXZ');

            let lastRotation = self.nodes[avatarName].selfTickRotation;
            let lastPosition = self.nodes[avatarName].selfTickPosition ? self.nodes[avatarName].selfTickPosition: new THREE.Vector3(0, 0, 0);

            // let currentPosition = node.aframeObj.getAttribute('position');
            //let currentRotation = node.aframeObj.getAttribute('rotation');

            if (position && lastPosition) {
                let distance = lastPosition.distanceTo(position);

                if (distance > delta)
                {
                    //let idata = el.components["xrcontroller"].intersectionData;

                let intersection = el.components.raycaster.intersections[0];
                let point = intersection ? intersection.point : null;
                let elID = intersection ? intersection.object.el.id : null;
                let idata = point ? {
                    point: point,
                    elID: elID
                } : null;
               
                   // console.log("position not equal");
                    self.kernel.setProperty(avatarName, "position", position);
                    self.kernel.callMethod(avatarName, "moveVRController",[idata]);
                }
            }

            if (rotation && lastRotation) {
                let distance = this.compareCoordinates(rotation, lastRotation, delta)

                if (distance)
                {
                    let intersection = el.components.raycaster.intersections[0];
                    let point = intersection ? intersection.point : null;
                    let elID = intersection ? intersection.object.el.id : null;
                    let idata = point ? {
                        point: point,
                        elID: elID
                    } : null;
                    //console.log("rotation not equal");
                    self.kernel.setProperty(avatarName, "rotation", rotation);
                    self.kernel.callMethod(avatarName, "moveVRController",[idata]);
                }
            }

            // if (position && rotation && lastRotation && lastPosition) {
            //     if (compareCoordinates(position, lastPosition, delta) || compareCoordinates(rotation, lastRotation, delta)) {
            //         console.log("not equal!!");
            //         vwf_view.kernel.callMethod(avatarName, "updateVRControl", [position, rotation]);
            //     }
            // }


            //vwf_view.kernel.callMethod(avatarName, "updateVRControl", [position, rotation]);

            self.nodes[avatarName].selfTickPosition = position.clone();
            self.nodes[avatarName].selfTickRotation = Object.assign({}, rotation);

        }
    }


     getMovementVector(el, vel) {
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

    setJoystickMoveInput (event) {
        const axes = event.detail.axis;
        //console.log(axes);
        let el = document.querySelector('#avatarControl');
        let position = new THREE.Vector3();
        el.object3D.localToWorld(position);//getWorldPosition(position);
        let vel = new THREE.Vector3(axes[0], 0, -axes[1]);
        el.object3D.position.add(this.getMovementVector(el,vel));
    }

    setJoystickRotateY (event) {
        const val = event.detail.value;
        //console.log(val);
        let el = document.querySelector('#avatarControl');
        let rotation = el.object3D.rotation;
        el.object3D.rotation.y += (-val)+rotation.y;
        //el.object3D.rotation.set(rotation.x,-val+rotation.y, rotation.z)
    }

    setJoystickRotateX (event) {
        const val = event.detail.value;
        //console.log(val);
        let el = document.querySelector('#avatarControl');
        let rotation = el.object3D.rotation;
        el.object3D.rotation.x += val+rotation.x;
        //el.object3D.rotation.set(val+rotation.x, rotation.y, rotation.z)
    }

    async createAvatarControl(aScene) {
        let self = this.instance;

        let avatarName = 'avatar-' + self.kernel.moniker();

        let avatarEl = document.createElement('a-entity');
        avatarEl.setAttribute('id', 'avatarControlParent');



       

        //avatarEl.setAttribute('position', '0 1.6 0');

        let controlEl = document.createElement('a-camera');

        controlEl.setAttribute('id', 'avatarControl');
        controlEl.setAttribute('wasd-controls', {acceleration:20});
        controlEl.setAttribute('look-controls', { pointerLockEnabled: false});
        controlEl.setAttribute('look-controls', 'enabled', true );

        controlEl.setAttribute('camera', 'near', 0.1 );

        //controlEl.setAttribute('gamepad-controls', {'controller': 0});

        let cursorEl = document.createElement('a-cursor');
        cursorEl.setAttribute('id', 'cursor-' + avatarName);
        cursorEl.setAttribute('raycaster', {});
        cursorEl.setAttribute('raycaster', 'objects', '.clickable');
        cursorEl.setAttribute('raycaster', 'showLine', false);

        if (self.d3DoF || _app.config.d3DoF) {
            //avatarEl.setAttribute('gearvr-controls', {}); 
            avatarEl.setAttribute('movement-controls', {});//{'controls': 'gamepad'});
            //avatarEl.setAttribute("gamepad-controls", {});
            //avatarEl.setAttribute('position', '0 0 0');
        }

        else if (AFRAME.utils.device.isMobile()) {
            //self.state.showMobileJoystick()

            //controlEl.setAttribute('look-controls', 'enabled', true );
            controlEl.setAttribute("virtual-gamepad-controls", {});
            controlEl.addEventListener("move", this.setJoystickMoveInput.bind(this));
        }
        //controlEl.addEventListener("rotateY", setJoystickRotateY);
        //controlEl.addEventListener("rotateX", setJoystickRotateX);
        

        //controlEl.setAttribute('gearvr-controls',{});


       

        else if (self.isDesktop){
            cursorEl.setAttribute('cursor',
             {
                rayOrigin: 'mouse'
            });
            cursorEl.setAttribute('visible', false);
             
        }

        // cursorEl.setAttribute('raycaster', {objects: '.intersectable', showLine: true, far: 100});
        // cursorEl.setAttribute('raycaster', 'showLine', true);
        controlEl.appendChild(cursorEl);

        avatarEl.appendChild(controlEl);


        aScene.appendChild(avatarEl);

        controlEl.setAttribute('camera', 'active', true);

        //avatarEl.setAttribute('avatar', {});

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



    }

    createXR(nodeID, nodeName, props) {
        let self = this;
        var newNode = {
            "id": nodeName,
            "uri": nodeName,
            "extends": "proxy/aframe/xrcontroller.vwf",
            "properties": {
            }
        }

        if (!self.state.nodes[nodeName]) {

            vwf_view.kernel.createChild(nodeID, nodeName, newNode);
            vwf_view.kernel.callMethod(nodeName, "createController", [props.position]);
            //"/../assets/controller/wmrvr.gltf"
        }
    }


   createGearVRController(nodeID, nodeName) {
        let self = this;
        var newNode = {
            "id": nodeName,
            "uri": nodeName,
            "extends": "proxy/aframe/gearvrcontroller.vwf",
            "properties": {
            }
        }

        if (!self.state.nodes[nodeName]) {

            vwf_view.kernel.createChild(nodeID, nodeName, newNode);
            vwf_view.kernel.callMethod(nodeName, "createController", []);
            //"/../assets/controller/gearvr.gltf"
        }
    }

    postLoadAction(nodeID) {

        //vwf_view.kernel.fireEvent(nodeID, "postLoadAction")
    }

   createAvatar(nodeID) {
        let self = this;

       // vwf_view.kernel.fireEvent(nodeID, "createAvatar");

       var avatarName = 'avatar-' + self.kernel.moniker();

           console.log("creating avatar...");

           // let avatarID = self.kernel.moniker();
           // var nodeName = 'avatar-' + avatarID;

           var newNode = {
               "id": avatarName,
               "uri": avatarName,
               "extends": "proxy/aframe/avatar.vwf",
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
    }

   createGearVRControls() {

        let avatarControl = document.querySelector('#avatarControlParent');

        let el = document.createElement('a-entity');
        el.setAttribute('id', 'gearvrcontrol');

        el.setAttribute('gearvr-controls', {
            'hand': 'right',
            'model': true
        });
        //el.setAttribute('laser-controls', {hand: "right"});
    
        // gearvr.setAttribute('gearvr-controls', 'hand', 'right');

        el.setAttribute('teleport-controls', { 
            cameraRig: '#avatarControlParent',
            teleportOrigin: '#avatarControl',
            startEvents: 'teleportstart',
            endEvents: 'teleportend'
        });

        el.setAttribute('gearvrcontrol', {});
        avatarControl.appendChild(el);

    }

    createDesktopControls() {

        let self = this.instance;
        let avatarControl = document.querySelector('#avatarControlParent');

        let el = document.createElement('a-entity');
        el.setAttribute('id', 'mouse');
        // el.setAttribute('geometry', {
        //     primitive: 'box', width: 0.2, height: 0.2, depth: 1
        // });
        // el.setAttribute('position', {
        //     x: 0, y: 0, z: -1
        // });
        el.setAttribute('desktop-controls', {});
       // el.setAttribute('raycaster', {objects: ".intersectable", far: 1000, showLine: true});
        avatarControl.appendChild(el);
    }

    createXRControls(hand) {

        let self = this.instance;
        let avatarControl = document.querySelector('#avatarControlParent');

        let el = document.createElement('a-entity');
        el.setAttribute('id', 'xrcontroller' + hand);

        el.setAttribute('hand-controls', {
            'hand': hand,
            'handModelStyle': 'lowPoly',
            'color': '#ffcccc'
        });

        el.setAttribute('laser-controls', {hand: hand, model:false});
        //el.setAttribute('raycaster', {objects: ".collidable", far: 5, showLine: false});

        // wmrvr.setAttribute('windows-motion-controls', '');
        // wmrvr.setAttribute('windows-motion-controls', 'hand', hand);

        el.setAttribute('xrcontroller', { 'hand': hand });

        //add teleport controls
        el.setAttribute('teleport-controls', { 
            cameraRig: '#avatarControlParent',
            teleportOrigin: '#avatarControl',
            startEvents: 'teleportstart',
            endEvents: 'teleportend'
        });

        avatarControl.appendChild(el);
    }


    updateMaterial(node) {
        let self = this.instance;

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

}

export { AFrameView as default }