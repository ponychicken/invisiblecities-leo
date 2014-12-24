Irene.prototype.setupWiggle = function() {
  var savePosition = function (name) {
    var wiggled = this.get(name);
    if (wiggled instanceof Two.Group) {
      wiggled = wiggled.getByType(Two.Polygon)
    } else {
      wiggled = [wiggled];
    }

    wiggled.forEach(function(item) {
      item.vertices.forEach(function(anchor) {
        anchor.origin = new Two.Vector().copy(anchor);
      });
    });
    return wiggled;
  };
  savePosition = savePosition.bind(this);

  var wiggle = function (item) {
    for (var i = 0; i < item.vertices.length; i++) {
      var anchor = item.vertices[i];
      var wiggle = (item.z) ? (item.z - 100)/-75 : 1.5;
      anchor._x = anchor.origin.x + Math.random() * wiggle;
      anchor._y = anchor.origin.y + Math.random() * wiggle;
    }
    item._flagVertices = true;
    item._flagLength = true;
  };

  var CityWiggler = savePosition('City1');
  var GolfWiggler = savePosition('City2');
  var CloudWiggler = savePosition('Clouds');
  this.get('Smoke').z = -100;
  var SmokeWiggler = savePosition('Smoke');

  var that = this;

  this.two.bind('update', function(frameCount) {
    if (!(frameCount % 5)) {
      var i = 0;
      // if (that.curPos.x < 90 && that.curPos.y > -20) {
      //   for (i = 0; i < CityWiggler.length; i++) {
      //     wiggle(CityWiggler[i]);
      //   }
      // }
      // if (that.curPos.x > 150) {
      //   for (i = 0; i < GolfWiggler.length; i++) {
      //     wiggle(GolfWiggler[i]);
      //   }
      // }
      for (i = 0; i < CloudWiggler.length; i++) {
        wiggle(CloudWiggler[i]);
      }
      wiggle(SmokeWiggler[0]);
    }
  });
};
