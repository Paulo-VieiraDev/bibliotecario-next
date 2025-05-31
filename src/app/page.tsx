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
import { FeatureCard } from "@/components/home/feature-card"
import { TechCard } from "@/components/home/tech-card"
import { BenefitCard } from "@/components/home/benefit-card"

const features = [
  {
    icon: BookText,
    title: "Cadastro de Livros",
    description: "Adicione, edite e organize o acervo da biblioteca de forma prática e rápida, com detalhes completos de cada obra.",
    borderColor: "border-blue-500",
    iconColor: "text-blue-700",
    bgColor: "bg-blue-100"
  },
  {
    icon: Repeat2,
    title: "Empréstimos e Devoluções",
    description: "Gerencie todo o fluxo de empréstimos e devoluções, com um histórico detalhado e rastreável para cada usuário.",
    borderColor: "border-green-500",
    iconColor: "text-green-700",
    bgColor: "bg-green-100"
  },
  {
    icon: BarChart2,
    title: "Relatórios e Estatísticas",
    description: "Acompanhe o uso da biblioteca com relatórios claros de movimentação e estatísticas de leitura, facilitando a análise.",
    borderColor: "border-purple-500",
    iconColor: "text-purple-700",
    bgColor: "bg-purple-100"
  }
]

const technologies = [
  {
    title: "Next.js",
    description: "Framework moderno para aplicações web rápidas, seguras e escaláveis.",
    iconSrc: "/icons/nextjs.png",
    bgSrc: "/cards/nextjs-bg.png",
    gradientFrom: "from-black/60",
    gradientVia: "via-black/30"
  },
  {
    title: "Tailwind CSS",
    description: "Estilização ágil e responsiva, garantindo visual moderno em qualquer dispositivo.",
    iconSrc: "/icons/tailwindcss.png",
    bgSrc: "/cards/tailwindcss-bg.png",
    gradientFrom: "from-blue-900/90",
    gradientVia: "via-blue-700/60"
  },
  {
    title: "Supabase",
    description: "Banco de dados em nuvem, seguro e escalável, utilizado para armazenar livros, usuários e movimentações em tempo real.",
    iconSrc: "/icons/supabase.png",
    bgSrc: "/cards/supabase-bg.png",
    gradientFrom: "from-green-900/90",
    gradientVia: "via-green-700/60"
  },
  {
    title: "Shadcn UI",
    description: "Biblioteca de componentes React acessíveis e modernos, garantindo experiência de usuário profissional e consistente.",
    iconSrc: "/icons/shadcnui.png",
    bgSrc: "/cards/shadcnui-bg.png",
    gradientFrom: "from-gray-900/80",
    gradientVia: "via-gray-800/60"
  },
  {
    title: "Vercel",
    description: "Plataforma de deploy e hospedagem que oferece performance, segurança e escalabilidade para aplicações web modernas.",
    iconSrc: "/icons/vercel.png",
    bgSrc: "/cards/vercel-bg.png",
    gradientFrom: "from-black/90",
    gradientVia: "via-black/90"
  }
]

const benefits = [
  {
    icon: UserCheck,
    title: "Facilidade de uso",
    description: "Interface intuitiva para toda a equipe escolar."
  },
  {
    icon: RotateCcw,
    title: "Controle Moderno",
    description: "Sistema atualizado para gerenciar o acervo de forma eficiente."
  },
  {
    icon: ShieldAlert,
    title: "Menos Perdas",
    description: "Diminuição significativa de livros perdidos ou extraviados."
  },
  {
    icon: BarChart3,
    title: "Decisões Inteligentes",
    description: "Informações claras para auxiliar na gestão escolar."
  },
  {
    icon: Eye,
    title: "Fácil de Entender",
    description: "Design moderno e adaptável a qualquer tela."
  },
  {
    icon: Target,
    title: "Pensado para a escola",
    description: "Sistema desenvolvido especificamente para o ambiente escolar."
  }
]

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
            <a href="/login" className="px-12 py-5 bg-blue-600 text-white font-semibold rounded-xl shadow-lg hover:bg-blue-700 transition transform hover:scale-105 active:scale-95 active:shadow-inner">
              Login
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
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>
      </section>

      {/* Tecnologias Utilizadas */}
      {/* Fundo definido como bg-blue-50 */}
      <section className="relative bg-blue-50 py-20 px-4 overflow-hidden">
        <h3 className="text-4xl lg:text-5xl font-extrabold text-blue-800 mb-12 text-center drop-shadow-sm">
          Tecnologias Utilizadas
        </h3>

        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 md:gap-8 justify-items-center relative z-10">
          {technologies.map((tech, index) => (
            <TechCard key={index} {...tech} />
          ))}
        </div>
        <div className="max-w-4xl mx-auto mt-16 text-center text-gray-700 text-base leading-relaxed">
          <p className="mb-4"><span className="font-extrabold text-blue-800">Supabase</span> foi utilizado como backend-as-a-service, permitindo autenticação, armazenamento e consultas em tempo real, sem necessidade de servidor próprio.</p>
          <p className="mb-4"><span className="font-extrabold text-blue-800">Shadcn UI</span> trouxe componentes de interface elegantes, responsivos e acessíveis, elevando o padrão visual e de usabilidade do sistema.</p>
          <p><span className="font-extrabold text-blue-800">Vercel</span> proporciona uma infraestrutura robusta para deploy e hospedagem, garantindo alta performance e disponibilidade do sistema.</p>
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
          {benefits.map((benefit, index) => (
            <BenefitCard key={index} {...benefit} />
          ))}
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