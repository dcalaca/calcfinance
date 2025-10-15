import { NextResponse } from "next/server"

// Função para buscar cotações de moedas da AwesomeAPI
async function fetchCurrencyRates() {
  try {
    const response = await fetch('https://economia.awesomeapi.com.br/json/last/USD-BRL,EUR-BRL', {
      headers: {
        'User-Agent': 'CalcFy/1.0'
      }
    })
    
    if (!response.ok) {
      throw new Error(`AwesomeAPI error: ${response.status}`)
    }
    
    const data = await response.json()
    
    return {
      dolar: parseFloat(data.USDBRL.bid),
      euro: parseFloat(data.EURBRL.bid),
      dolarVariation: parseFloat(data.USDBRL.pctChange),
      euroVariation: parseFloat(data.EURBRL.pctChange)
    }
  } catch (error) {
    console.error('Erro ao buscar cotações de moedas:', error)
    throw error
  }
}

// Função para buscar SELIC do Banco Central
async function fetchSELIC() {
  try {
    const response = await fetch('https://api.bcb.gov.br/dados/serie/bcdata.sgs.432/dados/ultimos/1?formato=json')
    
    if (!response.ok) {
      throw new Error(`Banco Central SELIC error: ${response.status}`)
    }
    
    const data = await response.json()
    return data && data.length > 0 ? parseFloat(data[0].valor) : 11.75
  } catch (error) {
    console.error('Erro ao buscar SELIC:', error)
    return 11.75 // Valor padrão
  }
}

// Função para buscar IPCA do Banco Central
async function fetchIPCA() {
  try {
    const response = await fetch('https://api.bcb.gov.br/dados/serie/bcdata.sgs.433/dados/ultimos/1?formato=json')
    
    if (!response.ok) {
      throw new Error(`Banco Central IPCA error: ${response.status}`)
    }
    
    const data = await response.json()
    return data && data.length > 0 ? parseFloat(data[0].valor) : 4.62
  } catch (error) {
    console.error('Erro ao buscar IPCA:', error)
    return 4.62 // Valor padrão
  }
}

// Função para buscar Bitcoin da CoinGecko
async function fetchBitcoin() {
  try {
    const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd&include_24hr_change=true')
    
    if (!response.ok) {
      throw new Error(`CoinGecko error: ${response.status}`)
    }
    
    const data = await response.json()
    return {
      price: data.bitcoin.usd,
      change: data.bitcoin.usd_24h_change
    }
  } catch (error) {
    console.error('Erro ao buscar Bitcoin:', error)
    return {
      price: 42500,
      change: 0
    }
  }
}

export async function GET() {
  try {
    console.log('🔄 Buscando dados de mercado com timeout...')
    
    // Timeout de 10 segundos para evitar 503
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Timeout')), 10000)
    )
    
    // Buscar dados com timeout
    const dataPromise = Promise.allSettled([
      fetchCurrencyRates(),
      fetchSELIC(),
      fetchIPCA(),
      fetchBitcoin()
    ])
    
    const [currencyData, selic, ipca, bitcoinData] = await Promise.race([
      dataPromise,
      timeoutPromise
    ]) as any[]
    
    // Processar resultados
    const dolar = currencyData?.status === 'fulfilled' ? currencyData.value.dolar : 5.25
    const euro = currencyData?.status === 'fulfilled' ? currencyData.value.euro : 5.68
    const bitcoin = bitcoinData?.status === 'fulfilled' ? bitcoinData.value.price : 42500
    const selicRate = selic?.status === 'fulfilled' ? selic.value : 11.75
    const ipcaRate = ipca?.status === 'fulfilled' ? ipca.value : 4.62
    
    const marketData = {
      dolar: Math.round(dolar * 100) / 100,
      euro: Math.round(euro * 100) / 100,
      bitcoin: Math.round(bitcoin),
      selic: Math.round(selicRate * 100) / 100,
      ipca: Math.round(ipcaRate * 100) / 100,
      dolarVariation: currencyData?.status === 'fulfilled' ? currencyData.value.dolarVariation : 0,
      euroVariation: currencyData?.status === 'fulfilled' ? currencyData.value.euroVariation : 0,
      bitcoinVariation: bitcoinData?.status === 'fulfilled' ? bitcoinData.value.change : 0,
      lastUpdated: new Date().toISOString()
    }
    
    console.log('✅ Dados de mercado atualizados:', marketData)
    return NextResponse.json(marketData)
    
  } catch (error) {
    console.error('❌ Erro ao buscar dados de mercado:', error)
    
    // Retornar dados de fallback em caso de erro
    return NextResponse.json({
      dolar: 5.25,
      euro: 5.68,
      bitcoin: 42500,
      selic: 11.75,
      ipca: 4.62,
      dolarVariation: 0,
      euroVariation: 0,
      bitcoinVariation: 0,
      lastUpdated: new Date().toISOString()
    })
  }
}
