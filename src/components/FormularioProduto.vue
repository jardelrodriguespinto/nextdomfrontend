<template>
  <form @submit.prevent="salvar" class="form-container">
    <div v-if="erro" class="error-message">
      {{ erro }}
    </div>

    <div class="form-group">
      <label for="codigo" class="form-label">Código</label>
      <input
        type="text"
        id="codigo"
        v-model="form.codigo"
        class="form-input"
        :class="{ 'error': erro && !form.codigo.trim() }"
        required
        placeholder="Digite o código do produto"
      />
    </div>

    <div class="form-group">
      <label for="descricao" class="form-label">Descrição</label>
      <input
        type="text"
        id="descricao"
        v-model="form.descricao"
        class="form-input"
        :class="{ 'error': erro && !form.descricao.trim() }"
        required
        placeholder="Digite a descrição do produto"
      />
    </div>

    <div class="form-group">
      <label for="tipo" class="form-label">Tipo de Produto</label>
      <select
        id="tipo"
        v-model="form.tipo"
        class="form-input"
        required
      >
        <option value="">Selecione um tipo</option>
        <option value="ELETRONICO">Eletrônico</option>
        <option value="ELETRODOMESTICO">Eletrodoméstico</option>
        <option value="MOVEL">Móvel</option>
      </select>
    </div>

    <div class="form-group">
      <label for="valorFornecedor" class="form-label">Valor do Fornecedor</label>
      <input
        type="text"
        id="valorFornecedor"
        v-model="valorFornecedorFormatado"
        @blur="aplicarFormatoAoSair"
        @focus="removerFormatoAoFocar"
        class="form-input"
        :class="{ 'error': erro && (form.valorFornecedor <= 0 && !valorFornecedorInputEstaFocado) }"
        required
        placeholder="R$ 0,00"
        inputmode="decimal"
      />
    </div>

    <div class="form-group">
      <label for="quantidadeEstoque" class="form-label">Quantidade em Estoque</label>
      <input
        type="number"
        id="quantidadeEstoque"
        v-model.number="form.quantidadeEstoque"
        class="form-input"
        :class="{ 'error': erro && form.quantidadeEstoque < 0 }"
        required
        min="0"
        step="1"
        placeholder="0"
      />
    </div>

    <div class="form-actions">
      <button type="button" class="btn btn-secondary" @click="$emit('cancelar')" :disabled="loading">
        Cancelar
      </button>
      <button type="submit" class="btn btn-primary" :disabled="loading">
        {{ loading ? 'Salvando...' : 'Salvar' }}
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'; // Adicione 'computed' aqui
import { produtoService, type ProdutoDto, type CriarProdutoDto } from '@/services/api';

const props = defineProps<{
  produto?: ProdutoDto;
  carregando?: boolean;
}>();

const emit = defineEmits<{
  (e: 'salvar', produto: CriarProdutoDto): void;
  (e: 'cancelar'): void;
  (e: 'erro', mensagem: string): void;
  (e: 'sucesso', produto: ProdutoDto): void;
}>();

const form = ref<CriarProdutoDto>({
  codigo: '',
  descricao: '',
  tipo: 'ELETRONICO',
  valorFornecedor: 0, // Continuamos com o número no modelo
  quantidadeEstoque: 0
});

const loading = ref(false);
const erro = ref<string | null>(null);

// --- Lógica para a Máscara de Moeda ---
const valorFornecedorInputEstaFocado = ref(false); // Novo estado para controlar o foco

