# Home hero — origem e status (BLOQUEADO — não usadas ainda)

## Adicionadas em 2026-07-23 (reestruturação de domínio Minefy/Agrofy)

| Arquivo | Origem | Conteúdo | Uso previsto | Status |
|---|---|---|---|---|
| `hero-minefy-group.png` | CEO (1672×941) | Mina a céu aberto ao entardecer, escavadeira + caminhão fora-de-estrada, com o anel/emblema "Minefy Group" dourado queimado no centro | Fundo full-screen da home mineração + intro (`LogoIntro backgroundSrc`) | **Bloqueado** — precisa de versão limpa (sem emblema/texto) |
| `hero-agrofy-group.png` | CEO (1672×941) | Lavoura de soja ao entardecer, pulverizador autopropelido em operação, com o anel/emblema "Agrofy · Minefy Group" verde queimado no centro | Fundo full-screen da home Agrofy + intro (`LogoIntro variant="green" backgroundSrc`) | **Bloqueado** — precisa de versão limpa (sem emblema/texto) |

## Por que estão bloqueadas

O plano da reestruturação (2026-07-23) pedia usar estas duas fotos como fundo
full-screen de cada home, com o anel/logo (`agrofy-logo.png` / `logo-transparente.png`)
animando do centro até o header por cima — mas para isso o **fundo tem que estar limpo**,
sem o emblema/texto queimado, senão o efeito duplica (um símbolo parado na foto + um
"voando" por cima, incoerente).

**Verificado nesta sessão:** as ferramentas Adobe MCP disponíveis no ambiente **não
incluem remoção generativa de objeto / inpaint** — `image_fill_area` só preenche uma
máscara com **cor sólida** (não com conteúdo gerado coerente com a foto), e a
documentação do conector lista explicitamente "Object/element removal from images" e
"Generative AI... (except `image_generative_expand`)" como **não disponíveis** neste
ambiente. `image_generative_expand` só estende bordas (outpaint), não repinta o miolo
da imagem. Não há caminho pra produzir a versão limpa com as ferramentas atuais sem
resultar em um patch de cor sólida por cima da foto — abaixo do Princípio de Excelência.

Conforme a própria instrução da tarefa ("se o inpaint não ficar bom, pare e avise"),
este passo específico foi interrompido em vez de entregar um resultado malfeito.

## O que já está pronto para quando o fundo limpo chegar

- `components/logo-intro.tsx` já aceita uma prop `backgroundSrc` (opcional, não
  ativada em nenhum dos dois layouts ainda) — quando definida, o intro abre com essa
  foto full-bleed atrás do anel/logo (com véu escuro pra legibilidade) em vez da cor
  chapada atual, e desliga a grade de pontos (que ficaria estranha sobre uma foto real).
- Falta apenas: (1) gerar/receber as 2 versões limpas (sem emblema) destas fotos —
  via Firefly/Photoshop fora deste ambiente, ou pedindo ao mesmo gerador que criou as
  originais para exportar também a versão sem anel/texto; (2) trocar o fundo de
  `hero-home.tsx`/`agro-hero-home.tsx` para a foto limpa; (3) passar
  `backgroundSrc="/images/home-hero/<arquivo-limpo>"` no `<LogoIntro />` de
  `(mineracao)/layout.tsx` e `(agrofy)/layout.tsx`.
