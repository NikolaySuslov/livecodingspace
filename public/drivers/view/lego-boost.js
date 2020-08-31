/*
The MIT License (MIT)
Copyright (c) 2014-2018 Nikolai Suslov and the Krestianstvo.org project contributors. (https://github.com/NikolaySuslov/livecodingspace/blob/master/LICENSE.md)

Virtual World Framework Apache 2.0 license  (https://github.com/NikolaySuslov/livecodingspace/blob/master/licenses/LICENSE_VWF.md)
*/
// VWF & Lego Boost driver

import {Fabric} from '/core/vwf/fabric.js';

class LegoBoostView extends Fabric {

  constructor(module) {
    console.log("LegoBoostView constructor");
    super(module, 'View');
  }

  factory() {

    let _self_ = this;

    return this.load(this.module, 
        
        {

            initialize: function () {
    
                let self = this;
                this.fabric = _self_;

                //this.lego = LegoBoost;
    
                //window._osc = this.osc;
                window._LegoView = this;
                this.boost = window._LegoBoost;
    
                this.device = {
                    id: _app.helpers.randId(),
                    info: {}
                }
    
                this.initStream();
    
            },
    
            firedEvent: function (nodeID, eventName, eventParameters) {
                let self = this;
    
                if (eventName == 'done') {
    
                    var clientThatSatProperty = self.kernel.client();
                    var me = self.kernel.moniker();
    
                    // If the transform property was initially updated by this view....
                    if (clientThatSatProperty == me) {
                        //do on event
                    }
                }
    
            },
    
            satProperty: function (nodeId, propertyName, propertyValue) {
    
            },
    
            /*
             * Receives incoming messages
             */
            calledMethod: function (nodeID, methodName, methodParameters, methodValue) {
                let self = this;
    
                let isLegoBoost = _self_.checkLegoID(nodeID);
                let isLegoBoostClone = _self_.checkLegoCloneID(nodeID);
    
                if (self.boost && self.isConnected()) {
                    //if (nodeID.includes(self.device.id)) {
                    if (isLegoBoost || isLegoBoostClone) {
    
                        if (methodName == "getDeviceInfo") {
                            self.device.info = _self_.getDeviceInfo();
                            //sendToAllViews(self.device.info);
                            let key = methodParameters[0];
                            self.kernel.callMethod(nodeID, "gotDeviceInfo", [self.device.info, key]);
                        }
    
    
                        if (methodName == "setDelay") {
    
                            let delayTime = methodParameters[0];
    
                            let promiseAction =
                                async function () {
                                    return new Promise((resolve, reject) => {
                                        setTimeout(function () {
                                            resolve(delayTime)
                                        }, delayTime)
                                    }).then(r => {
                                        return {
                                            check: {
                                                isLegoBoost: isLegoBoost,
                                                isLegoBoostClone: isLegoBoostClone
                                            },
                                            methodName: methodName,
                                            action: "lego",
                                            nodeID: nodeID,
                                            methodParameters: [r]
                                        }
                                    })
                                }
                            self.streamAdapter.induce(promiseAction);
                        }
    
                        if (methodName == "setLed") {
                            //Possible string values: `off`, `pink`, `purple`, `blue`, `lightblue`, `cyan`, `green`, `yellow`, `orange`, `red`, `white`
                            let ledColor = methodParameters[0];
    
                            let promiseAction = async function () {
                                return self.boost.ledAsync(ledColor).then(r => {
                                    return {
                                        check: {
                                            isLegoBoost: isLegoBoost,
                                            isLegoBoostClone: isLegoBoostClone
                                        },
                                        action: "lego",
                                        nodeID: nodeID,
                                        methodName: methodName,
                                        methodParameters: [ledColor],
                                        res: r
                                    }
                                })
                            }
                            self.streamAdapter.induce(promiseAction);
                        }
    
                        if (methodName == "setMotorAngle") {
                            //port, angle, dutyCycle, wait
                            let port = methodParameters[0];
                            let angle = Math.abs(methodParameters[1]);
                            let dutyCycle = methodParameters[2];
    
                            let promiseAction = async function () {
                                return self.boost.motorAngleAsync(port, angle, dutyCycle).then(r => {
                                    return {
                                        check: {
                                            isLegoBoost: isLegoBoost,
                                            isLegoBoostClone: isLegoBoostClone
                                        },
                                        action: "lego",
                                        nodeID: nodeID,
                                        methodName: methodName,
                                        methodParameters: [port, angle, dutyCycle],
                                        res: r
                                    }
                                })
                            }
                            self.streamAdapter.induce(promiseAction);
                        }
    
    
                    } else {
    
                        //It's another Lego boost connected, false by default - ASYNC operations, if true - SEQUENTIAL
    
    
    
                        if (methodName == "sat_setMotorAngle" || methodName == "sat_setLed" || methodName == "sat_setDelay") {
                            if (self.waitPromise) {
                                self.waitPromise.resolve(
                                    {
                                        action: "wait"
                                    }
                                )
                            }
                        }
    
                        if (methodName == "setMotorAngle" || methodName == "setLed" || methodName == "setDelay") {
    
                            if (methodParameters[1] == 'sync' || methodParameters[3] == 'sync') {
    
                                let promiseAction =
                                    async function () {
                                        var _resolve, _reject;
    
                                        self.waitPromise = new Promise((resolve, reject) => {
                                            _resolve = resolve;
                                            _reject = reject;
                                        })
    
                                        self.waitPromise.resolve = _resolve;
                                        self.waitPromise.reject = _reject;
                                        return self.waitPromise
                                    }
                                self.streamAdapter.induce(promiseAction);
                            }
                        }
                    }
    
    
                }
    
    
            },
    
    
            // ticked: function (vwfTime) {
            // 	if (self.boost){
            // 		if (self.boost.deviceInfo.connected){
            // 		let legoBoostNode = self.device.id;
            // 		self.kernel.callMethod(legoBoostNode, "gotDeviceInfo", [self.device.info]);
            // 			}
            // 	}
            // },
    
            connect: function () {
    
                //connect
                console.log('connect Lego boost!');
                this.boost.connect();
    
            },
    
    
            disconnect: function () {
                console.log('disconnect Lego boost!');
                this.boost.disconnect();
                //
    
            },
    
            testLED: function () {
    
                //connect
                console.log('test Lego Boost');
                this.boost.changeLed();
    
            },
    
    
            isConnected: function () {
                return this.boost.deviceInfo.connected
            },
    
            changeDeviceID: function (id) {
                this.device.id = id
            },
    
    
            initStream: function () {
                let self = this;

                console.log("Init stream of promises!");
    
                self.streamScheduler = M.scheduler.newDefaultScheduler();
                const [induce, events] = M.createAdapter();
                self.streamAdapter = {
                    induce: induce,
                    events: events
                }
    
                const tapFunction = function (res) {
                    if (res && res.action == "lego") {
                        //call sat_ only on master lego (not clones if exist)
                        if (res.check.isLegoBoost) {
                            self.kernel.callMethod(res.nodeID, "sat_" + res.methodName, res.methodParameters)
                        }
                    }
                    console.log(res);
                }
    
                const result = M.concatMap((x) => M.fromPromise(x()), events);
                self.eventsStream = M.tap(res => { tapFunction(res) }, result); //mostCore.awaitPromises(events)
                M.runEffects(self.eventsStream, self.streamScheduler);
    
            }
        })
    }


