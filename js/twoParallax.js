var enableCaching = function (item) {

  for (var i = 0; i < item.children.length; i++) {
    var child = item.children[i];

    item.cacheEnabled = true;

    if (child instanceof Two.Group) {
      enableCaching(child);
    }
  }
};

var methods = {
  setDepth: function (val) {
    this.z = val;
    return this.enableParallax();
  },
  enableParallax : function () {
    this.classList.push('parallaxEnabled');
    // this.cacheEnabled  = true;
    //
    // console.log('Enabling cache for', this.id, ', it\'s parent:', this.parent.id);

    // if (this instanceof Two.Group) {
    //   //recursively enable caching
    //   enableCaching(this);
    //
    // }

    return this;
  }
};
_.extend(Two.Shape.prototype, methods);
_.extend(Two.Group.prototype, methods, {
  circularDisplace : function (vector, selected) {
    if (!selected) selected = this.getByClassName('parallaxEnabled');
      selected.forEach(function (item) {
        if (item.disableParallax) {
          return;
        }
        var shift = {
          x: vector.x * item.z,
          y: vector.y * item.z
        };
        item.translation.sub(shift, item.origTranslation || Two.Vector.zero);
      });
  }
});
_.extend(Two.Polygon.prototype, methods);
