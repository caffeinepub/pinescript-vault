import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function RefundPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl">Refund Policy</CardTitle>
        </CardHeader>
        <CardContent className="prose prose-invert max-w-none">
          <p>Last updated: {new Date().toLocaleDateString()}</p>

          <h2>Digital Products</h2>
          <p>
            Due to the nature of digital products and instant delivery, all sales of Pine Script indicators and
            strategies are final. Once you have downloaded or accessed a script, we cannot offer refunds.
          </p>

          <h2>Exceptions</h2>
          <p>We may consider refund requests in the following exceptional circumstances:</p>
          <ul>
            <li>Technical issues preventing download or access to purchased scripts</li>
            <li>Duplicate purchases made in error</li>
            <li>Scripts that are fundamentally broken or non-functional</li>
          </ul>

          <h2>Refund Request Process</h2>
          <p>
            If you believe you qualify for a refund under our exceptions policy, please contact our support team within
            7 days of purchase with:
          </p>
          <ul>
            <li>Your order number</li>
            <li>Detailed description of the issue</li>
            <li>Screenshots or evidence of the problem (if applicable)</li>
          </ul>

          <h2>Processing Time</h2>
          <p>
            Approved refunds will be processed within 5-10 business days and credited back to your original payment
            method.
          </p>

          <h2>Free Products</h2>
          <p>Free scripts and indicators are provided as-is with no refund or support obligations.</p>

          <h2>Bundle Purchases</h2>
          <p>
            Bundle purchases are treated as a single transaction. Partial refunds for individual scripts within a
            bundle are not available.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
