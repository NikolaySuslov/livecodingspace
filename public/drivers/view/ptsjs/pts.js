/*!
 * pts.js 0.10.5 - Copyright © 2017-2021 William Ngan and contributors.
 * Licensed under Apache 2.0 License.
 * See https://github.com/williamngan/pts for details.
 */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["Pts"] = factory();
	else
		root["Pts"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/_lib.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/Canvas.ts":
/*!***********************!*\
  !*** ./src/Canvas.ts ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/*! Source code licensed under Apache License 2.0. Copyright © 2017-current William Ngan and contributors. (https://github.com/williamngan/pts) */
Object.defineProperty(exports, "__esModule", { value: true });
exports.CanvasForm = exports.CanvasSpace = void 0;
const Space_1 = __webpack_require__(/*! ./Space */ "./src/Space.ts");
const Form_1 = __webpack_require__(/*! ./Form */ "./src/Form.ts");
const Pt_1 = __webpack_require__(/*! ./Pt */ "./src/Pt.ts");
const Util_1 = __webpack_require__(/*! ./Util */ "./src/Util.ts");
const Typography_1 = __webpack_require__(/*! ./Typography */ "./src/Typography.ts");
const Op_1 = __webpack_require__(/*! ./Op */ "./src/Op.ts");
const Image_1 = __webpack_require__(/*! ./Image */ "./src/Image.ts");
class CanvasSpace extends Space_1.MultiTouchSpace {
    constructor(elem, callback) {
        super();
        this._pixelScale = 1;
        this._autoResize = true;
        this._bgcolor = "#e1e9f0";
        this._offscreen = false;
        this._initialResize = false;
        var _selector = null;
        var _existed = false;
        this.id = "pt";
        if (elem instanceof Element) {
            _selector = elem;
            this.id = "pts_existing_space";
        }
        else {
            let id = elem;
            id = (elem[0] === "#" || elem[0] === ".") ? elem : "#" + elem;
            _selector = document.querySelector(id);
            _existed = true;
            this.id = id.substr(1);
        }
        if (!_selector) {
            this._container = this._createElement("div", this.id + "_container");
            this._canvas = this._createElement("canvas", this.id);
            this._container.appendChild(this._canvas);
            document.body.appendChild(this._container);
            _existed = false;
        }
        else if (_selector.nodeName.toLowerCase() != "canvas") {
            this._container = _selector;
            this._canvas = this._createElement("canvas", this.id + "_canvas");
            this._container.appendChild(this._canvas);
            this._initialResize = true;
        }
        else {
            this._canvas = _selector;
            this._container = _selector.parentElement;
            this._autoResize = false;
        }
        setTimeout(this._ready.bind(this, callback), 100);
        this._ctx = this._canvas.getContext('2d');
    }
    _createElement(elem = "div", id) {
        let d = document.createElement(elem);
        d.setAttribute("id", id);
        return d;
    }
    _ready(callback) {
        if (!this._container)
            throw new Error(`Cannot initiate #${this.id} element`);
        this._isReady = true;
        this._resizeHandler(null);
        this.clear(this._bgcolor);
        this._canvas.dispatchEvent(new Event("ready"));
        for (let k in this.players) {
            if (this.players.hasOwnProperty(k)) {
                if (this.players[k].start)
                    this.players[k].start(this.bound.clone(), this);
            }
        }
        this._pointer = this.center;
        this._initialResize = false;
        if (callback)
            callback(this.bound, this._canvas);
    }
    setup(opt) {
        this._bgcolor = opt.bgcolor ? opt.bgcolor : "transparent";
        this.autoResize = (opt.resize != undefined) ? opt.resize : false;
        if (opt.retina !== false) {
            let r1 = window ? window.devicePixelRatio || 1 : 1;
            let r2 = this._ctx.webkitBackingStorePixelRatio || this._ctx.mozBackingStorePixelRatio || this._ctx.msBackingStorePixelRatio || this._ctx.oBackingStorePixelRatio || this._ctx.backingStorePixelRatio || 1;
            this._pixelScale = Math.max(1, r1 / r2);
        }
        if (opt.offscreen) {
            this._offscreen = true;
            this._offCanvas = this._createElement("canvas", this.id + "_offscreen");
            this._offCtx = this._offCanvas.getContext('2d');
        }
        else {
            this._offscreen = false;
        }
        return this;
    }
    set autoResize(auto) {
        if (!window)
            return;
        this._autoResize = auto;
        if (auto) {
            window.addEventListener('resize', this._resizeHandler.bind(this));
        }
        else {
            window.removeEventListener('resize', this._resizeHandler.bind(this));
        }
    }
    get autoResize() { return this._autoResize; }
    resize(b, evt) {
        this.bound = b;
        this._canvas.width = this.bound.size.x * this._pixelScale;
        this._canvas.height = this.bound.size.y * this._pixelScale;
        this._canvas.style.width = Math.floor(this.bound.size.x) + "px";
        this._canvas.style.height = Math.floor(this.bound.size.y) + "px";
        if (this._offscreen) {
            this._offCanvas.width = this.bound.size.x * this._pixelScale;
            this._offCanvas.height = this.bound.size.y * this._pixelScale;
        }
        if (this._pixelScale != 1) {
            this._ctx.scale(this._pixelScale, this._pixelScale);
            if (this._offscreen) {
                this._offCtx.scale(this._pixelScale, this._pixelScale);
            }
        }
        for (let k in this.players) {
            if (this.players.hasOwnProperty(k)) {
                let p = this.players[k];
                if (p.resize)
                    p.resize(this.bound, evt);
            }
        }
        this.render(this._ctx);
        if (evt && !this.isPlaying)
            this.playOnce(0);
        return this;
    }
    _resizeHandler(evt) {
        if (!window)
            return;
        let b = (this._autoResize || this._initialResize) ? this._container.getBoundingClientRect() : this._canvas.getBoundingClientRect();
        if (b) {
            let box = Pt_1.Bound.fromBoundingRect(b);
            box.center = box.center.add(window.pageXOffset, window.pageYOffset);
            this.resize(box, evt);
        }
    }
    set background(bg) { this._bgcolor = bg; }
    get background() { return this._bgcolor; }
    get pixelScale() {
        return this._pixelScale;
    }
    get hasOffscreen() {
        return this._offscreen;
    }
    get offscreenCtx() { return this._offCtx; }
    get offscreenCanvas() { return this._offCanvas; }
    getForm() { return new CanvasForm(this); }
    get element() {
        return this._canvas;
    }
    get parent() {
        return this._container;
    }
    get ready() {
        return this._isReady;
    }
    get ctx() { return this._ctx; }
    clear(bg) {
        if (bg)
            this._bgcolor = bg;
        const lastColor = this._ctx.fillStyle;
        if (!this._bgcolor || this._bgcolor === "transparent") {
            this._ctx.clearRect(-1, -1, this._canvas.width + 1, this._canvas.height + 1);
        }
        else {
            if (this._bgcolor.indexOf("rgba") === 0 || (this._bgcolor.length === 9 && this._bgcolor.indexOf("#") === 0)) {
                this._ctx.clearRect(-1, -1, this._canvas.width + 1, this._canvas.height + 1);
            }
            this._ctx.fillStyle = this._bgcolor;
            this._ctx.fillRect(-1, -1, this._canvas.width + 1, this._canvas.height + 1);
        }
        this._ctx.fillStyle = lastColor;
        return this;
    }
    clearOffscreen(bg) {
        if (this._offscreen) {
            if (bg) {
                this._offCtx.fillStyle = bg;
                this._offCtx.fillRect(-1, -1, this._canvas.width + 1, this._canvas.height + 1);
            }
            else {
                this._offCtx.clearRect(-1, -1, this._offCanvas.width + 1, this._offCanvas.height + 1);
            }
        }
        return this;
    }
    playItems(time) {
        if (this._isReady) {
            this._ctx.save();
            if (this._offscreen)
                this._offCtx.save();
            super.playItems(time);
            this._ctx.restore();
            if (this._offscreen)
                this._offCtx.restore();
            this.render(this._ctx);
        }
    }
    dispose() {
        if (!window)
            return;
        window.removeEventListener('resize', this._resizeHandler.bind(this));
        this.stop();
        this.removeAll();
        return this;
    }
    recorder(downloadOrCallback, filetype = "webm", bitrate = 15000000) {
        let stream = this._canvas.captureStream();
        const recorder = new MediaRecorder(stream, { mimeType: `video/${filetype}`, bitsPerSecond: bitrate });
        recorder.ondataavailable = function (d) {
            let url = URL.createObjectURL(new Blob([d.data], { type: `video/${filetype}` }));
            if (typeof downloadOrCallback === "function") {
                downloadOrCallback(url);
            }
            else if (downloadOrCallback) {
                let a = document.createElement("a");
                a.href = url;
                a.download = `canvas_video.${filetype}`;
                a.click();
                a.remove();
            }
        };
        return recorder;
    }
}
exports.CanvasSpace = CanvasSpace;
class CanvasForm extends Form_1.VisualForm {
    constructor(space) {
        super();
        this._style = {
            fillStyle: "#f03", strokeStyle: "#fff",
            lineWidth: 1, lineJoin: "bevel", lineCap: "butt",
            globalAlpha: 1
        };
        const _setup = (ctx) => {
            this._ctx = ctx;
            this._ctx.fillStyle = this._style.fillStyle;
            this._ctx.strokeStyle = this._style.strokeStyle;
            this._ctx.lineJoin = "bevel";
            this._ctx.font = this._font.value;
            this._ready = true;
        };
        if (space instanceof CanvasRenderingContext2D) {
            _setup(space);
        }
        else {
            this._space = space;
            this._space.add({ start: () => {
                    _setup(this._space.ctx);
                } });
        }
    }
    get space() { return this._space; }
    get ctx() { return this._space.ctx; }
    useOffscreen(off = true, clear = false) {
        if (clear)
            this._space.clearOffscreen((typeof clear == "string") ? clear : null);
        this._ctx = (this._space.hasOffscreen && off) ? this._space.offscreenCtx : this._space.ctx;
        return this;
    }
    renderOffscreen(offset = [0, 0]) {
        if (this._space.hasOffscreen) {
            this._space.ctx.drawImage(this._space.offscreenCanvas, offset[0], offset[1], this._space.width, this._space.height);
        }
    }
    alpha(a) {
        this._ctx.globalAlpha = a;
        this._style.globalAlpha = a;
        return this;
    }
    fill(c) {
        if (typeof c == "boolean") {
            this.filled = c;
        }
        else {
            this.filled = true;
            this._style.fillStyle = c;
            this._ctx.fillStyle = c;
        }
        return this;
    }
    stroke(c, width, linejoin, linecap) {
        if (typeof c == "boolean") {
            this.stroked = c;
        }
        else {
            this.stroked = true;
            this._style.strokeStyle = c;
            this._ctx.strokeStyle = c;
            if (width) {
                this._ctx.lineWidth = width;
                this._style.lineWidth = width;
            }
            if (linejoin) {
                this._ctx.lineJoin = linejoin;
                this._style.lineJoin = linejoin;
            }
            if (linecap) {
                this._ctx.lineCap = linecap;
                this._style.lineCap = linecap;
            }
        }
        return this;
    }
    gradient(stops) {
        let vals = [];
        if (stops.length < 2)
            stops.push([0.99, "#000"], [1, "#000"]);
        for (let i = 0, len = stops.length; i < len; i++) {
            let t = typeof stops[i] === 'string' ? i * (1 / (stops.length - 1)) : stops[i][0];
            let v = typeof stops[i] === 'string' ? stops[i] : stops[i][1];
            vals.push([t, v]);
        }
        return (area1, area2) => {
            area1 = area1.map(a => a.abs());
            if (area2)
                area2.map(a => a.abs());
            let grad = area2
                ? this.ctx.createRadialGradient(area1[0][0], area1[0][1], area1[1][0], area2[0][0], area2[0][1], area2[1][0])
                : this.ctx.createLinearGradient(area1[0][0], area1[0][1], area1[1][0], area1[1][1]);
            for (let i = 0, len = vals.length; i < len; i++) {
                grad.addColorStop(vals[i][0], vals[i][1]);
            }
            return grad;
        };
    }
    composite(mode = 'source-over') {
        this.ctx.globalCompositeOperation = mode;
        return this;
    }
    clip() {
        this.ctx.clip();
        return this;
    }
    dash(segments = true, offset = 0) {
        if (!segments) {
            this._ctx.setLineDash([]);
            this._ctx.lineDashOffset = 0;
        }
        else {
            if (segments === true) {
                segments = [5, 5];
            }
            this._ctx.setLineDash([segments[0], segments[1]]);
            this._ctx.lineDashOffset = offset;
        }
        return this;
    }
    font(sizeOrFont, weight, style, lineHeight, family) {
        if (typeof sizeOrFont == "number") {
            this._font.size = sizeOrFont;
            if (family)
                this._font.face = family;
            if (weight)
                this._font.weight = weight;
            if (style)
                this._font.style = style;
            if (lineHeight)
                this._font.lineHeight = lineHeight;
        }
        else {
            this._font = sizeOrFont;
        }
        this._ctx.font = this._font.value;
        if (this._estimateTextWidth)
            this.fontWidthEstimate(true);
        return this;
    }
    fontWidthEstimate(estimate = true) {
        this._estimateTextWidth = (estimate) ? Typography_1.Typography.textWidthEstimator(((c) => this._ctx.measureText(c).width)) : undefined;
        return this;
    }
    getTextWidth(c) {
        return (!this._estimateTextWidth) ? this._ctx.measureText(c + " .").width : this._estimateTextWidth(c);
    }
    _textTruncate(str, width, tail = "") {
        return Typography_1.Typography.truncate(this.getTextWidth.bind(this), str, width, tail);
    }
    _textAlign(box, vertical, offset, center) {
        let _box = Util_1.Util.iterToArray(box);
        if (!Util_1.Util.arrayCheck(_box))
            return;
        if (!center)
            center = Op_1.Rectangle.center(_box);
        var px = _box[0][0];
        if (this._ctx.textAlign == "end" || this._ctx.textAlign == "right") {
            px = _box[1][0];
        }
        else if (this._ctx.textAlign == "center" || this._ctx.textAlign == "middle") {
            px = center[0];
        }
        var py = center[1];
        if (vertical == "top" || vertical == "start") {
            py = _box[0][1];
        }
        else if (vertical == "end" || vertical == "bottom") {
            py = _box[1][1];
        }
        return (offset) ? new Pt_1.Pt(px + offset[0], py + offset[1]) : new Pt_1.Pt(px, py);
    }
    reset() {
        for (let k in this._style) {
            if (this._style.hasOwnProperty(k)) {
                this._ctx[k] = this._style[k];
            }
        }
        this._font = new Form_1.Font();
        this._ctx.font = this._font.value;
        return this;
    }
    _paint() {
        if (this._filled)
            this._ctx.fill();
        if (this._stroked)
            this._ctx.stroke();
    }
    static point(ctx, p, radius = 5, shape = "square") {
        if (!p)
            return;
        if (!CanvasForm[shape])
            throw new Error(`${shape} is not a static function of CanvasForm`);
        CanvasForm[shape](ctx, p, radius);
    }
    point(p, radius = 5, shape = "square") {
        CanvasForm.point(this._ctx, p, radius, shape);
        this._paint();
        return this;
    }
    static circle(ctx, pt, radius = 10) {
        if (!pt)
            return;
        ctx.beginPath();
        ctx.arc(pt[0], pt[1], radius, 0, Util_1.Const.two_pi, false);
        ctx.closePath();
    }
    circle(pts) {
        let p = Util_1.Util.iterToArray(pts);
        CanvasForm.circle(this._ctx, p[0], p[1][0]);
        this._paint();
        return this;
    }
    static ellipse(ctx, pt, radius, rotation = 0, startAngle = 0, endAngle = Util_1.Const.two_pi, cc = false) {
        if (!pt || !radius)
            return;
        ctx.beginPath();
        ctx.ellipse(pt[0], pt[1], radius[0], radius[1], rotation, startAngle, endAngle, cc);
    }
    ellipse(pt, radius, rotation = 0, startAngle = 0, endAngle = Util_1.Const.two_pi, cc = false) {
        CanvasForm.ellipse(this._ctx, pt, radius, rotation, startAngle, endAngle, cc);
        this._paint();
        return this;
    }
    static arc(ctx, pt, radius, startAngle, endAngle, cc) {
        if (!pt)
            return;
        ctx.beginPath();
        ctx.arc(pt[0], pt[1], radius, startAngle, endAngle, cc);
    }
    arc(pt, radius, startAngle, endAngle, cc) {
        CanvasForm.arc(this._ctx, pt, radius, startAngle, endAngle, cc);
        this._paint();
        return this;
    }
    static square(ctx, pt, halfsize) {
        if (!pt)
            return;
        let x1 = pt[0] - halfsize;
        let y1 = pt[1] - halfsize;
        let x2 = pt[0] + halfsize;
        let y2 = pt[1] + halfsize;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x1, y2);
        ctx.lineTo(x2, y2);
        ctx.lineTo(x2, y1);
        ctx.closePath();
    }
    square(pt, halfsize) {
        CanvasForm.square(this._ctx, pt, halfsize);
        this._paint();
        return this;
    }
    static line(ctx, pts) {
        if (!Util_1.Util.arrayCheck(pts))
            return;
        let i = 0;
        ctx.beginPath();
        for (let it of pts) {
            if (it) {
                if (i++ > 0) {
                    ctx.lineTo(it[0], it[1]);
                }
                else {
                    ctx.moveTo(it[0], it[1]);
                }
            }
        }
    }
    line(pts) {
        CanvasForm.line(this._ctx, pts);
        this._paint();
        return this;
    }
    static polygon(ctx, pts) {
        if (!Util_1.Util.arrayCheck(pts))
            return;
        CanvasForm.line(ctx, pts);
        ctx.closePath();
    }
    polygon(pts) {
        CanvasForm.polygon(this._ctx, pts);
        this._paint();
        return this;
    }
    static rect(ctx, pts) {
        let p = Util_1.Util.iterToArray(pts);
        if (!Util_1.Util.arrayCheck(p))
            return;
        ctx.beginPath();
        ctx.moveTo(p[0][0], p[0][1]);
        ctx.lineTo(p[0][0], p[1][1]);
        ctx.lineTo(p[1][0], p[1][1]);
        ctx.lineTo(p[1][0], p[0][1]);
        ctx.closePath();
    }
    rect(pts) {
        CanvasForm.rect(this._ctx, pts);
        this._paint();
        return this;
    }
    static image(ctx, ptOrRect, img, orig) {
        let t = Util_1.Util.iterToArray(ptOrRect);
        let pos;
        if (typeof t[0] === "number") {
            pos = t;
        }
        else {
            if (orig) {
                let o = Util_1.Util.iterToArray(orig);
                pos = [o[0][0], o[0][1], o[1][0] - o[0][0], o[1][1] - o[0][1],
                    t[0][0], t[0][1], t[1][0] - t[0][0], t[1][1] - t[0][1]];
            }
            else {
                pos = [t[0][0], t[0][1], t[1][0] - t[0][0], t[1][1] - t[0][1]];
            }
        }
        if (img instanceof Image_1.Img) {
            if (img.loaded) {
                ctx.drawImage(img.image, ...pos);
            }
        }
        else {
            ctx.drawImage(img, ...pos);
        }
    }
    image(ptOrRect, img, orig) {
        if (img instanceof Image_1.Img) {
            if (img.loaded) {
                CanvasForm.image(this._ctx, ptOrRect, img.image, orig);
            }
        }
        else {
            CanvasForm.image(this._ctx, ptOrRect, img, orig);
        }
        return this;
    }
    static imageData(ctx, ptOrRect, img) {
        let t = Util_1.Util.iterToArray(ptOrRect);
        if (typeof t[0] === "number") {
            ctx.putImageData(img, t[0], t[1]);
        }
        else {
            ctx.putImageData(img, t[0][0], t[0][1], t[0][0], t[0][1], t[1][0], t[1][1]);
        }
    }
    imageData(ptOrRect, img) {
        CanvasForm.imageData(this._ctx, ptOrRect, img);
        return this;
    }
    static text(ctx, pt, txt, maxWidth) {
        if (!pt)
            return;
        ctx.fillText(txt, pt[0], pt[1], maxWidth);
    }
    text(pt, txt, maxWidth) {
        CanvasForm.text(this._ctx, pt, txt, maxWidth);
        return this;
    }
    textBox(box, txt, verticalAlign = "middle", tail = "", overrideBaseline = true) {
        if (overrideBaseline)
            this._ctx.textBaseline = verticalAlign;
        let size = Op_1.Rectangle.size(box);
        let t = this._textTruncate(txt, size[0], tail);
        this.text(this._textAlign(box, verticalAlign), t[0]);
        return this;
    }
    paragraphBox(box, txt, lineHeight = 1.2, verticalAlign = "top", crop = true) {
        let b = Util_1.Util.iterToArray(box);
        let size = Op_1.Rectangle.size(b);
        this._ctx.textBaseline = "top";
        let lstep = this._font.size * lineHeight;
        let nextLine = (sub, buffer = [], cc = 0) => {
            if (!sub)
                return buffer;
            if (crop && cc * lstep > size[1] - lstep * 2)
                return buffer;
            if (cc > 10000)
                throw new Error("max recursion reached (10000)");
            let t = this._textTruncate(sub, size[0], "");
            let newln = t[0].indexOf("\n");
            if (newln >= 0) {
                buffer.push(t[0].substr(0, newln));
                return nextLine(sub.substr(newln + 1), buffer, cc + 1);
            }
            let dt = t[0].lastIndexOf(" ") + 1;
            if (dt <= 0 || t[1] === sub.length)
                dt = undefined;
            let line = t[0].substr(0, dt);
            buffer.push(line);
            return (t[1] <= 0 || t[1] === sub.length) ? buffer : nextLine(sub.substr((dt || t[1])), buffer, cc + 1);
        };
        let lines = nextLine(txt);
        let lsize = lines.length * lstep;
        let lbox = b;
        if (verticalAlign == "middle" || verticalAlign == "center") {
            let lpad = (size[1] - lsize) / 2;
            if (crop)
                lpad = Math.max(0, lpad);
            lbox = new Pt_1.Group(b[0].$add(0, lpad), b[1].$subtract(0, lpad));
        }
        else if (verticalAlign == "bottom") {
            lbox = new Pt_1.Group(b[0].$add(0, size[1] - lsize), b[1]);
        }
        else {
            lbox = new Pt_1.Group(b[0], b[0].$add(size[0], lsize));
        }
        let center = Op_1.Rectangle.center(lbox);
        for (let i = 0, len = lines.length; i < len; i++) {
            this.text(this._textAlign(lbox, "top", [0, i * lstep], center), lines[i]);
        }
        return this;
    }
    alignText(alignment = "left", baseline = "alphabetic") {
        if (baseline == "center")
            baseline = "middle";
        if (baseline == "baseline")
            baseline = "alphabetic";
        this._ctx.textAlign = alignment;
        this._ctx.textBaseline = baseline;
        return this;
    }
    log(txt) {
        let w = this._ctx.measureText(txt).width + 20;
        this.stroke(false).fill("rgba(0,0,0,.4)").rect([[0, 0], [w, 20]]);
        this.fill("#fff").text([10, 14], txt);
        return this;
    }
}
exports.CanvasForm = CanvasForm;


/***/ }),

/***/ "./src/Color.ts":
/*!**********************!*\
  !*** ./src/Color.ts ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/*! Source code licensed under Apache License 2.0. Copyright © 2017-current William Ngan and contributors. (https://github.com/williamngan/pts) */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Color = void 0;
