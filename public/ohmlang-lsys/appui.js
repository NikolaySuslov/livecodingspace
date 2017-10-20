function createApp() {

    let self = this



    function makeSetter(val) {
        let setstr = 'this.' + val + '= value; this.redrawEvent();'
        return setstr
    }

    function getNewPosition() {
        //let allChild = vwf.find("","/*")
        let cursorVisID = vwf.find("myCursor-avatar-" + vwf.moniker_, "./vis")[0]
        let avPos = AFRAME.utils.coordinates.parse(vwf.getProperty(cursorVisID, 'worldPosition'));
        let newPos = [avPos.x, avPos.y, avPos.z]
        return newPos
    }

    return {
        $cell: true,
        $type: "div",
        class: "propGrid max-width mdc-layout-grid mdc-layout-grid--align-left",
        $components: [
            {
                $cell: true,
                $type: "div",
                class: "mdc-layout-grid__inner",
                $components: [
                    {
                        $cell: true,
                        $type: "div",
                        class: "mdc-layout-grid__cell mdc-layout-grid__cell--span-12",
                        $components: [
                            // {
                            //     $cell: true,
                            //     $type: "button",
                            //     class: "mdc-button mdc-button--raised",
                            //     $text: "Draw L-System",
                            //     onclick: function (e) {
                            //         let sceneID = vwf.find("","/")[0];
                            //         vwf_view.kernel.callMethod(sceneID, "drawLSys1");
                            //     }

                            // },
                            {
                                $cell: true,
                                $type: "button",
                                class: "mdc-button mdc-button--raised",
                                $text: "Create new turtle",
                                onclick: function (e) {
                                    let sceneID = vwf.find("", "/")[0];
                                    let turtleID = vwf.find("", "/turtle")[0];

                                    console.log("create new turtle");
                                    let newTurtle = vwf.getNode(turtleID, true);

                                    newTurtle.properties.position = getNewPosition();

                                    let randomName = "turtle-new-" + self.GUID();
                                    vwf_view.kernel.createChild(sceneID, randomName, newTurtle);
                                }

                            }


                        ]
                    },
                    {
                        $cell: true,
                        $type: "div",
                        class: "mdc-layout-grid__cell mdc-layout-grid__cell--span-6",
                        $components: [

                            {
                                $type: "img",
                                src: "./lsys/Koch.jpg",
                                class: "mdc-elevation--z2",
                                style: "width: 150px",
                                onclick: function (evt) {

                                    let turtleID = vwf.find("", "/turtle")[0];

                                    let params = {
                                        "angle": 60,
                                        "iteration": 3,
                                        "stepLength": 0.3,
                                        "rule": 'F++F++F',
                                        "axiomF": 'F-F++F-F',
                                        "axiomG": ''
                                    }

                                    vwf_view.kernel.callMethod(turtleID, 'setTurtleParams', [Object.entries(params)])



                                }

                            }
                        ]
                    },
                    {
                        $cell: true,
                        $type: "div",
                        class: "mdc-layout-grid__cell mdc-layout-grid__cell--span-6",
                        $components: [

                            {
                                $type: "img",
                                src: "./lsys/dragon.jpg",
                                class: "mdc-elevation--z2",
                                style: "width: 150px",
                                onclick: function (evt) {

                                    let turtleID = vwf.find("", "/turtle")[0];

                                    let params = {
                                        "angle": 90,
                                        "iteration": 10,
                                        "stepLength": 0.3,
                                        "rule": 'F',
                                        "axiomF": 'F+G+',
                                        "axiomG": '-F-G'
                                    }

                                    vwf_view.kernel.callMethod(turtleID, 'setTurtleParams', [Object.entries(params)])



                                }

                            }

                        ]
                    },
                    {
                        $cell: true,
                        $type: "div",
                        class: "mdc-layout-grid__cell mdc-layout-grid__cell--span-6",
                        $components: [

                            {
                                $type: "img",
                                src: "./lsys/SierpinskiCurve.jpg",
                                class: "mdc-elevation--z2",
                                style: "width: 150px",
                                onclick: function (evt) {

                                    let turtleID = vwf.find("", "/turtle")[0];

                                    let params = {
                                        "angle": 60,
                                        "iteration": 5,
                                        "stepLength": 0.3,
                                        "rule": 'F',
                                        "axiomF": 'G-F-G',
                                        "axiomG": 'F+G+F'
                                    }

                                    vwf_view.kernel.callMethod(turtleID, 'setTurtleParams', [Object.entries(params)])



                                }

                            }
                        ]
                    },
                    {
                        $cell: true,
                        $type: "div",
                        class: "mdc-layout-grid__cell mdc-layout-grid__cell--span-6",
                        $components: [

                            {
                                $type: "img",
                                src: "./lsys/SierpinskiTriangle.jpg",
                                class: "mdc-elevation--z2",
                                style: "width: 150px",
                                onclick: function (evt) {

                                    let turtleID = vwf.find("", "/turtle")[0];

                                    let params = {
                                        "angle": 120,
                                        "iteration": 5,
                                        "stepLength": 0.3,
                                        "rule": 'F--F--F',
                                        "axiomF": 'F--F--F--G',
                                        "axiomG": 'GG'
                                    }

                                    vwf_view.kernel.callMethod(turtleID, 'setTurtleParams', [Object.entries(params)])



                                }

                            }
                        ]
                    }
                ]
            }
        ]
    }
}
