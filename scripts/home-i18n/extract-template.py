#!/usr/bin/env python3
"""One-off extractor: builds home.template.html from the ORIGINAL public/home.html
+ the pt-BR dictionary. Every dict string found in the HTML is replaced by a
{{key}} token (longest-first, every occurrence). Structural tokens are then
inserted by dedicated rules (flags nav, hreflang, lang, canonical, prefix).

Round-trip guarantee: `build-home-i18n.mjs` must regenerate a PT file whose
only differences from the original are the intentional structural additions.
"""
import json, re, sys

ROOT = "/Users/minefy/Minefy-Kimi/06-entregas/2026-10-13-site-idiomas/worktree"
html = open(f"{ROOT}/public/home.html", encoding="utf8").read()
d = json.load(open(f"{ROOT}/scripts/home-i18n/locales/pt-BR.json", encoding="utf8"))
js_sources = "".join(
    open(f"{ROOT}/public/{f}", encoding="utf8").read()
    for f in ("story.js", "command.js", "app.js", "enhancements.js")
)

# Chaves NOVAS (não existiam na home original — inseridas pelo markup das flags).
NEW_KEYS = {"flags.navAria", "flags.ptBR", "flags.en", "flags.es", "flags.zhCN", "contact.waText"}
JS_ONLY_PREFIXES = ("js.",)
JS_ONLY_KEYS = {
    "story.loading", "story.errorTimeout", "story.errorInterrupted", "story.retry",
    "story.sceneAria", "story.hudCritical",
    "lab.riskCompound", "lab.riskWarning",
    "lab.riskCountOne", "lab.riskCountMany",
    "lab.titleCompoundVib", "lab.titleCompound", "lab.titleOne",
    "lab.descCompoundVib", "lab.descCompound", "lab.descOne",
    "lab.statusCompound",
    "command.asset.alertSuffix", "command.asset.selectAria",
    "command.asset.conditionNormal", "command.asset.oilContextNormal",
    "command.asset.summaryNormal", "command.map.selectionNormal",
    "command.map.normalDetail",
    "command.trend.aria", "command.trend.unitOil", "command.trend.unitPressure",
    "command.trend.unitFuel",
    "command.speed.captionIdle", "command.speed.captionMoving",
    "command.speed.gaugeAria", "command.speed.sparkAria",
    "command.fuel.meterAria",
    "fleet.sceneAriaPrefix", "fleet.imageAltSuffix",
}

pairs = []  # (key, value)
def add(k, v):
    if isinstance(v, str):
        pairs.append((k, v))
def walk(d, p=""):
    for k, v in d.items():
        key = f"{p}.{k}" if p else k
        if isinstance(v, dict): walk(v, key)
        elif isinstance(v, list):
            for i, item in enumerate(v):
                if isinstance(item, dict): walk(item, f"{key}.{i}")
                else: add(f"{key}.{i}", item)
        else: add(key, v)
walk(d)

# Longest-first so "Temperatura do óleo" variants don't shadow longer strings.
pairs.sort(key=lambda kv: -len(kv[1]))

missing = []
t = html
# Sentinelas inertes: nenhuma substituição pode atingir um token já inserido
# (ex.: "Normal" dentro de "{{lab.riskNormal}}").
sentinels = []
for idx, (key, value) in enumerate(pairs):
    if key in JS_ONLY_KEYS or any(key.startswith(p) for p in JS_ONLY_PREFIXES):
        continue
    if value not in t:
        missing.append((key, value))
        continue
    marker = f"\x00{idx}\x00"
    t = t.replace(value, marker)
    sentinels.append((marker, key))
for marker, key in sentinels:
    t = t.replace(marker, "{{" + key + "}}")

# keys allowed to be JS-only even without listing (patterns with {vars})
js_ok, errors = [], []
for k, v in missing:
    if k in NEW_KEYS or "{" in v:
        continue
    if v in js_sources:
        js_ok.append(k)
    else:
        errors.append((k, v))
print(f"JS-only confirmadas: {len(js_ok)}")
if errors:
    print("ERRO — não encontradas em HTML nem JS:")
    for k, v in errors:
        print(" -", k, "::", v[:90])
    sys.exit(1)

# ── structural tokens ───────────────────────────────────────────────
t = t.replace('<html lang="pt-BR">', '<html lang="{{LANG}}">', 1)
t = t.replace('<link rel="canonical" href="https://www.minefymining.com/">',
              '<link rel="canonical" href="{{CANONICAL}}">\n  {{HREFLANG}}', 1)
t = t.replace('<meta property="og:locale" content="pt_BR">',
              '<meta property="og:locale" content="{{OG_LOCALE}}">', 1)