const Pt_1 = __webpack_require__(/*! ./Pt */ "./src/Pt.ts");
const Util_1 = __webpack_require__(/*! ./Util */ "./src/Util.ts");
const Num_1 = __webpack_require__(/*! ./Num */ "./src/Num.ts");
class Color extends Pt_1.Pt {
    constructor(...args) {
        super(...args);
        this._mode = "rgb";
        this._isNorm = false;
    }
    static from(...args) {
        let p = [1, 1, 1, 1];
        let c = Util_1.Util.getArgs(args);
        for (let i = 0, len = p.length; i < len; i++) {
            if (i < c.length)
                p[i] = c[i];
        }
        return new Color(p);
    }
    static fromHex(hex) {
        if (hex[0] == "#")
            hex = hex.substr(1);
        if (hex.length <= 3) {
            let fn = (i) => hex[i] || "F";
            hex = `${fn(0)}${fn(0)}${fn(1)}${fn(1)}${fn(2)}${fn(2)}`;
        }
        let alpha = 1;
        if (hex.length === 8) {
            alpha = hex.substr(6) && 0xFF / 255;
            hex = hex.substring(0, 6);
        }
        let hexVal = parseInt(hex, 16);
        return new Color(hexVal >> 16, hexVal >> 8 & 0xFF, hexVal & 0xFF, alpha);
    }
    static rgb(...args) { return Color.from(...args).toMode("rgb"); }
    static hsl(...args) { return Color.from(...args).toMode("hsl"); }
    static hsb(...args) { return Color.from(...args).toMode("hsb"); }
    static lab(...args) { return Color.from(...args).toMode("lab"); }
    static lch(...args) { return Color.from(...args).toMode("lch"); }
    static luv(...args) { return Color.from(...args).toMode("luv"); }
    static xyz(...args) { return Color.from(...args).toMode("xyz"); }
    static maxValues(mode) { return Color.ranges[mode].zipSlice(1).$take([0, 1, 2]); }
    get hex() { return this.toString("hex"); }
    get rgb() { return this.toString("rgb"); }
    get rgba() { return this.toString("rgba"); }
    clone() {
        let c = new Color(this);
        c.toMode(this._mode);
        return c;
    }
    toMode(mode, convert = false) {
        if (convert) {
            let fname = this._mode.toUpperCase() + "to" + mode.toUpperCase();
            if (Color[fname]) {
                this.to(Color[fname](this, this._isNorm, this._isNorm));
            }
            else {
                throw new Error("Cannot convert color with " + fname);
            }
        }
        this._mode = mode;
        return this;
    }
    get mode() { return this._mode; }
    get r() { return this[0]; }
    set r(n) { this[0] = n; }
    get g() { return this[1]; }
    set g(n) { this[1] = n; }
    get b() { return this[2]; }
    set b(n) { this[2] = n; }
    get h() { return (this._mode == "lch") ? this[2] : this[0]; }
    set h(n) {
        let i = (this._mode == "lch") ? 2 : 0;
        this[i] = n;
    }
    get s() { return this[1]; }
    set s(n) { this[1] = n; }
    get l() { return (this._mode == "hsl") ? this[2] : this[0]; }
    set l(n) {
        let i = (this._mode == "hsl") ? 2 : 0;
        this[i] = n;
    }
    get a() { return this[1]; }
    set a(n) { this[1] = n; }
    get c() { return this[1]; }
    set c(n) { this[1] = n; }
    get u() { return this[1]; }
    set u(n) { this[1] = n; }
    get v() { return this[2]; }
    set v(n) { this[2] = n; }
    set alpha(n) { if (this.length > 3)
        this[3] = n; }
    get alpha() { return (this.length > 3) ? this[3] : 1; }
    get normalized() { return this._isNorm; }
    set normalized(b) { this._isNorm = b; }
    normalize(toNorm = true) {
        if (this._isNorm == toNorm)
            return this;
        let ranges = Color.ranges[this._mode];
        for (let i = 0; i < 3; i++) {
            this[i] = (!toNorm)
                ? Num_1.Num.mapToRange(this[i], 0, 1, ranges[i][0], ranges[i][1])
                : Num_1.Num.mapToRange(this[i], ranges[i][0], ranges[i][1], 0, 1);
        }
        this._isNorm = toNorm;
        return this;
    }
    $normalize(toNorm = true) { return this.clone().normalize(toNorm); }
    toString(format = "mode") {
        if (format == "hex") {
            let _hex = (n) => {
                let s = Math.floor(n).toString(16);
                return (s.length < 2) ? '0' + s : s;
            };
            return `#${_hex(this[0])}${_hex(this[1])}${_hex(this[2])}`;
        }
        else if (format == "rgba") {
            return `rgba(${Math.floor(this[0])},${Math.floor(this[1])},${Math.floor(this[2])},${this.alpha})`;
        }
        else if (format == "rgb") {
            return `rgb(${Math.floor(this[0])},${Math.floor(this[1])},${Math.floor(this[2])})`;
        }
        else {
            return `${this._mode}(${this[0]},${this[1]},${this[2]},${this.alpha})`;
        }
    }
    static RGBtoHSL(rgb, normalizedInput = false, normalizedOutput = false) {
        let [r, g, b] = (!normalizedInput) ? rgb.$normalize() : rgb;
        let max = Math.max(r, g, b);
        let min = Math.min(r, g, b);
        let h = (max + min) / 2;
        let s = h;
        let l = h;
        if (max == min) {
            h = 0;
            s = 0;
        }
        else {
            let d = max - min;
            s = (l > 0.5) ? d / (2 - max - min) : d / (max + min);
            h = 0;
            if (max === r) {
                h = (g - b) / d + ((g < b) ? 6 : 0);
            }
            else if (max === g) {
                h = (b - r) / d + 2;
            }
            else if (max === b) {
                h = (r - g) / d + 4;
            }
        }
        return Color.hsl(((normalizedOutput) ? h / 60 : h * 60), s, l, rgb.alpha);
    }
    static HSLtoRGB(hsl, normalizedInput = false, normalizedOutput = false) {
        let [h, s, l] = hsl;
        if (!normalizedInput)
            h = h / 360;
        if (s == 0)
            return Color.rgb(l * 255, l * 255, l * 255, hsl.alpha);
        let q = (l <= 0.5) ? l * (1 + s) : l + s - (l * s);
        let p = 2 * l - q;
        let convert = (t) => {
            t = (t < 0) ? t + 1 : (t > 1) ? t - 1 : t;
            if (t * 6 < 1) {
                return p + (q - p) * t * 6;
            }
            else if (t * 2 < 1) {
                return q;
            }
            else if (t * 3 < 2) {
                return p + (q - p) * ((2 / 3) - t) * 6;
            }
            else {
                return p;
            }
        };
        let sc = (normalizedOutput) ? 1 : 255;
        return Color.rgb(sc * convert((h + 1 / 3)), sc * convert(h), sc * convert((h - 1 / 3)), hsl.alpha);
    }
    static RGBtoHSB(rgb, normalizedInput = false, normalizedOutput = false) {
        let [r, g, b] = (!normalizedInput) ? rgb.$normalize() : rgb;
        let max = Math.max(r, g, b);
        let min = Math.min(r, g, b);
        let d = max - min;
        let h = 0;
        let s = (max === 0) ? 0 : d / max;
        let v = max;
        if (max != min) {
            if (max === r) {
                h = (g - b) / d + ((g < b) ? 6 : 0);
            }
            else if (max === g) {
                h = (b - r) / d + 2;
            }
            else if (max === b) {
                h = (r - g) / d + 4;
            }
        }
        return Color.hsb(((normalizedOutput) ? h / 60 : h * 60), s, v, rgb.alpha);
    }
    static HSBtoRGB(hsb, normalizedInput = false, normalizedOutput = false) {
        let [h, s, v] = hsb;
        if (!normalizedInput)
            h = h / 360;
        let i = Math.floor(h * 6);
        let f = h * 6 - i;
        let p = v * (1 - s);
        let q = v * (1 - f * s);
        let t = v * (1 - (1 - f) * s);
        let pick = [
            [v, t, p], [q, v, p], [p, v, t],
            [p, q, v], [t, p, v], [v, p, q]
        ];
        let c = pick[i % 6];
        let sc = (normalizedOutput) ? 1 : 255;
        return Color.rgb(sc * c[0], sc * c[1], sc * c[2], hsb.alpha);
    }
    static RGBtoLAB(rgb, normalizedInput = false, normalizedOutput = false) {
        let c = (normalizedInput) ? rgb.$normalize(false) : rgb;
        return Color.XYZtoLAB(Color.RGBtoXYZ(c), false, normalizedOutput);
    }
    static LABtoRGB(lab, normalizedInput = false, normalizedOutput = false) {
        let c = (normalizedInput) ? lab.$normalize(false) : lab;
        return Color.XYZtoRGB(Color.LABtoXYZ(c), false, normalizedOutput);
    }
    static RGBtoLCH(rgb, normalizedInput = false, normalizedOutput = false) {
        let c = (normalizedInput) ? rgb.$normalize(false) : rgb;
        return Color.LABtoLCH(Color.RGBtoLAB(c), false, normalizedOutput);
    }
    static LCHtoRGB(lch, normalizedInput = false, normalizedOutput = false) {
        let c = (normalizedInput) ? lch.$normalize(false) : lch;
        return Color.LABtoRGB(Color.LCHtoLAB(c), false, normalizedOutput);
    }
    static RGBtoLUV(rgb, normalizedInput = false, normalizedOutput = false) {
        let c = (normalizedInput) ? rgb.$normalize(false) : rgb;
        return Color.XYZtoLUV(Color.RGBtoXYZ(c), false, normalizedOutput);
    }
    static LUVtoRGB(luv, normalizedInput = false, normalizedOutput = false) {
        let c = (normalizedInput) ? luv.$normalize(false) : luv;
        return Color.XYZtoRGB(Color.LUVtoXYZ(c), false, normalizedOutput);
    }
    static RGBtoXYZ(rgb, normalizedInput = false, normalizedOutput = false) {
        let c = (!normalizedInput) ? rgb.$normalize() : rgb.clone();
        for (let i = 0; i < 3; i++) {
            c[i] = (c[i] > 0.04045) ? Math.pow((c[i] + 0.055) / 1.055, 2.4) : c[i] / 12.92;
            if (!normalizedOutput)
                c[i] = c[i] * 100;
        }
        let cc = Color.xyz(c[0] * 0.4124564 + c[1] * 0.3575761 + c[2] * 0.1804375, c[0] * 0.2126729 + c[1] * 0.7151522 + c[2] * 0.0721750, c[0] * 0.0193339 + c[1] * 0.1191920 + c[2] * 0.9503041, rgb.alpha);
        return (normalizedOutput) ? cc.normalize() : cc;
    }
    static XYZtoRGB(xyz, normalizedInput = false, normalizedOutput = false) {
        let [x, y, z] = (!normalizedInput) ? xyz.$normalize() : xyz;
        let rgb = [
            x * 3.2404542 + y * -1.5371385 + z * -0.4985314,
            x * -0.9692660 + y * 1.8760108 + z * 0.0415560,
            x * 0.0556434 + y * -0.2040259 + z * 1.0572252
        ];
        for (let i = 0; i < 3; i++) {
            rgb[i] = (rgb[i] < 0) ? 0 : (rgb[i] > 0.0031308) ? (1.055 * Math.pow(rgb[i], 1 / 2.4) - 0.055) : (12.92 * rgb[i]);
            rgb[i] = Math.max(0, Math.min(1, rgb[i]));
            if (!normalizedOutput)
                rgb[i] = Math.round(rgb[i] * 255);
        }
        let cc = Color.rgb(rgb[0], rgb[1], rgb[2], xyz.alpha);
        return (normalizedOutput) ? cc.normalize() : cc;
    }
    static XYZtoLAB(xyz, normalizedInput = false, normalizedOutput = false) {
        let c = (normalizedInput) ? xyz.$normalize(false) : xyz.clone();
        c.divide(Color.D65);
        let fn = (n) => (n > 0.008856) ? Math.pow(n, 1 / 3) : (7.787 * n) + 16 / 116;
        let cy = fn(c[1]);
        let cc = Color.lab((116 * cy) - 16, 500 * (fn(c[0]) - cy), 200 * (cy - fn(c[2])), xyz.alpha);
        return (normalizedOutput) ? cc.normalize() : cc;
    }
    static LABtoXYZ(lab, normalizedInput = false, normalizedOutput = false) {
        let c = (normalizedInput) ? lab.$normalize(false) : lab;
        let y = (c[0] + 16) / 116;
        let x = (c[1] / 500) + y;
        let z = y - c[2] / 200;
        let fn = (n) => {
            let nnn = n * n * n;
            return (nnn > 0.008856) ? nnn : (n - 16 / 116) / 7.787;
        };
        let d = Color.D65;
        let cc = Color.xyz(Math.max(0, d[0] * fn(x)), Math.max(0, d[1] * fn(y)), Math.max(0, d[2] * fn(z)), lab.alpha);
        return (normalizedOutput) ? cc.normalize() : cc;
    }
    static XYZtoLUV(xyz, normalizedInput = false, normalizedOutput = false) {
        let [x, y, z] = (normalizedInput) ? xyz.$normalize(false) : xyz;
        let u = (4 * x) / (x + (15 * y) + (3 * z));
        let v = (9 * y) / (x + (15 * y) + (3 * z));
        y = y / 100;
        y = (y > 0.008856) ? Math.pow(y, 1 / 3) : (7.787 * y + 16 / 116);
        let refU = (4 * Color.D65[0]) / (Color.D65[0] + (15 * Color.D65[1]) + (3 * Color.D65[2]));
        let refV = (9 * Color.D65[1]) / (Color.D65[0] + (15 * Color.D65[1]) + (3 * Color.D65[2]));
        let L = (116 * y) - 16;
        return Color.luv(L, 13 * L * (u - refU), 13 * L * (v - refV), xyz.alpha);
    }
    static LUVtoXYZ(luv, normalizedInput = false, normalizedOutput = false) {
        let [l, u, v] = (normalizedInput) ? luv.$normalize(false) : luv;
        let y = (l + 16) / 116;
        let cubeY = y * y * y;
        y = (cubeY > 0.008856) ? cubeY : (y - 16 / 116) / 7.787;
        let refU = (4 * Color.D65[0]) / (Color.D65[0] + (15 * Color.D65[1]) + (3 * Color.D65[2]));
        let refV = (9 * Color.D65[1]) / (Color.D65[0] + (15 * Color.D65[1]) + (3 * Color.D65[2]));
        u = u / (13 * l) + refU;
        v = v / (13 * l) + refV;
        y = y * 100;
        let x = -1 * (9 * y * u) / ((u - 4) * v - u * v);
        let z = (9 * y - (15 * v * y) - (v * x)) / (3 * v);
        return Color.xyz(x, y, z, luv.alpha);
    }
    static LABtoLCH(lab, normalizedInput = false, normalizedOutput = false) {
        let c = (normalizedInput) ? lab.$normalize(false) : lab;
        let h = Num_1.Geom.toDegree(Num_1.Geom.boundRadian(Math.atan2(c[2], c[1])));
        return Color.lch(c[0], Math.sqrt(c[1] * c[1] + c[2] * c[2]), h, lab.alpha);
    }
    static LCHtoLAB(lch, normalizedInput = false, normalizedOutput = false) {
        let c = (normalizedInput) ? lch.$normalize(false) : lch;
        let rad = Num_1.Geom.toRadian(c[2]);
        return Color.lab(c[0], Math.cos(rad) * c[1], Math.sin(rad) * c[1], lch.alpha);
    }
}
exports.Color = Color;
Color.D65 = new Pt_1.Pt(95.047, 100, 108.883, 1);
Color.ranges = {
    rgb: new Pt_1.Group(new Pt_1.Pt(0, 255), new Pt_1.Pt(0, 255), new Pt_1.Pt(0, 255)),
    hsl: new Pt_1.Group(new Pt_1.Pt(0, 360), new Pt_1.Pt(0, 1), new Pt_1.Pt(0, 1)),
    hsb: new Pt_1.Group(new Pt_1.Pt(0, 360), new Pt_1.Pt(0, 1), new Pt_1.Pt(0, 1)),
    lab: new Pt_1.Group(new Pt_1.Pt(0, 100), new Pt_1.Pt(-128, 127), new Pt_1.Pt(-128, 127)),
    lch: new Pt_1.Group(new Pt_1.Pt(0, 100), new Pt_1.Pt(0, 100), new Pt_1.Pt(0, 360)),
    luv: new Pt_1.Group(new Pt_1.Pt(0, 100), new Pt_1.Pt(-134, 220), new Pt_1.Pt(-140, 122)),
    xyz: new Pt_1.Group(new Pt_1.Pt(0, 100), new Pt_1.Pt(0, 100), new Pt_1.Pt(0, 100))
};


/***/ }),

/***/ "./src/Create.ts":
/*!***********************!*\
  !*** ./src/Create.ts ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/*! Source code licensed under Apache License 2.0. Copyright © 2017-current William Ngan and contributors. (https://github.com/williamngan/pts) */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Delaunay = exports.Noise = exports.Create = void 0;
const Pt_1 = __webpack_require__(/*! ./Pt */ "./src/Pt.ts");
const Op_1 = __webpack_require__(/*! ./Op */ "./src/Op.ts");
const Util_1 = __webpack_require__(/*! ./Util */ "./src/Util.ts");
const Num_1 = __webpack_require__(/*! ./Num */ "./src/Num.ts");
const LinearAlgebra_1 = __webpack_require__(/*! ./LinearAlgebra */ "./src/LinearAlgebra.ts");
class Create {
    static distributeRandom(bound, count, dimensions = 2) {
        let pts = new Pt_1.Group();
        for (let i = 0; i < count; i++) {
            let p = [bound.x + Math.random() * bound.width];
            if (dimensions > 1)
                p.push(bound.y + Math.random() * bound.height);
            if (dimensions > 2)
                p.push(bound.z + Math.random() * bound.depth);
            pts.push(new Pt_1.Pt(p));
        }
        return pts;
    }
    static distributeLinear(line, count) {
        let _line = Util_1.Util.iterToArray(line);
        let ln = Op_1.Line.subpoints(_line, count - 2);
        ln.unshift(_line[0]);
        ln.push(_line[_line.length - 1]);
        return ln;
    }
    static gridPts(bound, columns, rows, orientation = [0.5, 0.5]) {
        if (columns === 0 || rows === 0)
            throw new Error("grid columns and rows cannot be 0");
        let unit = bound.size.$subtract(1).$divide(columns, rows);
        let offset = unit.$multiply(orientation);
        let g = new Pt_1.Group();
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < columns; c++) {
                g.push(bound.topLeft.$add(unit.$multiply(c, r)).add(offset));
            }
        }
        return g;
    }
    static gridCells(bound, columns, rows) {
        if (columns === 0 || rows === 0)
            throw new Error("grid columns and rows cannot be 0");
        let unit = bound.size.$subtract(1).divide(columns, rows);
        let g = [];
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < columns; c++) {
                g.push(new Pt_1.Group(bound.topLeft.$add(unit.$multiply(c, r)), bound.topLeft.$add(unit.$multiply(c, r).add(unit))));
            }
        }
        return g;
    }
    static radialPts(center, radius, count, angleOffset = -Util_1.Const.half_pi) {
        let g = new Pt_1.Group();
        let a = Util_1.Const.two_pi / count;
        for (let i = 0; i < count; i++) {
            g.push(new Pt_1.Pt(center).toAngle(a * i + angleOffset, radius, true));
        }
        return g;
    }
    static noisePts(pts, dx = 0.01, dy = 0.01, rows = 0, columns = 0) {
        let seed = Math.random();
        let g = new Pt_1.Group();
        let i = 0;
        for (let p of pts) {
            let np = new Noise(p);
            let r = (rows && rows > 0) ? Math.floor(i / rows) : i;
            let c = (columns && columns > 0) ? i % columns : i;
            np.initNoise(dx * c, dy * r);
            np.seed(seed);
            g.push(np);
            i++;
        }
        return g;
    }
    static delaunay(pts) {
        return Delaunay.from(pts);
    }
}
exports.Create = Create;
const __noise_grad3 = [
    [1, 1, 0], [-1, 1, 0], [1, -1, 0], [-1, -1, 0],
    [1, 0, 1], [-1, 0, 1], [1, 0, -1], [-1, 0, -1],
    [0, 1, 1], [0, -1, 1], [0, 1, -1], [0, -1, -1]
];
const __noise_permTable = [151, 160, 137, 91, 90, 15,
    131, 13, 201, 95, 96, 53, 194, 233, 7, 225, 140, 36, 103, 30, 69, 142, 8, 99, 37, 240, 21, 10, 23,
    190, 6, 148, 247, 120, 234, 75, 0, 26, 197, 62, 94, 252, 219, 203, 117, 35, 11, 32, 57, 177, 33,
    88, 237, 149, 56, 87, 174, 20, 125, 136, 171, 168, 68, 175, 74, 165, 71, 134, 139, 48, 27, 166,
    77, 146, 158, 231, 83, 111, 229, 122, 60, 211, 133, 230, 220, 105, 92, 41, 55, 46, 245, 40, 244,
    102, 143, 54, 65, 25, 63, 161, 1, 216, 80, 73, 209, 76, 132, 187, 208, 89, 18, 169, 200, 196,
    135, 130, 116, 188, 159, 86, 164, 100, 109, 198, 173, 186, 3, 64, 52, 217, 226, 250, 124, 123,
    5, 202, 38, 147, 118, 126, 255, 82, 85, 212, 207, 206, 59, 227, 47, 16, 58, 17, 182, 189, 28, 42,
    223, 183, 170, 213, 119, 248, 152, 2, 44, 154, 163, 70, 221, 153, 101, 155, 167, 43, 172, 9,
    129, 22, 39, 253, 9, 98, 108, 110, 79, 113, 224, 232, 178, 185, 112, 104, 218, 246, 97, 228,
    251, 34, 242, 193, 238, 210, 144, 12, 191, 179, 162, 241, 81, 51, 145, 235, 249, 14, 239, 107,
    49, 192, 214, 31, 181, 199, 106, 157, 184, 84, 204, 176, 115, 121, 50, 45, 127, 4, 150, 254,
    138, 236, 205, 93, 222, 114, 67, 29, 24, 72, 243, 141, 128, 195, 78, 66, 215, 61, 156, 180
];
class Noise extends Pt_1.Pt {
    constructor(...args) {
        super(...args);
        this.perm = [];
        this._n = new Pt_1.Pt(0.01, 0.01);
        this.perm = __noise_permTable.concat(__noise_permTable);
    }
    initNoise(...args) {
        this._n = new Pt_1.Pt(...args);
        return this;
    }
    step(x = 0, y = 0) {
        this._n.add(x, y);
        return this;
    }
    seed(s) {
        if (s > 0 && s < 1)
            s *= 65536;
        s = Math.floor(s);
        if (s < 256)
            s |= s << 8;
        for (let i = 0; i < 255; i++) {
            let v = (i & 1) ? __noise_permTable[i] ^ (s & 255) : __noise_permTable[i] ^ ((s >> 8) & 255);
            this.perm[i] = this.perm[i + 256] = v;
        }
        return this;
    }
    noise2D() {
        let i = Math.max(0, Math.floor(this._n[0])) % 255;
        let j = Math.max(0, Math.floor(this._n[1])) % 255;
        let x = (this._n[0] % 255) - i;
        let y = (this._n[1] % 255) - j;
        let n00 = LinearAlgebra_1.Vec.dot(__noise_grad3[(i + this.perm[j]) % 12], [x, y, 0]);
        let n01 = LinearAlgebra_1.Vec.dot(__noise_grad3[(i + this.perm[j + 1]) % 12], [x, y - 1, 0]);
        let n10 = LinearAlgebra_1.Vec.dot(__noise_grad3[(i + 1 + this.perm[j]) % 12], [x - 1, y, 0]);
        let n11 = LinearAlgebra_1.Vec.dot(__noise_grad3[(i + 1 + this.perm[j + 1]) % 12], [x - 1, y - 1, 0]);
        let _fade = (f) => f * f * f * (f * (f * 6 - 15) + 10);
        let tx = _fade(x);
        return Num_1.Num.lerp(Num_1.Num.lerp(n00, n10, tx), Num_1.Num.lerp(n01, n11, tx), _fade(y));
    }
}
exports.Noise = Noise;
class Delaunay extends Pt_1.Group {
    constructor() {
        super(...arguments);
        this._mesh = [];
    }
    delaunay(triangleOnly = true) {
        if (this.length < 3)
            return [];
        this._mesh = [];
        let n = this.length;
        let indices = [];
        for (let i = 0; i < n; i++)
            indices[i] = i;
        indices.sort((i, j) => this[j][0] - this[i][0]);
        let pts = this.slice();
        let st = this._superTriangle();
        pts = pts.concat(st);
        let opened = [this._circum(n, n + 1, n + 2, st)];
        let closed = [];
        let tris = [];
        for (let i = 0, len = indices.length; i < len; i++) {
            let c = indices[i];
            let edges = [];
            let j = opened.length;
            if (!this._mesh[c])
                this._mesh[c] = {};
            while (j--) {
                let circum = opened[j];
                let radius = circum.circle[1][0];
                let d = pts[c].$subtract(circum.circle[0]);
                if (d[0] > 0 && d[0] * d[0] > radius * radius) {
                    closed.push(circum);
                    tris.push(circum.triangle);
                    opened.splice(j, 1);
                    continue;
                }
                if (d[0] * d[0] + d[1] * d[1] - radius * radius > Util_1.Const.epsilon) {
                    continue;
                }
                edges.push(circum.i, circum.j, circum.j, circum.k, circum.k, circum.i);
                opened.splice(j, 1);
            }
            Delaunay._dedupe(edges);
            j = edges.length;
            while (j > 1) {
                opened.push(this._circum(edges[--j], edges[--j], c, false, pts));
            }
        }
        for (let i = 0, len = opened.length; i < len; i++) {
            let o = opened[i];
            if (o.i < n && o.j < n && o.k < n) {
                closed.push(o);
                tris.push(o.triangle);
                this._cache(o);
            }
        }
        return (triangleOnly) ? tris : closed;
    }
    voronoi() {
        let vs = [];
        let n = this._mesh;
        for (let i = 0, len = n.length; i < len; i++) {
            vs.push(this.neighborPts(i, true));
        }
        return vs;
    }
    mesh() {
        return this._mesh;
    }
    neighborPts(i, sort = false) {
        let cs = new Pt_1.Group();
        let n = this._mesh;
        for (let k in n[i]) {
            if (n[i].hasOwnProperty(k))
                cs.push(n[i][k].circle[0]);
        }
        return (sort) ? Num_1.Geom.sortEdges(cs) : cs;
    }
    neighbors(i) {
        let cs = [];
        let n = this._mesh;
        for (let k in n[i]) {
            if (n[i].hasOwnProperty(k))
                cs.push(n[i][k]);
        }
        return cs;
    }
    _cache(o) {
        this._mesh[o.i][`${Math.min(o.j, o.k)}-${Math.max(o.j, o.k)}`] = o;
        this._mesh[o.j][`${Math.min(o.i, o.k)}-${Math.max(o.i, o.k)}`] = o;
        this._mesh[o.k][`${Math.min(o.i, o.j)}-${Math.max(o.i, o.j)}`] = o;
    }
    _superTriangle() {
        let minPt = this[0];
        let maxPt = this[0];
        for (let i = 1, len = this.length; i < len; i++) {
            minPt = minPt.$min(this[i]);
            maxPt = maxPt.$max(this[i]);
        }
        let d = maxPt.$subtract(minPt);
        let mid = minPt.$add(maxPt).divide(2);
        let dmax = Math.max(d[0], d[1]);
        return new Pt_1.Group(mid.$subtract(20 * dmax, dmax), mid.$add(0, 20 * dmax), mid.$add(20 * dmax, -dmax));
    }
    _triangle(i, j, k, pts = this) {
        return new Pt_1.Group(pts[i], pts[j], pts[k]);
    }
    _circum(i, j, k, tri, pts = this) {
        let t = tri || this._triangle(i, j, k, pts);
        return {
            i: i,
            j: j,
            k: k,
            triangle: t,
            circle: Op_1.Triangle.circumcircle(t)
        };
    }
    static _dedupe(edges) {
        let j = edges.length;
        while (j > 1) {
            let b = edges[--j];
            let a = edges[--j];
            let i = j;
            while (i > 1) {
                let n = edges[--i];
                let m = edges[--i];
                if ((a == m && b == n) || (a == n && b == m)) {
                    edges.splice(j, 2);
                    edges.splice(i, 2);
                    break;
                }
            }
        }
        return edges;
    }
}
exports.Delaunay = Delaunay;


/***/ }),

/***/ "./src/Dom.ts":
/*!********************!*\
  !*** ./src/Dom.ts ***!
  \********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/*! Source code licensed under Apache License 2.0. Copyright © 2017-current William Ngan and contributors. (https://github.com/williamngan/pts) */
