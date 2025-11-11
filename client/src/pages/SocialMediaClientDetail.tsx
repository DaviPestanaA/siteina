import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { ArrowLeft, FileText, Image, Info, Plus, Trash2, File } from "lucide-react";
import { useState, useMemo, memo } from "react";
import { Link, useRoute } from "wouter";
import { toast } from "sonner";
import EditablePage from "@/components/EditablePage";

export default function SocialMediaClientDetail() {
  const [, params] = useRoute("/clients/social/:id");
  const clientId = params?.id ? parseInt(params.id) : 0;
  const { user, loading } = useAuth();

  const [isReferenceDialogOpen, setIsReferenceDialogOpen] = useState(false);
  const [isCopyDialogOpen, setIsCopyDialogOpen] = useState(false);
  const [isInfoDialogOpen, setIsInfoDialogOpen] = useState(false);

  // Reference form state
  const [refTitle, setRefTitle] = useState("");
  const [refUrl, setRefUrl] = useState("");
  const [refDescription, setRefDescription] = useState("");
  const [refImageUrl, setRefImageUrl] = useState("");

  // Copy form state
  const [copyTitle, setCopyTitle] = useState("");
  const [copyContent, setCopyContent] = useState("");
  const [copyPlatform, setCopyPlatform] = useState("");

  // Info form state
  const [infoFieldName, setInfoFieldName] = useState("");
  const [infoFieldValue, setInfoFieldValue] = useState("");

  const { data: client } = trpc.clients.getById.useQuery(clientId);
  const { data: references, refetch: refetchReferences } = trpc.socialMedia.getReferencesByClient.useQuery(clientId);
  const { data: copys, refetch: refetchCopys } = trpc.socialMedia.getCopysByClient.useQuery(clientId);
  const { data: clientInfo, refetch: refetchClientInfo } = trpc.socialMedia.getClientInfoByClient.useQuery(clientId);

  const createReference = trpc.socialMedia.createReference.useMutation({
    onSuccess: () => {
      toast.success("Referência criada com sucesso!");
      setIsReferenceDialogOpen(false);
      resetReferenceForm();
      refetchReferences();
    },
  });

  const createCopy = trpc.socialMedia.createCopy.useMutation({
    onSuccess: () => {
      toast.success("Copy criada com sucesso!");
      setIsCopyDialogOpen(false);
      resetCopyForm();
      refetchCopys();
    },
  });

  const createClientInfo = trpc.socialMedia.createClientInfo.useMutation({
    onSuccess: () => {
      toast.success("Informação criada com sucesso!");
      setIsInfoDialogOpen(false);
      resetInfoForm();
      refetchClientInfo();
    },
  });

  const deleteReference = trpc.socialMedia.deleteReference.useMutation({
    onSuccess: () => {
      toast.success("Referência excluída!");
      refetchReferences();
    },
  });

  const deleteCopy = trpc.socialMedia.deleteCopy.useMutation({
    onSuccess: () => {
      toast.success("Copy excluída!");
      refetchCopys();
    },
  });

  const deleteClientInfo = trpc.socialMedia.deleteClientInfo.useMutation({
    onSuccess: () => {
      toast.success("Informação excluída!");
      refetchClientInfo();
    },
  });

  const resetReferenceForm = () => {
    setRefTitle("");
    setRefUrl("");
    setRefDescription("");
    setRefImageUrl("");
  };

  const resetCopyForm = () => {
    setCopyTitle("");
    setCopyContent("");
    setCopyPlatform("");
  };

  const resetInfoForm = () => {
    setInfoFieldName("");
    setInfoFieldValue("");
  };

  const handleCreateReference = () => {
    createReference.mutate({
      clientId,
      title: refTitle || undefined,
      url: refUrl || undefined,
      description: refDescription || undefined,
      imageUrl: refImageUrl || undefined,
    });
  };

  const handleCreateCopy = () => {
    if (!copyContent) {
      toast.error("Conteúdo é obrigatório");
      return;
    }

    createCopy.mutate({
      clientId,
      title: copyTitle || undefined,
      content: copyContent,
      platform: copyPlatform || undefined,
    });
  };

  const handleCreateClientInfo = () => {
    if (!infoFieldName) {
      toast.error("Nome do campo é obrigatório");
      return;
    }

    createClientInfo.mutate({
      clientId,
      fieldName: infoFieldName,
      fieldValue: infoFieldValue || undefined,
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
          <p className="text-muted-foreground mt-2">Social Media</p>
        </div>

        <Tabs defaultValue="references" className="w-full">
          <TabsList className="grid w-full max-w-3xl grid-cols-4 bg-muted">
            <TabsTrigger value="references" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Image className="mr-2 h-4 w-4" />
              Referências
            </TabsTrigger>
            <TabsTrigger value="copys" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <FileText className="mr-2 h-4 w-4" />
              Copys
            </TabsTrigger>
            <TabsTrigger value="info" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Info className="mr-2 h-4 w-4" />
              Informações
            </TabsTrigger>
            <TabsTrigger value="pages" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <File className="mr-2 h-4 w-4" />
              Páginas
            </TabsTrigger>
          </TabsList>

          <TabsContent value="references" className="mt-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-foreground">Referências</h2>
              <Button onClick={() => setIsReferenceDialogOpen(true)} className="bg-primary text-primary-foreground">
                <Plus className="mr-2 h-4 w-4" />
                Adicionar Referência
              </Button>
            </div>

            {!references || references.length === 0 ? (
              <Card className="bg-card text-card-foreground">
                <CardContent className="py-8 text-center text-muted-foreground">
                  Nenhuma referência cadastrada
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {references.map((ref) => (
                  <Card key={ref.id} className="bg-card text-card-foreground border-border">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">{ref.title || "Sem título"}</CardTitle>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => {
                            if (confirm("Excluir esta referência?")) {
                              deleteReference.mutate(ref.id);
                            }
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {ref.imageUrl && (
                        <img
                          src={ref.imageUrl}
                          alt={ref.title || "Referência"}
                          className="w-full h-40 object-cover rounded-md"
                        />
                      )}
                      {ref.description && (
                        <p className="text-sm text-muted-foreground">{ref.description}</p>
                      )}
                      {ref.url && (
                        <a
                          href={ref.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-primary hover:underline block"
                        >
                          Ver referência →
                        </a>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="copys" className="mt-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-foreground">Copys</h2>
              <Button onClick={() => setIsCopyDialogOpen(true)} className="bg-primary text-primary-foreground">
                <Plus className="mr-2 h-4 w-4" />
                Adicionar Copy
              </Button>
            </div>

            {!copys || copys.length === 0 ? (
              <Card className="bg-card text-card-foreground">
                <CardContent className="py-8 text-center text-muted-foreground">
                  Nenhuma copy cadastrada
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {copys.map((copy) => (
                  <Card key={copy.id} className="bg-card text-card-foreground border-border">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{copy.title || "Sem título"}</CardTitle>
                          {copy.platform && (
                            <p className="text-sm text-muted-foreground mt-1">{copy.platform}</p>
                          )}
                        </div>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => {
                            if (confirm("Excluir esta copy?")) {
                              deleteCopy.mutate(copy.id);
                            }
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm whitespace-pre-wrap">{copy.content}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="info" className="mt-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-foreground">Informações do Cliente</h2>
              <Button onClick={() => setIsInfoDialogOpen(true)} className="bg-primary text-primary-foreground">
                <Plus className="mr-2 h-4 w-4" />
                Adicionar Informação
              </Button>
            </div>

            {!clientInfo || clientInfo.length === 0 ? (
              <Card className="bg-card text-card-foreground">
                <CardContent className="py-8 text-center text-muted-foreground">
                  Nenhuma informação cadastrada
                </CardContent>
              </Card>
            ) : (
              <Card className="bg-card text-card-foreground border-border">
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    {clientInfo.map((info) => (
                      <div key={info.id} className="flex justify-between items-start border-b border-border pb-3 last:border-0">
                        <div className="flex-1">
                          <p className="font-semibold text-foreground">{info.fieldName}</p>
                          <p className="text-sm text-muted-foreground mt-1">{info.fieldValue}</p>
                        </div>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => {
                            if (confirm("Excluir esta informação?")) {
                              deleteClientInfo.mutate(info.id);
                            }
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="pages" className="mt-6">
            <EditablePage clientId={clientId} pageType="social" title="Páginas e Documentos" />
          </TabsContent>
        </Tabs>

        {/* Reference Dialog */}
        <Dialog open={isReferenceDialogOpen} onOpenChange={setIsReferenceDialogOpen}>
          <DialogContent className="bg-card text-card-foreground">
            <DialogHeader>
              <DialogTitle>Adicionar Referência</DialogTitle>
              <DialogDescription>Cadastre uma nova referência visual</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Título</Label>
                <Input
                  placeholder="Ex: Post Instagram - Exemplo"
                  value={refTitle}
                  onChange={(e) => setRefTitle(e.target.value)}
                  className="bg-background text-foreground"
                />
              </div>
              <div className="space-y-2">
                <Label>URL da Imagem</Label>
                <Input
                  placeholder="https://..."
                  value={refImageUrl}
                  onChange={(e) => setRefImageUrl(e.target.value)}
                  className="bg-background text-foreground"
                />
              </div>
              <div className="space-y-2">
                <Label>URL da Referência</Label>
                <Input
                  placeholder="https://..."
                  value={refUrl}
                  onChange={(e) => setRefUrl(e.target.value)}
                  className="bg-background text-foreground"
                />
              </div>
              <div className="space-y-2">
                <Label>Descrição</Label>
                <Textarea
                  placeholder="Descrição da referência..."
                  value={refDescription}
                  onChange={(e) => setRefDescription(e.target.value)}
                  className="bg-background text-foreground"
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsReferenceDialogOpen(false)} className="bg-background text-foreground">
                Cancelar
              </Button>
              <Button onClick={handleCreateReference} disabled={createReference.isPending} className="bg-primary text-primary-foreground">
                {createReference.isPending ? "Salvando..." : "Salvar"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Copy Dialog */}
        <Dialog open={isCopyDialogOpen} onOpenChange={setIsCopyDialogOpen}>
          <DialogContent className="bg-card text-card-foreground">
            <DialogHeader>
              <DialogTitle>Adicionar Copy</DialogTitle>
              <DialogDescription>Cadastre uma nova copy</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Título</Label>
                <Input
                  placeholder="Ex: Copy para Instagram - Promoção"
                  value={copyTitle}
                  onChange={(e) => setCopyTitle(e.target.value)}
                  className="bg-background text-foreground"
                />
              </div>
              <div className="space-y-2">
                <Label>Plataforma</Label>
                <Input
                  placeholder="Ex: Instagram, Facebook, LinkedIn"
                  value={copyPlatform}
                  onChange={(e) => setCopyPlatform(e.target.value)}
                  className="bg-background text-foreground"
                />
              </div>
              <div className="space-y-2">
                <Label>Conteúdo *</Label>
                <Textarea
                  placeholder="Digite a copy aqui..."
                  value={copyContent}
                  onChange={(e) => setCopyContent(e.target.value)}
                  className="bg-background text-foreground"
                  rows={6}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCopyDialogOpen(false)} className="bg-background text-foreground">
                Cancelar
              </Button>
              <Button onClick={handleCreateCopy} disabled={createCopy.isPending} className="bg-primary text-primary-foreground">
                {createCopy.isPending ? "Salvando..." : "Salvar"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Client Info Dialog */}
        <Dialog open={isInfoDialogOpen} onOpenChange={setIsInfoDialogOpen}>
          <DialogContent className="bg-card text-card-foreground">
            <DialogHeader>
              <DialogTitle>Adicionar Informação</DialogTitle>
              <DialogDescription>Cadastre uma nova informação do cliente</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Campo *</Label>
                <Input
                  placeholder="Ex: Tom de Voz, Público-Alvo, Objetivo"
                  value={infoFieldName}
                  onChange={(e) => setInfoFieldName(e.target.value)}
                  className="bg-background text-foreground"
                />
              </div>
              <div className="space-y-2">
                <Label>Valor</Label>
                <Textarea
                  placeholder="Valor do campo..."
                  value={infoFieldValue}
                  onChange={(e) => setInfoFieldValue(e.target.value)}
                  className="bg-background text-foreground"
                  rows={4}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsInfoDialogOpen(false)} className="bg-background text-foreground">
                Cancelar
              </Button>
              <Button onClick={handleCreateClientInfo} disabled={createClientInfo.isPending} className="bg-primary text-primary-foreground">
                {createClientInfo.isPending ? "Salvando..." : "Salvar"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
