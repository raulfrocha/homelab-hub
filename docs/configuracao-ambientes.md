# Configuração de ambientes e variáveis

## Objetivo

Manter desenvolvimento, testes e produção separados, evitando que dados de teste afetem dados reais e que segredos sejam armazenados no Git.

## Ambientes

| Ambiente | Uso | Dados | Segredos |
|---|---|---|---|
| Desenvolvimento | Notebook do desenvolvedor | Banco local de desenvolvimento, quando integrado | Arquivo `.env` local ignorado pelo Git |
| Teste/CI | Testes automatizados e validação | Banco descartável ou isolado | Valores temporários próprios do teste |
| Produção | Servidor Debian via Docker Compose | Banco persistente de produção | Arquivo de ambiente protegido fora do repositório |

A aplicação ainda está em fase inicial. As variáveis definitivas serão documentadas à medida que PostgreSQL, sessões e OIDC forem implementados. Não presuma que todas as variáveis abaixo já são consumidas pelo código.

## Arquivos permitidos

- `.env.example`: modelo com nomes de variáveis e valores fictícios; deve ser versionado.
- `.env`: valores locais reais; não deve ser versionado.
- `.env.test` ou equivalentes locais: apenas para testes, ignorados pelo Git.
- Produção: arquivo protegido no servidor, fora do repositório.

O `.gitignore` deve ignorar `.env` e `.env.*`, mas permitir explicitamente `.env.example`. Antes de um commit, confira:

```bash
git status --short
git check-ignore .env
git check-ignore .env.example
```

O `.env` deve ser ignorado; `.env.example` não deve ser ignorado.

## Frontend e variáveis públicas

Variáveis usadas pelo Vite e expostas com o prefixo `VITE_` são incorporadas ao bundle do navegador. Portanto:

- Nunca colocar senhas, segredos OIDC, tokens privados ou credenciais de banco em variáveis `VITE_*`.
- URLs públicas de serviços e configurações não secretas podem ser variáveis do frontend.
- Segredos de cliente OIDC e credenciais de sessão devem permanecer no backend/provedor de identidade.

## Backend

As variáveis do backend podem incluir configurações de ambiente, porta, conexão de banco e integração OIDC. Os nomes finais precisam corresponder ao código implementado e ao provedor OIDC escolhido.

Exemplos de categorias de configuração:

- `NODE_ENV`: `development`, `test` ou `production`.
- `PORT`: porta HTTP da API.
- `DATABASE_HOST`, `DATABASE_PORT`, `DATABASE_NAME`, `DATABASE_USER`: conexão PostgreSQL.
- `OIDC_ISSUER_URL`, `OIDC_CLIENT_ID`: configuração do cliente OIDC.
- Segredo OIDC e segredo de sessão, caso a arquitetura escolhida realmente os utilize: apenas em configuração secreta local/produção.

Não preencha `.env.example` com segredos reais nem use credenciais de produção em desenvolvimento.

## Segredos de produção no Debian

Diretório planejado:

```text
/etc/homelab-portal/
└── portal.env
```

Preparação no servidor (executar somente quando a implantação estiver sendo configurada):

```bash
sudo install -d -o root -g root -m 700 /etc/homelab-portal
sudo install -o root -g root -m 600 /dev/null /etc/homelab-portal/portal.env
sudo nano /etc/homelab-portal/portal.env
```

Regras:

- O arquivo deve pertencer a `root` e ter permissões restritas.
- Não copiar esse arquivo para o repositório.
- Não colocar segredos em `Dockerfile`, imagens, argumentos de build ou arquivos versionados.
- Não imprimir valores secretos em terminal compartilhado ou logs.
- Restringir quais serviços recebem cada variável. O frontend não deve receber segredos do backend.
- O `env_file` do Compose injeta variáveis no contêiner; isso não é um cofre de segredos. Proteger o host e limitar acesso ao Docker.

Os arquivos Compose atuais ainda precisam ser revisados e testados antes de usar esse arquivo em produção.

## Rotação e incidentes

Se um segredo for enviado ao Git, removê-lo do arquivo não basta: considere-o comprometido, revogue/rotacione-o no serviço correspondente e avalie o histórico do repositório. Não cole segredos em issues, mensagens ou logs.