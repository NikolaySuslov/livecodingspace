/*
The MIT License (MIT)
Copyright (c) 2014-2020 Nikolai Suslov and the Krestianstvo.org project contributors. (https://github.com/NikolaySuslov/livecodingspace/blob/master/LICENSE.md)

Virtual World Framework Apache 2.0 license  (https://github.com/NikolaySuslov/livecodingspace/blob/master/licenses/LICENSE_VWF.md)
*/

//
/// vwf/view/editor creates a view interface for editor functions. 
/// 
/// @module vwf/view/editor
/// @requires version
/// @requires vwf/view
/// @requires vwf/utility

import { Widgets } from '/lib/ui/widgets.js';
import { Utility } from '/core/vwf/utility/utility.js';
import { Fabric } from '/core/vwf/fabric.js';

class LCSEditor extends Fabric {

    constructor(module) {

        console.log("Editor constructor");
        super(module, 'View');
        this.widgets = new Widgets;

    }

    factory() {

        let _self_ = this;

        return this.load(this.module,
            {

                // == Module Definition ====================================================================

                initialize: function () {
                    let self = this;
                    this.ace = window.ace;
                    this.widgets = _self_.widgets; //widgets;
                    this.lang = _LangManager.language;
                    this.helpers = _self_.helpers;
                    this.tippy = tippy;

                    this.nodes = {};
                    this.scenes = {};
                    this.allScripts = {};


                    document.querySelector('body').classList.add("editor-body", "mdc-typography");
                    document.querySelector('body').innerHTML +=
                        `<div id="ui-controls" class="guiwindow">

                <button id="hideui"
                    class="mdc-icon-button"
                    role="button" aria-pressed="true">
                    <i class="material-icons mdc-icon-button__icon mdc-icon-button__icon--on">grid_off</i>
                    <i class="material-icons mdc-icon-button__icon">grid_on</i>
                </button>

                <button id="fullscreenui"
                    class="mdc-icon-button"
                    role="button" aria-pressed="true">
                    <i class="material-icons mdc-icon-button__icon mdc-icon-button__icon--on">fullscreen_exit</i>
                    <i class="material-icons mdc-icon-button__icon">fullscreen</i>
                </button>

               <!-- <button id="qrcodeui"
                class="mdc-icon-button"
                role="button" aria-pressed="true">
                <i class="material-icons mdc-icon-button__icon mdc-icon-button__icon--on">qr_code_2</i>
                <i class="material-icons mdc-icon-button__icon">qr_code_2</i>
            </button> -->

                </div>
                `
                    function initOverGUI() {

                        // window.addEventListener("load", function (event) {

                        //   console.log("All resources finished loading!");

                        const iconEl = document.querySelector('#hideui');
                        const compHideUI = new mdc.iconButton.MDCIconButtonToggle(iconEl);
                        compHideUI.listen('MDCIconButtonToggle:change', (e) => {

                            let ui = document.querySelector('.mdc-top-app-bar');
                            if (ui) {

                                let chkAttr = ui.style.visibility; //e.detail.isOn;
                                if (chkAttr == 'hidden') {
                                    ui.style.visibility = 'visible'
                                } else {
                                    ui.style.visibility = 'hidden'
                                }
                            }

                        });

                        const fullScreenToggle = document.querySelector('#fullscreenui');
                        const compfullScreen = new mdc.iconButton.MDCIconButtonToggle(fullScreenToggle);
                        fullScreenToggle.addEventListener('MDCIconButtonToggle:change', (e) => {

                            if (screenfull.enabled) {
                                screenfull.toggle();
                            } else {
                                // Ignore or do something else
                            }
                        });

                        //   const qrEl = document.querySelector('#qrcodeui');
                        //   const compQrUI = new mdc.iconButton.MDCIconButtonToggle(qrEl);
                        //   compQrUI.listen('MDCIconButtonToggle:change', (e) => {

                        //       if(self.qrcodedialog){
                        //         self.qrcodedialog.open();
                        //       }

                        //   });




                    }

                    window.getWorldLink = function () {
                        navigator.clipboard.writeText(window.location.href).then(function () {
                            /* clipboard successfully set */
                            console.log("Got Link successfully!")
                        }, function () {
                            console.log("Got Link failed!")
                            /* clipboard write failed */
                        });
                    }

                    function makeQRCode() {

                        document.querySelector('body').innerHTML += `
                    <div class="mdc-dialog" id="qrcodedialog">
                    <div class="mdc-dialog__container">
                      <div class="mdc-dialog__surface"
                        role="alertdialog"
                        aria-modal="true"
                        aria-labelledby="my-dialog-title"
                        aria-describedby="my-dialog-content">
                        <!-- Title cannot contain leading whitespace due to mdc-typography-baseline-top() -->
                        <h2 class="mdc-dialog__title" id="my-dialog-title">QR Code for this World</h2>
                        <div class="mdc-dialog__content" id="my-dialog-content">
                            <div id="qrcode"></div>
                        </div>
                        <div class="mdc-dialog__actions">
                        <button type="button" class="mdc-button mdc-dialog__button" data-mdc-dialog-action="accept"
                        onclick="getWorldLink()">
                          <div class="mdc-button__ripple"></div>
                          <span class="mdc-button__label">Copy link</span>
                        </button>
                        <button type="button" class="mdc-button mdc-dialog__button" data-mdc-dialog-action="accept">
                          <div class="mdc-button__ripple"></div>
                          <span class="mdc-button__label">OK</span>
                        </button>
                      </div>
                      </div>
                    </div>
                    <div class="mdc-dialog__scrim"></div>
                  </div>
                `
                        self.qrcode = new QRCode(document.getElementById("qrcode"), window.location.href);
                        self.qrcodedialog = new mdc.dialog.MDCDialog(document.getElementById('qrcodedialog'));
                    }

                    mdc.autoInit();


                    // $('body').append('<script>mdc.autoInit()</script>');


                    ["drawer", "toolbar", "sideBar", "propWindow", "clientsWindow", "codeEditorWindow", "propEditorWindow", "viewSceneProps"].forEach(item => {
                        let el = document.createElement("div");
                        el.setAttribute("id", item);
                        document.body.appendChild(el);
                    }
                    );

                    makeQRCode();
                    initOverGUI();

                    _LCSDB.on('auth', function (ack) {
                        if (ack.sea.pub) {
                            self.helpers.checkUserCollision();

                            console.log(_LCSDB.user().is);
                            let loadSave = document.querySelector('#loadSaveSettings');
                            if (loadSave) {

                            }
                            //self.authGUI();
                        }

                    });

                    this.avatarCardDef = function (src, desc, onclickfunc) {

                        return {
                            $cell: true,
                            $type: "div",
                            class: "mdc-card avatar-card",
                            $init: function () {
                                this.style.backgroundImage = 'linear-gradient(0deg, rgba(0, 0, 0, 0.0), rgba(0, 0, 0, 0.0) ), url(' + src + ')'

                            },
                            onclick: onclickfunc,
                            $components: [
                                {
                                    $type: "section",
                                    class: "mdc-card__primary",
                                    style: "padding: 1rem;",
                                    $components: [
                                        {
                                            $type: "h1",
                                            class: "mdc-card__title mdc-typography--title",
                                            $text: desc.subtitle
                                        },
                                        {
                                            $type: "h2",
                                            class: "mdc-typography--subheading1",
                                            $text: desc.title
                                        }
                                    ]
                                },
                                {
                                    $type: "section",
                                    class: "mdc-card__actions",
                                    $components: [
                                        {
                                            $type: "button",
                                            class: "mdc-button mdc-button--compact mdc-card__action",
                                            //$text: "Use it",
                                            onclick: onclickfunc
                                        }
                                    ]
                                }
                            ]
                        }
                    }

                    let createSettings =
                    {
                        $cell: true,
                        $type: "div",
                        class: "propGrid max-width mdc-layout-grid mdc-layout-grid--align-left",
                        $components: [
                            self.widgets.listTitle({ text: 'Primitives' }),
                            {
                                $type: "div",
                                class: "mdc-layout-grid__inner",
                                $components: make3DPrimitiveList()
                            },
                            self.widgets.listTitle({ text: 'Lights' }),
                            {
                                $type: "div",
                                class: "mdc-layout-grid__inner",
                                $components: makeLightsList()
                            },
                            self.widgets.listTitle({ text: 'Objects' }),
                            {
                                $type: "div",
                                class: "mdc-layout-grid__inner",
                                $components: [
                                    self.widgets.gridListItem({
                                        imgSrc: "/drivers/view/editor/images/ui/icons/camera.png",
                                        title: 'Camera',
                                        imgSize: '30px',
                                        styleClass: "",
                                        onclickfunc: function () {
                                            let avatarID = 'avatar-' + vwf.moniker_;
                                            //let cubeName = self.GUID();
                                            vwf_view.kernel.callMethod(vwf.application(), "createCamera", [null, null, avatarID])
                                            //let cubeName = self.GUID();
                                            // vwf_view.kernel.callMethod(vwf.application(), "createFloor")
                                        }

                                    }),
                                    self.widgets.gridListItem({
                                        imgSrc: "/drivers/view/editor/images/ui/icons/camera_offset.png",
                                        title: 'Camera with view offset',
                                        imgSize: '30px',
                                        styleClass: "",
                                        onclickfunc: function () {
                                            let avatarID = 'avatar-' + vwf.moniker_;
                                            //let cubeName = self.GUID();
                                            vwf_view.kernel.callMethod(vwf.application(), "createCameraWithOffset", [null, null, avatarID])
                                            //let cubeName = self.GUID();
                                            // vwf_view.kernel.callMethod(vwf.application(), "createFloor")
                                        }
                                    }),
                                    self.widgets.gridListItem({
                                        imgSrc: "/drivers/view/editor/images/ui/icons/mirror.png",
                                        title: 'Mirror',
                                        imgSize: '30px',
                                        styleClass: "",
                                        onclickfunc: function () {
                                            let avatarID = 'avatar-' + vwf.moniker_;
                                            //let cubeName = self.GUID();
                                            vwf_view.kernel.callMethod(vwf.application(), "createMirror", [null, null, avatarID])
                                            //let cubeName = self.GUID();
                                            // vwf_view.kernel.callMethod(vwf.application(), "createFloor")
                                        }

                                    }),
                                    self.widgets.gridListItemWithIco({
                                        imgSrc: "schedule",
                                        title: 'Clock',
                                        imgSize: '30px',
                                        styleClass: "",
                                        onclickfunc: function () {
                                            let avatarID = 'avatar-' + vwf.moniker_;
                                            vwf_view.kernel.callMethod(vwf.application(), "createClock", [null, avatarID])
                                        }

                                    })


                                ]
                            },
                            self.widgets.listTitle({ text: 'Assets' }),
                            {
                                $type: "div",
                                class: "mdc-layout-grid__inner",
                                $components: [
                                    {
                                        $type: "div",
                                        class: "mdc-layout-grid__cell mdc-layout-grid__cell--span-12",
                                        $components: [
                                            self.widgets.inputTextFieldOutlined({
                                                "id": 'assetsrc',
                                                "fieldStyle": 'width: 350px',
                                                "label": "Enter URL to asset source",
                                                "value": '',
                                                "change": function (e) {
                                                    console.log(this.value)
                                                }
                                            })
                                        ]
                                    }

                                ]
                            },
                            {
                                $type: "div",
                                class: "mdc-layout-grid__inner",
                                $components: [
                                    {
                                        $type: "div",
                                        class: "mdc-layout-grid__cell mdc-layout-grid__cell--span-12",
                                        $components: [

                                            self.widgets.buttonSimple(
                                                {
                                                    label: "Image",
                                                    onclick: function (e) {
                                                        let srcEl = document.querySelector('#assetsrc');
                                                        let avatarID = 'avatar-' + vwf.moniker_;
                                                        vwf_view.kernel.callMethod(vwf.application(), "createImage", [srcEl.value, null, null, avatarID])

                                                    }
                                                }
                                            ),
                                            self.widgets.buttonSimple(
                                                {
                                                    label: "Sound",
                                                    onclick: function (e) {
                                                        let srcEl = document.querySelector('#assetsrc');
                                                        let avatarID = 'avatar-' + vwf.moniker_;
                                                        vwf_view.kernel.callMethod(vwf.application(), "createAudio", [srcEl.value, null, null, avatarID])
                                                    }
                                                }
                                            ),
                                            self.widgets.buttonSimple(
                                                {
                                                    label: "Video",
                                                    onclick: function (e) {
                                                        let srcEl = document.querySelector('#assetsrc');
                                                        let avatarID = 'avatar-' + vwf.moniker_;
                                                        vwf_view.kernel.callMethod(vwf.application(), "createVideo", [srcEl.value, null, null, avatarID])
                                                    }
                                                }
                                            ),

                                            self.widgets.buttonSimple(
                                                {
                                                    label: "GLTF",
                                                    onclick: function (e) {
                                                        let srcEl = document.querySelector('#assetsrc');
                                                        let avatarID = 'avatar-' + vwf.moniker_;
                                                        if (srcEl.value.includes('.gltf'))
                                                            vwf_view.kernel.callMethod(vwf.application(), "createModel", ['GLTF', srcEl.value, avatarID])
                                                    }
                                                }
                                            ),
                                            self.widgets.buttonSimple(
                                                {
                                                    label: "DAE",
                                                    onclick: function (e) {
                                                        let srcEl = document.querySelector('#assetsrc');
                                                        let avatarID = 'avatar-' + vwf.moniker_;
                                                        if (srcEl.value.includes('.dae'))
                                                            vwf_view.kernel.callMethod(vwf.application(), "createModel", ['DAE', srcEl.value, avatarID])
                                                    }
                                                }
                                            ),
                                            self.widgets.buttonSimple(
                                                {
                                                    label: "OBJ",
                                                    onclick: function (e) {
                                                        let srcEl = document.querySelector('#assetsrc');
                                                        let avatarID = 'avatar-' + vwf.moniker_;
                                                        if (srcEl.value.includes('.obj'))
                                                            vwf_view.kernel.callMethod(vwf.application(), "createModel", ['OBJ', srcEl.value, avatarID])
                                                    }
                                                }
                                            )


                                        ]
                                    }


                                ]
                            },
                            self.widgets.listTitle({ text: 'Resources' }),
                            {
                                $type: "div",
                                class: "mdc-layout-grid__inner",
                                $components: [

                                    self.widgets.gridListItem({
                                        imgSrc: "/drivers/view/editor/images/ui/icons/3ditem.png",
                                        title: 'Asset item',
                                        imgSize: '30px',
                                        styleClass: "",
                                        onclickfunc: function () {
                                            let srcEl = document.querySelector('#assetsrc');
                                            vwf_view.kernel.callMethod(vwf.application(), "createAssetResource", ['ITEM', srcEl.value])
                                        }
                                    }),
                                    self.widgets.gridListItem({
                                        imgSrc: "/drivers/view/editor/images/ui/icons/image.png",
                                        title: 'Image',
                                        imgSize: '30px',
                                        styleClass: "",
                                        onclickfunc: function () {
                                            //let cubeName = self.GUID();
                                            let srcEl = document.querySelector('#assetsrc');
                                            vwf_view.kernel.callMethod(vwf.application(), "createAssetResource", ['IMG', srcEl.value])
                                        }
                                    }),
                                    self.widgets.gridListItem({
                                        imgSrc: "/drivers/view/editor/images/ui/icons/video.png",
                                        title: 'Video',
                                        imgSize: '30px',
                                        styleClass: "",
                                        onclickfunc: function () {
                                            let srcEl = document.querySelector('#assetsrc');
                                            vwf_view.kernel.callMethod(vwf.application(), "createAssetResource", ['VIDEO', srcEl.value])
                                        }
                                    }),
                                    self.widgets.gridListItem({
                                        imgSrc: "/drivers/view/editor/images/ui/icons/sound.png",
                                        title: 'Sound',
                                        imgSize: '30px',
                                        styleClass: "",
                                        onclickfunc: function () {
                                            let srcEl = document.querySelector('#assetsrc');
                                            vwf_view.kernel.callMethod(vwf.application(), "createAssetResource", ['AUDIO', srcEl.value])
                                        }
                                    }),
                                    self.widgets.buttonSimple(
                                        {
                                            label: "MTL",
                                            onclick: function (e) {
                                                let srcEl = document.querySelector('#assetsrc');
                                                if (srcEl.value.includes('.mtl'))
                                                    vwf_view.kernel.callMethod(vwf.application(), "createAssetResource", ['ITEM', srcEl.value])
                                            }
                                        }
                                    )


                                ]
                            },
                            {
                                $type: "div",
                                class: "mdc-layout-grid__inner",
                                $components: [
                                    {
                                        $type: "div",
                                        class: "mdc-layout-grid__cell mdc-layout-grid__cell--span-12",
                                        $components: [
                                            self.widgets.divider
                                        ]
                                    },

                                    {
                                        $type: "div",
                                        class: "mdc-layout-grid__cell mdc-layout-grid__cell--span-12",
                                        $components: [
                                            {
                                                $type: "h3",
                                                class: "",
                                                $text: 'Google Poly'
                                            }
                                        ]
                                    },
                                    {
                                        $type: "div",
                                        class: "mdc-layout-grid__cell mdc-layout-grid__cell--span-12",
                                        $components: [
                                            self.widgets.inputTextFieldOutlined({
                                                "id": 'googlepolyid',
                                                "fieldStyle": 'width: 350px',
                                                "label": "Enter Google Poly model ID",
                                                "value": '',
                                                "change": function (e) {
                                                    console.log(this.value)
                                                }
                                            })
                                        ]
                                    },
                                    {
                                        $type: "div",
                                        class: "mdc-layout-grid__cell mdc-layout-grid__cell--span-12",
                                        $components: [
                                            self.widgets.buttonSimple(
                                                {
                                                    label: "Load from Poly",
                                                    onclick: function (e) {
                                                        let srcEl = document.querySelector('#googlepolyid');
                                                        let avatarID = 'avatar-' + vwf.moniker_;
                                                        vwf_view.kernel.callMethod(vwf.application(), "createGooglePoly", [srcEl.value, null, null, avatarID])
                                                    }
                                                }
                                            )
                                        ]
                                    }
                                ]
                            }



                        ]
                    }

                    function getUniqueDisplayName(newname, addcount) {
                        if (!addcount) addcount = 0;
                        if (!newname) newname = 'Object';
                        newname = newname.replace(/[0-9]*$/g, "");
                        var nodes = self.nodes; //vwf.models.object.objects;
                        var count = 1 + addcount;
                        for (var i in nodes) {
                            if (nodes[i].id !== 0) {
                                if (nodes[i].id !== "" && nodes[i].properties.length !== 0) {
                                    let thisname = vwf.getProperty(nodes[i].ID, 'displayName') || '';
                                    //console.log(thisname);
                                    if (thisname.replace(/[0-9]*$/g, "") == newname)
                                        count++;
                                }
                            }
                        }
                        return newname + count;
                    }

                    function make3DPrimitiveList() {
                        let nodeNames = ['Plane', 'Cube', 'Sphere', 'Cylinder', 'Cone', 'Text'];
                        return nodeNames.map(el => {
                            return self.widgets.gridListItem({
                                imgSrc: "/drivers/view/editor/images/ui/icons/" + el.toLowerCase() + ".png",
                                imgSize: "30px",
                                styleClass: "", //"createListItem",
                                title: el,
                                onclickfunc: function () {
                                    let avatarID = 'avatar-' + vwf.moniker_;
                                    //let cubeName = self.GUID();
                                    let displayName = getUniqueDisplayName.call(self, el.toLowerCase());
                                    vwf_view.kernel.callMethod(vwf.application(), "createPrimitive", [el.toLowerCase(), {}, displayName, null, avatarID])
                                }
                            })
                        })
                    }

                    function makeLightsList() {
                        let nodeNames = ['Ambient', 'Directional', 'Hemisphere', 'Point', 'Spot'];
                        return nodeNames.map(el => {
                            return self.widgets.gridListItem({
                                imgSize: "30px",
                                styleClass: "",
                                imgSrc: "/drivers/view/editor/images/ui/icons/light_" + el.toLowerCase() + ".png",
                                title: el,
                                onclickfunc: function () {
                                    let avatarID = 'avatar-' + vwf.moniker_;
                                    //let cubeName = self.GUID();
                                    let displayName = getUniqueDisplayName.call(self, el.toLowerCase());
                                    vwf_view.kernel.callMethod(vwf.application(), "createPrimitive", ["light", { type: el.toLowerCase() }, displayName, null, avatarID])
                                }
                            })
                        })
                    }

                    var saveAvatar = {};
                    var loadAvatar = {};
                    if (_LCSDB.user().is) {
                        saveAvatar = self.widgets.floatActionButton({
                            label: "save",
                            styleClass: "mdc-fab--mini",
                            onclickfunc: function () {
                                //var nodeID = document.querySelector('#currentNode')._currentNode;
                                let nodeID = 'avatar-' + self.kernel.moniker();
                                let node = self.nodes[nodeID];
                                let nodeDef = self.helpers.getNodeDef(nodeID).children.avatarNode;
                                console.log(nodeDef);

                                _LCSDB.user().get('profile').get('avatarNode').put(JSON.stringify(nodeDef), acc => {
                                    console.log("saved: " + acc)
                                });

                                //vwf_view.kernel.deleteChild(node.parentID, node.name);
                                //vwf_view.kernel.deleteNode(nodeID);
                                //vwf_view.kernel.callMethod(node.parentID, "deleteNode", [node.name])
                            }
                        });
                        loadAvatar = self.widgets.floatActionButton({
                            label: "restore",
                            styleClass: "mdc-fab--mini",
                            onclickfunc: function () {
                                let nodeID = 'avatar-' + self.kernel.moniker();
                                _LCSDB.user().get('profile').get('avatarNode').once(res => {
                                    if (res) {
                                        var myNode = res;

                                        if (self.helpers.testJSON(res)) {
                                            myNode = JSON.parse(res);
                                        }

                                        vwf_view.kernel.callMethod(nodeID, "changeCostume", [myNode, true]);
                                    }
                                })
                            }
                        })
                    }

                    let avatarSettings =
                    {
                        $cell: true,
                        $type: "div",
                        class: "propGrid max-width mdc-layout-grid mdc-layout-grid--align-left",
                        $components: [
                            {
                                $type: "div",
                                class: "mdc-layout-grid__inner",
                                $components: [
                                    {
                                        $type: "div",
                                        class: "mdc-layout-grid__cell mdc-layout-grid__cell--span-12",
                                        $components: [
                                            self.widgets.icontoggle({
                                                'id': "mobile_joystick",
                                                'label': 'visibility',
                                                'on': JSON.stringify({ "content": "gamepad", "label": "Show" }),
                                                'off': JSON.stringify({ "content": "gamepad", "label": "Hide" }),
                                                'state': false,
                                                'init': function () {
                                                    this._driver = vwf.views["/drivers/view/aframe"];
                                                    this._comp = new mdc.iconButton.MDCIconButtonToggle(this);
                                                    //mdc.iconButton.MDCIconButtonToggle.attachTo(this);
                                                    if (document.getElementsByClassName('touchZone').length > 0) {
                                                        this._comp.on = true;
                                                        this.style.color = "#3e7e40";
                                                    } else {
                                                        this._comp.on = false;
                                                        this.style.color = "#333333";
                                                    }


                                                    this.addEventListener('MDCIconButtonToggle:change', (e) => {
                                                        let chkAttr = e.detail.isOn;
                                                        let driver = e.target._driver;
                                                        if (chkAttr) {
                                                            driver.state.showMobileJoystick();
                                                            this.style.color = "#3e7e40";
                                                            // this.classList.add('mdc-icon-toggle--enabled');
                                                            console.log("on");

                                                        } else {
                                                            driver.state.hideMobileJoystick();
                                                            this.style.color = "#333333";
                                                            //this.classList.add('mdc-icon-toggle--disabled');
                                                            console.log("off")
                                                        }

                                                    });
                                                }
                                            }),
                                            self.widgets.divider

                                        ]
                                    },
                                    {
                                        $type: "div",
                                        class: "mdc-layout-grid__cell mdc-layout-grid__cell--span-12",
                                        $components: [
                                            saveAvatar,
                                            loadAvatar,
                                            self.widgets.divider,
                                            self.widgets.buttonStroked(
                                                {
                                                    "label": "Reset camera view",
                                                    "onclick": function (e) {
                                                        //document.querySelector('#' + 'viewSettings').style.visibility = 'hidden';
                                                        let controlEl = document.querySelector('#avatarControl');
                                                        controlEl.setAttribute('camera', 'active', true);
                                                    }
                                                }),
                                            self.widgets.buttonStroked(
                                                {
                                                    "label": "Hide cursor",
                                                    "onclick": function (e) {
                                                        //document.querySelector('#' + 'viewSettings').style.visibility = 'hidden';
                                                        let cursorID = 'mouse-' + self.kernel.moniker();

                                                        //let avatarID = 'avatar-' + self.kernel.moniker();
                                                        // let cursorID = vwf.find(avatarID, "./avatarNode/myHead/myCursor")[0];

                                                        let controlEl = document.querySelector("[id='" + cursorID + "']");
                                                        let vis = controlEl.getAttribute('visible');
                                                        this.$text = vis ? 'Show cursor' : 'Hide cursor';
                                                        vwf_view.kernel.setProperty(cursorID, "visible", !vis);
                                                        //vwf_view.kernel.callMethod(avatarID, "showHideCursor", [!vis]);
                                                        //controlEl.setAttribute('visible', !vis);
                                                    }
                                                }),
                                            self.widgets.buttonStroked(
                                                {
                                                    "label": "Hide Avatar",
                                                    "onclick": function (e) {
                                                        //document.querySelector('#' + 'viewSettings').style.visibility = 'hidden';
                                                        let avatarID = 'avatar-' + self.kernel.moniker();
                                                        //let cursorID = 'myCursor-' + avatarID;
                                                        let controlEl = document.querySelector("[id='" + avatarID + "']");
                                                        let vis = controlEl.getAttribute('visible');
                                                        this.$text = vis ? 'Show Avatar' : 'Show Avatar';
                                                        vwf_view.kernel.callMethod(avatarID, "showHideAvatar", [!vis]);
                                                        //controlEl.setAttribute('visible', !vis);
                                                    }
                                                }
                                            ),
                                            self.widgets.buttonStroked(
                                                {
                                                    "label": "Reset Avatar",
                                                    "onclick": function (e) {
                                                        let avatarID = 'avatar-' + self.kernel.moniker();
                                                        //TODO: add XR check
                                                        vwf_view.kernel.callMethod(avatarID, "resetAvatar", []);
                                                    }
                                                }
                                            )



                                        ]
                                    },
                                    {
                                        $type: "div",
                                        class: "mdc-layout-grid__cell mdc-layout-grid__cell--span-12",
                                        $components: [

                                            {
                                                $type: "div",
                                                class: "mdc-layout-grid",
                                                $components: [
                                                    {
                                                        $type: "div",
                                                        class: "mdc-layout-grid__inner",
                                                        $components: [

                                                            {
                                                                $type: "div",
                                                                class: "mdc-layout-grid__cell mdc-layout-grid__cell--span-12",
                                                                $components: [

                                                                    self.avatarCardDef("/defaults/assets/avatars/ico/simple.jpg", { title: "Simple", subtitle: "Cube" },
                                                                        function (e) {
                                                                            let avatarID = 'avatar-' + self.kernel.moniker();
                                                                            vwf_view.kernel.callMethod(avatarID, "createSimpleAvatar");

                                                                        }
                                                                    )
                                                                ]
                                                            },
                                                            {
                                                                $type: "div",
                                                                class: "mdc-layout-grid__cell mdc-layout-grid__cell--span-12",
                                                                $components: [
                                                                    self.avatarCardDef("/defaults/assets/avatars/ico/female.jpg", { title: "Human", subtitle: "Female" },
                                                                        function (e) {
                                                                            let avatarID = 'avatar-' + self.kernel.moniker();
                                                                            vwf_view.kernel.callMethod(avatarID, "createAvatarFromGLTF", ["/defaults/assets/avatars/female/avatar1.gltf"]);
                                                                        }
                                                                    )]
                                                            },
                                                            {
                                                                $type: "div",
                                                                class: "mdc-layout-grid__cell mdc-layout-grid__cell--span-12",
                                                                $components: [
                                                                    self.avatarCardDef("/defaults/assets/avatars/ico/male.jpg", { title: "Human", subtitle: "Male" },
                                                                        function (e) {
                                                                            let avatarID = 'avatar-' + self.kernel.moniker();
                                                                            vwf_view.kernel.callMethod(avatarID, "createAvatarFromGLTF", ["/defaults/assets/avatars/male/avatar1.gltf"]);
                                                                        }
                                                                    )]
                                                            }

                                                        ]
                                                    }
                                                ]

                                            }




                                        ]
                                    },
                                    {
                                        $type: "div",
                                        class: "mdc-layout-grid__cell mdc-layout-grid__cell--span-12",
                                        $components: [
                                            self.widgets.buttonStroked(
                                                {
                                                    "label": "Wide",
                                                    "onclick": function (e) {
                                                        let avatarID = 'avatar-' + vwf.moniker_;
                                                        vwf_view.kernel.callMethod(avatarID, "setBigVideoHead", []);

                                                    }
                                                }),
                                            self.widgets.buttonStroked(
                                                {
                                                    "label": "Small",
                                                    "onclick": function (e) {
                                                        let avatarID = 'avatar-' + vwf.moniker_;
                                                        vwf_view.kernel.callMethod(avatarID, "setSmallVideoHead", []);

                                                    }
                                                })


                                        ]

                                    }
                                ]
                            }
                        ]
                    }

                    let viewSettings =
                    {
                        $cell: true,
                        $type: "div",
                        class: "propGrid max-width mdc-layout-grid mdc-layout-grid--align-left",
                        $components: [
                            {
                                $type: "div",
                                class: "mdc-layout-grid__inner",
                                $components: [
                                    {
                                        $type: "div",
                                        class: "mdc-layout-grid__cell mdc-layout-grid__cell--span-12",
                                        $components: [
                                            self.widgets.buttonStroked(
                                                {
                                                    "label": "OSC Settings",
                                                    "onclick": function (e) {
                                                        let sideBar = document.querySelector('#sideBar');
                                                        sideBar._sideBarComponent = oscSettings;
                                                        //document.querySelector('#' + 'viewSettings').style.visibility = 'hidden';
                                                    }
                                                })
                                        ]
                                    },
                                    {
                                        $type: "div",
                                        class: "mdc-layout-grid__cell mdc-layout-grid__cell--span-12",
                                        $components: [
                                            {
                                                $type: "h2",
                                                class: "",
                                                $text: 'App settings'
                                            },
                                            self.widgets.streamMsgConfig(),
                                            {
                                                $type: "h3",
                                                class: "",
                                                $text: 'Delay'
                                            },
                                            {
                                                class: "mdc-text-field prop-mdc-text-field",

                                                $type: "div",
                                                $components: [
                                                    self.widgets.inputTextFieldStandart({
                                                        "id": "input-delay",
                                                        "label": "Delay",
                                                        "value": vwf.virtualTime.streamDelay,
                                                        "change": function (e) {
                                                            //set property

                                                            let value = this.value;
                                                            vwf.virtualTime.streamDelay = value;

                                                            let slider = document.querySelector('#slider-delay');
                                                            slider._comp.setValue(value);

                                                        }
                                                    })

                                                ]

                                            },
                                            self.widgets.sliderContinuous({
                                                'id': 'slider-delay',
                                                'label': 'Slider',
                                                'min': 0,
                                                'max': 1000,
                                                'step': 1,
                                                'value': vwf.virtualTime.streamDelay, //parseInt(currenValue),
                                                'init': function () {

                                                    const myEl = document.querySelector('#slider-delay');//this;
                                                    if (myEl) {
                                                        myEl.children[0].setAttribute("value", vwf.virtualTime.streamDelay);
                                                        let input = document.querySelector('#input-delay');
                                                        input.value = vwf.virtualTime.streamDelay;

                                                        var continuousSlider = new mdc.slider.MDCSlider(myEl);

                                                        this._comp = continuousSlider;


                                                        continuousSlider.listen('MDCSlider:input', function (e) {

                                                            let myEl = e.currentTarget;

                                                            let value = continuousSlider.getValue();
                                                            vwf.virtualTime.streamDelay = value;

                                                            let input = document.querySelector('#input-delay');
                                                            input.value = value;
                                                        });
                                                        continuousSlider.listen('MDCSlider:change', function (e) {
                                                            //console.log(continuousSlider.value);
                                                            let myEl = e.currentTarget;

                                                            let value = continuousSlider.getValue();
                                                            vwf.virtualTime.streamDelay = value;

                                                            let input = document.querySelector('#input-delay');
                                                            input.value = value;

                                                        })

                                                    }

                                                }
                                            })

                                        ]
                                    }
                                ]
                            }
                        ]
                    }

                    let savedStateEl = function (item) {
                        return {

                            $type: "li",
                            class: "mdc-list-item",
                            role: "option",
                            $components: [
                                {
                                    $text: "Saved world"
                                }
                            ]

                        }
                    }

                    let stateListElement = function (item) {

                        let liEl = {
                            $type: "option",
                            id: "",
                            applicationpath: "",
                            value: "no_saves",
                            $components: [
                                {
                                    $text: "no saves"
                                }
                            ]
                        }

                        let applicationName = item.applicationpath.split("/");


                        if (applicationName == "") {
                            return liEl
                        }

                        if (applicationName.length > 0) {
                            applicationName = applicationName[applicationName.length - 1];
                        }

                        if (applicationName.length > 0) {
                            applicationName = applicationName.charAt(0).toUpperCase() + applicationName.slice(1);
                        }

                        if (item.latestsave) {
                            liEl = {
                                $type: "option",
                                id: item.savename,
                                value: item.savename,
                                applicationpath: item.applicationpath,
                                $components: [
                                    {
                                        $text: applicationName + ": " + item.savename
                                    }
                                ]
                            }

                        }
                        else {
                            liEl = {
                                $type: "option",
                                id: item.savename,
                                value: item.savename,
                                revision: item.revision,
                                applicationpath: item.applicationpath,
                                $components: [
                                    {
                                        $text: applicationName + ": " + item.savename + " Rev(" + item.revision + ")"
                                    }
                                ]
                            }


                        }
                        return liEl

                    }

                    let oscSettings =
                    {
                        $cell: true,
                        $type: "div",
                        id: "oscSettings",
                        class: "propGrid max-width mdc-layout-grid mdc-layout-grid--align-left",
                        _oscHost: '',
                        _oscPort: '',
                        _oscStatus: '',
                        _updateStatus: function () {
                            this._oscStatus = window._OSCManager.getStatus()
                        },
                        $init: function () {
                            if (window._OSCManager) {
                                this._oscHost = window._OSCManager.hostValue;
                                this._oscPort = window._OSCManager.portValue;
                                this._oscStatus = window._OSCManager.getStatus();

                                // var t = this;
                                // setInterval(function () {
                                //     t._updateStatus();
                                // }, 1000);

                            }
                        },
                        $update: function () {

                            let that = this
                            var buttonText = "Connect";
                            var buttonFunc = function (e) {
                            }

                            if (this._oscStatus == 1) {
                                buttonText = "Disconnect";
                                buttonFunc = function (e) {
                                    window._OSCManager.disconnect();
                                }
                            } else {


                                var buttonFunc = function (e) {
                                    window._OSCManager.connect();
                                    window._OSCManager.port.on("open", function () {
                                        that._oscStatus = window._OSCManager.getStatus();
                                        console.log("connected");
                                    });
                                    window._OSCManager.port.on("close", function () {
                                        that._oscStatus = window._OSCManager.getStatus();
                                        console.log("disconnected");
                                    });

                                }

                            }

                            this.$components = [
                                {
                                    $type: "div",
                                    class: "mdc-layout-grid__inner",
                                    $components: [
                                        {
                                            $type: "div",
                                            class: "mdc-layout-grid__cell mdc-layout-grid__cell--span-12",
                                            $components: [
                                                self.widgets.inputTextFieldOutlined({
                                                    "id": 'oscHostInput',
                                                    "label": "Host",
                                                    "value": this._oscHost,
                                                    "change": function (e) {
                                                        this._oscHost = this.value;
                                                        window._OSCManager.setOSCHostAndPort(this._oscHost, this._oscPort);
                                                    }
                                                })
                                                // {
                                                //     $type: "span",
                                                //     $text: "Host: "
                                                // },
                                                // {
                                                //     class: "mdc-text-field",
                                                //     $type: "span",
                                                //     $components: [
                                                //         {
                                                //             class: "mdc-text-field__input prop-text-field-input",
                                                //             id: "oscHost",
                                                //             $type: "input",
                                                //             type: "text",
                                                //             value: this._oscHost,
                                                //             onchange: function (e) {
                                                //                 this._oscHost = this.value;
                                                //                 window._OSCManager.setOSCHostAndPort(this._oscHost, this._oscPort);
                                                //             }
                                                //         }

                                                //     ]

                                                // }

                                            ]
                                        },
                                        {
                                            $type: "div",
                                            class: "mdc-layout-grid__cell mdc-layout-grid__cell--span-12",
                                            $components: [
                                                self.widgets.inputTextFieldOutlined({
                                                    "id": 'oscPortInput',
                                                    "label": "Port",
                                                    "value": this._oscPort,
                                                    "change": function (e) {
                                                        this._oscPort = this.value;
                                                        window._OSCManager.setOSCHostAndPort(this._oscHost, this._oscPort);
                                                    }
                                                })
                                                // {
                                                //     $type: "span",
                                                //     $text: "Port: "
                                                // },
                                                // {
                                                //     class: "mdc-text-field",
                                                //     $type: "span",
                                                //     $components: [
                                                //         {
                                                //             class: "mdc-text-field__input prop-text-field-input",
                                                //             id: "oscPort",
                                                //             $type: "input",
                                                //             type: "text",
                                                //             value: this._oscPort,
                                                //             onchange: function (e) {
                                                //                 this._oscPort = this.value;
                                                //                 window._OSCManager.setOSCHostAndPort(this._oscHost, this._oscPort);
                                                //             }
                                                //         }

                                                //     ]

                                                // }

                                            ]
                                        },
                                        {
                                            $type: "div",
                                            class: "mdc-layout-grid__cell mdc-layout-grid__cell--span-12",
                                            $components: [
                                                self.widgets.buttonStroked(
                                                    {
                                                        "label": buttonText,
                                                        "onclick": buttonFunc
                                                    })



                                            ]
                                        }

                                    ]
                                }
                            ]
                        }


                    }

                    let loadSaveSettings =
                    {
                        $cell: true,
                        $type: "div",
                        id: "loadSaveSettings",
                        class: "propGrid max-width mdc-layout-grid mdc-layout-grid--align-left",
                        $init: function () {



                            var userGUI = [];

                            let worldOwner = self.helpers.getRoot().user;

                            let genWorldID = 'world' + self.helpers.randId();

                            if (_LCSDB.user().is) {
                                if (worldOwner == _LCSDB.user().is.alias) {

                                    userGUI.push(
                                        {

                                            $type: "div",
                                            class: "mdc-layout-grid__cell mdc-layout-grid__cell--span-12",
                                            $components: [
                                                {

                                                    $type: "h3",
                                                    class: "mdc-typography--title",
                                                    $text: self.helpers.appPath

                                                },
                                                self.widgets.buttonStroked(
                                                    {
                                                        "label": "Save world",
                                                        "onclick": function (e) {

                                                            _app.saveWorld();

                                                            //let fileName = self.helpers.getRoot().root;
                                                            //_app.saveState(fileName);

                                                            //// let fileName = self.helpers.worldStateName;
                                                            ////_app.saveStateAsFile(fileName);

                                                            //document.querySelector('#fileName')
                                                            //document.querySelector("#fileName").value = '';
                                                            //document.querySelector('#' + 'viewSettings').style.visibility = 'hidden';
                                                        }
                                                    })


                                            ]
                                        }
                                    );

                                }

                                userGUI.push(

                                    {
                                        $type: "div",
                                        class: "mdc-layout-grid__cell mdc-layout-grid__cell--span-12",
                                        $components: [
                                            {
                                                $type: "div",
                                                $components: [
                                                    self.widgets.inputTextFieldOutlined({
                                                        "id": 'fileName',
                                                        "label": genWorldID,
                                                        //"value": 'world' + self.helpers.randId(), //self.getSaveName() //self.getRoot()
                                                        "change": function (e) {
                                                        }
                                                    })
                                                    // {
                                                    //     class: "mdc-text-field__input prop-text-field-input",
                                                    //     id: "fileName",
                                                    //     $type: "input",
                                                    //     type: "text",
                                                    //     value: 'world' + self.helpers.randId() //self.getSaveName() //self.getRoot()


                                                    // }
                                                ]

                                            }

                                        ]
                                    },

                                    {

                                        $type: "div",
                                        class: "mdc-layout-grid__cell mdc-layout-grid__cell--span-12",
                                        $components: [
                                            self.widgets.buttonStroked(
                                                {
                                                    "label": "Clone world",
                                                    "onclick": function (e) {
                                                        let fileName = document.querySelector('#fileName')

                                                        let worldOwner = self.helpers.getRoot().user;
                                                        let worldName = _app.worldName;

                                                        if (_LCSDB.user().is) {

                                                            let wn = fileName.value ? fileName.value : genWorldID;
                                                            _app.cloneWorld(worldName, worldOwner, wn, true)
                                                            // if (worldOwner == _LCSDB.user().is.alias) {
                                                            //     _app.saveStateAsFile(fileName.value);
                                                            // } else {
                                                            //     console.log('clone world with prototype to: ' + fileName);
                                                            //     _app.cloneWorldState(fileName.value);
                                                            // }
                                                        }

                                                        //saveStateAsFile.call(self, fileName.value);

                                                        //document.querySelector("#fileName").value = '';
                                                        //document.querySelector('#' + 'viewSettings').style.visibility = 'hidden';
                                                    }
                                                })


                                        ]
                                    }


                                );
                                if (worldOwner == _LCSDB.user().is.alias) {

                                    userGUI.push(
                                        {

                                            $type: "div",
                                            class: "mdc-layout-grid__cell mdc-layout-grid__cell--span-12",
                                            $components: [
                                                {
                                                    $type: "p",
                                                },
                                                self.widgets.buttonStroked(
                                                    {
                                                        "label": "Save state",
                                                        "onclick": function (e) {

                                                            // _app.saveWorld();
                                                            let myWorldName = self.helpers.getRoot().root;
                                                            let fileName = document.querySelector('#fileName');
                                                            let wn = fileName.value ? fileName.value : myWorldName;
                                                            _app.saveState(wn);

                                                            //document.querySelector('#fileName')
                                                            //document.querySelector("#fileName").value = '';
                                                            //document.querySelector('#' + 'viewSettings').style.visibility = 'hidden';
                                                        }
                                                    })


                                            ]
                                        }
                                    );

                                }

                                // let saveGUI = document.querySelector('#saveGUI');
                                // saveGUI.$components = userGUI.concat(saveGUI.$components);
                                //document.querySelector('#fileName').value = 'world' + _app.helpers.randId();

                            } else {
                                userGUI.push(
                                    self.widgets.getLoginGUI()
                                );
                            }

                            let saveGUI = document.querySelector('#saveGUI');
                            saveGUI.$components = userGUI.concat(saveGUI.$components);
                        },
                        $update: function () {
                        },
                        $components:
                            [
                                {
                                    $type: "div",
                                    class: "mdc-layout-grid__inner",
                                    id: "saveGUI",
                                    $components: [

                                    ]
                                }
                            ]




                    }


                    let protoPropertiesCell = function (m) {
                        return {
                            $type: "div",
                            class: "mdc-layout-grid__inner",
                            _prop: {},
                            $init: function () {

                                let prop = m[1].prop;
                                let property = vwf.getProperty(this._currentNode, prop.name, []);

                                if (prop.value == undefined && this._currentNode !== undefined) {
                                    prop.value = JSON.stringify(LCSEditor.utility.transform(property, LCSEditor.utility.transforms.transit));
                                }
                                this._prop = prop
                            },
                            $update: function () {
                                this.$components = [

                                    // {
                                    //     $type: "div",
                                    //     class: "mdc-layout-grid__cell mdc-layout-grid__cell--span-10",
                                    //     $components: [
                                    //         { $text: this._prop.name }
                                    //     ]
                                    // },
                                    // {
                                    //     $type: "div",
                                    //     class: "mdc-layout-grid__cell mdc-layout-grid__cell--span-2",
                                    // },
                                    {
                                        $type: "div",
                                        class: "mdc-layout-grid__cell mdc-layout-grid__cell--span-12",
                                        $components: [
                                            // {
                                            //     $type: "span",
                                            //     class: "mdc-typography--body2 mdc-typography--adjust-margin protoPropLabel",
                                            //     $text: this._prop.name + ': '
                                            // },
                                            {
                                                $type: "div",
                                                $components: [
                                                    self.widgets.inputTextFieldStandart({
                                                        "id": 'proto_' + this._prop.name,
                                                        "label": this._prop.name,
                                                        "value": this._prop.getValue(),
                                                        "change": function (e) {


                                                            //set property

                                                            let value = this.value;
                                                            var propValue = value;


                                                            if (self.helpers.testJSON(value)) {
                                                                propValue = JSON.parse(value);
                                                            } else {
                                                                propValue = value;
                                                            }

                                                            self.kernel.setProperty(this._currentNode, this._prop.name, propValue);


                                                            // let propValue = this.value;
                                                            // try {
                                                            //     propValue = JSON.parse(propValue);
                                                            //     self.kernel.setProperty(this._currentNode, this._prop.name, propValue);
                                                            // } catch (e) {
                                                            //     // restore the original value on error
                                                            //     this.value = propValue;
                                                            // }



                                                        }
                                                    })
                                                ]

                                            }
                                        ]

                                    }
                                ]
                            }

                        }
                    }

                    let propertiesCell = function (m) {

                        var editComponents = [{}, {}];

                        // fullWidth:
                        // fullHeight:
                        // xoffset:
                        // yoffset:
                        // width:
                        // height:

                        //let sliderPropNames = ['radius', 'width', 'height', 'depth', 'fullWidth', 'fullHeight', 'xoffset', 'yoffset', 'subcamWidth', 'subcamHeight'];
                        let sliderProps = {
                            'radius': {
                                min: 0,
                                max: 30
                            },
                            'width': {
                                min: 0,
                                max: 30
                            },
                            'height': {
                                min: 0,
                                max: 30
                            },
                            'depth': {
                                min: 0,
                                max: 30
                            },
                            'fullWidth': {
                                min: 0,
                                max: 5000,
                                step: 10
                            },
                            'fullHeight': {
                                min: 0,
                                max: 5000,
                                step: 10
                            },
                            'xoffset': {
                                min: -10000,
                                max: 10000,
                                step: 10
                            },
                            'yoffset': {
                                min: -10000,
                                max: 10000,
                                step: 10
                            },
                            'subcamWidth': {
                                min: 0,
                                max: 5000,
                                step: 10
                            },
                            'subcamHeight': {
                                min: 0,
                                max: 5000,
                                step: 10
                            }
                        }

                        if (Object.keys(sliderProps).includes(m.name)) {


                        let node = self.nodes[document.querySelector('#currentNode')._currentNode];
                        
                        let propGUI = node.children.filter(el=>{
                           return el.name == "propGUI"
                        })[0]

                        let propMax = propGUI && (propGUI.properties[m.name + '_max']) ? 
                        (propGUI.properties[m.name + '_max']).rawValue : null; 

                        let propMin = propGUI && (propGUI.properties[m.name + '_min']) ? 
                        (propGUI.properties[m.name + '_min']).rawValue : null; 

                        let propStep = propGUI && (propGUI.properties[m.name + '_step']) ? 
                        (propGUI.properties[m.name + '_min']).rawValue : null; 


                            let currentValue = JSON.parse(m.getValue()) //parseInt(JSON.parse(m.getValue()));

                            let max = (currentValue > sliderProps[m.name].max) ? currentValue + 10 : sliderProps[m.name].max;
                            let step = sliderProps[m.name].step ? sliderProps[m.name].step : 0.1;

                            var sliderComponent = self.widgets.sliderContinuous({
                                'id': 'prop-slider-' + m.name,
                                'label': 'Slider',
                                'min': propMin ? propMin : sliderProps[m.name].min,
                                'max': propMax ? propMax : max,
                                'step': propStep ? propStep : step,
                                'value': currentValue, //parseInt(currenValue),
                                'init': function () {

                                    const myEl = document.querySelector('#prop-slider-' + m.name);//this;
                                    if (myEl) {
                                        myEl.children[0].setAttribute("value", currentValue);

                                        var continuousSlider = new mdc.slider.MDCSlider(myEl);

                                        this._comp = continuousSlider;
                                        continuousSlider.listen('MDCSlider:input', function (e) {
                                            // console.log(continuousSlider.value)
                                            let myEl = e.currentTarget;
                                            // let prop = myEl._prop.body;
                                            //document.querySelector('#propAceEditor').env.editor.setValue(prop);
                                            let value = continuousSlider.getValue();
                                            self.kernel.setProperty(myEl._currentNode, m.name, value);
                                            //continuousValue.textContent = continuousSlider.value;



                                        });
                                        continuousSlider.listen('MDCSlider:change', function (e) {
                                            //console.log(continuousSlider.value);
                                            let myEl = e.currentTarget;
                                            // let prop = myEl._prop.body;
                                            //document.querySelector('#propAceEditor').env.editor.setValue(prop);
                                            let value = continuousSlider.getValue();
                                            self.kernel.setProperty(myEl._currentNode, m.name, value);

                                            //continuousCommittedValue.textContent = continuousSlider.value;
                                        })

                                    }

                                }
                            })

                        } else {
                            sliderComponent = {}
                        }

                        if (m.name.indexOf("semantics") > -1) { }
                        else if (m.name.indexOf("grammar") > -1) { }
                        else if (m.name.indexOf("ohm") > -1) {

                            editComponents = [

                                {
                                    $type: "div",

                                    class: "mdc-layout-grid__cell mdc-layout-grid__cell--span-6",
                                    $components: [
                                        {

                                            $type: "button",
                                            class: "mdc-button",
                                            $text: "Edit", //edit grammar
                                            onclick: function (e) {
                                                var currentNode = document.querySelector('#currentNode')._currentNode;
                                                if (currentNode == '') {
                                                    currentNode = vwf_view.kernel.find("", "/")[0];
                                                }
                                                let editor = document.querySelector('#livePropEditor');
                                                editor._setNode(currentNode);
                                                editor._propName = m.name;
                                                editor._prop = { body: m.rawValue, type: 'complex' }

                                                document.querySelector('#propEditorWindow').style.visibility = 'visible';
                                            }


                                        }
                                    ]
                                },
                                {
                                    $type: "div",

                                    class: "mdc-layout-grid__cell mdc-layout-grid__cell--span-1",
                                    $components: []
                                }

                            ]

                        } else {

                            editComponents = [
                                {
                                    $type: "div",
                                    class: "mdc-layout-grid__cell mdc-layout-grid__cell--span-6",
                                    $components: [

                                        sliderComponent,

                                        {
                                            class: "mdc-text-field prop-mdc-text-field",

                                            $type: "div",
                                            $components: [
                                                self.widgets.inputTextFieldStandart({
                                                    "id": "prop-" + m.name,
                                                    "label": m.name,
                                                    "value": m.getValue(),
                                                    "change": function (e) {
                                                        //set property

                                                        let value = this.value;
                                                        var propValue = value;


                                                        if (self.helpers.testJSON(value)) {
                                                            propValue = JSON.parse(value);
                                                        } else {
                                                            propValue = value;
                                                            //this.value = JSON.parse(JSON.stringify(propValue));
                                                        }

                                                        self.kernel.setProperty(this._currentNode, m.name, propValue);
                                                        //this.value = propValue.toString();

                                                        // let propValue = this.value;
                                                        // try {
                                                        //     propValue = JSON.parse(propValue);
                                                        //     self.kernel.setProperty(this._currentNode, m.name, propValue);

                                                        // } catch (e) {
                                                        //     // restore the original value on error
                                                        //     this.value = propValue;
                                                        // }


                                                    }
                                                })

                                            ]

                                        }
                                    ]
                                },
                                {
                                    $type: "div",
                                    class: "mdc-layout-grid__cell mdc-layout-grid__cell--span-1",
                                    $components: [
                                        {

                                            $type: "button",
                                            class: "mdc-button mdc-button--compact",
                                            $text: "^", //edit grammar
                                            onclick: function (e) {
                                                var currentNode = document.querySelector('#currentNode')._currentNode;
                                                if (currentNode == '') {
                                                    currentNode = vwf_view.kernel.find("", "/")[0];
                                                }
                                                let editor = document.querySelector('#livePropEditor');
                                                editor._setNode(currentNode);
                                                editor._propName = m.name;
                                                editor._prop = { body: m.getValue(), type: 'simple' }

                                                document.querySelector('#propEditorWindow').style.visibility = 'visible';
                                            }


                                        }
                                    ]
                                }





                            ];
                        }

                        return {
                            $type: "div",
                            class: "mdc-layout-grid__inner",
                            $components: [
                                {
                                    $type: "div",
                                    class: "mdc-layout-grid__cell mdc-layout-grid__cell--span-3",
                                    $components: [
                                        { $text: m.name }
                                    ]
                                },
                                {
                                    $type: "div",
                                    class: "mdc-layout-grid__cell mdc-layout-grid__cell--span-2",
                                },
                                editComponents[0],
                                editComponents[1]


                            ]
                        }
                    }





                    let nodeLink = function (m) {

                        var myClass = "nodeItem";
                        let myAvatarName = 'avatar-' + self.kernel.moniker();
                        (myAvatarName == m.name) ? (myClass = "avatarName mdc-typography--subheading2") :
                            myClass = "nodeItem"

                        var nodeName = m.name;

                        let displayName = vwf.getProperty(m.ID, 'displayName');
                        if (displayName) {
                            nodeName = displayName
                        }


                        return {
                            $type: "li",
                            class: "mdc-list-item",
                            $components: [{
                                $type: "a",
                                class: "mdc-list-item",
                                $href: "#",
                                $components: [{
                                    $type: 'span',
                                    class: myClass,
                                    $text: nodeName
                                }
                                ],


                                onclick: function (e) {
                                    //self.currentNodeID = m.ID;
                                    document.querySelector('#currentNode')._setNode(m.ID);

                                    // document.querySelector('#liveCodeEditor')._editorNode = m.ID;
                                    // createAceEditor(self, m.ID);
                                }
                            }]
                        }
                    };

                    let listDivider = {

                        $type: "hr",
                        class: "mdc-list-divider",
                    }

                    let webrtcGUI = {

                        $type: "div",
                        class: "propGrid mdc-layout-grid max-width mdc-layout-grid--align-left",
                        $components: [
                            {

                                $type: "div",
                                class: "mdc-layout-grid__inner",
                                $components: [
                                    {
                                        $type: "div",
                                        class: "mdc-layout-grid__cell mdc-layout-grid__cell--span-2",
                                        $components: [
                                            {
                                                $type: "span",
                                                $text: "Chat"
                                            }

                                        ]
                                    },
                                    {
                                        $type: "div",
                                        class: "mdc-layout-grid__cell mdc-layout-grid__cell--span-2",
                                        $components: [
                                            self.widgets.icontoggle({
                                                'id': "webrtcswitch",
                                                'label': 'visibility',
                                                'on': JSON.stringify({ "content": "visibility", "label": "Turn On Mic" }),
                                                'off': JSON.stringify({ "content": "visibility_off", "label": "Turn Off Mic" }),
                                                'state': false,
                                                'init': function () {
                                                    this._driver = vwf.views["/drivers/view/webrtc"];
                                                    if (!this._driver) {
                                                        //this.classList.add('mdc-icon-toggle--disabled');
                                                        this.setAttribute('disabled', "");

                                                    }
                                                    mdc.iconButton.MDCIconButtonToggle.attachTo(this);
                                                    this.addEventListener('MDCIconButtonToggle:change', (e) => {

                                                        let driver = e.target._driver;
                                                        let chkAttr = e.detail.isOn;
                                                        let avatarID = 'avatar-' + self.kernel.moniker();

                                                        let micToggle = document.querySelector('#webrtcaudio');
                                                        let camToggle = document.querySelector('#webrtcvideo');

                                                        if (chkAttr) {
                                                            driver.startWebRTC(avatarID);

                                                            micToggle.removeAttribute('disabled');
                                                            camToggle.removeAttribute('disabled');
                                                            //micToggle.classList.remove('mdc-icon-toggle--disabled');
                                                            //camToggle.classList.remove('mdc-icon-toggle--disabled');

                                                            console.log("on")

                                                        } else {
                                                            driver.stopWebRTC(avatarID);

                                                            micToggle.setAttribute('disabled', "");
                                                            camToggle.setAttribute('disabled', "");
                                                            //micToggle.classList.add('mdc-icon-toggle--disabled');
                                                            //camToggle.classList.add('mdc-icon-toggle--disabled');
                                                            console.log("off")
                                                        }

                                                        //console.log(e, detail)
                                                        //status.textContent = `Icon Toggle is ${detail.isOn ? 'on' : 'off'}`;
                                                    });

                                                }
                                            })


                                        ]
                                    },
                                    {
                                        $type: "div",
                                        class: "mdc-layout-grid__cell mdc-layout-grid__cell--span-2",
                                        $components: [
                                            self.widgets.icontoggle({
                                                'id': "webrtcaudio",
                                                'label': 'mic',
                                                'on': JSON.stringify({ "content": "mic", "label": "Turn On Mic" }),
                                                'off': JSON.stringify({ "content": "mic_off", "label": "Turn Off Mic" }),
                                                'state': false,
                                                'init': function () {
                                                    this._driver = vwf.views["/drivers/view/webrtc"];
                                                    let webrtcswitch = document.querySelector('#webrtcswitch');

                                                    if (!this._driver) {
                                                        //this.classList.add('mdc-icon-toggle--disabled');
                                                        this.setAttribute("disabled", "");
                                                    }
                                                    //this.classList.add('mdc-icon-toggle--disabled');
                                                    this.setAttribute("disabled", "");
                                                    this.addEventListener('MDCIconButtonToggle:change', (e) => {

                                                        let driver = e.target._driver;
                                                        let chkAttr = e.detail.isOn;
                                                        if (chkAttr) {
                                                            driver.muteAudio(chkAttr);
                                                            console.log("on")

                                                        } else {
                                                            driver.muteAudio(chkAttr);
                                                            console.log("off")
                                                        }

                                                        //console.log(e, detail)
                                                        //status.textContent = `Icon Toggle is ${detail.isOn ? 'on' : 'off'}`;
                                                    });

                                                }
                                            })
                                        ]
                                    },
                                    {
                                        $type: "div",
                                        class: "mdc-layout-grid__cell mdc-layout-grid__cell--span-2",
                                        $components: [
                                            self.widgets.icontoggle({
                                                'id': "webrtcvideo",
                                                'label': 'videocam',
                                                'on': JSON.stringify({ "content": "videocam", "label": "Turn On Video" }),
                                                'off': JSON.stringify({ "content": "videocam_off", "label": "Turn Off Video" }),
                                                'state': false,
                                                'init': function () {
                                                    this._driver = vwf.views["/drivers/view/webrtc"];

                                                    if (!this._driver) {
                                                        //this.classList.add('mdc-icon-toggle--disabled');
                                                        this.setAttribute("disabled", "");
                                                    }

                                                    // this.classList.add('mdc-icon-toggle--disabled');
                                                    this.setAttribute("disabled", "");
                                                    this.addEventListener('MDCIconButtonToggle:change', (e) => {

                                                        let driver = e.target._driver;
                                                        let chkAttr = e.detail.isOn;
                                                        if (chkAttr) {
                                                            driver.muteVideo(chkAttr);
                                                            console.log("on")

                                                        } else {
                                                            driver.muteVideo(chkAttr);
                                                            console.log("off")
                                                        }

                                                        //console.log(e, detail)
                                                        //status.textContent = `Icon Toggle is ${detail.isOn ? 'on' : 'off'}`;
                                                    });

                                                }
                                            })
                                        ]
                                    }

                                ]
                            }

                        ]
                    }

                    function gizmoEdit() {
                        let nodeID = document.querySelector('#currentNode')._currentNode;

                        let node = self.nodes[nodeID];
                        let nodeProtos = LCSEditor.getPrototypes.call(self, self.kernel, node.extendsID);

                        let aframe = vwf.models["/drivers/model/aframe"];
                        if (nodeID !== self.kernel.application() &&
                            nodeProtos.includes("proxy/aframe/aentity.vwf") &&
                            aframe && aframe.model.state.nodes[nodeID]) {


                            return {

                                $type: "div",
                                class: "propGrid mdc-layout-grid max-width mdc-layout-grid--align-left",
                                $components: [
                                    {

                                        $type: "div",
                                        class: "mdc-layout-grid__inner",
                                        $components: [
                                            {
                                                $type: "div",
                                                class: "mdc-layout-grid__cell mdc-layout-grid__cell--span-2",
                                                $components: [
                                                    {


                                                        $type: "span",
                                                        $text: "Edit: ",

                                                    }
                                                ]
                                            },
                                            {
                                                $type: "div",
                                                class: "mdc-layout-grid__cell mdc-layout-grid__cell--span-3",
                                                $components: [
                                                    self.widgets.switch({
                                                        'id': 'editnode',
                                                        'init': function () {
                                                            //vwf_view.kernel.getProperty(this._currentNode, 'edit');
                                                            //let nodeID = document.querySelector('#currentNode')._currentNode;
                                                            let viewNode = document.querySelector("[id='" + this._currentNode + "']");
                                                            let gizmo = viewNode.getAttribute('gizmo')

                                                            const myEl = document.querySelector('#editnode');//this;
                                                            if (myEl) {
                                                                var editorSwitch = new mdc.switchControl.MDCSwitch(this);
                                                                editorSwitch.checked = gizmo ? true : false;
                                                                myEl.addEventListener('change',

                                                                    function (e) {

                                                                        //let gizmo = viewNode.getAttribute('gizmo')

                                                                        //let nodeID = document.querySelector('#currentNode')._currentNode;
                                                                        if (editorSwitch) {
                                                                            let viewNode = document.querySelector("[id='" + this._currentNode + "']");
                                                                            let chkAttr = editorSwitch.checked;//this.getAttribute('checked');
                                                                            if (chkAttr) {
                                                                                //self.kernel.setProperty(this._currentNode, 'edit', true);
                                                                                viewNode.setAttribute('gizmo', {});
                                                                                let inter = viewNode.getAttribute('interpolation');
                                                                                if (inter) {
                                                                                    // let viewDriver = vwf.views["/drivers/view/aframeComponent"];
                                                                                    //viewDriver.interpolateView = false;
                                                                                    viewNode.components.interpolation.node.viewEdit = true;


                                                                                }


                                                                            } else {
                                                                                //self.kernel.setProperty(this._currentNode, 'edit', false);

                                                                                viewNode.removeAttribute('gizmo');
                                                                                let inter = viewNode.getAttribute('interpolation');
                                                                                if (inter) {
                                                                                    // let viewDriver = vwf.views["/drivers/view/aframeComponent"];
                                                                                    // viewDriver.interpolateView = true;
                                                                                    viewNode.components.interpolation.node.viewEdit = false;

                                                                                }
                                                                            }

                                                                            //vwf_view.kernel.callMethod(nodeID, "createEditTool");
                                                                            //vwf_view.kernel.callMethod(nodeID, "showCloseGizmo");

                                                                        }
                                                                    }

                                                                );

                                                            }
                                                        }
                                                    }
                                                    )
                                                ]
                                            },
                                            {
                                                $type: "div",
                                                class: "mdc-layout-grid__cell mdc-layout-grid__cell--span-2",
                                                $components: [

                                                    self.widgets.imageButton({
                                                        imgSrc: "/drivers/view/editor/images/ui/icons/translate.png",
                                                        styleClass: "editButton",
                                                        onclickfunc: function (e) {
                                                            let viewNode = document.querySelector("[id='" + this._currentNode + "']");
                                                            let gizmo = viewNode.getAttribute('gizmo');
                                                            gizmo ? viewNode.setAttribute('gizmo', { mode: 'translate' }) : null;
                                                            // vwf_view.kernel.callMethod(this._currentNode, "setGizmoMode", ['translate'])
                                                        }
                                                    })
                                                ]
                                            },
                                            {
                                                $type: "div",
                                                class: "mdc-layout-grid__cell mdc-layout-grid__cell--span-2",
                                                $components: [

                                                    self.widgets.imageButton({
                                                        imgSrc: "/drivers/view/editor/images/ui/icons/rotate.png",
                                                        styleClass: "editButton",
                                                        onclickfunc: function (e) {
                                                            let viewNode = document.querySelector("[id='" + this._currentNode + "']");
                                                            let gizmo = viewNode.getAttribute('gizmo');
                                                            gizmo ? viewNode.setAttribute('gizmo', { mode: 'rotate' }) : null;
                                                            //vwf_view.kernel.callMethod(this._currentNode, "setGizmoMode", ['rotate'])
                                                        }
                                                    })
                                                ]
                                            },
                                            {
                                                $type: "div",
                                                class: "mdc-layout-grid__cell mdc-layout-grid__cell--span-2",
                                                $components: [

                                                    self.widgets.imageButton({
                                                        imgSrc: "/drivers/view/editor/images/ui/icons/scale.png",
                                                        styleClass: "editButton",
                                                        onclickfunc: function (e) {
                                                            let viewNode = document.querySelector("[id='" + this._currentNode + "']");
                                                            let gizmo = viewNode.getAttribute('gizmo');
                                                            gizmo ? viewNode.setAttribute('gizmo', { mode: 'scale' }) : null;
                                                            //vwf_view.kernel.callMethod(this._currentNode, "setGizmoMode", ['scale'])
                                                        }
                                                    })
                                                ]
                                            },
                                            {
                                                $type: "div",
                                                class: "mdc-layout-grid__cell mdc-layout-grid__cell--span-1",
                                                $components: []
                                            }
                                        ]
                                    }

                                ]
                            }

                        } else {
                            return {}
                        }


                    }

                    function pasteGUI() {
                        let nodeID = document.querySelector('#currentNode')._currentNode;

                        if (self.copyBuffer == null) return {}

                        let node = self.nodes[nodeID];
                        let nodeProtos = LCSEditor.getPrototypes.call(self, self.kernel, node.extendsID);

                        let nodeDef = self.copyBuffer;
                        let newNodeProtos = LCSEditor.getPrototypes.call(self, self.kernel, nodeDef.extends);

                        if (nodeProtos.includes("proxy/aframe/componentNode.vwf") ||
                            (nodeID == self.kernel.application() && newNodeProtos.includes("proxy/aframe/componentNode.vwf"))
                        ) return {}


                        return self.widgets.floatActionButton({
                            label: "content_paste",
                            styleClass: "mdc-fab--mini",
                            id: "pasteButton",
                            tooltip: "Paste",
                            onclickfunc: function () {
                                //let nodeID = document.querySelector('#currentNode')._currentNode;
                                //let node = self.nodes[nodeID];
                                if (self.copyBuffer) {
                                    let newNodeID = self.helpers.GUID();
                                    let newName = self.helpers.randId();

                                    if (newNodeProtos.includes('proxy/aframe/componentNode.vwf') || newNodeProtos.includes('proxy/ohm/node.vwf')) {

                                        vwf_view.kernel.callMethod(nodeID, "createChildComponent", [newName, nodeDef]);


                                    } else {

                                        if (nodeID !== self.kernel.application()) {
                                            nodeDef.properties.position = [0, 0, 0];
                                            nodeDef.properties.rotation = [0, 0, 0];
                                            nodeDef.properties.scale = [1, 1, 1];
                                        }

                                        nodeDef.id = newNodeID;
                                        vwf_view.kernel.callMethod(nodeID, "createChild", [newName, nodeDef]);
                                    }


                                    //self.copyBuffer = null;
                                }



                            }
                        })

                    }


                    function audioGUI() {
                        let nodeID = document.querySelector('#currentNode')._currentNode;
                        let node = self.nodes[nodeID];
                        let nodeProtos = LCSEditor.getPrototypes.call(self, self.kernel, node.extendsID);
                        if (nodeID !== self.kernel.application() && nodeProtos.includes('proxy/aframe/a-sound-component.vwf')) {
                            return {
                                $type: "div",
                                class: "propGrid mdc-layout-grid max-width mdc-layout-grid--align-left",
                                $components: [
                                    {

                                        $type: "div",
                                        class: "mdc-layout-grid__inner",
                                        $components: [
                                            {
                                                $type: "div",
                                                class: "mdc-layout-grid__cell mdc-layout-grid__cell--span-2",
                                                $components: [
                                                    {


                                                        $type: "span",
                                                        $text: "Sound: "

                                                    }
                                                ]
                                            },
                                            {
                                                $type: "div",
                                                class: "mdc-layout-grid__cell mdc-layout-grid__cell--span-2",
                                                $components: [
                                                    self.widgets.icontoggle({
                                                        'id': "soundStopStartSwitch",
                                                        'label': 'play',
                                                        'on': JSON.stringify({ "content": "pause", "label": "stop" }),
                                                        'off': JSON.stringify({ "content": "play_arrow", "label": "play" }),
                                                        'state': false,
                                                        'init': function () {
                                                            var nodeID = this._currentNode;

                                                            this._comp = mdc.iconButton.MDCIconButtonToggle.attachTo(this);

                                                            this.setAttribute('id', "soundStopStartSwitch-" + nodeID);
                                                            let isPlaying = vwf.getProperty(nodeID, 'isPlaying');
                                                            //mdc.iconToggle.MDCIconToggle.attachTo(this);
                                                            this._comp.on = isPlaying;


                                                            this.addEventListener('MDCIconButtonToggle:change', (e) => {

                                                                // let avatarID = 'avatar-'+ vwf.moniker_;
                                                                // let avatarNode = self.nodes['avatar-'+ vwf.moniker_];
                                                                // let mode = JSON.parse(avatarNode.properties.selectMode.getValue());

                                                                var nodeID = document.querySelector('#currentNode')._currentNode;
                                                                let isPlaying = vwf.getProperty(nodeID, 'isPlaying');

                                                                if (isPlaying) {

                                                                    console.log("stop");
                                                                    vwf_view.kernel.callMethod(nodeID, "pauseSound");

                                                                } else {

                                                                    console.log("play")
                                                                    vwf_view.kernel.callMethod(nodeID, "playSound");
                                                                }

                                                            });

                                                        }
                                                    })
                                                ]
                                            },
                                            {
                                                $type: "div",
                                                class: "mdc-layout-grid__cell mdc-layout-grid__cell--span-2",
                                                $components: [
                                                    {
                                                        $type: "div",
                                                        style: "padding: 12px",
                                                        $components: [
                                                            self.widgets.iconButton({
                                                                'label': 'stop',
                                                                "styleClass": "mdc-button--outlined",
                                                                "onclick": function () {
                                                                    let nodeID = this._currentNode;
                                                                    vwf_view.kernel.callMethod(nodeID, "stopSound");
                                                                }

                                                            })
                                                        ]
                                                    }
                                                ]
                                            }


                                            // {
                                            //     $type: "div",
                                            //     class: "mdc-layout-grid__cell mdc-layout-grid__cell--span-3",
                                            //     $components: [
                                            //         widgets.switch({
                                            //         'id': 'editnode', 
                                            //         'init': function(){
                                            //             vwf_view.kernel.getProperty(this._currentNode, 'edit');
                                            //         },
                                            //         'onchange': function(e){

                                            //             var nodeID = document.querySelector('#currentNode')._currentNode;
                                            //             let chkAttr = this.getAttribute('checked');
                                            //             if (chkAttr == "") {
                                            //                 self.kernel.setProperty(this._currentNode, 'edit', false);

                                            //             } else {
                                            //                 self.kernel.setProperty(this._currentNode, 'edit', true);
                                            //             }

                                            //             vwf_view.kernel.callMethod(nodeID, "showCloseGizmo");
                                            //         }
                                            //     }
                                            //     )
                                            //     ]
                                            // }
                                        ]
                                    }
                                ]
                            }
                        } else {
                            return {}
                        }

                    }

                    var saveGUI = {};

                    if (_LCSDB.user().is) {
                        saveGUI = self.widgets.floatActionButton({
                            label: "save",
                            styleClass: "mdc-fab--mini",
                            onclickfunc: function () {
                                var nodeID = document.querySelector('#currentNode')._currentNode;
                                let node = self.nodes[nodeID];
                                let nodeDef = self.helpers.getNodeDef(nodeID);
                                console.log(nodeDef);
                                //let saveID = this.GUID();
                                // _LCSUSER.get('saves').get(node.name).put(JSON.stringify(nodeDef), acc=>{
                                //     console.log("saved: " + acc + 'to '+ node.name)
                                // });

                            }
                        })
                    }

                    function copyGUI() {
                        let nodeID = document.querySelector('#currentNode')._currentNode;
                        let node = self.nodes[nodeID];
                        let nodeProtos = LCSEditor.getPrototypes.call(self, self.kernel, node.extendsID);

                        if (nodeID && nodeID !== self.kernel.application()) {

                            var dublicate = {}
                            if (!nodeProtos.includes("proxy/aframe/componentNode.vwf")) {
                                dublicate = self.widgets.floatActionButton({
                                    label: "content_copy",
                                    styleClass: "mdc-fab--mini",
                                    id: "dublicateButton",
                                    tooltip: "Dublicate",
                                    onclickfunc: function () {
                                        //var nodeID = document.querySelector('#currentNode')._currentNode;
                                        let nodeDef = self.helpers.getNodeDef(nodeID);
                                        let newName = self.helpers.randId();
                                        let newNodeID = self.helpers.GUID();
                                        nodeDef.id = newNodeID;
                                        //let node = self.nodes[nodeID];
                                        vwf_view.kernel.callMethod(node.parentID, "createChild", [newName, nodeDef]);

                                    }
                                })
                            }

                            return {

                                $type: "div",
                                class: "propGrid mdc-layout-grid max-width mdc-layout-grid--align-left",
                                $components: [
                                    {

                                        $type: "div",
                                        class: "mdc-layout-grid__inner",
                                        $components: [

                                            {
                                                $type: "div",
                                                class: "mdc-layout-grid__cell mdc-layout-grid__cell--span-2",
                                                $components: [
                                                    dublicate
                                                ]
                                            },
                                            {
                                                $type: "div",
                                                class: "mdc-layout-grid__cell mdc-layout-grid__cell--span-2",
                                                $components: [
                                                    // self.widgets.tooltip({
                                                    //     id:"copy-",
                                                    //     text:"Copy"
                                                    // }),
                                                    self.widgets.floatActionButton({
                                                        label: "file_copy",
                                                        styleClass: "mdc-fab--mini",
                                                        id: "copyButton",
                                                        tooltip: "Copy",
                                                        onclickfunc: function () {
                                                            //var nodeID = document.querySelector('#currentNode')._currentNode;
                                                            let nodeDef = self.helpers.getNodeDef(nodeID);

                                                            if (nodeProtos.includes("proxy/aframe/componentNode.vwf")) {

                                                                if (!nodeDef.properties) nodeDef.properties = {}

                                                                nodeDef.properties.displayName = node.name;
                                                                nodeDef.type = "component";
                                                            }

                                                            self.copyBuffer = nodeDef
                                                        }
                                                    })
                                                ]
                                            },
                                            {
                                                $type: "div",
                                                class: "mdc-layout-grid__cell mdc-layout-grid__cell--span-2",
                                                $components: [

                                                    self.widgets.floatActionButton({
                                                        label: "content_cut",
                                                        styleClass: "mdc-fab--mini",
                                                        id: "cutButton",
                                                        tooltip: "Cut",
                                                        onclickfunc: function () {
                                                            //var nodeID = document.querySelector('#currentNode')._currentNode;
                                                            let nodeDef = self.helpers.getNodeDef(nodeID);

                                                            if (nodeProtos.includes("proxy/aframe/componentNode.vwf")) {

                                                                if (!nodeDef.properties) nodeDef.properties = {}

                                                                nodeDef.properties.displayName = node.name;
                                                            }


                                                            self.copyBuffer = nodeDef;
                                                            vwf_view.kernel.deleteNode(nodeID);

                                                        }
                                                    })
                                                ]
                                            },

                                            {
                                                $type: "div",
                                                class: "mdc-layout-grid__cell mdc-layout-grid__cell--span-2",
                                                $components: [

                                                    self.widgets.floatActionButton({
                                                        label: "delete_forever",
                                                        styleClass: "mdc-fab--mini",
                                                        id: "deleteButton",
                                                        tooltip: "Delete",
                                                        onclickfunc: function () {
                                                            vwf_view.kernel.deleteNode(nodeID);
                                                        }
                                                    }),

                                                ]
                                            },
                                            {
                                                $type: "div",
                                                class: "mdc-layout-grid__cell mdc-layout-grid__cell--span-12",
                                                $components: [
                                                    //saveGUI
                                                ]
                                            }
                                        ]
                                    }

                                ]
                            }

                        } else {
                            return {}
                        }

                    }


                    //let gizmoEditOld = 

                    let nodesCell = {

                        $cell: true,
                        $type: "div",
                        id: "currentNode",
                        _childNodes: [],
                        _currentNode: '',
                        _displayedProperties: {},
                        _setNode: function (aNode) {
                            this._currentNode = aNode;
                            document.querySelector('#sideBar')._sideCurrentNode = this._currentNode
                        },
                        $init: function () {
                            this._currentNode = document.querySelector('#sideBar')._sideCurrentNode

                            //this._currentNode = vwf_view.kernel.find("", "/")[0];
                            //this._currentNode = '3333';
                        },
                        _getChildNodes: function () {
                            this._childNodes = self.nodes[this._currentNode];
                            if (this._childNodes !== undefined) {
                                return this._childNodes.children
                            } else {
                                return []
                            }
                            //let nodeIDAlpha = he.encode(this._currentNode);

                        },
                        // _getNodeComplexProperties: function () {
                        //     let node = self.nodes[this._currentNode];
                        //     let props = this._getNodeProperties();
                        //     let filterFunction = function (prop) {
                        //         return (prop.name == 'ohmLang') 
                        //     };
                        //     let complexProps = props.filter(filterFunction.bind(this));

                        //     return complexProps
                        // },
                        _getNodeProperties: function () {
                            let node = self.nodes[this._currentNode];
                            this._displayedProperties = {};
                            let filterFunction = function (prop) {
                                return (!this._displayedProperties[prop.name] && prop.name.indexOf('$') === -1) ? (this._displayedProperties[prop.name] = "instance", true) : (false);
                            };
                            let props = node.properties.filter(filterFunction.bind(this));
                            return props
                        },
                        _getNodeProtoProperties: function () {
                            let node = self.nodes[this._currentNode];

                            let filterFunction = function (prop) {
                                return (!this._displayedProperties[prop[1].prop.name]) ? (this._displayedProperties[prop[1].prop.name] = prop[1].prototype, true) : (false);
                            };
                            let props = Object.entries(LCSEditor.getProperties.call(self, self.kernel, node.extendsID)).filter(filterFunction.bind(this));
                            return props
                        },
                        $update: function () {
                            //this.$text = this._currentNode;

                            let node = self.nodes[this._currentNode];

                            if (!node) return

                            let nodeProtos = LCSEditor.getPrototypes.call(self, self.kernel, node.extendsID);

                            var viewerProps = {};
                            var viewerPropsCell = {};

                            var propsActions = {};
                            var propsActionsCell = {};

                            let gizmoCell = gizmoEdit();
                            let audioCell = audioGUI();
                            let copyCell = copyGUI();


                            // if (this._currentNode !== self.kernel.application()) {
                            //     if (nodeProtos.includes('proxy/aframe/componentNode.vwf') || nodeProtos.includes('proxy/ohm/node.vwf') ) {
                            //             gizmoCell = compEdit;

                            //         if (nodeProtos.includes('proxy/aframe/a-sound-component.vwf')) {
                            //             //console.log("sound gui")
                            //             gizmoCell = audioGUI
                            //         }

                            //     } else {
                            //         gizmoCell = gizmoEdit
                            //     }
                            // }

                            if (node !== undefined) {

                                propsActions = {
                                    $type: "li",
                                    class: "mdc-list-item",
                                    $components: [
                                        {
                                            $text: "Actions",
                                            $type: "span",
                                            class: "mdc-list-item__text mdc-typography--button"

                                        }
                                    ]
                                }

                                let actionsGUI = [];

                                if (node.properties.meta) {
                                    if (node.properties.meta.rawValue == 'avatarCostume') {
                                        actionsGUI.push(self.widgets.buttonStroked(
                                            {
                                                "label": "Use this costume",
                                                "onclick": function (e) {
                                                    console.log("COSTUME NEW!!!");
                                                    let nodeDef = self.helpers.getNodeDef(this._currentNode);
                                                    console.log(nodeDef);
                                                    let avatarID = 'avatar-' + self.kernel.moniker();
                                                    vwf_view.kernel.callMethod(avatarID, "changeCostume", [nodeDef]);
                                                    //vwf_view.kernel.callMethod(this._currentNode, "setCameraToActive", [vwf.moniker_]);

                                                }
                                            }))
                                    }
                                } else if (node.name.includes('xrcontroller')) {
                                    actionsGUI.push(self.widgets.buttonStroked(
                                        {
                                            "label": "Set as World default XR controller",
                                            "onclick": function (e) {
                                                vwf_view.kernel.callMethod(node.ID, "saveToScene", []);

                                            }
                                        }))
                                }


                                propsActionsCell = {
                                    $cell: true,
                                    $type: "div",
                                    class: "propGrid mdc-layout-grid max-width mdc-layout-grid--align-left",
                                    $components: [
                                        {

                                            $type: "div",
                                            class: "mdc-layout-grid__inner",
                                            $components: [
                                                {

                                                    $type: "div",
                                                    class: "mdc-layout-grid__cell mdc-layout-grid__cell--span-12",
                                                    $components: [].concat(actionsGUI)
                                                }
                                            ]
                                        }

                                    ]
                                    //$components: this._getNodeProtoProperties().map(protoPropertiesCell)
                                }


                                if (node.extendsID == "proxy/aframe/acamera.vwf") {
                                    viewerProps = {
                                        $type: "li",
                                        class: "mdc-list-item",
                                        $components: [
                                            {
                                                $text: "Viewer properties",
                                                $type: "span",
                                                class: "mdc-list-item__text mdc-typography--button"

                                            }
                                        ]
                                    }

                                    viewerPropsCell = {
                                        $cell: true,
                                        $type: "div",
                                        class: "propGrid mdc-layout-grid max-width mdc-layout-grid--align-left",
                                        $components: [
                                            {

                                                $type: "div",
                                                class: "mdc-layout-grid__inner",
                                                $components: [
                                                    {

                                                        $type: "div",
                                                        class: "mdc-layout-grid__cell mdc-layout-grid__cell--span-12",
                                                        $components: [
                                                            self.widgets.buttonStroked(
                                                                {
                                                                    "label": "Active",
                                                                    "onclick": function (e) {
                                                                        //let camera = document.querySelector('#' + this._currentNode);
                                                                        vwf_view.kernel.callMethod(this._currentNode, "setCameraToActive", [vwf.moniker_]);
                                                                        //camera.setAttribute('camera', 'active', true);
                                                                    }
                                                                })


                                                        ]
                                                    }
                                                ]
                                            }

                                        ]
                                        //$components: this._getNodeProtoProperties().map(protoPropertiesCell)
                                    }


                                } else {
                                    viewerProps = {};
                                    viewerPropsCell = {};

                                }
                            }



                            this.$components = [
                                {

                                    $type: "ul",
                                    class: "mdc-list",
                                    $components: [


                                        {
                                            $type: "li",
                                            class: "mdc-list-item",
                                            $components: [
                                                self.widgets.buttonSimple(
                                                    {
                                                        "label": "<-",
                                                        "onclick": function (e) {
                                                            let node = self.nodes[this._currentNode];
                                                            if (node.parentID !== 0) {
                                                                //self.currentNodeID = node.parentID,
                                                                document.querySelector('#currentNode')._setNode(node.parentID)
                                                            }

                                                        }

                                                    }),
                                                {
                                                    $text: "name",
                                                    $type: "span",
                                                    $init: function () {
                                                        let node = self.nodes[this._currentNode];


                                                        if (node) {
                                                            let displayName = vwf.getProperty(node.ID, 'displayName');
                                                            if (displayName) {
                                                                this.$text = displayName
                                                            } else {
                                                                this.$text = node.name;
                                                            }
                                                        }





                                                        //console.log(node.properties.displayName)
                                                    },
                                                    class: "mdc-list-item__text mdc-typography--headline6"
                                                    //<h1 class="mdc-typography--display4">Big header</h1>
                                                },

                                                self.widgets.icontoggle({
                                                    'styleClass': "", //mdc-top-app-bar__action-item
                                                    'id': "selectNodeSwitch",
                                                    'label': 'select',
                                                    'on': JSON.stringify({ "content": "radio_button_checked", "label": "Select" }),
                                                    'off': JSON.stringify({ "content": "radio_button_unchecked", "label": "Unselect" }),
                                                    'state': false,
                                                    'init': function () {

                                                        this._comp = mdc.iconButton.MDCIconButtonToggle.attachTo(this);
                                                        this.addEventListener('MDCIconButtonToggle:change', (e) => {

                                                            let avatarID = 'avatar-' + vwf.moniker_;
                                                            let avatarNode = self.nodes['avatar-' + vwf.moniker_];
                                                            let mode = JSON.parse(avatarNode.properties.selectMode.getValue());

                                                            if (mode) {

                                                                console.log("unselect");
                                                                vwf_view.kernel.setProperty(avatarID, "selectMode", false);

                                                            } else {

                                                                console.log("select")
                                                                vwf_view.kernel.setProperty(avatarID, "selectMode", true);
                                                            }

                                                        });

                                                    }
                                                }),

                                                pasteGUI()

                                            ]
                                        },

                                        listDivider,
                                        {
                                            // $cell: true,
                                            // $type: "ul",
                                            // class: "mdc-list",
                                            $type: "div",
                                            class: "propGrid mdc-layout-grid max-width mdc-layout-grid--align-left",
                                            $components: [
                                                {
                                                    $type: "div",
                                                    class: "mdc-layout-grid__inner",
                                                    $components: [
                                                        {
                                                            $type: "div",
                                                            class: "mdc-layout-grid__cell mdc-layout-grid__cell--span-12",
                                                            $components: [
                                                                self.widgets.buttonStroked(
                                                                    {
                                                                        "label": "Methods browser",
                                                                        "onclick": function (e) {
                                                                            var currentNode = document.querySelector('#currentNode')._currentNode;
                                                                            if (currentNode == '') {
                                                                                currentNode = vwf_view.kernel.find("", "/")[0];
                                                                            }


                                                                            if (LCSEditor.isAFrameEntity.call(self, currentNode)) {
                                                                                vwf.views["/drivers/view/aframe"].nodes[currentNode].liveBindings = {};
                                                                            } else if (LCSEditor.isAFrameComponent.call(self, currentNode)) {
                                                                                vwf.views["/drivers/view/aframeComponent"].nodes[currentNode].liveBindings = {};
                                                                            }



                                                                            document.querySelector('#liveCodeEditor')._setNode(currentNode);
                                                                            //createAceEditor(self, currentNode);
                                                                            document.querySelector('#codeEditorWindow').style.visibility = 'visible';
                                                                        }
                                                                    })

                                                            ]
                                                        }

                                                    ]
                                                }
                                            ]
                                        },
                                        gizmoCell,
                                        audioCell,
                                        listDivider,

                                        copyCell,
                                        listDivider,
                                        {
                                            $type: "li",
                                            class: "mdc-list-item",
                                            $components: [
                                                {
                                                    $text: "Children",
                                                    $type: "span",
                                                    class: "mdc-list-item__text mdc-typography--button"

                                                }]
                                        },
                                        {

                                            $type: "ul",
                                            class: "mdc-list",
                                            $components: this._getChildNodes().map(nodeLink)
                                        }, listDivider, {
                                            $type: "li",
                                            class: "mdc-list-item",
                                            $components: [
                                                {
                                                    $text: "Properties",
                                                    $type: "span",
                                                    class: "mdc-list-item__text mdc-typography--button"
                                                    //<h1 class="mdc-typography--display4">Big header</h1>
                                                }]
                                        },
                                        {
                                            // $cell: true,
                                            // $type: "ul",
                                            // class: "mdc-list",
                                            $type: "div",
                                            class: "propGrid mdc-layout-grid max-width mdc-layout-grid--align-left",
                                            $components: this._getNodeProperties().map(propertiesCell)
                                        },
                                        listDivider,
                                        {
                                            $type: "li",
                                            class: "mdc-list-item",
                                            $components: [
                                                {
                                                    $text: "Proto properties",
                                                    $type: "span",
                                                    class: "mdc-list-item__text mdc-typography--button"

                                                }]
                                        },
                                        {

                                            $type: "div",
                                            class: "propGrid mdc-layout-grid max-width mdc-layout-grid--align-left",
                                            $components: this._getNodeProtoProperties().map(protoPropertiesCell)
                                        }, listDivider,
                                        propsActions,
                                        propsActionsCell,
                                        listDivider,
                                        viewerProps,
                                        viewerPropsCell

                                    ]
                                }




                            ]
                        }

                    }

                    let colorPickerComponent = {
                        $cell: true,
                        $type: "div",
                        class: "mdc-layout-grid__cell mdc-layout-grid__cell--span-4",
                        $init: function () {
                            let myEl = this;
                            let cp = ColorPicker(

                                document.getElementById('slide'),
                                document.getElementById('picker'),



                                function (hex, hsv, rgb, mousePicker, mouseSlide) {
                                    ColorPicker.positionIndicators(
                                        document.getElementById('slide-indicator'),
                                        document.getElementById('picker-indicator'),
                                        mouseSlide, mousePicker
                                    );
                                    if (myEl._propName.toLowerCase().includes('color')) {

                                        // console.log(hex);    
                                        document.querySelector('#propAceEditor').env.editor.setValue(JSON.stringify(hex));
                                        self.kernel.setProperty(myEl._editorNode, myEl._propName, hex);
                                    }
                                });
                            if (myEl._propName.toLowerCase().includes('color')) {
                                cp.setHex(JSON.parse(myEl._prop.body));
                            }
                        },
                        $components: [
                            {

                                $type: "div",
                                id: "color-picker",
                                class: "cp-default",
                                $components: [
                                    {

                                        $type: "div",
                                        class: "picker-wrapper",
                                        $components: [
                                            {

                                                $type: "div",
                                                id: "picker",
                                                class: "picker",
                                                style: "width: 130px; height: 130px"
                                            },
                                            {

                                                $type: "div",
                                                id: "picker-indicator",
                                                class: "picker-indicator"
                                            }
                                        ]
                                    },
                                    {

                                        $type: "div",
                                        class: "slide-wrapper",
                                        $components: [
                                            {

                                                $type: "div",
                                                id: "slide",
                                                class: "slide",
                                                style: "width: 30px; height: 130px"
                                            },
                                            {

                                                $type: "div",
                                                id: "slide-indicator",
                                                class: "slide-indicator"
                                            }
                                        ]
                                    }
                                ]
                            }
                            // {
                            //     $cell: true,
                            //     $type: "div",
                            //     id: "color-picker",
                            //     $init: function () {

                            //     }
                            // }

                        ]
                    }


                    let propEditorWindow = {
                        $cell: true,
                        $type: "div",
                        _editorNode: '',
                        _prop: { body: '', type: 'simple' },
                        _propName: '',
                        id: "livePropEditor",
                        _setNode: function (node) {
                            this._editorNode = node;
                            this._prop.body = ''
                        },
                        class: "propEditorGrid mdc-layout-grid max-width mdc-layout-grid--align-left",
                        $update: function () {

                            var editorClass = "mdc-layout-grid__cell mdc-layout-grid__cell--span-8"
                            var livePropertyComponent = {}

                            if (this._prop.type == 'simple') {
                                if (this._propName.toLowerCase().includes('color')) {
                                    livePropertyComponent = colorPickerComponent
                                }


                            } else {
                                editorClass = "mdc-layout-grid__cell mdc-layout-grid__cell--span-12"
                            }


                            this.$components = [
                                {

                                    $type: "div",
                                    class: "mdc-layout-grid__inner",
                                    $components: [

                                        {

                                            $type: "div",
                                            class: "mdc-layout-grid__cell mdc-layout-grid__cell--span-2",
                                            $components: [
                                                self.widgets.buttonStroked(
                                                    {
                                                        "label": "Update",
                                                        "onclick": function (e) {
                                                            let editor = document.querySelector("#propAceEditor").env.editor;
                                                            let value = editor.getValue();

                                                            var propValue = value;

                                                            if (this._prop.type == 'simple') {
                                                                if (self.helpers.testJSON(value)) {
                                                                    propValue = JSON.parse(value);
                                                                }
                                                            } else {
                                                                propValue = value;
                                                            }

                                                            self.kernel.setProperty(this._editorNode, this._propName, propValue);


                                                            // try {
                                                            //     let propValue = (this._prop.type == 'simple') ? (JSON.parse(value)) : (value)
                                                            //     //propValue = JSON.parse(value);
                                                            //     self.kernel.setProperty(this._editorNode, this._propName, propValue);

                                                            // } catch (e) {
                                                            //     // restore the original value on error
                                                            //     this.value = propValue;
                                                            // }

                                                        }
                                                    }
                                                )]
                                        },
                                        {

                                            $type: "div",
                                            class: "mdc-layout-grid__cell mdc-layout-grid__cell--span-5",
                                            $components: [
                                                {
                                                    $type: "h3",
                                                    class: "mdc-list-group__subheader mdc-list-item__text mdc-typography--subheading1",
                                                    $text: this._editorNode
                                                }

                                            ]
                                        },
                                        {

                                            $type: "div",
                                            class: "mdc-layout-grid__cell mdc-layout-grid__cell--span-5",
                                            $components: [
                                                {
                                                    $type: "h3",
                                                    class: "mdc-list-group__subheader mdc-list-item__text mdc-typography--subheading1",
                                                    $text: this._propName
                                                }

                                            ]
                                        }



                                    ]
                                },
                                {

                                    $type: "div",
                                    class: "mdc-layout-grid__inner",
                                    $components: [
                                        {

                                            $type: "div",
                                            class: editorClass,
                                            $components: [
                                                {

                                                    class: "aceEditor",
                                                    id: "propAceEditor",
                                                    $type: "div",
                                                    $text: this._prop.body,
                                                    $init: function () {
                                                        LCSEditor.createAceEditor.call(self, this._editorNode, "propAceEditor");
                                                        this.env.editor.$blockScrolling = Infinity
                                                    }
                                                }

                                            ]
                                        }, livePropertyComponent
                                        // {
                                        //     $cell: true,
                                        //     $type: "div",
                                        //     class: "mdc-layout-grid__cell mdc-layout-grid__cell--span-2",
                                        //     $components: []
                                        // },

                                    ]
                                }

                            ]
                            //$components: 
                        }
                    }

                    let codeEditorWindow = {
                        $cell: true,
                        $type: "div",
                        _editorNode: '',
                        _method: { body: '' },
                        _methodName: '',
                        _tabIndex: '',
                        _getNodeMethods: function () {
                            let node = self.nodes[this._editorNode];
                            return node.methods
                        },
                        _getProtoNodeMethods: function () {
                            let node = self.nodes[this._editorNode];
                            let prototypeMethods = LCSEditor.getMethods.call(self, self.kernel, node.extendsID);
                            return prototypeMethods
                        },
                        id: "liveCodeEditor",
                        _setNode: function (node) {
                            this._editorNode = node;
                            this._method.body = ''
                        },
                        class: "codeEditorGrid mdc-layout-grid max-width mdc-layout-grid--align-left resizable",
                        // _getComplexProps: function(){
                        //     let node = self.nodes[this._editorNode];
                        //     let currentNode = document.querySelector('#currentNode');
                        //     var props = {}
                        //     if (currentNode !== null) {
                        //         props = currentNode._getNodeComplexProperties();
                        //     }
                        //     return props
                        // },
                        // _listPropertyElement: function (m) {

                        //     return {
                        //         $type: "li",
                        //         class: "mdc-list-item",
                        //         $components: [{
                        //             $type: "a",
                        //             class: "mdc-list-item",
                        //             $href: "#",
                        //             $text: m[1].name,

                        //             onclick: function (e) {

                        //                 this._method = {};
                        //                 this._methodName = m[1].name;
                        //                 this._method.body = m[1].rawValue
                        //                 this._method.type = "complexProperty"

                        //             }
                        //         }]
                        //     }
                        // },
                        _listElement: function (m) {

                            return {
                                $type: "li",
                                class: "mdc-list-item",
                                $components: [{
                                    $type: "a",
                                    class: "mdc-list-item",
                                    $href: "#",
                                    $text: m[0],

                                    onclick: function (e) {
                                        let method = vwf.getMethod(this._editorNode, m[0]);
                                        //document.querySelector('#aceEditor').
                                        this._method = method;
                                        this._methodName = m[0];
                                        //self.currentNodeID = m.ID;
                                        //document.querySelector('#currentNode')._setNode(m.ID);
                                    }
                                }]
                            }
                        },
                        $update: function () {
                            this.$components = [
                                {

                                    $type: "div",
                                    class: "mdc-layout-grid__inner",
                                    $components: [
                                        {

                                            $type: "div",
                                            class: "mdc-layout-grid__cell mdc-layout-grid__cell--span-3",
                                            $components: [
                                                {
                                                    $type: "h3",
                                                    class: "mdc-list-group__subheader mdc-list-item__text mdc-typography--subheading1",
                                                    $text: this._editorNode
                                                }

                                            ]
                                        },


                                        {

                                            $type: "div",
                                            class: "mdc-layout-grid__cell mdc-layout-grid__cell--span-1 tooltip",
                                            $components: [
                                                {
                                                    class: "tooltiptext",
                                                    $type: "span",
                                                    $text: "Update"
                                                },
                                                self.widgets.iconButton({
                                                    'label': 'refresh',
                                                    "styleClass": "mdc-button--outlined",
                                                    // self.widgets.buttonStroked(
                                                    //     {
                                                    //         "label": "Update",
                                                    "onclick": function (e) {
                                                        let editor = document.querySelector("#aceEditor").env.editor;
                                                        let evalText = editor.getValue();

                                                        //    if (this._method.type == 'complexProperty') {

                                                        //         let propValue = evalText;
                                                        //         try {
                                                        //             //propValue = JSON.parse(propValue);
                                                        //             self.kernel.setProperty(this._editorNode, this._methodName, propValue);

                                                        //         } catch (e) {
                                                        //             // restore the original value on error
                                                        //             this.value = propValue;
                                                        //         }
                                                        //     } else {

                                                        //     }
                                                        self.kernel.setMethod(this._editorNode, this._methodName,
                                                            { body: evalText, type: "application/javascript", parameters: this._method.parameters });
                                                    }

                                                }
                                                )]
                                        },
                                        {

                                            $type: "div",
                                            class: "mdc-layout-grid__cell mdc-layout-grid__cell--span-1 tooltip",
                                            $components: [
                                                {
                                                    class: "tooltiptext",
                                                    $type: "span",
                                                    $text: "Call It"
                                                },
                                                self.widgets.iconButton({
                                                    'label': 'play_arrow',
                                                    "styleClass": "mdc-button--outlined",
                                                    // self.widgets.buttonStroked(
                                                    //     {
                                                    //         "label": "Call",
                                                    "onclick": function (e) {
                                                        var params = [];

                                                        if (this._method.parameters) {
                                                            let paramsLength = this._method.parameters.length


                                                            if (paramsLength >= 1) {
                                                                let paramsVal = document.querySelector("#methodParams").value;
                                                                try {
                                                                    params = JSON.parse(paramsVal);
                                                                    //params.push(prmtr);
                                                                } catch (e) {
                                                                    self.logger.error('Invalid Value');
                                                                }
                                                            }
                                                        };

                                                        let editor = document.querySelector("#aceEditor").env.editor;
                                                        let evalText = editor.getValue();
                                                        let allLines = editor.selection.doc.getAllLines();

                                                        let search = this._methodName + '(';
                                                        let findLine = Object.entries(allLines).filter(el => el[1].includes(search))[0];


                                                        //TODO: temporal fix for recursive future call from the editor
                                                        if (findLine) {
                                                            if (findLine[1].includes(search)) {

                                                                let position = {
                                                                    row: findLine[0],
                                                                    column: 0
                                                                };
                                                                var Range = ace.require("ace/range").Range;
                                                                let tempString = "//CLICK FOR CALL AGAIN ";

                                                                if (findLine[1].includes(tempString)) {
                                                                    let newText = findLine[1].replace(tempString, "");

                                                                    editor.session.replace(new Range(position.row, 0, position.row, Number.MAX_VALUE), newText);
                                                                    self.kernel.setMethod(this._editorNode, this._methodName,
                                                                        { body: editor.getValue(), type: "application/javascript", parameters: this._method.parameters });
                                                                } else if (findLine[1].includes("//")) { //startsWith
                                                                } else {

                                                                    let newText = tempString + findLine[1];
                                                                    editor.session.replace(new Range(position.row, 0, position.row, Number.MAX_VALUE), newText);
                                                                    self.kernel.setMethod(this._editorNode, this._methodName,
                                                                        { body: editor.getValue(), type: "application/javascript", parameters: this._method.parameters });
                                                                }

                                                            }
                                                        }
                                                        self.kernel.callMethod(this._editorNode, this._methodName, params);
                                                    }
                                                })
                                            ]
                                        },
                                        {

                                            $type: "div",
                                            class: "mdc-layout-grid__cell mdc-layout-grid__cell--span-1 tooltip",
                                            $components: [
                                                {
                                                    class: "tooltiptext",
                                                    $type: "span",
                                                    $text: "Do It"
                                                },
                                                self.widgets.iconButton({
                                                    'label': 'arrow_forward',
                                                    "styleClass": "mdc-button--outlined",
                                                    // self.widgets.buttonStroked(
                                                    //     {
                                                    //         "label": "Do It",
                                                    "onclick": function (e) {
                                                        let editor = document.querySelector("#aceEditor").env.editor;
                                                        LCSEditor.codeEditorDoit.call(self, editor, this._editorNode);
                                                    }
                                                })
                                            ]
                                        },
                                        {

                                            $type: "div",
                                            class: "mdc-layout-grid__cell mdc-layout-grid__cell--span-1 tooltip",
                                            $components: [
                                                {
                                                    class: "tooltiptext",
                                                    $type: "span",
                                                    $text: "Print It"
                                                },
                                                self.widgets.iconButton({
                                                    'label': 'details',
                                                    "styleClass": "mdc-button--outlined",
                                                    // self.widgets.buttonStroked(
                                                    //     {
                                                    //         "label": "Print It",
                                                    "onclick": function (e) {
                                                        let editor = document.querySelector("#aceEditor").env.editor;
                                                        LCSEditor.codeEditorPrintit.call(self, editor, this._editorNode);
                                                    }
                                                })
                                            ]
                                        },
                                        {

                                            $type: "div",
                                            class: "mdc-layout-grid__cell mdc-layout-grid__cell--span-1 tooltip",
                                            $components: [
                                                {
                                                    class: "tooltiptext",
                                                    $type: "span",
                                                    $text: "Print It on Console"
                                                },
                                                self.widgets.iconButton({
                                                    'label': 'code',
                                                    "styleClass": "mdc-button--outlined",
                                                    // self.widgets.buttonStroked(
                                                    //     {
                                                    //         "label": "Print It on Console",
                                                    "onclick": function (e) {
                                                        let editor = document.querySelector("#aceEditor").env.editor;
                                                        LCSEditor.codeEditorPrintitInDebugger.call(self, editor, this._editorNode);
                                                    }
                                                })
                                            ]
                                        }

                                    ]
                                },
                                {

                                    $type: "div",
                                    class: "mdc-layout-grid__inner",
                                    $components: [
                                        {

                                            $type: "div",
                                            class: "mdc-layout-grid__cell mdc-layout-grid__cell--span-3",
                                            style: "overflow-y: scroll; max-height: 400px;",
                                            $components: [
                                                {

                                                    $type: "div",
                                                    class: "mdc-list-group",

                                                    $components: [

                                                        {
                                                            $type: "h3",
                                                            class: "mdc-list-group__subheader mdc-list-item__text mdc-typography--button",
                                                            $text: "Node methods"
                                                        },
                                                        {

                                                            $type: "ul",
                                                            class: "mdc-list",
                                                            $components: Object.entries(this._getNodeMethods()).map(this._listElement)
                                                        }, listDivider,
                                                        {
                                                            $type: "h3",
                                                            class: "mdc-list-group__subheader mdc-list-item__text mdc-typography--button",
                                                            $text: "Proto methods"
                                                        },
                                                        {

                                                            $type: "ul",
                                                            class: "mdc-list",
                                                            $components: Object.entries(this._getProtoNodeMethods()).map(this._listElement)
                                                        }, listDivider,
                                                        {
                                                            $type: "h3",
                                                            class: "mdc-list-group__subheader mdc-list-item__text mdc-typography--button",
                                                            $text: "Events"
                                                        }
                                                        // {
                                                        //     
                                                        //     $type: "ul",
                                                        //     class: "mdc-list",
                                                        //     $components: Object.entries(this._getComplexProps()).map(this._listPropertyElement)
                                                        // }

                                                    ]


                                                }
                                            ]
                                        },

                                        {

                                            $type: "div",
                                            class: "mdc-layout-grid__cell mdc-layout-grid__cell--span-9",
                                            $components: [
                                                {

                                                    class: "aceEditor",
                                                    id: "aceEditor",
                                                    $type: "div",
                                                    $text: this._method.body,
                                                    $init: function () {
                                                        LCSEditor.createAceEditor.call(self, this._editorNode, "aceEditor");
                                                    }
                                                }

                                            ]
                                        }
                                    ]
                                },
                                {

                                    $type: "div",
                                    class: "mdc-layout-grid__inner",
                                    $components: [
                                        {

                                            $type: "div",
                                            class: "mdc-layout-grid__cell mdc-layout-grid__cell--span-12",
                                            $components: [
                                                {
                                                    $type: "span",
                                                    $text: "*"
                                                }
                                            ]
                                        }
                                    ]
                                },
                                { //params input

                                    $type: "div",
                                    class: "mdc-layout-grid__inner",
                                    $components: [
                                        {

                                            $type: "div",
                                            class: "mdc-layout-grid__cell mdc-layout-grid__cell--span-3",
                                            $components: [
                                                self.widgets.inputTextFieldOutlined({
                                                    "id": 'methodName',
                                                    "label": "Method name",
                                                    "value": "newMethodName",
                                                    "change": function (e) {
                                                        let propValue = this.value;
                                                        try {

                                                        } catch (e) {
                                                            // restore the original value on error

                                                        }
                                                    }
                                                })

                                            ]
                                        },

                                        {

                                            $type: "div",
                                            class: "mdc-layout-grid__cell mdc-layout-grid__cell--span-7",
                                            $components: [
                                                self.widgets.inputTextFieldOutlined({
                                                    "id": 'methodParams',
                                                    "label": "Method parameters",
                                                    "value": JSON.stringify(this._method.parameters),
                                                    "change": function (e) {
                                                        let propValue = this.value;
                                                        try {

                                                        } catch (e) {
                                                            // restore the original value on error

                                                        }
                                                    }
                                                })

                                            ]
                                        },
                                        {

                                            $type: "div",
                                            class: "mdc-layout-grid__cell mdc-layout-grid__cell--span-2",
                                            $components: [
                                                self.widgets.buttonStroked(
                                                    {
                                                        "label": "Create",
                                                        "onclick": function (e) {
                                                            let methodName = document.querySelector('#methodName').value;
                                                            //let methodParams = document.querySelector('#methodParams');
                                                            var params = [];
                                                            let body = '';
                                                            let paramsVal = document.querySelector("#methodParams").value;
                                                            if (paramsVal !== '') {
                                                                try {
                                                                    params = JSON.parse(paramsVal);
                                                                    //params.push(prmtr);
                                                                } catch (e) {
                                                                    self.logger.error('Invalid Value');
                                                                }
                                                            }


                                                            self.kernel.createMethod(this._editorNode, methodName, params, body);
                                                            this._setNode(this._editorNode);
                                                            // let editor = document.querySelector("#aceEditor").env.editor;
                                                            // codeEditorDoit.call(self, editor, this._editorNode);
                                                        }
                                                    })
                                            ]
                                        }
                                    ]
                                }

                            ]
                            //$components: 
                        }
                    }

                    let propWindow = {
                        $cell: true,
                        $type: "div",
                        class: "propGrid mdc-layout-grid max-width mdc-layout-grid--align-left",
                        style: "overflow-y: scroll; max-height: 800px;",

                        $components: [
                            {
                                $type: "div",
                                class: "mdc-layout-grid__inner",
                                $components: [
                                    {

                                        $type: "div",
                                        class: "mdc-layout-grid__cell mdc-layout-grid__cell--span-12",
                                        $components: [

                                            nodesCell

                                        ]
                                    }
                                ]
                            }




                            //     <button class="mdc-button">
                            //     Flat button
                            //   </button>
                        ]

                    }





                    let clientListCell = {
                        $cell: true,
                        $type: "div",
                        class: "mdc-list",
                        id: "clientsList",
                        _watchNodes: [],
                        _listElement: function (m) {
                            return {

                                $type: "a",
                                class: "mdc-list-item",
                                $href: "#",
                                $text: m.name,

                                onclick: function (e) {
                                    //self.currentNodeID = m.ID;
                                    //document.querySelector('#currentNode')._setNode(m.ID);
                                }
                            }
                        },
                        $init: function () {
                            var t = this;
                            setInterval(function () {
                                t._updateMe();
                            }, 1000);
                        },
                        _updateMe: function () {
                            let clientNodes = self.nodes["proxy/clients.vwf"];
                            if (clientNodes) this._watchNodes = self.nodes["proxy/clients.vwf"].children.slice();
                        },
                        $update: function () {
                            //this._clientNodes
                            this.$components = this._watchNodes.map(this._listElement)
                        }
                    }

                    //createCellWindow("clientsWindow", clientListCell, "Clients");
                    //createCellWindow("propWindow", propWindow, "Scene");
                    _self_.createCellWindow("codeEditorWindow", codeEditorWindow, "Code editor");
                    _self_.createCellWindow("propEditorWindow", propEditorWindow, "Prop editor");




                    let viewSceneProps = {
                        $cell: true,
                        $type: "div",
                        class: "propGrid mdc-layout-grid mdc-layout-grid--align-left",
                        //style: "overflow-y: scroll; max-height: 500px; overflow-x: hidden;",
                        $components: [
                            {
                                $type: "div",
                                class: "mdc-layout-grid__inner",
                                $components: [
                                    {

                                        $type: "div",
                                        class: "mdc-layout-grid__cell mdc-layout-grid__cell--span-12",
                                        $components: [

                                            nodesCell

                                        ]
                                    }]
                            }
                        ]
                    }


                    let sideBar = {
                        $cell: true,
                        $type: "div",
                        id: 'sideBar',
                        class: "sideBar mdc-top-app-bar--fixed-adjust",
                        _sideBarComponent: {},
                        _sideCurrentNode: '',
                        $init: function () {
                            this.style.visibility = 'hidden';
                            let fileName = 'appui_js';
                            let worldName = self.helpers.getRoot().root;//url.split('/')[0];
                            let userDB = _LCSDB.user(_LCS_WORLD_USER.pub);

                            userDB.get('worlds').get(worldName).get(fileName).once(res => {

                                this._importScript(res);
                            })


                        },
                        _importScript: function (sSrc, fOnload) {
                            var oScript = document.createElement("script");
                            oScript.type = "text\/javascript";
                            oScript.async = false;
                            //oScript.onerror = loadError;
                            if (fOnload) { oScript.onload = fOnload; }
                            oScript.text = sSrc;
                            //let sideBar = document.querySelector('#sideBar');
                            this.appendChild(oScript);
                        },
                        _getAppDef: async function () {
                            // let response = await fetch("/" + self.getRoot() + "/appui.js");
                            // let data = await response.text();
                            // //console.log(data)
                            // return data
                        },
                        $update: function () {
                            this.$components = [
                                {

                                    $type: "button",
                                    class: "mdc-button mdc-button--compact",
                                    $text: "X",
                                    onclick: function (e) {
                                        document.querySelector('#sideBar').style.visibility = 'hidden';
                                        this._sideBarComponent = Object.assign({}, {});
                                    }

                                },
                                {
                                    $type: "button",
                                    class: "mdc-button mdc-button--compact",
                                    $text: " | ",
                                    onclick: function (e) {
                                        if (document.querySelector('#currentNode'))
                                            document.querySelector('#currentNode')._setNode(vwf.application())
                                    }
                                },


                                this._sideBarComponent
                            ]
                        }
                        //$components: [this._sideComponents]
                    }

                    document.querySelector('#' + 'sideBar').$cell(sideBar)

                    let defaultApp = function () {
                        return {
                            $cell: true,
                            $type: "div",
                            class: "propGrid max-width mdc-layout-grid mdc-layout-grid--align-left",
                            $components: [
                                {

                                    $type: "div",
                                    class: "mdc-layout-grid__inner",
                                    $components: [
                                        {

                                            $type: "div",
                                            class: "mdc-layout-grid__cell mdc-layout-grid__cell--span-12",
                                            $components: [
                                                {

                                                    $type: "h3",
                                                    class: "mdc-typography--headline",
                                                    $text: "Application",


                                                }

                                            ]
                                        }
                                    ]
                                }
                            ]
                        }
                    }

                    let drawerCell = {
                        $cell: true,
                        $type: "div",
                        class: "mdc-drawer__content",
                        $components: [
                            {
                                $type: "nav",
                                class: "mdc-list",
                                $init: function () { },
                                $components: [


                                    {
                                        $type: "a",
                                        class: "mdc-list-item mdc-list-item--activated",
                                        $href: "#",
                                        tabindex: "-1",
                                        onclick: function (e) {
                                            e.preventDefault();
                                            let sideBar = document.querySelector('#sideBar');

                                            try {
                                                sideBar._sideBarComponent = createApp.call(self);
                                            } catch (e) {
                                                sideBar._sideBarComponent = defaultApp();
                                            }

                                            self.drawer.open = false//!self.drawer.open
                                            //self.drawer.close();
                                            document.querySelector('#sideBar').style.visibility = 'visible';
                                        },
                                        $components: [{
                                            $type: "i",
                                            class: "material-icons mdc-list-item__graphic",
                                            'aria-hidden': "true",
                                            $text: "play_arrow"
                                        },
                                        {
                                            $text: self.lang.t("App")
                                        }]

                                    },
                                    {

                                        $type: "a",
                                        class: "mdc-list-item",
                                        $href: "#",
                                        tabindex: "-1",
                                        onclick: function (e) {
                                            e.preventDefault();
                                            let sideBar = document.querySelector('#sideBar');
                                            sideBar._sideBarComponent = viewSceneProps;

                                            let currentNode = document.querySelector('#sideBar')._sideCurrentNode;
                                            currentNode == '' ? document.querySelector('#sideBar')._sideCurrentNode = (vwf_view.kernel.find("", "/")[0]) :
                                                document.querySelector('#sideBar')._sideCurrentNode = currentNode;

                                            document.querySelector('#sideBar').style.visibility = 'visible';
                                            self.drawer.open = !self.drawer.open
                                            // let currentNode = document.querySelector('#currentNode')._currentNode;
                                            // currentNode == '' ? document.querySelector('#currentNode')._setNode(vwf_view.kernel.find("", "/")[0]) :
                                            //     document.querySelector('#currentNode')._setNode(currentNode);




                                        },
                                        $components: [{

                                            $type: "i",
                                            class: "material-icons mdc-list-item__graphic",
                                            $text: "description"
                                        },
                                        {
                                            $text: "Scene"
                                        }
                                        ]

                                    },

                                    {

                                        $type: "a",
                                        class: "mdc-list-item",
                                        $href: "#",
                                        tabindex: "-1",
                                        onclick: function (e) {
                                            e.preventDefault();
                                            //self.currentNodeID = m.ID;

                                            // document.querySelector('#clientsList')._setClientNodes(self.nodes["proxy/clients.vwf"]);
                                            // document.querySelector('#clientsWindow').style.visibility = 'visible';
                                            let sideBar = document.querySelector('#sideBar');
                                            sideBar._sideBarComponent = createSettings;

                                            self.drawer.open = !self.drawer.open
                                            document.querySelector('#sideBar').style.visibility = 'visible';
                                        },
                                        $components: [{
                                            $type: "i",
                                            class: "material-icons mdc-list-item__graphic",
                                            'aria-hidden': "true",
                                            $text: "create"
                                        },
                                        {
                                            $text: "Create"
                                        }]

                                    },

                                    {

                                        $type: "a",
                                        class: "mdc-list-item",
                                        $href: "#",
                                        tabindex: "-1",
                                        onclick: function (e) {
                                            e.preventDefault();
                                            // var currentNode = document.querySelector('#currentNode')._currentNode;
                                            // if (currentNode == '') {
                                            //     currentNode = vwf_view.kernel.find("", "/")[0];
                                            // }
                                            document.querySelector('#liveCodeEditor')._setNode(vwf_view.kernel.find("", "/")[0]);
                                            //createAceEditor(self, currentNode);
                                            document.querySelector('#codeEditorWindow').style.visibility = 'visible';
                                        },
                                        $components: [{
                                            $type: "i",
                                            class: "material-icons mdc-list-item__graphic",
                                            'aria-hidden': "true",
                                            $text: "code"
                                        },
                                        {
                                            $text: "Code editor"
                                        }]

                                    },

                                    {

                                        $type: "a",
                                        class: "mdc-list-item",
                                        $href: "#",
                                        tabindex: "-1",
                                        onclick: function (e) {
                                            e.preventDefault();
                                            //self.currentNodeID = m.ID;

                                            // document.querySelector('#clientsList')._setClientNodes(self.nodes["proxy/clients.vwf"]);
                                            // document.querySelector('#clientsWindow').style.visibility = 'visible';
                                            let sideBar = document.querySelector('#sideBar');
                                            sideBar._sideBarComponent = avatarSettings;

                                            self.drawer.open = !self.drawer.open
                                            document.querySelector('#sideBar').style.visibility = 'visible';
                                        },
                                        $components: [{
                                            $type: "i",
                                            class: "material-icons mdc-list-item__graphic",
                                            'aria-hidden': "true",
                                            $text: "account_circle"
                                        },
                                        {
                                            $text: "My Avatar"
                                        }]

                                    },


                                    {

                                        $type: "a",
                                        class: "mdc-list-item",
                                        $href: "#",
                                        tabindex: "-1",
                                        onclick: function (e) {
                                            e.preventDefault();
                                            //self.currentNodeID = m.ID;

                                            // document.querySelector('#clientsList')._setClientNodes(self.nodes["proxy/clients.vwf"]);

                                            let sideBar = document.querySelector('#sideBar');
                                            sideBar._sideBarComponent = viewSettings;

                                            self.drawer.open = !self.drawer.open
                                            document.querySelector('#sideBar').style.visibility = 'visible';
                                        },
                                        $components: [{
                                            $type: "i",
                                            class: "material-icons mdc-list-item__graphic",
                                            'aria-hidden': "true",
                                            $text: "settings"
                                        },
                                        {
                                            $text: "Settings"
                                        }]

                                    },
                                    {

                                        $type: "a",
                                        class: "mdc-list-item",
                                        $href: "#",
                                        tabindex: "-1",
                                        onclick: function (e) {
                                            e.preventDefault();
                                            //self.currentNodeID = m.ID;

                                            // document.querySelector('#clientsList')._setClientNodes(self.nodes["proxy/clients.vwf"]);

                                            let sideBar = document.querySelector('#sideBar');

                                            sideBar._sideBarComponent = loadSaveSettings;

                                            if (document.querySelector('#loadSaveSettings')) {
                                                //document.querySelector('#loadSaveSettings')._refresh();
                                                //document.querySelector('#loadSaveSettings')._getStates();
                                            }
                                            //sideBar._sideBarComponent._getStates();
                                            self.drawer.open = !self.drawer.open
                                            document.querySelector('#sideBar').style.visibility = 'visible';



                                        },
                                        $components: [{
                                            $type: "i",
                                            class: "material-icons mdc-list-item__graphic",
                                            'aria-hidden': "true",
                                            $text: "save"
                                        },
                                        {
                                            $text: "Clone/Save"
                                        }]

                                    },





                                    self.widgets.divider,
                                    webrtcGUI,
                                    self.widgets.divider,
                                    self.widgets.headerH3("h3", "Users online", "userList mdc-list-group__subheader"),
                                    clientListCell
                                    //widgets.headerH3("h3", "WebRTC", "userList mdc-list-group__subheader"),

                                ]
                            }

                            // {
                            //     $cell: true,
                            //     $type: "div",
                            //     class: "mdc-persistent-drawer__toolbar-spacer",
                            // },



                            // {
                            //     $cell: true,
                            //     $type: "div",
                            //     class: "mdc-list-group",
                            //     $components: [{
                            //         $cell: true,
                            //         $type: "nav",
                            //         class: "mdc-list",
                            //         $components: [


                            //         ]
                            //     }]
                            // }
                        ]

                    };

                    //             <div class="mdc-form-field">
                    //   <input type="checkbox" id="input">
                    //   <label for="input">Input Label</label>
                    // </div>

                    document.querySelector("#drawer").$cell({
                        $cell: true,
                        $type: "aside",
                        class: "mdc-drawer mdc-drawer--modal",
                        $init: function () {
                            let elScrim = document.createElement("div");
                            elScrim.classList.add("mdc-drawer-scrim");
                            this.after(elScrim);

                            self.drawer = new mdc.drawer.MDCDrawer(this);
                        },
                        $components: [
                            {
                                $type: "div",
                                class: "mdc-drawer__header",
                                $components: [
                                    {
                                        $type: "h3",
                                        class: "mdc-drawer__title",
                                        $text: self.lang.t("home")
                                    },
                                    {
                                        $type: "h6",
                                        class: "mdc-drawer__subtitle",
                                        $text: "menu"
                                    }
                                ]

                            },
                            // {     
                            //         $type: "button"
                            // },
                            drawerCell]
                    }
                    );


                    let toolbar = {
                        $cell: true,
                        $type: "div",
                        class: "mdc-top-app-bar__row",
                        $components: [{
                            $type: "section",
                            class: "mdc-top-app-bar__section mdc-top-app-bar__section--align-start",
                            $components: [
                                {
                                    $type: "button",
                                    type: "button",
                                    class: "mdc-icon-button material-icons mdc-top-app-bar__navigation-icon",
                                    $text: "menu"


                                },
                                {
                                    $type: "span",
                                    class: "mdc-top-app-bar__title catalog-title",
                                    $text: "LiveCoding.space"
                                },


                                {
                                    $type: "div",
                                    class: "mdc-menu-anchor",
                                    $components: [
                                        self.widgets.icontoggle({
                                            'styleClass': "mdc-top-app-bar__action-item",
                                            'id': "qrcodeIcon",
                                            'label': 'select',
                                            'on': JSON.stringify({ "content": "qr_code_2", "label": "qr" }),
                                            'off': JSON.stringify({ "content": "qr_code_2", "label": "qr" }),
                                            'state': false,
                                            'init': function () {

                                                this._comp = mdc.iconButton.MDCIconButtonToggle.attachTo(this);
                                                this.addEventListener('MDCIconButtonToggle:change', (e) => {

                                                    if (self.qrcodedialog) {
                                                        self.qrcodedialog.open();
                                                    }


                                                });

                                            }
                                        }),
                                        // {
                                        //     $type: "a",
                                        //     class: "mdc-icon-button material-icons mdc-top-app-bar__action-item",
                                        //     id: "toggleCreate",
                                        //     $text: "apps",
                                        //     'aria-label': "More"
                                        // },
                                        // {
                                        //     $type: "div",
                                        //     class: "mdc-menu mdc-menu-surface",
                                        //     "tabindex": "-1",
                                        //     id: "create-menu",
                                        //     $init: function () {

                                        //         //var menuEl = document.querySelector('#demo-menu');
                                        //         var menu = new mdc.menu.MDCMenu(this);
                                        //         var toggle = document.querySelector('#toggleCreate');
                                        //         toggle.addEventListener('click', function () {
                                        //             menu.open = !menu.open;
                                        //         });

                                        //     },
                                        //     style: "transform-origin: right top 0px; right: 0px; top: 0px;",
                                        //     $components: [
                                        //         {
                                        //             $type: "ul",
                                        //             class: "mdc-menu__items mdc-list",
                                        //             role: "menu",
                                        //             'aria-hidden': "true",
                                        //             // style: "transform: scale(1, 1);",
                                        //             $components: [
                                        //                 {
                                        //                     $type: "li",
                                        //                     class: "mdc-list-item",
                                        //                     role: "menuitem",
                                        //                     tabindex: "0",
                                        //                     $text: "Apps"
                                        //                 }
                                        //             ]
                                        //         }
                                        //     ]
                                        // }
                                    ]
                                }



                            ]
                        },
                        {
                            $type: "section",
                            class: "mdc-top-app-bar__section  mdc-top-app-bar__section--align-end",
                            $components: [
                                {
                                    $type: "a",
                                    href: "#",
                                    class: "mdc-icon-button menuItem mdc-top-app-bar__action-item",
                                    $text: "EN",
                                    onclick: function () {
                                        //self.lang.changeLanguageTo('en')
                                        localStorage.setItem('krestianstvo_locale', 'en');
                                        window.location.reload(true);
                                    }
                                },
                                {
                                    $type: "a",
                                    href: "#",
                                    class: "mdc-icon-button menuItem mdc-top-app-bar__action-item",
                                    $text: "RU",
                                    onclick: function () {
                                        //self.lang.changeLanguageTo('ru')
                                        localStorage.setItem('krestianstvo_locale', 'ru');
                                        window.location.reload(true);
                                    }
                                },
                                {
                                    $type: "a",
                                    href: "#",
                                    class: "material-icons mdc-icon-button mdc-top-app-bar__action-item",
                                    $text: "help",
                                    'aria-label': "Help",
                                    onclick: function (e) {
                                        e.preventDefault();
                                        console.log("TODO: help window")
                                    }
                                }

                            ]
                        }
                        ]

                    };

                    document.querySelector("#toolbar").$cell({
                        $cell: true,
                        $type: "div",
                        class: "drawer-frame-app-content",
                        $components: [
                            {
                                $type: "header",
                                class: "mdc-top-app-bar drawer-top-app-bar",
                                $init: function () {

                                    const topAppBar = new mdc.topAppBar.MDCTopAppBar.attachTo(this);
                                    topAppBar.listen('MDCTopAppBar:nav', () => {
                                        self.drawer.open = !self.drawer.open;
                                    });
                                },
                                $components: [
                                    toolbar
                                ]
                            }
                        ]
                    }
                    );
                    // var toggleNodes = document.querySelectorAll('.mdc-icon-button');
                    // toggleNodes.forEach(el => {
                    //     mdc.iconButton.MDCIconButtonToggle.attachTo(el);
                    // });


                    //==============

                },

                createdNode: function (nodeID, childID, childExtendsID, childImplementsIDs,
                    childSource, childType, childIndex, childName, callback /* ( ready ) */) {

                    // var nodeIDAttribute = $.encoder.encodeForHTMLAttribute("id", nodeID, true);
                    // var childIDAttribute = $.encoder.encodeForHTMLAttribute("id", childID, true);
                    // var childIDAlpha = $.encoder.encodeForAlphaNumeric(childID);
                    let self = this;

                    var kernel = this.kernel;
                    var parent = this.nodes[nodeID];
                    var node = this.nodes[childID] = {
                        children: [],
                        properties: [],
                        events: {},
                        methods: {},
                        parent: parent,
                        parentID: nodeID,
                        ID: childID,
                        extendsID: childExtendsID,
                        implementsIDs: childImplementsIDs,
                        source: childSource,
                        name: childName,
                        liveBindings: {}
                    };

                    if (parent) {
                        parent.children.push(node);
                    }

                    if (childID == vwf_view.kernel.find("", "/")[0] && childExtendsID && this.kernel.test(childExtendsID,
                        "self::element(*,'proxy/aframe/ascene.vwf')", childExtendsID)) {
                        this.scenes[childID] = node;
                    }


                    let nodeCell = document.querySelector("#currentNode");

                    if (nodeCell !== null) {
                        if (nodeCell._currentNode === nodeID) {
                            nodeCell._getChildNodes();

                        }
                    }


                    if (nodeID === this.kernel.application()) {
                        // document.querySelector('a-scene').classList.add("mdc-toolbar-fixed-adjust");
                        //document.querySelector('body').classList.add("editor-body", "mdc-typography");
                    }



                },

                createdProperty: function (nodeID, propertyName, propertyValue) {

                    return this.initializedProperty(nodeID, propertyName, propertyValue);
                },

                initializedProperty: function (nodeID, propertyName, propertyValue) {

                    var node = this.nodes[nodeID];

                    if (!node) return;  // TODO: patch until full-graph sync is working; drivers should be able to assume that nodeIDs refer to valid objects

                    var property = node.properties[propertyName] = LCSEditor.createProperty.call(this, node, propertyName, propertyValue);

                    node.properties.push(property);

                    let nodeCell = document.querySelector("#currentNode");
                    if (nodeCell !== null) {
                        if (nodeCell._currentNode === nodeID) {
                            nodeCell._getNodeProperties();
                        }
                    }

                },

                deletedNode: function (nodeID) {
                    let node = this.nodes[nodeID];
                    if (!node) return

                    node.parent.children.splice(node.parent.children.indexOf(node), 1);
                    delete this.nodes[nodeID];

                    let nodeCell = document.querySelector("#currentNode");


                    if (nodeCell) {
                        if (nodeCell._currentNode !== "") {
                            if (nodeCell._currentNode !== nodeID) {
                                //&& (this.nodes[nodeID] !== undefined)
                                nodeCell._getChildNodes();
                            } else {
                                nodeCell._setNode(vwf_view.kernel.find("", "/")[0]);
                                nodeCell._getChildNodes();
                            }
                        }
                    }



                },

                //addedChild: [ /* nodeID, childID, childName */ ],
                //removedChild: [ /* nodeID, childID */ ],

                satProperty: function (nodeID, propertyName, propertyValue) {
                    var node = this.nodes[nodeID];

                    if (!node) return;  // TODO: patch until full-graph sync is working; drivers should be able to assume that nodeIDs refer to valid objects

                    // It is possible for a property to have satProperty called for it without ever getting an
                    // initializedProperty (if that property delegated to itself or another on replication)
                    // Catch that case here and create the property
                    if (!node.properties[propertyName]) {

                        var property = node.properties[propertyName] = LCSEditor.createProperty.call(this, node, propertyName, propertyValue);

                        node.properties.push(property);
                    }


                    try {
                        propertyValue = LCSEditor.utility.transform(propertyValue, LCSEditor.utility.transforms.transit);
                        node.properties[propertyName].value = JSON.stringify(propertyValue);
                        node.properties[propertyName].rawValue = propertyValue;
                    } catch (e) {
                        this.logger.warnx("satProperty", nodeID, propertyName, propertyValue,
                            "stringify error:", e.message);
                        node.properties[propertyName].value = propertyValue;
                    }


                    let nodeCell = document.querySelector('#currentNode');

                    if (nodeCell !== null) {
                        if (nodeCell._currentNode == nodeID && propertyName == 'isPlaying') {
                            console.log('SET PLAY !!!');
                            let compID = 'soundStopStartSwitch-' + nodeID;
                            let playSwitch = document.querySelector("[id='" + compID + "']");

                            if (playSwitch) {
                                // const mycomp = new mdc.iconToggle.MDCIconToggle(playSwitch); //new mdc.select.MDCIconToggle
                                playSwitch._comp.on = propertyValue;
                            }
                        }

                    }


                    if (nodeCell !== null) {
                        if (nodeCell._currentNode == nodeID && propertyName == 'edit') {
                            console.log('EDIT !!!')
                        }

                    }


                    let propCell = document.querySelector("#currentNode #prop-" + propertyName);
                    let propSlider = document.querySelector("#currentNode #prop-slider-" + propertyName);


                    if (propCell !== null) {
                        if (propCell._currentNode == nodeID) {
                            propCell.value = node.properties[propertyName].getValue();
                        }
                    }

                    if (propSlider !== null) {
                        if (propSlider._currentNode == nodeID) {
                            //const propSliderComp = new new mdc.slider.MDCSlider(propSlider);
                            propSlider._comp.value = node.properties[propertyName].getValue();
                        }
                    }

                },

                //gotProperty: [ /* nodeID, propertyName, propertyValue */ ],

                gotProperty: function (nodeID, propertyName, propertyValue) {
                    var node = this.nodes[nodeID];

                    if (!node) return;  // TODO: patch until full-graph sync is working; drivers should be able to assume that nodeIDs refer to valid objects

                    let nodeCell = document.querySelector('#currentNode');

                    if (nodeCell !== null) {

                        if (nodeCell._currentNode == nodeID && propertyName == 'edit') {

                            let gizmoChild = node.children.filter(el => el.ID.includes('gizmo'));
                            if (gizmoChild.length > 0) {

                                let editCheckBox = document.querySelector("#currentNode #editnode");

                                if (editCheckBox) {
                                    let mdcSwitch = editCheckBox._switch;
                                    if (mdcSwitch) {
                                        mdcSwitch.checked = propertyValue
                                    }
                                }
                                console.log('EDIT !!! is ' + propertyValue)
                            }
                        }

                    }



                },




                createdMethod: function (nodeID, methodName, methodParameters, methodBody) {
                    var node = this.nodes[nodeID];
                    if (node) {
                        node.methods[methodName] = methodParameters;
                    }
                },

                calledMethod: function (nodeID, methodName, methodParameters, methodValue) {

                    let self = this;
                    var node = this.nodes[nodeID];
                    if (!node) return

                    let clientThatCallThis = vwf.client();
                    let me = vwf.moniker();

                    if (methodName == "createChild") {

                        if (clientThatCallThis == me) {
                            let nodeCell = document.querySelector('#currentNode')
                            if (nodeCell)
                                nodeCell._setNode(methodParameters[1].id);
                        }

                    }



                },

                createdEvent: function (nodeID, eventName, eventParameters) {
                    var node = this.nodes[nodeID];
                    if (node) {
                        node.events[eventName] = eventParameters;
                    }
                },

                firedEvent: function (nodeID, eventName, eventParameters) {
                    let self = this;
                    var node = this.nodes[nodeID];
                    if (node) {

                        if (eventName == 'printEvent') {

                            var clientThatSatProperty = self.kernel.client();
                            var me = self.kernel.moniker();


                            // If the transform property was initially updated by this view....
                            if (clientThatSatProperty == me) {


                                let editor = document.querySelector("#aceEditor").env.editor;
                                if (editor) {

                                    var cursorPosition = editor.getCursorPosition();
                                    var selectedText = editor.getSession().doc.getTextRange(editor.selection.getRange());

                                    if (selectedText !== "") {
                                        cursorPosition = editor.selection.getRange().end;
                                    }
                                    let data = eventParameters[0];//JSON.stringify(eventParameters[0]);
                                    editor.session.insert(cursorPosition, data);
                                }
                                //console.log(eventParameters);

                            }
                        }


                        if (eventName == "printIt") {

                            var clientThatSatProperty = self.kernel.client();
                            var me = self.kernel.moniker();


                            // If the transform property was initially updated by this view....
                            if (clientThatSatProperty == me) {


                                let selectedText = eventParameters[0];
                                let printText = _app.helpers.replaceSubStringALL(selectedText, 'this', 'me');

                                if (!self.nodes[nodeID].liveBindings) {
                                    self.nodes[nodeID].liveBindings = {}
                                }

                                //let bindObject = self.nodes[nodeID].liveBindings;
                                //let bindString = 'vwf.views["vwf/view/aframe"].nodes["' + nodeID + '"].liveBindings';
                                let bindString = 'vwf.views["/drivers/view/editor"].nodes["' + nodeID + '"].liveBindings';
                                let sender = JSON.stringify(eventParameters[1]);

                                let scriptText = 'let binding = ' + bindString + '; binding.me = this; binding.sender = ' + sender + '; lively.vm.syncEval("var print = ' + printText + '",{topLevelVarRecorder: binding});';
                                vwf_view.kernel.execute(nodeID, scriptText);

                            }

                        }




                    }
                },

                executed: function (nodeID, scriptText, scriptType) {

                    let self = this;
                    let node = this.nodes[nodeID];

                    if (!(node)) {
                        return;
                    }

                    if (scriptText.includes('var print')) {
                        let print = self.nodes[nodeID].liveBindings.print;

                        let me = self.kernel.moniker();
                        let sender = self.nodes[nodeID].liveBindings.sender;

                        if (me == sender) {
                            let data = JSON.stringify(print); //lively.lang.obj.inspect(print); 
                            self.kernel.fireEvent(nodeID, "printEvent", [data]);
                        }
                    }

                    // var nodeScript = {
                    //     text: scriptText,
                    //     type: scriptType,
                    // };

                    // if ( !this.allScripts[ nodeID ] ) {
                    //     var nodeScripts = new Array();
                    //     nodeScripts.push(nodeScript);

                    //     this.allScripts[ nodeID ] = nodeScripts;
                    // }

                    // else {
                    //     this.allScripts[ nodeID ].push(nodeScript);
                    // }
                },

                //ticked: [ /* time */ ],

            });



    }

