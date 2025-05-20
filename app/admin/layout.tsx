"use client";

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { supabase } from '@/utils/supabase/client';
import Link from 'next/link';
import Image from 'next/image';
import { Montserrat, Playfair_Display } from "next/font/google";
import Head from 'next/head';

const montserrat = Montserrat({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-montserrat",
});

const playfair_display = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-playfair-display",
});

// Les métadonnées ne peuvent pas être exportées depuis un composant client
// Nous utiliserons Head dans le rendu à la place

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Vérifier si l'utilisateur est connecté
    const checkSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        setSession(data.session);
        
        // Si on n'est pas sur la page d'authentification et que l'utilisateur n'est pas connecté
        if (!data.session && pathname !== '/admin/auth') {
          router.push('/admin/auth');
        }
      } catch (error) {
        console.error('Erreur lors de la vérification de la session:', error);
      } finally {
        setLoading(false);
      }
    };

    checkSession();

    // Mettre en place un écouteur pour les changements d'authentification
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      if (!session && pathname !== '/admin/auth') {
        router.push('/admin/auth');
      }
    });

    return () => {
      // Nettoyer l'écouteur
      if (authListener && authListener.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, [pathname, router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/admin/auth');
  };

  const isActive = (path: string) => {
    return pathname?.startsWith(path) ? 'text-[#c8b273] border-b-2 border-[#c8b273]' : 'hover:text-[#c8b273] transition-colors';
  };

  // Si on est sur la page d'authentification, afficher simplement le contenu sans la barre de navigation
  if (pathname === '/admin/auth') {
    return <>{children}</>;
  }

  // Afficher un écran de chargement pendant la vérification de la session
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center">
          <svg className="animate-spin h-12 w-12 text-[#c8b273] mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="text-gray-600 font-light">Chargement de l'administration...</span>
        </div>
      </div>
    );
  }

  // Si l'utilisateur n'est pas connecté, ne rien afficher (il sera redirigé)
  if (!session) {
    return null;
  }

  // Afficher le layout admin avec la barre de navigation
  return (
    <div className="min-h-screen bg-gray-50">
      {/* En-tête de l'administration */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/admin/disponibilites" className="flex items-center">
                <div className="w-10 h-10 relative mr-2">
                  <Image 
                    src="/images/OceanLux_logo2.png" 
                    alt="Ocean Lux" 
                    width={100} 
                    height={100}
                    className="object-contain"
                  />
                </div>
                <span className="text-[#161e2c] font-light text-xl tracking-wide">
                  <span className="font-medium">Ocean Lux</span> Administration
                </span>
              </Link>
            </div>
            
            {/* Navigation desktop */}
            <div className="hidden md:flex items-center space-x-8">
              <Link 
                href="/admin/disponibilites" 
                className={`py-5 px-2 text-sm font-medium ${isActive('/admin/disponibilites')}`}
              >
                Disponibilités
              </Link>
              <Link 
                href="/admin/reservations" 
                className={`py-5 px-2 text-sm font-medium ${isActive('/admin/reservations')}`}
              >
                Réservations
              </Link>
              <button 
                onClick={handleLogout}
                className="ml-4 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-black bg-[#161e2c] hover:bg-gray-800 transition-colors"
              >
                Déconnexion
              </button>
            </div>
            
            {/* Bouton menu mobile */}
            <div className="md:hidden">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-[#c8b273] hover:bg-gray-100 focus:outline-none"
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-6 w-6" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  {menuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Menu mobile */}
        {menuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200 pt-2 pb-3">
            <div className="space-y-1 px-4">
              <Link 
                href="/admin/disponibilites" 
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  pathname?.startsWith('/admin/disponibilites')
                    ? 'bg-gray-100 text-[#c8b273]'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-[#c8b273]'
                }`}
                onClick={() => setMenuOpen(false)}
              >
                Disponibilités
              </Link>
              <Link 
                href="/admin/reservations" 
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  pathname?.startsWith('/admin/reservations')
                    ? 'bg-gray-100 text-[#c8b273]'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-[#c8b273]'
                }`}
                onClick={() => setMenuOpen(false)}
              >
                Réservations
              </Link>
              <div className="border-t border-gray-200 mt-4 pt-4">
                <button 
                  onClick={() => {
                    handleLogout();
                    setMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-black   bg-[#161e2c] hover:bg-gray-800"
                >
                  Déconnexion
                </button>
              </div>
            </div>
          </div>
        )}
      </header>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {children}
      </main>
    </div>
  );
} 