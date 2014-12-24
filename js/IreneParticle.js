Irene.prototype.setupRain = function () {
  var that = this, ctx, ratio = this.two.renderer.ratio;

  var can = document.createElement('canvas');
      can.style.position = 'absolute';
      can.style.top = 0;
      can.style.left = 0;
      can.style.width = this.two.width + 'px';
      can.style.height = this.two.height + 'px';
      can.width = this.two.width * ratio;
      can.height = this.two.height * ratio;
  document.body.appendChild(can);

  ctx = can.getContext('2d');
  ctx.scale(ratio, ratio);
  var a = 1.5;
  var rain = this.rain = new Two.ParticleSystem({
    rotation: 30,
    rotationRandom: 2,
    spreadX: 600,
    spreadY: 100,
    gravity: {
        x: -0.08*a,
        y: 0.2*a
    },
    position: {
      x: 600,
      y: 0
    },
    lifeSpan: 100,
    lifeSpanRandom: 27,
    size: 6,
    sizeRandom: 0.5,
    maxParticles: 250,
    startColour: [200, 200, 200, 0.8],
    startColourRandom: [0,0,0,0],
    angle: 240,
    angleRandom: 8,
    startColour: [200, 200, 200, 0.8]
  }, can.width, can.height);

  this.two.bind('update', function() {
    rain.update();
    ctx.clearRect(0, 0, can.width, can.height);
    rain.render(ctx);
  });


  this.newTween(rain, this.perspTimeline)
      .add( SECONDCITY -70,  { emissionRate: 0 })
      .add( SECONDCITY,  { emissionRate: 3.5 })
      .add( SECONDCITY + 25,  { emissionRate: 0 });
};
