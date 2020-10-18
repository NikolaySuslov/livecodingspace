this.modelDef = {
    "extends": "proxy/aframe/agltfmodel.vwf",
    "properties": {
        "src": "#xrcontroller",
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

this.createController = function (pos, modelSrc) {

    let self = this;

    let position = pos ? pos : [0, 0, 0]

    var newNode = {
        "extends": "proxy/aframe/aentity.vwf",
        "properties": {
            "position": position
        },
        children: {}
    }

    let interpolation =  {
        "extends": "proxy/aframe/interpolation-component.vwf",
        "type": "component",
        "properties": {
            "enabled": true
        }
    }

    let myRayCaster = {
                "extends": "proxy/aframe/raycasterComponent.vwf",
                "type": "component",
                "properties": {
                    recursive: false,
                    interval: 0,
                    far: 10,
                    objects: ".intersectable",
                    showLine: false
                }
            }
        
    
    this.children.create( "raycaster", myRayCaster );        
    this.children.create( "interpolation", interpolation );
    this.children.create("xrnode", newNode, function(child){
        if(child) {
            //find default costume
            self.setControllerNode(modelSrc);
        }

    });

}

this.moveVRController = function(){

    let controller = this.xrnode.controller;
    if(controller){
        controller.onMove();
    }

    // let point = this.raycaster.getIntersectionPoint();
    // console.log('POINT: ', point);

}

this.updateVRControl = function(position, rotation){

    this.rotation = rotation;
    this.position = position;

}


// this.createSimpleController = function(){
//        if (this.handVRNode.controller) {
//         this.handVRNode.children.delete(this.handVRNode.controller);

//         let controllerDef = this.simpleDef;

//         this.handVRNode.children.create("controller", controllerDef);

//        }
// }

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
    let controller = this.xrnode.controller;
    if(controller){
        controller.triggerdown();
    }
    //this.xrnode.controller.pointer.material.color = 'red'
 }

 this.triggerup = function() {
    let controller = this.xrnode.controller;
    if(controller){
        controller.triggerup();
    }
    //this.xrnode.controller.pointer.material.color = 'green'
 }

this.saveToScene = function(){

    let scene = this.getScene();
    let controller = this.xrnode.controller;
    if(controller){
        let defNode = this.checkDefaultXRCostume();

        if(defNode){
            scene.children.delete(defNode);
        } 

       let node = controller.nodeDef(); 
       node.properties.visible = false;
       node.properties.displayName = 'defaultXRCostume';
        scene.children.create('defaultXRCostume', node, function( child ) {
            console.log('Save default controller costume to scene: ', child);
           });

    }

}

 this.checkDefaultXRCostume = function(){
    let scene = this.getScene();
    let defaultNode = scene.getChildByName('defaultXRCostume');
    return defaultNode ? defaultNode : undefined
 }


this.setControllerNode = function(modelSrc){

    let scene = this.getScene();
    let defaultNode = this.checkDefaultXRCostume();
    let oldCostume = this.xrnode.controller;
    if(oldCostume){
        this.xrnode.children.delete(oldCostume);
    }

    if(defaultNode) {
        let def = _app.helpers.getNodeDef(defaultNode.id);
        def.properties.position = '0 0 0';
        def.properties.rotation = '0 0 0';
        def.properties.visible = true;
        def.properties.displayName = 'controller';
        this.xrnode.children.create('controller', def, function( child ) {
            console.log('Restore controller costume: ', child);
            if(child.cursorVisual){
                child.cursorVisual.createVisual();
            }
           });
    } else {

        let controllerDef = scene.getDefaultXRCostume();
        controllerDef.properties.displayName = 'controller';

        if (modelSrc) {
            let controllerDef = this.modelDef;
            controllerDef.properties.src = modelSrc;
        }

        this.xrnode.children.create('controller', controllerDef, function( child ) {
            console.log('New controller costume: ', child);
            child.cursorVisual.createVisual();
           });
    
    }

}

this.showHandSelection = function (point) { 

    let end = this.xrnode.controller.cursorVisual.worldToLocal(point);
    //this.xrnode.controller.line.end = end;
    this.xrnode.controller.cursorVisual.end = end;

}

this.resetHandSelection = function () { 
    //this.xrnode.controller.line.end = "0 0 -3";
    this.xrnode.controller.cursorVisual.end = "0 0 -0.2";
}