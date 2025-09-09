import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Image,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useOrcamentos } from '../hooks/useOrcamentos';

const { width } = Dimensions.get('window');

export default function HomeScreen({ navigation }: any) {
  const { orcamentos, loading } = useOrcamentos();

  // Calcular totais reais dos orçamentos
  const totais = orcamentos.reduce((acc, orcamento) => {
    acc.receitas += orcamento.totalReceitas;
    acc.despesas += orcamento.totalDespesas;
    acc.saldo += orcamento.saldo;
    return acc;
  }, { receitas: 0, despesas: 0, saldo: 0 });

  const formatarMoeda = (valor: number) => {
    return valor.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  };

  const features = [
    {
      title: 'Meu Orçamento',
      description: 'Controle suas receitas e despesas',
      icon: 'wallet-outline',
      color: '#10b981',
      onPress: () => navigation.navigate('Orcamento'),
    },
    {
      title: 'Calculadoras',
      description: 'Juros compostos, financiamentos e mais',
      icon: 'calculator-outline',
      color: '#3b82f6',
      onPress: () => navigation.navigate('Calculadoras'),
    },
    {
      title: 'Dashboard',
      description: 'Visão geral das suas finanças',
      icon: 'analytics-outline',
      color: '#8b5cf6',
      onPress: () => navigation.navigate('Dashboard'),
    },
    {
      title: 'Perfil',
      description: 'Configurações da sua conta',
      icon: 'person-outline',
      color: '#f59e0b',
      onPress: () => navigation.navigate('Profile'),
    },
  ];

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Carregando dados...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Image 
            source={{ uri: 'https://calcfinance.com.br/logo.png' }}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>
        <Text style={styles.subtitle}>
          Sua plataforma completa para decisões financeiras inteligentes
        </Text>
      </View>

      <View style={styles.featuresGrid}>
        {features.map((feature, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.featureCard, { backgroundColor: feature.color + '10' }]}
            onPress={feature.onPress}
          >
            <View style={[styles.iconContainer, { backgroundColor: feature.color }]}>
              <Ionicons name={feature.icon as any} size={24} color="white" />
            </View>
            <Text style={styles.featureTitle}>{feature.title}</Text>
            <Text style={styles.featureDescription}>{feature.description}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.statsContainer}>
        <Text style={styles.statsTitle}>Resumo Rápido</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={[styles.statValue, { color: '#10b981' }]}>
              {formatarMoeda(totais.receitas)}
            </Text>
            <Text style={styles.statLabel}>Receitas</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.statValue, { color: '#ef4444' }]}>
              {formatarMoeda(totais.despesas)}
            </Text>
            <Text style={styles.statLabel}>Despesas</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[
              styles.statValue, 
              { color: totais.saldo >= 0 ? '#10b981' : '#ef4444' }
            ]}>
              {formatarMoeda(totais.saldo)}
            </Text>
            <Text style={styles.statLabel}>Saldo</Text>
          </View>
        </View>
      </View>

      {/* Seção de Contato */}
      <View style={styles.contatoContainer}>
        <View style={styles.contatoCard}>
          <Ionicons name="mail-outline" size={24} color="#6b7280" />
          <View style={styles.contatoContent}>
            <Text style={styles.contatoTitle}>Sugestões e Parcerias</Text>
            <Text style={styles.contatoText}>
              Tem uma ideia para melhorar o app ou quer fazer uma parceria?
            </Text>
            <TouchableOpacity 
              style={styles.emailButton}
              onPress={() => {
                // Abre o app de email padrão
                Linking.openURL('mailto:dcalaca@gmail.com?subject=Sugestão CalcFinance&body=Olá! Gostaria de sugerir...');
              }}
            >
              <Text style={styles.emailText}>dcalaca@gmail.com</Text>
              <Ionicons name="arrow-forward-outline" size={16} color="#10b981" />
            </TouchableOpacity>
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
    backgroundColor: '#f8fafc',
  },
  header: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: 'white',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: 20,
    alignItems: 'center',
  },
  logoContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  logo: {
    width: 180,
    height: 180,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    lineHeight: 24,
    textAlign: 'center',
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    gap: 16,
  },
  featureCard: {
    width: (width - 56) / 2,
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
    textAlign: 'center',
  },
  featureDescription: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 16,
  },
  statsContainer: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
  },
  contatoContainer: {
    margin: 20,
    marginTop: 0,
  },
  contatoCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  contatoContent: {
    flex: 1,
    marginLeft: 16,
  },
  contatoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 8,
  },
  contatoText: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
    marginBottom: 12,
  },
  emailButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f0fdf4',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#10b981',
  },
  emailText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#10b981',
  },
});
