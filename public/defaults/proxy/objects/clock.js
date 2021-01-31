this.init = function () {
    let self = this;

    let arrows = {
        "second": {
            color: "red",
            radius: 0.01,
            height: 1,
            offset: 0,
            visible: true,
            visWidth: 0.5,
            textPos: "-0.25,0,0"
        },
        "minute": {
            color: "blue",
            radius: 0.02,
            height: 0.8,
            offset: 0.3,
            visible: true,
            visWidth: 0.3,
            textPos: "-0.15,0,0"
        },
        "hour": {
            color: "green",
            radius: 0.03,
            height: 0.6,
            offset: 0.5,
            visible: false,
            visWidth: 0.3,
            textPos: "-0.15,0,0"
        }
    }

    for (const [key, value] of Object.entries(arrows)) {

        let arrowNode = {
            "extends": "proxy/aframe/aentity.vwf",
            "properties": {
                displayName: key
            },
            "children": {

                "arrow": {
                    "extends": "proxy/aframe/acylinder.vwf",
                    "properties": {
                        radius: value.radius,
                        height: value.height,
                        position: [0, value.height / 2, 0]
                    },
                    "children": {
                        "material": {
                            "extends": "proxy/aframe/aMaterialComponent.vwf",
                            "type": "component",
                            "properties": {
                                "color": value.color
                            }
                        },
                        "digit": {
                            "extends": "proxy/aframe/aplane.vwf",
                            "properties": {
                                height: 0.3,
                                width: value.visWidth,
                                position: [0, value.height + value.offset, 0],
                                visible: value.visible
                            },
                            children: {
                                "material": {
                                    "extends": "proxy/aframe/aMaterialComponent.vwf",
                                    "type": "component",
                                    "properties": {
                                        "color": "white",
                                        "side": "double"
                                    }
                                },
                                "text": {
                                    "extends": "proxy/aframe/atext.vwf",
                                    "properties": {
                                        "color": "black",
                                        "value": "",
                                        "side": "double",
                                        position: value.textPos
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        self.children.create(key, arrowNode)
    }

    let vis = {
        "extends": "proxy/aframe/acylinder.vwf",
        "properties": {
            radius: 1.2,
            height: 0.01,
            rotation: [90, 0, 0],
            position: [0, 0, -0.05]
        },
        "children": {
            // "clock": {
            //     "extends": "proxy/aframe/a-asset-image-item.vwf",
            //     "properties": {
            //         "itemID": "clock",
            //         "itemSrc": "/defaults/assets/textures/clock.png"
            //     }
            // },
            "material": {
                "extends": "proxy/aframe/aMaterialComponent.vwf",
                "type": "component",
                "properties": {
                    "src": "url(/defaults/assets/textures/clock.png)",
                    "side": "double",
                    "color": "white"
                }
            }
        }
    }

    self.children.create("vis", vis)

}

this.run = function () {


    let seconds = this.time//Math.floor(this.time/2);
    let minutes = Math.floor(seconds / 60);
    let hours = Math.floor(minutes / 60);

    if (this.second && this.minute && this.hour) {
        this.second.rotation = [0, 0, -360 * (seconds / 60)];
        this.minute.rotation = [0, 0, -360 * (minutes / 60)];
        this.hour.rotation = [0, 0, -360 * (hours / 12)];

        this.second.arrow.digit.rotation = [0, 0, 360 * (seconds / 60)];
        this.minute.arrow.digit.rotation = [0, 0, 360 * (minutes / 60)];
        this.hour.arrow.digit.rotation = [0, 0, 360 * (hours / 60)];


        let sText = Number.parseFloat(seconds % 60 ).toFixed(1);
        let minText = minutes % 60;
        let hrText = hours % 12;


        this.second.arrow.digit.text.value = (sText == 0) ? "" : sText
        this.minute.arrow.digit.text.value = (minText == 0) ? "" : minText
        this.hour.arrow.digit.text.value = (hrText == 0) ? "" : hrText

    }

    this.future(0.1).run()

}

