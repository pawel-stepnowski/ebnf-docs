export class TableOfContents
{
    /**
     * @param {Document} document 
     */
    constructor(document)
    {
        this.document = document;
    }

    /**
     * @param {Element} parent 
     * @param {string[]} selectors
     * @returns 
     */
    generate(parent, [selector, ...tail])
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
                const children = tail && element.parentElement ? this.generate(element.parentElement, tail) : undefined;
                if (children) li.appendChild(children);
                ul.appendChild(li);
            }
            return ul;
        }
    }
    
    generateAndReplace()
    {
        const main = this.document.querySelector('main');
        if (main)
        {
            const table = this.generate(main, ['h2', 'h3', 'h4']);
            const ul = this.document.querySelector('nav > ul');
            if (table && ul)
            {
                ul.replaceWith(table);
                console.log(table.outerHTML);
            }
        }
    }
}