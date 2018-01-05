this.initialize = function () {
}

this.createCamera = function (fw, fh, xoffset, yoffset, subcamWidth, subcamHeight) {

    let cameraNode = {
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
                    fullWidth: fw,
                    fullHeight: fh,
                    xoffset: xoffset,
                    yoffset: yoffset,
                    subcamWidth: subcamWidth,
                    subcamHeight: subcamHeight
                }
            }
        }
}

    this.children.create("cam", cameraNode);

    }