import * as fs from "fs";
import path from 'path';
import { JSDOM } from "jsdom";
import { Command } from "./Command.js";

// @ts-ignore
const path_script = import.meta.dirname;
const template = await JSDOM.fromFile(path.join(path_script, 'Aside.template.html'), {});

export class Aside extends Command
{
    /**
     * @override
     */
    async execute()
    {
        const parent = this.parent;
        /** @type {HTMLTemplateElement | null} */
        // @ts-ignore
        const aside_template = template.window.document.getElementById('aside');
        if (aside_template?.tagName === 'TEMPLATE')
        {
            const aside_clone = aside_template.content.cloneNode(true);
            const aside = this.document.importNode(aside_clone, true);
            this.node.after(aside);
            const main = this.document.querySelector('main');
            if (main)
            {
                const table = this.generateToC(main, ['h2', 'h3', 'h4']);
                const nav = this.document.querySelector('aside > nav');
                if (table && nav) nav.appendChild(table);
            }
        }
    }
    
    /**
     * @param {Element} parent 
     * @param {string[]} selectors
     * @returns 
     */
    generateToC(parent, [selector, ...tail])
    {
        const selection = parent.querySelectorAll(selector);
        if (selection.length > 0)
        {
            const ul = this.document.createElement('ul');
            for (const element of selection)
            {
                const li = this.document.createElement('li');
                const label = element.parentElement?.id ? Object.assign(this.document.createElement('a'), { href: '#' + element.parentElement?.id }) : this.document.createElement('span');
                label.textContent = element.textContent;
                li.appendChild(label);
                const children = tail && element.parentElement ? this.generateToC(element.parentElement, tail) : undefined;
                if (children) li.appendChild(children);
                ul.appendChild(li);
            }
            return ul;
        }
    }
}