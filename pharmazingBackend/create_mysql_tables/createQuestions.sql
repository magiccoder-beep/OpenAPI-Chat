CREATE TABLE `pharmazing`.`questions` (
  `id` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` INT(10) NULL,
  `appversion` VARCHAR(10) DEFAULT '0',
  `lng` VARCHAR(20) DEFAULT 'de',
  `related` TINYINT(1) DEFAULT false,
  `follow_up_question` TINYINT(1) DEFAULT false,
  `refer_question_id` INT(10) DEFAULT -1,
  `main_question_id` INT(10) DEFAULT -1,
  `question` VARCHAR(1000) DEFAULT '',
  `keywords` VARCHAR(400) DEFAULT '',
  `top_keywords` VARCHAR(200) DEFAULT '',
  `calculation` TINYINT(1) DEFAULT false,
  `improved_model` TINYINT(1) DEFAULT false,
  `created_at` DATETIME NULL,
  `updated_at` DATETIME NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC));