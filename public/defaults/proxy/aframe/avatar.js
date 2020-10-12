this.simpleBodyDef = {
    "extends": "proxy/aframe/abox.vwf",
    "properties": {
        "position": [0, 0.66, 0.7],
        "height": 1.3,
        "width": 0.65,
        "depth": 0.1,
    },
    "children": {
        "material": {
            "extends": "proxy/aframe/aMaterialComponent.vwf",
            "type": "component",
            "properties":{
                "color": "white"
            }
        }
    }
}

this.modelBodyDef = {
    "extends": "proxy/aframe/agltfmodel.vwf",
    "properties": {
        "src": "#avatar",
        "position": [0, 0, 0.8],
        "rotation": [0, 180, 0]
    },
    "children": {
        "animation-mixer": {
            "extends": "proxy/aframe/anim-mixer-component.vwf",
            "properties": {
                "clip": "*",
                "duration": 1
            }
        }

    }
}

this.findWorldAvatarCostume = function () {
    
    let scene = this.getScene();
    let def = scene.defaultAvatarCostume;

    let allChilds = this.find("//element(*,'proxy/aframe/aentity.vwf')"); //this.children
    let costumes = allChilds.filter(el => (el.meta == 'avatarCostume'));
    let avatarCostume = costumes ? costumes[0]: null;

    if (def || avatarCostume) {

    var defID;  
    if (def) {
        defID = def.id;
    } else if (avatarCostume) {
        defID = avatarCostume.id;
    }

    let avatarNode = _app.helpers.getNodeDef(defID);
    return avatarNode
}

    return null
} 

this.updateYPositionForXR = function(height){

    if(this.avatarNode) {
            let position = this.avatarNode.position.clone();
            this.avatarNode.position = [position.x, height, position.z]
    }

}

