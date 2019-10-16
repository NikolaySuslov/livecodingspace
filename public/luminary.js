/*
The MIT License (MIT)
Copyright (c) 2014-2019 Nikolai Suslov and the Krestianstvo.org project contributors. (https://github.com/NikolaySuslov/livecodingspace/blob/master/LICENSE.md)
*/

import { Helpers } from '/helpers.js';

class Luminary {
    constructor() {
        console.log("luminary constructor");
        this.helpers = new Helpers;
        this.info = {};
        this.pendingList = [];
        this.status = { pending: true, initialized: false, trials: 3 };
        this.clients = {};
        this.heartbeat = {}
        this.clientID = undefined;
        this.namespace = undefined;
    }

    unsubscribeFromHeartbeat() {
        //TODO
    }

    subscribeOnHeartbeat(heartbeat) {

        let self = this;

        heartbeat.on(resp => {

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
        let instance = _LCSDB.get(this.namespace);

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

        var message = source.tick
        if(typeof message == "string"){
            message  = JSON.parse(source.tick);
        }
        

        // if(message.sender){
        //     console.log("HEARTBEAT FROM: " + message.sender);
        // }

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

    stampExternalMessage(msg) {

        let message = Object.assign({}, msg);
        message.client = this.clientID;

        let instance = _LCSDB.get(this.namespace)//_LCSDB.get(meta.namespace);

        if (message.result === undefined) {

            instance.get('message').get('tick').put(JSON.stringify(message));

        } else if (message.action == "getState") {

            let state = message.result;//JSON.stringify(message.result);
            let toClient = message.parameters[0];

            let newMsg =
                JSON.stringify({
                    action: "setState",
                    parameters: [state],
                    time: 'tick', //self.setStateTime,
                    explicit: toClient
                })

            instance.get('message')
                .get('tick')
                .put(newMsg)

        } else if (message.action === "execute") {
            console.log("!!!! execute ", message)
        }

    }

    onMessage(message) {

        try {

            var fields = Object.assign({}, message);

            vwf.private.queue.insert(fields, !fields.action); // may invoke dispatch(), so call last before returning to the host

        } catch (e) {

            vwf.logger.warn(fields.action, fields.node, fields.member, fields.parameters,
                "exception performing action:", require("vwf/utility").exceptionMessage(e));

        }
    }


    async connect(path) {

        let self = this;

        let objForQuery = this.helpers.reduceSaveObject(path);

        this.clientID = Gun.text.random();
        this.namespace = this.helpers.GetNamespace(path.path);

        //vwf.moniker_ = clientID;  

        this.info = {
            pathname: window.location.pathname.slice(1,
                window.location.pathname.lastIndexOf("/")),
            appRoot: "./public",
            path: JSON.stringify(objForQuery), //JSON.stringify(path)
            namespace: this.namespace,
        }

        //set an instance with namespace
        let luminaryPath = _app.luminaryPath;
        let lum = _LCSDB.get(luminaryPath);

        let instance = _LCSDB.get(this.namespace);

        instance.not(function (res) {
            instance
                .put(self.info)
                .put({
                    'start_time': 'start_time',
                    'rate': 1
                });
            lum.get('instances').set(instance);
            self.status.initialized = "first";
        });

        await instance.once(res => {
            self.start_time = Gun.state.is(res, 'start_time');
            self.rate = res.rate;
        }).promOnce();


        let client = _LCSDB.get(self.clientID).put({ id: self.clientID, instance: self.namespace, user: path.user }).once(res => {
            self.setStateTime = Gun.state.is(res, 'id');
            setInterval(function () {
                client.get('live').put('tick');
            }, 500);
        });
        instance.get('clients').set(client);
        lum.get('allclients').set(client);

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

                    if (self.status.initialized == "first"  && self.setStateTime) {

                        self.status.initialized = true;
                        instance
                            .put({
                                'start_time': 'start_time',
                                'rate': 1
                            }).once(res => {
                                self.start_time = Gun.state.is(res, 'start_time');
                                self.rate = res.rate;

                                if (!_app.isLuminaryGlobalHB) {
                                    let tickMsg = {
                                        parameters: "[]",
                                        time: 'tick', //hb
                                        sender: self.clientID
                                    };
                                    instance.get('heartbeat').get('tick').put(tickMsg);
                                    self.initHeartBeat();
                                }

                                self.initFirst(res);
                                self.initDeleteClient();



                            });

                        let noty = new Noty({
                            text: "FIRST CLIENT",
                            timeout: 1000,
                            theme: 'mint',
                            layout: 'bottomRight',
                            type: 'success'
                        });

                        noty.show();
                    } else if (!self.status.initialized && self.setStateTime) {

                        if (res.id == self.clientID && self.status.trials > 0) {
                            self.status.trials = self.status.trials - 1;
                            console.log("CONNECTION TRIALS FOR: " + res.id + ' - ' + self.status.trials);
                        } else if (res.id !== self.clientID && self.clients[res.id].live - self.clients[res.id].old < 1000) {
                            console.log("REQUEST STATE FROM: " + res.id);

                            self.status.initialized = true;

                            if (!_app.isLuminaryGlobalHB) {
                                self.initHeartBeat();
                            }

                            self.initOtherClient(res);
                            self.initDeleteClient();


                            let noty = new Noty({
                                text: "CONNECTING TO EXISTED CLIENT...",
                                timeout: 1000,
                                theme: 'mint',
                                layout: 'bottomRight',
                                type: 'success'
                            });

                            noty.show();


                        } else if (res.id == self.clientID && self.status.trials == 0) {
                            console.log("INITIALIZE WORLD FOR: " + res.id);

                            //request for the new instance 
                            let path = JSON.parse(self.info.path);
                            window.location.pathname = path.user + path.path["public_path"];
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


    clientsMessage() {

        let self = this;

        let clientDescriptor = { extends: "http://vwf.example.com/client.vwf" };
        let clientNodeMessage =
        {
            action: "createChild",
            parameters: ["http://vwf.example.com/clients.vwf", self.clientID, clientDescriptor],
            time: 'tick'
        }

        return clientNodeMessage

    }

    initFirst(ack) {

        let self = this;
        let instance = _LCSDB.get(self.namespace);

        let clientMsg =
            JSON.stringify({
                action: "createNode",
                parameters: ["http://vwf.example.com/clients.vwf"],
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


        instance.get('message')
            .get('tick')
            .put(clientMsg);

        instance.get('message')
            .get('tick')
            .put(appMsg, res => {

                self.status.pending = false;

                let clientsMessage = self.clientsMessage();
                instance.get('message')
                    .get('tick')
                    .put(JSON.stringify(clientsMessage), res => {
                        console.log("CREATE CLIENT: - " + res);
                    })
            });

    }


    initOtherClient(ack) {

        console.log('new other client');

        let self = this;
        let instance = _LCSDB.get(self.namespace);

        let masterID = ack.id;

        let msg =
            JSON.stringify({
                action: "getState",
                respond: true,
                time: 'tick',
                explicit: masterID,
                parameters: [self.clientID]
            })

        instance.get('message')
            .get('tick')
            .put(msg);

        let clientsMessage = self.clientsMessage();

        instance.get('message')
            .get('tick').put(JSON.stringify(clientsMessage), res=>{
              
                    console.log("CREATE CLIENT: - " + res);
            });

    }


    initHeartBeat() {

        let self = this;
        let instance = _LCSDB.get(self.namespace);

        setInterval(function () {

            let message = {
                parameters: "[]",
                time: 'tick', //hb
                sender: self.clientID

            };

            instance.get('heartbeat').get('tick').once(data => {
                if (data) {

                    //let res = JSON.parse(data);

                    var res = data
                    if(typeof res == "string"){
                        res = JSON.parse(source.tick);
                    }

                    if (res.sender) {

                        let now = Gun.time.is();
                        let diff = now - self.heartbeat.lastTick;
                        if ((Object.keys(self.clients).length == 1)
                            || (res.sender == self.clientID && diff < 1000)
                            || (res.sender !== self.clientID && diff > 1000)) {

                            //console.log("TICK FROM" + self.clientID);    
                            instance.get('heartbeat').get('tick').put(message, function (ack) {
                                if (ack.err) {
                                    console.log('ERROR: ' + ack.err)
                                }
                            });
                        }
                    }
                }
            })
        }, 50);
    }


    initDeleteClient() {

        let self = this;
        let instance = _LCSDB.get(self.namespace);

        setInterval(function () {
            Object.keys(self.clients).forEach(el => {
                let current = Gun.time.is();

                if (el !== self.clientID) {
                    if (current - self.clients[el].live > 10000) {
                        console.log("CLIENT DISCONECTED : " + el);

                        let clientDeleteMessage =
                        {
                            action: "deleteChild",
                            parameters: ["http://vwf.example.com/clients.vwf", el],
                            time: 'tick'
                        };

                        instance.get('message')
                            .get('tick').once(res => {
                                instance.get('message')
                                    .get('tick')
                                    .put(JSON.stringify(clientDeleteMessage), res => {

                                        instance.get('clients').get(el).put(null);
                                        delete self.clients[el];
                                    })
                            })
                    }
                }
            })
        }, 5000);
    }


}

export { Luminary }