import {
  clamp
} from "./chunk.T56CG5BM.js";
import {
  i
} from "./chunk.DA3UDEH5.js";
import {
  l
} from "./chunk.5MED2A3H.js";
import {
  event,
  watch
} from "./chunk.XX234VRK.js";
import {
  e as e2
} from "./chunk.YXKHB4AC.js";
import {
  T,
  e,
  h,
  n,
  o,
  r,
  r2
} from "./chunk.5PIDMFOE.js";
import {
  __commonJS,
  __decorateClass,
  __toModule
} from "./chunk.IHGPZX35.js";

// node_modules/color-name/index.js
var require_color_name = __commonJS({
  "node_modules/color-name/index.js"(exports, module) {
    "use strict";
    module.exports = {
      "aliceblue": [240, 248, 255],
      "antiquewhite": [250, 235, 215],
      "aqua": [0, 255, 255],
      "aquamarine": [127, 255, 212],
      "azure": [240, 255, 255],
      "beige": [245, 245, 220],
      "bisque": [255, 228, 196],
      "black": [0, 0, 0],
      "blanchedalmond": [255, 235, 205],
      "blue": [0, 0, 255],
      "blueviolet": [138, 43, 226],
      "brown": [165, 42, 42],
      "burlywood": [222, 184, 135],
      "cadetblue": [95, 158, 160],
      "chartreuse": [127, 255, 0],
      "chocolate": [210, 105, 30],
      "coral": [255, 127, 80],
      "cornflowerblue": [100, 149, 237],
      "cornsilk": [255, 248, 220],
      "crimson": [220, 20, 60],
      "cyan": [0, 255, 255],
      "darkblue": [0, 0, 139],
      "darkcyan": [0, 139, 139],
      "darkgoldenrod": [184, 134, 11],
      "darkgray": [169, 169, 169],
      "darkgreen": [0, 100, 0],
      "darkgrey": [169, 169, 169],
      "darkkhaki": [189, 183, 107],
      "darkmagenta": [139, 0, 139],
      "darkolivegreen": [85, 107, 47],
      "darkorange": [255, 140, 0],
      "darkorchid": [153, 50, 204],
      "darkred": [139, 0, 0],
      "darksalmon": [233, 150, 122],
      "darkseagreen": [143, 188, 143],
      "darkslateblue": [72, 61, 139],
      "darkslategray": [47, 79, 79],
      "darkslategrey": [47, 79, 79],
      "darkturquoise": [0, 206, 209],
      "darkviolet": [148, 0, 211],
      "deeppink": [255, 20, 147],
      "deepskyblue": [0, 191, 255],
      "dimgray": [105, 105, 105],
      "dimgrey": [105, 105, 105],
      "dodgerblue": [30, 144, 255],
      "firebrick": [178, 34, 34],
      "floralwhite": [255, 250, 240],
      "forestgreen": [34, 139, 34],
      "fuchsia": [255, 0, 255],
      "gainsboro": [220, 220, 220],
      "ghostwhite": [248, 248, 255],
      "gold": [255, 215, 0],
      "goldenrod": [218, 165, 32],
      "gray": [128, 128, 128],
      "green": [0, 128, 0],
      "greenyellow": [173, 255, 47],
      "grey": [128, 128, 128],
      "honeydew": [240, 255, 240],
      "hotpink": [255, 105, 180],
      "indianred": [205, 92, 92],
      "indigo": [75, 0, 130],
      "ivory": [255, 255, 240],
      "khaki": [240, 230, 140],
      "lavender": [230, 230, 250],
      "lavenderblush": [255, 240, 245],
      "lawngreen": [124, 252, 0],
      "lemonchiffon": [255, 250, 205],
      "lightblue": [173, 216, 230],
      "lightcoral": [240, 128, 128],
      "lightcyan": [224, 255, 255],
      "lightgoldenrodyellow": [250, 250, 210],
      "lightgray": [211, 211, 211],
      "lightgreen": [144, 238, 144],
      "lightgrey": [211, 211, 211],
      "lightpink": [255, 182, 193],
      "lightsalmon": [255, 160, 122],
      "lightseagreen": [32, 178, 170],
      "lightskyblue": [135, 206, 250],
      "lightslategray": [119, 136, 153],
      "lightslategrey": [119, 136, 153],
      "lightsteelblue": [176, 196, 222],
      "lightyellow": [255, 255, 224],
      "lime": [0, 255, 0],
      "limegreen": [50, 205, 50],
      "linen": [250, 240, 230],
      "magenta": [255, 0, 255],
      "maroon": [128, 0, 0],
      "mediumaquamarine": [102, 205, 170],
      "mediumblue": [0, 0, 205],
      "mediumorchid": [186, 85, 211],
      "mediumpurple": [147, 112, 219],
      "mediumseagreen": [60, 179, 113],
      "mediumslateblue": [123, 104, 238],
      "mediumspringgreen": [0, 250, 154],
      "mediumturquoise": [72, 209, 204],
      "mediumvioletred": [199, 21, 133],
      "midnightblue": [25, 25, 112],
      "mintcream": [245, 255, 250],
      "mistyrose": [255, 228, 225],
      "moccasin": [255, 228, 181],
      "navajowhite": [255, 222, 173],
      "navy": [0, 0, 128],
      "oldlace": [253, 245, 230],
      "olive": [128, 128, 0],
      "olivedrab": [107, 142, 35],
      "orange": [255, 165, 0],
      "orangered": [255, 69, 0],
      "orchid": [218, 112, 214],
      "palegoldenrod": [238, 232, 170],
      "palegreen": [152, 251, 152],
      "paleturquoise": [175, 238, 238],
      "palevioletred": [219, 112, 147],
      "papayawhip": [255, 239, 213],
      "peachpuff": [255, 218, 185],
      "peru": [205, 133, 63],
      "pink": [255, 192, 203],
      "plum": [221, 160, 221],
      "powderblue": [176, 224, 230],
      "purple": [128, 0, 128],
      "rebeccapurple": [102, 51, 153],
      "red": [255, 0, 0],
      "rosybrown": [188, 143, 143],
      "royalblue": [65, 105, 225],
      "saddlebrown": [139, 69, 19],
      "salmon": [250, 128, 114],
      "sandybrown": [244, 164, 96],
      "seagreen": [46, 139, 87],
      "seashell": [255, 245, 238],
      "sienna": [160, 82, 45],
      "silver": [192, 192, 192],
      "skyblue": [135, 206, 235],
      "slateblue": [106, 90, 205],
      "slategray": [112, 128, 144],
      "slategrey": [112, 128, 144],
      "snow": [255, 250, 250],
      "springgreen": [0, 255, 127],
      "steelblue": [70, 130, 180],
      "tan": [210, 180, 140],
      "teal": [0, 128, 128],
      "thistle": [216, 191, 216],
      "tomato": [255, 99, 71],
      "turquoise": [64, 224, 208],
      "violet": [238, 130, 238],
      "wheat": [245, 222, 179],
      "white": [255, 255, 255],
      "whitesmoke": [245, 245, 245],
      "yellow": [255, 255, 0],
      "yellowgreen": [154, 205, 50]
    };
  }
});

// node_modules/is-arrayish/index.js
var require_is_arrayish = __commonJS({
  "node_modules/is-arrayish/index.js"(exports, module) {
    module.exports = function isArrayish(obj) {
      if (!obj || typeof obj === "string") {
        return false;
      }
      return obj instanceof Array || Array.isArray(obj) || obj.length >= 0 && (obj.splice instanceof Function || Object.getOwnPropertyDescriptor(obj, obj.length - 1) && obj.constructor.name !== "String");
    };
  }
});

// node_modules/simple-swizzle/index.js
var require_simple_swizzle = __commonJS({
  "node_modules/simple-swizzle/index.js"(exports, module) {
    "use strict";
    var isArrayish = require_is_arrayish();
    var concat = Array.prototype.concat;
    var slice = Array.prototype.slice;
    var swizzle = module.exports = function swizzle2(args) {
      var results = [];
      for (var i2 = 0, len = args.length; i2 < len; i2++) {
        var arg = args[i2];
        if (isArrayish(arg)) {
          results = concat.call(results, slice.call(arg));
        } else {
          results.push(arg);
        }
      }
      return results;
    };
    swizzle.wrap = function(fn) {
      return function() {
        return fn(swizzle(arguments));
      };
    };
  }
});

