import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { Edit, FileText, Plus, Trash2, Upload } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface EditablePageProps {
  clientId: number;
  pageType: string;
  title: string;
}

export default function EditablePage({ clientId, pageType, title }: EditablePageProps) {
  const [isPageDialogOpen, setIsPageDialogOpen] = useState(false);
  const [isDocDialogOpen, setIsDocDialogOpen] = useState(false);
  const [selectedPage, setSelectedPage] = useState<any>(null);
  const [selectedPageForDoc, setSelectedPageForDoc] = useState<any>(null);
  
  const [pageTitle, setPageTitle] = useState("");
  const [pageContent, setPageContent] = useState("");
  const [weekNumber, setWeekNumber] = useState("");
  const [year, setYear] = useState(new Date().getFullYear().toString());
  
  const [docFileName, setDocFileName] = useState("");
  const [docFileUrl, setDocFileUrl] = useState("");
  
  const { data: pages, refetch: refetchPages } = trpc.pages.getByClient.useQuery({
    clientId,
    pageType,
  });
  
  const createPage = trpc.pages.create.useMutation({
    onSuccess: () => {
      toast.success("Página criada!");
      setIsPageDialogOpen(false);
      resetPageForm();
      refetchPages();
    },
  });
  
  const updatePage = trpc.pages.update.useMutation({
    onSuccess: () => {
      toast.success("Página atualizada!");
      setIsPageDialogOpen(false);
      resetPageForm();
      refetchPages();
    },
  });
  
  const deletePage = trpc.pages.delete.useMutation({
    onSuccess: () => {
      toast.success("Página excluída!");
      refetchPages();
    },
  });
  
  const createDocument = trpc.pages.createDocument.useMutation({
    onSuccess: () => {
      toast.success("Documento adicionado!");
      setIsDocDialogOpen(false);
      setDocFileName("");
      setDocFileUrl("");
      refetchPages();
    },
  });
  
  const resetPageForm = () => {
    setPageTitle("");
    setPageContent("");
    setWeekNumber("");
    setYear(new Date().getFullYear().toString());
    setSelectedPage(null);
  };
  
  const handleOpenPageDialog = (page?: any) => {
    if (page) {
      setSelectedPage(page);
      setPageTitle(page.title || "");
      setPageContent(page.content || "");
      setWeekNumber(page.weekNumber?.toString() || "");
      setYear(page.year?.toString() || new Date().getFullYear().toString());
    } else {
      resetPageForm();
    }
    setIsPageDialogOpen(true);
  };
  
  const handleSavePage = () => {
    if (!pageTitle) {
      toast.error("Título é obrigatório");
      return;
    }
    
    const data = {
      clientId,
      pageType,
      title: pageTitle,
      content: pageContent || undefined,
      weekNumber: weekNumber ? parseInt(weekNumber) : undefined,
      year: year ? parseInt(year) : undefined,
    };
    
    if (selectedPage) {
      updatePage.mutate({ id: selectedPage.id, ...data });
    } else {
      createPage.mutate(data);
    }
  };
  
  const handleOpenDocDialog = (page: any) => {
    setSelectedPageForDoc(page);
    setIsDocDialogOpen(true);
  };
  
  const handleAddDocument = () => {
    if (!docFileName || !docFileUrl) {
      toast.error("Nome e URL são obrigatórios");
      return;
    }
    
    createDocument.mutate({
      pageId: selectedPageForDoc.id,
      fileName: docFileName,
      fileUrl: docFileUrl,
    });
  };
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        <Button onClick={() => handleOpenPageDialog()} size="sm" className="bg-primary text-primary-foreground">
          <Plus className="mr-2 h-4 w-4" />
          Nova Página
        </Button>
      </div>
      
      {!pages || pages.length === 0 ? (
        <Card className="bg-card text-card-foreground border-border">
          <CardContent className="flex flex-col items-center justify-center py-8">
            <p className="text-sm text-muted-foreground mb-3">Nenhuma página criada</p>
            <Button onClick={() => handleOpenPageDialog()} size="sm" className="bg-primary text-primary-foreground">
              <Plus className="mr-2 h-4 w-4" />
              Criar Primeira Página
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {pages.map((page) => (
            <Card key={page.id} className="bg-card text-card-foreground border-border">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-base flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      {page.title}
                      {page.weekNumber && (
                        <span className="text-xs text-muted-foreground font-normal">
                          (Semana {page.weekNumber}/{page.year})
                        </span>
                      )}
                    </CardTitle>
                  </div>
                  <div className="flex gap-1">
                    <Button size="sm" variant="outline" onClick={() => handleOpenDocDialog(page)} className="bg-background text-foreground">
                      <Upload className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleOpenPageDialog(page)} className="bg-background text-foreground">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => {
                        if (confirm("Excluir esta página?")) {
                          deletePage.mutate(page.id);
                        }
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              {page.content && (
                <CardContent className="pt-0">
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">{page.content}</p>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      )}
      
      {/* Dialog: Create/Edit Page */}
      <Dialog open={isPageDialogOpen} onOpenChange={setIsPageDialogOpen}>
        <DialogContent className="bg-card text-card-foreground max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedPage ? "Editar Página" : "Nova Página"}</DialogTitle>
            <DialogDescription>
              {selectedPage ? "Atualize o conteúdo da página" : "Crie uma nova página editável"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Título *</Label>
              <Input
                placeholder="Título da página"
                value={pageTitle}
                onChange={(e) => setPageTitle(e.target.value)}
                className="bg-background text-foreground"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Semana (opcional)</Label>
                <Input
                  type="number"
                  placeholder="Ex: 1"
                  value={weekNumber}
                  onChange={(e) => setWeekNumber(e.target.value)}
                  className="bg-background text-foreground"
                />
              </div>
              <div className="space-y-2">
                <Label>Ano (opcional)</Label>
                <Input
                  type="number"
                  placeholder="Ex: 2025"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="bg-background text-foreground"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Conteúdo</Label>
              <Textarea
                placeholder="Escreva o conteúdo da página..."
                value={pageContent}
                onChange={(e) => setPageContent(e.target.value)}
                className="bg-background text-foreground"
                rows={10}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPageDialogOpen(false)} className="bg-background text-foreground">
              Cancelar
            </Button>
            <Button onClick={handleSavePage} disabled={createPage.isPending || updatePage.isPending} className="bg-primary text-primary-foreground">
              {createPage.isPending || updatePage.isPending ? "Salvando..." : "Salvar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Dialog: Add Document */}
      <Dialog open={isDocDialogOpen} onOpenChange={setIsDocDialogOpen}>
        <DialogContent className="bg-card text-card-foreground">
          <DialogHeader>
            <DialogTitle>Adicionar Documento</DialogTitle>
            <DialogDescription>
              Adicione um link para um documento externo
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Nome do Documento *</Label>
              <Input
                placeholder="Ex: Planilha de KPIs"
                value={docFileName}
                onChange={(e) => setDocFileName(e.target.value)}
                className="bg-background text-foreground"
              />
            </div>
            <div className="space-y-2">
              <Label>URL do Documento *</Label>
              <Input
                placeholder="https://docs.google.com/..."
                value={docFileUrl}
                onChange={(e) => setDocFileUrl(e.target.value)}
                className="bg-background text-foreground"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDocDialogOpen(false)} className="bg-background text-foreground">
              Cancelar
            </Button>
            <Button onClick={handleAddDocument} disabled={createDocument.isPending} className="bg-primary text-primary-foreground">
              {createDocument.isPending ? "Adicionando..." : "Adicionar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
