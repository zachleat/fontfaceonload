# GRUNTLERPLATE

<!--

[![Build Status](https://img.shields.io/travis/zachleat/GRUNTLERPLATE/master.svg)](https://travis-ci.org/zachleat/GRUNTLERPLATE)
[![Dependency Status](https://david-dm.org/zachleat/GRUNTLERPLATE.svg?theme=shields.io)](https://david-dm.org/zachleat/GRUNTLERPLATE)
[![devDependency Status](https://david-dm.org/zachleat/GRUNTLERPLATE/dev-status.svg?theme=shields.io)](https://david-dm.org/zachleat/GRUNTLERPLATE#info=devDependencies)

-->

## Using the repo

Run these commands:

 * `npm install`
 * `bower install`
 * `grunt init`
 * `grunt` as normal.

Replace instances of GRUNTLERPLATE with your project name.

You’ll probably want to start by creating a few JS (and/or CSS) source files to `src/` and adding them to grunt via `grunt/config/concat.js`.

Run `grunt` as normal.

## Configuring Grunt

Rather than one giant `Gruntfile.js`, this project is using a modular Grunt setup. Each individual grunt configuration option key has its own file located in `grunt/config-lib/` (readonly upstream configs, do not modify these directly) or `grunt/config/` (project specific configs). You may use the same key in both directories, the objects are smartly combined using [Lo-Dash merge](http://lodash.com/docs#merge).

For concatenation in the previous Gruntfile setup, you’d add another key to the giant object passed into `grunt.initConfig` like this: `grunt.initConfig({ concat: { /* YOUR CONFIG */ } });`. In the new configuration, you’ll create a `grunt/config/concat.js` with `module.exports = { /* YOUR CONFIG */ };`.

## License

[MIT License](http://en.wikipedia.org/wiki/MIT_License)

## TODO

 * Make a yeoman generator to replace GRUNTLERPLATE with the project name.

## Inspiration From

 * [More maintainable Gruntfiles](http://www.thomasboyt.com/2013/09/01/maintainable-grunt.html) by [@thomasboyt](https://github.com/thomasboyt/)


