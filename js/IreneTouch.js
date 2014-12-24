var dragsEnabled = {
  x: false,
  y: true
};
var soonEnabled = {
  x: false,
  y: true
};
var inSlowZone = false;

Irene.prototype.setupTouchHandling = function() {
  var initial = new Two.Vector();
  var that = this;


  var idleTimeout = setTimeout(function () {
    console.log('Resetting');
    that.reset();
  }, 5 * 60 * 1000);


  var gestures = new Hammer(document.body, {
    dragLockToAxis: true,
    preventDefault: true
  });
  gestures.on('dragstart', function(event) {
    initial.copy(that.curPos);
    // Howler._howls.forEach(function (howl) {
    //   howl.play();
    // });

    // Reset if more than 5min idle
    clearTimeout(idleTimeout);
    idleTimeout = setTimeout(function () {
      console.log('Resetting');
      that.reset();
    }, 5 * 60 * 1000);

  });
  gestures.on('dragend', function(event) {
    dragsEnabled.x = soonEnabled.x;
    dragsEnabled.y = soonEnabled.y;
  });
  gestures.on('drag', function(event) {
    event.gesture.preventDefault();

    var diff = {
      x: - event.gesture.deltaX / 20,
      y: - event.gesture.deltaY / 50
    };


    // if (inSlowZone) {
    //   diff.x *= 0.3;
    //   diff.y *= 0.3;
    // }

    if (!dragsEnabled.x) diff.x = 0;
    if (!dragsEnabled.y) diff.y = 0;

    // Set curPos to the sum of initial and diff
    that.curPos.add(initial, diff);

  });

  gestures.on('tap', function(event) {
    that.handleBacklink(event);
  });

};

var enableCache = function (item) {
  for (var i = 0; i < arguments.length; i++) {
    arguments[i]._flagChildren = true;
    arguments[i].cacheEnabled = true;
    console.log("enabling cache", arguments[i].id);
  }
};

var enableCacheLaterAgain = _.debounceReduce(enableCache, 300, function(acc,args) {
  return (acc || []).concat(args);
});

Irene.prototype.movePerspective = function(value) {
  // Prevent moving horizontally before arrived at bottom
  if (!this.landed && value.y < -0.001) {
    value.x = 0;
  } else {
    this.landed = true;
    soonEnabled.x = true;
    value.x = value.x.clamp(FIRSTCITY - 3, ENDPOS);
  }

  if (this.landed) {
    value.y = 0;
  } else {
    value.y = value.y.clamp(VERTICAL, 0);
  }

  if ((value.x > FIRSTCITY && value.x < FIRSTCITY + 4) || (value.x > SECONDCITY - 3 && value.x < SECONDCITY + 3) || (value.x > THIRDCITY - 3 && value.x < THIRDCITY + 3)) {
    inSlowZone = true;
  } else {
    inSlowZone = false;
  }


  // var city1 = this.get('City1');
  // city1.cacheEnabled = false;
  //
  // var back = this.get('Back');
  // back.cacheEnabled = false;
  //
  //
  // var rock1 = this.get('Rock1');
  // rock1.cacheEnabled = false;
  //
  // var rock2 = this.get('Rock2');
  // rock2.cacheEnabled = false;
  //
  // var city2 = this.get('City2');
  // city2.cacheEnabled = false;
  //
  var city4 = this.get('City4');
  city4.cacheEnabled = false;
  //
  // enableCacheLaterAgain(city1);
  // //enableCacheLaterAgain(back);
  // enableCacheLaterAgain(rock1);
  // enableCacheLaterAgain(rock2);
  // enableCacheLaterAgain(city2);
  enableCacheLaterAgain(city4);

  // Update perspective arranged timeline
  this.perspTimeline._tweens.forEach(function (t) {
    t.setPosition(this.timelinePos);
  }, this);

  this.scene.circularDisplace(value, this.selected);

  if (!value.x) {
    this.timelinePos = value.y;
  } else {
    this.timelinePos = value.x;
  }

  // Update sound location
  this.updateAudioPos(value);


};
