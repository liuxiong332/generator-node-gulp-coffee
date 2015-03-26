'use strict';

var chalk = require('chalk');
var util = require('util');
var path = require('path');
var npmName = require('npm-name');
var npmLatest = require('npm-latest');
var yeoman = require('yeoman-generator');
var yosay = require('yosay');
var Config = require('../config');

module.exports = yeoman.generators.Base.extend({
  initializing: function () {
    this.settings = new Config();
    this.testFramework = this.options['test-framework'] || 'mocha';
  },

  prompting: function () {
    var cb = this.async();
    var log = this.log;

    log(yosay('Hello, and welcome to the node-gulp generator. Let\'s be awesome together!'));

    var prompts = [{
      name: 'name',
      message: 'Module Name',
      default: path.basename(process.cwd()),
      filter: function (input) {
        var done = this.async();

        npmName(input, function (err, available) {
          if (!available) {
            log.info(chalk.yellow(input) + ' already exists on npm. You might want to use another name.');
          }

          done(input);
        });
      }
    }, {
      name: 'description',
      message: 'Description',
      default: 'The best module ever.'
    }, {
      name: 'homepage',
      message: 'Homepage'
    }, {
      name: 'license',
      message: 'License',
      default: 'MIT'
    }, {
      name: 'githubUsername',
      message: 'GitHub username'
    }, {
      name: 'authorName',
      message: 'Author\'s Name'
    }, {
      name: 'authorEmail',
      message: 'Author\'s Email'
    }, {
      name: 'authorUrl',
      message: 'Author\'s Homepage'
    }];

    this.currentYear = new Date().getFullYear();
    this.currentDate = new Date().toISOString().slice(0,10); // YYY-MM-DD

    // Write settings default values back to prompt
    var meta = this.settings.getMeta();
    prompts.forEach(function (val) {
      if (meta[val.name]) {
        val.default = meta[val.name];
      }
    }.bind(this));

    this.prompt(prompts, function (props) {
      this.slugname = this._.slugify(props.name);
      this.safeSlugname = this.slugname.replace(
          /-+([a-zA-Z0-9])/g,
          function (g) {
            return g[1].toUpperCase();
          }
      );

      if (props.homepage) {
        props.homepage = props.homepage.trim();
      }
      if (props.license) {
        props.license = props.license.trim() || 'MIT';
      }
      if (props.authorName) {
        props.authorName = props.authorName.trim();
      }
      if (props.authorEmail) {
        props.authorEmail = props.authorEmail.trim();
      }
      if (props.authorUrl) {
        props.authorUrl = props.authorUrl.trim();
      }

      this.settings.setMeta(props);

      if (props.githubUsername && props.githubUsername.trim()) {
        this.repoUrl = 'https://github.com/' + props.githubUsername + '/' + this.slugname;
      } else {
        this.repoUrl = 'user/repo';
        props.githubUsername = 'user';
      }

      if (!props.homepage) {
        props.homepage = this.repoUrl;
      }

      this.props = props;

      cb();
    }.bind(this));

  },

  askForModules: function () {
    var cb = this.async();

    var prompts = [{
      type: 'checkbox',
      name: 'modules',
      message: 'Which modules would you like to include?',
      choices: [{
          value: 'releaseModule',
          name: 'release (Bump npm versions with Gulp)',
          checked: true
        }, {
          value: 'istanbulModule',
          name: 'istanbul (JS code coverage tool)',
          checked: true
        }
      ]
    }];

    this.prompt(prompts, function (props) {

      var hasMod = function (mod) {
        return props.modules.indexOf(mod) !== -1;
      };

      this.releaseModule = hasMod('releaseModule');
      this.istanbulModule = hasMod('istanbulModule');
      this.coverallsModule = true;

      if (this.istanbulModule) {

        var promptCoveralls = [{
          type: 'confirm',
          name: 'coverallsModule',
          message: 'Would you like add coveralls',
          default: true
        }];

        this.prompt(promptCoveralls, function (props) {
          if (props && props.coverallsModule) {
            this.coverallsModule = props.coverallsModule;
          } else {
            this.coverallsModule = false;
          }
          cb();

        }.bind(this));

      } else {
        cb();
      }

    }.bind(this));

  },

  askForDependencies: function () {
    var cb = this.async();

    var prompts = [{
      type: 'checkbox',
      name: 'dependencies',
      message: 'Which dependencies would you like to include?',
      choices: []
    }];

    var dependencies = this.settings.getDependencies();
    dependencies.forEach(function (pkg) {
      prompts[0].choices.push({
        value: pkg.name,
        name: util.format('%s (%s)', pkg.name, pkg.description),
        checked: true
      });
    });

    this.prompt(prompts, function (props) {

      var hasMod = function (mod) {
        return props.dependencies.indexOf(mod) !== -1;
      };

      this.usedDependencies = {};
      dependencies.forEach(function (dep) {
        if (hasMod(dep.name)) {
          this.usedDependencies[dep.name] = 'latest';
        }
      }.bind(this));

      cb();

    }.bind(this));

  },

  getLatestVersions: function () {
    var cb = this.async();
    var count = Object.keys(this.usedDependencies).length;

    if (count === 0) {
      return cb();
    }

    for (var packageName in this.usedDependencies) {
      npmLatest(packageName, {timeout: 1900}, function (err, result) {
        if (!err && result.name && result.version) {
          this.usedDependencies[result.name] = result.version;
        }
        if (!--count) {
          cb();
        }
      }.bind(this));
    }
  },

  dependency: function dependency() {
    this.dependencies = '';
    for (var name in this.usedDependencies) {
      var version = this.usedDependencies[name];
      this.dependencies += util.format('\n    "%s": "%s",', name, version);
    }
    if (this.dependencies.length > 0) {
      this.dependencies = this.dependencies.replace(/\s+/, '');
      this.dependencies = this.dependencies.substring(0, this.dependencies.length - 1);
    }
  },

  copyfiles: function () {
    this.copy('_coffeelint.json', 'coffeelint.json');
    this.copy('_gitignore', '.gitignore');
    this.copy('_travis.yml', '.travis.yml');
    this.copy('editorconfig', '.editorconfig');

    this.template('_README.md', 'README.md');
    this.template('_CHANGELOG.md', 'CHANGELOG.md');
    this.template('_gulpfile.js', 'gulpfile.js');
    this.template('_package.json', 'package.json');
  },

  writing: function () {
    this.mkdir('lib');
    this.template('lib/name.coffee', 'lib/' + this.slugname + '.coffee');

    this.mkdir('spec');
    this.template('spec/name-spec.coffee', 'spec/' + this.slugname + '-spec.coffee');
  },

  install: function () {
    this.installDependencies({
      bower: false,
      skipInstall: this.options['skip-install']
    });
  }
});
