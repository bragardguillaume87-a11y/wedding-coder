import Hero from '@/components/landing/Hero';
import Problem from '@/components/landing/Problem';
import Solution from '@/components/landing/Solution';
import Benefits from '@/components/landing/Benefits';
import Itinerary from '@/components/landing/Itinerary';
import CTA from '@/components/landing/CTA';
import Footer from '@/components/landing/Footer';

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Hero />
      <Problem />
      <Solution />
      <Benefits />
      <Itinerary />
      <CTA />
      <Footer />
      <audio autoPlay loop>
        <source src="/music.mp3" type="audio/mpeg" />
        Votre navigateur ne supporte pas l'élément audio.
      </audio>
    </main>
  );
}
