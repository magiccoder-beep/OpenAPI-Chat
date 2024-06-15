CREATE TABLE `pharmazing`.`errors` (
  `id` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` INT(10) NULL,
  `type` VARCHAR(100) NULL,
  `question_id` INT(10) NULL,
  `answer_id` INT(10) NULL,
  `error` VARCHAR(500) NULL,
  `created_at` DATETIME NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC));