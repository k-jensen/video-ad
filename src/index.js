import { formatTime } from './js/utils/time.js';
import { AudioDescriptor } from './js/audioDescriptor.js';
import { testVTT } from './js/testVTT.js';
import { saveAs } from 'file-saver';
import webvtt from 'node-webvtt';
import './js/fileHandler.js';
import styles from './css/index.css';
import CodeMirror from 'codemirror';
import overlayMode from 'codemirror/addon/mode/overlay.js'

let player = document.getElementById('player');

let subtitles = document.getElementById('subtitles');
let subtitlesList = document.getElementById('subtitlesList');
let subtitlesStatus = document.getElementById('subtitlesStatus');
let subtitlesRaw = document.getElementById('subtitlesRaw');
let subtitlesPreview = document.getElementById('subtitlesPreview');
let subtitlesBlob = null;
let subtitlesFilename = document.getElementById('subtitlesFilename');

let descriptions = document.getElementById('descriptions');
let descriptionsList = document.getElementById('descriptionsList');
let descriptionsStatus = document.getElementById('descriptionsStatus');
let descriptionsRaw = document.getElementById('descriptionsRaw');
let descriptionsPreview = document.getElementById('descriptionsPreview');
let descriptionsBlob = null;
let descriptionsFilename = document.getElementById('descriptionsFilename');

let audioDesc = document.getElementById('audioDesc');
let currentTime = document.getElementById('currentTime');

let defaults = {
  src: "https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-576p.mp4",
  poster: "https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-HD.jpg",
  subtitles: "https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-HD.en.vtt",
  descriptions: "/assets/descriptions.AD.vtt",
}

CodeMirror.defineMode("vtt", function (config, parserConfig) {
  var vttOverlay = {
    token: function (stream, state) {

      if (stream.match("WEBVTT")) {
        return "vtt-head"
      }

      let re = /(((\d\d):(\d\d).(\d\d\d)) --> ((\d\d):(\d\d).(\d\d\d)))|(((\d\d):(\d\d):(\d\d).(\d\d\d)) --> ((\d\d):(\d\d):(\d\d).(\d\d\d)))/
      if (stream.match(re)) {
        return 'vtt-arrow'
      }

      while (stream.next() != null) { }
      return null;
    }
  };
  return CodeMirror.overlayMode(CodeMirror.getMode(config, parserConfig.backdrop || "text/plain"), vttOverlay);
});

function videoTimeUpdate(e) {
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

    let editor = CodeMirror.fromTextArea(subtitlesRaw, {
      lineNumbers: true,
      value: vttText,
      mode: 'vtt'
    });

    editor.on('change', event => {
      editor.save();
      testVTT('subtitles', subtitles, editor.getValue(), subtitlesList, subtitlesStatus, subtitlesCues, subtitlesPreview, updatePreview)
    })
    editor.on('drop', event => {
      // let file = event.dataTransfer.items[0].name;
      console.log('DROPPED', event)
      editor.setValue('');
    })
    testVTT('subtitles', subtitles, editor.getValue(), subtitlesList, subtitlesStatus, subtitlesCues, subtitlesPreview, updatePreview)
  });

fetch(defaults.descriptions)
  .then((response) => {
    return response.text()
  })
  .then((vttText) => {
    descriptionsRaw.value = vttText;
    let editor = CodeMirror.fromTextArea(descriptionsRaw, {
      lineNumbers: true,
      value: vttText,
      mode: 'vtt'
    });

    editor.on('change', event => {
      editor.save();
      testVTT('descriptions', descriptions, editor.getValue(), descriptionsList, descriptionsStatus, descriptionsCues, descriptionsPreview, updatePreview)
    })
    editor.on('drop', event => {
      console.log('DROPPED', event)
      editor.setValue('');
    })
    testVTT('descriptions', descriptions, editor.getValue(), descriptionsList, descriptionsStatus, descriptionsCues, descriptionsPreview, updatePreview)
  });

let updatePreview = (mode, input) => {
  const segmentDuration = 10; // default to 10
  const startOffset = 0; // Starting MPEG TS offset to be used in timestamp map, default 900000
  // element.textContent = "";
  let track, btn, filename;
  if (mode === 'subtitles') {
    track = subtitles;
  }

  if (mode === 'descriptions') {
    track = descriptions;
  }

  try {
    const parsed = webvtt.parse(input);
    // parsed.cues.forEach(cue => {
    //   let li = document.createElement('li');
    //   li.textContent = cue.text;
    //   element.appendChild(li);
    // })

    let blob = new Blob([input], {
      type: 'text/plain;charset=utf-8'
    });

    const obj_url = window.URL.createObjectURL(blob);
    (mode == 'subtitles') ? subtitlesBlob : descriptionsBlob = obj_url;
    track.src = obj_url;
    // player.play();
    // window.URL.revokeObjectURL(obj_url);
    // const compile = webvtt.compile(parsed); // back to vtt
    // const segmented = webvtt.parse(input, segmentDuration);
    // const playlist = webvtt.hls.hlsSegmentPlaylist(input, segmentDuration);
    // const segments = webvtt.hls.hlsSegment(input, segmentDuration, startOffset);
    // console.log(parsed)
  } catch (err) {
    console.log(err)
  }

}

player.addEventListener('timeupdate', videoTimeUpdate, false);
subtitlesDownload.addEventListener('click', handleClick);
descriptionsDownload.addEventListener('click', handleClick);

function handleClick(event) {
  let content, filename;

  if (event.target === subtitlesDownload) {
    content = subtitlesRaw.value;
    filename = subtitlesFilename.value;
  }
  if (event.target === descriptionsDownload) {
    content = descriptionsRaw.value;
    filename = descriptionsFilename.value
  }
  if (content && filename) {
    var blob = new Blob([content], {
      type: "text/plain;charset=utf-8"
    });
    filename += '.vtt';
    saveAs(blob, filename);
  }
}

// Setup audio descriptor
new AudioDescriptor(player, false, "audioDesc");