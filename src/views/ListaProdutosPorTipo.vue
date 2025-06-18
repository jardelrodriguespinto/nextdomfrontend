<template>
  <div>
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-xl font-semibold">Consulta de Produtos por Tipo</h2>
      <div class="form-group">
        <label for="filtroTipo" class="form-label">Filtrar por Tipo:</label>
        <select 
          id="filtroTipo" 
          v-model="tipoSelecionado" 
          @change="filtrarPorTipo"
          class="form-select"
        >
          <option value="">Todos os tipos</option>
          <option value="ELETRONICO">ELETRÔNICO</option>
          <option value="ELETRODOMESTICO">ELETRODOMÉSTICO</option>
          <option value="MOVEL">MÓVEL</option>
        </select>
      </div>
    </div>

    <!-- Resumo por Tipo -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div class="card">
        <div class="card-body">
          <h3 class="text-sm font-medium text-secondary mb-1">Total de Produtos</h3>
          <p class="text-2xl font-bold text-primary">{{ produtosFiltrados.length }}</p>
        </div>
      </div>
      <div class="card">
        <div class="card-body">
          <h3 class="text-sm font-medium text-secondary mb-1">Quantidade Total Disponível</h3>
          <p class="text-2xl font-bold text-success">{{ totalQuantidadeDisponivel }}</p>
        </div>
      </div>
      <div class="card">
        <div class="card-body">
          <h3 class="text-sm font-medium text-secondary mb-1">Quantidade Total de Saída</h3>
          <p class="text-2xl font-bold text-warning">{{ totalQuantidadeSaida }}</p>
        </div>
      </div>
    </div>

    <!-- Tabela de Produtos -->
    <div class="table-container">
      <div class="table-responsive">
        <table class="table">
          <thead>
            <tr>
              <th>Código</th>
              <th>Descrição</th>
              <th>Tipo</th>
              <th>Valor Fornecedor</th>
              <th>Qtd. Disponível</th>
              <th>Qtd. de Saída</th>
              <th>Status Estoque</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="produto in produtosFiltrados" :key="produto.id">
              <td>{{ produto.codigo }}</td>
              <td>{{ produto.descricao }}</td>
              <td>
                <span class="badge" :class="getBadgeClassePorTipo(produto.tipo)">
                  {{ produto.tipo }}
                </span>
              </td>
              <td>R$ {{ produto.valorFornecedor.toFixed(2) }}</td>
              <td>
                <span :class="getClasseQuantidadeDisponivel(produto.quantidadeEstoque)">
                  {{ produto.quantidadeEstoque }}
                </span>
              </td>
              <td>{{ produto.quantidadeSaida || 0 }}</td>
              <td>
                <span class="badge" :class="getBadgeClasseStatus(produto.quantidadeEstoque)">
                  {{ getStatusEstoque(produto.quantidadeEstoque) }}
                </span>
              </td>
            </tr>
            <tr v-if="carregando">
              <td colspan="7" class="text-center py-8">
                <div class="flex items-center justify-center gap-2">
                  <svg class="animate-spin" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="12" y1="2" x2="12" y2="6"></line>
                    <line x1="12" y1="18" x2="12" y2="22"></line>
                    <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line>
                    <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line>
                    <line x1="2" y1="12" x2="6" y2="12"></line>
                    <line x1="18" y1="12" x2="22" y2="12"></line>
                    <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line>
                    <line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line>
                  </svg>
                  <span>Carregando dados...</span>
                </div>
              </td>
            </tr>
            <tr v-if="!carregando && produtosFiltrados.length === 0">
              <td colspan="7" class="text-center py-8 text-secondary">
                {{ tipoSelecionado ? `Nenhum produto encontrado para o tipo "${tipoSelecionado}"` : 'Nenhum produto encontrado' }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Estatísticas por Tipo -->
    <div v-if="estatisticasPorTipo.length > 0" class="mt-6">
      <h3 class="text-lg font-semibold mb-4">Estatísticas por Tipo</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div v-for="estatistica in estatisticasPorTipo" :key="estatistica.tipo" class="card">
          <div class="card-body">
            <div class="flex items-center justify-between mb-2">
              <h4 class="font-medium">{{ estatistica.tipo }}</h4>
              <span class="badge" :class="getBadgeClassePorTipo(estatistica.tipo)">
                {{ estatistica.quantidade }} produtos
              </span>
            </div>
            <div class="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span class="text-secondary">Disponível:</span>
                <span class="font-medium text-success ml-1">{{ estatistica.totalDisponivel }}</span>
              </div>
              <div>
                <span class="text-secondary">Saída:</span>
                <span class="font-medium text-warning ml-1">{{ estatistica.totalSaida }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { produtoService } from '@/services/api'

export type TipoProduto = 'ELETRONICO' | 'ELETRODOMESTICO' | 'MOVEL'

interface Produto {
  id: number;
  codigo: string;
  descricao: string;
  tipo: TipoProduto;
  valorFornecedor: number;
  quantidadeEstoque: number;
  quantidadeSaida?: number;
}

interface EstatisticaPorTipo {
  tipo: TipoProduto;
  quantidade: number;
  totalDisponivel: number;
  totalSaida: number;
}

const produtos = ref<Produto[]>([])
const carregando = ref(false)
const tipoSelecionado = ref<'' | TipoProduto>('')

// Computed para tipos disponíveis
const tiposDisponiveis = computed(() => {
  const tipos: TipoProduto[] = ['ELETRONICO', 'ELETRODOMESTICO', 'MOVEL']
  return tipos
})

// Computed para produtos filtrados
const produtosFiltrados = computed(() => {
  if (!tipoSelecionado.value) {
    return produtos.value
  }
  return produtos.value.filter(produto => produto.tipo === tipoSelecionado.value)
})

// Computed para totais
const totalQuantidadeDisponivel = computed(() => {
  return produtosFiltrados.value.reduce((total, produto) => total + produto.quantidadeEstoque, 0)
})

const totalQuantidadeSaida = computed(() => {
  return produtosFiltrados.value.reduce((total, produto) => total + (produto.quantidadeSaida || 0), 0)
})

// Computed para estatísticas por tipo
const estatisticasPorTipo = computed(() => {
  const tipos = tiposDisponiveis.value
  return tipos.map(tipo => {
    const produtosTipo = produtos.value.filter(p => p.tipo === tipo)
    return {
      tipo,
      quantidade: produtosTipo.length,
      totalDisponivel: produtosTipo.reduce((total, p) => total + p.quantidadeEstoque, 0),
      totalSaida: produtosTipo.reduce((total, p) => total + (p.quantidadeSaida || 0), 0)
    }
  }).sort((a, b) => b.quantidade - a.quantidade)
})

// Função para carregar dados
const carregarDados = async () => {
  try {
    carregando.value = true
    
    // Busca todos os produtos
    const responseProdutos = await produtoService.listarTodos()
    const produtosBase = responseProdutos.data
    
    // Para cada produto, tenta buscar dados de saída (se disponível)
    const produtosComSaida = await Promise.all(
      produtosBase.map(async (produto) => {
        try {
          // Tenta consultar dados de lucro/saída do produto
          const responseLucro = await produtoService.consultarLucro(produto.id)
          const dadosLucro = responseLucro.data
          
          return {
            ...produto,
            quantidadeSaida: dadosLucro.quantidadeSaida || 0
          }
        } catch (error) {
          // Em caso de erro, assume quantidade de saída como 0
          return {
            ...produto,
            quantidadeSaida: 0
          }
        }
      })
    )
    
    produtos.value = produtosComSaida
    
  } catch (error) {
    console.error('Erro ao carregar dados:', error)
    produtos.value = []
  } finally {
    carregando.value = false
  }
}

// Função para filtrar por tipo
const filtrarPorTipo = () => {
  console.log('Filtro aplicado para tipo:', tipoSelecionado.value)
  // O filtro é aplicado automaticamente pelo computed produtosFiltrados
}

// Função para atualizar dados - removida

// Funções auxiliares para classes CSS
const getBadgeClassePorTipo = (tipo: TipoProduto) => {
  const classes = {
    'ELETRONICO': 'badge-primary',
    'ELETRODOMESTICO': 'badge-secondary',
    'MOVEL': 'badge-info'
  }
  return classes[tipo] || 'badge-default'
}

const getClasseQuantidadeDisponivel = (quantidade: number) => {
  if (quantidade === 0) return 'text-danger font-bold'
  if (quantidade <= 5) return 'text-warning font-medium'
  return 'text-success'
}

const getBadgeClasseStatus = (quantidade: number) => {
  if (quantidade === 0) return 'badge-danger'
  if (quantidade <= 5) return 'badge-warning'
  return 'badge-success'
}

const getStatusEstoque = (quantidade: number) => {
  if (quantidade === 0) return 'Sem Estoque'
  if (quantidade <= 5) return 'Estoque Baixo'
  return 'Disponível'
}

onMounted(() => {
  carregarDados()
})
</script>

<style scoped>
.card {
  background-color: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.card-body {
  padding: 1.5rem;
}

.badge {
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.75rem;
  font-size: 0.875rem;
  font-weight: 500;
  border-radius: 9999px;
  text-transform: uppercase;
  letter-spacing: 0.025em;
}

.badge-primary {
  background-color: #dbeafe;
  color: #1e40af;
}

.badge-secondary {
  background-color: #f3f4f6;
  color: #374151;
}

.badge-info {
  background-color: #cffafe;
  color: #0891b2;
}

.badge-warning {
  background-color: #fef3c7;
  color: #d97706;
}

.badge-success {
  background-color: #dcfce7;
  color: #16a34a;
}

.badge-danger {
  background-color: #fee2e2;
  color: #dc2626;
}

.badge-default {
  background-color: #f9fafb;
  color: #6b7280;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.form-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
}

.form-select {
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  background-color: white;
  font-size: 0.875rem;
  min-width: 200px;
}

.form-select:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.grid {
  display: grid;
  gap: 1rem;
}

.grid-cols-1 {
  grid-template-columns: repeat(1, minmax(0, 1fr));
}

.grid-cols-2 {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.grid-cols-3 {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

@media (min-width: 768px) {
  .md\:grid-cols-2 {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  
  .md\:grid-cols-3 {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

@media (min-width: 1024px) {
  .lg\:grid-cols-3 {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>