this.initialize = function () {
    this.future(3).clientWatch();
    //this.createDefaultXRCostume();
};

this.clientWatch = function () {
    var self = this;

    if (this.children.length !== 0) {

        var clients = this.find("doc('proxy/clients.vwf')")[0];

        if (clients !== undefined) {
            //console.log(clients.children);

            let clientsArray = [];

            clients.children.forEach(function (element) {
                clientsArray.push(element.name);

            });

            this.children.forEach(function (node) {
                if (node.id.indexOf('avatar-') != -1) {

                    if (clientsArray.includes(node.id.slice(7))) {
                        //console.log(node.id + 'is here!');
                    } else {
                        //console.log(node.id + " needed to delete!");
                        let idToDelete = node.id.slice(7);
                        let nodes = self.children.filter(el=>
                            (el.id.includes(idToDelete) && 
                            (   el.id.includes('avatar') ||
                                el.id.includes('xrcontroller') ||
                                el.id.includes('gearvr')))
                            );

                        nodes.forEach(el => {
                            self.children.delete(self.children[el.id])
                        })
                        // self.children.delete(self.children[node.id]);
                        // //'gearvr-'
                        // let controllerVR = self.children['gearvr-' + node.id.slice(7)];
                        // if (controllerVR) {
                        //     self.children.delete(controllerVR);
                        // }

                        // let wmrvR = self.children['wmrvr-right-' + node.id.slice(7)];
                        // if (wmrvR) {
                        //     self.children.delete(wmrvR);
                        // }

                        // let wmrvL = self.children['wmrvr-left-' + node.id.slice(7)];
                        // if (wmrvL) {
                        //     self.children.delete(wmrvL);
                        // }

                    }
                }
            });
        }
    }
    this.future(5).clientWatch();
};

this.sphereProto = function () {

    let node = {
        "extends": "proxy/aframe/asphere.vwf",
        "properties": {
            "displayName": "sphere",
            "radius": 1,
            "class": "intersectable"
        },
        children: {
            "material": {
                "extends": "proxy/aframe/aMaterialComponent.vwf",
                "type": "component",
                "properties":{
                    "color": "white"
                }
            },
            "interpolation":
                {
                    "extends": "proxy/aframe/interpolation-component.vwf",
                    "type": "component",
                    "properties": {
                        "enabled": true
                    }
                },
            "cursor-listener": {
                "extends": "proxy/aframe/app-cursor-listener-component.vwf",
                "type": "component"
            }
        },
        events: {
            "clickEvent": {
                "body": ""
            }
        }
    }

    return node
}

this.cylinderProto = function () {

    let node = {
        "extends": "proxy/aframe/acylinder.vwf",
        "properties": {
            "displayName": "cylinder",
            "radius": 1,
            "height": 1,
            "class": "clickable"
        },
        children: {
            "material": {
                "extends": "proxy/aframe/aMaterialComponent.vwf",
                "type": "component",
                "properties":{
                    "color": "white"
                }
            },
            "interpolation":
                {
                    "extends": "proxy/aframe/interpolation-component.vwf",
                    "type": "component",
                    "properties": {
                        "enabled": true
                    }
                },
            "cursor-listener": {
                "extends": "proxy/aframe/app-cursor-listener-component.vwf",
                "type": "component"
            }
        },
        events: {
            "clickEvent": {
                "body": ""
            }
        }
    }

    return node
}

this.coneProto = function () {

    let node = {
        "extends": "proxy/aframe/acone.vwf",
        "properties": {
            "displayName": "cone",
            "radius-bottom": 1,
            "radius-top": 0.01,
            "height": 1,
            "class": "clickable"
        },
        children: {
            "material": {
                "extends": "proxy/aframe/aMaterialComponent.vwf",
                "type": "component",
                "properties":{
                    "color": "white"
                }
            },
            "interpolation":
                {
                    "extends": "proxy/aframe/interpolation-component.vwf",
                    "type": "component",
                    "properties": {
                        "enabled": true
                    }
                },
            "cursor-listener": {
                "extends": "proxy/aframe/app-cursor-listener-component.vwf",
                "type": "component"
            }
        },
        events: {
            "clickEvent": {
                "body": ""
            }
        }
    }

    return node
}

