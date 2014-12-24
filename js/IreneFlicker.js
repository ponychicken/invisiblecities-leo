Irene.prototype.setupFlicker = function() {
  var city1 = this.get('City1');
  var city2 = this.get('City2');
  var city3Back = this.get('BackCity3');
  var copy = this.get('BackCity3Copy');
  var sky = this.get('SkyColor');
  var puddles = this.get('Puddles');
  var whiteFlag = true;

  var flicker = function (items, treshold, strength, fadeback) {
    if (!_.isArray(items)) {
      items = [items];
    }

    treshold = treshold || 0.01;
    strength = strength || 1.5;
    fadeback = fadeback || 0.15;

    // True in 1 out of 10
    var lottery = (Math.random() < treshold);

    if (lottery) {
      var opac = 1 - Math.random() / strength;
      items.forEach(function (item) {
        item.opacity = opac;
      });
    } else if (items[0].opacity < 1) {
      items.forEach(function (item) {
        item.opacity = Math.min(1, item.opacity + fadeback);
      });
    }

  };

  var blink = function () {
    var c = city3Back.children;

    // True in 1 out of 10
    var lottery = (Math.random() < 0.002);

    if (lottery) {
      if (!whiteFlag) {
        white();
      } else {
        black();
      }
    }

    function white () {
      //Mountains
      c[0].fill = '#CDD1A7';
      //Hills
      c[1].fill = '#E7E8B5';
      //Earth
      c[2].fill = '#fff';

      sky.fill = '#BCD9CB';

      whiteFlag = true;
    };

    function black () {
      //Mountains
      c[0].fill = '#7C7D71';
      //Hills
      c[1].fill = '#474738';
      //Earth
      c[2].fill = '#000';

      sky.fill = '#A63330';

      whiteFlag = false;

      //setTimeout(white, 500);
    };
  };


  var CityFlicker = city1.children.slice();
  var City2Flicker = city2.children.slice();

  var that = this;

  this.two.bind('update', function(frameCount) {
      var i;

      // for (i = 0; i < CityFlicker.length; i++) {
      //   flicker(CityFlicker[i], 0.02, 4);
      // }

      flicker(city1, 0.1, 1.4);


      // for (i = 0; i < City2Flicker.length; i++) {
      //   flicker(City2Flicker[i], 0.05, 3);
      // }
      //
      flicker(city2, 0.1, 1.4);

      if (that.curPos.x > SECONDCITY - 45 && that.curPos.x < SECONDCITY + 45) {
        flicker([sky, puddles], 0.02, 1.1);
      }
      if (that.curPos.x > THIRDCITY - 20 && that.curPos.x < THIRDCITY + 20) {
        blink();
        copy.opacity = 1;
      } else {
        city3Back.opacity = 1;
        copy.opacity = 0;
      }
  });
};
