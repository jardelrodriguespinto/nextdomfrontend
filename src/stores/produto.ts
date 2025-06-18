import { defineStore } from 'pinia';
import { produtoService } from '@/services/api';
import type { Produto } from '@/types';

export const useProdutoStore = defineStore('produto', {
  state: () => ({
    produtos: [] as Produto[],
    produtoSelecionado: null as Produto | null,
    carregando: false,
    erro: null as string | null
  }),

  actions: {
    async carregarProdutos() {
      this.carregando = true;
      try {
        const { data } = await produtoService.listarTodos();
        this.produtos = data;
        this.erro = null;
      } catch (error) {
        this.erro = 'Erro ao carregar produtos';
        console.error(error);
      } finally {
        this.carregando = false;
      }
    },

    async buscarPorId(id: number) {
      this.carregando = true;
      try {
        const { data } = await produtoService.buscarPorId(id);
        this.produtoSelecionado = data;
        this.erro = null;
      } catch (error) {
        this.erro = 'Erro ao buscar produto';
        console.error(error);
      } finally {
        this.carregando = false;
      }
    },

    async criarProduto(produto: Omit<Produto, 'id'>) {
      this.carregando = true;
      try {
        const { data } = await produtoService.criar(produto);
        if (typeof data.id === 'number') {
          this.produtos.push(data as Produto);
        } else {
          throw new Error('Produto criado sem id definido');
        }
        this.erro = null;
        return data;
      } catch (error) {
        this.erro = 'Erro ao criar produto';
        console.error(error);
        throw error;
      } finally {
        this.carregando = false;
      }
    },

    async atualizarProduto(id: number, produto: Omit<Produto, 'id'>) {
      this.carregando = true;
      try {
        const { data } = await produtoService.atualizar(id, produto);
        const index = this.produtos.findIndex(p => p.id === id);
        if (index !== -1) {
          if (typeof data.id === 'number') {
            this.produtos[index] = data as Produto;
          } else {
            throw new Error('Produto atualizado sem id definido');
          }
        }
        this.erro = null;
        return data;
      } catch (error) {
        this.erro = 'Erro ao atualizar produto';
        console.error(error);
        throw error;
      } finally {
        this.carregando = false;
      }
    },

    async deletarProduto(id: number) {
      this.carregando = true;
      try {
        await produtoService.remover(id);
        this.produtos = this.produtos.filter(p => p.id !== id);
        this.erro = null;
      } catch (error) {
        this.erro = 'Erro ao deletar produto';
        console.error(error);
        throw error;
      } finally {
        this.carregando = false;
      }
    }
  }
}); 