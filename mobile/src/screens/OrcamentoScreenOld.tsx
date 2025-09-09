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
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useOrcamentos, OrcamentoItem } from '../hooks/useOrcamentos';
import { useAuth } from '../contexts/AuthContext';

export default function OrcamentoScreen() {
  const { user } = useAuth();
  const { orcamentos, loading, adicionarItem, removerItem, criarOrcamento } = useOrcamentos();
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
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

  const handleAdicionarItem = async () => {
    if (!novoItem.nome || !novoItem.valor || !novoItem.categoria) {
      Alert.alert('Erro', 'Preencha todos os campos obrigatórios');
      return;
    }

    try {
      // Determinar o orçamento baseado na data do item
      const dataItem = new Date(novoItem.data + 'T00:00:00');
      const mesReferencia = `${dataItem.getFullYear()}-${String(dataItem.getMonth() + 1).padStart(2, '0')}-01`;
      
      // Buscar orçamento existente para o mês ou criar um novo
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
        {orcamentos.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="wallet-outline" size={64} color="#9ca3af" />
            <Text style={styles.emptyText}>Nenhum orçamento encontrado</Text>
            <Text style={styles.emptySubtext}>Adicione seu primeiro item para começar</Text>
          </View>
        ) : (
          orcamentos.map((orcamento) => (
            <View key={orcamento.id} style={styles.orcamentoCard}>
              <View style={styles.orcamentoHeader}>
                <Text style={styles.orcamentoTitulo}>{orcamento.nome}</Text>
                <Text style={styles.orcamentoMes}>{formatarMes(orcamento.mes_referencia)}</Text>
              </View>

              <View style={styles.resumoContainer}>
                <View style={styles.resumoItem}>
                  <Text style={styles.resumoLabel}>Receitas</Text>
                  <Text style={[styles.resumoValor, { color: '#10b981' }]}>
                    {formatarMoeda(orcamento.totalReceitas)}
                  </Text>
                </View>
                <View style={styles.resumoItem}>
                  <Text style={styles.resumoLabel}>Despesas</Text>
                  <Text style={[styles.resumoValor, { color: '#ef4444' }]}>
                    {formatarMoeda(orcamento.totalDespesas)}
                  </Text>
                </View>
                <View style={styles.resumoItem}>
                  <Text style={styles.resumoLabel}>Saldo</Text>
                  <Text style={[
                    styles.resumoValor, 
                    { color: orcamento.saldo >= 0 ? '#10b981' : '#ef4444' }
                  ]}>
                    {formatarMoeda(orcamento.saldo)}
                  </Text>
                </View>
              </View>

              {/* Lista de itens */}
              <View style={styles.itensContainer}>
                {[...orcamento.receitas, ...orcamento.despesas].map((item) => (
                  <View key={item.id} style={styles.itemCard}>
                    <View style={styles.itemInfo}>
                      <Text style={styles.itemNome}>{item.nome}</Text>
                      <Text style={styles.itemCategoria}>{item.categoria}</Text>
                      {item.observacoes && (
                        <Text style={styles.itemObservacoes}>{item.observacoes}</Text>
                      )}
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
            </View>
          ))
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
  },
  emptySubtext: {
    fontSize: 14,
    color: '#9ca3af',
    textAlign: 'center',
  },
  orcamentoCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  orcamentoHeader: {
    marginBottom: 16,
  },
  orcamentoTitulo: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  orcamentoMes: {
    fontSize: 14,
    color: '#6b7280',
  },
  resumoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  resumoItem: {
    alignItems: 'center',
  },
  resumoLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 4,
  },
  resumoValor: {
    fontSize: 16,
    fontWeight: '600',
  },
  itensContainer: {
    gap: 12,
  },
  itemCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f9fafb',
    borderRadius: 8,
  },
  itemInfo: {
    flex: 1,
  },
  itemNome: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1f2937',
    marginBottom: 2,
  },
  itemCategoria: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 2,
  },
  itemObservacoes: {
    fontSize: 11,
    color: '#9ca3af',
    fontStyle: 'italic',
  },
  itemActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  itemValor: {
    fontSize: 14,
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
