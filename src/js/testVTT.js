import './utils/parser.js'

export function testVTT(mode, track, input, infoList, status, hiddenCues, previewEl, callback){
    console.log('checking...')
    let valid = false;
    var pa = new WebVTTParser(),
        r = pa.parse(input, 'subtitles/captions/descriptions' )
    var ol = infoList,
        p = status,
        pre = hiddenCues
    ol.textContent = ""
    if(r.errors.length > 0) {
      if(r.errors.length == 1)
        p.textContent = "Almost there!"
      else if(r.errors.length < 5)
        p.textContent = "Not bad, keep at it!"
      else
        p.textContent = "You are hopeless, RTFS."
      for(var i = 0; i < r.errors.length; i++) {
        var error = r.errors[i],
            message = "Line " + error.line,
            li = document.createElement("li")
        if(error.col)
          message += ", column " + error.col
        li.textContent = message + ": " + error.message
        ol.appendChild(li)
      }
    } else {
      p.textContent = "This is boring, your WebVTT is valid!"
      valid = true;
    }
    p.textContent += " (" + r.time + "ms)"
    var s = new WebVTTSerializer()
    pre.textContent = s.serialize(r.cues)
    if(valid) callback(mode, input);
}