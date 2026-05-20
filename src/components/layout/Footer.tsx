import Link from "next/link";
import Container from "@/components/shared/Container";
import { SITE_NAME, SITE_TAGLINE, FOOTER_LINKS, DISCLAIMER_TEXT } from "@/lib/constants";

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50">
      <Container className="py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {/* Brand column */}
          <div>
            <p className="font-heading text-lg font-bold text-deep-blue">
              {SITE_NAME}
            </p>
            <p className="mt-2 text-sm text-slate-600">{SITE_TAGLINE}</p>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900">
              Quick Links
            </h3>
            <ul className="mt-3 space-y-2">
              {FOOTER_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-600 hover:text-deep-blue"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Disclaimer */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900">Disclaimer</h3>
            <p className="mt-3 text-xs leading-relaxed text-slate-500">
              {DISCLAIMER_TEXT}
            </p>
          </div>
        </div>

        <div className="mt-10 border-t border-slate-200 pt-6">
          <p className="text-center text-xs text-slate-500">
            &copy; {new Date().getFullYear()} {SITE_NAME}. All rights reserved.
          </p>
        </div>
      </Container>
    </footer>
  );
}
