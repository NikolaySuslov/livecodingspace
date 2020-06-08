
this.initLang = function () {
    console.log("add operations to semantics")
    this.addOperationLang();
}

this.addOperationLang = function () {

    var self = this;
    this.semantics.addOperation('parse',
        {
            all: function (e, _, k) { return { "address": e.parse(), "params": k.parse() } },
            address: function (_, e) { return e.parse() },
            addr: function (e) { return e.parse() },
            props: function (e) { return e.parse() },
            props_single: function (e, k) {
                return { 'propName': e.parse(), 'propValue': k.parse() };
            },
            props_rgb: function (_, e) {
                return { 'propName': 'color', 'propValue': ['rgb(' + e.parse() + ')'] };
            },
            props_prop: function (e, k) {
                return { 'propName': e.parse(), 'propValue': k.parse() };
            },
            row: function (_l, e, k, _e) {
                let end = k.parse();
                if (end.length !== 0) {
                    return e.parse() + ',' + k.parse();
                }
                return e.parse()
            },
            rep: function (_, e) { return e.parse() },
            col: function (e) { return e.parse() },
            colChar: function (e) { return e.parse() },
            number: function (_) { return parseFloat(this.sourceString) },
            propSingle: function (_) { return this.sourceString }
        });
}

this.getOSC = function (msg) {
    this.parseOSC(msg);
}

this.parseOSC = function (msg) {
    let str = msg.address + JSON.stringify(msg.args);
    var match = this.grammar.match(str, "all");
    if (match.succeeded()) {
        let res = this.semantics(match).parse();
        this.setPropsFromOSC(res);
    }
}

this.setPropsFromOSC = function (res) {
    //console.log(res);
    let address = '/' + res.address.join('/');
    let nodeID = vwf.find("", address);
    if (res.params.propValue.length == 1) {
        vwf_view.kernel.setProperty(nodeID, res.params.propName, [res.params.propValue[0]])
    }
    if (res.params.propValue.length >= 1) {
        vwf_view.kernel.setProperty(nodeID, res.params.propName, [res.params.propValue])
    }
}

