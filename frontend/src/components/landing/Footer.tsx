import { motion } from 'framer-motion';
import { Zap, Github, Twitter, Linkedin, ArrowRight } from 'lucide-react';
import { MagneticButton } from '@/components/effects/MagneticButton';

interface FooterProps {
  onOpenAuth?: (mode: 'login' | 'register') => void;
}

const footerLinks = {
  Product: ['Features', 'Languages', 'Pricing', 'Changelog'],
  Community: ['Leaderboard', 'Contests', 'Blog', 'Discord'],
  Resources: ['Docs', 'API Reference', 'Status', 'Tutorials'],
  Company: ['About', 'Careers', 'Contact', 'Privacy'],
};

export function Footer({ onOpenAuth }: FooterProps) {
  return (
    <footer className="relative overflow-hidden px-6 pt-24">
      {/* Final CTA */}
      <div className="mx-auto mb-24 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="glass-strong relative overflow-hidden rounded-3xl px-8 py-16 text-center md:px-16"
        >
          <div className="absolute -top-20 left-1/2 h-40 w-80 -translate-x-1/2 rounded-full bg-neon-emerald/20 blur-[100px]" />
          <div className="absolute -bottom-20 right-1/4 h-40 w-80 rounded-full bg-neon-purple/15 blur-[100px]" />

          <div className="relative z-10">
            <h2 className="text-4xl font-bold tracking-tight text-white md:text-5xl">
              Ready to compete?
            </h2>
            <p className="mx-auto mt-4 max-w-md text-base text-white/50">
              Join our growing community of developers solving problems, climbing the ranks,
              and pushing their limits every day.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <MagneticButton
                onClick={() => onOpenAuth?.('register')}
                className="group bg-gradient-to-r from-neon-emerald to-neon-blue text-black hover:shadow-[0_0_40px_rgba(16,255,176,0.4)]"
              >
                <span className="flex items-center gap-2">
                  Create Free Account
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </MagneticButton>
              <MagneticButton
                onClick={() => alert('Pricing page is currently under development.')}
                className="glass text-white hover:bg-white/10"
                strength={0.2}
              >
                View Pricing
              </MagneticButton>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Footer links */}
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-2 gap-8 border-t border-white/5 py-12 md:grid-cols-6">
          {/* Logo column */}
          <div className="col-span-2">
            <a href="#" className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-neon-emerald to-neon-blue">
                <Zap className="h-5 w-5 text-black" strokeWidth={2.5} />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                Codenix
              </span>
            </a>
            <p className="mt-4 max-w-xs text-sm text-white/40">
              The next-generation online judge and competitive programming
              platform.
            </p>
            <div className="mt-6 flex gap-3">
              {[
                { icon: Github, href: "https://github.com/Prachi01Yadav" },
                { icon: Twitter, href: "https://twitter.com/Prachiydv01" },
                { icon: Linkedin, href: "https://www.linkedin.com/in/prachiyadav01" }
              ].map(({ icon: Icon, href }, i) => (
                <a
                  key={i}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/5 bg-white/[0.02] text-white/50 transition-colors hover:border-white/15 hover:text-white"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="mb-4 text-sm font-semibold text-white">
                {category}
              </h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm text-white/40 transition-colors hover:text-white"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-white/5 py-8 md:flex-row">
          <p className="text-xs text-white/30">
            © 2026 Codenix. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-xs text-white/30 hover:text-white/60">
              Terms
            </a>
            <a href="#" className="text-xs text-white/30 hover:text-white/60">
              Privacy
            </a>
            <a href="#" className="text-xs text-white/30 hover:text-white/60">
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
