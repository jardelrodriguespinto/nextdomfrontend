<template>
  <form @submit.prevent="salvar" class="form-container">
    <div class="form-group">
      <label for="produto" class="form-label">Produto</label>
      <select
        id="produto"
        v-model="form.produto"
        class="form-input"
        required
      >
        <option value="">Selecione um produto</option>
        <option v-for="produto in produtos" :key="produto.id" :value="produto">
          {{ produto.descricao }} (Estoque: {{ produto.quantidadeEstoque }})
        </option>
      </select>
    </div>

    <div class="form-group">
      <label for="tipo" class="form-label">Tipo de Movimentação</label>
      <select
        id="tipo"
        v-model="form.tipo"
        class="form-input"
        required
      >
        <option value="">Selecione o tipo</option>
        <option value="ENTRADA">Entrada</option>
        <option value="SAIDA">Saída</option>
      </select>
    </div>

    <div class="form-group">
      <label for="valorVenda" class="form-label">Valor de Venda</label>
      <div class="input-with-prefix">
        <span class="input-prefix">R$</span>
        <input
          type="number"
          id="valorVenda"
          v-model.number="form.valorVenda"
          class="form-input"
          required
          min="0"
          step="0.01"
        />
      </div>
    </div>

    <div class="form-group">
      <label for="quantidade" class="form-label">Quantidade</label>
      <input
        type="number"
        id="quantidade"
        v-model.number="form.quantidade"
        class="form-input"
        required
        min="1"
        :max="form.tipo === 'SAIDA' ? form.produto?.quantidadeEstoque : undefined"
      />
      <p v-if="erroQuantidade" class="error-message">
        {{ erroQuantidade }}
      </p>
    </div>

    <div class="form-group">
      <label for="dataMovimentacao" class="form-label">Data</label>
      <input
        type="date"
        id="dataMovimentacao"
        v-model="form.dataMovimentacao"
        class="form-input"
        required
      />
    </div>

    <div class="form-actions">
      <button
        type="button"
        class="btn btn-secondary"
        @click="$emit('cancelar')"
        :disabled="carregando"
      >
        Cancelar
      </button>
      <button
        type="submit"
        class="btn btn-primary"
        :disabled="carregando || !!erroQuantidade"
      >
        {{ carregando ? 'Salvando...' : 'Salvar' }}
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import type { Produto, TipoMovimentacao } from '@/types';

const props = defineProps<{
  produtos: Produto[];
  carregando?: boolean;
}>();

const emit = defineEmits<{
  (e: 'salvar', movimento: { produtoId: number, tipo: TipoMovimentacao, quantidade: number, valorVenda: number, dataMovimentacao?: string }): void;
  (e: 'cancelar'): void;
}>();

const form = ref({
  produto: null as Produto | null,
  tipo: '' as TipoMovimentacao | '',
  valorVenda: 0,
  quantidade: 1,
  dataMovimentacao: new Date().toISOString().split('T')[0]
});

const erroQuantidade = computed(() => {
  if (!form.value.produto) return null;
  
  if (form.value.tipo === 'SAIDA' && 
      form.value.quantidade > form.value.produto.quantidadeEstoque) {
    return `Quantidade indisponível. Estoque atual: ${form.value.produto.quantidadeEstoque}`;
  }
  
  return null;
});

const salvar = () => {
  if (!form.value.produto || !form.value.tipo) return;
  
  emit('salvar', {
    produtoId: form.value.produto.id!,
    tipo: form.value.tipo as TipoMovimentacao,
    quantidade: form.value.quantidade,
    valorVenda: form.value.valorVenda,
    dataMovimentacao: `${form.value.dataMovimentacao}T00:00:00.000Z`
  });
};
</script>

<style scoped>
.form-container {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  padding: 1rem;
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
}

.form-input {
  padding: 0.625rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  transition: all 0.2s;
  width: 100%;
}

.form-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.input-with-prefix {
  position: relative;
  display: flex;
  align-items: center;
}

.input-prefix {
  position: absolute;
  left: 0.625rem;
  color: #6b7280;
  font-size: 0.875rem;
}

.input-with-prefix .form-input {
  padding-left: 2rem;
}

.error-message {
  color: #dc2626;
  font-size: 0.75rem;
  margin-top: 0.25rem;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 1rem;
}

.btn {
  padding: 0.625rem 1rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.2s;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.btn-primary {
  background-color: #3b82f6;
  color: white;
  border: none;
}

.btn-primary:hover:not(:disabled) {
  background-color: #2563eb;
}

.btn-secondary {
  background-color: #f3f4f6;
  color: #374151;
  border: 1px solid #d1d5db;
}

.btn-secondary:hover:not(:disabled) {
  background-color: #e5e7eb;
}

select.form-input {
  appearance: none;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
  background-position: right 0.5rem center;
  background-repeat: no-repeat;
  background-size: 1.5em 1.5em;
  padding-right: 2.5rem;
}

input[type="date"].form-input {
  appearance: none;
  padding-right: 0.625rem;
}

input[type="number"].form-input {
  -moz-appearance: textfield;
}

input[type="number"].form-input::-webkit-outer-spin-button,
input[type="number"].form-input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
</style>