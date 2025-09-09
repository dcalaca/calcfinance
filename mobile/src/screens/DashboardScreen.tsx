import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useOrcamentos } from '../hooks/useOrcamentos';
import { useAuth } from '../contexts/AuthContext';

const { width } = Dimensions.get('window');

export default function DashboardScreen() {
  const { user } = useAuth();
  const { orcamentos, loading } = useOrcamentos();
  const [periodoSelecionado, setPeriodoSelecionado] = useState('3');

  // Calcular totais gerais
  const totaisGerais = orcamentos.reduce((acc, orcamento) => {
    acc.receitas += orcamento.totalReceitas;
    acc.despesas += orcamento.totalDespesas;
    acc.saldo += orcamento.saldo;
    return acc;
  }, { receitas: 0, despesas: 0, saldo: 0 });

  // Calcular totais do período selecionado
  const orcamentosFiltrados = orcamentos.slice(0, parseInt(periodoSelecionado));
  const totaisPeriodo = orcamentosFiltrados.reduce((acc, orcamento) => {
    acc.receitas += orcamento.totalReceitas;
    acc.despesas += orcamento.totalDespesas;
    acc.saldo += orcamento.saldo;
    return acc;
  }, { receitas: 0, despesas: 0, saldo: 0 });

  // Dados para gráfico de evolução
  const dadosEvolucao = orcamentosFiltrados.map(orcamento => {
    const [ano, mes] = orcamento.mes_referencia.split('-');
    const data = new Date(parseInt(ano), parseInt(mes) - 1, 1);
    return {
      mes: data.toLocaleDateString('pt-BR', { month: 'short' }),
      receitas: orcamento.totalReceitas,
      despesas: orcamento.totalDespesas,
      saldo: orcamento.saldo
    };
  }).reverse();

  // Dados para gráfico de categorias (despesas)
  const categoriasDespesas = orcamentosFiltrados.reduce((acc, orcamento) => {
    orcamento.despesas.forEach(item => {
      acc[item.categoria] = (acc[item.categoria] || 0) + item.valor;
    });
    return acc;
  }, {} as Record<string, number>);

  const dadosCategorias = Object.entries(categoriasDespesas)
    .map(([categoria, valor]) => ({ categoria, valor }))
    .sort((a, b) => b.valor - a.valor)
    .slice(0, 5);

  const formatarMoeda = (valor: number) => {
    return valor.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  };

  const getStatusSaldo = (saldo: number) => {
    if (saldo > 0) return { texto: 'Positivo', cor: '#10b981', icon: 'trending-up' };
    if (saldo < 0) return { texto: 'Negativo', cor: '#ef4444', icon: 'trending-down' };
    return { texto: 'Equilibrado', cor: '#6b7280', icon: 'remove' };
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Carregando dashboard...</Text>
      </View>
    );
  }

  const statusSaldo = getStatusSaldo(totaisPeriodo.saldo);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Dashboard</Text>
        <Text style={styles.subtitle}>Visão geral das suas finanças</Text>
      </View>

      <View style={styles.content}>
        {/* Filtro de Período */}
        <View style={styles.filtroContainer}>
          <Text style={styles.filtroLabel}>Período:</Text>
          <View style={styles.filtroButtons}>
            {['1', '3', '6', '12'].map((periodo) => (
              <TouchableOpacity
                key={periodo}
                style={[
                  styles.filtroButton,
                  periodoSelecionado === periodo && styles.filtroButtonActive
                ]}
                onPress={() => setPeriodoSelecionado(periodo)}
              >
                <Text style={[
                  styles.filtroButtonText,
                  periodoSelecionado === periodo && styles.filtroButtonTextActive
                ]}>
                  {periodo}M
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Cards de Resumo */}
        <View style={styles.resumoContainer}>
          <View style={styles.resumoCard}>
            <View style={styles.resumoHeader}>
              <Ionicons name="trending-up" size={20} color="#10b981" />
              <Text style={styles.resumoLabel}>Receitas</Text>
            </View>
            <Text style={[styles.resumoValor, { color: '#10b981' }]}>
              {formatarMoeda(totaisPeriodo.receitas)}
            </Text>
          </View>

          <View style={styles.resumoCard}>
            <View style={styles.resumoHeader}>
              <Ionicons name="trending-down" size={20} color="#ef4444" />
              <Text style={styles.resumoLabel}>Despesas</Text>
            </View>
            <Text style={[styles.resumoValor, { color: '#ef4444' }]}>
              {formatarMoeda(totaisPeriodo.despesas)}
            </Text>
          </View>

          <View style={styles.resumoCard}>
            <View style={styles.resumoHeader}>
              <Ionicons name={statusSaldo.icon as any} size={20} color={statusSaldo.cor} />
              <Text style={styles.resumoLabel}>Saldo</Text>
            </View>
            <Text style={[styles.resumoValor, { color: statusSaldo.cor }]}>
              {formatarMoeda(totaisPeriodo.saldo)}
            </Text>
            <Text style={[styles.resumoStatus, { color: statusSaldo.cor }]}>
              {statusSaldo.texto}
            </Text>
          </View>
        </View>

        {/* Gráfico de Evolução */}
        {dadosEvolucao.length > 0 && (
          <View style={styles.graficoContainer}>
            <Text style={styles.graficoTitulo}>Evolução Mensal</Text>
            <View style={styles.graficoBarras}>
              {dadosEvolucao.map((item, index) => (
                <View key={index} style={styles.graficoBarraContainer}>
                  <View style={styles.graficoBarraLabels}>
                    <Text style={styles.graficoBarraLabel}>{item.mes}</Text>
                  </View>
                  <View style={styles.graficoBarraWrapper}>
                    <View style={styles.graficoBarra}>
                      <View 
                        style={[
                          styles.graficoBarraReceita, 
                          { height: `${Math.max(10, (item.receitas / Math.max(...dadosEvolucao.map(d => d.receitas))) * 100)}%` }
                        ]} 
                      />
                      <View 
                        style={[
                          styles.graficoBarraDespesa, 
                          { height: `${Math.max(10, (item.despesas / Math.max(...dadosEvolucao.map(d => d.despesas))) * 100)}%` }
                        ]} 
                      />
                    </View>
                  </View>
                </View>
              ))}
            </View>
            <View style={styles.graficoLegenda}>
              <View style={styles.graficoLegendaItem}>
                <View style={[styles.graficoLegendaCor, { backgroundColor: '#10b981' }]} />
                <Text style={styles.graficoLegendaTexto}>Receitas</Text>
              </View>
              <View style={styles.graficoLegendaItem}>
                <View style={[styles.graficoLegendaCor, { backgroundColor: '#ef4444' }]} />
                <Text style={styles.graficoLegendaTexto}>Despesas</Text>
              </View>
            </View>
          </View>
        )}

        {/* Top Categorias de Despesas */}
        {dadosCategorias.length > 0 && (
          <View style={styles.categoriasContainer}>
            <Text style={styles.categoriasTitulo}>Top Categorias de Despesas</Text>
            {dadosCategorias.map((item, index) => (
              <View key={item.categoria} style={styles.categoriaItem}>
                <View style={styles.categoriaInfo}>
                  <Text style={styles.categoriaNome}>{item.categoria}</Text>
                  <Text style={styles.categoriaValor}>{formatarMoeda(item.valor)}</Text>
                </View>
                <View style={styles.categoriaBarra}>
                  <View 
                    style={[
                      styles.categoriaBarraPreenchimento,
                      { 
                        width: `${(item.valor / dadosCategorias[0].valor) * 100}%`,
                        backgroundColor: `hsl(${index * 60}, 70%, 50%)`
                      }
                    ]} 
                  />
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Estatísticas Adicionais */}
        <View style={styles.estatisticasContainer}>
          <Text style={styles.estatisticasTitulo}>Estatísticas</Text>
          
          <View style={styles.estatisticasGrid}>
            <View style={styles.estatisticaItem}>
              <Text style={styles.estatisticaValor}>{orcamentos.length}</Text>
              <Text style={styles.estatisticaLabel}>Orçamentos</Text>
            </View>
            
            <View style={styles.estatisticaItem}>
              <Text style={styles.estatisticaValor}>
                {orcamentosFiltrados.reduce((acc, o) => acc + o.receitas.length + o.despesas.length, 0)}
              </Text>
              <Text style={styles.estatisticaLabel}>Transações</Text>
            </View>
            
            <View style={styles.estatisticaItem}>
              <Text style={styles.estatisticaValor}>
                {totaisPeriodo.receitas > 0 ? 
                  Math.round((totaisPeriodo.despesas / totaisPeriodo.receitas) * 100) : 0}%
              </Text>
              <Text style={styles.estatisticaLabel}>Taxa de Poupança</Text>
            </View>
          </View>
        </View>

        {/* Dicas Financeiras */}
        <View style={styles.dicasContainer}>
          <Text style={styles.dicasTitulo}>💡 Dicas Financeiras</Text>
          <View style={styles.dicasLista}>
            <Text style={styles.dicaItem}>• Mantenha suas despesas abaixo de 80% da renda</Text>
            <Text style={styles.dicaItem}>• Reserve 20% para investimentos e emergências</Text>
            <Text style={styles.dicaItem}>• Revise seu orçamento mensalmente</Text>
            <Text style={styles.dicaItem}>• Evite compras por impulso</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: 'white',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  filtroContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  filtroLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
  },
  filtroButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  filtroButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#d1d5db',
    backgroundColor: 'white',
  },
  filtroButtonActive: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
  },
  filtroButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6b7280',
  },
  filtroButtonTextActive: {
    color: 'white',
  },
  resumoContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  resumoCard: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  resumoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  resumoLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginLeft: 6,
  },
  resumoValor: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  resumoStatus: {
    fontSize: 10,
    fontWeight: '500',
  },
  graficoContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  graficoTitulo: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 16,
  },
  graficoBarras: {
    flexDirection: 'row',
    alignItems: 'end',
    justifyContent: 'space-between',
    height: 120,
    marginBottom: 16,
  },
  graficoBarraContainer: {
    flex: 1,
    alignItems: 'center',
  },
  graficoBarraLabels: {
    marginBottom: 8,
  },
  graficoBarraLabel: {
    fontSize: 12,
    color: '#6b7280',
  },
  graficoBarraWrapper: {
    flex: 1,
    justifyContent: 'end',
    width: '100%',
  },
  graficoBarra: {
    flexDirection: 'row',
    alignItems: 'end',
    height: '100%',
    gap: 2,
  },
  graficoBarraReceita: {
    flex: 1,
    backgroundColor: '#10b981',
    borderRadius: 2,
    minHeight: 4,
  },
  graficoBarraDespesa: {
    flex: 1,
    backgroundColor: '#ef4444',
    borderRadius: 2,
    minHeight: 4,
  },
  graficoLegenda: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 24,
  },
  graficoLegendaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  graficoLegendaCor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 6,
  },
  graficoLegendaTexto: {
    fontSize: 12,
    color: '#6b7280',
  },
  categoriasContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  categoriasTitulo: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 16,
  },
  categoriaItem: {
    marginBottom: 12,
  },
  categoriaInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  categoriaNome: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1f2937',
  },
  categoriaValor: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
  },
  categoriaBarra: {
    height: 6,
    backgroundColor: '#f3f4f6',
    borderRadius: 3,
    overflow: 'hidden',
  },
  categoriaBarraPreenchimento: {
    height: '100%',
    borderRadius: 3,
  },
  estatisticasContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  estatisticasTitulo: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 16,
  },
  estatisticasGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  estatisticaItem: {
    alignItems: 'center',
  },
  estatisticaValor: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  estatisticaLabel: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
  },
  dicasContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  dicasTitulo: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 12,
  },
  dicasLista: {
    gap: 8,
  },
  dicaItem: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
  },
});
