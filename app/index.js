import { units } from "user-settings";
import { Barometer } from "barometer";
import { display } from "display";
import document from "document";
import { HeartRateSensor } from "heart-rate";
import { geolocation } from "geolocation";
import clock from "clock";




let hourHand = document.getElementById("hours");
let minHand = document.getElementById("mins");
//let secHand = document.getElementById("secs");


const locLoData = document.getElementById("locLo-data");
const locLaData = document.getElementById("locLa-data");


const altData = document.getElementById("alt-data");

const bpsLabel = document.getElementById("bps-label");
const bpsData = document.getElementById("bps-data");

const gyroLabel = document.getElementById("gyro-label");
const gyroData = document.getElementById("gyro-data");

const hrmLabel = document.getElementById("hrm-label");
const hrmData = document.getElementById("hrm-data");

const orientationLabel = document.getElementById("orientation-label");
const orientationData = document.getElementById("orientation-data");

const sensors = [];


/* Clock -- Start */

// Tick every second
clock.granularity = "minutes";

// Returns an angle (0-360) for the current hour in the day, including minutes
function hoursToAngle(hours, minutes) {
  let hourAngle = (360 / 12) * hours;
  let minAngle = (360 / 12 / 60) * minutes;
  return hourAngle + minAngle;
}

// Returns an angle (0-360) for minutes
function minutesToAngle(minutes) {
  return (360 / 60) * minutes;
}

// Returns an angle (0-360) for seconds
function secondsToAngle(seconds) {
  return (360 / 60) * seconds;
}

// Rotate the hands every tick
function updateClock() {
  let today = new Date();
  let hours = today.getHours() % 12;
  let mins = today.getMinutes();
//  let secs = today.getSeconds();

  hourHand.groupTransform.rotate.angle = hoursToAngle(hours, mins);
  minHand.groupTransform.rotate.angle = minutesToAngle(mins);
//  secHand.groupTransform.rotate.angle = secondsToAngle(secs);
}

clock.addEventListener("tick", updateClock);

/* Clock -- END */

/* Geolocation -- START */

//Showing GeoLocation using GPS
if(geolocation){
  geolocation.getCurrentPosition(function(position) {
    // locLoData.text = (position.coords.longitude < 0) ? "W " + position.coords.longitude : "E " + position.coords.longitude;
     var Longi = Math.round(position.coords.longitude);
     var EorW = Longi < 0 ? "W":"E";
    
     // locLaData.text = "La:" + position.coords.latitude;
     var Lati = Math.round(position.coords.latitude);
     var NorS = Lati < 0 ? "S":"N";
     locLoData.text = Math.abs(Longi) + "\xB0 " + EorW + ":" + Math.abs(Lati) + "\xB0 " + NorS;
     //locLaData.text = Math.abs(Lati) + "\xB0 " + NorS;
  })
} else {
   locLoData.style.display = "none";
   //locLaData.style.display = "none";
}

//Showing Altitude using barometer
if (Barometer) {
  const barometer = new Barometer({ frequency: 1 });
  barometer.addEventListener("reading", () => {
    //altData.text = "Al:" + barometer.pressure ? altitudeFromPressure(barometer.pressure).toLocaleString() : 0 ;
    altData.text = altitudeFromPressure(barometer.pressure) ;
  });
  sensors.push(barometer);
  barometer.start();
} else {
    altData.style.display = "none";
}

//Convert pressure into altitude
function altitudeFromPressure (pressure){
  //in Feet
  console.log (pressure);
  var altInFt = Math.abs((1 - (pressure/1013.25)**0.190284)*145366.45); 
  if (units.height == "us") {
    return altInFt.toLocaleString() + " ft";
    } else {
    // in meters
    return (altInFt * 0.3048).toLocaleString() + " m";
  }
}


/* Geolocation -- END */

/* Heart Rate -- START */
if (HeartRateSensor) {
  const hrm = new HeartRateSensor({ frequency: 1 });
  hrm.addEventListener("reading", () => {
    hrmData.text = hrm.heartRate + " BPM";
  });
  sensors.push(hrm);
  hrm.start();
} else {
  hrmData.style.display = "none";
}

/* Heart Rate -- END *?
/*
if (BodyPresenceSensor) {
  const bps = new BodyPresenceSensor();
  bps.addEventListener("reading", () => {
    bpsData.text = JSON.stringify({
      presence: bps.present
    })
  });
  sensors.push(bps);
  bps.start();
} else {
  bpsLabel.style.display = "none";
  bpsData.style.display = "none";
}

if (Gyroscope) {
  const gyro = new Gyroscope({ frequency: 1 });
  gyro.addEventListener("reading", () => {
    gyroData.text = JSON.stringify({
      x: gyro.x ? gyro.x.toFixed(1) : 0,
      y: gyro.y ? gyro.y.toFixed(1) : 0,
      z: gyro.z ? gyro.z.toFixed(1) : 0,
    });
  });
  sensors.push(gyro);
  gyro.start();
} else {
  gyroLabel.style.display = "none";
  gyroData.style.display = "none";
}



if (OrientationSensor) {
  const orientation = new OrientationSensor({ frequency: 60 });
  orientation.addEventListener("reading", () => {
    orientationData.text = JSON.stringify({
      quaternion: orientation.quaternion ? orientation.quaternion.map(n => n.toFixed(1)) : null
    });
  });
  sensors.push(orientation);
  orientation.start();
} else {
  orientationLabel.style.display = "none";
  orientationData.style.display = "none";
}
*/

display.addEventListener("change", () => {
  // Automatically stop all sensors when the screen is off to conserve battery
  display.on ? sensors.map(sensor => sensor.start()) : sensors.map(sensor => sensor.stop());
});


