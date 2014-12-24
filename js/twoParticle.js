(function() {
  var partSystem = function(options, width, height) {
    //Setup presets
    var presets = {
      maxParticles: 150,
      size: 6,
      sizeRandom: 1,
      speed: 1,
      speedRandom: 1.2,

      // Lifespan in frames
      lifeSpan: 29,
      lifeSpanRandom: 7,

      // Angle is calculated clockwise: 12pm is 0deg, 3pm is 90deg etc.
      angle: 65,
      angleRandom: 34,
      startColour: [186, 201, 235, 0.7],
      startColourRandom: [20, 20, 20, 0.2],
      endColour: [77, 97, 117, 0.9],
      endColourRandom: [30, 30, 30, 0.2],

      // Rotation of the particle
      rotation: 0,
      rotationRandom: 0,

      // Random spread from origin
      spreadX: 10,
      spreadY: 10,

      // How many frames should this last
      duration: -1,
      gravity: {
        x: 0,
        y: 0.6
      },
      position: {
        x: 0,
        y: 0
      },
      // sensible values are 0-3
      jitter: 0,

      // Don't modify the following
      particles: [],
      recycledParticles: [],
      active: true,
      particleCount: 0,
      elapsedFrames: 0,
      emissionRate: 0,
      emitCounter: 0,
      particleIndex: 0
    };


    //Create current config by merging given options and presets.
    if (!options) options = {};
    for (var key in presets) {
      if (typeof options[key] != 'undefined') this[key] = options[key];
      else this[key] = presets[key];
    }

    this.emissionRate = this.maxParticles / this.lifeSpan;
    this.positionRandom = new Two.Vector(this.spreadX, this.spreadY);

    this.stageWidth = width;
    this.stageHeight = height;
  };

  partSystem.prototype.addParticle = function() {
    if (this.particleCount == this.maxParticles) {
      return false;
    }
    var particle;
    // Take the next particle out of the particle pool we have created and initialize it
    if (this.recycledParticles.length) {
      particle = this.recycledParticles.pop();
    } else {
      particle = new this.particle(this);
    }
    this.initParticle(particle);
    this.particles[this.particleCount] = particle;


    // Increment the particle count
    this.particleCount++;

    return true;
  };

  partSystem.prototype.series = function(n) {
    return Math.pow(n, 2) / 2 + n / 2;
  };

  partSystem.prototype.initParticle = function(particle) {
    particle.position.x = this.position.x + this.positionRandom.x * this.RANDM1TO1();
    particle.position.y = this.position.y + this.positionRandom.y * this.RANDM1TO1();

    var newAngle = (this.angle + this.angleRandom * this.RANDM1TO1()) * (Math.PI / 180); // convert to radians
    var vector = new Two.Vector(Math.sin(newAngle), -Math.cos(newAngle));
    var vectorSpeed = this.speed + this.speedRandom * this.RANDM1TO1();
    particle.direction = vector.multiplyScalar(vectorSpeed);

    particle.size = this.size + this.sizeRandom * this.RANDM1TO1();
    particle.size = particle.size < 0 ? 0 : ~~particle.size;
    particle.timeToLive = this.lifeSpan + this.lifeSpanRandom * this.RANDM1TO1();

    var start = [
      this.startColour[0] + this.startColourRandom[0] * this.RANDM1TO1(),
      this.startColour[1] + this.startColourRandom[1] * this.RANDM1TO1(),
      this.startColour[2] + this.startColourRandom[2] * this.RANDM1TO1(),
      this.startColour[3] + this.startColourRandom[3] * this.RANDM1TO1()
    ];

    var end = [
      this.endColour[0] + this.endColourRandom[0] * this.RANDM1TO1(),
      this.endColour[1] + this.endColourRandom[1] * this.RANDM1TO1(),
      this.endColour[2] + this.endColourRandom[2] * this.RANDM1TO1(),
      this.endColour[3] + this.endColourRandom[3] * this.RANDM1TO1()
    ];

    particle.colour = start;
    particle.deltaColour[0] = (end[0] - start[0]) / particle.timeToLive;
    particle.deltaColour[1] = (end[1] - start[1]) / particle.timeToLive;
    particle.deltaColour[2] = (end[2] - start[2]) / particle.timeToLive;
    particle.deltaColour[3] = (end[3] - start[3]) / particle.timeToLive;
  };
  partSystem.prototype.update = function() {
    this.particleIndex = 0;
    var draw;
    while (this.particleIndex < this.particleCount) {

      var currentParticle = this.particles[this.particleIndex];

      // If the current particle is alive then update it
      if (currentParticle.timeToLive > 0) {

        // Calculate the new direction based on gravity
        currentParticle.direction = currentParticle.direction.addSelf(this.gravity);
        currentParticle.position =  currentParticle.position.addSelf(currentParticle.direction);
        //currentParticle.position = this.vectorHelpers.add(currentParticle.position, this.viewportDelta);
        if (this.jitter) {
          currentParticle.position.x += this.jitter * this.RANDM1TO1();
          currentParticle.position.y += this.jitter * this.RANDM1TO1();
        }
        currentParticle.timeToLive--;

        // Update colours
        var r = currentParticle.colour[0] += currentParticle.deltaColour[0];
        var g = currentParticle.colour[1] += currentParticle.deltaColour[1];
        var b = currentParticle.colour[2] += currentParticle.deltaColour[2];
        var a = currentParticle.colour[3] += currentParticle.deltaColour[3];

        // Calculate the rgba string to draw.
        draw = [];
        draw.push("rgba(" + (r > 255 ? 255 : r < 0 ? 0 : ~~r));
        draw.push(g > 255 ? 255 : g < 0 ? 0 : ~~g);
        draw.push(b > 255 ? 255 : b < 0 ? 0 : ~~b);
        draw.push((a > 1 ? 1 : a < 0 ? 0 : a.toFixed(2)) + ")");
        currentParticle.drawColour = draw.join(",");


        draw[3] = "0)";
        currentParticle.drawColourEnd = draw.join(",");


        this.particleIndex++;
      } else {
        // Replace particle with the last active
        if (this.particleIndex != this.particleCount - 1) {
          this.particles[this.particleIndex] = this.particles[this.particleCount - 1];
        }
        this.recycledParticles.push(currentParticle);
        this.particleCount--;
      }
    }

    if (this.active && this.emissionRate > 0) {
      var rate = 1 / this.emissionRate;
      this.emitCounter++;
      while (this.particleCount < this.maxParticles && this.emitCounter > rate) {
        this.addParticle();
        this.emitCounter -= rate;
      }
      this.elapsedFrames++;
      if (this.duration != -1 && this.duration < this.elapsedFrames) {
        this.stop();
      }
    }
  };

  partSystem.prototype.stop = function() {
    this.active = false;
    this.elapsedFrames = 0;
    this.emitCounter = 0;
  };

  partSystem.prototype.render = function(context) {
    var l = this.particleCount;
    var particle, size, halfSize;

    while (l--) {
      particle = this.particles[l];
      size = particle.size;
      halfSize = size >> 1;

      // Is in inside the viewport?
      if (particle.position.x + size < 0 ||
        particle.position.y + size < 0 ||
        particle.position.x - size > this.stageWidth ||
        particle.position.y - size > this.stageHeight) {
        continue;
      }

      var x = ~~particle.position.x;
      var y = ~~particle.position.y;

      context.strokeStyle = particle.drawColour;
      context.lineWidth = 2;

      context.beginPath();
      context.moveTo(x, y);
      context.lineTo(x + size, y - size*1.5);
      context.stroke();
    }
  };

  partSystem.prototype.particle = function(that) {
    this.position = new Two.Vector(0, 0);
    this.direction = new Two.Vector(0, 0);
    this.size = 0;
    this.timeToLive = 0;
    this.colour = [];
    this.drawColour = "";
    this.deltaColour = [];
    this.rotation = that.rotation + that.rotationRandom * that.RANDM1TO1();
  };

  partSystem.prototype.RANDM1TO1 = function() {
    return Math.random() * 2 - 1;
  };

  Two.ParticleSystem = partSystem;
})();
