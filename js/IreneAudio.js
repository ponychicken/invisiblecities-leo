var fakeFaktor = 0.2;

Irene.prototype.setupAudio = function() {

  // Howl.prototype.position = function (x, y, z, id) {
  //     var self = this;
  //
  //     // set a default for the optional 'y' & 'z'
  //     y = (typeof y === 'undefined' || !y) ? 0 : y;
  //     z = (typeof z === 'undefined' || !z) ? -0.5 : z;
  //
  //     // if the sound hasn't been loaded, add it to the event queue
  //     if (!self._loaded) {
  //       self.on('play', function() {
  //         self.position(x, y, z, id);
  //       });
  //
  //       return self;
  //     }
  //
  //     if (x >= 0 || x < 0) {
  //       if (self._webAudio) {
  //         x = fakeFaktor * x;
  //         y = fakeFaktor * y;
  //
  //         var activeNode = (id) ? self._nodeById(id) : self._activeNode();
  //         if (activeNode) {
  //           self._position = [x, y, z];
  //           activeNode.panner.setPosition(x, y, z);
  //           activeNode.panner.panningModel = self._model || 'HRTF';
  //         }
  //       }
  //     } else {
  //       return self._position;
  //     }
  //
  //     return self;
  // };





  var windsteady = new Howl({
    urls: ['audio/WindSteadyLoop.mp3'],
    autoplay: true,
    loop: true,
    position: [fakeFaktor*0, -50, -0.5],
    rolloffFactor: 1,
    volume: 0.8
  });

  var harb = new Howl({
    urls: ['audio/harbour.mp3'],
    autoplay: true,
    loop: true,
    position: [fakeFaktor*-1, -20, -3],
    refDistance: 3,
    rolloffFactor: 2
  });

  var city = new Howl({
    urls: ['audio/city.mp3'],
    autoplay: true,
    loop: true,
    position: [fakeFaktor*-1, 0, -5],
    rolloffFactor: 2.7,
    refDistance: 1.5,
    volume: 1.1
  });

  var swim = new Howl({
    urls: ['audio/swimming.mp3'],
    autoplay: true,
    loop: true,
    position: [fakeFaktor*14, 0, -3],
    rolloffFactor: 9,
    refDistance: 0.9,
    volume: 0.45
  });

  var cicada = new Howl({
    urls: ['audio/cicada.mp3'],
    autoplay: true,
    loop: true,
    position: [fakeFaktor*40, 0, -3],
    rolloffFactor: 2,
    refDistance: 1.8,
    volume: 0.10,
    distanceModel: 'exponential'
  });

  cicada = new Howl({
    urls: ['audio/cicada.mp3'],
    autoplay: true,
    loop: true,
    position: [fakeFaktor*65, 0, -3],
    rolloffFactor: 2,
    refDistance: 1.8,
    volume: 0.10,
    distanceModel: 'exponential'
  });


  var rain = new Howl({
    urls: ['audio/rain.mp3'],
    autoplay: true,
    loop: true,
    position: [fakeFaktor*SECONDCITY - 35, 0, -3],
    rolloffFactor: 0.9,
    refDistance: 1,
    volume: 0.7,
    distanceModel: 'exponential'
  });

  var rain2 = new Howl({
    urls: ['audio/rain.mp3'],
    autoplay: true,
    loop: true,
    position: [fakeFaktor*SECONDCITY, 0, -3],
    rolloffFactor: 0.9,
    refDistance: 1,
    volume: 0.8,
    distanceModel: 'exponential'
  });

  var thunder = new Howl({
    urls: ['audio/gewitter.mp3'],
    autoplay: true,
    loop: true,
    position: [fakeFaktor*SECONDCITY - 2, 0, -2],
    rolloffFactor: 2,
    refDistance: 1,
    volume: 4,
    distanceModel: 'exponential'
  });

  var drone = new Howl({
    urls: ['audio/drone.mp3'],
    autoplay: true,
    loop: true,
    position: [fakeFaktor*THIRDCITY, 0, -2],
    rolloffFactor: 0.8,
    refDistance: 1,
    volume: 0.7,
    distanceModel: 'exponential'
  });

  var beep = new Howl({
    urls: ['audio/beeping.mp3'],
    autoplay: true,
    loop: true,
    position: [fakeFaktor*(THIRDCITY + 3), 0, -3],
    rolloffFactor: 6,
    refDistance: 1,
    volume: 18,
    distanceModel: 'exponential'
  });

  Howler.volume(4);

  // window.addEventListener('load', function () {
  //   // Wire up the `focus` and `blur` event handlers.
  //   window.addEventListener('focus', function() {
  //     Howler._howls.forEach(function (howl) {
  //       howl.play();
  //     });
  //   });
  //   window.addEventListener('blur', function() {
  //     Howler._howls.forEach(function (howl) {
  //       howl.pause();
  //     });
  //   });
  // });
};

Irene.prototype.updateAudioPos = function (v) {
  Howler.position(v.x*fakeFaktor, v.y*fakeFaktor, 0);

  // Performance: Switch off after while
  // Howler._howls.forEach(function (howl) {
  //   var p = howl._position;
  //   var distance = v.distanceTo({x: p[0], y: p[1]});
  //
  //   if (distance >= 50) {
  //     howl.volumeOrig = howl._volume;
  //     howl.volume(0);
  //   } else if (distance < 50 && howl.volumeOrig) {
  //     howl.volume(howl.volumeOrig);
  //   }
  // });

};
