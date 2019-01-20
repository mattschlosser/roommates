BEGIN TRANSACTION;
DROP TABLE IF EXISTS `chores`;
CREATE TABLE IF NOT EXISTS `chores` (
	`id`	INTEGER PRIMARY KEY AUTOINCREMENT,
	`household`	INTEGER,
	`user`	INTEGER,
	`task`	TEXT,
	`date`	date,
	FOREIGN KEY(`household`) REFERENCES `households`(`household`),
	FOREIGN KEY(`user`) REFERENCES `users`(`user`)
);
INSERT INTO `chores` VALUES (1,1,4,'DISHES',NULL);
INSERT INTO `chores` VALUES (2,1,1,'bob',NULL);
INSERT INTO `chores` VALUES (3,1,3,'bathrooms',NULL);
DROP TABLE IF EXISTS `groceries`;
CREATE TABLE IF NOT EXISTS `groceries` (
	`id`	INTEGER PRIMARY KEY AUTOINCREMENT,
	`household`	INTEGER,
	`user`	INTEGER,
	`item`	TEXT,
	FOREIGN KEY(`household`) REFERENCES `households`(`household`),
	FOREIGN KEY(`user`) REFERENCES `users`(`user`)
);
INSERT INTO `groceries` VALUES (1,1,4,'grapes
');
INSERT INTO `groceries` VALUES (2,NULL,1,'1');
INSERT INTO `groceries` VALUES (3,'Coffee',1,'1');
INSERT INTO `groceries` VALUES (4,'',1,'1');
INSERT INTO `groceries` VALUES (5,'Coffee',1,'1');
INSERT INTO `groceries` VALUES (6,1,1,'Coffee');
INSERT INTO `groceries` VALUES (7,1,1,NULL);
DROP TABLE IF EXISTS `landlords`;
CREATE TABLE IF NOT EXISTS `landlords` (
	`household`	INTEGER,
	`user`	INTEGER,
	FOREIGN KEY(`user`) REFERENCES `users`(`user`),
	FOREIGN KEY(`household`) REFERENCES `households`(`household`),
	PRIMARY KEY(`household`,`user`)
);
DROP TABLE IF EXISTS `payments`;
CREATE TABLE IF NOT EXISTS `payments` (
	`household`	INTEGER,
	`user`	INTEGER,
	`due`	INTEGER,
	`paid`	INTEGER
);
DROP TABLE IF EXISTS `rental`;
CREATE TABLE IF NOT EXISTS `rental` (
	`household`	INTEGER,
	`user`	INTEGER,
	`rent`	INTEGER,
	`dueDate`	INTEGER,
	PRIMARY KEY(`household`,`user`)
);
DROP TABLE IF EXISTS `roommates`;
CREATE TABLE IF NOT EXISTS `roommates` (
	`user`	INTEGER,
	`household`	INTEGER,
	PRIMARY KEY(`user`,`household`),
	FOREIGN KEY(`user`) REFERENCES `users`(`user`),
	FOREIGN KEY(`household`) REFERENCES `households`(`household`)
);
INSERT INTO `roommates` VALUES (3,1);
INSERT INTO `roommates` VALUES (4,1);
INSERT INTO `roommates` VALUES (5,1);
INSERT INTO `roommates` VALUES (6,1);
INSERT INTO `roommates` VALUES (7,1);
INSERT INTO `roommates` VALUES (8,1);
INSERT INTO `roommates` VALUES (1,2);
INSERT INTO `roommates` VALUES (2,1);
DROP TABLE IF EXISTS `households`;
CREATE TABLE IF NOT EXISTS `households` (
	`household`	INTEGER PRIMARY KEY AUTOINCREMENT,
	`name`	text NOT NULL,
	`street`	text NOT NULL,
	`city`	text NOT NULL
);
INSERT INTO `households` VALUES (0,'Cheetos','10945 54 Ave NW','Edmonton, AB');
INSERT INTO `households` VALUES (1,'HMS Hamster','9234 82 Ave NW','Edmonton, AB');
INSERT INTO `households` VALUES (2,'name of house','11234 23 Ave','Edmonton, AB');
INSERT INTO `households` VALUES (3,'Red house','11121 23 St','Vacouver, BC');
INSERT INTO `households` VALUES (4,'Cheetos','10945 54 Ave NW','Edmonton, AB');
INSERT INTO `households` VALUES (6,'Hey all','11234, 56 Ave NW','Edmonton, AB');
DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
	`user`	INTEGER PRIMARY KEY AUTOINCREMENT,
	`email`	email NOT NULL UNIQUE,
	`password`	password NOT NULL,
	`firstName`	text,
	`lastName`	text
);
INSERT INTO `users` VALUES (1,'somone@somewhere.net',2439,'Bob','Jones');
INSERT INTO `users` VALUES (2,'charlie@h.h',2034,'Charlie','Brown');
INSERT INTO `users` VALUES (3,'lucy@h.h',1034,'Lucy','K');
INSERT INTO `users` VALUES (4,'websitemakingguy@gmail.com',2039,'Matt','Schlosser');
INSERT INTO `users` VALUES (5,'linus@linux.com',23949,'Linus','Torvolds');
INSERT INTO `users` VALUES (6,'octocat@octocat.net',2934,'Octocat','the-Best');
INSERT INTO `users` VALUES (7,'shally@ok.k',2941,'Bob','Marley');
INSERT INTO `users` VALUES (8,'dont@email.me',9569,'Top','Secret');
COMMIT;
