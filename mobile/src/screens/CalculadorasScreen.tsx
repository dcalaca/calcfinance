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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Calculadora {
  id: string;
  nome: string;
  descricao: string;
  icon: string;
  color: string;
  component: React.ComponentType<any>;
}

// Componente de Juros Compostos
function JurosCompostosCalculator() {
  const [principal, setPrincipal] = useState('');
  const [taxa, setTaxa] = useState('');
  const [tempo, setTempo] = useState('');
  const [resultado, setResultado] = useState<number | null>(null);

  const calcular = () => {
    const P = parseFloat(principal);
    const i = parseFloat(taxa) / 100;
    const n = parseFloat(tempo);

    if (isNaN(P) || isNaN(i) || isNaN(n)) {
      Alert.alert('Erro', 'Preencha todos os campos com valores válidos');
      return;
    }

    const montante = P * Math.pow(1 + i, n);
    const juros = montante - P;
    
    setResultado(montante);
    Alert.alert(
      'Resultado',
      `Montante Final: R$ ${montante.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}\n` +
      `Juros: R$ ${juros.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
    );
  };

  return (
    <View style={styles.calculatorContainer}>
      <Text style={styles.calculatorTitle}>Juros Compostos</Text>
      
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Valor Inicial (R$)</Text>
        <TextInput
          style={styles.input}
          value={principal}
          onChangeText={setPrincipal}
          placeholder="1000"
          keyboardType="numeric"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Taxa de Juros (% ao mês)</Text>
        <TextInput
          style={styles.input}
          value={taxa}
          onChangeText={setTaxa}
          placeholder="1.5"
          keyboardType="numeric"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Tempo (meses)</Text>
        <TextInput
          style={styles.input}
          value={tempo}
          onChangeText={setTempo}
          placeholder="12"
          keyboardType="numeric"
        />
      </View>

      <TouchableOpacity style={styles.calculateButton} onPress={calcular}>
        <Text style={styles.calculateButtonText}>Calcular</Text>
      </TouchableOpacity>

      {resultado && (
        <View style={styles.resultContainer}>
          <Text style={styles.resultText}>
            Montante Final: R$ {resultado.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </Text>
        </View>
      )}
    </View>
  );
}

// Componente de Financiamento
function FinanciamentoCalculator() {
  const [valor, setValor] = useState('');
  const [taxa, setTaxa] = useState('');
  const [parcelas, setParcelas] = useState('');
  const [resultado, setResultado] = useState<number | null>(null);

  const calcular = () => {
    const PV = parseFloat(valor);
    const i = parseFloat(taxa) / 100;
    const n = parseFloat(parcelas);

    if (isNaN(PV) || isNaN(i) || isNaN(n)) {
      Alert.alert('Erro', 'Preencha todos os campos com valores válidos');
      return;
    }

    const PMT = PV * (i * Math.pow(1 + i, n)) / (Math.pow(1 + i, n) - 1);
    const total = PMT * n;
    const juros = total - PV;
    
    setResultado(PMT);
    Alert.alert(
      'Resultado',
      `Parcela: R$ ${PMT.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}\n` +
      `Total: R$ ${total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}\n` +
      `Juros: R$ ${juros.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
    );
  };

  return (
    <View style={styles.calculatorContainer}>
      <Text style={styles.calculatorTitle}>Financiamento</Text>
      
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Valor do Financiamento (R$)</Text>
        <TextInput
          style={styles.input}
          value={valor}
          onChangeText={setValor}
          placeholder="50000"
          keyboardType="numeric"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Taxa de Juros (% ao mês)</Text>
        <TextInput
          style={styles.input}
          value={taxa}
          onChangeText={setTaxa}
          placeholder="1.2"
          keyboardType="numeric"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Número de Parcelas</Text>
        <TextInput
          style={styles.input}
          value={parcelas}
          onChangeText={setParcelas}
          placeholder="60"
          keyboardType="numeric"
        />
      </View>

      <TouchableOpacity style={styles.calculateButton} onPress={calcular}>
        <Text style={styles.calculateButtonText}>Calcular</Text>
      </TouchableOpacity>

      {resultado && (
        <View style={styles.resultContainer}>
          <Text style={styles.resultText}>
            Parcela: R$ {resultado.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </Text>
        </View>
      )}
    </View>
  );
}

// Componente de Financiamento Imobiliário (SAC e Price)
function FinanciamentoImovelCalculator() {
  const [valorImovel, setValorImovel] = useState('');
  const [entrada, setEntrada] = useState('');
  const [prazo, setPrazo] = useState('');
  const [taxaJuros, setTaxaJuros] = useState('');
  const [sistema, setSistema] = useState<'SAC' | 'Price'>('SAC');
  const [resultado, setResultado] = useState<any>(null);
  const [mostrarDetalhamento, setMostrarDetalhamento] = useState(false);

  // Função para formatar valor monetário
  const formatarValor = (valor: string) => {
    // Remove tudo que não é número
    const apenasNumeros = valor.replace(/\D/g, '');
    
    if (apenasNumeros === '') return '';
    
    // Converte para número e formata
    const numero = parseInt(apenasNumeros) / 100;
    return numero.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  };

  // Função para extrair valor numérico do texto formatado
  const extrairValorNumerico = (valorFormatado: string) => {
    const apenasNumeros = valorFormatado.replace(/\D/g, '');
    return apenasNumeros === '' ? 0 : parseInt(apenasNumeros) / 100;
  };

  // Função para formatar entrada de valor
  const handleValorChange = (valor: string, setter: (valor: string) => void) => {
    const valorFormatado = formatarValor(valor);
    setter(valorFormatado);
  };

  // Função para formatar taxa de juros
  const handleTaxaChange = (taxa: string) => {
    // Remove tudo que não é número ou ponto
    const apenasNumeros = taxa.replace(/[^\d.,]/g, '');
    
    if (apenasNumeros === '') {
      setTaxaJuros('');
      return;
    }
    
    // Substitui vírgula por ponto para cálculo
    const taxaFormatada = apenasNumeros.replace(',', '.');
    setTaxaJuros(taxaFormatada);
  };

  const calcular = () => {
    const valor = extrairValorNumerico(valorImovel);
    const valorEntrada = extrairValorNumerico(entrada);
    const meses = parseInt(prazo);
    const taxa = parseFloat(taxaJuros) / 100;

    if (!valor || !valorEntrada || !meses || !taxa) {
      Alert.alert('Erro', 'Preencha todos os campos');
      return;
    }

    const valorFinanciado = valor - valorEntrada;
    const taxaMensal = taxa / 12;

    if (sistema === 'SAC') {
      // Sistema de Amortização Constante (SAC)
      const amortizacao = valorFinanciado / meses;
      const parcelas = [];
      let saldoDevedor = valorFinanciado;

      for (let i = 1; i <= meses; i++) {
        const juros = saldoDevedor * taxaMensal;
        const parcela = amortizacao + juros;
        saldoDevedor -= amortizacao;

        parcelas.push({
          mes: i,
          amortizacao,
          juros,
          parcela,
          saldoDevedor: Math.max(0, saldoDevedor)
        });
      }

      const totalJuros = parcelas.reduce((sum, p) => sum + p.juros, 0);
      const primeiraParcela = parcelas[0].parcela;
      const ultimaParcela = parcelas[parcelas.length - 1].parcela;

      setResultado({
        sistema: 'SAC',
        valorFinanciado,
        totalJuros,
        totalPago: valorFinanciado + totalJuros,
        primeiraParcela,
        ultimaParcela,
        parcelas
      });
    } else {
      // Sistema Price (Tabela Price)
      const parcela = valorFinanciado * (taxaMensal * Math.pow(1 + taxaMensal, meses)) / 
                     (Math.pow(1 + taxaMensal, meses) - 1);
      
      const parcelas = [];
      let saldoDevedor = valorFinanciado;

      for (let i = 1; i <= meses; i++) {
        const juros = saldoDevedor * taxaMensal;
        const amortizacao = parcela - juros;
        saldoDevedor -= amortizacao;

        parcelas.push({
          mes: i,
          amortizacao,
          juros,
          parcela,
          saldoDevedor: Math.max(0, saldoDevedor)
        });
      }

      const totalJuros = parcelas.reduce((sum, p) => sum + p.juros, 0);

      setResultado({
        sistema: 'Price',
        valorFinanciado,
        totalJuros,
        totalPago: valorFinanciado + totalJuros,
        parcela,
        parcelas
      });
    }

    setMostrarDetalhamento(true);
  };

  const formatarMoeda = (valor: number) => {
    return valor.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  };

  return (
    <ScrollView style={styles.calculatorContent}>
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Valor do Imóvel</Text>
        <TextInput
          style={styles.input}
          value={valorImovel}
          onChangeText={(text) => handleValorChange(text, setValorImovel)}
          placeholder="Ex: R$ 500.000,00"
          keyboardType="numeric"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Valor da Entrada</Text>
        <TextInput
          style={styles.input}
          value={entrada}
          onChangeText={(text) => handleValorChange(text, setEntrada)}
          placeholder="Ex: R$ 100.000,00"
          keyboardType="numeric"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Prazo (meses)</Text>
        <TextInput
          style={styles.input}
          value={prazo}
          onChangeText={setPrazo}
          placeholder="Ex: 360"
          keyboardType="numeric"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Taxa de Juros Anual (%)</Text>
        <TextInput
          style={styles.input}
          value={taxaJuros}
          onChangeText={handleTaxaChange}
          placeholder="Ex: 8,5"
          keyboardType="numeric"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Sistema de Amortização</Text>
        <View style={styles.sistemaContainer}>
          <TouchableOpacity
            style={[styles.sistemaButton, sistema === 'SAC' && styles.sistemaButtonActive]}
            onPress={() => setSistema('SAC')}
          >
            <Text style={[styles.sistemaButtonText, sistema === 'SAC' && styles.sistemaButtonTextActive]}>
              SAC
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.sistemaButton, sistema === 'Price' && styles.sistemaButtonActive]}
            onPress={() => setSistema('Price')}
          >
            <Text style={[styles.sistemaButtonText, sistema === 'Price' && styles.sistemaButtonTextActive]}>
              Price
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity style={styles.calculateButton} onPress={calcular}>
        <Text style={styles.calculateButtonText}>Calcular</Text>
      </TouchableOpacity>

      {resultado && (
        <View style={styles.resultContainer}>
          <Text style={styles.resultTitle}>Resultado - {resultado.sistema}</Text>
          
          <View style={styles.resultCard}>
            <Text style={styles.resultLabel}>Valor Financiado</Text>
            <Text style={styles.resultValue}>{formatarMoeda(resultado.valorFinanciado)}</Text>
          </View>

          <View style={styles.resultCard}>
            <Text style={styles.resultLabel}>Total de Juros</Text>
            <Text style={styles.resultValue}>{formatarMoeda(resultado.totalJuros)}</Text>
          </View>

          <View style={styles.resultCard}>
            <Text style={styles.resultLabel}>Total a Pagar</Text>
            <Text style={styles.resultValue}>{formatarMoeda(resultado.totalPago)}</Text>
          </View>

          {resultado.sistema === 'SAC' ? (
            <>
              <View style={styles.resultCard}>
                <Text style={styles.resultLabel}>1ª Parcela</Text>
                <Text style={styles.resultValue}>{formatarMoeda(resultado.primeiraParcela)}</Text>
              </View>
              <View style={styles.resultCard}>
                <Text style={styles.resultLabel}>Última Parcela</Text>
                <Text style={styles.resultValue}>{formatarMoeda(resultado.ultimaParcela)}</Text>
              </View>
            </>
          ) : (
            <View style={styles.resultCard}>
              <Text style={styles.resultLabel}>Valor da Parcela</Text>
              <Text style={styles.resultValue}>{formatarMoeda(resultado.parcela)}</Text>
            </View>
          )}

          <TouchableOpacity
            style={styles.detalhamentoButton}
            onPress={() => setMostrarDetalhamento(!mostrarDetalhamento)}
          >
            <Text style={styles.detalhamentoButtonText}>
              {mostrarDetalhamento ? 'Ocultar Detalhamento' : 'Ver Detalhamento das Parcelas'}
            </Text>
            <Ionicons 
              name={mostrarDetalhamento ? "chevron-up" : "chevron-down"} 
              size={20} 
              color="#3b82f6" 
            />
          </TouchableOpacity>

          {mostrarDetalhamento && (
            <View style={styles.detalhamentoContainer}>
              <Text style={styles.detalhamentoTitle}>Detalhamento das Parcelas</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.tabelaContainer}>
                  <View style={styles.tabelaHeader}>
                    <Text style={[styles.tabelaCell, styles.tabelaHeaderCell, { width: 50 }]}>Mês</Text>
                    <Text style={[styles.tabelaCell, styles.tabelaHeaderCell, { width: 80 }]}>Parcela</Text>
                    <Text style={[styles.tabelaCell, styles.tabelaHeaderCell, { width: 80 }]}>Amortização</Text>
                    <Text style={[styles.tabelaCell, styles.tabelaHeaderCell, { width: 80 }]}>Juros</Text>
                    <Text style={[styles.tabelaCell, styles.tabelaHeaderCell, { width: 100 }]}>Saldo Devedor</Text>
                  </View>
                  {resultado.parcelas.slice(0, 12).map((parcela: any) => (
                    <View key={parcela.mes} style={styles.tabelaRow}>
                      <Text style={[styles.tabelaCell, { width: 50 }]}>{parcela.mes}</Text>
                      <Text style={[styles.tabelaCell, { width: 80 }]}>{formatarMoeda(parcela.parcela)}</Text>
                      <Text style={[styles.tabelaCell, { width: 80 }]}>{formatarMoeda(parcela.amortizacao)}</Text>
                      <Text style={[styles.tabelaCell, { width: 80 }]}>{formatarMoeda(parcela.juros)}</Text>
                      <Text style={[styles.tabelaCell, { width: 100 }]}>{formatarMoeda(parcela.saldoDevedor)}</Text>
                    </View>
                  ))}
                  {resultado.parcelas.length > 12 && (
                    <View style={styles.tabelaRow}>
                      <Text style={[styles.tabelaCell, { width: 50, fontStyle: 'italic' }]}>...</Text>
                      <Text style={[styles.tabelaCell, { width: 80, fontStyle: 'italic' }]}>...</Text>
                      <Text style={[styles.tabelaCell, { width: 80, fontStyle: 'italic' }]}>...</Text>
                      <Text style={[styles.tabelaCell, { width: 80, fontStyle: 'italic' }]}>...</Text>
                      <Text style={[styles.tabelaCell, { width: 100, fontStyle: 'italic' }]}>...</Text>
                    </View>
                  )}
                </View>
              </ScrollView>
              <Text style={styles.detalhamentoNote}>
                Mostrando primeiras 12 parcelas de {resultado.parcelas.length} total
              </Text>
            </View>
          )}
        </View>
      )}
    </ScrollView>
  );
}

