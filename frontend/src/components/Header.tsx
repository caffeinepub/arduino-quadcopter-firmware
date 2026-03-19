import { Button } from '@/components/ui/button';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { LogIn, LogOut, Radio } from 'lucide-react';

export default function Header() {
  const { identity, login, clear, isLoggingIn } = useInternetIdentity();

  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between max-w-7xl">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 p-2 rounded-lg">
            <Radio className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-bold">Quadcopter Control</h1>
            <p className="text-xs text-muted-foreground">Arduino Flight System</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {identity ? (
            <>
              <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                Connected
              </div>
              <Button onClick={clear} variant="outline" size="sm">
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </>
          ) : (
            <Button onClick={login} disabled={isLoggingIn} size="sm">
              <LogIn className="w-4 h-4 mr-2" />
              {isLoggingIn ? 'Connecting...' : 'Login'}
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
