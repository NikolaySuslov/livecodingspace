/*
The MIT License (MIT)
Copyright (c) 2014-2020 Nikolai Suslov and the Krestianstvo.org project contributors. (https://github.com/NikolaySuslov/livecodingspace/blob/master/LICENSE.md)

Virtual World Framework Apache 2.0 license  (https://github.com/NikolaySuslov/livecodingspace/blob/master/licenses/LICENSE_VWF.md)
*/


import { Helpers } from '/core/helpers.js';
import { Utility } from '/core/vwf/utility/utility.js';


class VirtualTime {

    constructor() {
        console.log("Virtual Time constructor");
        this.helpers = new Helpers;
        this.utility = new Utility;

        /// The simulation clock, which contains the current time in seconds. Time is controlled by
        /// the reflector and updates here as we receive control messages.
        /// 
        /// @name module:vwf.now
        /// 
        /// @private

        this.now = 0;

        /// The queue's sequence number for the currently executing action.
        /// 
        /// The queue enumerates actions in order of arrival, which is distinct from execution order
        /// since actions may be scheduled to run in the future. `sequence_` can be used to
        /// distinguish between actions that were previously placed on the queue for execution at a
        /// later time, and those that arrived after the current action, regardless of their
        /// scheduled time.
        /// 
        /// @name module:vwf.sequence_
        /// 
        /// @private

        this.sequence_ = undefined

        /// The moniker of the client responsible for the currently executing action. `client_` will
        /// be falsy for actions originating in the server, such as time ticks.
        /// 
        /// @name module:vwf.client_
        /// 
        /// @private

        this.client_ = undefined

        ///// From queue props

             /// Current time as provided by the reflector. Messages to be executed at this time or
            /// earlier are available from #pull.
            /// 
            /// @name module:vwf~queue.time

        this.time = 0

        /// Suspension count. Queue processing is suspended when suspension is greater than 0.
        /// 
        /// @name module:vwf~queue.suspension

        this.suspension = 0

        /// Sequence counter for tagging messages by order of arrival. Messages are sorted by
        /// time, origin, then by arrival order.
        /// 
        /// @name module:vwf~queue.sequence

        this.sequence = 0

        /// Array containing the messages in the queue.
        /// 
        /// @name module:vwf~queue.queue

        this.queue = new Heap({
            compar: this.queueSort
        }) //[]

        //Add Stream support
        this.initReflectorStream();

    }

    initReflectorStream() {
        const self = this;

        this.streamDelay = 0;
        this.streamDefaultScheduler = M.scheduler.newDefaultScheduler();
        //this.streamDefaultScheduler = M.scheduler.schedulerRelativeTo(self.startTime, this.streamDefaultS);
        //this.streamScheduler = M.scheduler.newDefaultScheduler();
        const [induce, events] = M.createAdapter();

        this.streamAdapter = {
            induce: induce,
            events: events,
        };

        const tapFunction = function (res) {
            let mostTime =
                M.scheduler.currentTime(self.streamDefaultScheduler) / 1000;

            if (_app.config.streamMsg) {
                console.log('STREAM: ', res, ' TIME: ', mostTime);
                self.insert(res, !res.action);
            }

        };

        this.reflectorStream = M.multicast(events); //M.concatMap((x) => M.fromPromise(x()), events);
        const resultStream = M.concatMap(el => {
            return M.delay(this.streamDelay, M.now(el))
        }, this.reflectorStream);

        // M.delay(5000, this.reflectorStream)

        this.eventsStream = M.tap((res) => {
            tapFunction(res);
        }, resultStream);
        M.runEffects(this.eventsStream, this.streamDefaultScheduler);
    }


         /// Insert a message or messages into the queue. Optionally execute the simulation
            /// through the time marked on the message.
            /// 
            /// When chronic (chron-ic) is set, vwf#dispatch is called to execute the simulation up
            /// through the indicated time. To prevent actions from executing out of order, insert
            /// should be the caller's last operation before returning to the host when invoked with
            /// chronic.
            /// 
            /// @name module:vwf~queue.insert
            /// 
            /// @param {Object|Object[]} fields
            /// @param {Boolean} [chronic]


