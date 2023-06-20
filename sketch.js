let hh, sn, kd; //container for audio files
let hPat, sPat, kPat; //array of 1s and 0s to play or not 
let hPhrase, sPhrase, kPhrase; //phrase. Defines how pattern is interpreted 
let seq; //Part. transport and controls. 

let toggleStart; //start/stop button

let beats, beatIndex;

let cnv;

let SeqPat;

function setup() {
  cnv = createCanvas(400, 100);
  cnv.mousePressed(canvasClicked);

  beats = 16;

  toggleStart = createButton('start/stop').position(10, height + 10).mousePressed(() => {
    if (!seq.isPlaying) {
      if (!audioInitialized) {
        initializeAudio(); // Initialize audio only if it hasn't been initialized before
        audioInitialized = true; // Set the flag to true
      }
      seq.loop();
      toggleStart.html('Playing');
    } else {
      seq.stop();
      toggleStart.html('Stopped');
    }
  });


  //load sound    file path        
  hh = loadSound('assets/hh.wav');
  sn = loadSound('assets/sn.wav');
  kd = loadSound('assets/kd.wav');


  //pattern 
  hPat = [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0];
  sPat = [0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1];
  kPat = [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0];

  seqPat = [];
  for (let i = 1; i < beats + 1; i++) {
    seqPat.push(i);
  }


  //play when the pattern is a 1 and not when its a 0  
  //                      sample   loop in time   
  hPhrase = new p5.Phrase('hh', function (time)
  //play it     use thehPat array                   
  { hh.play(time); }, hPat);
  sPhrase = new p5.Phrase('sn', function (time) { sn.play(time); }, sPat);
  kPhrase = new p5.Phrase('kd', function (time) { kd.play(time); }, kPat);


  seq = new p5.Part();

  seq.addPhrase(hPhrase);
  seq.addPhrase(sPhrase);
  seq.addPhrase(kPhrase);



  //sequence stepper 
  seq.addPhrase('seq', sequence, seqPat);

  // the callback function is given 2 args, time and the index value of teh array frpm the 3rd arg. 

  // seq.BPM(80); 

  drawMatrix();
  drawPlayhead();

}

function draw() {

}
function canvasClicked() {
  let rowClicked = floor(mouseY / height * 3);
  console.log(rowClicked);

  let columnClicked = floor(mouseX / width * beats)
  console.log(columnClicked);

  //edit hh 
  if (rowClicked == 0) {
    hPat[columnClicked] = invert(hPat[columnClicked]);
  } else if (rowClicked == 1) {
    sPat[columnClicked] = invert(sPat[columnClicked]);
  } else if (rowClicked == 2) {
    kPat[columnClicked] = invert(kPat[columnClicked]);
  }

  drawMatrix();
}


function invert(inputBit) {
  if (inputBit == 0) { return 1 } else { return 0 };

}

function drawMatrix() {
  background(220);
  stroke('grey');
  fill('grey');

  //vertical grid 
  for (let i = 0; i < beats; i++) {
    line(i * width / beats, 0, i * width / beats, height);
  }

  //horizontal grid 
  for (let i = 0; i < 3; i++) {
    line(0, i * height / 3, width, i * height / 3)
  }

  for (let i = 0; i < beats; i++) {

    if (hPat[i] == 1) {
      ellipse(i * width / beats + width / beats * 0.5, 1 / 6 * height, 10);
    }

    if (sPat[i] == 1) {
      ellipse(i * width / beats + width / beats * 0.5, 3 / 6 * height, 10);
    }

    if (kPat[i] == 1) {
      ellipse(i * width / beats + width / beats * 0.5, 5 / 6 * height, 10);
    }
  }

}


function sequence(time, beatIndex) {
  setTimeout(() => {
    drawMatrix();
    drawPlayhead(beatIndex);
  }, time * 1000);

}

function drawPlayhead(beatIndex) {
  //rectangle

  // beatIndex = 0; 
  fill(255, 0, 0, 70);
  stroke('red');
  rect(width / beats * beatIndex, 0, width / beats, height);

}