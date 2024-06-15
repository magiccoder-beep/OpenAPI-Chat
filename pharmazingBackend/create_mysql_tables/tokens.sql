CREATE TABLE `pharmazing`.`tokens` (
  `id` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` INT(10) DEFAULT -1,
  `question_id` INT(10) DEFAULT -1,
  `type` VARCHAR(30) DEFAULT '',
  `model` VARCHAR(40) DEFAULT 'gpt-4-1106-preview',
  `prompt_tokens` INT(5) DEFAULT 0,
  `completion_tokens` INT(5) DEFAULT 0,
  `created_at` DATETIME NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC));