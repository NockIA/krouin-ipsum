import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://krouin-ipsum.bzh";

export const metadata: Metadata = {
  // Titre et description optimisés SEO
  title: {
    default: "Krouin Ipsum - Générateur Lorem Ipsum Breton | Faux texte gratuit",
    template: "%s | Krouin Ipsum",
  },
  description:
    "Générez du faux texte en breton authentique pour vos maquettes, wireframes et prototypes. 10 000 phrases issues de Wikipédia brezhoneg. Gratuit, rapide, sans inscription.",

  // Mots-clés étendus
  keywords: [
    "lorem ipsum breton",
    "générateur texte breton",
    "faux texte maquette",
    "placeholder text",
    "brezhoneg",
    "texte factice",
    "wireframe text",
    "développeur",
    "designer",
    "figma placeholder",
    "dummy text",
    "texte fictif",
    "alternative lorem ipsum",
    "langue bretonne",
  ],

  // Auteur et éditeur
  authors: [{ name: "NockIA" }],
  creator: "NockIA",
  publisher: "NockIA",

  // Métadonnées de base
  metadataBase: new URL(siteUrl),
  alternates: {
    canonical: "/",
    languages: {
      "fr-FR": "/",
    },
  },

  // Robots et indexation
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  // Icônes et favicon
  icons: {
    icon: [
      { url: "/hermine.webp", sizes: "32x32", type: "image/webp" },
      { url: "/hermine.webp", sizes: "16x16", type: "image/webp" },
    ],
    apple: [{ url: "/hermine.webp", sizes: "180x180", type: "image/webp" }],
  },

  // Open Graph (Facebook, LinkedIn, etc.)
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: siteUrl,
    siteName: "Krouin Ipsum",
    title: "Krouin Ipsum - Lorem Ipsum en Breton",
    description:
      "Le générateur de faux texte breton pour développeurs et designers. Corpus authentique de 10 000 phrases issues de Wikipédia brezhoneg.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Krouin Ipsum - Générateur Lorem Ipsum Breton avec l'hermine bretonne",
        type: "image/png",
      },
    ],
  },

  // Catégorie et classification
  category: "technology",
  classification: "Developer Tools",

  // Autres métadonnées
  applicationName: "Krouin Ipsum",
  referrer: "origin-when-cross-origin",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {children}
      </body>
    </html>
  );
}