Object.defineProperty(exports, "__esModule", { value: true });
exports.HTMLForm = exports.HTMLSpace = exports.DOMSpace = void 0;
const Space_1 = __webpack_require__(/*! ./Space */ "./src/Space.ts");
const Form_1 = __webpack_require__(/*! ./Form */ "./src/Form.ts");
const Util_1 = __webpack_require__(/*! ./Util */ "./src/Util.ts");
const Pt_1 = __webpack_require__(/*! ./Pt */ "./src/Pt.ts");
class DOMSpace extends Space_1.MultiTouchSpace {
    constructor(elem, callback) {
        super();
        this.id = "domspace";
        this._autoResize = true;
        this._bgcolor = "#e1e9f0";
        this._css = {};
        var _selector = null;
        var _existed = false;
        this.id = "pts";
        if (elem instanceof Element) {
            _selector = elem;
            this.id = "pts_existing_space";
        }
        else {
            _selector = document.querySelector(elem);
            _existed = true;
            this.id = elem.substr(1);
        }
        if (!_selector) {
            this._container = DOMSpace.createElement("div", "pts_container");
            this._canvas = DOMSpace.createElement("div", "pts_element");
            this._container.appendChild(this._canvas);
            document.body.appendChild(this._container);
            _existed = false;
        }
        else {
            this._canvas = _selector;
            this._container = _selector.parentElement;
        }
        setTimeout(this._ready.bind(this, callback), 50);
    }
    static createElement(elem = "div", id, appendTo) {
        let d = document.createElement(elem);
        if (id)
            d.setAttribute("id", id);
        if (appendTo && appendTo.appendChild)
            appendTo.appendChild(d);
        return d;
    }
    _ready(callback) {
        if (!this._container)
            throw new Error(`Cannot initiate #${this.id} element`);
        this._isReady = true;
        this._resizeHandler(null);
        this.clear(this._bgcolor);
        this._canvas.dispatchEvent(new Event("ready"));
        for (let k in this.players) {
            if (this.players.hasOwnProperty(k)) {
                if (this.players[k].start)
                    this.players[k].start(this.bound.clone(), this);
            }
        }
        this._pointer = this.center;
        this.refresh(false);
        if (callback)
            callback(this.bound, this._canvas);
    }
    setup(opt) {
        if (opt.bgcolor) {
            this._bgcolor = opt.bgcolor;
        }
        this.autoResize = (opt.resize != undefined) ? opt.resize : false;
        return this;
    }
    getForm() {
        return null;
    }
    set autoResize(auto) {
        this._autoResize = auto;
        if (auto) {
            window.addEventListener('resize', this._resizeHandler.bind(this));
        }
        else {
            delete this._css['width'];
            delete this._css['height'];
            window.removeEventListener('resize', this._resizeHandler.bind(this));
        }
    }
    get autoResize() { return this._autoResize; }
    resize(b, evt) {
        this.bound = b;
        this.styles({ width: `${b.width}px`, height: `${b.height}px` }, true);
        for (let k in this.players) {
            if (this.players.hasOwnProperty(k)) {
                let p = this.players[k];
                if (p.resize)
                    p.resize(this.bound, evt);
            }
        }
        return this;
    }
    _resizeHandler(evt) {
        let b = Pt_1.Bound.fromBoundingRect(this._container.getBoundingClientRect());
        if (this._autoResize) {
            this.styles({ width: "100%", height: "100%" }, true);
        }
        else {
            this.styles({ width: `${b.width}px`, height: `${b.height}px` }, true);
        }
        this.resize(b, evt);
    }
    get element() {
        return this._canvas;
    }
    get parent() {
        return this._container;
    }
    get ready() { return this._isReady; }
    clear(bg) {
        if (bg)
            this.background = bg;
        this._canvas.innerHTML = "";
        return this;
    }
    set background(bg) {
        this._bgcolor = bg;
        this._container.style.backgroundColor = this._bgcolor;
    }
    get background() { return this._bgcolor; }
    style(key, val, update = false) {
        this._css[key] = val;
        if (update)
            this._canvas.style[key] = val;
        return this;
    }
    styles(styles, update = false) {
        for (let k in styles) {
            if (styles.hasOwnProperty(k))
                this.style(k, styles[k], update);
        }
        return this;
    }
    static setAttr(elem, data) {
        for (let k in data) {
            if (data.hasOwnProperty(k)) {
                elem.setAttribute(k, data[k]);
            }
        }
        return elem;
    }
    static getInlineStyles(data) {
        let str = "";
        for (let k in data) {
            if (data.hasOwnProperty(k)) {
                if (data[k])
                    str += `${k}: ${data[k]}; `;
            }
        }
        return str;
    }
    dispose() {
        window.removeEventListener('resize', this._resizeHandler.bind(this));
        this.stop();
        this.removeAll();
        return this;
    }
}
exports.DOMSpace = DOMSpace;
class HTMLSpace extends DOMSpace {
    getForm() {
        return new HTMLForm(this);
    }
    static htmlElement(parent, name, id, autoClass = true) {
        if (!parent || !parent.appendChild)
            throw new Error("parent is not a valid DOM element");
        let elem = document.querySelector(`#${id}`);
        if (!elem) {
            elem = document.createElement(name);
            elem.setAttribute("id", id);
            if (autoClass)
                elem.setAttribute("class", id.substring(0, id.indexOf("-")));
            parent.appendChild(elem);
        }
        return elem;
    }
    remove(player) {
        let temp = this._container.querySelectorAll("." + HTMLForm.scopeID(player));
        temp.forEach((el) => {
            el.parentNode.removeChild(el);
        });
        return super.remove(player);
    }
    removeAll() {
        this._container.innerHTML = "";
        return super.removeAll();
    }
}
exports.HTMLSpace = HTMLSpace;
class HTMLForm extends Form_1.VisualForm {
    constructor(space) {
        super();
        this._style = {
            "filled": true,
            "stroked": true,
            "background": "#f03",
            "border-color": "#fff",
            "color": "#000",
            "border-width": "1px",
            "border-radius": "0",
            "border-style": "solid",
            "opacity": 1,
            "position": "absolute",
            "top": 0,
            "left": 0,
            "width": 0,
            "height": 0
        };
        this._ctx = {
            group: null,
            groupID: "pts",
            groupCount: 0,
            currentID: "pts0",
            currentClass: "",
            style: {},
        };
        this._ready = false;
        this._space = space;
        this._space.add({ start: () => {
                this._ctx.group = this._space.element;
                this._ctx.groupID = "pts_dom_" + (HTMLForm.groupID++);
                this._ctx.style = Object.assign({}, this._style);
                this._ready = true;
            } });
    }
    get space() { return this._space; }
    styleTo(k, v, unit = '') {
        if (this._ctx.style[k] === undefined)
            throw new Error(`${k} style property doesn't exist`);
        this._ctx.style[k] = `${v}${unit}`;
    }
    alpha(a) {
        this.styleTo("opacity", a);
        return this;
    }
    fill(c) {
        if (typeof c == "boolean") {
            this.styleTo("filled", c);
            if (!c)
                this.styleTo("background", "transparent");
        }
        else {
            this.styleTo("filled", true);
            this.styleTo("background", c);
        }
        return this;
    }
    stroke(c, width, linejoin, linecap) {
        if (typeof c == "boolean") {
            this.styleTo("stroked", c);
            if (!c)
                this.styleTo("border-width", 0);
        }
        else {
            this.styleTo("stroked", true);
            this.styleTo("border-color", c);
            this.styleTo("border-width", (width || 1) + "px");
        }
        return this;
    }
    fillText(c) {
        this.styleTo("color", c);
        return this;
    }
    cls(c) {
        if (typeof c == "boolean") {
            this._ctx.currentClass = "";
        }
        else {
            this._ctx.currentClass = c;
        }
        return this;
    }
    font(sizeOrFont, weight, style, lineHeight, family) {
        if (typeof sizeOrFont == "number") {
            this._font.size = sizeOrFont;
            if (family)
                this._font.face = family;
            if (weight)
                this._font.weight = weight;
            if (style)
                this._font.style = style;
            if (lineHeight)
                this._font.lineHeight = lineHeight;
        }
        else {
            this._font = sizeOrFont;
        }
        this._ctx.style['font'] = this._font.value;
        return this;
    }
    reset() {
        this._ctx.style = Object.assign({}, this._style);
        this._font = new Form_1.Font(10, "sans-serif");
        this._ctx.style['font'] = this._font.value;
        return this;
    }
    updateScope(group_id, group) {
        this._ctx.group = group;
        this._ctx.groupID = group_id;
        this._ctx.groupCount = 0;
        this.nextID();
        return this._ctx;
    }
    scope(item) {
        if (!item || item.animateID == null)
            throw new Error("item not defined or not yet added to Space");
        return this.updateScope(HTMLForm.scopeID(item), this.space.element);
    }
    nextID() {
        this._ctx.groupCount++;
        this._ctx.currentID = `${this._ctx.groupID}-${this._ctx.groupCount}`;
        return this._ctx.currentID;
    }
    static getID(ctx) {
        return ctx.currentID || `p-${HTMLForm.domID++}`;
    }
    static scopeID(item) {
        return `item-${item.animateID}`;
    }
    static style(elem, styles) {
        let st = [];
        if (!styles["filled"])
            st.push("background: none");
        if (!styles["stroked"])
            st.push("border: none");
        for (let k in styles) {
            if (styles.hasOwnProperty(k) && k != "filled" && k != "stroked") {
                let v = styles[k];
                if (v) {
                    if (!styles["filled"] && k.indexOf('background') === 0) {
                        continue;
                    }
                    else if (!styles["stroked"] && k.indexOf('border-width') === 0) {
                        continue;
                    }
                    else {
                        st.push(`${k}: ${v}`);
                    }
                }
            }
        }
        return HTMLSpace.setAttr(elem, { style: st.join(";") });
    }
    static rectStyle(ctx, pt, size) {
        ctx.style["left"] = pt[0] + "px";
        ctx.style["top"] = pt[1] + "px";
        ctx.style["width"] = size[0] + "px";
        ctx.style["height"] = size[1] + "px";
        return ctx;
    }
    static textStyle(ctx, pt) {
        ctx.style["left"] = pt[0] + "px";
        ctx.style["top"] = pt[1] + "px";
        return ctx;
    }
    static point(ctx, pt, radius = 5, shape = "square") {
        if (shape === "circle") {
            return HTMLForm.circle(ctx, pt, radius);
        }
        else {
            return HTMLForm.square(ctx, pt, radius);
        }
    }
    point(pt, radius = 5, shape = "square") {
        this.nextID();
        if (shape == "circle")
            this.styleTo("border-radius", "100%");
        HTMLForm.point(this._ctx, pt, radius, shape);
        return this;
    }
    static circle(ctx, pt, radius = 10) {
        let elem = HTMLSpace.htmlElement(ctx.group, "div", HTMLForm.getID(ctx));
        HTMLSpace.setAttr(elem, { class: `pts-form pts-circle ${ctx.currentClass}` });
        HTMLForm.rectStyle(ctx, new Pt_1.Pt(pt).$subtract(radius), new Pt_1.Pt(radius * 2, radius * 2));
        HTMLForm.style(elem, ctx.style);
        return elem;
    }
    circle(pts) {
        this.nextID();
        this.styleTo("border-radius", "100%");
        HTMLForm.circle(this._ctx, pts[0], pts[1][0]);
        return this;
    }
    static square(ctx, pt, halfsize) {
        let elem = HTMLSpace.htmlElement(ctx.group, "div", HTMLForm.getID(ctx));
        HTMLSpace.setAttr(elem, { class: `pts-form pts-square ${ctx.currentClass}` });
        HTMLForm.rectStyle(ctx, new Pt_1.Pt(pt).$subtract(halfsize), new Pt_1.Pt(halfsize * 2, halfsize * 2));
        HTMLForm.style(elem, ctx.style);
        return elem;
    }
    square(pt, halfsize) {
        this.nextID();
        HTMLForm.square(this._ctx, pt, halfsize);
        return this;
    }
    static rect(ctx, pts) {
        let p = Util_1.Util.iterToArray(pts);
        if (!Util_1.Util.arrayCheck(p))
            return;
        let elem = HTMLSpace.htmlElement(ctx.group, "div", HTMLForm.getID(ctx));
        HTMLSpace.setAttr(elem, { class: `pts-form pts-rect ${ctx.currentClass}` });
        HTMLForm.rectStyle(ctx, p[0], p[1]);
        HTMLForm.style(elem, ctx.style);
        return elem;
    }
    rect(pts) {
        this.nextID();
        this.styleTo("border-radius", "0");
        HTMLForm.rect(this._ctx, pts);
        return this;
    }
    static text(ctx, pt, txt) {
        let elem = HTMLSpace.htmlElement(ctx.group, "div", HTMLForm.getID(ctx));
        HTMLSpace.setAttr(elem, { class: `pts-form pts-text ${ctx.currentClass}` });
        elem.textContent = txt;
        HTMLForm.textStyle(ctx, pt);
        HTMLForm.style(elem, ctx.style);
        return elem;
    }
    text(pt, txt) {
        this.nextID();
        HTMLForm.text(this._ctx, pt, txt);
        return this;
    }
    log(txt) {
        this.fill("#000").stroke("#fff", 0.5).text([10, 14], txt);
        return this;
    }
    arc(pt, radius, startAngle, endAngle, cc) {
        Util_1.Util.warn("arc is not implemented in HTMLForm");
        return this;
    }
    line(pts) {
        Util_1.Util.warn("line is not implemented in HTMLForm");
        return this;
    }
    polygon(pts) {
        Util_1.Util.warn("polygon is not implemented in HTMLForm");
        return this;
    }
}
exports.HTMLForm = HTMLForm;
HTMLForm.groupID = 0;
HTMLForm.domID = 0;


/***/ }),

/***/ "./src/Form.ts":
/*!*********************!*\
  !*** ./src/Form.ts ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/*! Source code licensed under Apache License 2.0. Copyright © 2017-current William Ngan and contributors. (https://github.com/williamngan/pts) */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Font = exports.VisualForm = exports.Form = void 0;
class Form {
    constructor() {
        this._ready = false;
    }
    get ready() { return this._ready; }
}
exports.Form = Form;
class VisualForm extends Form {
    constructor() {
        super(...arguments);
        this._filled = true;
        this._stroked = true;
        this._font = new Font(14, "sans-serif");
    }
    get filled() { return this._filled; }
    set filled(b) { this._filled = b; }
    get stroked() { return this._stroked; }
    set stroked(b) { this._stroked = b; }
    get currentFont() { return this._font; }
    _multiple(groups, shape, ...rest) {
        if (!groups)
            return this;
        for (let i = 0, len = groups.length; i < len; i++) {
            this[shape](groups[i], ...rest);
        }
        return this;
    }
    alpha(a) {
        return this;
    }
    fill(c) {
        return this;
    }
    fillOnly(c) {
        this.stroke(false);
        return this.fill(c);
    }
    stroke(c, width, linejoin, linecap) {
        return this;
    }
    strokeOnly(c, width, linejoin, linecap) {
        this.fill(false);
        return this.stroke(c, width, linejoin, linecap);
    }
    points(pts, radius, shape) {
        if (!pts)
            return;
        for (let i = 0, len = pts.length; i < len; i++) {
            this.point(pts[i], radius, shape);
        }
        return this;
    }
    circles(groups) {
        return this._multiple(groups, "circle");
    }
    squares(groups) {
        return this._multiple(groups, "square");
    }
    lines(groups) {
        return this._multiple(groups, "line");
    }
    polygons(groups) {
        return this._multiple(groups, "polygon");
    }
    rects(groups) {
        return this._multiple(groups, "rect");
    }
}
exports.VisualForm = VisualForm;
class Font {
    constructor(size = 12, face = "sans-serif", weight = "", style = "", lineHeight = 1.5) {
        this.size = size;
        this.face = face;
        this.style = style;
        this.weight = weight;
        this.lineHeight = lineHeight;
    }
    get value() { return `${this.style} ${this.weight} ${this.size}px/${this.lineHeight} ${this.face}`; }
    toString() { return this.value; }
}
exports.Font = Font;


/***/ }),

/***/ "./src/Image.ts":
/*!**********************!*\
  !*** ./src/Image.ts ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.Img = void 0;
const Pt_1 = __webpack_require__(/*! ./Pt */ "./src/Pt.ts");
class Img {
    constructor(editable = false, pixelScale = 1, crossOrigin) {
        this._scale = 1;
        this._loaded = false;
        this._editable = editable;
        this._scale = pixelScale;
        this._img = new Image();
        if (crossOrigin)
            this._img.crossOrigin = "Anonymous";
    }
    static load(src, editable = false, pixelScale = 1, ready) {
        let img = new Img(editable, pixelScale);
        img.load(src).then(res => {
            if (ready)
                ready(res);
        });
        return img;
    }
    load(src) {
        return new Promise((resolve, reject) => {
            this._img.src = src;
            this._img.onload = () => {
                if (this._editable) {
                    if (!this._cv)
                        this._cv = document.createElement("canvas");
                    this._drawToScale(this._scale, this._img);
                    this._data = this._ctx.getImageData(0, 0, this._cv.width, this._cv.height);
                }
                this._loaded = true;
                resolve(this);
            };
            this._img.onerror = (evt) => {
                reject(evt);
            };
        });
    }
    _drawToScale(canvasScale, img) {
        const cms = (typeof canvasScale === 'number') ? [canvasScale, canvasScale] : canvasScale;
        const nw = img.width;
        const nh = img.height;
        this._cv.width = nw * cms[0];
        this._cv.height = nh * cms[1];
        this._ctx = this._cv.getContext('2d');
        if (img)
            this._ctx.drawImage(img, 0, 0, nw, nh, 0, 0, this._cv.width, this._cv.height);
    }
    bitmap(size) {
        const w = (size) ? size[0] : this._cv.width;
        const h = (size) ? size[1] : this._cv.height;
        return createImageBitmap(this._cv, 0, 0, w, h);
    }
    sync() {
        if (this._scale !== 1) {
            this.bitmap().then(b => {
                this._drawToScale(1 / this._scale, b);
                this.load(this.toBase64());
            });
        }
        else {
            this._img.src = this.toBase64();
        }
    }
    pixel(p, rescale = true) {
        const s = (typeof rescale == 'number') ? rescale : (rescale ? this._scale : 1);
        return Img.getPixel(this._data, [p[0] * s, p[1] * s]);
    }
    static getPixel(imgData, p) {
        const no = new Pt_1.Pt(0, 0, 0, 0);
        if (p[0] >= imgData.width || p[1] >= imgData.height)
            return no;
        const i = Math.floor(p[1]) * (imgData.width * 4) + (Math.floor(p[0]) * 4);
        const d = imgData.data;
        if (i >= d.length - 4)
            return no;
        return new Pt_1.Pt(d[i], d[i + 1], d[i + 2], d[i + 3]);
    }
    resize(sizeOrScale, asScale = false) {
        let s = asScale ? sizeOrScale : [sizeOrScale[0] / this._img.naturalWidth, sizeOrScale[1] / this._img.naturalHeight];
        this._drawToScale(s, this._img);
        this._data = this._ctx.getImageData(0, 0, this._cv.width, this._cv.height);
        return this;
    }
    crop(box) {
        let p = box.topLeft.scale(this._scale);
        let s = box.size.scale(this._scale);
        return this._ctx.getImageData(p.x, p.y, s.x, s.y);
    }
    filter(css) {
        this._ctx.filter = css;
        this._ctx.drawImage(this._cv, 0, 0);
        this._ctx.filter = "none";
        return this;
    }
    cleanup() {
        if (this._cv)
            this._cv.remove();
        if (this._img)
            this._img.remove();
        this._data = null;
    }
    static fromBlob(blob, editable = false, pixelScale = 1) {
        let url = URL.createObjectURL(blob);
        return new Img(editable, pixelScale).load(url);
    }
    static imageDataToBlob(data) {
        return new Promise(function (resolve) {
            let cv = document.createElement("canvas");
            cv.width = data.width;
            cv.height = data.height;
            cv.getContext("2d").putImageData(data, 0, 0);
            cv.toBlob(blob => {
                resolve(blob);
                cv.remove();
            });
        });
    }
    toBase64() {
        return this._cv.toDataURL();
    }
    toBlob() {
        return new Promise((resolve) => {
            this._cv.toBlob(blob => resolve(blob));
        });
    }
    get current() {
        return this._editable ? this._cv : this._img;
    }
    get image() {
        return this._img;
    }
    get canvas() {
        return this._cv;
    }
    get data() {
        return this._data;
    }
    get ctx() {
        return this._ctx;
    }
    get loaded() {
        return this._loaded;
    }
    get pixelScale() {
        return this._scale;
    }
    get imageSize() {
        return new Pt_1.Pt(this._img.width, this._img.height);
    }
    get canvasSize() {
        return new Pt_1.Pt(this._cv.width, this._cv.height);
    }
}
exports.Img = Img;


/***/ }),

/***/ "./src/LinearAlgebra.ts":
/*!******************************!*\
  !*** ./src/LinearAlgebra.ts ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/*! Source code licensed under Apache License 2.0. Copyright © 2017-current William Ngan and contributors. (https://github.com/williamngan/pts) */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Mat = exports.Vec = void 0;
const Pt_1 = __webpack_require__(/*! ./Pt */ "./src/Pt.ts");
const Op_1 = __webpack_require__(/*! ./Op */ "./src/Op.ts");
class Vec {
    static add(a, b) {
        if (typeof b == "number") {
            for (let i = 0, len = a.length; i < len; i++)
                a[i] += b;
        }
        else {
            for (let i = 0, len = a.length; i < len; i++)
                a[i] += b[i] || 0;
        }
        return a;
    }
    static subtract(a, b) {
        if (typeof b == "number") {
            for (let i = 0, len = a.length; i < len; i++)
                a[i] -= b;
        }
        else {
            for (let i = 0, len = a.length; i < len; i++)
                a[i] -= b[i] || 0;
        }
        return a;
    }
    static multiply(a, b) {
        if (typeof b == "number") {
            for (let i = 0, len = a.length; i < len; i++)
                a[i] *= b;
        }
        else {
            if (a.length != b.length) {
                throw new Error(`Cannot do element-wise multiply since the array lengths don't match: ${a.toString()} multiply-with ${b.toString()}`);
            }
            for (let i = 0, len = a.length; i < len; i++)
                a[i] *= b[i];
        }
        return a;
    }
    static divide(a, b) {
        if (typeof b == "number") {
            if (b === 0)
                throw new Error("Cannot divide by zero");
            for (let i = 0, len = a.length; i < len; i++)
                a[i] /= b;
        }
        else {
            if (a.length != b.length) {
                throw new Error(`Cannot do element-wise divide since the array lengths don't match. ${a.toString()} divide-by ${b.toString()}`);
            }
            for (let i = 0, len = a.length; i < len; i++)
                a[i] /= b[i];
        }
        return a;
    }
    static dot(a, b) {
        if (a.length != b.length)
            throw new Error("Array lengths don't match");
        let d = 0;
        for (let i = 0, len = a.length; i < len; i++) {
            d += a[i] * b[i];
        }
        return d;
    }
    static cross2D(a, b) {
        return a[0] * b[1] - a[1] * b[0];
    }
    static cross(a, b) {
        return new Pt_1.Pt((a[1] * b[2] - a[2] * b[1]), (a[2] * b[0] - a[0] * b[2]), (a[0] * b[1] - a[1] * b[0]));
    }
    static magnitude(a) {
        return Math.sqrt(Vec.dot(a, a));
    }
    static unit(a, magnitude = undefined) {
        let m = (magnitude === undefined) ? Vec.magnitude(a) : magnitude;
        if (m === 0)
            return Pt_1.Pt.make(a.length);
        return Vec.divide(a, m);
    }
    static abs(a) {
        return Vec.map(a, Math.abs);
    }
    static floor(a) {
        return Vec.map(a, Math.floor);
    }
    static ceil(a) {
        return Vec.map(a, Math.ceil);
    }
    static round(a) {
        return Vec.map(a, Math.round);
    }
    static max(a) {
        let m = Number.MIN_VALUE;
        let index = 0;
        for (let i = 0, len = a.length; i < len; i++) {
            m = Math.max(m, a[i]);
            if (m === a[i])
                index = i;
        }
        return { value: m, index: index };
    }
    static min(a) {
        let m = Number.MAX_VALUE;
        let index = 0;
        for (let i = 0, len = a.length; i < len; i++) {
            m = Math.min(m, a[i]);
            if (m === a[i])
                index = i;
        }
        return { value: m, index: index };
    }
    static sum(a) {
        let s = 0;
        for (let i = 0, len = a.length; i < len; i++)
            s += a[i];
        return s;
    }
    static map(a, fn) {
        for (let i = 0, len = a.length; i < len; i++) {
            a[i] = fn(a[i], i, a);
        }
        return a;
    }
}
exports.Vec = Vec;
class Mat {
    static add(a, b) {
        if (typeof b != "number") {
            if (a[0].length != b[0].length)
                throw new Error("Cannot add matrix if rows' and columns' size don't match.");
            if (a.length != b.length)
                throw new Error("Cannot add matrix if rows' and columns' size don't match.");
        }
        let g = new Pt_1.Group();
        let isNum = typeof b == "number";
        for (let i = 0, len = a.length; i < len; i++) {
            g.push(a[i].$add((isNum) ? b : b[i]));
        }
        return g;
    }
    static multiply(a, b, transposed = false, elementwise = false) {
        let g = new Pt_1.Group();
        if (typeof b != "number") {
            if (elementwise) {
                if (a.length != b.length)
                    throw new Error("Cannot multiply matrix element-wise because the matrices' sizes don't match.");
                for (let ai = 0, alen = a.length; ai < alen; ai++) {
                    g.push(a[ai].$multiply(b[ai]));
                }
            }
            else {
                if (!transposed && a[0].length != b.length)
                    throw new Error("Cannot multiply matrix if rows in matrix-a don't match columns in matrix-b.");
                if (transposed && a[0].length != b[0].length)
                    throw new Error("Cannot multiply matrix if transposed and the columns in both matrices don't match.");
                if (!transposed)
                    b = Mat.transpose(b);
                for (let ai = 0, alen = a.length; ai < alen; ai++) {
                    let p = Pt_1.Pt.make(b.length, 0);
                    for (let bi = 0, blen = b.length; bi < blen; bi++) {
                        p[bi] = Vec.dot(a[ai], b[bi]);
                    }
                    g.push(p);
                }
            }
        }
        else {
            for (let ai = 0, alen = a.length; ai < alen; ai++) {
                g.push(a[ai].$multiply(b));
            }
        }
        return g;
    }
    static zipSlice(g, index, defaultValue = false) {
        let z = [];
        for (let i = 0, len = g.length; i < len; i++) {
            if (g[i].length - 1 < index && defaultValue === false)
                throw `Index ${index} is out of bounds`;
            z.push(g[i][index] || defaultValue);
        }
        return new Pt_1.Pt(z);
    }
    static zip(g, defaultValue = false, useLongest = false) {
        let ps = new Pt_1.Group();
        let len = (useLongest) ? g.reduce((a, b) => Math.max(a, b.length), 0) : g[0].length;
        for (let i = 0; i < len; i++) {
            ps.push(Mat.zipSlice(g, i, defaultValue));
        }
        return ps;
    }
    static transpose(g, defaultValue = false, useLongest = false) {
        return Mat.zip(g, defaultValue, useLongest);
    }
    static transform2D(pt, m) {
        let x = pt[0] * m[0][0] + pt[1] * m[1][0] + m[2][0];
        let y = pt[0] * m[0][1] + pt[1] * m[1][1] + m[2][1];
        return new Pt_1.Pt(x, y);
    }
    static scale2DMatrix(x, y) {
        return new Pt_1.Group(new Pt_1.Pt(x, 0, 0), new Pt_1.Pt(0, y, 0), new Pt_1.Pt(0, 0, 1));
    }
    static rotate2DMatrix(cosA, sinA) {
        return new Pt_1.Group(new Pt_1.Pt(cosA, sinA, 0), new Pt_1.Pt(-sinA, cosA, 0), new Pt_1.Pt(0, 0, 1));
    }
    static shear2DMatrix(tanX, tanY) {
        return new Pt_1.Group(new Pt_1.Pt(1, tanX, 0), new Pt_1.Pt(tanY, 1, 0), new Pt_1.Pt(0, 0, 1));
    }
    static translate2DMatrix(x, y) {
        return new Pt_1.Group(new Pt_1.Pt(1, 0, 0), new Pt_1.Pt(0, 1, 0), new Pt_1.Pt(x, y, 1));
    }
    static scaleAt2DMatrix(sx, sy, at) {
        let m = Mat.scale2DMatrix(sx, sy);
        m[2][0] = -at[0] * sx + at[0];
        m[2][1] = -at[1] * sy + at[1];
        return m;
    }
    static rotateAt2DMatrix(cosA, sinA, at) {
        let m = Mat.rotate2DMatrix(cosA, sinA);
        m[2][0] = at[0] * (1 - cosA) + at[1] * sinA;
        m[2][1] = at[1] * (1 - cosA) - at[0] * sinA;
        return m;
    }
    static shearAt2DMatrix(tanX, tanY, at) {
        let m = Mat.shear2DMatrix(tanX, tanY);
        m[2][0] = -at[1] * tanY;
        m[2][1] = -at[0] * tanX;
        return m;
    }
    static reflectAt2DMatrix(p1, p2) {
        let intercept = Op_1.Line.intercept(p1, p2);
        if (intercept == undefined) {
            return [
                new Pt_1.Pt([-1, 0, 0]),
                new Pt_1.Pt([0, 1, 0]),
                new Pt_1.Pt([p1[0] + p2[0], 0, 1])
            ];
        }
        else {
            let yi = intercept.yi;
            let ang2 = Math.atan(intercept.slope) * 2;
            let cosA = Math.cos(ang2);
            let sinA = Math.sin(ang2);
            return [
                new Pt_1.Pt([cosA, sinA, 0]),
                new Pt_1.Pt([sinA, -cosA, 0]),
                new Pt_1.Pt([-yi * sinA, yi + yi * cosA, 1])
            ];
        }
    }
}
exports.Mat = Mat;


/***/ }),

/***/ "./src/Num.ts":
/*!********************!*\
  !*** ./src/Num.ts ***!
  \********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/*! Source code licensed under Apache License 2.0. Copyright © 2017-current William Ngan and contributors. (https://github.com/williamngan/pts) */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Range = exports.Shaping = exports.Geom = exports.Num = void 0;
