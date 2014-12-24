Irene.prototype.setupFlicker = function() {
  var city1 = this.get('City1');
  var city2 = this.get('City2');
  var cityCover = this.get('CityCover');
  var sky = this.get('SkyColor');

  var flicker = function (item, treshold, strength) {
    var treshold = treshold || 0.01
    var strength = strength || 1.5
    // True in 1 out of 10
    var lottery = (Math.random() < treshold);

    if (lottery) {
      item.opacity = Math.random() / strength;
    } else if (item.opacity > 0) {
      item.opacity = Math.max(0, item.opacity - 0.15);
    }

  };

  // var CityFlicker = city1.children.slice();
  // var City2Flicker = city2.children.slice();
      //CityFlicker.push(city1);

  // var GolfWiggler = savePosition('City2');
  // var CloudWiggler = savePosition('Clouds');
  // this.get('Smoke').z = -100;
  // var SmokeWiggler = savePosition('Smoke');



// var elem = Two.SVGRenderer.Utils.createElement('animate', {
//   attributeName: 'opacity',
//   // attributeNS: 'XML',
//   values: '1;0.7;0.7;1;1;1;1;0.2;1;1;1;1;1;1;1;1;1;0.4;1;1;1;1;0.2;1;1;1;1;0.2;1;1;1;1;1;1;0.3;1;1;1;0.4',
//   dur: '0.4s',
//   repeatCount: 'indefinite'
// });

//
// setTimeout(function () {
//   city1._renderer.elem.appendChild(elem)
// },100);




  var that = this;

  this.two.bind('update', function(frameCount) {
      var i;

      // for (i = 0; i < CityFlicker.length; i++) {
      //   flicker(CityFlicker[i], 0.02, 4);
      // }

      flicker(cityCover, 0.1, 1.4);


      // for (i = 0; i < City2Flicker.length; i++) {
      //   flicker(City2Flicker[i], 0.05, 3);
      // }
      //
      // flicker(city2, 0.1, 1.4);

      if (that.curPos.x > 210) {
        flicker(sky, 0.02, 1.1);
      }
  });
};
