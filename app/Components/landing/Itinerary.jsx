'use client';

import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function Itinerary() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  };

  const stages = [
    {
      day: 'Lundi 15 juin',
      location: '🏔️ Chamonix (Haute-Savoie)',
      group: 'Famille du côté montagne',
      time: '14h - 16h',
      activities: ['Accueil café', 'Photos en couple', 'Moment informel'],
      guests: '12-15 personnes',
    },
    {
      day: 'Mardi 16 juin',
      location: '🌾 Bourgogne (Côte d\'Or)',
      group: 'Amis d\'enfance',
      time: '19h - 21h30',
      activities: ['Petit apéritif vignoble', 'Danses spontanées', 'Discussions'],
      guests: '20-25 personnes',
    },
    {
      day: 'Mercredi 17 juin',
      location: '🏖️ Bretagne (Morbihan)',
      group: 'Cousins & famille élargie',
      time: '15h - 17h30',
      activities: ['Pique-nique bord de mer', 'Jeux de plage', 'Coucher de soleil'],
      guests: '18-22 personnes',
    },
    {
      day: 'Jeudi 18 juin',
      location: '🏙️ Lyon (centre-ville)',
      group: 'Collègues de travail',
      time: '20h - 22h30',
      activities: ['Apéro en terrasse', 'Jeux de société', 'Danses tardives'],
      guests: '25-30 personnes',
    },
    {
      day: 'Samedi 20 juin',
      location: '🎉 Paris (lieu de vie)',
      group: 'Meilleurs amis & famille proche',
      time: '18h - minuit+',
      activities: ['Dîner complet', 'Renouvellement des vœux', 'Grande fête'],
      guests: '40-50 personnes',
    },
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-blue-50">
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={containerVariants}
        >
          <motion.h2
            variants={itemVariants}
            className="text-4xl sm:text-5xl font-bold text-slate-900 mb-6"
          >
            Exemple d&apos;itinéraire réel
          </motion.h2>
          <motion.p variants={itemVariants} className="text-xl text-slate-600 max-w-2xl mx-auto">
            Voici comment un mariage itinérant pourrait se dérouler sur une semaine
          </motion.p>
        </motion.div>

        <motion.div
          className="relative space-y-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={containerVariants}
        >
          <div className="absolute left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-400 via-purple-400 to-pink-400 hidden md:block" />

          {stages.map((stage, idx) => (
            <motion.div key={idx} variants={itemVariants} className="relative md:ml-24">
              <div className="absolute -left-6 top-6 w-8 h-8 bg-white border-4 border-blue-500 rounded-full hidden md:block" />

              <Card className="p-8 border-slate-200 hover:shadow-lg transition-shadow duration-300">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
                  <div>
                    <div className="text-sm font-semibold text-blue-600 mb-1">{stage.day}</div>
                    <h3 className="text-2xl font-bold text-slate-900">{stage.location}</h3>
                    <p className="text-slate-600 mt-1">{stage.group}</p>
                  </div>
                  <Badge className="bg-blue-100 text-blue-700 border-blue-200 whitespace-nowrap">
                    {stage.time}
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-3">Au programme</h4>
                    <ul className="space-y-2">
                      {stage.activities.map((activity, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <span className="text-blue-500 mt-1">→</span>
                          <span className="text-slate-700">{activity}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-slate-900 mb-3">Détails</h4>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-slate-600">Nombre de personnes</p>
                        <p className="font-semibold text-slate-900">{stage.guests}</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-600">Type d&apos;événement</p>
                        <p className="font-semibold text-slate-900">Convivial & Personnalisé</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-slate-200">
                  <p className="text-sm text-slate-600 italic">
                    💡 Les mariés sont en tenue de cérémonie à chaque étape. Chaque groupe organise
                    sa petite fête à sa manière.
                  </p>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="mt-16 p-10 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={itemVariants}
        >
          <h3 className="text-xl font-bold text-slate-900 mb-4">✨ Le secret du succès</h3>
          <p className="text-slate-700">
            Chaque étape est <span className="font-semibold">autonome mais synchronisée</span>.
            Wedding-Coder gère les dates, invitations, et coordinations. Chaque groupe gère
            l&apos;ambiance et le style localement. Les mariés ne font que passer, habillés, sereins,
            heureux.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
