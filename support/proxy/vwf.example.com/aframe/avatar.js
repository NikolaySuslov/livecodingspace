this.simpleBodyDef = {
    "extends": "http://vwf.example.com/aframe/abox.vwf",
    "properties": {
        "color": "white",
        "position": "0 0.66 0.7",
        "height": 1.3,
        "width": 0.65,
        "depth": 0.1,
    }
}

this.modelBodyDef = {
    "extends": "http://vwf.example.com/aframe/agltfmodel.vwf",
    "properties": {
        "src": "#avatar",
        "position": "0 0 0.8",
        "rotation": "0 180 0"
    },
    "children": {
        "animation-mixer": {
            "extends": "http://vwf.example.com/aframe/anim-mixer-component.vwf",
            "properties": {
                "clip": "*",
                "duration": 1
            }
        }

    }
}


this.createAvatarBody = function (modelSrc) {


    let avatarControl = document.querySelector('#avatarControl');


    //let userHeight = avatarControl.getAttribute('camera').userHeight;
    var userHeight = avatarControl.getAttribute('look-controls').userHeight; //avatarControl.getAttribute('position').y;

    // if (AFRAME.utils.device.isGearVR()) {
    //     userHeight = 0
    // }

    let myColor = this.getRandomColor();
    let myBodyDef = this.simpleBodyDef;
    //let myHandDef = this.simpleVrControllerDef;

    myBodyDef.properties.color = myColor;

    var newNode = {
        "extends": "http://vwf.example.com/aframe/aentity.vwf",
        "properties": {
            "position": [0, -userHeight, 0] //-userHeight
        },
        children: {
           
            "myBody": myBodyDef,
            //"myHand": myHandDef,
            "myHead": {
                "extends": "http://vwf.example.com/aframe/aentity.vwf",
                "properties": {
                    "position": "0 1.6 0.7",
                    "visible": true
                },
                children: {
                    "interpolation":
                    {
                        "extends": "http://vwf.example.com/aframe/interpolation-component.vwf",
                        "type": "component",
                        "properties": {
                            "enabled": true
                        }
                    },
                    "visual": {
                        "extends": "http://vwf.example.com/aframe/abox.vwf",
                        "properties": {
                            "color": myColor,
                            "height": 0.5,
                            "width": 0.5,
                            "depth": 0.1,
                            "visible": true
                        }
                    },
                    
                    "myCamera":
                    {
                        "id": 'camera-' + this.id,
                        "extends": "http://vwf.example.com/aframe/acamera.vwf",
                        "properties": {
                            "position": "0 0 -0.7",
                            "look-controls-enabled": false,
                            "wasd-controls-enabled": false,
                            "user-height": 0
                        }
                    },
                    "myCursor":
                    {
                        "id": 'myCursor-' + this.id,
                        "extends": "http://vwf.example.com/aframe/aentity.vwf",
                        "properties": {},
                        "children": {
                            "vis": {
                                "extends": "http://vwf.example.com/aframe/abox.vwf",
                                "properties": {
                                    "color": myColor,
                                    "position": "0 0 -3",
                                    "height": 0.05,
                                    "width": 0.05,
                                    "depth": 0.01,
                                    "visible": true
                                }
                            },
                            "line": {
                                "extends": "http://vwf.example.com/aframe/lineComponent.vwf",
                                "type": "component",
                                "properties": {
                                    "start": "0 0 -1",
                                    "end": "0 0 -3",
                                    "color": myColor
                                }
                            },
                            // "realCursor":{
                            //     "extends": "http://vwf.example.com/aframe/acursor.vwf",
                            //     "properties": {
                            //         visible: false
                            //     },
                            //     "children": {
                            //         "raycaster": {
                            //             "extends": "http://vwf.example.com/aframe/raycasterComponent.vwf",
                            //             "type": "component",
                            //             "properties": {
                            //                 //recursive: false,
                            //                 //interval: 1000,
                            //                 far: 100,
                            //                 //objects: ".intersectable"
                            //             }
                            //         }
                            //     }
                            // },
                           "myRayCaster": {
                            "extends": "http://vwf.example.com/aframe/aentity.vwf",
                            "properties": {},
                            "children": {
                                "raycaster": {
                                    "extends": "http://vwf.example.com/aframe/raycasterComponent.vwf",
                                    "type": "component",
                                    "properties": {
                                        recursive: false,
                                        interval: 1000,
                                        far: 3,
                                        objects: ".intersectable"
                                    }
                                }
                            }
                        },
                        //     "raycaster-listener": {
                        //         "extends": "http://vwf.example.com/aframe/app-raycaster-listener-component.vwf",
                        //         "type": "component"
                        //     }
                           
                        }
                    }
                }
            },
            "myName": {
                "extends": "http://vwf.example.com/aframe/atext.vwf",
                "properties": {
                    "color": myColor,
                    "value": this.id,
                    "side": "double",
                    "rotation": "0 180 0",
                    "position": "0.3 2.05 0.5"
                }
            }


        }
    }

    if (modelSrc) {

        let myBodyDef = this.modelBodyDef;
        myBodyDef.properties.src = modelSrc;

        newNode.children.myBody = myBodyDef;

        newNode.children.myHead.children.visual.properties.visible = false;
       newNode.children.myHead.children.myCursor.properties.visible = true;

    }


    //let cursor = 
    //{
    //       "id": 'cursor-' + this.id,
    //       "extends": "http://vwf.example.com/aframe/acursor.vwf",
    //}


    let interpolation =  {
        "extends": "http://vwf.example.com/aframe/interpolation-component.vwf",
        "type": "component",
        "properties": {
            "enabled": true
        }
    }


    this.children.create( "interpolation", interpolation );
    //this.children.create( "myCursor", myCursor );
    //this.children.create( "avatarCamera", camera );
    // this.children.create( "avatarNameNode", avatarNameNode );

    this.children.create("avatarNode", newNode);

    // this.localUrl = '';
    // this.remoteUrl = '';
    // this.displayName = this.id;
    // this.sharing = { audio: true, video: true };

   // this.children.create("avatarNode", newNode);

    // this.children.create( "avatarBodyModel", newNodeModel );

    //this.interpolation = "50ms";
    //vwf_view.kernel.createChild(this.id, "avatarCursor", cursorVis);

}

