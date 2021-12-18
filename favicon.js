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

async function favicon(icon, mode) {
  if (icon == null || icon == "") {
    throw new Error('No icon provided!');
  };
  var mod = mode || "png";
  var favicon = document.querySelector("link[rel~='icon']");
  if (!favicon) {
    favicon = document.createElement('link');
    favicon.rel = 'shortcut icon';
    favicon.type = 'image/gif';
    document.getElementsByTagName('head')[0].appendChild(favicon);
  };
  /*Check for valid image*/
  if (mod == "base64") {
    const base64regex = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;
    if (base64regex.test(icon)) {
      /*Change icon now*/
      favicon.href = icon;
      if (favicon.href == icon) {
        console.log(`favicon.js: favicon Set successfully!`);
      } else {
        throw new Error('Favicon was not set!');
      };
    };
  } else {
    var validimage = testImage(icon);
    validimage.then(
      function(value) {
        if (value == "success") {
          /*Change icon now*/
          favicon.href = icon;
          if (favicon.href == icon) {
            console.log(`Image: ${icon}, Set successfully!`);
          } else {
            throw new Error('Favicon was not set!');
          };
        } else if (value == "timeout") {
	  throw new Error(`Image: ${icon}, timedout, favicon was not set!`);
        }
      },
      function(error) {
        throw new Error(`Image: ${icon}, is an invalid image, favicon was not set!`);
      }
    );
  }
};