// node_modules/color-string/index.js
var require_color_string = __commonJS({
  "node_modules/color-string/index.js"(exports, module) {
    var colorNames = require_color_name();
    var swizzle = require_simple_swizzle();
    var reverseNames = {};
    for (var name in colorNames) {
      if (colorNames.hasOwnProperty(name)) {
        reverseNames[colorNames[name]] = name;
      }
    }
    var cs = module.exports = {
      to: {},
      get: {}
    };
    cs.get = function(string) {
      var prefix = string.substring(0, 3).toLowerCase();
      var val;
      var model;
      switch (prefix) {
        case "hsl":
          val = cs.get.hsl(string);
          model = "hsl";
          break;
        case "hwb":
          val = cs.get.hwb(string);
          model = "hwb";
          break;
        default:
          val = cs.get.rgb(string);
          model = "rgb";
          break;
      }
      if (!val) {
        return null;
      }
      return { model, value: val };
    };
    cs.get.rgb = function(string) {
      if (!string) {
        return null;
      }
      var abbr = /^#([a-f0-9]{3,4})$/i;
      var hex = /^#([a-f0-9]{6})([a-f0-9]{2})?$/i;
      var rgba = /^rgba?\(\s*([+-]?\d+)\s*,\s*([+-]?\d+)\s*,\s*([+-]?\d+)\s*(?:,\s*([+-]?[\d\.]+)\s*)?\)$/;
      var per = /^rgba?\(\s*([+-]?[\d\.]+)\%\s*,\s*([+-]?[\d\.]+)\%\s*,\s*([+-]?[\d\.]+)\%\s*(?:,\s*([+-]?[\d\.]+)\s*)?\)$/;
      var keyword = /(\D+)/;
      var rgb = [0, 0, 0, 1];
      var match;
      var i2;
      var hexAlpha;
      if (match = string.match(hex)) {
        hexAlpha = match[2];
        match = match[1];
        for (i2 = 0; i2 < 3; i2++) {
          var i22 = i2 * 2;
          rgb[i2] = parseInt(match.slice(i22, i22 + 2), 16);
        }
        if (hexAlpha) {
          rgb[3] = parseInt(hexAlpha, 16) / 255;
        }
      } else if (match = string.match(abbr)) {
        match = match[1];
        hexAlpha = match[3];
        for (i2 = 0; i2 < 3; i2++) {
          rgb[i2] = parseInt(match[i2] + match[i2], 16);
        }
        if (hexAlpha) {
          rgb[3] = parseInt(hexAlpha + hexAlpha, 16) / 255;
        }
      } else if (match = string.match(rgba)) {
        for (i2 = 0; i2 < 3; i2++) {
          rgb[i2] = parseInt(match[i2 + 1], 0);
        }
        if (match[4]) {
          rgb[3] = parseFloat(match[4]);
        }
      } else if (match = string.match(per)) {
        for (i2 = 0; i2 < 3; i2++) {
          rgb[i2] = Math.round(parseFloat(match[i2 + 1]) * 2.55);
        }
        if (match[4]) {
          rgb[3] = parseFloat(match[4]);
        }
      } else if (match = string.match(keyword)) {
        if (match[1] === "transparent") {
          return [0, 0, 0, 0];
        }
        rgb = colorNames[match[1]];
        if (!rgb) {
          return null;
        }
        rgb[3] = 1;
        return rgb;
      } else {
        return null;
      }
      for (i2 = 0; i2 < 3; i2++) {
        rgb[i2] = clamp2(rgb[i2], 0, 255);
      }
      rgb[3] = clamp2(rgb[3], 0, 1);
      return rgb;
    };
    cs.get.hsl = function(string) {
      if (!string) {
        return null;
      }
      var hsl = /^hsla?\(\s*([+-]?(?:\d*\.)?\d+)(?:deg)?\s*,\s*([+-]?[\d\.]+)%\s*,\s*([+-]?[\d\.]+)%\s*(?:,\s*([+-]?[\d\.]+)\s*)?\)$/;
      var match = string.match(hsl);
      if (match) {
        var alpha = parseFloat(match[4]);
        var h2 = (parseFloat(match[1]) + 360) % 360;
        var s = clamp2(parseFloat(match[2]), 0, 100);
        var l2 = clamp2(parseFloat(match[3]), 0, 100);
        var a = clamp2(isNaN(alpha) ? 1 : alpha, 0, 1);
        return [h2, s, l2, a];
      }
      return null;
    };
    cs.get.hwb = function(string) {
      if (!string) {
        return null;
      }
      var hwb = /^hwb\(\s*([+-]?\d*[\.]?\d+)(?:deg)?\s*,\s*([+-]?[\d\.]+)%\s*,\s*([+-]?[\d\.]+)%\s*(?:,\s*([+-]?[\d\.]+)\s*)?\)$/;
      var match = string.match(hwb);
      if (match) {
        var alpha = parseFloat(match[4]);
        var h2 = (parseFloat(match[1]) % 360 + 360) % 360;
        var w = clamp2(parseFloat(match[2]), 0, 100);
        var b = clamp2(parseFloat(match[3]), 0, 100);
        var a = clamp2(isNaN(alpha) ? 1 : alpha, 0, 1);
        return [h2, w, b, a];
      }
      return null;
    };
    cs.to.hex = function() {
      var rgba = swizzle(arguments);
      return "#" + hexDouble(rgba[0]) + hexDouble(rgba[1]) + hexDouble(rgba[2]) + (rgba[3] < 1 ? hexDouble(Math.round(rgba[3] * 255)) : "");
    };
    cs.to.rgb = function() {
      var rgba = swizzle(arguments);
      return rgba.length < 4 || rgba[3] === 1 ? "rgb(" + Math.round(rgba[0]) + ", " + Math.round(rgba[1]) + ", " + Math.round(rgba[2]) + ")" : "rgba(" + Math.round(rgba[0]) + ", " + Math.round(rgba[1]) + ", " + Math.round(rgba[2]) + ", " + rgba[3] + ")";
    };
    cs.to.rgb.percent = function() {
      var rgba = swizzle(arguments);
      var r3 = Math.round(rgba[0] / 255 * 100);
      var g = Math.round(rgba[1] / 255 * 100);
      var b = Math.round(rgba[2] / 255 * 100);
      return rgba.length < 4 || rgba[3] === 1 ? "rgb(" + r3 + "%, " + g + "%, " + b + "%)" : "rgba(" + r3 + "%, " + g + "%, " + b + "%, " + rgba[3] + ")";
    };
    cs.to.hsl = function() {
      var hsla = swizzle(arguments);
      return hsla.length < 4 || hsla[3] === 1 ? "hsl(" + hsla[0] + ", " + hsla[1] + "%, " + hsla[2] + "%)" : "hsla(" + hsla[0] + ", " + hsla[1] + "%, " + hsla[2] + "%, " + hsla[3] + ")";
    };
    cs.to.hwb = function() {
      var hwba = swizzle(arguments);
      var a = "";
      if (hwba.length >= 4 && hwba[3] !== 1) {
        a = ", " + hwba[3];
      }
      return "hwb(" + hwba[0] + ", " + hwba[1] + "%, " + hwba[2] + "%" + a + ")";
    };
    cs.to.keyword = function(rgb) {
      return reverseNames[rgb.slice(0, 3)];
    };
    function clamp2(num, min, max) {
      return Math.min(Math.max(min, num), max);
    }
    function hexDouble(num) {
      var str = num.toString(16).toUpperCase();
      return str.length < 2 ? "0" + str : str;
    }
  }
});

