
CREATE DATABASE IF NOT EXISTS web CHARACTER SET utf8 COLLATE utf8_bin;
USE web;

CREATE TABLE IF NOT EXISTS user (
  id int(12) NOT NULL,
  username varchar(50) NOT NULL,
  password varchar(255) NOT NULL,
  email varchar(100) NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

alter table user modify id int not null auto_increment primary key;

INSERT INTO user (id, username, password, email) VALUES (1, 'test', 'test', 'test@test.com');
INSERT INTO user (username, password, email) VALUES ('test2', 'test2', 'test2@test.com');
