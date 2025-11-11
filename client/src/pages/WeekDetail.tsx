import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { trpc } from "@/lib/trpc";
import { ArrowLeft, Edit, Plus, Trash2, GripVertical, ChevronRight } from "lucide-react";
import { useState, useMemo, memo } from "react";
import { Link, useRoute } from "wouter";
import { toast } from "sonner";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent, DragOverlay, DragStartEvent, useDroppable } from "@dnd-kit/core";
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { restrictToVerticalAxis, restrictToParentElement } from "@dnd-kit/modifiers";

const DAYS = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];
const STAGES = [
  { id: "sem_contato", label: "Sem Contato" },
  { id: "c1", label: "C1" },
  { id: "c2", label: "C2" },
  { id: "c3", label: "C3" },
  { id: "c4", label: "C4" },
  { id: "c5", label: "C5" },
  { id: "interesse", label: "Demonstrou Interesse" },
  { id: "sem_interesse", label: "Não Tem Interesse" },
];

const DroppableStage = memo(function DroppableStage({ stage, children }: { stage: { id: string; label: string }; children: React.ReactNode }) {
  const { setNodeRef, isOver } = useDroppable({
    id: stage.id,
  });

  return (
    <Card ref={setNodeRef} className={`bg-card text-card-foreground border-border transition-colors ${
      isOver ? 'ring-2 ring-primary' : ''
    }`}>
      {children}
    </Card>
  );
});

const SortableItem = memo(function SortableItem({ lead, onEdit, onDelete }: any) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: lead.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="p-3 bg-background rounded-lg border border-border flex items-start justify-between"
    >
      <div className="flex items-start gap-2 flex-1">
        <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing mt-1">
          <GripVertical className="h-4 w-4 text-muted-foreground" />
        </div>
        <div className="flex-1">
          <p className="font-semibold text-foreground">{lead.name}</p>
          {lead.company && (
            <p className="text-sm text-muted-foreground">{lead.company}</p>
          )}
          {lead.contact && (
            <p className="text-sm text-muted-foreground">{lead.contact}</p>
          )}
          {lead.notes && (
            <p className="text-sm text-muted-foreground mt-1">{lead.notes}</p>
          )}
        </div>
      </div>
      <div className="flex gap-1">
        <Button
          size="sm"
          variant="outline"
          onClick={() => onEdit(lead)}
          className="bg-background text-foreground"
        >
          <Edit className="h-4 w-4" />
        </Button>
        <Button
          size="sm"
          variant="destructive"
          onClick={() => {
            if (confirm("Excluir este lead?")) {
              onDelete(lead.id);
            }
          }}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
});

