import { eq, and } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  InsertUser,
  users,
  crmWeeks,
  crmDailyScripts,
  crmLeads,
  crmFutureClients,
  crmMeetings,
  clients,
  trafficKpis,
  trafficWeeklyReports,
  clientAccess,
  socialMediaReferences,
  socialMediaCopys,
  socialMediaClientInfo,
  editablePages,
  pageDocuments,
  dailyTasks,
  customKpiDefinitions,
  InsertCrmWeek,
  InsertCrmDailyScript,
  InsertCrmLead,
  InsertCrmFutureClient,
  InsertCrmMeeting,
  InsertClient,
  InsertTrafficKpi,
  InsertTrafficWeeklyReport,
  InsertClientAccess,
  InsertSocialMediaReference,
  InsertSocialMediaCopy,
  InsertSocialMediaClientInfo,
  InsertEditablePage,
  InsertPageDocument,
  InsertDailyTask,
  InsertCustomKpiDefinition,
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// CRM Week queries
export async function createCrmWeek(week: InsertCrmWeek) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(crmWeeks).values(week);
  return result;
}

export async function getAllCrmWeeks() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(crmWeeks).orderBy(crmWeeks.startDate);
}

export async function getCrmWeekById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(crmWeeks).where(eq(crmWeeks.id, id)).limit(1);
  return result[0];
}

export async function updateCrmWeek(id: number, data: Partial<InsertCrmWeek>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.update(crmWeeks).set(data).where(eq(crmWeeks.id, id));
}

export async function deleteCrmWeek(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.delete(crmWeeks).where(eq(crmWeeks.id, id));
}

// CRM Lead queries
export async function createCrmLead(lead: InsertCrmLead) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(crmLeads).values(lead);
  return result;
}

export async function getLeadsByWeekId(weekId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(crmLeads).where(eq(crmLeads.weekId, weekId)).orderBy(crmLeads.dayOfWeek, crmLeads.position);
}

export async function updateCrmLead(id: number, data: Partial<InsertCrmLead>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.update(crmLeads).set(data).where(eq(crmLeads.id, id));
}

export async function deleteCrmLead(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.delete(crmLeads).where(eq(crmLeads.id, id));
}

// Client queries
export async function updateClient(id: number, updates: Partial<InsertClient>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(clients).set(updates).where(eq(clients.id, id));
  return { success: true };
}

export async function createClient(client: InsertClient) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(clients).values(client);
  return result;
}

export async function getAllClients() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(clients).orderBy(clients.name);
}

export async function getClientById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(clients).where(eq(clients.id, id)).limit(1);
  return result[0];
}

export async function deleteClient(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.delete(clients).where(eq(clients.id, id));
}

// Traffic KPI queries
export async function createTrafficKpi(kpi: InsertTrafficKpi) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(trafficKpis).values(kpi);
  return result;
}

export async function getKpisByClientId(clientId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(trafficKpis).where(eq(trafficKpis.clientId, clientId)).orderBy(trafficKpis.createdAt);
}

export async function updateTrafficKpi(id: number, data: Partial<InsertTrafficKpi>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.update(trafficKpis).set(data).where(eq(trafficKpis.id, id));
}

export async function deleteTrafficKpi(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.delete(trafficKpis).where(eq(trafficKpis.id, id));
}

// Traffic Weekly Report queries
export async function createTrafficWeeklyReport(report: InsertTrafficWeeklyReport) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(trafficWeeklyReports).values(report);
  return result;
}

export async function getWeeklyReportsByClientId(clientId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(trafficWeeklyReports).where(eq(trafficWeeklyReports.clientId, clientId)).orderBy(trafficWeeklyReports.year, trafficWeeklyReports.weekNumber);
}

export async function updateTrafficWeeklyReport(id: number, data: Partial<InsertTrafficWeeklyReport>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.update(trafficWeeklyReports).set(data).where(eq(trafficWeeklyReports.id, id));
}

