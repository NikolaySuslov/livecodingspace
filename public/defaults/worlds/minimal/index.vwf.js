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

                ["time", "clicks", "random"].forEach(name => {

                    let el = document.createElement(name);
                    el.setAttribute("id", name);
                    document.querySelector("body").appendChild(el);

                })

                self.satTime(0);
                self.satClicks(0);
                self.satRandom(0);

            }
        }

        vwf_view.satProperty = function (nodeID, propertyName, propertyValue) {

            if (propertyValue === undefined || propertyValue == null) {
                return;
            }
            //let el = document.querySelector("[id='" + nodeID + "']");

            if (!document.getElementById("time"))
                 return


            if (propertyName == 'timeCount') {
                self.satTime(propertyValue);
            }

            if(propertyName == 'clicks'){
                self.satClicks(propertyValue)
            }

            if(propertyName == 'randomNumber'){
                self.satRandom(propertyValue);

                //update body color
                let randomColor = Math.floor(parseFloat(propertyValue)*16777215).toString(16);
                document.body.style.backgroundColor = "#" + randomColor;
            }

        }
    }

    satTime(state) {
        patch(
            document.getElementById("time"), 
            h("time", {style: "position: absolute; top: 100px; margin-left: 20px;" }, [
                    h("h2", {}, text('Time: ')), 
                    h("h1", {}, text(Math.floor(state)))
        ]))
    }

    satClicks(state) {
        patch(
          document.getElementById("clicks"),
          h("clicks", {style: "position: absolute; top: 240px; margin-left: 20px;"}, [
            h("h2", {}, text('Clicks: ')), 
            h("h1", {}, text(state)),
            h("button", { onclick: () => vwf_view.kernel.callMethod(vwf.application(), "incClicks") }, text("+")),
            h("button", { onclick: () => vwf_view.kernel.callMethod(vwf.application(), "decClicks") }, text("-"))
          ])
        )
    }

    satRandom(state) {
        patch(
          document.getElementById("random"),
          h("random", {style: "position: absolute; top: 400px; margin-left: 20px;"}, [
            h("h2", {}, text('Random number: ')), 
            h("h1", {}, text(state)),
            h("button", { onclick: () => vwf_view.kernel.callMethod(vwf.application(), "getRandom") }, text("Generate"))
          ])
        )
    }
}

export {UserView as default}