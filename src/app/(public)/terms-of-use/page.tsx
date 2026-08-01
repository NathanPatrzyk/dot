export default function TermsOfUse() {
  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-3xl pt-8">
        Termos de Uso • <span className="font-semibold">dot</span>
      </h2>

      <p>
        <span className="font-bold">Última atualização:</span> 31/07/2026
      </p>

      <p>
        Ao usar o <span className="font-bold">dot</span>, você concorda com os
        termos abaixo. Se não concordar, não utilize o aplicativo.
      </p>

      <h3 className="text-2xl pt-4 font-semibold">1. Sobre o serviço</h3>
      <p>
        O dot é um aplicativo de gerenciamento de tarefas (to-do list),
        oferecido gratuitamente, mantido por pessoa física, com código-fonte
        aberto disponível no GitHub.
      </p>

      <h3 className="text-2xl pt-4 font-semibold">2. Cadastro e acesso</h3>
      <p>
        O acesso ao dot é feito exclusivamente através de login com sua conta
        Google. Ao fazer login, você autoriza o compartilhamento de nome, e-mail
        e foto de perfil, conforme descrito na nossa Política de Privacidade.
      </p>
      <p>
        Você é responsável por manter o acesso à sua conta Google segura, já que
        é através dela que se autentica no dot.
      </p>

      <h3 className="text-2xl pt-4 font-semibold">3. Uso permitido</h3>
      <p>Você concorda em usar o dot apenas para fins lícitos, e em não:</p>
      <ul className="list-disc pl-6 space-y-2">
        <li>Tentar acessar dados de outros usuários</li>
        <li>Tentar comprometer a segurança ou o funcionamento do aplicativo</li>
        <li>Utilizar o serviço para armazenar conteúdo ilegal</li>
      </ul>

      <h3 className="text-2xl pt-4 font-semibold">
        4. Disponibilidade do serviço
      </h3>
      <p>
        O dot é fornecido &ldquo;como está&rdquo; (&ldquo;as is&rdquo;), sem
        garantias de disponibilidade contínua, ausência de erros ou adequação a
        uma finalidade específica. Por ser um projeto mantido por pessoa física,
        pode haver interrupções, manutenções ou descontinuação do serviço sem
        aviso prévio.
      </p>

      <h3 className="text-2xl pt-4 font-semibold">
        5. Limitação de responsabilidade
      </h3>
      <p>
        Na máxima extensão permitida pela lei, não nos responsabilizamos por:
      </p>
      <ul className="list-disc pl-6 space-y-2">
        <li>
          Perda de dados decorrente de falhas técnicas, indisponibilidade de
          terceiros (Google, Cloudflare) ou uso indevido da conta pelo próprio
          usuário
        </li>
        <li>
          Danos indiretos, incidentais ou consequenciais decorrentes do uso ou
          impossibilidade de uso do aplicativo
        </li>
      </ul>
      <p>
        Recomendamos que você não utilize o dot como único meio de armazenamento
        de informações críticas.
      </p>

      <h3 className="text-2xl pt-4 font-semibold">6. Exclusão de conta</h3>
      <p>
        Você pode solicitar a exclusão da sua conta a qualquer momento,
        diretamente dentro do aplicativo. Ao solicitar, sua conta é
        imediatamente desativada e entra em um período de carência de 30 dias,
        durante o qual você pode reverter a exclusão fazendo login novamente e
        confirmando a reativação.
      </p>
      <p>
        Após o fim desse período, seus dados são apagados permanentemente e não
        podem mais ser recuperados. Não há envio de e-mails sobre esse processo
        — todo o fluxo, incluindo o cancelamento da exclusão, deve ser feito
        dentro do próprio aplicativo.
      </p>
      <p>
        Também nos reservamos o direito de suspender ou encerrar contas que
        violem estes termos.
      </p>

      <h3 className="text-2xl pt-4 font-semibold">7. Idade mínima</h3>
      <p>
        O dot não é destinado a menores de 18 anos. Ao usar o aplicativo, você
        declara ter pelo menos 18 anos de idade.
      </p>

      <h3 className="text-2xl pt-4 font-semibold">
        8. Propriedade intelectual e código aberto
      </h3>
      <p>
        O código-fonte do dot está disponível publicamente no GitHub sob a
        licença MIT. Isso se refere ao código da aplicação — não inclui os dados
        pessoais ou tarefas cadastradas pelos usuários, que permanecem privados
        e protegidos conforme a Política de Privacidade.
      </p>

      <h3 className="text-2xl pt-4 font-semibold">
        9. Alterações nestes termos
      </h3>
      <p>
        Estes termos podem ser atualizados periodicamente. O uso continuado do
        dot após alterações significa concordância com os novos termos.
      </p>

      <h3 className="text-2xl pt-4 font-semibold">10. Lei aplicável</h3>
      <p>
        Estes termos são regidos pelas leis da República Federativa do Brasil.
      </p>

      <h3 className="text-2xl pt-4 font-semibold">11. Contato</h3>
      <p>
        Dúvidas sobre estes termos podem ser enviadas para
        nathanpatrzyk11@gmail.com.
      </p>
    </div>
  );
}
