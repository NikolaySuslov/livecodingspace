//-----App ui-----

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
                        
                                {
                                    $cell: true,
                                    $type: "button",
                                    class: "mdc-button mdc-button--raised",
                                    $text: "Wide",
                                    onclick: function (e) {
                                        let avatarID = 'avatar-'+vwf.moniker_;
                                        vwf_view.kernel.callMethod(avatarID, "setBigVideoHead", []);
                                       
                                    }
    
                                },
                                {
                                    $cell: true,
                                    $type: "button",
                                    class: "mdc-button mdc-button--raised",
                                    $text: "Small",
                                    onclick: function (e) {
                                        let avatarID = 'avatar-'+vwf.moniker_;
                                        vwf_view.kernel.callMethod(avatarID, "setSmallVideoHead", []);
                                       
                                    }
    
                                },
                                {
                                    $cell: true,
                                    $type: "button",
                                    class: "mdc-button mdc-button--raised",
                                    $text: "Off",
                                    onclick: function (e) {
                                        let avatarID = 'avatar-'+vwf.moniker_;
                                        vwf_view.kernel.callMethod(avatarID, "webrtcTurnOnOff", [false]);
                                       
                                    }
    
                                },
                                {
                                    $cell: true,
                                    $type: "button",
                                    class: "mdc-button mdc-button--raised",
                                    $text: "On",
                                    onclick: function (e) {
                                        let avatarID = 'avatar-'+vwf.moniker_;
                                        vwf_view.kernel.callMethod(avatarID, "webrtcTurnOnOff", [true]);
                                       
                                    }
    
                                }
    
    
                            ]
                        }

                    ]
                }
            ]
        }
    }
    