
    var SEA = require('./root');
    var shim = require('./shim');
    var S = require('./settings');
    var sha256hash = require('./sha256');
    var parse = require('./parse');
    var u;

    SEA.verify = SEA.verify || (async (data, pair, cb, opt) => { try {
      const json = parse(data)
      if(false === pair){ // don't verify!
        const raw = (json !== data)?
          (json.s && json.m)? parse(json.m) : data
        : json;
        if(cb){ try{ cb(raw) }catch(e){console.log(e)} }
        return raw;
      }
      opt = opt || {};
      // SEA.I // verify is free! Requires no user permission.
      if(json === data){ throw "No signature on data." }
      const pub = pair.pub || pair
      const jwk = S.jwk(pub)
      const key = await (shim.ossl || shim.subtle).importKey('jwk', jwk, S.ecdsa.pair, false, ['verify'])
      const hash = await sha256hash(json.m)
      var buf; var sig; var check; try{
        buf = shim.Buffer.from(json.s, opt.encode || 'base64') // NEW DEFAULT!
        sig = new Uint8Array(buf)
        check = await (shim.ossl || shim.subtle).verify(S.ecdsa.sign, key, sig, new Uint8Array(hash))
        if(!check){ throw "Signature did not match." }
      }catch(e){
        buf = shim.Buffer.from(json.s, 'utf8') // AUTO BACKWARD OLD UTF8 DATA!
        sig = new Uint8Array(buf)
        check = await (shim.ossl || shim.subtle).verify(S.ecdsa.sign, key, sig, new Uint8Array(hash))
        if(!check){ throw "Signature did not match." }
      }
      const r = check? parse(json.m) : u;

      if(cb){ try{ cb(r) }catch(e){console.log(e)} }
      return r;
    } catch(e) {
      console.log(e); // mismatched owner FOR MARTTI
      SEA.err = e;
      if(SEA.throw){ throw e }
      if(cb){ cb() }
      return;
    }});

    module.exports = SEA.verify;
  