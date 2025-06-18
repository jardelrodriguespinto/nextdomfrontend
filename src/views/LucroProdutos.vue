<template>
  <div>
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-xl font-semibold">Lucro por Produto</h2>
    </div>

    <div class="table-container">
      <div class="table-responsive">
        <table class="table">
          <thead>
            <tr>
              <th>Produto</th>
              <th>Tipo</th>
              <th>Valor de Compra</th>
              <th>Valor de Venda</th>
              <th>Quantidade Vendida</th>
              <th>Lucro Unitário</th>
              <th>Lucro Total</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="lucro in lucros" :key="lucro.produto.id">
              <td>{{ lucro.produto.descricao }}</td>
              <td>{{ lucro.produto.tipo }}</td>
              <td>R$ {{ lucro.valorCompraUnitario?.toFixed(2) || '0,00' }}</td>
              <td>R$ {{ lucro.valorVendaUnitario?.toFixed(2) || '0,00' }}</td>
              <td>{{ lucro.quantidadeSaida || 0 }}</td>
              <td :class="(lucro.lucroUnitario || 0) >= 0 ? 'text-success' : 'text-danger'">
                R$ {{ lucro.lucroUnitario?.toFixed(2) || '0,00' }}
              </td>
              <td :class="(lucro.lucroTotal || 0) >= 0 ? 'text-success' : 'text-danger'">
                R$ {{ lucro.lucroTotal?.toFixed(2) || '0,00' }}
              </td>
            </tr>
            <tr v-if="lucros.length === 0 && !carregando">
              <td colspan="7" class="text-center py-8 text-secondary">
                Nenhum dado de lucro encontrado
              </td>
            </tr>
            <tr v-if="carregando">
              <td colspan="7" class="text-center py-8 text-secondary">
                Carregando dados...
              </td>
            </tr>
          </tbody>
          <tfoot v-if="lucros.length > 0">
            <tr>
              <td colspan="6" class="text-right font-semibold">Lucro Total</td>
              <td :class="lucroTotal >= 0 ? 'text-success' : 'text-danger'">
                R$ {{ lucroTotal.toFixed(2) }}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { produtoService } from '@/services/api'

interface Produto {
  id: number;
  codigo: string;
  descricao: string;
  tipo: string;
  valorFornecedor: number;
  quantidadeEstoque: number;
}

interface LucroProdutoDto {
  produto: Produto;
  descricao: string;
  quantidadeSaida: number;
  valorCompraUnitario: number;
  valorVendaUnitario: number;
  lucroUnitario: number;
  lucroTotal: number;
}

const lucros = ref<LucroProdutoDto[]>([])
const carregando = ref(false)

const lucroTotal = computed(() => {
  return lucros.value.reduce((total, lucro) => total + (lucro.lucroTotal || 0), 0)
})

const carregarLucros = async () => {
  try {
    carregando.value = true
    
    // Primeiro, busca todos os produtos
    const responseProdutos = await produtoService.listarTodos()
    const produtos = responseProdutos.data
    
    // Para cada produto, consulta o lucro específico
    const lucrosPromises = produtos.map(async (produto) => {
      try {
        const responseLucro = await produtoService.consultarLucro(produto.id)
        const dadosLucro = responseLucro.data
        
        return {
          produto,
          descricao: dadosLucro.descricao || produto.descricao,
          quantidadeSaida: dadosLucro.quantidadeSaida || 0,
          valorCompraUnitario: dadosLucro.valorCompraUnitario || produto.valorFornecedor,
          valorVendaUnitario: dadosLucro.valorVendaUnitario || 0,
          lucroUnitario: dadosLucro.lucroUnitario || 0,
          lucroTotal: dadosLucro.lucroTotal || 0
        }
      } catch (error) {
        console.error(`Erro ao carregar lucro do produto ${produto.id}:`, error)
        // Em caso de erro, retorna dados zerados para o produto
        return {
          produto,
          descricao: produto.descricao,
          quantidadeSaida: 0,
          valorCompraUnitario: produto.valorFornecedor,
          valorVendaUnitario: 0,
          lucroUnitario: 0,
          lucroTotal: 0
        }
      }
    })
    
    // Aguarda todas as consultas de lucro
    lucros.value = await Promise.all(lucrosPromises)
    
  } catch (error) {
    console.error('Erro ao carregar produtos:', error)
    lucros.value = []
  } finally {
    carregando.value = false
  }
}

onMounted(() => {
  carregarLucros()
})
</script>