import type { Metadata } from "next";
import { SITE_NAME, SITE_URL } from "./constants";

export function createMetadata(options: {
  title: string;
  description: string;
  path?: string;
  ogImageAlt?: string;
}): Metadata {
  const url = options.path ? `${SITE_URL}${options.path}` : SITE_URL;
  return {
    title: options.title,
    description: options.description,
    openGraph: {
      title: options.title,
      description: options.description,
      url,
      siteName: SITE_NAME,
      images: [
        {
          url: "/og-image.png",
          width: 1200,
          height: 630,
          alt: options.ogImageAlt || SITE_NAME,
        },
      ],
      type: "website",
    },
  };
}
