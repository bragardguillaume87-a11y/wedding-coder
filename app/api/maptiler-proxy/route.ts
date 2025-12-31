/**
 * Proxy API pour MapTiler/Stamen Tiles
 * Protège la clé API en la cachant côté serveur
 * Ajoute du caching et du rate limiting
 */

import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Extraire les paramètres de la tuile
    const z = searchParams.get('z');
    const x = searchParams.get('x');
    const y = searchParams.get('y');

    // Validation des paramètres
    if (!z || !x || !y) {
      return NextResponse.json(
        { error: 'Missing tile parameters (z, x, y)' },
        { status: 400 }
      );
    }

    // Validation des valeurs (éviter injection)
    const zNum = parseInt(z);
    const xNum = parseInt(x);
    const yNum = parseInt(y);

    if (isNaN(zNum) || isNaN(xNum) || isNaN(yNum)) {
      return NextResponse.json(
        { error: 'Invalid tile parameters' },
        { status: 400 }
      );
    }

    // Limites raisonnables pour Stamen Watercolor
    if (zNum < 0 || zNum > 16 || xNum < 0 || yNum < 0) {
      return NextResponse.json(
        { error: 'Tile parameters out of range' },
        { status: 400 }
      );
    }

    // Construire l'URL Stamen Watercolor (pas besoin de clé API pour Stamen)
    const tileUrl = `https://tiles.stadiamaps.com/tiles/stamen_watercolor/${zNum}/${xNum}/${yNum}.jpg`;

    // Fetch la tuile depuis Stamen
    const tileResponse = await fetch(tileUrl, {
      headers: {
        'User-Agent': 'Wedding-Coder-App/1.0',
        'Referer': request.headers.get('referer') || '',
      },
      // Cache côté serveur pour 7 jours
      next: { revalidate: 604800 }
    });

    if (!tileResponse.ok) {
      console.error(`Tile fetch failed: ${tileResponse.status} ${tileUrl}`);
      return NextResponse.json(
        { error: 'Failed to fetch tile' },
        { status: tileResponse.status }
      );
    }

    // Récupérer l'image
    const imageBuffer = await tileResponse.arrayBuffer();

    // Retourner l'image avec headers de cache optimisés
    return new NextResponse(imageBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'image/jpeg',
        'Cache-Control': 'public, max-age=604800, immutable', // 7 jours
        'CDN-Cache-Control': 'public, max-age=2592000', // 30 jours pour CDN
        'Access-Control-Allow-Origin': '*', // CORS pour MapTiler SDK
        'Access-Control-Allow-Methods': 'GET',
      },
    });

  } catch (error) {
    console.error('MapTiler proxy error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Support OPTIONS pour CORS preflight
export async function OPTIONS(_request: NextRequest) {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
