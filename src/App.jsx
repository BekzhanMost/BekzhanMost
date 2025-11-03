import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * MOST Architects — Black & White Mockup (SPA) — Enhanced FX Edition
 * -----------------------------------------------------------------
 * Added wow-effects while keeping strict minimalism:
 * 1) Page curtain transition
 * 2) Scroll progress bar
 * 3) Global film grain overlay
 * 4) Spotlight (ink) hover following cursor
 * 5) Magnetic buttons + nav underline
 * 6) Parallax hero placeholder
 * 7) Subtle 3D tilt cards (projects/services)
 */

const PAGES = [
  { id: "home", label: "Главная" },
  { id: "about", label: "О нас" },
  { id: "projects", label: "Проекты" },
  { id: "case", label: "Кейс" },
  { id: "services", label: "Услуги" },
  { id: "journal", label: "Журнал" },
  { id: "contacts", label: "Контакты" },
];

const fade = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  exit: { opacity: 0, y: -24, transition: { duration: 0.3 } },
};

// ----------------- Utility FX -----------------
function useScrollProgress() {
  const [p, setP] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const sc = h.scrollTop;
      const max = h.scrollHeight - h.clientHeight;
      setP(max > 0 ? sc / max : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return p;
}

const MagneticButton = ({ children, className = "", ...rest }) => {
  const ref = useRef(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [hover, setHover] = useState(false);
  return (
    <button
      ref={ref}
      onMouseMove={(e) => {
        const r = ref.current?.getBoundingClientRect();
        if (!r) return;
        setPos({ x: e.clientX - (r.left + r.width / 2), y: e.clientY - (r.top + r.height / 2) });
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => {
        setHover(false);
        setPos({ x: 0, y: 0 });
      }}
      className={`relative will-change-transform ${className}`}
      style={{ transform: hover ? `translate(${pos.x * 0.15}px, ${pos.y * 0.15}px)` : undefined }}
      {...rest}
    >
      <span className="block px-8 py-4 rounded-full bg-white text-black font-semibold hover:bg-white/90 transition-colors">
        {children}
      </span>
    </button>
  );
};

const Placeholder = ({ ratio = "16/9", className = "", parallax = false, tilt = false }) => {
  const ref = useRef(null);
  const [t, setT] = useState({ x: 0, y: 0, rx: 0, ry: 0 });
  return (
    <div
      ref={ref}
      onMouseMove={(e) => {
        if (!parallax && !tilt) return;
        const r = ref.current?.getBoundingClientRect();
        if (!r) return;
        const mx = (e.clientX - (r.left + r.width / 2)) / r.width;
        const my = (e.clientY - (r.top + r.height / 2)) / r.height;
        setT({ x: mx * 10, y: my * 10, rx: -my * 6, ry: mx * 6 });
      }}
      onMouseLeave={() => setT({ x: 0, y: 0, rx: 0, ry: 0 })}
      className={`relative rounded-xl border border-white/15 overflow-hidden ${className}`}
      style={{ aspectRatio: ratio, transform: tilt ? `rotateX(${t.rx}deg) rotateY(${t.ry}deg)` : undefined }}
    >
      <div
        className="absolute inset-0 bg-white/10"
        style={{ transform: parallax ? `translate(${t.x}px, ${t.y}px)` : undefined }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.08),transparent_60%)] opacity-60 mix-blend-overlay" />
    </div>
  );
};

const SectionTitle = ({ children, note }) => (
  <div className="mb-10">
    <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
      <span className="inline-block border-b border-white/20 pb-2">{children}</span>
    </h2>
    {note && <p className="mt-2 text-sm opacity-60">{note}</p>}
  </div>
);

function Header({ page, setPage, lang, setLang }) {
  const progress = useScrollProgress();
  return (
    <header className="sticky top-0 z-50 backdrop-blur bg-black/70">
      {/* Scroll progress */}
      <div className="h-[2px] bg-white/10">
        <div className="h-full bg-white" style={{ width: `${progress * 100}%` }} />
      </div>
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-6">
        <div className="font-extrabold tracking-tight text-xl">MOST</div>
          <nav className="hidden md:flex gap-2 text-sm">
            {PAGES.map((p) => (
              <button
                key={p.id}
                onClick={() => setPage(p.id)}
                className={`relative uppercase tracking-wide transition-all duration-300 group px-4 py-2 rounded-full border border-white/15 ${
                  page === p.id
                    ? "bg-white text-black font-semibold shadow-sm"
                    : "bg-white/10 text-white/90 hover:bg-white/20"
                }`}
              >
                {p.label}
              </button>
            ))}
          </nav>


      <div className="ml-auto flex items-center gap-2">
        {["RU", "EN"].map((code) => (
          <button
            key={code}
            onClick={() => setLang(code)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border border-white/15 transition-all duration-300 ${
              lang === code
                ? "bg-white text-black shadow-sm"
                : "bg-white/10 text-white/90 hover:bg-white/20"
            }`}
          >
            {code}
          </button>
        ))}
      </div>

      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="border-t border-white/10 mt-24">
      <div className="max-w-7xl mx-auto px-4 py-10 flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="opacity-70 text-sm">© {new Date().getFullYear()} MOST Architects</div>
        <div className="flex gap-6 text-sm opacity-70">
          <a className="hover:opacity-100" href="#">Политика</a>
          <a className="hover:opacity-100" href="#">Instagram</a>
          <a className="hover:opacity-100" href="#">LinkedIn</a>
        </div>
      </div>
    </footer>
  );
}

// ----------------- Pages -----------------
function HomePage({ setPage }) {
  return (
    <motion.main {...fade} className="max-w-7xl mx-auto px-4">
      {/* Hero */}
      <section className="ink min-h-[70vh] grid md:grid-cols-2 gap-10 items-center py-16 border-b border-white/10 relative">
        <div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6">
            MOST Architects
          </h1>
          <p className="text-lg md:text-xl opacity-80 max-w-xl">
            Понятная архитектура — без лишних слов и деталей. Минимализм, свет, материал.
          </p>
        </div>
        <Placeholder ratio="16/9" className="w-full" parallax tilt />
      </section>

      {/* Philosophy */}
      <section className="py-16 border-b border-white/10 text-center">
        <SectionTitle>Простота. Ясность. Точность.</SectionTitle>
        <p className="max-w-3xl mx-auto opacity-80 text-lg">
          Мы создаём архитектуру, которая говорит сама за себя. Без декоративного шума — только логика, пропорции и свет.
        </p>
      </section>

      {/* Projects teaser */}
      <section className="py-16">
        <div className="flex items-end justify-between mb-6">
          <SectionTitle>Проекты</SectionTitle>
          <button onClick={() => setPage("projects")} className="text-sm opacity-70 hover:opacity-100">Все проекты →</button>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <motion.div key={i} {...fade} className="group">
              <Placeholder tilt />
              <div className="mt-3 flex items-center justify-between">
                <span className="opacity-90">Проект #{i + 1}</span>
                <button onClick={() => setPage("case")} className="text-xs opacity-60 group-hover:opacity-100">Открыть</button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </motion.main>
  );
}

function AboutPage() {
  return (
    <motion.main {...fade} className="max-w-6xl mx-auto px-4 py-16">
      <SectionTitle>О нас</SectionTitle>
      <div className="grid md:grid-cols-2 gap-10">
        <div className="space-y-6">
          <h3 className="text-xl font-semibold opacity-90">Философия</h3>
          <p className="opacity-80">Мы работаем на стыке контекста, функции и материала. Проектируем честную архитектуру: ясные пропорции, долговечные решения, внимание к свету.</p>
          <p className="opacity-80">Команда проектирует жилые и общественные пространства, а также интерьеры, от предпроекта до рабочей документации.</p>
        </div>
        <Placeholder className="w-full" parallax />
      </div>

      <div className="grid md:grid-cols-2 gap-8 mt-16">
        {[
          ["ПРЕДПРОЕКТНЫЙ АНАЛИЗ", "Исследование участка, контекста и ограничений. ТЭП и сценарии."],
          ["АРХИТЕКТУРНАЯ КОНЦЕПЦИЯ", "Генплан, благоустройство, объемная композиция, фасады."],
          ["ИНТЕРЬЕРЫ", "Планировки, визуализация, материалы и навигация."],
          ["РАБОЧАЯ ДОКУМЕНТАЦИЯ", "Узлы, спецификации, готовность к стройке."],
        ].map(([title, desc], i) => (
          <div key={i} className="border-t border-white/20 pt-6 rounded-2xl p-4 hover:bg-white hover:text-black transition will-change-transform">
            <div className="uppercase tracking-wide text-sm mb-2 font-semibold">{title}</div>
            <p className="opacity-80">{desc}</p>
          </div>
        ))}
      </div>
    </motion.main>
  );
}

function ProjectsPage({ setPage }) {
  return (
    <motion.main {...fade} className="max-w-7xl mx-auto px-4 py-16">
      <div className="flex items-end justify-between mb-8">
        <SectionTitle note="Сетка 3×3, фильтры по типу/локации/году">Проекты</SectionTitle>
        <div className="flex gap-2 text-xs">
          <button className="px-3 py-1 border border-white/20 rounded-full opacity-80 hover:opacity-100">Все</button>
          <button className="px-3 py-1 border border-white/20 rounded-full opacity-60 hover:opacity-100">Жилые</button>
          <button className="px-3 py-1 border border-white/20 rounded-full opacity-60 hover:opacity-100">Общественные</button>
        </div>
      </div>
      <div className="grid md:grid-cols-3 gap-6">
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} className="group cursor-pointer" onClick={() => setPage("case")}>
            <Placeholder tilt />
            <div className="mt-3 flex items-center justify-between">
              <span className="opacity-90">Проект #{i + 1}</span>
              <span className="text-xs opacity-60 group-hover:opacity-100">Подробнее</span>
            </div>
          </div>
        ))}
      </div>
    </motion.main>
  );
}

function CasePage() {
  return (
    <motion.main {...fade} className="max-w-5xl mx-auto px-4 py-16">
      <SectionTitle note="Обложка, описание, параметры, галерея">Название проекта</SectionTitle>
      <Placeholder ratio="21/9" className="w-full" parallax />
      <div className="grid md:grid-cols-3 gap-8 mt-8">
        <div className="md:col-span-2 space-y-4">
          <h3 className="text-lg font-semibold">Концепция</h3>
          <p className="opacity-80">Краткое описание задачи и архитектурной идеи. Контекст, функция, материал, свет. Коммуникация с городом и ландшафтом.</p>
        </div>
        <div className="space-y-2 text-sm opacity-80">
          <div className="flex justify-between border-b border-white/10 pb-2"><span>Локация</span><span>Алматы</span></div>
          <div className="flex justify-between border-b border-white/10 pb-2"><span>Площадь</span><span>4 200 м²</span></div>
          <div className="flex justify-between border-b border-white/10 pb-2"><span>Статус</span><span>Проект</span></div>
          <div className="flex justify-between"><span>Год</span><span>2025</span></div>
        </div>
      </div>
      <div className="grid md:grid-cols-3 gap-6 mt-10">
        {Array.from({ length: 6 }).map((_, i) => (
          <Placeholder key={i} tilt />
        ))}
      </div>
    </motion.main>
  );
}

function ServicesPage() {
  return (
    <motion.main {...fade} className="max-w-6xl mx-auto px-4 py-16">
      <SectionTitle>Услуги</SectionTitle>
      <div className="grid md:grid-cols-2 gap-8">
        {[
          ["Предпроектный анализ", "Контекст, ТЭП, сценарии, экономика проекта."],
          ["Архитектурная концепция", "Фасады, планировки, благоустройство."],
          ["Интерьеры", "Материалы, визуализации, навигация."],
          ["Рабочая документация", "Узлы, спецификации, готовность к стройке."],
        ].map(([t, d], i) => (
          <div key={i} className="border-t border-white/20 pt-6 rounded-2xl p-5 hover:bg-white hover:text-black transition will-change-transform">
            <div className="uppercase tracking-wide text-sm mb-2 font-semibold">{t}</div>
            <p className="opacity-80">{d}</p>
          </div>
        ))}
      </div>
      <div className="text-center mt-16">
        <MagneticButton>Обсудить проект</MagneticButton>
      </div>
    </motion.main>
  );
}

function JournalPage() {
  return (
    <motion.main {...fade} className="max-w-7xl mx-auto px-4 py-16">
      <SectionTitle note="3 в ряд, для SEO">Журнал</SectionTitle>
      <div className="grid md:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="group">
            <Placeholder ratio="4/3" tilt />
            <div className="mt-3">
              <div className="font-semibold">Статья #{i + 1}</div>
              <p className="opacity-70 text-sm">Короткий лид на две строки — про процесс, материал и свет.</p>
            </div>
          </div>
        ))}
      </div>
    </motion.main>
  );
}

function ContactsPage() {
  return (
    <motion.main {...fade} className="max-w-5xl mx-auto px-4 py-16">
      <SectionTitle>Контакты</SectionTitle>
      <div className="grid md:grid-cols-2 gap-10">
        <div className="space-y-4">
          <div className="opacity-80">Алматы, ул. Примерная, 1</div>
          <div className="opacity-80">info@most-architects.com</div>
          <div className="opacity-80">+7 (777) 000‑00‑00</div>
          <form className="mt-6 grid gap-3">
            <input className="bg-transparent border border-white/20 rounded-lg px-4 py-3" placeholder="Имя" />
            <input className="bg-transparent border border-white/20 rounded-lg px-4 py-3" placeholder="Email" />
            <textarea className="bg-transparent border border-white/20 rounded-lg px-4 py-3 min-h-[120px]" placeholder="Сообщение" />
            <MagneticButton>Отправить</MagneticButton>
          </form>
        </div>
        <Placeholder ratio="4/3" className="w-full" parallax />
      </div>
    </motion.main>
  );
}

export default function MostArchitectsMockupApp() {
  const [page, setPage] = useState("home");
  const [lang, setLang] = useState("RU");
  const [curtainKey, setCurtainKey] = useState(0);
  const [cursor, setCursor] = useState({ x: 0, y: 0 });

  // page change curtain
  const changePage = (p) => {
    if (p === page) return;
    setCurtainKey((k) => k + 1);
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    const onMove = (e) => setCursor({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <div className="min-h-screen w-screen bg-black text-white overflow-x-hidden selection:bg-white selection:text-black">
      {/* Spotlight cursor (ink) */}
      <div
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background: `radial-gradient(180px 180px at ${cursor.x}px ${cursor.y}px, rgba(255,255,255,0.06), transparent 70%)`,
        }}
      />

      {/* Film grain overlay */}
      <div className="pointer-events-none fixed inset-0 z-40 opacity-[.08] mix-blend-overlay grain" />

      <Header page={page} setPage={changePage} lang={lang} setLang={setLang} />

      <AnimatePresence mode="wait">
        <motion.div
          key={curtainKey}
          className="fixed inset-0 z-30 bg-white"
          initial={{ y: "-100%" }}
          animate={{ y: "-100%", transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }}
          exit={{ y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }}
        />
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {page === "home" && <HomePage key="home" setPage={changePage} />}
        {page === "about" && <AboutPage key="about" />}
        {page === "projects" && <ProjectsPage key="projects" setPage={changePage} />}
        {page === "case" && <CasePage key="case" />}
        {page === "services" && <ServicesPage key="services" />}
        {page === "journal" && <JournalPage key="journal" />}
        {page === "contacts" && <ContactsPage key="contacts" />}
      </AnimatePresence>

      <Footer />

      {/* Extra styles for grain & ink scopes */}
      <style>{`
        .grain { background-image: url('data:image/svg+xml;utf8,${encodeURIComponent(
          `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
            <filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch"/></filter>
            <rect width="100%" height="100%" filter="url(%23n)" opacity="0.9"/>
          </svg>`
        )}'); }
        .ink { position: relative; }
      `}</style>
    </div>
  );
}

