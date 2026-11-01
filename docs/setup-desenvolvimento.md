# Configuração do ambiente de desenvolvimento

Este guia descreve como preparar o notebook para trabalhar no Homelab Hub. Os comandos abaixo devem ser executados na raiz do repositório, salvo indicação contrária.

## Requisitos

- Git.
- Node.js 24.
- NVM (recomendado para manter a versão do Node controlada).
- Corepack.
- Yarn 4, conforme a versão declarada no `package.json` da raiz.

Versões verificadas no ambiente inicial em 18/10/2026:

- Node.js `v24.22.0`
- npm `11.19.1`
- Corepack `0.36.0`
- Yarn do projeto `4.18.1`

Essas versões descrevem o ambiente em que a configuração inicial foi preparada. A fonte de verdade para o Yarn é o campo `packageManager` do `package.json`; `.nvmrc` define a linha principal do Node.

## 1. Entrar no repositório

```bash
cd ~/homelab/homelab-hub
```

Confira o estado do Git:

```bash
git status --short --branch
```

## 2. Selecionar o Node.js

Se o NVM estiver instalado:

```bash
nvm install
nvm use
node --version
```

O arquivo `.nvmrc` especifica a linha `24`. Não é necessário instalar o Node globalmente pelo gerenciador de pacotes do sistema se o NVM já estiver sendo usado.

## 3. Ativar Corepack e verificar o Yarn

```bash
corepack enable
yarn --version
```

A versão retornada deve corresponder à declarada em `package.json` no campo `packageManager` (atualmente Yarn `4.18.1`). Se houver divergência, não altere o lockfile nem instale dependências com npm; confira a configuração do Corepack e o campo `packageManager`.

## 4. Instalar dependências

Para uma primeira instalação:

```bash
yarn install
```

Depois que `yarn.lock` estiver atualizado e versionado, valide instalações reproduzíveis com:

```bash
yarn install --immutable
```

O modo `--immutable` falha se a instalação precisar modificar o lockfile. É indicado para CI e para validar um checkout limpo.

Não execute `npm install` e não instale dependências separadamente em `frontend/` ou `backend/`. O repositório usa Yarn Workspaces e um lockfile na raiz.

## 5. Executar os serviços

Abra dois terminais na raiz do repositório.

Frontend:

```bash
yarn dev:frontend
```

Backend:

```bash
yarn dev:backend
```

Os endereços e portas exatos devem ser conferidos nas mensagens de inicialização e na configuração local do Vite/NestJS. A integração entre frontend e API ainda precisa ser configurada.

## 6. Build e qualidade

```bash
yarn build:frontend
yarn build:backend
yarn workspace @homelab-hub/backend test
yarn workspace @homelab-hub/backend test:e2e
yarn workspace @homelab-hub/backend lint
yarn workspace @homelab-hub/frontend lint
```

Consulte [Testes](testes.md) para os objetivos e critérios de aceitação.

## 7. Variáveis de ambiente

Leia [Configuração por ambiente](configuracao-ambientes.md). Nunca copie credenciais reais para os arquivos `.env.example`, commits, screenshots ou logs.

## 8. Estrutura dos pacotes

- `frontend/`: React, TypeScript e Vite.
- `backend/`: API NestJS e testes unitários/e2e.
- `deploy/`: arquivos Compose e configuração de implantação.
- `docs/`: documentação operacional e técnica.
- `tests/`: espaço para testes de integração que não pertençam exclusivamente a um pacote.

## Problemas comuns

### Yarn retorna uma versão diferente

Confira:

```bash
node --version
corepack --version
yarn --version
node -p "require('./package.json').packageManager"
```

Ative Corepack com `corepack enable` e confirme que está na raiz do projeto.

### Instalação altera o lockfile inesperadamente

Não descarte as alterações automaticamente. Confira se o `package.json` de algum Workspace foi alterado e revise o diff:

```bash
git diff -- package.json frontend/package.json backend/package.json yarn.lock
```

### Porta já está em uso

Leia a mensagem do Vite ou NestJS para descobrir a porta em uso. Não altere portas de forma arbitrária sem verificar se há configuração correspondente no proxy ou nos arquivos Compose.