    /////////Functions/////



    createCellWindow(elementID, cellNode, title) {

        document.querySelector('#' + elementID).$cell({
            $cell: true,
            $type: "div",
            id: elementID,
            style: 'position: absolute;',
            class: 'draggable',
            $init: function () {
                // let draggie = new Draggabilly('.draggable', {
                //     handle: '.handle',
                //     containment: true
                //   });

                // get all draggie elements
                var draggableElems = document.querySelectorAll('.draggable');
                // array of Draggabillies
                var draggies = []
                // init Draggabillies
                for (var i = 0, len = draggableElems.length; i < len; i++) {
                    var draggableElem = draggableElems[i];
                    var draggie = new Draggabilly(draggableElem, {
                        handle: '.handle'
                        //containment: true
                    });
                    draggies.push(draggie);
                }


                this.style.visibility = 'hidden';
            },
            $components: [

                {

                    $type: "div",
                    class: "handle"
                },

                {

                    $type: "button",
                    class: "mdc-button mdc-button--compact",
                    $text: "X",
                    onclick: function (e) {
                        //self.currentNodeID = m.ID;
                        if (elementID == 'codeEditorWindow') {
                            //self.nodes[currentNode].liveBindings = {};
                        }
                        document.querySelector('#' + elementID).style.visibility = 'hidden';

                    }

                },
                {

                    $type: "span",
                    class: "mdc-typography--button",
                    $text: title
                },




                cellNode,
                {

                    $type: "div",
                    class: "handle",
                    style: "height: 10px; width: inherit;",
                    //$text: "sdfsdf"
                }
                // { $text: "23423"}
            ]
        }
        )


    }


    // -- getChildByName --------------------------------------------------------------------


    static getChildByName(node, childName) {

        var childNode = undefined;
        for (var i = 0; i < node.children.length && childNode === undefined; i++) {
            if (node.children[i].name == childName) {
                childNode = node.children[i];
            }
        }
        return childNode;
    }


    // -- viewScript ------------------------------------------------------------------------

    static createAceEditor(nodeID, elID) {

        let self = this;
        var editor = self.ace.edit(elID);
        editor.setTheme("ace/theme/monokai");
        editor.setFontSize(20);
        editor.getSession().setMode("ace/mode/javascript");

        editor.commands.addCommand({
            name: "doit",
            bindKey: { win: "Ctrl-e", mac: "Command-e" },
            exec: function () {
                LCSEditor.codeEditorDoit.call(self, editor, nodeID);
            }
        });

        editor.commands.addCommand({
            name: "printit",
            bindKey: { win: "Ctrl-b", mac: "Command-b" },
            exec: function () {
                LCSEditor.codeEditorPrintit.call(self, editor, nodeID);
            }
        });

        return editor;

    }

    static isAFrameComponent(nodeID) {

        let self = this;
        let node = self.nodes[nodeID];
        let nodeProtos = LCSEditor.getPrototypes(self.kernel, node.extendsID);


        if (nodeProtos.includes('proxy/aframe/componentNode.vwf')) {
            return true
        }


        return false
    }

    static isAFrameEntity(nodeID) {
        let self = this;
        let node = self.nodes[nodeID];
        let nodeProtos = LCSEditor.getPrototypes(self.kernel, node.extendsID);

        if (nodeProtos.includes('proxy/aframe/node.vwf')) {
            return true
        }


        return false
    }

    static getPrototypes(kernel, extendsID) {
        var prototypes = [];
        var id = extendsID;

        while (id !== undefined) {
            prototypes.push(id);
            id = kernel.prototype(id);
        }

        return prototypes;
    }

    static createProperty(node, propertyName, propertyValue) {

        var property = {
            name: propertyName,
            rawValue: propertyValue,
            value: undefined,
            getValue: function () {
                var propertyVal;
                if (this.value == undefined) {
                    try {
                        propertyVal = LCSEditor.utility.transform(this.rawValue, LCSEditor.utility.transforms.transit);
                        this.value = JSON.stringify(propertyVal);
                    } catch (e) {
                        this.logger.warnx("createdProperty", nodeID, this.propertyName, this.rawValue,
                            "stringify error:", e.message);
                        this.value = this.rawValue;
                    }
                }
                return this.value;
            }
        };

        return property;
    }


    static getProperties(kernel, extendsID) {

        var pTypes = LCSEditor.getPrototypes(kernel, extendsID);
        var pProperties = {};
        if (pTypes) {
            for (var i = 0; i < pTypes.length; i++) {
                var nd = this.nodes[pTypes[i]];
                if (nd && nd.properties) {
                    for (var key in nd.properties) {
                        pProperties[key] = { "prop": nd.properties[key], "prototype": pTypes[i] };
                    }
                }
            }
        }
        return pProperties;
    }

    static getChildren(kernel, extendsID) {

        var pTypes = LCSEditor.getPrototypes(kernel, extendsID);
        var pChildren = {};
        if (pTypes) {
            for (var i = 0; i < pTypes.length; i++) {
                var nd = this.nodes[pTypes[i]];
                if (nd && nd.children) {
                    for (var key in nd.children) {
                        pChildren[key] = nd.children[key];
                    }
                }
            }
        }
        return pChildren;
    }

    static getEvents(kernel, extendsID) {

        var pTypes = LCSEditor.getPrototypes(kernel, extendsID);
        var events = {};
        if (pTypes) {
            for (var i = 0; i < pTypes.length; i++) {
                var nd = this.nodes[pTypes[i]];
                if (nd && nd.events) {
                    for (var key in nd.events) {
                        events[key] = nd.events[key];
                    }
                }
            }
        }
        return events;
    }

    static getMethods(kernel, extendsID) {

        var pTypes = LCSEditor.getPrototypes(kernel, extendsID);
        var methods = {};
        if (pTypes) {
            for (var i = 0; i < pTypes.length; i++) {
                var nd = this.nodes[pTypes[i]];
                if (nd && nd.methods) {
                    for (var key in nd.methods) {
                        methods[key] = nd.methods[key];
                    }
                }
            }
        }
        return methods;
    }


