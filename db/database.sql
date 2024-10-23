CREATE TABLE
  `GroupChats` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY
  );

CREATE TABLE
  `Users` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `email` TEXT NOT NULL,
    `username` TEXT NOT NULL,
    `password` TEXT NOT NULL,
    `profile_img` TEXT NOT NULL,
    `created` DATETIME NOT NULL,
    `updated` DATETIME NOT NULL
  );

-- CREATE TABLE
--   `DirectChats` (
--     `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
--     `user_1` BIGINT NOT NULL,
--     `user_2` BIGINT NOT NULL
--   );

-- ALTER TABLE `DirectChats` ADD INDEX `directchats_user_1_index` (`user_1`);

-- ALTER TABLE `DirectChats` ADD INDEX `directchats_user_2_index` (`user_2`);

-- CREATE TABLE
--   `Messages` (
--     `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
--     `chat_id` BIGINT NOT NULL,
--     `user_id` BIGINT NOT NULL,
--     `content` BIGINT NOT NULL
--   );

-- ALTER TABLE `Messages` ADD INDEX `messages_chat_id_index` (`chat_id`);

-- ALTER TABLE `Messages` ADD INDEX `messages_user_id_index` (`user_id`);

-- ALTER TABLE `Messages` ADD CONSTRAINT `messages_chat_id_foreign` FOREIGN KEY (`chat_id`) REFERENCES `DirectChats` (`id`);

-- ALTER TABLE `DirectChats` ADD CONSTRAINT `directchats_user_1_foreign` FOREIGN KEY (`user_1`) REFERENCES `Users` (`id`);

-- ALTER TABLE `DirectChats` ADD CONSTRAINT `directchats_user_2_foreign` FOREIGN KEY (`user_2`) REFERENCES `Users` (`id`);

-- ALTER TABLE `Messages` ADD CONSTRAINT `messages_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `Users` (`id`);

--
INSERT INTO
  `Users` (`id`, `username`, `email`,`password`, `profile_img`, `created`, `updated`)
VALUES
  (1, 'Tristan', 't.t@t.de','1234', 'test_img' ,'2020-04-09 12:18:07','2020-04-09 12:18:07');