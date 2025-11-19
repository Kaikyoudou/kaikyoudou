import { useState } from 'react';
import { ArrowLeft, ShoppingCart, Minus, Plus } from 'lucide-react';
import { Product } from '../App';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card } from './ui/card';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface ProductDetailProps {
  product: Product;
  allProducts: Product[];
  onAddToCart: (product: Product, quantity: number) => void;
  onBack: () => void;
  onProductClick: (product: Product) => void;
}

export function ProductDetail({ product, allProducts, onAddToCart, onBack, onProductClick }: ProductDetailProps) {
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    onAddToCart(product, quantity);
    setQuantity(1);
  };

  const incrementQuantity = () => {
    if (quantity < product.stock) {
      setQuantity(prev => prev + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  // 関連商品を取得
  const relatedProducts = product.relatedProductIds
    ? product.relatedProductIds
        .map(id => allProducts.find(p => p.id === id))
        .filter((p): p is Product => p !== undefined)
        .slice(0, 3)
    : [];

  return (
    <div className="max-w-6xl mx-auto">
      <Button
        variant="ghost"
        onClick={onBack}
        className="mb-6"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        商品一覧に戻る
      </Button>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="aspect-square bg-gradient-to-br from-blue-100 to-cyan-50 rounded-lg overflow-hidden">
          <ImageWithFallback
            src={product.imageUrl || `https://images.unsplash.com/photo-1530325553241-4f6e7690cf36?w=800&h=800&fit=crop`}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex flex-col">
          <Badge variant="outline" className="w-fit mb-4">
            {product.category}
          </Badge>
          
          <h1 className="text-4xl mb-4">{product.name}</h1>
          
          <div className="text-3xl text-blue-600 mb-6">
            ¥{product.price.toLocaleString()}
          </div>

          <p className="text-gray-700 mb-6 leading-relaxed">
            {product.description}
          </p>

          <Card className="p-4 mb-6 bg-blue-50 border-blue-200">
            <div className="flex items-center justify-between">
              <span className="text-sm">在庫状況：</span>
              <span className={`${product.stock > 10 ? 'text-green-600' : 'text-orange-600'}`}>
                {product.stock > 10 ? '在庫あり' : `残り${product.stock}点`}
              </span>
            </div>
          </Card>

          <div className="flex items-center gap-4 mb-6">
            <span className="text-sm">数量：</span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={decrementQuantity}
                disabled={quantity <= 1}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="text-xl w-12 text-center">{quantity}</span>
              <Button
                variant="outline"
                size="icon"
                onClick={incrementQuantity}
                disabled={quantity >= product.stock}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <Button
            size="lg"
            onClick={handleAddToCart}
            className="w-full"
            disabled={product.stock === 0}
          >
            <ShoppingCart className="mr-2 h-5 w-5" />
            カートに追加
          </Button>

          <div className="mt-8 pt-8 border-t border-gray-200">
            <h3 className="mb-4">商品情報</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• 送料：全国一律500円（5,000円以上で送料無料）</li>
              <li>• お届け日：ご注文から3〜5営業日</li>
              <li>• お支払い方法：クレジットカード（Square決済）</li>
            </ul>
          </div>
        </div>
      </div>

      {relatedProducts.length > 0 && (
        <div className="mt-16 pt-12 border-t border-gray-200">
          <h2 className="text-2xl mb-6">この商品を買った人はこんな商品も買っています</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {relatedProducts.map(relatedProduct => (
              <Card 
                key={relatedProduct.id} 
                className="cursor-pointer hover:shadow-lg transition-shadow duration-300 overflow-hidden"
                onClick={() => onProductClick(relatedProduct)}
              >
                <div className="aspect-square bg-gradient-to-br from-blue-100 to-cyan-50 overflow-hidden">
                  <ImageWithFallback
                    src={relatedProduct.imageUrl || `https://images.unsplash.com/photo-1530325553241-4f6e7690cf36?w=400&h=400&fit=crop`}
                    alt={relatedProduct.name}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="p-4">
                  <Badge variant="outline" className="mb-2">
                    {relatedProduct.category}
                  </Badge>
                  <h3 className="mb-2">{relatedProduct.name}</h3>
                  <div className="flex items-center justify-between">
                    <span className="text-xl text-blue-600">¥{relatedProduct.price.toLocaleString()}</span>
                    <Button
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onAddToCart(relatedProduct, 1);
                      }}
                    >
                      <ShoppingCart className="mr-1 h-4 w-4" />
                      カートへ
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}