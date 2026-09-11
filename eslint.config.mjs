import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // ── Isolamento de mundos (regra R3 do MIKE-ARQUITETURA) ──
  // Arquivo do mundo Agrofy nunca importa componente do mundo mineração,
  // e vice-versa. Genéricos (ui/*, scroll-*, aurora, logo-intro, …) são
  // compartilhados por design e ficam fora das listas.
  {
    files: ["**/(agrofy)/**"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: [
                "@/components/mining-*",
                "@/components/hero-*",
                "@/components/bento-solutions",
                "@/components/stats-bar",
                "@/components/telemetry-card",
                "@/components/tech-telemetry",
                "@/components/how-it-works",
                "@/components/outcomes-section",
                "@/components/faq-section",
                "@/components/product-card",
                "@/components/solution-card",
                "@/components/client-carousel",
                "@/components/experience-lab",
                "@/components/service-page",
              ],
              message:
                "Componente do mundo mineração não pode ser importado pelo mundo Agrofy (isolamento R3).",
            },
          ],
        },
      ],
    },
  },
  {
    files: ["**/(mineracao)/**"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@/components/agro-*"],
              message:
                "Componente do mundo Agrofy não pode ser importado pelo mundo mineração (isolamento R3).",
            },
          ],
        },
      ],
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
