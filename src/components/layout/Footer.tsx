import { SITE_NAME } from '@/lib/constants';
import Link from 'next/link';
import AppLogo from './AppLogo';
import { Github, Linkedin, Twitter } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t bg-muted/50">
      <div className="container mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <AppLogo iconSize={24} textSize="text-xl" />
            <p className="mt-1 text-sm text-foreground"> {/* Changed class for better visibility and positioning */}
              Fostering connections, building futures.
            </p>
            <div className="mt-4 flex space-x-4">
              <Link href="#" className="text-muted-foreground hover:text-primary">
                <Github size={20} />
                <span className="sr-only">GitHub</span>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary">
                <Linkedin size={20} />
                <span className="sr-only">LinkedIn</span>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary">
                <Twitter size={20} />
                <span className="sr-only">Twitter</span>
              </Link>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-foreground tracking-wider uppercase">Quick Links</h3>
            <ul role="list" className="mt-4 space-y-2">
              <li><Link href="/dashboard/events" className="text-sm text-muted-foreground hover:text-primary">Events</Link></li>
              <li><Link href="/dashboard/notable-alumni" className="text-sm text-muted-foreground hover:text-primary">Notable Alumni</Link></li>
              <li><Link href="/dashboard/mentorship/search" className="text-sm text-muted-foreground hover:text-primary">Find a Mentor</Link></li>
              <li><Link href="/contact" className="text-sm text-muted-foreground hover:text-primary">Contact Us</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground tracking-wider uppercase">Legal</h3>
            <ul role="list" className="mt-4 space-y-2">
              <li><Link href="/privacy-policy" className="text-sm text-muted-foreground hover:text-primary">Privacy Policy</Link></li>
              <li><Link href="/terms-of-service" className="text-sm text-muted-foreground hover:text-primary">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-border pt-8 text-center">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} {SITE_NAME}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