const Util_1 = __webpack_require__(/*! ./Util */ "./src/Util.ts");
const Op_1 = __webpack_require__(/*! ./Op */ "./src/Op.ts");
const Pt_1 = __webpack_require__(/*! ./Pt */ "./src/Pt.ts");
const LinearAlgebra_1 = __webpack_require__(/*! ./LinearAlgebra */ "./src/LinearAlgebra.ts");
class Num {
    static equals(a, b, threshold = 0.00001) {
        return Math.abs(a - b) < threshold;
    }
    static lerp(a, b, t) {
        return (1 - t) * a + t * b;
    }
    static clamp(val, min, max) {
        return Math.max(min, Math.min(max, val));
    }
    static boundValue(val, min, max) {
        let len = Math.abs(max - min);
        let a = val % len;
        if (a > max)
            a -= len;
        else if (a < min)
            a += len;
        return a;
    }
    static within(p, a, b) {
        return p >= Math.min(a, b) && p <= Math.max(a, b);
    }
    static randomRange(a, b = 0) {
        let r = (a > b) ? (a - b) : (b - a);
        return a + Math.random() * r;
    }
    static randomPt(a, b) {
        let p = new Pt_1.Pt(a.length);
        let range = b ? LinearAlgebra_1.Vec.subtract(b, a) : a;
        let start = b ? a : new Pt_1.Pt(a.length).fill(0);
        for (let i = 0, len = p.length; i < len; i++) {
            p[i] = Math.random() * range[i] + start[i];
        }
        return p;
    }
    static normalizeValue(n, a, b) {
        let min = Math.min(a, b);
        let max = Math.max(a, b);
        return (n - min) / (max - min);
    }
    static sum(pts) {
        let _pts = Util_1.Util.iterToArray(pts);
        let c = new Pt_1.Pt(_pts[0]);
        for (let i = 1, len = _pts.length; i < len; i++) {
            LinearAlgebra_1.Vec.add(c, _pts[i]);
        }
        return c;
    }
    static average(pts) {
        let _pts = Util_1.Util.iterToArray(pts);
        return Num.sum(_pts).divide(_pts.length);
    }
    static cycle(t, method = Shaping.sineInOut) {
        return method(t > 0.5 ? 2 - t * 2 : t * 2);
    }
    static mapToRange(n, currA, currB, targetA, targetB) {
        if (currA == currB)
            throw new Error("[currMin, currMax] must define a range that is not zero");
        let min = Math.min(targetA, targetB);
        let max = Math.max(targetA, targetB);
        return Num.normalizeValue(n, currA, currB) * (max - min) + min;
    }
}
exports.Num = Num;
class Geom {
    static boundAngle(angle) {
        return Num.boundValue(angle, 0, 360);
    }
    static boundRadian(radian) {
        return Num.boundValue(radian, 0, Util_1.Const.two_pi);
    }
    static toRadian(angle) {
        return angle * Util_1.Const.deg_to_rad;
    }
    static toDegree(radian) {
        return radian * Util_1.Const.rad_to_deg;
    }
    static boundingBox(pts) {
        let minPt, maxPt;
        for (let p of pts) {
            if (minPt == undefined) {
                minPt = p.clone();
                maxPt = p.clone();
            }
            else {
                minPt = minPt.$min(p);
                maxPt = maxPt.$max(p);
            }
        }
        return new Pt_1.Group(minPt, maxPt);
    }
    static centroid(pts) {
        return Num.average(pts);
    }
    static anchor(pts, ptOrIndex = 0, direction = "to") {
        let method = (direction == "to") ? "subtract" : "add";
        let i = 0;
        for (let p of pts) {
            if (typeof ptOrIndex == "number") {
                if (ptOrIndex !== i)
                    p[method](pts[ptOrIndex]);
            }
            else {
                p[method](ptOrIndex);
            }
            i++;
        }
    }
    static interpolate(a, b, t = 0.5) {
        let len = Math.min(a.length, b.length);
        let d = Pt_1.Pt.make(len);
        for (let i = 0; i < len; i++) {
            d[i] = a[i] * (1 - t) + b[i] * t;
        }
        return d;
    }
    static perpendicular(pt, axis = Util_1.Const.xy) {
        let y = axis[1];
        let x = axis[0];
        let p = new Pt_1.Pt(pt);
        let pa = new Pt_1.Pt(p);
        pa[x] = -p[y];
        pa[y] = p[x];
        let pb = new Pt_1.Pt(p);
        pb[x] = p[y];
        pb[y] = -p[x];
        return new Pt_1.Group(pa, pb);
    }
    static isPerpendicular(p1, p2) {
        return new Pt_1.Pt(p1).dot(p2) === 0;
    }
    static withinBound(pt, boundPt1, boundPt2) {
        for (let i = 0, len = Math.min(pt.length, boundPt1.length, boundPt2.length); i < len; i++) {
            if (!Num.within(pt[i], boundPt1[i], boundPt2[i]))
                return false;
        }
        return true;
    }
    static sortEdges(pts) {
        let _pts = Util_1.Util.iterToArray(pts);
        let bounds = Geom.boundingBox(_pts);
        let center = bounds[1].add(bounds[0]).divide(2);
        let fn = (a, b) => {
            if (a.length < 2 || b.length < 2)
                throw new Error("Pt dimension cannot be less than 2");
            let da = a.$subtract(center);
            let db = b.$subtract(center);
            if (da[0] >= 0 && db[0] < 0)
                return 1;
            if (da[0] < 0 && db[0] >= 0)
                return -1;
            if (da[0] == 0 && db[0] == 0) {
                if (da[1] >= 0 || db[1] >= 0)
                    return (da[1] > db[1]) ? 1 : -1;
                return (db[1] > da[1]) ? 1 : -1;
            }
            let det = da.$cross2D(db);
            if (det < 0)
                return 1;
            if (det > 0)
                return -1;
            return (da[0] * da[0] + da[1] * da[1] > db[0] * db[0] + db[1] * db[1]) ? 1 : -1;
        };
        return _pts.sort(fn);
    }
    static scale(ps, scale, anchor) {
        let pts = Util_1.Util.iterToArray((ps[0] !== undefined && typeof ps[0] == 'number') ? [ps] : ps);
        let scs = (typeof scale == "number") ? Pt_1.Pt.make(pts[0].length, scale) : scale;
        if (!anchor)
            anchor = Pt_1.Pt.make(pts[0].length, 0);
        for (let i = 0, len = pts.length; i < len; i++) {
            let p = pts[i];
            for (let k = 0, lenP = p.length; k < lenP; k++) {
                p[k] = (anchor && anchor[k]) ? anchor[k] + (p[k] - anchor[k]) * scs[k] : p[k] * scs[k];
            }
        }
        return Geom;
    }
    static rotate2D(ps, angle, anchor, axis) {
        let pts = Util_1.Util.iterToArray((ps[0] !== undefined && typeof ps[0] == 'number') ? [ps] : ps);
        let fn = (anchor) ? LinearAlgebra_1.Mat.rotateAt2DMatrix : LinearAlgebra_1.Mat.rotate2DMatrix;
        if (!anchor)
            anchor = Pt_1.Pt.make(pts[0].length, 0);
        let cos = Math.cos(angle);
        let sin = Math.sin(angle);
        for (let i = 0, len = pts.length; i < len; i++) {
            let p = (axis) ? pts[i].$take(axis) : pts[i];
            p.to(LinearAlgebra_1.Mat.transform2D(p, fn(cos, sin, anchor)));
            if (axis) {
                for (let k = 0; k < axis.length; k++) {
                    pts[i][axis[k]] = p[k];
                }
            }
        }
        return Geom;
    }
    static shear2D(ps, scale, anchor, axis) {
        let pts = Util_1.Util.iterToArray((ps[0] !== undefined && typeof ps[0] == 'number') ? [ps] : ps);
        let s = (typeof scale == "number") ? [scale, scale] : scale;
        if (!anchor)
            anchor = Pt_1.Pt.make(pts[0].length, 0);
        let fn = (anchor) ? LinearAlgebra_1.Mat.shearAt2DMatrix : LinearAlgebra_1.Mat.shear2DMatrix;
        let tanx = Math.tan(s[0]);
        let tany = Math.tan(s[1]);
        for (let i = 0, len = pts.length; i < len; i++) {
            let p = (axis) ? pts[i].$take(axis) : pts[i];
            p.to(LinearAlgebra_1.Mat.transform2D(p, fn(tanx, tany, anchor)));
            if (axis) {
                for (let k = 0; k < axis.length; k++) {
                    pts[i][axis[k]] = p[k];
                }
            }
        }
        return Geom;
    }
    static reflect2D(ps, line, axis) {
        let pts = Util_1.Util.iterToArray((ps[0] !== undefined && typeof ps[0] == 'number') ? [ps] : ps);
        let _line = Util_1.Util.iterToArray(line);
        let mat = LinearAlgebra_1.Mat.reflectAt2DMatrix(_line[0], _line[1]);
        for (let i = 0, len = pts.length; i < len; i++) {
            let p = (axis) ? pts[i].$take(axis) : pts[i];
            p.to(LinearAlgebra_1.Mat.transform2D(p, mat));
            if (axis) {
                for (let k = 0; k < axis.length; k++) {
                    pts[i][axis[k]] = p[k];
                }
            }
        }
        return Geom;
    }
    static cosTable() {
        let cos = new Float64Array(360);
        for (let i = 0; i < 360; i++)
            cos[i] = Math.cos(i * Math.PI / 180);
        let find = (rad) => cos[Math.floor(Geom.boundAngle(Geom.toDegree(rad)))];
        return { table: cos, cos: find };
    }
    static sinTable() {
        let sin = new Float64Array(360);
        for (let i = 0; i < 360; i++)
            sin[i] = Math.sin(i * Math.PI / 180);
        let find = (rad) => sin[Math.floor(Geom.boundAngle(Geom.toDegree(rad)))];
        return { table: sin, sin: find };
    }
}
exports.Geom = Geom;
class Shaping {
    static linear(t, c = 1) {
        return c * t;
    }
    static quadraticIn(t, c = 1) {
        return c * t * t;
    }
    static quadraticOut(t, c = 1) {
        return -c * t * (t - 2);
    }
    static quadraticInOut(t, c = 1) {
        let dt = t * 2;
        return (t < 0.5) ? c / 2 * t * t * 4 : -c / 2 * ((dt - 1) * (dt - 3) - 1);
    }
    static cubicIn(t, c = 1) {
        return c * t * t * t;
    }
    static cubicOut(t, c = 1) {
        let dt = t - 1;
        return c * (dt * dt * dt + 1);
    }
    static cubicInOut(t, c = 1) {
        let dt = t * 2;
        return (t < 0.5) ? c / 2 * dt * dt * dt : c / 2 * ((dt - 2) * (dt - 2) * (dt - 2) + 2);
    }
    static exponentialIn(t, c = 1, p = 0.25) {
        return c * Math.pow(t, 1 / p);
    }
    static exponentialOut(t, c = 1, p = 0.25) {
        return c * Math.pow(t, p);
    }
    static sineIn(t, c = 1) {
        return -c * Math.cos(t * Util_1.Const.half_pi) + c;
    }
    static sineOut(t, c = 1) {
        return c * Math.sin(t * Util_1.Const.half_pi);
    }
    static sineInOut(t, c = 1) {
        return -c / 2 * (Math.cos(Math.PI * t) - 1);
    }
    static cosineApprox(t, c = 1) {
        let t2 = t * t;
        let t4 = t2 * t2;
        let t6 = t4 * t2;
        return c * (4 * t6 / 9 - 17 * t4 / 9 + 22 * t2 / 9);
    }
    static circularIn(t, c = 1) {
        return -c * (Math.sqrt(1 - t * t) - 1);
    }
    static circularOut(t, c = 1) {
        let dt = t - 1;
        return c * Math.sqrt(1 - dt * dt);
    }
    static circularInOut(t, c = 1) {
        let dt = t * 2;
        return (t < 0.5) ? -c / 2 * (Math.sqrt(1 - dt * dt) - 1) : c / 2 * (Math.sqrt(1 - (dt - 2) * (dt - 2)) + 1);
    }
    static elasticIn(t, c = 1, p = 0.7) {
        let dt = t - 1;
        let s = (p / Util_1.Const.two_pi) * 1.5707963267948966;
        return c * (-Math.pow(2, 10 * dt) * Math.sin((dt - s) * Util_1.Const.two_pi / p));
    }
    static elasticOut(t, c = 1, p = 0.7) {
        let s = (p / Util_1.Const.two_pi) * 1.5707963267948966;
        return c * (Math.pow(2, -10 * t) * Math.sin((t - s) * Util_1.Const.two_pi / p)) + c;
    }
    static elasticInOut(t, c = 1, p = 0.6) {
        let dt = t * 2;
        let s = (p / Util_1.Const.two_pi) * 1.5707963267948966;
        if (t < 0.5) {
            dt -= 1;
            return c * (-0.5 * (Math.pow(2, 10 * dt) * Math.sin((dt - s) * Util_1.Const.two_pi / p)));
        }
        else {
            dt -= 1;
            return c * (0.5 * (Math.pow(2, -10 * dt) * Math.sin((dt - s) * Util_1.Const.two_pi / p))) + c;
        }
    }
    static bounceIn(t, c = 1) {
        return c - Shaping.bounceOut((1 - t), c);
    }
    static bounceOut(t, c = 1) {
        if (t < (1 / 2.75)) {
            return c * (7.5625 * t * t);
        }
        else if (t < (2 / 2.75)) {
            t -= 1.5 / 2.75;
            return c * (7.5625 * t * t + 0.75);
        }
        else if (t < (2.5 / 2.75)) {
            t -= 2.25 / 2.75;
            return c * (7.5625 * t * t + 0.9375);
        }
        else {
            t -= 2.625 / 2.75;
            return c * (7.5625 * t * t + 0.984375);
        }
    }
    static bounceInOut(t, c = 1) {
        return (t < 0.5) ? Shaping.bounceIn(t * 2, c) / 2 : Shaping.bounceOut(t * 2 - 1, c) / 2 + c / 2;
    }
    static sigmoid(t, c = 1, p = 10) {
        let d = p * (t - 0.5);
        return c / (1 + Math.exp(-d));
    }
    static logSigmoid(t, c = 1, p = 0.7) {
        p = Math.max(Util_1.Const.epsilon, Math.min(1 - Util_1.Const.epsilon, p));
        p = 1 / (1 - p);
        let A = 1 / (1 + Math.exp(((t - 0.5) * p * -2)));
        let B = 1 / (1 + Math.exp(p));
        let C = 1 / (1 + Math.exp(-p));
        return c * (A - B) / (C - B);
    }
    static seat(t, c = 1, p = 0.5) {
        if ((t < 0.5)) {
            return c * (Math.pow(2 * t, 1 - p)) / 2;
        }
        else {
            return c * (1 - (Math.pow(2 * (1 - t), 1 - p)) / 2);
        }
    }
    static quadraticBezier(t, c = 1, p = [0.05, 0.95]) {
        let a = (typeof p != "number") ? p[0] : p;
        let b = (typeof p != "number") ? p[1] : 0.5;
        let om2a = 1 - 2 * a;
        if (om2a === 0) {
            om2a = Util_1.Const.epsilon;
        }
        let d = (Math.sqrt(a * a + om2a * t) - a) / om2a;
        return c * ((1 - 2 * b) * (d * d) + (2 * b) * d);
    }
    static cubicBezier(t, c = 1, p1 = [0.1, 0.7], p2 = [0.9, 0.2]) {
        let curve = new Pt_1.Group(new Pt_1.Pt(0, 0), new Pt_1.Pt(p1), new Pt_1.Pt(p2), new Pt_1.Pt(1, 1));
        return c * Op_1.Curve.bezierStep(new Pt_1.Pt(t * t * t, t * t, t, 1), Op_1.Curve.controlPoints(curve)).y;
    }
    static quadraticTarget(t, c = 1, p1 = [0.2, 0.35]) {
        let a = Math.min(1 - Util_1.Const.epsilon, Math.max(Util_1.Const.epsilon, p1[0]));
        let b = Math.min(1, Math.max(0, p1[1]));
        let A = (1 - b) / (1 - a) - (b / a);
        let B = (A * (a * a) - b) / a;
        let y = A * (t * t) - B * t;
        return c * Math.min(1, Math.max(0, y));
    }
    static cliff(t, c = 1, p = 0.5) {
        return (t > p) ? c : 0;
    }
    static step(fn, steps, t, c, ...args) {
        let s = 1 / steps;
        let tt = Math.floor(t / s) * s;
        return fn(tt, c, ...args);
    }
}
exports.Shaping = Shaping;
class Range {
    constructor(g) {
        this._dims = 0;
        this._source = Pt_1.Group.fromPtArray(g);
        this.calc();
    }
    get max() { return this._max.clone(); }
    get min() { return this._min.clone(); }
    get magnitude() { return this._mag.clone(); }
    calc() {
        if (!this._source)
            return;
        let dims = this._source[0].length;
        this._dims = dims;
        let max = new Pt_1.Pt(dims);
        let min = new Pt_1.Pt(dims);
        let mag = new Pt_1.Pt(dims);
        for (let i = 0; i < dims; i++) {
            max[i] = Util_1.Const.min;
            min[i] = Util_1.Const.max;
            mag[i] = 0;
            let s = this._source.zipSlice(i);
            for (let k = 0, len = s.length; k < len; k++) {
                max[i] = Math.max(max[i], s[k]);
                min[i] = Math.min(min[i], s[k]);
                mag[i] = max[i] - min[i];
            }
        }
        this._max = max;
        this._min = min;
        this._mag = mag;
        return this;
    }
    mapTo(min, max, exclude) {
        let target = new Pt_1.Group();
        for (let i = 0, len = this._source.length; i < len; i++) {
            let g = this._source[i];
            let n = new Pt_1.Pt(this._dims);
            for (let k = 0; k < this._dims; k++) {
                n[k] = (exclude && exclude[k]) ? g[k] : Num.mapToRange(g[k], this._min[k], this._max[k], min, max);
            }
            target.push(n);
        }
        return target;
    }
    append(pts, update = true) {
        let _pts = Util_1.Util.iterToArray(pts);
        if (_pts[0].length !== this._dims)
            throw new Error(`Dimensions don't match. ${this._dims} dimensions in Range and ${_pts[0].length} provided in parameter. `);
        this._source = this._source.concat(_pts);
        if (update)
            this.calc();
        return this;
    }
    ticks(count) {
        let g = new Pt_1.Group();
        for (let i = 0; i <= count; i++) {
            let p = new Pt_1.Pt(this._dims);
            for (let k = 0, len = this._max.length; k < len; k++) {
                p[k] = Num.lerp(this._min[k], this._max[k], i / count);
            }
            g.push(p);
        }
        return g;
    }
}
exports.Range = Range;


/***/ }),

/***/ "./src/Op.ts":
/*!*******************!*\
  !*** ./src/Op.ts ***!
  \*******************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/*! Source code licensed under Apache License 2.0. Copyright © 2017-current William Ngan and contributors. (https://github.com/williamngan/pts) */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Curve = exports.Polygon = exports.Triangle = exports.Circle = exports.Rectangle = exports.Line = void 0;
const Util_1 = __webpack_require__(/*! ./Util */ "./src/Util.ts");
const Num_1 = __webpack_require__(/*! ./Num */ "./src/Num.ts");
const Pt_1 = __webpack_require__(/*! ./Pt */ "./src/Pt.ts");
const LinearAlgebra_1 = __webpack_require__(/*! ./LinearAlgebra */ "./src/LinearAlgebra.ts");
let _errorLength = (obj, param = "expected") => Util_1.Util.warn("Group's length is less than " + param, obj);
let _errorOutofBound = (obj, param = "") => Util_1.Util.warn(`Index ${param} is out of bound in Group`, obj);
class Line {
    static fromAngle(anchor, angle, magnitude) {
        let g = new Pt_1.Group(new Pt_1.Pt(anchor), new Pt_1.Pt(anchor));
        g[1].toAngle(angle, magnitude, true);
        return g;
    }
    static slope(p1, p2) {
        return (p2[0] - p1[0] === 0) ? undefined : (p2[1] - p1[1]) / (p2[0] - p1[0]);
    }
    static intercept(p1, p2) {
        if (p2[0] - p1[0] === 0) {
            return undefined;
        }
        else {
            let m = (p2[1] - p1[1]) / (p2[0] - p1[0]);
            let c = p1[1] - m * p1[0];
            return { slope: m, yi: c, xi: (m === 0) ? undefined : -c / m };
        }
    }
    static sideOfPt2D(line, pt) {
        let _line = Util_1.Util.iterToArray(line);
        return (_line[1][0] - _line[0][0]) * (pt[1] - _line[0][1]) - (pt[0] - _line[0][0]) * (_line[1][1] - _line[0][1]);
    }
    static collinear(p1, p2, p3, threshold = 0.01) {
        let a = new Pt_1.Pt(0, 0, 0).to(p1).$subtract(p2);
        let b = new Pt_1.Pt(0, 0, 0).to(p1).$subtract(p3);
        return a.$cross(b).divide(1000).equals(new Pt_1.Pt(0, 0, 0), threshold);
    }
    static magnitude(line) {
        let _line = Util_1.Util.iterToArray(line);
        return (_line.length >= 2) ? _line[1].$subtract(_line[0]).magnitude() : 0;
    }
    static magnitudeSq(line) {
        let _line = Util_1.Util.iterToArray(line);
        return (_line.length >= 2) ? _line[1].$subtract(_line[0]).magnitudeSq() : 0;
    }
    static perpendicularFromPt(line, pt, asProjection = false) {
        let _line = Util_1.Util.iterToArray(line);
        if (_line[0].equals(_line[1]))
            return undefined;
        let a = _line[0].$subtract(_line[1]);
        let b = _line[1].$subtract(pt);
        let proj = b.$subtract(a.$project(b));
        return (asProjection) ? proj : proj.$add(pt);
    }
    static distanceFromPt(line, pt) {
        let _line = Util_1.Util.iterToArray(line);
        let projectionVector = Line.perpendicularFromPt(_line, pt, true);
        if (projectionVector) {
            return projectionVector.magnitude();
        }
        else {
            return _line[0].$subtract(pt).magnitude();
        }
    }
    static intersectRay2D(la, lb) {
        let _la = Util_1.Util.iterToArray(la);
        let _lb = Util_1.Util.iterToArray(lb);
        let a = Line.intercept(_la[0], _la[1]);
        let b = Line.intercept(_lb[0], _lb[1]);
        let pa = _la[0];
        let pb = _lb[0];
        if (a == undefined) {
            if (b == undefined)
                return undefined;
            let y1 = -b.slope * (pb[0] - pa[0]) + pb[1];
            return new Pt_1.Pt(pa[0], y1);
        }
        else {
            if (b == undefined) {
                let y1 = -a.slope * (pa[0] - pb[0]) + pa[1];
                return new Pt_1.Pt(pb[0], y1);
            }
            else if (b.slope != a.slope) {
                let px = (a.slope * pa[0] - b.slope * pb[0] + pb[1] - pa[1]) / (a.slope - b.slope);
                let py = a.slope * (px - pa[0]) + pa[1];
                return new Pt_1.Pt(px, py);
            }
            else {
                if (a.yi == b.yi) {
                    return new Pt_1.Pt(pa[0], pa[1]);
                }
                else {
                    return undefined;
                }
            }
        }
    }
    static intersectLine2D(la, lb) {
        let _la = Util_1.Util.iterToArray(la);
        let _lb = Util_1.Util.iterToArray(lb);
        let pt = Line.intersectRay2D(_la, _lb);
        return (pt && Num_1.Geom.withinBound(pt, _la[0], _la[1]) && Num_1.Geom.withinBound(pt, _lb[0], _lb[1])) ? pt : undefined;
    }
    static intersectLineWithRay2D(line, ray) {
        let _line = Util_1.Util.iterToArray(line);
        let _ray = Util_1.Util.iterToArray(ray);
        let pt = Line.intersectRay2D(_line, _ray);
        return (pt && Num_1.Geom.withinBound(pt, _line[0], _line[1])) ? pt : undefined;
    }
    static intersectPolygon2D(lineOrRay, poly, sourceIsRay = false) {
        let _lineOrRay = Util_1.Util.iterToArray(lineOrRay);
        let _poly = Util_1.Util.iterToArray(poly);
        let fn = sourceIsRay ? Line.intersectLineWithRay2D : Line.intersectLine2D;
        let pts = new Pt_1.Group();
        for (let i = 0, len = _poly.length; i < len; i++) {
            let next = (i === len - 1) ? 0 : i + 1;
            let d = fn([_poly[i], _poly[next]], _lineOrRay);
            if (d)
                pts.push(d);
        }
        return (pts.length > 0) ? pts : undefined;
    }
    static intersectLines2D(lines1, lines2, isRay = false) {
        let group = new Pt_1.Group();
        let fn = isRay ? Line.intersectLineWithRay2D : Line.intersectLine2D;
        for (let l1 of lines1) {
            for (let l2 of lines2) {
                let _ip = fn(l1, l2);
                if (_ip)
                    group.push(_ip);
            }
        }
        return group;
    }
    static intersectGridWithRay2D(ray, gridPt) {
        let _ray = Util_1.Util.iterToArray(ray);
        let t = Line.intercept(new Pt_1.Pt(_ray[0]).subtract(gridPt), new Pt_1.Pt(_ray[1]).subtract(gridPt));
        let g = new Pt_1.Group();
        if (t && t.xi)
            g.push(new Pt_1.Pt(gridPt[0] + t.xi, gridPt[1]));
        if (t && t.yi)
            g.push(new Pt_1.Pt(gridPt[0], gridPt[1] + t.yi));
        return g;
    }
    static intersectGridWithLine2D(line, gridPt) {
        let _line = Util_1.Util.iterToArray(line);
        let g = Line.intersectGridWithRay2D(_line, gridPt);
        let gg = new Pt_1.Group();
        for (let i = 0, len = g.length; i < len; i++) {
            if (Num_1.Geom.withinBound(g[i], _line[0], _line[1]))
                gg.push(g[i]);
        }
        return gg;
    }
    static intersectRect2D(line, rect) {
        let _line = Util_1.Util.iterToArray(line);
        let _rect = Util_1.Util.iterToArray(rect);
        let box = Num_1.Geom.boundingBox(Pt_1.Group.fromPtArray(_line));
        if (!Rectangle.hasIntersectRect2D(box, _rect))
            return new Pt_1.Group();
        return Line.intersectLines2D([_line], Rectangle.sides(_rect));
    }
    static subpoints(line, num) {
        let _line = Util_1.Util.iterToArray(line);
        let pts = new Pt_1.Group();
        for (let i = 1; i <= num; i++) {
            pts.push(Num_1.Geom.interpolate(_line[0], _line[1], i / (num + 1)));
        }
        return pts;
    }
    static crop(line, size, index = 0, cropAsCircle = true) {
        let _line = Util_1.Util.iterToArray(line);
        let tdx = (index === 0) ? 1 : 0;
        let ls = _line[tdx].$subtract(_line[index]);
        if (ls[0] === 0 || size[0] === 0)
            return _line[index];
        if (cropAsCircle) {
            let d = ls.unit().multiply(size[1]);
            return _line[index].$add(d);
        }
        else {
            let rect = Rectangle.fromCenter(_line[index], size);
            let sides = Rectangle.sides(rect);
            let sideIdx = 0;
            if (Math.abs(ls[1] / ls[0]) > Math.abs(size[1] / size[0])) {
                sideIdx = (ls[1] < 0) ? 0 : 2;
            }
            else {
                sideIdx = (ls[0] < 0) ? 3 : 1;
            }
            return Line.intersectRay2D(sides[sideIdx], _line);
        }
    }
    static marker(line, size, graphic = ("arrow" || false), atTail = true) {
        let _line = Util_1.Util.iterToArray(line);
        let h = atTail ? 0 : 1;
        let t = atTail ? 1 : 0;
        let unit = _line[h].$subtract(_line[t]);
        if (unit.magnitudeSq() === 0)
            return new Pt_1.Group();
        unit.unit();
        let ps = Num_1.Geom.perpendicular(unit).multiply(size[0]).add(_line[t]);
        if (graphic == "arrow") {
            ps.add(unit.$multiply(size[1]));
            return new Pt_1.Group(_line[t], ps[0], ps[1]);
        }
        else {
            return new Pt_1.Group(ps[0], ps[1]);
        }
    }
    static toRect(line) {
        let _line = Util_1.Util.iterToArray(line);
        return new Pt_1.Group(_line[0].$min(_line[1]), _line[0].$max(_line[1]));
    }
}
exports.Line = Line;
class Rectangle {
    static from(topLeft, widthOrSize, height) {
        return Rectangle.fromTopLeft(topLeft, widthOrSize, height);
    }
    static fromTopLeft(topLeft, widthOrSize, height) {
        let size = (typeof widthOrSize == "number") ? [widthOrSize, (height || widthOrSize)] : widthOrSize;
        return new Pt_1.Group(new Pt_1.Pt(topLeft), new Pt_1.Pt(topLeft).add(size));
    }
    static fromCenter(center, widthOrSize, height) {
        let half = (typeof widthOrSize == "number") ? [widthOrSize / 2, (height || widthOrSize) / 2] : new Pt_1.Pt(widthOrSize).divide(2);
        return new Pt_1.Group(new Pt_1.Pt(center).subtract(half), new Pt_1.Pt(center).add(half));
    }
    static toCircle(pts, within = true) {
        return Circle.fromRect(pts, within);
    }
    static toSquare(pts, enclose = false) {
        let _pts = Util_1.Util.iterToArray(pts);
        let s = Rectangle.size(_pts);
        let m = (enclose) ? s.maxValue().value : s.minValue().value;
        return Rectangle.fromCenter(Rectangle.center(_pts), m, m);
    }
    static size(pts) {
        let p = Util_1.Util.iterToArray(pts);
        return p[0].$max(p[1]).subtract(p[0].$min(p[1]));
    }
    static center(pts) {
        let p = Util_1.Util.iterToArray(pts);
        let min = p[0].$min(p[1]);
        let max = p[0].$max(p[1]);
        return min.add(max.$subtract(min).divide(2));
    }
    static corners(rect) {
        let _rect = Util_1.Util.iterToArray(rect);
        let p0 = _rect[0].$min(_rect[1]);
        let p2 = _rect[0].$max(_rect[1]);
        return new Pt_1.Group(p0, new Pt_1.Pt(p2.x, p0.y), p2, new Pt_1.Pt(p0.x, p2.y));
    }
    static sides(rect) {
        let [p0, p1, p2, p3] = Rectangle.corners(rect);
        return [
            new Pt_1.Group(p0, p1), new Pt_1.Group(p1, p2),
            new Pt_1.Group(p2, p3), new Pt_1.Group(p3, p0)
        ];
    }
    static boundingBox(rects) {
        let _rects = Util_1.Util.iterToArray(rects);
        let merged = Util_1.Util.flatten(_rects, false);
        let min = Pt_1.Pt.make(2, Number.MAX_VALUE);
        let max = Pt_1.Pt.make(2, Number.MIN_VALUE);
        for (let i = 0, len = merged.length; i < len; i++) {
            let k = 0;
            for (let m of merged[i]) {
                min[k] = Math.min(min[k], m[k]);
                max[k] = Math.max(max[k], m[k]);
                if (++k >= 2)
                    break;
            }
        }
        return new Pt_1.Group(min, max);
    }
    static polygon(rect) {
        return Rectangle.corners(rect);
    }
    static quadrants(rect, center) {
        let _rect = Util_1.Util.iterToArray(rect);
        let corners = Rectangle.corners(_rect);
        let _center = (center != undefined) ? new Pt_1.Pt(center) : Rectangle.center(_rect);
        return corners.map((c) => new Pt_1.Group(c, _center).boundingBox());
    }
    static halves(rect, ratio = 0.5, asRows = false) {
        let _rect = Util_1.Util.iterToArray(rect);
        let min = _rect[0].$min(_rect[1]);
        let max = _rect[0].$max(_rect[1]);
        let mid = (asRows) ? Num_1.Num.lerp(min[1], max[1], ratio) : Num_1.Num.lerp(min[0], max[0], ratio);
        return (asRows)
            ? [new Pt_1.Group(min, new Pt_1.Pt(max[0], mid)), new Pt_1.Group(new Pt_1.Pt(min[0], mid), max)]
            : [new Pt_1.Group(min, new Pt_1.Pt(mid, max[1])), new Pt_1.Group(new Pt_1.Pt(mid, min[1]), max)];
    }
    static withinBound(rect, pt) {
        let _rect = Util_1.Util.iterToArray(rect);
        return Num_1.Geom.withinBound(pt, _rect[0], _rect[1]);
    }
    static hasIntersectRect2D(rect1, rect2, resetBoundingBox = false) {
        let _rect1 = Util_1.Util.iterToArray(rect1);
        let _rect2 = Util_1.Util.iterToArray(rect2);
        if (resetBoundingBox) {
            _rect1 = Num_1.Geom.boundingBox(_rect1);
            _rect2 = Num_1.Geom.boundingBox(_rect2);
        }
        if (_rect1[0][0] > _rect2[1][0] || _rect2[0][0] > _rect1[1][0])
            return false;
        if (_rect1[0][1] > _rect2[1][1] || _rect2[0][1] > _rect1[1][1])
            return false;
        return true;
    }
    static intersectRect2D(rect1, rect2) {
        let _rect1 = Util_1.Util.iterToArray(rect1);
        let _rect2 = Util_1.Util.iterToArray(rect2);
        if (!Rectangle.hasIntersectRect2D(_rect1, _rect2))
            return new Pt_1.Group();
        return Line.intersectLines2D(Rectangle.sides(_rect1), Rectangle.sides(_rect2));
    }
}
exports.Rectangle = Rectangle;
class Circle {
    static fromRect(pts, enclose = false) {
        let _pts = Util_1.Util.iterToArray(pts);
        let r = 0;
        let min = r = Rectangle.size(_pts).minValue().value / 2;
        if (enclose) {
            let max = Rectangle.size(_pts).maxValue().value / 2;
            r = Math.sqrt(min * min + max * max);
        }
        else {
            r = min;
        }
        return new Pt_1.Group(Rectangle.center(_pts), new Pt_1.Pt(r, r));
    }
    static fromTriangle(pts, enclose = false) {
        if (enclose) {
            return Triangle.circumcircle(pts);
        }
        else {
            return Triangle.incircle(pts);
        }
    }
    static fromCenter(pt, radius) {
        return new Pt_1.Group(new Pt_1.Pt(pt), new Pt_1.Pt(radius, radius));
    }
    static withinBound(pts, pt, threshold = 0) {
        let _pts = Util_1.Util.iterToArray(pts);
        let d = _pts[0].$subtract(pt);
        return d.dot(d) + threshold < _pts[1].x * _pts[1].x;
    }
    static intersectRay2D(circle, ray) {
        let _pts = Util_1.Util.iterToArray(circle);
        let _ray = Util_1.Util.iterToArray(ray);
        let d = _ray[0].$subtract(_ray[1]);
        let f = _pts[0].$subtract(_ray[0]);
        let a = d.dot(d);
        let b = f.dot(d);
        let c = f.dot(f) - _pts[1].x * _pts[1].x;
        let p = b / a;
        let q = c / a;
        let disc = p * p - q;
        if (disc < 0) {
            return new Pt_1.Group();
        }
        else {
            let discSqrt = Math.sqrt(disc);
            let t1 = -p + discSqrt;
            let p1 = _ray[0].$subtract(d.$multiply(t1));
            if (disc === 0)
                return new Pt_1.Group(p1);
            let t2 = -p - discSqrt;
            let p2 = _ray[0].$subtract(d.$multiply(t2));
            return new Pt_1.Group(p1, p2);
        }
    }
    static intersectLine2D(circle, line) {
        let _pts = Util_1.Util.iterToArray(circle);
        let _line = Util_1.Util.iterToArray(line);
        let ps = Circle.intersectRay2D(_pts, _line);
        let g = new Pt_1.Group();
        if (ps.length > 0) {
            for (let i = 0, len = ps.length; i < len; i++) {
                if (Rectangle.withinBound(_line, ps[i]))
                    g.push(ps[i]);
            }
        }
        return g;
    }
    static intersectCircle2D(circle1, circle2) {
        let _pts = Util_1.Util.iterToArray(circle1);
        let _circle = Util_1.Util.iterToArray(circle2);
        let dv = _circle[0].$subtract(_pts[0]);
        let dr2 = dv.magnitudeSq();
        let dr = Math.sqrt(dr2);
        let ar = _pts[1].x;
        let br = _circle[1].x;
        let ar2 = ar * ar;
        let br2 = br * br;
        if (dr > ar + br) {
            return new Pt_1.Group();
        }
        else if (dr < Math.abs(ar - br)) {
            return new Pt_1.Group(_pts[0].clone());
        }
        else {
            let a = (ar2 - br2 + dr2) / (2 * dr);
            let h = Math.sqrt(ar2 - a * a);
            let p = dv.$multiply(a / dr).add(_pts[0]);
            return new Pt_1.Group(new Pt_1.Pt(p.x + h * dv.y / dr, p.y - h * dv.x / dr), new Pt_1.Pt(p.x - h * dv.y / dr, p.y + h * dv.x / dr));
        }
    }
    static intersectRect2D(circle, rect) {
        let _pts = Util_1.Util.iterToArray(circle);
        let _rect = Util_1.Util.iterToArray(rect);
        let sides = Rectangle.sides(_rect);
        let g = [];
        for (let i = 0, len = sides.length; i < len; i++) {
            let ps = Circle.intersectLine2D(_pts, sides[i]);
            if (ps.length > 0)
                g.push(ps);
        }
        return Util_1.Util.flatten(g);
    }
    static toRect(circle, within = false) {
        let _pts = Util_1.Util.iterToArray(circle);
        let r = _pts[1][0];
        if (within) {
            let half = Math.sqrt(r * r) / 2;
            return new Pt_1.Group(_pts[0].$subtract(half), _pts[0].$add(half));
        }
        else {
            return new Pt_1.Group(_pts[0].$subtract(r), _pts[0].$add(r));
        }
    }
    static toTriangle(circle, within = true) {
        let _pts = Util_1.Util.iterToArray(circle);
        if (within) {
            let ang = -Math.PI / 2;
            let inc = Math.PI * 2 / 3;
            let g = new Pt_1.Group();
            for (let i = 0; i < 3; i++) {
                g.push(_pts[0].clone().toAngle(ang, _pts[1][0], true));
                ang += inc;
            }
            return g;
        }
        else {
            return Triangle.fromCenter(_pts[0], _pts[1][0]);
        }
    }
}
exports.Circle = Circle;
class Triangle {
    static fromRect(rect) {
        let _rect = Util_1.Util.iterToArray(rect);
        let top = _rect[0].$add(_rect[1]).divide(2);
        top.y = _rect[0][1];
        let left = _rect[1].clone();
        left.x = _rect[0][0];
        return new Pt_1.Group(top, _rect[1].clone(), left);
    }
    static fromCircle(circle) {
        return Circle.toTriangle(circle, true);
    }
    static fromCenter(pt, size) {
        return Triangle.fromCircle(Circle.fromCenter(pt, size));
    }
    static medial(tri) {
        let _pts = Util_1.Util.iterToArray(tri);
        if (_pts.length < 3)
            return _errorLength(new Pt_1.Group(), 3);
        return Polygon.midpoints(_pts, true);
    }
    static oppositeSide(tri, index) {
        let _pts = Util_1.Util.iterToArray(tri);
        if (_pts.length < 3)
            return _errorLength(new Pt_1.Group(), 3);
        if (index === 0) {
            return Pt_1.Group.fromPtArray([_pts[1], _pts[2]]);
        }
        else if (index === 1) {
            return Pt_1.Group.fromPtArray([_pts[0], _pts[2]]);
        }
        else {
            return Pt_1.Group.fromPtArray([_pts[0], _pts[1]]);
        }
    }
    static altitude(tri, index) {
        let _pts = Util_1.Util.iterToArray(tri);
        let opp = Triangle.oppositeSide(_pts, index);
        if (opp.length > 1) {
            return new Pt_1.Group(_pts[index], Line.perpendicularFromPt(opp, _pts[index]));
        }
        else {
            return new Pt_1.Group();
        }
    }
    static orthocenter(tri) {
        let _pts = Util_1.Util.iterToArray(tri);
        if (_pts.length < 3)
            return _errorLength(undefined, 3);
        let a = Triangle.altitude(_pts, 0);
        let b = Triangle.altitude(_pts, 1);
        return Line.intersectRay2D(a, b);
    }
    static incenter(tri) {
        let _pts = Util_1.Util.iterToArray(tri);
        if (_pts.length < 3)
            return _errorLength(undefined, 3);
        let a = Polygon.bisector(_pts, 0).add(_pts[0]);
        let b = Polygon.bisector(_pts, 1).add(_pts[1]);
        return Line.intersectRay2D(new Pt_1.Group(_pts[0], a), new Pt_1.Group(_pts[1], b));
    }
    static incircle(tri, center) {
        let _pts = Util_1.Util.iterToArray(tri);
        let c = (center) ? center : Triangle.incenter(_pts);
        let area = Polygon.area(_pts);
        let perim = Polygon.perimeter(_pts, true);
        let r = 2 * area / perim.total;
        return Circle.fromCenter(c, r);
    }
    static circumcenter(tri) {
        let _pts = Util_1.Util.iterToArray(tri);
        let md = Triangle.medial(_pts);
        let a = [md[0], Num_1.Geom.perpendicular(_pts[0].$subtract(md[0])).p1.$add(md[0])];
        let b = [md[1], Num_1.Geom.perpendicular(_pts[1].$subtract(md[1])).p1.$add(md[1])];
        return Line.intersectRay2D(a, b);
    }
    static circumcircle(tri, center) {
        let _pts = Util_1.Util.iterToArray(tri);
        let c = (center) ? center : Triangle.circumcenter(_pts);
        let r = _pts[0].$subtract(c).magnitude();
        return Circle.fromCenter(c, r);
    }
}
exports.Triangle = Triangle;
class Polygon {
    static centroid(pts) {
        return Num_1.Geom.centroid(pts);
    }
    static rectangle(center, widthOrSize, height) {
        return Rectangle.corners(Rectangle.fromCenter(center, widthOrSize, height));
    }
    static fromCenter(center, radius, sides) {
        let g = new Pt_1.Group();
        for (let i = 0; i < sides; i++) {
            let ang = Math.PI * 2 * i / sides;
            g.push(new Pt_1.Pt(Math.cos(ang) * radius, Math.sin(ang) * radius).add(center));
        }
        return g;
    }
    static lineAt(pts, index) {
        let _pts = Util_1.Util.iterToArray(pts);
        if (index < 0 || index >= _pts.length)
            throw new Error("index out of the Polygon's range");
        return new Pt_1.Group(_pts[index], (index === _pts.length - 1) ? _pts[0] : _pts[index + 1]);
    }
    static lines(poly, closePath = true) {
        let _pts = Util_1.Util.iterToArray(poly);
        if (_pts.length < 2)
            return _errorLength(new Pt_1.Group(), 2);
        let sp = Util_1.Util.split(_pts, 2, 1);
        if (closePath)
            sp.push(new Pt_1.Group(_pts[_pts.length - 1], _pts[0]));
        return sp.map((g) => g);
    }
    static midpoints(poly, closePath = false, t = 0.5) {
        let sides = Polygon.lines(poly, closePath);
        let mids = sides.map((s) => Num_1.Geom.interpolate(s[0], s[1], t));
        return mids;
    }
    static adjacentSides(poly, index, closePath = false) {
        let _pts = Util_1.Util.iterToArray(poly);
        if (_pts.length < 2)
            return _errorLength(new Pt_1.Group(), 2);
        if (index < 0 || index >= _pts.length)
            return _errorOutofBound(new Pt_1.Group(), index);
        let gs = [];
        let left = index - 1;
        if (closePath && left < 0)
            left = _pts.length - 1;
        if (left >= 0)
            gs.push(new Pt_1.Group(_pts[index], _pts[left]));
        let right = index + 1;
        if (closePath && right > _pts.length - 1)
            right = 0;
        if (right <= _pts.length - 1)
            gs.push(new Pt_1.Group(_pts[index], _pts[right]));
        return gs;
    }
    static bisector(poly, index) {
        let sides = Polygon.adjacentSides(poly, index, true);
        if (sides.length >= 2) {
            let a = sides[0][1].$subtract(sides[0][0]).unit();
            let b = sides[1][1].$subtract(sides[1][0]).unit();
            return a.add(b).divide(2);
        }
        else {
            return undefined;
        }
    }
    static perimeter(poly, closePath = false) {
        let lines = Polygon.lines(poly, closePath);
        let mag = 0;
        let p = Pt_1.Pt.make(lines.length, 0);
        for (let i = 0, len = lines.length; i < len; i++) {
            let m = Line.magnitude(lines[i]);
            mag += m;
            p[i] = m;
        }
        return {
            total: mag,
            segments: p
        };
    }
    static area(pts) {
        let _pts = Util_1.Util.iterToArray(pts);
        if (_pts.length < 3)
            return _errorLength(new Pt_1.Group(), 3);
        let det = (a, b) => a[0] * b[1] - a[1] * b[0];
        let area = 0;
        for (let i = 0, len = _pts.length; i < len; i++) {
            if (i < _pts.length - 1) {
                area += det(_pts[i], _pts[i + 1]);
            }
            else {
                area += det(_pts[i], _pts[0]);
            }
        }
        return Math.abs(area / 2);
    }
    static convexHull(pts, sorted = false) {
        let _pts = Util_1.Util.iterToArray(pts);
        if (_pts.length < 3)
            return _errorLength(new Pt_1.Group(), 3);
        if (!sorted) {
            _pts = _pts.slice();
            _pts.sort((a, b) => a[0] - b[0]);
        }
        let left = (a, b, c) => {
            return (b[0] - a[0]) * (c[1] - a[1]) - (c[0] - a[0]) * (b[1] - a[1]) > 0;
        };
        let dq = [];
        let bot = _pts.length - 2;
        let top = bot + 3;
        dq[bot] = _pts[2];
        dq[top] = _pts[2];
        if (left(_pts[0], _pts[1], _pts[2])) {
            dq[bot + 1] = _pts[0];
            dq[bot + 2] = _pts[1];
        }
        else {
            dq[bot + 1] = _pts[1];
            dq[bot + 2] = _pts[0];
        }
        for (let i = 3, len = _pts.length; i < len; i++) {
            let pt = _pts[i];
            if (left(dq[bot], dq[bot + 1], pt) && left(dq[top - 1], dq[top], pt)) {
                continue;
            }
            while (!left(dq[bot], dq[bot + 1], pt)) {
                bot += 1;
            }
            bot -= 1;
            dq[bot] = pt;
            while (!left(dq[top - 1], dq[top], pt)) {
                top -= 1;
            }
            top += 1;
            dq[top] = pt;
        }
        let hull = new Pt_1.Group();
        for (let h = 0; h < (top - bot); h++) {
            hull.push(dq[bot + h]);
        }
        return hull;
    }
    static network(poly, originIndex = 0) {
        let _pts = Util_1.Util.iterToArray(poly);
        let g = [];
        for (let i = 0, len = _pts.length; i < len; i++) {
            if (i != originIndex)
                g.push(new Pt_1.Group(_pts[originIndex], _pts[i]));
        }
        return g;
    }
    static nearestPt(poly, pt) {
        let _near = Number.MAX_VALUE;
        let _item = -1;
        let i = 0;
        for (let p of poly) {
            let d = p.$subtract(pt).magnitudeSq();
            if (d < _near) {
                _near = d;
                _item = i;
            }
            i++;
        }
        return _item;
    }
    static projectAxis(poly, unitAxis) {
        let _poly = Util_1.Util.iterToArray(poly);
        let dot = unitAxis.dot(_poly[0]);
        let d = new Pt_1.Pt(dot, dot);
        for (let n = 1, len = _poly.length; n < len; n++) {
            dot = unitAxis.dot(_poly[n]);
            d = new Pt_1.Pt(Math.min(dot, d[0]), Math.max(dot, d[1]));
        }
        return d;
    }
    static _axisOverlap(poly1, poly2, unitAxis) {
        let pa = Polygon.projectAxis(poly1, unitAxis);
        let pb = Polygon.projectAxis(poly2, unitAxis);
        return (pa[0] < pb[0]) ? pb[0] - pa[1] : pa[0] - pb[1];
    }
    static hasIntersectPoint(poly, pt) {
        let _poly = Util_1.Util.iterToArray(poly);
        let c = false;
        for (let i = 0, len = _poly.length; i < len; i++) {
            let ln = Polygon.lineAt(_poly, i);
            if (((ln[0][1] > pt[1]) != (ln[1][1] > pt[1])) &&
                (pt[0] < (ln[1][0] - ln[0][0]) * (pt[1] - ln[0][1]) / (ln[1][1] - ln[0][1]) + ln[0][0])) {
                c = !c;
            }
        }
        return c;
    }
    static hasIntersectCircle(poly, circle) {
        let _poly = Util_1.Util.iterToArray(poly);
        let _circle = Util_1.Util.iterToArray(circle);
        let info = {
            which: -1,
            dist: 0,
            normal: null,
            edge: null,
            vertex: null,
        };
        let c = _circle[0];
        let r = _circle[1][0];
        let minDist = Number.MAX_SAFE_INTEGER;
        for (let i = 0, len = _poly.length; i < len; i++) {
            let edge = Polygon.lineAt(_poly, i);
            let axis = new Pt_1.Pt(edge[0].y - edge[1].y, edge[1].x - edge[0].x).unit();
            let poly2 = new Pt_1.Group(c.$add(axis.$multiply(r)), c.$subtract(axis.$multiply(r)));
            let dist = Polygon._axisOverlap(_poly, poly2, axis);
            if (dist > 0) {
                return null;
            }
            else if (Math.abs(dist) < minDist) {
                let check = Rectangle.withinBound(edge, Line.perpendicularFromPt(edge, c)) || Circle.intersectLine2D(circle, edge).length > 0;
                if (check) {
                    info.edge = edge;
                    info.normal = axis;
                    minDist = Math.abs(dist);
                    info.which = i;
                }
            }
        }
        if (!info.edge)
            return null;
        let dir = c.$subtract(Polygon.centroid(_poly)).dot(info.normal);
        if (dir < 0)
            info.normal.multiply(-1);
        info.dist = minDist;
        info.vertex = c;
        return info;
    }
    static hasIntersectPolygon(poly1, poly2) {
        let _poly1 = Util_1.Util.iterToArray(poly1);
        let _poly2 = Util_1.Util.iterToArray(poly2);
        let info = {
            which: -1,
            dist: 0,
            normal: new Pt_1.Pt(),
            edge: new Pt_1.Group(),
            vertex: new Pt_1.Pt()
        };
        let minDist = Number.MAX_SAFE_INTEGER;
        for (let i = 0, plen = (_poly1.length + _poly2.length); i < plen; i++) {
            let edge = (i < _poly1.length) ? Polygon.lineAt(_poly1, i) : Polygon.lineAt(_poly2, i - _poly1.length);
            let axis = new Pt_1.Pt(edge[0].y - edge[1].y, edge[1].x - edge[0].x).unit();
            let dist = Polygon._axisOverlap(_poly1, _poly2, axis);
            if (dist > 0) {
                return null;
            }
            else if (Math.abs(dist) < minDist) {
                info.edge = edge;
                info.normal = axis;
                minDist = Math.abs(dist);
                info.which = (i < _poly1.length) ? 0 : 1;
            }
        }
        info.dist = minDist;
        let b1 = (info.which === 0) ? _poly2 : _poly1;
        let b2 = (info.which === 0) ? _poly1 : _poly2;
        let c1 = Polygon.centroid(b1);
        let c2 = Polygon.centroid(b2);
        let dir = c1.$subtract(c2).dot(info.normal);
        if (dir < 0)
            info.normal.multiply(-1);
        let smallest = Number.MAX_SAFE_INTEGER;
        for (let i = 0, len = b1.length; i < len; i++) {
            let d = info.normal.dot(b1[i].$subtract(c2));
            if (d < smallest) {
                smallest = d;
                info.vertex = b1[i];
            }
        }
        return info;
    }
    static intersectPolygon2D(poly1, poly2) {
        let _poly1 = Util_1.Util.iterToArray(poly1);
        let _poly2 = Util_1.Util.iterToArray(poly2);
        let lp = Polygon.lines(_poly1);
        let g = [];
        for (let i = 0, len = lp.length; i < len; i++) {
            let ins = Line.intersectPolygon2D(lp[i], _poly2, false);
            if (ins)
                g.push(ins);
        }
        return Util_1.Util.flatten(g, true);
    }
    static toRects(polys) {
        let boxes = [];
        for (let g of polys) {
            boxes.push(Num_1.Geom.boundingBox(g));
        }
        let merged = Util_1.Util.flatten(boxes, false);
        boxes.unshift(Num_1.Geom.boundingBox(merged));
        return boxes;
    }
}
exports.Polygon = Polygon;
class Curve {
    static getSteps(steps) {
        let ts = new Pt_1.Group();
        for (let i = 0; i <= steps; i++) {
            let t = i / steps;
            ts.push(new Pt_1.Pt(t * t * t, t * t, t, 1));
        }
        return ts;
    }
    static controlPoints(pts, index = 0, copyStart = false) {
        let _pts = Util_1.Util.iterToArray(pts);
        if (index > _pts.length - 1)
            return new Pt_1.Group();
        let _index = (i) => (i < _pts.length - 1) ? i : _pts.length - 1;
        let p0 = _pts[index];
        index = (copyStart) ? index : index + 1;
        return new Pt_1.Group(p0, _pts[_index(index++)], _pts[_index(index++)], _pts[_index(index++)]);
    }
    static _calcPt(ctrls, params) {
        let x = ctrls.reduce((a, c, i) => a + c.x * params[i], 0);
        let y = ctrls.reduce((a, c, i) => a + c.y * params[i], 0);
        if (ctrls[0].length > 2) {
            let z = ctrls.reduce((a, c, i) => a + c.z * params[i], 0);
            return new Pt_1.Pt(x, y, z);
        }
        return new Pt_1.Pt(x, y);
    }
    static catmullRom(pts, steps = 10) {
        let _pts = Util_1.Util.iterToArray(pts);
        if (_pts.length < 2)
            return new Pt_1.Group();
        let ps = new Pt_1.Group();
        let ts = Curve.getSteps(steps);
        let c = Curve.controlPoints(_pts, 0, true);
        for (let i = 0; i <= steps; i++) {
            ps.push(Curve.catmullRomStep(ts[i], c));
        }
        let k = 0;
        while (k < _pts.length - 2) {
            let cp = Curve.controlPoints(_pts, k);
            if (cp.length > 0) {
                for (let i = 0; i <= steps; i++) {
                    ps.push(Curve.catmullRomStep(ts[i], cp));
                }
                k++;
            }
        }
        return ps;
    }
    static catmullRomStep(step, ctrls) {
        let m = new Pt_1.Group(new Pt_1.Pt(-0.5, 1, -0.5, 0), new Pt_1.Pt(1.5, -2.5, 0, 1), new Pt_1.Pt(-1.5, 2, 0.5, 0), new Pt_1.Pt(0.5, -0.5, 0, 0));
        return Curve._calcPt(ctrls, LinearAlgebra_1.Mat.multiply([step], m, true)[0]);
    }
    static cardinal(pts, steps = 10, tension = 0.5) {
        let _pts = Util_1.Util.iterToArray(pts);
        if (_pts.length < 2)
            return new Pt_1.Group();
        let ps = new Pt_1.Group();
        let ts = Curve.getSteps(steps);
        let c = Curve.controlPoints(_pts, 0, true);
        for (let i = 0; i <= steps; i++) {
            ps.push(Curve.cardinalStep(ts[i], c, tension));
        }
        let k = 0;
        while (k < _pts.length - 2) {
            let cp = Curve.controlPoints(_pts, k);
            if (cp.length > 0) {
                for (let i = 0; i <= steps; i++) {
                    ps.push(Curve.cardinalStep(ts[i], cp, tension));
                }
                k++;
            }
        }
        return ps;
    }
    static cardinalStep(step, ctrls, tension = 0.5) {
        let m = new Pt_1.Group(new Pt_1.Pt(-1, 2, -1, 0), new Pt_1.Pt(-1, 1, 0, 0), new Pt_1.Pt(1, -2, 1, 0), new Pt_1.Pt(1, -1, 0, 0));
        let h = LinearAlgebra_1.Mat.multiply([step], m, true)[0].multiply(tension);
        let h2 = (2 * step[0] - 3 * step[1] + 1);
        let h3 = -2 * step[0] + 3 * step[1];
        let pt = Curve._calcPt(ctrls, h);
        pt.x += h2 * ctrls[1].x + h3 * ctrls[2].x;
        pt.y += h2 * ctrls[1].y + h3 * ctrls[2].y;
        if (pt.length > 2)
            pt.z += h2 * ctrls[1].z + h3 * ctrls[2].z;
        return pt;
    }
    static bezier(pts, steps = 10) {
        let _pts = Util_1.Util.iterToArray(pts);
        if (_pts.length < 4)
            return new Pt_1.Group();
        let ps = new Pt_1.Group();
        let ts = Curve.getSteps(steps);
        let k = 0;
        while (k < _pts.length - 3) {
            let c = Curve.controlPoints(_pts, k);
            if (c.length > 0) {
                for (let i = 0; i <= steps; i++) {
                    ps.push(Curve.bezierStep(ts[i], c));
                }
                k += 3;
            }
        }
        return ps;
    }
    static bezierStep(step, ctrls) {
        let m = new Pt_1.Group(new Pt_1.Pt(-1, 3, -3, 1), new Pt_1.Pt(3, -6, 3, 0), new Pt_1.Pt(-3, 3, 0, 0), new Pt_1.Pt(1, 0, 0, 0));
        return Curve._calcPt(ctrls, LinearAlgebra_1.Mat.multiply([step], m, true)[0]);
    }
    static bspline(pts, steps = 10, tension = 1) {
        let _pts = Util_1.Util.iterToArray(pts);
        if (_pts.length < 2)
            return new Pt_1.Group();
        let ps = new Pt_1.Group();
        let ts = Curve.getSteps(steps);
        let k = 0;
        while (k < _pts.length - 3) {
            let c = Curve.controlPoints(_pts, k);
            if (c.length > 0) {
                if (tension !== 1) {
                    for (let i = 0; i <= steps; i++) {
                        ps.push(Curve.bsplineTensionStep(ts[i], c, tension));
                    }
                }
                else {
                    for (let i = 0; i <= steps; i++) {
                        ps.push(Curve.bsplineStep(ts[i], c));
                    }
                }
                k++;
            }
        }
        return ps;
    }
    static bsplineStep(step, ctrls) {
        let m = new Pt_1.Group(new Pt_1.Pt(-0.16666666666666666, 0.5, -0.5, 0.16666666666666666), new Pt_1.Pt(0.5, -1, 0, 0.6666666666666666), new Pt_1.Pt(-0.5, 0.5, 0.5, 0.16666666666666666), new Pt_1.Pt(0.16666666666666666, 0, 0, 0));
        return Curve._calcPt(ctrls, LinearAlgebra_1.Mat.multiply([step], m, true)[0]);
    }
    static bsplineTensionStep(step, ctrls, tension = 1) {
        let m = new Pt_1.Group(new Pt_1.Pt(-0.16666666666666666, 0.5, -0.5, 0.16666666666666666), new Pt_1.Pt(-1.5, 2, 0, -0.3333333333333333), new Pt_1.Pt(1.5, -2.5, 0.5, 0.16666666666666666), new Pt_1.Pt(0.16666666666666666, 0, 0, 0));
        let h = LinearAlgebra_1.Mat.multiply([step], m, true)[0].multiply(tension);
        let h2 = (2 * step[0] - 3 * step[1] + 1);
        let h3 = -2 * step[0] + 3 * step[1];
        let pt = Curve._calcPt(ctrls, h);
        pt.x += h2 * ctrls[1].x + h3 * ctrls[2].x;
        pt.y += h2 * ctrls[1].y + h3 * ctrls[2].y;
        if (pt.length > 2)
            pt.z += h2 * ctrls[1].z + h3 * ctrls[2].z;
        return pt;
    }
}
exports.Curve = Curve;