this.createAvatarBody = function (nodeDef, modelSrc) {

    var userHeight = -1.6;


    let myColor = "white"; //this.getRandomColor();
    let myBodyDef = this.simpleBodyDef;
    //let myHandDef = this.simpleVrControllerDef;

    if(!this.displayName)
        this.displayName = 'Avatar ' + this.random().toString(36).substr(2, 9);

    myBodyDef.children.material.properties.color = myColor;

    var defaultNode = {
        "extends": "proxy/aframe/aentity.vwf",
        "properties": {
            "position": [0, userHeight, 0], //-userHeight
            "meta": "avatarCostume"
        },
        "methods": {
            "randomize":{
                "body":`
                let myColor = this.getRandomColor();
                this.myName.color = myColor;
                this.myBody.material.color = myColor;
                this.myHead.visual.material.color = myColor;
                //this.myHead.myCursor.vis.material.color = myColor;
                //this.myHead.myCursor.line.color = myColor;

                let cursorEl = this.getScene()['mouse-' + this.parent.id.slice(7)];
                cursorEl.xrnode.controller.cursorVisual.avatarColor = myColor;
                cursorEl.xrnode.controller.cursorVisual.color = myColor;
                `

            }
        },
        children: {
           
            "myBody": myBodyDef,
            //"myHand": myHandDef,
            "myHead": {
                "extends": "proxy/aframe/aentity.vwf",
                "properties": {
                    "position": [0, 1.6, 0.7],
                    "visible": true
                },
                children: {
                    "interpolation":
                    {
                        "extends": "proxy/aframe/interpolation-component.vwf",
                        "type": "component",
                        "properties": {
                            "enabled": true
                        }
                    },
                    "visual": {
                        "extends": "proxy/aframe/abox.vwf",
                        "properties": {
                            "height": 0.5,
                            "width": 0.5,
                            "depth": 0.1,
                            "visible": true
                        },
                        "children": {
                            "material": {
                                "extends": "proxy/aframe/aMaterialComponent.vwf",
                                "type": "component",
                                "properties":{
                                    "color": myColor
                                }
                            }
                        }
                    },
                    
                    "myCamera":
                    {
                        //"id": 'camera-' + this.id,
                        "extends": "proxy/aframe/acamera.vwf",
                        "properties": {
                            "position": [0, 0, -0.7], //userHeight
                            "look-controls-enabled": false,
                            "wasd-controls-enabled": false,
                            "user-height": 0
                        }
                    },
                    // "myCursor":
                    // {
                    //     //"id": 'myCursor-' + this.id,
                    //     "extends": "proxy/aframe/aentity.vwf",
                    //     "properties": {},
                    //     "children": {
                    //         "vis": {
                    //             "extends": "proxy/aframe/abox.vwf",
                    //             "properties": {
                    //                 "position": [0, 0, -3],
                    //                 "height": 0.05,
                    //                 "width": 0.05,
                    //                 "depth": 0.01,
                    //                 "visible": true
                    //             },
                    //             "children": {
                    //                 "material": {
                    //                     "extends": "proxy/aframe/aMaterialComponent.vwf",
                    //                     "type": "component",
                    //                     "properties":{
                    //                         "color": myColor
                    //                     }
                    //                 },
                    //                 "aabb-collider": {
                    //                     "extends": "proxy/aframe/aabb-collider-component.vwf",
                    //                     "type": "component",
                    //                     "properties": {
                    //                         debug: false,
                    //                         interval: 10,
                    //                         objects: ".hit"
                    //                     }
                    //                 }
                    //             }
                                
                    //         },
                    //         "line": {
                    //             "extends": "proxy/aframe/lineComponent.vwf",
                    //             "type": "component",
                    //             "properties": {
                    //                 "start": "0 0 -1",
                    //                 "end": "0 0 -3",
                    //                 "color": myColor
                    //             }
                    //         },
                    //         // "realCursor":{
                    //         //     "extends": "proxy/aframe/acursor.vwf",
                    //         //     "properties": {
                    //         //         visible: false
                    //         //     },
                    //         //     "children": {
                    //         //         "raycaster": {
                    //         //             "extends": "proxy/aframe/raycasterComponent.vwf",
                    //         //             "type": "component",
                    //         //             "properties": {
                    //         //                 //recursive: false,
                    //         //                 //interval: 1000,
                    //         //                 far: 100,
                    //         //                 //objects: ".intersectable"
                    //         //             }
                    //         //         }
                    //         //     }
                    //         // },
                    //        "myRayCaster": {
                    //         "extends": "proxy/aframe/aentity.vwf",
                    //         "properties": {},
                    //         "children": {
                    //             "raycaster": {
                    //                 "extends": "proxy/aframe/raycasterComponent.vwf",
                    //                 "type": "component",
                    //                 "properties": {
                    //                     recursive: false,
                    //                     interval: 100,
                    //                     far: 3,
                    //                     objects: ".intersectable"
                    //                 }
                    //             }
                    //         }
                    //     },
                    //     //     "raycaster-listener": {
                    //     //         "extends": "proxy/aframe/app-raycaster-listener-component.vwf",
                    //     //         "type": "component"
                    //     //     }
                           
                    //     }
                    // }

                }
            },
        //     "myHand":{
        //         "id": "hand-" + this.id, 
        //         "extends": "proxy/aframe/xrcontroller.vwf",
        //         "properties": {
        //             "position": [0, 1.2, -0.3]
        //         }
        // },
            "myName": {
                "extends": "proxy/aframe/atext.vwf",
                "properties": {
                    "color": myColor,
                    "value": this.displayName,
                    "side": "double",
                    "rotation": [0, 180, 0],
                    "position": [0.3, 2.05, 0.5]
                }
            }


        }
    }



    var newNode  = Object.assign({}, defaultNode);

   //1. check for default user saved avatar...
   if (nodeDef){
    newNode = Object.assign({}, nodeDef);
    newNode.properties.position = [0, userHeight, 0];
    //newNode.children.myName.properties.value = this.displayName;
   //newNode = Object.assign(defaultNode, nodeDef);
}

    //2. check for default avatar costume in world...
    // let defaultWorldCostume = this.findWorldAvatarCostume();
    // if(defaultWorldCostume) {
    //     newNode = Object.assign({}, defaultWorldCostume);
    //     newNode.properties.visible = true;
    //     newNode.properties.position = [0, userHeight, 0];
    //     newNode.children.myName.properties.value = this.displayName;
    // }
    

     //3. check for model...
    if (modelSrc) {

        let myBodyDef = this.modelBodyDef;
        myBodyDef.properties.src = modelSrc;

        newNode.children.myBody = myBodyDef;

        newNode.children.myHead.children.visual.properties.visible = false;
       //newNode.children.myHead.children.myCursor.properties.visible = true;

    }


    //let cursor = 
    //{
    //       "id": 'cursor-' + this.id,
    //       "extends": "proxy/aframe/acursor.vwf",
    //}


    let interpolation =  {
        "extends": "proxy/aframe/interpolation-component.vwf",
        "type": "component",
        "properties": {
            "enabled": true
        }
    }


    this.children.create( "interpolation", interpolation );
    //this.children.create( "myCursor", myCursor );
    //this.children.create( "avatarCamera", camera );
    // this.children.create( "avatarNameNode", avatarNameNode );

    this.children.create("avatarNode", newNode, function(child){

        if (!nodeDef) {
          child.randomize();
        }

        //child.myHand.createController();

    });

    // this.localUrl = '';
    // this.remoteUrl = '';
    // this.displayName = this.id;
    // this.sharing = { audio: true, video: true };

   // this.children.create("avatarNode", newNode);

    // this.children.create( "avatarBodyModel", newNodeModel );

    //this.interpolation = "50ms";
    //vwf_view.kernel.createChild(this.id, "avatarCursor", cursorVis);

}


