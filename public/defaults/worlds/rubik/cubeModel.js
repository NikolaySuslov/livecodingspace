this.initialize = function(){
    
    if(Object.getPrototypeOf(this).id == 'cubeModel.vwf'){
       
        console.log("Initialize of child..", this.id);
        this.getCubelets();
        this.twistLoop();
        // this.cubeModel = new Cube(this.id);
        // this.cubeModel.nodeID = this.id;
    } else {
        console.log("Initialize proto..", this.id);
    }
}

this.cubeID_set = function(value){
    this.cubeID = value;
    //this.initializeCubelets();
}

this.cubeID_get = function(){
    // if(!this.cubeModel){
    //     this.cubeModel = new Cube(value);
    //     this.cubeModel.nodeID = this.id;
    // }
    return this.cubeID
}

this.initializeCubelets = function(){

    let that = this;
    let cubeModelID = this.getCubeModelID();
    let cubelets = this.getCubelets();
    cubelets.forEach(el=>{
       
        let distance = 1.1;
        let position = [el.addressX*distance, el.addressY*distance, el.addressZ*distance];
        let cubeletID = el.id;

        let cubelet = {
            "extends": "cubeletModel.vwf",
            "properties":{
                "cubeletID": cubeletID,
                "cubeID": cubeModelID,
                "cubeNodeID": this.id,
                "size": 1
            },
            "children":{
                "wrapper":{
                    "extends": "proxy/aframe/aentity.vwf",
                    "properties":{
                    "position": position
                    }
                },
                "interpolation":
                {
                    "extends": "proxy/aframe/interpolation-component.vwf",
                    "type": "component",
                    "properties": {
                        "enabled": true
                    }
                }
      }
            }
        
    
        this.cubelets.children.create(cubeletID, cubelet, function(child){
            that.setCubeletID(cubeletID, child.id);
            child.initCubeletFaces();
        })
    })

    
}

this.addGUI = function(){
    let half = 2;

    let faces = {
        "front":{
            "rotation": [0,0,0],
            "position": [0,0,half]
        },
        "up":{
            "rotation": [-90,0,0],
            "position": [0,half,0]
        },
        "right":{
            "rotation": [0,90,0],
            "position": [half,0,0]
        },
        "down":{
            "rotation": [90,0,0],
            "position": [0,-half,0]
        },
        "left":{
            "rotation": [0,-90,0],
            "position": [-half,0,0]
        },
        "back":{
            "rotation": [0,180,0],
            "position": [0,0,-half]
        }
    }



    let guiSize = 1.2;
    let split = 0.2;
    let height  = 0.6

    Object.keys(faces).forEach(key=>{
        let data = faces[key];

        let buttosnGUI = {}
        let buttons = [
            {   
                "command": key.toUpperCase(),
                "position":[split, 0, 0]
            },
            {   
                "command": key,
                "position":[-split, 0, 0]
            }
        ]

        buttons.forEach((b,i) => {

        let rotateButton = {
            "extends": "proxy/aframe/aplane.vwf",
            "properties": {
                "displayName": b["command"] + '-button-' + i,
                //"radius": 0.15,
                "height": height,
                "width": 0.4,
                "position": b["position"],
                "class": "clickable intersectable"
            },
            "methods": {
                "intersectEventMethod": {
                  "body": `
                    console.log('I was intersected at point: ', point);//
                    this.material.opacity = 0.6;
                    this.material.color = 'green'
                    `,
                    "parameters": [
                        "point"
                      ],
                  "type": "application/javascript"
                },
                "clearIntersectEventMethod": {
                    "body": `
                    console.log('Clear intersection');
                    this.material.opacity = 0.3;
                    this.material.color = 'white'
                    `,
                  "type": "application/javascript"
                },
                "mousedownAction":{
                    "body": `
                        this.triggerdownAction();
                        `,
                      "type": "application/javascript"
                    },
                    "mouseupAction":{
                        "body": `
                        this.triggerupAction();
                            `,
                          "type": "application/javascript"
                        },
                "triggerdownAction":{
                "body": `
                    this.material.color = 'blue';
                    let command = this.displayName.charAt(0);
                    this.parent.parent.parent.parent.do(command);
                    `,
                  "type": "application/javascript"
                },
                "triggerupAction":{
                    "body": `
                        this.material.color = 'green';
                        `,
                      "type": "application/javascript"
                    }
            },
            "children":{
                "cursor-listener": {
                    "extends": "proxy/aframe/app-cursor-listener-component.vwf",
                    "type": "component"
                },
                "raycaster-listener": {
                    "extends": "proxy/aframe/app-raycaster-listener-component.vwf",
                    "type": "component"
                  },
                "material": {
                    "extends": "proxy/aframe/aMaterialComponent.vwf",
                    "type": "component",
                    "properties": {
                        "transprent": true,
                        "opacity": 0.3,
                        "color": "white"
                    }
                }
            }
        }

            buttosnGUI[i] = rotateButton
        })

        let face = //getFace(faces[key]);
        {
            "extends": "proxy/aframe/aentity.vwf",
            "properties": {
                "displayName": key,
                "rotation": data.rotation,
                "position": data.position,
                "width": 1,
                "height": 1
            },
            "children":{
                "rotateButtons":{
                    "extends": "proxy/aframe/aentity.vwf",
                    "children": buttosnGUI
                },
                "label":{
                    "extends": "proxy/aframe/atext.vwf",
                    "properties": {
                        "displayName": key,
                        "color": "black",
                        "value": key,
                        "side": "double",
                        "opacity": 0.6,
                        "position": [-0.3,0,0.01]
                    }
                }
                // "material": {
                //     "extends": "proxy/aframe/aMaterialComponent.vwf",
                //     "type": "component",
                //     "properties": {
                //         "side": "double",
                //         "transprent": true,
                //         "opacity": 0.6,
                //         "color": "white"
                //     }
                // }
            }
        }

        //let color = cubeletModel[key].color.hex;
        //face.children.material.properties.color = color;
        this.gui.children.create(key, face)
    })

}


