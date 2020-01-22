function getURLParams(){
    const queryString = new URL(window.location).search;
    const searchParams = new URLSearchParams(queryString);

    const videoSrc = searchParams.get("src");
    const posterSrc = searchParams.get("poster");
    const subtitlesSrc = searchParams.get("subtitles");
    const descriptionsSrc = searchParams.get("descriptions");
    const pageTitle = searchParams.get("title");
    
    let player = document.getElementById('player');
    let subtitles = document.getElementById('subtitles');
    let descriptions = document.getElementById('descriptions');
    let title = document.getElementById('title');
    
    let subtitlesRaw = document.getElementById('subtitlesRaw');
    let descriptionsRaw = document.getElementById('descriptionsRaw');
    
    // player.src = './course/en/assets/' + videoSrc;
    // subtitles.src = './course/en/assets/' + subtitlesSrc;
    // descriptions.src = './course/en/assets/' + descriptionsSrc;
    title.textContent = pageTitle;

    // subtitlesRaw.src = './course/en/assets/' + subtitlesSrc;
    // descriptionsRaw.src = './course/en/assets/' + descriptionsSrc;

    // Setup audio descriptor
    new AudioDescriptor(player, false, "audioDesc");

}

getURLParams();