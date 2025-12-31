'use client';

import { footerData } from '@/config/landingData';

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
                {footerData.couple}
              </span>
            </div>
            <p className="text-lg mb-4 leading-relaxed opacity-80">
              {footerData.message.map((line, idx) => (
                <span key={idx}>
                  {line}
                  <br />
                </span>
              ))}
            </p>
            <p className="text-[var(--terracotta)] font-semibold text-lg" style={{ fontFamily: 'var(--font-crimson-pro)' }}>
              {footerData.signature}
              <br />
              {footerData.couple}
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
              {footerData.links.map((link, idx) => (
                <li key={idx}>
                  <a href={link.href} className="hover:text-[var(--terracotta)] transition-colors flex items-center">
                    <span className="mr-2">{link.icon}</span>
                    {link.text}
                  </a>
                </li>
              ))}
            </ul>

            {/* Section Suivez l'aventure */}
            <div className="mt-8">
              <h3 className="text-xl font-bold mb-4 text-[var(--charcoal)]" style={{ fontFamily: 'var(--font-crimson-pro)' }}>
                {footerData.social.title}
              </h3>
              <div className="flex gap-4">
                {footerData.social.links.map((social, idx) => (
                  <a
                    key={idx}
                    href={social.href}
                    className="text-2xl hover:scale-110 transition-transform"
                    title={social.title}
                  >
                    {social.emoji}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Ligne de séparation */}
        <div className="border-t border-[var(--charcoal)] border-opacity-20 mt-12 pt-8 text-center">
          <p className="text-[var(--charcoal)] opacity-60 text-sm">
            {footerData.copyright.main}
          </p>
          <p className="text-[var(--charcoal)] opacity-50 text-xs mt-2 italic">
            {footerData.copyright.sub}
          </p>
        </div>
      </div>
    </footer>
  );
}
