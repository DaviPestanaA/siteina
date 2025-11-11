import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { ArrowLeft, Edit, Key, Plus, TrendingUp, Trash2, FileText } from "lucide-react";
import { useState, useMemo, memo } from "react";
import { Link, useRoute } from "wouter";
import { toast } from "sonner";
import EditablePage from "@/components/EditablePage";

export default function TrafficClientDetail() {
  const [, params] = useRoute("/clients/traffic/:id");
  const clientId = params?.id ? parseInt(params.id) : 0;
  const { user, loading } = useAuth();

  const [isKpiDialogOpen, setIsKpiDialogOpen] = useState(false);
  const [isAccessDialogOpen, setIsAccessDialogOpen] = useState(false);
  const [isWeeklyReportDialogOpen, setIsWeeklyReportDialogOpen] = useState(false);

  // KPI form state
  const [kpiPeriod, setKpiPeriod] = useState("");
  const [kpiCtr, setKpiCtr] = useState("");
  const [kpiCpc, setKpiCpc] = useState("");
  const [kpiCpm, setKpiCpm] = useState("");
  const [kpiConversions, setKpiConversions] = useState("");
  const [kpiRoas, setKpiRoas] = useState("");
  const [kpiImpressions, setKpiImpressions] = useState("");
  const [kpiClicks, setKpiClicks] = useState("");
  const [kpiSpend, setKpiSpend] = useState("");
  const [kpiIsCurrent, setKpiIsCurrent] = useState(1);

  // Access form state
  const [accessPlatform, setAccessPlatform] = useState("");
  const [accessUsername, setAccessUsername] = useState("");
  const [accessPassword, setAccessPassword] = useState("");
  const [accessUrl, setAccessUrl] = useState("");
  const [accessNotes, setAccessNotes] = useState("");

  // Weekly report form state
  const [reportWeek, setReportWeek] = useState("");
  const [reportYear, setReportYear] = useState(new Date().getFullYear().toString());
  const [reportStartDate, setReportStartDate] = useState("");
  const [reportEndDate, setReportEndDate] = useState("");
  const [reportActivities, setReportActivities] = useState("");
  const [reportCreatives, setReportCreatives] = useState("");
  const [reportPerformance, setReportPerformance] = useState("");

  const { data: client } = trpc.clients.getById.useQuery(clientId);
  const { data: kpis, refetch: refetchKpis } = trpc.traffic.getKpisByClient.useQuery(clientId);
  const { data: accesses, refetch: refetchAccesses } = trpc.traffic.getAccessByClient.useQuery(clientId);
  const { data: weeklyReports, refetch: refetchReports } = trpc.traffic.getWeeklyReportsByClient.useQuery(clientId);

  const createKpi = trpc.traffic.createKpi.useMutation({
    onSuccess: () => {
      toast.success("KPI criado com sucesso!");
      setIsKpiDialogOpen(false);
      resetKpiForm();
      refetchKpis();
    },
  });

  const createAccess = trpc.traffic.createAccess.useMutation({
    onSuccess: () => {
      toast.success("Acesso criado com sucesso!");
      setIsAccessDialogOpen(false);
      resetAccessForm();
      refetchAccesses();
    },
  });

  const createWeeklyReport = trpc.traffic.createWeeklyReport.useMutation({
    onSuccess: () => {
      toast.success("Relatório semanal criado com sucesso!");
      setIsWeeklyReportDialogOpen(false);
      resetReportForm();
      refetchReports();
    },
  });

  const deleteKpi = trpc.traffic.deleteKpi.useMutation({
    onSuccess: () => {
      toast.success("KPI excluído!");
      refetchKpis();
    },
  });
  
  const deleteWeeklyReport = trpc.traffic.deleteWeeklyReport.useMutation({
    onSuccess: () => {
      toast.success("Relatório excluído!");
      refetchReports();
    },
  });

  const deleteAccess = trpc.traffic.deleteAccess.useMutation({
    onSuccess: () => {
      toast.success("Acesso excluído!");
      refetchAccesses();
    },
  });

  const resetKpiForm = () => {
    setKpiPeriod("");
    setKpiCtr("");
    setKpiCpc("");
    setKpiCpm("");
    setKpiConversions("");
    setKpiRoas("");
    setKpiImpressions("");
    setKpiClicks("");
    setKpiSpend("");
    setKpiIsCurrent(1);
  };

  const resetAccessForm = () => {
    setAccessPlatform("");
    setAccessUsername("");
    setAccessPassword("");
    setAccessUrl("");
    setAccessNotes("");
  };

  const resetReportForm = () => {
    setReportWeek("");
    setReportYear(new Date().getFullYear().toString());
    setReportActivities("");
    setReportCreatives("");
    setReportPerformance("");
  };

  const handleCreateKpi = () => {
    if (!kpiPeriod) {
      toast.error("Período é obrigatório");
      return;
    }

    createKpi.mutate({
      clientId,
      period: kpiPeriod,
      ctr: kpiCtr || undefined,
      cpc: kpiCpc || undefined,
      cpm: kpiCpm || undefined,
      conversions: kpiConversions || undefined,
      roas: kpiRoas || undefined,
      impressions: kpiImpressions || undefined,
      clicks: kpiClicks || undefined,
      spend: kpiSpend || undefined,
      isCurrent: kpiIsCurrent,
    });
  };

  const handleCreateAccess = () => {
    if (!accessPlatform) {
      toast.error("Plataforma é obrigatória");
      return;
    }

    createAccess.mutate({
      clientId,
      platform: accessPlatform,
      username: accessUsername || undefined,
      password: accessPassword || undefined,
      url: accessUrl || undefined,
      notes: accessNotes || undefined,
    });
  };

  const handleCreateWeeklyReport = () => {
    if (!reportWeek || !reportYear) {
      toast.error("Semana e ano são obrigatórios");
      return;
    }

    createWeeklyReport.mutate({
      clientId,
      weekNumber: parseInt(reportWeek),
      year: parseInt(reportYear),
      startDate: reportStartDate ? new Date(reportStartDate) : undefined,
      endDate: reportEndDate ? new Date(reportEndDate) : undefined,
      activities: reportActivities || undefined,
      creatives: reportCreatives || undefined,
      performance: reportPerformance || undefined,
    });
  };

  if (loading || !client) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Carregando...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const currentKpis = kpis?.filter((k) => k.isCurrent === 1) || [];
  const pastKpis = kpis?.filter((k) => k.isCurrent === 0) || [];

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8">
        <Link href="/clients">
          <Button variant="outline" className="mb-4 bg-background text-foreground">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para Clientes
          </Button>
        </Link>

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground">{client.name}</h1>
          <p className="text-muted-foreground mt-2">Tráfego Pago</p>
        </div>

        <Tabs defaultValue="kpis" className="w-full">
          <TabsList className="grid w-full max-w-3xl grid-cols-4 bg-muted">
            <TabsTrigger value="kpis" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <TrendingUp className="mr-2 h-4 w-4" />
              KPIs
            </TabsTrigger>
            <TabsTrigger value="weekly" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Edit className="mr-2 h-4 w-4" />
              Relatórios Semanais
            </TabsTrigger>
            <TabsTrigger value="access" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Key className="mr-2 h-4 w-4" />
              Acessos
            </TabsTrigger>
            <TabsTrigger value="pages" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <FileText className="mr-2 h-4 w-4" />
              Páginas
            </TabsTrigger>
          </TabsList>

          <TabsContent value="kpis" className="mt-6 space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold text-foreground">KPIs Atuais</h2>
              <Button onClick={() => setIsKpiDialogOpen(true)} className="bg-primary text-primary-foreground">
                <Plus className="mr-2 h-4 w-4" />
                Adicionar KPI
              </Button>
            </div>

            {currentKpis.length === 0 ? (
              <Card className="bg-card text-card-foreground">
                <CardContent className="py-8 text-center text-muted-foreground">
                  Nenhum KPI atual cadastrado
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {currentKpis.map((kpi) => (
                  <Card key={kpi.id} className="bg-card text-card-foreground border-border">
                    <CardHeader>
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-lg">{kpi.period}</CardTitle>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => {
                            if (confirm("Excluir este KPI?")) {
                              deleteKpi.mutate(kpi.id);
                            }
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {kpi.ctr && <div><span className="text-muted-foreground">CTR:</span> {kpi.ctr}</div>}
                        {kpi.cpc && <div><span className="text-muted-foreground">CPC:</span> {kpi.cpc}</div>}
                        {kpi.cpm && <div><span className="text-muted-foreground">CPM:</span> {kpi.cpm}</div>}
                        {kpi.conversions && <div><span className="text-muted-foreground">Conversões:</span> {kpi.conversions}</div>}
                        {kpi.roas && <div><span className="text-muted-foreground">ROAS:</span> {kpi.roas}</div>}
                        {kpi.impressions && <div><span className="text-muted-foreground">Impressões:</span> {kpi.impressions}</div>}
                        {kpi.clicks && <div><span className="text-muted-foreground">Cliques:</span> {kpi.clicks}</div>}
                        {kpi.spend && <div><span className="text-muted-foreground">Gasto:</span> {kpi.spend}</div>}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            <h2 className="text-2xl font-semibold text-foreground mt-8">KPIs Passados</h2>
            {pastKpis.length === 0 ? (
              <Card className="bg-card text-card-foreground">
                <CardContent className="py-8 text-center text-muted-foreground">
                  Nenhum KPI passado cadastrado
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {pastKpis.map((kpi) => (
                  <Card key={kpi.id} className="bg-card text-card-foreground border-border opacity-75">
                    <CardHeader>
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-lg">{kpi.period}</CardTitle>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => {
                            if (confirm("Excluir este KPI?")) {
                              deleteKpi.mutate(kpi.id);
                            }
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        {kpi.ctr && <div><span className="text-muted-foreground">CTR:</span> {kpi.ctr}</div>}
                        {kpi.cpc && <div><span className="text-muted-foreground">CPC:</span> {kpi.cpc}</div>}
                        {kpi.cpm && <div><span className="text-muted-foreground">CPM:</span> {kpi.cpm}</div>}
                        {kpi.conversions && <div><span className="text-muted-foreground">Conversões:</span> {kpi.conversions}</div>}
                        {kpi.roas && <div><span className="text-muted-foreground">ROAS:</span> {kpi.roas}</div>}
                        {kpi.impressions && <div><span className="text-muted-foreground">Impressões:</span> {kpi.impressions}</div>}
                        {kpi.clicks && <div><span className="text-muted-foreground">Cliques:</span> {kpi.clicks}</div>}
                        {kpi.spend && <div><span className="text-muted-foreground">Gasto:</span> {kpi.spend}</div>}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="weekly" className="mt-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-foreground">Relatórios Semanais</h2>
              <Button onClick={() => setIsWeeklyReportDialogOpen(true)} className="bg-primary text-primary-foreground">
                <Plus className="mr-2 h-4 w-4" />
                Adicionar Relatório
              </Button>
            </div>

            {!weeklyReports || weeklyReports.length === 0 ? (
              <Card className="bg-card text-card-foreground">
                <CardContent className="py-8 text-center text-muted-foreground">
                  Nenhum relatório semanal cadastrado
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {weeklyReports.map((report) => (
                  <Card key={report.id} className="bg-card text-card-foreground border-border">
                    <CardHeader>
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-lg">Semana {report.weekNumber} - {report.year}</CardTitle>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => {
                            if (confirm("Excluir este relatório?")) {
                              deleteWeeklyReport.mutate(report.id);
                            }
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {report.activities && (
                        <div>
                          <p className="font-semibold text-foreground mb-1">Atividades:</p>
                          <p className="text-sm text-muted-foreground whitespace-pre-wrap">{report.activities}</p>
                        </div>
                      )}
                      {report.creatives && (
                        <div>
                          <p className="font-semibold text-foreground mb-1">Criativos:</p>
                          <p className="text-sm text-muted-foreground whitespace-pre-wrap">{report.creatives}</p>
                        </div>
                      )}
                      {report.performance && (
                        <div>
                          <p className="font-semibold text-foreground mb-1">Performance:</p>
                          <p className="text-sm text-muted-foreground whitespace-pre-wrap">{report.performance}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="access" className="mt-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-foreground">Acessos do Cliente</h2>
              <Button onClick={() => setIsAccessDialogOpen(true)} className="bg-primary text-primary-foreground">
                <Plus className="mr-2 h-4 w-4" />
                Adicionar Acesso
              </Button>
            </div>

            {!accesses || accesses.length === 0 ? (
              <Card className="bg-card text-card-foreground">
                <CardContent className="py-8 text-center text-muted-foreground">
                  Nenhum acesso cadastrado
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {accesses.map((access) => (
                  <Card key={access.id} className="bg-card text-card-foreground border-border">
                    <CardHeader>
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-lg">{access.platform}</CardTitle>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => {
                            if (confirm("Excluir este acesso?")) {
                              deleteAccess.mutate(access.id);
                            }
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                      {access.username && (
                        <div>
                          <span className="text-muted-foreground">Usuário:</span> {access.username}
                        </div>
                      )}
                      {access.password && (
                        <div>
                          <span className="text-muted-foreground">Senha:</span> {access.password}
                        </div>
                      )}
                      {access.url && (
                        <div>
                          <span className="text-muted-foreground">URL:</span>{" "}
                          <a href={access.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                            {access.url}
                          </a>
                        </div>
                      )}
                      {access.notes && (
                        <div>
                          <span className="text-muted-foreground">Notas:</span> {access.notes}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="pages" className="mt-6">
            <EditablePage clientId={clientId} pageType="traffic" title="Páginas e Documentos" />
          </TabsContent>
        </Tabs>

        {/* KPI Dialog */}
        <Dialog open={isKpiDialogOpen} onOpenChange={setIsKpiDialogOpen}>
          <DialogContent className="bg-card text-card-foreground max-w-2xl">
            <DialogHeader>
              <DialogTitle>Adicionar KPI</DialogTitle>
              <DialogDescription>Cadastre um novo KPI para este cliente</DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="col-span-2 space-y-2">
                <Label>Período *</Label>
                <Input
                  placeholder="Ex: Janeiro 2024"
                  value={kpiPeriod}
                  onChange={(e) => setKpiPeriod(e.target.value)}
                  className="bg-background text-foreground"
                />
              </div>
              <div className="space-y-2">
                <Label>CTR</Label>
                <Input
                  placeholder="Ex: 2.5%"
                  value={kpiCtr}
                  onChange={(e) => setKpiCtr(e.target.value)}
                  className="bg-background text-foreground"
                />
              </div>
              <div className="space-y-2">
                <Label>CPC</Label>
                <Input
                  placeholder="Ex: R$ 1.50"
                  value={kpiCpc}
                  onChange={(e) => setKpiCpc(e.target.value)}
                  className="bg-background text-foreground"
                />
              </div>
              <div className="space-y-2">
                <Label>CPM</Label>
                <Input
                  placeholder="Ex: R$ 15.00"
                  value={kpiCpm}
                  onChange={(e) => setKpiCpm(e.target.value)}
                  className="bg-background text-foreground"
                />
              </div>
              <div className="space-y-2">
                <Label>Conversões</Label>
                <Input
                  placeholder="Ex: 150"
                  value={kpiConversions}
                  onChange={(e) => setKpiConversions(e.target.value)}
                  className="bg-background text-foreground"
                />
              </div>
              <div className="space-y-2">
                <Label>ROAS</Label>
                <Input
                  placeholder="Ex: 4.2"
                  value={kpiRoas}
                  onChange={(e) => setKpiRoas(e.target.value)}
                  className="bg-background text-foreground"
                />
              </div>
              <div className="space-y-2">
                <Label>Impressões</Label>
                <Input
                  placeholder="Ex: 50000"
                  value={kpiImpressions}
                  onChange={(e) => setKpiImpressions(e.target.value)}
                  className="bg-background text-foreground"
                />
              </div>
              <div className="space-y-2">
                <Label>Cliques</Label>
                <Input
                  placeholder="Ex: 1250"
                  value={kpiClicks}
                  onChange={(e) => setKpiClicks(e.target.value)}
                  className="bg-background text-foreground"
                />
              </div>
              <div className="space-y-2">
                <Label>Gasto</Label>
                <Input
                  placeholder="Ex: R$ 5000.00"
                  value={kpiSpend}
                  onChange={(e) => setKpiSpend(e.target.value)}
                  className="bg-background text-foreground"
                />
              </div>
              <div className="col-span-2 space-y-2">
                <Label>Tipo</Label>
                <select
                  value={kpiIsCurrent}
                  onChange={(e) => setKpiIsCurrent(parseInt(e.target.value))}
                  className="w-full p-2 rounded-md border bg-background text-foreground"
                >
                  <option value={1}>KPI Atual</option>
                  <option value={0}>KPI Passado</option>
                </select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsKpiDialogOpen(false)} className="bg-background text-foreground">
                Cancelar
              </Button>
              <Button onClick={handleCreateKpi} disabled={createKpi.isPending} className="bg-primary text-primary-foreground">
                {createKpi.isPending ? "Salvando..." : "Salvar"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Access Dialog */}
        <Dialog open={isAccessDialogOpen} onOpenChange={setIsAccessDialogOpen}>
          <DialogContent className="bg-card text-card-foreground">
            <DialogHeader>
              <DialogTitle>Adicionar Acesso</DialogTitle>
              <DialogDescription>Cadastre um novo acesso para este cliente</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Plataforma *</Label>
                <Input
                  placeholder="Ex: Google Ads"
                  value={accessPlatform}
                  onChange={(e) => setAccessPlatform(e.target.value)}
                  className="bg-background text-foreground"
                />
              </div>
              <div className="space-y-2">
                <Label>Usuário</Label>
                <Input
                  placeholder="Ex: usuario@email.com"
                  value={accessUsername}
                  onChange={(e) => setAccessUsername(e.target.value)}
                  className="bg-background text-foreground"
                />
              </div>
              <div className="space-y-2">
                <Label>Senha</Label>
                <Input
                  type="password"
                  placeholder="********"
                  value={accessPassword}
                  onChange={(e) => setAccessPassword(e.target.value)}
                  className="bg-background text-foreground"
                />
              </div>
              <div className="space-y-2">
                <Label>URL</Label>
                <Input
                  placeholder="https://..."
                  value={accessUrl}
                  onChange={(e) => setAccessUrl(e.target.value)}
                  className="bg-background text-foreground"
                />
              </div>
              <div className="space-y-2">
                <Label>Notas</Label>
                <Textarea
                  placeholder="Observações adicionais"
                  value={accessNotes}
                  onChange={(e) => setAccessNotes(e.target.value)}
                  className="bg-background text-foreground"
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAccessDialogOpen(false)} className="bg-background text-foreground">
                Cancelar
              </Button>
              <Button onClick={handleCreateAccess} disabled={createAccess.isPending} className="bg-primary text-primary-foreground">
                {createAccess.isPending ? "Salvando..." : "Salvar"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Weekly Report Dialog */}
        <Dialog open={isWeeklyReportDialogOpen} onOpenChange={setIsWeeklyReportDialogOpen}>
          <DialogContent className="bg-card text-card-foreground max-w-2xl">
            <DialogHeader>
              <DialogTitle>Adicionar Relatório Semanal</DialogTitle>
              <DialogDescription>Cadastre um novo relatório semanal</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Semana *</Label>
                  <Input
                    type="number"
                    placeholder="Ex: 1"
                    value={reportWeek}
                    onChange={(e) => setReportWeek(e.target.value)}
                    className="bg-background text-foreground"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Ano *</Label>
                  <Input
                    type="number"
                    placeholder="Ex: 2024"
                    value={reportYear}
                    onChange={(e) => setReportYear(e.target.value)}
                    className="bg-background text-foreground"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Data de Início</Label>
                  <Input
                    type="date"
                    value={reportStartDate}
                    onChange={(e) => setReportStartDate(e.target.value)}
                    className="bg-background text-foreground"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Data de Término</Label>
                  <Input
                    type="date"
                    value={reportEndDate}
                    onChange={(e) => setReportEndDate(e.target.value)}
                    className="bg-background text-foreground"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Atividades</Label>
                <Textarea
                  placeholder="O que foi feito nesta semana..."
                  value={reportActivities}
                  onChange={(e) => setReportActivities(e.target.value)}
                  className="bg-background text-foreground"
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label>Criativos</Label>
                <Textarea
                  placeholder="Criativos utilizados..."
                  value={reportCreatives}
                  onChange={(e) => setReportCreatives(e.target.value)}
                  className="bg-background text-foreground"
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label>Performance</Label>
                <Textarea
                  placeholder="O que funcionou e o que não funcionou..."
                  value={reportPerformance}
                  onChange={(e) => setReportPerformance(e.target.value)}
                  className="bg-background text-foreground"
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsWeeklyReportDialogOpen(false)} className="bg-background text-foreground">
                Cancelar
              </Button>
              <Button onClick={handleCreateWeeklyReport} disabled={createWeeklyReport.isPending} className="bg-primary text-primary-foreground">
                {createWeeklyReport.isPending ? "Salvando..." : "Salvar"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
