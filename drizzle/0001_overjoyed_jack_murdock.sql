CREATE TABLE `client_access` (
	`id` int AUTO_INCREMENT NOT NULL,
	`client_id` int NOT NULL,
	`platform` varchar(255) NOT NULL,
	`username` varchar(255),
	`password` text,
	`url` text,
	`notes` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `client_access_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `clients` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`type` enum('trafego_pago','social_media','both') NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `clients_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `crm_leads` (
	`id` int AUTO_INCREMENT NOT NULL,
	`week_id` int NOT NULL,
	`day_of_week` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`company` varchar(255),
	`contact` varchar(255),
	`status` varchar(50) NOT NULL DEFAULT 'novo',
	`notes` text,
	`position` int NOT NULL DEFAULT 0,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `crm_leads_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `crm_weeks` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`script` text,
	`start_date` timestamp NOT NULL,
	`end_date` timestamp NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `crm_weeks_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `social_media_client_info` (
	`id` int AUTO_INCREMENT NOT NULL,
	`client_id` int NOT NULL,
	`field_name` varchar(255) NOT NULL,
	`field_value` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `social_media_client_info_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `social_media_copys` (
	`id` int AUTO_INCREMENT NOT NULL,
	`client_id` int NOT NULL,
	`title` varchar(255),
	`content` text NOT NULL,
	`platform` varchar(100),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `social_media_copys_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `social_media_references` (
	`id` int AUTO_INCREMENT NOT NULL,
	`client_id` int NOT NULL,
	`title` varchar(255),
	`url` text,
	`description` text,
	`image_url` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `social_media_references_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `traffic_kpis` (
	`id` int AUTO_INCREMENT NOT NULL,
	`client_id` int NOT NULL,
	`period` varchar(100) NOT NULL,
	`ctr` varchar(50),
	`cpc` varchar(50),
	`cpm` varchar(50),
	`conversions` varchar(50),
	`roas` varchar(50),
	`impressions` varchar(50),
	`clicks` varchar(50),
	`spend` varchar(50),
	`is_current` int NOT NULL DEFAULT 0,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `traffic_kpis_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `traffic_weekly_reports` (
	`id` int AUTO_INCREMENT NOT NULL,
	`client_id` int NOT NULL,
	`week_number` int NOT NULL,
	`year` int NOT NULL,
	`activities` text,
	`creatives` text,
	`performance` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `traffic_weekly_reports_id` PRIMARY KEY(`id`)
);
