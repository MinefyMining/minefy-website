# Home hero — origem e status

## Resolvido em 2026-07-23 (2ª passada) — `hero-mineracao-bg.jpg` / `hero-agrofy-bg.jpg`

O CEO adicionou duas fotos **limpas** (sem emblema/texto queimado),
1672×941, ~460KB cada:

| Arquivo | Conteúdo | Uso |
|---|---|---|
| `hero-mineracao-bg.jpg` | Escavadeira carregando caminhão fora-de-estrada em mina a céu aberto, pôr do sol | Fundo de `HeroHome` **e** `backgroundSrc` do `LogoIntro` gold em `(mineracao)/layout.tsx` |
| `hero-agrofy-bg.jpg` | Pulverizador autopropelido em lavoura de soja, pôr do sol | Fundo de `AgroHeroHome` **e** `backgroundSrc` do `LogoIntro` green em `(agrofy)/layout.tsx` |

Isso desbloqueou o item que estava pendente abaixo: o mesmo arquivo é usado
tanto pelo hero da home quanto pelo `backgroundSrc` do `LogoIntro` (ver
`components/logo-intro.tsx`), garantindo que quando o overlay do intro
desaparece (~2.6s após o mount), ele revela a **mesma foto** já renderizada
por trás no `HeroHome`/`AgroHeroHome` — sem troca de imagem perceptível.

## Histórico — fotos do CEO ainda bloqueadas (não usadas)

| Arquivo | Origem | Conteúdo | Status |
|---|---|---|---|
| `hero-minefy-group.png` | CEO (1672×941) | Mina a céu aberto ao entardecer, escavadeira + caminhão fora-de-estrada, com o anel/emblema "Minefy Group" dourado queimado no centro | **Ainda bloqueado** — precisa de versão limpa (sem emblema/texto) se algum dia for usada; não é mais necessária para o intro (substituída por `hero-mineracao-bg.jpg`) |
| `hero-agrofy-group.png` | CEO (1672×941) | Lavoura de soja ao entardecer, pulverizador autopropelido em operação, com o anel/emblema "Agrofy · Minefy Group" verde queimado no centro | **Ainda bloqueado** — mesma observação; substituída por `hero-agrofy-bg.jpg` |

Essas duas continuam no repo apenas como referência/histórico (não são mais
o caminho planejado para o hero — não editar/promover sem novo pedido).
Motivo do bloqueio original: as ferramentas Adobe MCP disponíveis neste
ambiente não incluem remoção generativa de objeto/inpaint coerente
(`image_fill_area` só preenche com cor sólida; `image_generative_expand` só
estende borda). Ver commit `1c37921` para o diagnóstico completo.