    insert(fields, chronic) {

        var messages = fields instanceof Array ? fields : [fields];

        messages.forEach(function (fields) {

            // if ( fields.action ) {  // TODO: don't put ticks on the queue but just use them to fast-forward to the current time (requires removing support for passing ticks to the drivers and nodes)

            fields.sequence = ++this.sequence; // track the insertion order for use as a sort key
            this.queue.insert(fields);

            // }

            if (chronic) {
                this.time = Math.max(this.time, fields.time); // save the latest allowed time for suspend/resume
            }

        }, this);

        //Sort here (now in Heap)

        if (chronic) {
            this.dispatch();
        }

    }


         /// Pull the next message from the queue.
            /// 
            /// @name module:vwf~queue.pull
            /// 
            /// @returns {Object|undefined} The next message if available, otherwise undefined.

    pull() {

        if (this.suspension == 0 && this.queue.length > 0 && this.queue.peek().time <= this.time) {
            return this.queue.shift();
        }

    }

         /// Update the queue to include only the messages selected by a filtering function.
            /// 
            /// @name module:vwf~queue.filter
            /// 
            /// @param {Function} callback
            ///   `filter` calls `callback( fields )` once for each message in the queue. If
            ///   `callback` returns a truthy value, the message will be retained. Otherwise it will
            ///   be removed from the queue.


    filter(callback /* fields */ ) {

        // this.queue = this.queue.filter( callback );
        let filtered = this.queue._list.slice().filter(callback);
        //this.queue._list = this.queue._list.filter(callback);
        this.queue = new Heap({
            compar: this.queueSort
        });
        filtered.map(el => {
            this.queue.insert(el);
        });

    }

    filterQueue() {
        this.filter(function (fields) {

            if ((fields.origin === "reflector") && fields.sequence > vwf.virtualTime.sequence_) {
                return true;
            } else {
                vwf.logger.debugx("setState", function () {
                    return ["removing", JSON.stringify(loggableFields(fields)), "from queue"];
                });
            }

        })
    }

      /// Suspend message execution.
            /// 
            /// @name module:vwf~_app.virtualTime.suspend
            /// 
            /// @returns {Boolean} true if the queue was suspended by this call.

    suspend(why) {

        if (this.suspension++ == 0) {
            vwf.logger.infox("-queue#suspend", "suspending queue at time", this.now, why ? why : "");
            return true;
        } else {
            vwf.logger.debugx("-queue#suspend", "further suspending queue at time", this.now, why ? why : "");
            return false;
        }

    }

     /// Resume message execution.
            ///
            /// vwf#dispatch may be called to continue the simulation. To prevent actions from
            /// executing out of order, resume should be the caller's last operation before
            /// returning to the host.
            /// 
            /// @name module:vwf~_app.virtualTime.resume
            /// 
            /// @returns {Boolean} true if the queue was resumed by this call.


    resume(why) {

        if (--this.suspension == 0) {
            vwf.logger.infox("-queue#resume", "resuming queue at time", this.now, why ? why : "");
            this.dispatch();
            return true;
        } else {
            vwf.logger.debugx("-queue#resume", "partially resuming queue at time", this.now, why ? why : "");
            return false;
        }

    }

      //     /// Return the ready state of the queue.
        //     /// 
        //     /// @name module:vwf~queue.ready
        //     /// 
        //     /// @returns {Boolean}


    ready() {
        return this.suspension == 0;
    }

