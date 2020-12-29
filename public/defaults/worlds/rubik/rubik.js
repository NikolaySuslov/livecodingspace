this.initialize = function () {
    //console.log(vwf_view.doc.cube.calc());

    // if(Object.getPrototypeOf(this).id.includes('ascene.vwf')){
    //     debugger;
    //     console.log("Initialize of Scene...", this.id);
    //     let rubikID = "rubik-" + this.randomHash();
    //     this.createRubik(rubikID);
    // } else {
    //     console.log("Initialize proto Scene..", this.id);
    // }
}

this.createRubik = function (id, robot) {

    this.currentCube = id;

    let cubeContainer = {
        "extends": "proxy/aframe/aentity.vwf",
        "properties": {
            "displayName": 'container-' + id,
            "target": id,
            "position": [0,2.7,-7.5]
        },
        "methods":{
            "setupGUI":{
            "body": `
            this.gui.noRobotButton.init();
            this.gui.editCubeButton.init();
            this.gui.currentCubeButton.init();
            `,
          "type": "application/javascript"
            }
        },
        "children": {
            "gui": {
                "extends": "proxy/aframe/aentity.vwf",
                "properties": {
                    "position": [3,0,0]

                },
                "children": {
                    "noRobotButton":{
                           "extends": "proxy/objects/gui/button.vwf",
                            "properties": {
                                "target": id,
                                "displayName": "noRobotButton",
                                "position": [-6, -1, 1],
                                "clickColor": "blue",
                                "baseColor": "red",
                                "height": 0.5,
                                "width": 0.6
                            }
                    },
                    "editCubeButton":{
                        "extends": "proxy/objects/gui/button.vwf",
                         "properties": {
                             "target": id,
                             "displayName": "editCubeButton",
                             "position": [-6, 0, 1],
                             "clickColor": "blue",
                             "baseColor": "green",
                             "height": 0.5,
                             "width": 0.6
                         }
                 },
                 "currentCubeButton":{
                    "extends": "proxy/objects/gui/button.vwf",
                     "properties": {
                         "target": id,
                         "displayName": "currentCubeButton",
                         "position": [-6, 1, 1],
                         "clickColor": "blue",
                         "baseColor": "white",
                         "height": 0.8,
                         "width": 0.8
                     }
             }
                    // "material": {
                    //     "extends": "proxy/aframe/aMaterialComponent.vwf",
                    //     "type": "component",
                    //     "properties": {
                    //         "color": "white",
                    //         "transparent": true,
                    //         "opacity": 0.5
                    //     }
                    // }
                }
            }
        }
    }

    

    let cube = {
        "extends": "cubeModel.vwf",
        "properties": {
            "cubeID": id,
            "displayName": id,
            "rotation": [35, -35, 0],
            "twistQueue": [],
            "twistQueueHistory": []
        },
        "children": {
            "cubelets": {
                "extends": "proxy/aframe/aentity.vwf"
            },
            "gui": {
                "extends": "proxy/aframe/aentity.vwf"
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

    this.children.create('container-' + id, cubeContainer,function (box){


        box.children.create(id, cube, function (child) {   
        child.initializeCubelets();
        child.addGUI();

        if(robot){
            child.robotID = 'robot-' + id;
        }

        box.setupGUI();

    });

    // let frame3D = {
    //     "extends": "proxy/objects/gui/frame3D.vwf",
    //     "properties": {
    //         "contentsID": id,
    //         "position": [0, -2.5, 3]
    //     }
    // }
    //    box.children.create(id + '-frame3D', frame3D)


} )

if (robot) {

    let nodeName = 'robot-' + id;
    let cube = {
        "extends": "robot.vwf",
        "properties": {
            "cubeID": id,
            "position": [0,0.5,-3],
            "visible": false
        }
    }

    this.children.create(nodeName, cube, function (child) {
        child.initRobot();
    });
}
}

this.doOnRubik = function(command){
    let rubik = this.findNode(this.currentCube);
    rubik.do(command);
}