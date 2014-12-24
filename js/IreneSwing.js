Irene.prototype.setupSwing = function() {
  var city3 = this.get('City3');

  var swing = function (item) {
    // Swing from -5 to 5
    var pos = (item.swingPos * 0.10) - 0.05;
    item._matrix.identity().skewX(pos).translate(item.translation.x, item.translation.y)
    item._flagMatrix = false;
    item._matrix.manual = true;

    item.rect._matrix.set(item._matrix.elements);

    var boundRect = item.rect.getBoundingClientRect();
    var newLeft = boundRect.left;
    var newRight = boundRect.right;

    item.leftRight = (item.swingPos > 0.5);

    if (item.leftRight) {
      item._matrix.translate(-(newRight - (item.r.right + item.translation.x)) + 1, 0);
    } else {
      item._matrix.translate(-(newLeft - (item.r.left + item.translation.x)), 0);
    }

    if (item.swingPos > 1 || item.swingPos < 0) {
      item.swingPosDirection *= -1;
    }


    item.swingPos += 0.002 * item.swingPosDirection;

  };

  var City3Swing = city3.children.slice();
  //var City3Swing = [this.get('two_1361')];

  for (i = 0; i < City3Swing.length; i++) {
    var r = City3Swing[i].getBoundingClientRect(true);
    City3Swing[i].swingPos = Math.random();
    City3Swing[i].swingPosDirection = 1;

    var d = this.two.makeRectangle(r.left, r.top, r.width, r.height);
    d.fill = "transparent";
    d.stroke="transparent";

    City3Swing[i].rect = d;
    City3Swing[i].r = r;
  }

  var that = this;

  this.two.bind('update', function(frameCount) {
      var i;

      if (that.curPos.x > THIRDCITY - 80 && that.curPos.x < THIRDCITY + 40) {
        for (i = 0; i < City3Swing.length; i++) {
          swing(City3Swing[i]);
        }
      }

  });
};
