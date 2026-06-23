import type { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://thinksoft.ai"

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/cli-auth/"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
