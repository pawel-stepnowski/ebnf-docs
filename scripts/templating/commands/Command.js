export class Command
{
    /**
     * @param {ChildNode} node 
     */
    constructor(node)
    {
        this.node = node;
        this.document = this.node.ownerDocument;
        if (!this.document) throw new Error('Command node has is not a part of a document.');
    }

    get parent()
    {
        const parent = this.node.parentElement; 
        if (!parent) throw new Error('Command node has no parent.');
        return parent;
    }

    /**
     * @param {string[]} args 
     */
    async execute(...args)
    {
        // const command_name = match.groups?.name; if (!command_name) { console.error('TODO'); return; }
        // const arguments_text = match.groups?.arguments; if (!arguments_text) { console.error('TODO'); return; }
    }
}