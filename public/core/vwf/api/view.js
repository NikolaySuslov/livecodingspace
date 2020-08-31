/*
The MIT License (MIT)
Copyright (c) 2014-2020 Nikolai Suslov and the Krestianstvo.org project contributors. (https://github.com/NikolaySuslov/livecodingspace/blob/master/LICENSE.md)

Virtual World Framework Apache 2.0 license  (https://github.com/NikolaySuslov/livecodingspace/blob/master/licenses/LICENSE_VWF.md)
*/

/// View API.
/// 
/// @module vwf/api/view

class ViewApi {

    constructor() {
        //console.log("View constructor");

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
        /// @param {module:vwf/api/view~readyCallback} callback
        /// 
        /// @returns {}

        this.createdNode = [ /* nodeID, childID, childExtendsID, childImplementsIDs, childSource, childType,
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

    this.initializedNode = [ /* nodeID, childID, childExtendsID, childImplementsIDs, childSource, childType,
        childIndex, childName */ ]

    /// Description.
    /// 
    /// @function
    /// 
    /// @param {ID} nodeID
    /// 
    /// @returns {}

    this.deletedNode = [ /* nodeID */ ]

    /// Description.
    /// 
    /// @function
    /// 
    /// @param {ID} nodeID
    /// @param {ID} childID
    /// @param {String} childName
    /// 
    /// @returns {}

    this.addedChild = [ /* nodeID, childID, childName */ ]

    /// Description.
    /// 
    /// @function
    /// 
    /// @param {ID} nodeID
    /// @param {ID} childID
    /// 
    /// @returns {}

    this.removedChild = [ /* nodeID, childID */ ]

    /// Description.
    /// 
    /// @function
    /// 
    /// @param {ID} nodeID
    /// @param {String} propertyName
    /// @param {Value} propertyValue
    /// 
    /// @returns {}

    this.createdProperty = [ /* nodeID, propertyName, propertyValue */ ]

    /// Description.
    /// 
    /// @function
    /// 
    /// @param {ID} nodeID
    /// @param {String} propertyName
    /// @param {Value} propertyValue
    /// 
    /// @returns {}

    this.initializedProperty = [ /* nodeID, propertyName, propertyValue */ ]

    // TODO: deletedProperty

    /// Description.
    /// 
    /// @function
    /// 
    /// @param {ID} nodeID
    /// @param {String} propertyName
    /// @param {Value} propertyValue
    ///   The internal value of the property set in the model driver (which 
    ///   may differ from the value originally passed in to the model driver).
    /// 
    /// @returns {}

    this.satProperty = [ /* nodeID, propertyName, propertyValue */ ]

    /// Description.
    /// 
    /// @function
    /// 
    /// @param {ID} nodeID
    /// @param {String} propertyName
    /// @param {Value} propertyValue
    /// 
    /// @returns {}

    this.gotProperty = [ /* nodeID, propertyName, propertyValue */ ]

    /// Description.
    /// 
    /// @function
    /// 
    /// @param {ID} nodeID
    /// @param {String} methodName
    /// @param {String[]} methodParameters
    /// @param {String} methodBody
    /// 
    /// @returns {}

    this.createdMethod = [ /* nodeID, methodName, methodParameters, methodBody */ ]

    // TODO: deletedMethod

    /// Description.
    /// 
    /// @function
    /// 
    /// @param {ID} nodeID
    /// @param {String} methodName
    /// @param {Handler} methodHandler
    /// 
    /// @returns {}

    this.satMethod = [ /* nodeID, methodName, methodHandler */ ]

    /// Description.
    /// 
    /// @function
    /// 
    /// @param {ID} nodeID
    /// @param {String} methodName
    /// @param {Handler} methodHandler
    /// 
    /// @returns {}

    this.gotMethod = [ /* nodeID, methodName, methodHandler */ ]

    /// Description.
    /// 
    /// @function
    /// 
    /// @param {ID} nodeID
    /// @param {String} methodName
    /// @param {String[]} methodParameters
    /// @param {Value} methodValue
    /// 
    /// @returns {}

    this.calledMethod = [ /* nodeID, methodName, methodParameters, methodValue */ ]

    /// Description.
    /// 
    /// @function
    /// 
    /// @param {ID} nodeID
    /// @param {String} eventName
    /// @param {String[]} eventParameters
    /// 
    /// @returns {}

    this.createdEvent = [ /* nodeID, eventName, eventParameters */ ]

    // TODO: deletedEvent

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
    /// @returns {}

    this.addedEventListener = [ /* nodeID, eventName, eventListenerID, eventHandler, eventContextID, eventPhases */ ]

    /// Description.
    /// 
    /// @function
    /// 
    /// @param {ID} nodeID
    /// @param {String} eventName
    /// @param {ListenerID} eventListenerID
    /// 
    /// @returns {}

    this.removedEventListener = [ /* nodeID, eventName, eventListenerID */ ]

    /// Description.
    /// 
    /// @function
    /// 
    /// @param {ID} nodeID
    /// @param {String} eventName
    /// @param {ListenerID} eventListenerID
    /// @param {Listener} eventListener
    /// 
    /// @returns {}

    this.satEventListener = [ /* nodeID, eventName, eventListenerID, eventListener */ ]

    /// Description.
    /// 
    /// @function
    /// 
    /// @param {ID} nodeID
    /// @param {String} eventName
    /// @param {ListenerID} eventListenerID
    /// @param {Listener} eventListener
    /// 
    /// @returns {}

    this.gotEventListener = [ /* nodeID, eventName, eventListenerID, eventListener */ ]

    /// Description.
    /// 
    /// @function
    /// 
    /// @param {ID} nodeID
    /// @param {String} eventName
    /// @param {ID} eventContextID
    /// 
    /// @returns {}

    this.flushedEventListeners = [ /* nodeID, eventName, eventContextID */ ]

    /// Description.
    /// 
    /// @function
    /// 
    /// @param {ID} nodeID
    /// @param {String} eventName
    /// @param {String[]} eventParameters
    /// 
    /// @returns {}

    this.firedEvent = [ /* nodeID, eventName, eventParameters */ ]

    /// Description.
    /// 
    /// @function
    /// 
    /// @param {ID} nodeID
    /// @param {String} scriptText
    /// @param {String} scriptType
    /// 
    /// @returns {}

    this.executed = [ /* nodeID, scriptText, scriptType */ ]

    /// Time has changed, probably by about the same amount as last time.
    /// 
    /// `ticked` notifications are sent periodically as time moves forward. They are sent at
    /// roughly consistent intervals in real time while the application is running. However,
    /// application processing delays and network jitter will affect the specific interval.
    /// 
    /// Don't rely on `ticked` notifications to arrive at any particular rate. `ticked` is
    /// currently derived from reflector idle messages. Future versions of the reflector may
    /// vary the idle message interval based on network conditions and the application state.
    /// 
    /// Use {@link external:Window#requestAnimationFrame window.requestAnimationFrame} or
    /// {@link external:WindowTimers#setInterval window.setInterval} for real-time
    /// notifications. To receive notifications following application state changes, but not
    /// necessarily periodically, listen for {@link module:vwf/api/view.tocked view.tocked}.
    /// 
    /// @function
    /// 
    /// @param {Number} time
    /// 
    /// @returns {}

    this.ticked = [ /* time */ ]

    /// Time has changed.
    /// 
    /// Unlike {@link module:vwf/api/view.ticked view.ticked}, `tocked` notifications are sent
    /// each time that time moves forward. Time changes may occur when previously scheduled
    /// actions are executed or as regular idle progress. Since the application state only
    /// changes when simulation time changes, `tocked` notifications may be used as an
    /// application-wide change notification.
    /// 
    /// @function
    /// 
    /// @param {Number} time
    /// 
    /// @returns {}

    this.tocked = [ /* time */ ]

    /// Description.
    /// 
    /// @callback module:vwf/api/view~readyCallback
    /// 
    /// @param {Boolean} ready


    }
}

export {
    ViewApi
  }

