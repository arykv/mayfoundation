import { Instagram, Mail, Phone } from 'lucide-react'
import { nav, org } from '@/data/site'

export function Footer() {
  const contacts = [
    { icon: Mail, label: org.email, href: `mailto:${org.email}` },
    { icon: Phone, label: org.phone, href: `tel:${org.phoneHref}` },
    { icon: Instagram, label: org.instagramHandle, href: org.instagram },
  ]

  return (
    <footer id="contact" className="bg-dusk text-canvas">
      <div className="shell border-t border-canvas/10 py-16">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <p className="font-display text-2xl font-semibold">{org.name}</p>
            <p className="mt-2 text-[0.95rem] text-canvas/55">{org.tagline}</p>
            <p className="mt-6 max-w-[30ch] text-sm leading-relaxed text-canvas/45">
              A youth-led nonprofit working in {org.location} since {org.founded}.
            </p>
          </div>

          <nav aria-label="Footer">
            <p className="eyebrow !text-canvas/40">Sections</p>
            <ul className="mt-5 space-y-3">
              {nav.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="text-[0.95rem] text-canvas/70 transition-colors hover:text-canvas"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <p className="eyebrow !text-canvas/40">Get in touch</p>
            <ul className="mt-5 space-y-3">
              {contacts.map(({ icon: Icon, label, href }) => (
                <li key={href}>
                  <a
                    href={href}
                    {...(href.startsWith('http')
                      ? { target: '_blank', rel: 'noopener noreferrer' }
                      : {})}
                    className="group inline-flex items-center gap-2.5 text-[0.95rem] text-canvas/70 transition-colors hover:text-canvas"
                  >
                    <Icon size={15} className="text-canvas/40 group-hover:text-coral" />
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-3 border-t border-canvas/10 pt-8 text-xs text-canvas/40 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {org.name}. All rights reserved.
          </p>
          <p>{org.location}</p>
        </div>
      </div>
    </footer>
  )
}
