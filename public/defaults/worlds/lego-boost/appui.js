//-----App ui-----

function createApp() {

    let self = this


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
                        $type: "div",
                        class: "mdc-layout-grid__cell mdc-layout-grid__cell--span-12",
                        $components: [
                            self.widgets.inputTextFieldOutlined({
                                "id": 'deviceIDInput',
                                "label": "Device ID",
                                "value": window._LegoView.device.id,
                                "change": function (e) {
                                    window._LegoView.changeDeviceID(this.value);
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
                            ),

                            // _app.widgets.divider,
                            // {
                            //     $cell: true,
                            //     $type: "button",
                            //     class: "mdc-button mdc-button--raised",
                            //     $text: "Start tracking",
                            //     onclick: function (e) {

                            //        // window._LegoView.testLED();

                            //     }

                            // },
                            {
                                $cell: true,
                                $type: "button",
                                class: "mdc-button mdc-button--raised",
                                $text: "Create Robot device",
                                onclick: function (e) {

                                    let sceneID = vwf.find("", "/")[0];
                                    let boostID = _LegoView.isConnected() ? _LegoView.device.id : 'none';
                                    vwf_view.kernel.callMethod(sceneID, "createLegoBoost", [boostID]);


                                }

                            },
                            _app.widgets.divider,
                            {
                                $cell: true,
                                $type: "button",
                                class: "mdc-button mdc-button--raised",
                                $text: "Действие!",
                                onclick: function (e) {

                                    let sceneID = vwf.find("", "/")[0];
                                    vwf_view.kernel.callMethod(sceneID, "doLegoBoostAction");


                                }

                            }

                        ]
                    }

                ]
            }
        ]
    }
}