// node_modules/color-convert/conversions.js
var require_conversions = __commonJS({
  "node_modules/color-convert/conversions.js"(exports, module) {
    var cssKeywords = require_color_name();
    var reverseKeywords = {};
    for (var key in cssKeywords) {
      if (cssKeywords.hasOwnProperty(key)) {
        reverseKeywords[cssKeywords[key]] = key;
      }
    }
    var convert = module.exports = {
      rgb: { channels: 3, labels: "rgb" },
      hsl: { channels: 3, labels: "hsl" },
      hsv: { channels: 3, labels: "hsv" },
      hwb: { channels: 3, labels: "hwb" },
      cmyk: { channels: 4, labels: "cmyk" },
      xyz: { channels: 3, labels: "xyz" },
      lab: { channels: 3, labels: "lab" },
      lch: { channels: 3, labels: "lch" },
      hex: { channels: 1, labels: ["hex"] },
      keyword: { channels: 1, labels: ["keyword"] },
      ansi16: { channels: 1, labels: ["ansi16"] },
      ansi256: { channels: 1, labels: ["ansi256"] },
      hcg: { channels: 3, labels: ["h", "c", "g"] },
      apple: { channels: 3, labels: ["r16", "g16", "b16"] },
      gray: { channels: 1, labels: ["gray"] }
    };
    for (var model in convert) {
      if (convert.hasOwnProperty(model)) {
        if (!("channels" in convert[model])) {
          throw new Error("missing channels property: " + model);
        }
        if (!("labels" in convert[model])) {
          throw new Error("missing channel labels property: " + model);
        }
        if (convert[model].labels.length !== convert[model].channels) {
          throw new Error("channel and label counts mismatch: " + model);
        }
        channels = convert[model].channels;
        labels = convert[model].labels;
        delete convert[model].channels;
        delete convert[model].labels;
        Object.defineProperty(convert[model], "channels", { value: channels });
        Object.defineProperty(convert[model], "labels", { value: labels });
      }
    }
    var channels;
    var labels;
    convert.rgb.hsl = function(rgb) {
      var r3 = rgb[0] / 255;
      var g = rgb[1] / 255;
      var b = rgb[2] / 255;
      var min = Math.min(r3, g, b);
      var max = Math.max(r3, g, b);
      var delta = max - min;
      var h2;
      var s;
      var l2;
      if (max === min) {
        h2 = 0;
      } else if (r3 === max) {
        h2 = (g - b) / delta;
      } else if (g === max) {
        h2 = 2 + (b - r3) / delta;
      } else if (b === max) {
        h2 = 4 + (r3 - g) / delta;
      }
      h2 = Math.min(h2 * 60, 360);
      if (h2 < 0) {
        h2 += 360;
      }
      l2 = (min + max) / 2;
      if (max === min) {
        s = 0;
      } else if (l2 <= 0.5) {
        s = delta / (max + min);
      } else {
        s = delta / (2 - max - min);
      }
      return [h2, s * 100, l2 * 100];
    };
    convert.rgb.hsv = function(rgb) {
      var rdif;
      var gdif;
      var bdif;
      var h2;
      var s;
      var r3 = rgb[0] / 255;
      var g = rgb[1] / 255;
      var b = rgb[2] / 255;
      var v = Math.max(r3, g, b);
      var diff = v - Math.min(r3, g, b);
      var diffc = function(c) {
        return (v - c) / 6 / diff + 1 / 2;
      };
      if (diff === 0) {
        h2 = s = 0;
      } else {
        s = diff / v;
        rdif = diffc(r3);
        gdif = diffc(g);
        bdif = diffc(b);
        if (r3 === v) {
          h2 = bdif - gdif;
        } else if (g === v) {
          h2 = 1 / 3 + rdif - bdif;
        } else if (b === v) {
          h2 = 2 / 3 + gdif - rdif;
        }
        if (h2 < 0) {
          h2 += 1;
        } else if (h2 > 1) {
          h2 -= 1;
        }
      }
      return [
        h2 * 360,
        s * 100,
        v * 100
      ];
    };
    convert.rgb.hwb = function(rgb) {
      var r3 = rgb[0];
      var g = rgb[1];
      var b = rgb[2];
      var h2 = convert.rgb.hsl(rgb)[0];
      var w = 1 / 255 * Math.min(r3, Math.min(g, b));
      b = 1 - 1 / 255 * Math.max(r3, Math.max(g, b));
      return [h2, w * 100, b * 100];
    };
    convert.rgb.cmyk = function(rgb) {
      var r3 = rgb[0] / 255;
      var g = rgb[1] / 255;
      var b = rgb[2] / 255;
      var c;
      var m;
      var y;
      var k;
      k = Math.min(1 - r3, 1 - g, 1 - b);
      c = (1 - r3 - k) / (1 - k) || 0;
      m = (1 - g - k) / (1 - k) || 0;
      y = (1 - b - k) / (1 - k) || 0;
      return [c * 100, m * 100, y * 100, k * 100];
    };
    function comparativeDistance(x, y) {
      return Math.pow(x[0] - y[0], 2) + Math.pow(x[1] - y[1], 2) + Math.pow(x[2] - y[2], 2);
    }
    convert.rgb.keyword = function(rgb) {
      var reversed = reverseKeywords[rgb];
      if (reversed) {
        return reversed;
      }
      var currentClosestDistance = Infinity;
      var currentClosestKeyword;
      for (var keyword in cssKeywords) {
        if (cssKeywords.hasOwnProperty(keyword)) {
          var value = cssKeywords[keyword];
          var distance = comparativeDistance(rgb, value);
          if (distance < currentClosestDistance) {
            currentClosestDistance = distance;
            currentClosestKeyword = keyword;
          }
        }
      }
      return currentClosestKeyword;
    };
    convert.keyword.rgb = function(keyword) {
      return cssKeywords[keyword];
    };
    convert.rgb.xyz = function(rgb) {
      var r3 = rgb[0] / 255;
      var g = rgb[1] / 255;
      var b = rgb[2] / 255;
      r3 = r3 > 0.04045 ? Math.pow((r3 + 0.055) / 1.055, 2.4) : r3 / 12.92;
      g = g > 0.04045 ? Math.pow((g + 0.055) / 1.055, 2.4) : g / 12.92;
      b = b > 0.04045 ? Math.pow((b + 0.055) / 1.055, 2.4) : b / 12.92;
      var x = r3 * 0.4124 + g * 0.3576 + b * 0.1805;
      var y = r3 * 0.2126 + g * 0.7152 + b * 0.0722;
      var z = r3 * 0.0193 + g * 0.1192 + b * 0.9505;
      return [x * 100, y * 100, z * 100];
    };
    convert.rgb.lab = function(rgb) {
      var xyz = convert.rgb.xyz(rgb);
      var x = xyz[0];
      var y = xyz[1];
      var z = xyz[2];
      var l2;
      var a;
      var b;
      x /= 95.047;
      y /= 100;
      z /= 108.883;
      x = x > 8856e-6 ? Math.pow(x, 1 / 3) : 7.787 * x + 16 / 116;
      y = y > 8856e-6 ? Math.pow(y, 1 / 3) : 7.787 * y + 16 / 116;
      z = z > 8856e-6 ? Math.pow(z, 1 / 3) : 7.787 * z + 16 / 116;
      l2 = 116 * y - 16;
      a = 500 * (x - y);
      b = 200 * (y - z);
      return [l2, a, b];
    };
    convert.hsl.rgb = function(hsl) {
      var h2 = hsl[0] / 360;
      var s = hsl[1] / 100;
      var l2 = hsl[2] / 100;
      var t1;
      var t2;
      var t3;
      var rgb;
      var val;
      if (s === 0) {
        val = l2 * 255;
        return [val, val, val];
      }
      if (l2 < 0.5) {
        t2 = l2 * (1 + s);
      } else {
        t2 = l2 + s - l2 * s;
      }
      t1 = 2 * l2 - t2;
      rgb = [0, 0, 0];
      for (var i2 = 0; i2 < 3; i2++) {
        t3 = h2 + 1 / 3 * -(i2 - 1);
        if (t3 < 0) {
          t3++;
        }
        if (t3 > 1) {
          t3--;
        }
        if (6 * t3 < 1) {
          val = t1 + (t2 - t1) * 6 * t3;
        } else if (2 * t3 < 1) {
          val = t2;
        } else if (3 * t3 < 2) {
          val = t1 + (t2 - t1) * (2 / 3 - t3) * 6;
        } else {
          val = t1;
        }
        rgb[i2] = val * 255;
      }
      return rgb;
    };
    convert.hsl.hsv = function(hsl) {
      var h2 = hsl[0];
      var s = hsl[1] / 100;
      var l2 = hsl[2] / 100;
      var smin = s;
      var lmin = Math.max(l2, 0.01);
      var sv;
      var v;
      l2 *= 2;
      s *= l2 <= 1 ? l2 : 2 - l2;
      smin *= lmin <= 1 ? lmin : 2 - lmin;
      v = (l2 + s) / 2;
      sv = l2 === 0 ? 2 * smin / (lmin + smin) : 2 * s / (l2 + s);
      return [h2, sv * 100, v * 100];
    };
    convert.hsv.rgb = function(hsv) {
      var h2 = hsv[0] / 60;
      var s = hsv[1] / 100;
      var v = hsv[2] / 100;
      var hi = Math.floor(h2) % 6;
      var f = h2 - Math.floor(h2);
      var p = 255 * v * (1 - s);
      var q = 255 * v * (1 - s * f);
      var t = 255 * v * (1 - s * (1 - f));
      v *= 255;
      switch (hi) {
        case 0:
          return [v, t, p];
        case 1:
          return [q, v, p];
        case 2:
          return [p, v, t];
        case 3:
          return [p, q, v];
        case 4:
          return [t, p, v];
        case 5:
          return [v, p, q];
      }
    };
    convert.hsv.hsl = function(hsv) {
      var h2 = hsv[0];
      var s = hsv[1] / 100;
      var v = hsv[2] / 100;
      var vmin = Math.max(v, 0.01);
      var lmin;
      var sl;
      var l2;
      l2 = (2 - s) * v;
      lmin = (2 - s) * vmin;
      sl = s * vmin;
      sl /= lmin <= 1 ? lmin : 2 - lmin;
      sl = sl || 0;
      l2 /= 2;
      return [h2, sl * 100, l2 * 100];
    };
    convert.hwb.rgb = function(hwb) {
      var h2 = hwb[0] / 360;
      var wh = hwb[1] / 100;
      var bl = hwb[2] / 100;
      var ratio = wh + bl;
      var i2;
      var v;
      var f;
      var n2;
      if (ratio > 1) {
        wh /= ratio;
        bl /= ratio;
      }
      i2 = Math.floor(6 * h2);
      v = 1 - bl;
      f = 6 * h2 - i2;
      if ((i2 & 1) !== 0) {
        f = 1 - f;
      }
      n2 = wh + f * (v - wh);
      var r3;
      var g;
      var b;
      switch (i2) {
        default:
        case 6:
        case 0:
          r3 = v;
          g = n2;
          b = wh;
          break;
        case 1:
          r3 = n2;
          g = v;
          b = wh;
          break;
        case 2:
          r3 = wh;
          g = v;
          b = n2;
          break;
        case 3:
          r3 = wh;
          g = n2;
          b = v;
          break;
        case 4:
          r3 = n2;
          g = wh;
          b = v;
          break;
        case 5:
          r3 = v;
          g = wh;
          b = n2;
          break;
      }
      return [r3 * 255, g * 255, b * 255];
    };
    convert.cmyk.rgb = function(cmyk) {
      var c = cmyk[0] / 100;
      var m = cmyk[1] / 100;
      var y = cmyk[2] / 100;
      var k = cmyk[3] / 100;
      var r3;
      var g;
      var b;
      r3 = 1 - Math.min(1, c * (1 - k) + k);
      g = 1 - Math.min(1, m * (1 - k) + k);
      b = 1 - Math.min(1, y * (1 - k) + k);
      return [r3 * 255, g * 255, b * 255];
    };
    convert.xyz.rgb = function(xyz) {
      var x = xyz[0] / 100;
      var y = xyz[1] / 100;
      var z = xyz[2] / 100;
      var r3;
      var g;
      var b;
      r3 = x * 3.2406 + y * -1.5372 + z * -0.4986;
      g = x * -0.9689 + y * 1.8758 + z * 0.0415;
      b = x * 0.0557 + y * -0.204 + z * 1.057;
      r3 = r3 > 31308e-7 ? 1.055 * Math.pow(r3, 1 / 2.4) - 0.055 : r3 * 12.92;
      g = g > 31308e-7 ? 1.055 * Math.pow(g, 1 / 2.4) - 0.055 : g * 12.92;
      b = b > 31308e-7 ? 1.055 * Math.pow(b, 1 / 2.4) - 0.055 : b * 12.92;
      r3 = Math.min(Math.max(0, r3), 1);
      g = Math.min(Math.max(0, g), 1);
      b = Math.min(Math.max(0, b), 1);
      return [r3 * 255, g * 255, b * 255];
    };
    convert.xyz.lab = function(xyz) {
      var x = xyz[0];
      var y = xyz[1];
      var z = xyz[2];
      var l2;
      var a;
      var b;
      x /= 95.047;
      y /= 100;
      z /= 108.883;
      x = x > 8856e-6 ? Math.pow(x, 1 / 3) : 7.787 * x + 16 / 116;
      y = y > 8856e-6 ? Math.pow(y, 1 / 3) : 7.787 * y + 16 / 116;
      z = z > 8856e-6 ? Math.pow(z, 1 / 3) : 7.787 * z + 16 / 116;
      l2 = 116 * y - 16;
      a = 500 * (x - y);
      b = 200 * (y - z);
      return [l2, a, b];
    };
    convert.lab.xyz = function(lab) {
      var l2 = lab[0];
      var a = lab[1];
      var b = lab[2];
      var x;
      var y;
      var z;
      y = (l2 + 16) / 116;
      x = a / 500 + y;
      z = y - b / 200;
      var y2 = Math.pow(y, 3);
      var x2 = Math.pow(x, 3);
      var z2 = Math.pow(z, 3);
      y = y2 > 8856e-6 ? y2 : (y - 16 / 116) / 7.787;
      x = x2 > 8856e-6 ? x2 : (x - 16 / 116) / 7.787;
      z = z2 > 8856e-6 ? z2 : (z - 16 / 116) / 7.787;
      x *= 95.047;
      y *= 100;
      z *= 108.883;
      return [x, y, z];
    };
    convert.lab.lch = function(lab) {
      var l2 = lab[0];
      var a = lab[1];
      var b = lab[2];
      var hr;
      var h2;
      var c;
      hr = Math.atan2(b, a);
      h2 = hr * 360 / 2 / Math.PI;
      if (h2 < 0) {
        h2 += 360;
      }
      c = Math.sqrt(a * a + b * b);
      return [l2, c, h2];
    };
    convert.lch.lab = function(lch) {
      var l2 = lch[0];
      var c = lch[1];
      var h2 = lch[2];
      var a;
      var b;
      var hr;
      hr = h2 / 360 * 2 * Math.PI;
      a = c * Math.cos(hr);
      b = c * Math.sin(hr);
      return [l2, a, b];
    };
    convert.rgb.ansi16 = function(args) {
      var r3 = args[0];
      var g = args[1];
      var b = args[2];
      var value = 1 in arguments ? arguments[1] : convert.rgb.hsv(args)[2];
      value = Math.round(value / 50);
      if (value === 0) {
        return 30;
      }
      var ansi = 30 + (Math.round(b / 255) << 2 | Math.round(g / 255) << 1 | Math.round(r3 / 255));
      if (value === 2) {
        ansi += 60;
      }
      return ansi;
    };
    convert.hsv.ansi16 = function(args) {
      return convert.rgb.ansi16(convert.hsv.rgb(args), args[2]);
    };
    convert.rgb.ansi256 = function(args) {
      var r3 = args[0];
      var g = args[1];
      var b = args[2];
      if (r3 === g && g === b) {
        if (r3 < 8) {
          return 16;
        }
        if (r3 > 248) {
          return 231;
        }
        return Math.round((r3 - 8) / 247 * 24) + 232;
      }
      var ansi = 16 + 36 * Math.round(r3 / 255 * 5) + 6 * Math.round(g / 255 * 5) + Math.round(b / 255 * 5);
      return ansi;
    };
    convert.ansi16.rgb = function(args) {
      var color2 = args % 10;
      if (color2 === 0 || color2 === 7) {
        if (args > 50) {
          color2 += 3.5;
        }
        color2 = color2 / 10.5 * 255;
        return [color2, color2, color2];
      }
      var mult = (~~(args > 50) + 1) * 0.5;
      var r3 = (color2 & 1) * mult * 255;
      var g = (color2 >> 1 & 1) * mult * 255;
      var b = (color2 >> 2 & 1) * mult * 255;
      return [r3, g, b];
    };
    convert.ansi256.rgb = function(args) {
      if (args >= 232) {
        var c = (args - 232) * 10 + 8;
        return [c, c, c];
      }
      args -= 16;
      var rem;
      var r3 = Math.floor(args / 36) / 5 * 255;
      var g = Math.floor((rem = args % 36) / 6) / 5 * 255;
      var b = rem % 6 / 5 * 255;
      return [r3, g, b];
    };
    convert.rgb.hex = function(args) {
      var integer = ((Math.round(args[0]) & 255) << 16) + ((Math.round(args[1]) & 255) << 8) + (Math.round(args[2]) & 255);
      var string = integer.toString(16).toUpperCase();
      return "000000".substring(string.length) + string;
    };
    convert.hex.rgb = function(args) {
      var match = args.toString(16).match(/[a-f0-9]{6}|[a-f0-9]{3}/i);
      if (!match) {
        return [0, 0, 0];
      }
      var colorString = match[0];
      if (match[0].length === 3) {
        colorString = colorString.split("").map(function(char) {
          return char + char;
        }).join("");
      }
      var integer = parseInt(colorString, 16);
      var r3 = integer >> 16 & 255;
      var g = integer >> 8 & 255;
      var b = integer & 255;
      return [r3, g, b];
    };
    convert.rgb.hcg = function(rgb) {
      var r3 = rgb[0] / 255;
      var g = rgb[1] / 255;
      var b = rgb[2] / 255;
      var max = Math.max(Math.max(r3, g), b);
      var min = Math.min(Math.min(r3, g), b);
      var chroma = max - min;
      var grayscale;
      var hue;
      if (chroma < 1) {
        grayscale = min / (1 - chroma);
      } else {
        grayscale = 0;
      }
      if (chroma <= 0) {
        hue = 0;
      } else if (max === r3) {
        hue = (g - b) / chroma % 6;
      } else if (max === g) {
        hue = 2 + (b - r3) / chroma;
      } else {
        hue = 4 + (r3 - g) / chroma + 4;
      }
      hue /= 6;
      hue %= 1;
      return [hue * 360, chroma * 100, grayscale * 100];
    };
    convert.hsl.hcg = function(hsl) {
      var s = hsl[1] / 100;
      var l2 = hsl[2] / 100;
      var c = 1;
      var f = 0;
      if (l2 < 0.5) {
        c = 2 * s * l2;
      } else {
        c = 2 * s * (1 - l2);
      }
      if (c < 1) {
        f = (l2 - 0.5 * c) / (1 - c);
      }
      return [hsl[0], c * 100, f * 100];
    };
    convert.hsv.hcg = function(hsv) {
      var s = hsv[1] / 100;
      var v = hsv[2] / 100;
      var c = s * v;
      var f = 0;
      if (c < 1) {
        f = (v - c) / (1 - c);
      }
      return [hsv[0], c * 100, f * 100];
    };
    convert.hcg.rgb = function(hcg) {
      var h2 = hcg[0] / 360;
      var c = hcg[1] / 100;
      var g = hcg[2] / 100;
      if (c === 0) {
        return [g * 255, g * 255, g * 255];
      }
      var pure = [0, 0, 0];
      var hi = h2 % 1 * 6;
      var v = hi % 1;
      var w = 1 - v;
      var mg = 0;
      switch (Math.floor(hi)) {
        case 0:
          pure[0] = 1;
          pure[1] = v;
          pure[2] = 0;
          break;
        case 1:
          pure[0] = w;
          pure[1] = 1;
          pure[2] = 0;
          break;
        case 2:
          pure[0] = 0;
          pure[1] = 1;
          pure[2] = v;
          break;
        case 3:
          pure[0] = 0;
          pure[1] = w;
          pure[2] = 1;
          break;
        case 4:
          pure[0] = v;
          pure[1] = 0;
          pure[2] = 1;
          break;
        default:
          pure[0] = 1;
          pure[1] = 0;
          pure[2] = w;
      }
      mg = (1 - c) * g;
      return [
        (c * pure[0] + mg) * 255,
        (c * pure[1] + mg) * 255,
        (c * pure[2] + mg) * 255
      ];
    };
    convert.hcg.hsv = function(hcg) {
      var c = hcg[1] / 100;
      var g = hcg[2] / 100;
      var v = c + g * (1 - c);
      var f = 0;
      if (v > 0) {
        f = c / v;
      }
      return [hcg[0], f * 100, v * 100];
    };
    convert.hcg.hsl = function(hcg) {
      var c = hcg[1] / 100;
      var g = hcg[2] / 100;
      var l2 = g * (1 - c) + 0.5 * c;
      var s = 0;
      if (l2 > 0 && l2 < 0.5) {
        s = c / (2 * l2);
      } else if (l2 >= 0.5 && l2 < 1) {
        s = c / (2 * (1 - l2));
      }
      return [hcg[0], s * 100, l2 * 100];
    };
    convert.hcg.hwb = function(hcg) {
      var c = hcg[1] / 100;
      var g = hcg[2] / 100;
      var v = c + g * (1 - c);
      return [hcg[0], (v - c) * 100, (1 - v) * 100];
    };
    convert.hwb.hcg = function(hwb) {
      var w = hwb[1] / 100;
      var b = hwb[2] / 100;
      var v = 1 - b;
      var c = v - w;
      var g = 0;
      if (c < 1) {
        g = (v - c) / (1 - c);
      }
      return [hwb[0], c * 100, g * 100];
    };
    convert.apple.rgb = function(apple) {
      return [apple[0] / 65535 * 255, apple[1] / 65535 * 255, apple[2] / 65535 * 255];
    };
    convert.rgb.apple = function(rgb) {
      return [rgb[0] / 255 * 65535, rgb[1] / 255 * 65535, rgb[2] / 255 * 65535];
    };
    convert.gray.rgb = function(args) {
      return [args[0] / 100 * 255, args[0] / 100 * 255, args[0] / 100 * 255];
    };
    convert.gray.hsl = convert.gray.hsv = function(args) {
      return [0, 0, args[0]];
    };
    convert.gray.hwb = function(gray) {
      return [0, 100, gray[0]];
    };
    convert.gray.cmyk = function(gray) {
      return [0, 0, 0, gray[0]];
    };
    convert.gray.lab = function(gray) {
      return [gray[0], 0, 0];
    };
    convert.gray.hex = function(gray) {
      var val = Math.round(gray[0] / 100 * 255) & 255;
      var integer = (val << 16) + (val << 8) + val;
      var string = integer.toString(16).toUpperCase();
      return "000000".substring(string.length) + string;
    };
    convert.rgb.gray = function(rgb) {
      var val = (rgb[0] + rgb[1] + rgb[2]) / 3;
      return [val / 255 * 100];
    };
  }
});

