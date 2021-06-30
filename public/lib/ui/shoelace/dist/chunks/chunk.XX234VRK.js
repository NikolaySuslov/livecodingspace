// src/internal/decorators.ts
function event(eventName) {
  function legacyEvent(descriptor, protoOrDescriptor, name) {
    Object.defineProperty(protoOrDescriptor, name, descriptor);
  }
  function standardEvent(descriptor, element) {
    return {
      kind: "method",
      placement: "prototype",
      key: element.key,
      descriptor
    };
  }
  return (protoOrDescriptor, name) => {
    const descriptor = {
      get() {
        return new EventEmitter(this, eventName || (name !== void 0 ? name : protoOrDescriptor.key));
      },
      enumerable: true,
      configurable: true
    };
    return name !== void 0 ? legacyEvent(descriptor, protoOrDescriptor, name) : standardEvent(descriptor, protoOrDescriptor);
  };
}
var EventEmitter = class {
  constructor(target, eventName) {
    this.target = target;
    this.eventName = eventName;
  }
  emit(eventOptions) {
    const event2 = new CustomEvent(this.eventName, Object.assign({
      bubbles: true,
      cancelable: false,
      composed: true,
      detail: {}
    }, eventOptions));
    this.target.dispatchEvent(event2);
    return event2;
  }
};
function watch(propName) {
  return (protoOrDescriptor, name) => {
    const { updated } = protoOrDescriptor;
    protoOrDescriptor.updated = function(changedProps) {
      if (changedProps.has(propName)) {
        const oldValue = changedProps.get(propName);
        const newValue = this[propName];
        if (oldValue !== newValue) {
          this[name].call(this, oldValue, newValue);
        }
      }
      updated.call(this, changedProps);
    };
  };
}

export {
  event,
  watch
};