	getDeviceInfo() {

        let self = this.instance;

		let deviceInfo = {
			led: self.boost.color,
			color: self.boost.deviceInfo.color,
			connected: self.boost.deviceInfo.connected,
			distance: self.boost.deviceInfo.distance,
			error: self.boost.deviceInfo.error,
			rssi: self.boost.deviceInfo.rssi,
			tilt: self.boost.deviceInfo.tilt,
			ports: {
				A: {
					action: self.boost.deviceInfo.ports.A.action,
					angle: self.boost.deviceInfo.ports.A.angle,
				},
				B: {
					action: self.boost.deviceInfo.ports.B.action,
					angle: self.boost.deviceInfo.ports.B.angle,
				},
				AB: {
					action: self.boost.deviceInfo.ports.AB.action,
					angle: self.boost.deviceInfo.ports.AB.angle,
				},
				C: {
					action: self.boost.deviceInfo.ports.C.action,
					angle: self.boost.deviceInfo.ports.C.angle,
				},
				D: {
					action: self.boost.deviceInfo.ports.D.action,
					angle: self.boost.deviceInfo.ports.D.angle,
				},
				LED: {
					action: self.boost.deviceInfo.ports.LED.action,
					angle: self.boost.deviceInfo.ports.LED.angle,
				}
			}
		}


		return deviceInfo

	}

	checkLegoID(nodeID) {

        let self = this.instance;

		let prop = vwf.getProperty(nodeID, 'boostID');
		if (prop !== undefined) {
			return (prop == self.device.id) ? true : false
		}
		return false
	}

	checkLegoCloneID(nodeID) {

        let self = this.instance;

		let prop = vwf.getProperty(nodeID, 'boostID');
		if (prop !== undefined) {
			return (prop.includes(self.device.id + '_clone')) ? true : false
		}
		return false
	}
    

}

export { LegoBoostView as default }