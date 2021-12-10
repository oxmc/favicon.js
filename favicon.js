function testImage(url) {
  return new Promise(function (resolve, reject) {
    var timeout = 5000;
    var timer, img = new Image();
    img.onerror = img.onabort = function () {
      clearTimeout(timer);
      reject("error");
    };
    img.onload = function () {
      clearTimeout(timer);
      resolve("success");
    };
    timer = setTimeout(function () {
      // reset .src to invalid URL so it stops previous
      // loading, but doesn't trigger new load
      img.src = "//!!!!/test.jpg";
      reject("timeout");
    }, timeout);
    img.src = url;
  });
}

async function favicon(icon) {
  var favicon = document.querySelector("link[rel~='icon']");
  if (!favicon) {
    favicon = document.createElement('link');
    favicon.rel = 'shortcut icon';
    favicon.type = 'image/gif';
    document.getElementsByTagName('head')[0].appendChild(favicon);
  };
  /*Check for valid image*/
  var validimage = testImage(icon);
  validimage.then(
    function(value) {
      if (value == "success") {
        /*Change icon now*/
        favicon.href = icon;
        if (favicon.href == icon) {
          console.log(`Image: ${icon}, Set successfully!`);
        } else {
          console.log(`Image: ${icon}, Was not set!`);
        };
      } else if (value == "timeout") {
        console.log(`Image: ${icon}, timedout, favicon was not set!`);
      }
    },
    function(error) {
      console.log(`Image: ${icon}, is an invalid image, favicon was not set!`);
    }
  );
};
