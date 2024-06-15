CREATE TABLE `pharmazing`.`fcmTokens` (
  `id` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` INT(10) NULL,
  `platform` ENUM('ios', 'android', 'unknown') DEFAULT 'unknown',
  `fcm_token` VARCHAR(200) DEFAULT '',
  `is_tablet` TINYINT(1) DEFAULT false,
  `device_id` VARCHAR(50) DEFAULT '',
  `created_at` DATETIME NULL,
  `updated_at` DATETIME NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC));