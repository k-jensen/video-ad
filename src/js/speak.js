import tts from "basic-tts";

window.speechSynthesis.onvoiceschanged = () => {
    
    let toggleBtn = document.getElementById('audioToggle');
    
    const speak = text => {
        
        if(!toggleBtn.checked) return;

        const speaker = tts.createSpeaker({
            voice: "Google US English",
            lang: "en-US",
            volume: 1,
            pitch: 1,
            rate: 1
        });

        speaker.speak(text).then(() => {
            console.log("The speaker has spoken!");
        }).catch((err) => {
            console.warn(`An error has occurred: ${err}`);
            console.log("Sigh...the speaker did not speak :(");
        });
    };

    
    let targetNode = document.getElementById('audioDesc');
    
    console.log("READY!");
    console.log(window.speechSynthesis.getVoices());
    
    window.speechSynthesis.onvoiceschanged = () => { };


    // Options for the observer (which mutations to observe)
    const config = { attributes: true, childList: true, subtree: true };

    // Callback function to execute when mutations are observed
    const callback = function (mutationsList, observer) {
        // Use traditional 'for loops' for IE 11
        for (let mutation of mutationsList) {
            if (mutation.type === 'childList') {
                speak(targetNode.textContent)
                console.log('A child node has been added or removed.');

            }
            else if (mutation.type === 'attributes') {
                console.log('The ' + mutation.attributeName + ' attribute was modified.');
            }
        }
    };

    // Create an observer instance linked to the callback function
    const observer = new MutationObserver(callback);

    // Start observing the target node for configured mutations
    observer.observe(targetNode, config);
}