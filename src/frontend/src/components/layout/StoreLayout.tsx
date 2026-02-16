import { Link, useNavigate } from '@tanstack/react-router';
import LoginButton from '../auth/LoginButton';
import ProfileSetupModal from '../auth/ProfileSetupModal';
import { useGetAllCategories } from '../../hooks/useQueries';
import { useIsCallerAdmin } from '../../hooks/useAuthz';
import { usePrincipalId } from '../../hooks/usePrincipalId';
import { Button } from '@/components/ui/button';
import { ShoppingBag, Menu, X, User } from 'lucide-react';
import { SiX, SiFacebook, SiLinkedin } from 'react-icons/si';
import { useState } from 'react';

interface StoreLayoutProps {
  children: React.ReactNode;
}

export default function StoreLayout({ children }: StoreLayoutProps) {
  const navigate = useNavigate();
  const { data: categories = [] } = useGetAllCategories();
  const { data: isAdmin } = useIsCallerAdmin();
  const { isAuthenticated } = usePrincipalId();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <ProfileSetupModal />
      
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center space-x-2">
              <img src="/assets/generated/logo-mark.dim_256x256.png" alt="ScriptScope" className="h-8 w-8" />
              <span className="text-xl font-bold">ScriptScope</span>
            </Link>

            <nav className="hidden md:flex items-center space-x-6">
              <Link to="/" className="text-sm hover:text-primary transition-colors">
                Home
              </Link>
              {categories.slice(0, 4).map((cat) => (
                <Link
                  key={cat}
                  to="/category/$categoryName"
                  params={{ categoryName: cat }}
                  className="text-sm hover:text-primary transition-colors"
                >
                  {cat}
                </Link>
              ))}
              <Link to="/bundles" className="text-sm hover:text-primary transition-colors">
                Bundles
              </Link>
              <Link to="/purchases" className="text-sm hover:text-primary transition-colors">
                <ShoppingBag className="h-4 w-4" />
              </Link>
              {isAuthenticated && (
                <Link to="/account" className="text-sm hover:text-primary transition-colors">
                  <User className="h-4 w-4" />
                </Link>
              )}
              {isAdmin && (
                <Button variant="outline" size="sm" onClick={() => navigate({ to: '/admin/products' })}>
                  Admin
                </Button>
              )}
              <LoginButton />
            </nav>

            <button className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {mobileMenuOpen && (
            <nav className="md:hidden py-4 space-y-2 border-t border-border/50">
              <Link
                to="/"
                className="block py-2 text-sm hover:text-primary transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
              {categories.map((cat) => (
                <Link
                  key={cat}
                  to="/category/$categoryName"
                  params={{ categoryName: cat }}
                  className="block py-2 text-sm hover:text-primary transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {cat}
                </Link>
              ))}
              <Link
                to="/bundles"
                className="block py-2 text-sm hover:text-primary transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Bundles
              </Link>
              <Link
                to="/purchases"
                className="block py-2 text-sm hover:text-primary transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                My Purchases
              </Link>
              {isAuthenticated && (
                <Link
                  to="/account"
                  className="block py-2 text-sm hover:text-primary transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Account
                </Link>
              )}
              {isAdmin && (
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => {
                    navigate({ to: '/admin/products' });
                    setMobileMenuOpen(false);
                  }}
                >
                  Admin Dashboard
                </Button>
              )}
              <div className="pt-2">
                <LoginButton />
              </div>
            </nav>
          )}
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t border-border/50 bg-card/30 mt-12">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-semibold mb-4">ScriptScope Market</h3>
              <p className="text-sm text-muted-foreground">
                Premium Pine Script indicators and strategies for TradingView traders.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Categories</h4>
              <ul className="space-y-2">
                {categories.slice(0, 4).map((cat) => (
                  <li key={cat}>
                    <Link
                      to="/category/$categoryName"
                      params={{ categoryName: cat }}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      {cat}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2">
                <li>
                  <Link to="/disclaimer" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    Disclaimer
                  </Link>
                </li>
                <li>
                  <Link to="/terms" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link
                    to="/refund-policy"
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    Refund Policy
                  </Link>
                </li>
                <li>
                  <Link
                    to="/privacy-policy"
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Connect</h4>
              <div className="flex space-x-4">
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  <SiX className="h-5 w-5" />
                </a>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  <SiFacebook className="h-5 w-5" />
                </a>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  <SiLinkedin className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-border/50 text-center text-sm text-muted-foreground">
            <p>
              © {new Date().getFullYear()} ScriptScope Market. Built with ❤️ using{' '}
              <a
                href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
                  window.location.hostname
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors"
              >
                caffeine.ai
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
