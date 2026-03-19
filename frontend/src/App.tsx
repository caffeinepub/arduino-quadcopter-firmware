import { useState } from 'react';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import Header from './components/Header';
import Footer from './components/Footer';
import SettingsPanel from './components/SettingsPanel';
import QuadcopterVisualization from './components/QuadcopterVisualization';
import { useInternetIdentity } from './hooks/useInternetIdentity';

function App() {
  const { identity } = useInternetIdentity();
  const [activeTab, setActiveTab] = useState<'pid' | 'general' | 'safety'>('pid');

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-background to-accent/5">
        <Header />
        
        <main className="flex-1 container mx-auto px-4 py-8 max-w-7xl">
          {!identity ? (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full" />
                <div className="relative bg-card border-2 border-primary/20 rounded-2xl p-12 shadow-2xl">
                  <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    Arduino Quadcopter Control
                  </h1>
                  <p className="text-muted-foreground text-lg mb-8 max-w-md">
                    Configure your drone's flight parameters, PID settings, and safety features
                  </p>
                  <div className="flex flex-col gap-4 items-center">
                    <p className="text-sm text-muted-foreground">
                      Please log in to access your quadcopter settings
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="bg-card border border-border rounded-xl p-6 shadow-lg">
                  <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
                    <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                    Flight Configuration
                  </h2>
                  <p className="text-muted-foreground mb-6">
                    Adjust PID parameters, throttle limits, and enable camera systems
                  </p>
                  <SettingsPanel activeTab={activeTab} onTabChange={setActiveTab} />
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-card border border-border rounded-xl p-6 shadow-lg h-full">
                  <h2 className="text-2xl font-bold mb-2">3D Visualization</h2>
                  <p className="text-muted-foreground mb-6">
                    Real-time quadcopter orientation preview
                  </p>
                  <QuadcopterVisualization />
                </div>
              </div>
            </div>
          )}
        </main>

        <Footer />
        <Toaster />
      </div>
    </ThemeProvider>
  );
}

export default App;
