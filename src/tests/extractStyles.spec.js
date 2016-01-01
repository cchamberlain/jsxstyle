var extractStyles = require('../lib/extractStyles');
var fs = require('fs');
var path = require('path');

var EXAMPLE_SRC = fs.readFileSync(path.join(__dirname, 'example.js'), {encoding: 'utf8'});

describe('extractStyles', function() {
  it('can extract constant styles', function() {
    var rv = extractStyles(EXAMPLE_SRC);
    //console.log('EXTRACT1', JSON.stringify(rv))
    console.dir(JSON.stringify(rv))
    expect(JSON.stringify(rv)).toEqual(`{"js":"\"use strict\";\r\n\r\nvar React = require('react');\r\nReact.createElement(\r\n  Block,\r\n  { width: \"100%\", height: 25, left: 2 * LayoutConstants.x },\r\n  React.createElement(InlineBlock, { height: 24 }),\r\n  React.createElement(\"div\", { style: { width: 10 } }),\r\n  React.createElement(OtherComponent, { height: 25 })\r\n);","css":""}`)
  })

  it('can extract simple expressions', function() {
    var rv = extractStyles(EXAMPLE_SRC, {LayoutConstants: {x: 10}});
    //console.log('EXTRACT2', JSON.stringify(rv))
    console.dir(JSON.stringify(rv))
    expect(JSON.stringify(rv)).toEqual(`{"js":"\"use strict\";\r\n\r\nvar React = require('react');\r\nReact.createElement(\r\n  Block,\r\n  { width: \"100%\", height: 25, left: 2 * LayoutConstants.x },\r\n  React.createElement(InlineBlock, { height: 24 }),\r\n  React.createElement(\"div\", { style: { width: 10 } }),\r\n  React.createElement(OtherComponent, { height: 25 })\r\n);","css":""}`)
    /*
    expect(rv).toEqual({
      js: `var React = require('react');\n<div className=\"__s_0\">\n  <div className=\"__s_1\" />\n  <div style={{width: 10}} />\n  <OtherComponent height={25} />\n</div>\n`,
      css: `.__s_0 {\n  width:100%;\n  height:25px;\n  left:20px;\n  display:block;\n}\n\n.__s_1 {\n  height:24px;\n  display:inline-block;\n}\n\n`
    })
  */
  })

  it('can create nice looking css', function() {
    var rv = extractStyles(EXAMPLE_SRC, {LayoutConstants: {x: 10}}, function(entry) {
      var node = entry.node;
      return {
        className: 'example_line' + node.loc.start.line,
        comment: 'example.js:' + node.loc.start.line,
      }
    })
    console.dir(JSON.stringify(rv))
    //console.log('EXTRACT3', JSON.stringify(rv))
    expect(JSON.stringify(rv)).toEqual(`{"js":"\"use strict\";\r\n\r\nvar React = require('react');\r\nReact.createElement(\r\n  Block,\r\n  { width: \"100%\", height: 25, left: 2 * LayoutConstants.x },\r\n  React.createElement(InlineBlock, { height: 24 }),\r\n  React.createElement(\"div\", { style: { width: 10 } }),\r\n  React.createElement(OtherComponent, { height: 25 })\r\n);","css":""}`)
    //expect(rv).toEqual({
    //  js: "var React = require('react');\n<div className=\"example_line2\">\n  <div className=\"example_line3\" />\n  <div style={{width: 10}} />\n  <OtherComponent height={25} />\n</div>\n",
    //  css: ".example_line2 {\n  /* example.js:2 */\n  width:100%;\n  height:25px;\n  left:20px;\n  display:block;\n}\n\n.example_line3 {\n  /* example.js:3 */\n  height:24px;\n  display:inline-block;\n}\n\n"
    //});
  });
});
