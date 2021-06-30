import {
  watch
} from "./chunk.XX234VRK.js";
import {
  T,
  e,
  h,
  n,
  r2 as r
} from "./chunk.5PIDMFOE.js";
import {
  __decorateClass
} from "./chunk.IHGPZX35.js";

// src/components/relative-time/relative-time.ts
var SlRelativeTime = class extends h {
  constructor() {
    super(...arguments);
    this.isoTime = "";
    this.relativeTime = "";
    this.titleTime = "";
    this.format = "long";
    this.numeric = "auto";
    this.sync = false;
  }
  connectedCallback() {
    super.connectedCallback();
    this.updateTime();
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    clearTimeout(this.updateTimeout);
  }
  updateTime() {
    const now = new Date();
    const date = new Date(this.date);
    if (isNaN(date.getMilliseconds())) {
      this.relativeTime = "";
      this.isoTime = "";
      return;
    }
    const diff = +date - +now;
    const availableUnits = [
      { max: 276e4, value: 6e4, unit: "minute" },
      { max: 72e6, value: 36e5, unit: "hour" },
      { max: 5184e5, value: 864e5, unit: "day" },
      { max: 24192e5, value: 6048e5, unit: "week" },
      { max: 28512e6, value: 2592e6, unit: "month" },
      { max: Infinity, value: 31536e6, unit: "year" }
    ];
    const { unit, value } = availableUnits.find((unit2) => Math.abs(diff) < unit2.max);
    this.isoTime = date.toISOString();
    this.titleTime = new Intl.DateTimeFormat(this.locale, {
      month: "long",
      year: "numeric",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      timeZoneName: "short"
    }).format(date);
    this.relativeTime = new Intl.RelativeTimeFormat(this.locale, {
      numeric: this.numeric,
      style: this.format
    }).format(Math.round(diff / value), unit);
    clearTimeout(this.updateTimeout);
    if (this.sync) {
      const getTimeUntilNextUnit = (unit2) => {
        const units = { second: 1e3, minute: 6e4, hour: 36e5, day: 864e5 };
        const value2 = units[unit2];
        return value2 - now.getTime() % value2;
      };
      let nextInterval;
      if (unit === "minute") {
        nextInterval = getTimeUntilNextUnit("second");
      } else if (unit === "hour") {
        nextInterval = getTimeUntilNextUnit("minute");
      } else if (unit === "day") {
        nextInterval = getTimeUntilNextUnit("hour");
      } else {
        nextInterval = getTimeUntilNextUnit("day");
      }
      this.updateTimeout = setTimeout(() => this.updateTime(), nextInterval);
    }
  }
  render() {
    return T` <time datetime=${this.isoTime} title=${this.titleTime}>${this.relativeTime}</time> `;
  }
};
__decorateClass([
  r()
], SlRelativeTime.prototype, "isoTime", 2);
__decorateClass([
  r()
], SlRelativeTime.prototype, "relativeTime", 2);
__decorateClass([
  r()
], SlRelativeTime.prototype, "titleTime", 2);
__decorateClass([
  e()
], SlRelativeTime.prototype, "date", 2);
__decorateClass([
  e()
], SlRelativeTime.prototype, "locale", 2);
__decorateClass([
  e()
], SlRelativeTime.prototype, "format", 2);
__decorateClass([
  e()
], SlRelativeTime.prototype, "numeric", 2);
__decorateClass([
  e({ type: Boolean })
], SlRelativeTime.prototype, "sync", 2);
__decorateClass([
  watch("date"),
  watch("locale"),
  watch("format"),
  watch("numeric"),
  watch("sync")
], SlRelativeTime.prototype, "updateTime", 1);
SlRelativeTime = __decorateClass([
  n("sl-relative-time")
], SlRelativeTime);
var relative_time_default = SlRelativeTime;

export {
  relative_time_default
};
