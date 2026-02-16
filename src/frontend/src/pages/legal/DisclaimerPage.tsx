import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function DisclaimerPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl">Disclaimer</CardTitle>
        </CardHeader>
        <CardContent className="prose prose-invert max-w-none">
          <p>
            The information and scripts provided on ScriptScope Market are for educational and informational purposes
            only. They should not be considered as financial advice or recommendations to buy or sell any securities or
            financial instruments.
          </p>

          <h2>Trading Risks</h2>
          <p>
            Trading in financial markets involves substantial risk of loss and is not suitable for every investor. Past
            performance is not indicative of future results. You should carefully consider your financial situation and
            consult with a qualified financial advisor before making any trading decisions.
          </p>

          <h2>No Guarantees</h2>
          <p>
            We make no representations or warranties regarding the accuracy, completeness, or reliability of any
            scripts, indicators, or strategies provided. Results may vary, and there is no guarantee of profit or
            protection against loss.
          </p>

          <h2>Use at Your Own Risk</h2>
          <p>
            By using our scripts and services, you acknowledge that you are solely responsible for your trading
            decisions and any resulting gains or losses. ScriptScope Market and its operators shall not be liable for
            any direct, indirect, incidental, or consequential damages arising from the use of our products.
          </p>

          <h2>Not Financial Advice</h2>
          <p>
            Nothing on this website constitutes professional financial advice. Always do your own research and due
            diligence before making any investment decisions.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
