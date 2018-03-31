const pg = require('pg');;
const express = require('express');
const body_parser = require('body-parser');
const path = require('path');
const PORT = process.env.PORT || 5000;

express()
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/index'))
  .get('/get_reviews', function(request, response) {
    get_reviews(request, response);
  })
  .get('/get_colleges', function(request, response) {
    get_colleges(request, response);
  })
  .get('/get_courses', function(request, response) {
    get_courses(request, response);
  })
  .post('/post_review', function (request, response) {
    post_review(request, response);
  })
  .listen(PORT, () => console.log(`Listening on ${ PORT }`));

  function get_reviews(request, response) {
    /***********************************
     *  GET_REVIEWS
     * args:    request: The request sent to the server
     *          response: The response to be sent back
     * returns: Nothing
     * Desc:    This function extracts the course_id from request and sends
     * it to get_reviews_from_db. In the case that get_reviews_from_db
     * returns an error, we will send a 500 error. Otherwise, we put the
     * result into a JSON and send it using response.
     * *********************************/
  let course_id = request.query.course_id;
  
  get_reviews_from_db(course_id, function(error, result) {
    if (error || result == null) {
      response.status(500).json({success: false, data: error});
    } else {
    response.status(200).json(result);
    }
  });
}
  
function get_colleges(request, response) {
    /**************************************
     * GET_COLLEGES
     * args:      request: The request sent to the server
     *            response: The response to be sent back
     * returns:   Nothing
     * Desc:      This function connects to the database and 
     * extracts information about all the colleges. We put the
     * result in a JSON and send it using response.
     ****************************************/
    //TODO: call database and get result
    console.log("Getting Colleges...");
    pg.connect(process.env.DATABASE_URL, function(err, client, done) {
      client.query('SELECT college_code, college_name FROM college', function(err, result) {
        done();
        if (err) { console.error(err); response.status(500).json({success: false, data: error})}
        else {response.status(200).json(result.rows)}
      });
    });
    response.status(500).json({success: false, data: null});
}

function get_courses(request, response) {
   /**************************************
   * GET_COURSES
   * args:      request: The request sent to the server
   *            response: The response to be sent back
   * returns:   Nothing
   * Desc:      This function extracts the college_id from request and sends
   * it to get_courses_from_db. In the case that get_courses_from_db
   * returns an error, we will send a 500 error. Otherwise, we put the
   * result into a JSON and send it using response.
   ****************************************/
  let college_id = request.query.college_id;
  get_courses_from_db(college_id, function(error, result) {
    if (error || result == null) {
      response.status(500).json({success: false, data: error});
    } else {
      response.status(200).json(result);
    }
  });
}

function post_review(request, response) {
  /*****************************************
   * POST_REVIEW
   * args:      request: The request sent to the server
   *            response: The response to be sent back
   * returns:   Nothing
   * Desc:      This extracts the various variables needed to post
   * a review. It then sends those variables to post_review_to_db.
   * In the case it returns an error, we will send a 500 error and
   * send back the error message. Otherwise, send back true for 
   * success.
   ******************************************/
  let user_id = request.post.user_id;
  let course_id = request.post.course_id;
  let rating = request.post.rating;
  let review_text = request.post.review_text;
  post_review_to_db(user_id, course_id, rating, review_text, 
                    function(error, result) {
      if (error || result == null) {
          response.status(500).json({success: false, data: error});
      } else {
          response.status(200).json({success: true});
      }
  });

}

function get_reviews_from_db(course_id, callback) {
    /***********************************
     * GET_REVIEWS_FROM_DB
     * args:      course_id: the id of the course to get reviews for
     *            callback: a function to execute when we are done.
     * returns:   Nothing
     * Desc:      This function connects to the database and extracts
     * all of the reviews pertaining to the course given by its id.
     * At the end, we call the callback.  
     ***********************************/
  //TODO: call database and get result
  callback(null, null);
}

function get_courses_from_db(college_id, callback) {
  /***********************************
   * GET_COURSES_FROM_DB
   * args:      college_id: the id of the college to get courses for
   *            callback: a function to execute when we are done.
   * returns:   Nothing
   * Desc:      This function connects to the database and extracts
   * all of the courses pertaining to the college given by its id.
   * At the end, we call the callback.  
   ***********************************/
  //TODO: call database and get result
  callback(null, null);
}

function post_review_to_db(user_id, course_id, rating, review_text, callback) {
  /*******************************************
   * POST_REVIEW_TO_DB
   * args:        user_id: The id of the user who is posting.
   *              course_id: The id of the course the user is reviewing.
   *              rating: The rating the user gave of the course.
   *              review_text: The text of the review the user gave.
   *              callback: The function to execute at the end.
   * returns:     Nothing
   * Desc:        This function connects to the database and posts
   * the review that the user made to the database. We then execute
   * the callback.
   ******************************************/
  //TODO: call database and get result
  callback(null, null);
}
