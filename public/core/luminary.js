/*
The MIT License (MIT)
Copyright (c) 2014-2020 Nikolai Suslov and the Krestianstvo.org project contributors. (https://github.com/NikolaySuslov/livecodingspace/blob/master/LICENSE.md)
*/

//import { Helpers } from '/helpers.js';

class Luminary {
    constructor() {
        console.log("luminary constructor");
        this.helpers = _app.helpers; //new Helpers;
        this.info = {};
        this.pendingList = [];
        this.status = {
            pending: true,
            initialized: false
        };
        this.clients = {};
        this.heartbeat = {}
        this.clientID = undefined;
        this.namespace = undefined;
    }

    createStream() {
        let self = this;

        this.streamScheduler = M.scheduler.newDefaultScheduler();
        const [induce, events] = M.createAdapter();

        this.streamAdapter = {
            induce: induce,
            events: events,
        };

        const eventsStream = M.multicast(events);


        const clientDelete = M.tap(el => {
            console.log("Check for deletion: ", el);
            self.deleteClient();
        }, M.constant('delete', M.periodic(5000)));

        const clientLive = M.tap(el => {
            //console.log("LIVE: ", el);
            _lum.get(this.namespace).get('clients').get(self.clientID).get('live').put('tick');
        }, M.constant('live', M.periodic(500)));

        const hb = M.tap(el => {
            if (self.hbInit) {
                self.checkForHB();
            }
        }, M.constant('heartbeat', M.periodic(50)));

        const allStreams = M.mergeArray([eventsStream, hb, clientLive, clientDelete]);

        const tapFunction = function (el) {
            //console.log('FINAL TAP: ', el)
        }

        const finalStream = M.tap((res) => {
            tapFunction(res);
        }, allStreams);

        M.runEffects(finalStream, this.streamScheduler);

    }

    unsubscribeFromHeartbeat() {
        //TODO
    }

    subscribeOnHeartbeat(heartbeat) {

        let self = this;

        heartbeat.put({
            'tick': 0
        }).on(resp => {

            var res = Gun.obj.copy(resp);
            if (res.tick) {

                if (self.start_time) {

                    let currentTick = Gun.state.is(res, 'tick');
                    self.heartbeat.lastTick = currentTick;

                    let msg = self.stamp(res);

                    if (!self.status.pending) {
                        self.onMessage(msg)
                    } else {
                        self.pendingList.push(msg);
                    }
                }
            }
        })

    }

    subscribeOnMessages() {

        let self = this;
        let instance = _lum.get(this.namespace);

        instance.get('message').on(resp => {
            var res = Gun.obj.copy(resp);
            if (res.tick) {
                if (self.start_time) {
                    let msg = self.stamp(res);

                    if (msg.explicit) {
                        if (msg.explicit == vwf.moniker_) {
                            self.onMessage(msg);

                            if (msg.action == 'setState') {
                                if (self.status.pending) {
                                    self.distributePendingMessages();
                                    self.status.pending = false;
                                }
                            }
                            console.log(res);
                        }

                    } else if (!self.status.pending) {
                        self.onMessage(msg);
                    } else {
                        self.pendingList.push(msg);
                    }
                }
            }
        })
    }

    stamp(source) {

        let self = this;

        var message = source.tick
        if (typeof message == "string") {
            message = JSON.parse(source.tick);
        }

        if (message.sender) {
            //console.log("HEARTBEAT FROM: " + message.sender);
            self.heartbeat.sender = message.sender;
        }

        message.state = Gun.state.is(source, 'tick');
        message.start_time = this.start_time; //Gun.state.is(source, 'start_time');
        message.rate = this.rate; //source.rate;

        var time = ((message.state - message.start_time) * message.rate) / 1000;

        if (message.action == 'getState') {
            console.log('GET STATE msg!!!');
        }

        if (message.action == 'setState') {
            time = ((this.setStateTime - message.start_time) * message.rate) / 1000;
        }

        message.time = Number(time);
        message.origin = "reflector";

        return message
    }

    async stampExternalMessage(msg) {

        let message = Object.assign({}, msg);
        message.client = this.clientID;

        let instance = _lum.get(this.namespace) //_LCSDB.get(meta.namespace);

        if (message.result === undefined) {

            instance.get('message').get('tick').put(JSON.stringify(message));

        } else if (message.action == "getState") {

            let state = message.result; //JSON.stringify(message.result);
            let toClient = message.parameters[0];

            let newMsg =
                JSON.stringify({
                    action: "setState",
                    parameters: [state],
                    time: 'tick', //self.setStateTime,
                    explicit: toClient
                })

            await (new Promise(res => {
                instance.get('message')
                    .get('tick')
                    .put(newMsg).once(res)
            })).then(res => {
                console.log("Set state")
            })

        } else if (message.action === "execute") {
            console.log("!!!! execute ", message)
        }

    }

