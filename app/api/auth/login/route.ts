// app/api/auth/login/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

interface Body {
  email?: string;
  password?: string;
}

export async function POST(request: Request) {
  try {
    const body: Body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email et mot de passe requis' },
        { status: 400 }
      );
    }

    // Client Supabase côté serveur
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Connexion via auth
    const { data, error } = await supabaseAdmin.auth.signInWithPassword({
      email,
      password,
    });

    if (error || !data.user) {
      return NextResponse.json(
        { error: error?.message ?? 'Impossible de se connecter' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { 
        message: 'Connexion réussie!',
        user: { id: data.user.id, email: data.user.email }
      },
      { status: 200 }
    );

  } catch (err: unknown) {
    console.error('❌ Erreur login:', err);
    const message = err instanceof Error ? err.message : 'Erreur serveur';
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
