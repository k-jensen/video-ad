import { formatTime } from './js/utils/time.js';
import { AudioDescriptor } from './js/audioDescriptor.js';
import { saveAs } from 'file-saver';
import webvtt from 'node-webvtt';
import './js/fileHandler.js';
import Editor from './js/editor.js';
import styles from './css/index.css';
import speak from './js/speak.js';

let defaults = {
  src: "https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-576p.mp4",
  poster: "https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-HD.jpg",
  subtitles: "https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-HD.en.vtt",
  descriptions: "/assets/descriptions.AD.vtt",
}

let video = document.getElementById('video');
let currentTime = document.getElementById('currentTime');

let subtitles = document.getElementById('subtitles');
let subtitlesRaw = document.getElementById('subtitlesRaw');
let subtitlesFilename = document.getElementById('subtitlesFilename');

let descriptions = document.getElementById('descriptions');
let descriptionsRaw = document.getElementById('descriptionsRaw');
let descriptionsFilename = document.getElementById('descriptionsFilename');

let subtitlesEditor = new Editor(subtitlesRaw, handleSubtitlesUpdate);
let descriptionsEditor = new Editor(descriptionsRaw, handleDescriptionsUpdate);

video.src = defaults.src;
video.poster = defaults.poster;
subtitles.src = defaults.subtitles;
descriptions.src = defaults.descriptions;
video.volume = 0.5;

fetch(defaults.subtitles)
  .then((response) => {
    return response.text()
  })
  .then((vttText) => {
    subtitlesEditor.setText(vttText)
  });

fetch(defaults.descriptions)
  .then((response) => {
    return response.text()
  })
  .then((vttText) => {
    descriptionsEditor.setText(vttText)
  });

video.addEventListener('timeupdate', videoTimeUpdate, false);
subtitlesDownload.addEventListener('click', handleClick);
descriptionsDownload.addEventListener('click', handleClick);

function videoTimeUpdate(e) {
  currentTime.textContent = formatTime(video.currentTime);
}

function handleSubtitlesUpdate(input){  
  console.log('updating subtitles...')
  
  let blob = new Blob([input], { type: 'text/vtt;charset=utf-8' });
  const obj_url = window.URL.createObjectURL(blob);
  subtitles.src = obj_url;
}

function handleDescriptionsUpdate(input){
  console.log('updating descriptions...')

  let blob = new Blob([input], { type: 'text/vtt;charset=utf-8' });
  const obj_url = window.URL.createObjectURL(blob);
  descriptions.src = obj_url;
}

function handleClick(event) {
  let content, filename;

  if (event.target === subtitlesDownload) {
    content = subtitlesRaw.value;
    filename = subtitlesFilename.value + '.vtt';
  }
  if (event.target === descriptionsDownload) {
    content = descriptionsRaw.value;
    filename = descriptionsFilename.value + '.AD.vtt';
  }
  if (content && filename) {
    var blob = new Blob([content], {
      type: "text/plain;charset=utf-8"
    });
    
    saveAs(blob, filename);
  }
}

// Setup audio descriptor
new AudioDescriptor(video, false, "audioDesc");