export default function WeekDetail() {
  const [, params] = useRoute("/crm/week/:id");
  const weekId = params?.id ? parseInt(params.id) : 0;
  const { user, loading } = useAuth();

  const [selectedDay, setSelectedDay] = useState(0);
  const [isLeadDialogOpen, setIsLeadDialogOpen] = useState(false);
  const [isScriptDialogOpen, setIsScriptDialogOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<any>(null);
  const [activeDragId, setActiveDragId] = useState<number | null>(null);
  const [advanceDialogOpen, setAdvanceDialogOpen] = useState(false);
  const [advanceFromStage, setAdvanceFromStage] = useState("");
  const [advanceToStage, setAdvanceToStage] = useState("");

  // Lead form state
  const [leadName, setLeadName] = useState("");
  const [leadCompany, setLeadCompany] = useState("");
  const [leadContact, setLeadContact] = useState("");
  const [leadStage, setLeadStage] = useState("sem_contato");
  const [leadNotes, setLeadNotes] = useState("");

  // Script form state
  const [scriptC1, setScriptC1] = useState("");
  const [scriptC2, setScriptC2] = useState("");
  const [scriptC3, setScriptC3] = useState("");
  const [scriptC4, setScriptC4] = useState("");
  const [scriptC5, setScriptC5] = useState("");

  const { data: week } = trpc.crm.getWeekById.useQuery(weekId);
  const { data: leads, refetch: refetchLeads } = trpc.crm.getLeadsByWeek.useQuery(weekId);
  const { data: dailyScripts, refetch: refetchScripts } = trpc.crm.getDailyScriptsByWeek.useQuery(weekId);

  const createLead = trpc.crm.createLead.useMutation({
    onSuccess: () => {
      toast.success(editingLead ? "Lead atualizado!" : "Lead criado!");
      setIsLeadDialogOpen(false);
      resetLeadForm();
      refetchLeads();
    },
  });

  const updateLead = trpc.crm.updateLead.useMutation({
    onSuccess: () => {
      toast.success("Lead atualizado!");
      setIsLeadDialogOpen(false);
      resetLeadForm();
      refetchLeads();
    },
  });

  const deleteLead = trpc.crm.deleteLead.useMutation({
    onSuccess: () => {
      toast.success("Lead excluído!");
      refetchLeads();
    },
  });

  const advanceAllLeads = trpc.crm.advanceAllLeads.useMutation({
    onSuccess: (data) => {
      toast.success(`${data.count} lead(s) avançado(s)!`);
      setAdvanceDialogOpen(false);
      refetchLeads();
    },
  });

  const createDailyScript = trpc.crm.createDailyScript.useMutation({
    onSuccess: () => {
      toast.success("Scripts salvos!");
      setIsScriptDialogOpen(false);
      refetchScripts();
    },
  });

  const updateDailyScript = trpc.crm.updateDailyScript.useMutation({
    onSuccess: () => {
      toast.success("Scripts atualizados!");
      setIsScriptDialogOpen(false);
      refetchScripts();
    },
  });

  // Drag and drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveDragId(event.active.id as number);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveDragId(null);
    
    if (!over) return;
    
    const leadId = parseInt(active.id.toString());
    const overId = over.id.toString();
    
    // Verificar se o over.id é um estágio
    const isStage = STAGES.some(s => s.id === overId);
    
    if (isStage) {
      // Atualizar o lead com o novo estágio
      updateLead.mutate({
        id: leadId,
        stage: overId,
      });
    }
  };

  const resetLeadForm = () => {
    setLeadName("");
    setLeadCompany("");
    setLeadContact("");
    setLeadStage("sem_contato"); // Novos leads começam em Sem Contato
    setLeadNotes("");
    setEditingLead(null);
  };

  const handleOpenLeadDialog = (lead?: any) => {
    if (lead) {
      setEditingLead(lead);
      setLeadName(lead.name);
      setLeadCompany(lead.company || "");
      setLeadContact(lead.contact || "");
      setLeadStage(lead.stage);
      setLeadNotes(lead.notes || "");
    } else {
      resetLeadForm();
    }
    setIsLeadDialogOpen(true);
  };

  const handleSaveLead = () => {
    if (!leadName) {
      toast.error("Nome é obrigatório");
      return;
    }

    if (editingLead) {
      updateLead.mutate({
        id: editingLead.id,
        name: leadName,
        company: leadCompany || undefined,
        contact: leadContact || undefined,
        stage: leadStage,
        notes: leadNotes || undefined,
      });
    } else {
      createLead.mutate({
        weekId,
        dayOfWeek: selectedDay,
        name: leadName,
        company: leadCompany || undefined,
        contact: leadContact || undefined,
        stage: leadStage,
        notes: leadNotes || undefined,
      });
    }
  };

  const handleOpenScriptDialog = () => {
    const script = dailyScripts?.find((s) => s.dayOfWeek === selectedDay);
    if (script) {
      setScriptC1(script.scriptC1 || "");
      setScriptC2(script.scriptC2 || "");
      setScriptC3(script.scriptC3 || "");
      setScriptC4(script.scriptC4 || "");
      setScriptC5(script.scriptC5 || "");
    } else {
      setScriptC1("");
      setScriptC2("");
      setScriptC3("");
      setScriptC4("");
      setScriptC5("");
    }
    setIsScriptDialogOpen(true);
  };

  const handleSaveScripts = () => {
    const existingScript = dailyScripts?.find((s) => s.dayOfWeek === selectedDay);

    if (existingScript) {
      updateDailyScript.mutate({
        id: existingScript.id,
        scriptC1: scriptC1 || undefined,
        scriptC2: scriptC2 || undefined,
        scriptC3: scriptC3 || undefined,
        scriptC4: scriptC4 || undefined,
        scriptC5: scriptC5 || undefined,
      });
    } else {
      createDailyScript.mutate({
        weekId,
        dayOfWeek: selectedDay,
        scriptC1: scriptC1 || undefined,
        scriptC2: scriptC2 || undefined,
        scriptC3: scriptC3 || undefined,
        scriptC4: scriptC4 || undefined,
        scriptC5: scriptC5 || undefined,
      });
    }
  };

  if (loading || !week) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Carregando...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  // Leads em "Sem Contato", "Demonstrou Interesse" e "Não Tem Interesse" aparecem em TODOS os dias
  const leadsForDay = leads?.filter((l) => {
    if (l.stage === "sem_contato" || l.stage === "interesse" || l.stage === "sem_interesse") {
      return true; // Aparecem em todos os dias
    }
    return l.dayOfWeek === selectedDay; // Leads em C1-C5 apenas no dia específico
  }) || [];

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8">
        <Link href="/crm">
          <Button variant="outline" className="mb-4 bg-background text-foreground">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para CRM
          </Button>
        </Link>

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground">{week.name}</h1>
          <p className="text-muted-foreground mt-2">
            {new Date(week.startDate).toLocaleDateString("pt-BR")} -{" "}
            {new Date(week.endDate).toLocaleDateString("pt-BR")}
          </p>
        </div>

        <Tabs value={selectedDay.toString()} onValueChange={(v) => setSelectedDay(parseInt(v))} className="w-full">
          <TabsList className="grid w-full grid-cols-7 bg-muted">
            {DAYS.map((day, index) => (
              <TabsTrigger
                key={index}
                value={index.toString()}
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                {day}
              </TabsTrigger>
            ))}
          </TabsList>

          {DAYS.map((day, dayIndex) => (
            <TabsContent key={dayIndex} value={dayIndex.toString()} className="mt-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-foreground">{day}</h2>
                <div className="flex gap-2">
                  <Button onClick={handleOpenScriptDialog} variant="outline" className="bg-background text-foreground">
                    <Edit className="mr-2 h-4 w-4" />
                    Scripts do Dia
                  </Button>
                  <Button onClick={() => handleOpenLeadDialog()} className="bg-primary text-primary-foreground">
                    <Plus className="mr-2 h-4 w-4" />
                    Adicionar Lead
                  </Button>
                </div>
              </div>

              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
                <div className="space-y-6">
                  {STAGES.map((stage) => {
                    const stageLeads = leadsForDay.filter((l) => l.stage === stage.id);
                    return (
                      <SortableContext key={stage.id} items={stageLeads.map(l => l.id)} strategy={verticalListSortingStrategy}>
                        <DroppableStage stage={stage}>
                          <CardHeader>
                            <CardTitle className="text-lg flex items-center justify-between">
                              <span>{stage.label}</span>
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-normal text-muted-foreground">
                                  {stageLeads.length} lead{stageLeads.length !== 1 ? "s" : ""}
                                </span>
                                {/* Botão de avançar todos para Sem Contato e C1-C4 */}
                                {["sem_contato", "c1", "c2", "c3", "c4"].includes(stage.id) && stageLeads.length > 0 && (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => {
                                      const nextStage = stage.id === "sem_contato" ? "c1" : stage.id === "c1" ? "c2" : stage.id === "c2" ? "c3" : stage.id === "c3" ? "c4" : "c5";
                                      setAdvanceFromStage(stage.id);
                                      setAdvanceToStage(nextStage);
                                      setAdvanceDialogOpen(true);
                                    }}
                                    className="h-7 text-xs bg-background text-foreground hover:bg-accent"
                                  >
                                    <ChevronRight className="h-3 w-3 mr-1" />
                                    Avançar Todos
                                  </Button>
                                )}
                              </div>
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            {stageLeads.length === 0 ? (
                              <p className="text-sm text-muted-foreground text-center py-4">Nenhum lead neste estágio</p>
                            ) : (
                              <div className="space-y-2">
                                {stageLeads.map((lead) => (
                                  <SortableItem
                                    key={lead.id}
                                    lead={lead}
                                    onEdit={handleOpenLeadDialog}
                                    onDelete={(id: number) => deleteLead.mutate(id)}
                                  />
                                ))}
                              </div>
                            )}
                          </CardContent>
                        </DroppableStage>
                      </SortableContext>
                    );
                  })}
                </div>
              </DndContext>
            </TabsContent>
          ))}
        </Tabs>

        {/* Lead Dialog */}
        <Dialog open={isLeadDialogOpen} onOpenChange={setIsLeadDialogOpen}>
          <DialogContent className="bg-card text-card-foreground">
            <DialogHeader>
              <DialogTitle>{editingLead ? "Editar Lead" : "Adicionar Lead"}</DialogTitle>
              <DialogDescription>
                {editingLead ? "Atualize as informações do lead" : "Cadastre um novo lead"}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Nome *</Label>
                <Input
                  placeholder="Nome do lead"
                  value={leadName}
                  onChange={(e) => setLeadName(e.target.value)}
                  className="bg-background text-foreground"
                />
              </div>
              <div className="space-y-2">
                <Label>Empresa</Label>
                <Input
                  placeholder="Nome da empresa"
                  value={leadCompany}
                  onChange={(e) => setLeadCompany(e.target.value)}
                  className="bg-background text-foreground"
                />
              </div>
              <div className="space-y-2">
                <Label>Contato</Label>
                <Input
                  placeholder="Email ou telefone"
                  value={leadContact}
                  onChange={(e) => setLeadContact(e.target.value)}
                  className="bg-background text-foreground"
                />
              </div>
              <div className="space-y-2">
                <Label>Estágio</Label>
                <select
                  value={leadStage}
                  onChange={(e) => setLeadStage(e.target.value)}
                  className="w-full p-2 rounded-md border bg-background text-foreground"
                >
                  {STAGES.map((stage) => (
                    <option key={stage.id} value={stage.id}>
                      {stage.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label>Observações</Label>
                <Textarea
                  placeholder="Notas sobre o lead"
                  value={leadNotes}
                  onChange={(e) => setLeadNotes(e.target.value)}
                  className="bg-background text-foreground"
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsLeadDialogOpen(false)}
                className="bg-background text-foreground"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleSaveLead}
                disabled={createLead.isPending || updateLead.isPending}
                className="bg-primary text-primary-foreground"
              >
                {createLead.isPending || updateLead.isPending ? "Salvando..." : "Salvar"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Scripts Dialog */}
        <Dialog open={isScriptDialogOpen} onOpenChange={setIsScriptDialogOpen}>
          <DialogContent className="bg-card text-card-foreground max-w-3xl">
            <DialogHeader>
              <DialogTitle>Scripts do Dia - {DAYS[selectedDay]}</DialogTitle>
              <DialogDescription>
                Configure os scripts para cada estágio de contato (C1 a C5)
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto">
              <div className="space-y-2">
                <Label>Script C1 (Primeiro Contato)</Label>
                <Textarea
                  placeholder="Mensagem para o primeiro contato..."
                  value={scriptC1}
                  onChange={(e) => setScriptC1(e.target.value)}
                  className="bg-background text-foreground"
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label>Script C2 (Segundo Contato)</Label>
                <Textarea
                  placeholder="Mensagem para o segundo contato..."
                  value={scriptC2}
                  onChange={(e) => setScriptC2(e.target.value)}
                  className="bg-background text-foreground"
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label>Script C3 (Terceiro Contato)</Label>
                <Textarea
                  placeholder="Mensagem para o terceiro contato..."
                  value={scriptC3}
                  onChange={(e) => setScriptC3(e.target.value)}
                  className="bg-background text-foreground"
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label>Script C4 (Quarto Contato)</Label>
                <Textarea
                  placeholder="Mensagem para o quarto contato..."
                  value={scriptC4}
                  onChange={(e) => setScriptC4(e.target.value)}
                  className="bg-background text-foreground"
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label>Script C5 (Quinto Contato)</Label>
                <Textarea
                  placeholder="Mensagem para o quinto contato..."
                  value={scriptC5}
                  onChange={(e) => setScriptC5(e.target.value)}
                  className="bg-background text-foreground"
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsScriptDialogOpen(false)}
                className="bg-background text-foreground"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleSaveScripts}
                disabled={createDailyScript.isPending || updateDailyScript.isPending}
                className="bg-primary text-primary-foreground"
              >
                {createDailyScript.isPending || updateDailyScript.isPending ? "Salvando..." : "Salvar Scripts"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* AlertDialog para confirmar avanço em massa */}
        <AlertDialog open={advanceDialogOpen} onOpenChange={setAdvanceDialogOpen}>
          <AlertDialogContent className="bg-card text-card-foreground border-border">
            <AlertDialogHeader>
              <AlertDialogTitle>Avançar todos os leads?</AlertDialogTitle>
              <AlertDialogDescription className="text-muted-foreground">
                Todos os leads de {STAGES.find(s => s.id === advanceFromStage)?.label} serão movidos para {STAGES.find(s => s.id === advanceToStage)?.label}. Esta ação não pode ser desfeita.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="bg-background text-foreground">Cancelar</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  advanceAllLeads.mutate({
                    weekId,
                    dayOfWeek: selectedDay,
                    fromStage: advanceFromStage,
                    toStage: advanceToStage,
                  });
                }}
                className="bg-primary text-primary-foreground"
              >
                Avançar Todos
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