this.moveHand = function (rotation) { 

    this.avatarNode.myHand.rotation = rotation;
    this.moveHead(rotation);
}

this.moveHead = function (rotation) { 

    let newRotation = this.globalToLocalRotation(rotation);
    this.avatarNode.myHead.rotation = newRotation;
   //let euler = new THREE.Euler().setFromVector3(rotation); 
       //let euler = new THREE.Euler().setFromVector3(rotation); 
    //    let q = this.localQuaternion().inverse().multiply(rotation); //new THREE.Quaternion().setFromEuler(euler)
    //     let localEuler = new THREE.Euler().setFromQuaternion(q, 'YXZ');
    //     this.avatarNode.myHead.rotation = [
    //         THREE.Math.radToDeg(localEuler.x),
    //         THREE.Math.radToDeg(localEuler.y),
    //         THREE.Math.radToDeg(localEuler.z)
    //     ];

}


this.updateAvatarRotation = function (rotation) { 
    
    let myRot = this.rotation.clone();
    let myHeadRot = this.avatarNode.myHead.rotation.clone();
    this.rotation = [myRot.x, rotation.y, myRot.z];
    this.avatarNode.myHead.rotation = [rotation.x, myHeadRot.y, rotation.z];
}

this.followAvatarControl = function (position, rotation) {

    let myRot = this.rotation.clone();
    let myHeadRot = this.avatarNode.myHead.rotation.clone();
    this.rotation = [myRot.x, rotation.y, myRot.z];
    this.avatarNode.myHead.rotation = [rotation.x, myHeadRot.y, rotation.z];

}

this.setUserAvatar = function(aName){

    this.displayName = aName;
    this.avatarNode.myName.value = aName;

}

this.changeCostume = function(val, restore){

    let userHeight = -1.6;

    var myNameValue = this.displayName;

    if (this.avatarNode) {
        myNameValue = this.avatarNode.children.myName.properties.value;
        this.children.delete(this.avatarNode);
        //this.children.delete(this.interpolation);
    }
    let newNode = Object.assign({}, val);
    newNode.properties.position = [0, userHeight, 0];
    newNode.properties.visible = true;
    newNode.properties.meta = "avatarCostume";
    if(!restore)
        newNode.children.myName.properties.value = myNameValue;
    this.children.create("avatarNode", newNode);

}

