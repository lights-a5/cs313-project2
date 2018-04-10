const pg = require('pg');
const express = require('express');
const session = require('express-session');
const body_parser = require('body-parser');
const path = require('path');
const PORT = process.env.PORT || 5000;

// SET PATHS
express()
  .use(body_parser.json() )
  .use(body_parser.urlencoded({ extended: true}))
  .use(session({
    secret: '179-tgb45-secret-session',
    resave: false,
    saveUninitialized: true
  }))
  .use(express.static(__dirname + '/public'))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', get_index)
  .get('/get_reviews', get_reviews)
  .get('/get_colleges', get_colleges)
  .get('/get_courses', get_courses)
  .get('/get_course_by_id', get_course_by_id)
  .get('get_login_status', get_login_status)
  .post('/login', handle_login)
  .post('/logout', handle_logout)
  .post('/post_review', verify_login, post_review)
  .listen(PORT, () => console.log(`Listening on ${ PORT }`));

//The following functions are the web page routes
function get_index(request, response) {
  /***************************************************
   * GET_INDEX
   * args:    request: The request sent to the server
   *          response: The response to be sent back
   * returns: Nothing
   * Desc:    This function calls the get_colleges_from_db function
   * and gives it the callback to then render the index.ejs using
   * the information about the colleges.
   ****************************************************/
  console.log("Putting together info for index");
  get_colleges_from_db(function(err, result) {
    if(err) response.render('pages/uhoh.ejs');
    else response.render('pages/index.ejs', {colleges: result});
  });
}


//The following functions are GET functions of the API

function get_login_status(request, response) {
  if (!request.body.username) {
    response.status(200).json({is_logged_in: false});
  } else {

  }
}
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
   * Desc:      This function is the front-facing API for 
   * get_colleges_from_db. In the case that function returns
   * an error, we will send a 500 error. Otherwise, we put the 
   * result into a JSON and send it using response.
   ****************************************/
  get_reviews_from_db(course_id, function(error, result) {
    if (error || result == null) {
      response.status(500).json({success: false, data: error});
    } else {
    response.status(200).json(result);
    }
  });
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

function get_course_by_id(request, response) {
  /******************************************
   * GET_COURSE_BY_ID
   * args:    request: The request sent to the server
   *          response: The response to be sent back
   * returns: Nothing
   * desc:    This function will extract the course_id from
   *          the request and then call get_course_from_db using
   *          that id. We will give it a callback to return the
   *          the rows that were received from the database.
   ***************************************/
  let course_id = request.query.course_id;
  get_course_from_db(course_id, function(error, result) {
      if (error || result == null) {
        response.status(500).json({success: false, data: error});
      } else {
      response.status(200).json(result);
      }
  });
}

//The following function is a POST route
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

function get_user_by_name(username, callback) {
  /******************************************************
   * GET_USER_BY_NAME
   * args:        username: The username we wish to lookup.
   *              callback: a function to execute when we are done.
   * returns:     Nothing
   * Desc:        This function connects to the database and extracts
   *              the information relating to a user. We call the callback
   *              passing in this information.
   *****************************************************/
  console.log("Getting User...");
  pg.connect(process.env.DATABASE_URL, function(err, client, done) {
    let sql_statement = 'SELECT * FROM system_user WHERE username = $1';
    let params = [username];
    client.query(sql_statement, params, function(err, result) {
      done();
      if (err) { console.error(err); callback(err,null); }
      else {callback(null, result.rows);}
    });
  });
}

//The following are helper functions that get info from the database
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
  console.log("Getting Reviews...");
  pg.connect(process.env.DATABASE_URL, function(err, client, done) {
    let sql_statement = 'SELECT r.*, u.username FROM review r, system_user u WHERE r.user_id = u.id AND course_id = $1'
    let params = [course_id];
    client.query(sql_statement, params, function(err, result) {
      done();
      if (err) { console.error(err); callback(err, null);}
      else {callback(null, result.rows);}
    });
  });
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
  console.log("Getting Courses...");
    pg.connect(process.env.DATABASE_URL, function(err, client, done) {
      let sql_statement = 'SELECT * FROM course WHERE active_flag = TRUE AND college_id = $1'
      let params = [college_id];
      client.query(sql_statement, params, function(err, result) {
        done();
        if (err) { console.error(err); callback(err, null);}
        else {callback(null, result.rows);}
      });
    });
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
  console.log("Posting Review...");
  pg.connect(process.env.DATABASE_URL, function(err, client, done) {
    let sql_statement = 'INSERT INTO review (user_id, course_id, rating, review_date, review_text) VALUES ($1, $2, $3, current_date, $4)';
    let params = [user_id, course_id, rating, review_text];
    client.query(sql_statement, params, function(err, result) {
      done();
      if (err) { console.error(err); callback(err, null);}
      else {callback(null, result.rows);}
    });
  }); 
}

function get_colleges_from_db(callback) {
  /**********************************************************
   * GET_COLLEGES_FROM_DB
   * args:      callback: The function given to execute when finished.
   * returns:   Nothing
   * Desc:      This function connects to the database and gets the information
   *            about all colleges in the database. It then executes a callback
   *            giving error information and the result set.
   **********************************************************/
  console.log("Getting Colleges...");
  pg.connect(process.env.DATABASE_URL, function(err, client, done) {
    client.query('SELECT * FROM college', function(err, result) {
      done();
      if (err) { console.error(err); callback(err, null);}
      else {callback(null, result.rows);}
    });
  });
}

function get_course_from_db(course_id, callback) {
  /***************************************************
   * GET_COURSE_FROM_DB
   * args:        course_id: the id of the course we want to retrieve.
   *              callback: The function given to execute when finished.
   * returns:     Nothing
   * Desc:        This function connects to the database and gets the information
   *              pertaining to the course with the given course_id. We then
   *              execute the callback with an error if applicable and the result.
   */
  console.log("Getting Course...");
  pg.connect(process.env.DATABASE_URL, function(err, client, done) {
    let sql_statement = 'SELECT * FROM course WHERE id = $1'
    let params = [course_id];
    client.query(sql_statement, params, function(err, result) {
      done();
      if (err) { console.error(err); callback(err, null);}
      else {callback(null, result.rows);}
    });
  }); 
}
