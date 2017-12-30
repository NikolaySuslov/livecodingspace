
function createApp() {

    let self = this

    function toggleFullScreen() {
        if (!document.fullscreenElement) {
            document.documentElement.webkitRequestFullscreen();
        } else {
          if (document.exitFullscreen) {
            document.exitFullscreen(); 
          }
        }
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
                                $text: "Fullscreen",
                                onclick: function (e) {
                                    toggleFullScreen()
                                }

                            },
                            {
                                $cell: true,
                                $type: "button",
                                class: "mdc-button mdc-button--raised",
                                $text: "Camera 1",
                                onclick: function (e) {
                                    let nodeID = vwf.find("","/multicam/camera1/cameraNode/cam")[0];
                                    let avatarID = vwf.moniker_;
                                    vwf_view.kernel.callMethod(nodeID, "setCameraToActive", [avatarID]);
                                }

                            },
                            {
                                $cell: true,
                                $type: "button",
                                class: "mdc-button mdc-button--raised",
                                $text: "Camera 2",
                                onclick: function (e) {
                                    let nodeID = vwf.find("","/multicam/camera2/cameraNode/cam")[0];
                                    let avatarID = vwf.moniker_;
                                    vwf_view.kernel.callMethod(nodeID, "setCameraToActive", [avatarID]);
                                }

                            },

                        ]
                    }


                ]
            }
        ]
    }
}