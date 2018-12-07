this.simpleDef = {
    "extends": "http://vwf.example.com/aframe/abox.vwf",
    children: {
        "material": {
            "extends": "http://vwf.example.com/aframe/aMaterialComponent.vwf",
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
            "extends": "http://vwf.example.com/aframe/abox.vwf",
            "properties": {
                "position": "0 0 -0.8",
                "height": 0.1,
                "width": 0.1,
                "depth": 0.1
            },
            children: {
                "material": {
                    "extends": "http://vwf.example.com/aframe/aMaterialComponent.vwf",
                    "type": "component",
                    "properties":{
                        "color": "green"
                    }
                }
                // "rotationText": {
                //     "extends": "http://vwf.example.com/aframe/atext.vwf",
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
    "extends": "http://vwf.example.com/aframe/agltfmodel.vwf",
    "properties": {
        "src": "#gearvr",
        "position": "0 0 0",
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

this.createController = function (modelSrc) {

    let controllerDef = this.simpleDef;

    var newNode = {
        "extends": "http://vwf.example.com/aframe/aentity.vwf",
        "properties": {
            "position": [0, 0, 0]
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
        "extends": "http://vwf.example.com/aframe/interpolation-component.vwf",
        "type": "component",
        "properties": {
            "enabled": true
   }
    }


    this.children.create( "interpolation", interpolation );
    this.children.create("handVRNode", newNode);

}


this.updateVRControl = function(position, rotation){

    
    this.position = goog.vec.Vec3.createFromValues(position.x, position.y, position.z);
    this.rotation = goog.vec.Vec3.createFromValues(rotation.x, rotation.y, rotation.z);

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
