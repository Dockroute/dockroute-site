import { createMDX } from "fumadocs-mdx/next";

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  output: "standalone",
  async headers() {
    return [
      {
        source: "/",
        headers: [
          {
            // RFC 8288 discovery pointers for agents
            key: "Link",
            value:
              '</docs>; rel="service-doc", </llms.txt>; rel="alternate"; type="text/markdown"',
          },
          { key: "Vary", value: "Accept" },
        ],
      },
    ];
  },
};

export default withMDX(config);
