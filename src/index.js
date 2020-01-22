import { formatTime } from './js/utils/time.js';
import { AudioDescriptor } from './js/audioDescriptor.js';
import './js/fileHandler.js';
import styles from './css/index.css';

let player = document.getElementById('player');
let subtitles = document.getElementById('subtitles');
let descriptions = document.getElementById('descriptions');
let currentTime = document.getElementById('currentTime');

let defaults = {
    src : "https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-576p.mp4",
    poster : "https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-HD.jpg",
    subtitles: "https://cdn.plyr.io/static/demo/View_From_A_Blue_Moon_Trailer-HD.en.vtt",
    descriptions: "/assets/descriptions.AD.vtt",
}

function videoTimeUpdate(e){
    //set controls settings to controls,this make controls show everytime this event is triggered
    player.setAttribute("controls","controls");
    
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
    subtitlesRaw.textContent = vttText;
  });

fetch(defaults.descriptions)
  .then((response) => {
    return response.text()
  })
  .then((vttText) => {
    descriptionsRaw.textContent = vttText;
  });
  

player.addEventListener('timeupdate', videoTimeUpdate, false);

// Setup audio descriptor
new AudioDescriptor(player, false, "audioDesc");