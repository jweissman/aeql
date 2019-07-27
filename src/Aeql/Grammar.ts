import ohm, { Grammar } from 'ohm-js';
import isNode from 'detect-node';

let grammar;
if (isNode) {
  console.warn("Loading Aeql grammar from filesystem...");
  var fs = require('fs');
  var contents = fs.readFileSync('./src/Aeql/Aeql.ohm');
  grammar = ohm.grammar(contents);
} else {
  grammar = ohm.grammarFromScriptElement();
}
let g: Grammar = grammar;

export default g;