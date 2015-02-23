(function() {
  var targets = [
    {
      name: "Mixpanel",
      global: "mixpanel",
      urlMatch: "mxpnl.com",
      handler: swapMixpanel
    },
    {
      name: "Google Analytics (analytics.js)",
      global: "ga",
      urlMatch: "www.google-analytics.com",
      handler: swapNewGoogleAnalytics
    },
    {
      name: "Google Analytics (ga.js)",
      global: "_gaq",
      handler: swapOldGoogleAnalytics
    }
  ];

  var scripts = document.getElementsByTagName("script");
  scripts = Array.prototype.slice.call(scripts);
  
  targets.forEach(function(target) {
    // Immediately run handler script if global is found.
    if (window[target.global]) {
      console.log("synchronously found", target.name);
      return target.handler();
    // If the script instead loads asynchronously, we can instead
    // wait for it to load before running our handler.
    // TODO: Do we need this at all?
    } else if (target.urlMatch) {
      console.log("asynchronously found", target.name);
      var script = scripts.filter(function(s) {
        return s.src.indexOf(target.urlMatch) !== -1;
      }).pop();
      if (!script) return;
      script.onload = target.handler;
    }

  });

  var swap = (function() {
    var subs = ["BRUNCH", "CATS", "JUICE", "DADA", "SATAN", "PRUFROCK"];
    return function(oldName) {
      var newName = newNames[Math.floor(Math.random()*newNames.length)];
      // TODO: replace with handler for visualizer.
      console.log("Swapping", newName, "for", oldName);
      return newName;
    };
  })();

  function swapOldGoogleAnalytics() {
    var oldPush = _gaq.push;
    _gaq.push = function() {
      var args = Array.prototype.slice.call(arguments);
      if (args[0] === "_trackEvent") {
        var oldName = args.slice(1, 4).join("-");
        var newName = swap(oldName);
        args = args.map(function(a, i) {
          // Arg 0 is "_trackEvent"
          // Args 1-3 are "category", "action", and optional "label"
          // Other args are not strings
          return i > 0 && i < 3 ? newName : a;
        });
      }
      oldPush.apply(this, args);
    };
  }

  function swapNewGoogleAnalytics() {
    var oldGA = window.ga;
    window.ga = function() {
      var args = Array.prototype.slice.call(arguments);
      if (args[0] === "send" && args[1] === "event") {
        var oldName = args.slice(2, 5).join("-");
        var newName = swap(oldName);
        args = args.map(function(a, i) {
          // Arg 0 is "send", arg 1 is "event"
          // Args 2-4 are "category", "action", and optional "label"
          // Other args are not strings
          return i > 1 && i < 5 ? newName : a;
        });
      }
      oldGA.apply(this, args);
    };
  }

  function swapMixpanel() {
    var oldTrack = mixpanel && mixpanel.track;
    if (!oldTrack) return;
    mixpanel.track = function(oldName) {
      var newName = swap(oldName);
      var args = Array.prototype.slice.call(arguments);
      args[0] = newName;
      oldTrack.apply(this, args);
    };
  }
})();