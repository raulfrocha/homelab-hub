# Testes e critérios de qualidade

## Objetivo

Garantir que as alterações funcionem antes de serem integradas em `dev` ou `main`. Os comandos são executados a partir da raiz do monorepo.

## Comandos disponíveis

### Build

```bash
yarn build:frontend
yarn build:backend
```

O build do frontend executa verificação de tipos com TypeScript e gera a saída do Vite. O build do backend compila a aplicação NestJS.

### Backend

Testes unitários:

```bash
yarn workspace @homelab-hub/backend test
```

Testes e2e:

```bash
yarn workspace @homelab-hub/backend test:e2e
```

Lint:

```bash
yarn workspace @homelab-hub/backend lint
```

Cobertura:

```bash
yarn workspace @homelab-hub/backend test:cov
```

O template do NestJS inclui um teste unitário para o controlador e um teste e2e para a rota inicial. Esses testes validam o template, não regras de negócio do portal.

### Frontend

```bash
yarn workspace @homelab-hub/frontend lint
```

O frontend foi gerado com Oxlint. Ainda é necessário definir e implementar testes automatizados de componentes e integração do frontend.

## Resultado da validação inicial

Em 18/10/2026, os seguintes comandos foram executados com sucesso no ambiente de desenvolvimento:

- `yarn workspace @homelab-hub/backend test`: 1 teste passou.
- `yarn workspace @homelab-hub/backend test:e2e`: 1 teste passou.
- `yarn workspace @homelab-hub/backend lint`: 0 avisos e 0 erros.
- `yarn workspace @homelab-hub/frontend lint`: 0 avisos e 0 erros.

Esses resultados são uma fotografia da configuração inicial. Execute os comandos novamente após alterações. Não considere o build validado apenas com base nos testes/lint; rode os comandos de build separadamente.

## Critérios antes de integrar uma alteração

- [ ] A instalação de dependências é consistente e o lockfile foi revisado.
- [ ] `yarn build:frontend` passa.
- [ ] `yarn build:backend` passa.
- [ ] Os testes unitários relevantes passam.
- [ ] Os testes e2e relevantes passam.
- [ ] O lint dos pacotes alterados passa.
- [ ] Não há segredos, tokens, cookies ou dados pessoais em commits/logs.
- [ ] A documentação foi atualizada quando necessário.
- [ ] Alterações de banco incluem migration e plano de compatibilidade/rollback.
- [ ] O comportamento de autorização é validado no backend, não apenas na interface.

## Estratégia a evoluir

À medida que o portal ganhar funcionalidades, adicionar testes para:

1. Cadastro e estados de conta pendente/aprovada/rejeitada/suspensa.
2. Login, logout, expiração de sessão e callbacks OIDC.
3. Autorização por função e permissão por aplicação.
4. Políticas de acesso público, autenticação opcional e acesso restrito.
5. Auditoria de ações administrativas sem registrar segredos.
6. Persistência PostgreSQL e migrations.
7. Configuração de produção e integração com o proxy reverso.

Testes que dependam de PostgreSQL ou do provedor OIDC devem usar serviços isolados e credenciais exclusivas para teste.