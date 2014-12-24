/*
* TranslatePlugin
*/

this.createjs = this.createjs||{};

(function() {
  "use strict";

var TranslatePlugin = function() {
  throw("TranslatePlugin cannot be instantiated.")
};


  TranslatePlugin.priority = 0;

  TranslatePlugin.install = function() {
    createjs.Tween.installPlugin(TranslatePlugin, ["x", "y"]);
  };


  TranslatePlugin.init = function(tween, prop, value) {
    return value;
  };

  TranslatePlugin.step = function() {

  };

  TranslatePlugin.tween = function(tween, prop, value) {
		var oldVal = tween.target.translation['_' + prop];
		var newVal = ~~value;

		if (oldVal != newVal) {
			tween.target.translation['_' + prop] = newVal;
			tween.target.translation.trigger(Two.Events.change);
		}

  };

var GradientPlugin = function() {
  throw("GradientPlugin cannot be instantiated.")
};

  GradientPlugin.priority = 0;

  GradientPlugin.install = function() {
    createjs.Tween.installPlugin(GradientPlugin, ["fill"]);
  };


  GradientPlugin.init = function(tween, prop, value) {
    return value;
  };

  GradientPlugin.step = function(tween, prop, startValue, endValue, injectProps) {
    if (!tween.rainbow) {
      tween.rainbow = new Rainbow();
    }
  };

  GradientPlugin.tween = function(tween, prop, value, startValues, endValues, ratio, wait, end) {
    tween.rainbow.setSpectrum(startValues[prop], endValues[prop]);
    return '#' + tween.rainbow.colourAt(ratio * 100);
  };


createjs.TranslatePlugin = TranslatePlugin;
createjs.GradientPlugin = GradientPlugin;

TranslatePlugin.install();
GradientPlugin.install();


}());
