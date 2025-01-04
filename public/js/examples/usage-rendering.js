import * as EBNF from '@liquescens/ebnf';

const grammar_text = `(* example *)
digit = "0" | "1" | ? another digit symbol ?;
number = digit, { digit };
sum = number, "+", number;
mul = sum, "*", sum;`;
const grammar = EBNF.parse(grammar_text);

const grammar_as_dom = EBNF.toDom(grammar);
const grammar_as_text = grammar.toString();

// This code is responsible for rendering 
// the example in real time on the documentation page.
const current_section = window.page.section(import.meta);
current_section?.append(grammar_as_dom);
current_section?.appendPreformattedText(grammar_as_text);