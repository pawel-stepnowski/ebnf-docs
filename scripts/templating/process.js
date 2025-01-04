import * as fs from "fs";
import { JSDOM } from "jsdom";
import path from "path";
import { exit } from "process";
import { commands } from "./commands/index.js";

const template_file_path = process.argv[2];
if (!template_file_path.endsWith('.template.html')) { console.error('TODO'); exit(); }
const output_file_path = template_file_path
    .replace('.template.html', '.html')
    .replace(path.sep + 'src' + path.sep, path.sep + 'public' + path.sep)

const dom_options = {};
const dom = await JSDOM.fromFile(template_file_path, dom_options);
const document = dom.window.document;
const command_pattern = /^\s*@(?<name>[a-zA-Z]+)\((?<arguments>.*)\)\s*$/;
const comments = document.createNodeIterator(document.body, dom.window.NodeFilter.SHOW_COMMENT, () => dom.window.NodeFilter.FILTER_ACCEPT);

while (true)
{
    const comment = comments.nextNode();
    if (!comment) break;
    await processCommand(comment);
}

let output_content = dom.serialize();
output_content = output_content.replaceAll('__entity_13__', '&#13;');
output_content = output_content.replaceAll('__entity_10__', '&#10;');
fs.writeFileSync(output_file_path, output_content);

/**
 * @param {Node} command_node
 */
async function processCommand(command_node)
{
    const text = command_node.nodeValue; if (!text) return;
    const match = text.match(command_pattern); if (!match) return;
    const parent = command_node.parentElement; if (!parent) { console.error('TODO'); return; }
    const command_name = match.groups?.name; if (!command_name) { console.error('TODO'); return; }
    const arguments_text = match.groups?.arguments; if (typeof arguments_text !== 'string') { console.error('TODO'); return; }
    const command_class = commands[command_name]; if (!command_class) { console.error(`Command "${command_name}" not found.`); return; }
    const command = new command_class(command_node);
    const command_arguments = arguments_text.split(',').map(argument => argument.trim());
    await command.execute(...command_arguments);
    // if (command_result)
    // {
    //     const { element, script: script_url } = command_result;
    //     if (element) parent.appendChild(element);
    //     if (script_url)
    //     {
    //         // const current_section = new DocumentationExampleHTMLElement(document.currentScript.previousElementSibling); 
    //         // window['documentation'] = { current_section };
    //         // const dom = new JSDOM(`<html>
    //         //     <script type="module">
    //         //         const current_section = 'new DocumentationExampleHTMLElement(document.currentScript.previousElementSibling)';
    //         //         window['documentation'] = { current_section };
    //         //     </script>
    //         //     </html>`, { runScripts: "dangerously" }); // <script type="module" src="./${script}"></script>
    //         //     // dom.window.eval(` window['documentation'] = "abc"; `);
    //         // console.log(script);
    //         // import(script);
    //         // console.log(dom.window['documentation']);
    //         const parent_parent = parent.parentElement;
    //         if (parent_parent)
    //         {
    //             const text = parent_parent.previousSibling?.cloneNode(false); // TODO
    //             const script = document.createElement('script');
    //             script.type = 'module';
    //             script.src = './' + script_url;
    //             console.log(script.outerHTML);
    //             parent_parent.after(script);
    //             parent_parent.after(text);
    //         }
            
    //         // <script>import("./examples/basic-usage-render.js?section=abc")</script>
    //         // parent.parentElement?.appendChild(script);
    //         // const parent = command_node.parentElement; if (!parent) { console.error('TODO'); return; }
    //     }
    // }
}
