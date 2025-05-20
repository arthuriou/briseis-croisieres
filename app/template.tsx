"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { usePathname } from "next/navigation";

export default function Template({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  
  // Ne pas afficher l'en-tête et le pied de page pour les pages d'administration
  if (pathname?.startsWith('/admin')) {
    return <>{children}</>;
  }
  
  // Afficher l'en-tête et le pied de page pour toutes les autres pages
  return (
    <>
      <Header />
      <main className="flex-grow" style={{ paddingTop: 0 }}>
        {children}
      </main>
      <Footer />
    </>
  );
} 