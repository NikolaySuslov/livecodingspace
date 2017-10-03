this.simpleBodyDef = {
    "extends": "http://vwf.example.com/aframe/abox.vwf",
    "properties": {
        "color": "white",
        "position": "0 0.66 0.5",
        "height": 1.3,
        "width": 0.65,
        "depth": 0.1,
    }
}

this.modelBodyDef = {
    "extends": "http://vwf.example.com/aframe/agltfmodel.vwf",
    "properties": {
        "src": "#avatar",
        "position": "0 0 0.5",
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


    let userHeight = avatarControl.getAttribute('camera').userHeight;

    let myColor = this.getRandomColor();
    let myBodyDef = this.simpleBodyDef;
    myBodyDef.properties.color = myColor;

    var newNode = {
        "extends": "http://vwf.example.com/aframe/aentity.vwf",
        "properties": {
            position: [0, -userHeight, 0]
        },
        children: {
           
            "myBody": myBodyDef,
            "myHead": {
                "extends": "http://vwf.example.com/aframe/aentity.vwf",
                "properties": {
                    "position": "0 1.6 0.5",
                    "visible": true
                },
                children: {
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
                    "interpolation":
                    {
                        "extends": "http://vwf.example.com/aframe/interpolation-component.vwf",
                        "type": "component",
                        "properties": {
                            "enabled": true,
                            "duration": 50,
                            "deltaPos": 0,
                            "deltaRot": 0
                        }
                    },
                    "myCamera":
                    {
                        "id": 'camera-' + this.id,
                        "extends": "http://vwf.example.com/aframe/acamera.vwf",
                        "properties": {
                            "position": "0 0 -0.5",
                            "look-controls-enabled": false,
                            "wasd-controls": false,
                            "userHeight": 0,
                        }
                    },
                    "myCursor":
                    {
                        "id": 'myCursor-' + this.id,
                        "extends": "http://vwf.example.com/aframe/aentity.vwf",
                        "properties": {},
                        "children": {
                            "line": {
                                "extends": "http://vwf.example.com/aframe/lineComponent.vwf",
                                "type": "component",
                                "properties": {
                                    "start": "0 0 -1",
                                    "end": "0 0 -3",
                                    "color": myColor
                                }
                            }
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
            "enabled": true,
            "duration": 50,
            "deltaPos": 0,
            "deltaRot": 0
        }
    }


    this.children.create( "interpolation", interpolation );
    //this.children.create( "myCursor", myCursor );
    //this.children.create( "avatarCamera", camera );
    // this.children.create( "avatarNameNode", avatarNameNode );

    this.children.create("avatarNode", newNode);



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