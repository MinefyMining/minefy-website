import { getTranslations, setRequestLocale } from "next-intl/server";
import { pageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "privacy.metadata" });
  return pageMetadata({
    site: "mineracao",
    path: "/privacidade",
    title: t("title"),
    description: t("description"),
  });
}

export default async function PrivacyPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main data-hero-surface="theme" className="px-6 py-24">
      <article className="mx-auto max-w-3xl">
        <header className="mb-12 border-b border-border pb-8">
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-foreground text-balance">
            Política de Privacidade
          </h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Última atualização: 09 de setembro de 2026
          </p>
        </header>

        <div className="space-y-10 text-[15px] leading-relaxed text-muted-foreground">
          <p>
            A <strong className="text-foreground">MINEFY MINING SYSTEM LTDA</strong> (&quot;Minefy&quot;,
            &quot;nós&quot;), inscrita no CNPJ 64.107.365/0001-00, com sede em Nova Lima/MG, respeita a
            sua privacidade e trata dados pessoais em conformidade com a Lei nº 13.709/2018 (Lei Geral
            de Proteção de Dados — LGPD). Esta Política explica quais dados tratamos, com que finalidade,
            com que base legal, com quem compartilhamos e como você pode exercer seus direitos.
          </p>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">1. Controlador e Encarregado</h2>
            <p>
              O tratamento descrito nesta Política, quando a Minefy atua como controladora, é de
              responsabilidade da Minefy Mining System LTDA.
            </p>
            <p>
              <strong className="text-foreground">Encarregado pelo Tratamento de Dados Pessoais (DPO):</strong>{" "}
              Patryck Giovani (Encarregado Interino).{" "}
              <strong className="text-foreground">Contato:</strong>{" "}
              <a href="mailto:privacidade@minefymining.com" className="text-foreground underline underline-offset-4 hover:opacity-80 transition-opacity">
                privacidade@minefymining.com
              </a>
              . Use esse canal para qualquer solicitação relativa aos seus dados pessoais ou a esta Política.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">2. Quando somos controladora e quando somos operadora</h2>
            <p>
              Somos <strong className="text-foreground">controladora</strong> dos dados de visitantes do
              site, de contatos comerciais e de clientes com quem nos relacionamos diretamente. Somos{" "}
              <strong className="text-foreground">operadora</strong> quando tratamos dados por conta e
              ordem de um cliente — por exemplo, a telemetria dos ativos monitorados e os dados gerados
              por câmeras de segurança embarcadas. Nesses casos, o cliente é o controlador e define as
              finalidades; a Minefy atua conforme as instruções contratuais, nos termos do art. 39 da LGPD.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">3. Dados que tratamos e finalidades</h2>
            <h3 className="text-base font-semibold text-foreground pt-2">3.1. Visitantes do site</h3>
            <p>
              Dados de navegação e informações que você fornece voluntariamente em formulários de contato
              (como nome, e-mail e mensagem), usados para responder solicitações e melhorar o site. Cookies
              estritamente necessários mantêm o funcionamento das páginas; cookies adicionais, quando
              houver, são descritos na Seção 7.
            </p>
            <h3 className="text-base font-semibold text-foreground pt-2">3.2. Clientes e contatos comerciais</h3>
            <p>
              Dados de identificação e contato de representantes de clientes e prospects, além de dados de
              contratação e faturamento, usados para executar contratos, emitir cobranças, prestar suporte
              e manter comunicação comercial.
            </p>
            <h3 className="text-base font-semibold text-foreground pt-2">3.3. Telemetria de frota (plataforma ActiSky)</h3>
            <p>
              Dados de equipamento, funcionamento e localização coletados dos ativos monitorados de nossos
              clientes. Esses dados são operacionais do cliente; a Minefy os processa como operadora, para
              prestar o serviço de monitoramento e gestão de frota contratado.
            </p>
            <h3 className="text-base font-semibold text-foreground pt-2">3.4. Módulo de Segurança do Motorista (ADAS/DMS) — dado sensível</h3>
            <p>
              Quando o cliente contrata o módulo de monitoramento do motorista, os equipamentos podem
              captar imagem facial e inferências sobre o estado do condutor (por exemplo, sinais de
              sonolência, distração ou uso de telefone). Trata-se de dado pessoal sensível de natureza
              biométrica, nos termos dos arts. 5º e 11 da LGPD, e o tratamento observa as seguintes
              salvaguardas:
            </p>
            <ul className="list-disc space-y-2 pl-6">
              <li>
                <strong className="text-foreground">Papéis:</strong> o empregador do motorista é o
                controlador e define a finalidade (segurança operacional e prevenção de acidentes); a
                Minefy atua como operadora, sob o art. 39.
              </li>
              <li>
                <strong className="text-foreground">Base legal do controlador:</strong> cumprimento de
                obrigação e exercício regular de direito relacionados à segurança do trabalho, com apoio
                subsidiário no legítimo interesse na prevenção de acidentes.
              </li>
              <li>
                <strong className="text-foreground">Retenção da mídia:</strong> as imagens e vídeos de
                alarme são retidos por até 90 dias e então descartados de forma definitiva, salvo quando
                houver contestação ou dever legal de guarda.
              </li>
              <li>
                <strong className="text-foreground">Direito de contestação:</strong> o motorista pode
                contestar um alarme pelo mecanismo de contestação da plataforma, e a contestação suspende
                o descarte da mídia correspondente enquanto pendente.
              </li>
              <li>
                <strong className="text-foreground">Alarme sem imagem é indicativo, não probatório:</strong>{" "}
                alertas de comportamento que não acompanham imagem têm caráter apenas indicativo e não
                constituem, por si sós, prova para fins disciplinares.
              </li>
              <li>
                <strong className="text-foreground">Reconhecimento facial</strong> para identificação
                individual permanece desativado.
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">4. Bases legais</h2>
            <p>
              Conforme o caso, o tratamento se apoia em: execução de contrato e procedimentos preliminares
              (art. 7º, V); cumprimento de obrigação legal ou regulatória (art. 7º, II); legítimo interesse
              (art. 7º, IX), sempre ponderado com seus direitos; e, para dados sensíveis, as hipóteses do
              art. 11, notadamente cumprimento de obrigação legal/regulatória e exercício regular de direitos.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">5. Compartilhamento</h2>
            <p>
              Não vendemos dados pessoais. Compartilhamos dados apenas quando necessário: com prestadores
              de serviço e provedores de infraestrutura que atuam como operadores sob contrato e sob nossas
              instruções; com o cliente controlador, quando a Minefy atua como operadora; e com autoridades
              públicas quando exigido por lei ou ordem judicial.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">6. Transferência internacional e segurança</h2>
            <p>
              Parte da infraestrutura de tecnologia pode envolver provedores localizados no exterior;
              nesses casos, adotamos as salvaguardas exigidas pela LGPD. Empregamos medidas técnicas e
              organizacionais para proteger os dados, incluindo controle de acesso, registro de operações
              sobre dados sensíveis e criptografia em trânsito.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">7. Cookies</h2>
            <p>
              O site utiliza cookies estritamente necessários ao seu funcionamento. Caso sejam empregados
              cookies adicionais (por exemplo, de medição de audiência), esta seção será atualizada com a
              descrição de cada categoria e das opções de gerenciamento.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">8. Seus direitos</h2>
            <p>
              Nos termos do art. 18 da LGPD, você pode solicitar: confirmação da existência de tratamento;
              acesso aos dados; correção de dados incompletos, inexatos ou desatualizados; anonimização,
              bloqueio ou eliminação de dados desnecessários ou tratados em desconformidade; portabilidade;
              informação sobre compartilhamento; e revogação do consentimento, quando aplicável. Para
              exercer qualquer desses direitos, contate o Encarregado em{" "}
              <a href="mailto:privacidade@minefymining.com" className="text-foreground underline underline-offset-4 hover:opacity-80 transition-opacity">
                privacidade@minefymining.com
              </a>
              . Quando a Minefy atua como operadora, direcionaremos sua solicitação ao cliente controlador
              ou o apoiaremos no atendimento, conforme o caso.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">9. Vigência e atualizações</h2>
            <p>
              Esta Política pode ser atualizada a qualquer tempo para refletir mudanças legais,
              operacionais ou tecnológicas. A data no topo indica a última revisão. Recomendamos consulta
              periódica.
            </p>
          </section>
        </div>
      </article>
    </main>
  );
}
