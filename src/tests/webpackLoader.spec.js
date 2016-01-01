
require('jasmine-pit').install(global);

var Promise = require('bluebird');

var fs = require('fs')
var invariant = require('invariant')
var path = require('path')
var jsdom = require('jsdom')
var webpack = require('webpack')

describe('webpackLoader', () => {
  pit('works', () => {
    return new Promise((resolve, reject) => {
      var bundlePath = path.join(__dirname, 'bundle.js');
      try {
        fs.unlinkSync(bundlePath);
      } catch (e) {}
      let compiler = webpack({
        entry: path.join(__dirname, 'example.js'),
        output: {
          filename: bundlePath,
        },
        module: {
          loaders: [
            {test: /\.js$/, loader: 'jsx-loader?harmony!' + path.join(__dirname, '..', 'lib', 'webpackLoader.js') + '?LayoutConstants=' + path.join(__dirname, 'webpackLoaderNamespace.js')},
          ],
        },
      })


      compiler.run((err, stats) => {
        let jsonStats = stats.toJson()
        invariant(jsonStats.errors.length === 0, stats.toString())

        jsdom.env('<p><a class="the-link" href="https://github.com/tmpvar/jsdom">jsdom!</a></p>', (err, window) => {
          if(err)
            return reject(err)
          var src = fs.readFileSync(bundlePath, {encoding: 'utf8'})
          var thrown = null;
          try {
            window.eval(src);
          } catch (e) {
            thrown = e;
          }
          expect(thrown && thrown.toString()).toBe('ReferenceError: OtherComponent is not defined')
          expect(window.document.head.innerHTML.indexOf('example.js')).toBeGreaterThan(-1);
          resolve()
        })
      })

    })
  })
})
