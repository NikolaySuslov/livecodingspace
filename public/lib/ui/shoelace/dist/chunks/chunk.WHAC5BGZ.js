import {
  i
} from "./chunk.DA3UDEH5.js";
import {
  watch
} from "./chunk.XX234VRK.js";
import {
  T,
  e,
  h,
  n,
  o,
  r
} from "./chunk.5PIDMFOE.js";
import {
  __decorateClass
} from "./chunk.IHGPZX35.js";

// node_modules/qr-creator/dist/qr-creator.es6.min.js
"use strict";
var G = null;
var H = class {
};
H.render = function(w, B) {
  G(w, B);
};
self.QrCreator = H;
(function(w) {
  function B(t, c, a, e2) {
    var b = {}, h2 = w(a, c);
    h2.u(t);
    h2.J();
    e2 = e2 || 0;
    var r2 = h2.h(), d = h2.h() + 2 * e2;
    b.text = t;
    b.level = c;
    b.version = a;
    b.O = d;
    b.a = function(b2, a2) {
      b2 -= e2;
      a2 -= e2;
      return 0 > b2 || b2 >= r2 || 0 > a2 || a2 >= r2 ? false : h2.a(b2, a2);
    };
    return b;
  }
  function C(t, c, a, e2, b, h2, r2, d, g, x) {
    function u(b2, a2, f, c2, d2, r3, g2) {
      b2 ? (t.lineTo(a2 + r3, f + g2), t.arcTo(a2, f, c2, d2, h2)) : t.lineTo(a2, f);
    }
    r2 ? t.moveTo(c + h2, a) : t.moveTo(c, a);
    u(d, e2, a, e2, b, -h2, 0);
    u(g, e2, b, c, b, 0, -h2);
    u(x, c, b, c, a, h2, 0);
    u(r2, c, a, e2, a, 0, h2);
  }
  function z(t, c, a, e2, b, h2, r2, d, g, x) {
    function u(b2, a2, c2, d2) {
      t.moveTo(b2 + c2, a2);
      t.lineTo(b2, a2);
      t.lineTo(b2, a2 + d2);
      t.arcTo(b2, a2, b2 + c2, a2, h2);
    }
    r2 && u(c, a, h2, h2);
    d && u(e2, a, -h2, h2);
    g && u(e2, b, -h2, -h2);
    x && u(c, b, h2, -h2);
  }
  function A(t, c) {
    var a = c.fill;
    if (typeof a === "string")
      t.fillStyle = a;
    else {
      var e2 = a.type, b = a.colorStops;
      a = a.position.map((b2) => Math.round(b2 * c.size));
      if (e2 === "linear-gradient")
        var h2 = t.createLinearGradient.apply(t, a);
      else if (e2 === "radial-gradient")
        h2 = t.createRadialGradient.apply(t, a);
      else
        throw Error("Unsupported fill");
      b.forEach(([b2, a2]) => {
        h2.addColorStop(b2, a2);
      });
      t.fillStyle = h2;
    }
  }
  function y(t, c) {
    a: {
      var a = c.text, e2 = c.v, b = c.N, h2 = c.K, r2 = c.P;
      b = Math.max(1, b || 1);
      for (h2 = Math.min(40, h2 || 40); b <= h2; b += 1)
        try {
          var d = B(a, e2, b, r2);
          break a;
        } catch (J) {
        }
      d = void 0;
    }
    if (!d)
      return null;
    a = t.getContext("2d");
    c.background && (a.fillStyle = c.background, a.fillRect(c.left, c.top, c.size, c.size));
    e2 = d.O;
    h2 = c.size / e2;
    a.beginPath();
    for (r2 = 0; r2 < e2; r2 += 1)
      for (b = 0; b < e2; b += 1) {
        var g = a, x = c.left + b * h2, u = c.top + r2 * h2, p = r2, q = b, f = d.a, k = x + h2, m = u + h2, D = p - 1, E = p + 1, n2 = q - 1, l = q + 1, y2 = Math.floor(Math.min(0.5, Math.max(0, c.R)) * h2), v2 = f(p, q), I = f(D, n2), w2 = f(D, q);
        D = f(D, l);
        var F = f(p, l);
        l = f(E, l);
        q = f(E, q);
        E = f(E, n2);
        p = f(p, n2);
        x = Math.round(x);
        u = Math.round(u);
        k = Math.round(k);
        m = Math.round(m);
        v2 ? C(g, x, u, k, m, y2, !w2 && !p, !w2 && !F, !q && !F, !q && !p) : z(g, x, u, k, m, y2, w2 && p && I, w2 && F && D, q && F && l, q && p && E);
      }
    A(a, c);
    a.fill();
    return t;
  }
  var v = { minVersion: 1, maxVersion: 40, ecLevel: "L", left: 0, top: 0, size: 200, fill: "#000", background: null, text: "no text", radius: 0.5, quiet: 0 };
  G = function(t, c) {
    var a = {};
    Object.assign(a, v, t);
    a.N = a.minVersion;
    a.K = a.maxVersion;
    a.v = a.ecLevel;
    a.left = a.left;
    a.top = a.top;
    a.size = a.size;
    a.fill = a.fill;
    a.background = a.background;
    a.text = a.text;
    a.R = a.radius;
    a.P = a.quiet;
    if (c instanceof HTMLCanvasElement) {
      if (c.width !== a.size || c.height !== a.size)
        c.width = a.size, c.height = a.size;
      c.getContext("2d").clearRect(0, 0, c.width, c.height);
      y(c, a);
    } else
      t = document.createElement("canvas"), t.width = a.size, t.height = a.size, a = y(t, a), c.appendChild(a);
  };
})(function() {
  function w(c) {
    var a = C.s(c);
    return { S: function() {
      return 4;
    }, b: function() {
      return a.length;
    }, write: function(c2) {
      for (var b = 0; b < a.length; b += 1)
        c2.put(a[b], 8);
    } };
  }
  function B() {
    var c = [], a = 0, e2 = {
      B: function() {
        return c;
      },
      c: function(b) {
        return (c[Math.floor(b / 8)] >>> 7 - b % 8 & 1) == 1;
      },
      put: function(b, h2) {
        for (var a2 = 0; a2 < h2; a2 += 1)
          e2.m((b >>> h2 - a2 - 1 & 1) == 1);
      },
      f: function() {
        return a;
      },
      m: function(b) {
        var h2 = Math.floor(a / 8);
        c.length <= h2 && c.push(0);
        b && (c[h2] |= 128 >>> a % 8);
        a += 1;
      }
    };
    return e2;
  }
  function C(c, a) {
    function e2(b2, h3) {
      for (var a2 = -1; 7 >= a2; a2 += 1)
        if (!(-1 >= b2 + a2 || d <= b2 + a2))
          for (var c2 = -1; 7 >= c2; c2 += 1)
            -1 >= h3 + c2 || d <= h3 + c2 || (r2[b2 + a2][h3 + c2] = 0 <= a2 && 6 >= a2 && (c2 == 0 || c2 == 6) || 0 <= c2 && 6 >= c2 && (a2 == 0 || a2 == 6) || 2 <= a2 && 4 >= a2 && 2 <= c2 && 4 >= c2 ? true : false);
    }
    function b(b2, a2) {
      for (var f = d = 4 * c + 17, k = Array(f), m = 0; m < f; m += 1) {
        k[m] = Array(f);
        for (var p = 0; p < f; p += 1)
          k[m][p] = null;
      }
      r2 = k;
      e2(0, 0);
      e2(d - 7, 0);
      e2(0, d - 7);
      f = y.G(c);
      for (k = 0; k < f.length; k += 1)
        for (m = 0; m < f.length; m += 1) {
          p = f[k];
          var q = f[m];
          if (r2[p][q] == null)
            for (var n2 = -2; 2 >= n2; n2 += 1)
              for (var l = -2; 2 >= l; l += 1)
                r2[p + n2][q + l] = n2 == -2 || n2 == 2 || l == -2 || l == 2 || n2 == 0 && l == 0;
        }
      for (f = 8; f < d - 8; f += 1)
        r2[f][6] == null && (r2[f][6] = f % 2 == 0);
      for (f = 8; f < d - 8; f += 1)
        r2[6][f] == null && (r2[6][f] = f % 2 == 0);
      f = y.w(h2 << 3 | a2);
      for (k = 0; 15 > k; k += 1)
        m = !b2 && (f >> k & 1) == 1, r2[6 > k ? k : 8 > k ? k + 1 : d - 15 + k][8] = m, r2[8][8 > k ? d - k - 1 : 9 > k ? 15 - k : 14 - k] = m;
      r2[d - 8][8] = !b2;
      if (7 <= c) {
        f = y.A(c);
        for (k = 0; 18 > k; k += 1)
          m = !b2 && (f >> k & 1) == 1, r2[Math.floor(k / 3)][k % 3 + d - 8 - 3] = m;
        for (k = 0; 18 > k; k += 1)
          m = !b2 && (f >> k & 1) == 1, r2[k % 3 + d - 8 - 3][Math.floor(k / 3)] = m;
      }
      if (g == null) {
        b2 = t.I(c, h2);
        f = B();
        for (k = 0; k < x.length; k += 1)
          m = x[k], f.put(4, 4), f.put(m.b(), y.f(4, c)), m.write(f);
        for (k = m = 0; k < b2.length; k += 1)
          m += b2[k].j;
        if (f.f() > 8 * m)
          throw Error("code length overflow. (" + f.f() + ">" + 8 * m + ")");
        for (f.f() + 4 <= 8 * m && f.put(0, 4); f.f() % 8 != 0; )
          f.m(false);
        for (; !(f.f() >= 8 * m); ) {
          f.put(236, 8);
          if (f.f() >= 8 * m)
            break;
          f.put(17, 8);
        }
        var u2 = 0;
        m = k = 0;
        p = Array(b2.length);
        q = Array(b2.length);
        for (n2 = 0; n2 < b2.length; n2 += 1) {
          var v2 = b2[n2].j, w2 = b2[n2].o - v2;
          k = Math.max(k, v2);
          m = Math.max(m, w2);
          p[n2] = Array(v2);
          for (l = 0; l < p[n2].length; l += 1)
            p[n2][l] = 255 & f.B()[l + u2];
          u2 += v2;
          l = y.C(w2);
          v2 = z(p[n2], l.b() - 1).l(l);
          q[n2] = Array(l.b() - 1);
          for (l = 0; l < q[n2].length; l += 1)
            w2 = l + v2.b() - q[n2].length, q[n2][l] = 0 <= w2 ? v2.c(w2) : 0;
        }
        for (l = f = 0; l < b2.length; l += 1)
          f += b2[l].o;
        f = Array(f);
        for (l = u2 = 0; l < k; l += 1)
          for (n2 = 0; n2 < b2.length; n2 += 1)
            l < p[n2].length && (f[u2] = p[n2][l], u2 += 1);
        for (l = 0; l < m; l += 1)
          for (n2 = 0; n2 < b2.length; n2 += 1)
            l < q[n2].length && (f[u2] = q[n2][l], u2 += 1);
        g = f;
      }
      b2 = g;
      f = -1;
      k = d - 1;
      m = 7;
      p = 0;
      a2 = y.F(a2);
      for (q = d - 1; 0 < q; q -= 2)
        for (q == 6 && --q; ; ) {
          for (n2 = 0; 2 > n2; n2 += 1)
            r2[k][q - n2] == null && (l = false, p < b2.length && (l = (b2[p] >>> m & 1) == 1), a2(k, q - n2) && (l = !l), r2[k][q - n2] = l, --m, m == -1 && (p += 1, m = 7));
          k += f;
          if (0 > k || d <= k) {
            k -= f;
            f = -f;
            break;
          }
        }
    }
    var h2 = A[a], r2 = null, d = 0, g = null, x = [], u = { u: function(b2) {
      b2 = w(b2);
      x.push(b2);
      g = null;
    }, a: function(b2, a2) {
      if (0 > b2 || d <= b2 || 0 > a2 || d <= a2)
        throw Error(b2 + "," + a2);
      return r2[b2][a2];
    }, h: function() {
      return d;
    }, J: function() {
      for (var a2 = 0, h3 = 0, c2 = 0; 8 > c2; c2 += 1) {
        b(true, c2);
        var d2 = y.D(u);
        if (c2 == 0 || a2 > d2)
          a2 = d2, h3 = c2;
      }
      b(false, h3);
    } };
    return u;
  }
  function z(c, a) {
    if (typeof c.length == "undefined")
      throw Error(c.length + "/" + a);
    var e2 = function() {
      for (var b2 = 0; b2 < c.length && c[b2] == 0; )
        b2 += 1;
      for (var r2 = Array(c.length - b2 + a), d = 0; d < c.length - b2; d += 1)
        r2[d] = c[d + b2];
      return r2;
    }(), b = { c: function(b2) {
      return e2[b2];
    }, b: function() {
      return e2.length;
    }, multiply: function(a2) {
      for (var h2 = Array(b.b() + a2.b() - 1), c2 = 0; c2 < b.b(); c2 += 1)
        for (var g = 0; g < a2.b(); g += 1)
          h2[c2 + g] ^= v.i(v.g(b.c(c2)) + v.g(a2.c(g)));
      return z(h2, 0);
    }, l: function(a2) {
      if (0 > b.b() - a2.b())
        return b;
      for (var c2 = v.g(b.c(0)) - v.g(a2.c(0)), h2 = Array(b.b()), g = 0; g < b.b(); g += 1)
        h2[g] = b.c(g);
      for (g = 0; g < a2.b(); g += 1)
        h2[g] ^= v.i(v.g(a2.c(g)) + c2);
      return z(h2, 0).l(a2);
    } };
    return b;
  }
  C.s = function(c) {
    for (var a = [], e2 = 0; e2 < c.length; e2++) {
      var b = c.charCodeAt(e2);
      128 > b ? a.push(b) : 2048 > b ? a.push(192 | b >> 6, 128 | b & 63) : 55296 > b || 57344 <= b ? a.push(224 | b >> 12, 128 | b >> 6 & 63, 128 | b & 63) : (e2++, b = 65536 + ((b & 1023) << 10 | c.charCodeAt(e2) & 1023), a.push(240 | b >> 18, 128 | b >> 12 & 63, 128 | b >> 6 & 63, 128 | b & 63));
    }
    return a;
  };
  var A = { L: 1, M: 0, Q: 3, H: 2 }, y = function() {
    function c(b) {
      for (var a2 = 0; b != 0; )
        a2 += 1, b >>>= 1;
      return a2;
    }
    var a = [
      [],
      [6, 18],
      [6, 22],
      [6, 26],
      [6, 30],
      [6, 34],
      [6, 22, 38],
      [6, 24, 42],
      [6, 26, 46],
      [6, 28, 50],
      [6, 30, 54],
      [6, 32, 58],
      [6, 34, 62],
      [6, 26, 46, 66],
      [6, 26, 48, 70],
      [6, 26, 50, 74],
      [6, 30, 54, 78],
      [6, 30, 56, 82],
      [6, 30, 58, 86],
      [6, 34, 62, 90],
      [6, 28, 50, 72, 94],
      [6, 26, 50, 74, 98],
      [6, 30, 54, 78, 102],
      [6, 28, 54, 80, 106],
      [6, 32, 58, 84, 110],
      [6, 30, 58, 86, 114],
      [6, 34, 62, 90, 118],
      [6, 26, 50, 74, 98, 122],
      [6, 30, 54, 78, 102, 126],
      [6, 26, 52, 78, 104, 130],
      [6, 30, 56, 82, 108, 134],
      [6, 34, 60, 86, 112, 138],
      [6, 30, 58, 86, 114, 142],
      [6, 34, 62, 90, 118, 146],
      [6, 30, 54, 78, 102, 126, 150],
      [6, 24, 50, 76, 102, 128, 154],
      [6, 28, 54, 80, 106, 132, 158],
      [6, 32, 58, 84, 110, 136, 162],
      [6, 26, 54, 82, 110, 138, 166],
      [6, 30, 58, 86, 114, 142, 170]
    ], e2 = { w: function(b) {
      for (var a2 = b << 10; 0 <= c(a2) - c(1335); )
        a2 ^= 1335 << c(a2) - c(1335);
      return (b << 10 | a2) ^ 21522;
    }, A: function(b) {
      for (var a2 = b << 12; 0 <= c(a2) - c(7973); )
        a2 ^= 7973 << c(a2) - c(7973);
      return b << 12 | a2;
    }, G: function(b) {
      return a[b - 1];
    }, F: function(b) {
      switch (b) {
        case 0:
          return function(b2, a2) {
            return (b2 + a2) % 2 == 0;
          };
        case 1:
          return function(b2) {
            return b2 % 2 == 0;
          };
        case 2:
          return function(b2, a2) {
            return a2 % 3 == 0;
          };
        case 3:
          return function(b2, a2) {
            return (b2 + a2) % 3 == 0;
          };
        case 4:
          return function(b2, a2) {
            return (Math.floor(b2 / 2) + Math.floor(a2 / 3)) % 2 == 0;
          };
        case 5:
          return function(b2, a2) {
            return b2 * a2 % 2 + b2 * a2 % 3 == 0;
          };
        case 6:
          return function(b2, a2) {
            return (b2 * a2 % 2 + b2 * a2 % 3) % 2 == 0;
          };
        case 7:
          return function(b2, a2) {
            return (b2 * a2 % 3 + (b2 + a2) % 2) % 2 == 0;
          };
        default:
          throw Error("bad maskPattern:" + b);
      }
    }, C: function(b) {
      for (var a2 = z([1], 0), c2 = 0; c2 < b; c2 += 1)
        a2 = a2.multiply(z([1, v.i(c2)], 0));
      return a2;
    }, f: function(b, a2) {
      if (b != 4 || 1 > a2 || 40 < a2)
        throw Error("mode: " + b + "; type: " + a2);
      return 10 > a2 ? 8 : 16;
    }, D: function(b) {
      for (var a2 = b.h(), c2 = 0, d = 0; d < a2; d += 1)
        for (var g = 0; g < a2; g += 1) {
          for (var e3 = 0, t2 = b.a(d, g), p = -1; 1 >= p; p += 1)
            if (!(0 > d + p || a2 <= d + p))
              for (var q = -1; 1 >= q; q += 1)
                0 > g + q || a2 <= g + q || (p != 0 || q != 0) && t2 == b.a(d + p, g + q) && (e3 += 1);
          5 < e3 && (c2 += 3 + e3 - 5);
        }
      for (d = 0; d < a2 - 1; d += 1)
        for (g = 0; g < a2 - 1; g += 1)
          if (e3 = 0, b.a(d, g) && (e3 += 1), b.a(d + 1, g) && (e3 += 1), b.a(d, g + 1) && (e3 += 1), b.a(d + 1, g + 1) && (e3 += 1), e3 == 0 || e3 == 4)
            c2 += 3;
      for (d = 0; d < a2; d += 1)
        for (g = 0; g < a2 - 6; g += 1)
          b.a(d, g) && !b.a(d, g + 1) && b.a(d, g + 2) && b.a(d, g + 3) && b.a(d, g + 4) && !b.a(d, g + 5) && b.a(d, g + 6) && (c2 += 40);
      for (g = 0; g < a2; g += 1)
        for (d = 0; d < a2 - 6; d += 1)
          b.a(d, g) && !b.a(d + 1, g) && b.a(d + 2, g) && b.a(d + 3, g) && b.a(d + 4, g) && !b.a(d + 5, g) && b.a(d + 6, g) && (c2 += 40);
      for (g = e3 = 0; g < a2; g += 1)
        for (d = 0; d < a2; d += 1)
          b.a(d, g) && (e3 += 1);
      return c2 += Math.abs(100 * e3 / a2 / a2 - 50) / 5 * 10;
    } };
    return e2;
  }(), v = function() {
    for (var c = Array(256), a = Array(256), e2 = 0; 8 > e2; e2 += 1)
      c[e2] = 1 << e2;
    for (e2 = 8; 256 > e2; e2 += 1)
      c[e2] = c[e2 - 4] ^ c[e2 - 5] ^ c[e2 - 6] ^ c[e2 - 8];
    for (e2 = 0; 255 > e2; e2 += 1)
      a[c[e2]] = e2;
    return { g: function(b) {
      if (1 > b)
        throw Error("glog(" + b + ")");
      return a[b];
    }, i: function(b) {
      for (; 0 > b; )
        b += 255;
      for (; 256 <= b; )
        b -= 255;
      return c[b];
    } };
  }(), t = function() {
    function c(b, c2) {
      switch (c2) {
        case A.L:
          return a[4 * (b - 1)];
        case A.M:
          return a[4 * (b - 1) + 1];
        case A.Q:
          return a[4 * (b - 1) + 2];
        case A.H:
          return a[4 * (b - 1) + 3];
      }
    }
    var a = [
      [1, 26, 19],
      [1, 26, 16],
      [1, 26, 13],
      [1, 26, 9],
      [1, 44, 34],
      [1, 44, 28],
      [1, 44, 22],
      [1, 44, 16],
      [1, 70, 55],
      [1, 70, 44],
      [2, 35, 17],
      [2, 35, 13],
      [1, 100, 80],
      [2, 50, 32],
      [2, 50, 24],
      [4, 25, 9],
      [1, 134, 108],
      [2, 67, 43],
      [2, 33, 15, 2, 34, 16],
      [2, 33, 11, 2, 34, 12],
      [2, 86, 68],
      [4, 43, 27],
      [4, 43, 19],
      [4, 43, 15],
      [2, 98, 78],
      [4, 49, 31],
      [2, 32, 14, 4, 33, 15],
      [4, 39, 13, 1, 40, 14],
      [2, 121, 97],
      [2, 60, 38, 2, 61, 39],
      [4, 40, 18, 2, 41, 19],
      [4, 40, 14, 2, 41, 15],
      [2, 146, 116],
      [
        3,
        58,
        36,
        2,
        59,
        37
      ],
      [4, 36, 16, 4, 37, 17],
      [4, 36, 12, 4, 37, 13],
      [2, 86, 68, 2, 87, 69],
      [4, 69, 43, 1, 70, 44],
      [6, 43, 19, 2, 44, 20],
      [6, 43, 15, 2, 44, 16],
      [4, 101, 81],
      [1, 80, 50, 4, 81, 51],
      [4, 50, 22, 4, 51, 23],
      [3, 36, 12, 8, 37, 13],
      [2, 116, 92, 2, 117, 93],
      [6, 58, 36, 2, 59, 37],
      [4, 46, 20, 6, 47, 21],
      [7, 42, 14, 4, 43, 15],
      [4, 133, 107],
      [8, 59, 37, 1, 60, 38],
      [8, 44, 20, 4, 45, 21],
      [12, 33, 11, 4, 34, 12],
      [3, 145, 115, 1, 146, 116],
      [4, 64, 40, 5, 65, 41],
      [11, 36, 16, 5, 37, 17],
      [11, 36, 12, 5, 37, 13],
      [5, 109, 87, 1, 110, 88],
      [5, 65, 41, 5, 66, 42],
      [5, 54, 24, 7, 55, 25],
      [11, 36, 12, 7, 37, 13],
      [5, 122, 98, 1, 123, 99],
      [
        7,
        73,
        45,
        3,
        74,
        46
      ],
      [15, 43, 19, 2, 44, 20],
      [3, 45, 15, 13, 46, 16],
      [1, 135, 107, 5, 136, 108],
      [10, 74, 46, 1, 75, 47],
      [1, 50, 22, 15, 51, 23],
      [2, 42, 14, 17, 43, 15],
      [5, 150, 120, 1, 151, 121],
      [9, 69, 43, 4, 70, 44],
      [17, 50, 22, 1, 51, 23],
      [2, 42, 14, 19, 43, 15],
      [3, 141, 113, 4, 142, 114],
      [3, 70, 44, 11, 71, 45],
      [17, 47, 21, 4, 48, 22],
      [9, 39, 13, 16, 40, 14],
      [3, 135, 107, 5, 136, 108],
      [3, 67, 41, 13, 68, 42],
      [15, 54, 24, 5, 55, 25],
      [15, 43, 15, 10, 44, 16],
      [4, 144, 116, 4, 145, 117],
      [17, 68, 42],
      [17, 50, 22, 6, 51, 23],
      [19, 46, 16, 6, 47, 17],
      [2, 139, 111, 7, 140, 112],
      [17, 74, 46],
      [7, 54, 24, 16, 55, 25],
      [34, 37, 13],
      [
        4,
        151,
        121,
        5,
        152,
        122
      ],
      [4, 75, 47, 14, 76, 48],
      [11, 54, 24, 14, 55, 25],
      [16, 45, 15, 14, 46, 16],
      [6, 147, 117, 4, 148, 118],
      [6, 73, 45, 14, 74, 46],
      [11, 54, 24, 16, 55, 25],
      [30, 46, 16, 2, 47, 17],
      [8, 132, 106, 4, 133, 107],
      [8, 75, 47, 13, 76, 48],
      [7, 54, 24, 22, 55, 25],
      [22, 45, 15, 13, 46, 16],
      [10, 142, 114, 2, 143, 115],
      [19, 74, 46, 4, 75, 47],
      [28, 50, 22, 6, 51, 23],
      [33, 46, 16, 4, 47, 17],
      [8, 152, 122, 4, 153, 123],
      [22, 73, 45, 3, 74, 46],
      [8, 53, 23, 26, 54, 24],
      [12, 45, 15, 28, 46, 16],
      [3, 147, 117, 10, 148, 118],
      [3, 73, 45, 23, 74, 46],
      [4, 54, 24, 31, 55, 25],
      [11, 45, 15, 31, 46, 16],
      [7, 146, 116, 7, 147, 117],
      [21, 73, 45, 7, 74, 46],
      [1, 53, 23, 37, 54, 24],
      [19, 45, 15, 26, 46, 16],
      [5, 145, 115, 10, 146, 116],
      [19, 75, 47, 10, 76, 48],
      [15, 54, 24, 25, 55, 25],
      [23, 45, 15, 25, 46, 16],
      [13, 145, 115, 3, 146, 116],
      [2, 74, 46, 29, 75, 47],
      [42, 54, 24, 1, 55, 25],
      [23, 45, 15, 28, 46, 16],
      [17, 145, 115],
      [10, 74, 46, 23, 75, 47],
      [10, 54, 24, 35, 55, 25],
      [19, 45, 15, 35, 46, 16],
      [17, 145, 115, 1, 146, 116],
      [14, 74, 46, 21, 75, 47],
      [29, 54, 24, 19, 55, 25],
      [11, 45, 15, 46, 46, 16],
      [13, 145, 115, 6, 146, 116],
      [14, 74, 46, 23, 75, 47],
      [44, 54, 24, 7, 55, 25],
      [59, 46, 16, 1, 47, 17],
      [12, 151, 121, 7, 152, 122],
      [12, 75, 47, 26, 76, 48],
      [39, 54, 24, 14, 55, 25],
      [22, 45, 15, 41, 46, 16],
      [6, 151, 121, 14, 152, 122],
      [6, 75, 47, 34, 76, 48],
      [46, 54, 24, 10, 55, 25],
      [2, 45, 15, 64, 46, 16],
      [17, 152, 122, 4, 153, 123],
      [29, 74, 46, 14, 75, 47],
      [49, 54, 24, 10, 55, 25],
      [24, 45, 15, 46, 46, 16],
      [4, 152, 122, 18, 153, 123],
      [13, 74, 46, 32, 75, 47],
      [48, 54, 24, 14, 55, 25],
      [42, 45, 15, 32, 46, 16],
      [20, 147, 117, 4, 148, 118],
      [40, 75, 47, 7, 76, 48],
      [43, 54, 24, 22, 55, 25],
      [10, 45, 15, 67, 46, 16],
      [19, 148, 118, 6, 149, 119],
      [18, 75, 47, 31, 76, 48],
      [34, 54, 24, 34, 55, 25],
      [20, 45, 15, 61, 46, 16]
    ], e2 = { I: function(b, a2) {
      var e3 = c(b, a2);
      if (typeof e3 == "undefined")
        throw Error("bad rs block @ typeNumber:" + b + "/errorCorrectLevel:" + a2);
      b = e3.length / 3;
      a2 = [];
      for (var d = 0; d < b; d += 1)
        for (var g = e3[3 * d], h2 = e3[3 * d + 1], t2 = e3[3 * d + 2], p = 0; p < g; p += 1) {
          var q = t2, f = {};
          f.o = h2;
          f.j = q;
          a2.push(f);
        }
      return a2;
    } };
    return e2;
  }();
  return C;
}());
var qr_creator_es6_min_default = QrCreator;

