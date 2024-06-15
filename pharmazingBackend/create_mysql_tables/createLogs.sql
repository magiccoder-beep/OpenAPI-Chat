CREATE TABLE `pharmazing`.`logs` (
  `id` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` INT(10) NULL,
  `screen` VARCHAR(50) NULL,
  `action` VARCHAR(50) NULL,
  `log` VARCHAR(300) NULL,
  `created_at` DATETIME NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC));