/*
The MIT License (MIT)
Copyright (c) 2014-2020 Nikolai Suslov and the Krestianstvo.org project contributors. (https://github.com/NikolaySuslov/livecodingspace/blob/master/LICENSE.md)

Virtual World Framework Apache 2.0 license  (https://github.com/NikolaySuslov/livecodingspace/blob/master/licenses/LICENSE_VWF.md)
*/

/// Kernel utility functions and objects.
/// 
/// @module vwf/kernel/utility


class KUtility {

    constructor() {
        //console.log("Kernel Utility constructor");

        /// ID of the pseudo node that appears as the parent of the simulation's global nodes.
        /// 
        /// @field

        this.globalRootID = 0

        /// The URI of the VWF proto-prototype node `node.vwf`. `protoNodeDescriptor` contains the
        /// descriptor associated with this URI.
        /// 
        /// @field

        this.protoNodeURI = "proxy/node.vwf"

        /// The component descriptor of the VWF proto-prototype node `node.vwf`.
        /// 
        /// @field

        this.protoNodeDescriptor = {
            extends: null
        } // TODO: detect protoNodeDescriptor in createChild() a different way and remove this explicit null prototype

        /// The key prototype for application values that reference nodes.
        /// 
        /// Application values that reference VWF nodes are objects of the form `{ id: id }` that also
        /// extend this object. Application values include property values, method parameters and
        /// results, and event listener parameters.
        /// 
        /// `nodeReferencePrototype` serves as a key to distinguish real node references from other
        /// arbitrary values.
        /// 
        /// @field

        this.nodeReferencePrototype = {}

    }

    /// Wrap `nodeID` in an object in such a way that it can stand in for a node reference
    /// without being confused with any other application value. The returned object will
    /// contain `nodeID` in the `id` field. `valueIsNodeReference` may be used to determine if
    /// an arbitrary value is such a node reference.
    /// 
    /// @param {ID} nodeID
    /// 
    /// @returns {Object}

    nodeReference(nodeID) {
        return Object.create(this.nodeReferencePrototype, {
            id: {
                value: nodeID
            } // TODO: same wrapper for same id so that === works
        });
    }


    /// Determine if a value is a node reference. If it is, it will contain the `nodeID` in the
    /// `id` field.
    /// 
    /// @param {Object} value
    /// 
    /// @returns {Boolean}

    valueIsNodeReference(value) {
        return this.nodeReferencePrototype.isPrototypeOf(value);
    }


}

export {
    KUtility
}