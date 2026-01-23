import React, { useState } from 'react';
import {
  Building2,
  Scale,
  BookOpen,
  Mail,
  Linkedin,

  FileText,
  User,
  Globe,
  TrendingUp,
  MessageSquare,
  ArrowRight,
  ArrowLeft,
  ArrowUp,
  ChevronDown,
  Menu,
  X
} from 'lucide-react';

function App() {
  const [activeSection, setActiveSection] = useState('home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen font-sans selection:bg-teal-100 selection:text-teal-900">
      {/* Navigation */}
      <nav className="fixed w-full z-50 bg-white/90 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
          <a href="#" className="text-xl font-bold tracking-tight text-slate-900">KP.</a>

          <div className="hidden md:flex gap-8 text-sm font-medium text-slate-600">
            <a href="#about" className="hover:text-teal-700 transition-colors">About</a>
            <a href="#expertise" className="hover:text-teal-700 transition-colors">Expertise</a>
            <a href="#community" className="hover:text-teal-700 transition-colors">Community Contributions</a>
          </div>

          <a
            href="mailto:kellen@kellenpowell.com"
            className="hidden md:block px-4 py-2 text-xs font-semibold bg-slate-900 text-white rounded-md hover:bg-slate-800 transition-all transform hover:scale-[1.02] shadow-sm"
          >
            Get in Touch
          </a>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-slate-600 hover:text-teal-700 transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 w-full bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xl p-4 flex flex-col gap-4 animate-fade-in-down">
            <a
              href="#about"
              className="text-lg font-medium text-slate-700 hover:text-teal-700 py-2 border-b border-slate-100"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              About
            </a>
            <a
              href="#expertise"
              className="text-lg font-medium text-slate-700 hover:text-teal-700 py-2 border-b border-slate-100"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Expertise
            </a>
            <a
              href="#community"
              className="text-lg font-medium text-slate-700 hover:text-teal-700 py-2 border-b border-slate-100"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Community Contributions
            </a>
            <a
              href="mailto:kellen@kellenpowell.com"
              className="text-center w-full px-4 py-3 font-semibold bg-slate-900 text-white rounded-md hover:bg-slate-800 transition-all shadow-sm"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Get in Touch
            </a>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section id="home" className="min-h-screen flex items-center pt-24 pb-0 px-4 bg-slate-800 overflow-hidden relative">
        <div className="max-w-6xl mx-auto w-full grid md:grid-cols-2 gap-12 items-center h-full">

          {/* Text Content */}
          <div className="space-y-8 animate-fade-in-up text-center md:text-left order-2 md:order-1 pb-16 md:pb-0">
            <div className="inline-block p-1 rounded-full bg-slate-700/50 mb-4 border border-slate-600">
              <span className="px-3 py-1 text-xs font-medium text-slate-300 uppercase tracking-widest">
                Immigration Attorney
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-tight text-white">
              Kellen Powell
            </h1>

            <p className="text-xl md:text-2xl text-slate-300 font-light max-w-lg mx-auto md:mx-0">
              Veteran. Advocate. Strategist.<br />
              Navigating the intersection of <span className="text-white font-normal border-b-2 border-teal-500">immigration law</span> and <span className="text-white font-normal border-b-2 border-teal-500">global talent</span>.
            </p>


          </div>

          {/* Image Content */}
          <div className="relative order-1 md:order-2 flex justify-center md:justify-end h-full items-end mt-8 md:mt-0">
            <div className="relative z-10 w-full max-w-lg flex items-end justify-center md:justify-end">
              {/* Subtle backlight */}
              <div className="absolute bottom-0 right-10 w-96 h-96 bg-slate-700/30 rounded-full blur-3xl -z-10"></div>

              <img
                src="/images/gemini_generated.png"
                alt="Kellen Powell"
                className="relative z-10 w-full h-auto object-contain drop-shadow-2xl"
              />
            </div>
          </div>

        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce opacity-50 text-slate-500 hidden md:block z-20">
          <ChevronDown size={24} />
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 md:py-24 px-4 bg-slate-50 border-t border-slate-200">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div className="order-2 md:order-1 relative">
            <div className="relative z-10 p-8 rounded-2xl bg-white border border-slate-200 shadow-xl">
              <h3 className="text-2xl font-bold text-slate-900 mb-4">More than just legal counsel.</h3>
              <p className="text-slate-600 leading-relaxed mb-6">
                With over a decade of experience in employment-based immigration, I bridge the gap between complex regulations and business goals.
              </p>
              <p className="text-slate-600 leading-relaxed">
                As a 10-year Army Veteran, I bring disciplined strategy to every case. My approach is direct, data-driven, and relentlessly focused on the client's objective.
              </p>
            </div>
            {/* Abstract decorative element */}
            <div className="absolute top-4 -right-4 w-full h-full bg-slate-200/50 rounded-2xl -z-0"></div>
          </div>

          <div className="order-1 md:order-2 space-y-6">
            <span className="text-teal-700 font-medium tracking-widest text-sm uppercase">About Me</span>
            <h2 className="text-4xl font-bold text-slate-900">
              A modern advocate for the modern workforce.
            </h2>
            <div className="space-y-4 pt-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700">
                  <User size={20} />
                </div>
                <div>
                  <h4 className="text-slate-900 font-medium">Practiced Attorney</h4>
                  <p className="text-sm text-slate-500">10+ Years Experience</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700">
                  <Building2 size={20} />
                </div>
                <div>
                  <h4 className="text-slate-900 font-medium">Employment Immigration</h4>
                  <p className="text-sm text-slate-500">PERM, H-1B, L-1, O-1</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700">
                  <Globe size={20} />
                </div>
                <div>
                  <h4 className="text-slate-900 font-medium">Global Perspective</h4>
                  <p className="text-sm text-slate-500">Connecting talent worldwide</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Expertise Section */}
      <section id="expertise" className="pt-24 pb-16 md:py-24 px-4 bg-slate-900 md:bg-white relative overflow-hidden md:overflow-visible [clip-path:polygon(0_40px,100%_0,100%_100%,0_100%)] md:[clip-path:none]">
        {/* Decorative background shapes for mobile */}
        <div className="md:hidden absolute top-0 right-0 w-64 h-64 bg-teal-500/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
        <div className="md:hidden absolute bottom-0 left-0 w-64 h-64 bg-teal-500/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl"></div>
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-start">
          {/* Left Column: Header & Feature Image */}
          <div className="space-y-8 md:sticky md:top-24 relative z-0 md:z-auto">
            <div className="relative z-10">
              <span className="text-teal-400 md:text-slate-500 font-medium tracking-widest text-sm uppercase">Legal Services</span>
              <h2 className="text-4xl font-bold text-white md:text-slate-900 mt-2 max-w-sm">Core Areas of Focus</h2>
              <p className="text-slate-300 md:text-slate-600 mt-4 leading-relaxed max-w-md">
                My practice is built on deep specialization. From high-growth startups to established corporations, I provide the strategic counsel needed to navigate the complexities of U.S. immigration.
              </p>
            </div>

            <div className="relative group hidden md:block">
              <div className="absolute -inset-1 bg-gradient-to-r from-teal-600 to-slate-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
              <img
                src="/images/strategy_meeting.jpg"
                alt="Strategic Planning Meeting"
                className="relative rounded-2xl shadow-xl w-full h-auto object-cover border border-slate-100"
              />
            </div>
          </div>

          {/* Right Column: Service Grid */}
          <div className="grid sm:grid-cols-2 gap-6">
            <Card
              icon={<TrendingUp size={24} />}
              title="Advanced Strategies"
              desc="Complex case consulting, long-term immigration planning, and alternative visa pathways for unique talent."
            />
            <Card
              icon={<FileText size={24} />}
              title="PERM Certification"
              desc="Strategic guidance through the Department of Labor's complex permanent residency process."
            />
            <Card
              icon={<Building2 size={24} />}
              title="Non-Immigrant Visas"
              desc="Expert handling of H-1B, L-1, TN, and O-1 petitions for corporate clients and skilled professionals."
            />
            <Card
              icon={<Scale size={24} />}
              title="Audit & Compliance"
              desc="Defensive strategy for DOL audits and maintaining rigorous compliance files to protect employer interests."
            />
          </div>
        </div>
      </section>

      {/* Community Engagement / Reddit Section */}
      <section id="community" className="py-16 md:py-24 px-4 bg-slate-50 border-y border-slate-200">
        <div className="max-w-4xl mx-auto text-center space-y-4 mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-semibold uppercase tracking-wider mb-4">
            <MessageSquare size={14} />
            Community Contributor
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900">Direct Answers. Real Impact.</h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            I believe in democratizing legal knowledge. I'm an active contributor to <span className="text-slate-900 font-medium">r/immigration</span>, helping real people navigate complex hurdles.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <RedditCarousel />
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="py-12 bg-white border-t border-slate-100">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-8">
          <div>
            <span className="text-2xl font-bold text-slate-900">KP.</span>
            <p className="text-slate-500 text-sm mt-2">© {new Date().getFullYear()} Kellen Powell. All rights reserved.</p>
          </div>

          <div className="flex gap-6">
            <SocialLink href="https://www.linkedin.com/in/kellen-powell-immigration" icon={<Linkedin size={20} />} label="LinkedIn" />
            <SocialLink href="https://www.reddit.com/user/kellen-the-lawyer/" icon={<RedditIcon size={20} />} label="Reddit" />
            <SocialLink href="mailto:kellen@kellenpowell.com" icon={<Mail size={20} />} label="Email" />
          </div>
        </div>
      </footer>
    </div>
  );
}

