
function createApp() {

    let self = this

  function createCameraButton(camNum) {

        let label = "Camera " + camNum;
        let camID = "/multicam/camera"+ camNum + "/cam";
        let camOffsetID = "/multicam/camera"+ camNum + "/cam/viewoffset";

      return {
        $cell: true,
        $type: "button",
        class: "mdc-button mdc-button--raised",
        $text: label,
        onclick: function (e) {
            let nodeID = vwf.find("",camID)[0];
            let offsetCompID =  vwf.find("",camOffsetID)[0];
            let avatarID = vwf.moniker_;
            vwf_view.kernel.callMethod(offsetCompID, "setParams", []);
            vwf_view.kernel.callMethod(nodeID, "setCameraToActive", [avatarID]);
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
                          
                            createCameraButton("1"),
                            createCameraButton("2")


                        ]
                    }


                ]
            }
        ]
    }
}