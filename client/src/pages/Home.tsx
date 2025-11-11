import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, BarChart3, Share2, LogOut, CheckSquare } from "lucide-react";
import { Link } from "wouter";
import { APP_TITLE } from "@/const";

export default function Home() {
  const { user, loading, logout } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-lg text-foreground">Carregando...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Agência INA</h1>
            <p className="text-sm text-muted-foreground">Dashboard de Gestão</p>
          </div>
          <Button 
            variant="outline" 
            onClick={() => logout()}
            className="bg-background text-foreground hover:bg-accent"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sair
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {/* CRM Card */}
          <Link href="/crm">
            <Card className="bg-card text-card-foreground border-border hover:shadow-lg transition-all cursor-pointer group h-full">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <Calendar className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl">CRM Semanal</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Gerencie suas abordagens semanais com kanban diário
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <p>• Organize por semanas</p>
                <p>• 7 dias com kanban individual</p>
                <p>• Até 5 abordagens por dia</p>
                <p>• Scripts de abordagem</p>
              </CardContent>
            </Card>
          </Link>

          {/* Tráfego Pago Card */}
          <Link href="/traffic">
            <Card className="bg-card text-card-foreground border-border hover:shadow-lg transition-all cursor-pointer group h-full">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <BarChart3 className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl">Tráfego Pago</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Gerencie clientes de Tráfego Pago
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <p>• KPIs atuais e históricos</p>
                <p>• Relatórios semanais</p>
                <p>• Criativos e performance</p>
                <p>• Acessos do cliente</p>
              </CardContent>
            </Card>
          </Link>

          {/* Social Media Card */}
          <Link href="/social-media">
            <Card className="bg-card text-card-foreground border-border hover:shadow-lg transition-all cursor-pointer group h-full">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <Share2 className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl">Social Media</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Gerencie clientes de Social Media
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <p>• Referências visuais</p>
                <p>• Copys e conteúdos</p>
                <p>• Informações dos clientes</p>
                <p>• Páginas editáveis</p>
              </CardContent>
            </Card>
          </Link>
          {/* Tasks Card */}
          <Link href="/tasks">
            <Card className="group cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105 bg-card text-card-foreground border-2 hover:border-primary">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <CheckSquare className="h-7 w-7 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-xl mb-1">Tasks Diárias</CardTitle>
                    <p className="text-sm text-muted-foreground">Gerencie tarefas da equipe</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-purple-500"></span>
                    Organização por membro (Davi, Bia, Lucas)
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-purple-500"></span>
                    Visualização diária e semanal
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-purple-500"></span>
                    Controle de conclusão de tarefas
                  </li>
                </ul>
              </CardContent>
            </Card>
          </Link>
        </div>
      </main>
    </div>
  );
}
