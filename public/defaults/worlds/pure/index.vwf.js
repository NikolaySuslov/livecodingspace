import { h, text,patch } from "$host/lib/ui/superfine.js"

class UserView {

    constructor(view) {
        this.view = view;
        this.init();
    }
    

    init() {
        let self = this;

        vwf_view.initializedNode = function (nodeID, childID, childExtendsID, childImplementsIDs,
            childSource, childType, childIndex, childName) {
            
            if (childID == vwf_view.kernel.application()) {
                let el = document.createElement("pure");
                el.setAttribute("id", childID);
                document.querySelector("body").appendChild(el);
            }
        }

        vwf_view.satProperty = function (nodeID, propertyName, propertyValue) {

            if (propertyValue === undefined || propertyValue == null) {
                return;
            }
            let el = document.querySelector("[id='" + nodeID + "']");

            if (!el)
                return

            if (propertyName == 'pure') {
                self.updatePure(propertyValue, el)
            }
        }
    }

    updatePure(state, el) {
        patch(
            el, h("pure", {style: "position: absolute; top: 100px;" }, [
                    h("h1", {}, text(state))
            ]));
    }
}

export {UserView as default}