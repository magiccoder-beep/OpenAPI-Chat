CREATE TABLE `pharmazing`.`consumedTrials` (
  `id` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `phonenumber` VARCHAR(30) DEFAULT '',
  `consumed_millis` BIGINT DEFAULT '0',
  `updated_at` DATETIME NULL,
  `created_at` DATETIME NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC));