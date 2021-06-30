/*
The MIT License (MIT)
Copyright (c) 2014-2020 Nikolai Suslov and the Krestianstvo.org project contributors. (https://github.com/NikolaySuslov/livecodingspace/blob/master/LICENSE.md)
*/

// VWF & A-Frame view driver

import {Fabric} from '/core/vwf/fabric.js';

class PTSView extends Fabric {

  constructor(module) {
    console.log("PTSView constructor");
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
                
               
    
                this.state.appInitialized = false;


                if (options === undefined) { options = {}; }
    
                if (typeof options == "object") {
    
                    this.rootSelector = options["application-root"];
                }
                else {
                    this.rootSelector = options;
                }
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
                    space.bindMouse().bindTouch().play();

                    //TODO: FIX
                    

                        // let el = document.createElement("space");
                        // el.setAttribute("id", "space");
                        // document.querySelector("body").appendChild(el);
                        // Pts.namespace( window );
                        //var form = scene.obj.getForm();
                        //_self_.createAvatar.call(self, childID);    

                      let avatarName = 'avatar-' + self.kernel.moniker();

                        console.log("creating avatar...");
             
                        // let avatarID = self.kernel.moniker();
                        // var nodeName = 'avatar-' + avatarID;
             
                        var newNode = {
                            "id": avatarName,
                            "uri": avatarName,
                            "extends": "proxy/pts/pt.vwf",
                            "properties": {}
                        }
             
                        if (!self.state.nodes[avatarName]) {
                            vwf_view.kernel.createChild(childID, avatarName, newNode);
                           // vwf_view.kernel.callMethod(avatarName, "createPlayer", []);
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

                    if (this.nodes[childID].extends == "proxy/pts/pt.vwf") {

                        console.log("CREATE PLAYER HERE!!");
                        let scene = node.scene;
                        let space = scene.obj;
                        let form = scene.form;
                        let color = "09f";
    
                        let player = {
                            myID: childID,
                            start: (bound) => {},
                        
                            animate: (time, ftime) => {
                                //let radius = Num.cycle( (time%1000)/1000 ) * 20;
                                //form.fill("#09f").point( node.obj, radius, "circle" );
                              form.fill(color).point( node.obj, 10 );
                            },
                        
                            action: (type, x, y) => {
                                if(type == 'click')
                                  console.log(x, ' - ', y);  

                                  if(type == 'over')
                                    console.log(x, ' - ', y);  
                            }
                          }
                          space.add(player);

                    }

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
    
                if (!(node && node.ptsObj)) {
                    return;
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
               // _self_.updateFilters();
    
                //update vr controllers
    
                // if (this.isDesktop){
                //     _self_.updateDesktopController('mouse-', '#mouse');
                // }
        
                    
                
    
                //lerpTick ();
            },
    
            calledMethod: function (nodeID, methodName, methodParameters, methodValue) {
                let self = this;
                var node = this.state.nodes[nodeID];
    
                if (!(node && node.obj)) {
                    return;
                }
    
    
           
    
                if (this.nodes[nodeID].extends == "proxy/pts/pt.vwf") {
                    if(methodName == "createPlayer"){

                        console.log("CREATE PLAYER HERE!!");
                        let scene = node.scene;
                        let space = scene.obj;
                        let form = scene.form;
    
                        let player = {
                            myID: nodeID,
                            start: (bound) => {},
                        
                            animate: (time, ftime) => {
                              form.point( node.obj, 10 );
                            },
                        
                            action: (type, x, y) => {
                                if(type == 'click')
                                  console.log(x, ' - ', y);  
                            }
                          }
                          space.add(player);

                    }
                }
    
            }
        });
    }




    updateAvatarPosition() {
        let self = this.instance;
        let avatarName = 'avatar-' + self.kernel.moniker();
        var node = self.state.nodes[avatarName];
        var nodeView = self.state.nodes[avatarName];
        if (!node) return;
        if (!node.obj) return;

        let space = node.scene.obj;
        let position = space.pointer;

        if(!nodeView.lastPosition){
            nodeView.lastPosition = new Pt([position.x, position.y])
        } 

        let lastPosition = nodeView.lastPosition;

        if(position && !(position.equals(lastPosition))){
            self.kernel.setProperty(avatarName, "x", position.x);
            self.kernel.setProperty(avatarName, "y", position.y);
        }

        nodeView.lastPosition.to([position.x, position.y])

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

export { PTSView as default }