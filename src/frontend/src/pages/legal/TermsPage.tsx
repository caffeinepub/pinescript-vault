import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl">Terms of Service</CardTitle>
        </CardHeader>
        <CardContent className="prose prose-invert max-w-none">
          <p>Last updated: {new Date().toLocaleDateString()}</p>

          <h2>1. Acceptance of Terms</h2>
          <p>
            By accessing and using ScriptScope Market, you accept and agree to be bound by these Terms of Service. If
            you do not agree to these terms, please do not use our services.
          </p>

          <h2>2. License and Usage</h2>
          <p>
            Upon purchase, you are granted a non-exclusive, non-transferable license to use the Pine Script indicators
            and strategies for your personal trading activities. You may not resell, redistribute, or share the scripts
            with others.
          </p>

          <h2>3. Intellectual Property</h2>
          <p>
            All scripts, indicators, strategies, and content provided on ScriptScope Market are protected by
            intellectual property rights. Unauthorized copying, modification, or distribution is strictly prohibited.
          </p>

          <h2>4. User Accounts</h2>
          <p>
            You are responsible for maintaining the confidentiality of your account credentials and for all activities
            that occur under your account. Notify us immediately of any unauthorized use.
          </p>

          <h2>5. Prohibited Activities</h2>
          <p>You agree not to:</p>
          <ul>
            <li>Reverse engineer or decompile any scripts</li>
            <li>Use the scripts for any illegal purposes</li>
            <li>Share your account access with others</li>
            <li>Attempt to circumvent any security measures</li>
          </ul>

          <h2>6. Limitation of Liability</h2>
          <p>
            ScriptScope Market shall not be liable for any damages arising from the use or inability to use our
            services, including but not limited to trading losses, data loss, or service interruptions.
          </p>

          <h2>7. Modifications</h2>
          <p>
            We reserve the right to modify these terms at any time. Continued use of our services after changes
            constitutes acceptance of the modified terms.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
