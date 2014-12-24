Number.prototype.clamp = function(min, max) {
  return Math.min(Math.max(this, min), max);
};

function mapNumber(X, A, B, C, D) {
  return (X - A)/(B - A) * (D - C) + C;
}
_.mixin({
  debounceReduce: function(func, wait, combine) {
    var allargs,
        context,
        wrapper = _.debounce(function() {
            var args = allargs;
            allargs = undefined;
            func.apply(context, args);
        }, wait);
        return function() {
            context = this;
            allargs = combine.apply(context, [allargs,  Array.prototype.slice.call(arguments,0)]);
            wrapper();
        };
    }
});
