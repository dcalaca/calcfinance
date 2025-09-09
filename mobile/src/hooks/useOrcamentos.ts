import { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import { useAuth } from '../contexts/AuthContext';

export interface OrcamentoItem {
  id: string;
  nome: string;
  valor: number;
  categoria: string;
  tipo: 'receita' | 'despesa';
  data: string;
  observacoes?: string;
}

export interface Orcamento {
  id: string;
  mes_referencia: string;
  nome: string;
  descricao?: string;
  receitas: OrcamentoItem[];
  despesas: OrcamentoItem[];
  totalReceitas: number;
  totalDespesas: number;
  saldo: number;
}

export function useOrcamentos() {
  const [orcamentos, setOrcamentos] = useState<Orcamento[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchOrcamentos = async () => {
    if (!user) return;

    try {
      setLoading(true);
      
      // Buscar orçamentos
      const { data: orcamentosData, error: orcamentosError } = await supabase
        .from('calc_orcamentos')
        .select('*')
        .eq('user_id', user.id)
        .order('mes_referencia', { ascending: false });

      if (orcamentosError) throw orcamentosError;

      // Buscar itens de orçamento
      const { data: itensData, error: itensError } = await supabase
        .from('calc_orcamento_itens')
        .select('*')
        .eq('user_id', user.id);

      if (itensError) throw itensError;

      // Agrupar itens por orçamento
      const orcamentosComItens = orcamentosData.map(orcamento => {
        const receitas = itensData
          .filter(item => item.orcamento_id === orcamento.id && item.tipo === 'receita')
          .map(item => ({
            id: item.id,
            nome: item.nome,
            valor: item.valor,
            categoria: item.categoria,
            tipo: item.tipo as 'receita' | 'despesa',
            data: item.data,
            observacoes: item.observacoes
          }));

        const despesas = itensData
          .filter(item => item.orcamento_id === orcamento.id && item.tipo === 'despesa')
          .map(item => ({
            id: item.id,
            nome: item.nome,
            valor: item.valor,
            categoria: item.categoria,
            tipo: item.tipo as 'receita' | 'despesa',
            data: item.data,
            observacoes: item.observacoes
          }));

        const totalReceitas = receitas.reduce((sum, item) => sum + item.valor, 0);
        const totalDespesas = despesas.reduce((sum, item) => sum + item.valor, 0);

        return {
          id: orcamento.id,
          mes_referencia: orcamento.mes_referencia,
          nome: orcamento.nome,
          descricao: orcamento.descricao,
          receitas,
          despesas,
          totalReceitas,
          totalDespesas,
          saldo: totalReceitas - totalDespesas
        };
      });

      setOrcamentos(orcamentosComItens);
    } catch (error) {
      console.error('Erro ao buscar orçamentos:', error);
    } finally {
      setLoading(false);
    }
  };

  const adicionarItem = async (orcamentoId: string, item: Omit<OrcamentoItem, 'id'>) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('calc_orcamento_itens')
        .insert({
          orcamento_id: orcamentoId,
          user_id: user.id,
          nome: item.nome,
          valor: item.valor,
          categoria: item.categoria,
          tipo: item.tipo,
          data: item.data,
          observacoes: item.observacoes
        })
        .select()
        .single();

      if (error) throw error;

      // Atualizar estado local
      await fetchOrcamentos();
      
      return data;
    } catch (error) {
      console.error('Erro ao adicionar item:', error);
      throw error;
    }
  };

  const removerItem = async (itemId: string) => {
    try {
      const { error } = await supabase
        .from('calc_orcamento_itens')
        .delete()
        .eq('id', itemId);

      if (error) throw error;

      // Atualizar estado local
      await fetchOrcamentos();
    } catch (error) {
      console.error('Erro ao remover item:', error);
      throw error;
    }
  };

  const criarOrcamento = async (mesReferencia: string, nome: string, descricao?: string) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('calc_orcamentos')
        .insert({
          user_id: user.id,
          mes_referencia: mesReferencia,
          nome,
          descricao
        })
        .select()
        .single();

      if (error) throw error;

      // Atualizar estado local
      await fetchOrcamentos();
      
      return data;
    } catch (error) {
      console.error('Erro ao criar orçamento:', error);
      throw error;
    }
  };

  useEffect(() => {
    if (user) {
      fetchOrcamentos();
    }
  }, [user]);

  return {
    orcamentos,
    loading,
    adicionarItem,
    removerItem,
    criarOrcamento,
    fetchOrcamentos
  };
}
