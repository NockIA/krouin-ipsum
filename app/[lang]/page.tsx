import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import HomePageClient from '@/components/HomePageClient';
import { type UiLanguage } from '@/i18n';

type LangPageProps = {
  params: Promise<{
    lang: string;
  }>;
};

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://goelo-gen.vercel.app').replace(/\/$/, '');

const supportedLanguages: UiLanguage[] = ['fr', 'br'];

const isSupportedLanguage = (lang: string): lang is UiLanguage => {
  return supportedLanguages.includes(lang as UiLanguage);
};

export const dynamicParams = false;

export function generateStaticParams() {
  return supportedLanguages.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: LangPageProps): Promise<Metadata> {
  const { lang: rawLang } = await params;
  const lang = isSupportedLanguage(rawLang) ? rawLang : 'fr';

  return {
    metadataBase: new URL(siteUrl),
    alternates: {
      canonical: `/${lang}`,
      languages: {
        fr: '/fr',
        br: '/br',
      },
    },
  };
}

export default async function LangPage({ params }: LangPageProps) {
  const { lang } = await params;

  if (!isSupportedLanguage(lang)) {
    notFound();
  }

  return <HomePageClient initialLanguage={lang} />;
}
