class SceneBuilder extends EventEmitter
{
    constructor({canvas})
    {
        super();
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        window.addEventListener('resize', () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        });
    }

    startLoop()
    {
        const self = this;
        function createCallback()
        {
            self.clear();
            self.emit('drawScene');
            requestAnimationFrame(createCallback);
        }
        createCallback();
    }

    clear()
    {
        this.ctx.fillStyle = '#fff';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    drawLines(lines)
    {
        this.ctx.beginPath();
        for (const i of lines)
        {
            this.ctx.moveTo(i.x1, i.y1);
            this.ctx.lineTo(i.x2, i.y2);
        }
        this.ctx.stroke();
    }

    drawImage(image, x, y, width, height)
    {
        this.ctx.drawImage(image, x, y, width, height);
    }

    drawText(text, x, y)
    {
        this.ctx.fillStyle = '#000';
        this.ctx.font = '36px arial';
        this.ctx.fillText(text, x, y);
    }
}