this.simpleDef = {
    "extends": "proxy/aframe/abox.vwf",
    children: {
        "material": {
            "extends": "proxy/aframe/aMaterialComponent.vwf",
            "type": "component",
            "properties":{
                "color": "white"
            }
        }
    },
    "properties": {
        "position": "0 0 0",
        "height": 0.01,
        "width": 0.01,
        "depth": 1
    },
    children: {
        "pointer": {
            "extends": "proxy/aframe/abox.vwf",
            "properties": {
                "position": "0 0 -0.7",
                "height": 0.1,
                "width": 0.1,
                "depth": 0.1
            },
            children: {
                "material": {
                    "extends": "proxy/aframe/aMaterialComponent.vwf",
                    "type": "component",
                    "properties":{
                        "color": "green"
                    }
                },
                "aabb-collider": {
                    "extends": "proxy/aframe/aabb-collider-component.vwf",
                    "type": "component",
                    "properties": {
                        debug: false,
                        interval: 10,
                        objects: ".gearvrhit"
                    }
                },
                // "myRayCaster": {
                //     "extends": "proxy/aframe/aentity.vwf",
                //     "properties": {},
                //     "children": {
                //         "raycaster": {
                //             "extends": "proxy/aframe/raycasterComponent.vwf",
                //             "type": "component",
                //             "properties": {
                //                 recursive: false,
                //                 interval: 10,
                //                 far: 0.5,
                //                 objects: ".gearvrcontroller"
                //             }
                //         }
                //     }
                // }
                // "rotationText": {
                //     "extends": "proxy/aframe/atext.vwf",
                //     "properties":{
                //         "value": "rot",
                //             "side": "double",
                //     }
                // }
            }
        }
       
    }
}

this.modelDef = {
    "extends": "proxy/aframe/agltfmodel.vwf",
    "properties": {
        "src": "#gearvr",
        "position": "0 0 0",
        "rotation": "0 180 0"
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

this.createController = function (modelSrc) {

    let controllerDef = this.simpleDef;

    var newNode = {
        "extends": "proxy/aframe/aentity.vwf",
        "properties": {
            "position": [0, 0, -0.4]
        },
        children: {
            "controller": controllerDef
        }
    }

    if (modelSrc) {

        let controllerDef = this.modelDef;
        controllerDef.properties.src = modelSrc;
        newNode.children.controller = controllerDef;
    }


    let interpolation =  {
        "extends": "proxy/aframe/interpolation-component.vwf",
        "type": "component",
        "properties": {
            "enabled": true
   }
    }


    this.children.create( "interpolation", interpolation );
    this.children.create("handVRNode", newNode);

}


this.updateVRControl = function(position, rotation){

    
    this.position = position.clone();//goog.vec.Vec3.createFromValues(position.x, position.y, position.z);
    this.rotation = rotation.clone(); goog.vec.Vec3.createFromValues(rotation.x, rotation.y, rotation.z);

    // this.position = position;
    // this.rotation = rotation;
   // this.handVRNode.controller.pointer.rotationText.value = rotation.x.toString() + rotation.y.toString() + rotation.z.toString();

}


this.createSimpleController = function(){
       if (this.handVRNode.controller) {
        this.handVRNode.children.delete(this.handVRNode.controller);

        let controllerDef = this.simpleDef;

        this.handVRNode.children.create("controller", controllerDef);

       }
}

this.createAvatarFromGLTF = function(modelSrc){

    if (this.handVRNode.controller) {
        this.handVRNode.children.delete(this.handVRNode.controller);
        
        let controllerDef = this.modelDef;
        controllerDef.properties.src = modelSrc;

        this.handVRNode.children.create("controller", controllerDef);

       }
}

this.initialize = function() {
   // this.future(0).update();
}

this.triggerdown = function() {
    this.handVRNode.controller.pointer.material.color = 'red'
 }

 this.triggerup = function() {
    this.handVRNode.controller.pointer.material.color = 'green'
 }
