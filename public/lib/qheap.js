/**
 * nodejs heap, classic array implementation
 *
 * Items are stored in a balanced binary tree packed into an array where
 * node is at [i], left child is at [2*i], right at [2*i+1].  Root is at [1].
 *
 * Copyright (C) 2014-2020 Andras Radics
 * Licensed under the Apache License, Version 2.0
 */

'use strict';

//module.exports = Heap;

function isBeforeDefault( a, b ) { return a < b; }

function Heap( opts ) {
    if (!(this instanceof Heap)) return new Heap(opts);

    if (typeof opts === 'function') opts = {compar: opts};

    // copy out known options to not bind to caller object
    this.options = !opts ? {} : {
        compar: opts.compar,
        comparBefore: opts.comparBefore,
        freeSpace: opts.freeSpace,
        size: opts.size,
    };
    opts = this.options;

    var self = this;
    this._isBefore = opts.compar ? function(a, b) { return opts.compar(a, b) < 0 } : opts.comparBefore || isBeforeDefault;
    this._sortBefore = opts.compar || function(a, b) { return self._isBefore(a, b) ? -1 : 1 };
    this._freeSpace = opts.freeSpace ? this._trimArraySize : false;

    this._list = new Array(opts.size || 20);
    // 14% slower to mix ints and pointers in an array, even if deleted
    // this._list[0] = undefined;

    this.length = 0;
}

Heap.prototype._list = null;
Heap.prototype._compar = null;
Heap.prototype._isBefore = null;
Heap.prototype._freeSpace = null;
Heap.prototype._sortBefore = null;
Heap.prototype.length = 0;

/*
 * insert new item at end, and bubble up
 */
Heap.prototype.insert = function Heap_insert( item ) {
    var idx = ++this.length;
    return this._bubbleup(idx, item);
};
Heap.prototype._bubbleup = function _bubbleup( idx, item ) {
    var list = this._list;
    list[idx] = item;

    while (idx > 1) {
        if (!(this._isBefore(item, list[idx >> 1]))) break;
        list[idx] = list[idx >> 1];
        idx = idx >> 1;
    }
    list[idx] = item;
};
Heap.prototype.append = Heap.prototype.insert;
Heap.prototype.push = Heap.prototype.insert;
Heap.prototype.unshift = Heap.prototype.insert;
Heap.prototype.enqueue = Heap.prototype.insert;

Heap.prototype.peek = function Heap_peek( ) {
    return this.length > 0 ? this._list[1] : undefined;
};

Heap.prototype.size = function Heap_size( ) {
    return this.length;
};

/*
 * return the root, and bubble down last item from top root position
 * when bubbling down, r: root idx, c: child sub-tree root idx, cv: child root value
 * Note that the child at (c == this.length) does not have to be tested in the loop,
 * since its value is the one being bubbled down, so can loop `while (c < len)`.
 */
Heap.prototype.remove = function Heap_remove( ) {
    var len = this.length;
    if (len < 1) return undefined;
    return this._bubbledown(1, len);

/**
    // experiment: ripple down hole from root, bubble up last from hole
    var list = this._list;
    var ret = list[1];
    var holeIdx = this._rippleup(1, len);
    this._bubbleup(holeIdx, list[this.length--]);
    if (this._freeSpace) this._freeSpace(list, len);
    return ret;
/**/
};
Heap.prototype._bubbledown = function _bubbledown( r, len ) {
    var list = this._list, ret = list[r], itm = list[len];
    var c, _isBefore = this._isBefore;

    while ((c = r << 1) < len) {
        var cv = list[c], cv1 = list[c+1];
        if (_isBefore(cv1, cv)) { c++; cv = cv1; }
        if (!(_isBefore(cv, itm))) break;
        list[r] = cv;
        r = c;
    }
    list[r] = itm;
    list[len] = 0;
    this.length = --len;
    if (this._freeSpace) this._freeSpace(this._list, this.length);

    return ret;
};
/**
Heap.prototype._rippleup = function _rippleup( r, len ) {
    var list = this._list;

    var c, _isBefore = this._isBefore;
    while ((c = r << 1) < len) {
        var cv = list[c];
        var cv1 = list[c+1];
        if (_isBefore(cv1, cv)) { cv = cv1; c = c+1 }
        list[r] = cv;
        r = c;
    }
    if (c === len) {
        list[r] = list[c];
        r = c;
    }

    return r;
};
/**/
Heap.prototype.shift = Heap.prototype.remove;
Heap.prototype.pop = Heap.prototype.remove;
Heap.prototype.dequeue = Heap.prototype.remove;

