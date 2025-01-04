import * as EBNF from '@liquescens/ebnf';

const grammar_url = 'grammars/wikipedia/pascal-like.ebnf.txt';
const grammar_text = await (await fetch(grammar_url)).text();
const identifier_pattern = `[a-zA-Z][^'"=,|()\\[\\]{}\\-.;]*`;
const patterns = EBNF.Variants.ISO_14977.createLexerPatterns();
patterns.identifier = { pattern: identifier_pattern };
const lexer_configuration = new EBNF.LexerConfiguration('Pascal', patterns);
const lexer = new EBNF.Lexer(grammar_text, lexer_configuration);
const grammar = new EBNF.Parser(lexer).parse();

const current_section = window.page.section(import.meta);
current_section?.append(EBNF.toDom(grammar));