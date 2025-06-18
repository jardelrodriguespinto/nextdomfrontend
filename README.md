# Sistema de Controle de Estoque

Sistema frontend para controle de estoque desenvolvido com Vue.js 3, TypeScript e TailwindCSS.

## Tecnologias Utilizadas

- Vue.js 3
- TypeScript
- TailwindCSS
- Pinia (Gerenciamento de Estado)
- Vue Router
- Axios

## Funcionalidades

- CRUD completo de produtos
- Registro de entradas e saídas de estoque
- Validação de saldo para saídas
- Consulta de produtos por tipo
- Relatório de lucro por produto
- Interface responsiva e moderna

## Pré-requisitos

- Node.js 16+
- npm ou yarn

## Como Executar

1. Clone o repositório
2. Instale as dependências:
```bash
npm install
```

3. Configure o arquivo `.env` com a URL da API:
```
VITE_API_URL=http://localhost:8080/api
```

4. Execute o projeto em modo de desenvolvimento:
```bash
npm run dev
```

5. Acesse `http://localhost:5173` no navegador

## Estrutura do Projeto

```
src/
  ├── components/     # Componentes reutilizáveis
  ├── views/         # Páginas da aplicação
  ├── stores/        # Stores Pinia
  ├── services/      # Serviços e APIs
  ├── types/         # Definições de tipos
  ├── router/        # Configuração de rotas
  └── assets/        # Recursos estáticos
```

## Comunicação com a API

A aplicação se comunica com uma API RESTful através do Axios. Os endpoints utilizados são:

- `GET /api/produtos` - Listar produtos
- `POST /api/produtos` - Criar produto
- `GET /api/produtos/{id}` - Buscar produto
- `PUT /api/produtos/{id}` - Atualizar produto
- `DELETE /api/produtos/{id}` - Deletar produto
- `GET /api/produtos/tipo/{tipo}` - Buscar por tipo
- `GET /api/produtos/{id}/lucro` - Consultar lucro
- `POST /api/movimentos` - Registrar movimento
- `GET /api/movimentos` - Listar movimentos
- `GET /api/movimentos/{id}` - Buscar movimento
- `GET /api/movimentos/produto/{produtoId}` - Listar por produto

## Boas Práticas Implementadas

- Componentização
- Tipagem forte com TypeScript
- Gerenciamento de estado com Pinia
- Validações de formulários
- Feedback visual para o usuário
- Código limpo e organizado
- Nomes em português quando apropriado
- Responsividade
- Tratamento de erros