this.addTwistKey = function(key){
    this.twistQueue.push(key);
    this.cubeModel.twistQueue.add( key )
}
//cube.twist( cube.twistQueue.do() )


this.rotateFront = function(){
    debugger;
    this.twistQueue.push('f');
    this.cubeModel.twistQueue.add('f');
    this.cubeModel.twist( this.cubeModel.twistQueue.do() );
}

this.do = function(key){

    this.twistQueue = this.twistQueue.concat([key]);
    this.twistQueueHistory = this.twistQueueHistory.concat([key]);
    this.twistAction(key);
    // this.cubeModel.twistQueue.add(key);
    // this.cubeModel.twist( this.cubeModel.twistQueue.do() );
}

this.twistLoop = function(){
    this.future(1).twistLoop();
    let isCubeTweening = this.isCubeTweening();
    //console.log(this.isCubeTweening());

    if(!isCubeTweening){
        this.progressQueue();
    }
}

this.getRobot = function(){

    return this.getScene()[this.robotID]

}

this.doButtonTriggerdownAction = function(buttonID){

    let button = this.getScene().findNodeByID(buttonID);
    let buttonName = button.displayName;

    if(buttonName == "noRobotButton"){
        console.log("SWITCH NO ROBOT!");
        this.withRobot = this.withRobot ? false : true;

       
        if(this.withRobot){
            button.baseColor = 'yellow';
        } else {
            button.baseColor = 'red';
        }
    }

    if(buttonName == "editCubeButton"){

        console.log("EDIT CUBE!");
        this.editCube = this.editCube ? false : true;

        this.editRubik();
    }

    if(buttonName == "currentCubeButton"){

        console.log("MAKE CURRENT CUBE!");
        this.getScene().currentCube = this.displayName;

    }

}


this.editRubik = function(){

    if(!this.gizmo && this.editCube){

        let gizmoNode =
    {
        "extends": "proxy/aframe/gizmoComponent.vwf",
        "type": "component",
        "properties":
        {
            "mode": "rotate"
        }
    }
    this.children.create("gizmo", gizmoNode);
} 

    if(this.gizmo && !this.editCube){
        this.children.delete(this.gizmo)
    }


}
