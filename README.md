# LiveCoding.space

> Collaborative Live Coding Space with support of user-defined languages and **WebVR** ready 3D graphics
Based on: **Virtual World Framework (Croquet)** | **A-Frame** | **Ohm language** | **OSC.js** | **Cell.js** | **GunDB** and more...

Online at: **[https://livecoding.space](https://livecoding.space)**

#### This repository is contaning the source code of the [Krestianstvo SDK 3](https://krestianstvo.org/sdk3/)   
If you are looking for the next version based on Functional Reactive Programming, you can find it here: **[Krestianstvo SDK 4](https://github.com/NikolaySuslov/krestianstvo)** and its **[Playground](https://github.com/NikolaySuslov/krestianstvo-playground)**

![logo](https://krestianstvo.org/docs/assets/webimg.jpg)

## Updates

- [08.2020] All core application components are now ES6 modules
- [10.2019] **Krestianstvo Luminary** working prototype included

### [Changelog](CHANGELOG.md)

## Architecture

**[LiveCoding.space](https://livecoding.space)** architecture moves **[Virtual World Framework](https://github.com/virtual-world-framework/vwf)** architecture towards pure-decentralized application by introducing:

- **single page web application**
- **client-side router** (generating **instances IDs** by client) ([about Page.js](https://visionmedia.github.io/page.js/))
- file storage independent **Reflector**
- **[Krestiasntvo Luminary](https://blog.krestianstvo.org/en/krestianstvo-luminary-for-open-croquet-architecutre-and-virtual-world-framework-in-peer-to-peer-web/)** running on Gun DB (client based replcement for **Reflector** server)
- **GunDB storage system** for serving ```Proxy VWF components```, ```Worlds prototypes```, ```World save states```, ```User Inventories``` ect. in fully decentralized (peer-to-peer or multi-master) DB ([about GunDB](https://gun.eco/docs/Introduction))
- **GunDB SEA** (Security, Encryption, Authorization) framework for user authorization and **P2P identities** ([about SEA](https://gun.eco/docs/Auth))

By default a tiny Reflector server is used for creating a Virtual World instances. But you could try out to connect using the new experimental totaly decentralized solution provided by [**Krestianstvo Luminary**](https://blog.krestianstvo.org/en/krestianstvo-luminary-for-open-croquet-architecutre-and-virtual-world-framework-in-peer-to-peer-web/). That will allow to create Virtual World Instances just within Web Browser by a client,using any avaliable decentralized storage GunDB on internet. **No any Reflector server needed**. In the near future it will be extended with support of securing world instances lists, clients lists, message streams with P2P identities.

alongside with the existed features from the initial version ```v0.1```:

- **Decentralized network model for A-Frame components** and entities based on VWF replicated computation architecture
- **Ohm language driver** for sharing user-defined grammars, parsers, tokenisers inside virtual space
- **In browser Code and Properties editor** based on Cell.js
- **OSC messaging** through OSC relay on the client
- **Avatars** (Simple and GLTF models with animation)
- Multi-window or multi-monitor/multi-machine setups with view **offset cameras**
- **WebRTC** for video/audio streaming, 3D positional audio support
- GearVR, Windows MixedReality motion **controllers** ..

## [Documentation](https://krestianstvo.org/docs/sdk3)

<img src="https://krestianstvo.org/img/003.jpg" width="400">
<br>
<img src="https://krestianstvo.org/img/004.jpg" width="400">
<br>
<img src="https://krestianstvo.org/img/avatar.jpg" width="400">
<br>

## Contributing

All code is published under the MIT license

Copyright (c) 2014-2020 Nikolai Suslov and the Krestianstvo.org project contributors.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

----

A different license may apply to other software included in this package. Please consult their respective license files for the terms of their individual licenses.   
[VWF Apache 2.0 License](https://github.com/NikolaySuslov/livecodingspace/blob/master/licenses/LICENSE_VWF.md)  
[ADL VW Sandbox Apache 2.0 License](https://github.com/NikolaySuslov/livecodingspace/blob/master/licenses/LICENSE_ADL_Sandbox.md)
