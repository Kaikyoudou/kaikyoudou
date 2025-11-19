import { ShoppingCart } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

interface HeaderProps {
  cartItemCount: number;
  onCartClick: () => void;
}

export function Header({ cartItemCount, onCartClick }: HeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-full flex items-center justify-center">
            <span className="text-white text-xl">🐟</span>
          </div>
          <div>
            <h1 className="text-2xl text-blue-600">海峡堂</h1>
            <p className="text-sm text-gray-500">せきまる公式ストア</p>
          </div>
        </div>

        <Button
          variant="outline"
          size="lg"
          onClick={onCartClick}
          className="relative"
        >
          <ShoppingCart className="mr-2 h-5 w-5" />
          カート
          {cartItemCount > 0 && (
            <Badge className="ml-2 bg-red-500 hover:bg-red-600">
              {cartItemCount}
            </Badge>
          )}
        </Button>
      </div>
    </header>
  );
}
