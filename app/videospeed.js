var button = document.getElementById("speed_button");
var speed_dropdown = document.getElementById("speed_dropdown");
var custom_speed = document.getElementById("custom_speed");
var custom_speed_label = document.getElementById("custom_speed_label");

function video_speed() {
  var media_source = document.assignment.medias[0].source;
  var speed = parseFloat(speed_dropdown.value);

  //update the dropdown/slider
  if (speed == -1) {
    custom_speed.hidden = false;
    custom_speed_label.hidden = false;
    speed = parseFloat(custom_speed.value);

    if (media_source == "edpuzzle") {
      custom_speed.min = 0.1;
      custom_speed.max = 16;
      custom_speed.step = 0.1;
      custom_speed_label.innerHTML = "Speed: "+speed.toFixed(1);
    }
    else if (media_source == "youtube") {
      custom_speed.min = 0.25;
      custom_speed.max = 2;
      custom_speed.step = 0.05;
      custom_speed_label.innerHTML = "Speed: "+speed.toFixed(2);
    }
  }
  else {
    custom_speed.hidden = true;
    custom_speed_label.hidden = true;
  }

  //force changing the video speed
  if (media_source == "edpuzzle") {
    let video = opener.document.querySelector("video");
    Object.getOwnPropertyDescriptor(HTMLMediaElement.prototype, "playbackRate").set.call(video, speed);
    try {
      Object.defineProperty(video, "playbackRate", {writable: false});
    }
    catch (e) {}
  }
  
  else if (media_source == "youtube") {
    let iframe = opener.document.querySelector("iframe");
    
    if (iframe.id == null) {
      alert("Error: Could not find the Youtube iframe.");
    }
    
    else {
      let player = opener.YT.get(iframe.id);
      let events;
      //search for attribute that stores yt event listeners
      for (let key of Object.keys(player)) {
        let item = player[key];
        if (item && Array.isArray(item.h)) {
          events = item.h;
        }
      }
      for (let i=1; i<events.length; i+=3) {
        let event = events[i];
        if (event == "onPlaybackRateChange") {
          events[i+1] = function(){};
        }
      }
      player.setPlaybackRate(speed);
    }
  }
  
  else {
    alert("Error: Unrecognized video source.");
  }
}