/***/ }),

/***/ "./src/Physics.ts":
/*!************************!*\
  !*** ./src/Physics.ts ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/*! Source code licensed under Apache License 2.0. Copyright © 2017-current William Ngan and contributors. (https://github.com/williamngan/pts) */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Body = exports.Particle = exports.World = void 0;
const Pt_1 = __webpack_require__(/*! ./Pt */ "./src/Pt.ts");
const Op_1 = __webpack_require__(/*! ./Op */ "./src/Op.ts");
const Num_1 = __webpack_require__(/*! ./Num */ "./src/Num.ts");
class World {
    constructor(bound, friction = 1, gravity = 0) {
        this._lastTime = null;
        this._gravity = new Pt_1.Pt();
        this._friction = 1;
        this._damping = 0.75;
        this._particles = [];
        this._bodies = [];
        this._pnames = [];
        this._bnames = [];
        this._bound = Pt_1.Bound.fromGroup(bound);
        this._friction = friction;
        this._gravity = (typeof gravity === "number") ? new Pt_1.Pt(0, gravity) : new Pt_1.Pt(gravity);
        return this;
    }
    get bound() { return this._bound; }
    set bound(bound) { this._bound = bound; }
    get gravity() { return this._gravity; }
    set gravity(g) { this._gravity = g; }
    get friction() { return this._friction; }
    set friction(f) { this._friction = f; }
    get damping() { return this._damping; }
    set damping(f) { this._damping = f; }
    get bodyCount() { return this._bodies.length; }
    get particleCount() { return this._particles.length; }
    body(id) {
        let idx = id;
        if (typeof id === "string" && id.length > 0) {
            idx = this._bnames.indexOf(id);
        }
        if (!(idx >= 0))
            return undefined;
        return this._bodies[idx];
    }
    particle(id) {
        let idx = id;
        if (typeof id === "string" && id.length > 0) {
            idx = this._pnames.indexOf(id);
        }
        if (!(idx >= 0))
            return undefined;
        return this._particles[idx];
    }
    bodyIndex(name) {
        return this._bnames.indexOf(name);
    }
    particleIndex(name) {
        return this._pnames.indexOf(name);
    }
    update(ms) {
        let dt = ms / 1000;
        this._updateParticles(dt);
        this._updateBodies(dt);
    }
    drawParticles(fn) {
        this._drawParticles = fn;
    }
    drawBodies(fn) {
        this._drawBodies = fn;
    }
    add(p, name = '') {
        if (p instanceof Body) {
            this._bodies.push(p);
            this._bnames.push(name);
        }
        else {
            this._particles.push(p);
            this._pnames.push(name);
        }
        return this;
    }
    _index(fn, id) {
        let index = 0;
        if (typeof id === "string") {
            index = fn(id);
            if (index < 0)
                throw new Error(`Cannot find index of ${id}. You can use particleIndex() or bodyIndex() function to check existence by name.`);
        }
        else {
            index = id;
        }
        return index;
    }
    removeBody(from, count = 1) {
        const index = this._index(this.bodyIndex.bind(this), from);
        const param = (index < 0) ? [index * -1 - 1, count] : [index, count];
        this._bodies.splice(param[0], param[1]);
        this._bnames.splice(param[0], param[1]);
        return this;
    }
    removeParticle(from, count = 1) {
        const index = this._index(this.particleIndex.bind(this), from);
        const param = (index < 0) ? [index * -1 - 1, count] : [index, count];
        this._particles.splice(param[0], param[1]);
        this._pnames.splice(param[0], param[1]);
        return this;
    }
    static edgeConstraint(p1, p2, dist, stiff = 1, precise = false) {
        const m1 = 1 / (p1.mass || 1);
        const m2 = 1 / (p2.mass || 1);
        const mm = m1 + m2;
        let delta = p2.$subtract(p1);
        let distSq = dist * dist;
        let d = (precise) ? (dist / delta.magnitude() - 1) : (distSq / (delta.dot(delta) + distSq) - 0.5);
        let f = delta.$multiply(d * stiff);
        p1.subtract(f.$multiply(m1 / mm));
        p2.add(f.$multiply(m2 / mm));
        return p1;
    }
    static boundConstraint(p, rect, damping = 0.75) {
        let bound = Num_1.Geom.boundingBox(rect);
        let np = p.$min(bound[1].subtract(p.radius)).$max(bound[0].add(p.radius));
        if (np[0] === bound[0][0] || np[0] === bound[1][0]) {
            let c = p.changed.$multiply(damping);
            p.previous = np.$subtract(new Pt_1.Pt(-c[0], c[1]));
        }
        else if (np[1] === bound[0][1] || np[1] === bound[1][1]) {
            let c = p.changed.$multiply(damping);
            p.previous = np.$subtract(new Pt_1.Pt(c[0], -c[1]));
        }
        p.to(np);
    }
    integrate(p, dt, prevDt) {
        p.addForce(this._gravity);
        p.verlet(dt, this._friction, prevDt);
        return p;
    }
    _updateParticles(dt) {
        for (let i = 0, len = this._particles.length; i < len; i++) {
            let p = this._particles[i];
            this.integrate(p, dt, this._lastTime);
            World.boundConstraint(p, this._bound, this._damping);
            for (let k = i + 1; k < len; k++) {
                if (i !== k) {
                    let p2 = this._particles[k];
                    p.collide(p2, this._damping);
                }
            }
            if (this._drawParticles)
                this._drawParticles(p, i);
        }
        this._lastTime = dt;
    }
    _updateBodies(dt) {
        for (let i = 0, len = this._bodies.length; i < len; i++) {
            let bds = this._bodies[i];
            if (bds) {
                for (let k = 0, klen = bds.length; k < klen; k++) {
                    let bk = bds[k];
                    World.boundConstraint(bk, this._bound, this._damping);
                    this.integrate(bk, dt, this._lastTime);
                }
                for (let k = i + 1; k < len; k++) {
                    bds.processBody(this._bodies[k]);
                }
                for (let m = 0, mlen = this._particles.length; m < mlen; m++) {
                    bds.processParticle(this._particles[m]);
                }
                bds.processEdges();
                if (this._drawBodies)
                    this._drawBodies(bds, i);
            }
        }
    }
}
exports.World = World;
class Particle extends Pt_1.Pt {
    constructor(...args) {
        super(...args);
        this._mass = 1;
        this._radius = 0;
        this._force = new Pt_1.Pt();
        this._prev = new Pt_1.Pt();
        this._lock = false;
        this._prev = this.clone();
    }
    get mass() { return this._mass; }
    set mass(m) { this._mass = m; }
    get radius() { return this._radius; }
    set radius(f) { this._radius = f; }
    get previous() { return this._prev; }
    set previous(p) { this._prev = p; }
    get force() { return this._force; }
    set force(g) { this._force = g; }
    get body() { return this._body; }
    set body(b) { this._body = b; }
    get lock() { return this._lock; }
    set lock(b) {
        this._lock = b;
        this._lockPt = new Pt_1.Pt(this);
    }
    get changed() { return this.$subtract(this._prev); }
    set position(p) {
        this.previous.to(this);
        if (this._lock)
            this._lockPt = p;
        this.to(p);
    }
    size(r) {
        this._mass = r;
        this._radius = r;
        return this;
    }
    addForce(...args) {
        this._force.add(...args);
        return this._force;
    }
    verlet(dt, friction, lastDt) {
        if (this._lock) {
            this.to(this._lockPt);
        }
        else {
            let lt = (lastDt) ? lastDt : dt;
            let a = this._force.multiply(dt * (dt + lt) / 2);
            let v = this.changed.multiply(friction * dt / lt).add(a);
            this._prev = this.clone();
            this.add(v);
            this._force = new Pt_1.Pt();
        }
        return this;
    }
    hit(...args) {
        this._prev.subtract(new Pt_1.Pt(...args).$divide(Math.sqrt(this._mass)));
        return this;
    }
    collide(p2, damp = 1) {
        let p1 = this;
        let dp = p1.$subtract(p2);
        let distSq = dp.magnitudeSq();
        let dr = p1.radius + p2.radius;
        if (distSq < dr * dr) {
            let c1 = p1.changed;
            let c2 = p2.changed;
            let dist = Math.sqrt(distSq);
            let d = dp.$multiply(((dist - dr) / dist) / 2);
            let np1 = p1.$subtract(d);
            let np2 = p2.$add(d);
            p1.to(np1);
            p2.to(np2);
            let f1 = damp * dp.dot(c1) / distSq;
            let f2 = damp * dp.dot(c2) / distSq;
            let dm1 = p1.mass / (p1.mass + p2.mass);
            let dm2 = p2.mass / (p1.mass + p2.mass);
            c1.add(new Pt_1.Pt(f2 * dp[0] - f1 * dp[0], f2 * dp[1] - f1 * dp[1]).$multiply(dm2));
            c2.add(new Pt_1.Pt(f1 * dp[0] - f2 * dp[0], f1 * dp[1] - f2 * dp[1]).$multiply(dm1));
            p1.previous = p1.$subtract(c1);
            p2.previous = p2.$subtract(c2);
        }
    }
    toString() {
        return `Particle: ${this[0]} ${this[1]} | previous ${this._prev[0]} ${this._prev[1]} | mass ${this._mass}`;
    }
}
exports.Particle = Particle;
class Body extends Pt_1.Group {
    constructor() {
        super();
        this._cs = [];
        this._stiff = 1;
        this._locks = {};
        this._mass = 1;
    }
    static fromGroup(body, stiff = 1, autoLink = true, autoMass = true) {
        let b = new Body().init(body);
        if (autoLink)
            b.linkAll(stiff);
        if (autoMass)
            b.autoMass();
        return b;
    }
    init(body, stiff = 1) {
        let c = new Pt_1.Pt();
        for (let li of body) {
            let p = new Particle(li);
            p.body = this;
            c.add(li);
            this.push(p);
        }
        this._stiff = stiff;
        return this;
    }
    get mass() { return this._mass; }
    set mass(m) {
        this._mass = m;
        for (let i = 0, len = this.length; i < len; i++) {
            this[i].mass = this._mass;
        }
    }
    autoMass() {
        this.mass = Math.sqrt(Op_1.Polygon.area(this)) / 10;
        return this;
    }
    link(index1, index2, stiff) {
        if (index1 < 0 || index1 >= this.length)
            throw new Error("index1 is not in the Group's indices");
        if (index2 < 0 || index2 >= this.length)
            throw new Error("index1 is not in the Group's indices");
        let d = this[index1].$subtract(this[index2]).magnitude();
        this._cs.push([index1, index2, d, stiff || this._stiff]);
        return this;
    }
    linkAll(stiff) {
        let half = this.length / 2;
        for (let i = 0, len = this.length; i < len; i++) {
            let n = (i >= len - 1) ? 0 : i + 1;
            this.link(i, n, stiff);
            if (len > 4) {
                let nd = (Math.floor(half / 2)) + 1;
                let n2 = (i >= len - nd) ? i % len : i + nd;
                this.link(i, n2, stiff);
            }
            if (i <= half - 1) {
                this.link(i, Math.min(this.length - 1, i + Math.floor(half)));
            }
        }
    }
    linksToLines() {
        let gs = [];
        for (let i = 0, len = this._cs.length; i < len; i++) {
            let ln = this._cs[i];
            gs.push(new Pt_1.Group(this[ln[0]], this[ln[1]]));
        }
        return gs;
    }
    processEdges() {
        for (let i = 0, len = this._cs.length; i < len; i++) {
            let [m, n, d, s] = this._cs[i];
            World.edgeConstraint(this[m], this[n], d, s);
        }
    }
    processBody(b) {
        let b1 = this;
        let b2 = b;
        let hit = Op_1.Polygon.hasIntersectPolygon(b1, b2);
        if (hit) {
            let cv = hit.normal.$multiply(hit.dist);
            let t;
            let eg = hit.edge;
            if (Math.abs(eg[0][0] - eg[1][0]) > Math.abs(eg[0][1] - eg[1][1])) {
                t = (hit.vertex[0] - cv[0] - eg[0][0]) / (eg[1][0] - eg[0][0]);
            }
            else {
                t = (hit.vertex[1] - cv[1] - eg[0][1]) / (eg[1][1] - eg[0][1]);
            }
            let lambda = 1 / (t * t + (1 - t) * (1 - t));
            let m0 = hit.vertex.body.mass || 1;
            let m1 = hit.edge[0].body.mass || 1;
            let mr0 = m0 / (m0 + m1);
            let mr1 = m1 / (m0 + m1);
            eg[0].subtract(cv.$multiply(mr0 * (1 - t) * lambda / 2));
            eg[1].subtract(cv.$multiply(mr0 * t * lambda / 2));
            hit.vertex.add(cv.$multiply(mr1));
        }
    }
    processParticle(b) {
        let b1 = this;
        let b2 = b;
        let hit = Op_1.Polygon.hasIntersectCircle(b1, Op_1.Circle.fromCenter(b, b.radius));
        if (hit) {
            let cv = hit.normal.$multiply(hit.dist);
            let t;
            let eg = hit.edge;
            if (Math.abs(eg[0][0] - eg[1][0]) > Math.abs(eg[0][1] - eg[1][1])) {
                t = (hit.vertex[0] - cv[0] - eg[0][0]) / (eg[1][0] - eg[0][0]);
            }
            else {
                t = (hit.vertex[1] - cv[1] - eg[0][1]) / (eg[1][1] - eg[0][1]);
            }
            let lambda = 1 / (t * t + (1 - t) * (1 - t));
            let m0 = hit.vertex.mass || b2.mass || 1;
            let m1 = hit.edge[0].body.mass || 1;
            let mr0 = m0 / (m0 + m1);
            let mr1 = m1 / (m0 + m1);
            eg[0].subtract(cv.$multiply(mr0 * (1 - t) * lambda / 2));
            eg[1].subtract(cv.$multiply(mr0 * t * lambda / 2));
            let c1 = b.changed.add(cv.$multiply(mr1));
            b.previous = b.$subtract(c1);
        }
    }
}
exports.Body = Body;


/***/ }),

/***/ "./src/Play.ts":
/*!*********************!*\
  !*** ./src/Play.ts ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sound = exports.Tempo = void 0;
const Pt_1 = __webpack_require__(/*! ./Pt */ "./src/Pt.ts");
const Num_1 = __webpack_require__(/*! ./Num */ "./src/Num.ts");
class Tempo {
    constructor(bpm) {
        this._listeners = {};
        this._listenerInc = 0;
        this.bpm = bpm;
    }
    static fromBeat(ms) {
        return new Tempo(60000 / ms);
    }
    get bpm() { return this._bpm; }
    set bpm(n) {
        this._bpm = n;
        this._ms = 60000 / this._bpm;
    }
    get ms() { return this._ms; }
    set ms(n) {
        this._bpm = Math.floor(60000 / n);
        this._ms = 60000 / this._bpm;
    }
    _createID(listener) {
        let id = '';
        if (typeof listener === 'function') {
            id = '_b' + (this._listenerInc++);
        }
        else {
            id = listener.name || '_b' + (this._listenerInc++);
        }
        return id;
    }
    every(beats) {
        let self = this;
        let p = Array.isArray(beats) ? beats[0] : beats;
        return {
            start: function (fn, offset = 0, name) {
                let id = name || self._createID(fn);
                self._listeners[id] = { name: id, beats: beats, period: p, index: 0, offset: offset, duration: -1, continuous: false, fn: fn };
                return this;
            },
            progress: function (fn, offset = 0, name) {
                let id = name || self._createID(fn);
                self._listeners[id] = { name: id, beats: beats, period: p, index: 0, offset: offset, duration: -1, continuous: true, fn: fn };
                return this;
            }
        };
    }
    track(time) {
        for (let k in this._listeners) {
            if (this._listeners.hasOwnProperty(k)) {
                let li = this._listeners[k];
                let _t = (li.offset) ? time + li.offset : time;
                let ms = li.period * this._ms;
                let isStart = false;
                if (_t > li.duration + ms) {
                    li.duration = _t - (_t % this._ms);
                    if (Array.isArray(li.beats)) {
                        li.index = (li.index + 1) % li.beats.length;
                        li.period = li.beats[li.index];
                    }
                    isStart = true;
                }
                let count = Math.max(0, Math.ceil(Math.floor(li.duration / this._ms) / li.period));
                let params = (li.continuous) ? [count, Num_1.Num.clamp((_t - li.duration) / ms, 0, 1), _t, isStart] : [count];
                if (li.continuous || isStart) {
                    let done = li.fn.apply(li, params);
                    if (done)
                        delete this._listeners[li.name];
                }
            }
        }
    }
    stop(name) {
        if (this._listeners[name])
            delete this._listeners[name];
    }
    animate(time, ftime) {
        this.track(time);
    }
    resize(bound, evt) {
        return;
    }
    action(type, px, py, evt) {
        return;
    }
}
exports.Tempo = Tempo;
class Sound {
    constructor(type) {
        this._playing = false;
        this._type = type;
        let _ctx = window.AudioContext || window.webkitAudioContext || false;
        if (!_ctx)
            throw (new Error("Your browser doesn't support Web Audio. (No AudioContext)"));
        this._ctx = (_ctx) ? new _ctx() : undefined;
    }
    static from(node, ctx, type = "gen", stream) {
        let s = new Sound(type);
        s._node = node;
        s._ctx = ctx;
        if (stream)
            s._stream = stream;
        return s;
    }
    static load(source, crossOrigin = "anonymous") {
        return new Promise((resolve, reject) => {
            let s = new Sound("file");
            s._source = (typeof source === 'string') ? new Audio(source) : source;
            s._source.autoplay = false;
            s._source.crossOrigin = crossOrigin;
            s._source.addEventListener("ended", function () { s._playing = false; });
            s._source.addEventListener('error', function () { reject("Error loading sound"); });
            s._source.addEventListener('canplaythrough', function () {
                s._node = s._ctx.createMediaElementSource(s._source);
                resolve(s);
            });
        });
    }
    static loadAsBuffer(url) {
        return new Promise((resolve, reject) => {
            let request = new XMLHttpRequest();
            request.open('GET', url, true);
            request.responseType = 'arraybuffer';
            let s = new Sound("file");
            request.onload = function () {
                s._ctx.decodeAudioData(request.response, function (buffer) {
                    s.createBuffer(buffer);
                    resolve(s);
                }, (err) => reject("Error decoding audio"));
            };
            request.send();
        });
    }
    createBuffer(buf) {
        this._node = this._ctx.createBufferSource();
        if (buf !== undefined)
            this._buffer = buf;
        this._node.buffer = this._buffer;
        this._node.onended = () => { this._playing = false; };
        return this;
    }
    static generate(type, val) {
        let s = new Sound("gen");
        return s._gen(type, val);
    }
    _gen(type, val) {
        this._node = this._ctx.createOscillator();
        let osc = this._node;
        osc.type = type;
        if (type === 'custom') {
            osc.setPeriodicWave(val);
        }
        else {
            osc.frequency.value = val;
        }
        return this;
    }
    static input(constraint) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let s = new Sound("input");
                if (!s)
                    return undefined;
                const c = constraint ? constraint : { audio: true, video: false };
                s._stream = yield navigator.mediaDevices.getUserMedia(c);
                s._node = s._ctx.createMediaStreamSource(s._stream);
                return s;
            }
            catch (e) {
                console.error("Cannot get audio from input device.");
                return Promise.resolve(null);
            }
        });
    }
    get ctx() { return this._ctx; }
    get node() { return this._node; }
    get outputNode() { return this._outputNode; }
    get stream() { return this._stream; }
    get source() { return this._source; }
    get buffer() { return this._buffer; }
    set buffer(b) { this._buffer = b; }
    get type() { return this._type; }
    get playing() { return this._playing; }
    get progress() {
        let dur = 0;
        let curr = 0;
        if (!!this._buffer) {
            dur = this._buffer.duration;
            curr = (this._timestamp) ? this._ctx.currentTime - this._timestamp : 0;
        }
        else {
            dur = this._source.duration;
            curr = this._source.currentTime;
        }
        return curr / dur;
    }
    get playable() {
        return (this._type === "input") ? this._node !== undefined : (!!this._buffer || this._source.readyState === 4);
    }
    get binSize() {
        return this.analyzer.size;
    }
    get sampleRate() {
        return this._ctx.sampleRate;
    }
    get frequency() {
        return (this._type === "gen") ? this._node.frequency.value : 0;
    }
    set frequency(f) {
        if (this._type === "gen")
            this._node.frequency.value = f;
    }
    connect(node) {
        this._node.connect(node);
        return this;
    }
    setOutputNode(outputNode) {
        this._outputNode = outputNode;
        return this;
    }
    removeOutputNode() {
        this._outputNode = null;
        return this;
    }
    analyze(size = 256, minDb = -100, maxDb = -30, smooth = 0.8) {
        let a = this._ctx.createAnalyser();
        a.fftSize = size * 2;
        a.minDecibels = minDb;
        a.maxDecibels = maxDb;
        a.smoothingTimeConstant = smooth;
        this.analyzer = {
            node: a,
            size: a.frequencyBinCount,
            data: new Uint8Array(a.frequencyBinCount)
        };
        this._node.connect(this.analyzer.node);
        return this;
    }
    _domain(time) {
        if (this.analyzer) {
            if (time) {
                this.analyzer.node.getByteTimeDomainData(this.analyzer.data);
            }
            else {
                this.analyzer.node.getByteFrequencyData(this.analyzer.data);
            }
            return this.analyzer.data;
        }
        return new Uint8Array(0);
    }
    _domainTo(time, size, position = [0, 0], trim = [0, 0]) {
        let data = (time) ? this.timeDomain() : this.freqDomain();
        let g = new Pt_1.Group();
        for (let i = trim[0], len = data.length - trim[1]; i < len; i++) {
            g.push(new Pt_1.Pt(position[0] + size[0] * i / len, position[1] + size[1] * data[i] / 255));
        }
        return g;
    }
    timeDomain() {
        return this._domain(true);
    }
    timeDomainTo(size, position = [0, 0], trim = [0, 0]) {
        return this._domainTo(true, size, position, trim);
    }
    freqDomain() {
        return this._domain(false);
    }
    freqDomainTo(size, position = [0, 0], trim = [0, 0]) {
        return this._domainTo(false, size, position, trim);
    }
    reset() {
        this.stop();
        this._node.disconnect();
        return this;
    }
    start(timeAt = 0) {
        if (this._ctx.state === 'suspended')
            this._ctx.resume();
        if (this._type === "file") {
            if (!!this._buffer) {
                this._node.start(timeAt);
                this._timestamp = this._ctx.currentTime + timeAt;
            }
            else {
                this._source.play();
                if (timeAt > 0)
                    this._source.currentTime = timeAt;
            }
        }
        else if (this._type === "gen") {
            this._gen(this._node.type, this._node.frequency.value);
            this._node.start();
            if (this.analyzer)
                this._node.connect(this.analyzer.node);
        }
        (this._outputNode || this._node).connect(this._ctx.destination);
        this._playing = true;
        return this;
    }
    stop() {
        if (this._playing)
            (this._outputNode || this._node).disconnect(this._ctx.destination);
        if (this._type === "file") {
            if (!!this._buffer) {
                if (this.progress < 1)
                    this._node.stop();
            }
            else {
                this._source.pause();
            }
        }
        else if (this._type === "gen") {
            this._node.stop();
        }
        else if (this._type === "input") {
            this._stream.getAudioTracks().forEach(track => track.stop());
        }
        this._playing = false;
        return this;
    }
    toggle() {
        if (this._playing) {
            this.stop();
        }
        else {
            this.start();
        }
        return this;
    }
}
exports.Sound = Sound;


/***/ }),

