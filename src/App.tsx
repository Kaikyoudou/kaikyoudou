import { useState } from 'react';
import { Header } from './components/Header';
import { ProductGrid } from './components/ProductGrid';
import { ProductDetail } from './components/ProductDetail';
import { Cart } from './components/Cart';
import { Checkout } from './components/Checkout';

export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
  category: string;
  stock: number;
  relatedProductIds?: string[]; // 一緒に購入されることが多い商品のID
}

export interface CartItem extends Product {
  quantity: number;
}

const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'フレークステッカー(全3種セット)',
    price: 500,
    description: 'せきまるの可愛いフレークステッカー3種類がセットになりました。ノートやスマホケースのデコレーションに最適！',
    imageUrl: '',
    category: 'ステッカー',
    stock: 50,
    relatedProductIds: ['2', '6', '7']
  },
  {
    id: '2',
    name: 'ポストのシール(台紙シール)',
    price: 300,
    description: 'せきまるのポストデザインの台紙シール1枚。手帳やノートのデコレーションにぴったり。',
    imageUrl: '',
    category: 'ステッカー',
    stock: 60,
    relatedProductIds: ['1', '4', '6']
  },
  {
    id: '3',
    name: 'ハンドタオル(全2種)',
    price: 600,
    description: 'せきまるデザインのハンドタオル。2種類のデザインからお選びいただけます。綿100%で肌触り抜群！',
    imageUrl: '',
    category: 'タオル',
    stock: 40,
    relatedProductIds: ['5', '6', '7']
  },
  {
    id: '4',
    name: 'A4クリアファイル',
    price: 300,
    description: 'A4サイズのクリアファイル1枚。学校やオフィスで活躍！せきまると一緒に書類整理。',
    imageUrl: '',
    category: '文具',
    stock: 70,
    relatedProductIds: ['2', '5', '1']
  },
  {
    id: '5',
    name: 'マルチケース',
    price: 1000,
    description: 'せきまるのマルチケース1個。小物入れやポーチとして使える便利なアイテム。ファスナー付きで安心。',
    imageUrl: '',
    category: '雑貨',
    stock: 30,
    relatedProductIds: ['3', '6', '4']
  },
  {
    id: '6',
    name: 'ラバーストラップ',
    price: 700,
    description: 'せきまるのラバーストラップ1個。カバンやポーチにつけて、いつでもせきまると一緒に！',
    imageUrl: '',
    category: 'ストラップ',
    stock: 45,
    relatedProductIds: ['1', '5', '7']
  },
  {
    id: '7',
    name: '下関スターターセット',
    price: 1100,
    description: 'せきまるグッズを初めて買う方におすすめ！フレークステッカー(全3種セット)とラバーストラップのお得なセット。通常価格より100円お得です。',
    imageUrl: '',
    category: 'セット商品',
    stock: 25,
    relatedProductIds: ['3', '5', '2']
  }
];

export default function App() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showCart, setShowCart] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);

  const addToCart = (product: Product, quantity: number = 1) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      if (existingItem) {
        return prevItems.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prevItems, { ...product, quantity }];
    });
  };

  const updateCartItemQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const removeFromCart = (productId: string) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
  };

  const getTotalItems = () => {
    return cartItems.reduce((sum, item) => sum + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const handleCheckout = () => {
    setShowCart(false);
    setShowCheckout(true);
  };

  const handleCheckoutComplete = () => {
    setCartItems([]);
    setShowCheckout(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Header
        cartItemCount={getTotalItems()}
        onCartClick={() => setShowCart(true)}
      />

      <main className="container mx-auto px-4 py-8">
        {selectedProduct ? (
          <ProductDetail
            product={selectedProduct}
            allProducts={PRODUCTS}
            onAddToCart={addToCart}
            onBack={() => setSelectedProduct(null)}
            onProductClick={setSelectedProduct}
          />
        ) : (
          <>
            <div className="text-center mb-12">
              <h1 className="text-5xl mb-4">海峡堂</h1>
              <p className="text-xl text-gray-600">
                下関市メインキャラクター「せきまる」公式グッズストア
              </p>
            </div>
            <ProductGrid
              products={PRODUCTS}
              onProductClick={setSelectedProduct}
              onAddToCart={addToCart}
            />
          </>
        )}
      </main>

      <Cart
        isOpen={showCart}
        onClose={() => setShowCart(false)}
        items={cartItems}
        onUpdateQuantity={updateCartItemQuantity}
        onRemove={removeFromCart}
        onCheckout={handleCheckout}
        totalPrice={getTotalPrice()}
      />

      <Checkout
        isOpen={showCheckout}
        onClose={() => setShowCheckout(false)}
        items={cartItems}
        totalPrice={getTotalPrice()}
        onComplete={handleCheckoutComplete}
      />
    </div>
  );
}