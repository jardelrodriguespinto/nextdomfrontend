<template>
  <div>
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-xl font-semibold">Movimentações de Estoque</h2>
      <button class="btn btn-primary" @click="abrirModalNovaMovimentacao">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
        Nova Movimentação
      </button>
    </div>

    <div class="table-container">
      <div class="table-responsive">
        <table class="table">
          <thead>
            <tr>
              <th>Data</th>
              <th>Produto</th>
              <th>Tipo</th>
              <th>Quantidade</th>
              <th>Valor Unitário</th>
              <th>Valor Total</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="movimento in movimentos" :key="movimento.id">
              <td>{{ formatarData(movimento.dataMovimentacao) }}</td>
              <td>{{ movimento.produto?.descricao || 'N/A' }}</td>
              <td>
                <span :class="movimento.tipo === 'ENTRADA' ? 'text-success' : 'text-danger'">
                  {{ movimento.tipo }}
                </span>
              </td>
              <td>{{ movimento.quantidade }}</td>
              <td>R$ {{ formatarValor(movimento.valorVenda) }}</td>
              <td>R$ {{ formatarValor(movimento.quantidade * movimento.valorVenda) }}</td>
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
            <tr v-if="!loading && movimentos.length === 0">
              <td colspan="6" class="text-center py-8 text-secondary">
                Nenhuma movimentação encontrada
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-if="mostrarSucesso" class="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-md shadow-lg z-50">
      <div class="flex items-center">
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
        </svg>
        Movimentação salva com sucesso!
      </div>
    </div>

    <div v-if="mostrarErro" class="fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-md shadow-lg z-50">
      <div class="flex items-center">
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
        {{ mensagemErro }}
      </div>
    </div>

    <BaseModal
      v-model="mostrarModal"
      :title="'Nova Movimentação'"
    >
      <FormularioMovimento
        :produtos="produtos"
        :carregando="salvando"
        @salvar="salvarMovimento"
        @cancelar="fecharModal"
      />
    </BaseModal>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { movimentoService, produtoService } from '@/services/api'
import type { MovimentoEstoque, Produto, TipoMovimentacao } from '@/types'
import BaseModal from '@/components/BaseModal.vue'
import FormularioMovimento from '@/components/FormularioMovimento.vue'

const movimentos = ref<MovimentoEstoque[]>([])
const produtos = ref<Produto[]>([])
const loading = ref(true)
const mostrarModal = ref(false)
const salvando = ref(false)
const mostrarSucesso = ref(false)
const mostrarErro = ref(false)
const mensagemErro = ref('')

const carregarMovimentos = async () => {
  try {
    loading.value = true
    const response = await movimentoService.listarTodos()
    movimentos.value = response.data
  } catch (error) {
    console.error('Erro ao carregar movimentações:', error)
    exibirErro('Erro ao carregar movimentações')
  } finally {
    loading.value = false
  }
}

const carregarProdutos = async () => {
  try {
    const response = await produtoService.listarTodos()
    produtos.value = response.data
  } catch (error) {
    console.error('Erro ao carregar produtos:', error)
    exibirErro('Erro ao carregar produtos')
  }
}

const abrirModalNovaMovimentacao = () => {
  mostrarModal.value = true
}

const fecharModal = () => {
  mostrarModal.value = false
}

const salvarMovimento = async (movimento: { produtoId: number, tipo: TipoMovimentacao, quantidade: number, valorVenda: number, dataMovimentacao?: string }) => {
  try {
    salvando.value = true
    
    // Validar dados no frontend antes do envio
    if (!movimento.produtoId || movimento.produtoId <= 0) {
      throw new Error('Produto é obrigatório')
    }
    
    if (!movimento.tipo || !['ENTRADA', 'SAIDA'].includes(movimento.tipo)) {
      throw new Error('Tipo de movimentação é obrigatório')
    }
    
    if (!movimento.quantidade || movimento.quantidade < 1) {
      throw new Error('Quantidade movimentada é obrigatória e deve ser no mínimo 1')
    }
    
    if (movimento.valorVenda === undefined || movimento.valorVenda === null || movimento.valorVenda < 0) {
      throw new Error('Valor de venda não pode ser negativo')
    }

    const movimentoFormatado: Omit<MovimentoEstoque, 'id'> = {
      produtoId: Number(movimento.produtoId),
      tipo: movimento.tipo,
      quantidade: Number(movimento.quantidade),
      valorVenda: Number(movimento.valorVenda),
      dataMovimentacao: movimento.dataMovimentacao || new Date().toISOString()
    }

    console.log('Dados sendo enviados:', movimentoFormatado)
    
    await movimentoService.criar(movimentoFormatado)
    await carregarMovimentos()
    fecharModal()
    exibirSucesso()
  } catch (error: any) {
    console.error('Erro ao salvar movimentação:', error)
    
    let mensagem = 'Erro ao salvar movimentação'
    
    // Se o erro vem da validação local
    if (error.message && !error.response) {
      mensagem = error.message
    }
    // Se o erro vem do backend
    else if (error.response?.data?.message) {
      mensagem = error.response.data.message
    } else if (error.response?.data?.errors) {
      const erros = Object.values(error.response.data.errors).join(', ')
      mensagem = `Erro de validação: ${erros}`
    } else if (error.response?.status === 400) {
      mensagem = 'Dados inválidos. Verifique se todos os campos estão preenchidos corretamente.'
    }
    
    exibirErro(mensagem)
  } finally {
    salvando.value = false
  }
}

const formatarData = (data: string | number[] | Date) => {
  if (!data) return 'N/A';

  let dateObject: Date;

  if (Array.isArray(data)) {
    dateObject = new Date(
      data[0],
      data[1] - 1,
      data[2],
      data[3],
      data[4],
      data[5],
      data[6] / 1_000_000
    );
  } else {
    dateObject = new Date(data);
  }

  if (isNaN(dateObject.getTime())) {
    return 'N/A';
  }

  return dateObject.toLocaleDateString('pt-BR');
};

const formatarValor = (valor: number) => {
  if (valor === null || valor === undefined) return '0,00'
  return Number(valor).toFixed(2).replace('.', ',')
}

const exibirSucesso = () => {
  mostrarSucesso.value = true
  setTimeout(() => {
    mostrarSucesso.value = false
  }, 3000)
}

const exibirErro = (mensagem: string) => {
  mensagemErro.value = mensagem
  mostrarErro.value = true
  setTimeout(() => {
    mostrarErro.value = false
    mensagemErro.value = ''
  }, 5000)
}

onMounted(() => {
  carregarMovimentos()
  carregarProdutos()
})
</script>