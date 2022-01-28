//Get HTML elements
const videoElement = document.getElementsByClassName('input_video')[0];
const canvasElement = document.getElementsByClassName('output_canvas')[0];
const canvasCtx = canvasElement.getContext('2d');
const sound = document.getElementById('sound');

let leftThumb, leftIndex, leftMiddle, leftRing, leftPinky, rightThumb, rightIndex, rightMiddle, rightRing, rightPinky;

//Reset audio context
document.documentElement.addEventListener('mousedown', () => {
  if (Tone.context.state !== 'running') Tone.context.resume();
});
//Tone.js nodes
const basic = new Tone.PolySynth().toDestination();
let synth = basic;
const casio = new Tone.Sampler({
  urls: {
    A1: "A1.mp3",
    A2: "A2.mp3",
  },
  baseUrl: "https://tonejs.github.io/audio/casio/",
}).toDestination();
const marimba = new Tone.Sampler({
  urls: {
    C4: "Marimba.mp3",
    C5: "Marimba_High.mp3",
  },
  baseUrl: "https://monlim.github.io/Handmutate/audio/marimba/",
}).toDestination();
const plucked_violin = new Tone.Sampler({
  urls: {
    C4: "Plucked_Violin.mp3",
    C5: "Plucked_Violin_High.mp3",
  },
  baseUrl: "https://monlim.github.io/Handmutate/audio/plucked_violin/",
}).toDestination();

sound.addEventListener("change", function(){
  if (sound.value === 'basic'){synth = basic};
  if (sound.value === 'casio'){synth = casio}; 
  if (sound.value === 'marimba'){synth = marimba};
  if (sound.value === 'plucked_violin'){synth = plucked_violin};
});

//Trigger note if index fingers touching
let DoTrigger = false;
let ReTrigger = false;
let MiTrigger = false;
let FaTrigger = false;
let SolTrigger = false;
let LaTrigger = false;
let TiTrigger = false;
let HiDoTrigger = false;
let fingerDistanceActivate = 0.04;
let fingerDistanceDeactivate = 0.05;

function Do(finger1, finger2) {
  if((distance(finger1, finger2)) <= fingerDistanceActivate){
    if(DoTrigger)return;
    DoTrigger = true;
    synth.triggerAttackRelease(["C4"], 0.5);
  }
  if((distance(finger1, finger2)) > fingerDistanceDeactivate){
    DoTrigger = false;
  }
};

function Re(finger1, finger2) {
  if((distance(finger1, finger2)) <= fingerDistanceActivate){
    if(ReTrigger)return;
    ReTrigger = true;
    synth.triggerAttackRelease(["D4"], 0.5);
  }
  if((distance(finger1, finger2)) > fingerDistanceDeactivate){
    ReTrigger = false;
  }
};

function Mi(finger1, finger2) {
  if((distance(finger1, finger2)) <= fingerDistanceActivate){
    if(MiTrigger)return;
    MiTrigger = true;
    synth.triggerAttackRelease(["E4"], 0.5);
  }
  if((distance(finger1, finger2)) > fingerDistanceDeactivate){
    MiTrigger = false;
  }
};

function Fa(finger1, finger2) {
  if((distance(finger1, finger2)) <= fingerDistanceActivate){
    if(FaTrigger)return;
    FaTrigger = true;
    synth.triggerAttackRelease(["F4"], 0.5);
  }
  if((distance(finger1, finger2)) > fingerDistanceDeactivate){
    FaTrigger = false;
  }
};

function Sol(finger1, finger2) {
  if((distance(finger1, finger2)) <= fingerDistanceActivate){
    if(SolTrigger)return;
    SolTrigger = true;
    synth.triggerAttackRelease(["G4"], 0.5);
  }
  if((distance(finger1, finger2)) > fingerDistanceDeactivate){
    SolTrigger = false;
  }
};

function La(finger1, finger2) {
  if((distance(finger1, finger2)) <= fingerDistanceActivate){
    if(LaTrigger)return;
    LaTrigger = true;
    synth.triggerAttackRelease(["A4"], 0.5);
  }
  if((distance(finger1, finger2)) > fingerDistanceDeactivate){
    LaTrigger = false;
  }
};

function Ti(finger1, finger2) {
  if((distance(finger1, finger2)) <= fingerDistanceActivate){
    if(TiTrigger)return;
    TiTrigger = true;
    synth.triggerAttackRelease(["B4"], 0.5);
  }
  if((distance(finger1, finger2)) > fingerDistanceDeactivate){
    TiTrigger = false;
  }
};

function HiDo(finger1, finger2) {
  if((distance(finger1, finger2)) <= fingerDistanceActivate){
    if(HiDoTrigger)return;
    HiDoTrigger = true;
    synth.triggerAttackRelease(["C5"], 0.5);
  }
  if((distance(finger1, finger2)) > fingerDistanceDeactivate){
    HiDoTrigger = false;
  }
};

//general distance calculator
function distance(point1, point2) {
  return Math.sqrt(((point1.x - point2.x)**2)+((point1.y - point2.y)**2))
};

function onResults(results) {
  //Draw Hand landmarks on screen
  canvasCtx.save();
  canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
  canvasCtx.drawImage(
      results.image, 0, 0, canvasElement.width, canvasElement.height);
  if (results.multiHandLandmarks && results.multiHandedness) {
    for (let index = 0; index < results.multiHandLandmarks.length; index++) {
      const classification = results.multiHandedness[index];
      const isRightHand = classification.label === 'Right';
      const landmarks = results.multiHandLandmarks[index];      
      drawConnectors(
          canvasCtx, landmarks, HAND_CONNECTIONS,
          {color: isRightHand ? '#fff' : '#056df5'}),
      drawLandmarks(canvasCtx, landmarks, {
        color: isRightHand ? '#fff' : '#056df5',
        fillColor: isRightHand ? '#056df5' : '#fff',
        radius: (x) => {
          return lerp(x.from.z, -0.15, .1, 10, 1);
        }
      });
    if (isRightHand === false){
      leftThumb = landmarks[4];
      leftIndex = landmarks[8];
      leftMiddle = landmarks[12];
      leftRing = landmarks[16];
      leftPinky = landmarks[20];
      } else {
      rightThumb = landmarks[4];
      rightIndex = landmarks[8];
      rightMiddle = landmarks[12];
      rightRing = landmarks[16];
      rightPinky = landmarks[20];
    }
    canvasCtx.restore();
    if(leftThumb && leftIndex) {Do(leftThumb, leftIndex)};
    if(leftThumb && leftMiddle) {Re(leftThumb, leftMiddle)};
    if(leftThumb && leftRing) {Mi(leftThumb, leftRing)};
    if(leftThumb && leftPinky) {Fa(leftThumb, leftPinky)};
    if(rightThumb && rightIndex) {Sol(rightThumb, rightIndex)};
    if(rightThumb && rightMiddle) {La(rightThumb, rightMiddle)};
    if(rightThumb && rightRing) {Ti(rightThumb, rightRing)};
    if(rightThumb && rightPinky) {HiDo(rightThumb, rightPinky)};
    };
  };
};

const hands = new Hands({locateFile: (file) => {
  return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
}});

hands.setOptions({
  selfieMode: true,
  maxNumHands: 2,
  modelComplexity: 1,
  minDetectionConfidence: 0.5,
  minTrackingConfidence: 0.5
});

hands.onResults(onResults);

const camera = new Camera(videoElement, {
  onFrame: async () => {
    await hands.send({image: videoElement});
  },
  width: 1280,
  height: 720
});
camera.start();