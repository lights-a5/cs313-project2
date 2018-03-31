const pg = require('pg');;
const express = require('express');
const body_parser = require('body-parser');
const api = require('api.js');
const path = require('path');
const PORT = process.env.PORT || 5000;

express()
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/index'))
  .get('/get_reviews', function(request, response) {
    api.get_reviews(request, response);
  })
  .get('/get_colleges', function(request, response) {
    api.get_colleges(request, response);
  })
  .get('/get_courses', function(request, response) {
    api.get_courses(request, response);
  })
  .post('/post_review', function (request, response) {
    api.post_review(request, response);
  })
  .listen(PORT, () => console.log(`Listening on ${ PORT }`));

