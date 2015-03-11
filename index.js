/* global process */
var express = require('express');
var serveStatic = require('serve-static');

var app = express();

app.use(serveStatic('client', {'index': ['index.html']}));
app.listen(process.env.PORT || 3000);
