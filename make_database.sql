-- Reset Tables
DROP TABLE IF EXISTS review;
DROP TABLE IF EXISTS course;
DROP TABLE IF EXISTS college;
DROP TABLE IF EXISTS system_user;

-- Create Tables
CREATE TABLE system_user
( id            SERIAL          PRIMARY KEY NOT NULL
, username      VARCHAR(50)     NOT NULL
, password      VARCHAR(72)     NOT NULL
, email         VARCHAR(50)     NOT NULL
, first_name    VARCHAR(100)    NOT NULL
, last_name     VARCHAR(100)    NOT NULL
);

CREATE TABLE college
( id            SERIAL          PRIMARY KEY     NOT NULL
, college_code  VARCHAR(5)      NOT NULL
, college_name  VARCHAR(200)    NOT NULL
);

CREATE TABLE course
( id            SERIAL          PRIMARY KEY NOT NULL
, college_id    INT             REFERENCES college(id) NOT NULL
, course_num    SMALLINT        NOT NULL
, course_name   VARCHAR(100)    NOT NULL
, summary       TEXT            NOT NULL
, active_flag   BOOLEAN         NOT NULL
);

CREATE TABLE review
( id            SERIAL          PRIMARY KEY NOT NULL
, user_id       INT             REFERENCES system_user(id) NOT NULL
, course_id     INT             REFERENCES course(id) NOT NULL
, rating        SMALLINT        NOT NULL
, review_date   DATE            NOT NULL
, review_text   TEXT            
);

INSERT INTO system_user
( username, password, email, first_name, last_name)
VALUES
( 'admin', 'admin', 'admin@course_review.com', 'admin', 'admin');

INSERT INTO system_user
( username, password, email, first_name, last_name)
VALUES
( 'hateful_user', 'user1', 'hateful@gmail.com', 'Bob', 'Saget');

INSERT INTO system_user
( username, password, email, first_name, last_name)
VALUES
( 'happy_user', 'user2', 'happy@gmail.com', 'Adam', 'Sandler');

INSERT INTO system_user
( username, password, email, first_name, last_name)
VALUES
( 'okay_user', 'user3', 'okay@gmail.com', 'Al', 'Borland');

INSERT INTO college
( college_code, college_name)
VALUES
('CS', 'Computer Science');

INSERT INTO college
( college_code, college_name)
VALUES
('ECEN', 'Electrical Engineering');

INSERT INTO course
( college_id, course_num, course_name, summary, active_flag)
VALUES
(1, 101, 'Intro to Programming'
,'This course provides an introduction to computer programming intended for people with no programming experience. This course is recommended for non-majors in order to get an overview of programming principles and techniques. This course covers the basics of programming in Python including elementary data types (numeric types, strings, lists, dictionaries and files), control flow, functions, objects, methods, fields, and mutability.'
, TRUE);

INSERT INTO course
( college_id, course_num, course_name, summary, active_flag)
VALUES
(1, 124, 'Intro to Software Development'
,'This course is the first step in the computer science and software engineering major tract. The goal of this course is that each student will be able to solve problems in Cplusplus and have a solid foundation in software development methodology.'
, TRUE);

INSERT INTO course
( college_id, course_num, course_name, summary, active_flag)
VALUES
(1, 165, 'Object-Oriented Software Development'
, ' Explain the object-oriented paradigm (including abstraction, encapsulation, aggregation, inheritance, and polymorphism) 
    Justify the need for design before implementation 
    Design and implement object-oriented programs'
, TRUE);

INSERT INTO course
( college_id, course_num, course_name, summary, active_flag)
VALUES
(1, 102, 'Test Class of Not Active', 'This is to test if non active classes show up', FALSE);


INSERT INTO course
( college_id, course_num, course_name, summary, active_flag)
VALUES
(2, 101, 'Intro to ECEN', 'ECEN 101 is the introductory class into the fields of computer and electrical engineering.  It is designed to introduce the student to the world of engineering, and particularly how we use computer and electrical circuits and systems to design and build life changing devices like cell phones, computers, and robots.  It is also designed to clarify the curriculum at BYU-Idaho so a student can successfully plan a graduation path and educational experience.'
, TRUE);

INSERT INTO course
( college_id, course_num, course_name, summary, active_flag)
VALUES
(2, 160, 'Fundamentals of Digital Systems', 'This course explores the fundamentals of digital systems including: number systems, truth tables, Boolean algebra, Karnaugh maps, combinational logic circuits (SSI, MSI and programmable circuits), sequential logic circuits (flip-flops, counters, and shift registers), and state machine design and analysis. Students must design and build a project that uses sequential logic and a digital simulation tool. A student presentation is required.'
, TRUE);

INSERT INTO course
( college_id, course_num, course_name, summary, active_flag)
VALUES
(2, 150, 'Electric Circuit Analysis I', 'Introduction to electrical circuit analysis for electrical and computer engineering. Analysis and design of DC and AC circuits including resistors, capacitors, inductors, transformers, and op-amps. Applications of Ohms Law, Kirchhoffs Laws, network theorems, transient and frequency domain analysis will be investigated. Hands-on laboratory exercises are also included.'
, TRUE);

INSERT INTO review
( user_id, course_id, rating, review_date, review_text)
VALUES
(2, 1, 1, current_date, 'This class sucked. Did not learn anything about programming');

INSERT INTO review
( user_id, course_id, rating, review_date, review_text)
VALUES
(2, 2, 2, current_date, 'This class was rather poor. Did not learn anything');

INSERT INTO review
( user_id, course_id, rating, review_date, review_text)
VALUES
(2, 3, 1, current_date, 'This class was one of the worst I have ever taken. Did not learn anything');

INSERT INTO review
( user_id, course_id, rating, review_date, review_text)
VALUES
(3, 3, 5, current_date, 'This class was one of the best I have ever taken. Great job to the teachers at BYUI!');

INSERT INTO review
( user_id, course_id, rating, review_date, review_text)
VALUES
(3, 2, 5, current_date, 'Wow! You guys rock! Great job to the teachers at BYUI!');

INSERT INTO review
( user_id, course_id, rating, review_date, review_text)
VALUES
(3, 2, 4, current_date, 'This was a bit hard but I liked it!');

INSERT INTO review
( user_id, course_id, rating, review_date, review_text)
VALUES
(4, 4, 3, current_date, 'This was okay');

INSERT INTO review
( user_id, course_id, rating, review_date, review_text)
VALUES
(4, 5, 2, current_date, 'Meh');

INSERT INTO review
( user_id, course_id, rating, review_date, review_text)
VALUES
(4, 6, 3, current_date, 'Alright I guess');