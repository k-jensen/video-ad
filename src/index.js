import { formatTime } from './js/utils/time.js';
import { AudioDescriptor } from './js/audioDescriptor.js';
import { testVTT } from './js/testVTT.js';
import { saveAs } from 'file-saver';
import webvtt from 'node-webvtt';
import './js/fileHandler.js';
import styles from './css/index.css';
import CodeMirror from 'codemirror';
import overlayMode from 'codemirror/addon/mode/overlay.js'
import searchCursor from 'codemirror/addon/search/searchcursor.js'
import markSelection from 'codemirror/addon/selection/mark-selection.js'

let player = document.getElementById('player');

let subtitlesSection = document.querySelector('.subtitles');
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
      mode: 'vtt',
      styleSelectedText: true
    });

    editor.on('change', event => {
      let errorMarkers = testVTT('subtitles', editor.getValue(), updatePreview)
      if(errorMarkers){
        editor.eachLine(line => {
          editor.removeLineClass(line, "background", "styled-background")  
        })

        // editor.getAllMarks(mark => {
        //   mark.clear();
        // })

        errorMarkers.forEach(marker => {
          console.log(marker)
        
          // if(!marker.ch){
            editor.addLineClass(marker.line - 1, "background", "styled-background")  
          // }else{
            // let from = {line: marker.line - 1, ch: marker.ch};
            // let to = {line: marker.line - 1, ch: marker.ch + 1};
            // editor.markText(from, to, {className: "styled-background"});
          // }
        })
      }
      editor.save();
    })
    editor.on('drop', event => {
      // let file = event.dataTransfer.items[0].name;
      console.log('DROPPED', event)
      editor.setValue('');
    })
    testVTT('subtitles', editor.getValue(), updatePreview)
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
      mode: 'vtt',
      styleSelectedText: true
    });

    editor.on('change', event => {
      editor.save();
      testVTT('descriptions', editor.getValue(), updatePreview)
    })
    editor.on('drop', event => {
      console.log('DROPPED', event)
      editor.setValue('');
    })
    testVTT('descriptions', editor.getValue(), updatePreview)
  });

let updatePreview = (mode, valid, result) => {
  
  let trackEl, statusEl, messageListEl;
  
  if (mode === 'subtitles') {
    trackEl = subtitles;
    statusEl = subtitlesStatus;
    messageListEl = subtitlesPreview;
  }

  if (mode === 'descriptions') {
    trackEl = descriptions;
    statusEl = descriptionsStatus;
    messageListEl = descriptionsPreview;
  }

  messageListEl.textContent = "";
  statusEl.textContent = result.status;

  // Set updated subtitles/descriptions as src
  if(valid){

    let blob = new Blob([result.input], {
      type: 'text/vtt;charset=utf-8'
    });

    const obj_url = window.URL.createObjectURL(blob);
    trackEl.src = obj_url;

  }else{
    result.messages.forEach(message => {
      let li = document.createElement('li');
      li.textContent = message;
      messageListEl.append(li)
    })

  }

}

player.addEventListener('timeupdate', videoTimeUpdate, false);
subtitlesDownload.addEventListener('click', handleClick);
descriptionsDownload.addEventListener('click', handleClick);
subtitlesSection.addEventListener('drop', event => console.log(event))

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
new AudioDescriptor(player, false, "audioDesc");