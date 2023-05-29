const cell_empty = 0;
const cell_x = 1;
const cell_o = 2;
const cell_tie = 3;

let globalId = 0;
let globalKeyId = 1;

export default
class OnlineGame
{
    
    players = {
        [cell_x]: null,
        [cell_o]: null
    };

    winStates = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    is_active = true;
    won_side = null;

    stats = {
        'x': 0,
        'o': 0,
        't': 0
    }

    constructor()
    {
        this.id = globalId++;
        this.state = cell_x;
        this.turn_key = globalKeyId++;
    }
    
    cells = [
        [cell_empty, cell_empty, cell_empty],
        [cell_empty, cell_empty, cell_empty],
        [cell_empty, cell_empty, cell_empty],
    ];

    join(callback) 
    {
        if(this.players[cell_x])
        {
            this.players[cell_o] = callback;
            callback(cell_o);
        }
        else
        {
            this.players[cell_x] = callback;
            callback(cell_x);
        }
    }

    getStatus(status_for)
    {
        return {
            cells: this.cells,
            is_active: this.is_active,
            turn_key: this.state === status_for ? this.turn_key : null,
            won_side: this.won_side,
            stats: this.stats
        };
    }

    sendStatus()
    {
        if(this.players[cell_x])
        {
            this.players[cell_x](cell_x);
        }
        if(this.players[cell_o])
        {
            this.players[cell_o](cell_o);
        }
    }
    
    click(row_index, cell_index)
    {
        if (!this.is_active)
        {
            return;
        }
        const cell_state = this.cells[row_index][cell_index];
        if (cell_state !== cell_empty)
        {
            return;
        }
        this.cells[row_index][cell_index] = this.state;
        this.state = (this.state === cell_x) ? cell_o : cell_x;
        this.turn_key = globalKeyId++;
        
        this.checkWinState();
        this.sendStatus();
    }

    checkWinState()
    {
        const arr = this.cells.reduce((arr, item) => arr.concat(item), []);
        for (const [c1, c2, c3] of this.winStates)
        {
            if (arr[c1] === arr[c2] && arr[c2] === arr[c3] && arr[c1] === arr[c3] && arr[c1] !== cell_empty)
            {
                console.info("won", arr[c1]);
                this.is_active = false;
                this.won_side = arr[c1];
                if (this.won_side === cell_x)
                {
                    this.stats['x'] += 1;
                }
                else
                {
                    this.stats['o'] += 1;
                }
                return;
            }
        }
        if (!arr.includes(cell_empty))
        {
                
            console.info("tie");
            this.is_active = false;
            this.won_side = cell_tie;
            this.stats['t'] += 1;
            return;
        }
    }

    restart()
    {
        for(const row_index in this.cells)
        {
            const row = this.cells[row_index];
            for(const cell_index in row)
            {
                row[cell_index] = cell_empty;
            }
        }
        this.is_active = true;
        this.won_side = null;
    }
}