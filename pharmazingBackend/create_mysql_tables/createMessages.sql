CREATE TABLE `pharmazing`.`messages` (
  `id` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` INT(10) NULL,
  `role` ENUM('user', 'system') DEFAULT 'user',
  `question_id` INT(10) NULL,
  `content` VARCHAR(5000) DEFAULT '',
  `contentImages` VARCHAR(5000) DEFAULT '',
  `images` JSON,
  `textParts` JSON,
  `created_at` DATETIME NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC));