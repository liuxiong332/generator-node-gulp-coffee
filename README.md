<p align="center">
  <img src="node-gulp.png"/>
</p>
# node gulp coffee
[![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url] [![Coverage Status][coveralls-image]][coveralls-url]

> Based on [generator-node-gulp](https://github.com/youngmountain/generator-node-gulp)

This generator creates a new Node.js module, generating all the boilerplate you need to get started with best-of-breed from the gulp ecosystem. The generator also optionally installs additional gulp plugins, see the list below.



## Installation

Install the generator by running: `npm install -g generator-node-gulp-coffee`.

## Options

* `--test-framework=[framework]`

  Defaults to `mocha`. Can be switched to
  another supported testing framework like `jasmine`.

* `--skip-install`

  Skips the automatic execution of `bower` and `npm` after
  scaffolding has finished.

## Features

- Customize the dependencies prompt by editing the ```settings.json``` file [see](#dependencies).
- Prefills prompt with the last used values for
  - GitHub username
  - Author's Name
  - Author's Email
  - Author's Homepage

### devDependencies

- Mocha Unit Testing with [gulp-mocha](https://github.com/sindresorhus/gulp-mocha)
- Automagically lint your code with [gulp-coffeelint](https://github.com/janraasch/gulp-coffeelint)
- Optional – Measuring code coverage with [gulp-istanbul](https://github.com/SBoudrias/gulp-istanbul)
- Optional – Upload LCOV data to [coveralls.io](http://coveralls.io) with [coveralls](https://github.com/cainus/node-coveralls)
- Optional – Bump npm versions with [gulp-bump](https://github.com/stevelacy/gulp-bump)
- Optional - Jasmine Unit Testing with [gulp-jasmine](https://github.com/sindresorhus/gulp-jasmine)

### dependencies

You can customize the dependencies prompt by editing the ```settings.json```. The file is located in the root of the generator-node-gulp ```/usr/local/lib/node_modules/generator-node-gulp-coffee/```.

- [debug](https://github.com/visionmedia/debug)
- [Lo-Dash](http://lodash.com/)
- [q](https://github.com/kriskowal/q)

### settings.json

By default, the file looks something like this.

```
{
  "meta": {
    "githubUsername": "stefanbuck",
    "authorName": "Stefan Buck",
    "authorEmail": "me@stefanbuck.com",
    "authorUrl": "www.stefanbuck.com"
  },
  "dependencies": [
    {
      "name": "lodash",
      "description": "A utility library"
    },
    {
      "name": "q",
      "description": "A library for promises"
    },
    {
      "name": "debug",
      "description": "tiny node.js debugging utility"
    }
  ]
}
```


## Usage

At the command-line, cd into an empty directory, run this command and follow the prompts.

```
yo node-gulp-coffee
```

_Note that this template will generate files in the current directory, so be sure to change to a new directory first if you don't want to overwrite existing files._



## Support

Should you have any problems or wishes for improvements, feel free to open an [issue](https://github.com/liuxiong332/generator-node-gulp-coffee/issues).

## License

[MIT License](http://en.wikipedia.org/wiki/MIT_License)

Logo by [Koji Wakayama](https://github.com/kojiwakayama)

[npm-url]: https://npmjs.org/package/generator-node-gulp-coffee
[npm-image]: https://badge.fury.io/js/generator-node-gulp-coffee.svg
[travis-url]: https://travis-ci.org/liuxiong332/generator-node-gulp-coffee
[travis-image]: https://travis-ci.org/liuxiong332/generator-node-gulp-coffee.svg?branch=master
[daviddm-url]: https://david-dm.org/liuxiong332/generator-node-gulp-coffee
[daviddm-image]: https://david-dm.org/liuxiong332/generator-node-gulp-coffee.svg?theme=shields.io
[coveralls-url]: https://coveralls.io/r/liuxiong332/generator-node-gulp-coffee
[coveralls-image]: https://coveralls.io/repos/liuxiong332/generator-node-gulp-coffee/badge.png
