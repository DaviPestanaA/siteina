import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { trpc } from "@/lib/trpc";
import { ArrowLeft, Calendar, CheckCircle2, Circle, Plus, Trash2, Users } from "lucide-react";
import { useState, useMemo } from "react";
import { Link } from "wouter";
import { toast } from "sonner";

export default function Tasks() {
  const { user, loading } = useAuth();
  const [viewMode, setViewMode] = useState<"daily" | "weekly">("daily");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedMember, setSelectedMember] = useState<"davi" | "bia" | "lucas">("davi");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // Form state
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [taskMember, setTaskMember] = useState<"davi" | "bia" | "lucas">("davi");
  const [taskDate, setTaskDate] = useState(new Date().toISOString().split('T')[0]);

  // Get week number from date
  const getWeekNumber = (date: Date) => {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(),0,1));
    return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1)/7);
  };

  const currentWeekNumber = getWeekNumber(selectedDate);
  const currentYear = selectedDate.getFullYear();

  // Queries
  const { data: dailyTasks, refetch: refetchDaily } = trpc.tasks.getByMemberAndDate.useQuery({
    member: selectedMember,
    date: selectedDate,
  }, { enabled: viewMode === "daily" });

  const { data: weeklyTasks, refetch: refetchWeekly } = trpc.tasks.getByWeek.useQuery({
    weekNumber: currentWeekNumber,
    year: currentYear,
  }, { enabled: viewMode === "weekly" });

  // Mutations
  const createTask = trpc.tasks.create.useMutation({
    onSuccess: () => {
      toast.success("Task criada com sucesso!");
      setIsDialogOpen(false);
      resetForm();
      refetchDaily();
      refetchWeekly();
    },
    onError: (error) => {
      toast.error(`Erro ao criar task: ${error.message}`);
    },
  });

  const updateTask = trpc.tasks.update.useMutation({
    onSuccess: () => {
      toast.success("Task atualizada!");
      refetchDaily();
      refetchWeekly();
    },
    onError: (error) => {
      toast.error(`Erro ao atualizar task: ${error.message}`);
    },
  });

  const deleteTask = trpc.tasks.delete.useMutation({
    onSuccess: () => {
      toast.success("Task excluída!");
      refetchDaily();
      refetchWeekly();
    },
    onError: (error) => {
      toast.error(`Erro ao excluir task: ${error.message}`);
    },
  });

  const resetForm = () => {
    setTaskTitle("");
    setTaskDescription("");
    setTaskMember("davi");
    setTaskDate(new Date().toISOString().split('T')[0]);
  };

  const handleCreateTask = () => {
    if (!taskTitle.trim()) {
      toast.error("Título é obrigatório");
      return;
    }

    const date = new Date(taskDate);
    createTask.mutate({
      title: taskTitle,
      description: taskDescription || undefined,
      member: taskMember,
      date: date,
      weekNumber: getWeekNumber(date),
      year: date.getFullYear(),
    });
  };

  const handleToggleComplete = (taskId: number, currentStatus: number) => {
    updateTask.mutate({
      id: taskId,
      completed: currentStatus === 1 ? 0 : 1,
    });
  };

  const handleDeleteTask = (taskId: number) => {
    if (confirm("Tem certeza que deseja excluir esta task?")) {
      deleteTask.mutate(taskId);
    }
  };

  // Group weekly tasks by member
  const tasksByMember = useMemo(() => {
    if (!weeklyTasks) return { davi: [], bia: [], lucas: [] };
    
    return {
      davi: weeklyTasks.filter(t => t.member === "davi"),
      bia: weeklyTasks.filter(t => t.member === "bia"),
      lucas: weeklyTasks.filter(t => t.member === "lucas"),
    };
  }, [weeklyTasks]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-foreground mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-96 bg-card text-card-foreground">
          <CardHeader>
            <CardTitle>Acesso Restrito</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">Você precisa estar logado para acessar esta página.</p>
            <Button asChild className="w-full">
              <a href={getLoginUrl()}>Fazer Login</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar para Início
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Tasks Diárias</h1>
              <p className="text-sm text-muted-foreground">Gerencie as tarefas da equipe</p>
            </div>
          </div>
          <Button onClick={() => setIsDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Nova Task
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* View Mode Tabs */}
        <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as "daily" | "weekly")} className="mb-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="daily">
              <Calendar className="h-4 w-4 mr-2" />
              Visualização Diária
            </TabsTrigger>
            <TabsTrigger value="weekly">
              <Users className="h-4 w-4 mr-2" />
              Visualização Semanal
            </TabsTrigger>
          </TabsList>

          {/* Daily View */}
          <TabsContent value="daily" className="space-y-4">
            <div className="flex items-center gap-4 mb-4">
              <div>
                <Label>Data</Label>
                <Input
                  type="date"
                  value={selectedDate.toISOString().split('T')[0]}
                  onChange={(e) => setSelectedDate(new Date(e.target.value))}
                  className="bg-background text-foreground"
                />
              </div>
              <div>
                <Label>Membro</Label>
                <select
                  value={selectedMember}
                  onChange={(e) => setSelectedMember(e.target.value as "davi" | "bia" | "lucas")}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                >
                  <option value="davi">Davi</option>
                  <option value="bia">Bia</option>
                  <option value="lucas">Lucas</option>
                </select>
              </div>
            </div>

            <Card className="bg-card text-card-foreground">
              <CardHeader>
                <CardTitle>
                  Tasks de {selectedMember.charAt(0).toUpperCase() + selectedMember.slice(1)} - {selectedDate.toLocaleDateString('pt-BR')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {!dailyTasks || dailyTasks.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">Nenhuma task para este dia</p>
                ) : (
                  <div className="space-y-3">
                    {dailyTasks.map((task) => (
                      <div
                        key={task.id}
                        className="flex items-start gap-3 p-4 border border-border rounded-lg hover:bg-accent/50 transition-colors"
                      >
                        <button
                          onClick={() => handleToggleComplete(task.id, task.completed)}
                          className="mt-1"
                        >
                          {task.completed === 1 ? (
                            <CheckCircle2 className="h-5 w-5 text-green-600" />
                          ) : (
                            <Circle className="h-5 w-5 text-muted-foreground" />
                          )}
                        </button>
                        <div className="flex-1">
                          <h3 className={`font-medium ${task.completed === 1 ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                            {task.title}
                          </h3>
                          {task.description && (
                            <p className="text-sm text-muted-foreground mt-1">{task.description}</p>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteTask(task.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Weekly View */}
          <TabsContent value="weekly" className="space-y-4">
            <div className="mb-4">
              <p className="text-sm text-muted-foreground">
                Semana {currentWeekNumber} de {currentYear}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Davi */}
              <Card className="bg-card text-card-foreground">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                      D
                    </div>
                    Davi
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {tasksByMember.davi.length === 0 ? (
                    <p className="text-muted-foreground text-sm">Nenhuma task esta semana</p>
                  ) : (
                    <div className="space-y-2">
                      {tasksByMember.davi.map((task) => (
                        <div
                          key={task.id}
                          className="p-3 border border-border rounded-lg"
                        >
                          <div className="flex items-start gap-2">
                            {task.completed === 1 ? (
                              <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                            ) : (
                              <Circle className="h-4 w-4 text-muted-foreground mt-0.5" />
                            )}
                            <div className="flex-1">
                              <p className={`text-sm font-medium ${task.completed === 1 ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                                {task.title}
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {new Date(task.date).toLocaleDateString('pt-BR')}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Bia */}
              <Card className="bg-card text-card-foreground">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-pink-500 flex items-center justify-center text-white font-bold">
                      B
                    </div>
                    Bia
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {tasksByMember.bia.length === 0 ? (
                    <p className="text-muted-foreground text-sm">Nenhuma task esta semana</p>
                  ) : (
                    <div className="space-y-2">
                      {tasksByMember.bia.map((task) => (
                        <div
                          key={task.id}
                          className="p-3 border border-border rounded-lg"
                        >
                          <div className="flex items-start gap-2">
                            {task.completed === 1 ? (
                              <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                            ) : (
                              <Circle className="h-4 w-4 text-muted-foreground mt-0.5" />
                            )}
                            <div className="flex-1">
                              <p className={`text-sm font-medium ${task.completed === 1 ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                                {task.title}
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {new Date(task.date).toLocaleDateString('pt-BR')}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Lucas */}
              <Card className="bg-card text-card-foreground">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center text-white font-bold">
                      L
                    </div>
                    Lucas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {tasksByMember.lucas.length === 0 ? (
                    <p className="text-muted-foreground text-sm">Nenhuma task esta semana</p>
                  ) : (
                    <div className="space-y-2">
                      {tasksByMember.lucas.map((task) => (
                        <div
                          key={task.id}
                          className="p-3 border border-border rounded-lg"
                        >
                          <div className="flex items-start gap-2">
                            {task.completed === 1 ? (
                              <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                            ) : (
                              <Circle className="h-4 w-4 text-muted-foreground mt-0.5" />
                            )}
                            <div className="flex-1">
                              <p className={`text-sm font-medium ${task.completed === 1 ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                                {task.title}
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {new Date(task.date).toLocaleDateString('pt-BR')}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Create Task Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-card text-card-foreground">
          <DialogHeader>
            <DialogTitle>Nova Task</DialogTitle>
            <DialogDescription>Adicione uma nova tarefa para um membro da equipe</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Título *</Label>
              <Input
                placeholder="Ex: Criar relatório mensal"
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
                className="bg-background text-foreground"
              />
            </div>
            <div className="space-y-2">
              <Label>Descrição</Label>
              <Textarea
                placeholder="Detalhes da tarefa..."
                value={taskDescription}
                onChange={(e) => setTaskDescription(e.target.value)}
                className="bg-background text-foreground"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Membro *</Label>
                <select
                  value={taskMember}
                  onChange={(e) => setTaskMember(e.target.value as "davi" | "bia" | "lucas")}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                >
                  <option value="davi">Davi</option>
                  <option value="bia">Bia</option>
                  <option value="lucas">Lucas</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label>Data *</Label>
                <Input
                  type="date"
                  value={taskDate}
                  onChange={(e) => setTaskDate(e.target.value)}
                  className="bg-background text-foreground"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleCreateTask} disabled={createTask.isPending}>
              {createTask.isPending ? "Criando..." : "Criar Task"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function getLoginUrl() {
  return `/api/oauth/login?redirect=${encodeURIComponent(window.location.pathname)}`;
}
