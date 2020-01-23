import { formatTime } from './js/utils/time.js';
import { AudioDescriptor } from './js/audioDescriptor.js';
import { testVTT } from './js/testVTT.js';
import webvtt from 'node-webvtt';
import './js/fileHandler.js';
import styles from './css/index.css';
import CodeMirror from 'codemirror';

let player = document.getElementById('player');
let subtitles = document.getElementById('subtitles');
let subtitlesList = document.getElementById('subtitlesList');
let subtitlesStatus = document.getElementById('subtitlesStatus');
let subtitlesRaw = document.getElementById('subtitlesRaw');
let subtitlesPreview = document.getElementById('subtitlesPreview');
let descriptions = document.getElementById('descriptions');
let descriptionsList = document.getElementById('descriptionsList');
let descriptionsStatus = document.getElementById('descriptionsStatus');
let descriptionsRaw = document.getElementById('descriptionsRaw');
let currentTime = document.getElementById('currentTime');

let defaults = {
  src: "https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-576p.mp4",
  poster: "https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-HD.jpg",
  subtitles: "https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-HD.en.vtt",
  descriptions: "/assets/descriptions.AD.vtt",
}

function videoTimeUpdate(e) {
  //set controls settings to controls,this make controls show everytime this event is triggered
  // player.setAttribute("controls","controls");

  currentTime.textContent = formatTime(player.currentTime);
}

player.src = defaults.src;
player.poster = defaults.poster;
subtitles.src = defaults.subtitles;
descriptions.src = defaults.descriptions;

fetch(defaults.subtitles)
  .then((response) => {
    return response.text()
  })
  .then((vttText) => {
    subtitlesRaw.value = vttText;
    var editor = CodeMirror.fromTextArea(subtitlesRaw, {
      lineNumbers: true,
      value: vttText
    });
    // testVTT(subtitlesRaw, subtitlesList, subtitlesStatus, subtitlesCues);
    testVTT(subtitlesRaw, subtitlesList, subtitlesStatus, subtitlesCues, subtitlesPreview, updatePreview)
  });

fetch(defaults.descriptions)
  .then((response) => {
    return response.text()
  })
  .then((vttText) => {
    descriptionsRaw.value = vttText;
    // testVTT(descriptionsRaw, descriptionsList, descriptionsStatus, descriptionsCues);
  });




let updatePreview = (element, input) => {
  const segmentDuration = 10; // default to 10
  const startOffset = 0; // Starting MPEG TS offset to be used in timestamp map, default 900000
  element.textContent = "";

  try {
    const parsed = webvtt.parse(input);
    parsed.cues.forEach(cue => {
      let li = document.createElement('li');
      li.textContent = cue.text;
      element.appendChild(li);
    })

    // const compile = webvtt.compile(parsed); // back to vtt
    // const segmented = webvtt.parse(input, segmentDuration);
    // const playlist = webvtt.hls.hlsSegmentPlaylist(input, segmentDuration);
    // const segments = webvtt.hls.hlsSegment(input, segmentDuration, startOffset);
    console.log(parsed)
  } catch (err) {
    console.log(err)
  }

}

player.addEventListener('timeupdate', videoTimeUpdate, false);
subtitlesRaw.addEventListener('input', event => testVTT(subtitlesRaw, subtitlesList, subtitlesStatus, subtitlesCues, subtitlesPreview, updatePreview));
// descriptionsRaw.addEventListener('input', event => testVTT(descriptionsRaw, descriptionsList, descriptionsStatus, descriptionsCues));

// Setup audio descriptor
new AudioDescriptor(player, false, "audioDesc");