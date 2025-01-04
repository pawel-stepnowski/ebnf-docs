import * as fs from "fs";
import { JSDOM } from "jsdom";
import { Command } from "./Command.js";
import { escapeHtml } from "./index.js";

export class Prism extends Command
{
    /**
     * @override
     * @param {string} template 
     * @param {string} part_id 
     */
    async execute(template, part_id)
    {
        const parent = this.parent;
        if (template.endsWith('.js'))
        {
            const code_text = fs.readFileSync(template).toString();
            parent.appendChild(this.createPrismElement(code_text, 'typescript'));
        }
        else if (template.endsWith('.txt'))
        {
            const code_text = fs.readFileSync(template).toString();
            parent.appendChild(this.createPrismElement(escapeHtml(code_text), 'plain'));
        }
        else
        {
            let code_text = '';
            let code_language = 'html';
            const dom = await JSDOM.fromFile(template, {});
            const part = dom.window.document.getElementById(part_id);
            if (!part) { console.warn(`Part "${part_id}" cannot be found in template "${template}".`); return; }
            if (part.tagName === 'TEMPLATE')
            {
                /** @type {DocumentFragment} */
                // @ts-ignore
                const fragment = part.content;
                const language = part.getAttribute('language');
                if (language === 'javascript')
                {
                    code_text = fragment.textContent ?? '';
                    code_language = 'typescript';
                }
                else
                {
                    code_text = escapeHtml('<html>\r\n<head>' + part.innerHTML + '</head>\r\n</html>');
                }
                // const html = document.createDocumentFragment('<html></html>');
                // const head = document.createElement('head');
                // html.appendChild(head);
                // // @ts-ignore
                // head.appendChild(part.content);
            }
            parent.appendChild(this.createPrismElement(code_text, code_language));
        }
    }

    /**
     * @param {string} text
     * @param {string} language
     */
    createPrismElement(text, language)
    {
        const element = this.document.createElement('code');
        text = text.replaceAll('\r', '__entity_13__').replaceAll('\n', '__entity_10__');
        element.innerHTML = text;
        element.classList.add('language-' + language);
        return element;
    }
}