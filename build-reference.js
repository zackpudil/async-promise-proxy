
/*
	This is the build reference file.  Used by the node-uglifier to include es6 transpiler dependencies into the moonbase-api.js output.
*/

// hack so users don't have to require('babel/register') to use the moonbase-api module
require('./node_modules/babel/node_modules/babel-core/node_modules/regenerator/runtime');

// hack so users don't have to require('harmonize')(['harmony-proxies']) to use the moonbase-api moduel
var fn = require('./node_modules/harmonize/harmonize.js');
fn(['harmony-proxies']);

module.exports = require('./dist/index.js');