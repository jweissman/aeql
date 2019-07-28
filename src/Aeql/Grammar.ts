import ohm, { Grammar } from 'ohm-js';
import isNode from 'detect-node';

let grammar;
if (isNode) {
  var fs = require('fs');
  var contents = fs.readFileSync('./src/Aeql/Aeql.ohm');
  grammar = ohm.grammar(contents);
} else {
  grammar = ohm.grammarFromScriptElement();
}
let g: Grammar = grammar;

export default g;