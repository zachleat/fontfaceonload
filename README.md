# fontfaceonload

[![Build Status](https://img.shields.io/travis/zachleat/fontfaceonload/master.svg)](https://travis-ci.org/zachleat/fontfaceonload)
[![Dependency Status](https://david-dm.org/zachleat/fontfaceonload.svg)](https://david-dm.org/zachleat/fontfaceonload)
[![devDependency Status](https://david-dm.org/zachleat/fontfaceonload/dev-status.svg)](https://david-dm.org/zachleat/fontfaceonload#info=devDependencies)

## [Demo](http://zachleat.github.io/fontfaceonload/demo/demo.html)

## Usage

Use with any existing `@font-face` declaration.

```css
@font-face {
    font-family: My Custom Font Family;
    /* src and other properties as normal */
}
```

Include the library. Call the JavaScript.

```js
FontFaceOnload("My Custom Font Family", {
    success: function() {},
    error: function() {},
    timeout: 5000 // in ms. Optional, default is 10 seconds
});
```

### Use with Content Fonts

To allow the fallback font to be visible while the `@font-face` is loading, simply use `FontFaceOnload` like so:

```js
FontFaceOnload("My Custom Font Family", {
    success: function() {
        document.documentElement.className += " my-custom-font-family";
    }
});
```

and then use the class to scope your usage of the custom font:

```css
body {
    font-family: sans-serif;
}
.my-custom-font-family body {
    font-family: My Custom Font Family, sans-serif;
}
```

An alternative approach that will also eliminate the FOIT as well as not require you to change your CSS is to use the [`loadCSS` library](https://github.com/filamentgroup/loadCSS#usage-example-with-content-fonts) to load the `@font-face` with a Data URI source block dynamically. `loadCSS` is smaller than `fontfaceonload`. The limitations to this approach include requiring you to manage which format to load (WOFF, WOFF2, TTF) and it will not work as well with icon fonts (since you need to a CSS class to style other sibling elements, like the descriptive text).

### Use with Icon Fonts

To hide the fallback font so that weird fallback characters are not visible while the icon font is loading, use FontFaceOnload with the `glyphs` option like so:

```js
FontFaceOnload("My Custom Font Icon", {
    success: function() {
        document.documentElement.className += " my-custom-font-icon";
    },
    glyphs: "\uE600\uE601\uE602\uE605" // Optional, default is "". Useful for icon fonts: a few code points from your custom font icon.
});
```

and then use the class to scope your usage of the custom font:

```css
.icon {
    display: none;
}
.my-custom-font-family .icon {
    font-family: My Custom Font Icon, sans-serif;
}
```

## How it Works

This uses the [CSS Font Loading Module](http://dev.w3.org/csswg/css-font-loading/) when available (currently in Chrome 35+ and Opera 22+). When that isn’t available, it uses a very similar approach to the one used in the [TypeKit Web Font Loader](https://github.com/typekit/webfontloader) (which is currently 7.1KB GZIP).

Basically, it creates an element with a font stack including the web font and a default serif/sans-serif typeface.  It then uses a test string and measures the dimensions of the element at a certain interval. When the dimensions are different than the default fallback fonts, the font is considered to have loaded successfully.

If you’d like a full polyfill for the CSS Font Loading Module, follow along with [Bram Stein’s Font Loader](https://github.com/bramstein/fontloader). I believe the specification has changed since he launched this polyfill, but he’s working on an updated version.

## Building the project

Run these commands:

 * `npm install`
 * `bower install`
 * `grunt init`
 * `grunt` as normal.

## Configuring Grunt

Rather than one giant `Gruntfile.js`, this project is using a modular Grunt setup. Each individual grunt configuration option key has its own file located in `grunt/config-lib/` (readonly upstream configs, do not modify these directly) or `grunt/config/` (project specific configs). You may use the same key in both directories, the objects are smartly combined using [Lo-Dash merge](http://lodash.com/docs#merge).

For concatenation in the previous Gruntfile setup, you’d add another key to the giant object passed into `grunt.initConfig` like this: `grunt.initConfig({ concat: { /* YOUR CONFIG */ } });`. In the new configuration, you’ll create a `grunt/config/concat.js` with `module.exports = { /* YOUR CONFIG */ };`.

## License

[MIT License](http://en.wikipedia.org/wiki/MIT_License)

## Alternatives

* [Font Face Observer](https://github.com/bramstein/fontfaceobserver) by [@bram_stein](https://twitter.com/bram_stein)
* [Zenfonts](https://github.com/gaborlenard/zenfonts) by [@GaborLenard](https://twitter.com/GaborLenard)
