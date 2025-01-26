import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function TermsOfService() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center">Terms of Service</CardTitle>
        </CardHeader>
        <CardContent className="prose dark:prose-invert max-w-none">
          <p>
            By using the Google Dork Generator, you agree to comply with and be bound by the following terms and
            conditions of use.
          </p>
          <h3 className="text-xl font-semibold">Use of Service</h3>
          <p>
            You agree to use the Google Dork Generator for lawful purposes only. You must not use this service to
            violate any laws or infringe on the rights of others.
          </p>
          <h3 className="text-xl font-semibold">Disclaimer</h3>
          <p>
            The Google Dork Generator is provided "as is" without any warranties, expressed or implied. We do not
            warrant that the service will be uninterrupted or error-free.
          </p>
          <h3 className="text-xl font-semibold">Limitation of Liability</h3>
          <p>
            We shall not be liable for any indirect, incidental, special, consequential or punitive damages, or any loss
            of profits or revenues, whether incurred directly or indirectly.
          </p>
          <h3 className="text-xl font-semibold">Changes to Terms</h3>
          <p>
            We reserve the right to modify these terms at any time. Your continued use of the service after any such
            changes constitutes your acceptance of the new terms.
          </p>
          <p>If you do not agree to these terms, please do not use the Google Dork Generator.</p>
        </CardContent>
      </Card>
    </div>
  )
}