// Função para formatar o número para moeda (R$ 1.234,56)
const formatarMoeda = (valor: number | null): string => {
  if (valor === null || isNaN(valor)) {
    return '0,00'; // Valor padrão para exibição
  }
  return valor.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

// Função para limpar o formato da moeda para um número (1234.56)
const limparFormatoMoeda = (texto: string): number => {
  if (!texto) return 0;
  // Remove R$, pontos de milhar e substitui vírgula decimal por ponto
  const valorNumerico = texto.replace(/[R$ ]/g, '').replace(/\./g, '').replace(',', '.');
  return parseFloat(valorNumerico) || 0;
};

// Propriedade computada para exibir o valor formatado no input
const valorFornecedorFormatado = computed({
  get() {
    // Exibe o valor sem máscara quando focado, com máscara quando não focado
    if (valorFornecedorInputEstaFocado.value) {
      // Retorna o valor numérico como string (ex: "123.45")
      return form.value.valorFornecedor.toString().replace('.', ',');
    }
    // Retorna o valor formatado como moeda (ex: "R$ 123,45")
    return `R$ ${formatarMoeda(form.value.valorFornecedor)}`;
  },
  set(newValue: string) {
    // Quando o usuário digita, limpamos o formato e atualizamos o v-model
    form.value.valorFornecedor = limparFormatoMoeda(newValue);
  }
});

const removerFormatoAoFocar = () => {
  valorFornecedorInputEstaFocado.value = true;
};

const aplicarFormatoAoSair = () => {
  valorFornecedorInputEstaFocado.value = false;
  // Garante que o valor no form.value.valorFornecedor tenha duas casas decimais
  // e é um número válido antes de ser exibido formatado.
  if (isNaN(form.value.valorFornecedor)) {
    form.value.valorFornecedor = 0;
  }
  form.value.valorFornecedor = parseFloat(form.value.valorFornecedor.toFixed(2));
};

// --- Fim da Lógica para a Máscara de Moeda ---

// Watchers para limpar erros quando o usuário corrigir
watch(() => form.value.codigo, () => {
  if (erro.value && form.value.codigo.trim()) {
    erro.value = null;
  }
});

watch(() => form.value.descricao, () => {
  if (erro.value && form.value.descricao.trim()) {
    erro.value = null;
  }
});

// A validação de erro para valorFornecedor agora considera o estado de foco
watch(() => form.value.valorFornecedor, () => {
  if (erro.value && form.value.valorFornecedor > 0 && !valorFornecedorInputEstaFocado.value) {
    erro.value = null;
  }
});

watch(() => form.value.quantidadeEstoque, () => {
  if (erro.value && form.value.quantidadeEstoque >= 0) {
    erro.value = null;
  }
});

onMounted(() => {
  if (props.produto) {
    form.value = {
      codigo: props.produto.codigo,
      descricao: props.produto.descricao,
      tipo: props.produto.tipo,
      valorFornecedor: props.produto.valorFornecedor,
      quantidadeEstoque: props.produto.quantidadeEstoque
    };
  }
});

const validarFormulario = (): boolean => {
  if (!form.value.codigo.trim()) {
    erro.value = 'O código é obrigatório';
    return false;
  }
  if (!form.value.descricao.trim()) {
    erro.value = 'A descrição é obrigatória';
    return false;
  }
  if (!form.value.tipo || !['ELETRONICO', 'ELETRODOMESTICO', 'MOVEL'].includes(form.value.tipo)) {
    erro.value = 'Selecione um tipo de produto válido';
    return false;
  }
  // A validação do valor do fornecedor permanece a mesma, pois form.value.valorFornecedor é um número
  if (!form.value.valorFornecedor || form.value.valorFornecedor <= 0) {
    erro.value = 'O valor do fornecedor deve ser maior que zero';
    return false;
  }
  if (form.value.quantidadeEstoque < 0) {
    erro.value = 'A quantidade em estoque não pode ser negativa';
    return false;
  }
  return true;
};

const salvar = async () => {
  try {
    loading.value = true;
    erro.value = null;

    if (!validarFormulario()) {
      return;
    }

    const dadosParaEnvio: CriarProdutoDto = {
      codigo: form.value.codigo.trim(),
      descricao: form.value.descricao.trim(),
      tipo: form.value.tipo,
      // O valorFornecedor já está como número graças à lógica da máscara
      valorFornecedor: form.value.valorFornecedor,
      quantidadeEstoque: Number(form.value.quantidadeEstoque)
    };

    let resultado;
    
    if (props.produto?.id) {
      resultado = await produtoService.atualizar(props.produto.id, dadosParaEnvio);
    } else {
      resultado = await produtoService.criar(dadosParaEnvio);
    }

    emit('salvar', dadosParaEnvio);
    emit('sucesso', resultado.data);

  } catch (error) {
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as any;
      
      if (axiosError.response?.status === 400) {
        const mensagemErro = axiosError.response?.data?.message || 
                           axiosError.response?.data?.error || 
                           'Dados inválidos fornecidos';
        erro.value = mensagemErro;
        console.error('🚫 Erro de validação do backend:', axiosError.response.data);
      } else if (axiosError.response?.status === 409) {
        erro.value = 'Produto já cadastrado com este código';
      } else if (axiosError.response?.status === 500) {
        erro.value = 'Erro interno do servidor. Tente novamente mais tarde.';
      } else {
        erro.value = `Erro HTTP ${axiosError.response?.status}: ${axiosError.response?.statusText || 'Erro desconhecido'}`;
      }
    } else if (error instanceof Error) {
      erro.value = error.message;
    } else {
      erro.value = 'Erro inesperado ao salvar produto';
    }
  } finally {
    loading.value = false;
  }
};

const limparFormulario = () => {
  form.value = {
    codigo: '',
    descricao: '',
    tipo: 'ELETRONICO',
    valorFornecedor: 0,
    quantidadeEstoque: 0
  };
  erro.value = null;
};

defineExpose({
  limparFormulario
});
</script>

<style scoped>
/* Seu CSS existente permanece o mesmo */
.form-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 500px;
  margin: 0 auto;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.25rem;
}

.form-input {
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
  font-size: 0.875rem;
}

.form-input:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  outline: none;
}

.form-input.error {
  border-color: #ef4444;
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}

.form-input::placeholder {
  color: #9ca3af;
}

select.form-input {
  cursor: pointer;
}

select.form-input option {
  padding: 0.5rem;
}

.error-message {
  padding: 0.75rem;
  background-color: #fee2e2;
  border: 1px solid #fecaca;
  border-radius: 0.375rem;
  color: #dc2626;
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid #e5e7eb;
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 0.375rem;
  font-weight: 500;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.15s ease-in-out;
  min-width: 100px;
}

.btn-primary {
  background-color: #3b82f6;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background-color: #2563eb;
  transform: translateY(-1px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.btn-secondary {
  background-color: #f9fafb;
  color: #374151;
  border: 1px solid #d1d5db;
}

.btn-secondary:hover:not(:disabled) {
  background-color: #f3f4f6;
  border-color: #9ca3af;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none !important;
  box-shadow: none !important;
}

.btn:active:not(:disabled) {
  transform: translateY(0);
}

/* Responsividade */
@media (max-width: 640px) {
  .form-container {
    max-width: 100%;
    padding: 0 1rem;
  }
  
  .form-actions {
    flex-direction: column;
  }
  
  .btn {
    width: 100%;
  }
}
</style>