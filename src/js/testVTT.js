import { WebVTTParser, WebVTTSerializer } from './utils/parser.js'

export function testVTT(input){
    console.log('checking...')
    let valid = false;
    const pa = new WebVTTParser();
    let r = pa.parse(input, 'subtitles/captions/descriptions' );
    
    let errorMarkers = [];
    let status = "";

    if(r.errors.length > 0) {
      if(r.errors.length == 1)
        status = "Almost there!"
      else if(r.errors.length < 5)
        status = "Not bad, keep at it!"
      else
        status = "You are hopeless, RTFS."
      for(var i = 0; i < r.errors.length; i++) {
        
        let error = r.errors[i];
        // let message = "Line " + error.line;  
        let errorMarker = { line: error.line };
        
        if(error.col){
          // message += ", column " + error.col
          errorMarker.ch = error.col;
        }
        // messages.push(message + ": " + error.message)
        errorMarkers.push({marker : errorMarker, message: error.message})
      }
    } else {
      status = "This is boring, your WebVTT is valid!"
      valid = true;
    }
    status += " (" + r.time + "ms)"
    // var s = new WebVTTSerializer()
    // hiddenCues = s.serialize(r.cues)
    return { valid, input, status, errorMarkers };
    
}