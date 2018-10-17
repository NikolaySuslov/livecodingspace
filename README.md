# LiveCoding.space

> Collaborative Live Coding Space with support of user-defined languages and **WebVR** ready 3D graphics
Based on: **Virtual World Framework** | **A-Frame** | **Ohm language** | **OSC.js** | **Cell.js** | **GunDB** and more...

> Online at: **[https://livecoding.space](https://livecoding.space)**

![logo](https://krestianstvo.org/books/doc/sdk3/_images/webimg.jpg)

## Architecture

**[LiveCoding.space](https://livecoding.space)** ```v0.2``` architecture moves **[Virtual World Framework](https://github.com/virtual-world-framework/vwf)** architecture towards pure-decentralized application by introducing:

- **single page web application**
- **client-side router** (generating **instances IDs** by client) ([about Page.js](https://visionmedia.github.io/page.js/))
- file storage independent **Reflector**
- **GunDB storage system** for serving ```Proxy VWF components```, ```Worlds prototypes```, ```World save states```, ```User Inventories``` ect. in fully decentralized (peer-to-peer or multi-master) DB ([about GunDB](https://gun.eco/docs/Introduction))
- **GunDB SEA** (Security, Encryption, Authorization) framework for user authorization and **P2P identities** ([about SEA](https://gun.eco/docs/Auth))

alongside with the existed features from the initial version ```v0.1```:

- **Decentralized network model for A-Frame components** and entities based on VWF replicated computation architecture
- **Ohm language driver** for sharing user-defined grammars, parsers, tokenisers inside virtual space
- **In browser Code and Properties editor** based on Cell.js
- **OSC messaging** through OSC relay on the client
- **Avatars** (Simple and GLTF models with animation)
- Multi-window or multi-monitor/multi-machine setups with view **offset cameras**
- **WebRTC** for video/audio streaming, 3D positional audio support
- GearVR, Windows MixedReality motion **controllers** ..

## [Documentation](https://krestianstvo.org/books/doc/sdk3)

<img src="https://krestianstvo.org/lib/images/doc/images/codeeditor.jpg" width="400">
<br>
<img src="https://krestianstvo.org/lib/images/doc/images/osc.jpg" width="400">
<br>
<img src="https://krestianstvo.org/lib/images/doc/images/avatar.jpg" width="400">
<br>

## Contributing

All code is published under the [MIT license](https://github.com/NikolaySuslov/livecodingspace/blob/master/LICENSE.md)

A different license may apply to other software included in this package. Please consult their respective license files for the terms of their individual licenses   
[VWF Apache License](https://github.com/NikolaySuslov/livecodingspace/blob/master/VWF_LICENSE.md)