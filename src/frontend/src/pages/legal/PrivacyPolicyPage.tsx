import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl">Privacy Policy</CardTitle>
        </CardHeader>
        <CardContent className="prose prose-invert max-w-none">
          <p>Last updated: {new Date().toLocaleDateString()}</p>

          <h2>Information We Collect</h2>
          <p>We collect information that you provide directly to us, including:</p>
          <ul>
            <li>Account information (name, email, TradingView username)</li>
            <li>Payment information (processed securely through Stripe)</li>
            <li>Purchase history and download records</li>
            <li>Communications with our support team</li>
          </ul>

          <h2>How We Use Your Information</h2>
          <p>We use the information we collect to:</p>
          <ul>
            <li>Process your purchases and deliver digital products</li>
            <li>Manage your account and provide customer support</li>
            <li>Send important updates about your purchases</li>
            <li>Improve our services and user experience</li>
            <li>Comply with legal obligations</li>
          </ul>

          <h2>Information Sharing</h2>
          <p>
            We do not sell or rent your personal information to third parties. We may share your information with:
          </p>
          <ul>
            <li>Payment processors (Stripe) to complete transactions</li>
            <li>Service providers who assist in operating our platform</li>
            <li>Law enforcement when required by law</li>
          </ul>

          <h2>Data Security</h2>
          <p>
            We implement appropriate security measures to protect your personal information. However, no method of
            transmission over the internet is 100% secure, and we cannot guarantee absolute security.
          </p>

          <h2>Your Rights</h2>
          <p>You have the right to:</p>
          <ul>
            <li>Access and review your personal information</li>
            <li>Request correction of inaccurate data</li>
            <li>Request deletion of your account and data</li>
            <li>Opt out of marketing communications</li>
          </ul>

          <h2>Cookies and Tracking</h2>
          <p>
            We use cookies and similar technologies to enhance your experience, analyze usage patterns, and maintain
            your session. You can control cookie preferences through your browser settings.
          </p>

          <h2>Children's Privacy</h2>
          <p>
            Our services are not intended for users under 18 years of age. We do not knowingly collect information from
            children.
          </p>

          <h2>Changes to This Policy</h2>
          <p>
            We may update this privacy policy from time to time. We will notify you of significant changes by posting
            the new policy on this page.
          </p>

          <h2>Contact Us</h2>
          <p>
            If you have questions about this privacy policy or our data practices, please contact our support team.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
