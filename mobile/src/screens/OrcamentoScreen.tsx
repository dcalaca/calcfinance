import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useOrcamentos, OrcamentoItem } from '../hooks/useOrcamentos';
import { useAuth } from '../contexts/AuthContext';

const { width } = Dimensions.get('window');

export default function OrcamentoScreenV2() {
  const { user } = useAuth();
  const { orcamentos, loading, adicionarItem, removerItem, criarOrcamento } = useOrcamentos();
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [filtroMes, setFiltroMes] = useState('');
  const [filtroCategoria, setFiltroCategoria] = useState('');
  const [filtroTipo, setFiltroTipo] = useState<'todos' | 'receita' | 'despesa'>('todos');
  const [mostrarGraficos, setMostrarGraficos] = useState(false);
  const [novoItem, setNovoItem] = useState({
    nome: '',
    valor: '',
    categoria: '',
    tipo: 'despesa' as 'receita' | 'despesa',
    data: new Date().toISOString().split('T')[0],
    observacoes: ''
  });

  const categoriasDespesas = [
    'Alimentação', 'Moradia', 'Transporte', 'Saúde', 'Educação',
    'Lazer', 'Vestuário', 'Contas', 'Investimentos', 'Outros'
  ];

  const categoriasReceitas = [
    'Salário', 'Freelance', 'Investimentos', 'Aluguel', 'Vendas', 'Outros'
  ];

  // Filtrar orçamentos
  const orcamentosFiltrados = orcamentos.filter(orcamento => {
    if (filtroMes && !orcamento.mes_referencia.includes(filtroMes)) return false;
    return true;
  });

  // Filtrar itens
  const todosItens = orcamentosFiltrados.flatMap(orcamento => [
    ...orcamento.receitas.map(item => ({ ...item, orcamento_id: orcamento.id, mes_referencia: orcamento.mes_referencia })),
    ...orcamento.despesas.map(item => ({ ...item, orcamento_id: orcamento.id, mes_referencia: orcamento.mes_referencia }))
  ]);

  const itensFiltrados = todosItens.filter(item => {
    if (filtroCategoria && item.categoria !== filtroCategoria) return false;
    if (filtroTipo !== 'todos' && item.tipo !== filtroTipo) return false;
    return true;
  });

  // Dados para gráficos
  const dadosGraficoPizza = orcamentosFiltrados.reduce((acc, orcamento) => {
    orcamento.despesas.forEach(item => {
      acc[item.categoria] = (acc[item.categoria] || 0) + item.valor;
    });
    return acc;
  }, {} as Record<string, number>);

  const dadosPizza = Object.entries(dadosGraficoPizza)
    .map(([categoria, valor]) => ({ categoria, valor }))
    .sort((a, b) => b.valor - a.valor);

  const dadosGraficoBarras = orcamentosFiltrados.map(orcamento => {
    const [ano, mes] = orcamento.mes_referencia.split('-');
    const data = new Date(parseInt(ano), parseInt(mes) - 1, 1);
    return {
      mes: data.toLocaleDateString('pt-BR', { month: 'short' }),
      receitas: orcamento.totalReceitas,
      despesas: orcamento.totalDespesas,
      saldo: orcamento.saldo
    };
  }).reverse();

  const handleAdicionarItem = async () => {
    if (!novoItem.nome || !novoItem.valor || !novoItem.categoria) {
      Alert.alert('Erro', 'Preencha todos os campos obrigatórios');
      return;
    }

    try {
      const dataItem = new Date(novoItem.data + 'T00:00:00');
      const mesReferencia = `${dataItem.getFullYear()}-${String(dataItem.getMonth() + 1).padStart(2, '0')}-01`;
      
      let orcamentoParaUsar = orcamentos.find(o => o.mes_referencia === mesReferencia);
      
      if (!orcamentoParaUsar) {
        const nomeOrcamento = dataItem.toLocaleDateString('pt-BR', { 
          year: 'numeric', 
          month: 'long' 
        });
        orcamentoParaUsar = await criarOrcamento(mesReferencia, nomeOrcamento, `Orçamento ${nomeOrcamento}`);
      }

      await adicionarItem(orcamentoParaUsar.id, {
        ...novoItem,
        valor: parseFloat(novoItem.valor)
      });

      setNovoItem({
        nome: '',
        valor: '',
        categoria: '',
        tipo: 'despesa',
        data: new Date().toISOString().split('T')[0],
        observacoes: ''
      });
      setMostrarFormulario(false);
      Alert.alert('Sucesso', 'Item adicionado com sucesso!');
    } catch (error) {
      Alert.alert('Erro', 'Erro ao adicionar item');
    }
  };

  const handleRemoverItem = async (itemId: string) => {
    Alert.alert(
      'Remover Item',
      'Tem certeza que deseja remover este item?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Remover', style: 'destructive', onPress: () => removerItem(itemId) }
      ]
    );
  };

  const formatarMoeda = (valor: number) => {
    return valor.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  };

  const formatarMes = (data: string) => {
    const [ano, mes] = data.split('-');
    const date = new Date(parseInt(ano), parseInt(mes) - 1, 1);
    return date.toLocaleDateString('pt-BR', { 
      year: 'numeric', 
      month: 'long' 
    });
  };

  const limparFiltros = () => {
    setFiltroMes('');
    setFiltroCategoria('');
    setFiltroTipo('todos');
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Carregando orçamentos...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Meu Orçamento</Text>
        <Text style={styles.subtitle}>Controle suas receitas e despesas</Text>
      </View>

      <ScrollView style={styles.content}>
        {/* Filtros */}
        <View style={styles.filtrosContainer}>
          <View style={styles.filtrosHeader}>
            <Text style={styles.filtrosTitulo}>Filtros</Text>
            <TouchableOpacity onPress={limparFiltros}>
              <Text style={styles.limparFiltros}>Limpar</Text>
            </TouchableOpacity>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.filtrosRow}>
              {/* Filtro de Mês */}
              <View style={styles.filtroGroup}>
                <Text style={styles.filtroLabel}>Mês</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <View style={styles.filtroOptions}>
                    <TouchableOpacity
                      style={[styles.filtroOption, !filtroMes && styles.filtroOptionActive]}
                      onPress={() => setFiltroMes('')}
                    >
                      <Text style={[styles.filtroOptionText, !filtroMes && styles.filtroOptionTextActive]}>
                        Todos
                      </Text>
                    </TouchableOpacity>
                    {orcamentos.map(orcamento => (
                      <TouchableOpacity
                        key={orcamento.id}
                        style={[styles.filtroOption, filtroMes === orcamento.mes_referencia && styles.filtroOptionActive]}
                        onPress={() => setFiltroMes(orcamento.mes_referencia)}
                      >
                        <Text style={[styles.filtroOptionText, filtroMes === orcamento.mes_referencia && styles.filtroOptionTextActive]}>
                          {formatarMes(orcamento.mes_referencia).split(' ')[0]}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </ScrollView>
              </View>

              {/* Filtro de Categoria */}
              <View style={styles.filtroGroup}>
                <Text style={styles.filtroLabel}>Categoria</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <View style={styles.filtroOptions}>
                    <TouchableOpacity
                      style={[styles.filtroOption, !filtroCategoria && styles.filtroOptionActive]}
                      onPress={() => setFiltroCategoria('')}
                    >
                      <Text style={[styles.filtroOptionText, !filtroCategoria && styles.filtroOptionTextActive]}>
                        Todas
                      </Text>
                    </TouchableOpacity>
                    {[...new Set(todosItens.map(item => item.categoria))].map(categoria => (
                      <TouchableOpacity
                        key={categoria}
                        style={[styles.filtroOption, filtroCategoria === categoria && styles.filtroOptionActive]}
                        onPress={() => setFiltroCategoria(categoria)}
                      >
                        <Text style={[styles.filtroOptionText, filtroCategoria === categoria && styles.filtroOptionTextActive]}>
                          {categoria}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </ScrollView>
              </View>

              {/* Filtro de Tipo */}
              <View style={styles.filtroGroup}>
                <Text style={styles.filtroLabel}>Tipo</Text>
                <View style={styles.filtroOptions}>
                  {[
                    { value: 'todos', label: 'Todos' },
                    { value: 'receita', label: 'Receitas' },
                    { value: 'despesa', label: 'Despesas' }
                  ].map(tipo => (
                    <TouchableOpacity
                      key={tipo.value}
                      style={[styles.filtroOption, filtroTipo === tipo.value && styles.filtroOptionActive]}
                      onPress={() => setFiltroTipo(tipo.value as any)}
                    >
                      <Text style={[styles.filtroOptionText, filtroTipo === tipo.value && styles.filtroOptionTextActive]}>
                        {tipo.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>
          </ScrollView>
        </View>

        {/* Resumo */}
        <View style={styles.resumoContainer}>
          <View style={styles.resumoCard}>
            <Text style={styles.resumoLabel}>Receitas</Text>
            <Text style={[styles.resumoValor, { color: '#10b981' }]}>
              {formatarMoeda(itensFiltrados.filter(item => item.tipo === 'receita').reduce((sum, item) => sum + item.valor, 0))}
            </Text>
          </View>
          <View style={styles.resumoCard}>
            <Text style={styles.resumoLabel}>Despesas</Text>
            <Text style={[styles.resumoValor, { color: '#ef4444' }]}>
              {formatarMoeda(itensFiltrados.filter(item => item.tipo === 'despesa').reduce((sum, item) => sum + item.valor, 0))}
            </Text>
          </View>
          <View style={styles.resumoCard}>
            <Text style={styles.resumoLabel}>Saldo</Text>
            <Text style={[styles.resumoValor, { 
              color: itensFiltrados.filter(item => item.tipo === 'receita').reduce((sum, item) => sum + item.valor, 0) - 
                     itensFiltrados.filter(item => item.tipo === 'despesa').reduce((sum, item) => sum + item.valor, 0) >= 0 ? '#10b981' : '#ef4444'
            }]}>
              {formatarMoeda(
                itensFiltrados.filter(item => item.tipo === 'receita').reduce((sum, item) => sum + item.valor, 0) - 
                itensFiltrados.filter(item => item.tipo === 'despesa').reduce((sum, item) => sum + item.valor, 0)
              )}
            </Text>
          </View>
        </View>

        {/* Botão de Gráficos */}
        <TouchableOpacity
          style={styles.graficosButton}
          onPress={() => setMostrarGraficos(!mostrarGraficos)}
        >
          <Ionicons name={mostrarGraficos ? "chevron-up" : "chevron-down"} size={20} color="#3b82f6" />
          <Text style={styles.graficosButtonText}>
            {mostrarGraficos ? 'Ocultar Gráficos' : 'Mostrar Gráficos'}
          </Text>
        </TouchableOpacity>

        {/* Gráficos */}
        {mostrarGraficos && (
          <View style={styles.graficosContainer}>
            {/* Gráfico de Pizza - Categorias de Despesas */}
            {dadosPizza.length > 0 && (
              <View style={styles.graficoCard}>
                <Text style={styles.graficoTitulo}>Despesas por Categoria</Text>
                <View style={styles.graficoPizza}>
                  {dadosPizza.slice(0, 5).map((item, index) => {
                    const total = dadosPizza.reduce((sum, d) => sum + d.valor, 0);
                    const porcentagem = (item.valor / total) * 100;
                    const cores = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6'];
                    
                    return (
                      <View key={item.categoria} style={styles.pizzaItem}>
                        <View style={[styles.pizzaCor, { backgroundColor: cores[index] }]} />
                        <Text style={styles.pizzaLabel}>{item.categoria}</Text>
                        <Text style={styles.pizzaValor}>{formatarMoeda(item.valor)}</Text>
                        <Text style={styles.pizzaPorcentagem}>{porcentagem.toFixed(1)}%</Text>
                      </View>
                    );
                  })}
                </View>
              </View>
            )}

            {/* Gráfico de Barras - Evolução Mensal */}
            {dadosGraficoBarras.length > 0 && (
              <View style={styles.graficoCard}>
                <Text style={styles.graficoTitulo}>Evolução Mensal</Text>
                <View style={styles.graficoBarras}>
                  {dadosGraficoBarras.map((item, index) => {
                    const maxValor = Math.max(...dadosGraficoBarras.map(d => Math.max(d.receitas, d.despesas)));
                    const alturaReceitas = (item.receitas / maxValor) * 100;
                    const alturaDespesas = (item.despesas / maxValor) * 100;
                    
                    return (
                      <View key={index} style={styles.barraContainer}>
                        <Text style={styles.barraLabel}>{item.mes}</Text>
                        <View style={styles.barraWrapper}>
                          <View style={styles.barra}>
                            <View 
                              style={[
                                styles.barraReceita, 
                                { height: `${Math.max(10, alturaReceitas)}%` }
                              ]} 
                            />
                            <View 
                              style={[
                                styles.barraDespesa, 
                                { height: `${Math.max(10, alturaDespesas)}%` }
                              ]} 
                            />
                          </View>
                        </View>
                      </View>
                    );
                  })}
                </View>
                <View style={styles.graficoLegenda}>
                  <View style={styles.legendaItem}>
                    <View style={[styles.legendaCor, { backgroundColor: '#10b981' }]} />
                    <Text style={styles.legendaTexto}>Receitas</Text>
                  </View>
                  <View style={styles.legendaItem}>
                    <View style={[styles.legendaCor, { backgroundColor: '#ef4444' }]} />
                    <Text style={styles.legendaTexto}>Despesas</Text>
                  </View>
                </View>
              </View>
            )}
          </View>
        )}

        {/* Lista de Itens */}
        {itensFiltrados.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="wallet-outline" size={64} color="#9ca3af" />
            <Text style={styles.emptyText}>
              {filtroMes || filtroCategoria || filtroTipo !== 'todos' 
                ? 'Nenhum item encontrado com os filtros aplicados' 
                : 'Nenhum item adicionado ainda'
              }
            </Text>
            <Text style={styles.emptySubtext}>
              {filtroMes || filtroCategoria || filtroTipo !== 'todos' 
                ? 'Tente ajustar os filtros ou adicione novos itens' 
                : 'Adicione seu primeiro item para começar'
              }
            </Text>
          </View>
        ) : (
          <View style={styles.itensContainer}>
            {itensFiltrados.map((item) => (
              <View key={item.id} style={styles.itemCard}>
                <View style={styles.itemInfo}>
                  <Text style={styles.itemNome}>{item.nome}</Text>
                  <View style={styles.itemDetalhes}>
                    <Text style={styles.itemCategoria}>{item.categoria}</Text>
                    <Text style={styles.itemData}>
                      {new Date(item.data).toLocaleDateString('pt-BR')}
                    </Text>
                    {item.observacoes && (
                      <Text style={styles.itemObservacoes}>{item.observacoes}</Text>
                    )}
                  </View>
                </View>
                <View style={styles.itemActions}>
                  <Text style={[
                    styles.itemValor,
                    { color: item.tipo === 'receita' ? '#10b981' : '#ef4444' }
                  ]}>
                    {item.tipo === 'receita' ? '+' : '-'}{formatarMoeda(item.valor)}
                  </Text>
                  <TouchableOpacity
                    onPress={() => handleRemoverItem(item.id)}
                    style={styles.removeButton}
                  >
                    <Ionicons name="trash-outline" size={16} color="#ef4444" />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Botão flutuante para adicionar item */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => setMostrarFormulario(true)}
      >
        <Ionicons name="add" size={24} color="white" />
      </TouchableOpacity>

      {/* Modal para adicionar item */}
      <Modal
        visible={mostrarFormulario}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setMostrarFormulario(false)}>
              <Text style={styles.modalCancel}>Cancelar</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Adicionar Item</Text>
            <TouchableOpacity onPress={handleAdicionarItem}>
              <Text style={styles.modalSave}>Salvar</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Nome *</Text>
              <TextInput
                style={styles.input}
                value={novoItem.nome}
                onChangeText={(text) => setNovoItem({ ...novoItem, nome: text })}
                placeholder="Ex: Salário, Aluguel, Supermercado"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Valor *</Text>
              <TextInput
                style={styles.input}
                value={novoItem.valor}
                onChangeText={(text) => setNovoItem({ ...novoItem, valor: text })}
                placeholder="0,00"
                keyboardType="numeric"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Tipo *</Text>
              <View style={styles.tipoContainer}>
                <TouchableOpacity
                  style={[
                    styles.tipoButton,
                    novoItem.tipo === 'receita' && styles.tipoButtonActive
                  ]}
                  onPress={() => setNovoItem({ ...novoItem, tipo: 'receita' })}
                >
                  <Text style={[
                    styles.tipoButtonText,
                    novoItem.tipo === 'receita' && styles.tipoButtonTextActive
                  ]}>
                    Receita
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.tipoButton,
                    novoItem.tipo === 'despesa' && styles.tipoButtonActive
                  ]}
                  onPress={() => setNovoItem({ ...novoItem, tipo: 'despesa' })}
                >
                  <Text style={[
                    styles.tipoButtonText,
                    novoItem.tipo === 'despesa' && styles.tipoButtonTextActive
                  ]}>
                    Despesa
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Categoria *</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.categoriasContainer}>
                  {(novoItem.tipo === 'receita' ? categoriasReceitas : categoriasDespesas).map((categoria) => (
                    <TouchableOpacity
                      key={categoria}
                      style={[
                        styles.categoriaButton,
                        novoItem.categoria === categoria && styles.categoriaButtonActive
                      ]}
                      onPress={() => setNovoItem({ ...novoItem, categoria })}
                    >
                      <Text style={[
                        styles.categoriaButtonText,
                        novoItem.categoria === categoria && styles.categoriaButtonTextActive
                      ]}>
                        {categoria}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Data</Text>
              <TextInput
                style={styles.input}
                value={novoItem.data}
                onChangeText={(text) => setNovoItem({ ...novoItem, data: text })}
                placeholder="YYYY-MM-DD"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Observações</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={novoItem.observacoes}
                onChangeText={(text) => setNovoItem({ ...novoItem, observacoes: text })}
                placeholder="Observações opcionais"
                multiline
                numberOfLines={3}
              />
            </View>
          </ScrollView>
        </View>
      </Modal>
    </View>
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
  filtrosContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  filtrosHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  filtrosTitulo: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  limparFiltros: {
    fontSize: 14,
    color: '#3b82f6',
    fontWeight: '500',
  },
  filtrosRow: {
    gap: 16,
  },
  filtroGroup: {
    marginBottom: 8,
  },
  filtroLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6b7280',
    marginBottom: 8,
  },
  filtroOptions: {
    flexDirection: 'row',
    gap: 8,
  },
  filtroOption: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#d1d5db',
    backgroundColor: 'white',
  },
  filtroOptionActive: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
  },
  filtroOptionText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6b7280',
  },
  filtroOptionTextActive: {
    color: 'white',
  },
  resumoContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  resumoCard: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  resumoLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 4,
  },
  resumoValor: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  graficosButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  graficosButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#3b82f6',
    marginLeft: 6,
  },
  graficosContainer: {
    gap: 16,
    marginBottom: 16,
  },
  graficoCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  graficoTitulo: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 16,
    textAlign: 'center',
  },
  graficoPizza: {
    gap: 8,
  },
  pizzaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  pizzaCor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  pizzaLabel: {
    flex: 1,
    fontSize: 14,
    color: '#1f2937',
  },
  pizzaValor: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
    marginRight: 8,
  },
  pizzaPorcentagem: {
    fontSize: 12,
    color: '#6b7280',
    minWidth: 40,
    textAlign: 'right',
  },
  graficoBarras: {
    flexDirection: 'row',
    alignItems: 'end',
    justifyContent: 'space-between',
    height: 120,
    marginBottom: 16,
  },
  barraContainer: {
    flex: 1,
    alignItems: 'center',
  },
  barraLabel: {
    fontSize: 10,
    color: '#6b7280',
    marginBottom: 8,
  },
  barraWrapper: {
    flex: 1,
    justifyContent: 'end',
    width: '100%',
  },
  barra: {
    flexDirection: 'row',
    alignItems: 'end',
    height: '100%',
    gap: 2,
  },
  barraReceita: {
    flex: 1,
    backgroundColor: '#10b981',
    borderRadius: 2,
    minHeight: 4,
  },
  barraDespesa: {
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
  legendaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendaCor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 6,
  },
  legendaTexto: {
    fontSize: 12,
    color: '#6b7280',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6b7280',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#9ca3af',
    textAlign: 'center',
  },
  itensContainer: {
    gap: 12,
    marginBottom: 80,
  },
  itemCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  itemInfo: {
    flex: 1,
  },
  itemNome: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  itemDetalhes: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  itemCategoria: {
    fontSize: 12,
    color: '#6b7280',
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  itemData: {
    fontSize: 12,
    color: '#9ca3af',
  },
  itemObservacoes: {
    fontSize: 11,
    color: '#9ca3af',
    fontStyle: 'italic',
    marginTop: 4,
  },
  itemActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  itemValor: {
    fontSize: 16,
    fontWeight: '600',
  },
  removeButton: {
    padding: 4,
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#3b82f6',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  modalCancel: {
    fontSize: 16,
    color: '#6b7280',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
  },
  modalSave: {
    fontSize: 16,
    color: '#3b82f6',
    fontWeight: '600',
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: 'white',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  tipoContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  tipoButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#d1d5db',
    alignItems: 'center',
  },
  tipoButtonActive: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
  },
  tipoButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6b7280',
  },
  tipoButtonTextActive: {
    color: 'white',
  },
  categoriasContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  categoriaButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#d1d5db',
    backgroundColor: 'white',
  },
  categoriaButtonActive: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
  },
  categoriaButtonText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6b7280',
  },
  categoriaButtonTextActive: {
    color: 'white',
  },
});