    queueSort(a, b) {

        // Sort by time, then future messages ahead of reflector messages, then by sequence.  // TODO: we probably want a priority queue here for better performance
        // 
        // The sort by origin ensures that the queue is processed in a well-defined order
        // when future messages and reflector messages share the same time, even if the
        // reflector message has not arrived at the client yet.
        // 
        // The sort by sequence number ensures that the messages remain in their arrival
        // order when the earlier sort keys don't provide the order.

        // Execute the simulation through the new time.

        // To prevent actions from executing out of order, callers should immediately return
        // to the host after invoking insert with chronic set.


        if (a.time != b.time) {
            return a.time - b.time;
        } else if (a.origin != "reflector" && b.origin == "reflector") {
            return -1;
        } else if (a.origin == "reflector" && b.origin != "reflector") {
            return 1;
        } else {
            return a.sequence - b.sequence;
        }

    }


    // -- queueTransitTransformation -----------------------------------------------------------

        /// vwf/utility/transform() transformation function to convert the message queue for proper
        /// JSON serialization.
        /// 
        /// queue: [ { ..., parameters: [ [ arguments ] ], ... }, { ... }, ... ]
        /// 
        /// @name module:vwf~queueTransitTransformation


    queueTransitTransformation(object, names, depth) {

        let self = this

        if (depth == 0) {

            // Omit any private direct messages for this client, then sort by arrival order
            // (rather than by time) so that messages will retain the same arrival order when
            // reinserted.

            return object.filter(el => el !== 0).filter(function (fields) {
                return !(fields.origin === "reflector" && fields.sequence > vwf.virtualTime.sequence_) && fields.action; // TODO: fields.action is here to filter out tick messages  // TODO: don't put ticks on the queue but just use them to fast-forward to the current time (requires removing support for passing ticks to the drivers and nodes)
            }).sort(function (fieldsA, fieldsB) {
                return fieldsA.sequence - fieldsB.sequence;
            });

        } else if (depth == 1) {

            // Remove the sequence fields since they're just local annotations used to keep
            // messages ordered by insertion order and aren't directly meaniful outside of this
            // client.

            var filtered = {};

            Object.keys(object).filter(function (key) {
                return key != "sequence";
            }).forEach(function (key) {
                filtered[key] = object[key];
            });

            return filtered;

        }

        return object;
    }


    get stateQueue() {
        return {
            time: this.time,
            queue: this.utility.transform(this.queue._list, this.queueTransitTransformation),
        }

    }

    // -- dispatch -----------------------------------------------------------------------------

    /// Dispatch incoming messages waiting in the queue. "currentTime" specifies the current
    /// simulation time that we should advance to and was taken from the time stamp of the last
    /// message received from the reflector.
    /// 
    /// @name module:vwf.dispatch

    dispatch() {

        var fields;

        // Actions may use receive's ready function to suspend the queue for asynchronous
        // operations, and to resume it when the operation is complete.

        while (fields = /* assignment! */ this.pull()) {

            // Advance time to the message time.

            if (this.now != fields.time) {
                this.sequence_ = undefined; // clear after the previous action
                this.client_ = undefined; // clear after the previous action
                this.now = fields.time;
                this.tock();
            }

            // Perform the action.

            if (fields.action) { // TODO: don't put ticks on the queue but just use them to fast-forward to the current time (requires removing support for passing ticks to the drivers and nodes)
                this.sequence_ = fields.sequence; // note the message's queue sequence number for the duration of the action
                this.client_ = fields.client; // ... and note the originating client
                this.receive(fields.node, fields.action, fields.member, fields.parameters, fields.respond, fields.origin);
            } else {
                this.tick();
            }

        }

        // Advance time to the most recent time received from the server. Tick if the time
        // changed.

        if (this.ready() && this.now != this.time) {
            this.sequence_ = undefined; // clear after the previous action
            this.client_ = undefined; // clear after the previous action
            this.now = this.time;
            this.tock();
        }

    }

    // -- plan ---------------------------------------------------------------------------------

    /// @name module:vwf.plan

