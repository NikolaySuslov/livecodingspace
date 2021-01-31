/*
The MIT License (MIT)
Copyright (c) 2014-2020 Nikolai Suslov and the Krestianstvo.org project contributors. (https://github.com/NikolaySuslov/livecodingspace/blob/master/LICENSE.md)
*/
// VWF & Tone driver

import {Fabric} from '/core/vwf/fabric.js';
//import * as Tone from '/drivers/view/tonejs/dist/Tone.js';

class ToneViewDriver extends Fabric {

  constructor(module) {
    console.log("ToneViewDriver constructor");
    super(module, 'View');
  }

  factory() {

    let _self_ = this;

	return this.load(this.module, 
		{

			initialize: function() {
				
				let self = this;

				this.fabric = _self_;

				this.nodes = {};

				// document.querySelector("button").addEventListener("click", async () => {
				// 	await Tone.start();
				// 	console.log("context started");
				// });


				//window._Tone = Tone.default;

				// this.osc = osc;
				// this.portValue = '8081';
				// this.hostValue = 'localhost';
				// this.port = null;
	
				//window._osc = this.osc;
				// window._OSCManager = this;
	
			},

			createdNode: function (nodeID, childID, childExtendsID, childImplementsIDs,
                childSource, childType, childIndex, childName, callback /* ( ready ) */) {
                let self = this;
                var node = this.state.nodes[childID];
    
                // If the "nodes" object does not have this object in it, it must not be one that
                // this driver cares about
                if (!node) {
                    return;
				}
		
				this.nodes[childID] = {
					id: childID,
					extends: childExtendsID,
					parent: nodeID,
					toneObj: node.toneObj
				};
				
				//parent: this.state.nodes[childID].aframeObj

			},
	
			firedEvent: function (nodeID, eventName, eventParameters) {
			 
				let self = this;
					// if (eventName == 'sendOSC'){
	
					// var clientThatSatProperty = self.kernel.client();
					// var me = self.kernel.moniker();
	
	
					// // If the transform property was initially updated by this view....
					// if (clientThatSatProperty == me) {
	
	
					// 	if (self.osc !== null) {
					// 		if (self.getStatus() == 1) {
					// 			self.port.send(eventParameters[0]);
					// 			console.log('send: ' + eventParameters[0]);
					// 		}
					// 	}
					// }
	
	
	
					// }
				
			},
	
	
			/*
			 * Receives incoming messages
			 */
			calledMethod: function( nodeID, methodName, methodParameters, methodValue ) {
		
				let self = this;

				let node = this.state.nodes[nodeID];
    
                // If the "nodes" object does not have this object in it, it must not be one that
                // this driver cares about
                if (!node) {
                    return;
				}

				if (methodName == "triggerAttackRelease") {
					
					if(node.toneObj){
						const now = Tone.now()
						let notes = methodParameters[0];
						// let notes = methodParameters[0].map(el=>{
						// 	return Tone.Frequency(el).toNote();
						// }) 

						if (self.state.isMembraneSynthDefinition(node.prototypes)) {
							node.toneObj.triggerAttackRelease(notes[0], methodParameters[1][0], now);
						} else if(self.state.isNoiseSynthDefinition(node.prototypes)) {
							node.toneObj.triggerAttackRelease("16n", now)
						} 
						else {
							node.toneObj.triggerAttackRelease(notes, methodParameters[1], now, methodParameters[2])
						}

						
					}
					
				}

				if (methodName == "triggerAttack") {
					
					if(node.toneObj){
						const now = Tone.now()
						node.toneObj.triggerAttack(methodParameters[0], now, methodParameters[1])
					}
					
				}

				if (methodName == "triggerRelease") {
					
					if(node.toneObj){
						node.toneObj.triggerRelease(methodParameters[0], "+0.1")
					}
					
				}

	
				
			},
	



	
			
		});
	
	}




}

export { ToneViewDriver as default }
