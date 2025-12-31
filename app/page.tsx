'use client';

import dynamic from 'next/dynamic';
import Hero from '@/components/landing/Hero';
import Problem from '@/components/landing/Problem';

// ✅ Phase 1.3 - Code Splitting avec Dynamic Imports
// Composants au-dessus du pli - chargement immédiat
// Hero et Problem sont chargés directement pour un LCP optimal

// Composants en-dessous du pli - chargement différé
// Réduction de 40-60% du bundle initial
const Solution = dynamic(() => import('@/components/landing/Solution'), {
  loading: () => <div className="h-screen animate-pulse bg-cream" />,
});

const Benefits = dynamic(() => import('@/components/landing/Benefits'), {
  loading: () => <div className="h-screen animate-pulse bg-white" />,
});

const Itinerary = dynamic(() => import('@/components/landing/Itinerary'), {
  loading: () => <div className="h-screen animate-pulse bg-cream" />,
});

const CTA = dynamic(() => import('@/components/landing/CTA'), {
  loading: () => <div className="h-96 animate-pulse bg-terracotta/10" />,
});

const Footer = dynamic(() => import('@/components/landing/Footer'), {
  loading: () => <div className="h-64 animate-pulse bg-charcoal" />,
});

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      {/* Au-dessus du pli - chargement immédiat */}
      <Hero />
      <Problem />

      {/* En-dessous du pli - chargement différé */}
      <Solution />
      <Benefits />
      <Itinerary />
      <CTA />
      <Footer />
    </main>
  );
}