this.resetAvatar = function(){

    //TODO: add XR check

    if (this.avatarNode) {
        //myNameValue = this.avatarNode.children.myName.properties.value;
        this.children.delete(this.avatarNode);
        this.children.delete(this.interpolation);
    }

    this.createAvatarBody();

}

this.createSimpleAvatar = function(){
       if (this.avatarNode.myBody) {
        this.avatarNode.children.delete(this.avatarNode.myBody);
       }

        var myColor = this.getRandomColor();
        if (this.avatarNode.myHead){
            myColor = this.avatarNode.myHead.visual.material.color;
        }

        let myBodyDef = this.simpleBodyDef;
        myBodyDef.children.material.properties.color = myColor;

        this.avatarNode.children.create("myBody", myBodyDef);
        this.avatarNode.myHead.visual.properties.visible = true;

       
}

this.createAvatarFromGLTF = function(modelSrc){

    if (this.avatarNode.myBody) {
        this.avatarNode.children.delete(this.avatarNode.myBody);
        
        let myBodyDef = this.modelBodyDef;
        myBodyDef.properties.src = modelSrc;

        this.avatarNode.children.create("myBody", myBodyDef);

        this.avatarNode.myHead.visual.properties.visible = false;
        //this.avatarNode.myHead.myCursor.properties.visible = true;

       }

}

this.showHideCursor = function(bool){
    //this.avatarNode.myHead.myCursor.properties.visible = bool;
}

this.showHideAvatar = function(bool){
    this.properties.visible = bool;
}

this.setBigVideoHead = function(val){
    this.avatarNode.myHead.visual.height = 4;
    this.avatarNode.myHead.visual.width = 3;
    this.avatarNode.myBody.visible = false;
}

this.setSmallVideoHead = function(val){
    this.avatarNode.myHead.visual.height = 0.5;
    this.avatarNode.myHead.visual.width = 0.5;
    this.avatarNode.myBody.visible = true;
}

this.setVideoTexture = function(val){
    console.log(val);
   // this.setSmallVideoHead();
    this.avatarNode.myHead.visual.material.color = "white";
    this.avatarNode.myHead.visual.material.src = '#temp';
    this.avatarNode.myHead.visual.material.src = '#'+val;
}

this.removeVideoTexture = function(){
   // this.setSmallVideoHead();
    this.avatarNode.myHead.visual.material.color = this.avatarNode.myBody.material.color;
    this.avatarNode.myHead.visual.material.src = "";
    // this.avatarNode.myHead.visual.src = '#'+val;
}

this.removeSoundWebRTC = function(){

    if (this.avatarNode.audio)
    this.avatarNode.children.delete(this.avatarNode.audio);
}

this.setSoundWebRTC = function(val){
    console.log(val);
    if (this.avatarNode.audio) this.removeSoundWebRTC();

    var soundNode = {
        "extends": "proxy/aframe/aentity.vwf",
        "properties": {
        },
        "children":{
            "streamsound":{
                "extends": "proxy/aframe/streamSoundComponent.vwf",
                "type": "component",
                "properties": {
                }
            }
        }
    }
    this.avatarNode.children.create("audio", soundNode );
   // this.setSmallVideoHead();

    //this.avatarNode.audio.src = '#tempAudio';
    //this.avatarNode.audio.src = '#'+val;
}

this.webrtcTurnOnOff = function(val){
    console.log('WEBRTC is ', val);
}

this.webrtcMuteAudio = function(val){
    console.log('WEBRTC Audio is ', val);
}

this.webrtcMuteVideo = function(val){
    console.log('WEBRTC Video is ', val);
}

this.initialize = function() {
   // this.future(0).updateAvatar();
};


this.setMyName = function(val){
    this.avatarNode.myName.value = val
}

this.randomizeAvatar = function() {
    this.avatarNode.randomize();
}
