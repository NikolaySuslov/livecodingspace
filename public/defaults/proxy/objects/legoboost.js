this.initialize = function () {
}

this.createVisual = function () {

    let motorNode = function (position, rotation) {

        let rot = rotation ? rotation : [0, 0, 0];

        return {
            "extends": "proxy/aframe/abox.vwf",
            "properties": {
                "position": position,
                "rotation": rot,
                "height": 0.05,
                "width": 0.05,
                "depth": 0.05
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

                "vis": {
                    "extends": "proxy/aframe/abox.vwf",
                    "properties": {
                        "height": 0.4,
                        "width": 0.05,
                        "depth": 0.4
                    },
                    "children": {
                        "material": {
                            "extends": "proxy/aframe/aMaterialComponent.vwf",
                            "type": "component",
                            "properties": {
                                "color": "orange"
                            }
                        }
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
            "height": 0.5,
            "width": 0.5,
            "depth": 0.5
        },
        "children": {
            "material": {
                "extends": "proxy/aframe/aMaterialComponent.vwf",
                "type": "component",
                "properties": {
                    "color": "green"

                }
            },
            "motorA": motorNode([0.3, 0, 0]),
            "motorB": motorNode([-0.3, 0, 0]),
            "motorC": motorNode([0, 0, 0.3], [0, 90, 0])
        }
    }

    this.children.create("visualNode", visNode);

}

this.setPitch = function (value) {
    this.pitch = value;
    let rot = this.visualNode.rotation;
    this.visualNode.rotation = [this.pitch, rot[1], rot[2]];
}

this.getPitch = function () {
    return this.pitch;
}

this.gotDeviceInfo = function (info, key) {
    //got device info
    console.log(info);

    if (key == 'pitch' || key == 'roll') {

        this.pitch = info.tilt.pitch;
        this.roll = info.tilt.roll;

    }

    if (key == 'led') {
        this.rawLed = this.led = info.led;
        this.setVisualLed(this.led);
    }

    if (key == 'A' || key == 'B' || key == 'C') {

        this.setVisualMotorRotation('motor' + key, info.ports[key].angle - this['motor' + key]);
        this['rawMotor' + key] = this['motor' + key] = info.ports[key].angle;


    }

    return info

}

this.trackLego = function () {
    if (this.tracking) {
        this.getDeviceInfo('pitch');
    }
    this.future(0.2).trackLego();
}


this.setRoll = function (value) {
    this.roll = value;
    let rot = this.visualNode.rotation;
    this.visualNode.rotation = [rot[0], rot[1], this.roll];
}

this.getRoll = function () {
    return this.roll;
}

this.setLed = function (value, sync) {
    //set led after lego boost action - in sat_led
}

this.setDelay = function (value, sync) {
    //set delay after lego boost action - in sat_led
}

this.sat_setLed = function (value) {
    this.getDeviceInfo('led');
}

this.setVisualLed = function (value) {
    this.visualNode.material.color = value;
}

this.setVisualMotorRotation = function (port, angle, dutyCycle) {
    //let rot = this.visualNode[motor].vis.rotation;
    //TODO: remap dutyCycle (10,100, 1, 0.1)
    this.visualNode[port].vis.rotateBy([angle, 0, 0], 0.1);
}


this.sat_setMotorAngle = function (port, angle, dutyCycle) {
    this.getDeviceInfo(port);
}

this.setMotorAngle = function (port, angle, dutyCycle, sync) {
}

this.sat_setDelay = function (value) {
}