    onMessage(message) {

        try {

            var fields = Object.assign({}, message);

            if (_app.config.streamMsg) {
                vwf.virtualTime.streamAdapter.induce(fields);
            } else {
                vwf.virtualTime.insert(fields, !fields.action);
            }


        } catch (e) {

            vwf.logger.warn(fields.action, fields.node, fields.member, fields.parameters,
                "exception performing action:", vwf.utility.exceptionMessage(e));

        }
    }

    async connect(path) {

        let self = this;

        let objForQuery = this.helpers.reduceSaveObject(path);

        this.clientID = Gun.text.random();
        this.namespace = this.helpers.GetNamespace(path.path);

        //vwf.moniker_ = self.clientID;  

        this.info = {
            pathname: window.location.pathname.slice(1,
                window.location.pathname.lastIndexOf("/")),
            appRoot: "./public",
            path: JSON.stringify(objForQuery), //JSON.stringify(path)
            namespace: this.namespace,
        }

        //set an instance with namespace


        if (_app.config.multisocket) {
            let luminaryPath = _app.luminaryPath

            if (luminaryPath) {
                window._lum = Gun({
                    peers: [luminaryPath + "/" + path.path.instance],
                    musticast: false,
                    localStorage: false,
                    radisk: false,
                    file: false
                });
            }

        } else {
            window._lum = _LCSDB;
        }

        self.createStream();

        let instance = _lum.get(this.namespace);
        //_lum.get('instances').set(instance);

        instance.not(function (res) {
            instance
                .put(self.info)
                .put({
                    'start_time': 'start_time',
                    'rate': 1
                    //'message':{}
                });
            _lum.get('instances').set(instance);
            self.status.initialized = "first";
        });


        await (new Promise(res => {
            instance.once(res)
        })).then(res => {
            self.start_time = Gun.state.is(res, 'start_time');
            self.rate = res.rate;
        })

        let client = _lum.get(self.clientID).put({});
        await (new Promise(res => {
            instance.get('clients').set(client).once(res)
        })).then(r => {
            instance.get('clients').get(self.clientID).put({
                id: self.clientID,
                instance: self.namespace,
                user: path.user
            });
        });

        _lum.get('allclients').set(client);

        await (new Promise(res => {
            _lum.get(self.clientID).once(res)
        })).then(res => {
            self.setStateTime = Gun.state.is(res, 'id');
        })

        instance.get('clients').map().on(res => {
            if (res) {
                if (res.id && res.live) {

                    let clientTime = Gun.state.is(res, 'live');
                    //let now = Gun.time.is();

                    //console.log("NEW CLIENT LIVE : " + res.id);
                    if (!self.clients[res.id]) {
                        self.clients[res.id] = {
                            live: clientTime,
                            old: clientTime
                        }
                    } else {
                        self.clients[res.id].old = self.clients[res.id].live;
                        self.clients[res.id].live = clientTime
                    }

                    if (self.status.initialized == "first" && self.setStateTime) {

                        self.status.initialized = true;
                        instance
                            .put({
                                'start_time': 'start_time',
                                'rate': 1
                            }).once(res => {
                                self.start_time = Gun.state.is(res, 'start_time');
                                self.rate = res.rate;

                                if (!vwf.isLuminaryGlobalHB) {
                                    self.hbInit = true;
                                }
                                self.initFirst(res);
                            });

                        _app.helpers.notyOK("FIRST CLIENT");

                    } else if (!self.status.initialized && self.setStateTime) {

                        // if (self.clients.length == 1 && res.id == self.clientID){
                        //     console.log("THAT'S ME and ONLY ONE");
                        //             //request for the new instance 
                        //     let path = JSON.parse(self.info.path);
                        //     window.location.pathname = path.user + path.path["public_path"];

                        // }
                        // else 
                        if (res.id == self.clientID) {
                            console.log("THAT'S ME");
                        } else if (self.clients[res.id].live - self.clients[res.id].old == 0 || self.clients[res.id].live - self.clients[res.id].old > 1000) {
                            console.log("OLD CLIENT!");
                        } else {
                            console.log("REQUEST STATE FROM: " + res.id);

                            self.status.initialized = true;

                            if (!vwf.isLuminaryGlobalHB) {
                                self.hbInit = true;
                            }

                            self.initOtherClient(res);

                            _app.helpers.notyOK("CONNECTING TO EXISTED CLIENT...");

                        }
                    }
                }
            }
        })

        return path
    }

