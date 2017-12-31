this.initialize = function () {

}

this.createCamera = function () {

    var fullHeight = this.parent.fullHeight;
    if (!fullHeight) {
        fullHeight = this.fullHeight;
    }

    var fullWidth = this.parent.fullWidth;
    if (!fullWidth) {
        fullWidth = this.fullWidth;
    }
    

    var newNode = {
        "extends": "http://vwf.example.com/aframe/abox.vwf",
        "properties": {
            "position": [0, 0, 0],
            "depth": 0.2,
            "height": 0.2,
            "width": 0.2,
            "color": "red"
        },
        children: {
            cam: {
                "extends": "http://vwf.example.com/aframe/acamera.vwf",
                "properties": {
                    "look-controls-enabled": false,
                    "wasd-controls-enabled": false,
                    "user-height": 0
                },
                children: {
                    viewoffset: {
                        extends: "http://vwf.example.com/aframe/viewOffsetCamera-component.vwf",
                        properties: {
                            fullWidth: fullWidth,
                            fullHeight: fullHeight,
                            xoffset: this.xoffset,
                            yoffset: this.yoffset,
                            subcamWidth: this. subcamWidth,
                            subcamHeight: this. subcamHeight
                        }

                    }
                }
            }
        }
    }

    this.children.create("cameraNode", newNode);

    }