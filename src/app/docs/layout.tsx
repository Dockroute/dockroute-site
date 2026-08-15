import { DocsLayout } from "fumadocs-ui/layouts/docs";
import { ReleaseBadge } from "@/components/social/release-badge";
import { baseOptions } from "@/lib/layout.shared";
import { source } from "@/lib/source";

export default function Layout({ children }: LayoutProps<"/docs">) {
  return (
    <DocsLayout
      tree={source.getPageTree()}
      sidebar={{ footer: <ReleaseBadge className="mt-2 justify-center" /> }}
      {...baseOptions()}
    >
      {children}
    </DocsLayout>
  );
}
