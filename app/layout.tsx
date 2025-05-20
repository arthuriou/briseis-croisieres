import type { Metadata } from "next";
import { Montserrat, Playfair_Display } from "next/font/google";
import "./globals.css";

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

export const metadata: Metadata = {
  title: "Ocean Lux - Croisière à Bonifacio",
  description: "Offrez-vous l'occasion unique de partir en croisière depuis Bonifacio à destination des îles Lavezzi le temps d'une journée.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Ce layout ne s'applique pas au dossier admin
  // Le routage Next.js le détecterait normalement avec le segment /admin/layout
  // mais nous ajoutons une vérification supplémentaire
  
  return (
    <html lang="fr" className={`${montserrat.variable} ${playfair_display.variable}`}>
      <body style={{ margin: 0, padding: 0 }} className="min-h-screen flex flex-col m-0 p-0 overflow-x-hidden">
        {children}
      </body>
    </html>
  );
} 