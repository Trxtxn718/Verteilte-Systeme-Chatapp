-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: mariadb
-- Erstellungszeit: 12. Dez 2024 um 18:35
-- Server-Version: 11.6.2-MariaDB-ubu2404
-- PHP-Version: 8.2.8

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Datenbank: `mariadb`
--

-- --------------------------------------------------------

--
-- Tabellenstruktur fÃ¼r Tabelle `DirectChats`
--

CREATE TABLE `DirectChats` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_1` bigint(20) NOT NULL,
  `user_2` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

--
-- Daten fÃ¼r Tabelle `DirectChats`
--

INSERT INTO `DirectChats` (`id`, `user_1`, `user_2`) VALUES
(1, 1, 2),
(2, 1, 2);

-- --------------------------------------------------------

--
-- Tabellenstruktur fÃ¼r Tabelle `GroupChats`
--

CREATE TABLE `GroupChats` (
  `id` bigint(20) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- --------------------------------------------------------

--
-- Tabellenstruktur fÃ¼r Tabelle `Messages`
--

CREATE TABLE `Messages` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `chat_id` bigint(20) NOT NULL,
  `user_id` bigint(20) NOT NULL,
  `content` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- --------------------------------------------------------

--
-- Tabellenstruktur fÃ¼r Tabelle `Users`
--

CREATE TABLE `Users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `email` text NOT NULL,
  `username` text NOT NULL,
  `password` text NOT NULL,
  `profile_img` text NOT NULL,
  `created` datetime NOT NULL,
  `updated` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

--
-- Daten fÃ¼r Tabelle `Users`
--

INSERT INTO `Users` (`id`, `email`, `username`, `password`, `profile_img`, `created`, `updated`) VALUES
(1, 't.t@t.de', 'Tristan', '1234', 'test_img', '2020-04-09 12:18:07', '2020-04-09 12:18:07');

--
-- Indizes der exportierten Tabellen
--

--
-- Indizes fÃ¼r die Tabelle `DirectChats`
--
ALTER TABLE `DirectChats`
  ADD PRIMARY KEY (`id`),
  ADD KEY `directchats_user_1_index` (`user_1`),
  ADD KEY `directchats_user_2_index` (`user_2`);

--
-- Indizes fÃ¼r die Tabelle `GroupChats`
--
ALTER TABLE `GroupChats`
  ADD PRIMARY KEY (`id`);

--
-- Indizes fÃ¼r die Tabelle `Messages`
--
ALTER TABLE `Messages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `messages_chat_id_index` (`chat_id`),
  ADD KEY `messages_user_id_index` (`user_id`);

--
-- Indizes fÃ¼r die Tabelle `Users`
--
ALTER TABLE `Users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT fÃ¼r exportierte Tabellen
--

--
-- AUTO_INCREMENT fÃ¼r Tabelle `DirectChats`
--
ALTER TABLE `DirectChats`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT fÃ¼r Tabelle `GroupChats`
--
ALTER TABLE `GroupChats`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT fÃ¼r Tabelle `Messages`
--
ALTER TABLE `Messages`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT fÃ¼r Tabelle `Users`
--
ALTER TABLE `Users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
