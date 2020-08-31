class UserView {

    constructor(view) {
        this.view = view;
        this.init();
    }
    

    init() {

        vwf_view.satProperty = function (nodeID, propertyName, propertyValue) {
            if (propertyValue === undefined || propertyValue == null) {
                return;
            }

            let props = ["angle", "iteration", "stepLength", "rule", "axiomF", "axiomG"]

            let readyForDraw = vwf.getProperty(nodeID, 'readyForDraw');
            if (props.includes(propertyName)) {

                if (readyForDraw) {
                vwf_view.kernel.callMethod(nodeID, "makeLSys");
                }
                 //console.log(propertyName +' - '+ propertyValue);
            }

            // switch ( propertyName ) {
            //     case "iteration":
            //     vwf_view.kernel.callMethod(nodeID, "makeLSys");
            //     console.log("here!!")
            //     break;

            //     default:
            //         break;
            // }

        }


    }

       
}

export {UserView as default}