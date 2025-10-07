'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '../../../lib/supabase/server';
export async function login(formData: FormData) {
  const supabase = createClient();

  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return redirect(
      `/login?message=Could not authenticate user: ${error.message}`,
    );
  }

  revalidatePath('/', 'layout');
  return redirect('/dashboard');
}

export async function signup(formData: FormData) {
  const supabase = createClient();

  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      // For this demo, we'll auto-confirm emails.
      // In a real app, you'd want to send a confirmation link.
      emailRedirectTo: 'http://localhost:3000/auth/callback',
    },
  });

  if (error) {
    return redirect(`/login?message=Could not create user: ${error.message}`);
  }

  // A sign-up doesn't automatically sign the user in with Supabase's default settings.
  // You might want to show a "Please check your email to confirm your account" message.
  // For this demo, we will redirect to a message page. Or just log them in.
  // Let's sign them in directly after sign up for a better demo experience.
  const { error: signInError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (signInError) {
    return redirect(
      `/login?message=Could not authenticate user after signup: ${signInError.message}`,
    );
  }

  revalidatePath('/', 'layout');
  return redirect('/dashboard');
}