// node_modules/color-convert/route.js
var require_route = __commonJS({
  "node_modules/color-convert/route.js"(exports, module) {
    var conversions = require_conversions();
    function buildGraph() {
      var graph = {};
      var models = Object.keys(conversions);
      for (var len = models.length, i2 = 0; i2 < len; i2++) {
        graph[models[i2]] = {
          distance: -1,
          parent: null
        };
      }
      return graph;
    }
    function deriveBFS(fromModel) {
      var graph = buildGraph();
      var queue = [fromModel];
      graph[fromModel].distance = 0;
      while (queue.length) {
        var current = queue.pop();
        var adjacents = Object.keys(conversions[current]);
        for (var len = adjacents.length, i2 = 0; i2 < len; i2++) {
          var adjacent = adjacents[i2];
          var node = graph[adjacent];
          if (node.distance === -1) {
            node.distance = graph[current].distance + 1;
            node.parent = current;
            queue.unshift(adjacent);
          }
        }
      }
      return graph;
    }
    function link(from, to) {
      return function(args) {
        return to(from(args));
      };
    }
    function wrapConversion(toModel, graph) {
      var path = [graph[toModel].parent, toModel];
      var fn = conversions[graph[toModel].parent][toModel];
      var cur = graph[toModel].parent;
      while (graph[cur].parent) {
        path.unshift(graph[cur].parent);
        fn = link(conversions[graph[cur].parent][cur], fn);
        cur = graph[cur].parent;
      }
      fn.conversion = path;
      return fn;
    }
    module.exports = function(fromModel) {
      var graph = deriveBFS(fromModel);
      var conversion = {};
      var models = Object.keys(graph);
      for (var len = models.length, i2 = 0; i2 < len; i2++) {
        var toModel = models[i2];
        var node = graph[toModel];
        if (node.parent === null) {
          continue;
        }
        conversion[toModel] = wrapConversion(toModel, graph);
      }
      return conversion;
    };
  }
});

// node_modules/color-convert/index.js
var require_color_convert = __commonJS({
  "node_modules/color-convert/index.js"(exports, module) {
    var conversions = require_conversions();
    var route = require_route();
    var convert = {};
    var models = Object.keys(conversions);
    function wrapRaw(fn) {
      var wrappedFn = function(args) {
        if (args === void 0 || args === null) {
          return args;
        }
        if (arguments.length > 1) {
          args = Array.prototype.slice.call(arguments);
        }
        return fn(args);
      };
      if ("conversion" in fn) {
        wrappedFn.conversion = fn.conversion;
      }
      return wrappedFn;
    }
    function wrapRounded(fn) {
      var wrappedFn = function(args) {
        if (args === void 0 || args === null) {
          return args;
        }
        if (arguments.length > 1) {
          args = Array.prototype.slice.call(arguments);
        }
        var result = fn(args);
        if (typeof result === "object") {
          for (var len = result.length, i2 = 0; i2 < len; i2++) {
            result[i2] = Math.round(result[i2]);
          }
        }
        return result;
      };
      if ("conversion" in fn) {
        wrappedFn.conversion = fn.conversion;
      }
      return wrappedFn;
    }
    models.forEach(function(fromModel) {
      convert[fromModel] = {};
      Object.defineProperty(convert[fromModel], "channels", { value: conversions[fromModel].channels });
      Object.defineProperty(convert[fromModel], "labels", { value: conversions[fromModel].labels });
      var routes = route(fromModel);
      var routeModels = Object.keys(routes);
      routeModels.forEach(function(toModel) {
        var fn = routes[toModel];
        convert[fromModel][toModel] = wrapRounded(fn);
        convert[fromModel][toModel].raw = wrapRaw(fn);
      });
    });
    module.exports = convert;
  }
});

