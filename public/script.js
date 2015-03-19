(function() {
  var post = function (url, body) {
  
    var req = new XMLHttpRequest();

    req.onreadystatechange = function () {
      if (req.readyState == 4) console.log("request finished:", req.status, req.responseText);
    };

    req.open("POST", url, true);
    req.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    req.setRequestHeader('Content-Type', 'application/json');
    req.send(JSON.stringify(body));
  };

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
      urlMatch: "google-analytics.com/analytics.js",
      handler: swapNewGoogleAnalytics
    },
    {
      name: "Google Analytics (ga.js)",
      global: "_gaq",
      urlMatch: "google-analytics.com/ga.js",
      handler: swapOldGoogleAnalytics
    }
  ];

  var scripts = document.getElementsByTagName("script");
  scripts = Array.prototype.slice.call(scripts);
  
  targets.forEach(function(target) {
    var script = scripts.filter(function(s) {
      return s.src.indexOf(target.urlMatch) !== -1;
    }).pop();
    if (!script) return;
    console.log("asynchronously found", target.name);
    script.onload = target.handler;
  });

  var swap = (function() {
    var subs = ["BRUNCH", "CATS", "JUICE", "DADA", "SATAN", "PRUFROCK"];
    return function(oldName) {
      var newName = subs[Math.floor(Math.random()*subs.length)];
      post("__HOST__/swap", {"old": oldName, "new": newName});
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