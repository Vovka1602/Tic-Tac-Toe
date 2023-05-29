import http from 'http';
import OnlineGame from './OnlineGame.mjs';

const games = [];

let i = 0;
http.createServer(async(req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method === 'POST')
  {
    let data = '';
    for await (const chunk of req)
    {
      data += chunk.toString();
    }
    const {gameId, row, cell, turn_key, reset} = JSON.parse(data);
    const onlineGame = games.find((g) => g.id === Number(gameId));
    if (!onlineGame || turn_key != onlineGame.turn_key)
    {
      res.end();
      return;
    }
    if (reset == 1)
    {
      onlineGame.restart();
    }
    onlineGame.click(row, cell);
    res.end();
  }
  else
  {
    res.setHeader('Content-Type', 'text/event-stream');

    const match = req.url.match(/\?gameId=(.*)/);
    console.info(match);
    
    let onlineGame = match && games.find((g) => g.id === Number(match[1]));
    if (!onlineGame)
    {
      onlineGame = new OnlineGame();
    }
    onlineGame.join((status_for) => {
      res.write(`id:${onlineGame.id}\n`);
      res.write(`data: ${JSON.stringify(onlineGame.getStatus(status_for))}\n\n`);
    });

    games.push(onlineGame);
    console.info("Games:", games.length);
  }
}).listen(8090);

console.info('Listen...')