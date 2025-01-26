import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function About() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center">About Google Dork Generator</CardTitle>
        </CardHeader>
        <CardContent className="prose dark:prose-invert max-w-none">
          <p>
            The Google Dork Generator is an advanced tool designed to help users create complex Google search queries,
            also known as "dorks". These queries can be used for various purposes, including information gathering, SEO
            analysis, and cybersecurity research.
          </p>
          <p>
            Our tool provides a user-friendly interface to construct Google dorks using various search operators, making
            it easier for both beginners and advanced users to create powerful search queries.
          </p>
          <h3 className="text-xl font-semibold mt-6">Features:</h3>
          <ul className="list-disc list-inside space-y-2">
            <li>Easy-to-use interface for creating Google dorks</li>
            <li>Support for multiple search operators</li>
            <li>Ability to save and load custom dorks</li>
            <li>Dark mode for comfortable use in low-light environments</li>
            <li>Responsive design for use on desktop and mobile devices</li>
          </ul>
          <p className="mt-6">
            While Google dorking is a powerful technique, we encourage all users to use this tool responsibly and
            ethically. Always respect privacy and legal boundaries when conducting searches.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

