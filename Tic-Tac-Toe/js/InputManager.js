class InputManager extends EventEmitter {
    constructor({ canvas }) 
    {
      super();
  
      this.canvas = canvas;
    }
  
    start() 
    {
      this.canvas.addEventListener('click', (e) => {
        this.emit('click', { x: e.pageX, y: e.pageY });
      });
    }
  }