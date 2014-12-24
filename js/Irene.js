Tween = createjs.Tween;
Timeline = createjs.Timeline;
Ease = createjs.Ease;

var VERTICAL = -50;
var STARTPOS = 0;
var FIRSTCITY = 0;
var SECONDCITY = 170;
var THIRDCITY = 340;
var FOURTHCITY = 507.5;
var ENDPOS = 507.5;


Irene = function () {
  return this;
};

IreneProto = {
  curPos: new Two.Vector(0, VERTICAL),
  landed: false,
  timelinePos: 0,
  getCache: {},
  timesResetted: 0,

  loadSVG: function (url, wrapper, cb) {
    $.get(url, function(response) {
      wrapper.innerHTML = response;
      cb(wrapper);
    });
  },

  interpretSVG: function (wrapperSrc, wrapperDest) {
    this.two = new Two({
      width: 768,
      height: 1024,
      type: Two.Types.canvas,
      // overdraw: true,
      smoothing: false
    }).appendTo(wrapperDest);

    this.two.interpret(wrapperSrc.children[0], true);
    this.two.update();

    this.scene = this.two.scene;
  },

  showStats: function () {
    // Align top-left
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.left = '0px';
    stats.domElement.style.top = '20px';

    document.body.appendChild(stats.domElement);
  },

  start: function () {
    var that = this;
    var lastPos = new Two.Vector();

    this.two.bind('update', function (frame, d) {
      //that.movePerspective(that.curPos);
      that.animTimeline.tick(d);
    });

    this.two.bind('update', function(frameCount) {
      if (!that.curPos.equals(lastPos)) {
        lastPos.copy(that.curPos);
        that.movePerspective(that.curPos);
      }
    });

    this.two.update();
    this.two.play();
    this.movePerspective(this.curPos);

    $('#loading').remove();
  },

  get: function(id) {
    if (this.getCache[id]) {
      return this.getCache[id];
    }

    var result = this.scene.getById(id);

    if (result) {
      return this.getCache[id] = result;
    } else {
      return {};
    }
  },

  placeInSpace: function(item, x, y, z) {
    item.setDepth(z);
    this.moveToCorrectPosition(item, new Two.Vector(x,y));
  },

  moveToCorrectPosition: function(item, focalPoint) {
    if (_.isNumber(focalPoint)) {
      focalPoint = new Two.Vector(focalPoint, 0);
    }

    var z = item.z || -10;
    item.translation.copy(focalPoint).multiplyScalar(z);
    item.origTranslation = new Two.Vector().copy(item.translation);
  },

  newTween: function(target, timeline) {
    if (_.isString(target)) {
      target = this.get(target);
    }
    if (target) {
      var t = Tween.get(target);
      if (timeline) timeline.addTween(t);
      return t;
    } else {
      return {
        add: function(){},
        target: {}
      };
    }
  },

  resort: function(selected) {
    var sortedArray = [];
    var sorted = this.get('sorted');
    if (!selected) selected = this.updateSelected();
    if (!sorted || !sorted.parent) {
      sorted = this.two.makeGroup();
      sorted.id = 'sorted';
    }

    selected.sort(function (a,b) {
      return (a.z - b.z);
    });
    selected.reverse();

    selected.forEach(function (item) {
      item.addTo(sorted);
    });
  },

  updateSelected: function() {
    return this.selected = this.scene.getByClassName('parallaxEnabled');
  },

  moveCloudsToFront: function () {
    var clouds = this.get('Clouds');
    var logo = this.get('Logo');
    var verticalText = this.get('VerticalText');
    var horizontalText = this.get('HorizontalText');
    var front = this.get('Front');
    var frontCity1 = this.get('FrontCity1');
    var arrowBottom = this.get('ArrowBottom');
    var arrowTop = this.get('ArrowTop');

    var textAndClouds = [];
    verticalText.children.forEach(function (item) {
      textAndClouds.push(item);
    });
    horizontalText.children.forEach(function (item) {
      textAndClouds.push(item);
    });
    clouds.children.forEach(function (item) {
      textAndClouds.push(item);
    });
    textAndClouds.push(logo);
    textAndClouds.push(arrowBottom);
    textAndClouds.push(arrowTop);

    this.resort(textAndClouds);

    var sorted = this.get('sorted');
    this.two.update();

    $(sorted._renderer.elem).after($(front._renderer.elem));

    front.addTo(this.scene);

    // Weird
    frontCity1.translation.set(0, 500);

    selected = this.scene.getByClassName('parallaxEnabled');

    this.placeInSpace(arrowBottom, 0, VERTICAL, -100);
    this.placeInSpace(arrowTop, 0, VERTICAL, -100);
  },

  cloudMover: function(id, x, z, timeline) {
    var cloud = this.newTween(id, timeline);
    cloud.target.z = z;

    // Start
    cloud.add(VERTICAL + 26,    { x: 0, y: 0, opacity: cloud.target.opacity });
    cloud.add(FIRSTCITY - 1,    { x: x, y: -500, opacity: 0 });
    cloud.add(FIRSTCITY + 34,   { x: x, y: 0, opacity: 0 });
    cloud.add(FIRSTCITY + 90,   { x: 0, y: 0, opacity: cloud.target.opacity });
    cloud.add(FIRSTCITY + 125,  { x: x/3, y: 0, opacity: cloud.target.opacity });
    cloud.add(SECONDCITY -15,  { x: x, opacity: 0 });

    cloud.add(SECONDCITY +15,  { x: x, opacity: 0 });
    cloud.add(SECONDCITY +80,  { x: 0, opacity: cloud.target.opacity });
    cloud.add(SECONDCITY +110, { x: x/3, opacity: cloud.target.opacity });
    cloud.add(THIRDCITY , { x: x/4, opacity: cloud.target.opacity/4 });

    cloud.add(THIRDCITY + 20  , { x: x/4, opacity: cloud.target.opacity/4 });
    cloud.add(THIRDCITY + 80  , { x: 0, opacity: cloud.target.opacity });
    cloud.add(THIRDCITY + 110  , { x: 0, opacity: cloud.target.opacity });
    cloud.add(FOURTHCITY, { x: x, opacity: 0});

    return cloud;
  },

  enableCaching: function (something, viewport) {
    if (!something.length) {
      something = [something];
    }

    // for (var i = 0; i < something.length; i++) {
    //   something[i].cacheEnabled = true;
    //   something[i].cacheViewport = viewport;
    //   console.log('Enabling cache for', something[i].id, ', it\'s parent:', something[i].parent.id);
    // }
  },

  enableCachingReally: function (something, viewport, hardcore) {
    var that = this;

    if (!something.length) {
      something = [something];
    }

    for (var i = 0; i < something.length; i++) {
      something[i].cacheEnabled = true;
      something[i].cacheViewport = viewport;

      if (hardcore) {

        something[i].cacheCallback = function () {
          that.killOriginalData(this);
        };

      }

      console.log('Enabling cache for', something[i].id, ', it\'s parent:', something[i].parent.id);
    }
  },


  killOriginalData: function (item) {
    if (item instanceof Two.Polygon) {
      item._vertices = [];
      return;
    }


    var polys = item.getByType(Two.Polygon);

    polys.forEach(function (poly) {
      poly._vertices = [];
      poly.collection = [];
      poly.remove();
    });

    var groups = item.getByType(Two.Group);

    groups.forEach(function (group) {
      group.remove();
    });
  },

  placeCity: function(buildings, position) {
    var that = this;
    buildings.forEach(function (item) {
      var bbox = item.getBoundingClientRect();
      // Between 900 (near) and 500 (far)
      // Middle at 680
      var shift = -(bbox.bottom - 680);
      var z = mapNumber(shift, -250, 200, -15, 10);

      that.placeInSpace(item, position, 0, z);
    });
  },

  setupPerspective: function() {
    var cloudOffset = -36;

    this.perspTimeline = new Timeline();
    var get = this.get.bind(this);
    var placeInSpace = this.placeInSpace.bind(this);

    var frontCity1 = get('FrontCity1');
    var frontCity2 = get('FrontCity2');
    var frontCity3 = get('FrontCity3');
    var backCity1 = get('BackCity1');
    var backCity2 = get('BackCity2');
    var backCity3 = get('BackCity3');
    var sky = get('Sky');
    var skyCopy = get('SkyCopy');
    var city1 = get('City1');
    var city2 = get('City2');
    var city3 = get('City3');
    var buildings1 = city1.children;
    var buildings2 = city2.children;
    var buildings3 = city3.children;
    var clouds = get('Clouds');
    var logo = get('Logo');
    var verticalText = get('VerticalText');
    var horizontalText = get('HorizontalText');
    var text = get('Text');
    var text2 = get('Text2');
    var circle = get('Circle');
    var arrowBottom = get('ArrowBottom');
    var arrowTop = get('ArrowTop');

    while (buildings2.length == 1) {
      buildings2 = buildings2[0].children;
    }


    this.enableCaching(buildings1, false, true);
    this.enableCaching(buildings2);

    this.enableCaching(this.get('Moon'));
    this.enableCaching(this.get('Stars'));
    this.enableCaching(this.get('Logo'));
    //this.enableCaching(this.get('Back'), true);
    this.enableCaching(this.get('City1'), true);
    this.enableCaching(this.get('City2'), true);
    //this.enableCaching(this.get('City3'), true);

    //this.enableCaching(this.get('City3'), true);
    this.enableCaching(this.get('Man1'));
    this.enableCaching(this.get('Rock1'), true);
    this.enableCaching(this.get('Man2'));
    this.enableCaching(this.get('Woman3'));
    this.enableCaching(this.get('Puddles'));
    //this.enableCaching(this.get('Rock2'), true);
    this.enableCachingReally(horizontalText.children, false, true);
    this.enableCachingReally(verticalText.children, false, true);

    this.enableCachingReally(this.get('EndeText'), false, true);

    placeInSpace(frontCity1, FIRSTCITY, 0, -90);
    placeInSpace(frontCity2, SECONDCITY, 0, -90);
    placeInSpace(frontCity3, THIRDCITY, 0, -90);

    placeInSpace(backCity1,  FIRSTCITY, 0, 20);
    placeInSpace(backCity2,  SECONDCITY, 0, 20);
    placeInSpace(backCity3,  THIRDCITY, 0, 20);
    //placeInSpace(backCity3Copy,  THIRDCITY, 0, 20);

    placeInSpace(get('VerticalText1'), 0, VERTICAL, cloudOffset + 2);
    placeInSpace(get('VerticalText2'), 0, VERTICAL +1, cloudOffset - 3);
    placeInSpace(get('VerticalText3'), 0, VERTICAL -10, cloudOffset + 5);
    placeInSpace(get('VerticalText4'), 0, VERTICAL -10, cloudOffset + 2);
    placeInSpace(get('VerticalText5'), 0, -61, cloudOffset + 2);

    placeInSpace(get('HorizontalText1'), 0, 0, -100);
    placeInSpace(get('HorizontalText2'), 11, 0, cloudOffset + 2);
    placeInSpace(get('HorizontalText3'), 25, 0, cloudOffset - 3);
    placeInSpace(get('HorizontalText4'), 45, 0, cloudOffset + 2);
    placeInSpace(get('HorizontalText5'), 65, 0, cloudOffset - 20);
    placeInSpace(get('HorizontalText6'), 80, 0, cloudOffset - 10);
    placeInSpace(get('HorizontalText7'), 90, 0, cloudOffset - 3);
    placeInSpace(get('HorizontalText8'), 105, 0, cloudOffset - 5);

    placeInSpace(get('HorizontalText9'), SECONDCITY, 0, -100);
    placeInSpace(get('HorizontalText10'), SECONDCITY + 11, 0, cloudOffset + 2);
    placeInSpace(get('HorizontalText11'), SECONDCITY + 19, 0, cloudOffset - 3);
    placeInSpace(get('HorizontalText12'), SECONDCITY + 35, 0, cloudOffset + 2);
    placeInSpace(get('HorizontalText13'), SECONDCITY + 50, 0, cloudOffset - 20);
    placeInSpace(get('HorizontalText14'), SECONDCITY + 70, 0, cloudOffset - 10);
    placeInSpace(get('HorizontalText15'), SECONDCITY + 85, 0, cloudOffset - 3);
    placeInSpace(get('HorizontalText16'), SECONDCITY + 105, 0, cloudOffset - 5);
    placeInSpace(get('HorizontalText17'), SECONDCITY + 120, 0, cloudOffset - 10);
    placeInSpace(get('HorizontalText18'), SECONDCITY + 125, 0, cloudOffset - 3);
    placeInSpace(get('HorizontalText19'), SECONDCITY + 135, 0, cloudOffset - 5);

    placeInSpace(get('HorizontalText20'), THIRDCITY, 0, -100);
    placeInSpace(get('HorizontalText21'), THIRDCITY + 20, 0, cloudOffset + 2);
    placeInSpace(get('HorizontalText22'), THIRDCITY + 50, 0, cloudOffset + 2);
    placeInSpace(get('HorizontalText23'), THIRDCITY + 77, 0, cloudOffset - 20);
    placeInSpace(get('HorizontalText24'), THIRDCITY + 95, 0, cloudOffset - 10);
    placeInSpace(get('HorizontalText25'), THIRDCITY + 120, 0, cloudOffset - 3);
    placeInSpace(get('HorizontalText26'), THIRDCITY + 150, 0, cloudOffset - 5);

    placeInSpace(get('EndeLink'), ENDPOS + 1.2, 0, cloudOffset - 5);
    placeInSpace(get('Ende'), ENDPOS + 1.2, 0, cloudOffset - 5);


    placeInSpace(logo, 0, VERTICAL, -31);
    placeInSpace(arrowBottom, 0, VERTICAL, -33);
    placeInSpace(arrowTop, 0, VERTICAL, -30);

    backCity2.opacity = 0;
    get('Mask').opacity = 0;
    get('OtherSkiesIllustratorOnly').opacity = 0;

    sky.setDepth(-2);

    this.placeCity(buildings1, FIRSTCITY);
    this.placeCity(buildings2, SECONDCITY);
    this.placeCity(buildings3, THIRDCITY);

    // Setup clouds
    this.cloudMover('Cloud1', -400, cloudOffset, this.perspTimeline);
    this.cloudMover('Cloud2', -900, cloudOffset + 4, this.perspTimeline);
    this.cloudMover('Cloud3',  400, cloudOffset + 8, this.perspTimeline);
    this.cloudMover('Cloud4',  400, cloudOffset + 12, this.perspTimeline);
    this.cloudMover('Cloud5', -500, cloudOffset + 16, this.perspTimeline);

    var that = this;

    this.newTween('FrontCity1', this.perspTimeline)
        .add( -46, {opacity: 0})
        .add( -45,  { y: 350, disableParallax: true, opacity: 1 }, createjs.Ease.cubicOut)
        //.add( -25,  { y: 20, disableParallax: true })
        .add( 0,    { y: 0, disableParallax: false }, createjs.Ease.cubicOut).call(function () {
          that.perspTimeline.removeTween(that.get('FrontCity1'));
         })
        .add(6.9, {opacity: 1})
        .add(7, {opacity: 0});

    this.newTween('FrontCity2', this.perspTimeline)
        .add( 90,  { x: 600, disableParallax: false, opacity: 0 })
        .add( 91,  { x: 600, disableParallax: true, opacity: 1 })
        .add( 125, { x: 50, disableParallax: true })
        .add( 170, { x: 30, disableParallax: true })
        .add( SECONDCITY-1, { x: 0, disableParallax: true })
        .add( SECONDCITY,   { x: 0, disableParallax: false })
        .add( SECONDCITY + 35, { x: 0, disableParallax: false, opacity: 0 });


  this.newTween('VerticalText5', this.perspTimeline)
      .add( -3,  { opacity: 1})
      .add( -0.2,  { opacity: 0});

    this.newTween('HorizontalText26', this.perspTimeline)
        .add( 489,  { x: 0, disableParallax: false})
        .add( 490,  { x: 0, disableParallax: true});

    this.newTween('FrontCity3', this.perspTimeline)
        .add( THIRDCITY -20,  { opacity: 0 })
        .add( THIRDCITY -19,  { opacity: 1 })
        .add( THIRDCITY +19,  { opacity: 1 })
        .add( THIRDCITY +20,  { opacity: 0 });


    this.newTween('City1Wrapper', this.perspTimeline)
        .add( VERTICAL + 25, { opacity: 0 })
        .add( VERTICAL + 40, { opacity: 1 })
        .add( FIRSTCITY + 45, { opacity: 1 })
        .add( FIRSTCITY + 95, { opacity: 0 });

    this.newTween('City2Wrapper', this.perspTimeline)
        .add( FIRSTCITY + 45, { opacity: 0 })
        .add( FIRSTCITY + 70, { opacity: 1 })
        .add( SECONDCITY + 10, { opacity: 1 })
        .add( SECONDCITY + 85, { opacity: 0 });

    this.newTween('City3Wrapper', this.perspTimeline)
        .add( SECONDCITY + 20, { opacity: 0 })
        .add( SECONDCITY + 85, { opacity: 1 })
        .add( THIRDCITY + 20, { opacity: 1 })
        .add( THIRDCITY + 45, { opacity: 0 });

    this.newTween('BackCity1', this.perspTimeline)
        .add( -13, { opacity: 0 })
        .add( -5, { opacity: 1 })
        .add( FIRSTCITY + 45, { opacity: 1 })
        .add( FIRSTCITY + 95, { opacity: 0 });

    this.newTween('BackCity2', this.perspTimeline)
        .add( FIRSTCITY + 80,  { opacity: 0 })
        .add( SECONDCITY - 45, { opacity: 1 })
        .add( SECONDCITY + 10, { opacity: 1 })
        .add( SECONDCITY + 45, { opacity: 0 });

    this.newTween('BackCity3Wrapper', this.perspTimeline)
        .add( SECONDCITY + 55,  { opacity: 0 })
        .add( THIRDCITY - 25, { opacity: 1 })
        .add( THIRDCITY + 25, { opacity: 1 })
        .add( THIRDCITY + 50, { opacity: 0 });


    this.newTween('Moon', this.perspTimeline)
        .add( VERTICAL + 30,  { opacity: 0 })
        .add( VERTICAL + 45,  { opacity: 1 })
        .add( FIRSTCITY + 45,  { opacity: 1 })
        .add( FIRSTCITY + 140, { opacity: 0 });

    this.newTween('ArrowBottom', this.perspTimeline)
        .add( VERTICAL,  { opacity: 1 })
        .add( VERTICAL + 2.5, { opacity: 0 });

    this.newTween('ArrowTop', this.perspTimeline)
        .add( VERTICAL,  { opacity: 1 })
        .add( VERTICAL + 2.5, { opacity: 0 });

    this.newTween('Smoke', this.perspTimeline)
        .add( VERTICAL + 35,  { opacity: 0 })
        .add( -5, { opacity: 0.45 });

    this.newTween('SkyColor', this.perspTimeline)
        .add( FIRSTCITY + 45,  { fill: '#1F1F1B' })
        .add( FIRSTCITY + 180, { fill: '#151528' })
        .add( THIRDCITY - 30,  { fill: '#BCD9CB' })
        .add( THIRDCITY + 75,  { fill: '#BCD9CB' })
        .add( FOURTHCITY - 40, { fill: '#BA958D' });

    this.newTween('Earth', this.perspTimeline)
        .add( FIRSTCITY + 45,  { fill: '#E5CECE' })
        .add( FIRSTCITY + 180, { fill: '#82888A' });

    this.newTween('Earth', this.perspTimeline)
        .add( -50,  { opacity: 1 })
        .add( -30,  { opacity: 1 })
        .add( -10,  { opacity: 0 })


    // Last call
    // Start on top (-400)
    var lastPos = new Two.Vector().copy(this.curPos);

    this.movePerspective(this.curPos);

  }

};


_.extend(Irene.prototype, IreneProto);
