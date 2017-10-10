function createApp(){

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
                            $text: "Draw L-System",
                            onclick: function (e) {
                                let sceneID = vwf.find("","/")[0];
                                vwf_view.kernel.callMethod(sceneID, "testDrawLsys");
                            }

                        }

                    ]
                }
            ]
        }
    ]
}
}