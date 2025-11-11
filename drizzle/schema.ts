import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

// Custom KPI Definitions
export const customKpiDefinitions = mysqlTable("custom_kpi_definitions", {
  id: int("id").autoincrement().primaryKey(),
  clientId: int("client_id").notNull(),
  kpiName: varchar("kpi_name", { length: 100 }).notNull(),
  kpiKey: varchar("kpi_key", { length: 50 }).notNull(),
  isActive: int("is_active").default(1).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Tasks Diárias
export const dailyTasks = mysqlTable("daily_tasks", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  member: mysqlEnum("member", ["davi", "bia", "lucas"]).notNull(),
  date: timestamp("date").notNull(),
  weekNumber: int("week_number").notNull(),
  year: int("year").notNull(),
  completed: int("completed").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// CRM Tables
export const crmWeeks = mysqlTable("crm_weeks", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export const crmDailyScripts = mysqlTable("crm_daily_scripts", {
  id: int("id").autoincrement().primaryKey(),
  weekId: int("week_id").notNull(),
  dayOfWeek: int("day_of_week").notNull(), // 0-6
  scriptC1: text("script_c1"),
  scriptC2: text("script_c2"),
  scriptC3: text("script_c3"),
  scriptC4: text("script_c4"),
  scriptC5: text("script_c5"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export const crmLeads = mysqlTable("crm_leads", {
  id: int("id").autoincrement().primaryKey(),
  weekId: int("week_id").notNull(),
  dayOfWeek: int("day_of_week").notNull(), // 0-6 (Sunday-Saturday)
  name: varchar("name", { length: 255 }).notNull(),
  company: varchar("company", { length: 255 }),
  contact: varchar("contact", { length: 255 }),
  stage: varchar("stage", { length: 50 }).default("c1").notNull(), // c1, c2, c3, c4, c5, interesse, sem_interesse
  notes: text("notes"),
  position: int("position").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export const crmFutureClients = mysqlTable("crm_future_clients", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  company: varchar("company", { length: 255 }),
  contact: varchar("contact", { length: 255 }),
  notes: text("notes"),
  expectedDate: timestamp("expected_date"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export const crmMeetings = mysqlTable("crm_meetings", {
  id: int("id").autoincrement().primaryKey(),
  leadName: varchar("lead_name", { length: 255 }).notNull(),
  company: varchar("company", { length: 255 }),
  contact: varchar("contact", { length: 255 }),
  meetingDate: timestamp("meeting_date").notNull(),
  meetingLink: text("meeting_link"),
  notes: text("notes"),
  status: varchar("status", { length: 50 }).default("agendada").notNull(), // agendada, realizada, cancelada
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

// Client Management Tables
export const clients = mysqlTable("clients", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  type: mysqlEnum("type", ["trafego_pago", "social_media", "both"]).notNull(),
  photoUrl: text("photo_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

// Tráfego Pago Tables
export const trafficKpis = mysqlTable("traffic_kpis", {
  id: int("id").autoincrement().primaryKey(),
  clientId: int("client_id").notNull(),
  period: varchar("period", { length: 100 }).notNull(),
  ctr: varchar("ctr", { length: 50 }),
  cpc: varchar("cpc", { length: 50 }),
  cpm: varchar("cpm", { length: 50 }),
  conversions: varchar("conversions", { length: 50 }),
  roas: varchar("roas", { length: 50 }),
  impressions: varchar("impressions", { length: 50 }),
  clicks: varchar("clicks", { length: 50 }),
  spend: varchar("spend", { length: 50 }),
  isCurrent: int("is_current").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const trafficWeeklyReports = mysqlTable("traffic_weekly_reports", {
  id: int("id").autoincrement().primaryKey(),
  clientId: int("client_id").notNull(),
  weekNumber: int("week_number").notNull(),
  year: int("year").notNull(),
  startDate: timestamp("start_date"),
  endDate: timestamp("end_date"),
  activities: text("activities"),
  creatives: text("creatives"),
  performance: text("performance"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export const clientAccess = mysqlTable("client_access", {
  id: int("id").autoincrement().primaryKey(),
  clientId: int("client_id").notNull(),
  platform: varchar("platform", { length: 255 }).notNull(),
  username: varchar("username", { length: 255 }),
  password: text("password"),
  url: text("url"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

// Social Media Tables
export const socialMediaReferences = mysqlTable("social_media_references", {
  id: int("id").autoincrement().primaryKey(),
  clientId: int("client_id").notNull(),
  title: varchar("title", { length: 255 }),
  url: text("url"),
  description: text("description"),
  imageUrl: text("image_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const socialMediaCopys = mysqlTable("social_media_copys", {
  id: int("id").autoincrement().primaryKey(),
  clientId: int("client_id").notNull(),
  title: varchar("title", { length: 255 }),
  content: text("content").notNull(),
  platform: varchar("platform", { length: 100 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export const socialMediaClientInfo = mysqlTable("social_media_client_info", {
  id: int("id").autoincrement().primaryKey(),
  clientId: int("client_id").notNull(),
  fieldName: varchar("field_name", { length: 255 }).notNull(),
  fieldValue: text("field_value"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

// Type exports
// Tabela de páginas editáveis (estilo Notion)
export const editablePages = mysqlTable("editable_pages", {
  id: int("id").autoincrement().primaryKey(),
  clientId: int("client_id").notNull(),
  pageType: varchar("page_type", { length: 100 }).notNull(), // kpi, weekly_report, access, reference, copy, info
  weekNumber: int("week_number"), // Para divisão semanal
  year: int("year"), // Para divisão semanal
  title: varchar("title", { length: 255 }),
  content: text("content"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export const pageDocuments = mysqlTable("page_documents", {
  id: int("id").autoincrement().primaryKey(),
  pageId: int("page_id").notNull(),
  fileName: varchar("file_name", { length: 255 }).notNull(),
  fileUrl: text("file_url").notNull(),
  fileSize: int("file_size"),
  mimeType: varchar("mime_type", { length: 100 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type CrmWeek = typeof crmWeeks.$inferSelect;
export type InsertCrmWeek = typeof crmWeeks.$inferInsert;
export type CrmDailyScript = typeof crmDailyScripts.$inferSelect;
export type InsertCrmDailyScript = typeof crmDailyScripts.$inferInsert;
export type CrmLead = typeof crmLeads.$inferSelect;
export type InsertCrmLead = typeof crmLeads.$inferInsert;
export type CrmFutureClient = typeof crmFutureClients.$inferSelect;
export type InsertCrmFutureClient = typeof crmFutureClients.$inferInsert;
export type CrmMeeting = typeof crmMeetings.$inferSelect;
export type InsertCrmMeeting = typeof crmMeetings.$inferInsert;
export type EditablePage = typeof editablePages.$inferSelect;
export type InsertEditablePage = typeof editablePages.$inferInsert;
export type PageDocument = typeof pageDocuments.$inferSelect;
export type InsertPageDocument = typeof pageDocuments.$inferInsert;
export type Client = typeof clients.$inferSelect;
export type InsertClient = typeof clients.$inferInsert;
export type TrafficKpi = typeof trafficKpis.$inferSelect;
export type InsertTrafficKpi = typeof trafficKpis.$inferInsert;
export type TrafficWeeklyReport = typeof trafficWeeklyReports.$inferSelect;
export type InsertTrafficWeeklyReport = typeof trafficWeeklyReports.$inferInsert;
export type ClientAccess = typeof clientAccess.$inferSelect;
export type InsertClientAccess = typeof clientAccess.$inferInsert;
export type SocialMediaReference = typeof socialMediaReferences.$inferSelect;
export type InsertSocialMediaReference = typeof socialMediaReferences.$inferInsert;
export type SocialMediaCopy = typeof socialMediaCopys.$inferSelect;
export type InsertSocialMediaCopy = typeof socialMediaCopys.$inferInsert;
export type SocialMediaClientInfo = typeof socialMediaClientInfo.$inferSelect;
export type InsertSocialMediaClientInfo = typeof socialMediaClientInfo.$inferInsert;
export type DailyTask = typeof dailyTasks.$inferSelect;
export type InsertDailyTask = typeof dailyTasks.$inferInsert;
export type CustomKpiDefinition = typeof customKpiDefinitions.$inferSelect;
export type InsertCustomKpiDefinition = typeof customKpiDefinitions.$inferInsert;