    plan(nodeID, actionName, memberName, parameters, when, callback_async /* ( result ) */ ) {

        vwf.logger.debuggx("plan", nodeID, actionName, memberName,
            parameters && parameters.length, when, callback_async && "callback");

        var time = when > 0 ? // absolute (+) or relative (-)
            Math.max(this.now, when) :
            this.now + (-when);

        var fields = {
            time: time,
            node: nodeID,
            action: actionName,
            member: memberName,
            parameters: parameters,
            client: this.client_, // propagate originating client
            origin: "future",
            // callback: callback_async,  // TODO
        };

        this.insert(fields);

        vwf.logger.debugu();
    }

    // -- send ---------------------------------------------------------------------------------

    /// Send a message to the reflector. The message will be reflected back to all participants
    /// in the instance.
    /// 
    /// @name module:vwf.send

    send(nodeID, actionName, memberName, parameters, when, callback_async /* ( result ) */ ) {

        vwf.logger.debuggx("send", nodeID, actionName, memberName,
            parameters && parameters.length, when, callback_async && "callback"); // TODO: loggableParameters()

        var time = when > 0 ? // absolute (+) or relative (-)
            Math.max(this.now, when) :
            this.now + (-when);

        // Attach the current simulation time and pack the message as an array of the arguments.

        var fields = {
            time: time,
            node: nodeID,
            action: actionName,
            member: memberName,
            parameters: this.utility.transform(parameters, this.utility.transforms.transit),
            // callback: callback_async,  // TODO: provisionally add fields to queue (or a holding queue) then execute callback when received back from reflector
        };

        if (vwf.isLuminary) {

            vwf.luminary.stampExternalMessage(fields);

        } else if (vwf.reflectorClient.socket) {

            // Send the message.
            var message = JSON.stringify(fields);
            vwf.reflectorClient.socket.send(message);

        }
        // else {

        //     // In single-user mode, loop the message back to the incoming queue.

        //     fields.client =  vwf.moniker_; // stamp with the originating client like the reflector does
        //     fields.origin = "reflector";

        //     _app.virtualTime.insert( fields );

        // }

        vwf.logger.debugu();
    }

    // get queue () { // vwf.private.queue

    // }

    // -- respond ------------------------------------------------------------------------------

    /// Return a result for a function invoked by the server.
    /// 
    /// @name module:vwf.respond

    respond(nodeID, actionName, memberName, parameters, result) {

        vwf.logger.debuggx("respond", nodeID, actionName, memberName,
            parameters && parameters.length, "..."); // TODO: loggableParameters(), loggableResult()

        // Attach the current simulation time and pack the message as an array of the arguments.

        var fields = {
            // sequence: undefined,  // TODO: use to identify on return from reflector?
            time: this.now,
            node: nodeID,
            action: actionName,
            member: memberName,
            parameters: this.utility.transform(parameters, this.utility.transforms.transit),
            result: this.utility.transform(result, this.utility.transforms.transit)
        };

        if (vwf.isLuminary) {

            vwf.luminary.stampExternalMessage(fields);

        } else if (vwf.reflectorClient.socket) {

            // Send the message.

            var message = JSON.stringify(fields);
            vwf.reflectorClient.socket.send(message);

        } else {

            // Nothing to do in single-user mode.

        }

        vwf.logger.debugu();
    }

    // -- receive ------------------------------------------------------------------------------

    /// Handle receipt of a message. Unpack the arguments and call the appropriate handler.
    /// 
    /// @name module:vwf.receive

