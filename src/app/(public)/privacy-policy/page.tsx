export default function PrivacyPolicy() {
  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-3xl pt-8">
        Política de Privacidade • <span className="font-semibold">dot</span>
      </h2>

      <p>
        <span className="font-bold">Última atualização:</span> 31/07/2026
      </p>

      <p>
        Esta Política de Privacidade descreve como o{" "}
        <span className="font-bold">dot</span> (&ldquo;nós&rdquo;,{" "}
        &ldquo;aplicativo&rdquo;) coleta, usa e protege os dados dos usuários
        (&ldquo;você&rdquo;), em conformidade com a Lei Geral de Proteção de
        Dados (LGPD — Lei nº 13.709/2018).
      </p>

      <p>
        O dot é um projeto de código aberto, mantido por pessoa física, com
        código-fonte disponível publicamente no GitHub. Isso não altera as
        responsabilidades sobre o tratamento dos dados dos usuários que utilizam
        a versão hospedada do serviço.
      </p>

      <h3 className="text-2xl pt-4 font-semibold">
        1. Quem é o responsável pelos dados
      </h3>
      <p>
        O tratamento dos dados coletados pelo dot é de responsabilidade de
        pessoa física, que pode ser contatada através de
        nathanpatrzyk11@gmail.com.
      </p>

      <h3 className="text-2xl pt-4 font-semibold">2. Quais dados coletamos</h3>
      <p>
        Ao criar uma conta através do login com Google, coletamos os seguintes
        dados fornecidos pelo próprio Google:
      </p>
      <ul className="list-disc pl-6 space-y-2">
        <li>Nome</li>
        <li>Endereço de e-mail</li>
        <li>Foto de perfil (se disponível)</li>
        <li>Identificador único da conta Google</li>
      </ul>
      <p>
        Além disso, coletamos os dados que você mesmo insere ao usar o
        aplicativo:
      </p>
      <ul className="list-disc pl-6 space-y-2">
        <li>Tarefas cadastradas e seu conteúdo</li>
        <li>Datas, status e demais informações associadas às tarefas</li>
      </ul>
      <p>
        Não coletamos dados de localização, dados de pagamento, nem realizamos
        rastreamento por cookies de analytics ou publicidade. Utilizamos apenas
        o cookie de sessão estritamente necessário para manter você autenticado.
      </p>

      <h3 className="text-2xl pt-4 font-semibold">3. Como usamos os dados</h3>
      <p>Os dados são usados exclusivamente para:</p>
      <ul className="list-disc pl-6 space-y-2">
        <li>Autenticar sua conta e manter sua sessão ativa</li>
        <li>Exibir, salvar e sincronizar suas tarefas</li>
        <li>Garantir que cada usuário acesse apenas os próprios dados</li>
      </ul>
      <p>
        Não vendemos, alugamos ou compartilhamos seus dados com terceiros para
        fins de marketing.
      </p>

      <h3 className="text-2xl pt-4 font-semibold">
        4. Com quem compartilhamos dados
      </h3>
      <p>
        Para funcionar, o dot depende dos seguintes serviços de terceiros, que
        também tratam dados conforme suas próprias políticas:
      </p>
      <ul className="list-disc pl-6 space-y-2">
        <li>
          <span className="font-bold">Google</span> — provedor de autenticação
          (login via Google OAuth)
        </li>
        <li>
          <span className="font-bold">Cloudflare</span> — provedor de hospedagem
          e armazenamento (Cloudflare Pages e D1)
        </li>
      </ul>
      <p>Nenhum outro terceiro tem acesso aos seus dados.</p>

      <h3 className="text-2xl pt-4 font-semibold">
        5. Onde os dados são armazenados
      </h3>
      <p>Os dados são armazenados em infraestrutura da Cloudflare.</p>

      <h3 className="text-2xl pt-4 font-semibold">
        6. Por quanto tempo guardamos os dados
      </h3>
      <p>Seus dados são mantidos enquanto sua conta estiver ativa.</p>
      <p>
        Ao solicitar a exclusão da conta dentro do próprio aplicativo, sua conta
        é imediatamente desativada e entra em um período de carência de 30 dias.
        Durante esse período, os dados não são utilizados, mas ainda não são
        apagados definitivamente — isso permite reverter a exclusão caso tenha
        sido um engano, bastando fazer login novamente e confirmar a reativação
        dentro do prazo.
      </p>
      <p>
        Após o fim do período de carência, os dados são apagados permanentemente
        e não podem mais ser recuperados. Não enviamos e-mails sobre esse
        processo — todo o fluxo de exclusão e eventual cancelamento deve ser
        feito dentro do próprio aplicativo.
      </p>

      <h3 className="text-2xl pt-4 font-semibold">
        7. Seus direitos como titular dos dados
      </h3>
      <p>Conforme a LGPD, você tem direito a:</p>
      <ul className="list-disc pl-6 space-y-2">
        <li>Confirmar a existência de tratamento dos seus dados</li>
        <li>Acessar os dados que temos sobre você</li>
        <li>Corrigir dados incompletos, inexatos ou desatualizados</li>
        <li>Solicitar a exclusão dos seus dados e da sua conta</li>
        <li>Solicitar a portabilidade dos seus dados</li>
        <li>Revogar o consentimento a qualquer momento</li>
      </ul>
      <p>
        Para exercer qualquer um desses direitos, entre em contato através de
        nathanpatrzyk11@gmail.com.
      </p>

      <h3 className="text-2xl pt-4 font-semibold">8. Segurança</h3>
      <p>
        Adotamos medidas técnicas para proteger seus dados, incluindo conexão
        criptografada (HTTPS) em todo o aplicativo e controle de acesso para
        garantir que cada usuário só visualize as próprias tarefas. Apesar
        disso, nenhum sistema é 100% livre de riscos, e não podemos garantir
        segurança absoluta contra incidentes fora do nosso controle razoável.
      </p>

      <h3 className="text-2xl pt-4 font-semibold">9. Idade mínima</h3>
      <p>
        O dot não é destinado a menores de 18 anos. Ao usar o aplicativo, você
        declara ter pelo menos 18 anos de idade.
      </p>

      <h3 className="text-2xl pt-4 font-semibold">10. Código aberto</h3>
      <p>
        O código-fonte do dot é público e pode ser auditado por qualquer pessoa
        no GitHub. Isso não significa que dados de usuários estejam expostos —
        apenas o código da aplicação é aberto, não o banco de dados nem as
        informações pessoais armazenadas.
      </p>

      <h3 className="text-2xl pt-4 font-semibold">
        11. Alterações nesta política
      </h3>
      <p>
        Esta política pode ser atualizada periodicamente. Alterações
        significativas serão comunicadas através do próprio aplicativo.
      </p>

      <h3 className="text-2xl pt-4 font-semibold">12. Contato</h3>
      <p>
        Dúvidas sobre esta política ou sobre o tratamento dos seus dados podem
        ser enviadas para nathanpatrzyk11@gmail.com.
      </p>
    </div>
  );
}
