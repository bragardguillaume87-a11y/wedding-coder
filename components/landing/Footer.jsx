'use client';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-[var(--cream)] to-[var(--beige)] text-[var(--charcoal)] py-16">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-12">
          {/* Colonne 1: Message personnel */}
          <div className="md:col-span-2">
            <div className="flex items-center mb-6">
              <span className="text-4xl mr-3">💍</span>
              <span className="text-3xl font-bold text-[var(--terracotta)]" style={{ fontFamily: 'var(--font-crimson-pro)' }}>
                Guillaume & [Nom]
              </span>
            </div>
            <p className="text-lg mb-4 leading-relaxed opacity-80">
              Merci d&apos;être dans nos vies.
              <br />
              Merci de faire partie de cette aventure.
              <br />
              On a hâte de vous retrouver.
            </p>
            <p className="text-[var(--terracotta)] font-semibold text-lg" style={{ fontFamily: 'var(--font-crimson-pro)' }}>
              Avec amour,
              <br />
              Guillaume & [Nom]
            </p>

            {/* Placeholder pour photo signature */}
            <div className="mt-6 inline-block">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[var(--terracotta)] to-[var(--rose-powder)] flex items-center justify-center text-3xl">
                ❤️
              </div>
            </div>
          </div>

          {/* Colonne 2: Informations pratiques */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-[var(--charcoal)]" style={{ fontFamily: 'var(--font-crimson-pro)' }}>
              Informations pratiques
            </h3>
            <ul className="space-y-3 text-[var(--charcoal)] opacity-80">
              <li>
                <a href="#itinerary" className="hover:text-[var(--terracotta)] transition-colors flex items-center">
                  <span className="mr-2">🗺️</span>
                  Voir l&apos;itinéraire
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-[var(--terracotta)] transition-colors flex items-center">
                  <span className="mr-2">❓</span>
                  Questions fréquentes
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-[var(--terracotta)] transition-colors flex items-center">
                  <span className="mr-2">✉️</span>
                  Nous contacter
                </a>
              </li>
              <li>
                <a href="#gifts" className="hover:text-[var(--terracotta)] transition-colors flex items-center">
                  <span className="mr-2">🎁</span>
                  Liste de mariage
                </a>
              </li>
            </ul>

            {/* Section Suivez l'aventure */}
            <div className="mt-8">
              <h3 className="text-xl font-bold mb-4 text-[var(--charcoal)]" style={{ fontFamily: 'var(--font-crimson-pro)' }}>
                Suivez l&apos;aventure
              </h3>
              <div className="flex gap-4">
                <a href="#" className="text-2xl hover:scale-110 transition-transform" title="Instagram">
                  📸
                </a>
                <a href="#" className="text-2xl hover:scale-110 transition-transform" title="Album partagé">
                  📷
                </a>
                <a href="#" className="text-2xl hover:scale-110 transition-transform" title="Hashtag">
                  #️⃣
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Ligne de séparation */}
        <div className="border-t border-[var(--charcoal)] border-opacity-20 mt-12 pt-8 text-center">
          <p className="text-[var(--charcoal)] opacity-60 text-sm">
            Fait avec ❤️ par Guillaume (qui code quand même un peu)
          </p>
          <p className="text-[var(--charcoal)] opacity-50 text-xs mt-2 italic">
            Ce site est notre invitation. Prenez-le comme tel.
          </p>
        </div>
      </div>
    </footer>
  );
}
