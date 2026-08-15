import { HomeLayout } from "fumadocs-ui/layouts/home";
import Link from "next/link";
import { baseOptions } from "@/lib/layout.shared";
import { appName, repoLinks } from "@/lib/shared";

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
        <nav className="flex flex-wrap gap-x-5 gap-y-2">
          <Link href="/docs" className="hover:text-fd-foreground">
            Documentation
          </Link>
          <Link href="/changelog" className="hover:text-fd-foreground">
            Changelog
          </Link>
          <a href={repoLinks.home} className="hover:text-fd-foreground">
            GitHub
          </a>
          <a href={repoLinks.issues} className="hover:text-fd-foreground">
            Issues
          </a>
          <a href={repoLinks.releases} className="hover:text-fd-foreground">
            Releases
          </a>
          <a href={repoLinks.security} className="hover:text-fd-foreground">
            Security
          </a>
        </nav>
      </div>
    </footer>
  );
}
