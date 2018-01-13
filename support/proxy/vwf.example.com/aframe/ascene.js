this.initialize = function () {
    this.future(0).clientWatch();
};

this.clientWatch = function () {
    var self = this;

    if (this.children.length !== 0) {

        var clients = this.find("doc('http://vwf.example.com/clients.vwf')")[0];

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
                        self.children.delete(self.children[node.id]);
                        //'gearvr-'
                        let controllerVR = self.children['gearvr-' + node.id.slice(7)];
                        if (controllerVR) {
                            self.children.delete(controllerVR);
                        }

                        let wmrvR = self.children['wmrvr-right-' + node.id.slice(7)];
                        if (wmrvR) {
                            self.children.delete(wmrvR);
                        }

                        let wmrvL = self.children['wmrvr-left-' + node.id.slice(7)];
                        if (wmrvL) {
                            self.children.delete(wmrvL);
                        }

                    }
                }
            });
        }
    }
    this.future(5).clientWatch();
};

this.sphereProto = function () {

    let node = {
        "extends": "http://vwf.example.com/aframe/asphere.vwf",
        "properties": {
            "displayName": "sphere",
            "radius": 1,
            "clickable": true
        },
        children: {
            "material": {
                "extends": "http://vwf.example.com/aframe/aMaterialComponent.vwf",
                "type": "component",
                "properties":{
                    "color": "white"
                }
            },
            "interpolation":
                {
                    "extends": "http://vwf.example.com/aframe/interpolation-component.vwf",
                    "type": "component",
                    "properties": {
                        "enabled": true
                    }
                },
            "cursor-listener": {
                "extends": "http://vwf.example.com/aframe/app-cursor-listener-component.vwf",
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
        "extends": "http://vwf.example.com/aframe/acylinder.vwf",
        "properties": {
            "displayName": "cylinder",
            "radius": 1,
            "height": 1,
            "clickable": true
        },
        children: {
            "material": {
                "extends": "http://vwf.example.com/aframe/aMaterialComponent.vwf",
                "type": "component",
                "properties":{
                    "color": "white"
                }
            },
            "interpolation":
                {
                    "extends": "http://vwf.example.com/aframe/interpolation-component.vwf",
                    "type": "component",
                    "properties": {
                        "enabled": true
                    }
                },
            "cursor-listener": {
                "extends": "http://vwf.example.com/aframe/app-cursor-listener-component.vwf",
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
        "extends": "http://vwf.example.com/aframe/acone.vwf",
        "properties": {
            "displayName": "cone",
            "radius-bottom": 1,
            "radius-top": 0.01,
            "height": 1,
            "clickable": true
        },
        children: {
            "material": {
                "extends": "http://vwf.example.com/aframe/aMaterialComponent.vwf",
                "type": "component",
                "properties":{
                    "color": "white"
                }
            },
            "interpolation":
                {
                    "extends": "http://vwf.example.com/aframe/interpolation-component.vwf",
                    "type": "component",
                    "properties": {
                        "enabled": true
                    }
                },
            "cursor-listener": {
                "extends": "http://vwf.example.com/aframe/app-cursor-listener-component.vwf",
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

this.textProto = function () {

    let node = {
        "extends": "http://vwf.example.com/aframe/atext.vwf",
        "properties": {
            "displayName": "text",
            "color": "white",
            "value": "Text",
            "side": "double",
            "clickable": true
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
            "cursor-listener": {
                "extends": "http://vwf.example.com/aframe/app-cursor-listener-component.vwf",
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
        "extends": "http://vwf.example.com/aframe/abox.vwf",
        "properties": {
            "displayName": "cube",
            "height": 1,
            "width": 1,
            "depth": 1,
            "clickable": true
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
            "cursor-listener": {
                "extends": "http://vwf.example.com/aframe/app-cursor-listener-component.vwf",
                "type": "component"
            },
            "material": {
                "extends": "http://vwf.example.com/aframe/aMaterialComponent.vwf",
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
        "extends": "http://vwf.example.com/aframe/alight.vwf",
        "properties": {
            "displayName": newLightType,
            "type": newLightType,
            "clickable": true
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
            "cursor-listener": {
                "extends": "http://vwf.example.com/aframe/app-cursor-listener-component.vwf",
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

this.planeProto = function () {

    let node = {
        "extends": "http://vwf.example.com/aframe/aplane.vwf",
        "properties": {
            "displayName": "plane",
            "height": 1,
            "width": 1,
            "clickable": true
        },
        children: {
            "material": {
                "extends": "http://vwf.example.com/aframe/aMaterialComponent.vwf",
                "type": "component",
                "properties": {
                    "side": "double",
                    "color": "white"
                }
            },
            "interpolation":
                {
                    "extends": "http://vwf.example.com/aframe/interpolation-component.vwf",
                    "type": "component",
                    "properties": {
                        "enabled": true
                    }
                },
            "cursor-listener": {
                "extends": "http://vwf.example.com/aframe/app-cursor-listener-component.vwf",
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

this.createModelDAE = function (daeSrc, avatar) {

    var self = this;

    let daeTagName = 'DAE-ASSET-'+this.GUID();
    let daeTagNode = {
        "extends": "http://vwf.example.com/aframe/a-asset-item.vwf",
        "properties": {
            "itemID": daeTagName,
            "itemSrc": daeSrc,
        },
    }

    this.children.create(daeTagName, daeTagNode, function( child ) {
        let daeNodeName = 'DAE-MODEL-'+self.GUID();

        var position = "0 0 0";
        let myAvatar = self.children[avatar];
        let cursorNode = myAvatar.avatarNode.myHead.myCursor.vis;
    
        if (cursorNode) {
             position = cursorNode.worldPosition;
            //console.log(position);
        }

        let daeNode = {
            "extends": "http://vwf.example.com/aframe/acolladamodel.vwf",
            "properties": {
                "src": '#' + child.itemID,
                "position": position
            }
        }

        self.children.create(daeNodeName, daeNode, function( child ) {
            if (avatar) child.lookAt(self.children[avatar].worldPosition)
           });

       });
}


this.createPrimitive = function (type, avatar, params, name, node) {

    var position = "0 0 0";
    var nodeName = name;


    let myAvatar = this.children[avatar];
    let cursorNode = myAvatar.avatarNode.myHead.myCursor.vis;

    if (cursorNode) {
        position = cursorNode.worldPosition;
        //console.log(position);
    }

    if (!name) {
        nodeName = this.GUID();
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
        this.children.create(nodeName, newNode, function( child ) {
           child.lookAt(self.children[avatar].worldPosition)
          });
    }

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
        "extends": "http://vwf.example.com/aframe/a-asset-image-item.vwf",
        "properties": {
        },
    }
    return node
}



this.createAssetItemImg = function(){

    console.log("create new asset item for img");

    let nodeName = "asset-item-img-" + this.smallRandomId();
    let newNode = {
        "extends": "http://vwf.example.com/aframe/a-asset-image-item.vwf",
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

