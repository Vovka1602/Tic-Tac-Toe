class Dependency {
    instances = {};
  
    proxy = null;
  
    parent = null;
  
    static create() {
      const d = new Dependency();
      d.set('d', d);
      return d;
    }
  
    constructor(parent = null) 
    {
      this.parent = parent;  
      this.proxy = new Proxy({}, {
        get: (target, name) => this.get(name),
        set: (target, name, value) => this.set(name, value)
      });
    }
  
    set(name, value) 
    {
      this.instances[name] = value;
    }
  
    get(name_or_class) {
      const Name = typeof name_or_class === 'string' ? name_or_class : name_or_class.prototype.constructor.name;
      if (this.instances[Name]) {
        return this.instances[Name];
      }
      if (this.parent) 
      {
        return this.parent.get(name_or_class);
      }
      try {
        const Constructor = typeof name_or_class === 'string' ? eval(name_or_class) : name_or_class;
        this.instances[Name] = new Constructor(this.proxy);
        return this.instances[Name];
      } 
      catch (err) 
      {}
    }
  
    scope() {
      return new Dependency(this);
    }
  }