// Componente de Financiamento de Veículos
function FinanciamentoVeiculoCalculator() {
  const [valorVeiculo, setValorVeiculo] = useState('');
  const [entrada, setEntrada] = useState('');
  const [prazo, setPrazo] = useState('');
  const [taxaJuros, setTaxaJuros] = useState('');
  const [seguro, setSeguro] = useState('');
  const [documentacao, setDocumentacao] = useState('');
  const [resultado, setResultado] = useState<any>(null);
  const [mostrarDetalhamento, setMostrarDetalhamento] = useState(false);

  // Função para formatar valor monetário
  const formatarValor = (valor: string) => {
    const apenasNumeros = valor.replace(/\D/g, '');
    if (apenasNumeros === '') return '';
    
    const numero = parseInt(apenasNumeros) / 100;
    return numero.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  };

  // Função para extrair valor numérico do texto formatado
  const extrairValorNumerico = (valorFormatado: string) => {
    const apenasNumeros = valorFormatado.replace(/\D/g, '');
    return apenasNumeros === '' ? 0 : parseInt(apenasNumeros) / 100;
  };

  // Função para formatar entrada de valor
  const handleValorChange = (valor: string, setter: (valor: string) => void) => {
    const valorFormatado = formatarValor(valor);
    setter(valorFormatado);
  };

  // Função para formatar taxa de juros
  const handleTaxaChange = (taxa: string) => {
    const apenasNumeros = taxa.replace(/[^\d.,]/g, '');
    
    if (apenasNumeros === '') {
      setTaxaJuros('');
      return;
    }
    
    const taxaFormatada = apenasNumeros.replace(',', '.');
    setTaxaJuros(taxaFormatada);
  };

  const calcular = () => {
    const valor = extrairValorNumerico(valorVeiculo);
    const valorEntrada = extrairValorNumerico(entrada);
    const meses = parseInt(prazo);
    const taxa = parseFloat(taxaJuros) / 100;
    const valorSeguro = extrairValorNumerico(seguro);
    const valorDocumentacao = extrairValorNumerico(documentacao);

    if (!valor || !valorEntrada || !meses || !taxa) {
      Alert.alert('Erro', 'Preencha os campos obrigatórios');
      return;
    }

    const valorFinanciado = valor - valorEntrada;
    const taxaMensal = taxa / 100;

    // Cálculo da parcela (Sistema Price)
    const parcela = valorFinanciado * (taxaMensal * Math.pow(1 + taxaMensal, meses)) / 
                   (Math.pow(1 + taxaMensal, meses) - 1);

    // Custos adicionais
    const seguroMensal = valorSeguro / 12;
    const documentacaoMensal = valorDocumentacao / meses;
    const parcelaTotal = parcela + seguroMensal + documentacaoMensal;

    // Detalhamento das parcelas
    const parcelas = [];
    let saldoDevedor = valorFinanciado;

    for (let i = 1; i <= meses; i++) {
      const juros = saldoDevedor * taxaMensal;
      const amortizacao = parcela - juros;
      saldoDevedor -= amortizacao;

      parcelas.push({
        mes: i,
        amortizacao,
        juros,
        parcela,
        seguro: seguroMensal,
        documentacao: documentacaoMensal,
        parcelaTotal,
        saldoDevedor: Math.max(0, saldoDevedor)
      });
    }

    const totalJuros = parcelas.reduce((sum, p) => sum + p.juros, 0);
    const totalSeguro = valorSeguro;
    const totalDocumentacao = valorDocumentacao;
    const totalFinanciamento = valorFinanciado + totalJuros;
    const totalGeral = totalFinanciamento + totalSeguro + totalDocumentacao;

    setResultado({
      valorVeiculo: valor,
      valorEntrada,
      valorFinanciado,
      totalJuros,
      totalSeguro,
      totalDocumentacao,
      totalFinanciamento,
      totalGeral,
      parcela,
      seguroMensal,
      documentacaoMensal,
      parcelaTotal,
      parcelas
    });

    setMostrarDetalhamento(true);
  };

  const formatarMoeda = (valor: number) => {
    return valor.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  };

  return (
    <ScrollView style={styles.calculatorContent}>
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Valor do Veículo</Text>
        <TextInput
          style={styles.input}
          value={valorVeiculo}
          onChangeText={(text) => handleValorChange(text, setValorVeiculo)}
          placeholder="Ex: R$ 80.000,00"
          keyboardType="numeric"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Valor da Entrada</Text>
        <TextInput
          style={styles.input}
          value={entrada}
          onChangeText={(text) => handleValorChange(text, setEntrada)}
          placeholder="Ex: R$ 20.000,00"
          keyboardType="numeric"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Prazo (meses)</Text>
        <TextInput
          style={styles.input}
          value={prazo}
          onChangeText={setPrazo}
          placeholder="Ex: 48"
          keyboardType="numeric"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Taxa de Juros Mensal (%)</Text>
        <TextInput
          style={styles.input}
          value={taxaJuros}
          onChangeText={handleTaxaChange}
          placeholder="Ex: 1,2"
          keyboardType="numeric"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Seguro (opcional)</Text>
        <TextInput
          style={styles.input}
          value={seguro}
          onChangeText={(text) => handleValorChange(text, setSeguro)}
          placeholder="Ex: R$ 2.400,00"
          keyboardType="numeric"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Documentação (opcional)</Text>
        <TextInput
          style={styles.input}
          value={documentacao}
          onChangeText={(text) => handleValorChange(text, setDocumentacao)}
          placeholder="Ex: R$ 1.200,00"
          keyboardType="numeric"
        />
      </View>

      <TouchableOpacity style={styles.calculateButton} onPress={calcular}>
        <Text style={styles.calculateButtonText}>Simular Financiamento</Text>
      </TouchableOpacity>

      {resultado && (
        <View style={styles.resultContainer}>
          <Text style={styles.resultTitle}>Simulação de Financiamento</Text>
          
          <View style={styles.resultCard}>
            <Text style={styles.resultLabel}>Valor do Veículo</Text>
            <Text style={styles.resultValue}>{formatarMoeda(resultado.valorVeiculo)}</Text>
          </View>

          <View style={styles.resultCard}>
            <Text style={styles.resultLabel}>Entrada</Text>
            <Text style={styles.resultValue}>{formatarMoeda(resultado.valorEntrada)}</Text>
          </View>

          <View style={styles.resultCard}>
            <Text style={styles.resultLabel}>Valor Financiado</Text>
            <Text style={styles.resultValue}>{formatarMoeda(resultado.valorFinanciado)}</Text>
          </View>

          <View style={styles.resultCard}>
            <Text style={styles.resultLabel}>Parcela do Financiamento</Text>
            <Text style={styles.resultValue}>{formatarMoeda(resultado.parcela)}</Text>
          </View>

          {resultado.seguroMensal > 0 && (
            <View style={styles.resultCard}>
              <Text style={styles.resultLabel}>Seguro Mensal</Text>
              <Text style={styles.resultValue}>{formatarMoeda(resultado.seguroMensal)}</Text>
            </View>
          )}

          {resultado.documentacaoMensal > 0 && (
            <View style={styles.resultCard}>
              <Text style={styles.resultLabel}>Documentação Mensal</Text>
              <Text style={styles.resultValue}>{formatarMoeda(resultado.documentacaoMensal)}</Text>
            </View>
          )}

          <View style={[styles.resultCard, { backgroundColor: '#f0f9ff', borderLeftWidth: 4, borderLeftColor: '#3b82f6' }]}>
            <Text style={[styles.resultLabel, { fontWeight: '600' }]}>Parcela Total</Text>
            <Text style={[styles.resultValue, { fontWeight: 'bold', color: '#1d4ed8' }]}>
              {formatarMoeda(resultado.parcelaTotal)}
            </Text>
          </View>

          <View style={styles.resultCard}>
            <Text style={styles.resultLabel}>Total de Juros</Text>
            <Text style={[styles.resultValue, { color: '#ef4444' }]}>
              {formatarMoeda(resultado.totalJuros)}
            </Text>
          </View>

          <View style={styles.resultCard}>
            <Text style={styles.resultLabel}>Total a Pagar</Text>
            <Text style={[styles.resultValue, { fontWeight: 'bold' }]}>
              {formatarMoeda(resultado.totalGeral)}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.detalhamentoButton}
            onPress={() => setMostrarDetalhamento(!mostrarDetalhamento)}
          >
            <Text style={styles.detalhamentoButtonText}>
              {mostrarDetalhamento ? 'Ocultar Detalhamento' : 'Ver Detalhamento das Parcelas'}
            </Text>
            <Ionicons 
              name={mostrarDetalhamento ? "chevron-up" : "chevron-down"} 
              size={20} 
              color="#3b82f6" 
            />
          </TouchableOpacity>

          {mostrarDetalhamento && (
            <View style={styles.detalhamentoContainer}>
              <Text style={styles.detalhamentoTitle}>Detalhamento das Parcelas</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.tabelaContainer}>
                  <View style={styles.tabelaHeader}>
                    <Text style={[styles.tabelaCell, styles.tabelaHeaderCell, { width: 40 }]}>Mês</Text>
                    <Text style={[styles.tabelaCell, styles.tabelaHeaderCell, { width: 70 }]}>Parcela</Text>
                    <Text style={[styles.tabelaCell, styles.tabelaHeaderCell, { width: 70 }]}>Juros</Text>
                    <Text style={[styles.tabelaCell, styles.tabelaHeaderCell, { width: 70 }]}>Amort.</Text>
                    <Text style={[styles.tabelaCell, styles.tabelaHeaderCell, { width: 80 }]}>Total</Text>
                    <Text style={[styles.tabelaCell, styles.tabelaHeaderCell, { width: 80 }]}>Saldo</Text>
                  </View>
                  {resultado.parcelas.slice(0, 12).map((parcela: any) => (
                    <View key={parcela.mes} style={styles.tabelaRow}>
                      <Text style={[styles.tabelaCell, { width: 40 }]}>{parcela.mes}</Text>
                      <Text style={[styles.tabelaCell, { width: 70 }]}>{formatarMoeda(parcela.parcela)}</Text>
                      <Text style={[styles.tabelaCell, { width: 70 }]}>{formatarMoeda(parcela.juros)}</Text>
                      <Text style={[styles.tabelaCell, { width: 70 }]}>{formatarMoeda(parcela.amortizacao)}</Text>
                      <Text style={[styles.tabelaCell, { width: 80, fontWeight: '600' }]}>{formatarMoeda(parcela.parcelaTotal)}</Text>
                      <Text style={[styles.tabelaCell, { width: 80 }]}>{formatarMoeda(parcela.saldoDevedor)}</Text>
                    </View>
                  ))}
                  {resultado.parcelas.length > 12 && (
                    <View style={styles.tabelaRow}>
                      <Text style={[styles.tabelaCell, { width: 40, fontStyle: 'italic' }]}>...</Text>
                      <Text style={[styles.tabelaCell, { width: 70, fontStyle: 'italic' }]}>...</Text>
                      <Text style={[styles.tabelaCell, { width: 70, fontStyle: 'italic' }]}>...</Text>
                      <Text style={[styles.tabelaCell, { width: 70, fontStyle: 'italic' }]}>...</Text>
                      <Text style={[styles.tabelaCell, { width: 80, fontStyle: 'italic' }]}>...</Text>
                      <Text style={[styles.tabelaCell, { width: 80, fontStyle: 'italic' }]}>...</Text>
                    </View>
                  )}
                </View>
              </ScrollView>
              <Text style={styles.detalhamentoNote}>
                Mostrando primeiras 12 parcelas de {resultado.parcelas.length} total
              </Text>
            </View>
          )}

          {/* Dicas de Financiamento */}
          <View style={styles.dicasContainer}>
            <Text style={styles.dicasTitulo}>💡 Dicas para Financiamento</Text>
            <View style={styles.dicasLista}>
              <Text style={styles.dicaItem}>• Taxa mensal comum: 1,2% a 2,5%</Text>
              <Text style={styles.dicaItem}>• Entrada maior reduz juros totais</Text>
              <Text style={styles.dicaItem}>• Prazo menor = menos juros</Text>
              <Text style={styles.dicaItem}>• Compare taxas entre bancos</Text>
              <Text style={styles.dicaItem}>• Considere seguro e documentação</Text>
              <Text style={styles.dicaItem}>• Verifique se cabe no seu orçamento</Text>
            </View>
          </View>
        </View>
      )}
    </ScrollView>
  );
}

// Componente de Aposentadoria
function AposentadoriaCalculator() {
  const [idadeAtual, setIdadeAtual] = useState('');
  const [idadeAposentadoria, setIdadeAposentadoria] = useState('');
  const [rendaMensalDesejada, setRendaMensalDesejada] = useState('');
  const [valorJaPoupado, setValorJaPoupado] = useState('');
  const [contribuicaoMensal, setContribuicaoMensal] = useState('');
  const [taxaJuros, setTaxaJuros] = useState('0,5');
  const [resultado, setResultado] = useState<any>(null);

  // Função para formatar valor monetário
  const formatarValor = (valor: string) => {
    const apenasNumeros = valor.replace(/\D/g, '');
    if (apenasNumeros === '') return '';
    
    const numero = parseInt(apenasNumeros) / 100;
    return numero.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  };

  // Função para extrair valor numérico do texto formatado
  const extrairValorNumerico = (valorFormatado: string) => {
    const apenasNumeros = valorFormatado.replace(/\D/g, '');
    return apenasNumeros === '' ? 0 : parseInt(apenasNumeros) / 100;
  };

  // Função para formatar entrada de valor
  const handleValorChange = (valor: string, setter: (valor: string) => void) => {
    const valorFormatado = formatarValor(valor);
    setter(valorFormatado);
  };

  // Função para formatar taxa
  const handleTaxaChange = (taxa: string) => {
    const apenasNumeros = taxa.replace(/[^\d.,]/g, '');
    
    if (apenasNumeros === '') {
      setTaxa('');
      return;
    }
    
    const taxaFormatada = apenasNumeros.replace(',', '.');
    setTaxa(taxaFormatada);
  };

  const calcular = () => {
    const idadeAtualNum = parseInt(idadeAtual);
    const idadeAposentadoriaNum = parseInt(idadeAposentadoria);
    const rendaMensal = extrairValorNumerico(rendaMensalDesejada);
    const valorPoupado = extrairValorNumerico(valorJaPoupado);
    const contribuicao = extrairValorNumerico(contribuicaoMensal);
    const taxa = parseFloat(taxaJuros.replace(',', '.')) / 100;

    if (!idadeAtualNum || !idadeAposentadoriaNum || !rendaMensal || !valorPoupado || !contribuicao || !taxa) {
      Alert.alert('Erro', 'Preencha todos os campos com valores válidos');
      return;
    }

    if (idadeAposentadoriaNum <= idadeAtualNum) {
      Alert.alert('Erro', 'A idade para aposentadoria deve ser maior que a idade atual');
      return;
    }

    const anosParaAposentadoria = idadeAposentadoriaNum - idadeAtualNum;
    const mesesParaAposentadoria = anosParaAposentadoria * 12;

    // Cálculo do valor necessário para aposentadoria (4% de retirada anual)
    const valorNecessario = (rendaMensal * 12) / 0.04;

    // Cálculo do valor futuro com os aportes atuais
    const valorFuturoComAportes = valorPoupado * Math.pow(1 + taxa, mesesParaAposentadoria) + 
                                 contribuicao * ((Math.pow(1 + taxa, mesesParaAposentadoria) - 1) / taxa);

    // Diferença entre o necessário e o que teremos
    const diferenca = valorNecessario - valorFuturoComAportes;

    // Aporte mensal necessário para atingir o objetivo
    const aporteNecessario = diferenca > 0 ? 
      diferenca / ((Math.pow(1 + taxa, mesesParaAposentadoria) - 1) / taxa) : 0;

    setResultado({
      valorNecessario,
      valorFuturoComAportes,
      diferenca,
      aporteNecessario,
      anosParaAposentadoria,
      rendaMensal
    });
  };

  return (
    <View style={styles.calculatorContainer}>
      <Text style={styles.calculatorTitle}>Aposentadoria</Text>
      
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Idade Atual</Text>
        <TextInput
          style={styles.input}
          value={idadeAtual}
          onChangeText={setIdadeAtual}
          placeholder="Ex: 30"
          keyboardType="numeric"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Idade para Aposentadoria</Text>
        <TextInput
          style={styles.input}
          value={idadeAposentadoria}
          onChangeText={setIdadeAposentadoria}
          placeholder="Ex: 65"
          keyboardType="numeric"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Renda Mensal Desejada (R$)</Text>
        <TextInput
          style={styles.input}
          value={rendaMensalDesejada}
          onChangeText={(text) => handleValorChange(text, setRendaMensalDesejada)}
          placeholder="Ex: R$ 5.000,00"
          keyboardType="numeric"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Valor Já Poupado (R$)</Text>
        <TextInput
          style={styles.input}
          value={valorJaPoupado}
          onChangeText={(text) => handleValorChange(text, setValorJaPoupado)}
          placeholder="Ex: R$ 50.000,00"
          keyboardType="numeric"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Contribuição Mensal Atual (R$)</Text>
        <TextInput
          style={styles.input}
          value={contribuicaoMensal}
          onChangeText={(text) => handleValorChange(text, setContribuicaoMensal)}
          placeholder="Ex: R$ 1.000,00"
          keyboardType="numeric"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Taxa de Juros Mensal (%)</Text>
        <TextInput
          style={styles.input}
          value={taxaJuros}
          onChangeText={handleTaxaChange}
          placeholder="Ex: 0,5"
          keyboardType="numeric"
        />
      </View>

      <TouchableOpacity style={styles.calculateButton} onPress={calcular}>
        <Text style={styles.calculateButtonText}>Calcular</Text>
      </TouchableOpacity>

      {resultado && (
        <View style={styles.resultContainer}>
          <Text style={styles.resultTitle}>Plano de Aposentadoria</Text>
          
          <View style={styles.resultCard}>
            <Text style={styles.resultLabel}>Valor Necessário</Text>
            <Text style={[styles.resultValue, { color: '#ef4444' }]}>
              {resultado.valorNecessario.toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL'
              })}
            </Text>
            <Text style={styles.resultSubtext}>
              Para ter R$ {resultado.rendaMensal.toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL'
              })}/mês na aposentadoria
            </Text>
          </View>

          <View style={styles.resultCard}>
            <Text style={styles.resultLabel}>Valor que Terá</Text>
            <Text style={[styles.resultValue, { color: '#10b981' }]}>
              {resultado.valorFuturoComAportes.toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL'
              })}
            </Text>
            <Text style={styles.resultSubtext}>
              Com os aportes atuais em {resultado.anosParaAposentadoria} anos
            </Text>
          </View>

          {resultado.diferenca > 0 ? (
            <View style={[styles.resultCard, { backgroundColor: '#fef2f2', borderLeftWidth: 4, borderLeftColor: '#ef4444' }]}>
              <Text style={[styles.resultLabel, { color: '#ef4444' }]}>Aporte Mensal Necessário</Text>
              <Text style={[styles.resultValue, { color: '#ef4444', fontWeight: 'bold' }]}>
                {resultado.aporteNecessario.toLocaleString('pt-BR', {
                  style: 'currency',
                  currency: 'BRL'
                })}
              </Text>
              <Text style={[styles.resultSubtext, { color: '#ef4444' }]}>
                Para atingir o objetivo
              </Text>
            </View>
          ) : (
            <View style={[styles.resultCard, { backgroundColor: '#f0fdf4', borderLeftWidth: 4, borderLeftColor: '#10b981' }]}>
              <Text style={[styles.resultLabel, { color: '#10b981' }]}>Parabéns!</Text>
              <Text style={[styles.resultValue, { color: '#10b981', fontWeight: 'bold' }]}>
                Meta Atingida
              </Text>
              <Text style={[styles.resultSubtext, { color: '#10b981' }]}>
                Você já está no caminho certo!
              </Text>
            </View>
          )}

          <View style={styles.dicasContainer}>
            <Text style={styles.dicasTitulo}>💡 Dicas para Aposentadoria</Text>
            <View style={styles.dicasLista}>
              <Text style={styles.dicaItem}>• Comece a investir o quanto antes</Text>
              <Text style={styles.dicaItem}>• Aumente os aportes gradualmente</Text>
              <Text style={styles.dicaItem}>• Diversifique seus investimentos</Text>
              <Text style={styles.dicaItem}>• Revise o plano anualmente</Text>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}

