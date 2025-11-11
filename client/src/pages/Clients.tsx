import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { trpc } from "@/lib/trpc";
import { ArrowLeft, BarChart3, Plus, Share2 } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";
import { toast } from "sonner";

export default function Clients() {
  const { user, loading } = useAuth();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [clientName, setClientName] = useState("");
  const [clientType, setClientType] = useState<"trafego_pago" | "social_media" | "both">("both");

  const { data: clients, isLoading: clientsLoading, refetch } = trpc.clients.getAll.useQuery();
  const createClient = trpc.clients.create.useMutation({
    onSuccess: () => {
      toast.success("Cliente criado com sucesso!");
      setIsCreateDialogOpen(false);
      setClientName("");
      setClientType("both");
      refetch();
    },
    onError: (error) => {
      toast.error("Erro ao criar cliente: " + error.message);
    },
  });

  const handleCreateClient = () => {
    if (!clientName) {
      toast.error("Nome do cliente é obrigatório");
      return;
    }

    createClient.mutate({
      name: clientName,
      type: clientType,
    });
  };

  if (loading || clientsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Carregando...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const trafficClients = clients?.filter((c) => c.type === "trafego_pago" || c.type === "both") || [];
  const socialMediaClients = clients?.filter((c) => c.type === "social_media" || c.type === "both") || [];

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8">
        <Link href="/">
          <Button variant="outline" className="mb-4 bg-background text-foreground">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para Início
          </Button>
        </Link>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-foreground">Gestão de Clientes</h1>
            <p className="text-muted-foreground mt-2">
              Gerencie seus clientes de Tráfego Pago e Social Media
            </p>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary text-primary-foreground hover:bg-accent">
                <Plus className="mr-2 h-4 w-4" />
                Novo Cliente
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-card text-card-foreground">
              <DialogHeader>
                <DialogTitle>Criar Novo Cliente</DialogTitle>
                <DialogDescription>
                  Adicione um novo cliente ao sistema
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="clientName">Nome do Cliente</Label>
                  <Input
                    id="clientName"
                    placeholder="Ex: Empresa XYZ"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className="bg-background text-foreground"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="clientType">Tipo de Serviço</Label>
                  <Select value={clientType} onValueChange={(value: any) => setClientType(value)}>
                    <SelectTrigger className="bg-background text-foreground">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-card text-card-foreground">
                      <SelectItem value="trafego_pago">Tráfego Pago</SelectItem>
                      <SelectItem value="social_media">Social Media</SelectItem>
                      <SelectItem value="both">Ambos</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsCreateDialogOpen(false)}
                  className="bg-background text-foreground"
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleCreateClient}
                  disabled={createClient.isPending}
                  className="bg-primary text-primary-foreground"
                >
                  {createClient.isPending ? "Criando..." : "Criar Cliente"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <Tabs defaultValue="traffic" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2 bg-muted">
            <TabsTrigger value="traffic" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <BarChart3 className="mr-2 h-4 w-4" />
              Tráfego Pago
            </TabsTrigger>
            <TabsTrigger value="social" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Share2 className="mr-2 h-4 w-4" />
              Social Media
            </TabsTrigger>
          </TabsList>

          <TabsContent value="traffic" className="mt-6">
            {trafficClients.length === 0 ? (
              <Card className="bg-card text-card-foreground border-border">
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <p className="text-muted-foreground mb-4">
                    Nenhum cliente de Tráfego Pago cadastrado
                  </p>
                  <Button
                    onClick={() => setIsCreateDialogOpen(true)}
                    className="bg-primary text-primary-foreground"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Criar Primeiro Cliente
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {trafficClients.map((client) => (
                  <Link key={client.id} href={`/clients/traffic/${client.id}`}>
                    <Card className="bg-card text-card-foreground border-border hover:border-foreground transition-all cursor-pointer h-full">
                      <CardHeader>
                        <CardTitle className="text-foreground flex items-center gap-2">
                          <BarChart3 className="h-5 w-5" />
                          {client.name}
                        </CardTitle>
                        <CardDescription className="text-muted-foreground">
                          {client.type === "both" ? "Tráfego Pago + Social Media" : "Tráfego Pago"}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">
                          Clique para ver KPIs, relatórios e acessos
                        </p>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="social" className="mt-6">
            {socialMediaClients.length === 0 ? (
              <Card className="bg-card text-card-foreground border-border">
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <p className="text-muted-foreground mb-4">
                    Nenhum cliente de Social Media cadastrado
                  </p>
                  <Button
                    onClick={() => setIsCreateDialogOpen(true)}
                    className="bg-primary text-primary-foreground"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Criar Primeiro Cliente
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {socialMediaClients.map((client) => (
                  <Link key={client.id} href={`/clients/social/${client.id}`}>
                    <Card className="bg-card text-card-foreground border-border hover:border-foreground transition-all cursor-pointer h-full">
                      <CardHeader>
                        <CardTitle className="text-foreground flex items-center gap-2">
                          <Share2 className="h-5 w-5" />
                          {client.name}
                        </CardTitle>
                        <CardDescription className="text-muted-foreground">
                          {client.type === "both" ? "Tráfego Pago + Social Media" : "Social Media"}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">
                          Clique para ver referências, copys e informações
                        </p>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