this.textProto = function (textValue) {

    let value = textValue ? textValue: "Text";

    let node = {
        "extends": "proxy/aframe/atext.vwf",
        "properties": {
            "displayName": "text",
            "color": "white",
            "value": value,
            "side": "double",
            "class": "clickable",
            //"font": "/vwf/model/aframe/fonts/custom-msdf.json",
            "negate": false
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
            "cursor-listener": {
                "extends": "proxy/aframe/app-cursor-listener-component.vwf",
                "type": "component"
            }
        },
        events: {
            "clickEvent": {
                "body": ""
            }
        }
    }

    return node
}

this.cubeProto = function () {

    let node = {
        "extends": "proxy/aframe/abox.vwf",
        "properties": {
            "displayName": "cube",
            "height": 1,
            "width": 1,
            "depth": 1,
            "class": "clickable"
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
            "cursor-listener": {
                "extends": "proxy/aframe/app-cursor-listener-component.vwf",
                "type": "component"
            },
            "material": {
                "extends": "proxy/aframe/aMaterialComponent.vwf",
                "type": "component",
                "properties":{
                    "color": "white"
                }
            }
        },
        events: {
            "clickEvent": {
                "body": ""
            }
        }
    }

    return node
}

this.lightProto = function (lightType) {

    var newLightType = lightType

    if (!newLightType){
        newLightType = "directional"
    }

    let node = {
        "extends": "proxy/aframe/alight.vwf",
        "properties": {
            "displayName": newLightType,
            "type": newLightType,
            "class": "clickable"
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
            "cursor-listener": {
                "extends": "proxy/aframe/app-cursor-listener-component.vwf",
                "type": "component"
            }
        },
        events: {
            "clickEvent": {
                "body": ""
            }
        }
    }

    return node
}

this.mirrorProto = function () {

    let newNode = this.cubeProto();
    newNode.properties.width = 3;
    newNode.properties.height = 4;
    newNode.properties.depth= 0.1;
    newNode.children.material.properties.color = "white";

    newNode.children.mirrorComponent = {
        "extends": "proxy/aframe/a-mirror-component.vwf",
        "type": "component",
        "properties": {
            "camera": "avatarControl"
        }
    }

    return newNode
}

this.cameraProto = function () {

    let newNode = this.cubeProto();
    newNode.properties.width = 0.3;
    newNode.properties.height = 0.3;
    newNode.properties.depth= 0.5;
    newNode.children.material.properties.opacity = 0.5;
    newNode.children.material.properties.color = "red";

    newNode.children.camera = {
        "extends": "proxy/aframe/acamera.vwf",
        "properties": {
            "look-controls-enabled": false,
            "wasd-controls-enabled": false,
            "user-height": 0
        }
    }

    return newNode
}

this.cameraProtoWithOffset = function () {

    let newNode = this.cubeProto();
    newNode.properties.width = 0.3;
    newNode.properties.height = 0.3;
    newNode.properties.depth= 0.5;
    newNode.children.material.properties.opacity = 0.5;
    newNode.children.material.properties.color = "red";

    newNode.children.camera = {
        "extends": "proxy/aframe/acamera.vwf",
        "properties": {
            "look-controls-enabled": false,
            "wasd-controls-enabled": false,
            "user-height": 0
        },
        children: {
            viewoffset: {
                extends: "proxy/aframe/viewOffsetCamera-component.vwf",
                properties: {
                }
            }
           
        }
}

    return newNode
}