    receive(nodeID, actionName, memberName, parameters, respond, origin) {

        // origin == "reflector" ?
        //     this.logger.infogx( "receive", nodeID, actionName, memberName,
        //         parameters && parameters.length, respond, origin ) :
        //     this.logger.debuggx( "receive", nodeID, actionName, memberName,
        //         parameters && parameters.length, respond, origin );

        // TODO: delegate parsing and validation to each action.

        // Look up the action handler and invoke it with the remaining parameters.

        // Note that the message should be validated before looking up and invoking an arbitrary
        // handler.

        var args = [],
            result;

        if (nodeID || nodeID === 0) args.push(nodeID);
        if (memberName) args.push(memberName);
        if (parameters) args = args.concat(parameters); // flatten

        if (actionName == 'createChild') {
            console.log("create child!");
            // args.push(function(childID)
            // {
            //     //when creating over the reflector, call ready on heirarchy after create.
            //     //nodes from setState are readied in createNode
            //     // vwf.decendants(childID).forEach(function(i){
            //     //     vwf.callMethod(i,'ready',[]);
            //     // });
            //     // vwf.callMethod(childID,'ready',[]);
            //     console.log("create child!");
            // });
        }

        // Invoke the action.

        // if (environment(actionName, parameters)) {
        //     require("vwf/configuration").environment = environment(actionName, parameters);
        // } else 
        if (origin !== "reflector" || !nodeID || vwf.private.nodes.existing[nodeID]) {
            result = vwf[actionName] && vwf[actionName].apply(vwf, args);
        } else {
            vwf.logger.debugx("receive", "ignoring reflector action on non-existent node", nodeID);
            result = undefined;
        }

        // Return the result.

        respond && this.respond(nodeID, actionName, memberName, parameters, result);

        // origin == "reflector" ?
        //     this.logger.infou() : this.logger.debugu();


        /// The reflector sends a `setState` action as part of the application launch to pass
        /// the server's execution environment to the client. A `setState` action isn't really
        /// appropriate though since `setState` should be the last part of the launch, whereas
        /// the environment ought to be set much earlier--ideally before the kernel loads.
        /// 
        /// Executing the `setState` as received would overwrite any configuration settings
        /// already applied by the application. So instead, we detect this particular message
        /// and only use it to update the environment in the configuration object.
        /// 
        /// `environment` determines if a message is the reflector's special pre-launch
        /// `setState` action, and if so, and if the application hasn't been created yet,
        /// returns the execution environment property.

        // function environment(actionName, param) {

        //     if (actionName === "setState" && !vwf.application()) {

        //         var parameters = param;

        //         if (parameters[0].init) {
        //             parameters = [JSON.parse(localStorage.getItem('lcs_app')).saveObject]
        //         }

        //         var applicationState = parameters && parameters[0];

        //         if (applicationState && Object.keys(applicationState).length === 1 &&
        //             applicationState.configuration && Object.keys(applicationState.configuration).length === 1) {
        //             return applicationState.configuration.environment;
        //         }

        //     }

        //     return undefined;
        // }

    }


    // -- tick ---------------------------------------------------------------------------------

    /// Tick each tickable model, view, and node. Ticks are sent on each reflector idle message.
    /// 
    /// @name module:vwf.tick

    // TODO: remove, in favor of drivers and nodes exclusively using future scheduling;
    // TODO: otherwise, all clients must receive exactly the same ticks at the same times.

    tick() {

        // Call ticking() on each model.

        vwf.models.forEach(function (model) {
            model.ticking && model.ticking(this.now); // TODO: maintain a list of tickable models and only call those
        }, vwf);

        // Call ticked() on each view.

        vwf.views.forEach(function (view) {
            view.ticked && view.ticked(this.now); // TODO: maintain a list of tickable views and only call those
        }, vwf);

        // Call tick() on each tickable node.

        vwf.tickable.nodeIDs.forEach(function (nodeID) {
            vwf.callMethod(nodeID, "tick", [this.now]);
        }, vwf);

    };

    // -- tock ---------------------------------------------------------------------------------

    /// Notify views of a kernel time change. Unlike `tick`, `tock` messages are sent each time
    /// that time moves forward. Only view drivers are notified since the model state should be
    /// independent of any particular sequence of idle messages.
    /// 
    /// @name module:vwf.tock

    tock() {

        // Call tocked() on each view.

        vwf.views.forEach(function (view) {
            view.tocked && view.tocked(this.now);
        }, vwf);

    }


    get getNow() {
        return this.now
    }


}

export {
    VirtualTime
}