    distributePendingMessages() {

        let self = this;

        if (self.pendingList.length > 0) {
            console.log("!!!! getPendingMessages");
            let cloneList = [...self.pendingList];
            cloneList.forEach(el => {
                self.onMessage(el);
            })
            self.pendingList = [];
            //_app.status.pending = false;
        }
    }


    clientMessage() {

        let self = this;

        let clientDescriptor = {
            extends: "proxy/client.vwf"
        };
        let clientNodeMessage = {
            action: "createChild",
            parameters: ["proxy/clients.vwf", self.clientID, clientDescriptor],
            time: 'tick'
        }

        return clientNodeMessage
    }

    async initFirst(ack) {

        let self = this;
        let instance = _lum.get(self.namespace);

        let clientMsg =
            JSON.stringify({
                action: "createNode",
                parameters: ["proxy/clients.vwf"],
                time: 'tick',
                explicit: self.clientID
            })

        let processedURL = JSON.parse(self.info.path).path;

        let appMsg =
            JSON.stringify({
                action: "createNode",
                parameters: [
                    (processedURL.public_path === "/" ? "" : processedURL.public_path) + "/" + processedURL.application,
                    "application"
                ],
                time: 'tick',
                explicit: self.clientID
            })

        await (new Promise(res => {
            instance.get('message').put({})
                .get('tick')
                .put(clientMsg).once(res)
        })).then(res => {
            return new Promise(r => instance.get('message')
                .get('tick')
                .put(appMsg).once(r))
        }).then(r => {

            self.status.pending = false;

            let clientMessage = self.clientMessage();
            instance.get('message')
                .get('tick')
                .put(JSON.stringify(clientMessage), res => {
                    console.log("CREATE CLIENT: - " + res);
                })

        })

    }


    async initOtherClient(ack) {

        console.log('new other client');

        let self = this;
        let instance = _lum.get(self.namespace);

        let masterID = ack.id;

        let msg =
            JSON.stringify({
                action: "getState",
                respond: true,
                time: 'tick',
                explicit: masterID,
                parameters: [self.clientID]
            })


        await (new Promise(res => {
            instance.get('message')
                .get('tick')
                .put(msg).once(res)
        })).then(res => {

            let clientMessage = JSON.stringify(self.clientMessage());

            return new Promise(r =>
                instance.get('message')
                .get('tick')
                .put(clientMessage).once(r))
        }).then(r => {

            console.log("CREATE CLIENT: - " + r);

        })


    }


    makeHB() {
        let self = this;

        //console.log("HeartBeat");

        let message = {
            parameters: "[]",
            time: 'tick', //hb
            sender: self.clientID

        };

        _lum.get(self.namespace).get('heartbeat').get('tick').put(JSON.stringify(message), function (ack) {
            if (ack.err) {
                //console.log('ERROR: ' + ack.err)
            }
        });

    }

    checkForHB() {

        let self = this;

        let sender = self.heartbeat.sender;

        let now = Gun.time.is();
        let diff = now - self.heartbeat.lastTick;


        if ((Object.keys(self.clients).length == 1) ||
            (sender == self.clientID && diff < 1000) ||
            (sender !== self.clientID && diff > 1000)) {

            self.makeHB()
        }
    }

    deleteClient() {

        let self = this;
        let instance = _lum.get(self.namespace);

        Object.keys(self.clients).forEach(el => {
            let current = Gun.time.is();

            if (el !== self.clientID) {
                if (current - self.clients[el].live > 10000) {
                    console.log("CLIENT DISCONECTED : " + el);

                    let clientDeleteMessage = {
                        action: "deleteChild",
                        parameters: ["proxy/clients.vwf", el],
                        time: 'tick'
                    };

                    new Promise(res => {
                        instance.get('message')
                            .get('tick')
                            .put(JSON.stringify(clientDeleteMessage)).once(res)
                    }).then(res => {

                        instance.get('clients').get(el).put(null);
                        delete self.clients[el];

                    })
                }
            }

        })
    }
}

export {
    Luminary
}