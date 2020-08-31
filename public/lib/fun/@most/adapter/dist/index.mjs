var createAdapter = function () {
    var sinks = [];
    return [function (a) { return broadcast(sinks, a); }, new FanoutPortStream(sinks)];
};
var broadcast = function (sinks, a) {
    return sinks.slice().forEach(function (_a) {
        var sink = _a.sink, scheduler = _a.scheduler;
        return tryEvent(scheduler.currentTime(), a, sink);
    });
};
var FanoutPortStream = /** @class */ (function () {
    function FanoutPortStream(sinks) {
        this.sinks = sinks;
    }
    FanoutPortStream.prototype.run = function (sink, scheduler) {
        var s = { sink: sink, scheduler: scheduler };
        this.sinks.push(s);
        return new RemovePortDisposable(s, this.sinks);
    };
    return FanoutPortStream;
}());
var RemovePortDisposable = /** @class */ (function () {
    function RemovePortDisposable(sink, sinks) {
        this.sink = sink;
        this.sinks = sinks;
    }
    RemovePortDisposable.prototype.dispose = function () {
        var i = this.sinks.indexOf(this.sink);
        if (i >= 0) {
            this.sinks.splice(i, 1);
        }
    };
    return RemovePortDisposable;
}());
function tryEvent(t, a, sink) {
    try {
        sink.event(t, a);
    }
    catch (e) {
        sink.error(t, e);
    }
}

export { FanoutPortStream, RemovePortDisposable, createAdapter };
//# sourceMappingURL=index.mjs.map