t = t.replace(
    'href="https://wa.me/5531993801664?text=Ol%C3%A1%2C%20quero%20conhecer%20as%20solu%C3%A7%C3%B5es%20Minefy%20para%20minha%20opera%C3%A7%C3%A3o."',
    'href="https://wa.me/5531993801664?text={{WA_TEXT}}"', 1)
t = t.replace('<a href="/mineracao">', '<a href="{{PREFIX}}/mineracao">', 1)

# flags nav — inserted between .header-actions and .menu-button
FLAGS = """<nav class="locale-flags" aria-label="{{flags.navAria}}"><a class="locale-flag{{FLAG_CLASS_pt-BR}}" href="/" aria-label="{{flags.ptBR}}"{{FLAG_ARIA_pt-BR}}><svg viewBox="0 0 20 14" width="20" height="14" aria-hidden="true" focusable="false"><rect width="20" height="14" rx="2" fill="#009c3b"/><path d="M10 2.4 17.4 7 10 11.6 2.6 7Z" fill="#ffdf00"/><circle cx="10" cy="7" r="2.5" fill="#002776"/><path d="M7.7 6.4a2.6 2.6 0 0 1 4.7 1.3" fill="none" stroke="#fff" stroke-width=".5"/></svg></a><a class="locale-flag{{FLAG_CLASS_en}}" href="/en" aria-label="{{flags.en}}"{{FLAG_ARIA_en}}><svg viewBox="0 0 20 14" width="20" height="14" aria-hidden="true" focusable="false"><rect width="20" height="14" rx="2" fill="#fff"/><rect y="0" width="20" height="1" fill="#b22234"/><rect y="2" width="20" height="1" fill="#b22234"/><rect y="4" width="20" height="1" fill="#b22234"/><rect y="6" width="20" height="1" fill="#b22234"/><rect y="8" width="20" height="1" fill="#b22234"/><rect y="10" width="20" height="1" fill="#b22234"/><rect y="12" width="20" height="1" fill="#b22234"/><rect width="9" height="6" rx="1" fill="#3c3b6e"/><circle cx="1.5" cy="1.4" r=".45" fill="#fff"/><circle cx="2.8" cy="1.4" r=".45" fill="#fff"/><circle cx="4.1" cy="1.4" r=".45" fill="#fff"/><circle cx="5.4" cy="1.4" r=".45" fill="#fff"/><circle cx="6.7" cy="1.4" r=".45" fill="#fff"/><circle cx="8" cy="1.4" r=".45" fill="#fff"/><circle cx="1.5" cy="3" r=".45" fill="#fff"/><circle cx="2.8" cy="3" r=".45" fill="#fff"/><circle cx="4.1" cy="3" r=".45" fill="#fff"/><circle cx="5.4" cy="3" r=".45" fill="#fff"/><circle cx="6.7" cy="3" r=".45" fill="#fff"/><circle cx="8" cy="3" r=".45" fill="#fff"/><circle cx="1.5" cy="4.6" r=".45" fill="#fff"/><circle cx="2.8" cy="4.6" r=".45" fill="#fff"/><circle cx="4.1" cy="4.6" r=".45" fill="#fff"/><circle cx="5.4" cy="4.6" r=".45" fill="#fff"/><circle cx="6.7" cy="4.6" r=".45" fill="#fff"/><circle cx="8" cy="4.6" r=".45" fill="#fff"/></svg></a><a class="locale-flag{{FLAG_CLASS_es}}" href="/es" aria-label="{{flags.es}}"{{FLAG_ARIA_es}}><svg viewBox="0 0 20 14" width="20" height="14" aria-hidden="true" focusable="false"><rect width="20" height="14" rx="2" fill="#aa151b"/><rect y="3.5" width="20" height="7" fill="#f1bf00"/></svg></a><a class="locale-flag{{FLAG_CLASS_zh-CN}}" href="/zh-CN" aria-label="{{flags.zhCN}}"{{FLAG_ARIA_zh-CN}}><svg viewBox="0 0 20 14" width="20" height="14" aria-hidden="true" focusable="false"><rect width="20" height="14" rx="2" fill="#de2910"/><path d="M3.4 2.2l.62 1.9h2l-1.62 1.18.62 1.9-1.62-1.17-1.62 1.17.62-1.9-1.62-1.18h2Z" fill="#ffde00"/><circle cx="7.4" cy="2.2" r=".7" fill="#ffde00"/><circle cx="8.6" cy="4" r=".7" fill="#ffde00"/><circle cx="8.6" cy="6.2" r=".7" fill="#ffde00"/><circle cx="7.4" cy="8" r=".7" fill="#ffde00"/></svg></a></nav>"""
anchor = '<button class="menu-button"'
assert anchor in t
t = t.replace(anchor, FLAGS + "\n  " + anchor, 1)

open(f"{ROOT}/scripts/home-i18n/home.template.html", "w", encoding="utf8").write(t)
print("template escrito:", len(t), "bytes")
