/*
The MIT License (MIT)
Copyright (c) 2014-2018 Nikolai Suslov and the Krestianstvo.org project contributors. (https://github.com/NikolaySuslov/livecodingspace/blob/master/LICENSE.md)

Virtual World Framework Apache 2.0 license  (https://github.com/NikolaySuslov/livecodingspace/blob/master/licenses/LICENSE_VWF.md)
*/

import { Helpers } from '/helpers.js';

class Reflector {
    constructor() {
        console.log("reflector constructor");
        this.helpers = new Helpers;
        this.instanceTimers = {};
        this.clients = {};
        this.info = {};
        this.pendingList = [];
    }


    async connectToReflector(path) {

        var self = this;

        let original = Object.assign({}, path);
        let objToRef = Object.assign({}, path);

        if (path.saveObject) {
            if (path.saveObject["queue"]) {
                if (path.saveObject["queue"]["time"]) {
                    objToRef.saveObject = {
                        "init": true,
                        "queue": {
                            "time": path.saveObject["queue"]["time"]
                        }
                    }
                }
            }
        }

        var clientID = Gun.text.random();

        var namespace = _app.helpers.GetNamespace(path.path);

        //vwf.moniker_ = clientID;  

        let query = {
            pathname: window.location.pathname.slice(1,
                window.location.pathname.lastIndexOf("/")),
            appRoot: "./public",
            path: JSON.stringify(objToRef), //JSON.stringify(path)
            //clientID: clientID,
            namespace: namespace,
            //pending: true
        }

        //set an instance with namespace and client id
        let ref = _LCSDB.get('reflector5');

        let instance = _LCSDB.get(namespace);
        instance.not(function (res) {
            instance.put(query);
            ref.get('instances').set(instance);
        });

        this.info = query;
        this.client = clientID;

        Gun.chain.heartbeat = function (time, rate) {
            // our gun instance
            var gun = this;
            var start_time = Gun.state() - time;
            self.start_time = start_time;
            self.rate = rate;
            self.setStateTime = self.getNowTime();
            console.log("start time: ", start_time);
            gun.put({
                'start_time': start_time,
                'rate': 1
            }).once(function (res) {

                setInterval(function () {
                    let getTime = function () {
                        return (Gun.state() - self.start_time) * 1.0;
                    }
                    let hb = getTime() / 1000;
                    let message = JSON.stringify({
                        parameters: [],
                        time: hb
                    });
                    gun.get('tick').put(message);

                    if (self.pendingList.pending) {
                        self.pendingList.push(message);
                    }
                }, 50);
            })

            // return gun so we can chain other methods off of it
            return gun;
        }


        let client = _LCSDB.get(clientID);
        client.put(
            { id: clientID, master: false, status: { pending: true } }, function (ack) {
                self.clients[clientID] = { pending: true };

                instance.get('clients').not(res => {
                    _LCSDB.get(clientID).get('master').put(true);
                });

                instance.get('clients').set(client);
            });


        instance.get('clients').map().on(function (res, id) {

            console.log('add new client!');

            var clientIde = res.id;
            self.clients[clientIde] = res;

            if (clientIde == clientID) {
                self.clients[clientIde].pending = true
            }

            if (self.clients[clientID]) {
                if (self.clients[clientID].master) {

                    if (res.master) {
                        instance.get('heartbeat').not(function (res) {
                            instance.get('heartbeat').put({ tick: "{}" }).heartbeat(0.0, 1);

                            instance.get('ref').get('msgForRef').on(function (dat, id) {
                                self.stampExternalMessage(dat);
                            })
                        })

                        instance.get('heartbeat').once(res => {

                            let clientMsg =
                                JSON.stringify({
                                    action: "createNode",
                                    parameters: ["http://vwf.example.com/clients.vwf"],
                                    time: self.getNowTime(),
                                    forClient: clientIde
                                })

                            let processedURL = JSON.parse(self.info.path).path;

                            let appMsg =
                                JSON.stringify({
                                    action: "createNode",
                                    parameters: [
                                        (processedURL.public_path === "/" ? "" : processedURL.public_path) + "/" + processedURL.application,
                                        "application"
                                    ],
                                    time: self.getNowTime(),
                                    forClient: clientIde


                                })

                            instance.get('heartbeat')
                                .get('tick')
                                .put(clientMsg)
                                .put(appMsg)
                                .once(res => {
                                    _LCSDB.get(clientIde).get('status').get('pending').put(false, function () {
                                        self.initMessages(namespace, clientIde);
                                    });
                                })
                        })

                    } else {
                        console.log('new slave client');

                        if (!self.pendingList.pending) {
                            instance.get('heartbeat').once(res => {
                                self.start_time = res.start_time
                                let masterClient = Object.values(self.clients).filter(el => el.master)[0];
                                console.log(masterClient);

                                let msg =
                                    JSON.stringify({
                                        action: "getState",
                                        respond: true,
                                        time: self.getNowTime(),
                                        forClient: masterClient.id
                                    })

                                instance.get('heartbeat')
                                    .get('tick')
                                    .put(msg).once(function (ack) {
                                        self.pendingList.pending = true;
                                        self.initMessages(namespace, clientIde);
                                    })
                            })

                        }

                    }
                }
            }
        })


        original.clientID = clientID;
        return original
    }

    getNowTime() {
        return ((Gun.state() - this.start_time) * 1.0) / 1000

    }

    stampExternalMessage(msg) {

        let self = this;

        let mes = JSON.parse(msg);
        let meta = mes.meta;

        delete mes.meta;

        let message = Object.assign({}, mes);

        //console.log(message);
        //console.log(meta);

        let instance = _LCSDB.get(vwf.namespace_)//_LCSDB.get(meta.namespace);


        message.time = self.getNowTime();
        message.client = meta.clientID;

        let newMsg = JSON.stringify(message);

        if (message.signal == "getPendingMessages") {
            console.log("!!!! getPendingMessages");
            let cloneList = [...self.pendingList];
            cloneList.forEach(el => {

                instance.get('heartbeat')
                    .get('tick')
                    .put(el)
            })
            self.pendingList = [];
        }
        else if (!message.result) {
            instance.get('heartbeat').get('tick').put(newMsg);

            if (self.pendingList.pending) {
                self.pendingList.push(newMsg);
            }

        } else if (message.action == "getState") {

            var state = message.result;
            let msg = //self.makeMessage(
                JSON.stringify({
                    action: "setState",
                    parameters: [state],
                    time: self.setStateTime
                })

            instance.get('heartbeat').once(res => {
                instance.get('heartbeat')
                    .get('tick')
                    .put(msg)
            })

        } else if (message.action === "execute") {
            console.log("!!!! execute ", message)
        }

    }



    initMessages(namespace, clientID) {

        let self = this;

        let instance = _LCSDB.get(namespace);

        let clientDescriptor = { extends: "http://vwf.example.com/client.vwf" };
        let clientNodeMessage =
            JSON.stringify({
                action: "createChild",
                parameters: ["http://vwf.example.com/clients.vwf", clientID, clientDescriptor],
                time: self.getNowTime()
            });

        instance.get('heartbeat')
            .get('tick')
            .put(clientNodeMessage);

        if (self.pendingList.pending) {
            self.pendingList.push(clientNodeMessage);
        }

    }

}

export { Reflector }