import { useState } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Plus, TrendingUp } from "lucide-react";
import { toast } from "sonner";

export default function TrafficClients() {
  const [, setLocation] = useLocation();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newClientName, setNewClientName] = useState("");

  const { data: clients, isLoading } = trpc.clients.getAll.useQuery();
  const createClient = trpc.clients.create.useMutation({
    onSuccess: () => {
      toast.success("Cliente criado com sucesso!");
      setIsDialogOpen(false);
      setNewClientName("");
    },
    onError: (error) => {
      toast.error(`Erro ao criar cliente: ${error.message}`);
    },
  });

  const trafficClients = clients?.filter((c) => c.type === "trafego_pago") || [];

  const handleCreateClient = () => {
    if (!newClientName.trim()) {
      toast.error("Nome do cliente é obrigatório");
      return;
    }
    createClient.mutate({ name: newClientName, type: "trafego_pago" });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-lg text-foreground">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setLocation("/")}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar para Início
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Tráfego Pago</h1>
              <p className="text-muted-foreground">
                Gerencie seus clientes de Tráfego Pago
              </p>
            </div>
          </div>
          <Button onClick={() => setIsDialogOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Novo Cliente
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trafficClients.map((client) => (
            <Card
              key={client.id}
              className="cursor-pointer hover:shadow-lg transition-all hover:scale-105"
              onClick={() => setLocation(`/clients/traffic/${client.id}`)}
            >
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle>{client.name}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Clique para ver KPIs, relatórios e acessos
                </p>
              </CardContent>
            </Card>
          ))}

          {trafficClients.length === 0 && (
            <div className="col-span-full text-center py-12">
              <p className="text-muted-foreground">
                Nenhum cliente de Tráfego Pago cadastrado ainda.
              </p>
              <Button
                onClick={() => setIsDialogOpen(true)}
                className="mt-4 gap-2"
              >
                <Plus className="h-4 w-4" />
                Criar Primeiro Cliente
              </Button>
            </div>
          )}
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Novo Cliente de Tráfego Pago</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Nome do Cliente</Label>
              <Input
                id="name"
                value={newClientName}
                onChange={(e) => setNewClientName(e.target.value)}
                placeholder="Ex: Empresa XYZ"
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                onClick={() => {
                  setIsDialogOpen(false);
                  setNewClientName("");
                }}
              >
                Cancelar
              </Button>
              <Button onClick={handleCreateClient} disabled={createClient.isPending}>
                {createClient.isPending ? "Criando..." : "Criar Cliente"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