// node_modules/color/index.js
var require_color = __commonJS({
  "node_modules/color/index.js"(exports, module) {
    "use strict";
    var colorString = require_color_string();
    var convert = require_color_convert();
    var _slice = [].slice;
    var skippedModels = [
      "keyword",
      "gray",
      "hex"
    ];
    var hashedModelKeys = {};
    Object.keys(convert).forEach(function(model) {
      hashedModelKeys[_slice.call(convert[model].labels).sort().join("")] = model;
    });
    var limiters = {};
    function Color(obj, model) {
      if (!(this instanceof Color)) {
        return new Color(obj, model);
      }
      if (model && model in skippedModels) {
        model = null;
      }
      if (model && !(model in convert)) {
        throw new Error("Unknown model: " + model);
      }
      var i2;
      var channels;
      if (obj == null) {
        this.model = "rgb";
        this.color = [0, 0, 0];
        this.valpha = 1;
      } else if (obj instanceof Color) {
        this.model = obj.model;
        this.color = obj.color.slice();
        this.valpha = obj.valpha;
      } else if (typeof obj === "string") {
        var result = colorString.get(obj);
        if (result === null) {
          throw new Error("Unable to parse color from string: " + obj);
        }
        this.model = result.model;
        channels = convert[this.model].channels;
        this.color = result.value.slice(0, channels);
        this.valpha = typeof result.value[channels] === "number" ? result.value[channels] : 1;
      } else if (obj.length) {
        this.model = model || "rgb";
        channels = convert[this.model].channels;
        var newArr = _slice.call(obj, 0, channels);
        this.color = zeroArray(newArr, channels);
        this.valpha = typeof obj[channels] === "number" ? obj[channels] : 1;
      } else if (typeof obj === "number") {
        obj &= 16777215;
        this.model = "rgb";
        this.color = [
          obj >> 16 & 255,
          obj >> 8 & 255,
          obj & 255
        ];
        this.valpha = 1;
      } else {
        this.valpha = 1;
        var keys = Object.keys(obj);
        if ("alpha" in obj) {
          keys.splice(keys.indexOf("alpha"), 1);
          this.valpha = typeof obj.alpha === "number" ? obj.alpha : 0;
        }
        var hashedKeys = keys.sort().join("");
        if (!(hashedKeys in hashedModelKeys)) {
          throw new Error("Unable to parse color from object: " + JSON.stringify(obj));
        }
        this.model = hashedModelKeys[hashedKeys];
        var labels = convert[this.model].labels;
        var color2 = [];
        for (i2 = 0; i2 < labels.length; i2++) {
          color2.push(obj[labels[i2]]);
        }
        this.color = zeroArray(color2);
      }
      if (limiters[this.model]) {
        channels = convert[this.model].channels;
        for (i2 = 0; i2 < channels; i2++) {
          var limit = limiters[this.model][i2];
          if (limit) {
            this.color[i2] = limit(this.color[i2]);
          }
        }
      }
      this.valpha = Math.max(0, Math.min(1, this.valpha));
      if (Object.freeze) {
        Object.freeze(this);
      }
    }
    Color.prototype = {
      toString: function() {
        return this.string();
      },
      toJSON: function() {
        return this[this.model]();
      },
      string: function(places) {
        var self = this.model in colorString.to ? this : this.rgb();
        self = self.round(typeof places === "number" ? places : 1);
        var args = self.valpha === 1 ? self.color : self.color.concat(this.valpha);
        return colorString.to[self.model](args);
      },
      percentString: function(places) {
        var self = this.rgb().round(typeof places === "number" ? places : 1);
        var args = self.valpha === 1 ? self.color : self.color.concat(this.valpha);
        return colorString.to.rgb.percent(args);
      },
      array: function() {
        return this.valpha === 1 ? this.color.slice() : this.color.concat(this.valpha);
      },
      object: function() {
        var result = {};
        var channels = convert[this.model].channels;
        var labels = convert[this.model].labels;
        for (var i2 = 0; i2 < channels; i2++) {
          result[labels[i2]] = this.color[i2];
        }
        if (this.valpha !== 1) {
          result.alpha = this.valpha;
        }
        return result;
      },
      unitArray: function() {
        var rgb = this.rgb().color;
        rgb[0] /= 255;
        rgb[1] /= 255;
        rgb[2] /= 255;
        if (this.valpha !== 1) {
          rgb.push(this.valpha);
        }
        return rgb;
      },
      unitObject: function() {
        var rgb = this.rgb().object();
        rgb.r /= 255;
        rgb.g /= 255;
        rgb.b /= 255;
        if (this.valpha !== 1) {
          rgb.alpha = this.valpha;
        }
        return rgb;
      },
      round: function(places) {
        places = Math.max(places || 0, 0);
        return new Color(this.color.map(roundToPlace(places)).concat(this.valpha), this.model);
      },
      alpha: function(val) {
        if (arguments.length) {
          return new Color(this.color.concat(Math.max(0, Math.min(1, val))), this.model);
        }
        return this.valpha;
      },
      red: getset("rgb", 0, maxfn(255)),
      green: getset("rgb", 1, maxfn(255)),
      blue: getset("rgb", 2, maxfn(255)),
      hue: getset(["hsl", "hsv", "hsl", "hwb", "hcg"], 0, function(val) {
        return (val % 360 + 360) % 360;
      }),
      saturationl: getset("hsl", 1, maxfn(100)),
      lightness: getset("hsl", 2, maxfn(100)),
      saturationv: getset("hsv", 1, maxfn(100)),
      value: getset("hsv", 2, maxfn(100)),
      chroma: getset("hcg", 1, maxfn(100)),
      gray: getset("hcg", 2, maxfn(100)),
      white: getset("hwb", 1, maxfn(100)),
      wblack: getset("hwb", 2, maxfn(100)),
      cyan: getset("cmyk", 0, maxfn(100)),
      magenta: getset("cmyk", 1, maxfn(100)),
      yellow: getset("cmyk", 2, maxfn(100)),
      black: getset("cmyk", 3, maxfn(100)),
      x: getset("xyz", 0, maxfn(100)),
      y: getset("xyz", 1, maxfn(100)),
      z: getset("xyz", 2, maxfn(100)),
      l: getset("lab", 0, maxfn(100)),
      a: getset("lab", 1),
      b: getset("lab", 2),
      keyword: function(val) {
        if (arguments.length) {
          return new Color(val);
        }
        return convert[this.model].keyword(this.color);
      },
      hex: function(val) {
        if (arguments.length) {
          return new Color(val);
        }
        return colorString.to.hex(this.rgb().round().color);
      },
      rgbNumber: function() {
        var rgb = this.rgb().color;
        return (rgb[0] & 255) << 16 | (rgb[1] & 255) << 8 | rgb[2] & 255;
      },
      luminosity: function() {
        var rgb = this.rgb().color;
        var lum = [];
        for (var i2 = 0; i2 < rgb.length; i2++) {
          var chan = rgb[i2] / 255;
          lum[i2] = chan <= 0.03928 ? chan / 12.92 : Math.pow((chan + 0.055) / 1.055, 2.4);
        }
        return 0.2126 * lum[0] + 0.7152 * lum[1] + 0.0722 * lum[2];
      },
      contrast: function(color2) {
        var lum1 = this.luminosity();
        var lum2 = color2.luminosity();
        if (lum1 > lum2) {
          return (lum1 + 0.05) / (lum2 + 0.05);
        }
        return (lum2 + 0.05) / (lum1 + 0.05);
      },
      level: function(color2) {
        var contrastRatio = this.contrast(color2);
        if (contrastRatio >= 7.1) {
          return "AAA";
        }
        return contrastRatio >= 4.5 ? "AA" : "";
      },
      isDark: function() {
        var rgb = this.rgb().color;
        var yiq = (rgb[0] * 299 + rgb[1] * 587 + rgb[2] * 114) / 1e3;
        return yiq < 128;
      },
      isLight: function() {
        return !this.isDark();
      },
      negate: function() {
        var rgb = this.rgb();
        for (var i2 = 0; i2 < 3; i2++) {
          rgb.color[i2] = 255 - rgb.color[i2];
        }
        return rgb;
      },
      lighten: function(ratio) {
        var hsl = this.hsl();
        hsl.color[2] += hsl.color[2] * ratio;
        return hsl;
      },
      darken: function(ratio) {
        var hsl = this.hsl();
        hsl.color[2] -= hsl.color[2] * ratio;
        return hsl;
      },
      saturate: function(ratio) {
        var hsl = this.hsl();
        hsl.color[1] += hsl.color[1] * ratio;
        return hsl;
      },
      desaturate: function(ratio) {
        var hsl = this.hsl();
        hsl.color[1] -= hsl.color[1] * ratio;
        return hsl;
      },
      whiten: function(ratio) {
        var hwb = this.hwb();
        hwb.color[1] += hwb.color[1] * ratio;
        return hwb;
      },
      blacken: function(ratio) {
        var hwb = this.hwb();
        hwb.color[2] += hwb.color[2] * ratio;
        return hwb;
      },
      grayscale: function() {
        var rgb = this.rgb().color;
        var val = rgb[0] * 0.3 + rgb[1] * 0.59 + rgb[2] * 0.11;
        return Color.rgb(val, val, val);
      },
      fade: function(ratio) {
        return this.alpha(this.valpha - this.valpha * ratio);
      },
      opaquer: function(ratio) {
        return this.alpha(this.valpha + this.valpha * ratio);
      },
      rotate: function(degrees) {
        var hsl = this.hsl();
        var hue = hsl.color[0];
        hue = (hue + degrees) % 360;
        hue = hue < 0 ? 360 + hue : hue;
        hsl.color[0] = hue;
        return hsl;
      },
      mix: function(mixinColor, weight) {
        if (!mixinColor || !mixinColor.rgb) {
          throw new Error('Argument to "mix" was not a Color instance, but rather an instance of ' + typeof mixinColor);
        }
        var color1 = mixinColor.rgb();
        var color2 = this.rgb();
        var p = weight === void 0 ? 0.5 : weight;
        var w = 2 * p - 1;
        var a = color1.alpha() - color2.alpha();
        var w1 = ((w * a === -1 ? w : (w + a) / (1 + w * a)) + 1) / 2;
        var w2 = 1 - w1;
        return Color.rgb(w1 * color1.red() + w2 * color2.red(), w1 * color1.green() + w2 * color2.green(), w1 * color1.blue() + w2 * color2.blue(), color1.alpha() * p + color2.alpha() * (1 - p));
      }
    };
    Object.keys(convert).forEach(function(model) {
      if (skippedModels.indexOf(model) !== -1) {
        return;
      }
      var channels = convert[model].channels;
      Color.prototype[model] = function() {
        if (this.model === model) {
          return new Color(this);
        }
        if (arguments.length) {
          return new Color(arguments, model);
        }
        var newAlpha = typeof arguments[channels] === "number" ? channels : this.valpha;
        return new Color(assertArray(convert[this.model][model].raw(this.color)).concat(newAlpha), model);
      };
      Color[model] = function(color2) {
        if (typeof color2 === "number") {
          color2 = zeroArray(_slice.call(arguments), channels);
        }
        return new Color(color2, model);
      };
    });
    function roundTo(num, places) {
      return Number(num.toFixed(places));
    }
    function roundToPlace(places) {
      return function(num) {
        return roundTo(num, places);
      };
    }
    function getset(model, channel, modifier) {
      model = Array.isArray(model) ? model : [model];
      model.forEach(function(m) {
        (limiters[m] || (limiters[m] = []))[channel] = modifier;
      });
      model = model[0];
      return function(val) {
        var result;
        if (arguments.length) {
          if (modifier) {
            val = modifier(val);
          }
          result = this[model]();
          result.color[channel] = val;
          return result;
        }
        result = this[model]().color[channel];
        if (modifier) {
          result = modifier(result);
        }
        return result;
      };
    }
    function maxfn(max) {
      return function(v) {
        return Math.max(0, Math.min(max, v));
      };
    }
    function assertArray(val) {
      return Array.isArray(val) ? val : [val];
    }
    function zeroArray(arr, length) {
      for (var i2 = 0; i2 < length; i2++) {
        if (typeof arr[i2] !== "number") {
          arr[i2] = 0;
        }
      }
      return arr;
    }
    module.exports = Color;
  }
});

