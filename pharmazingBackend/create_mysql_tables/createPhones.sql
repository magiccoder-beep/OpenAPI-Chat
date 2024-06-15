CREATE TABLE `pharmazing`.`phones` (
  `id` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` INT(10) NULL,
  `phonenumber` VARCHAR(30) NULL,
  `success` TINYINT(1) DEFAULT false,
  `token` VARCHAR(10) DEFAULT '',
  `token_expiry_date` DATETIME NULL,
  `created_at` DATETIME NULL,
  `updated_at` DATETIME NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC));