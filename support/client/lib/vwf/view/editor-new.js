"use strict";

// Copyright 2012 United States Government, as represented by the Secretary of Defense, Under
// Secretary of Defense (Personnel & Readiness).
// 
// Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except
// in compliance with the License. You may obtain a copy of the License at
// 
//   http://www.apache.org/licenses/LICENSE-2.0
// 
// Unless required by applicable law or agreed to in writing, software distributed under the License
// is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express
// or implied. See the License for the specific language governing permissions and limitations under
// the License.

/// vwf/view/editor creates a view interface for editor functions. 
/// 
/// @module vwf/view/editor
/// @requires version
/// @requires vwf/view
/// @requires vwf/utility

define([
    "module",
    "version",
    "vwf/view",
    "vwf/utility",
    "vwf/view/lib/ace/ace",
    "vwf/view/lib/colorpicker/colorpicker.min",
    "vwf/view/widgets"
], function (module, version, view, utility, ace, colorpicker, widgets) {

    var self;

    return view.load(module, {

        // == Module Definition ====================================================================

        initialize: function () {
            self = this;
            this.ace = window.ace;
            this.widgets = widgets;

            this.nodes = {};
            this.scenes = {};
            this.allScripts = {};



            //$(document.head).append('<style type="text/css" media="screen"> #editorlive { height: 500px; width: 800px; } </style>');
            document.querySelector('head').innerHTML += '<style type="text/css" media="screen"> #editorlive { height: 500px; width: 800px; } </style>';
            document.querySelector('head').innerHTML += '<link rel="stylesheet" href="vwf/view/lib/editorLive.css">';

            //document.querySelector('head').innerHTML += '<script type="text/javascript" src="vwf/view/lib/colorpicker/colorpicker.min.js">';
            document.querySelector('head').innerHTML += '<link rel="stylesheet" href="vwf/view/lib/colorpicker/themes.css">';

            //$(document.head).append('<meta name="viewport" content="width=device-width, initial-scale=1">');
            document.querySelector('head').innerHTML += '<meta name="viewport" content="width=device-width, initial-scale=1">';


            // $('body').append('<script>mdc.autoInit()</script>');

            this.removeProps = (obj) => {
                Object.keys(obj).forEach(key =>
                    (key === 'id' || key === 'patches' || key === 'random' || key === 'sequence') && delete obj[key] ||
                    (obj[key] && typeof obj[key] === 'object') && this.removeProps(obj[key])
                );
                return obj;
            };

            this.getNodeDef = function (nodeID) {
                let node = vwf.getNode(nodeID, true);
                let nodeDef = self.removeProps(node);
                return nodeDef
            }


            this.GUID = function () {
                var S4 = function () {
                    return Math.floor(
                        Math.random() * 0x10000 /* 65536 */
                    ).toString(16);
                };

                return (
                    S4() + S4() + "-" +
                    S4() + "-" +
                    S4() + "-" +
                    S4() + "-" +
                    S4() + S4() + S4()
                );
            }

            this.getRoot = function () {
                var app = window.location.pathname;
                var pathSplit = app.split('/');
                if (pathSplit[0] == "") {
                    pathSplit.shift();
                }
                if (pathSplit[pathSplit.length - 1] == "") {
                    pathSplit.pop();
                }
                var instIndex = pathSplit.length - 1;
                if (pathSplit.length > 2) {
                    if (pathSplit[pathSplit.length - 2] == "load") {
                        instIndex = pathSplit.length - 3;
                    }
                }
                if (pathSplit.length > 3) {
                    if (pathSplit[pathSplit.length - 3] == "load") {
                        instIndex = pathSplit.length - 4;
                    }
                }

                var root = "";
                for (var i = 0; i < instIndex; i++) {
                    if (root != "") {
                        root = root + "/";
                    }
                    root = root + pathSplit[i];
                }

                if (root.indexOf('.vwf') != -1) root = root.substring(0, root.lastIndexOf('/'));

                return root
            };

            this.getRandomInt = function (min, max) {
                min = Math.ceil(min);
                max = Math.floor(max);
                return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
            };

            ["drawer", "toolbar", "sideBar", "propWindow", "clientsWindow", "codeEditorWindow", "propEditorWindow", "viewSceneProps"].forEach(item => {
                let el = document.createElement("div");
                el.setAttribute("id", item);
                document.body.appendChild(el);
            }
            );

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
                            $components: [
                                {
                                    $type: "h1",
                                    class: "mdc-card__title mdc-card__title--large",
                                    $text: desc.subtitle
                                },
                                {
                                    $type: "h2",
                                    class: "mdc-card__subtitle",
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

            let avatarSettings =
                {
                    $cell: true,
                    $type: "div",
                    class: "propGrid max-width mdc-layout-grid mdc-layout-grid--align-left",
                    $components: [
                        {
                            $cell: true,
                            $type: "div",
                            class: "mdc-layout-grid__inner",
                            $components: [
                                {
                                    $cell: true,
                                    $type: "div",
                                    class: "mdc-layout-grid__cell mdc-layout-grid__cell--span-12",
                                    $components: [
                                        {
                                            $cell: true,
                                            $type: "button",
                                            class: "mdc-button mdc-button--raised",
                                            $text: "Go forward",
                                            onclick: function (e) {

                                                function getMovementVector(el) {
                                                    var directionVector = new THREE.Vector3(0, 0, 0);
                                                    var rotationEuler = new THREE.Euler(0, 0, 0, 'YXZ');

                                                    var rotation = el.getAttribute('rotation');
                                                    var velocity = new THREE.Vector3(0, 0, -0.5);
                                                    var xRotation;

                                                    directionVector.copy(velocity);
                                                    directionVector.multiplyScalar(1.0);

                                                    // Absolute.
                                                    if (!rotation) { return directionVector; }

                                                    xRotation = 0;

                                                    // Transform direction relative to heading.
                                                    rotationEuler.set(THREE.Math.degToRad(xRotation), THREE.Math.degToRad(rotation.y), 0);
                                                    directionVector.applyEuler(rotationEuler);
                                                    return directionVector;

                                                }

                                                let el = document.querySelector('#avatarControl');

                                                let currentPosition = el.getAttribute('position');
                                                let movementVector = getMovementVector(el);
                                                let position = {};

                                                position.x = currentPosition.x + movementVector.x;
                                                position.y = currentPosition.y + movementVector.y;
                                                position.z = currentPosition.z + movementVector.z;
                                                el.setAttribute('position', position);

                                            }

                                        },
                                    ]
                                },
                                {
                                    $cell: true,
                                    $type: "div",
                                    class: "mdc-layout-grid__cell mdc-layout-grid__cell--span-12",
                                    $components: [
                                        {
                                        
                                            $cell: true,
                                            $type: "button",
                                            class: "mdc-button mdc-button--raised",
                                            $text: "Reset camera view",
                                            onclick: function (e) {
                                                //document.querySelector('#' + 'viewSettings').style.visibility = 'hidden';
                                                let controlEl = document.querySelector('#avatarControl');
                                                controlEl.setAttribute('camera', 'active', true);
                                            }

                                        },
                                        {
                                            $cell: true,
                                            $type: "button",
                                            class: "mdc-button mdc-button--raised",
                                            $text: "Hide cursor",
                                            onclick: function (e) {
                                                //document.querySelector('#' + 'viewSettings').style.visibility = 'hidden';
                                                let avatarID = 'avatar-' + self.kernel.moniker();
                                                let cursorID = 'myCursor-' + avatarID;
                                                let controlEl = document.querySelector("[id='" + cursorID + "']");
                                                let vis = controlEl.getAttribute('visible');
                                                this.$text = vis ? 'Show cursor' : 'Hide cursor';

                                                vwf_view.kernel.callMethod(avatarID, "showHideCursor", [!vis]);
                                                //controlEl.setAttribute('visible', !vis);
                                            }

                                        },
                                        {
                                            $cell: true,
                                            $type: "button",
                                            class: "mdc-button mdc-button--raised",
                                            $text: "Hide Avatar",
                                            onclick: function (e) {
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

                                    ]
                                },
                                {
                                    $cell: true,
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
                                                            $cell: true,
                                                            $type: "div",
                                                            class: "mdc-layout-grid__cell mdc-layout-grid__cell--span-12",
                                                            $components: [

                                                                self.avatarCardDef("/../assets/avatars/ico/simple.jpg", { title: "Simple", subtitle: "Cube" },
                                                                    function (e) {
                                                                        let avatarID = 'avatar-' + self.kernel.moniker();
                                                                        vwf_view.kernel.callMethod(avatarID, "createSimpleAvatar");

                                                                    }
                                                                )
                                                            ]
                                                        },
                                                        {
                                                            $cell: true,
                                                            $type: "div",
                                                            class: "mdc-layout-grid__cell mdc-layout-grid__cell--span-12",
                                                            $components: [
                                                                self.avatarCardDef("/../assets/avatars/ico/female.jpg", { title: "Human", subtitle: "Female" },
                                                                    function (e) {
                                                                        let avatarID = 'avatar-' + self.kernel.moniker();
                                                                        vwf_view.kernel.callMethod(avatarID, "createAvatarFromGLTF", ["/../assets/avatars/female/avatar1.gltf"]);
                                                                    }
                                                                )]
                                                        },
                                                        {
                                                            $cell: true,
                                                            $type: "div",
                                                            class: "mdc-layout-grid__cell mdc-layout-grid__cell--span-12",
                                                            $components: [
                                                                self.avatarCardDef("/../assets/avatars/ico/male.jpg", { title: "Human", subtitle: "Male" },
                                                                    function (e) {
                                                                        let avatarID = 'avatar-' + self.kernel.moniker();
                                                                        vwf_view.kernel.callMethod(avatarID, "createAvatarFromGLTF", ["/../assets/avatars/male/avatar1.gltf"]);
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
                                    $cell: true,
                                    $type: "div",
                                    class: "mdc-layout-grid__cell mdc-layout-grid__cell--span-12",
                                    $components: [
                                        {
                                            $cell: true,
                                            $type: "button",
                                            class: "mdc-button mdc-button--raised",
                                            $text: "Wide",
                                            onclick: function (e) {
                                                let avatarID = 'avatar-'+vwf.moniker_;
                                                vwf_view.kernel.callMethod(avatarID, "setBigVideoHead", []);
                                               
                                            }
            
                                        },
                                        {
                                            $cell: true,
                                            $type: "button",
                                            class: "mdc-button mdc-button--raised",
                                            $text: "Small",
                                            onclick: function (e) {
                                                let avatarID = 'avatar-'+vwf.moniker_;
                                                vwf_view.kernel.callMethod(avatarID, "setSmallVideoHead", []);
                                               
                                            }
            
                                        }

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
                            $cell: true,
                            $type: "div",
                            class: "mdc-layout-grid__inner",
                            $components: [
                                {
                                    $cell: true,
                                    $type: "div",
                                    class: "mdc-layout-grid__cell mdc-layout-grid__cell--span-12",
                                    $components: [
                                        {
                                            $cell: true,
                                            $type: "button",
                                            class: "mdc-button mdc-button--raised",
                                            $text: "OSC Settings",
                                            onclick: function (e) {
                                                let sideBar = document.querySelector('#sideBar');
                                                sideBar._sideBarComponent = oscSettings;
                                                //document.querySelector('#' + 'viewSettings').style.visibility = 'hidden';
                                            }

                                        }

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
                    $type: "li",
                    class: "mdc-list-item",
                    role: "option",
                    id: "",
                    applicationpath: "",
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
                        $type: "li",
                        class: "mdc-list-item",
                        role: "option",
                        id: item.savename,
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
                        $type: "li",
                        class: "mdc-list-item",
                        role: "option",
                        id: item.savename,
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
                                $cell: true,
                                $type: "div",
                                class: "mdc-layout-grid__inner",
                                $components: [
                                    {
                                        $cell: true,
                                        $type: "div",
                                        class: "mdc-layout-grid__cell mdc-layout-grid__cell--span-12",
                                        $components: [
                                            {
                                                $type: "span",
                                                $text: "Host: "
                                            },
                                            {
                                                class: "mdc-textfield",
                                                $cell: true,
                                                $type: "span",
                                                $components: [
                                                    {
                                                        class: "mdc-textfield__input",
                                                        id: "oscHost",
                                                        $cell: true,
                                                        $type: "input",
                                                        type: "text",
                                                        value: this._oscHost,
                                                        onchange: function (e) {
                                                            this._oscHost = this.value;
                                                            window._OSCManager.setOSCHostAndPort(this._oscHost, this._oscPort);
                                                        }
                                                    }

                                                ]

                                            }

                                        ]
                                    },
                                    {
                                        $cell: true,
                                        $type: "div",
                                        class: "mdc-layout-grid__cell mdc-layout-grid__cell--span-12",
                                        $components: [
                                            {
                                                $type: "span",
                                                $text: "Port: "
                                            },
                                            {
                                                class: "mdc-textfield",
                                                $cell: true,
                                                $type: "span",
                                                $components: [
                                                    {
                                                        class: "mdc-textfield__input",
                                                        id: "oscPort",
                                                        $cell: true,
                                                        $type: "input",
                                                        type: "text",
                                                        value: this._oscPort,
                                                        onchange: function (e) {
                                                            this._oscPort = this.value;
                                                            window._OSCManager.setOSCHostAndPort(this._oscHost, this._oscPort);
                                                        }
                                                    }

                                                ]

                                            }

                                        ]
                                    },
                                    {
                                        $cell: true,
                                        $type: "div",
                                        class: "mdc-layout-grid__cell mdc-layout-grid__cell--span-12",
                                        $components: [
                                            {
                                                $cell: true,
                                                $type: "button",
                                                class: "mdc-button mdc-button--raised",
                                                $text: buttonText,
                                                onclick: buttonFunc

                                            }

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
                    _saveStates: [],
                    _getStates: async function () {
                        let response = await fetch("/" + self.getRoot() + "/listallsaves");
                        let data = await response.json();
                        //this._saveStates = data;
                        //let appName = self.getRoot();
                        //console.log(data.filter(item => item.applicationpath.split("/")[1] == appName));
                        let filterData = data.filter(item => item.applicationpath.split("/")[1] == self.getRoot());
                        if (filterData.length !== 0) {
                            this._saveStates = filterData
                            //return filterData
                        } else {
                            this._saveStates = [{
                                savename: "",
                                latestsave: "",
                                revision: "",
                                applicationpath: "",
                                url: ""
                            }]
                        }
                        // this._saveStates.filter(item => item.applicationpath.split("/")[1] == self.getRoot()).map(stateListElement)
                        //return data
                        //console.log(data);
                        return this._saveStates
                    },
                    $init: function () {
                        this._getStates();

                    },
                    $update: function () {
                        this.$components =
                            [
                                {
                                    $cell: true,
                                    $type: "div",
                                    class: "mdc-layout-grid__inner",
                                    $components: [
                                        {
                                            $cell: true,
                                            $type: "div",
                                            class: "mdc-layout-grid__cell mdc-layout-grid__cell--span-12",
                                            $components: [
                                                {
                                                    class: "mdc-textfield",
                                                    $cell: true,
                                                    $type: "span",
                                                    $components: [
                                                        {
                                                            class: "mdc-textfield__input",
                                                            id: "fileName",
                                                            $cell: true,
                                                            $type: "input",
                                                            type: "text",
                                                            value: self.getRoot()


                                                        }]

                                                }

                                            ]
                                        },

                                        {
                                            $cell: true,
                                            $type: "div",
                                            class: "mdc-layout-grid__cell mdc-layout-grid__cell--span-12",
                                            $components: [
                                                {
                                                    $cell: true,
                                                    $type: "button",
                                                    class: "mdc-button mdc-button--raised",
                                                    $text: "Save",
                                                    onclick: function (e) {
                                                        let fileName = document.querySelector('#fileName')
                                                        saveStateAsFile.call(self, fileName.value);
                                                        document.querySelector("#fileName").value = '';
                                                        //document.querySelector('#' + 'viewSettings').style.visibility = 'hidden';
                                                    }

                                                }

                                            ]
                                        },
                                        {
                                            $cell: true,
                                            $type: "div",
                                            class: "mdc-layout-grid__cell mdc-layout-grid__cell--span-12",
                                            $components: [
                                                {
                                                    $cell: true,
                                                    $type: "div",
                                                    class: "mdc-select",
                                                    $init: function () {
                                                        var MDCSelect = mdc.select.MDCSelect;
                                                        const select = new MDCSelect(document.querySelector('.mdc-select'));
                                                        select.listen('MDCSelect:change', () => {
                                                            //this._selectedState = select.value;
                                                            document.querySelector('#loadStateButton')._selectedState = select.selectedOptions[0];
                                                            //console.log(select.value);
                                                            //.selectedOptions[0]
                                                        });

                                                    },
                                                    role: "listbox",
                                                    $components: [
                                                        {
                                                            $type: "span",
                                                            class: "mdc-select__selected-text",
                                                            $text: "Select saved state"
                                                        },
                                                        {
                                                            $type: "div",
                                                            class: "mdc-simple-menu mdc-select__menu",
                                                            $components: [
                                                                {
                                                                    $type: "ul",
                                                                    class: "mdc-list mdc-simple-menu__items",
                                                                    $components: this._saveStates.map(stateListElement)



                                                                }
                                                            ]
                                                        }

                                                    ]
                                                }

                                            ]
                                        },
                                        {
                                            $cell: true,
                                            $type: "div",
                                            class: "mdc-layout-grid__cell mdc-layout-grid__cell--span-12",
                                            $components: [
                                                {
                                                    $cell: true,
                                                    $type: "button",
                                                    _selectedState: {},
                                                    id: "loadStateButton",
                                                    class: "mdc-button mdc-button--raised",
                                                    $text: "Load",
                                                    onclick: function (e) {

                                                        loadSavedState.call(self, this._selectedState.getAttribute('id'), this._selectedState.getAttribute('applicationpath'), this._selectedState.getAttribute('revision'));
                                                        //document.querySelector('#' + 'viewSettings').style.visibility = 'hidden';
                                                    }

                                                }

                                            ]
                                        }
                                    ]
                                }
                            ]

                    }


                }


            let protoPropertiesCell = function (m) {
                return {
                    $type: "div",
                    class: "mdc-layout-grid__inner",
                    _prop: {},
                    $init: function () {

                        let prop = m[1].prop;

                        if (prop.value == undefined && this._currentNode !== undefined) {
                            prop.value = JSON.stringify(utility.transform(vwf.getProperty(this._currentNode, prop.name, []), utility.transforms.transit));
                        }
                        this._prop = prop
                    },
                    $update: function () {
                        this.$components = [

                            {
                                $type: "div",
                                class: "mdc-layout-grid__cell mdc-layout-grid__cell--span-3",
                                $components: [
                                    { $text: this._prop.name }
                                ]
                            },
                            {
                                $type: "div",
                                class: "mdc-layout-grid__cell mdc-layout-grid__cell--span-2",
                            },
                            {
                                $type: "div",
                                class: "mdc-layout-grid__cell mdc-layout-grid__cell--span-7",
                                $components: [
                                    {
                                        class: "mdc-textfield",
                                        $cell: true,
                                        $type: "div",
                                        $components: [{
                                            class: "mdc-textfield__input",
                                            $cell: true,
                                            $type: "input",
                                            type: "text",
                                            value: this._prop.value,
                                            onchange: function (e) {
                                                let propValue = this.value;
                                                try {
                                                    propValue = JSON.parse(propValue);
                                                    self.kernel.setProperty(this._currentNode, this._prop.name, propValue);
                                                } catch (e) {
                                                    // restore the original value on error
                                                    this.value = propValue;
                                                }
                                            }
                                        }]

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

                let sliderPropNames = ['width', 'height', 'depth', 'fullWidth', 'fullHeight', 'xoffset', 'yoffset', 'subcamWidth', 'subcamHeight'];
                let sliderProps = {
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
                        step:10
                    },
                    'fullHeight': {
                        min: 0,
                        max: 5000,
                        step:10
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
                        step:10
                    },
                    'subcamHeight': {
                        min: 0,
                        max: 5000,
                        step:10
                    }
                }
                if (sliderPropNames.includes(m.name)){

                   let currenValue = JSON.parse(m.getValue());

                    var sliderComponent =  widgets.sliderContinuous({
                        'id': 'prop-slider-' + m.name,
                        'label': 'Slider',
                        'min': sliderProps[m.name].min,
                        'max': sliderProps[m.name].max,
                        'step': sliderProps[m.name].step ? sliderProps[m.name].step: 0.1,
                        'value': currenValue,
                        'init': function(){


        const myEl = this;
        var continuousSlider = new mdc.slider.MDCSlider(myEl);
        this._comp = continuousSlider;
        continuousSlider.listen('MDCSlider:input', function(e) {
            console.log(continuousSlider.value)
            let myEl = e.currentTarget;
           // let prop = myEl._prop.body;
            //document.querySelector('#propAceEditor').env.editor.setValue(prop);
            self.kernel.setProperty(myEl._currentNode, m.name, continuousSlider.value);
          //continuousValue.textContent = continuousSlider.value;
         
        });
        continuousSlider.listen('MDCSlider:change', function(e) {
          console.log(continuousSlider.value);
          let myEl = e.currentTarget;
         // let prop = myEl._prop.body;
          //document.querySelector('#propAceEditor').env.editor.setValue(prop);
          self.kernel.setProperty(myEl._currentNode, m.name, continuousSlider.value);

          //continuousCommittedValue.textContent = continuousSlider.value;
        })
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
                            $cell: true,
                            class: "mdc-layout-grid__cell mdc-layout-grid__cell--span-6",
                            $components: [
                                {
                                    $cell: true,
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
                            $cell: true,
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
                                    class: "mdc-textfield",
                                    $cell: true,
                                    $type: "span",
                                    $components: [
                                        {
                                            class: "mdc-textfield__input",
                                            id: "prop-" + m.name,
                                            $cell: true,
                                            $type: "input",
                                            type: "text",
                                            value: m.getValue(),
                                            onchange: function (e) {
                                                let propValue = this.value;
                                                try {
                                                    propValue = JSON.parse(propValue);
                                                    self.kernel.setProperty(this._currentNode, m.name, propValue);

                                                } catch (e) {
                                                    // restore the original value on error
                                                    this.value = propValue;
                                                }
                                            }
                                        }
                                    ]

                                }
                            ]
                        },
                        {
                            $type: "div",
                            class: "mdc-layout-grid__cell mdc-layout-grid__cell--span-1",
                            $components: [
                                {
                                    $cell: true,
                                    $type: "button",
                                    class: "mdc-button",
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
                            $text: m.name
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
                $cell: true,
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
                                class: "mdc-layout-grid__cell mdc-layout-grid__cell--span-3",
                                $components: [
                                    {
                                    $type: "span",
                                    $text: "Chat"
                                }

                                ]
                            },
                            {
                                $type: "div",
                                class: "mdc-layout-grid__cell mdc-layout-grid__cell--span-3",
                                $components: [
                                    widgets.icontoggle({
                                        'id': "webrtcswitch",
                                        'label': 'visibility',
                                        'on': JSON.stringify({"content": "visibility", "label": "Turn On Mic"}),
                                        'off': JSON.stringify({"content": "visibility_off", "label": "Turn Off Mic"}),
                                        'state': false,
                                        'init': function(){
                                            this._driver = vwf.views["vwf/view/webrtc"];
                                            if (!this._driver) {
                                                this.classList.add('mdc-icon-toggle--disabled');

                                            }

                                            this.addEventListener('MDCIconToggle:change', (e) => {
                                                
                                                let driver = e.target._driver;
                                                let chkAttr = e.detail.isOn;
                                                let avatarID = 'avatar-' + self.kernel.moniker();

                                                let micToggle = document.querySelector('#webrtcaudio');
                                                let camToggle = document.querySelector('#webrtcvideo');

                                                if (chkAttr) {
                                                    driver.startWebRTC(avatarID);

                                                    micToggle.classList.remove('mdc-icon-toggle--disabled');
                                                    camToggle.classList.remove('mdc-icon-toggle--disabled');

                                                    console.log("on")
            
                                                } else {
                                                    driver.stopWebRTC(avatarID);

                                                    micToggle.classList.add('mdc-icon-toggle--disabled');
                                                    camToggle.classList.add('mdc-icon-toggle--disabled');
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
                                class: "mdc-layout-grid__cell mdc-layout-grid__cell--span-3",
                                $components: [
                                    widgets.icontoggle({
                                        'id': "webrtcaudio",
                                        'label': 'mic',
                                        'on': JSON.stringify({"content": "mic", "label": "Turn On Mic"}),
                                        'off': JSON.stringify({"content": "mic_off", "label": "Turn Off Mic"}),
                                        'state': false,
                                        'init': function(){
                                            this._driver = vwf.views["vwf/view/webrtc"];
                                            let webrtcswitch = document.querySelector('#webrtcswitch');

                                            if (!this._driver) {
                                                this.classList.add('mdc-icon-toggle--disabled');
                                            }
                                            this.classList.add('mdc-icon-toggle--disabled');
                                            this.addEventListener('MDCIconToggle:change', (e) => {
                                                
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
                                class: "mdc-layout-grid__cell mdc-layout-grid__cell--span-3",
                                $components: [
                                    widgets.icontoggle({
                                        'id': "webrtcvideo",
                                        'label': 'videocam',
                                        'on': JSON.stringify({"content": "videocam", "label": "Turn On Video"}),
                                        'off': JSON.stringify({"content": "videocam_off", "label": "Turn Off Video"}),
                                        'state': false,
                                        'init': function(){
                                            this._driver = vwf.views["vwf/view/webrtc"];

                                            if (!this._driver) {
                                                this.classList.add('mdc-icon-toggle--disabled');
                                            }

                                            this.classList.add('mdc-icon-toggle--disabled');
                                            this.addEventListener('MDCIconToggle:change', (e) => {
                                                
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


            let gizmoEdit = {

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

                                        $cell: true,
                                        $type: "span",
                                        $text: "Edit: ",

                                    }
                                ]
                            },
                            {
                                $type: "div",
                                class: "mdc-layout-grid__cell mdc-layout-grid__cell--span-7",
                                $components: [
                                    widgets.switch({
                                    'id': 'editnode', 
                                    'init': function(){
                                        vwf_view.kernel.getProperty(this._currentNode, 'edit');
                                    },
                                    'onchange': function(e){

                                        var nodeID = document.querySelector('#currentNode')._currentNode;
                                        let chkAttr = this.getAttribute('checked');
                                        if (chkAttr == "") {
                                            self.kernel.setProperty(this._currentNode, 'edit', false);
    
                                        } else {
                                            self.kernel.setProperty(this._currentNode, 'edit', true);
                                        }
    
                                        vwf_view.kernel.callMethod(nodeID, "showCloseGizmo");
                                    }
                                }
                                )
                                ]
                            },
                            {
                                $type: "div",
                                class: "mdc-layout-grid__cell mdc-layout-grid__cell--span-1",
                                $components: [
                                    {

                                        $cell: true,
                                        $type: "a",
                                        class: "gizmomode",
                                        $text: "T",
                                        onclick: function (e) {
                                            vwf_view.kernel.callMethod(this._currentNode, "setGizmoMode", ['translate'])
                                        }
                                    }
                                ]
                            },
                            {
                                $type: "div",
                                class: "mdc-layout-grid__cell mdc-layout-grid__cell--span-1",
                                $components: [
                                    {

                                        $cell: true,
                                        $type: "a",
                                        class: "gizmomode",
                                        $text: "R",
                                        onclick: function (e) {
                                            vwf_view.kernel.callMethod(this._currentNode, "setGizmoMode", ['rotate'])
                                        }
                                    }
                                ]
                            },
                            {
                                $type: "div",
                                class: "mdc-layout-grid__cell mdc-layout-grid__cell--span-1",
                                $components: [
                                    {

                                        $cell: true,
                                        $type: "a",
                                        class: "gizmomode",
                                        $text: "S",
                                        onclick: function (e) {
                                            vwf_view.kernel.callMethod(this._currentNode, "setGizmoMode", ['scale'])
                                        }
                                    }
                                ]
                            }
                        ]
                    }

                ]
            }

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
                    let props = Object.entries(getProperties.call(self, self.kernel, node.extendsID)).filter(filterFunction.bind(this));

                    return props
                },
                $update: function () {
                    //this.$text = this._currentNode;

                    let node = self.nodes[this._currentNode];
                    let nodeProtos = getPrototypes(self.kernel, node.extendsID);

                    var viewerProps = {};
                    var viewerPropsCell = {};

                    var gizmoCell = {};
                    if (this._currentNode !== self.kernel.application()) {
                        if (nodeProtos.includes('http://vwf.example.com/aframe/componentNode.vwf')) {
                            //gizmoCell = {};
                        } else {
                            gizmoCell = gizmoEdit
                        }
                    }

                    if (node !== undefined) {
                        if (node.extendsID == "http://vwf.example.com/aframe/acamera.vwf") {
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
                                        $cell: true,
                                        $type: "div",
                                        class: "mdc-layout-grid__inner",
                                        $components: [
                                            {
                                                $cell: true,
                                                $type: "div",
                                                class: "mdc-layout-grid__cell mdc-layout-grid__cell--span-12",
                                                $components: [
                                                    {
                                                        $cell: true,
                                                        $type: "button",
                                                        class: "mdc-button mdc-button--raised",
                                                        $text: "Active",
                                                        onclick: function (e) {
                                                            //let camera = document.querySelector('#' + this._currentNode);
                                                            vwf_view.kernel.callMethod(this._currentNode, "setCameraToActive", [vwf.moniker_]);
                                                            //camera.setAttribute('camera', 'active', true);
                                                        }

                                                    }

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
                            $cell: true,
                            $type: "ul",
                            class: "mdc-list",
                            $components: [

                                {
                                    $cell: true,
                                    $type: "button",
                                    class: "mdc-list-item mdc-button mdc-button--raised",
                                    $text: "<--",
                                    onclick: function (e) {
                                        let node = self.nodes[this._currentNode];
                                        if (node.parentID !== 0) {
                                            //self.currentNodeID = node.parentID,
                                            document.querySelector('#currentNode')._setNode(node.parentID)
                                        }

                                    }

                                },
                                {
                                    $type: "li",
                                    class: "mdc-list-item",
                                    $components: [
                                        {
                                            $text: "name",
                                            $type: "span",
                                            $init: function () {
                                                let node = self.nodes[this._currentNode];
                                                if (node) this.$text = node.name
                                            },
                                            class: "mdc-list-item__text mdc-typography--headline"
                                            //<h1 class="mdc-typography--display4">Big header</h1>
                                        }]
                                }, listDivider,
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
                                                        {
                                                            $cell: true,
                                                            $type: "button",
                                                            class: "mdc-button mdc-button--raised",
                                                            $text: "Methods browser",
                                                            onclick: function (e) {
                                                                var currentNode = document.querySelector('#currentNode')._currentNode;
                                                                if (currentNode == '') {
                                                                    currentNode = vwf_view.kernel.find("", "/")[0];
                                                                }
                                                                document.querySelector('#liveCodeEditor')._setNode(currentNode);
                                                                //createAceEditor(self, currentNode);
                                                                document.querySelector('#codeEditorWindow').style.visibility = 'visible';
                                                            }

                                                        }
                                                    ]
                                                }

                                            ]
                                        }
                                    ]
                                },
                                gizmoCell,
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
                                    $cell: true,
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
                                    $cell: true,
                                    $type: "div",
                                    class: "propGrid mdc-layout-grid max-width mdc-layout-grid--align-left",
                                    $components: this._getNodeProtoProperties().map(protoPropertiesCell)
                                }, listDivider,
                                viewerProps,
                                viewerPropsCell

                            ]
                        }




                    ]
                }

            }

            let numberSliderComponent = {
                $cell: true,
                $type: "div",
                class: "mdc-layout-grid__cell mdc-layout-grid__cell--span-4",
                $init: function () {
                    
                },
                $components: [
                    {
                        $cell: true,
                        $type: "div",
                        style: "padding: 0 16px;", 
                        $components:[
                            {}
                        ]
                    }
                    
                        
                    
                ]
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
                            if (myEl._propName == 'color') {

                                // console.log(hex);    
                                document.querySelector('#propAceEditor').env.editor.setValue(JSON.stringify(hex));
                                self.kernel.setProperty(myEl._editorNode, myEl._propName, hex);
                            }
                        });
                    if (myEl._propName == 'color') {
                        cp.setHex(JSON.parse(myEl._prop.body));
                    }
                },
                $components: [
                    {
                        $cell: true,
                        $type: "div",
                        id: "color-picker",
                        class: "cp-default",
                        $components: [
                            {
                                $cell: true,
                                $type: "div",
                                class: "picker-wrapper",
                                $components: [
                                    {
                                        $cell: true,
                                        $type: "div",
                                        id: "picker",
                                        class: "picker",
                                        style: "width: 130px; height: 130px"
                                    },
                                    {
                                        $cell: true,
                                        $type: "div",
                                        id: "picker-indicator",
                                        class: "picker-indicator"
                                    }
                                ]
                            },
                            {
                                $cell: true,
                                $type: "div",
                                class: "slide-wrapper",
                                $components: [
                                    {
                                        $cell: true,
                                        $type: "div",
                                        id: "slide",
                                        class: "slide",
                                        style: "width: 30px; height: 130px"
                                    },
                                    {
                                        $cell: true,
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
                        if (this._propName == 'color') {
                            livePropertyComponent = colorPickerComponent
                        }
                        

                    } else {
                        editorClass = "mdc-layout-grid__cell mdc-layout-grid__cell--span-12"
                    }


                    this.$components = [
                        {
                            $cell: true,
                            $type: "div",
                            class: "mdc-layout-grid__inner",
                            $components: [

                                {
                                    $cell: true,
                                    $type: "div",
                                    class: "mdc-layout-grid__cell mdc-layout-grid__cell--span-2",
                                    $components: [
                                        {
                                            $cell: true,
                                            $type: "button",
                                            class: "mdc-button mdc-button--raised",
                                            $text: "Update",
                                            onclick: function (e) {
                                                let editor = document.querySelector("#propAceEditor").env.editor;
                                                let value = editor.getValue();

                                                try {
                                                    let propValue = (this._prop.type == 'simple') ? (JSON.parse(value)) : (value)
                                                    //propValue = JSON.parse(value);
                                                    self.kernel.setProperty(this._editorNode, this._propName, propValue);

                                                } catch (e) {
                                                    // restore the original value on error
                                                    this.value = propValue;
                                                }

                                            }

                                        }]
                                },
                                {
                                    $cell: true,
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
                                    $cell: true,
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
                            $cell: true,
                            $type: "div",
                            class: "mdc-layout-grid__inner",
                            $components: [
                                {
                                    $cell: true,
                                    $type: "div",
                                    class: editorClass,
                                    $components: [
                                        {
                                            $cell: true,
                                            class: "aceEditor",
                                            id: "propAceEditor",
                                            $type: "div",
                                            $text: this._prop.body,
                                            $init: function () {
                                                createAceEditor(self, this._editorNode, "propAceEditor");
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
                _getNodeMethods: function () {
                    let node = self.nodes[this._editorNode];
                    return node.methods
                },
                _getProtoNodeMethods: function () {
                    let node = self.nodes[this._editorNode];
                    let prototypeMethods = getMethods.call(self, self.kernel, node.extendsID);
                    return prototypeMethods
                },
                id: "liveCodeEditor",
                _setNode: function (node) {
                    this._editorNode = node;
                    this._method.body = ''
                },
                class: "codeEditorGrid mdc-layout-grid max-width mdc-layout-grid--align-left",
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
                            $cell: true,
                            $type: "div",
                            class: "mdc-layout-grid__inner",
                            $components: [
                                {
                                    $cell: true,
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
                                    $cell: true,
                                    $type: "div",
                                    class: "mdc-layout-grid__cell mdc-layout-grid__cell--span-2",
                                    $components: [
                                        {
                                            $cell: true,
                                            $type: "button",
                                            class: "mdc-button mdc-button--raised",
                                            $text: "Update",
                                            onclick: function (e) {
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

                                        }]
                                },
                                {
                                    $cell: true,
                                    $type: "div",
                                    class: "mdc-layout-grid__cell mdc-layout-grid__cell--span-2",
                                    $components: [
                                        {
                                            $cell: true,
                                            $type: "button",
                                            class: "mdc-button mdc-button--raised",
                                            $text: "Call",
                                            onclick: function (e) {
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
                                                self.kernel.callMethod(this._editorNode, this._methodName, params);

                                            }

                                        }]
                                },
                                {
                                    $cell: true,
                                    $type: "div",
                                    class: "mdc-layout-grid__cell mdc-layout-grid__cell--span-2",
                                    $components: [
                                        {
                                            $cell: true,
                                            $type: "button",
                                            class: "mdc-button mdc-button--raised",
                                            $text: "Do It",
                                            onclick: function (e) {
                                                let editor = document.querySelector("#aceEditor").env.editor;
                                                codeEditorDoit.call(self, editor, this._editorNode);
                                            }

                                        }]
                                },
                                {
                                    $cell: true,
                                    $type: "div",
                                    class: "mdc-layout-grid__cell mdc-layout-grid__cell--span-3",
                                    $components: [
                                        {
                                            $cell: true,
                                            $type: "button",
                                            class: "mdc-button mdc-button--raised",
                                            $text: "Print It",
                                            onclick: function (e) {
                                                let editor = document.querySelector("#aceEditor").env.editor;
                                                codeEditorPrintit.call(self, editor, this._editorNode);
                                            }

                                        }]
                                }

                            ]
                        },
                        {
                            $cell: true,
                            $type: "div",
                            class: "mdc-layout-grid__inner",
                            $components: [
                                {
                                    $cell: true,
                                    $type: "div",
                                    class: "mdc-layout-grid__cell mdc-layout-grid__cell--span-3",
                                    style: "overflow-y: scroll; max-height: 400px;",
                                    $components: [
                                        {
                                            $cell: true,
                                            $type: "div",
                                            class: "mdc-list-group",

                                            $components: [

                                                {
                                                    $type: "h3",
                                                    class: "mdc-list-group__subheader mdc-list-item__text mdc-typography--button",
                                                    $text: "Node methods"
                                                },
                                                {
                                                    $cell: true,
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
                                                    $cell: true,
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
                                                //     $cell: true,
                                                //     $type: "ul",
                                                //     class: "mdc-list",
                                                //     $components: Object.entries(this._getComplexProps()).map(this._listPropertyElement)
                                                // }

                                            ]


                                        }
                                    ]
                                },

                                {
                                    $cell: true,
                                    $type: "div",
                                    class: "mdc-layout-grid__cell mdc-layout-grid__cell--span-9",
                                    $components: [
                                        {
                                            $cell: true,
                                            class: "aceEditor",
                                            id: "aceEditor",
                                            $type: "div",
                                            $text: this._method.body,
                                            $init: function () {
                                                createAceEditor(self, this._editorNode, "aceEditor");
                                            }
                                        }

                                    ]
                                }
                            ]
                        },
                        {
                            $cell: true,
                            $type: "div",
                            class: "mdc-layout-grid__inner",
                            $components: [
                                {
                                    $cell: true,
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
                            $cell: true,
                            $type: "div",
                            class: "mdc-layout-grid__inner",
                            $components: [
                                {
                                    $cell: true,
                                    $type: "div",
                                    class: "mdc-layout-grid__cell mdc-layout-grid__cell--span-3",
                                    $components: [
                                        {
                                            class: "mdc-textfield",
                                            $cell: true,
                                            $type: "div",
                                            $components: [{
                                                class: "mdc-textfield__input",
                                                id: "methodName",
                                                $cell: true,
                                                $type: "input",
                                                type: "text",
                                                value: "newMethodName",
                                                onchange: function (e) {
                                                    let propValue = this.value;
                                                    try {

                                                    } catch (e) {
                                                        // restore the original value on error

                                                    }
                                                }
                                            }]

                                        }
                                    ]
                                },

                                {
                                    $cell: true,
                                    $type: "div",
                                    class: "mdc-layout-grid__cell mdc-layout-grid__cell--span-7",
                                    $components: [
                                        {
                                            class: "mdc-textfield params-textfield-input",
                                            $cell: true,
                                            $type: "div",
                                            $components: [{
                                                class: "mdc-textfield__input",
                                                id: "methodParams",
                                                $cell: true,
                                                $type: "input",
                                                type: "text",
                                                value: JSON.stringify(this._method.parameters),
                                                onchange: function (e) {
                                                    let propValue = this.value;
                                                    try {

                                                    } catch (e) {
                                                        // restore the original value on error

                                                    }
                                                }
                                            }]

                                        }
                                    ]
                                },
                                {
                                    $cell: true,
                                    $type: "div",
                                    class: "mdc-layout-grid__cell mdc-layout-grid__cell--span-2",
                                    $components: [

                                        {
                                            $cell: true,
                                            $type: "button",
                                            class: "mdc-button mdc-button--raised",
                                            $text: "Create",
                                            onclick: function (e) {
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


                                        }
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
                                $cell: true,
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
                    this._watchNodes = self.nodes["http://vwf.example.com/clients.vwf"].children.slice()
                },
                $update: function () {
                    //this._clientNodes
                    this.$components = this._watchNodes.map(this._listElement)
                }
            }

            //createCellWindow("clientsWindow", clientListCell, "Clients");
            //createCellWindow("propWindow", propWindow, "Scene");
            createCellWindow("codeEditorWindow", codeEditorWindow, "Code editor");
            createCellWindow("propEditorWindow", propEditorWindow, "Prop editor");




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
                                $cell: true,
                                $type: "div",
                                class: "mdc-layout-grid__cell mdc-layout-grid__cell--span-12",
                                $components: [

                                    nodesCell

                                ]
                            }
                        ]
                    }
                ]
            }


            let sideBar = {
                $cell: true,
                $type: "div",
                id: 'sideBar',
                class: "sideBar mdc-toolbar-fixed-adjust",
                _sideBarComponent: {},
                _sideCurrentNode: '',
                $init: function () {
                    this.style.visibility = 'hidden';
                    this._importScript("/" + self.getRoot() + "/appui.js");

                },
                _importScript: function (sSrc, fOnload) {
                    var oScript = document.createElement("script");
                    oScript.type = "text\/javascript";
                    oScript.async = false;
                    //oScript.onerror = loadError;
                    if (fOnload) { oScript.onload = fOnload; }
                    oScript.src = sSrc;
                    //let sideBar = document.querySelector('#sideBar');
                    this.appendChild(oScript);
                },
                _getAppDef: async function () {
                    let response = await fetch("/" + self.getRoot() + "/appui.js");
                    let data = await response.text();
                    //console.log(data)
                    return data
                },
                $update: function () {
                    this.$components = [
                        {
                            $cell: true,
                            $type: "button",
                            class: "mdc-button mdc-button--compact",
                            $text: "X",
                            onclick: function (e) {
                                document.querySelector('#sideBar').style.visibility = 'hidden';
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
                            $cell: true,
                            $type: "div",
                            class: "mdc-layout-grid__inner",
                            $components: [
                                {
                                    $cell: true,
                                    $type: "div",
                                    class: "mdc-layout-grid__cell mdc-layout-grid__cell--span-12",
                                    $components: [
                                        {
                                            $cell: true,
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
                $type: "nav",
                class: "mdc-temporary-drawer__drawer",

                $components: [
                    {
                        $cell: true,
                        $type: "header",
                        class: "mdc-temporary-drawer__header",
                        $components: [
                            {
                                $cell: true,
                                $type: "div",
                                class: "mdc-temporary-drawer__header-content mdc-theme--primary-bg mdc-theme--text-primary-on-primary",
                                $text: "Home"
                            }
                        ]
                    },

                    {
                        $cell: true,
                        $type: "nav",
                        class: "mdc-temporary-drawer__content mdc-list-group",
                        $components: [
                            {
                                $cell: true,
                                $type: "div",
                                class: "mdc-list",
                                $components: [
                                    {
                                        $cell: true,
                                        $type: "a",
                                        class: "mdc-list-item",
                                        $href: "#",
                                        onclick: function (e) {

                                            let sideBar = document.querySelector('#sideBar');

                                            try {
                                                sideBar._sideBarComponent = createApp.call(self);
                                            } catch (e) {
                                                sideBar._sideBarComponent = defaultApp();
                                            }

                                            drawer.open = !drawer.open
                                            document.querySelector('#sideBar').style.visibility = 'visible';
                                        },
                                        $components: [{
                                            $type: "i",
                                            class: "material-icons mdc-list-item__start-detail",
                                            'aria-hidden': "true",
                                            $text: "play_arrow"
                                        },
                                        {
                                            $text: "App"
                                        }]

                                    },
                                    {
                                        $cell: true,
                                        $type: "a",
                                        class: "mdc-list-item",
                                        $href: "#",
                                        onclick: function (e) {

                                            let sideBar = document.querySelector('#sideBar');
                                            sideBar._sideBarComponent = viewSceneProps;

                                            let currentNode = document.querySelector('#sideBar')._sideCurrentNode;
                                            currentNode == '' ? document.querySelector('#sideBar')._sideCurrentNode = (vwf_view.kernel.find("", "/")[0]) :
                                                document.querySelector('#sideBar')._sideCurrentNode = currentNode;

                                            document.querySelector('#sideBar').style.visibility = 'visible';
                                            drawer.open = !drawer.open
                                            // let currentNode = document.querySelector('#currentNode')._currentNode;
                                            // currentNode == '' ? document.querySelector('#currentNode')._setNode(vwf_view.kernel.find("", "/")[0]) :
                                            //     document.querySelector('#currentNode')._setNode(currentNode);




                                        },
                                        $components: [{
                                            $cell: true,
                                            $type: "i",
                                            class: "material-icons mdc-list-item__start-detail",
                                            $text: "description"
                                        },
                                        {
                                            $text: "Scene"
                                        }
                                        ]

                                    },
                                    {
                                        $cell: true,
                                        $type: "a",
                                        class: "mdc-list-item",
                                        $href: "#",
                                        onclick: function (e) {
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
                                            class: "material-icons mdc-list-item__start-detail",
                                            'aria-hidden': "true",
                                            $text: "code"
                                        },
                                        {
                                            $text: "Code editor"
                                        }]

                                    },

                                    {
                                        $cell: true,
                                        $type: "a",
                                        class: "mdc-list-item",
                                        $href: "#",
                                        onclick: function (e) {
                                            //self.currentNodeID = m.ID;

                                            // document.querySelector('#clientsList')._setClientNodes(self.nodes["http://vwf.example.com/clients.vwf"]);
                                            // document.querySelector('#clientsWindow').style.visibility = 'visible';
                                            let sideBar = document.querySelector('#sideBar');
                                            sideBar._sideBarComponent = avatarSettings;

                                            drawer.open = !drawer.open
                                            document.querySelector('#sideBar').style.visibility = 'visible';
                                        },
                                        $components: [{
                                            $type: "i",
                                            class: "material-icons mdc-list-item__start-detail",
                                            'aria-hidden': "true",
                                            $text: "account_circle"
                                        },
                                        {
                                            $text: "My Avatar"
                                        }]

                                    },


                                    {
                                        $cell: true,
                                        $type: "a",
                                        class: "mdc-list-item",
                                        $href: "#",
                                        onclick: function (e) {
                                            //self.currentNodeID = m.ID;

                                            // document.querySelector('#clientsList')._setClientNodes(self.nodes["http://vwf.example.com/clients.vwf"]);

                                            let sideBar = document.querySelector('#sideBar');
                                            sideBar._sideBarComponent = viewSettings;

                                            drawer.open = !drawer.open
                                            document.querySelector('#sideBar').style.visibility = 'visible';
                                        },
                                        $components: [{
                                            $type: "i",
                                            class: "material-icons mdc-list-item__start-detail",
                                            'aria-hidden': "true",
                                            $text: "settings"
                                        },
                                        {
                                            $text: "Settings"
                                        }]

                                    },
                                    {
                                        $cell: true,
                                        $type: "a",
                                        class: "mdc-list-item",
                                        $href: "#",
                                        onclick: function (e) {
                                            //self.currentNodeID = m.ID;

                                            // document.querySelector('#clientsList')._setClientNodes(self.nodes["http://vwf.example.com/clients.vwf"]);

                                            let sideBar = document.querySelector('#sideBar');

                                            sideBar._sideBarComponent = loadSaveSettings;

                                            if (document.querySelector('#loadSaveSettings')) {
                                                document.querySelector('#loadSaveSettings')._getStates();
                                            }
                                            //sideBar._sideBarComponent._getStates();

                                            drawer.open = !drawer.open
                                            document.querySelector('#sideBar').style.visibility = 'visible';
                                        },
                                        $components: [{
                                            $type: "i",
                                            class: "material-icons mdc-list-item__start-detail",
                                            'aria-hidden': "true",
                                            $text: "save"
                                        },
                                        {
                                            $text: "Load/Save"
                                        }]

                                    }



                                ]
                            },
                            widgets.divider,
                            webrtcGUI,
                            widgets.divider,
                            widgets.headerH3("h3", "Users online", "userList mdc-list-group__subheader"),
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
                class: "mdc-temporary-drawer",
                $components: [drawerCell]
            }
            );


            let toolbar = {
                $cell: true,
                $type: "div",
                class: "mdc-toolbar__row",
                $components: [{
                    $type: "section",
                    class: "mdc-toolbar__section mdc-toolbar__section--align-start",
                    $components: [
                        {
                            $type: "button",
                            class: "demo-menu material-icons mdc-toolbar__icon--menu",
                            $text: "menu"


                        },
                        {
                            $type: "span",
                            class: "mdc-toolbar__title catalog-title",
                            $text: "LiveCoding.space"
                        }

                    ]
                }]

            };

            document.querySelector("#toolbar").$cell({
                $cell: true,
                $type: "div",
                class: "mdc-toolbar mdc-toolbar--fixed",
                $components: [toolbar]
            }
            );

            // let drawer = new mdc.drawer.MDCTemporaryDrawer(document.querySelector('.mdc-temporary-drawer'));
            // document.querySelector('.menu').addEventListener('click', () => drawer.open = true);

        var toggleNodes = document.querySelectorAll('.mdc-icon-toggle');
        toggleNodes.forEach( el => {
            mdc.iconToggle.MDCIconToggle.attachTo(el);
        });



            var drawerEl = document.querySelector('.mdc-temporary-drawer');
            var MDCTemporaryDrawer = mdc.drawer.MDCTemporaryDrawer;
            var drawer = new MDCTemporaryDrawer(drawerEl);
            document.querySelector('.demo-menu').addEventListener('click', function () {
                //self.currentNodeID = (self.currentNodeID == '') ? (vwf_view.kernel.find("", "/")[0]) : self.currentNodeID; 


                // let currentNode = document.querySelector('#currentNode')._currentNode;
                // currentNode == '' ? document.querySelector('#currentNode')._setNode(vwf_view.kernel.find("", "/")[0]) :
                // document.querySelector('#currentNode')._setNode(currentNode);


                //document.querySelector('#currentNode')._setNode(self.currentNodeID);
                drawer.open = !drawer.open;
            });
            drawerEl.addEventListener('MDCTemporaryDrawer:open', function () {
                //console.log('Received MDCPersistentDrawer:open');
            });
            drawerEl.addEventListener('MDCTemporaryDrawer:close', function () {
                //console.log('Received MDCPersistentDrawer:close');
            });


            //==============

        },

        createdNode: function (nodeID, childID, childExtendsID, childImplementsIDs,
            childSource, childType, childIndex, childName, callback /* ( ready ) */) {

            var nodeIDAttribute = $.encoder.encodeForHTMLAttribute("id", nodeID, true);
            var childIDAttribute = $.encoder.encodeForHTMLAttribute("id", childID, true);
            var childIDAlpha = $.encoder.encodeForAlphaNumeric(childID);

            var kernel = this.kernel;
            var self = this;
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
            };

            if (parent) {
                parent.children.push(node);
            }

            if (childID == vwf_view.kernel.find("", "/")[0] && childExtendsID && this.kernel.test(childExtendsID,
                "self::element(*,'http://vwf.example.com/aframe/ascene.vwf')", childExtendsID)) {
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
                document.querySelector('body').classList.add("editor-body");
            }



        },

        createdProperty: function (nodeID, propertyName, propertyValue) {

            return this.initializedProperty(nodeID, propertyName, propertyValue);
        },

        initializedProperty: function (nodeID, propertyName, propertyValue) {

            var node = this.nodes[nodeID];

            if (!node) return;  // TODO: patch until full-graph sync is working; drivers should be able to assume that nodeIDs refer to valid objects

            var property = node.properties[propertyName] = createProperty.call(this, node, propertyName, propertyValue);

            node.properties.push(property);
        },

        deletedNode: function (nodeID) {
            var node = this.nodes[nodeID];
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

                var property = node.properties[propertyName] = createProperty.call(this, node, propertyName, propertyValue);

                node.properties.push(property);
            }


            try {
                propertyValue = utility.transform(propertyValue, utility.transforms.transit);
                node.properties[propertyName].value = JSON.stringify(propertyValue);
                node.properties[propertyName].rawValue = propertyValue;
            } catch (e) {
                this.logger.warnx("satProperty", nodeID, propertyName, propertyValue,
                    "stringify error:", e.message);
                node.properties[propertyName].value = propertyValue;
            }


            let nodeCell = document.querySelector('#currentNode');

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
                    let editCheckBox = document.querySelector("#currentNode #editnode");
                    if (editCheckBox) {
                        if (propertyValue) {
                            editCheckBox.setAttribute('checked', '');
                        } else {
                            let checkAttr = editCheckBox.getAttribute('checked');
                            if (checkAttr) editCheckBox.removeAttribute('checked');
                        }
                    }
                    console.log('EDIT !!! is ' + propertyValue)

                }

            }


        },




        createdMethod: function (nodeID, methodName, methodParameters, methodBody) {
            var node = this.nodes[nodeID];
            if (node) {
                node.methods[methodName] = methodParameters;
            }
        },

        //calledMethod: function( nodeID, methodName, methodParameters, methodValue ) {

        //},

        createdEvent: function (nodeID, eventName, eventParameters) {
            var node = this.nodes[nodeID];
            if (node) {
                node.events[eventName] = eventParameters;
            }
        },

        firedEvent: function (nodeID, eventName, eventParameters) {

        },

        executed: function (nodeID, scriptText, scriptType) {

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



    function createCellWindow(elementID, cellNode, title) {

        document.querySelector('#' + elementID).$cell({
            $cell: true,
            $type: "div",
            id: elementID,
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
                        handle: '.handle',
                        containment: true
                    });
                    draggies.push(draggie);
                }


                this.style.visibility = 'hidden';
            },
            $components: [

                {
                    $cell: true,
                    $type: "div",
                    class: "handle",
                    $components: [
                        {
                            $cell: true,
                            $type: "button",
                            class: "mdc-button mdc-button--compact",
                            $text: "X",
                            onclick: function (e) {
                                //self.currentNodeID = m.ID;
                                document.querySelector('#' + elementID).style.visibility = 'hidden';
                            }

                        },
                        {
                            $cell: true,
                            $type: "span",
                            class: "mdc-typography--button",
                            $text: title
                        }

                    ]
                },

                cellNode,
                {
                    $cell: true,
                    $type: "div",
                    class: "handle",
                    style: "height: 10px; width: inherit;",
                    //$text: "sdfsdf"
                }
                // { $text: "23423"}
            ]
        }
        );


    }



    // -- getChildByName --------------------------------------------------------------------




    function getChildByName(node, childName) {
        var childNode = undefined;
        for (var i = 0; i < node.children.length && childNode === undefined; i++) {
            if (node.children[i].name == childName) {
                childNode = node.children[i];
            }
        }
        return childNode;
    };



    // -- viewScript ------------------------------------------------------------------------

    function createAceEditor(view, nodeID, elID) {
        var editor = view.ace.edit(elID);
        editor.setTheme("ace/theme/monokai");
        editor.setFontSize(16);
        editor.getSession().setMode("ace/mode/javascript");

        editor.commands.addCommand({
            name: "doit",
            bindKey: { win: "Ctrl-e", mac: "Command-e" },
            exec: function () {
                codeEditorDoit(editor, nodeID);
            }
        });

        editor.commands.addCommand({
            name: "printit",
            bindKey: { win: "Ctrl-b", mac: "Command-b" },
            exec: function () {
                codeEditorPrintit(editor, nodeID);
            }
        });

        return editor;

    }



    function getPrototypes(kernel, extendsID) {
        var prototypes = [];
        var id = extendsID;

        while (id !== undefined) {
            prototypes.push(id);
            id = kernel.prototype(id);
        }

        return prototypes;
    }

    function getPrototypes(kernel, extendsID) {
        var prototypes = [];
        var id = extendsID;

        while (id !== undefined) {
            prototypes.push(id);
            id = kernel.prototype(id);
        }

        return prototypes;
    }

    function createProperty(node, propertyName, propertyValue) {
        var property = {
            name: propertyName,
            rawValue: propertyValue,
            value: undefined,
            getValue: function () {
                var propertyValue;
                if (this.value == undefined) {
                    try {
                        propertyValue = utility.transform(this.rawValue, utility.transforms.transit);
                        this.value = JSON.stringify(propertyValue);
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


    function getProperties(kernel, extendsID) {
        var pTypes = getPrototypes(kernel, extendsID);
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

    function getChildren(kernel, extendsID) {
        var pTypes = getPrototypes(kernel, extendsID);
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

    function getEvents(kernel, extendsID) {
        var pTypes = getPrototypes(kernel, extendsID);
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

    function getMethods(kernel, extendsID) {
        var pTypes = getPrototypes(kernel, extendsID);
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



    function codeEditorDoit(editor, nodeID) {
        var selectedText = editor.getSession().doc.getTextRange(editor.selection.getRange());

        if (selectedText == "") {

            var currline = editor.getSelectionRange().start.row;
            var selectedText = editor.session.getLine(currline);

        }

        //console.log(selectedText);
        //var sceneID = self.kernel.application();
        vwf_view.kernel.execute(nodeID, selectedText);

    }

    function codeEditorPrintit(editor, nodeID) {
        var selectedText = editor.getSession().doc.getTextRange(editor.selection.getRange());

        if (selectedText == "") {

            var currline = editor.getSelectionRange().start.row;
            var selectedText = editor.session.getLine(currline);

        }

        //console.log(selectedText);
        //var sceneID = self.kernel.application();
        let scriptText = 'console.log(' + selectedText + ');'
        self.kernel.execute(nodeID, scriptText);

    }





    function saveStateAsFile(filename) // invoke with the view as "this"
    {
        this.logger.info("Saving: " + filename);

        var clients = this.nodes["http://vwf.example.com/clients.vwf"];

        if (supportAjaxUploadWithProgress.call(this)) {
            var xhr = new XMLHttpRequest();

            // Save State Information
            var state = vwf.getState();
            state.nodes[0].children = {};

            var timestamp = state["queue"].time;
            timestamp = Math.round(timestamp * 1000);

            var objectIsTypedArray = function (candidate) {
                var typedArrayTypes = [
                    Int8Array,
                    Uint8Array,
                    // Uint8ClampedArray,
                    Int16Array,
                    Uint16Array,
                    Int32Array,
                    Uint32Array,
                    Float32Array,
                    Float64Array
                ];

                var isTypedArray = false;

                if (typeof candidate == "object" && candidate != null) {
                    typedArrayTypes.forEach(function (typedArrayType) {
                        isTypedArray = isTypedArray || candidate instanceof typedArrayType;
                    });
                }

                return isTypedArray;
            };

            var transitTransformation = function (object) {
                return objectIsTypedArray(object) ?
                    Array.prototype.slice.call(object) : object;
            };

            var json = JSON.stringify(
                require("vwf/utility").transform(
                    state, transitTransformation
                )
            );

            json = $.encoder.encodeForURL(json);

            var path = window.location.pathname;
            var pathSplit = path.split('/');
            if (pathSplit[0] == "") {
                pathSplit.shift();
            }
            if (pathSplit[pathSplit.length - 1] == "") {
                pathSplit.pop();
            }
            var inst = undefined;
            var instIndex = pathSplit.length - 1;
            if (pathSplit.length > 2) {
                if (pathSplit[pathSplit.length - 2] == "load") {
                    instIndex = pathSplit.length - 3;
                }
            }
            if (pathSplit.length > 3) {
                if (pathSplit[pathSplit.length - 3] == "load") {
                    instIndex = pathSplit.length - 4;
                }
            }
            inst = pathSplit[instIndex];

            var root = "";
            for (var i = 0; i < instIndex; i++) {
                if (root != "") {
                    root = root + "/";
                }
                root = root + pathSplit[i];
            }

            if (filename == '') filename = inst;

            if (root.indexOf('.vwf') != -1) root = root.substring(0, root.lastIndexOf('/'));

            xhr.open("POST", "/" + root + "/save/" + filename, true);
            xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            xhr.send("root=" + root + "/" + filename + "&filename=saveState&inst=" + inst + "&timestamp=" + timestamp + "&extension=.vwf.json" + "&jsonState=" + json);

            // Save Config Information
            var config = { "info": {}, "model": {}, "view": {} };

            // Save browser title
            config["info"]["title"] = document.title//$('title').html();

            // Save model drivers
            Object.keys(vwf_view.kernel.kernel.models).forEach(function (modelDriver) {
                if (modelDriver.indexOf('vwf/model/') != -1) config["model"][modelDriver] = "";
            });

            // If neither glge or threejs model drivers are defined, specify nodriver
            if (config["model"]["vwf/model/glge"] === undefined && config["model"]["vwf/model/threejs"] === undefined) config["model"]["nodriver"] = "";

            // Save view drivers and associated parameters, if any
            Object.keys(vwf_view.kernel.kernel.views).forEach(function (viewDriver) {
                if (viewDriver.indexOf('vwf/view/') != -1) {
                    if (vwf_view.kernel.kernel.views[viewDriver].parameters) {
                        config["view"][viewDriver] = vwf_view.kernel.kernel.views[viewDriver].parameters;
                    }
                    else config["view"][viewDriver] = "";
                }
            });

            var jsonConfig = $.encoder.encodeForURL(JSON.stringify(config));

            // Save config file to server
            var xhrConfig = new XMLHttpRequest();
            xhrConfig.open("POST", "/" + root + "/save/" + filename, true);
            xhrConfig.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            xhrConfig.send("root=" + root + "/" + filename + "&filename=saveState&inst=" + inst + "&timestamp=" + timestamp + "&extension=.vwf.config.json" + "&jsonState=" + jsonConfig);
        }

        else {
            console.error("Unable to save state.");
        }
    }

    // -- LoadSavedState --------------------------------------------------------------------------

    function loadSavedState(filename, applicationpath, revision) {
        this.logger.info("Loading: " + filename);

        // Redirect until setState ID conflict is resolved
        var path = window.location.pathname;
        var inst = path.substring(path.length - 17, path.length - 1);

        var pathSplit = path.split('/');
        if (pathSplit[0] == "") {
            pathSplit.shift();
        }
        if (pathSplit[pathSplit.length - 1] == "") {
            pathSplit.pop();
        }
        var inst = undefined;
        var instIndex = pathSplit.length - 1;
        if (pathSplit.length > 2) {
            if (pathSplit[pathSplit.length - 2] == "load") {
                instIndex = pathSplit.length - 3;
            }
        }
        if (pathSplit.length > 3) {
            if (pathSplit[pathSplit.length - 3] == "load") {
                instIndex = pathSplit.length - 4;
            }
        }
        inst = pathSplit[instIndex];
        if (revision) {
            window.location.pathname = applicationpath + "/" + inst + '/load/' + filename + '/' + revision + '/';
        }
        else {
            window.location.pathname = applicationpath + "/" + inst + '/load/' + filename + '/';
        }

        // $.get(filename,function(data,status){
        //     vwf.setState(data);
        // });
    }

    // -- SupportAjax -----------------------------------------------------------------------------

    function supportAjaxUploadWithProgress() {
        return supportAjaxUploadProgressEvents();

        function supportAjaxUploadProgressEvents() {
            var xhr = new XMLHttpRequest();
            return !!(xhr && ('upload' in xhr) && ('onprogress' in xhr.upload));
        }
    }
});