// src/components/color-picker/color-picker.ts
var import_color = __toModule(require_color());

// _uyihdawu1:/Users/claviska/Projects/shoelace/src/components/color-picker/color-picker.scss
var color_picker_default = ':host {\n  position: relative;\n  box-sizing: border-box;\n}\n:host *, :host *:before, :host *:after {\n  box-sizing: inherit;\n}\n\n[hidden] {\n  display: none !important;\n}\n\n:host {\n  --grid-width: 260px;\n  --grid-height: 200px;\n  --grid-handle-size: 16px;\n  --slider-height: 12px;\n  --slider-handle-size: 14px;\n  display: inline-block;\n}\n\n.color-picker {\n  width: var(--grid-width);\n  font-family: var(--sl-font-sans);\n  font-size: var(--sl-font-size-medium);\n  font-weight: var(--sl-font-weight-normal);\n  color: var(--color);\n  background-color: var(--sl-panel-background-color);\n  border-radius: var(--sl-border-radius-medium);\n  user-select: none;\n}\n\n.color-picker--inline {\n  border: solid 1px var(--sl-panel-border-color);\n  box-shadow: var(--sl-shadow-small);\n}\n\n.color-picker__grid {\n  position: relative;\n  height: var(--grid-height);\n  background-image: linear-gradient(to bottom, white 0%, rgba(255, 255, 255, 0) 50%, rgba(0, 0, 0, 0) 50%, black 100%), linear-gradient(to right, gray 0%, rgba(128, 128, 128, 0) 100%);\n  border-top-left-radius: var(--sl-border-radius-medium);\n  border-top-right-radius: var(--sl-border-radius-medium);\n  cursor: crosshair;\n}\n\n.color-picker__grid-handle {\n  position: absolute;\n  width: var(--grid-handle-size);\n  height: var(--grid-handle-size);\n  border-radius: 50%;\n  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.25);\n  border: solid 2px white;\n  margin-top: calc(var(--grid-handle-size) / -2);\n  margin-left: calc(var(--grid-handle-size) / -2);\n}\n.color-picker__grid-handle:focus {\n  outline: none;\n  box-shadow: 0 0 0 1px var(--sl-color-primary-500), 0 0 0 var(--sl-focus-ring-width) var(--sl-focus-ring-color-primary);\n}\n\n.color-picker__controls {\n  padding: var(--sl-spacing-small);\n  display: flex;\n  align-items: center;\n}\n\n.color-picker__sliders {\n  flex: 1 1 auto;\n}\n\n.color-picker__slider {\n  position: relative;\n  height: var(--slider-height);\n  border-radius: var(--sl-border-radius-pill);\n  box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.2);\n}\n.color-picker__slider:not(:last-of-type) {\n  margin-bottom: var(--sl-spacing-small);\n}\n\n.color-picker__slider-handle {\n  position: absolute;\n  top: calc(50% - var(--slider-handle-size) / 2);\n  width: var(--slider-handle-size);\n  height: var(--slider-handle-size);\n  background-color: white;\n  border-radius: 50%;\n  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.25);\n  margin-left: calc(var(--slider-handle-size) / -2);\n}\n.color-picker__slider-handle:focus {\n  outline: none;\n  box-shadow: 0 0 0 1px var(--sl-color-primary-500), 0 0 0 var(--sl-focus-ring-width) var(--sl-focus-ring-color-primary);\n}\n\n.color-picker__hue {\n  background-image: linear-gradient(to right, red 0%, yellow 17%, lime 33%, aqua 50%, blue 67%, fuchsia 83%, red 100%);\n}\n\n.color-picker__alpha .color-picker__alpha-gradient {\n  position: absolute;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100%;\n  border-radius: inherit;\n}\n\n.color-picker__preview {\n  flex: 0 0 auto;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  position: relative;\n  width: 3.125rem;\n  height: var(--sl-input-height-small);\n  border: none;\n  border-radius: var(--sl-input-border-radius-small);\n  background: none;\n  margin-left: var(--sl-spacing-small);\n  cursor: copy;\n}\n.color-picker__preview:before {\n  content: "";\n  position: absolute;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100%;\n  border-radius: inherit;\n  box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.2);\n  background-color: var(--preview-color);\n}\n.color-picker__preview:focus {\n  box-shadow: 0 0 0 var(--sl-focus-ring-width) var(--sl-focus-ring-color-primary);\n  outline: none;\n}\n\n.color-picker__preview-color {\n  position: absolute;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100%;\n  border: solid 1px rgba(0, 0, 0, 0.125);\n}\n\n.color-picker__copy-feedback {\n  width: calc(var(--sl-input-height-small) / 2);\n  height: calc(var(--sl-input-height-small) / 2);\n  color: white;\n  background-color: var(--sl-color-gray-900);\n  border-radius: var(--sl-border-radius-circle);\n  opacity: 0;\n}\n.color-picker__copy-feedback.color-picker__copy-feedback--visible {\n  animation: copied 1s;\n}\n\n@keyframes copied {\n  0% {\n    transform: scale(0.8);\n    opacity: 0;\n  }\n  30% {\n    transform: scale(1.2);\n    opacity: 1;\n  }\n  70% {\n    transform: scale(1.2);\n    opacity: 1;\n  }\n  100% {\n    transform: scale(1.4);\n    opacity: 0;\n  }\n}\n.color-picker__user-input {\n  display: flex;\n  padding: 0 var(--sl-spacing-small) var(--sl-spacing-small) var(--sl-spacing-small);\n}\n.color-picker__user-input sl-input {\n  min-width: 0;\n  flex: 1 1 auto;\n}\n.color-picker__user-input sl-button {\n  min-width: 3.125rem;\n  max-width: 3.125rem;\n  font-size: 1rem;\n  margin-left: var(--sl-spacing-small);\n}\n\n.color-picker__swatches {\n  display: grid;\n  grid-template-columns: repeat(8, 1fr);\n  grid-gap: 6px;\n  justify-items: center;\n  border-top: solid 1px var(--sl-color-gray-200);\n  padding: var(--sl-spacing-small);\n}\n\n.color-picker__swatch {\n  flex: 0 0 auto;\n  position: relative;\n  width: 20px;\n  height: 20px;\n  border-radius: 2px;\n}\n.color-picker__swatch .color-picker__swatch-color {\n  position: absolute;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100%;\n  border: solid 1px rgba(0, 0, 0, 0.125);\n  border-radius: inherit;\n  cursor: pointer;\n}\n.color-picker__swatch:focus {\n  outline: none;\n  box-shadow: 0 0 0 var(--sl-focus-ring-width) var(--sl-focus-ring-color-primary);\n}\n\n.color-picker__transparent-bg {\n  background-image: linear-gradient(45deg, #eee 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #eee 75%), linear-gradient(45deg, transparent 75%, #eee 75%), linear-gradient(45deg, #eee 25%, transparent 25%);\n  background-size: 10px 10px;\n  background-position: 0 0, 0 0, -5px -5px, 5px 5px;\n}\n\n.color-picker--disabled {\n  opacity: 0.5;\n  cursor: not-allowed;\n}\n.color-picker--disabled .color-picker__grid,\n.color-picker--disabled .color-picker__grid-handle,\n.color-picker--disabled .color-picker__slider,\n.color-picker--disabled .color-picker__slider-handle,\n.color-picker--disabled .color-picker__preview,\n.color-picker--disabled .color-picker__swatch,\n.color-picker--disabled .color-picker__swatch-color {\n  pointer-events: none;\n}\n\n.color-dropdown::part(panel) {\n  max-height: none;\n  overflow: visible;\n}\n\n.color-dropdown__trigger {\n  display: inline-block;\n  position: relative;\n  background-color: transparent;\n  border: none;\n  cursor: pointer;\n  transition: var(--sl-transition-fast) box-shadow;\n}\n.color-dropdown__trigger.color-dropdown__trigger--small {\n  width: var(--sl-input-height-small);\n  height: var(--sl-input-height-small);\n  border-radius: var(--sl-border-radius-circle);\n}\n.color-dropdown__trigger.color-dropdown__trigger--medium {\n  width: var(--sl-input-height-medium);\n  height: var(--sl-input-height-medium);\n  border-radius: var(--sl-border-radius-circle);\n}\n.color-dropdown__trigger.color-dropdown__trigger--large {\n  width: var(--sl-input-height-large);\n  height: var(--sl-input-height-large);\n  border-radius: var(--sl-border-radius-circle);\n}\n.color-dropdown__trigger:before {\n  content: "";\n  position: absolute;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100%;\n  border-radius: inherit;\n  background-color: currentColor;\n  box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.25);\n  transition: inherit;\n}\n.color-dropdown__trigger:focus {\n  outline: none;\n}\n.color-dropdown__trigger:focus:not(.color-dropdown__trigger--disabled) {\n  box-shadow: 0 0 0 var(--sl-focus-ring-width) var(--sl-focus-ring-color-primary);\n  outline: none;\n}\n.color-dropdown__trigger:focus:not(.color-dropdown__trigger--disabled):before {\n  box-shadow: inset 0 0 0 1px var(--sl-color-primary-500);\n}\n.color-dropdown__trigger.color-dropdown__trigger--disabled {\n  opacity: 0.5;\n  cursor: not-allowed;\n}';

