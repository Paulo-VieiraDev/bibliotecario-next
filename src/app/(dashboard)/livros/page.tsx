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
    <div className="container py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-blue-800">Livros</h1>
          <p className="text-gray-500 mt-1">Gerencie o acervo da biblioteca</p>
        </div>
        <LivroDialog onSuccess={loadLivros} trigger={
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="mr-2 h-4 w-4" />
            Novo Livro
          </Button>
        } />
      </div>

      <div className="rounded-lg border bg-white shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50 hover:bg-gray-50">
              <TableHead className="font-semibold text-gray-700">Título</TableHead>
              <TableHead className="font-semibold text-gray-700">Autor</TableHead>
              <TableHead className="font-semibold text-gray-700">Editora</TableHead>
              <TableHead className="font-semibold text-gray-700">Edição</TableHead>
              <TableHead className="font-semibold text-gray-700">Quantidade</TableHead>
              <TableHead className="font-semibold text-gray-700">Categoria</TableHead>
              <TableHead className="font-semibold text-gray-700">Ano/Série</TableHead>
              <TableHead className="font-semibold text-gray-700">Etapa</TableHead>
              <TableHead className="font-semibold text-gray-700">Tipo</TableHead>
              <TableHead className="font-semibold text-gray-700">Vida útil</TableHead>
              <TableHead className="w-[100px] font-semibold text-gray-700">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {livros.map((livro) => (
              <TableRow key={livro.id} className="hover:bg-gray-50">
                <TableCell className="font-medium">{livro.titulo}</TableCell>
                <TableCell>{livro.autor}</TableCell>
                <TableCell>{livro.editora}</TableCell>
                <TableCell>{livro.edicao}</TableCell>
                <TableCell>
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    livro.quantidade > 0 
                      ? "bg-green-100 text-green-800" 
                      : "bg-red-100 text-red-800"
                  }`}>
                    {livro.quantidade}
                  </span>
                </TableCell>
                <TableCell>{livro.categoria}</TableCell>
                <TableCell>{livro.categoria === "Didático" ? livro.ano_serie : ""}</TableCell>
                <TableCell>{livro.categoria === "Didático" ? livro.etapa : ""}</TableCell>
                <TableCell>{livro.categoria === "Didático" ? livro.tipo_didatico : ""}</TableCell>
                <TableCell>{livro.vida_util ? livro.vida_util : ""}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <LivroDialog
                      livro={livro}
                      onSuccess={loadLivros}
                      trigger={
                        <Button variant="ghost" size="icon" className="hover:bg-blue-50 hover:text-blue-600">
                          <span className="sr-only">Editar</span>
                          <Pencil className="h-4 w-4" />
                        </Button>
                      }
                    />
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="hover:bg-red-50 hover:text-red-600">
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
                          <AlertDialogAction 
                            onClick={() => handleDelete(livro.id)}
                            className="bg-red-600 hover:bg-red-700"
                          >
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