import { createRouter, createWebHistory } from 'vue-router'
import ListaProdutos from '@/views/ListaProdutos.vue'
import MovimentacaoEstoque from '@/views/MovimentacaoEstoque.vue'
import LucroProdutos from '@/views/LucroProdutos.vue'
import ListaProdutosPorTipo from '@/views/ListaProdutosPorTipo.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/produtos'
    },
    {
      path: '/produtos',
      component: ListaProdutos
    },
    {
      path: '/produtos-por-tipo',
      component: ListaProdutosPorTipo
    },
    {
      path: '/movimentacoes',
      component: MovimentacaoEstoque
    },
    {
      path: '/lucro',
      component: LucroProdutos
    }
  ]
})

export default router
