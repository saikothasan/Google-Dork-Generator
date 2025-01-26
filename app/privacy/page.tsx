import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function PrivacyPolicy() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center">Privacy Policy</CardTitle>
        </CardHeader>
        <CardContent className="prose dark:prose-invert max-w-none">
          <p>
            At Google Dork Generator, we take your privacy seriously. This Privacy Policy outlines how we collect, use,
            and protect your personal information.
          </p>
          <h3 className="text-xl font-semibold">Information We Collect</h3>
          <p>
            We only collect information that you voluntarily provide to us, such as your email address when you contact
            us or save your dorks.
          </p>
          <h3 className="text-xl font-semibold">How We Use Your Information</h3>
          <p>
            We use your information to provide and improve our services, respond to your inquiries, and send you
            important updates about our tool.
          </p>
          <h3 className="text-xl font-semibold">Data Security</h3>
          <p>
            We implement various security measures to protect your personal information. However, no method of
            transmission over the Internet is 100% secure.
          </p>
          <h3 className="text-xl font-semibold">Changes to This Policy</h3>
          <p>
            We may update this privacy policy from time to time. We will notify you of any changes by posting the new
            policy on this page.
          </p>
          <p>If you have any questions about this Privacy Policy, please contact us.</p>
        </CardContent>
      </Card>
    </div>
  )
}

