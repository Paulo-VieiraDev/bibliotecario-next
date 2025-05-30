import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export type Notificacao = {
  id: number;
  usuario_id: string;
  mensagem: string;
  tipo: string;
  lida: boolean;
  criada_em: string;
};

export function useNotificacoes(usuarioId?: string) {
  const [notificacoes, setNotificacoes] = useState<Notificacao[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!usuarioId) return;
    setLoading(true);
    supabase
      .from("notificacoes")
      .select("*")
      .eq("usuario_id", usuarioId)
      .order("criada_em", { ascending: false })
      .limit(20)
      .then(({ data }) => {
        setNotificacoes(data || []);
        setLoading(false);
      });
  }, [usuarioId]);

  return { notificacoes, loading };
} 