// Sub-components
function RedditCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const comments = [
    {
      topic: "H1b",
      question: "Laid Off with Perm approval and 7th year Extension. (I140 not done)",
      answer: "Don’t lose all hope. If you move to a new employer and they start the PERM process immediately then you might be able to at least get another 1-year extension. The new PERM would need to be filed by February 2026 to keep you safe. The basic rule is that you can get 1-year extensions if your PERM has been pending for 365 days. There is a sub part of the rule that says you can pre-file if the PERM was filed more than 365 days before you max out date. The sub part is used more than main rule. You can use the main part of the rule even if you are already using a 1-year extension.",
      upvotes: 13,
      url: "https://www.reddit.com/user/kellen-the-lawyer/"
    },
    {
      topic: "H1b",
      question: "USCIS Policy update on NTA issuance",
      answer: "If you apply for an extension or change of employer and rely on the 240 day auto-extension and the H-1B is denied then you’ll get an NTA. The denial rate on extensions and change of employers is like 7%.",
      upvotes: 13,
      url: "https://www.reddit.com/user/kellen-the-lawyer/"
    },
    {
      topic: "H1b",
      question: "Who has successfully filed H1B with their own startup for themselves and gotten approval? Need guidance",
      answer: "This has been possible since this summer, the regs codify a policy USCIS adopted this summer. I suspect they knew they were going to roll this out in the regs and decided to get it out as a policy manual update early. I got an H-1B approved for a carbon capture startup with just the founder and $15k in the bank over the summer. The LCA will establish your ability to pay which proves the employer-employee relationship. You should probably have two months of salary in your company’s bank account, and any investor statements of interest that you can get. Your approval will only be for 18 months. You need to have been counted against the cap in the past. This is totally doable if you follow the right steps.",
      upvotes: 9,
      url: "https://www.reddit.com/user/kellen-the-lawyer/"
    },
    {
      topic: "H1b",
      question: "Laid off with PERM approval pending.",
      answer: "Just throwing this out there… you would be eligible for the AC21 1-year extension as long as your PERM has been pending for at least a year. Some of you want to yell at me now, give me a second. Even if the PERM was for company A and you are working for company B, company B can request the time you have left plus 1-year. This will also make your spouse eligible for an H4 EAD. The tough part is getting the proof from Company A that Company B can use to prove the PERM has been pending for a year.",
      upvotes: 4,
      url: "https://www.reddit.com/user/kellen-the-lawyer/"
    },
    {
      topic: "H1b",
      question: "Sponsoring H1B for your own company",
      answer: "This subject keeps coming up, I’m going to have to make a video to explain the new rules. You can work for your own company on H-1B. You DO NOT NEED A BOARD anymore. There is no ownership percentage requirement. In the past the big problem with being an owner-H-1B holder was the ability to show an employer-employee relationship. USCIS wanted to see that multiple pieces of the test were met, did the company have the ability to hire, fire, pay, or otherwise supervise your work. USCIS updated their guidance on employer-employee relationship test over the summer to require only the ability to pay, then they included that same rule in the regs that started on 1/17/25. The LCA establishes the ability to pay because it is a binding contract between the company and the DOL to pay the wage. I still encourage my clients to have at least three months of salary in the company’s bank account. You need to be engaged in primarily “specialty occupation” work. Your first approval and first extension will only be for 18 months each. That’s the basics.",
      upvotes: 43,
      url: "https://www.reddit.com/user/kellen-the-lawyer/"
    }
  ];

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % comments.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + comments.length) % comments.length);
  };

  return (
    <div className="relative">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8 md:p-10 transition-all duration-300 h-[500px] flex flex-col">

        {/* Card Header */}
        <div className="flex-none flex items-center gap-4 mb-6">
          <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-xs border border-slate-200">
            u/kl
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-slate-900">u/kellen-the-lawyer</span>
              <span className="text-xs text-slate-400">• 2h ago</span>
            </div>
            <div className="inline-block px-2 py-0.5 mt-1 rounded text-[10px] font-semibold bg-teal-50 text-teal-700 uppercase tracking-wide">
              r/{comments[currentIndex].topic}
            </div>
          </div>
        </div>

        {/* Card Content */}
        <div className="flex-1 overflow-y-auto min-h-0 pr-2">
          <a href={comments[currentIndex].url} target="_blank" rel="noreferrer" className="block space-y-4 group">
            <h3 className="text-lg font-bold text-slate-900 font-serif italic group-hover:text-teal-700 transition-colors">"{comments[currentIndex].question}"</h3>
            <div className="pl-4 border-l-2 border-teal-500">
              <p className="text-slate-600 leading-relaxed">
                {comments[currentIndex].answer}
              </p>
            </div>
          </a>
        </div>

        {/* Card Footer */}
        <div className="flex-none flex items-center justify-between mt-8 pt-6 border-t border-slate-100">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-slate-500 text-sm font-medium bg-slate-50 px-3 py-1 rounded-full border border-slate-100">
              <ArrowUp size={16} className="text-orange-600" />
              <span>{comments[currentIndex].upvotes}</span>
            </div>
            <a
              href={comments[currentIndex].url}
              target="_blank"
              rel="noreferrer"
              className="text-xs font-semibold text-teal-600 hover:text-teal-700 flex items-center gap-1"
            >
              View Discussion <ArrowRight size={14} />
            </a>
          </div>

          <div className="flex gap-2">
            <button
              onClick={prevSlide}
              className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-900 transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <button
              onClick={nextSlide}
              className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-900 transition-colors"
            >
              <ArrowRight size={20} />
            </button>
          </div>
        </div>

      </div>

      {/* Decorative Elements */}
      <div className="absolute top-1/2 -left-4 md:-left-12 -translate-y-1/2">
        <button onClick={prevSlide} className="hidden md:flex p-3 rounded-full bg-white border border-slate-200 shadow-sm text-slate-400 hover:text-teal-600 hover:border-teal-200 transition-all">
          <ArrowLeft size={24} />
        </button>
      </div>
      <div className="absolute top-1/2 -right-4 md:-right-12 -translate-y-1/2">
        <button onClick={nextSlide} className="hidden md:flex p-3 rounded-full bg-white border border-slate-200 shadow-sm text-slate-400 hover:text-teal-600 hover:border-teal-200 transition-all">
          <ArrowRight size={24} />
        </button>
      </div>
    </div>
  );
}

function Card({ icon, title, desc }) {
  return (
    <div className="p-8 rounded-xl bg-white border border-slate-200 shadow-sm hover:shadow-md hover:border-teal-100 transition-all group">
      <div className="w-12 h-12 rounded-lg bg-slate-50 flex items-center justify-center text-slate-600 group-hover:text-teal-700 group-hover:bg-teal-50 transition-all mb-6">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-slate-900 mb-3">{title}</h3>
      <p className="text-slate-600 leading-relaxed text-sm">
        {desc}
      </p>
    </div>
  );
}

function SocialLink({ href, icon, label }) {
  return (
    <a
      href={href}
      className="text-slate-400 hover:text-slate-900 transition-colors"
      aria-label={label}
      target="_blank"
      rel="noreferrer"
    >
      {icon}
    </a>
  );
}

function RedditIcon({ size = 24, className = "" }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z" />
    </svg>
  );
}

export default App;
