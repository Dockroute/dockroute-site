import { HomeLayout } from "fumadocs-ui/layouts/home";
import Link from "next/link";
import { baseOptions } from "@/lib/layout.shared";
import { appName, gitConfig } from "@/lib/shared";

export default function Layout({ children }: LayoutProps<"/">) {
  return (
    <HomeLayout {...baseOptions()}>
      {children}
      <Footer />
    </HomeLayout>
  );
}

function Footer() {
  return (
    <footer className="border-t border-fd-border">
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-8 text-sm text-fd-muted-foreground">
        <p>
          <span className="font-semibold text-fd-foreground">{appName}</span> —
          the harbor pilot for containerized services. MIT licensed.
        </p>
        <nav className="flex gap-5">
          <Link href="/docs" className="hover:text-fd-foreground">
            Documentation
          </Link>
          <a
            href={`https://github.com/${gitConfig.user}/${gitConfig.repo}`}
            className="hover:text-fd-foreground"
          >
            GitHub
          </a>
          <a
            href={`https://github.com/${gitConfig.user}/${gitConfig.repo}/releases`}
            className="hover:text-fd-foreground"
          >
            Releases
          </a>
        </nav>
      </div>
    </footer>
  );
}