this.planeProto = function () {

    let node = {
        "extends": "proxy/aframe/aplane.vwf",
        "properties": {
            "displayName": "plane",
            "height": 1,
            "width": 1,
            "class": "clickable"
        },
        children: {
            "material": {
                "extends": "proxy/aframe/aMaterialComponent.vwf",
                "type": "component",
                "properties": {
                    "side": "double",
                    "color": "white"
                }
            },
            "interpolation":
                {
                    "extends": "proxy/aframe/interpolation-component.vwf",
                    "type": "component",
                    "properties": {
                        "enabled": true
                    }
                },
            "cursor-listener": {
                "extends": "proxy/aframe/app-cursor-listener-component.vwf",
                "type": "component"
            }
        },
        events: {
            "clickEvent": {
                "body": ""
            }
        }
    }

    return node
}


this.createModelObj = function (mtlSrc, objSrc, name, avatar) {

    var self = this;


    var position = "0 0 0";

    var nodeName = this.GUID();

    if (avatar) {

        let myAvatar = this.children[avatar];
        let cursorNode = myAvatar.avatarNode.myHead.myCursor.vis;

        if (cursorNode) {
            position = cursorNode.worldPosition();
            //console.log(position);
        }

    }

    let modelNode = {
        "extends": "proxy/aframe/aobjmodel.vwf",
        "properties": {
            "src": '#' + objSrc,
            "mtl": '#' + mtlSrc,
            "position": position
        },
        children:{
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

    if (name) {
        modelNode.properties.displayName = name;
    }

    self.children.create(nodeName, modelNode, function( child ) {
        if (avatar) child.lookAt(self.children[avatar].worldPosition())
       });

}


this.createLegoBoost = function (boostID, parentName) {
    var self = this;
    let nodeName = 'legoboost-' + this.smallRandomId();

    let legoBoostNode = {
        "extends": "proxy/objects/legoboost.vwf",
        "properties": {
            "boostID": boostID,
            "position": "0 1 0",
            "displayName": boostID,
            "tracking": false
        }
    }

    let rootNode = parentName ? this.getChildByName(parentName) : this;
    rootNode.children.create(nodeName, legoBoostNode, function( child ) {

        child.createVisual();
        child.trackLego();

    })


}

this.createModel = function (modelType, modelSrc, avatar) {

    var self = this;

    let tagName = modelType + '-ASSET-'+ this.GUID();
    let tagNode = {
        "extends": "proxy/aframe/a-asset-item.vwf",
        "properties": {
            "itemID": tagName,
            "itemSrc": modelSrc
        }
    }

    this.children.create(tagName, tagNode, function( child ) {

        let nodeName = modelType + '-MODEL-'+self.GUID();
        var position = "0 0 0";
        if (avatar) {
            
            let myAvatar = self.children[avatar];
            let cursorNode = myAvatar.avatarNode.myHead.myCursor.vis;
        
            if (cursorNode) {
                 position = cursorNode.worldPosition();
                //console.log(position);
            }
    
        }
       
        const protos = {
            DAE: "proxy/aframe/acolladamodel.vwf",
            OBJ: "proxy/aframe/aobjmodel.vwf",
            GLTF: "proxy/aframe/agltfmodel.vwf"
        }


        let extendsName = Object.entries(protos).filter(el => el[0] == modelType)[0];
 
        let modelNode = {
            "extends": extendsName[1],
            "properties": {
                "src": '#' + child.itemID,
                "position": position
            },
            children:{
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

        self.children.create(nodeName, modelNode, function( child ) {
            if (avatar) child.lookAt(self.children[avatar].worldPosition())
           });

       });
}


this.createAssetResource = function(resType, resSrc){

    var self = this;

    const protos = {
        IMG: "proxy/aframe/a-asset-image-item.vwf",
        AUDIO: "proxy/aframe/a-asset-audio-item.vwf",
        VIDEO:  "proxy/aframe/a-asset-video-item.vwf",
        ITEM:  "proxy/aframe/a-asset-item.vwf" 
    };

    let extendsName = Object.entries(protos).filter(el => el[0] == resType)[0];

    let tagName = resType + '-ASSET-'+ this.GUID();
    let tagNode = {
        "extends": extendsName[1],
        "properties": {
            "itemID": tagName,
            "itemSrc": resSrc
        }
    }

    this.children.create(tagName, tagNode);

}

this.createDrawNode = function(node, name, color, width, pos) {
    let newNode = {
        extends: "proxy/aframe/aentity.vwf",
        properties: {
            position: pos
        },
        children: {
            linepath: {
                extends: "proxy/aframe/linepath.vwf",
                properties: {
                    color: color,
                    path: [],
                    width: width
                }
            }
        }
    }

    node.children.create(name, newNode);
} 

this.createPrimitive = function (type, params, name, node, avatar) {

    var position = "0 0 0";

    var displayName = name;

    let nodeName = this.GUID();
    // if (!nodeName) {
    //     nodeName = this.GUID();
    // }

    if (avatar) {

        let myAvatar = this.children[avatar];
        let cursorNode = myAvatar.avatarNode.myHead.myCursor.vis;

        if (cursorNode) {
            position = cursorNode.worldPosition();
            //console.log(position);
        }

    }

    var newNode = {};

    switch (type) {

        case "cube":
            newNode = this.cubeProto();
            break;

        case "sphere":
            newNode = this.sphereProto();
            break;

        case "plane":
            newNode = this.planeProto();
            break;

        case "light":
            newNode = this.lightProto(params);
            break;
            
        case "text":
            newNode = this.textProto(params);
            break;

        case "cylinder":
            newNode = this.cylinderProto();
            break;
        
        case "cone":
            newNode = this.coneProto();
            break;

        default:
            newNode = undefined;
            break;
    }

    var self = this;

    if (newNode) {
        newNode.properties.position = position;
        if (displayName) {
            newNode.properties.displayName = displayName;
        }
        this.children.create(nodeName, newNode, function( child ) {
            if (avatar) child.lookAt(self.children[avatar].worldPosition());
            
            if (type == "text"){
                child.properties.font = "/drivers/model/aframe/fonts/custom-msdf.json"
            }
          });
    }

}

this.createMirror = function (name, node, avatar) {

    var position = "0 0 0";

    var nodeName = name;
    if (!nodeName) {
        nodeName = this.GUID();
    }

    if (avatar) {

        let myAvatar = this.children[avatar];
        let cursorNode = myAvatar.avatarNode.myHead.myCursor.vis;

        if (cursorNode) {
            position = cursorNode.worldPosition();
            //console.log(position);
        }

    }

    var newNode = this.mirrorProto();
    newNode.properties.displayName = "mirror";

    var self = this;

    if (newNode) {
        newNode.properties.position = position;
        this.children.create(nodeName, newNode, function( child ) {
            if (avatar) child.lookAt(self.children[avatar].worldPosition());
          });
    }

}

this.createCamera = function (name, node, avatar) {

    var position = "0 0 0";

    var nodeName = name;
    if (!nodeName) {
        nodeName = this.GUID();
    }

    if (avatar) {

        let myAvatar = this.children[avatar];
        let cursorNode = myAvatar.avatarNode.myHead.myCursor.vis;

        if (cursorNode) {
            position = cursorNode.worldPosition();
            //console.log(position);
        }

    }

    var newNode = this.cameraProto();
    newNode.properties.displayName = "camera";

    var self = this;

    if (newNode) {
        newNode.properties.position = position;
        this.children.create(nodeName, newNode, function( child ) {
            if (avatar) child.lookAt(self.children[avatar].worldPosition());
          });
    }

}

this.createCameraWithOffset = function (name, node, avatar) {

    var position = "0 0 0";

    var nodeName = name;
    if (!nodeName) {
        nodeName = this.GUID();
    }

    if (avatar) {

        let myAvatar = this.children[avatar];
        let cursorNode = myAvatar.avatarNode.myHead.myCursor.vis;

        if (cursorNode) {
            position = cursorNode.worldPosition();
            //console.log(position);
        }

    }

    var newNode = this.cameraProtoWithOffset();
    newNode.properties.displayName = "cameraWithOffset";

    var self = this;

    if (newNode) {
        newNode.properties.position = position;
        this.children.create(nodeName, newNode, function( child ) {
            if (avatar) child.lookAt(self.children[avatar].worldPosition());
          });
    }

}


this.createImage = function (imgSrc, name, node, avatar) {

    var self = this;

    var position = "0 0 0";

    var nodeName = name;
    if (!nodeName) {
        nodeName = this.GUID();
    }

    if (avatar) {

        let myAvatar = this.children[avatar];
        let cursorNode = myAvatar.avatarNode.myHead.myCursor.vis;

        if (cursorNode) {
            position = cursorNode.worldPosition();
            //console.log(position);
        }

    }

    let tagName = 'IMG-ASSET-'+ this.GUID();
    let tagNode = {
        "extends": "proxy/aframe/a-asset-image-item.vwf",
        "properties": {
            "itemID": tagName,
            "itemSrc": imgSrc
        }
    }

    this.children.create(tagName, tagNode, function( child ) {


        var nodeName = 'IMAGE-'+self.GUID();

        var position = "0 0 0";
        if (avatar) {
            
            let myAvatar = self.children[avatar];
            let cursorNode = myAvatar.avatarNode.myHead.myCursor.vis;
        
            if (cursorNode) {
                 position = cursorNode.worldPosition();
                //console.log(position);
            }
    
        }
 
        let newNode = self.planeProto();
        newNode.properties.displayName = "image";
        newNode.children.material.properties.src = '#' + child.itemID;
        newNode.properties.position = position;
        newNode.properties.scale = [0.003, 0.003, 0.003];
        
        if(child.width && child.height){

            newNode.properties.width = child.width;
            newNode.properties.height = child.height;

            self.children.create(nodeName, newNode, function( child ) {
                if (avatar) child.lookAt(self.children[avatar].worldPosition())
               });
    
        } else {

            let allNodes = vwf.models["/drivers/model/aframe"].model.state.nodes;
            let imgAssetNode = allNodes[child.id];
    
            imgAssetNode.aframeObj.onload = function(){
    
           // console.log(imgAssetNode);

        newNode.properties.width = child.width;
        newNode.properties.height = child.height;
    
            self.children.create(nodeName, newNode, function( child ) {
                if (avatar) child.lookAt(self.children[avatar].worldPosition())
               });
    
            }


        } 

     
        

       });

}

this.createVideo = function (vidSrc, name, node, avatar) {

    var self = this;

    var position = "0 0 0";

    var nodeName = name;
    if (!nodeName) {
        nodeName = this.GUID();
    }

    if (avatar) {

        let myAvatar = this.children[avatar];
        let cursorNode = myAvatar.avatarNode.myHead.myCursor.vis;

        if (cursorNode) {
            position = cursorNode.worldPosition();
            //console.log(position);
        }

    }

    let tagName = 'VIDEO-ASSET-'+ this.GUID();
    let tagNode = {
        "extends": "proxy/aframe/a-asset-video-item.vwf",
        "properties": {
            "itemID": tagName,
            "itemSrc": vidSrc
        }
    }

    this.children.create(tagName, tagNode, function( child ) {


        let nodeName = 'VIDEO-'+self.GUID();
        var position = "0 0 0";
        if (avatar) {
            
            let myAvatar = self.children[avatar];
            let cursorNode = myAvatar.avatarNode.myHead.myCursor.vis;
        
            if (cursorNode) {
                 position = cursorNode.worldPosition();
                //console.log(position);
            }
    
        }
 
        let newNode = self.planeProto();
        newNode.properties.displayName = "video";
        newNode.children.material.properties.src = '#' + child.itemID;
        newNode.properties.position = position;
        // newNode.properties.width = 3;
        // newNode.properties.height = 1.75;
        newNode.properties.scale = [0.003, 0.003, 0.003];

        if (child.videoWidth && child.videoHeight) {

            newNode.properties.width = child.videoWidth;
            newNode.properties.height = child.videoHeight;

            self.children.create(nodeName, newNode, function( child ) {
                if (avatar) child.lookAt(self.children[avatar].worldPosition())
               });

        } else {

            let allNodes = vwf.models["/drivers/model/aframe"].model.state.nodes;
            let imgAssetNode = allNodes[child.id];
    
            imgAssetNode.aframeObj.onloadeddata = function(){

                newNode.properties.width = child.videoWidth;
                newNode.properties.height = child.videoHeight;

                self.children.create(nodeName, newNode, function( child ) {
                    if (avatar) child.lookAt(self.children[avatar].worldPosition())
                   });

            }
    
        }

        
       });

}

this.createAudio = function (itemSrc, name, node, avatar) {

    var self = this;

    var position = "0 0 0";

    var nodeName = name;
    if (!nodeName) {
        nodeName = this.GUID();
    }

    if (avatar) {

        let myAvatar = this.children[avatar];
        let cursorNode = myAvatar.avatarNode.myHead.myCursor.vis;

        if (cursorNode) {
            position = cursorNode.worldPosition();
            //console.log(position);
        }

    }

    let tagName = 'AUDIO-ASSET-'+ this.GUID();
    let tagNode = {
        "extends": "proxy/aframe/a-asset-audio-item.vwf",
        "properties": {
            "itemID": tagName,
            "itemSrc": itemSrc
        }
    }

    this.children.create(tagName, tagNode, function( child ) {


        // let allNodes = vwf.models["vwf/model/aframe"].model.state.nodes;
        // let itemAssetNode = allNodes[child.id];

    //     itemAssetNode.aframeObj.onload = function(){

    //    console.log(itemAssetNode);

        let nodeName = 'AUDIO-'+self.GUID();
        var position = "0 0 0";
        if (avatar) {
            
            let myAvatar = self.children[avatar];
            let cursorNode = myAvatar.avatarNode.myHead.myCursor.vis;
        
            if (cursorNode) {
                 position = cursorNode.worldPosition();
                //console.log(position);
            }
    
        }
 
        let newNode = self.cubeProto();
        newNode.properties.displayName = "audio";
        newNode.properties.position = position;
        newNode.properties.width = 0.3;
        newNode.properties.height = 0.3;
        newNode.properties.depth= 0.3;
        newNode.children.material.properties.opacity = 0.5;
        newNode.children.material.properties.color = "yellow";

        newNode.children.sound = {
            
                "extends": "proxy/aframe/a-sound-component.vwf",
                "type": "component",
                "properties": {
                    "autoplay": false,
                    "loop": true,
                    "isPlaying": false,
                    "src": '#' + child.itemID
                }
            
        };

        self.children.create(nodeName, newNode, function( child ) {
            if (avatar) child.lookAt(self.children[avatar].worldPosition())
           });

       // }
        

       });

}

this.createGooglePoly = function(polyID, name, node, avatar){

    // all done in aframe view driver
    let params = [polyID, name, node, avatar];
    this.loadGooglePolyAsset(params)
  
}

this.loadGooglePolyAsset = function( params ) {

    var self = this;

    const API_KEY = "AIzaSyCGx2_idlUJ88yW5GBkOllIkyxJyKbEgDk";
    const id = params[0];
    const avatarID = params[3];


    var url = `https://poly.googleapis.com/v1/assets/${id}/?key=${API_KEY}`;

    var request = new XMLHttpRequest();
    request.open( 'GET', url, true );
    request.addEventListener( 'load', function ( event ) {

        var asset = JSON.parse( event.target.response );

        // asset_name.textContent = asset.displayName;
        // asset_author.textContent = asset.authorName;

        var format = asset.formats.find( format => { return format.formatType === 'OBJ'; } );

        if ( format !== undefined ) {

            var obj = format.root;
            var mtl = format.resources.find( resource => { return resource.url.endsWith( 'mtl' ) } );

            var path = obj.url.slice( 0, obj.url.indexOf( obj.relativePath ) );
            
            //const createOnNodeID = vwf.application();

            let mtlName = 'MTL-ASSET-'+ self.GUID();
            let mtlNode = {
                "extends": "proxy/aframe/a-asset-item.vwf",
                "properties": {
                    "itemID": mtlName,
                    "itemSrc": mtl.url
                }
            }
        
            self.children.create(mtlName, mtlNode, function( mtlChild ) {

                let objName = 'OBJ-ASSET-'+ self.GUID();
                let objNode = {
                    "extends": "proxy/aframe/a-asset-item.vwf",
                    "properties": {
                        "itemID": objName,
                        "itemSrc": obj.url
                    }
                }

                self.children.create(objName, objNode, function( objChild ) {

                        self.createModelObj(mtlChild.itemID, objChild.itemID, asset.displayName, avatarID);

                })


            })
        }

    } );
    request.send( null );
}

this.GUID = function () {
    var self = this;
    var S4 = function () {
        return Math.floor(
            self.random() * 0x10000 /* 65536 */
        ).toString(16);
    };

    return (
        S4() + S4() + "-" +
        S4() + "-" +
        S4() + "-" +
        S4() + "-" +
        S4() + S4() + S4()
    );
}

this.smallRandomId = function()  {
    return '_' + this.random().toString(36).substr(2, 9);
}

this.assetImgProto = function () {

    let node = {
        "extends": "proxy/aframe/a-asset-image-item.vwf",
        "properties": {
        },
    }
    return node
}



this.createAssetItemImg = function(){

    console.log("create new asset item for img");

    let nodeName = "asset-item-img-" + this.smallRandomId();
    let newNode = {
        "extends": "proxy/aframe/a-asset-image-item.vwf",
        "properties": {
            itemID:  nodeName,
            itemSrc: ""
        }
    }

    this.children.create(nodeName, newNode);

}

this.deleteNode = function(nodeName){

      let node = this.children[nodeName];
    if (node) this.children.delete(node);

}

this.enterVR = function(){
    console.log("ENTER VR");
}

this.exitVR = function(){
    console.log("EXIT VR");
}

this.getChildByName = function (name) {
    let nodes = this.children.filter(el => el.displayName == name);
    return nodes[0]
}

this.getAllChildsByName = function (name) {
    let nodes = this.children.filter(el => el.displayName == name);
    return nodes
}

this.getDefaultXRCostume = function(){
    
    let defaultXRCostume = {
        "extends": "proxy/aframe/abox.vwf",
        "properties": {
            displayName: "defaultXRCostume",
            "position": "0 0 0",
            "height": 0.01,
            "width": 0.01,
            "depth": 1
        },
        "methods":{
            triggerdown:{
                body:'\/\/do on trigger down \n this.pointer.material.color = "red"',
                type: "application/javascript"
            },
            triggerup:{
                body:'\/\/do on trigger up \n this.pointer.material.color = "green"',
                type: "application/javascript"
            },
            onMove:{
                body:'\/\/do on move \n ',
                type: "application/javascript"
            }
        },
        children: {
            "material": {
                "extends": "proxy/aframe/aMaterialComponent.vwf",
                "type": "component",
                "properties":{
                    "color": "white"
                }
            },
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
                    }
                }
            }
        }
    
    }

    return defaultXRCostume
}