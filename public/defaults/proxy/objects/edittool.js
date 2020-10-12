this.createVisual = function () {

    let parent = this.parent;
    let dim = parent.boundingBox().getSize(new THREE.Vector3());
    let size = Math.max(dim.x, dim.y, dim.z);
    let childNode = function (position, rotation) {

        let rot = rotation ? rotation : [0, 0, 0];

        return {
            "extends": "proxy/aframe/abox.vwf",
            "properties": {
                "position": position,
                "rotation": rot,
                "height": 0.3,
                "width": 0.3,
                "depth": 0.3
            },
            "children": {
                "material": {
                    "extends": "proxy/aframe/aMaterialComponent.vwf",
                    "type": "component",
                    "properties": {
                        "color": "red",
                        "transparent": true,
                        "opacity": 0.7
                    }
                }
            }
        }
    }

    let visNode = {
        "extends": "proxy/aframe/abox.vwf",
        "properties": {
            "position": [0, 0, 0],
            "rotation": [0, 0, 0],
            "height": size,
            "width": size,
            "depth": size
        },
        "children": {
            "material": {
                "extends": "proxy/aframe/aMaterialComponent.vwf",
                "type": "component",
                "properties": {
                    "color": "white",
                    "transparent": true,
                    "opacity": 0.5

                }
            },
            "drag": childNode([0, (size/2) + 0.3, 0])
        }
    }

    this.children.create("visualNode", visNode);

}