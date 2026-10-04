import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SafeImage from './safeImage';

const slides = [
  { eyebrow: 'Essencial para todos os dias', title: 'Camiseta Essential', description: 'Modelagem confortável e versátil para completar suas combinações.', button: 'Ver camisetas', category: 'Camisetas', image: 'https://images.unsplash.com/photo-1571945153237-4929e783af4a?auto=format&fit=crop&w=1200&q=85', background: 'linear-gradient(120deg, #fff1db 0%, #f8c5d5 100%)', text: 'text-gray-900', detail: 'text-pink-700', buttonClass: 'bg-pink-600 text-white hover:bg-pink-700' },
  { eyebrow: 'Estilo que acompanha você', title: 'Calça Cargo', description: 'Caimento moderno e praticidade para uma rotina cheia de movimento.', button: 'Ver calças', category: 'Calças', image: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=1200&q=85', background: 'linear-gradient(120deg, #0f3d3e 0%, #176b87 100%)', text: 'text-white', detail: 'text-cyan-200', buttonClass: 'bg-lime-200 text-gray-900 hover:bg-lime-300' },
  { eyebrow: 'Coleção em movimento', title: 'Tênis Runner', description: 'Leveza e conforto para transformar cada passo da rotina.', button: 'Explorar tênis', category: 'Tênis', image: 'https://images.unsplash.com/photo-1600269452121-4f2416e55c28?auto=format&fit=crop&w=1200&q=85', background: 'linear-gradient(120deg, #161616 0%, #3d195c 55%, #f6007b 100%)', text: 'text-white', detail: 'text-pink-200', buttonClass: 'bg-white text-gray-900 hover:bg-pink-100' },
  { eyebrow: 'Detalhe que completa o look', title: 'Boné Classic', description: 'Um acessório versátil para trazer personalidade a qualquer produção.', button: 'Ver bonés', category: 'Bonés', image: 'https://images.unsplash.com/photo-1575428652377-a2d80e2277fc?auto=format&fit=crop&w=1200&q=85', background: 'linear-gradient(120deg, #172554 0%, #1d4ed8 60%, #38bdf8 100%)', text: 'text-white', detail: 'text-sky-200', buttonClass: 'bg-white text-blue-900 hover:bg-sky-100' },
];

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeArrow, setActiveArrow] = useState(null);
  const arrowTimeout = useRef(null);
  const navigate = useNavigate();
  const current = slides[currentSlide];

  useEffect(() => {
    const interval = setInterval(() => setCurrentSlide((index) => (index + 1) % slides.length), 7000);
    return () => {
      clearInterval(interval);
      clearTimeout(arrowTimeout.current);
    };
  }, []);

  const showSlide = (index, direction) => {
    setCurrentSlide((index + slides.length) % slides.length);
    setActiveArrow(direction);
    clearTimeout(arrowTimeout.current);
    arrowTimeout.current = setTimeout(() => setActiveArrow(null), 2000);
  };

  const goToOffer = () => {
    navigate(`/produtos?categoria=${encodeURIComponent(current.category)}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="px-4 py-6 md:px-8 md:py-8">
      <div className={`relative mx-auto grid min-h-[285px] max-w-7xl grid-cols-1 items-center gap-6 overflow-hidden rounded-2xl px-6 py-7 shadow-lg md:grid-cols-2 md:px-12 md:py-8 ${current.text}`} style={{ background: current.background }}>
        <div className="absolute -left-16 -top-20 h-52 w-52 rounded-full bg-white/10 blur-2xl" />
        <button type="button" onClick={() => showSlide(currentSlide - 1, 'previous')} aria-label="Slide anterior" className={`absolute left-3 top-[32%] z-20 md:left-5 md:top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border bg-black/25 p-0 text-white shadow transition hover:bg-black/45 focus:outline-none focus-visible:ring-2 focus-visible:ring-white md:left-5 ${activeArrow === 'previous' ? 'border-white' : 'border-transparent'}`}>
          <svg aria-hidden="true" viewBox="0 0 24 24" className="h-6 w-6"><path d="m14.5 5-7 7 7 7" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" /></svg>
        </button>
        <button type="button" onClick={() => showSlide(currentSlide + 1, 'next')} aria-label="Próximo slide" className={`absolute right-3 top-[32%] z-20 md:top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border bg-black/25 p-0 text-white shadow transition hover:bg-black/45 focus:outline-none focus-visible:ring-2 focus-visible:ring-white md:right-5 ${activeArrow === 'next' ? 'border-white' : 'border-transparent'}`}>
          <svg aria-hidden="true" viewBox="0 0 24 24" className="h-6 w-6"><path d="m9.5 5 7 7-7 7" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" /></svg>
        </button>
        <div className="relative z-10 order-2 text-center md:order-1 md:pl-12 md:text-left">
          <p className={`mb-2 text-sm font-bold tracking-wide ${current.detail}`}>{current.eyebrow}</p>
          <h1 className="text-3xl font-black leading-tight md:text-5xl">{current.title}</h1>
          <p className="mt-4 max-w-md text-sm leading-relaxed opacity-90 md:text-base">{current.description}</p>
          <button onClick={goToOffer} className={`mt-6 rounded-lg px-7 py-2.5 font-bold transition ${current.buttonClass}`}>{current.button}</button>
        </div>
        <div className="relative z-10 order-1 flex h-48 items-center justify-center md:order-2 md:h-60">
          <div className="absolute h-44 w-44 rounded-full bg-white/15 blur-xl" />
          <SafeImage key={current.image} src={current.image} alt={current.title} className="relative h-full max-w-full object-contain drop-shadow-2xl" fallback="/product-thumb-1.jpeg" />
        </div>
      </div>
      <div className="mt-4 flex justify-center gap-2">
        {slides.map((slide, index) => <button key={slide.title} onClick={() => setCurrentSlide(index)} aria-label={`Selecionar ${slide.title}`} className={`h-2.5 rounded-full transition-all ${index === currentSlide ? 'w-7 bg-pink-600' : 'w-2.5 bg-gray-300 hover:bg-gray-400'}`} />)}
      </div>
    </section>
  );
};

export default Hero;