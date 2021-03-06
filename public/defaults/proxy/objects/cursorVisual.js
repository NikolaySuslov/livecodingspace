this.createVisual = function () {

    let parent = this.parent;

    let p1 = [{"x":0,"y":0,"z":-0.1},{"x":0,"y":0,"z":-0.2}]

    let visNode = {
        "extends": "proxy/aframe/aentity.vwf",
        "properties": {},
        "children": {
            "cone":{
                "extends": "proxy/aframe/acone.vwf",
                "properties":{
                    "height": 0.2,
                    "radius-bottom": 0.01,
                    "radius-top": 0.001,
                    "rotation": [-90, 0, 0],
                    "position": [0, 0, -0.1]
                },
                "children": {
                    "material": {
                        "extends": "proxy/aframe/aMaterialComponent.vwf",
                        "type": "component",
                        "properties":{
                            "color": this.color,
                            "transparent": true,
                            "opacity": 0.6
                        }
                    },
                    "aabb-collider": {
                        "extends": "proxy/aframe/aabb-collider-component.vwf",
                        "type": "component",
                        "properties": {
                            debug: false,
                            interval: 10,
                            objects: ".hit"
                        }
                    }

            }
        },
            "p1": {
                "extends": "proxy/aframe/aentity.vwf",
                "children": {
                    "linepath": {
                        "extends": "proxy/aframe/linepath.vwf",
                        "properties": {
                            "color": this.color,
                            "path": p1,
                            "width": 0.08, //this.width
                            "taper": true,
                            "transparent": true,
                            "opacity": 0.6
                        }
                    }
                }
            }
        }
    }

    this.children.create("visualNode", visNode);

}

this.end_set = function (value) {
    this.end = this.translationFromValue(value);
    this.visualNode.p1.linepath.path = [this.visualNode.p1.linepath.path[0], this.end];

}
this.end_get = function () {
    return this.end;
}

this.color_set = function (value) {
    //this.avatarColor = value;
    this.color = value;
    if(this.visualNode){
    this.visualNode.p1.linepath.color = value;
    this.visualNode.cone.material.color = value;
    }
}

this.color_get = function () {
    return this.color;
}
