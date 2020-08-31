/*
The MIT License (MIT)
Copyright (c) 2014-2020 Nikolai Suslov and the Krestianstvo.org project contributors. (https://github.com/NikolaySuslov/livecodingspace/blob/master/LICENSE.md)

Virtual World Framework Apache 2.0 license  (https://github.com/NikolaySuslov/livecodingspace/blob/master/licenses/LICENSE_VWF.md)
*/
/// Model API.
/// 
/// @module vwf/api/model

class ModelApi {

    constructor() {
        //console.log("Model constructor");


                /// Description.
        /// 
        /// @function
        /// 
        /// @param {ID} nodeID
        /// @param {ID} childID
        /// @param {String} childExtendsID
        /// @param {String[]} childImplementsIDs
        /// @param {String} childSource
        /// @param {String} childType
        /// @param {String} childIndex
        ///   When `nodeID` is falsy, the URI of the component, or `undefined` if the component
        ///   wasn't loaded from a URI. When `nodeID` is truthy, the numerical index of the child's
        ///   position in the parent's array, starting at `0`. When child order is significant to
        ///   the driver, the child should be placed at the given position in the parent's array.
        ///   Nodes won't necessarily arrive in numerical order since varying dependencies cause
        ///   nodes to become ready at indeterminate times.
        /// @param {String} childName
        /// @param {module:vwf/api/model~readyCallback} callback
        /// 
        /// @returns {}

        this.creatingNode = [ /* nodeID, childID, childExtendsID, childImplementsIDs, childSource, childType,
        childIndex, childName, callback( ready ) */ ]

    /// Description.
    /// 
    /// @function
    /// 
    /// @param {ID} nodeID
    /// @param {ID} childID
    /// @param {String} childExtendsID
    /// @param {String[]} childImplementsIDs
    /// @param {String} childSource
    /// @param {String} childType
    /// @param {String} childIndex
    ///   When `nodeID` is falsy, the URI of the component, or `undefined` if the component
    ///   wasn't loaded from a URI. When `nodeID` is truthy, the numerical index of the child's
    ///   position in the parent's array, starting at `0`. When child order is significant to
    ///   the driver, the child should be placed at the given position in the parent's array.
    ///   Nodes won't necessarily arrive in numerical order since varying dependencies cause
    ///   nodes to become ready at indeterminate times.
    /// @param {String} childName
    /// 
    /// @returns {}

    this.initializingNode = [ /* nodeID, childID, childExtendsID, childImplementsIDs, childSource, childType,
        childIndex, childName */ ]

    /// Description.
    /// 
    /// @function
    /// 
    /// @param {ID} nodeID
    /// @param {ID} childID
    /// @param {ID} childInitializingNodeID
    /// 
    /// @returns {}

    this.initializingNodeFromPrototype = [ /* nodeID, childID, childInitializingNodeID */ ]

    /// Description.
    /// 
    /// @function
    /// 
    /// @param {ID} nodeID
    /// 
    /// @returns {}

    this.deletingNode = [ /* nodeID */ ]

    /// Description.
    /// 
    /// @function
    /// 
    /// @param {}
    /// 
    /// @returns {}

    this.addingChild = []

    /// Description.
    /// 
    /// @function
    /// 
    /// @param {}
    /// 
    /// @returns {}

    this.removingChild = []

    /// Description.
    /// 
    /// @function
    /// 
    /// @param {}
    /// 
    /// @returns {}

    this.settingProperties = []

    /// Description.
    /// 
    /// @function
    /// 
    /// @param {}
    /// 
    /// @returns {}

    this.gettingProperties = []

    /// Description.
    /// 
    /// @function
    /// 
    /// @param {}
    /// 
    /// @returns {}

    this.creatingProperty = []

    /// Description.
    /// 
    /// @function
    /// 
    /// @param {}
    /// 
    /// @returns {}

    this.initializingProperty = []

    // TODO: deletingProperty

    /// Description.
    /// 
    /// @function
    /// 
    /// @param {ID} nodeID
    /// @param {String} propertyName
    /// @param {Object} propertyValue
    /// 
    /// @returns {Object}
    ///   A value set on property or undefined if not set.
    ///   
    ///   The first non-undefined return value will be sent with the "satProperty" event (which 
    ///   may differ from the incoming propertyValue).

    this.settingProperty = []

    /// Description.
    /// 
    /// @function
    /// 
    /// @param {}
    /// 
    /// @returns {}

    this.gettingProperty = []

    /// Description.
    /// 
    /// @function
    /// 
    /// @param {ID} nodeID
    /// @param {String} methodName
    /// @param {String[]} methodParameters
    /// @param {String} methodBody
    /// 
    /// @returns {Handler} methodHandler

    this.creatingMethod = [ /* nodeID, methodName, methodParameters, methodBody */ ]

    // TODO: deletingMethod

    /// Description.
    /// 
    /// @function
    /// 
    /// @param {ID} nodeID
    /// @param {String} methodName
    /// @param {Handler} methodHandler
    /// 
    /// @returns {Handler} methodHandler

    this.settingMethod = [ /* nodeID, methodName, methodHandler */ ]

    /// Description.
    /// 
    /// @function
    /// 
    /// @param {ID} nodeID
    /// @param {String} methodName
    /// 
    /// @returns {Handler} methodHandler

    this.gettingMethod = [ /* nodeID, methodName */ ]

    /// Description.
    /// 
    /// @function
    /// 
    /// @param {ID} nodeID
    /// @param {String} methodName
    /// @param {String[]} methodParameters
    /// 
    /// @returns {}

    this.callingMethod = [ /* nodeID, methodName, methodParameters */ ]

    /// Description.
    /// 
    /// @function
    /// 
    /// @param {ID} nodeID
    /// @param {String} eventName
    /// @param {ListenerID} eventListenerID
    /// @param {Handler} eventHandler
    /// @param {ID} eventContextID
    /// @param {String[]} eventPhases
    /// 
    /// @returns {Boolean}

    this.addingEventListener = [ /* nodeID, eventName, eventListenerID, eventHandler, eventContextID, eventPhases */ ]

    /// Description.
    /// 
    /// @function
    /// 
    /// @param {ID} nodeID
    /// @param {String} eventName
    /// @param {ListenerID} eventListenerID
    /// 
    /// @returns {Boolean}

    this.removingEventListener = [ /* nodeID, eventName, eventListenerID */ ]

    /// Description.
    /// 
    /// @function
    /// 
    /// @param {ID} nodeID
    /// @param {String} eventName
    /// @param {ListenerID} eventListenerID
    /// @param {Listener} eventListener
    /// 
    /// @returns {Listener}

    this.settingEventListener = [ /* nodeID, eventName, eventListenerID, eventListener */ ]

    /// Description.
    /// 
    /// @function
    /// 
    /// @param {ID} nodeID
    /// @param {String} eventName
    /// @param {ListenerID} eventListenerID
    /// 
    /// @returns {Listener}

    this.gettingEventListener = [ /* nodeID, eventName, eventListenerID */ ]

    /// Description.
    /// 
    /// @function
    /// 
    /// @param {ID} nodeID
    /// @param {String} eventName
    /// @param {ID} eventContextID
    /// 
    /// @returns {}

    this.flushingEventListeners = [ /* nodeID, eventName, eventContextID */ ]

    /// Description.
    /// 
    /// @function
    /// 
    /// @param {ID} nodeID
    /// @param {String} eventName
    /// @param {String[]} eventParameters
    /// 
    /// @returns {}

    this.creatingEvent = [ /* nodeID, eventName, eventParameters */ ]

    // TODO: deletingEvent

    /// Description.
    /// 
    /// @function
    /// 
    /// @param {ID} nodeID
    /// @param {String} eventName
    /// @param {String[]} eventParameters
    /// 
    /// @returns {}

    this.firingEvent = [ /* nodeID, eventName, eventParameters */ ]

    /// Description.
    /// 
    /// @function
    /// 
    /// @param {}
    /// @returns {}

    this.executing = []

    /// Time has changed, probably by about the same amount as last time.
    /// 
    /// Don't rely on `ticking` notifications; but if you do, don't rely on them to arrive at
    /// any particular rate. `ticking` may be removed in the future to allow the reflector to
    /// vary the idle message interval.
    /// 
    /// To schedule actions for certain times, use the `when` parameter in the
    /// {@link module:vwf/kernel/model Kernel API}.
    /// 
    /// @function
    /// 
    /// @param {Number} time
    /// 
    /// @returns {}
    /// 
    /// @deprecated in version 0.6.23. Use the {@link module:vwf/kernel/model Kernel API} `when`
    ///   parameter to schedule future actions.

    this.ticking = []

    /// Description.
    /// 
    /// @callback module:vwf/api/model~readyCallback
    /// 
    /// @param {Boolean} ready


    }
}

export {
    ModelApi
  }