/***/ "./src/Pt.ts":
/*!*******************!*\
  !*** ./src/Pt.ts ***!
  \*******************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/*! Source code licensed under Apache License 2.0. Copyright © 2017-current William Ngan and contributors. (https://github.com/williamngan/pts) */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bound = exports.Group = exports.Pt = void 0;
const Util_1 = __webpack_require__(/*! ./Util */ "./src/Util.ts");
const Num_1 = __webpack_require__(/*! ./Num */ "./src/Num.ts");
const LinearAlgebra_1 = __webpack_require__(/*! ./LinearAlgebra */ "./src/LinearAlgebra.ts");
class Pt extends Float32Array {
    constructor(...args) {
        if (args.length === 1 && typeof args[0] == "number") {
            super(args[0]);
        }
        else {
            super((args.length > 0) ? Util_1.Util.getArgs(args) : [0, 0]);
        }
    }
    static make(dimensions, defaultValue = 0, randomize = false) {
        let p = new Float32Array(dimensions);
        if (defaultValue)
            p.fill(defaultValue);
        if (randomize) {
            for (let i = 0, len = p.length; i < len; i++) {
                p[i] = p[i] * Math.random();
            }
        }
        return new Pt(p);
    }
    get id() { return this._id; }
    set id(s) { this._id = s; }
    get x() { return this[0]; }
    set x(n) { this[0] = n; }
    get y() { return this[1]; }
    set y(n) { this[1] = n; }
    get z() { return this[2]; }
    set z(n) { this[2] = n; }
    get w() { return this[3]; }
    set w(n) { this[3] = n; }
    clone() {
        return new Pt(this);
    }
    equals(p, threshold = 0.000001) {
        for (let i = 0, len = this.length; i < len; i++) {
            if (Math.abs(this[i] - p[i]) > threshold)
                return false;
        }
        return true;
    }
    to(...args) {
        let p = Util_1.Util.getArgs(args);
        for (let i = 0, len = Math.min(this.length, p.length); i < len; i++) {
            this[i] = p[i];
        }
        return this;
    }
    $to(...args) {
        return this.clone().to(...args);
    }
    toAngle(radian, magnitude, anchorFromPt = false) {
        let m = (magnitude != undefined) ? magnitude : this.magnitude();
        let change = [Math.cos(radian) * m, Math.sin(radian) * m];
        return (anchorFromPt) ? this.add(change) : this.to(change);
    }
    op(fn) {
        let self = this;
        return (...params) => {
            return fn(self, ...params);
        };
    }
    ops(fns) {
        let _ops = [];
        for (let i = 0, len = fns.length; i < len; i++) {
            _ops.push(this.op(fns[i]));
        }
        return _ops;
    }
    $take(axis) {
        let p = [];
        for (let i = 0, len = axis.length; i < len; i++) {
            p.push(this[axis[i]] || 0);
        }
        return new Pt(p);
    }
    $concat(...args) {
        return new Pt(this.toArray().concat(Util_1.Util.getArgs(args)));
    }
    add(...args) {
        (args.length === 1 && typeof args[0] == "number") ? LinearAlgebra_1.Vec.add(this, args[0]) : LinearAlgebra_1.Vec.add(this, Util_1.Util.getArgs(args));
        return this;
    }
    $add(...args) { return this.clone().add(...args); }
    subtract(...args) {
        (args.length === 1 && typeof args[0] == "number") ? LinearAlgebra_1.Vec.subtract(this, args[0]) : LinearAlgebra_1.Vec.subtract(this, Util_1.Util.getArgs(args));
        return this;
    }
    $subtract(...args) { return this.clone().subtract(...args); }
    multiply(...args) {
        (args.length === 1 && typeof args[0] == "number") ? LinearAlgebra_1.Vec.multiply(this, args[0]) : LinearAlgebra_1.Vec.multiply(this, Util_1.Util.getArgs(args));
        return this;
    }
    $multiply(...args) { return this.clone().multiply(...args); }
    divide(...args) {
        (args.length === 1 && typeof args[0] == "number") ? LinearAlgebra_1.Vec.divide(this, args[0]) : LinearAlgebra_1.Vec.divide(this, Util_1.Util.getArgs(args));
        return this;
    }
    $divide(...args) { return this.clone().divide(...args); }
    magnitudeSq() { return LinearAlgebra_1.Vec.dot(this, this); }
    magnitude() { return LinearAlgebra_1.Vec.magnitude(this); }
    unit(magnitude = undefined) {
        LinearAlgebra_1.Vec.unit(this, magnitude);
        return this;
    }
    $unit(magnitude = undefined) { return this.clone().unit(magnitude); }
    dot(...args) { return LinearAlgebra_1.Vec.dot(this, Util_1.Util.getArgs(args)); }
    $cross2D(...args) { return LinearAlgebra_1.Vec.cross2D(this, Util_1.Util.getArgs(args)); }
    $cross(...args) { return LinearAlgebra_1.Vec.cross(this, Util_1.Util.getArgs(args)); }
    $project(...args) {
        return this.$multiply(this.dot(...args) / this.magnitudeSq());
    }
    projectScalar(...args) {
        return this.dot(...args) / this.magnitude();
    }
    abs() {
        LinearAlgebra_1.Vec.abs(this);
        return this;
    }
    $abs() {
        return this.clone().abs();
    }
    floor() {
        LinearAlgebra_1.Vec.floor(this);
        return this;
    }
    $floor() {
        return this.clone().floor();
    }
    ceil() {
        LinearAlgebra_1.Vec.ceil(this);
        return this;
    }
    $ceil() {
        return this.clone().ceil();
    }
    round() {
        LinearAlgebra_1.Vec.round(this);
        return this;
    }
    $round() {
        return this.clone().round();
    }
    minValue() {
        return LinearAlgebra_1.Vec.min(this);
    }
    maxValue() {
        return LinearAlgebra_1.Vec.max(this);
    }
    $min(...args) {
        let p = Util_1.Util.getArgs(args);
        let m = this.clone();
        for (let i = 0, len = Math.min(this.length, p.length); i < len; i++) {
            m[i] = Math.min(this[i], p[i]);
        }
        return m;
    }
    $max(...args) {
        let p = Util_1.Util.getArgs(args);
        let m = this.clone();
        for (let i = 0, len = Math.min(this.length, p.length); i < len; i++) {
            m[i] = Math.max(this[i], p[i]);
        }
        return m;
    }
    angle(axis = Util_1.Const.xy) {
        return Math.atan2(this[axis[1]], this[axis[0]]);
    }
    angleBetween(p, axis = Util_1.Const.xy) {
        return Num_1.Geom.boundRadian(this.angle(axis)) - Num_1.Geom.boundRadian(p.angle(axis));
    }
    scale(scale, anchor) {
        Num_1.Geom.scale(this, scale, anchor || Pt.make(this.length, 0));
        return this;
    }
    rotate2D(angle, anchor, axis) {
        Num_1.Geom.rotate2D(this, angle, anchor || Pt.make(this.length, 0), axis);
        return this;
    }
    shear2D(scale, anchor, axis) {
        Num_1.Geom.shear2D(this, scale, anchor || Pt.make(this.length, 0), axis);
        return this;
    }
    reflect2D(line, axis) {
        Num_1.Geom.reflect2D(this, line, axis);
        return this;
    }
    toString() {
        return `Pt(${this.join(", ")})`;
    }
    toArray() {
        return [].slice.call(this);
    }
    toGroup() {
        return new Group(Pt.make(this.length), this.clone());
    }
    toBound() {
        return new Bound(Pt.make(this.length), this.clone());
    }
}
exports.Pt = Pt;
class Group extends Array {
    constructor(...args) {
        super(...args);
    }
    get id() { return this._id; }
    set id(s) { this._id = s; }
    get p1() { return this[0]; }
    get p2() { return this[1]; }
    get p3() { return this[2]; }
    get p4() { return this[3]; }
    get q1() { return this[this.length - 1]; }
    get q2() { return this[this.length - 2]; }
    get q3() { return this[this.length - 3]; }
    get q4() { return this[this.length - 4]; }
    clone() {
        let group = new Group();
        for (let i = 0, len = this.length; i < len; i++) {
            group.push(this[i].clone());
        }
        return group;
    }
    static fromArray(list) {
        let g = new Group();
        for (let li of list) {
            let p = (li instanceof Pt) ? li : new Pt(li);
            g.push(p);
        }
        return g;
    }
    static fromPtArray(list) {
        return Group.from(list);
    }
    split(chunkSize, stride, loopBack = false) {
        let sp = Util_1.Util.split(this, chunkSize, stride, loopBack);
        return sp;
    }
    insert(pts, index = 0) {
        Group.prototype.splice.apply(this, [index, 0, ...pts]);
        return this;
    }
    remove(index = 0, count = 1) {
        let param = (index < 0) ? [index * -1 - 1, count] : [index, count];
        return Group.prototype.splice.apply(this, param);
    }
    segments(pts_per_segment = 2, stride = 1, loopBack = false) {
        return this.split(pts_per_segment, stride, loopBack);
    }
    lines() { return this.segments(2, 1); }
    centroid() {
        return Num_1.Geom.centroid(this);
    }
    boundingBox() {
        return Num_1.Geom.boundingBox(this);
    }
    anchorTo(ptOrIndex = 0) { Num_1.Geom.anchor(this, ptOrIndex, "to"); }
    anchorFrom(ptOrIndex = 0) { Num_1.Geom.anchor(this, ptOrIndex, "from"); }
    op(fn) {
        let self = this;
        return (...params) => {
            return fn(self, ...params);
        };
    }
    ops(fns) {
        let _ops = [];
        for (let i = 0, len = fns.length; i < len; i++) {
            _ops.push(this.op(fns[i]));
        }
        return _ops;
    }
    interpolate(t) {
        t = Num_1.Num.clamp(t, 0, 1);
        let chunk = this.length - 1;
        let tc = 1 / (this.length - 1);
        let idx = Math.floor(t / tc);
        return Num_1.Geom.interpolate(this[idx], this[Math.min(this.length - 1, idx + 1)], (t - idx * tc) * chunk);
    }
    moveBy(...args) {
        return this.add(...args);
    }
    moveTo(...args) {
        let d = new Pt(Util_1.Util.getArgs(args)).subtract(this[0]);
        this.moveBy(d);
        return this;
    }
    scale(scale, anchor) {
        for (let i = 0, len = this.length; i < len; i++) {
            Num_1.Geom.scale(this[i], scale, anchor || this[0]);
        }
        return this;
    }
    rotate2D(angle, anchor, axis) {
        for (let i = 0, len = this.length; i < len; i++) {
            Num_1.Geom.rotate2D(this[i], angle, anchor || this[0], axis);
        }
        return this;
    }
    shear2D(scale, anchor, axis) {
        for (let i = 0, len = this.length; i < len; i++) {
            Num_1.Geom.shear2D(this[i], scale, anchor || this[0], axis);
        }
        return this;
    }
    reflect2D(line, axis) {
        for (let i = 0, len = this.length; i < len; i++) {
            Num_1.Geom.reflect2D(this[i], line, axis);
        }
        return this;
    }
    sortByDimension(dim, desc = false) {
        return this.sort((a, b) => (desc) ? b[dim] - a[dim] : a[dim] - b[dim]);
    }
    forEachPt(ptFn, ...args) {
        if (!this[0][ptFn]) {
            Util_1.Util.warn(`${ptFn} is not a function of Pt`);
            return this;
        }
        for (let i = 0, len = this.length; i < len; i++) {
            this[i] = this[i][ptFn](...args);
        }
        return this;
    }
    add(...args) {
        return this.forEachPt("add", ...args);
    }
    subtract(...args) {
        return this.forEachPt("subtract", ...args);
    }
    multiply(...args) {
        return this.forEachPt("multiply", ...args);
    }
    divide(...args) {
        return this.forEachPt("divide", ...args);
    }
    $matrixAdd(g) {
        return LinearAlgebra_1.Mat.add(this, g);
    }
    $matrixMultiply(g, transposed = false, elementwise = false) {
        return LinearAlgebra_1.Mat.multiply(this, g, transposed, elementwise);
    }
    zipSlice(index, defaultValue = false) {
        return LinearAlgebra_1.Mat.zipSlice(this, index, defaultValue);
    }
    $zip(defaultValue = undefined, useLongest = false) {
        return LinearAlgebra_1.Mat.zip(this, defaultValue, useLongest);
    }
    toString() {
        return "Group[ " + this.reduce((p, c) => p + c.toString() + " ", "") + " ]";
    }
}
exports.Group = Group;
class Bound extends Group {
    constructor(...args) {
        super(...args);
        this._center = new Pt();
        this._size = new Pt();
        this._topLeft = new Pt();
        this._bottomRight = new Pt();
        this._inited = false;
        this.init();
    }
    static fromBoundingRect(rect) {
        let b = new Bound(new Pt(rect.left || 0, rect.top || 0), new Pt(rect.right || 0, rect.bottom || 0));
        if (rect.width && rect.height)
            b.size = new Pt(rect.width, rect.height);
        return b;
    }
    static fromGroup(g) {
        let _g = Util_1.Util.iterToArray(g);
        if (_g.length < 2)
            throw new Error("Cannot create a Bound from a group that has less than 2 Pt");
        return new Bound(_g[0], _g[_g.length - 1]);
    }
    init() {
        if (this.p1) {
            this._size = this.p1.clone();
            this._inited = true;
        }
        if (this.p1 && this.p2) {
            let a = this.p1;
            let b = this.p2;
            this.topLeft = a.$min(b);
            this._bottomRight = a.$max(b);
            this._updateSize();
            this._inited = true;
        }
    }
    clone() {
        return new Bound(this._topLeft.clone(), this._bottomRight.clone());
    }
    _updateSize() {
        this._size = this._bottomRight.$subtract(this._topLeft).abs();
        this._updateCenter();
    }
    _updateCenter() {
        this._center = this._size.$multiply(0.5).add(this._topLeft);
    }
    _updatePosFromTop() {
        this._bottomRight = this._topLeft.$add(this._size);
        this._updateCenter();
    }
    _updatePosFromBottom() {
        this._topLeft = this._bottomRight.$subtract(this._size);
        this._updateCenter();
    }
    _updatePosFromCenter() {
        let half = this._size.$multiply(0.5);
        this._topLeft = this._center.$subtract(half);
        this._bottomRight = this._center.$add(half);
    }
    get size() { return new Pt(this._size); }
    set size(p) {
        this._size = new Pt(p);
        this._updatePosFromTop();
    }
    get center() { return new Pt(this._center); }
    set center(p) {
        this._center = new Pt(p);
        this._updatePosFromCenter();
    }
    get topLeft() { return new Pt(this._topLeft); }
    set topLeft(p) {
        this._topLeft = new Pt(p);
        this[0] = this._topLeft;
        this._updateSize();
    }
    get bottomRight() { return new Pt(this._bottomRight); }
    set bottomRight(p) {
        this._bottomRight = new Pt(p);
        this[1] = this._bottomRight;
        this._updateSize();
    }
    get width() { return (this._size.length > 0) ? this._size.x : 0; }
    set width(w) {
        this._size.x = w;
        this._updatePosFromTop();
    }
    get height() { return (this._size.length > 1) ? this._size.y : 0; }
    set height(h) {
        this._size.y = h;
        this._updatePosFromTop();
    }
    get depth() { return (this._size.length > 2) ? this._size.z : 0; }
    set depth(d) {
        this._size.z = d;
        this._updatePosFromTop();
    }
    get x() { return this.topLeft.x; }
    get y() { return this.topLeft.y; }
    get z() { return this.topLeft.z; }
    get inited() { return this._inited; }
    update() {
        this._topLeft = this[0];
        this._bottomRight = this[1];
        this._updateSize();
        return this;
    }
}
exports.Bound = Bound;


/***/ }),

/***/ "./src/Space.ts":
/*!**********************!*\
  !*** ./src/Space.ts ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/*! Source code licensed under Apache License 2.0. Copyright © 2017-current William Ngan and contributors. (https://github.com/williamngan/pts) */
Object.defineProperty(exports, "__esModule", { value: true });
exports.MultiTouchSpace = exports.Space = void 0;
const Pt_1 = __webpack_require__(/*! ./Pt */ "./src/Pt.ts");
const UI_1 = __webpack_require__(/*! ./UI */ "./src/UI.ts");
class Space {
    constructor() {
        this.id = "space";
        this.bound = new Pt_1.Bound();
        this._time = { prev: 0, diff: 0, end: -1 };
        this.players = {};
        this.playerCount = 0;
        this._animID = -1;
        this._pause = false;
        this._refresh = undefined;
        this._pointer = new Pt_1.Pt();
        this._isReady = false;
        this._playing = false;
    }
    refresh(b) {
        this._refresh = b;
        return this;
    }
    add(p) {
        let player = (typeof p == "function") ? { animate: p } : p;
        let k = this.playerCount++;
        let pid = this.id + k;
        this.players[pid] = player;
        player.animateID = pid;
        if (player.resize && this.bound.inited)
            player.resize(this.bound);
        if (this._refresh === undefined)
            this._refresh = true;
        return this;
    }
    remove(player) {
        delete this.players[player.animateID];
        return this;
    }
    removeAll() {
        this.players = {};
        return this;
    }
    play(time = 0) {
        if (time === 0 && this._animID !== -1) {
            return;
        }
        this._animID = requestAnimationFrame(this.play.bind(this));
        if (this._pause)
            return this;
        this._time.diff = time - this._time.prev;
        this._time.prev = time;
        try {
            this.playItems(time);
        }
        catch (err) {
            cancelAnimationFrame(this._animID);
            this._animID = -1;
            this._playing = false;
            throw err;
        }
        return this;
    }
    replay() {
        this._time.end = -1;
        this.play();
    }
    playItems(time) {
        this._playing = true;
        if (this._refresh)
            this.clear();
        if (this._isReady) {
            for (let k in this.players) {
                if (this.players[k].animate)
                    this.players[k].animate(time, this._time.diff, this);
            }
        }
        if (this._time.end >= 0 && time > this._time.end) {
            cancelAnimationFrame(this._animID);
            this._animID = -1;
            this._playing = false;
        }
    }
    pause(toggle = false) {
        this._pause = (toggle) ? !this._pause : true;
        return this;
    }
    resume() {
        this._pause = false;
        return this;
    }
    stop(t = 0) {
        this._time.end = t;
        return this;
    }
    playOnce(duration = 5000) {
        this.play();
        this.stop(duration);
        return this;
    }
    render(context) {
        if (this._renderFunc)
            this._renderFunc(context, this);
        return this;
    }
    set customRendering(f) { this._renderFunc = f; }
    get customRendering() { return this._renderFunc; }
    get isPlaying() { return this._playing; }
    get outerBound() { return this.bound.clone(); }
    get innerBound() { return new Pt_1.Bound(Pt_1.Pt.make(this.size.length, 0), this.size.clone()); }
    get size() { return this.bound.size.clone(); }
    get center() { return this.size.divide(2); }
    get width() { return this.bound.width; }
    get height() { return this.bound.height; }
}
exports.Space = Space;
class MultiTouchSpace extends Space {
    constructor() {
        super(...arguments);
        this._pressed = false;
        this._dragged = false;
        this._hasMouse = false;
        this._hasTouch = false;
    }
    get pointer() {
        let p = this._pointer.clone();
        p.id = this._pointer.id;
        return p;
    }
    bindCanvas(evt, callback, options = {}) {
        this._canvas.addEventListener(evt, callback, options);
    }
    unbindCanvas(evt, callback) {
        this._canvas.removeEventListener(evt, callback);
    }
    bindMouse(_bind = true) {
        if (_bind) {
            this.bindCanvas("mousedown", this._mouseDown.bind(this));
            this.bindCanvas("mouseup", this._mouseUp.bind(this));
            this.bindCanvas("mouseover", this._mouseOver.bind(this));
            this.bindCanvas("mouseout", this._mouseOut.bind(this));
            this.bindCanvas("mousemove", this._mouseMove.bind(this));
            this.bindCanvas("click", this._mouseClick.bind(this));
            this.bindCanvas("contextmenu", this._contextMenu.bind(this));
            this._hasMouse = true;
        }
        else {
            this.unbindCanvas("mousedown", this._mouseDown.bind(this));
            this.unbindCanvas("mouseup", this._mouseUp.bind(this));
            this.unbindCanvas("mouseover", this._mouseOver.bind(this));
            this.unbindCanvas("mouseout", this._mouseOut.bind(this));
            this.unbindCanvas("mousemove", this._mouseMove.bind(this));
            this.unbindCanvas("click", this._mouseClick.bind(this));
            this.unbindCanvas("contextmenu", this._contextMenu.bind(this));
            this._hasMouse = false;
        }
        return this;
    }
    bindTouch(_bind = true) {
        if (_bind) {
            this.bindCanvas("touchstart", this._touchStart.bind(this), { passive: true });
            this.bindCanvas("touchend", this._mouseUp.bind(this));
            this.bindCanvas("touchmove", this._touchMove.bind(this), { passive: true });
            this.bindCanvas("touchcancel", this._mouseOut.bind(this));
            this._hasTouch = true;
        }
        else {
            this.unbindCanvas("touchstart", this._touchStart.bind(this));
            this.unbindCanvas("touchend", this._mouseUp.bind(this));
            this.unbindCanvas("touchmove", this._touchMove.bind(this));
            this.unbindCanvas("touchcancel", this._mouseOut.bind(this));
            this._hasTouch = false;
        }
        return this;
    }
    touchesToPoints(evt, which = "touches") {
        if (!evt || !evt[which])
            return [];
        let ts = [];
        for (var i = 0; i < evt[which].length; i++) {
            let t = evt[which].item(i);
            ts.push(new Pt_1.Pt(t.pageX - this.bound.topLeft.x, t.pageY - this.bound.topLeft.y));
        }
        return ts;
    }
    _mouseAction(type, evt) {
        let px = 0, py = 0;
        if (evt instanceof MouseEvent) {
            for (let k in this.players) {
                if (this.players.hasOwnProperty(k)) {
                    let v = this.players[k];
                    px = evt.pageX - this.outerBound.x;
                    py = evt.pageY - this.outerBound.y;
                    if (v.action)
                        v.action(type, px, py, evt);
                }
            }
        }
        else {
            for (let k in this.players) {
                if (this.players.hasOwnProperty(k)) {
                    let v = this.players[k];
                    let c = evt.changedTouches && evt.changedTouches.length > 0;
                    let touch = evt.changedTouches.item(0);
                    px = (c) ? touch.pageX - this.outerBound.x : 0;
                    py = (c) ? touch.pageY - this.outerBound.y : 0;
                    if (v.action)
                        v.action(type, px, py, evt);
                }
            }
        }
        if (type) {
            this._pointer.to(px, py);
            this._pointer.id = type;
        }
    }
    _mouseDown(evt) {
        this._mouseAction(UI_1.UIPointerActions.down, evt);
        this._pressed = true;
        return false;
    }
    _mouseUp(evt) {
        if (this._dragged) {
            this._mouseAction(UI_1.UIPointerActions.drop, evt);
        }
        else {
            this._mouseAction(UI_1.UIPointerActions.up, evt);
        }
        this._pressed = false;
        this._dragged = false;
        return false;
    }
    _mouseMove(evt) {
        this._mouseAction(UI_1.UIPointerActions.move, evt);
        if (this._pressed) {
            this._dragged = true;
            this._mouseAction(UI_1.UIPointerActions.drag, evt);
        }
        return false;
    }
    _mouseOver(evt) {
        this._mouseAction(UI_1.UIPointerActions.over, evt);
        return false;
    }
    _mouseOut(evt) {
        this._mouseAction(UI_1.UIPointerActions.out, evt);
        if (this._dragged)
            this._mouseAction(UI_1.UIPointerActions.drop, evt);
        this._dragged = false;
        return false;
    }
    _mouseClick(evt) {
        this._mouseAction(UI_1.UIPointerActions.click, evt);
        this._pressed = false;
        this._dragged = false;
        return false;
    }
    _contextMenu(evt) {
        this._mouseAction(UI_1.UIPointerActions.contextmenu, evt);
        return false;
    }
    _touchMove(evt) {
        this._mouseMove(evt);
        evt.preventDefault();
        return false;
    }
    _touchStart(evt) {
        this._mouseDown(evt);
        evt.preventDefault();
        return false;
    }
}
exports.MultiTouchSpace = MultiTouchSpace;


/***/ }),

/***/ "./src/Svg.ts":
/*!********************!*\
  !*** ./src/Svg.ts ***!
  \********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/*! Source code licensed under Apache License 2.0. Copyright © 2017-current William Ngan and contributors. (https://github.com/williamngan/pts) */