// src/components/color-picker/color-picker.ts
var SlColorPicker = class extends h {
  constructor() {
    super(...arguments);
    this.inputValue = "";
    this.hue = 0;
    this.saturation = 100;
    this.lightness = 100;
    this.alpha = 100;
    this.showCopyFeedback = false;
    this.value = "#ffffff";
    this.format = "hex";
    this.inline = false;
    this.size = "medium";
    this.noFormatToggle = false;
    this.name = "";
    this.disabled = false;
    this.invalid = false;
    this.hoist = false;
    this.opacity = false;
    this.uppercase = false;
    this.swatches = [
      "#d0021b",
      "#f5a623",
      "#f8e71c",
      "#8b572a",
      "#7ed321",
      "#417505",
      "#bd10e0",
      "#9013fe",
      "#4a90e2",
      "#50e3c2",
      "#b8e986",
      "#000",
      "#444",
      "#888",
      "#ccc",
      "#fff"
    ];
  }
  connectedCallback() {
    super.connectedCallback();
    if (!this.setColor(this.value)) {
      this.setColor(`#ffff`);
    }
    this.inputValue = this.value;
    this.lastValueEmitted = this.value;
    this.syncValues();
  }
  getFormattedValue(format = "hex") {
    const currentColor = this.parseColor(`hsla(${this.hue}, ${this.saturation}%, ${this.lightness}%, ${this.alpha / 100})`);
    if (!currentColor) {
      return "";
    }
    switch (format) {
      case "hex":
        return currentColor.hex;
      case "hexa":
        return currentColor.hexa;
      case "rgb":
        return currentColor.rgb.string;
      case "rgba":
        return currentColor.rgba.string;
      case "hsl":
        return currentColor.hsl.string;
      case "hsla":
        return currentColor.hsla.string;
      default:
        return "";
    }
  }
  reportValidity() {
    if (!this.inline && this.input.invalid) {
      return new Promise((resolve) => {
        this.dropdown.addEventListener("sl-after-show", () => {
          this.input.reportValidity();
          resolve();
        }, { once: true });
        this.dropdown.show();
      });
    } else {
      return this.input.reportValidity();
    }
  }
  setCustomValidity(message) {
    this.input.setCustomValidity(message);
    this.invalid = this.input.invalid;
  }
  handleCopy() {
    this.input.select();
    document.execCommand("copy");
    this.previewButton.focus();
    this.showCopyFeedback = true;
    this.previewButton.addEventListener("animationend", () => this.showCopyFeedback = false, { once: true });
  }
  handleFormatToggle() {
    const formats = ["hex", "rgb", "hsl"];
    const nextIndex = (formats.indexOf(this.format) + 1) % formats.length;
    this.format = formats[nextIndex];
  }
  handleAlphaDrag(event2) {
    const container = this.shadowRoot.querySelector(".color-picker__slider.color-picker__alpha");
    const handle = container.querySelector(".color-picker__slider-handle");
    const { width } = container.getBoundingClientRect();
    handle.focus();
    event2.preventDefault();
    this.handleDrag(event2, container, (x) => {
      this.alpha = clamp(x / width * 100, 0, 100);
      this.syncValues();
    });
  }
  handleHueDrag(event2) {
    const container = this.shadowRoot.querySelector(".color-picker__slider.color-picker__hue");
    const handle = container.querySelector(".color-picker__slider-handle");
    const { width } = container.getBoundingClientRect();
    handle.focus();
    event2.preventDefault();
    this.handleDrag(event2, container, (x) => {
      this.hue = clamp(x / width * 360, 0, 360);
      this.syncValues();
    });
  }
  handleGridDrag(event2) {
    const grid = this.shadowRoot.querySelector(".color-picker__grid");
    const handle = grid.querySelector(".color-picker__grid-handle");
    const { width, height } = grid.getBoundingClientRect();
    handle.focus();
    event2.preventDefault();
    this.handleDrag(event2, grid, (x, y) => {
      this.saturation = clamp(x / width * 100, 0, 100);
      this.lightness = clamp(100 - y / height * 100, 0, 100);
      this.syncValues();
    });
  }
  handleDrag(event2, container, onMove) {
    if (this.disabled) {
      return;
    }
    const move = (event3) => {
      const dims = container.getBoundingClientRect();
      const defaultView = container.ownerDocument.defaultView;
      const offsetX = dims.left + defaultView.pageXOffset;
      const offsetY = dims.top + defaultView.pageYOffset;
      const x = (event3.changedTouches ? event3.changedTouches[0].pageX : event3.pageX) - offsetX;
      const y = (event3.changedTouches ? event3.changedTouches[0].pageY : event3.pageY) - offsetY;
      onMove(x, y);
    };
    move(event2);
    const stop = () => {
      document.removeEventListener("mousemove", move);
      document.removeEventListener("touchmove", move);
      document.removeEventListener("mouseup", stop);
      document.removeEventListener("touchend", stop);
    };
    document.addEventListener("mousemove", move);
    document.addEventListener("touchmove", move);
    document.addEventListener("mouseup", stop);
    document.addEventListener("touchend", stop);
  }
  handleAlphaKeyDown(event2) {
    const increment = event2.shiftKey ? 10 : 1;
    if (event2.key === "ArrowLeft") {
      event2.preventDefault();
      this.alpha = clamp(this.alpha - increment, 0, 100);
      this.syncValues();
    }
    if (event2.key === "ArrowRight") {
      event2.preventDefault();
      this.alpha = clamp(this.alpha + increment, 0, 100);
      this.syncValues();
    }
    if (event2.key === "Home") {
      event2.preventDefault();
      this.alpha = 0;
      this.syncValues();
    }
    if (event2.key === "End") {
      event2.preventDefault();
      this.alpha = 100;
      this.syncValues();
    }
  }
  handleHueKeyDown(event2) {
    const increment = event2.shiftKey ? 10 : 1;
    if (event2.key === "ArrowLeft") {
      event2.preventDefault();
      this.hue = clamp(this.hue - increment, 0, 360);
      this.syncValues();
    }
    if (event2.key === "ArrowRight") {
      event2.preventDefault();
      this.hue = clamp(this.hue + increment, 0, 360);
      this.syncValues();
    }
    if (event2.key === "Home") {
      event2.preventDefault();
      this.hue = 0;
      this.syncValues();
    }
    if (event2.key === "End") {
      event2.preventDefault();
      this.hue = 360;
      this.syncValues();
    }
  }
  handleGridKeyDown(event2) {
    const increment = event2.shiftKey ? 10 : 1;
    if (event2.key === "ArrowLeft") {
      event2.preventDefault();
      this.saturation = clamp(this.saturation - increment, 0, 100);
      this.syncValues();
    }
    if (event2.key === "ArrowRight") {
      event2.preventDefault();
      this.saturation = clamp(this.saturation + increment, 0, 100);
      this.syncValues();
    }
    if (event2.key === "ArrowUp") {
      event2.preventDefault();
      this.lightness = clamp(this.lightness + increment, 0, 100);
      this.syncValues();
    }
    if (event2.key === "ArrowDown") {
      event2.preventDefault();
      this.lightness = clamp(this.lightness - increment, 0, 100);
      this.syncValues();
    }
  }
  handleInputChange(event2) {
    const target = event2.target;
    this.setColor(target.value);
    target.value = this.value;
    event2.stopPropagation();
  }
  handleInputKeyDown(event2) {
    if (event2.key === "Enter") {
      this.setColor(this.input.value);
      this.input.value = this.value;
      setTimeout(() => this.input.select());
    }
  }
  handleDropdownAfterHide() {
    this.showCopyFeedback = false;
  }
  normalizeColorString(colorString) {
    if (/rgba?/i.test(colorString)) {
      const rgba = colorString.replace(/[^\d.%]/g, " ").split(" ").map((val) => val.trim()).filter((val) => val.length);
      if (rgba.length < 4) {
        rgba[3] = "1";
      }
      if (rgba[3].indexOf("%") > -1) {
        rgba[3] = (Number(rgba[3].replace(/%/g, "")) / 100).toString();
      }
      return `rgba(${rgba[0]}, ${rgba[1]}, ${rgba[2]}, ${rgba[3]})`;
    }
    if (/hsla?/i.test(colorString)) {
      const hsla = colorString.replace(/[^\d.%]/g, " ").split(" ").map((val) => val.trim()).filter((val) => val.length);
      if (hsla.length < 4) {
        hsla[3] = "1";
      }
      if (hsla[3].indexOf("%") > -1) {
        hsla[3] = (Number(hsla[3].replace(/%/g, "")) / 100).toString();
      }
      return `hsla(${hsla[0]}, ${hsla[1]}, ${hsla[2]}, ${hsla[3]})`;
    }
    if (/^[0-9a-f]+$/i.test(colorString)) {
      return `#${colorString}`;
    }
    return colorString;
  }
  parseColor(colorString) {
    function toHex(value) {
      const hex2 = Math.round(value).toString(16);
      return hex2.length === 1 ? `0${hex2}` : hex2;
    }
    let parsed;
    colorString = this.normalizeColorString(colorString);
    try {
      parsed = (0, import_color.default)(colorString);
    } catch (e3) {
      return false;
    }
    const hsl = {
      h: parsed.hsl().color[0],
      s: parsed.hsl().color[1],
      l: parsed.hsl().color[2],
      a: parsed.hsl().valpha
    };
    const rgb = {
      r: parsed.rgb().color[0],
      g: parsed.rgb().color[1],
      b: parsed.rgb().color[2],
      a: parsed.rgb().valpha
    };
    const hex = {
      r: toHex(parsed.rgb().color[0]),
      g: toHex(parsed.rgb().color[1]),
      b: toHex(parsed.rgb().color[2]),
      a: toHex(parsed.rgb().valpha * 255)
    };
    return {
      hsl: {
        h: hsl.h,
        s: hsl.s,
        l: hsl.l,
        string: this.setLetterCase(`hsl(${Math.round(hsl.h)}, ${Math.round(hsl.s)}%, ${Math.round(hsl.l)}%)`)
      },
      hsla: {
        h: hsl.h,
        s: hsl.s,
        l: hsl.l,
        a: hsl.a,
        string: this.setLetterCase(`hsla(${Math.round(hsl.h)}, ${Math.round(hsl.s)}%, ${Math.round(hsl.l)}%, ${Number(hsl.a.toFixed(2).toString())})`)
      },
      rgb: {
        r: rgb.r,
        g: rgb.g,
        b: rgb.b,
        string: this.setLetterCase(`rgb(${Math.round(rgb.r)}, ${Math.round(rgb.g)}, ${Math.round(rgb.b)})`)
      },
      rgba: {
        r: rgb.r,
        g: rgb.g,
        b: rgb.b,
        a: rgb.a,
        string: this.setLetterCase(`rgba(${Math.round(rgb.r)}, ${Math.round(rgb.g)}, ${Math.round(rgb.b)}, ${Number(rgb.a.toFixed(2).toString())})`)
      },
      hex: this.setLetterCase(`#${hex.r}${hex.g}${hex.b}`),
      hexa: this.setLetterCase(`#${hex.r}${hex.g}${hex.b}${hex.a}`)
    };
  }
  setColor(colorString) {
    const newColor = this.parseColor(colorString);
    if (!newColor) {
      return false;
    }
    this.hue = newColor.hsla.h;
    this.saturation = newColor.hsla.s;
    this.lightness = newColor.hsla.l;
    this.alpha = this.opacity ? newColor.hsla.a * 100 : 100;
    this.syncValues();
    return true;
  }
  setLetterCase(string) {
    if (typeof string !== "string")
      return "";
    return this.uppercase ? string.toUpperCase() : string.toLowerCase();
  }
  syncValues() {
    const currentColor = this.parseColor(`hsla(${this.hue}, ${this.saturation}%, ${this.lightness}%, ${this.alpha / 100})`);
    if (!currentColor) {
      return;
    }
    if (this.format === "hsl") {
      this.inputValue = this.opacity ? currentColor.hsla.string : currentColor.hsl.string;
    } else if (this.format === "rgb") {
      this.inputValue = this.opacity ? currentColor.rgba.string : currentColor.rgb.string;
    } else {
      this.inputValue = this.opacity ? currentColor.hexa : currentColor.hex;
    }
    this.value = this.inputValue;
  }
  handleFormatChange() {
    this.syncValues();
  }
  handleOpacityChange() {
    this.alpha = 100;
  }
  handleValueChange(oldValue, newValue) {
    const newColor = this.parseColor(newValue);
    if (newColor) {
      this.inputValue = this.value;
      this.hue = newColor.hsla.h;
      this.saturation = newColor.hsla.s;
      this.lightness = newColor.hsla.l;
      this.alpha = newColor.hsla.a * 100;
    } else {
      this.inputValue = oldValue;
    }
    if (this.value !== this.lastValueEmitted) {
      this.slChange.emit();
      this.lastValueEmitted = this.value;
    }
  }
  render() {
    const x = this.saturation;
    const y = 100 - this.lightness;
    const colorPicker = T`
      <div
        part="base"
        class=${e2({
      "color-picker": true,
      "color-picker--inline": this.inline,
      "color-picker--disabled": this.disabled
    })}
        aria-disabled=${this.disabled ? "true" : "false"}
      >
        <div
          part="grid"
          class="color-picker__grid"
          style=${i({ backgroundColor: `hsl(${this.hue}deg, 100%, 50%)` })}
          @mousedown=${this.handleGridDrag}
          @touchstart=${this.handleGridDrag}
        >
          <span
            part="grid-handle"
            class="color-picker__grid-handle"
            style=${i({
      top: `${y}%`,
      left: `${x}%`,
      backgroundColor: `hsla(${this.hue}deg, ${this.saturation}%, ${this.lightness}%)`
    })}
            role="slider"
            aria-label="HSL"
            aria-valuetext=${`hsl(${Math.round(this.hue)}, ${Math.round(this.saturation)}%, ${Math.round(this.lightness)}%)`}
            tabindex=${l(this.disabled ? void 0 : "0")}
            @keydown=${this.handleGridKeyDown}
          ></span>
        </div>

        <div class="color-picker__controls">
          <div class="color-picker__sliders">
            <div
              part="slider hue-slider"
              class="color-picker__hue color-picker__slider"
              @mousedown=${this.handleHueDrag}
              @touchstart=${this.handleHueDrag}
            >
              <span
                part="slider-handle"
                class="color-picker__slider-handle"
                style=${i({
      left: `${this.hue === 0 ? 0 : 100 / (360 / this.hue)}%`
    })}
                role="slider"
                aria-label="hue"
                aria-orientation="horizontal"
                aria-valuemin="0"
                aria-valuemax="360"
                aria-valuenow=${Math.round(this.hue)}
                tabindex=${l(this.disabled ? void 0 : "0")}
                @keydown=${this.handleHueKeyDown}
              ></span>
            </div>

            ${this.opacity ? T`
                  <div
                    part="slider opacity-slider"
                    class="color-picker__alpha color-picker__slider color-picker__transparent-bg"
                    @mousedown="${this.handleAlphaDrag}"
                    @touchstart="${this.handleAlphaDrag}"
                  >
                    <div
                      class="color-picker__alpha-gradient"
                      style=${i({
      backgroundImage: `linear-gradient(
                          to right,
                          hsl(${this.hue}deg, ${this.saturation}%, ${this.lightness}%, 0%) 0%,
                          hsl(${this.hue}deg, ${this.saturation}%, ${this.lightness}%) 100%
                        )`
    })}
                    ></div>
                    <span
                      part="slider-handle"
                      class="color-picker__slider-handle"
                      style=${i({
      left: `${this.alpha}%`
    })}
                      role="slider"
                      aria-label="alpha"
                      aria-orientation="horizontal"
                      aria-valuemin="0"
                      aria-valuemax="100"
                      aria-valuenow=${Math.round(this.alpha)}
                      tabindex=${l(this.disabled ? void 0 : "0")}
                      @keydown=${this.handleAlphaKeyDown}
                    ></span>
                  </div>
                ` : ""}
          </div>

          <button
            type="button"
            part="preview"
            class="color-picker__preview color-picker__transparent-bg"
            style=${i({
      "--preview-color": `hsla(${this.hue}deg, ${this.saturation}%, ${this.lightness}%, ${this.alpha / 100})`
    })}
            @click=${this.handleCopy}
          >
            <sl-icon
              name="check"
              library="system"
              class=${e2({
      "color-picker__copy-feedback": true,
      "color-picker__copy-feedback--visible": this.showCopyFeedback,
      "color-picker__copy-feedback--dark": this.lightness > 50
    })}
            ></sl-icon>
          </button>
        </div>

        <div class="color-picker__user-input">
          <sl-input
            part="input"
            size="small"
            type="text"
            name=${this.name}
            autocomplete="off"
            autocorrect="off"
            autocapitalize="off"
            spellcheck="false"
            .value=${this.inputValue}
            ?disabled=${this.disabled}
            @keydown=${this.handleInputKeyDown}
            @sl-change=${this.handleInputChange}
          ></sl-input>

          ${!this.noFormatToggle ? T`
                <sl-button exportparts="base:format-button" size="small" @click=${this.handleFormatToggle}>
                  ${this.setLetterCase(this.format)}
                </sl-button>
              ` : ""}
        </div>

        ${this.swatches ? T`
              <div part="swatches" class="color-picker__swatches">
                ${this.swatches.map((swatch) => {
      return T`
                    <div
                      part="swatch"
                      class="color-picker__swatch color-picker__transparent-bg"
                      tabindex=${l(this.disabled ? void 0 : "0")}
                      role="button"
                      aria-label=${swatch}
                      @click=${() => !this.disabled && this.setColor(swatch)}
                      @keydown=${(event2) => !this.disabled && event2.key === "Enter" && this.setColor(swatch)}
                    >
                      <div class="color-picker__swatch-color" style=${i({ backgroundColor: swatch })}></div>
                    </div>
                  `;
    })}
              </div>
            ` : ""}
      </div>
    `;
    if (this.inline) {
      return colorPicker;
    }
    return T`
      <sl-dropdown
        class="color-dropdown"
        aria-disabled=${this.disabled ? "true" : "false"}
        .containing-element=${this}
        ?disabled=${this.disabled}
        ?hoist=${this.hoist}
        @sl-after-hide=${this.handleDropdownAfterHide}
      >
        <button
          part="trigger"
          slot="trigger"
          class=${e2({
      "color-dropdown__trigger": true,
      "color-dropdown__trigger--disabled": this.disabled,
      "color-dropdown__trigger--small": this.size === "small",
      "color-dropdown__trigger--medium": this.size === "medium",
      "color-dropdown__trigger--large": this.size === "large",
      "color-picker__transparent-bg": true
    })}
          style=${i({
      color: `hsla(${this.hue}deg, ${this.saturation}%, ${this.lightness}%, ${this.alpha / 100})`
    })}
          type="button"
        ></button>
        ${colorPicker}
      </sl-dropdown>
    `;
  }
};
SlColorPicker.styles = r(color_picker_default);
__decorateClass([
  o('[part="input"]')
], SlColorPicker.prototype, "input", 2);
__decorateClass([
  o('[part="preview"]')
], SlColorPicker.prototype, "previewButton", 2);
__decorateClass([
  o(".color-dropdown")
], SlColorPicker.prototype, "dropdown", 2);
__decorateClass([
  r2()
], SlColorPicker.prototype, "inputValue", 2);
__decorateClass([
  r2()
], SlColorPicker.prototype, "hue", 2);
__decorateClass([
  r2()
], SlColorPicker.prototype, "saturation", 2);
__decorateClass([
  r2()
], SlColorPicker.prototype, "lightness", 2);
__decorateClass([
  r2()
], SlColorPicker.prototype, "alpha", 2);
__decorateClass([
  r2()
], SlColorPicker.prototype, "showCopyFeedback", 2);
__decorateClass([
  e()
], SlColorPicker.prototype, "value", 2);
__decorateClass([
  e()
], SlColorPicker.prototype, "format", 2);
__decorateClass([
  e({ type: Boolean, reflect: true })
], SlColorPicker.prototype, "inline", 2);
__decorateClass([
  e()
], SlColorPicker.prototype, "size", 2);
__decorateClass([
  e({ attribute: "no-format-toggle", type: Boolean })
], SlColorPicker.prototype, "noFormatToggle", 2);
__decorateClass([
  e()
], SlColorPicker.prototype, "name", 2);
__decorateClass([
  e({ type: Boolean, reflect: true })
], SlColorPicker.prototype, "disabled", 2);
__decorateClass([
  e({ type: Boolean, reflect: true })
], SlColorPicker.prototype, "invalid", 2);
__decorateClass([
  e({ type: Boolean })
], SlColorPicker.prototype, "hoist", 2);
__decorateClass([
  e({ type: Boolean })
], SlColorPicker.prototype, "opacity", 2);
__decorateClass([
  e({ type: Boolean })
], SlColorPicker.prototype, "uppercase", 2);
__decorateClass([
  e({ attribute: false })
], SlColorPicker.prototype, "swatches", 2);
__decorateClass([
  event("sl-change")
], SlColorPicker.prototype, "slChange", 2);
__decorateClass([
  watch("format")
], SlColorPicker.prototype, "handleFormatChange", 1);
__decorateClass([
  watch("opacity")
], SlColorPicker.prototype, "handleOpacityChange", 1);
__decorateClass([
  watch("value")
], SlColorPicker.prototype, "handleValueChange", 1);
SlColorPicker = __decorateClass([
  n("sl-color-picker")
], SlColorPicker);
var color_picker_default2 = SlColorPicker;

export {
  color_picker_default2 as color_picker_default
};