export default function CalculadorasScreen() {
  const [calculadoraSelecionada, setCalculadoraSelecionada] = useState<string | null>(null);

  const calculadoras: Calculadora[] = [
    {
      id: 'juros-compostos',
      nome: 'Juros Compostos',
      descricao: 'Calcule o crescimento do seu investimento',
      icon: 'trending-up',
      color: '#10b981',
      component: JurosCompostosCalculator,
    },
    {
      id: 'financiamento',
      nome: 'Financiamento',
      descricao: 'Calcule parcelas de financiamento',
      icon: 'home',
      color: '#3b82f6',
      component: FinanciamentoCalculator,
    },
    {
      id: 'financiamento-imovel',
      nome: 'Financiamento Imóvel',
      descricao: 'SAC e Price para imóveis',
      icon: 'business',
      color: '#f59e0b',
      component: FinanciamentoImovelCalculator,
    },
    {
      id: 'financiamento-veiculo',
      nome: 'Financiamento Veículo',
      descricao: 'Simule a compra do seu carro',
      icon: 'car',
      color: '#ef4444',
      component: FinanciamentoVeiculoCalculator,
    },
    {
      id: 'aposentadoria',
      nome: 'Aposentadoria',
      descricao: 'Planeje sua aposentadoria',
      icon: 'person',
      color: '#8b5cf6',
      component: AposentadoriaCalculator,
    },
  ];

  const CalculadoraSelecionada = calculadoras.find(c => c.id === calculadoraSelecionada)?.component;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Calculadoras</Text>
        <Text style={styles.subtitle}>Ferramentas financeiras</Text>
      </View>

      {!calculadoraSelecionada ? (
        <ScrollView style={styles.content}>
          <View style={styles.calculadorasGrid}>
            {calculadoras.map((calculadora) => (
              <TouchableOpacity
                key={calculadora.id}
                style={[styles.calculadoraCard, { backgroundColor: calculadora.color + '10' }]}
                onPress={() => setCalculadoraSelecionada(calculadora.id)}
              >
                <View style={[styles.iconContainer, { backgroundColor: calculadora.color }]}>
                  <Ionicons name={calculadora.icon as any} size={24} color="white" />
                </View>
                <Text style={styles.calculadoraNome}>{calculadora.nome}</Text>
                <Text style={styles.calculadoraDescricao}>{calculadora.descricao}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      ) : (
        <View style={styles.calculatorView}>
          <View style={styles.calculatorHeader}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => setCalculadoraSelecionada(null)}
            >
              <Ionicons name="arrow-back" size={24} color="#3b82f6" />
            </TouchableOpacity>
            <Text style={styles.calculatorHeaderTitle}>
              {calculadoras.find(c => c.id === calculadoraSelecionada)?.nome}
            </Text>
            <View style={{ width: 24 }} />
          </View>
          
          <ScrollView style={styles.calculatorContent}>
            {CalculadoraSelecionada && <CalculadoraSelecionada />}
          </ScrollView>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
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
  calculadorasGrid: {
    gap: 16,
  },
  calculadoraCard: {
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  calculadoraNome: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
    textAlign: 'center',
  },
  calculadoraDescricao: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 20,
  },
  calculatorView: {
    flex: 1,
  },
  calculatorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  backButton: {
    padding: 4,
  },
  calculatorHeaderTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
  },
  calculatorContent: {
    flex: 1,
    padding: 20,
  },
  calculatorContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  calculatorTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: 16,
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
  calculateButton: {
    backgroundColor: '#3b82f6',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  calculateButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  resultContainer: {
    marginTop: 16,
    padding: 16,
    backgroundColor: '#f0f9ff',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#3b82f6',
  },
  resultText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  sistemaContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  sistemaButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#d1d5db',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  sistemaButtonActive: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
  },
  sistemaButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#6b7280',
  },
  sistemaButtonTextActive: {
    color: 'white',
  },
  resultTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
    textAlign: 'center',
  },
  resultCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  resultLabel: {
    fontSize: 16,
    color: '#6b7280',
  },
  resultValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  resultSubtext: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
  },
  detalhamentoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    marginTop: 16,
  },
  detalhamentoButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#3b82f6',
    marginRight: 8,
  },
  detalhamentoContainer: {
    marginTop: 16,
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    padding: 16,
  },
  detalhamentoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 12,
    textAlign: 'center',
  },
  tabelaContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    overflow: 'hidden',
  },
  tabelaHeader: {
    flexDirection: 'row',
    backgroundColor: '#f3f4f6',
  },
  tabelaRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  tabelaCell: {
    padding: 8,
    fontSize: 12,
    textAlign: 'center',
    color: '#374151',
  },
  tabelaHeaderCell: {
    fontWeight: '600',
    color: '#1f2937',
  },
  detalhamentoNote: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
    marginTop: 8,
    fontStyle: 'italic',
  },
  dicasContainer: {
    marginTop: 16,
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    padding: 16,
  },
  dicasTitulo: {
    fontSize: 16,
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
