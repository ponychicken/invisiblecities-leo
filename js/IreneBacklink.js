Irene.prototype.setupBacklink = function () {
  var button = this.get('EndeLink');
  button.stroke = 'transparent';
  button.children[0].stroke = 'transparent';
  // var button = this.get('EndeText');
  // var that = this;
  // var rect = button.getBoundingClientRect();
  //
  // var invisibleRect = this.two.makeRectangle(rect.left, rect.top, rect.width, rect.height);
  // invisibleRect.fill = 'red';
  // invisibleRect.stroke = 'green';
  // invisibleRect.id = 'border'
  //
  // var cloudOffset = -36;
  // this.placeInSpace(invisibleRect, ENDPOS + 1.2, 0, cloudOffset - 5);


  // this.two.bind('update', function(frameCount) {
  //
  //   if (that.curPos.x > 500) {
  //     rect = button.getBoundingClientRect();
  //
  //
  //
  //   }
  // });


};

Irene.prototype.handleBacklink = function (event) {
  if (this.curPos.x > 500) {
    var button = this.get('EndeLink');
    var rect = button.getBoundingClientRect();


    var tap = event.gesture.startEvent.center;

    if (tap.pageX > rect.left && tap.pageX < rect.right && tap.pageY > rect.top && tap.pageY < rect.bottom) {
      this.reset();
    }
  }
};

Irene.prototype.reset = function (event) {
  if (this.timesResetted > 5) {
    window.location.reload();
  }

  this.curPos.x = 0;
  this.curPos.y = -50;

  this.landed = false;

  this.movePerspective(this.curPos);

  this.timesResetted++;
};
