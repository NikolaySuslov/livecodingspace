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
        this.status = { pending: true };
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
        self.clientID = clientID;

        var namespace = _app.helpers.GetNamespace(path.path);
        self.namespace = namespace;

        //vwf.moniker_ = clientID;  

        let query = {
            pathname: window.location.pathname.slice(1,
                window.location.pathname.lastIndexOf("/")),
            appRoot: "./public",
            path: JSON.stringify(objToRef), //JSON.stringify(path)
            namespace: namespace,
        }

        //set an instance with namespace and client id
        let ref = _LCSDB.get('refl');

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

            gun.put({
                'start_time': 'start_time',
                'rate': 1
            }).once(function (res) {

                self.start_time = Gun.state.is(res, 'start_time');
                self.rate = res.rate;

                // function to start the timer
                setInterval(function () {

                    let message = {
                        parameters: [],
                        time: 'tick'//hb
                    };

                    gun.get('tick').put(JSON.stringify(message));

                }, 50); //FIX ERR: syncing clients work with delay more then 300 ms

            })
            // return gun so we can chain other methods off of it
            return gun;
        }


        function initMaster(ack) {

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

            instance.get('heartbeat')
                .get('tick')
                .put(clientMsg)
                .put(appMsg,
                    res => {
                        _LCSDB.get(self.clientID).get('status').get('pending').put(false, function () {
                            self.initMessages();
                        });
                    })
        }


        function initSlave(ack) {

            self.setStateTime = Gun.state.is(ack, 'id');
            console.log('new slave client');

            if (!self.pendingList.pending) {

                console.log(self.masterID);

                let msg =
                    JSON.stringify({
                        action: "getState",
                        respond: true,
                        time: 'tick',
                        explicit: self.masterID,
                        parameters: [clientID]
                    })

                instance.get('heartbeat')
                    .get('tick')
                    .put(msg, function () {
                        self.pendingList.pending = true;
                        self.initMessages(namespace, clientID);
                    })

            }
        }

        function initClient(cl) {
            instance.get('clients').set(cl);
            cl.get('status').get('pending').on(function (ack) {
                self.status.pending = ack;
            });

        }
        instance.get('masterID').once(res => {
            if (!res) {
                instance.get('heartbeat').put({ tick: "{}" }).heartbeat(0.0, 1);
                let client = _LCSDB.get(self.clientID).put({ id: self.clientID, status: { pending: true }, master: true }, res => {

                    initMaster(res);
                    initClient(client);
                    instance.get('masterID').put(clientID);

                });

            } else {
                self.masterID = res;
                let client = _LCSDB.get(self.clientID).put({ id: self.clientID, status: { pending: true }, master: false }).once(res => {
                    initSlave(res);
                    initClient(client);
                })

            }
        })

        original.clientID = clientID;
        return original
    }

    distributePendingMessages() {

        let self = this;

        if (self.pendingList.length > 0) {
            console.log("!!!! getPendingMessages");
            let cloneList = [...self.pendingList];
            cloneList.forEach(el => {
                vwf.onMessageInsert(el);
            })
            self.pendingList = [];
        }
    }


    initMessages() {

        let self = this;

        let instance = _LCSDB.get(self.namespace);

        let clientDescriptor = { extends: "http://vwf.example.com/client.vwf" };
        let clientNodeMessage =
        {
            action: "createChild",
            parameters: ["http://vwf.example.com/clients.vwf", self.clientID, clientDescriptor],
            time: 'tick'
        };

        instance.get('heartbeat')
            .get('tick')
            .put(JSON.stringify(clientNodeMessage))
    }

}

export { Reflector }