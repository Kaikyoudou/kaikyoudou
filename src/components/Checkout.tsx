import { useState } from 'react';
import { CreditCard, Check } from 'lucide-react';
import { CartItem } from '../App';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Separator } from './ui/separator';
import { Card } from './ui/card';

interface CheckoutProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  totalPrice: number;
  onComplete: () => void;
}

export function Checkout({ isOpen, onClose, items, totalPrice, onComplete }: CheckoutProps) {
  const [step, setStep] = useState<'info' | 'payment' | 'complete'>('info');
  const [isProcessing, setIsProcessing] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    postalCode: '',
    prefecture: '',
    city: '',
    address: '',
    building: ''
  });

  const shippingFee = totalPrice >= 5000 ? 0 : 500;
  const finalTotal = totalPrice + shippingFee;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleInfoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('payment');
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Simulate Square payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsProcessing(false);
    setStep('complete');
  };

  const handleComplete = () => {
    onComplete();
    onClose();
    setStep('info');
    setFormData({
      name: '',
      email: '',
      phone: '',
      postalCode: '',
      prefecture: '',
      city: '',
      address: '',
      building: ''
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {step === 'info' && 'お届け先情報'}
            {step === 'payment' && 'お支払い情報'}
            {step === 'complete' && '注文完了'}
          </DialogTitle>
          <DialogDescription>
            {step === 'info' && '商品のお届け先を入力してください'}
            {step === 'payment' && 'お支払い方法を選択してください'}
            {step === 'complete' && 'ご注文が完了しました'}
          </DialogDescription>
        </DialogHeader>

        {step === 'info' && (
          <form onSubmit={handleInfoSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">お名前 *</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  placeholder="山田 太郎"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email">メールアドレス *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    placeholder="example@email.com"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">電話番号 *</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    placeholder="090-1234-5678"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="postalCode">郵便番号 *</Label>
                  <Input
                    id="postalCode"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleInputChange}
                    required
                    placeholder="750-0000"
                  />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="prefecture">都道府県 *</Label>
                  <Input
                    id="prefecture"
                    name="prefecture"
                    value={formData.prefecture}
                    onChange={handleInputChange}
                    required
                    placeholder="山口県"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="city">市区町村 *</Label>
                <Input
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  required
                  placeholder="下関市"
                />
              </div>

              <div>
                <Label htmlFor="address">番地 *</Label>
                <Input
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                  placeholder="南部町1-1"
                />
              </div>

              <div>
                <Label htmlFor="building">建物名・部屋番号</Label>
                <Input
                  id="building"
                  name="building"
                  value={formData.building}
                  onChange={handleInputChange}
                  placeholder="海峡マンション101"
                />
              </div>
            </div>

            <Button type="submit" className="w-full" size="lg">
              お支払い情報へ進む
            </Button>
          </form>
        )}

        {step === 'payment' && (
          <div className="space-y-6">
            <Card className="p-4 bg-blue-50 border-blue-200">
              <h3 className="text-sm mb-3">ご注文内容</h3>
              <div className="space-y-2 text-sm">
                {items.map(item => (
                  <div key={item.id} className="flex justify-between">
                    <span>{item.name} × {item.quantity}</span>
                    <span>¥{(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
                <Separator />
                <div className="flex justify-between">
                  <span>送料</span>
                  <span>{shippingFee === 0 ? '無料' : `¥${shippingFee}`}</span>
                </div>
                <div className="flex justify-between text-lg text-blue-600">
                  <span>合計</span>
                  <span>¥{finalTotal.toLocaleString()}</span>
                </div>
              </div>
            </Card>

            <form onSubmit={handlePayment} className="space-y-4">
              <div className="border rounded-lg p-4 bg-gray-50">
                <div className="flex items-center gap-2 mb-4">
                  <CreditCard className="h-5 w-5 text-blue-600" />
                  <span>Square決済（デモモード）</span>
                </div>
                <p className="text-sm text-gray-600">
                  実際の決済では、Squareの安全な決済フォームが表示されます。
                  <br />
                  ※このデモでは実際の決済は行われません。
                </p>
              </div>

              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep('info')}
                  className="flex-1"
                >
                  戻る
                </Button>
                <Button
                  type="submit"
                  className="flex-1"
                  disabled={isProcessing}
                >
                  {isProcessing ? '処理中...' : '注文を確定する'}
                </Button>
              </div>
            </form>
          </div>
        )}

        {step === 'complete' && (
          <div className="text-center py-8 space-y-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <Check className="h-8 w-8 text-green-600" />
            </div>
            
            <div>
              <h3 className="text-2xl mb-2">ご注文ありがとうございます！</h3>
              <p className="text-gray-600">
                ご注文を受け付けました。<br />
                確認メールを {formData.email} に送信いたしました。
              </p>
            </div>

            <Card className="p-4 text-left bg-blue-50 border-blue-200">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">注文番号</span>
                  <span>#{Math.random().toString(36).substr(2, 9).toUpperCase()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">お届け先</span>
                  <span>{formData.prefecture} {formData.city}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">お支払い金額</span>
                  <span className="text-blue-600">¥{finalTotal.toLocaleString()}</span>
                </div>
              </div>
            </Card>

            <Button onClick={handleComplete} size="lg" className="w-full">
              閉じる
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}