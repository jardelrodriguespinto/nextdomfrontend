export type TipoProduto = 'ELETRONICO' | 'ELETRODOMESTICO' | 'MOVEL';
export type TipoMovimentacao = 'ENTRADA' | 'SAIDA'

export interface Produto {
  id: number;
  codigo: string;
  descricao: string;
  tipo: TipoProduto;
  valorFornecedor: number;
  quantidadeEstoque: number;
}

export interface MovimentoEstoque {
  id: number;
  produtoId: number;
  produto?: Produto;
  tipo: TipoMovimentacao;
  valorVenda: number;
  quantidade: number;
  dataMovimentacao: string | '';
}

export interface LucroProduto {
  produto: Produto;
  descricao: string;
  quantidadeSaida: number;
  valorCompraUnitario: number;
  valorVendaUnitario: number;
  lucroUnitario: number;
  lucroTotal: number;
}