// _uyihdawu1:/Users/claviska/Projects/shoelace/src/components/qr-code/qr-code.scss
var qr_code_default = ":host {\n  position: relative;\n  box-sizing: border-box;\n}\n:host *, :host *:before, :host *:after {\n  box-sizing: inherit;\n}\n\n[hidden] {\n  display: none !important;\n}\n\n:host {\n  display: inline-block;\n}\n\n.qr-code {\n  position: relative;\n}\n\ncanvas {\n  position: absolute;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100%;\n}";

// src/components/qr-code/qr-code.ts
var SlQrCode = class extends h {
  constructor() {
    super(...arguments);
    this.value = "";
    this.label = "";
    this.size = 128;
    this.fill = "#000";
    this.background = "#fff";
    this.radius = 0;
    this.errorCorrection = "H";
  }
  firstUpdated() {
    this.generate();
  }
  generate() {
    qr_creator_es6_min_default.render({
      text: this.value,
      radius: this.radius,
      ecLevel: this.errorCorrection,
      fill: this.fill,
      background: this.background === "transparent" ? null : this.background,
      size: this.size * 2
    }, this.canvas);
  }
  render() {
    return T`
      <div
        class="qr-code"
        part="base"
        style=${i({
      width: `${this.size}px`,
      height: `${this.size}px`
    })}
      >
        <canvas role="img" aria-label=${this.label || this.value}></canvas>
      </div>
    `;
  }
};
SlQrCode.styles = r(qr_code_default);
__decorateClass([
  o("canvas")
], SlQrCode.prototype, "canvas", 2);
__decorateClass([
  e()
], SlQrCode.prototype, "value", 2);
__decorateClass([
  e()
], SlQrCode.prototype, "label", 2);
__decorateClass([
  e({ type: Number })
], SlQrCode.prototype, "size", 2);
__decorateClass([
  e()
], SlQrCode.prototype, "fill", 2);
__decorateClass([
  e()
], SlQrCode.prototype, "background", 2);
__decorateClass([
  e({ type: Number })
], SlQrCode.prototype, "radius", 2);
__decorateClass([
  e({ attribute: "error-correction" })
], SlQrCode.prototype, "errorCorrection", 2);
__decorateClass([
  watch("background"),
  watch("errorCorrection"),
  watch("fill"),
  watch("radius"),
  watch("size"),
  watch("value")
], SlQrCode.prototype, "generate", 1);
SlQrCode = __decorateClass([
  n("sl-qr-code")
], SlQrCode);
var qr_code_default2 = SlQrCode;

export {
  qr_code_default2 as qr_code_default
};
