import { defineStore } from 'pinia';
import { movimentoService } from '@/services/api';
import type { MovimentoEstoque } from '@/types';

export const useMovimentoStore = defineStore('movimento', {
  state: () => ({
    movimentos: [] as MovimentoEstoque[],
    movimentoSelecionado: null as MovimentoEstoque | null,
    carregando: false,
    erro: null as string | null
  }),

  actions: {
    async carregarMovimentos() {
      this.carregando = true;
      try {
        const { data } = await movimentoService.listarTodos();
        this.movimentos = data;
        this.erro = null;
      } catch (error) {
        this.erro = 'Erro ao carregar movimentos';
        console.error(error);
      } finally {
        this.carregando = false;
      }
    },

    async buscarPorId(id: number) {
      this.carregando = true;
      try {
        const { data } = await movimentoService.buscarPorId(id);
        this.movimentoSelecionado = data;
        this.erro = null;
      } catch (error) {
        this.erro = 'Erro ao buscar movimento';
        console.error(error);
      } finally {
        this.carregando = false;
      }
    },

    async criarMovimento(movimento: Omit<MovimentoEstoque, 'id'>) {
      this.carregando = true;
      try {
        const { data } = await movimentoService.criar(movimento);
        this.movimentos.push(data);
        this.erro = null;
        return data;
      } catch (error) {
        this.erro = 'Erro ao criar movimento';
        console.error(error);
        throw error;
      } finally {
        this.carregando = false;
      }
    },

    async listarPorProduto(produtoId: number) {
      this.carregando = true;
      try {
        const { data } = await movimentoService.listarPorProduto(produtoId);
        this.movimentos = data;
        this.erro = null;
      } catch (error) {
        this.erro = 'Erro ao listar movimentos do produto';
        console.error(error);
      } finally {
        this.carregando = false;
      }
    }
  }
}); 