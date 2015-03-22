(function() {
  var fb = new Firebase("https://disruptbrunch.firebaseio.com/swaps");
  var swapQueue = [];
  fb.on("child_added", function(snapshot) {
    swapQueue.push(snapshot.val());
  });

  var WIDTH = 800;
  var HEIGHT = 600;
  var DURATION = 3000;
  var container = $(".container");
  container.width(WIDTH).height(HEIGHT);

  function getPos(max) {
    return 50 + Math.random()*(max - 100);
  }

  function renderSwap(s) {
    var swap = $("<div class='swap'></div>");
    var oldElem = $("<div class='old'></div>");
    var newElem = $("<div class='new'></div>");
    oldElem.text(s.old);
    newElem.text(s.new);
    swap.append(oldElem);
    swap.append(newElem);
    container.append(swap);
    var pos = {top: getPos(HEIGHT), left: getPos(WIDTH)};
    swap.css(pos);
    oldElem.animate({opacity: 0}, DURATION, "swing");
    newElem.animate({opacity: 1}, DURATION, "swing", function() {
      swap.remove();
    });
  }

  setInterval(function() {
    var swap = swapQueue.shift();
    if (swap) {
      renderSwap(swap);
    }
  }, 500);
})();