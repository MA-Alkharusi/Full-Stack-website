-- phpMyAdmin SQL Dump
-- version 5.1.0
-- https://www.phpmyadmin.net/


SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";




--

-- --------------------------------------------------------

--
-- Table structure for table `customers`
--

CREATE TABLE `customers` (
  `CID` varchar(36) NOT NULL,
  `Title` varchar(5) DEFAULT NULL,
  `FirstName` varchar(100) DEFAULT NULL,
  `LastName` varchar(100) DEFAULT NULL,
  `MobileNumber` varchar(20) DEFAULT NULL,
  `EmailAddress` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `customers`
--

INSERT INTO `customers` (`CID`, `Title`, `FirstName`, `LastName`, `MobileNumber`, `EmailAddress`) VALUES
('69634ea3-7443-439c-a7c5-ea4c2f085763', 'Mr', 'Lewis', ' Hamilton ', '0833848489', 'Lewish@gmail.com'),
('6dbfad36-9a41-4d8a-b84e-58ec680d9bc8', 'Ms ', 'Sara', 'Bell', '083343555', 'Sara@gmail.com'),
('d7d334e5-ad8b-4fbd-953f-c8b072871597', 'mr', 'MOHAMMED', 'ALKHARUSI', '0833973893', '989mohammed9@gmail.com'),
('e68bb66c-6fa2-4d84-a502-83a5631a2137', 'Mr', 'skkmls', 'skfs', '0000', '3232ewe'),
('f9011c0b-813a-4d49-997c-11890f7e9ddb', 'Mr', 'john', 'mac', '0833973893', '989mohammed9@gmail.com');

-- --------------------------------------------------------

--
-- Table structure for table `home`
--

CREATE TABLE `home` (
  `CID` varchar(36) NOT NULL,
  `AddressLine1` varchar(100) DEFAULT NULL,
  `AddressLine2` varchar(100) DEFAULT NULL,
  `Town` varchar(70) DEFAULT NULL,
  `County` varchar(70) DEFAULT NULL,
  `Eircode` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `home`
--

INSERT INTO `home` (`CID`, `AddressLine1`, `AddressLine2`, `Town`, `County`, `Eircode`) VALUES
('69634ea3-7443-439c-a7c5-ea4c2f085763', 'APARTMENT 4', 'Lewis 21', 'Birmingham', 'Birmingham', 'Bsd2332'),
('6dbfad36-9a41-4d8a-b84e-58ec680d9bc8', 'APARTMENT 30', 'THE Kings street', 'DUBLIIN 30', 'DUBLIN', 'D30T234'),
('d7d334e5-ad8b-4fbd-953f-c8b072871597', 'APARTMENT 34', 'THE BIRCHES PELLETSTOWN MANOR', 'DUBLIIN 15', 'DUBLIN', ''),
('e68bb66c-6fa2-4d84-a502-83a5631a2137', 'APARTMENT 34', 'THE BIRCHES PELLETSTOWN MANOR', 'DUBLIIN 15', 'DUBLIN', ''),
('f9011c0b-813a-4d49-997c-11890f7e9ddb', 'APARTMENT 34', 'THE BIRCHES PELLETSTOWN MANOR', 'DUBLIIN 15', 'DUBLIN', '');

-- --------------------------------------------------------

--
-- Table structure for table `shipping`
--

CREATE TABLE `shipping` (
  `CID` varchar(36) NOT NULL,
  `AddressLine1` varchar(100) DEFAULT NULL,
  `AddressLine2` varchar(100) DEFAULT NULL,
  `Town` varchar(70) DEFAULT NULL,
  `County` varchar(70) DEFAULT NULL,
  `Eircode` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `shipping`
--

INSERT INTO `shipping` (`CID`, `AddressLine1`, `AddressLine2`, `Town`, `County`, `Eircode`) VALUES
('69634ea3-7443-439c-a7c5-ea4c2f085763', 'APARTMENT 4', 'Lewis 21', 'Birmingham', 'Birmingham', 'Bsd2332'),
('6dbfad36-9a41-4d8a-b84e-58ec680d9bc8', 'APARTMENT 30', 'THE Kings street', 'DUBLIIN 30', 'DUBLIN', 'D30T234'),
('d7d334e5-ad8b-4fbd-953f-c8b072871597', 'APARTMENT 34', 'THE BIRCHES PELLETSTOWN MANOR', 'DUBLIIN 15', 'DUBLIN', ''),
('e68bb66c-6fa2-4d84-a502-83a5631a2137', 'APARTMENT 34', 'THE BIRCHES PELLETSTOWN MANOR', 'DUBLIIN 15', 'DUBLIN', ''),
('f9011c0b-813a-4d49-997c-11890f7e9ddb', 'APARTMENT 1', 'THE Banda', 'DUBLIIN ', 'DUBLIN', '');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `customers`
--
ALTER TABLE `customers`
  ADD PRIMARY KEY (`CID`);

--
-- Indexes for table `home`
--
ALTER TABLE `home`
  ADD PRIMARY KEY (`CID`);

--
-- Indexes for table `shipping`
--
ALTER TABLE `shipping`
  ADD PRIMARY KEY (`CID`);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `home`
--
ALTER TABLE `home`
  ADD CONSTRAINT `home_ibfk_1` FOREIGN KEY (`CID`) REFERENCES `customers` (`CID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `shipping`
--
ALTER TABLE `shipping`
  ADD CONSTRAINT `shipping_ibfk_1` FOREIGN KEY (`CID`) REFERENCES `customers` (`CID`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
