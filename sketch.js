let message;
let gameClock;
let pulse;
let start;
let count;
let oldCount;
let flash;
let debug;
let launched;
const TEMPO = 60000 / 172
//const TEMPO = 348.83720930232556;

let osc;

function setup() {
  createCanvas(500, 500);
  angleMode(DEGREES);
  message = "";
  gameClock = "";
  pulse = [];
  start = 0;
  count = 0;
  oldCount = 0;
  flash = true;
  debug = false;
  launched = false;

  osc = new p5.Oscillator('triangle');
}

function draw() {
  background(28);

  if (launched && (millis() - start) >= 60200) {
    drawFinal();
    return;
  }

  if (launched && (millis() - start) >= -60000) {
    count = floor((millis() - start) / TEMPO);
    drawCount(0, 125);
    if (count != oldCount) {
      if (debug) {
        console.log(count);
        console.log(millis() - start);
      }
    }
    if (count >= -16) drawBeat(0, 0);
    oldCount = count;
  }

  setMessage();
  drawClock(100, -120);
  drawPulse(-135, -135);
}

function setMessage() {
  if (launched) {
    let t = abs(floor((millis() - start) / 1000) - 60);
    let s = t % 60;
    if (s < 10) s = "0" + s;
    gameClock = "t-" + floor(t / 60) + ":" + s;
  }

  if (debug) {
    drawDebug();
    message = millis() - start;
  }
  else {
    message = floor((millis() - start) / 100) / 10;
    if (floor((millis() - start) / 100) % 10 == 0) {
      message = message + ".0";
    }
    if (launched) {
      if ((millis() - start < 0)) message = "t" + message;
      else message = "t+" + message
    }
  }
}

function drawClock(x, y) {
  textFont('monospace', 64);
  textAlign(CENTER);

  if (launched) {
    drawGameClock(x, y + 37);
    y -= 37;
  }
  if (launched && millis() - start > 0) {
    colorMode(HSB, 100);
    fill(frameCount % 100, 100, 100);
  }
  colorMode(RGB, 255);
  fill(120);
  if (flash && abs(millis() - start) % 1000 < 50) fill(220);
  rect((width - textWidth(message)) / 2 + x - 5, height / 2 - 54 + y, textWidth(message) + 10, 74)
  fill(220);
  text(message, width / 2 + x, height / 2 + y);
}

function drawGameClock(x, y) {
  textFont('monospace', 64);
  textAlign(CENTER);
  colorMode(RGB, 255);

  fill(120);
  if (flash && abs(millis() - start) % 1000 < 50) fill(220);
  rect((width - textWidth(gameClock)) / 2 + x - 5, height / 2 - 54 + y, textWidth(gameClock) + 10, 74)
  fill(220);
  text(gameClock, width / 2 + x, height / 2 + y);
}

function drawPulse(x, y) {
  if (launched && millis() - start > 0) {
    colorMode(HSB, 100);
    fill(((frameCount) % 100) + 50, 100, 100);
  }
  colorMode(RGB, 255);
  fill(220);
  if (keyIsPressed && keyCode == 32) fill(0, 220, 220);
  circle(width / 2 + x, height / 2 + y, 100);

  let theta = (millis() - start) * 0.36;
  let pointX = 50 * cos(theta - 90);
  let pointY = 50 * sin(theta - 90);
  stroke(28);
  strokeWeight(10);
  line(width / 2 + x, height / 2 + y, width / 2 + x + pointX, height / 2 + y + pointY);
  strokeWeight(0);
}

function drawCount(x, y) {
  textFont('monospace', 64);
  textAlign(CENTER);

  if (count >= 0) count++;

  fill(120);
  rect((width - textWidth(count)) / 2 + x - 5, height / 2 - 54 + y, textWidth(count) + 10, 74)
  fill(220);
  text(count, width / 2 + x, height / 2 + y);
}

function drawBeat(x, y) {
  textFont('monospace', 64);
  textAlign(CENTER);

  let beat;
  switch (count) {
    case -16:
      beat = 1;
      break;
    case -15:
      beat = 1;
      break;
    case -14:
      beat = 2;
      break;
    case -13:
      beat = 2;
      break;
    case -12:
      beat = 1;
      break;
    case -11:
      beat = 2;
      break;
    case -10:
      beat = 3;
      break;
    case -9:
      beat = 4;
      break;
    case -8:
      beat = 1;
      break;
    case -7:
      beat = 1;
      break;
    case -6:
      beat = 2;
      break;
    case -5:
      beat = 2;
      break;
    case -4:
      beat = 1;
      break;
    case -3:
      beat = 2;
      break;
    case -2:
      beat = 3;
      break;
    case -1:
      beat = 4;
      break;
    default:
      beat = count % 4;
      if (beat == 0) beat = 4;
      break;
  }
  
  if (count != oldCount) {
    if (count != -15 && count != -13 && count != -7 && count != -5) {
      osc.start();
      osc.amp(0.25, 0);
      if (count == 173) osc.freq(880, 0.01);
      else if (beat == 1 || count == -6 || count == -14) osc.freq(660, 0.01);
      else osc.freq(440, 0.01);
      osc.amp(0, 0.1);
    }
  }

  let cirX;
  if (beat % 2) {
    fill(220, 0, 0);
    cirX = -100;
  }
  else {
    fill(0, 0, 220);
    cirX = 100;
  }
  circle(width / 2 + cirX + x, height / 2 + y, 50);
  fill(160);
  rect((width - textWidth(beat)) / 2 + x - 5, height / 2 - 29 + y, textWidth(beat) + 10, 74)
  fill(255);
  text(beat, width / 2 + x, height / 2 + y + 25);
}

function drawDebug() {
  textFont('monospace', 32);
  textAlign(LEFT);
  fill(220);
  let str = 'fr: ' + frameRate()
  text(str.slice(0, 12), 10, 200);
}

function drawFinal() {
  textFont('monospace', 64);
  textAlign(CENTER);

  text("Yay?", width / 2, height / 2 - 50);
  text("Did it work?", width / 2, height / 2 + 50);
}

function ofset() {
  if (!pulse.length) return millis();
  let avg = 0;
  pulse.forEach(t => {
    avg += (t % 1000);
  });
  avg /= pulse.length;
  avg = floor(avg);
  return avg;
}

function addPulse() {
  pulse.push(millis());
  start = ofset();
}

function clearPulse() {
  pulse = [];
}

function toggleFlash() {
  flash = !flash;
}

function toggleDebug() {
  debug = !debug;
}

function countdown() {
  flash = false;
  debug = false;
  launched = true;
  start = (floor(millis() / 1000) * 1000) + (start % 1000) + 120000;
}

function fixStart(x) {
  start += x * 1000;
  return "Good Luck!";
}

function keyPressed() {
  if (keyCode == 32 && !launched) addPulse();
  if (keyCode == 37 && launched) start += 1000;
  if (keyCode == 39 && launched) start -= 1000;
  if (keyCode == 40 && launched) start += 10000;
  if (keyCode == 38 && launched) start -= 10000;
  if (keyCode == 65) osc.start();
  else console.log(keyCode);
}
