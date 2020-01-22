const express = require("express");
const path = require("path");

const app = express();

app.set('view engine', 'pug')
app.set('views', './views')

app.get("/", function(req, res) {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

app.get("/other", function(req, res) {
  res.render('other', { title: 'Other page' })
});

app.use(express.static(__dirname + '/public'));

const port = process.env.PORT || 3000;
app.listen(port);
console.log(`listening on http://localhost:${port}`);