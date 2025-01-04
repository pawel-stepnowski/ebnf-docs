import { Aside } from "./Aside.js";
import { Command } from "./Command.js";
import { Prism } from "./Prism.js";
import { Render } from "./Render.js";

/** @type {Record<string, { new(node: ChildNode): Command }>} */
export const commands = 
{
    prism: Prism,
    render: Render,
    aside: Aside
}

export const escapeHtml = (/** @type {string} */ text) => text.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#039;');
