const filterMetadata = (o) => {
    const copy = {...o};
    delete copy._;
    return copy;
  };
  
  const flatten = (arr) => {
   return arr.reduce((c,v) => {
     if(Array.isArray(v)){
       return c.concat(flatten(v));
     }
     return c.concat(v);
   }, []);
  };
  
  function Query(db) {
    if(!(this instanceof Query)) {
      return new Query(db);
    }
    this.db = db;
    this.nodes = [];
    this.cursor = 0;
    this.ctx = void 0;
  }
  
  Query.prototype.add = function add(node) {
    this.cursor += 1;
    this.nodes.push(node);
    this.ctx = this.nodes[this.nodes.length - 1];
  };
  
  Query.prototype.getSet = function getSet() {
    const n = this.ctx.then(v => {
      if(Array.isArray(v)) {
        return v.map(filterMetadata);
      }
      return filterMetadata(v);
    })
    .then(r => {
      const getValues = (node) => {
        return Promise.all(Object.keys(node).map(k => this.db.get(k).then()));
      };
      if(Array.isArray(r)) {
        return Promise.all(r.map(getValues)).then(flatten);
      }
      return getValues(r);
    })
    this.add(n);
    return this;
  }
  
  Query.prototype.get = function get(path) {
    if(this.cursor === 0) {
      const node = this.db.get(path).then();
      this.add(node);
      return this;
    }
    const prev = this.nodes[this.cursor - 1];
    const pNode = prev.then(r => {
      if(Array.isArray(r)) {
        const nodes = r.map(v => {
          if(v[path] && v[path]["#"]) {
            return this.db.get(v[path]["#"]).then();
          }
          return v[path] ? Promise.resolve(v[path]) : "";
        });
        return Promise.all(nodes.filter(v => v));
      }
      if(r[path] && r[path]["#"]) {
        return this.db.get(r[path]["#"]).then();
      }
      return r[path] ? Promise.resolve(r[path]) : "";
    });
    this.add(pNode);
    return this;
  };
  
  Query.prototype.data = function data(cb) {
    return this.ctx.then(v => {
      if(Array.isArray(v)) {
        return Promise.all(v);
      }
      return v;
    });
  };

export {Query}