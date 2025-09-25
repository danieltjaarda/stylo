import Link from 'next/link';
import { CheckCircle, Package, Truck, Mail } from 'lucide-react';

export default function OrderConfirmationPage() {
  // In a real app, you would get the order details from the URL params or API
  const orderNumber = 'TS-' + Math.random().toString(36).substr(2, 9).toUpperCase();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12">
      <div className="max-w-md w-full bg-white rounded-lg shadow-sm p-8 text-center">
        <div className="mb-6">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Bestelling Geplaatst!
          </h1>
          <p className="text-gray-600">
            Bedankt voor je bestelling. We hebben je order ontvangen en verwerken deze zo snel mogelijk.
          </p>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <p className="text-sm text-gray-600 mb-1">Bestelnummer:</p>
          <p className="text-lg font-semibold text-gray-900">{orderNumber}</p>
        </div>

        <div className="space-y-4 mb-8">
          <div className="flex items-center text-sm text-gray-600">
            <Mail className="h-5 w-5 mr-3 text-blue-600" />
            <span>Bevestigingsmail is verzonden</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Package className="h-5 w-5 mr-3 text-blue-600" />
            <span>Order wordt voorbereid</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Truck className="h-5 w-5 mr-3 text-blue-600" />
            <span>Verzending binnen 1-2 werkdagen</span>
          </div>
        </div>

        <div className="space-y-3">
          <Link
            href="/products"
            className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors block"
          >
            Verder Winkelen
          </Link>
          <Link
            href="/"
            className="w-full bg-gray-200 text-gray-800 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors block"
          >
            Terug naar Home
          </Link>
        </div>
      </div>
    </div>
  );
}



















