import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";
import Image from "next/image";
import { GitHubStarButton } from "@/components/social/github-star-button";
import { appName } from "./shared";

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: (
        <>
          <Image
            src="/brand/dockroute-icon-128.png"
            alt=""
            width={26}
            height={26}
          />
          <span className="font-semibold">{appName}</span>
        </>
      ),
    },
    links: [
      {
        text: "Documentation",
        url: "/docs",
        active: "nested-url",
      },
      {
        text: "Changelog",
        url: "/changelog",
        active: "nested-url",
      },
      // Replaces the plain `githubUrl` icon: same destination, plus the star
      // count. It is a server component, which is a valid ReactNode across the
      // RSC boundary into the layout's client components.
      {
        type: "custom",
        secondary: true,
        children: <GitHubStarButton variant="nav" label="Star" />,
      },
    ],
  };
}