Object.defineProperty(exports, "__esModule", { value: true });
exports.SVGForm = exports.SVGSpace = void 0;
const Form_1 = __webpack_require__(/*! ./Form */ "./src/Form.ts");
const Num_1 = __webpack_require__(/*! ./Num */ "./src/Num.ts");
const Util_1 = __webpack_require__(/*! ./Util */ "./src/Util.ts");
const Pt_1 = __webpack_require__(/*! ./Pt */ "./src/Pt.ts");
const Op_1 = __webpack_require__(/*! ./Op */ "./src/Op.ts");
const Dom_1 = __webpack_require__(/*! ./Dom */ "./src/Dom.ts");
class SVGSpace extends Dom_1.DOMSpace {
    constructor(elem, callback) {
        super(elem, callback);
        this._bgcolor = "#999";
        if (this._canvas.nodeName.toLowerCase() != "svg") {
            let s = SVGSpace.svgElement(this._canvas, "svg", `${this.id}_svg`);
            this._container = this._canvas;
            this._canvas = s;
        }
    }
    getForm() { return new SVGForm(this); }
    get element() {
        return this._canvas;
    }
    resize(b, evt) {
        super.resize(b, evt);
        SVGSpace.setAttr(this.element, {
            "viewBox": `0 0 ${this.bound.width} ${this.bound.height}`,
            "width": `${this.bound.width}`,
            "height": `${this.bound.height}`,
            "xmlns": "http://www.w3.org/2000/svg",
            "version": "1.1"
        });
        return this;
    }
    static svgElement(parent, name, id) {
        if (!parent || !parent.appendChild)
            throw new Error("parent is not a valid DOM element");
        let elem = document.querySelector(`#${id}`);
        if (!elem) {
            elem = document.createElementNS("http://www.w3.org/2000/svg", name);
            elem.setAttribute("id", id);
            parent.appendChild(elem);
        }
        return elem;
    }
    remove(player) {
        let temp = this._container.querySelectorAll("." + SVGForm.scopeID(player));
        temp.forEach((el) => {
            el.parentNode.removeChild(el);
        });
        return super.remove(player);
    }
    removeAll() {
        this._container.innerHTML = "";
        return super.removeAll();
    }
}
exports.SVGSpace = SVGSpace;
class SVGForm extends Form_1.VisualForm {
    constructor(space) {
        super();
        this._style = {
            "filled": true,
            "stroked": true,
            "fill": "#f03",
            "stroke": "#fff",
            "stroke-width": 1,
            "stroke-linejoin": "bevel",
            "stroke-linecap": "sqaure",
            "opacity": 1
        };
        this._ctx = {
            group: null,
            groupID: "pts",
            groupCount: 0,
            currentID: "pts0",
            currentClass: "",
            style: {},
        };
        this._ready = false;
        this._space = space;
        this._space.add({ start: () => {
                this._ctx.group = this._space.element;
                this._ctx.groupID = "pts_svg_" + (SVGForm.groupID++);
                this._ctx.style = Object.assign({}, this._style);
                this._ready = true;
            } });
    }
    get space() { return this._space; }
    styleTo(k, v) {
        if (this._ctx.style[k] === undefined)
            throw new Error(`${k} style property doesn't exist`);
        this._ctx.style[k] = v;
    }
    alpha(a) {
        this.styleTo("opacity", a);
        return this;
    }
    fill(c) {
        if (typeof c == "boolean") {
            this.styleTo("filled", c);
        }
        else {
            this.styleTo("filled", true);
            this.styleTo("fill", c);
        }
        return this;
    }
    stroke(c, width, linejoin, linecap) {
        if (typeof c == "boolean") {
            this.styleTo("stroked", c);
        }
        else {
            this.styleTo("stroked", true);
            this.styleTo("stroke", c);
            if (width)
                this.styleTo("stroke-width", width);
            if (linejoin)
                this.styleTo("stroke-linejoin", linejoin);
            if (linecap)
                this.styleTo("stroke-linecap", linecap);
        }
        return this;
    }
    cls(c) {
        if (typeof c == "boolean") {
            this._ctx.currentClass = "";
        }
        else {
            this._ctx.currentClass = c;
        }
        return this;
    }
    font(sizeOrFont, weight, style, lineHeight, family) {
        if (typeof sizeOrFont == "number") {
            this._font.size = sizeOrFont;
            if (family)
                this._font.face = family;
            if (weight)
                this._font.weight = weight;
            if (style)
                this._font.style = style;
            if (lineHeight)
                this._font.lineHeight = lineHeight;
        }
        else {
            this._font = sizeOrFont;
        }
        this._ctx.style['font'] = this._font.value;
        return this;
    }
    reset() {
        this._ctx.style = Object.assign({}, this._style);
        this._font = new Form_1.Font(10, "sans-serif");
        this._ctx.style['font'] = this._font.value;
        return this;
    }
    updateScope(group_id, group) {
        this._ctx.group = group;
        this._ctx.groupID = group_id;
        this._ctx.groupCount = 0;
        this.nextID();
        return this._ctx;
    }
    scope(item) {
        if (!item || item.animateID == null)
            throw new Error("item not defined or not yet added to Space");
        return this.updateScope(SVGForm.scopeID(item), this.space.element);
    }
    nextID() {
        this._ctx.groupCount++;
        this._ctx.currentID = `${this._ctx.groupID}-${this._ctx.groupCount}`;
        return this._ctx.currentID;
    }
    static getID(ctx) {
        return ctx.currentID || `p-${SVGForm.domID++}`;
    }
    static scopeID(item) {
        return `item-${item.animateID}`;
    }
    static style(elem, styles) {
        let st = [];
        if (!styles["filled"])
            st.push("fill: none");
        if (!styles["stroked"])
            st.push("stroke: none");
        for (let k in styles) {
            if (styles.hasOwnProperty(k) && k != "filled" && k != "stroked") {
                let v = styles[k];
                if (v) {
                    if (!styles["filled"] && k.indexOf('fill') === 0) {
                        continue;
                    }
                    else if (!styles["stroked"] && k.indexOf('stroke') === 0) {
                        continue;
                    }
                    else {
                        st.push(`${k}: ${v}`);
                    }
                }
            }
        }
        return Dom_1.DOMSpace.setAttr(elem, { style: st.join(";") });
    }
    static point(ctx, pt, radius = 5, shape = "square") {
        if (shape === "circle") {
            return SVGForm.circle(ctx, pt, radius);
        }
        else {
            return SVGForm.square(ctx, pt, radius);
        }
    }
    point(pt, radius = 5, shape = "square") {
        this.nextID();
        SVGForm.point(this._ctx, pt, radius, shape);
        return this;
    }
    static circle(ctx, pt, radius = 10) {
        let elem = SVGSpace.svgElement(ctx.group, "circle", SVGForm.getID(ctx));
        Dom_1.DOMSpace.setAttr(elem, {
            cx: pt[0],
            cy: pt[1],
            r: radius,
            'class': `pts-svgform pts-circle ${ctx.currentClass}`,
        });
        SVGForm.style(elem, ctx.style);
        return elem;
    }
    circle(pts) {
        this.nextID();
        let p = Util_1.Util.iterToArray(pts);
        SVGForm.circle(this._ctx, p[0], p[1][0]);
        return this;
    }
    static arc(ctx, pt, radius, startAngle, endAngle, cc) {
        let elem = SVGSpace.svgElement(ctx.group, "path", SVGForm.getID(ctx));
        const start = new Pt_1.Pt(pt).toAngle(startAngle, radius, true);
        const end = new Pt_1.Pt(pt).toAngle(endAngle, radius, true);
        const diff = Num_1.Geom.boundAngle(endAngle) - Num_1.Geom.boundAngle(startAngle);
        let largeArc = (diff > Util_1.Const.pi) ? true : false;
        if (cc)
            largeArc = !largeArc;
        const sweep = (cc) ? "0" : "1";
        const d = `M ${start[0]} ${start[1]} A ${radius} ${radius} 0 ${largeArc ? "1" : "0"} ${sweep} ${end[0]} ${end[1]}`;
        Dom_1.DOMSpace.setAttr(elem, {
            d: d,
            'class': `pts-svgform pts-arc ${ctx.currentClass}`,
        });
        SVGForm.style(elem, ctx.style);
        return elem;
    }
    arc(pt, radius, startAngle, endAngle, cc) {
        this.nextID();
        SVGForm.arc(this._ctx, pt, radius, startAngle, endAngle, cc);
        return this;
    }
    static square(ctx, pt, halfsize) {
        let elem = SVGSpace.svgElement(ctx.group, "rect", SVGForm.getID(ctx));
        Dom_1.DOMSpace.setAttr(elem, {
            x: pt[0] - halfsize,
            y: pt[1] - halfsize,
            width: halfsize * 2,
            height: halfsize * 2,
            'class': `pts-svgform pts-square ${ctx.currentClass}`,
        });
        SVGForm.style(elem, ctx.style);
        return elem;
    }
    square(pt, halfsize) {
        this.nextID();
        SVGForm.square(this._ctx, pt, halfsize);
        return this;
    }
    static line(ctx, pts) {
        let points = SVGForm.pointsString(pts);
        if (points.count < 2)
            return;
        if (points.count > 2)
            return SVGForm._poly(ctx, points.string, false);
        let elem = SVGSpace.svgElement(ctx.group, "line", SVGForm.getID(ctx));
        let p = Util_1.Util.iterToArray(pts);
        Dom_1.DOMSpace.setAttr(elem, {
            x1: p[0][0],
            y1: p[0][1],
            x2: p[1][0],
            y2: p[1][1],
            'class': `pts-svgform pts-line ${ctx.currentClass}`,
        });
        SVGForm.style(elem, ctx.style);
        return elem;
    }
    line(pts) {
        this.nextID();
        SVGForm.line(this._ctx, pts);
        return this;
    }
    static _poly(ctx, points, closePath = true) {
        let elem = SVGSpace.svgElement(ctx.group, ((closePath) ? "polygon" : "polyline"), SVGForm.getID(ctx));
        Dom_1.DOMSpace.setAttr(elem, {
            points: points,
            'class': `pts-svgform pts-polygon ${ctx.currentClass}`,
        });
        SVGForm.style(elem, ctx.style);
        return elem;
    }
    static pointsString(pts) {
        let points = "";
        let count = 0;
        for (let p of pts) {
            points += `${p[0]},${p[1]} `;
            count++;
        }
        return { string: points, count: count };
    }
    static polygon(ctx, pts) {
        let points = SVGForm.pointsString(pts);
        return SVGForm._poly(ctx, points.string, true);
    }
    polygon(pts) {
        this.nextID();
        SVGForm.polygon(this._ctx, pts);
        return this;
    }
    static rect(ctx, pts) {
        if (!Util_1.Util.arrayCheck(pts))
            return;
        let elem = SVGSpace.svgElement(ctx.group, "rect", SVGForm.getID(ctx));
        let bound = Pt_1.Group.fromArray(pts).boundingBox();
        let size = Op_1.Rectangle.size(bound);
        Dom_1.DOMSpace.setAttr(elem, {
            x: bound[0][0],
            y: bound[0][1],
            width: size[0],
            height: size[1],
            'class': `pts-svgform pts-rect ${ctx.currentClass}`,
        });
        SVGForm.style(elem, ctx.style);
        return elem;
    }
    rect(pts) {
        this.nextID();
        SVGForm.rect(this._ctx, pts);
        return this;
    }
    static text(ctx, pt, txt) {
        let elem = SVGSpace.svgElement(ctx.group, "text", SVGForm.getID(ctx));
        Dom_1.DOMSpace.setAttr(elem, {
            "pointer-events": "none",
            x: pt[0],
            y: pt[1],
            dx: 0, dy: 0,
            'class': `pts-svgform pts-text ${ctx.currentClass}`,
        });
        elem.textContent = txt;
        SVGForm.style(elem, ctx.style);
        return elem;
    }
    text(pt, txt) {
        this.nextID();
        SVGForm.text(this._ctx, pt, txt);
        return this;
    }
    log(txt) {
        this.fill("#000").stroke("#fff", 0.5).text([10, 14], txt);
        return this;
    }
}
exports.SVGForm = SVGForm;
SVGForm.groupID = 0;
SVGForm.domID = 0;


/***/ }),

/***/ "./src/Types.ts":
/*!**********************!*\
  !*** ./src/Types.ts ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/*! Source code licensed under Apache License 2.0. Copyright © 2017-current William Ngan and contributors. (https://github.com/williamngan/pts) */
Object.defineProperty(exports, "__esModule", { value: true });


/***/ }),

/***/ "./src/Typography.ts":
/*!***************************!*\
  !*** ./src/Typography.ts ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/*! Source code licensed under Apache License 2.0. Copyright © 2017-current William Ngan and contributors. (https://github.com/williamngan/pts) */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Typography = void 0;
const Pt_1 = __webpack_require__(/*! ./Pt */ "./src/Pt.ts");
class Typography {
    static textWidthEstimator(fn, samples = ["M", "n", "."], distribution = [0.06, 0.8, 0.14]) {
        let m = samples.map(fn);
        let avg = new Pt_1.Pt(distribution).dot(m);
        return (str) => str.length * avg;
    }
    static truncate(fn, str, width, tail = "") {
        let trim = Math.floor(str.length * Math.min(1, width / fn(str)));
        if (trim < str.length) {
            trim = Math.max(0, trim - tail.length);
            return [str.substr(0, trim) + tail, trim];
        }
        else {
            return [str, str.length];
        }
    }
    static fontSizeToBox(box, ratio = 1, byHeight = true) {
        let bound = Pt_1.Bound.fromGroup(box);
        let h = byHeight ? bound.height : bound.width;
        let f = ratio * h;
        return function (box2) {
            let bound2 = Pt_1.Bound.fromGroup(box2);
            let nh = (byHeight ? bound2.height : bound2.width) / h;
            return f * nh;
        };
    }
    static fontSizeToThreshold(threshold, direction = 0) {
        return function (defaultSize, val) {
            let d = defaultSize * val / threshold;
            if (direction < 0)
                return Math.min(d, defaultSize);
            if (direction > 0)
                return Math.max(d, defaultSize);
            return d;
        };
    }
}
exports.Typography = Typography;


/***/ }),

/***/ "./src/UI.ts":
/*!*******************!*\
  !*** ./src/UI.ts ***!
  \*******************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/*! Source code licensed under Apache License 2.0. Copyright © 2017-current William Ngan and contributors. (https://github.com/williamngan/pts) */
Object.defineProperty(exports, "__esModule", { value: true });
exports.UIDragger = exports.UIButton = exports.UI = exports.UIPointerActions = exports.UIShape = void 0;
const Pt_1 = __webpack_require__(/*! ./Pt */ "./src/Pt.ts");
const Op_1 = __webpack_require__(/*! ./Op */ "./src/Op.ts");
exports.UIShape = {
    rectangle: "rectangle", circle: "circle", polygon: "polygon", polyline: "polyline", line: "line"
};
exports.UIPointerActions = {
    up: "up", down: "down", move: "move", drag: "drag", uidrag: "uidrag", drop: "drop", uidrop: "uidrop", over: "over", out: "out", enter: "enter", leave: "leave", click: "click", contextmenu: "contextmenu", all: "all"
};
class UI {
    constructor(group, shape, states = {}, id) {
        this._holds = new Map();
        this._group = Pt_1.Group.fromArray(group);
        this._shape = shape;
        this._id = id === undefined ? `ui_${(UI._counter++)}` : id;
        this._states = states;
        this._actions = {};
    }
    static fromRectangle(group, states, id) {
        return new this(group, exports.UIShape.rectangle, states, id);
    }
    static fromCircle(group, states, id) {
        return new this(group, exports.UIShape.circle, states, id);
    }
    static fromPolygon(group, states, id) {
        return new this(group, exports.UIShape.polygon, states, id);
    }
    static fromUI(ui, states, id) {
        return new this(ui.group, ui.shape, states || ui._states, id);
    }
    get id() { return this._id; }
    set id(d) { this._id = d; }
    get group() { return this._group; }
    set group(d) { this._group = d; }
    get shape() { return this._shape; }
    set shape(d) { this._shape = d; }
    state(key, value) {
        if (!key)
            return null;
        if (value !== undefined) {
            this._states[key] = value;
            return this;
        }
        return this._states[key];
    }
    on(type, fn) {
        if (!this._actions[type])
            this._actions[type] = [];
        return UI._addHandler(this._actions[type], fn);
    }
    off(type, which) {
        if (!this._actions[type])
            return false;
        if (which === undefined) {
            delete this._actions[type];
            return true;
        }
        else {
            return UI._removeHandler(this._actions[type], which);
        }
    }
    listen(type, p, evt) {
        if (this._actions[type] !== undefined) {
            if (this._within(p) || Array.from(this._holds.values()).indexOf(type) >= 0) {
                UI._trigger(this._actions[type], this, p, type, evt);
                return true;
            }
            else if (this._actions['all']) {
                UI._trigger(this._actions['all'], this, p, type, evt);
                return true;
            }
        }
        return false;
    }
    hold(type) {
        let newKey = Math.max(0, ...Array.from(this._holds.keys())) + 1;
        this._holds.set(newKey, type);
        return newKey;
    }
    unhold(key) {
        if (key !== undefined) {
            this._holds.delete(key);
        }
        else {
            this._holds.clear();
        }
    }
    static track(uis, type, p, evt) {
        for (let i = 0, len = uis.length; i < len; i++) {
            uis[i].listen(type, p, evt);
        }
    }
    render(fn) {
        fn(this._group, this._states);
    }
    toString() {
        return `UI ${this.group.toString}`;
    }
    _within(p) {
        let fn = null;
        if (this._shape === exports.UIShape.rectangle) {
            fn = Op_1.Rectangle.withinBound;
        }
        else if (this._shape === exports.UIShape.circle) {
            fn = Op_1.Circle.withinBound;
        }
        else if (this._shape === exports.UIShape.polygon) {
            fn = Op_1.Polygon.hasIntersectPoint;
        }
        else {
            return false;
        }
        return fn(this._group, p);
    }
    static _trigger(fns, target, pt, type, evt) {
        if (fns) {
            for (let i = 0, len = fns.length; i < len; i++) {
                if (fns[i])
                    fns[i](target, pt, type, evt);
            }
        }
    }
    static _addHandler(fns, fn) {
        if (fn) {
            fns.push(fn);
            return fns.length - 1;
        }
        else {
            return -1;
        }
    }
    static _removeHandler(fns, index) {
        if (index >= 0 && index < fns.length) {
            let temp = fns.length;
            fns.splice(index, 1);
            return (temp > fns.length);
        }
        else {
            return false;
        }
    }
}
exports.UI = UI;
UI._counter = 0;
class UIButton extends UI {
    constructor(group, shape, states = {}, id) {
        super(group, shape, states, id);
        this._hoverID = -1;
        if (states.hover === undefined)
            this._states['hover'] = false;
        if (states.clicks === undefined)
            this._states['clicks'] = 0;
        const UA = exports.UIPointerActions;
        this.on(UA.up, (target, pt, type, evt) => {
            this.state('clicks', this._states.clicks + 1);
        });
        this.on(UA.move, (target, pt, type, evt) => {
            let hover = this._within(pt);
            if (hover && !this._states.hover) {
                this.state('hover', true);
                UI._trigger(this._actions[UA.enter], this, pt, UA.enter, evt);
                var _capID = this.hold(UA.move);
                this._hoverID = this.on(UA.move, (t, p) => {
                    if (!this._within(p) && !this.state('dragging')) {
                        this.state('hover', false);
                        UI._trigger(this._actions[UA.leave], this, pt, UA.leave, evt);
                        this.off(UA.move, this._hoverID);
                        this.unhold(_capID);
                    }
                });
            }
        });
    }
    onClick(fn) {
        return this.on(exports.UIPointerActions.up, fn);
    }
    offClick(id) {
        return this.off(exports.UIPointerActions.up, id);
    }
    onContextMenu(fn) {
        return this.on(exports.UIPointerActions.contextmenu, fn);
    }
    offContextMenu(id) {
        return this.off(exports.UIPointerActions.contextmenu, id);
    }
    onHover(enter, leave) {
        var ids = [undefined, undefined];
        if (enter)
            ids[0] = this.on(exports.UIPointerActions.enter, enter);
        if (leave)
            ids[1] = this.on(exports.UIPointerActions.leave, leave);
        return ids;
    }
    offHover(enterID, leaveID) {
        var s = [false, false];
        if (enterID === undefined || enterID >= 0)
            s[0] = this.off(exports.UIPointerActions.enter, enterID);
        if (leaveID === undefined || leaveID >= 0)
            s[1] = this.off(exports.UIPointerActions.leave, leaveID);
        return s;
    }
}
exports.UIButton = UIButton;
class UIDragger extends UIButton {
    constructor(group, shape, states = {}, id) {
        super(group, shape, states, id);
        this._draggingID = -1;
        this._moveHoldID = -1;
        this._dropHoldID = -1;
        this._upHoldID = -1;
        if (states.dragging === undefined)
            this._states['dragging'] = false;
        if (states.moved === undefined)
            this._states['moved'] = false;
        if (states.offset === undefined)
            this._states['offset'] = new Pt_1.Pt();
        const UA = exports.UIPointerActions;
        this.on(UA.down, (target, pt, type, evt) => {
            if (this._moveHoldID === -1) {
                this.state('dragging', true);
                this.state('offset', new Pt_1.Pt(pt).subtract(target.group[0]));
                this._moveHoldID = this.hold(UA.move);
            }
            if (this._dropHoldID === -1) {
                this._dropHoldID = this.hold(UA.drop);
            }
            if (this._upHoldID === -1) {
                this._upHoldID = this.hold(UA.up);
            }
            if (this._draggingID === -1) {
                this._draggingID = this.on(UA.move, (t, p) => {
                    if (this.state('dragging')) {
                        UI._trigger(this._actions[UA.uidrag], t, p, UA.uidrag, evt);
                        this.state('moved', true);
                    }
                });
            }
        });
        const endDrag = (target, pt, type, evt) => {
            this.state('dragging', false);
            this.off(UA.move, this._draggingID);
            this._draggingID = -1;
            this.unhold(this._moveHoldID);
            this._moveHoldID = -1;
            this.unhold(this._dropHoldID);
            this._dropHoldID = -1;
            this.unhold(this._upHoldID);
            this._upHoldID = -1;
            if (this.state('moved')) {
                UI._trigger(this._actions[UA.uidrop], target, pt, UA.uidrop, evt);
                this.state('moved', false);
            }
        };
        this.on(UA.drop, endDrag);
        this.on(UA.up, endDrag);
        this.on(UA.out, endDrag);
    }
    onDrag(fn) {
        return this.on(exports.UIPointerActions.uidrag, fn);
    }
    offDrag(id) {
        return this.off(exports.UIPointerActions.uidrag, id);
    }
    onDrop(fn) {
        return this.on(exports.UIPointerActions.uidrop, fn);
    }
    offDrop(id) {
        return this.off(exports.UIPointerActions.uidrop, id);
    }
}
exports.UIDragger = UIDragger;


/***/ }),

/***/ "./src/Util.ts":
/*!*********************!*\
  !*** ./src/Util.ts ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/*! Source code licensed under Apache License 2.0. Copyright © 2017-current William Ngan and contributors. (https://github.com/williamngan/pts) */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Util = exports.Const = void 0;
const Pt_1 = __webpack_require__(/*! ./Pt */ "./src/Pt.ts");
exports.Const = {
    xy: "xy",
    yz: "yz",
    xz: "xz",
    xyz: "xyz",
    horizontal: 0,
    vertical: 1,
    identical: 0,
    right: 4,
    bottom_right: 5,
    bottom: 6,
    bottom_left: 7,
    left: 8,
    top_left: 1,
    top: 2,
    top_right: 3,
    epsilon: 0.0001,
    max: Number.MAX_VALUE,
    min: Number.MIN_VALUE,
    pi: Math.PI,
    two_pi: 6.283185307179586,
    half_pi: 1.5707963267948966,
    quarter_pi: 0.7853981633974483,
    one_degree: 0.017453292519943295,
    rad_to_deg: 57.29577951308232,
    deg_to_rad: 0.017453292519943295,
    gravity: 9.81,
    newton: 0.10197,
    gaussian: 0.3989422804014327
};
class Util {
    static warnLevel(lv) {
        if (lv) {
            Util._warnLevel = lv;
        }
        return Util._warnLevel;
    }
    static getArgs(args) {
        if (args.length < 1)
            return [];
        let pos = [];
        let isArray = Array.isArray(args[0]) || ArrayBuffer.isView(args[0]);
        if (typeof args[0] === 'number') {
            pos = Array.prototype.slice.call(args);
        }
        else if (typeof args[0] === 'object' && !isArray) {
            let a = ["x", "y", "z", "w"];
            let p = args[0];
            for (let i = 0; i < a.length; i++) {
                if ((p.length && i >= p.length) || !(a[i] in p))
                    break;
                pos.push(p[a[i]]);
            }
        }
        else if (isArray) {
            pos = [].slice.call(args[0]);
        }
        return pos;
    }
    static warn(message = "error", defaultReturn = undefined) {
        if (Util.warnLevel() == "error") {
            throw new Error(message);
        }
        else if (Util.warnLevel() == "warn") {
            console.warn(message);
        }
        return defaultReturn;
    }
    static randomInt(range, start = 0) {
        Util.warn("Util.randomInt is deprecated. Please use `Num.randomRange`");
        return Math.floor(Math.random() * range) + start;
    }
    static split(pts, size, stride, loopBack = false, matchSize = true) {
        let chunks = [];
        let part = [];
        let st = stride || size;
        let index = 0;
        if (pts.length <= 0 || st <= 0)
            return [];
        while (index < pts.length) {
            part = [];
            for (let k = 0; k < size; k++) {
                if (loopBack) {
                    part.push(pts[(index + k) % pts.length]);
                }
                else {
                    if (index + k >= pts.length)
                        break;
                    part.push(pts[index + k]);
                }
            }
            index += st;
            if (!matchSize || (matchSize && part.length === size))
                chunks.push(part);
        }
        return chunks;
    }
    static flatten(pts, flattenAsGroup = true) {
        let arr = (flattenAsGroup) ? new Pt_1.Group() : new Array();
        return arr.concat.apply(arr, pts);
    }
    static combine(a, b, op) {
        let result = [];
        for (let i = 0, len = a.length; i < len; i++) {
            for (let k = 0, lenB = b.length; k < lenB; k++) {
                result.push(op(a[i], b[k]));
            }
        }
        return result;
    }
    static zip(arrays) {
        let z = [];
        for (let i = 0, len = arrays[0].length; i < len; i++) {
            let p = [];
            for (let k = 0; k < arrays.length; k++) {
                p.push(arrays[k][i]);
            }
            z.push(p);
        }
        return z;
    }
    static stepper(max, min = 0, stride = 1, callback) {
        let c = min;
        return function () {
            c += stride;
            if (c >= max) {
                c = min + (c - max);
            }
            if (callback)
                callback(c);
            return c;
        };
    }
    static forRange(fn, range, start = 0, step = 1) {
        let temp = [];
        for (let i = start, len = range; i < len; i += step) {
            temp[i] = fn(i);
        }
        return temp;
    }
    static load(url, callback) {
        var request = new XMLHttpRequest();
        request.open('GET', url, true);
        request.onload = function () {
            if (request.status >= 200 && request.status < 400) {
                callback(request.responseText, true);
            }
            else {
                callback(`Server error (${request.status}) when loading "${url}"`, false);
            }
        };
        request.onerror = function () {
            callback(`Unknown network error`, false);
        };
        request.send();
    }
    static performance(avgFrames = 10) {
        let last = Date.now();
        let avg = [];
        return function () {
            const now = Date.now();
            avg.push(now - last);
            if (avg.length >= avgFrames)
                avg.shift();
            last = now;
            return Math.floor(avg.reduce((a, b) => a + b, 0) / avg.length);
        };
    }
    static arrayCheck(pts, minRequired = 2) {
        if (Array.isArray(pts) && pts.length < minRequired) {
            Util.warn(`Requires ${minRequired} or more Pts in this Group.`);
            return false;
        }
        return true;
    }
    static iterToArray(it) {
        return (!Array.isArray(it)) ? [...it] : it;
    }
    static isMobile() {
        return /iPhone|iPad|Android/i.test(navigator.userAgent);
    }
}
exports.Util = Util;
Util._warnLevel = "mute";


/***/ }),

/***/ "./src/_lib.ts":
/*!*********************!*\
  !*** ./src/_lib.ts ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.quickStart = exports.namespace = void 0;
__exportStar(__webpack_require__(/*! ./Canvas */ "./src/Canvas.ts"), exports);
__exportStar(__webpack_require__(/*! ./Create */ "./src/Create.ts"), exports);
__exportStar(__webpack_require__(/*! ./Form */ "./src/Form.ts"), exports);
__exportStar(__webpack_require__(/*! ./LinearAlgebra */ "./src/LinearAlgebra.ts"), exports);
__exportStar(__webpack_require__(/*! ./Num */ "./src/Num.ts"), exports);
__exportStar(__webpack_require__(/*! ./Op */ "./src/Op.ts"), exports);
__exportStar(__webpack_require__(/*! ./Pt */ "./src/Pt.ts"), exports);
__exportStar(__webpack_require__(/*! ./Space */ "./src/Space.ts"), exports);
__exportStar(__webpack_require__(/*! ./Color */ "./src/Color.ts"), exports);
__exportStar(__webpack_require__(/*! ./Util */ "./src/Util.ts"), exports);
__exportStar(__webpack_require__(/*! ./Dom */ "./src/Dom.ts"), exports);
__exportStar(__webpack_require__(/*! ./Svg */ "./src/Svg.ts"), exports);
__exportStar(__webpack_require__(/*! ./Typography */ "./src/Typography.ts"), exports);
__exportStar(__webpack_require__(/*! ./Physics */ "./src/Physics.ts"), exports);
__exportStar(__webpack_require__(/*! ./UI */ "./src/UI.ts"), exports);
__exportStar(__webpack_require__(/*! ./Play */ "./src/Play.ts"), exports);
__exportStar(__webpack_require__(/*! ./Image */ "./src/Image.ts"), exports);
__exportStar(__webpack_require__(/*! ./Types */ "./src/Types.ts"), exports);
const _Canvas = __webpack_require__(/*! ./Canvas */ "./src/Canvas.ts");
let namespace = (scope) => {
    let lib = module.exports;
    for (let k in lib) {
        if (k != "namespace") {
            scope[k] = lib[k];
        }
    }
};
exports.namespace = namespace;
let quickStart = (id, bg = "#9ab") => {
    if (!window)
        return;
    let s = window;
    exports.namespace(s);
    s.space = new _Canvas.CanvasSpace(id).setup({ bgcolor: bg, resize: true, retina: true });
    s.form = s.space.getForm();
    return function (animate = null, start = null, action = null, resize = null) {
        s.space.add({
            start: start,
            animate: animate,
            resize: resize,
            action: action,
        });
        s.space.bindMouse().bindTouch().play();
    };
};
exports.quickStart = quickStart;


/***/ })

/******/ });
});
//# sourceMappingURL=pts.js.map