export async function deleteTrafficWeeklyReport(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.delete(trafficWeeklyReports).where(eq(trafficWeeklyReports.id, id));
}

// Client Access queries
export async function createClientAccess(access: InsertClientAccess) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(clientAccess).values(access);
  return result;
}

export async function getAccessByClientId(clientId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(clientAccess).where(eq(clientAccess.clientId, clientId));
}

export async function updateClientAccess(id: number, data: Partial<InsertClientAccess>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.update(clientAccess).set(data).where(eq(clientAccess.id, id));
}

export async function deleteClientAccess(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.delete(clientAccess).where(eq(clientAccess.id, id));
}

// Social Media Reference queries
export async function createSocialMediaReference(reference: InsertSocialMediaReference) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(socialMediaReferences).values(reference);
  return result;
}

export async function getReferencesByClientId(clientId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(socialMediaReferences).where(eq(socialMediaReferences.clientId, clientId));
}

export async function updateSocialMediaReference(id: number, data: Partial<InsertSocialMediaReference>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.update(socialMediaReferences).set(data).where(eq(socialMediaReferences.id, id));
}

export async function deleteSocialMediaReference(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.delete(socialMediaReferences).where(eq(socialMediaReferences.id, id));
}

// Social Media Copy queries
export async function createSocialMediaCopy(copy: InsertSocialMediaCopy) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(socialMediaCopys).values(copy);
  return result;
}

export async function getCopysByClientId(clientId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(socialMediaCopys).where(eq(socialMediaCopys.clientId, clientId));
}

export async function updateSocialMediaCopy(id: number, data: Partial<InsertSocialMediaCopy>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.update(socialMediaCopys).set(data).where(eq(socialMediaCopys.id, id));
}

export async function deleteSocialMediaCopy(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.delete(socialMediaCopys).where(eq(socialMediaCopys.id, id));
}

// Social Media Client Info queries
export async function createSocialMediaClientInfo(info: InsertSocialMediaClientInfo) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(socialMediaClientInfo).values(info);
  return result;
}

export async function getClientInfoByClientId(clientId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(socialMediaClientInfo).where(eq(socialMediaClientInfo.clientId, clientId));
}

export async function updateSocialMediaClientInfo(id: number, data: Partial<InsertSocialMediaClientInfo>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.update(socialMediaClientInfo).set(data).where(eq(socialMediaClientInfo.id, id));
}

export async function deleteSocialMediaClientInfo(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.delete(socialMediaClientInfo).where(eq(socialMediaClientInfo.id, id));
}

// CRM Daily Scripts queries
export async function createDailyScript(script: InsertCrmDailyScript) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(crmDailyScripts).values(script);
  return result;
}

export async function getDailyScriptsByWeekId(weekId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(crmDailyScripts).where(eq(crmDailyScripts.weekId, weekId)).orderBy(crmDailyScripts.dayOfWeek);
}

export async function updateDailyScript(id: number, data: Partial<InsertCrmDailyScript>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.update(crmDailyScripts).set(data).where(eq(crmDailyScripts.id, id));
}

// CRM Future Clients queries
export async function createFutureClient(client: InsertCrmFutureClient) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(crmFutureClients).values(client);
  return result;
}

export async function getAllFutureClients() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(crmFutureClients).orderBy(crmFutureClients.createdAt);
}

export async function updateFutureClient(id: number, data: Partial<InsertCrmFutureClient>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.update(crmFutureClients).set(data).where(eq(crmFutureClients.id, id));
}

export async function deleteFutureClient(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.delete(crmFutureClients).where(eq(crmFutureClients.id, id));
}

// CRM Meetings queries
export async function createMeeting(meeting: InsertCrmMeeting) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(crmMeetings).values(meeting);
  return result;
}

export async function getAllMeetings() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(crmMeetings).orderBy(crmMeetings.meetingDate);
}

export async function updateMeeting(id: number, data: Partial<InsertCrmMeeting>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.update(crmMeetings).set(data).where(eq(crmMeetings.id, id));
}

