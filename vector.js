class Vector {
    constructor(x, y) {
      this.x = x;
      this.y = y;
    }
  
    add(v) {
      return new Vector(this.x + v.x, this.y + v.y);
    }
  
    addTo(v) {
      this.x += v.x;
      this.y += v.y;
      return this;
    }
  
    setLength(length) {
      const angle = this.getAngle();
      this.x = Math.cos(angle) * length;
      this.y = Math.sin(angle) * length;
    }
  
    getAngle() {
      return Math.atan2(this.y, this.x);
    }
  
    getLength() {
      return Math.hypot(this.x, this.y);
    }
  
    copy() {
      return new Vector(this.x, this.y);
    }
  
    div(n) {
      return new Vector(this.x / n, this.y / n);
    }
  }  