    // -- Show Code Editor tab



    static codeEditorDoit(editor, nodeID) {
        let self = this;
        var selectedText = editor.getSession().doc.getTextRange(editor.selection.getRange());

        if (selectedText == "") {

            var currline = editor.getSelectionRange().start.row;
            var selectedText = editor.session.getLine(currline);

        }

        //console.log(selectedText);
        //var sceneID = self.kernel.application();
        vwf_view.kernel.execute(nodeID, selectedText);

    }

    static codeEditorPrintitInDebugger(editor, nodeID) {
        let self = this;
        var selectedText = editor.getSession().doc.getTextRange(editor.selection.getRange());

        if (selectedText == "") {

            var currline = editor.getSelectionRange().start.row;
            var selectedText = editor.session.getLine(currline);

        }

        let scriptText = 'console.log(' + selectedText + ');'
        self.kernel.execute(nodeID, scriptText);


    }

    static codeEditorPrintit(editor, nodeID) {

        let self = this;
        var selectedText = editor.getSession().doc.getTextRange(editor.selection.getRange());

        if (selectedText == "") {

            var currline = editor.getSelectionRange().start.row;
            var selectedText = editor.session.getLine(currline);

        }

        let me = self.kernel.moniker();
        vwf_view.kernel.fireEvent(nodeID, 'printIt', [selectedText, me]);
    }

    static codeEditorPrintitConsole(editor, nodeID) {
        let self = this;
        var selectedText = editor.getSession().doc.getTextRange(editor.selection.getRange());

        if (selectedText == "") {

            var currline = editor.getSelectionRange().start.row;
            var selectedText = editor.session.getLine(currline);

        }

        let scriptText = 'console.log(' + selectedText + ');'
        self.kernel.execute(nodeID, scriptText);
    }

}

LCSEditor.utility = new Utility();

export { LCSEditor as default }