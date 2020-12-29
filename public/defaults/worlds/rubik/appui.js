//-----App ui-----

function createApp() {

    let self = this

    if(!window._rubik){
        window._rubik = {
            command: 'Ff'
        };
    }
   
    

    function makeRobotButtons() {
        let nodeNames = ['Left', 'Right', 'Back', 'Front' ];
        return nodeNames.map(el => {
            return self.widgets.gridListItem({
                imgSrc: "/drivers/model/rubik/assets/" + el.toLowerCase() + ".png",
                imgSize: "30px",
                styleClass:"", //"createListItem",
                title: el,
                onclickfunc: function () {
                    
                    window._LegoView.changeDeviceID(el.toLowerCase());

                    var status = document.querySelector('#currentRobotID');
                    status._val = _LegoView.device.id    
                    // status.$components = [
                    //     {
                    //         $type: "h3",
                    //         $text: _LegoView.device.id      
                    //     }
                    // ] 

                    //let sceneID = vwf.find("", "/")[0];
                    //let boostID = _LegoView.device.id; //_LegoView.isConnected() ? _LegoView.device.id : 'none';
                    //vwf_view.kernel.callMethod(sceneID, "createLegoBoost", [boostID]);
                }
            })
        })
    }

    function doFun() {
        let sceneID = vwf.find("", "/")[0];
        vwf_view.kernel.callMethod(sceneID, "doOnRubik", [window._rubik.command]);
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
                            {
                                $cell: true,
                                $type: "button",
                                class: "mdc-button mdc-button--raised",
                                $text: "Create Rubik",
                                onclick: function (e) {
                                    let sceneID = vwf.find("", "/")[0];
                                    let rubikID = "rubik-" + _app.helpers.randId();
                                    vwf_view.kernel.callMethod(sceneID, "createRubik", [rubikID, false]);
                                }

                            }
                        ]
                    },
                    {
                        $type: "div",
                        class: "mdc-layout-grid__cell mdc-layout-grid__cell--span-12",
                        $components: [
                            {
                                $type: "h2",
                                $text: "Rubik Robot"
                            }

                        ]
                    },
                    {
                        $cell: true,
                        $type: "div",
                        class: "mdc-layout-grid__cell mdc-layout-grid__cell--span-12",
                        $components: [
                            {
                                $cell: true,
                                $type: "button",
                                class: "mdc-button mdc-button--raised",
                                $text: "Create Rubik & Robot",
                                onclick: function (e) {
                                    let sceneID = vwf.find("", "/")[0];
                                    let rubikID = "rubik-" + _app.helpers.randId();
                                    vwf_view.kernel.callMethod(sceneID, "createRubik", [rubikID, true]);
                                }

                            }
                        ]
                    },
                    {
                        $type: "div",
                        class: "mdc-layout-grid__cell mdc-layout-grid__cell--span-12",
                        $components: [
                            {
                                $type: "div",
                                class: "mdc-layout-grid__inner",
                                $components: makeRobotButtons()
                            }
                        ]
                    },
                    
                    {
                        $cell: true,
                        $type: "div",
                        class: "mdc-layout-grid__cell mdc-layout-grid__cell--span-12",
                        id: "currentRobotID",
                        _val: "none",
                        $components: [
                            {
                                $type: "h3",
                                $text: _LegoView.device.id 
                            }
                        ],
                        $update: function(){
                            this.$components = [
                                {
                                    $type: "h3",
                                    $text: this._val   
                                }
                            ]
                        }
                        
                    },
                    {
                        $cell: true,
                        $type: "div",
                        class: "mdc-layout-grid__cell mdc-layout-grid__cell--span-12",
                        $components: [
                            self.widgets.buttonRaised(
                                {
                                    "label": _LegoView.isConnected() ? "Disconnect" : "Connect",
                                    "onclick": function (e) {
                                        if (!_LegoView.isConnected()) {
                                            this.$text = 'Disconnect';
                                            _LegoView.connect();
                                        } else {
                                            this.$text = 'Connect';
                                            _LegoView.disconnect();
                                        }
                                    }
                                }
                            )
                        ]
                    },

                    {
                        $cell: true,
                        $type: "div",
                        class: "mdc-layout-grid__cell mdc-layout-grid__cell--span-12",
                        $components: [
                            self.widgets.inputTextFieldOutlined({
                                "id": 'commandt',
                                "label": "Command: ",
                                "value": window._rubik.command,
                                "change": function (e) {
                                    window._rubik.command = this.value;
                                }
                            })

                        ]
                    },
                    {
                        $cell: true,
                        $type: "div",
                        class: "mdc-layout-grid__cell mdc-layout-grid__cell--span-12",
                        $components: [
                            self.widgets.buttonRaised(
                                {
                                    "label": "DO",
                                    "onclick": doFun
                                })
                        ]
                    },
                    _app.widgets.divider

                ]
            }
        ]
    }
}
