# E-commerce Drip Store

Frontend de e-commerce desenvolvido com React e Vite. A aplicação consome a API [Backend GT3](https://github.com/PauloVianaTech/projeto-backend-gt3) para exibir o catálogo, autenticar usuários e integrar filtros de produtos.

## Recursos

- Home com hero em quatro slides, navegação por setas e links para categorias.
- Catálogo dinâmico consumido da API, com imagens de produtos e tratamento para falhas de carregamento.
- Busca, ordenação e filtros combinados por categoria, marca, gênero, estado e faixa de preço.
- Filtro de preço por campos numéricos e dois controles deslizantes conectados.
- Página de detalhes com galeria, opções de tamanho e cor e produtos relacionados.
- Carrinho persistente no Local Storage, com miniaturas, quantidade, subtotal, total e checkout simulado.
- Cadastro, login, logout e rotas protegidas com JWT.
- Layout responsivo para celular e desktop.
- Catálogo local usado apenas como alternativa caso a API esteja indisponível.

## Tecnologias

- React
- Vite
- React Router
- Tailwind CSS
- Axios
- React Icons
- Local Storage

## Requisitos

- Node.js 20 ou superior
- npm
- [Backend GT3](https://github.com/PauloVianaTech/projeto-backend-gt3) em execução para catálogo, cadastro e autenticação.

## Instalação

```bash
git clone https://github.com/PauloVianaTech/ecommerce-drip-store.git
cd ecommerce-drip-store
npm install
```

## Configuração

Crie um arquivo `.env.local` a partir do exemplo:

```bash
cp .env.example .env.local
```

```dotenv
VITE_API_URL=http://localhost:3001/v1
```

Para usar o catálogo de demonstração do backend, execute `npm run seed` no repositório Backend GT3 antes de iniciar o frontend.

## Execução

```bash
npm run dev
```

Abra [http://localhost:5173](http://localhost:5173).

## Validação e build

```bash
npm run lint
npm run build
```

Para visualizar a build localmente:

```bash
npm run preview
```

## Fluxo de autenticação

1. Cadastre um usuário pela tela de cadastro.
2. Entre com e-mail e senha.
3. O JWT é armazenado localmente e usado nas rotas protegidas.
4. A página do carrinho exige autenticação.

Os botões de login social e recuperação de senha são apenas elementos visuais nesta versão. O checkout é uma simulação e não cria pedidos no backend.

## Estrutura

```text
src/
├── components/    # Componentes reutilizáveis
├── contexts/      # Contextos de autenticação e carrinho
├── pages/         # Páginas e rotas
├── services/      # Comunicação com a API e normalização de dados
├── data/          # Catálogo alternativo local
└── assets/        # Logos e recursos visuais
```

## Backend integrado

API, Swagger, seed e testes: [PauloVianaTech/projeto-backend-gt3](https://github.com/PauloVianaTech/projeto-backend-gt3).

## Licença

Projeto de estudo e portfólio.
