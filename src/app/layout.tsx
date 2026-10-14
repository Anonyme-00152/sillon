import type { Metadata, Viewport } from "next";
import { Instrument_Serif, JetBrains_Mono, Manrope } from "next/font/google";
import ClientChrome from "@/components/shell/ClientChrome";
import Footer from "@/components/shell/Footer";
import Header from "@/components/shell/Header";
import { SITE } from "@/lib/site";
import "./globals.css";

const instrument = Instrument_Serif({
  variable: "--font-instrument",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: {
    default: `${SITE.name} — Le silence, taillé sur mesure`,
    template: `%s — ${SITE.name}`,
  },
  description: SITE.description,
  applicationName: SITE.name,
  authors: [{ name: SITE.author, url: SITE.authorUrl }],
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: SITE.name,
    title: `${SITE.name} — Le silence, taillé sur mesure`,
    description: SITE.description,
  },
};

// Le zoom reste autorisé : pas de maximum-scale ni de user-scalable=no.
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0d0c0a",
};

// Exécuté avant l'affichage : active les styles JS, restaure la préférence
// d'animation et saute le préchargement s'il a déjà été vu dans la session.
const bootScript = `(function(){var d=document.documentElement;d.classList.add('js');try{var m=localStorage.getItem('sillon:motion');var r=m?m==='reduce':matchMedia('(prefers-reduced-motion: reduce)').matches;if(r)d.dataset.motion='reduce';if(r||sessionStorage.getItem('sillon:intro'))d.dataset.intro='skip';}catch(e){}})();`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="fr"
      data-theme="nuit"
      suppressHydrationWarning
      className={`${instrument.variable} ${manrope.variable} ${jetbrains.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
      </head>
      <body>
        <a
          href="#contenu"
          className="btn btn-primary fixed left-4 top-4 z-[120] -translate-y-24 focus-visible:translate-y-0"
        >
          Aller au contenu
        </a>
        <ClientChrome />
        <Header />
        <main id="contenu" tabIndex={-1} className="relative z-10 outline-none">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
