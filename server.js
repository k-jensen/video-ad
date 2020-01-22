const express = require("express");

const app = express();

app.set('view engine', 'pug')
app.set('views', './views')

app.get("/", function(req, res) {
  res.render('index', { title: 'Video AD' })
});

app.use(express.static(__dirname + '/public'));

const port = process.env.PORT || 3000;
app.listen(port);
console.log(`listening on http://localhost:${port}`);