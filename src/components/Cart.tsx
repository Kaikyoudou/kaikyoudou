import { X, Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { CartItem } from '../App';
import { Button } from './ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from './ui/sheet';
import { Separator } from './ui/separator';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemove: (productId: string) => void;
  onCheckout: () => void;
  totalPrice: number;
}

export function Cart({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemove,
  onCheckout,
  totalPrice
}: CartProps) {
  const shippingFee = totalPrice >= 5000 ? 0 : 500;
  const finalTotal = totalPrice + shippingFee;

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-lg flex flex-col">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            ショッピングカート
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
            <ShoppingBag className="h-16 w-16 mb-4" />
            <p>カートは空です</p>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto py-4">
              <div className="space-y-4">
                {items.map(item => (
                  <div key={item.id} className="flex gap-4 bg-gray-50 p-4 rounded-lg">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-cyan-50 rounded overflow-hidden flex-shrink-0">
                      <ImageWithFallback
                        src={item.imageUrl || `https://images.unsplash.com/photo-1530325553241-4f6e7690cf36?w=200&h=200&fit=crop`}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm mb-1 truncate">{item.name}</h4>
                      <p className="text-sm text-blue-600 mb-2">¥{item.price.toLocaleString()}</p>
                      
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="text-sm w-8 text-center">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                          disabled={item.quantity >= item.stock}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>

                    <div className="flex flex-col items-end justify-between">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => onRemove(item.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                      <span className="text-sm">
                        ¥{(item.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t pt-4 space-y-4">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">小計</span>
                  <span>¥{totalPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">送料</span>
                  <span>
                    {shippingFee === 0 ? (
                      <span className="text-green-600">無料</span>
                    ) : (
                      `¥${shippingFee}`
                    )}
                  </span>
                </div>
                {totalPrice < 5000 && totalPrice > 0 && (
                  <p className="text-xs text-gray-500">
                    あと¥{(5000 - totalPrice).toLocaleString()}で送料無料
                  </p>
                )}
                <Separator />
                <div className="flex justify-between text-lg">
                  <span>合計</span>
                  <span className="text-blue-600">¥{finalTotal.toLocaleString()}</span>
                </div>
              </div>

              <Button
                className="w-full"
                size="lg"
                onClick={onCheckout}
                disabled={items.length === 0}
              >
                レジに進む
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
