(function(global) {
    var module = global.noise = {};
  
    function Grad(x, y) {
      this.x = x; 
      this.y = y; 
    }
    
    Grad.prototype.dot2 = function(x, y) {
      return this.x * x + this.y * y;
    };
  
    var grad3 = [new Grad(1, 1), new Grad(-1, 1), new Grad(1, -1), new Grad(-1, -1),
                 new Grad(1, 0), new Grad(-1, 0), new Grad(0, 1), new Grad(0, -1)];
  
    var p = [...Array(256).keys()].map(i => i);
  
    // Shuffle the permutation array
    for (let i = p.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [p[i], p[j]] = [p[j], p[i]];
    }
  
    // Duplicate the permutation array
    var perm = [...p, ...p];
    var gradP = [...Array(512).keys()].map(i => grad3[perm[i] % 8]);
  
    module.simplex2 = function(xin, yin) {
      var n0, n1, n2; // Noise contributions from the three corners
      var s = (xin + yin) * 0.5 * (Math.sqrt(3) - 1); // Hairy factor for 2D
      var i = Math.floor(xin + s);
      var j = Math.floor(yin + s);
      var t = (i + j) * (3 - Math.sqrt(3)) / 6;
      var x0 = xin - i + t; // The x,y distances from the cell origin, unskewed.
      var y0 = yin - j + t;
  
      var i1, j1; // Offsets for the second (middle) corner of simplex in (i,j) coords
      if (x0 > y0) {
        i1 = 1; j1 = 0;
      } else {
        i1 = 0; j1 = 1;
      }
  
      var x1 = x0 - i1 + (3 - Math.sqrt(3)) / 6; // Offsets for middle corner in (x,y) unskewed coords
      var y1 = y0 - j1 + (3 - Math.sqrt(3)) / 6;
      var x2 = x0 - 1 + 2 * (3 - Math.sqrt(3)) / 6; // Offsets for last corner in (x,y) unskewed coords
      var y2 = y0 - 1 + 2 * (3 - Math.sqrt(3)) / 6;
  
      i &= 255;
      j &= 255;
      var gi0 = gradP[i + perm[j]];
      var gi1 = gradP[i + i1 + perm[j + j1]];
      var gi2 = gradP[i + 1 + perm[j + 1]];
  
      var t0 = 0.5 - x0 * x0 - y0 * y0;
      if (t0 < 0) n0 = 0;
      else {
        t0 *= t0;
        n0 = t0 * t0 * gi0.dot2(x0, y0);  // (x,y) of grad3 used for 2D gradient
      }
  
      var t1 = 0.5 - x1 * x1 - y1 * y1;
      if (t1 < 0) n1 = 0;
      else {
        t1 *= t1;
        n1 = t1 * t1 * gi1.dot2(x1, y1);
      }
  
      var t2 = 0.5 - x2 * x2 - y2 * y2;
      if (t2 < 0) n2 = 0;
      else {
        t2 *= t2;
        n2 = t2 * t2 * gi2.dot2(x2, y2);
      }
  
      // Scale the result to return values in the interval [-1,1]
      return 70 * (n0 + n1 + n2);
    };
  
    module.seed = function(seed) {
      // Optional: Implement seeding functionality if needed
    };
  
  })(this);
  