# Implantação e rollback

## Estado atual

A implantação em produção ainda não está pronta. Os arquivos em `deploy/` foram reservados para Compose de base, desenvolvimento e testes, mas devem ser revisados, preenchidos e testados antes de serem considerados operacionais. A existência desses arquivos não significa que a stack esteja pronta para deploy.

O destino planejado é o servidor Debian do homelab, com Docker Compose. Caddy será o proxy reverso e Cloudflare Tunnel será usado para publicação externa quando configurado. O acesso administrativo ao servidor deve continuar privado via Tailscale/VPN; não expor SSH diretamente à Internet.

## Arquitetura planejada

```text
Internet
  └── Cloudflare
      └── Cloudflare Tunnel
          └── Caddy
              └── Portal / API

Administração
  └── Notebook
      └── Tailscale/VPN
          └── Debian / Docker
```

O desenho é uma intenção arquitetural, não uma descrição de serviços já implantados.

## Pré-requisitos para um deploy real

- [ ] Builds do frontend e backend aprovados.
- [ ] Testes unitários/e2e aprovados.
- [ ] Variáveis de produção documentadas e validadas.
- [ ] Segredos guardados fora do Git.
- [ ] PostgreSQL, volumes persistentes e migrations definidos.
- [ ] Health checks e política de reinício definidos.
- [ ] Redes Docker separadas conforme a função de cada serviço.
- [ ] Nenhuma porta de banco/admin exposta desnecessariamente no host.
- [ ] Backup de banco e dados persistentes executado e restauração testada.
- [ ] Logs com rotação e sem segredos.
- [ ] Versão exata da aplicação registrada.
- [ ] Procedimento de rollback testado.

## Segredos

O arquivo de ambiente de produção está planejado em `/etc/homelab-portal/portal.env`, com proprietário `root:root` e permissões `0600`. Consulte [Configuração de ambientes](configuracao-ambientes.md).

Não coloque segredos em arquivos versionados, imagens Docker, parâmetros de build ou no bundle do frontend.

## Processo de release (quando a stack estiver pronta)

1. Integrar a alteração aprovada em `main`.
2. Executar testes, lint e builds.
3. Confirmar migrations e compatibilidade com a versão atualmente implantada.
4. Criar uma tag de versão, por exemplo `v0.1.0`, quando houver uma versão implantável.
5. Construir imagens identificadas por versão/commit, evitando depender apenas de `latest`.
6. Registrar a versão anterior e o plano de retorno.
7. Fazer backup antes de migrations destrutivas ou mudanças importantes.
8. Implantar em janela controlada e verificar health checks, logs e fluxos essenciais.
9. Registrar resultado, versão e eventuais incidentes.

Exemplo de tag (executar apenas depois de a versão ser aprovada e de o remoto estar configurado):

```bash
git switch main
git pull --ff-only
git tag -a v0.1.0 -m "Primeira versão implantável do Homelab Hub"
git push origin v0.1.0
```

Não crie a tag de produção enquanto a aplicação for apenas o template inicial.

## Rollback de aplicação

1. Identificar a versão anterior conhecida como funcional.
2. Voltar a implantar a imagem/commit exato dessa versão.
3. Verificar health checks, logs, login e rotas principais.
4. Registrar a causa e a versão restaurada.

Não presuma que reverter o código reverte o banco.

## Rollback de banco de dados

Migrations devem ser planejadas para compatibilidade entre a versão atual e a anterior sempre que possível. Antes de uma migration destrutiva:

- Fazer backup consistente.
- Confirmar como restaurá-lo.
- Preferir mudanças em etapas (adicionar, migrar dados, só depois remover estruturas antigas).
- Definir explicitamente se o retorno exige uma migration compensatória ou restauração do backup.

Não execute migrations destrutivas automaticamente no início do contêiner sem uma estratégia testada.

## Verificações pós-deploy

- [ ] Contêineres saudáveis e reiniciando conforme esperado.
- [ ] Frontend e API acessíveis pelos caminhos esperados.
- [ ] Banco persistente e migrations corretas.
- [ ] Autenticação/autorização testadas (quando implementadas).
- [ ] Logs sem segredos e com rotação.
- [ ] Backup concluído.
- [ ] Administração segue acessível apenas pela VPN.
- [ ] Versão implantada e resultado documentados.