export async function deleteMeeting(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.delete(crmMeetings).where(eq(crmMeetings.id, id));
}

// Editable Pages queries
export async function createEditablePage(page: InsertEditablePage) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(editablePages).values(page);
  return result;
}

export async function getPagesByClient(clientId: number, pageType?: string) {
  const db = await getDb();
  if (!db) return [];
  
  if (pageType) {
    return await db.select().from(editablePages)
      .where(eq(editablePages.clientId, clientId) && eq(editablePages.pageType, pageType))
      .orderBy(editablePages.createdAt);
  }
  
  return await db.select().from(editablePages)
    .where(eq(editablePages.clientId, clientId))
    .orderBy(editablePages.createdAt);
}

export async function getPageById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(editablePages).where(eq(editablePages.id, id)).limit(1);
  return result[0];
}

export async function updateEditablePage(id: number, data: Partial<InsertEditablePage>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.update(editablePages).set(data).where(eq(editablePages.id, id));
}

export async function deleteEditablePage(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.delete(editablePages).where(eq(editablePages.id, id));
}

// Page Documents queries
export async function createPageDocument(doc: InsertPageDocument) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(pageDocuments).values(doc);
  return result;
}

export async function getDocumentsByPageId(pageId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(pageDocuments).where(eq(pageDocuments.pageId, pageId)).orderBy(pageDocuments.createdAt);
}

export async function deletePageDocument(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.delete(pageDocuments).where(eq(pageDocuments.id, id));
}

export async function advanceAllLeads(weekId: number, dayOfWeek: number, fromStage: string, toStage: string) {
  const database = await getDb();
  if (!database) {
    throw new Error("Database not available");
  }

  // Buscar todos os leads do estágio de origem no dia específico
  const leadsToAdvance = await database
    .select()
    .from(crmLeads)
    .where(
      and(
        eq(crmLeads.weekId, weekId),
        eq(crmLeads.dayOfWeek, dayOfWeek),
        eq(crmLeads.stage, fromStage)
      )
    );

  // Atualizar todos os leads para o próximo estágio
  for (const lead of leadsToAdvance) {
    await database
      .update(crmLeads)
      .set({ stage: toStage })
      .where(eq(crmLeads.id, lead.id));
  }

  return { success: true, count: leadsToAdvance.length };
}


// Daily Tasks functions
export async function createDailyTask(task: InsertDailyTask) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(dailyTasks).values(task);
  return result;
}

export async function getDailyTasksByMemberAndDate(member: string, date: Date) {
  const db = await getDb();
  if (!db) return [];
  const result = await db.select().from(dailyTasks).where(
    and(
      eq(dailyTasks.member, member as any),
      eq(dailyTasks.date, date)
    )
  );
  return result;
}

export async function getDailyTasksByWeek(weekNumber: number, year: number) {
  const db = await getDb();
  if (!db) return [];
  const result = await db.select().from(dailyTasks).where(
    and(
      eq(dailyTasks.weekNumber, weekNumber),
      eq(dailyTasks.year, year)
    )
  );
  return result;
}

export async function updateDailyTask(id: number, updates: Partial<InsertDailyTask>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(dailyTasks).set(updates).where(eq(dailyTasks.id, id));
  return { success: true };
}

export async function deleteDailyTask(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(dailyTasks).where(eq(dailyTasks.id, id));
  return { success: true };
}

// Custom KPI Definitions functions
export async function createCustomKpiDefinition(kpi: InsertCustomKpiDefinition) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(customKpiDefinitions).values(kpi);
  return result;
}

export async function getCustomKpisByClient(clientId: number) {
  const db = await getDb();
  if (!db) return [];
  const result = await db.select().from(customKpiDefinitions).where(
    and(
      eq(customKpiDefinitions.clientId, clientId),
      eq(customKpiDefinitions.isActive, 1)
    )
  );
  return result;
}

export async function deleteCustomKpiDefinition(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(customKpiDefinitions).set({ isActive: 0 }).where(eq(customKpiDefinitions.id, id));
  return { success: true };
}
