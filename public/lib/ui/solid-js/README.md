## <img src="https://raw.githubusercontent.com/solidjs/solid/main/assets/logo.png" alt="Solid" width="350"/><br>

[![Build Status](https://github.com/solidjs/solid/workflows/Solid%20CI/badge.svg)](https://github.com/solidjs/solid/actions/workflows/main-ci.yml)
[![Coverage Status](https://img.shields.io/coveralls/github/solidjs/solid.svg?style=flat)](https://coveralls.io/github/solidjs/solid?branch=main)
[![NPM Version](https://img.shields.io/npm/v/solid-js.svg?style=flat)](https://www.npmjs.com/package/solid-js)
[![](https://img.shields.io/npm/dm/solid-js.svg?style=flat)](https://www.npmjs.com/package/solid-js)
[![Discord](https://img.shields.io/discord/722131463138705510)](https://discord.com/invite/solidjs)
[![Subreddit subscribers](https://img.shields.io/reddit/subreddit-subscribers/solidjs?style=social)](https://www.reddit.com/r/solidjs/)

Solid is a declarative JavaScript library for creating user interfaces. It does not use a Virtual DOM. Instead it opts to compile its templates down to real DOM nodes and wrap updates in fine grained reactions. This way when your state updates only the code that depends on it runs.

### Key Features

- Real DOM with fine-grained updates (<b>No Virtual DOM! No Dirty Checking Digest Loop!</b>).
- Declarative data
  - Simple composable primitives without the hidden rules.
  - Function Components with no need for lifecycle methods or specialized configuration objects.
  - Render once mental model.
- Fast! Almost indistinguishable performance vs optimized painfully imperative vanilla DOM code. See Solid on [JS Framework Benchmark](https://github.com/krausest/js-framework-benchmark).
- Small! Completely tree-shakeable Solid's compiler will only include parts of the library you use.
- Supports and is built on TypeScript.
- Supports modern features like JSX, Fragments, Context, Portals, Suspense, Streaming SSR, Progressive Hydration, Error Boundaries and Concurrent Rendering.
- Works in serverless environments including AWS Lambda and Cloudflare Workers.
- Webcomponent friendly and can author Custom Elements
  - Context API that spans Custom Elements
  - Implicit event delegation with Shadow DOM Retargeting
  - Shadow DOM Portals
- Transparent debugging: a `<div>` is just a div.

[Top 5 Things You Should Know about Solid](https://dev.to/ryansolid/introducing-the-solidjs-ui-library-4mck)

## The Gist

```jsx
import { render } from "solid-js/web";

const HelloMessage = props => <div>Hello {props.name}</div>;

render(() => <HelloMessage name="Taylor" />, document.getElementById("hello-example"));
```

A Simple Component is just a function that accepts properties. Solid uses a `render` function to create the reactive mount point of your application.

The JSX is then compiled down to efficient real DOM expressions:

```js
import { render, template, insert, createComponent } from "solid-js/web";

const _tmpl$ = template(`<div>Hello </div>`);

const HelloMessage = props => {
  const _el$ = _tmpl$.cloneNode(true);
  insert(_el$, () => props.name);
  return _el$;
};

render(
  () => createComponent(HelloMessage, { name: "Taylor" }),
  document.getElementById("hello-example")
);
```

That `_el$` is a real div element and `props.name`, `Taylor` in this case, is appended to its child nodes. Notice that `props.name` is wrapped in a function. That is because that is the only part of this component that will ever execute again. Even if a name is updated from the outside only that one expression will be re-evaluated. The compiler optimizes initial render and the runtime optimizes updates. It's the best of both worlds.

Want to see what code Solid generates:

### [Try it Online](https://playground.solidjs.com/)

## Quick Start

> _`npm init solid <project-type> <project-name>` is available with npm 6+._

You can get started with a simple app with the CLI with by running:

```sh
> npm init solid app my-app
```

Or for a TypeScript starter:

```sh
> npm init solid app-ts my-app
```

Or you can install the dependencies in your own project. To use Solid with JSX (recommended) run:

```sh
> npm install solid-js babel-preset-solid
```

The easiest way to get setup is add `babel-preset-solid` to your .babelrc, or babel config for webpack, or rollup:

```js
"presets": ["solid"]
```

For TypeScript remember to set your TSConfig to handle Solid's JSX by:

```js
"compilerOptions": {
  "jsx": "preserve",
  "jsxImportSource": "solid-js",
}
```

## Documentation

> This is the documentation for the 1.0.0 RC. THese are significantly slimmed down from what was here previously as we are moving things to the new Docs site. If you wish to see the older docs in the mean time [look here](https://github.com/solidjs/solid/tree/0.x/#documentation).

- [API](https://github.com/solidjs/solid/blob/main/documentation/api.md)
- [FAQ](https://github.com/solidjs/solid/blob/main/documentation/faq.md)
- [Comparison with other Libraries](https://github.com/solidjs/solid/blob/main/documentation/comparison.md)

### Guides
- [Getting Started](https://github.com/solidjs/solid/blob/main/documentation/guides/getting-started.md)
- [Reactivity](https://github.com/solidjs/solid/blob/main/documentation/guides/reactivity.md)
- [Rendering](https://github.com/solidjs/solid/blob/main/documentation/guides/rendering.md)
- [SSR](https://github.com/solidjs/solid/blob/main/documentation/guides/server.md)

### Resources

- [Examples](https://github.com/solidjs/solid/blob/main/documentation/resources/examples.md)
- [Articles](https://github.com/solidjs/solid/blob/main/documentation/resources/articles.md)
- [Projects](https://github.com/solidjs/solid/blob/main/documentation/resources/projects.md)

## Browser Support

The last 2 versions of modern evergreen browsers and Node LTS.

<img src="https://saucelabs.github.io/images/opensauce/powered-by-saucelabs-badge-gray.svg?sanitize=true" alt="Testing Powered By SauceLabs" width="300"/>

## Community

Come chat with us on [Discord](https://discord.com/invite/solidjs)

### Contributors

<a href="https://github.com/solidjs/solid/graphs/contributors"><img src="https://opencollective.com/solid/contributors.svg?width=890&amp;button=false" style="max-width:100%;"></a>

### Open Collective

Support us with a donation and help us continue our activities. [[Contribute](https://opencollective.com/solid)]

<a href="https://opencollective.com/solid/backer/0/website" target="_blank"><img src="https://opencollective.com/solid/backer/0/avatar.svg"></a>
<a href="https://opencollective.com/solid/backer/1/website" target="_blank"><img src="https://opencollective.com/solid/backer/1/avatar.svg"></a>
<a href="https://opencollective.com/solid/backer/2/website" target="_blank"><img src="https://opencollective.com/solid/backer/2/avatar.svg"></a>
<a href="https://opencollective.com/solid/backer/3/website" target="_blank"><img src="https://opencollective.com/solid/backer/3/avatar.svg"></a>
<a href="https://opencollective.com/solid/backer/4/website" target="_blank"><img src="https://opencollective.com/solid/backer/4/avatar.svg"></a>
<a href="https://opencollective.com/solid/backer/5/website" target="_blank"><img src="https://opencollective.com/solid/backer/5/avatar.svg"></a>
<a href="https://opencollective.com/solid/backer/6/website" target="_blank"><img src="https://opencollective.com/solid/backer/6/avatar.svg"></a>
<a href="https://opencollective.com/solid/backer/7/website" target="_blank"><img src="https://opencollective.com/solid/backer/7/avatar.svg"></a>
<a href="https://opencollective.com/solid/backer/8/website" target="_blank"><img src="https://opencollective.com/solid/backer/8/avatar.svg"></a>
<a href="https://opencollective.com/solid/backer/9/website" target="_blank"><img src="https://opencollective.com/solid/backer/9/avatar.svg"></a>
<a href="https://opencollective.com/solid/backer/10/website" target="_blank"><img src="https://opencollective.com/solid/backer/10/avatar.svg"></a>

### Sponsors

Become a sponsor and get your logo on our README on GitHub with a link to your site. [[Become a sponsor](https://opencollective.com/solid#sponsor)]

<a href="https://opencollective.com/solid/sponsor/0/website" target="_blank"><img src="https://opencollective.com/solid/sponsor/0/avatar.svg"></a>
<a href="https://opencollective.com/solid/sponsor/1/website" target="_blank"><img src="https://opencollective.com/solid/sponsor/1/avatar.svg"></a>
<a href="https://opencollective.com/solid/sponsor/2/website" target="_blank"><img src="https://opencollective.com/solid/sponsor/2/avatar.svg"></a>
<a href="https://opencollective.com/solid/sponsor/3/website" target="_blank"><img src="https://opencollective.com/solid/sponsor/3/avatar.svg"></a>
<a href="https://opencollective.com/solid/sponsor/4/website" target="_blank"><img src="https://opencollective.com/solid/sponsor/4/avatar.svg"></a>
<a href="https://opencollective.com/solid/sponsor/5/website" target="_blank"><img src="https://opencollective.com/solid/sponsor/5/avatar.svg"></a>
<a href="https://opencollective.com/solid/sponsor/6/website" target="_blank"><img src="https://opencollective.com/solid/sponsor/6/avatar.svg"></a>
<a href="https://opencollective.com/solid/sponsor/7/website" target="_blank"><img src="https://opencollective.com/solid/sponsor/7/avatar.svg"></a>
<a href="https://opencollective.com/solid/sponsor/8/website" target="_blank"><img src="https://opencollective.com/solid/sponsor/8/avatar.svg"></a>
<a href="https://opencollective.com/solid/sponsor/9/website" target="_blank"><img src="https://opencollective.com/solid/sponsor/9/avatar.svg"></a>
<a href="https://opencollective.com/solid/sponsor/10/website" target="_blank"><img src="https://opencollective.com/solid/sponsor/10/avatar.svg"></a>
