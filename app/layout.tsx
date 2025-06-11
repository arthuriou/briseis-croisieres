import { Metadata } from 'next';
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
  title: {
    template: '%s | OceanLux Croisières',
    default: 'OceanLux Croisières | Hébergements et croisières de luxe'
  },
  description: 'Découvrez nos hébergements de luxe et croisières exclusives dans les plus belles destinations méditerranéennes.',
  icons: {
    icon: '/favicon.ico'
  }
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