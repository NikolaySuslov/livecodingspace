this.modelDef = {
    "extends": "http://vwf.example.com/aframe/agltfmodel.vwf",
    "properties": {
        "src": "#xrcontroller",
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

    let self = this;

    var newNode = {
        "extends": "http://vwf.example.com/aframe/aentity.vwf",
        "properties": {
            "position": [0, 0, -0.4]
        },
        children: {}
    }

    let interpolation =  {
        "extends": "http://vwf.example.com/aframe/interpolation-component.vwf",
        "type": "component",
        "properties": {
            "enabled": true
        }
    }


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
            console.log('Restore controller costume: ', child)
           });
    } else {

        let controllerDef = scene.getDefaultXRCostume();
        controllerDef.properties.displayName = 'controller';

        if (modelSrc) {
            let controllerDef = this.modelDef;
            controllerDef.properties.src = modelSrc;
        }

        this.xrnode.children.create('controller', controllerDef, function( child ) {
            console.log('New controller costume: ', child)
           });
    
    }

}