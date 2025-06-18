# NextDom Frontend – Sistema de Controle de Estoque

Frontend moderno para controle de estoque, desenvolvido com **Vue.js 3**, **TypeScript**, **Pinia**, **Vue Router** e **Axios**. O sistema permite o cadastro, consulta, movimentação e análise de produtos, com interface responsiva e validações robustas.

---

## 🌐 Deploy

O projeto está disponível em produção em:  
[https://nextdomfrontend.vercel.app/](https://nextdomfrontend.vercel.app/)

---

## ⚠️ Regras de Negócio Importantes

- **Produtos com movimentação registrada não podem ser deletados.**  
  O sistema impede a exclusão de produtos que já possuem movimentações de estoque associadas, garantindo a integridade dos dados históricos.

- **Estoque baixo:**  
  Foi considerado que produtos com quantidade em estoque abaixo de cinco unidades são classificados como estoque baixo, podendo ser destacados na interface para facilitar o controle e a reposição.

---

## 🛠️ Tecnologias Utilizadas

- **Vue.js 3** – Framework progressivo para construção de interfaces.
- **TypeScript** – Tipagem estática para maior robustez.
- **Pinia** – Gerenciamento de estado global.
- **Vue Router** – Roteamento SPA.
- **Axios** – Requisições HTTP.
- **Vite** – Bundler e servidor de desenvolvimento rápido.
- **ESLint + Prettier** – Padronização e formatação de código.
- **EditorConfig** – Consistência de estilo entre editores.
- **TailwindCSS** (referenciado no README, mas não encontrado no código; estilos utilitários próprios são usados).

---

## 📁 Estrutura do Projeto

```
nextdomfrontend/
├── public/                 # Arquivos estáticos (favicon, etc)
├── src/
│   ├── assets/             # CSS global e imagens
│   ├── components/         # Componentes reutilizáveis (botões, modais, formulários, ícones)
│   ├── router/             # Configuração de rotas (SPA)
│   ├── services/           # Serviços de API (Axios)
│   ├── stores/             # Stores Pinia (produtos, movimentos, etc)
│   ├── types/              # Tipos TypeScript globais
│   ├── views/              # Páginas principais (produtos, movimentações, lucro, etc)
│   └── main.ts             # Bootstrap da aplicação
├── .vscode/                # Configurações recomendadas do VSCode
├── .editorconfig           # Regras de estilo cross-editor
├── .prettierrc.json        # Regras de formatação Prettier
├── .gitignore              # Arquivos e pastas ignorados pelo Git
├── package.json            # Dependências e scripts npm
├── tsconfig*.json          # Configurações TypeScript
├── vite.config.ts          # Configuração do Vite (inclui proxy para API)
└── README.md               # Este arquivo
```

---

## 🚀 Funcionalidades

- **CRUD de Produtos:** Cadastro, edição, exclusão e listagem de produtos.
- **Movimentação de Estoque:** Registro de entradas e saídas, com validação de saldo.
- **Consulta por Tipo:** Filtragem e estatísticas de produtos por tipo.
- **Relatório de Lucro:** Cálculo de lucro unitário e total por produto.
- **Validações Frontend e Backend:** Feedback imediato ao usuário.
- **Interface Responsiva:** Layout adaptável para desktop e mobile.
- **Componentização:** Reutilização de botões, modais e formulários.
- **Feedback Visual:** Toasts de sucesso/erro, loading spinners.
- **Padronização de Código:** ESLint, Prettier, EditorConfig.
- **Tipagem Forte:** Uso extensivo de TypeScript em toda a base.

---

## 🔗 Comunicação com a API

A aplicação consome uma API RESTful (backend não incluso neste repositório). Os endpoints utilizados estão definidos em [`src/services/api.ts`](src/services/api.ts):

- **Produtos**
  - `GET /api/produtos` – Listar todos
  - `POST /api/produtos` – Criar novo
  - `GET /api/produtos/{id}` – Buscar por ID
  - `PUT /api/produtos/{id}` – Atualizar
  - `DELETE /api/produtos/{id}` – Remover
  - `GET /api/produtos/tipo/{tipo}` – Buscar por tipo
  - `GET /api/produtos/{id}/lucro` – Consultar lucro

- **Movimentações**
  - `GET /api/movimentos` – Listar todas
  - `POST /api/movimentos` – Registrar movimentação
  - `GET /api/movimentos/{id}` – Buscar por ID
  - `GET /api/movimentos/produto/{produtoId}` – Listar por produto

O proxy para `/api` está configurado no [`vite.config.ts`](vite.config.ts) para facilitar o desenvolvimento local.

---

## 🧩 Principais Componentes

- [`BaseButton.vue`](src/components/BaseButton.vue): Botão estilizado e reutilizável.
- [`BaseModal.vue`](src/components/BaseModal.vue): Modal genérico para formulários e confirmações.
- [`FormularioProduto.vue`](src/components/FormularioProduto.vue): Formulário de cadastro/edição de produtos, com máscara de moeda e validação.
- [`FormularioMovimento.vue`](src/components/FormularioMovimento.vue): Formulário para registrar movimentações de estoque.
- Ícones SVG customizados em [`components/icons/`](src/components/icons/).

---

## 🗂️ Stores Pinia

- [`stores/produto.ts`](src/stores/produto.ts): Gerencia estado, carregamento, erros e ações de produtos.
- [`stores/movimento.ts`](src/stores/movimento.ts): Gerencia movimentações de estoque.
- [`stores/counter.ts`](src/stores/counter.ts): Exemplo de store simples (pode ser removido em produção).

---

## 📝 Tipos TypeScript

Definidos em [`src/types/index.ts`](src/types/index.ts):

- `Produto`, `MovimentoEstoque`, `LucroProduto`, `TipoProduto`, `TipoMovimentacao`, etc.

---

## 🧑‍💻 Fluxo de Desenvolvimento

1. **Clone o repositório**
2. **Instale as dependências**
   ```sh
   npm install
   ```
3. **Configure o arquivo `.env`** (opcional, se quiser sobrescrever o proxy)
   ```
   VITE_API_URL=http://localhost:8080/api
   ```
4. **Execute o projeto**
   ```sh
   npm run dev
   ```
   Acesse [http://localhost:5173](http://localhost:5173)

5. **Build para produção**
   ```sh
   npm run build
   ```

6. **Lint e formatação**
   ```sh
   npm run lint
   npm run format
   ```

---

## 🧭 Navegação

- `/produtos` – Lista e CRUD de produtos
- `/movimentacoes` – Registro e consulta de movimentações de estoque
- `/produtos-por-tipo` – Consulta e estatísticas por tipo de produto
- `/lucro` – Relatório de lucro por produto

---

## 💡 Boas Práticas e Padrões

- **Componentização:** Separação clara entre componentes de UI e páginas.
- **Tipagem:** Todos os dados e props são tipados.
- **Validação:** Antes de enviar dados para a API, validações são feitas no frontend e backend.
- **Feedback ao Usuário:** Mensagens de erro, sucesso e loading.
- **Código Limpo:** Uso de ESLint, Prettier e EditorConfig.
- **Reutilização:** Botões, modais e formulários são genéricos e reutilizáveis.
- **Arquitetura SPA:** Navegação sem recarregar a página.

---

## 🖥️ Dicas para Desenvolvimento

- Use o VSCode com as extensões recomendadas em [`.vscode/extensions.json`](.vscode/extensions.json).
- O projeto já está configurado para formatação automática ao salvar.
- Utilize o Pinia Devtools para inspecionar o estado global.
- Os serviços de API já tratam erros e validações, facilitando o uso nos componentes.
- Para adicionar novas páginas, crie um novo arquivo em `src/views/` e registre a rota em [`src/router/index.ts`](src/router/index.ts).

---

## 📚 Referências

- [Documentação Vue.js](https://vuejs.org/)
- [Documentação Pinia](https://pinia.vuejs.org/)
- [Documentação Vue Router](https://router.vuejs.org/)
- [Documentação Vite](https://vitejs.dev/)
- [Documentação Axios](https://axios-http.com/)

---

## 📝 Licença

Este projeto é de uso acadêmico/demonstrativo. Consulte o autor para uso comercial.

---

**Desenvolvido por [Jardel Rodrigues Pinto] – 2025**