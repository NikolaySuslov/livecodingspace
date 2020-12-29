this.initialize = function () {

    if (Object.getPrototypeOf(this).id.includes('frame3D.vwf')) {
        this.createVisual();
    } else {
        console.log("Initialize proto..", this.id);
    }
}

this.createVisual = function () {

    let parent = this.parent;

    let visNode = {
        "extends": "proxy/aframe/aentity.vwf",
        "properties": {},
        "children": {
            "rotatePlane": {
                "extends": "proxy/aframe/aplane.vwf",
                "properties": {
                    "count": 0,
                    "height": 0.4,
                    "width": 3,
                    "class": "clickable intersectable"
                },
                "children": {
                    "material": {
                        "extends": "proxy/aframe/aMaterialComponent.vwf",
                        "type": "component",
                        "properties": {
                            "color": "white",
                            "side": "double"
                            //"transparent": true,
                            //"opacity": 0.6
                        }
                    },
                    "cursor-listener": {
                        "extends": "proxy/aframe/app-cursor-listener-component.vwf",
                        "type": "component"
                    },
                    "raycaster-listener": {
                        "extends": "proxy/aframe/app-raycaster-listener-component.vwf",
                        "type": "component"
                    }

                },
                "methods":{
                    "moveAction":{
                        "parameters":["point"],
                        "type": "application/javascript",
                        "body": `
                            let contentsID = this.parent.parent.contentsID;
                            console.log('Start: ', this.dragStart, ' x: ', point.x);
                            if(contentsID){
                                let scene = this.getScene();
                                let contents = scene.findNode(contentsID);
                                let rotation = contents.rotation.clone();

                                let offset = this.dragStart ? (point.x - this.dragStart.x)*10 : 0

                                contents.rotation = [rotation.x, rotation.y+offset, rotation.z]
                                
                                //contents.rotateBy([0,point.x, 0]);
                                
                            }
                            
                        `
                    },
                    "triggerdownAction":{
                        "body": `
                            this.material.color = 'blue';
                            this.dragStart = point;
                            `,
                        parameters:["point"],
                          "type": "application/javascript"
                        },
                        "triggerupAction":{
                            "body": `
                                this.material.color = 'grey';
                                this.dragStart = {x:0, y:0, z:0};
                                `,
                                parameters:["point"],
                              "type": "application/javascript"
                            }
                }
            }
        }
    }

    this.children.create("visualNode", visNode);


}




// this.intersectEventMethod = function () {

// }

// this.clearIntersectEventMethod = function () {

// }
