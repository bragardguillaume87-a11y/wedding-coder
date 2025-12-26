// app/api/auth/signup/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

interface Body {
  email?: string;
  password?: string;
  full_name?: string;
}

export async function POST(request: Request) {
  try {
    const body: Body = await request.json();
    const { email, password, full_name } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email et mot de passe requis' },
        { status: 400 }
      );
    }

    // Client Supabase côté serveur avec service role
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // 1️⃣ Créer l'utilisateur Auth
    const { data: authData, error: createUserError } =
      await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: false, // true si tu veux passer la confirmation d'email
      });

    if (createUserError || !authData) {
      console.error('❌ Erreur Auth:', createUserError);
      return NextResponse.json(
        { error: createUserError?.message ?? 'Impossible de créer l\'utilisateur' },
        { status: 500 }
      );
    }

    const authUserId = authData.user.id;
    console.log('✅ User Auth créé:', authUserId);

    // 2️⃣ Insérer dans public.users
    const { error: insertError } = await supabaseAdmin
      .from('users')
      .insert([
        {
          id: authUserId,      // Même ID partout
          auth_id: authUserId, // Lien vers auth.users
          email,
          full_name: full_name || null,
        },
      ]);

    if (insertError) {
      console.error('❌ Erreur insert public.users:', insertError);
      
      // 🔄 ROLLBACK : Supprimer l'utilisateur Auth créé
      try {
        await supabaseAdmin.auth.admin.deleteUser(authUserId);
        console.log('🔄 Rollback : User Auth supprimé');
      } catch (deleteErr) {
        console.error('🚨 CRITIQUE : Rollback échoué!', deleteErr);
        // À surveiller : user existe dans Auth mais pas dans users
      }

      return NextResponse.json(
        { error: 'Erreur lors de l\'inscription; annulation effectuée' },
        { status: 500 }
      );
    }

    console.log('✅ User créé partout:', authUserId);

    // Succès!
    return NextResponse.json(
      { 
        message: 'Inscription réussie!',
        user: { id: authUserId, email }
      },
      { status: 201 }
    );

  } catch (err: any) {
    console.error('❌ Erreur inattendue:', err);
    return NextResponse.json(
      { error: err?.message ?? 'Erreur serveur' },
      { status: 500 }
    );
  }
}
