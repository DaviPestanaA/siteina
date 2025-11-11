import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // CRM Router
  crm: router({
    // Week operations
    createWeek: protectedProcedure
      .input(z.object({
        name: z.string(),
        startDate: z.date(),
        endDate: z.date(),
      }))
      .mutation(async ({ input }) => {
        return await db.createCrmWeek(input);
      }),
    
    getAllWeeks: protectedProcedure.query(async () => {
      return await db.getAllCrmWeeks();
    }),
    
    getWeekById: protectedProcedure
      .input(z.number())
      .query(async ({ input }) => {
        return await db.getCrmWeekById(input);
      }),
    
    updateWeek: protectedProcedure
      .input(z.object({
        id: z.number(),
        name: z.string().optional(),
        startDate: z.date().optional(),
        endDate: z.date().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        return await db.updateCrmWeek(id, data);
      }),
    
    deleteWeek: protectedProcedure
      .input(z.number())
      .mutation(async ({ input }) => {
        return await db.deleteCrmWeek(input);
      }),
    
    // Daily Scripts operations
    createDailyScript: protectedProcedure
      .input(z.object({
        weekId: z.number(),
        dayOfWeek: z.number(),
        scriptC1: z.string().optional(),
        scriptC2: z.string().optional(),
        scriptC3: z.string().optional(),
        scriptC4: z.string().optional(),
        scriptC5: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        return await db.createDailyScript(input);
      }),
    
    getDailyScriptsByWeek: protectedProcedure
      .input(z.number())
      .query(async ({ input }) => {
        return await db.getDailyScriptsByWeekId(input);
      }),
    
    updateDailyScript: protectedProcedure
      .input(z.object({
        id: z.number(),
        scriptC1: z.string().optional(),
        scriptC2: z.string().optional(),
        scriptC3: z.string().optional(),
        scriptC4: z.string().optional(),
        scriptC5: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        return await db.updateDailyScript(id, data);
      }),

    // Lead operations
    createLead: protectedProcedure
      .input(z.object({
        weekId: z.number(),
        dayOfWeek: z.number(),
        name: z.string(),
        company: z.string().optional(),
        contact: z.string().optional(),
        stage: z.string().optional(),
        notes: z.string().optional(),
        position: z.number().optional(),
      }))
      .mutation(async ({ input }) => {
        return await db.createCrmLead(input);
      }),
    
    getLeadsByWeek: protectedProcedure
      .input(z.number())
      .query(async ({ input }) => {
        return await db.getLeadsByWeekId(input);
      }),
    
    updateLead: protectedProcedure
      .input(z.object({
        id: z.number(),
        name: z.string().optional(),
        company: z.string().optional(),
        contact: z.string().optional(),
        stage: z.string().optional(),
        notes: z.string().optional(),
        position: z.number().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        return await db.updateCrmLead(id, data);
      }),
    
    advanceAllLeads: protectedProcedure
      .input(z.object({
        weekId: z.number(),
        dayOfWeek: z.number(),
        fromStage: z.string(),
        toStage: z.string(),
      }))
      .mutation(async ({ input }) => {
        return await db.advanceAllLeads(input.weekId, input.dayOfWeek, input.fromStage, input.toStage);
      }),
    
    // Future Clients operations
    createFutureClient: protectedProcedure
      .input(z.object({
        name: z.string(),
        company: z.string().optional(),
        contact: z.string().optional(),
        notes: z.string().optional(),
        expectedDate: z.date().optional(),
      }))
      .mutation(async ({ input }) => {
        return await db.createFutureClient(input);
      }),
    
    getAllFutureClients: protectedProcedure.query(async () => {
      return await db.getAllFutureClients();
    }),
    
    updateFutureClient: protectedProcedure
      .input(z.object({
        id: z.number(),
        name: z.string().optional(),
        company: z.string().optional(),
        contact: z.string().optional(),
        notes: z.string().optional(),
        expectedDate: z.date().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        return await db.updateFutureClient(id, data);
      }),
    
    deleteFutureClient: protectedProcedure
      .input(z.number())
      .mutation(async ({ input }) => {
        return await db.deleteFutureClient(input);
      }),
    
    // Meetings operations
    createMeeting: protectedProcedure
      .input(z.object({
        leadName: z.string(),
        company: z.string().optional(),
        contact: z.string().optional(),
        meetingDate: z.date(),
        meetingLink: z.string().optional(),
        notes: z.string().optional(),
        status: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        return await db.createMeeting(input);
      }),
    
    getAllMeetings: protectedProcedure.query(async () => {
      return await db.getAllMeetings();
    }),
    
    updateMeeting: protectedProcedure
      .input(z.object({
        id: z.number(),
        leadName: z.string().optional(),
        company: z.string().optional(),
        contact: z.string().optional(),
        meetingDate: z.date().optional(),
        meetingLink: z.string().optional(),
        notes: z.string().optional(),
        status: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        return await db.updateMeeting(id, data);
      }),
    
    deleteMeeting: protectedProcedure
      .input(z.number())
      .mutation(async ({ input }) => {
        return await db.deleteMeeting(input);
      }),
    
    deleteLead: protectedProcedure
      .input(z.number())
      .mutation(async ({ input }) => {
        return await db.deleteCrmLead(input);
      }),
  }),

  // Client Router
  clients: router({
    create: protectedProcedure
      .input(z.object({
        name: z.string(),
        type: z.enum(["trafego_pago", "social_media", "both"]),
        photoUrl: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        return await db.createClient(input);
      }),
    
    getAll: protectedProcedure.query(async () => {
      return await db.getAllClients();
    }),
    
    getById: protectedProcedure
      .input(z.number())
      .query(async ({ input }) => {
        return await db.getClientById(input);
      }),
    
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        name: z.string().optional(),
        type: z.enum(["trafego_pago", "social_media", "both"]).optional(),
        photoUrl: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        return await db.updateClient(id, data);
      }),
    
    delete: protectedProcedure
      .input(z.number())
      .mutation(async ({ input }) => {
        return await db.deleteClient(input);
      }),
  }),

  // Traffic (Tráfego Pago) Router
  traffic: router({
    // KPI operations
    createKpi: protectedProcedure
      .input(z.object({
        clientId: z.number(),
        period: z.string(),
        ctr: z.string().optional(),
        cpc: z.string().optional(),
        cpm: z.string().optional(),
        conversions: z.string().optional(),
        roas: z.string().optional(),
        impressions: z.string().optional(),
        clicks: z.string().optional(),
        spend: z.string().optional(),
        isCurrent: z.number().default(0),
      }))
      .mutation(async ({ input }) => {
        return await db.createTrafficKpi(input);
      }),
    
    getKpisByClient: protectedProcedure
      .input(z.number())
      .query(async ({ input }) => {
        return await db.getKpisByClientId(input);
      }),
    
    updateKpi: protectedProcedure
      .input(z.object({
        id: z.number(),
        period: z.string().optional(),
        ctr: z.string().optional(),
        cpc: z.string().optional(),
        cpm: z.string().optional(),
        conversions: z.string().optional(),
        roas: z.string().optional(),
        impressions: z.string().optional(),
        clicks: z.string().optional(),
        spend: z.string().optional(),
        isCurrent: z.number().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        return await db.updateTrafficKpi(id, data);
      }),
    
    deleteKpi: protectedProcedure
      .input(z.number())
      .mutation(async ({ input }) => {
        return await db.deleteTrafficKpi(input);
      }),
    
    // Weekly Report operations
    createWeeklyReport: protectedProcedure
      .input(z.object({
        clientId: z.number(),
        weekNumber: z.number(),
        year: z.number(),
        startDate: z.date().optional(),
        endDate: z.date().optional(),
        activities: z.string().optional(),
        creatives: z.string().optional(),
        performance: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        return await db.createTrafficWeeklyReport(input);
      }),
    
    getWeeklyReportsByClient: protectedProcedure
      .input(z.number())
      .query(async ({ input }) => {
        return await db.getWeeklyReportsByClientId(input);
      }),
    
    updateWeeklyReport: protectedProcedure
      .input(z.object({
        id: z.number(),
        weekNumber: z.number().optional(),
        year: z.number().optional(),
        activities: z.string().optional(),
        creatives: z.string().optional(),
        performance: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        return await db.updateTrafficWeeklyReport(id, data);
      }),
    
    deleteWeeklyReport: protectedProcedure
      .input(z.number())
      .mutation(async ({ input }) => {
        return await db.deleteTrafficWeeklyReport(input);
      }),
    
    // Client Access operations
    createAccess: protectedProcedure
      .input(z.object({
        clientId: z.number(),
        platform: z.string(),
        username: z.string().optional(),
        password: z.string().optional(),
        url: z.string().optional(),
        notes: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        return await db.createClientAccess(input);
      }),
    
    getAccessByClient: protectedProcedure
      .input(z.number())
      .query(async ({ input }) => {
        return await db.getAccessByClientId(input);
      }),
    
    updateAccess: protectedProcedure
      .input(z.object({
        id: z.number(),
        platform: z.string().optional(),
        username: z.string().optional(),
        password: z.string().optional(),
        url: z.string().optional(),
        notes: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        return await db.updateClientAccess(id, data);
      }),
    
    deleteAccess: protectedProcedure
      .input(z.number())
      .mutation(async ({ input }) => {
        return await db.deleteClientAccess(input);
      }),
  }),

  // Social Media Router
  socialMedia: router({
    // Reference operations
    createReference: protectedProcedure
      .input(z.object({
        clientId: z.number(),
        title: z.string().optional(),
        url: z.string().optional(),
        description: z.string().optional(),
        imageUrl: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        return await db.createSocialMediaReference(input);
      }),
    
    getReferencesByClient: protectedProcedure
      .input(z.number())
      .query(async ({ input }) => {
        return await db.getReferencesByClientId(input);
      }),
    
    updateReference: protectedProcedure
      .input(z.object({
        id: z.number(),
        title: z.string().optional(),
        url: z.string().optional(),
        description: z.string().optional(),
        imageUrl: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        return await db.updateSocialMediaReference(id, data);
      }),
    
    deleteReference: protectedProcedure
      .input(z.number())
      .mutation(async ({ input }) => {
        return await db.deleteSocialMediaReference(input);
      }),
    
    // Copy operations
    createCopy: protectedProcedure
      .input(z.object({
        clientId: z.number(),
        title: z.string().optional(),
        content: z.string(),
        platform: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        return await db.createSocialMediaCopy(input);
      }),
    
    getCopysByClient: protectedProcedure
      .input(z.number())
      .query(async ({ input }) => {
        return await db.getCopysByClientId(input);
      }),
    
    updateCopy: protectedProcedure
      .input(z.object({
        id: z.number(),
        title: z.string().optional(),
        content: z.string().optional(),
        platform: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        return await db.updateSocialMediaCopy(id, data);
      }),
    
    deleteCopy: protectedProcedure
      .input(z.number())
      .mutation(async ({ input }) => {
        return await db.deleteSocialMediaCopy(input);
      }),
    
    // Client Info operations
    createClientInfo: protectedProcedure
      .input(z.object({
        clientId: z.number(),
        fieldName: z.string(),
        fieldValue: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        return await db.createSocialMediaClientInfo(input);
      }),
    
    getClientInfoByClient: protectedProcedure
      .input(z.number())
      .query(async ({ input }) => {
        return await db.getClientInfoByClientId(input);
      }),
    
    updateClientInfo: protectedProcedure
      .input(z.object({
        id: z.number(),
        fieldName: z.string().optional(),
        fieldValue: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        return await db.updateSocialMediaClientInfo(id, data);
      }),
    
    deleteClientInfo: protectedProcedure
      .input(z.number())
      .mutation(async ({ input }) => {
        return await db.deleteSocialMediaClientInfo(input);
      }),
  }),

  // Editable Pages Router
  pages: router({
    create: protectedProcedure
      .input(z.object({
        clientId: z.number(),
        pageType: z.string(),
        weekNumber: z.number().optional(),
        year: z.number().optional(),
        title: z.string().optional(),
        content: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        return await db.createEditablePage(input);
      }),
    
    getByClient: protectedProcedure
      .input(z.object({
        clientId: z.number(),
        pageType: z.string().optional(),
      }))
      .query(async ({ input }) => {
        return await db.getPagesByClient(input.clientId, input.pageType);
      }),
    
    getById: protectedProcedure
      .input(z.number())
      .query(async ({ input }) => {
        return await db.getPageById(input);
      }),
    
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        title: z.string().optional(),
        content: z.string().optional(),
        weekNumber: z.number().optional(),
        year: z.number().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        return await db.updateEditablePage(id, data);
      }),
    
    delete: protectedProcedure
      .input(z.number())
      .mutation(async ({ input }) => {
        return await db.deleteEditablePage(input);
      }),
    
    // Document operations
    createDocument: protectedProcedure
      .input(z.object({
        pageId: z.number(),
        fileName: z.string(),
        fileUrl: z.string(),
        fileSize: z.number().optional(),
        mimeType: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        return await db.createPageDocument(input);
      }),
    
    getDocumentsByPage: protectedProcedure
      .input(z.number())
      .query(async ({ input }) => {
        return await db.getDocumentsByPageId(input);
      }),
    
    deleteDocument: protectedProcedure
      .input(z.number())
      .mutation(async ({ input }) => {
        return await db.deletePageDocument(input);
      }),
  }),

  // Daily Tasks Router
  tasks: router({
    create: protectedProcedure
      .input(z.object({
        title: z.string(),
        description: z.string().optional(),
        member: z.enum(["davi", "bia", "lucas"]),
        date: z.date(),
        weekNumber: z.number(),
        year: z.number(),
      }))
      .mutation(async ({ input }) => {
        return await db.createDailyTask(input);
      }),
    
    getByMemberAndDate: protectedProcedure
      .input(z.object({
        member: z.string(),
        date: z.date(),
      }))
      .query(async ({ input }) => {
        return await db.getDailyTasksByMemberAndDate(input.member, input.date);
      }),
    
    getByWeek: protectedProcedure
      .input(z.object({
        weekNumber: z.number(),
        year: z.number(),
      }))
      .query(async ({ input }) => {
        return await db.getDailyTasksByWeek(input.weekNumber, input.year);
      }),
    
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        title: z.string().optional(),
        description: z.string().optional(),
        completed: z.number().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        return await db.updateDailyTask(id, data);
      }),
    
    delete: protectedProcedure
      .input(z.number())
      .mutation(async ({ input }) => {
        return await db.deleteDailyTask(input);
      }),
  }),

  // Custom KPIs Router
  customKpis: router({
    create: protectedProcedure
      .input(z.object({
        clientId: z.number(),
        kpiName: z.string(),
        kpiKey: z.string(),
      }))
      .mutation(async ({ input }) => {
        return await db.createCustomKpiDefinition(input);
      }),
    
    getByClient: protectedProcedure
      .input(z.number())
      .query(async ({ input }) => {
        return await db.getCustomKpisByClient(input);
      }),
    
    delete: protectedProcedure
      .input(z.number())
      .mutation(async ({ input }) => {
        return await db.deleteCustomKpiDefinition(input);
      }),
  }),
});

export type AppRouter = typeof appRouter;
