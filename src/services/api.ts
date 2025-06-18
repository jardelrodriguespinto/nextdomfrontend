// src/services/api.ts

import axios from 'axios';
import type { Produto, MovimentoEstoque, LucroProduto } from '@/types';

export interface ProdutoDto {
  id?: number;
  codigo: string;
  descricao: string;
  tipo: 'ELETRONICO' | 'ELETRODOMESTICO' | 'MOVEL';
  valorFornecedor: number;
  quantidadeEstoque: number;
}

export type CriarProdutoDto = Omit<ProdutoDto, 'id'>;

const api = axios.create({
  baseURL: import.meta.env.PROD ? 
    `${import.meta.env.VITE_API_URL ||
      'https://nexdom-backend-production.up.railway.app'}/api` : 
    '/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: false,
  timeout: 10000 
});
api.interceptors.request.use(
  config => {
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  response => {
    return response;
  },
  error => {    
    return Promise.reject(error);
  }
);

const validarProduto = (produto: CriarProdutoDto): boolean => {
  if (!produto) {
    return false;
  }
  
  const validacoes = [
    {
      campo: 'codigo',
      condicao: produto.codigo && produto.codigo.trim().length > 0,
      erro: 'Código é obrigatório'
    },
    {
      campo: 'descricao',
      condicao: produto.descricao && produto.descricao.trim().length > 0,
      erro: 'Descrição é obrigatória'
    },
    {
      campo: 'tipo',
      condicao: produto.tipo && ['ELETRONICO', 'ELETRODOMESTICO', 'MOVEL'].includes(produto.tipo),
      erro: 'Tipo do produto é obrigatório e deve ser ELETRONICO, ELETRODOMESTICO ou MOVEL'
    },
    {
      campo: 'valorFornecedor',
      condicao: produto.valorFornecedor !== undefined && produto.valorFornecedor !== null && produto.valorFornecedor > 0,
      erro: 'Valor do fornecedor é obrigatório e deve ser maior que zero'
    },
    {
      campo: 'quantidadeEstoque',
      condicao: produto.quantidadeEstoque !== undefined && produto.quantidadeEstoque !== null && produto.quantidadeEstoque >= 0,
      erro: 'Quantidade em estoque é obrigatória e não pode ser negativa'
    }
  ];
  
  for (const validacao of validacoes) {
    if (!validacao.condicao) {
      return false;
    }
  }
  
  return true;
};

const validarMovimento = (movimento: Omit<MovimentoEstoque, 'id'>): boolean => {
  if (!movimento) {
    return false;
  }
  
  const validacoes = [
    {
      campo: 'produtoId',
      condicao: movimento.produtoId !== undefined && movimento.produtoId !== null && movimento.produtoId > 0,
      erro: 'Produto é obrigatório'
    },
    {
      campo: 'tipo',
      condicao: movimento.tipo && ['ENTRADA', 'SAIDA'].includes(movimento.tipo),
      erro: 'Tipo de movimentação é obrigatório'
    },
    {
      campo: 'quantidade',
      condicao: movimento.quantidade !== undefined && movimento.quantidade !== null && movimento.quantidade >= 1,
      erro: 'Quantidade movimentada é obrigatória e deve ser no mínimo 1'
    },
    {
      campo: 'valorVenda',
      condicao: movimento.valorVenda !== undefined && movimento.valorVenda !== null && movimento.valorVenda >= 0,
      erro: 'Valor de venda não pode ser negativo'
    }
  ];
  
  for (const validacao of validacoes) {
    if (!validacao.condicao) {
      throw new Error(validacao.erro);
    }
  }
  
  return true;
};

export const produtoService = {
  listarTodos: async () => {
    try {
      const response = await api.get<Produto[]>('/produtos');
      return { data: response.data };
    } catch (error) {
      throw error;
    }
  },

  buscarPorId: async (id: number) => {
    try {
      const response = await api.get<Produto>(`/produtos/${id}`);
      return { data: response.data };
    } catch (error) {
      throw error;
    }
  },

  buscarPorTipo: async (tipo: string) => {
    try {
      const response = await api.get<Produto[]>(`/produtos/tipo/${tipo}`);
      return { data: response.data };
    } catch (error) {
      throw error;
    }
  },

  criar: async (produto: CriarProdutoDto) => {
    try {
      if (!validarProduto(produto)) {
        throw new Error('Dados do produto inválidos');
      }
      
      const produtoFormatado: CriarProdutoDto = {
        codigo: produto.codigo.trim(),
        descricao: produto.descricao.trim(),
        tipo: produto.tipo,
        valorFornecedor: Number(produto.valorFornecedor),
        quantidadeEstoque: Number(produto.quantidadeEstoque)
      };
      
      const response = await api.post<ProdutoDto>('/produtos', produtoFormatado);
      return { data: response.data };
    } catch (error) {     
      throw error;
    }
  },

  atualizar: async (id: number, produto: CriarProdutoDto) => {
    try {
      if (!validarProduto(produto)) {
        throw new Error('Dados do produto inválidos');
      }
      
      const produtoFormatado: CriarProdutoDto = {
        codigo: produto.codigo.trim(),
        descricao: produto.descricao.trim(),
        tipo: produto.tipo,
        valorFornecedor: Number(produto.valorFornecedor),
        quantidadeEstoque: Number(produto.quantidadeEstoque)
      };
      
      const response = await api.put<ProdutoDto>(`/produtos/${id}`, produtoFormatado);
      return { data: response.data };
    } catch (error) {
      throw error;
    }
  },

  remover: async (id: number) => {
    try {
      await api.delete(`/produtos/${id}`);
      return { data: null };
    } catch (error) {
      throw error;
    }
  },

  consultarLucro: async (id: number) => {
    try {
      const response = await api.get<LucroProduto>(`/produtos/${id}/lucro`);
      return { data: response.data };
    } catch (error) {
      throw error;
    }
  }
};

export const movimentoService = {
  listarTodos: async () => {
    try {
      const response = await api.get<MovimentoEstoque[]>('/movimentos');
      return { data: response.data };
    } catch (error) {
      throw error;
    }
  },

  buscarPorId: async (id: number) => {
    try {
      const response = await api.get<MovimentoEstoque>(`/movimentos/${id}`);
      return { data: response.data };
    } catch (error) {
      throw error;
    }
  },

  criar: async (movimento: Omit<MovimentoEstoque, 'id'>) => {
    try {
      // Validar dados antes de enviar
      validarMovimento(movimento);
      
      // Formatar dados garantindo tipos corretos
      const movimentoFormatado = {
        produtoId: Number(movimento.produtoId),
        tipo: movimento.tipo,
        quantidade: Number(movimento.quantidade),
        valorVenda: Number(movimento.valorVenda),
        dataMovimentacao: movimento.dataMovimentacao || new Date().toISOString()
      };
      
      const response = await api.post<MovimentoEstoque>('/movimentos', movimentoFormatado);
      return { data: response.data };
    } catch (error) {
      throw error;
    }
  },

  listarPorProduto: async (produtoId: number) => {
    try {
      const response = await api.get<MovimentoEstoque[]>(`/movimentos/produto/${produtoId}`);
      return { data: response.data };
    } catch (error) {
      throw error;
    }
  }
};