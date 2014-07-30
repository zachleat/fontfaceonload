# fontfaceonload

[![Build Status](https://img.shields.io/travis/zachleat/fontfaceonload/master.svg)](https://travis-ci.org/zachleat/fontfaceonload)
[![Dependency Status](https://david-dm.org/zachleat/fontfaceonload.svg?theme=shields.io)](https://david-dm.org/zachleat/fontfaceonload)
[![devDependency Status](https://david-dm.org/zachleat/fontfaceonload/dev-status.svg?theme=shields.io)](https://david-dm.org/zachleat/fontfaceonload#info=devDependencies)

## Using the repo

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
