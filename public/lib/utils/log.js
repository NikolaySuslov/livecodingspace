function log(o) {
    if(typeof o === "object" && "_" in o) {
      const obj = {...o};
      delete obj._;
      return console.log(obj);
    }
    return console.log(o);
  }
  
  log.info = function(v) {
    console.log(v + "\n" + "-".repeat(10));
  }
  
export {log}
  