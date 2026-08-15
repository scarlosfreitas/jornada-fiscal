import type { Metadata } from "next";
import { IBM_Plex_Sans, IBM_Plex_Mono, Space_Grotesk } from "next/font/google";
import "./gestor-alertas.css";

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Gertor de Alertas",
  description: "Sistema de apoio à jornada fiscal do auditor fiscal",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      style={
        {
          "--ga-font-body": ibmPlexSans.style.fontFamily,
          "--ga-font-mono": ibmPlexMono.style.fontFamily,
          "--ga-font-display": spaceGrotesk.style.fontFamily,
        } as React.CSSProperties
      }
    >
      <body>{children}</body>
    </html>
  );
}
