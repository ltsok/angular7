/*
SQLyog Ultimate v12.08 (64 bit)
MySQL - 5.5.41-enterprise-commercial-advanced-log : Database - ltsok
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
CREATE DATABASE /*!32312 IF NOT EXISTS*/`ltsok` /*!40100 DEFAULT CHARACTER SET latin1 */;

USE `ltsok`;

/*Table structure for table `gp_auth_relation` */

DROP TABLE IF EXISTS `gp_auth_relation`;

CREATE TABLE `gp_auth_relation` (
  `relation_id` int(11) NOT NULL COMMENT '记录标识',
  `group_id` int(11) NOT NULL COMMENT '组ID',
  `auth_id` int(11) NOT NULL COMMENT '权限ID',
  `auth_type` int(11) NOT NULL COMMENT '权限类型',
  PRIMARY KEY (`relation_id`),
  KEY `group_id` (`group_id`),
  KEY `auth_id` (`auth_id`),
  CONSTRAINT `gp_auth_relation_ibfk_1` FOREIGN KEY (`group_id`) REFERENCES `user_group` (`group_id`),
  CONSTRAINT `gp_auth_relation_ibfk_2` FOREIGN KEY (`auth_id`) REFERENCES `user_auths` (`auth_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `gp_auth_relation` */

/*Table structure for table `role_auth_relation` */

DROP TABLE IF EXISTS `role_auth_relation`;

CREATE TABLE `role_auth_relation` (
  `relation_id` int(11) NOT NULL,
  `role_id` int(11) DEFAULT NULL,
  `auth_id` int(11) DEFAULT NULL,
  `auth_type` int(11) DEFAULT NULL,
  PRIMARY KEY (`relation_id`),
  KEY `role_id` (`role_id`),
  KEY `auth_id` (`auth_id`),
  CONSTRAINT `auth_id` FOREIGN KEY (`auth_id`) REFERENCES `user_auths` (`auth_id`),
  CONSTRAINT `role_id` FOREIGN KEY (`role_id`) REFERENCES `user_role` (`role_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `role_auth_relation` */

/*Table structure for table `user` */

DROP TABLE IF EXISTS `user`;

CREATE TABLE `user` (
  `user_id` int(11) NOT NULL COMMENT '记录标识',
  `login_name` varchar(64) CHARACTER SET latin1 NOT NULL COMMENT '登录账号',
  `password` varchar(64) CHARACTER SET latin1 NOT NULL COMMENT '用户密码',
  `username` varchar(64) CHARACTER SET latin1 NOT NULL COMMENT '用户姓名',
  `mobile` varchar(20) CHARACTER SET latin1 DEFAULT NULL COMMENT '手机号',
  `email` varchar(64) CHARACTER SET latin1 DEFAULT NULL COMMENT '电子邮箱',
  `gen_time` datetime NOT NULL COMMENT '创建时间',
  `login_time` datetime NOT NULL COMMENT '登录时间',
  `last_login_name` datetime NOT NULL COMMENT '上次登录时间',
  `count` int(11) DEFAULT NULL COMMENT '登录次数',
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `user` */

/*Table structure for table `user_auths` */

DROP TABLE IF EXISTS `user_auths`;

CREATE TABLE `user_auths` (
  `auth_id` int(11) NOT NULL COMMENT '权限ID',
  `parent_auth_id` int(11) NOT NULL COMMENT '父权限ID',
  `auth_name` varchar(64) NOT NULL COMMENT '权限名称',
  `description` varchar(255) DEFAULT NULL COMMENT '权限描述',
  PRIMARY KEY (`auth_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `user_auths` */

/*Table structure for table `user_group` */

DROP TABLE IF EXISTS `user_group`;

CREATE TABLE `user_group` (
  `group_id` int(11) NOT NULL COMMENT '组ID',
  `group_name` varchar(64) NOT NULL COMMENT '组名称',
  `parent_gp_id` int(11) NOT NULL COMMENT '父组ID',
  `gen_time` datetime NOT NULL COMMENT '创建时间',
  `description` varchar(255) DEFAULT NULL COMMENT '组描述',
  PRIMARY KEY (`group_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `user_group` */

/*Table structure for table `user_role` */

DROP TABLE IF EXISTS `user_role`;

CREATE TABLE `user_role` (
  `role_id` int(11) NOT NULL COMMENT '角色ID',
  `parent_role_id` int(11) NOT NULL COMMENT '父角色ID',
  `role_name` varchar(64) CHARACTER SET latin1 NOT NULL COMMENT '角色名称',
  `gen_time` datetime NOT NULL COMMENT '创建时间',
  `description` varchar(255) CHARACTER SET latin1 DEFAULT NULL COMMENT '角色描述',
  PRIMARY KEY (`role_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `user_role` */

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
