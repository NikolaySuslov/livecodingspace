/*
The MIT License (MIT)
Copyright (c) 2014-2018 Nikolai Suslov and the Krestianstvo.org project contributors. (https://github.com/NikolaySuslov/livecodingspace/blob/master/LICENSE.md)

Virtual World Framework Apache 2.0 license  (https://github.com/NikolaySuslov/livecodingspace/blob/master/licenses/LICENSE_VWF.md)
*/
// VWF & OSC driver

import {Fabric} from '/core/vwf/fabric.js';

class OSCViewDriver extends Fabric {

  constructor(module) {
    console.log("OSCViewDriver constructor");
    super(module, 'View');
  }

  factory() {

    let _self_ = this;

	return this.load(this.module, 
		{

			initialize: function() {
				
				let self = this;

				this.fabric = _self_;
				this.osc = osc;
				this.portValue = '8081';
				this.hostValue = 'localhost';
				this.port = null;
	
				//window._osc = this.osc;
				window._OSCManager = this;
	
			},
	
			firedEvent: function (nodeID, eventName, eventParameters) {
			 
				let self = this;
					if (eventName == 'sendOSC'){
	
					var clientThatSatProperty = self.kernel.client();
					var me = self.kernel.moniker();
	
	
					// If the transform property was initially updated by this view....
					if (clientThatSatProperty == me) {
	
	
						if (self.osc !== null) {
							if (self.getStatus() == 1) {
								self.port.send(eventParameters[0]);
								console.log('send: ' + eventParameters[0]);
							}
						}
					}
	
	
	
					}
				
			},
	
	
			/*
			 * Receives incoming messages
			 */
			calledMethod: function( nodeID, methodName, methodParameters, methodValue ) {
		
	
				let self = this;
				// if (methodName == "sendOSC") {
				// 	if (self.osc !== null) {
				// 		if (this.getStatus() == 1) {
				// 			self.port.send(methodParameters[0]);
				// 			console.log('send: ' + methodParameters);
				// 		}
				// 	}
					
				// }
	
	
				if (methodName == "sendOSCBundle") {
	
					if (self.osc !== null) {
						if (this.getStatus() == 1) {
							self.port.send({
								timeTag: self.osc.timeTag(1), // Schedules this bundle 60 seconds from now.
								packets: [methodParameters[0]]
							}
							);
							console.log('send: ' + methodParameters[0]);
						}
					}
					//console.log("send OSC!!!");
	
				}
	
				
			},
	
			
			setOSCHostAndPort: function(h,p) {
	
				this.hostValue = h;
				this.portValue = p;
				
			},
	
			connect: function() {
				let self = this;
				this.disconnect();
	
				var url = 'wss://' + this.hostValue + ':' + this.portValue;
				if (this.hostValue == 'localhost'){
					url = 'ws://' + this.hostValue + ':' + this.portValue
				}
	
				this.port = new osc.WebSocketPort({
					url: url //'wss://' + this.hostValue + ':' + this.portValue
					//url: "ws://localhost:8081"
					});
				
						this.port.on("message", function (oscMessage) {
						console.log("message", oscMessage);
						_self_.findAllNodesWithOSC(self, oscMessage);
					});
	
					this.port.open();
	
	
			},
	
			disconnect: function() {
				console.log('disconnect');
				if (this.port !== null)
					this.port.close(1000, 'manual close');
	
			},
	
			getStatus: function() {

				if (this.port){
				return this.port.socket.readyState
				} 
				return 3
			}
	
			
		});
	
	}

	findAllNodesWithOSC(view, oscMessage){

		let self = view;
		let kernel = self.kernel.kernel;
		let appID = kernel.application();
		var oscSceneProp = kernel.getProperty(appID, 'osc');
		if (oscSceneProp !== undefined){
			if (oscSceneProp){
				//console.log('now callMethod');
				vwf_view.kernel.callMethod(appID, 'getOSC', [oscMessage]);
			}
		}

		var children = kernel.children(appID);
			children.forEach(function(child){
				var oscprop = kernel.getProperty(child, 'osc');
				if (oscprop !== undefined){
					if (oscprop){
						//console.log('now callMethod');
						vwf_view.kernel.callMethod(child, 'getOSC', [oscMessage]);
					}
				}

			})
		 // var scene = _Editor.getNode(Engine.application());
   //  	 for (var i in scene.children) {
                    
   //                  if (scene.children[i].properties.DisplayName.indexOf("leapmotion") > -1) {
   //                  this.leapHandsID = (scene.children[i].id);
   //              }
   //          }


	}


}

export { OSCViewDriver as default }
