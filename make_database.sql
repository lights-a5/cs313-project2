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