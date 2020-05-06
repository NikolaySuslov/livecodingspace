/*
The MIT License (MIT)
Copyright (c) 2014-2018 Nikolai Suslov and the Krestianstvo.org project contributors. (https://github.com/NikolaySuslov/livecodingspace/blob/master/LICENSE.md)

Virtual World Framework Apache 2.0 license  (https://github.com/NikolaySuslov/livecodingspace/blob/master/licenses/LICENSE_VWF.md)
*/
// VWF & OSC driver

define(["module", "vwf/view", "vwf/view/arjs/aframe-ar"], function(module, view, arjs) {

	return view.load(module, {

		initialize: function() {
			//window.signals = signals;
			self = this;
			this.viewDriver = vwf.views["vwf/view/aframe"];
 
		},

		createdNode: function (nodeID, childID, childExtendsID, childImplementsIDs,
            childSource, childType, childIndex, childName, callback /* ( ready ) */) {

            // var node = this.state.nodes[childID];

            // // If the "nodes" object does not have this object in it, it must not be one that
            // // this driver cares about
            // if (!node) {
            //     return;
            // }

		},

		initializedNode: function (nodeID, childID) {

			//let viewDriver = vwf.views["vwf/view/aframe"];

		
            var node = self.viewDriver.state.nodes[childID];
            if (!node) {
                return;
			}

			if (self.viewDriver.state.scenes[childID]) {
				let scene = self.viewDriver.state.scenes[childID];
				scene.setAttribute('embedded', {});
				scene.setAttribute('arjs', {trackingMethod: "best", sourceType: "webcam", debugUIEnabled: "false"});
			}

			if (self.viewDriver.state.nodes[childID].extendsID == "http://vwf.example.com/aframe/acamera.vwf") {
				//if(!childID.includes('avatar')){
				if(node.type == 'ar'){
					console.log(childID);
					vwf_view.kernel.callMethod(childID, "setCameraToActive", [vwf.moniker_]);
				}
			}


		},


		firedEvent: function (nodeID, eventName, eventParameters) {

			// var node = self.viewDriver.state.nodes[nodeID];
            // if (!node) {
            //     return;
			// }

			// if (eventName == "createAvatar") {
			// 	let avatarName = 'avatar-' + self.kernel.moniker();
			// 	vwf_view.kernel.callMethod(avatarName, "showHideAvatar", false);
            // }

		},


		/*
		 * Receives incoming messages
		 */
		calledMethod: function( nodeID, methodName, methodParameters, methodValue ) {
			
			var node = self.viewDriver.state.nodes[nodeID];
            if (!node) {
                return;
			}


			if (methodName == "createAvatarBody") {
				let avatarName = 'avatar-' + self.kernel.moniker();
				if (nodeID == avatarName) {
					vwf_view.kernel.callMethod(nodeID, "showHideAvatar", [false]);
				}


        		}

			
			}




	})

});