CREATE TABLE `pharmazing`.`logins` (
  `id` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` INT(10) NULL,
  `platform` ENUM('ios', 'android', 'unknown') DEFAULT 'unknown',
  `device_id` VARCHAR(50) DEFAULT '',
  `is_tablet` VARCHAR(10) DEFAULT '',
  `created_at` DATETIME NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC));