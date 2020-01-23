
const dragDrop = require('drag-drop')
 
// You can pass in a DOM node or a selector string!
dragDrop('.video', (files, pos, fileList, directories) => {
    console.log('Here are the dropped files', files)
    console.log('Dropped at coordinates', pos.x, pos.y)
    console.log('Here is the raw FileList object if you need it:', fileList)
    console.log('Here is the list of directories:', directories)
   
    // `files` is an Array!
    files.forEach(file => {
      console.log(file.name)
      console.log(file.size)
      console.log(file.type)
      console.log(file.lastModifiedDate)
      console.log(file.fullPath) // not real full path due to browser security restrictions
      console.log(file.path) // in Electron, this contains the actual full path
      
      document.getElementById('player').src = window.URL.createObjectURL(file);
      document.getElementById('player').poster = '/assets/video-poster.jpg';
      document.getElementById('reference').textContent = '';
      // console.log(file.readUInt32LE(0))
      // console.log(file.toJSON())
      // console.log(file.toString('hex')) // etc...
      
      // convert the file to a Buffer that we can use!
      const reader = new FileReader()
      reader.addEventListener('load', e => {
        // e.target.result is an ArrayBuffer
        const arr = new Uint8Array(e.target.result)
        const buffer = new Buffer(arr)
   
      })
      reader.addEventListener('error', err => {
        console.error('FileReader error' + err)
      })
      reader.readAsArrayBuffer(file)
    })
  })