this.getRandomColor = function () {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(this.random() * 16)];
    }
    return color;
}

this.followAvatarControl = function (position, rotation) {
    // this.position = AFRAME.utils.coordinates.stringify(position);
    // this.rotation = AFRAME.utils.coordinates.stringify(rotation);
//debugger;

    this.position = AFRAME.utils.coordinates.stringify(position);
    let myRot = AFRAME.utils.coordinates.parse(this.rotation);
    let myHeadRot = AFRAME.utils.coordinates.parse(this.avatarNode.myHead.rotation);
    let myBodyRot = AFRAME.utils.coordinates.parse(this.avatarNode.myBody.rotation);

    this.rotation = [myRot.x, rotation.y, myRot.z];

    // let myRot = this.avatarBodyModel.rotation;
    // this.avatarBodyModel.rotation = [myRot.x, -rotation.y, myRot.z];

    //this.avatarBody.rotation = [rotation.x, myRot.y, rotation.z];

    //this.avatarNameNode.rotation = [myRot.x, myRot.y, rotation.z]; 

    this.avatarNode.myHead.rotation = [rotation.x, myHeadRot.y, rotation.z];
    
    // this.avatarNode.myCursor.rotation = [rotation.x, myHeadRot.y, rotation.z];

    // this.avatarCamera.rotation = [rotation.x, myHeadRot.y, rotation.z];  
}

this.createSimpleAvatar = function(){
       if (this.avatarNode.myBody) {
        this.avatarNode.children.delete(this.avatarNode.myBody);
        var myColor = this.getRandomColor();
        if (this.avatarNode.myHead){
            myColor = this.avatarNode.myHead.visual.properties.color;
        }
        let myBodyDef = this.simpleBodyDef;
        myBodyDef.properties.color = myColor;

        this.avatarNode.children.create("myBody", myBodyDef);
        this.avatarNode.myHead.visual.properties.visible = true;

       }
}

this.createAvatarFromGLTF = function(modelSrc){

    if (this.avatarNode.myBody) {
        this.avatarNode.children.delete(this.avatarNode.myBody);
        
        let myBodyDef = this.modelBodyDef;
        myBodyDef.properties.src = modelSrc;

        this.avatarNode.children.create("myBody", myBodyDef);

        this.avatarNode.myHead.visual.properties.visible = false;
        this.avatarNode.myHead.myCursor.properties.visible = true;

       }

}

this.showHideCursor = function(bool){
    this.avatarNode.myHead.myCursor.properties.visible = bool;
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
    this.avatarNode.myHead.visual.color = "white";
    this.avatarNode.myHead.visual.src = '#temp';
    this.avatarNode.myHead.visual.src = '#'+val;
}

this.removeVideoTexture = function(){
   // this.setSmallVideoHead();
    this.avatarNode.myHead.visual.color = this.avatarNode.myBody.color;
    this.avatarNode.myHead.visual.src = "";
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
        "extends": "http://vwf.example.com/aframe/aentity.vwf",
        "properties": {
        },
        "children":{
            "streamsound":{
                "extends": "http://vwf.example.com/aframe/streamSoundComponent.vwf",
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


