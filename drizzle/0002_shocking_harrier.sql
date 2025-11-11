CREATE TABLE `crm_daily_scripts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`week_id` int NOT NULL,
	`day_of_week` int NOT NULL,
	`script_c1` text,
	`script_c2` text,
	`script_c3` text,
	`script_c4` text,
	`script_c5` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `crm_daily_scripts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `crm_future_clients` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`company` varchar(255),
	`contact` varchar(255),
	`notes` text,
	`expected_date` timestamp,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `crm_future_clients_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `crm_meetings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`lead_name` varchar(255) NOT NULL,
	`company` varchar(255),
	`contact` varchar(255),
	`meeting_date` timestamp NOT NULL,
	`meeting_link` text,
	`notes` text,
	`status` varchar(50) NOT NULL DEFAULT 'agendada',
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `crm_meetings_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `editable_pages` (
	`id` int AUTO_INCREMENT NOT NULL,
	`client_id` int NOT NULL,
	`page_type` varchar(100) NOT NULL,
	`week_number` int,
	`year` int,
	`title` varchar(255),
	`content` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `editable_pages_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `page_documents` (
	`id` int AUTO_INCREMENT NOT NULL,
	`page_id` int NOT NULL,
	`file_name` varchar(255) NOT NULL,
	`file_url` text NOT NULL,
	`file_size` int,
	`mime_type` varchar(100),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `page_documents_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `crm_leads` ADD `stage` varchar(50) DEFAULT 'c1' NOT NULL;--> statement-breakpoint
ALTER TABLE `crm_leads` DROP COLUMN `status`;--> statement-breakpoint
ALTER TABLE `crm_weeks` DROP COLUMN `script`;