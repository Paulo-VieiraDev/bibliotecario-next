"use client"

import { useEffect, useState } from "react"
import { Plus, Pencil, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { getLivros, deleteLivro } from "@/services/livros"
import type { Livro } from "@/types"
import { toast } from "sonner"
import { LivroDialog } from "./livro-dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export default function LivrosPage() {
  const [livros, setLivros] = useState<Livro[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadLivros()
  }, [])

  async function loadLivros() {
    try {
      const data = await getLivros()
      setLivros(data)
    } catch (error) {
      toast.error("Erro ao carregar livros")
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id: string) {
    try {
      await deleteLivro(id)
      toast.success("Livro excluído com sucesso!")
      loadLivros()
    } catch (error) {
      toast.error("Erro ao excluir livro")
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Livros</h1>
        <LivroDialog onSuccess={loadLivros} trigger={
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Novo Livro
          </Button>
        } />
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Título</TableHead>
              <TableHead>Autor</TableHead>
              <TableHead>ISBN</TableHead>
              <TableHead>Quantidade</TableHead>
              <TableHead className="w-[100px]">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {livros.map((livro) => (
              <TableRow key={livro.id}>
                <TableCell>{livro.titulo}</TableCell>
                <TableCell>{livro.autor}</TableCell>
                <TableCell>{livro.isbn}</TableCell>
                <TableCell>{livro.quantidade}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <LivroDialog
                      livro={livro}
                      onSuccess={loadLivros}
                      trigger={
                        <Button variant="ghost" size="icon">
                          <span className="sr-only">Editar</span>
                          <Pencil className="h-4 w-4" />
                        </Button>
                      }
                    />
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <span className="sr-only">Excluir</span>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Excluir Livro</AlertDialogTitle>
                          <AlertDialogDescription>
                            Tem certeza que deseja excluir este livro? Esta ação não pode ser desfeita.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(livro.id)}>
                            Excluir
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
} 