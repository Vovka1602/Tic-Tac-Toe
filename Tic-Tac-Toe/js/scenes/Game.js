const cell_size = 120;
const cell_empty = 0;
const cell_x = 1;
const cell_o = 2;
const cell_tie = 3;
const filename_x = 'images/icon_x.png';
const filename_o = 'images/icon_o.png';
const filename_empty = 'images/icon_empty.png';
const server_url = 'http://localhost:8090';

class Game extends Main
{
    cells = [
        [cell_empty, cell_empty, cell_empty],
        [cell_empty, cell_empty, cell_empty],
        [cell_empty, cell_empty, cell_empty],
    ];

    gameId = null;
    turn_key = null;
    is_active = true;
    won_side = null;
    reset = 0;

    stats = {
        'x': 0,
        'o': 0,
        't': 0
    } 
    
    constructor({SceneBuilder, ResourceManager})
    {
        super();
        this.builder = SceneBuilder;
        this.resource_manager = ResourceManager;
    }

    async loading()
    {
        await this.resource_manager.loadImages([
            filename_o,
            filename_x,
            filename_empty
        ]);

        const url = new URL(window.location);
        let server_url = 'http://localhost:8090';
        if (url.searchParams.has('gameId'))
        {
            server_url += `/?gameId=${url.searchParams.get('gameId')}`;
        }

        const source = new EventSource(server_url);       
        source.onmessage = ({lastEventId, data}) => {
          console.info(JSON.parse(data));
            if (!this.gameId)
            {
                url.searchParams.set('gameId', lastEventId);
                window.history.pushState({gameId: lastEventId}, '', url)
            }
            this.gameId = lastEventId;
            const {cells, is_active, turn_key, won_side, stats} = JSON.parse(data);
            this.cells = cells;
            this.is_active = is_active;
            this.turn_key = turn_key;
            this.won_side = won_side;
            this.stats = stats;
            this.updateStats();
        }

        source.addEventListener('turn_key', ({data}) => {
            this.turn_key = data;
        })
    }

    drawScene()
    {        
        this.builder.drawLines([
            {x1: cell_size, y1: 0, x2: cell_size, y2: cell_size * 3},
            {x1: cell_size * 2, y1: 0, x2: cell_size * 2, y2: cell_size * 3},
            {x1: 0, y1: cell_size, x2: cell_size * 3, y2: cell_size},
            {x1: 0, y1: cell_size * 2, x2: cell_size * 3, y2: cell_size * 2}
        ]);

        for(const row_index in this.cells)
        {
            const row = this.cells[row_index];
            for(const cell_index in row)
            {
                const cell = row[cell_index];
                if(cell === cell_empty)
                {
                    continue;
                }
                if(cell === cell_x)
                {
                    this.builder.drawImage(this.resource_manager.getImage(filename_x), cell_index * cell_size + 30, row_index * cell_size + 30, cell_size - 60, cell_size - 60);
                }
                else
                {
                    this.builder.drawImage(this.resource_manager.getImage(filename_o), cell_index * cell_size + 30, row_index * cell_size + 30, cell_size - 60, cell_size - 60);
                }
            }
        }
        if (this.won_side)
        {
            let gameover_message = (this.turn_key) ? 'Ви починаєте нову гру' : 'Суперник починає нову гру';
            switch (this.won_side)
            {
                case cell_x: gameover_message = 'Виграли хрестики. Нулики починають нову гру'; break;
                case cell_o: gameover_message = 'Виграли нулики. Хрестики починають нову гру'; break;
                case cell_tie: gameover_message = (this.turn_key) ? 'Нічия. Ви починаєте нову гру' : 'Нічия. Суперник починає нову гру'; break;
            }
            this.builder.drawText(gameover_message, 20, cell_size * 3 + 50);
        }
        else
        {
            this.builder.drawText((this.turn_key) ? 'Ваша черга' : 'Черга суперника, зачекайте...', 20, cell_size * 3 + 50);
        }
    }
    click({ x, y })
    {
        x -= 17;
        y -= 17;
        const cell_index = Math.ceil(((x) / cell_size) / 0.7);
        const row_index = Math.ceil(((y) / cell_size) / 0.7);
        if (!this.is_active)
        {
            console.log(this.stats);
            for(const row_index in this.cells)
            {
                const row = this.cells[row_index];
                for(const cell_index in row)
                {
                    row[cell_index] = cell_empty;
                }
            }
            this.drawScene();
        } 
        if (cell_index > 3 || row_index > 3)
        {
            return;
        }
        const cell_state = this.cells[row_index - 1][cell_index - 1];
        console.log(cell_index, row_index);
        if (cell_state !== cell_empty || !this.turn_key)
        {
            return;
        }
        fetch(server_url, {method: 'POST', body: JSON.stringify({
            row: row_index - 1,
            cell: cell_index - 1,
            gameId: this.gameId,
            turn_key: this.turn_key,
            reset: (this.is_active === true) ? 0 : 1
            })
        });
        this.updateStats();
    }

    updateStats()
    {
        var rating_x = document.getElementById('sx');
        var rating_o = document.getElementById('so');
        var rating_t = document.getElementById('st');

        rating_x.innerHTML = this.stats['x'];
        rating_o.innerHTML = this.stats['o'];
        rating_t.innerHTML = this.stats['t'];
    }
}