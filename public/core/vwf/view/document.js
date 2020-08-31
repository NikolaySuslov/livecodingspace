//"use strict";
/*
The MIT License (MIT)
Copyright (c) 2014-2018 Nikolai Suslov and the Krestianstvo.org project contributors. (https://github.com/NikolaySuslov/livecodingspace/blob/master/LICENSE.md)

Virtual World Framework Apache 2.0 license  (https://github.com/NikolaySuslov/livecodingspace/blob/master/licenses/LICENSE_VWF.md)
*/
import {Fabric} from '/core/vwf/fabric.js';

class VWFDocument extends Fabric {

  constructor(module) {
    console.log("Document constructor");
    super(module, 'View');
  }

  factory() {

    let _self_ = this;

    return this.load(this.module, {

      // == Module Definition ====================================================================

      initialize: function () {
        window.vwf_view = this;
        this.fabric = _self_;
      },

      // == Model API ============================================================================

      createdNode: function (nodeID, childID, childExtendsID, childImplementsIDs,
        childSource, childType, childURI, childName, callback /* ( ready ) */ ) {

        let self = this;
        // At the root node of the application, load the UI chrome if available.

        if (childID == this.kernel.application() &&
          (window.location.protocol == "http:" || window.location.protocol == "https:")) {

          // Suspend the queue.

          callback(false);

          let moduleData = vwf.doc;
          if (moduleData) {
          var source;
          if(moduleData.startsWith('{')){  //EXAMPLE: {"url": "/defaults/worlds/pure/driver.js"}
            source = JSON.parse(moduleData).url;
          } else { //LOAD MODULE from string
            let data = _self_.helpers.replaceSubStringALL(moduleData, '$host', window.location.origin);
            source = "data:text/javascript;base64," + btoa(data);
          }

          import(source).then(res => {

            if (self.createdNode !== Object.getPrototypeOf(self).createdNode) {
              self.createdNode(nodeID, childID, childExtendsID, childImplementsIDs,
                childSource, childType, childURI, childName);
            }
            
            this.userView = new res.default;
            callback(true);
          })
        } else {
          setTimeout(() => {
            callback(true);
          }, 0);

        }

        }

      },

    }, function (viewFunctionName) {

      // == View API =============================================================================

    });


  }

}


export { VWFDocument as default}