// builder, not initializer: appends items, not replaces
Heap.prototype.fromArray = function fromArray( array, base, bound ) {
    var base = base || 0;
    var bound = bound || array.length;
    for (var i=base; i<bound; i++) this.insert(array[i]);
}

Heap.prototype.toArray = function toArray( limit ) {
    limit = typeof limit === 'number' ? limit + 1 : this.length + 1;
    return this._list.slice(1, limit);
}

Heap.prototype.copy = function copy( ) {
    var ret = new Heap(this.options);
    for (var i = 1; i <= this.length; i++) ret._list[i] = this._list[i];
    ret.length = this.length;
    return ret;
}

Heap.prototype.peekHead = function peekHead( n ) {
    // todo: think about a more efficient approach than cloning the list
    // todo: would be more efficient to sort the whole list if peeking at say over 50% of the items
    var copy = this.copy();
    var item, head = new Array();
    while (head.length < n && (item = copy.shift()) !== undefined) {
        head.push(item);
    }
    return head;
}

// sort the contents of the storage array
// Trim the array for the sort, ensure first item is smallest, sort.
// Note that sorted order is valid heap format.
// Truncating the list is faster than copy-out/copy-in.
// node-v11 and up are 5x faster to sort 1k numbers than v10.
Heap.prototype.sort = function sort( ) {
    if (this.length < 3) return;
    this._list.splice(this.length + 1);
    this._list[0] = this._list[1];
    this._list.sort(this._sortBefore);
    this._list[0] = 0;
}

// generate a uniformly distributed subsample of k items (Reservoir Algorithm)
// First select the first k items, then once have k samples
// randomly replace a selection with the i-th item i>k, with k/i probability.
// Eg: pick 2 [1,2,3]: get [1,2], replace 3 with 2/3 probability into slot [0] or [1].
// Note that this._list is indexed 1..N, but samples are indexed 0..k-1
// Note: if k is much smaller than .length, would be faster to
//   generate k unique random array indexes than N random values.
Heap.prototype.subsample = function subsample( k, options ) {
    options = options || {};
    var samples = new Array();

    if (k > this.length) k = this.length;
    for (var i = 1; i <= k; i++) samples[i - 1] = this._list[i];
    for (var i = k + 1; i <= this.length; i++) {
        var j = Math.floor(Math.random() * i);
        if (j < k) samples[j] = this._list[i];
    }

    if (options.sort) samples.sort(this._sortBefore);
    return samples;
}

/*
 * Free unused storage slots in the _list.
 * The default is to unconditionally gc, use the options to omit when not useful.
 */
Heap.prototype.gc = function Heap_gc( options ) {
    if (!options) options = {};

    var minListLength = options.minLength;      // smallest list that will be gc-d
    if (minListLength === undefined) minListLength = 0;

    var minListFull = options.minFull;          // list utilization below which to gc
    if (minListFull === undefined) minListFull = 1.00;

    if (this._list.length >= minListLength && (this.length < this._list.length * minListFull)) {
        // gc reallocates the array to free the unused storage slots at the end
        // use splice to actually free memory; 7% slower than setting .length
        // note: list.slice makes the array slower to insert to??  splice is better
        this._list.splice(this.length+1, this._list.length);
    }
}

Heap.prototype._trimArraySize = function Heap__trimArraySize( list, len ) {
    if (len > 10000 && list.length > 4 * len) {
        // use slice to actually free memory; 7% slower than setting .length
        // note: list.slice makes the array slower to insert to??  splice is better
        list.splice(len+1, list.length);
    }
}

Heap.prototype._check = function Heap__check( ) {
    var isBefore = this._isBefore;
    var _compar = this._sortBefore;

    var i, p, fail = 0;
    for (i=this.length; i>1; i--) {
        // error if parent should go after child, but not if don`t care
        p = i >>> 1;
        // swapping the values must change their ordering, otherwise the
        // comparison is a tie.  (Ie, consider the ordering func (a <= b)
        // that for some values reports both that a < b and b < a.)
        if (_compar(this._list[p], this._list[i]) > 0 &&
            _compar(this._list[i], this._list[p]) < 0)
        {
            fail = i;
        }
    }
    if (fail) console.log("failed at", (fail >>> 1), fail);
    return !fail;
}

// optimize access
Heap.prototype = toStruct(Heap.prototype);
function toStruct(o) { return toStruct.prototype = o }
