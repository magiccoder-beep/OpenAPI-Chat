CREATE TABLE `pharmazing`.`answers` (
  `id` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `question_id` INT(10) NULL,
  `improved_model` TINYINT(1) DEFAULT false,
  `main_answer` TINYINT(1) DEFAULT true,
  `linked_answer_id` INT(3) DEFAULT -1,
  `upvote` INT(5) DEFAULT 0,
  `downvote` INT(5) DEFAULT 0,
  `lng` VARCHAR(20) DEFAULT 'DE',
  `answer` VARCHAR(5000) DEFAULT '',
  `created_at` DATETIME NULL,
  `updated_at` DATETIME NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC));