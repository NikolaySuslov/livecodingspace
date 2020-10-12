/*
The MIT License (MIT)
Copyright (c) 2014-2020 Nikolai Suslov and the Krestianstvo.org project contributors. (https://github.com/NikolaySuslov/livecodingspace/blob/master/LICENSE.md)

*/

import {Fabric} from '/core/vwf/fabric.js';

class AFrameARView extends Fabric {

  constructor(module) {
    console.log("AFrameARView constructor");
    super(module, 'View');
  }

  factory() {

    let _self_ = this;

	return this.load(this.module, 
		{

			initialize: function() {
				let self = this;
				this.fabric = _self_;
				
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
				let self = this;
				//let viewDriver = vwf.views["vwf/view/aframe"];
	
				let viewDriver = vwf.views["/drivers/view/aframe"];
				if (!viewDriver) {
					return;
				}

				let node = viewDriver.state.nodes[childID];
				if (!node) {
					return;
				}
	
				if (viewDriver.state.scenes[childID]) {
					let scene = viewDriver.state.scenes[childID];
					scene.setAttribute('embedded', {});
					scene.setAttribute('arjs', {trackingMethod: "best", sourceType: "webcam", debugUIEnabled: "false"});
				}
	
				if (viewDriver.state.nodes[childID].extendsID == "proxy/aframe/acamera.vwf") {
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
				let self = this;

				let viewDriver = vwf.views["/drivers/view/aframe"];
				if (!viewDriver) {
					return;
				}

				var node = viewDriver.state.nodes[nodeID];
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

	}

}

export { AFrameARView as default }