import { Helmet } from "react-helmet-async";

interface SeoProps {
  title: string;
  description: string;
  noIndex?: boolean;
  jsonLd?: Record<string, unknown>;
}

export function Seo({ title, description, noIndex = false, jsonLd }: SeoProps) {
  const full = `${title} · Cherry Vibes`;
  return (
    <Helmet>
      <title>{full}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={full} />
      <meta property="og:description" content={description} />
      <meta name="twitter:title" content={full} />
      <meta name="twitter:description" content={description} />
      {noIndex && <meta name="robots" content="noindex, nofollow" />}
      {jsonLd && <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>}
    </Helmet>
  );
}
