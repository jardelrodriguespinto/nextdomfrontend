<template>
  <div>
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-xl font-semibold">Lista de Produtos</h2>
      <button class="btn btn-primary" @click="abrirModalNovo">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
        Novo Produto
      </button>
    </div>

    <div class="table-container">
      <div class="table-responsive">
        <table class="table">
          <thead>
            <tr>
              <th>Código</th>
              <th>Descrição</th>
              <th>Tipo</th>
              <th>Valor Fornecedor</th>
              <th>Estoque</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="produto in produtos" :key="produto.id">
              <td>{{ produto.codigo }}</td>
              <td>{{ produto.descricao }}</td>
              <td>{{ produto.tipo }}</td>
              <td>R$ {{ produto.valorFornecedor.toFixed(2) }}</td>
              <td>{{ produto.quantidadeEstoque }}</td>
              <td>
                <div class="table-actions">
                  <button class="btn btn-icon btn-secondary" title="Editar" @click="abrirModalEditar(produto)">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                    </svg>
                  </button>
                  <button class="btn btn-icon btn-danger" title="Excluir" @click="abrirModalConfirmacao(produto)">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <polyline points="3 6 5 6 21 6"></polyline>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="loading">
              <td colspan="6" class="text-center py-8">
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
                  <span>Carregando...</span>
                </div>
              </td>
            </tr>
            <tr v-if="!loading && produtos.length === 0">
              <td colspan="6" class="text-center py-8 text-secondary">
                Nenhum produto encontrado
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal de Formulário -->
    <div v-if="modalAberto" class="modal-overlay">
      <div class="modal-content">
        <button class="modal-close" @click="fecharModal">&times;</button>
        <FormularioProduto 
          :produtos="produtos" 
          :produto="produtoEditando" 
          :carregando="salvandoProduto"
          @salvar="onSalvar" 
          @cancelar="fecharModal" 
        />
      </div>
    </div>

    <!-- Modal de Confirmação de Exclusão -->
    <div v-if="modalConfirmacaoAberto" class="modal-overlay">
      <div class="modal-content">
        <h3 class="text-lg font-semibold mb-4">Confirmar Exclusão</h3>
        <p>Tem certeza que deseja remover o produto "{{ produtoParaExcluir?.descricao }}"?</p>
        <div class="modal-actions">
          <button class="btn btn-secondary" @click="fecharModalConfirmacao">Cancelar</button>
          <button class="btn btn-danger" @click="confirmarExclusao">Excluir</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { produtoService } from '@/services/api'
import type { Produto, TipoProduto } from '@/types'
import type { CriarProdutoDto, ProdutoDto } from '@/services/api'
import FormularioProduto from '@/components/FormularioProduto.vue'

// Estados reativos
const produtos = ref<Produto[]>([])
const loading = ref(true)
const salvandoProduto = ref(false)
const modalAberto = ref(false)
const produtoEditando = ref<ProdutoDto | undefined>(undefined)
const modalConfirmacaoAberto = ref(false)
const produtoParaExcluir = ref<Produto | null>(null)

// Função para converter Produto para ProdutoDto
const produtoParaProdutoDto = (produto: Produto): ProdutoDto => {
  return {
    id: produto.id,
    codigo: produto.codigo,
    descricao: produto.descricao,
    tipo: produto.tipo as TipoProduto,
    valorFornecedor: produto.valorFornecedor,
    quantidadeEstoque: produto.quantidadeEstoque
  }
}

// Função para converter ProdutoDto para Produto (se necessário)
const produtoDtoParaProduto = (produtoDto: ProdutoDto): Produto => {
  return {
    id: produtoDto.id!,
    codigo: produtoDto.codigo,
    descricao: produtoDto.descricao,
    tipo: produtoDto.tipo,
    valorFornecedor: produtoDto.valorFornecedor,
    quantidadeEstoque: produtoDto.quantidadeEstoque
  }
}

// Função para carregar produtos seguindo padrão da API
const carregarProdutos = async () => {
  try {
    loading.value = true
    
    const response = await produtoService.listarTodos()
  
    produtos.value = response.data
      
  } catch (error) {
    produtos.value = []
  } finally {
    loading.value = false
  }
}

// Função para abrir modal de novo produto
const abrirModalNovo = () => {
  produtoEditando.value = undefined
  modalAberto.value = true
}

// Função para abrir modal de edição
const abrirModalEditar = (produto: Produto) => {
  produtoEditando.value = produtoParaProdutoDto(produto)
  modalAberto.value = true
}

// Função para fechar modal
const fecharModal = () => {
  modalAberto.value = false
  produtoEditando.value = undefined
}

// Função para salvar produto seguindo padrão da API
const onSalvar = async (dadosProduto: CriarProdutoDto) => {
  try {
    salvandoProduto.value = true
    
    fecharModal()
    await carregarProdutos()
    
  } catch (error) {
  } finally {
    salvandoProduto.value = false
  }
}

// Função para abrir modal de confirmação de exclusão
const abrirModalConfirmacao = (produto: Produto) => {
  produtoParaExcluir.value = produto
  modalConfirmacaoAberto.value = true
}

// Função para fechar modal de confirmação
const fecharModalConfirmacao = () => {
  modalConfirmacaoAberto.value = false
  produtoParaExcluir.value = null
}

// Função para confirmar exclusão seguindo padrão da API
const confirmarExclusao = async () => {
  if (!produtoParaExcluir.value) {
    return
  }
  
  try {
    
    await produtoService.remover(produtoParaExcluir.value.id)
    
    fecharModalConfirmacao()
    await carregarProdutos()
    
  } catch (error) {
  }
}

onMounted(() => carregarProdutos())
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
}

.modal-content {
  background-color: white;
  padding: 1.5rem;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  min-width: 350px;
  position: relative;
}

.modal-close {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  color: #6b7280;
  cursor: pointer;
  font-size: 1.5rem;
  line-height: 1;
  padding: 0.25rem;
  border-radius: 0.25rem;
  transition: background-color 0.15s ease-in-out, color 0.15s ease-in-out;
}

.modal-close:hover {
  background-color: #e5e7eb;
  color: #000;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  margin-top: 1rem;
}
</style>