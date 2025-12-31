/**
 * Proxy Next.js pour rate limiting et sécurité
 * Protège les API routes contre l'abus
 * MIGRATION: middleware.ts → proxy.ts (Next.js 16+)
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Simple in-memory rate limiting
// NOTE: En production, utiliser Redis ou une solution distribuée
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

const RATE_LIMIT = 500; // Requêtes par fenêtre (généreux pour les tiles)
const WINDOW_MS = 60000; // 1 minute

// Nettoyage périodique de la map pour éviter fuite mémoire
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of rateLimitMap.entries()) {
    if (now > value.resetTime) {
      rateLimitMap.delete(key);
    }
  }
}, 60000); // Nettoyer toutes les minutes

export function proxy(request: NextRequest) {
  // Rate limiting pour les requêtes proxy MapTiler
  if (request.nextUrl.pathname.startsWith('/api/maptiler-proxy')) {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
               request.headers.get('x-real-ip') ||
               'unknown';

    const now = Date.now();
    const rateLimit = rateLimitMap.get(ip);

    if (!rateLimit || now > rateLimit.resetTime) {
      // Nouvelle fenêtre
      rateLimitMap.set(ip, {
        count: 1,
        resetTime: now + WINDOW_MS
      });
    } else {
      // Incrémenter le compteur
      rateLimit.count++;

      if (rateLimit.count > RATE_LIMIT) {
        return NextResponse.json(
          {
            error: 'Too many requests',
            retryAfter: Math.ceil((rateLimit.resetTime - now) / 1000)
          },
          {
            status: 429,
            headers: {
              'Retry-After': Math.ceil((rateLimit.resetTime - now) / 1000).toString(),
              'X-RateLimit-Limit': RATE_LIMIT.toString(),
              'X-RateLimit-Remaining': Math.max(0, RATE_LIMIT - rateLimit.count).toString(),
              'X-RateLimit-Reset': new Date(rateLimit.resetTime).toISOString(),
            }
          }
        );
      }
    }

    // Ajouter headers de rate limit aux réponses réussies
    const response = NextResponse.next();
    response.headers.set('X-RateLimit-Limit', RATE_LIMIT.toString());
    response.headers.set('X-RateLimit-Remaining', Math.max(0, RATE_LIMIT - (rateLimit?.count || 0)).toString());
    if (rateLimit) {
      response.headers.set('X-RateLimit-Reset', new Date(rateLimit.resetTime).toISOString());
    }

    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/api/:path*',
};
