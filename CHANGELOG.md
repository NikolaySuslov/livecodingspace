# CHANGELOG.md

## 0.7 (master branch)

**BREAKING CHANGES**:

- All core application components are now ES6 modules (including VWF model, view, drivers etc.)

Features:
- Experimental "stream of messages", based on functional reactive streams. That feature allows to record/replay/delay etc. external (reflector/luminary) messages on peers.
- Experimental driver for communication with external hardware over Web Bluetooth and functional reactive streams. Lego Boost demo world example.
- Refactor Virtual Time from VWF and made it as ES6 module.
- "No driver" world example with minimal core.

## 0.5 - 0.6

**BREAKING CHANGES**:
- All VWF components and worlds are described in JSON format.
- No world states anymore. Every saved world is a prototype.

Features:
- From these release, there is no "super" user, who own proxy components. Now every user could own it's own proxy and built the world from corresponding components.
- Finally add support for Oculus Quest/VIVE/Windows MR/Gear VR headsets in all spaces by default.
- Teleportation controls, when using HMD headsets.


## 0.4

Features:

- The last release, that is based on YAML representation of Virtual World Framework components.