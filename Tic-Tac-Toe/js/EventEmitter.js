class EventEmitter {
    events = {};
  
    emit(event_name, ...args) {
      if (!this.events[event_name]) {
        return;
      }
      for (const event_function of this.events[event_name]) {
        event_function(event_name, ...args);
      }
    }
  
    on(event_name, event_function) {
      this.events[event_name] = this.events[event_name] || [];
      this.events[event_name].push(event_function);
    }
  }