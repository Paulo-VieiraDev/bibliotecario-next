import Image from "next/image";
import {
  BookText,
  Repeat2,
  BarChart2,
  UserCheck,
  RotateCcw,
  ShieldAlert,
  BarChart3,
  Eye,
  Target,
  Laptop,
  GitBranch,
  Code,
  Braces,
  Terminal,
  Atom,
  Cpu,
} from 'lucide-react';

export default function Home() {
  return (
    // Fundo principal que será o azul mais claro, para a página toda
    <div className="bg-blue-50 min-h-screen w-full font-sans">

      {/* Hero Section - Fundo com gradiente azul (mantido) */}
      <section className="relative flex items-center justify-center min-h-screen text-white px-4 py-16 overflow-hidden bg-gradient-to-br from-blue-300 via-blue-700 to-blue-900">
        {/* Janela Flutuante - Ocupa grande parte da área */}
        <div className="relative z-20 w-[95%] md:w-[90%] h-[90vh] rounded-3xl shadow-2xl bg-gray-900 p-8 md:p-12 lg:p-16 flex items-center justify-between ring-2 ring-blue-500/50">
          {/* Conteúdo Principal (Alinhado à Esquerda) */}
          <div className="relative flex flex-col items-start text-left max-w-3xl lg:max-w-4xl">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-white mb-4 leading-tight drop-shadow-lg">
              Bibliotecário Digital
            </h1>
            <h2 className="text-lg md:text-xl lg:text-2xl text-blue-100 mb-8 max-w-3xl drop-shadow">
              Sistema de gerenciamento de biblioteca desenvolvido para o Colégio Estadual de Arapuã,
              facilitando o controle, empréstimo e organização de livros escolares.
            </h2>
            <a href="#sobre" className="px-12 py-5 bg-blue-600 text-white font-semibold rounded-xl shadow-lg hover:bg-blue-700 transition transform hover:scale-105 active:scale-95 active:shadow-inner">
              Saiba mais
            </a>
          </div>
          {/* Logo do Colégio - Grande, dentro da janela, um pouco mais ao centro */}
          {/* MODIFICAÇÕES AQUI: Ajuste no tamanho e posicionamento 'right' para md e lg */}
          <div className="absolute top-1/2 right-4 md:right-20 lg:right-32 transform -translate-y-1/2 z-30 flex-shrink-0 hidden lg:block">
            <Image src="/colegio-arapua-logo.png" alt="Colégio Estadual de Arapuã" width={300} height={300} className="drop-shadow-lg opacity-70 lg:w-[400px] lg:h-[400px]" />
          </div>
        </div>
      </section>

      {/* Sobre o Projeto */}
      {/* Fundo definido como bg-blue-50 */}
      <section id="sobre" className="relative bg-blue-50 py-20 px-4 md:px-8 overflow-hidden">
        <div className="max-w-3xl lg:max-w-4xl xl:max-w-5xl mx-auto py-10 md:py-16 text-center">
          <h3 className="text-4xl lg:text-5xl font-extrabold text-blue-800 mb-6 leading-tight drop-shadow-sm">
            Sobre o Projeto
          </h3>
          <p className="text-lg md:text-xl text-gray-700 mb-6 leading-relaxed max-w-2xl mx-auto">
            Este software foi criado para a conclusão do curso de Análise e Desenvolvimento de Sistemas (2025) nas Faculdades Integradas do Vale do Ivaí - Univale.
            O objetivo principal é modernizar e facilitar o acesso à biblioteca do Colégio Estadual de Arapuã,
            promovendo ativamente a leitura e otimizando a organização do acervo escolar.
          </p>
          <p className="text-base md:text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto">
            O sistema oferece funcionalidades abrangentes para o cadastro eficiente de livros, controle preciso de empréstimos,
            gerenciamento simplificado de devoluções e geração de relatórios detalhados, tudo apresentado de forma intuitiva
            e fácil de usar.
          </p>
        </div>
      </section>

      {/* Funcionalidades do Sistema */}
      {/* Fundo definido como bg-blue-100 para um pequeno contraste com a seção anterior */}
      <section className="relative max-w-6xl mx-auto py-20 px-4 overflow-hidden">
        <h3 className="text-4xl lg:text-5xl font-extrabold text-blue-800 mb-12 text-center drop-shadow-sm">
          Funcionalidades do Sistema
        </h3>

        <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12 z-10">
          {/* Feature Card 1: Cadastro de Livros */}
          <div className="bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center text-center border-b-4 border-blue-500 transform hover:scale-105 transition duration-300 ease-in-out">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-6 shadow-md">
              <BookText size={48} className="text-blue-700" />
            </div>
            <h4 className="text-2xl font-extrabold text-blue-700 mb-3 drop-shadow-sm">Cadastro de Livros</h4>
            <p className="text-gray-700 text-base leading-relaxed">
              Adicione, edite e organize o acervo da biblioteca de forma prática e rápida, com detalhes completos de cada obra.
            </p>
          </div>
          {/* Feature Card 2: Empréstimos e Devoluções */}
          <div className="bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center text-center border-b-4 border-green-500 transform hover:scale-105 transition duration-300 ease-in-out">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6 shadow-md">
              <Repeat2 size={48} className="text-green-700" />
            </div>
            <h4 className="text-2xl font-extrabold text-blue-700 mb-3 drop-shadow-sm">Empréstimos e Devoluções</h4>
            <p className="text-gray-700 text-base leading-relaxed">
              Gerencie todo o fluxo de empréstimos e devoluções, com um histórico detalhado e rastreável para cada usuário.
            </p>
          </div>
          {/* Feature Card 3: Relatórios e Estatísticas */}
          <div className="bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center text-center border-b-4 border-purple-500 transform hover:scale-105 transition duration-300 ease-in-out">
            <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mb-6 shadow-md">
              <BarChart2 size={48} className="text-purple-700" />
            </div>
            <h4 className="text-2xl font-extrabold text-blue-700 mb-3 drop-shadow-sm">Relatórios e Estatísticas</h4>
            <p className="text-gray-700 text-base leading-relaxed">
              Acompanhe o uso da biblioteca com relatórios claros de movimentação e estatísticas de leitura, facilitando a análise.
            </p>
          </div>
        </div>
      </section>

      {/* Tecnologias Utilizadas */}
      {/* Fundo definido como bg-blue-50 */}
      <section className="relative bg-blue-50 py-20 px-4 overflow-hidden">
        <h3 className="text-4xl lg:text-5xl font-extrabold text-blue-800 mb-12 text-center drop-shadow-sm">
          Tecnologias Utilizadas
        </h3>

        <div className="max-w-6xl mx-auto grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 justify-items-center relative z-10">
          {/* Next.js Card */}
          <div className="relative w-full max-w-64 h-80 rounded-2xl shadow-lg overflow-hidden flex flex-col items-center bg-gray-100 transform hover:scale-105 transition duration-300 ease-in-out">
            <div className="w-full h-full absolute inset-0">
              <Image src="/cards/nextjs-bg.png" alt="Next.js Background" fill className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
            </div>
            <div className="relative flex flex-col items-center justify-start w-full h-full z-10 pt-8 px-6">
              <div className="mb-6 flex items-center justify-center w-16 h-16 rounded-full bg-white/80 shadow-lg">
                <Image src="/icons/nextjs.png" alt="Next.js Logo" width={40} height={40} />
              </div>
              <h4 className="text-white text-xl font-bold mb-2 text-center drop-shadow-lg">Next.js</h4>
              <p className="text-white text-sm text-center drop-shadow-lg">Framework moderno para aplicações web rápidas, seguras e escaláveis.</p>
            </div>
          </div>
          {/* Tailwind CSS Card */}
          <div className="relative w-full max-w-64 h-80 rounded-2xl shadow-lg overflow-hidden flex flex-col items-center bg-gray-100 transform hover:scale-105 transition duration-300 ease-in-out">
            <div className="w-full h-full absolute inset-0">
              <Image src="/cards/tailwindcss-bg.png" alt="Tailwind CSS Background" fill className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-blue-900/90 via-blue-700/60 to-transparent" />
            </div>
            <div className="relative flex flex-col items-center justify-start w-full h-full z-10 pt-8 px-6">
              <div className="mb-6 flex items-center justify-center w-16 h-16 rounded-full bg-white/80 shadow-lg">
                <Image src="/icons/tailwindcss.png" alt="Tailwind CSS Logo" width={40} height={40} />
              </div>
              <h4 className="text-white text-xl font-bold mb-2 text-center drop-shadow-lg">Tailwind CSS</h4>
              <p className="text-white text-sm text-center drop-shadow-lg">Estilização ágil e responsiva, garantindo visual moderno em qualquer dispositivo.</p>
            </div>
          </div>
          {/* Supabase Card */}
          <div className="relative w-full max-w-64 h-80 rounded-2xl shadow-lg overflow-hidden flex flex-col items-center bg-gray-100 transform hover:scale-105 transition duration-300 ease-in-out">
            <div className="w-full h-full absolute inset-0">
              <Image src="/cards/supabase-bg.png" alt="Supabase Background" fill className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-green-900/90 via-green-700/60 to-transparent" />
            </div>
            <div className="relative flex flex-col items-center justify-start w-full h-full z-10 pt-8 px-6">
              <div className="mb-6 flex items-center justify-center w-16 h-16 rounded-full bg-white/80 shadow-lg">
                <Image src="/icons/supabase.png" alt="Supabase Logo" width={40} height={40} />
              </div>
              <h4 className="text-white text-xl font-bold mb-2 text-center drop-shadow-lg">Supabase</h4>
              <p className="text-white text-sm text-center drop-shadow-lg">Banco de dados em nuvem, seguro e escalável, utilizado para armazenar livros, usuários e movimentações em tempo real.</p>
            </div>
          </div>
          {/* Shadcn UI Card */}
          <div className="relative w-full max-w-64 h-80 rounded-2xl shadow-lg overflow-hidden flex flex-col items-center bg-gray-100 transform hover:scale-105 transition duration-300 ease-in-out">
            <div className="w-full h-full absolute inset-0">
              <Image src="/cards/shadcnui-bg.png" alt="Shadcn UI Background" fill className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/95 via-gray-800/80 to-transparent" />
            </div>
            <div className="relative flex flex-col items-center justify-start w-full h-full z-10 pt-8 px-6">
              <div className="mb-6 flex items-center justify-center w-16 h-16 rounded-full bg-white/80 shadow-lg">
                <Image src="/icons/shadcnui.png" alt="Shadcn UI Logo" width={40} height={40} />
              </div>
              <h4 className="text-white text-xl font-bold mb-2 text-center drop-shadow-lg">Shadcn UI</h4>
              <p className="text-white text-sm text-center drop-shadow-lg">Biblioteca de componentes React acessíveis e modernos, garantindo experiência de usuário profissional e consistente.</p>
            </div>
          </div>
        </div>
        <div className="max-w-4xl mx-auto mt-16 text-center text-gray-700 text-base leading-relaxed">
          <p className="mb-4"><span className="font-extrabold text-blue-800">Supabase</span> foi utilizado como backend-as-a-service, permitindo autenticação, armazenamento e consultas em tempo real, sem necessidade de servidor próprio.</p>
          <p><span className="font-extrabold text-blue-800">Shadcn UI</span> trouxe componentes de interface elegantes, responsivos e acessíveis, elevando o padrão visual e de usabilidade do sistema.</p>
        </div>
      </section>

      {/* Diferenciais e Benefícios */}
      {/* Fundo definido como bg-blue-100 */}
      <section className="relative max-w-6xl mx-auto py-20 px-4 overflow-hidden ">
        <h3 className="text-4xl lg:text-5xl font-extrabold text-blue-800 mb-12 text-center drop-shadow-sm">
          Diferenciais e Benefícios
        </h3>

        {/* Layout em Grid com Cards */}
        <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12 z-10">
          {/* Facilidade de uso */}
          <div className="flex flex-col items-center p-6 rounded-2xl shadow-lg bg-white hover:shadow-2xl transition duration-300 ease-in-out transform hover:scale-105">
            <div className="w-16 h-16 mb-4 flex items-center justify-center rounded-full bg-blue-100 text-blue-800">
              <UserCheck size={32} />
            </div>
            <h4 className="text-xl font-extrabold mb-2 text-blue-800 text-center">Facilidade de uso</h4>
            <p className="text-gray-700 text-base text-center">Interface intuitiva para toda a equipe escolar.</p>
          </div>
          {/* Modernização do controle */}
          <div className="flex flex-col items-center p-6 rounded-2xl shadow-lg bg-white hover:shadow-2xl transition duration-300 ease-in-out transform hover:scale-105">
            <div className="w-16 h-16 mb-4 flex items-center justify-center rounded-full bg-blue-100 text-blue-800">
              <RotateCcw size={32} />
            </div>
            <h4 className="text-xl font-extrabold mb-2 text-blue-800 text-center">Controle Moderno</h4>
            <p className="text-gray-700 text-base text-center">Sistema atualizado para gerenciar o acervo de forma eficiente.</p>
          </div>
          {/* Redução de perdas */}
          <div className="flex flex-col items-center p-6 rounded-2xl shadow-lg bg-white hover:shadow-2xl transition duration-300 ease-in-out transform hover:scale-105">
            <div className="w-16 h-16 mb-4 flex items-center justify-center rounded-full bg-blue-100 text-blue-800">
              <ShieldAlert size={32} />
            </div>
            <h4 className="text-xl font-extrabold mb-2 text-blue-800 text-center">Menos Perdas</h4>
            <p className="text-gray-700 text-base text-center">Diminuição significativa de livros perdidos ou extraviados.</p>
          </div>
          {/* Relatórios para decisão */}
          <div className="flex flex-col items-center p-6 rounded-2xl shadow-lg bg-white hover:shadow-2xl transition duration-300 ease-in-out transform hover:scale-105">
            <div className="w-16 h-16 mb-4 flex items-center justify-center rounded-full bg-blue-100 text-blue-800">
              <BarChart3 size={32} />
            </div>
            <h4 className="text-xl font-extrabold mb-2 text-blue-800 text-center">Decisões Inteligentes</h4>
            <p className="text-gray-700 text-base text-center">Informações claras para auxiliar na gestão escolar.</p>
          </div>
          {/* Visual intuitivo */}
          <div className="flex flex-col items-center p-6 rounded-2xl shadow-lg bg-white hover:shadow-2xl transition duration-300 ease-in-out transform hover:scale-105">
            <div className="w-16 h-16 mb-4 flex items-center justify-center rounded-full bg-blue-100 text-blue-800">
              <Eye size={32} />
            </div>
            <h4 className="text-xl font-extrabold mb-2 text-blue-800 text-center">Fácil de Entender</h4>
            <p className="text-gray-700 text-base text-center">Design moderno e adaptável a qualquer tela.</p>
          </div>
          {/* Pensado para a escola */}
          <div className="flex flex-col items-center p-6 rounded-2xl shadow-lg bg-white hover:shadow-2xl transition duration-300 ease-in-out transform hover:scale-105">
            <div className="w-16 h-16 mb-4 flex items-center justify-center rounded-full bg-blue-100 text-blue-800">
              <Target size={32} />
            </div>
            <h4 className="text-xl font-extrabold mb-2 text-blue-800 text-center">Feito Sob Medida</h4>
            <p className="text-gray-700 text-base text-center">Desenvolvido pensando nas necessidades da sua escola.</p>
          </div>
        </div>
      </section>

      {/* Sobre o Autor - Agora inclui o conteúdo do rodapé */}
      <section className="relative bg-gray-900 py-20 px-4 overflow-hidden text-white">
        {/* Ícones de Tecnologia no Fundo (absoulte, ocultos em mobile) - POSIÇÕES AJUSTADAS */}
        <div className="hidden md:block absolute inset-0 pointer-events-none">
          {/* Lado Esquerdo - AJUSTADO */}
          <Laptop size={300} className="absolute top-1/2 left-[-150px] text-gray-50 opacity-20 transform -translate-y-1/2 -rotate-15" /> {/* Maior e centralizado na altura */}
          <Code size={200} className="absolute bottom-1/4 left-[15%] text-gray-100 opacity-30 rotate-10" /> {/* Mais para baixo e um pouco para dentro */}
          <GitBranch size={150} className="absolute top-10 left-[15%] text-gray-50 opacity-20 rotate-45" /> {/* Mais para cima e para dentro */}

          {/* Lado Direito */}
          <Atom size={300} className="absolute top-1/4 right-[-100px] text-gray-50 opacity-20 transform translate-x-1/2 rotate-30" /> {/* Maior e mais para fora */}
          <Braces size={200} className="absolute bottom-1/4 right-[20%] text-gray-100 opacity-30 -rotate-20" />
          <Terminal size={150} className="absolute top-10 right-[5%] text-gray-50 opacity-20 -rotate-5" />
          <Cpu size={100} className="absolute bottom-5 right-[0%] text-gray-100 opacity-15 rotate-60" />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center text-center">
          <Image src="/autor-paulo.jpg" alt="Paulo Henrique Sanches Vieira" width={120} height={120} className="rounded-full mb-4 border-4 shadow-lg" />
          <h4 className="text-3xl font-bold mb-3">Paulo Henrique Sanches Vieira</h4>
          <p className="text-gray-300 text-base leading-relaxed max-w-2xl mb-12">
            Morador de Arapuã/PR, Analista de Sistemas e responsável pelo desenvolvimento do projeto. Atualmente trabalho no Colégio Estadual de Arapuã, buscando sempre inovar e contribuir para a educação local.
          </p>

          {/* Conteúdo do Rodapé movido para dentro da seção "Sobre o Autor" */}
          <div className="w-full pt-8 border-t border-gray-700">
            <p className="text-md mb-2">
              &copy; {new Date().getFullYear()} Paulo Vieira
            </p>
            <p className="text-sm text-gray-300">
              Projeto de Conclusão de Curso - Análise e Desenvolvimento de Sistemas (Univale)
            </p>
          </div>
        </div>
      </section>

    </div>
  );
}