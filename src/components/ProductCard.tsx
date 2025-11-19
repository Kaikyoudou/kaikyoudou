import { ShoppingCart } from 'lucide-react';
import { Product } from '../App';
import { Card, CardContent, CardFooter } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface ProductCardProps {
  product: Product;
  onClick: () => void;
  onAddToCart: () => void;
}

export function ProductCard({ product, onClick, onAddToCart }: ProductCardProps) {
  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart();
  };

  return (
    <Card
      className="cursor-pointer hover:shadow-lg transition-shadow duration-300 overflow-hidden group"
      onClick={onClick}
    >
      <div className="aspect-square bg-gradient-to-br from-blue-100 to-cyan-50 relative overflow-hidden">
        <ImageWithFallback
          src={product.imageUrl || `https://images.unsplash.com/photo-1530325553241-4f6e7690cf36?w=400&h=400&fit=crop`}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        {product.stock < 10 && (
          <Badge className="absolute top-2 right-2 bg-orange-500">
            残りわずか
          </Badge>
        )}
      </div>
      <CardContent className="p-4">
        <Badge variant="outline" className="mb-2">
          {product.category}
        </Badge>
        <h3 className="mb-2">{product.name}</h3>
        <p className="text-sm text-gray-600 line-clamp-2">{product.description}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex items-center justify-between">
        <span className="text-2xl text-blue-600">¥{product.price.toLocaleString()}</span>
        <Button onClick={handleAddToCart} size="sm">
          <ShoppingCart className="mr-2 h-4 w-4" />
          カートへ
        </Button>
      </CardFooter>
    </Card>
  );
}
