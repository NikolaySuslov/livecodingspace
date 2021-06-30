import {
  e,
  h,
  n
} from "./chunk.5PIDMFOE.js";
import {
  __decorateClass
} from "./chunk.IHGPZX35.js";

// src/components/format-date/format-date.ts
var SlFormatDate = class extends h {
  constructor() {
    super(...arguments);
    this.date = new Date();
    this.hourFormat = "auto";
  }
  render() {
    const date = new Date(this.date);
    const hour12 = this.hourFormat === "auto" ? void 0 : this.hourFormat === "12";
    if (isNaN(date.getMilliseconds())) {
      return;
    }
    return new Intl.DateTimeFormat(this.locale, {
      weekday: this.weekday,
      era: this.era,
      year: this.year,
      month: this.month,
      day: this.day,
      hour: this.hour,
      minute: this.minute,
      second: this.second,
      timeZoneName: this.timeZoneName,
      timeZone: this.timeZone,
      hour12
    }).format(date);
  }
};
__decorateClass([
  e()
], SlFormatDate.prototype, "date", 2);
__decorateClass([
  e()
], SlFormatDate.prototype, "locale", 2);
__decorateClass([
  e()
], SlFormatDate.prototype, "weekday", 2);
__decorateClass([
  e()
], SlFormatDate.prototype, "era", 2);
__decorateClass([
  e()
], SlFormatDate.prototype, "year", 2);
__decorateClass([
  e()
], SlFormatDate.prototype, "month", 2);
__decorateClass([
  e()
], SlFormatDate.prototype, "day", 2);
__decorateClass([
  e()
], SlFormatDate.prototype, "hour", 2);
__decorateClass([
  e()
], SlFormatDate.prototype, "minute", 2);
__decorateClass([
  e()
], SlFormatDate.prototype, "second", 2);
__decorateClass([
  e({ attribute: "time-zone-name" })
], SlFormatDate.prototype, "timeZoneName", 2);
__decorateClass([
  e({ attribute: "time-zone" })
], SlFormatDate.prototype, "timeZone", 2);
__decorateClass([
  e({ attribute: "hour-format" })
], SlFormatDate.prototype, "hourFormat", 2);
SlFormatDate = __decorateClass([
  n("sl-format-date")
], SlFormatDate);
var format_date_default = SlFormatDate;

export {
  format_date_default
};
