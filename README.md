# Homelab Hub

Portal central do homelab pessoal para catalogar aplicações, controlar o acesso dos usuários e, futuramente, integrar autenticação única (SSO) por OpenID Connect (OIDC).

> **Estado atual:** estrutura inicial do monorepo criada. O frontend React/Vite e a API NestJS foram gerados a partir dos templates oficiais; os testes iniciais e os linters executados passaram. Autenticação, persistência, autorização, integrações OIDC e implantação ainda precisam ser implementadas e validadas.

## Objetivos

- Reunir as aplicações do homelab em um portal central.
- Exibir aplicações públicas, aplicações com autenticação opcional e aplicações restritas.
- Permitir cadastro de usuários com aprovação administrativa.
- Administrar usuários, permissões, aplicações e registros de auditoria.
- Preparar a arquitetura para SSO via OIDC, evitando implementar armazenamento próprio de senhas sem necessidade.
- Manter a administração do servidor privada, acessível por VPN/Tailscale, sem expor SSH diretamente à Internet.

## Tecnologias

| Área | Tecnologia |
|---|---|
| Runtime | Node.js 24 LTS |
| Gerenciador de pacotes | Yarn 4 (Corepack) |
| Monorepo | Yarn Workspaces |
| Frontend | React, TypeScript, Vite |
| Backend | NestJS, TypeScript |
| Testes do backend | Vitest e testes e2e |
| Banco planejado | PostgreSQL |
| Contêineres planejados | Docker Compose |
| Proxy reverso planejado | Caddy |
| Publicação externa planejada | Cloudflare Tunnel |
| Identidade/SSO planejado | Provedor OIDC a definir |

Consulte [`docs/setup-desenvolvimento.md`](docs/setup-desenvolvimento.md) para instalar e executar o projeto.

## Estrutura do repositório

```text
.
├── backend/                 # API NestJS
├── deploy/                  # Arquivos Docker Compose e implantação
├── docs/                    # Documentação do projeto
├── frontend/                # Interface React + Vite
├── tests/                   # Espaço para testes complementares
├── .nvmrc                   # Linha do Node.js usada no projeto
├── .yarnrc.yml              # Configuração do Yarn
├── package.json             # Workspaces e comandos da raiz
└── yarn.lock                # Resolução versionada das dependências
```

## Pré-requisitos

- Git.
- Node.js 24, preferencialmente gerenciado pelo NVM.
- Corepack habilitado.
- A versão do Yarn declarada no `package.json` da raiz.
- Docker Compose será necessário para os serviços locais quando os arquivos em `deploy/` estiverem implementados.

## Início rápido

Na raiz do repositório:

```bash
nvm use
corepack enable
yarn --version
yarn install
```

Confira a versão do Yarn e compare-a com `packageManager` no `package.json`. Em um checkout com `yarn.lock` atualizado, use `yarn install --immutable` para verificar que a instalação não altera o lockfile.

Execute o frontend e o backend em terminais separados:

```bash
yarn dev:frontend
```

```bash
yarn dev:backend
```

Comandos de qualidade:

```bash
yarn build:frontend
yarn build:backend
yarn workspace @homelab-hub/backend test
yarn workspace @homelab-hub/backend test:e2e
yarn workspace @homelab-hub/backend lint
yarn workspace @homelab-hub/frontend lint
```

Os serviços ainda são templates iniciais. A configuração de variáveis, banco, autenticação e integração entre frontend e backend será completada nas próximas etapas.

## Documentação

- [Configuração do ambiente de desenvolvimento](docs/setup-desenvolvimento.md)
- [Configuração por ambiente e variáveis](docs/configuracao-ambientes.md)
- [Testes e critérios de qualidade](docs/testes.md)
- [Implantação e rollback](docs/implantacao.md)

## Segurança — princípios

- Não versionar segredos, tokens, cookies, chaves privadas ou arquivos `.env` reais.
- Manter `.env.example` com valores fictícios e sem credenciais válidas.
- Não publicar PostgreSQL, SSH ou interfaces administrativas diretamente na Internet.
- Manter o acesso administrativo do servidor pela VPN/Tailscale.
- Aplicar autenticação e autorização no backend; esconder um botão no frontend não é controle de acesso.
- Não registrar senhas, tokens, cookies de sessão ou códigos de autorização nos logs.
- Fazer revisão e executar testes antes de integrar alterações em `main`.

## Fluxo Git

- `main`: versões aprovadas e potencialmente implantáveis.
- `dev`: integração das funcionalidades.
- `feat/*`: novas funcionalidades, normalmente integradas em `dev`.
- `hotfix/*`: correções urgentes originadas da versão estável; após aprovação, integrar também em `dev`.

Use pull requests/revisão quando possível. Não faça deploy de código apenas porque está presente em `dev`.

## Estado e próximos passos

- [x] Criar repositório e estratégia de branches.
- [x] Criar estrutura inicial do monorepo.
- [x] Configurar Yarn Workspaces.
- [x] Gerar os templates iniciais de React/Vite e NestJS.
- [x] Executar testes unitários e e2e iniciais do backend.
- [x] Executar linters do frontend e backend sem erros.
- [ ] Validar e documentar os builds do frontend e backend.
- [ ] Consolidar scripts de lint/test/build na raiz.
- [ ] Definir variáveis por ambiente e preencher os `.env.example`.
- [ ] Implementar persistência PostgreSQL e migrations.
- [ ] Definir e integrar provedor OIDC.
- [ ] Implementar usuários, aprovações, aplicações, permissões e auditoria.
- [ ] Finalizar e testar os arquivos Docker Compose.
- [ ] Documentar e testar backup, atualização e rollback.