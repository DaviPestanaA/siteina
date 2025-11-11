import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { ArrowLeft, Calendar, Plus, Users, Video, Edit, Trash2 } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";
import { toast } from "sonner";

export default function CRM() {
  const { user, loading } = useAuth();
  
  // Dialog states
  const [isWeekDialogOpen, setIsWeekDialogOpen] = useState(false);
  const [isFutureClientDialogOpen, setIsFutureClientDialogOpen] = useState(false);
  const [isMeetingDialogOpen, setIsMeetingDialogOpen] = useState(false);
  const [editingFutureClient, setEditingFutureClient] = useState<any>(null);
  const [editingMeeting, setEditingMeeting] = useState<any>(null);
  
  // Week form
  const [weekName, setWeekName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  
  // Future client form
  const [futureClientName, setFutureClientName] = useState("");
  const [futureClientCompany, setFutureClientCompany] = useState("");
  const [futureClientContact, setFutureClientContact] = useState("");
  const [futureClientNotes, setFutureClientNotes] = useState("");
  const [futureClientExpectedDate, setFutureClientExpectedDate] = useState("");
  
  // Meeting form
  const [meetingLeadName, setMeetingLeadName] = useState("");
  const [meetingCompany, setMeetingCompany] = useState("");
  const [meetingContact, setMeetingContact] = useState("");
  const [meetingDate, setMeetingDate] = useState("");
  const [meetingLink, setMeetingLink] = useState("");
  const [meetingNotes, setMeetingNotes] = useState("");
  const [meetingStatus, setMeetingStatus] = useState("agendada");
  
  // Queries
  const { data: weeks, isLoading: weeksLoading, refetch: refetchWeeks } = trpc.crm.getAllWeeks.useQuery();
  const { data: futureClients, refetch: refetchFutureClients } = trpc.crm.getAllFutureClients.useQuery();
  const { data: meetings, refetch: refetchMeetings } = trpc.crm.getAllMeetings.useQuery();
  
  // Mutations - Weeks
  const createWeek = trpc.crm.createWeek.useMutation({
    onSuccess: () => {
      toast.success("Semana criada!");
      setIsWeekDialogOpen(false);
      setWeekName("");
      setStartDate("");
      setEndDate("");
      refetchWeeks();
    },
  });
  
  // Mutations - Future Clients
  const createFutureClient = trpc.crm.createFutureClient.useMutation({
    onSuccess: () => {
      toast.success(editingFutureClient ? "Cliente atualizado!" : "Cliente adicionado!");
      setIsFutureClientDialogOpen(false);
      resetFutureClientForm();
      refetchFutureClients();
    },
  });
  
  const updateFutureClient = trpc.crm.updateFutureClient.useMutation({
    onSuccess: () => {
      toast.success("Cliente atualizado!");
      setIsFutureClientDialogOpen(false);
      resetFutureClientForm();
      refetchFutureClients();
    },
  });
  
  const deleteFutureClient = trpc.crm.deleteFutureClient.useMutation({
    onSuccess: () => {
      toast.success("Cliente excluído!");
      refetchFutureClients();
    },
  });
  
  // Mutations - Meetings
  const createMeeting = trpc.crm.createMeeting.useMutation({
    onSuccess: () => {
      toast.success(editingMeeting ? "Reunião atualizada!" : "Reunião agendada!");
      setIsMeetingDialogOpen(false);
      resetMeetingForm();
      refetchMeetings();
    },
  });
  
  const updateMeeting = trpc.crm.updateMeeting.useMutation({
    onSuccess: () => {
      toast.success("Reunião atualizada!");
      setIsMeetingDialogOpen(false);
      resetMeetingForm();
      refetchMeetings();
    },
  });
  
  const deleteMeeting = trpc.crm.deleteMeeting.useMutation({
    onSuccess: () => {
      toast.success("Reunião excluída!");
      refetchMeetings();
    },
  });
  
  // Form handlers
  const handleCreateWeek = () => {
    if (!weekName || !startDate || !endDate) {
      toast.error("Preencha todos os campos");
      return;
    }
    createWeek.mutate({
      name: weekName,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
    });
  };
  
  const resetFutureClientForm = () => {
    setFutureClientName("");
    setFutureClientCompany("");
    setFutureClientContact("");
    setFutureClientNotes("");
    setFutureClientExpectedDate("");
    setEditingFutureClient(null);
  };
  
  const handleOpenFutureClientDialog = (client?: any) => {
    if (client) {
      setEditingFutureClient(client);
      setFutureClientName(client.name);
      setFutureClientCompany(client.company || "");
      setFutureClientContact(client.contact || "");
      setFutureClientNotes(client.notes || "");
      setFutureClientExpectedDate(client.expectedDate ? new Date(client.expectedDate).toISOString().split("T")[0] : "");
    } else {
      resetFutureClientForm();
    }
    setIsFutureClientDialogOpen(true);
  };
  
  const handleSaveFutureClient = () => {
    if (!futureClientName) {
      toast.error("Nome é obrigatório");
      return;
    }
    
    const data = {
      name: futureClientName,
      company: futureClientCompany || undefined,
      contact: futureClientContact || undefined,
      notes: futureClientNotes || undefined,
      expectedDate: futureClientExpectedDate ? new Date(futureClientExpectedDate) : undefined,
    };
    
    if (editingFutureClient) {
      updateFutureClient.mutate({ id: editingFutureClient.id, ...data });
    } else {
      createFutureClient.mutate(data);
    }
  };
  
  const resetMeetingForm = () => {
    setMeetingLeadName("");
    setMeetingCompany("");
    setMeetingContact("");
    setMeetingDate("");
    setMeetingLink("");
    setMeetingNotes("");
    setMeetingStatus("agendada");
    setEditingMeeting(null);
  };
  
  const handleOpenMeetingDialog = (meeting?: any) => {
    if (meeting) {
      setEditingMeeting(meeting);
      setMeetingLeadName(meeting.leadName);
      setMeetingCompany(meeting.company || "");
      setMeetingContact(meeting.contact || "");
      setMeetingDate(new Date(meeting.meetingDate).toISOString().slice(0, 16));
      setMeetingLink(meeting.meetingLink || "");
      setMeetingNotes(meeting.notes || "");
      setMeetingStatus(meeting.status || "agendada");
    } else {
      resetMeetingForm();
    }
    setIsMeetingDialogOpen(true);
  };
  
  const handleSaveMeeting = () => {
    if (!meetingLeadName || !meetingDate) {
      toast.error("Nome e data são obrigatórios");
      return;
    }
    
    const data = {
      leadName: meetingLeadName,
      company: meetingCompany || undefined,
      contact: meetingContact || undefined,
      meetingDate: new Date(meetingDate),
      meetingLink: meetingLink || undefined,
      notes: meetingNotes || undefined,
      status: meetingStatus || undefined,
    };
    
    if (editingMeeting) {
      updateMeeting.mutate({ id: editingMeeting.id, ...data });
    } else {
      createMeeting.mutate(data);
    }
  };
  
  if (loading || weeksLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Carregando...</div>
      </div>
    );
  }
  
  if (!user) {
    return null;
  }
  
  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8">
        <Link href="/">
          <Button variant="outline" className="mb-4 bg-background text-foreground">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para Início
          </Button>
        </Link>
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground">CRM</h1>
          <p className="text-muted-foreground mt-2">
            Gerencie suas abordagens, futuros clientes e reuniões
          </p>
        </div>
        
        <Tabs defaultValue="semanas" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-muted mb-6">
            <TabsTrigger value="semanas" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Calendar className="mr-2 h-4 w-4" />
              Semanas
            </TabsTrigger>
            <TabsTrigger value="futuros" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Users className="mr-2 h-4 w-4" />
              Futuros Clientes
            </TabsTrigger>
            <TabsTrigger value="reunioes" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Video className="mr-2 h-4 w-4" />
              Reuniões Agendadas
            </TabsTrigger>
          </TabsList>
          
          {/* Tab: Semanas */}
          <TabsContent value="semanas">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-foreground">Semanas de Prospecção</h2>
              <Button onClick={() => setIsWeekDialogOpen(true)} className="bg-primary text-primary-foreground">
                <Plus className="mr-2 h-4 w-4" />
                Nova Semana
              </Button>
            </div>
            
            {!weeks || weeks.length === 0 ? (
              <Card className="bg-card text-card-foreground border-border">
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <p className="text-muted-foreground mb-4">Nenhuma semana criada ainda</p>
                  <Button onClick={() => setIsWeekDialogOpen(true)} className="bg-primary text-primary-foreground">
                    <Plus className="mr-2 h-4 w-4" />
                    Criar Primeira Semana
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {weeks.map((week) => (
                  <Link key={week.id} href={`/crm/week/${week.id}`}>
                    <Card className="bg-card text-card-foreground border-border hover:border-primary transition-colors cursor-pointer">
                      <CardHeader>
                        <CardTitle className="text-foreground">{week.name}</CardTitle>
                        <CardDescription className="text-muted-foreground">
                          {new Date(week.startDate).toLocaleDateString("pt-BR")} -{" "}
                          {new Date(week.endDate).toLocaleDateString("pt-BR")}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">Clique para ver os detalhes</p>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </TabsContent>
          
          {/* Tab: Futuros Clientes */}
          <TabsContent value="futuros">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-foreground">Futuros Clientes</h2>
              <Button onClick={() => handleOpenFutureClientDialog()} className="bg-primary text-primary-foreground">
                <Plus className="mr-2 h-4 w-4" />
                Adicionar Cliente
              </Button>
            </div>
            
            {!futureClients || futureClients.length === 0 ? (
              <Card className="bg-card text-card-foreground border-border">
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <p className="text-muted-foreground mb-4">Nenhum futuro cliente cadastrado</p>
                  <Button onClick={() => handleOpenFutureClientDialog()} className="bg-primary text-primary-foreground">
                    <Plus className="mr-2 h-4 w-4" />
                    Adicionar Primeiro Cliente
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {futureClients.map((client) => (
                  <Card key={client.id} className="bg-card text-card-foreground border-border">
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-foreground">{client.name}</h3>
                          {client.company && <p className="text-sm text-muted-foreground">{client.company}</p>}
                          {client.contact && <p className="text-sm text-muted-foreground">{client.contact}</p>}
                          {client.expectedDate && (
                            <p className="text-sm text-muted-foreground mt-2">
                              Previsão: {new Date(client.expectedDate).toLocaleDateString("pt-BR")}
                            </p>
                          )}
                          {client.notes && <p className="text-sm text-muted-foreground mt-2">{client.notes}</p>}
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => handleOpenFutureClientDialog(client)} className="bg-background text-foreground">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => {
                              if (confirm("Excluir este cliente?")) {
                                deleteFutureClient.mutate(client.id);
                              }
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
          
          {/* Tab: Reuniões */}
          <TabsContent value="reunioes">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-foreground">Reuniões Agendadas</h2>
              <Button onClick={() => handleOpenMeetingDialog()} className="bg-primary text-primary-foreground">
                <Plus className="mr-2 h-4 w-4" />
                Agendar Reunião
              </Button>
            </div>
            
            {!meetings || meetings.length === 0 ? (
              <Card className="bg-card text-card-foreground border-border">
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <p className="text-muted-foreground mb-4">Nenhuma reunião agendada</p>
                  <Button onClick={() => handleOpenMeetingDialog()} className="bg-primary text-primary-foreground">
                    <Plus className="mr-2 h-4 w-4" />
                    Agendar Primeira Reunião
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {meetings.map((meeting) => (
                  <Card key={meeting.id} className="bg-card text-card-foreground border-border">
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-foreground">{meeting.leadName}</h3>
                          {meeting.company && <p className="text-sm text-muted-foreground">{meeting.company}</p>}
                          {meeting.contact && <p className="text-sm text-muted-foreground">{meeting.contact}</p>}
                          <p className="text-sm text-muted-foreground mt-2">
                            📅 {new Date(meeting.meetingDate).toLocaleString("pt-BR")}
                          </p>
                          {meeting.meetingLink && (
                            <a href={meeting.meetingLink} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline mt-1 block">
                              🔗 Link da reunião
                            </a>
                          )}
                          {meeting.notes && <p className="text-sm text-muted-foreground mt-2">{meeting.notes}</p>}
                          <p className="text-sm font-medium mt-2">
                            Status: {meeting.status === "agendada" ? "Agendada" : meeting.status === "realizada" ? "Realizada" : "Cancelada"}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => handleOpenMeetingDialog(meeting)} className="bg-background text-foreground">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => {
                              if (confirm("Excluir esta reunião?")) {
                                deleteMeeting.mutate(meeting.id);
                              }
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
        
        {/* Dialog: Create Week */}
        <Dialog open={isWeekDialogOpen} onOpenChange={setIsWeekDialogOpen}>
          <DialogContent className="bg-card text-card-foreground">
            <DialogHeader>
              <DialogTitle>Criar Nova Semana</DialogTitle>
              <DialogDescription>Adicione uma nova semana de prospecção</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Nome da Semana *</Label>
                <Input placeholder="Ex: Semana 1 - Janeiro" value={weekName} onChange={(e) => setWeekName(e.target.value)} className="bg-background text-foreground" />
              </div>
              <div className="space-y-2">
                <Label>Data de Início *</Label>
                <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="bg-background text-foreground" />
              </div>
              <div className="space-y-2">
                <Label>Data de Término *</Label>
                <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="bg-background text-foreground" />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsWeekDialogOpen(false)} className="bg-background text-foreground">
                Cancelar
              </Button>
              <Button onClick={handleCreateWeek} disabled={createWeek.isPending} className="bg-primary text-primary-foreground">
                {createWeek.isPending ? "Criando..." : "Criar Semana"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        {/* Dialog: Future Client */}
        <Dialog open={isFutureClientDialogOpen} onOpenChange={setIsFutureClientDialogOpen}>
          <DialogContent className="bg-card text-card-foreground">
            <DialogHeader>
              <DialogTitle>{editingFutureClient ? "Editar Cliente" : "Adicionar Futuro Cliente"}</DialogTitle>
              <DialogDescription>{editingFutureClient ? "Atualize as informações" : "Cadastre um novo futuro cliente"}</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Nome *</Label>
                <Input placeholder="Nome do cliente" value={futureClientName} onChange={(e) => setFutureClientName(e.target.value)} className="bg-background text-foreground" />
              </div>
              <div className="space-y-2">
                <Label>Empresa</Label>
                <Input placeholder="Nome da empresa" value={futureClientCompany} onChange={(e) => setFutureClientCompany(e.target.value)} className="bg-background text-foreground" />
              </div>
              <div className="space-y-2">
                <Label>Contato</Label>
                <Input placeholder="Email ou telefone" value={futureClientContact} onChange={(e) => setFutureClientContact(e.target.value)} className="bg-background text-foreground" />
              </div>
              <div className="space-y-2">
                <Label>Data Prevista</Label>
                <Input type="date" value={futureClientExpectedDate} onChange={(e) => setFutureClientExpectedDate(e.target.value)} className="bg-background text-foreground" />
              </div>
              <div className="space-y-2">
                <Label>Observações</Label>
                <Textarea placeholder="Notas sobre o cliente" value={futureClientNotes} onChange={(e) => setFutureClientNotes(e.target.value)} className="bg-background text-foreground" rows={3} />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsFutureClientDialogOpen(false)} className="bg-background text-foreground">
                Cancelar
              </Button>
              <Button onClick={handleSaveFutureClient} disabled={createFutureClient.isPending || updateFutureClient.isPending} className="bg-primary text-primary-foreground">
                {createFutureClient.isPending || updateFutureClient.isPending ? "Salvando..." : "Salvar"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        {/* Dialog: Meeting */}
        <Dialog open={isMeetingDialogOpen} onOpenChange={setIsMeetingDialogOpen}>
          <DialogContent className="bg-card text-card-foreground">
            <DialogHeader>
              <DialogTitle>{editingMeeting ? "Editar Reunião" : "Agendar Reunião"}</DialogTitle>
              <DialogDescription>{editingMeeting ? "Atualize as informações" : "Agende uma nova reunião"}</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Nome do Lead *</Label>
                <Input placeholder="Nome do lead" value={meetingLeadName} onChange={(e) => setMeetingLeadName(e.target.value)} className="bg-background text-foreground" />
              </div>
              <div className="space-y-2">
                <Label>Empresa</Label>
                <Input placeholder="Nome da empresa" value={meetingCompany} onChange={(e) => setMeetingCompany(e.target.value)} className="bg-background text-foreground" />
              </div>
              <div className="space-y-2">
                <Label>Contato</Label>
                <Input placeholder="Email ou telefone" value={meetingContact} onChange={(e) => setMeetingContact(e.target.value)} className="bg-background text-foreground" />
              </div>
              <div className="space-y-2">
                <Label>Data e Hora *</Label>
                <Input type="datetime-local" value={meetingDate} onChange={(e) => setMeetingDate(e.target.value)} className="bg-background text-foreground" />
              </div>
              <div className="space-y-2">
                <Label>Link da Reunião</Label>
                <Input placeholder="https://meet.google.com/..." value={meetingLink} onChange={(e) => setMeetingLink(e.target.value)} className="bg-background text-foreground" />
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <select value={meetingStatus} onChange={(e) => setMeetingStatus(e.target.value)} className="w-full p-2 rounded-md border bg-background text-foreground">
                  <option value="agendada">Agendada</option>
                  <option value="realizada">Realizada</option>
                  <option value="cancelada">Cancelada</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label>Observações</Label>
                <Textarea placeholder="Notas sobre a reunião" value={meetingNotes} onChange={(e) => setMeetingNotes(e.target.value)} className="bg-background text-foreground" rows={3} />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsMeetingDialogOpen(false)} className="bg-background text-foreground">
                Cancelar
              </Button>
              <Button onClick={handleSaveMeeting} disabled={createMeeting.isPending || updateMeeting.isPending} className="bg-primary text-primary-foreground">
                {createMeeting.isPending || updateMeeting.isPending ? "Salvando..." : "Salvar"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
