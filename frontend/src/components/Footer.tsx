import { Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-border bg-card/30 backdrop-blur-sm mt-auto">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p className="flex items-center gap-2">
            © 2025. Built with <Heart className="w-4 h-4 text-red-500 fill-red-500" /> using{' '}
            <a
              href="https://caffeine.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline font-medium"
            >
              caffeine.ai
            </a>
          </p>
          <p className="text-xs">
            Arduino Uno • MPU6050 • ESP8266 • FLIR Lepton
          </p>
        </div>
      </div>
    </footer>
  );
}
