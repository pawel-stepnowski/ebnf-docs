import { Command } from "./Command.js";

export class Render extends Command
{
    static last_id = 0;

    /**
     * @override
     * @param {string} path 
     */
    async execute(path)
    {
        if (path.endsWith('.js'))
        {
            const parent = this.parent;
            const id = `output_${Render.last_id}`;
            const script = this.document.createElement('script');
            script.type = 'module';
            script.src = `${path}?section=${id}`;
            script.id = id;
            parent.appendChild(script);
            Render.last_id++;
        }
    }
}