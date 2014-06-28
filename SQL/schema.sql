CREATE DATABASE chat;

USE chat;

CREATE TABLE message (
  id int auto_increment primary key,
  user_id int,
  room_id int,
  time timestamp,
  text varchar(200)
);

create table user (
  id int auto_increment primary key,
  name varchar(20)
);

create table room (
  id int auto_increment primary key,
  name varchar(20)
);

/* Create other tables and define schemas for them here! */




/*  Execute this file from the command line by typing:
 *    mysql < schema.sql
 *  to create the database and the tables.*/




