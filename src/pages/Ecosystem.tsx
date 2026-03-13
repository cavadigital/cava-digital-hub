import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Server, Zap, CheckCircle2 } from 'lucide-react'

const ecoData = [
  {
    category: 'Creative Studio',
    feature: 'Horizontal Workspace',
    description:
      'Optimized layout for notebooks with tools at the top and visualizer at the bottom.',
  },
  {
    category: 'Creative Studio',
    feature: 'Custom Dimensions',
    description: 'Support for standard presets and manual size input.',
  },
  {
    category: 'Creative Studio',
    feature: 'Real-time Style Editor',
    description: 'Instant adjustment of colors and fonts without re-generating code.',
  },
  {
    category: 'Creative Studio',
    feature: 'Smart Bundles',
    description: 'Automatic combinations of Banners + CTAs + Modals based on goals.',
  },
  {
    category: 'Creative Studio',
    feature: 'A/B Testing',
    description: 'Automatic generation of variation "B" for performance testing.',
  },
  {
    category: 'Creative Studio',
    feature: 'Smart Copywriting',
    description: 'AI-generated ad texts based on audience and offer.',
  },

  {
    category: 'Governance & Tech',
    feature: 'CAVA Review (Linter)',
    description: 'Automated SEO and performance check for Wake, Tray, and Nuvemshop.',
  },
  {
    category: 'Governance & Tech',
    feature: 'Version Control',
    description: "One-click Rollback to the last stable state of the client's store.",
  },

  {
    category: 'Client & Results',
    feature: 'Customer Portal',
    description: 'Dedicated area for clients to view projects and active assets.',
  },
  {
    category: 'Client & Results',
    feature: 'Performance Analytics',
    description: 'Integration of CPM, CTR, and CPC metrics to track ROI.',
  },
  {
    category: 'Client & Results',
    feature: 'Branding Library',
    description: 'Saved "Identity Kits" (logos, colors, fonts) per client for instant application.',
  },
  {
    category: 'Client & Results',
    feature: 'WhatsApp Notifications',
    description: 'Automated alerts with mobile approval links sent directly to clients.',
  },
  {
    category: 'Client & Results',
    feature: 'Automated PDF Reports',
    description: 'Generate elegant, print-ready monthly performance summaries with one click.',
  },

  {
    category: 'Automation',
    feature: 'Ad Manager Sync',
    description: 'Direct export of creatives to Meta Ads and Google Ads.',
  },
  {
    category: 'Automation',
    feature: 'Mobile Approval',
    description: 'Seamless feedback loop via mobile-optimized share links.',
  },
  {
    category: 'Automation',
    feature: 'AI Budget Optimization',
    description: 'Intelligent recommendations for budget reallocation across Meta and Google Ads.',
  },
]

export default function Ecosystem() {
  return (
    <div className="space-y-6 animate-fade-in-up max-w-5xl mx-auto pb-12">
      <div className="text-center space-y-2 mb-8">
        <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-2xl mb-4">
          <Server className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight">CAVA Digital Ecosystem Report</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Structured summary of all current platform capabilities for stakeholder presentation.
        </p>
      </div>

      <Card className="shadow-elevation border-t-4 border-t-primary">
        <CardHeader className="bg-muted/10 border-b">
          <CardTitle className="text-xl flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" /> System Capabilities
          </CardTitle>
          <CardDescription>
            Comprehensive list of features and their business value.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow>
                <TableHead className="w-[200px]">Category</TableHead>
                <TableHead className="w-[250px]">Feature</TableHead>
                <TableHead>Description</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ecoData.map((item, i) => (
                <TableRow key={i} className="hover:bg-muted/20 transition-colors">
                  <TableCell className="font-semibold text-xs uppercase tracking-wider text-muted-foreground">
                    {i === 0 || ecoData[i - 1].category !== item.category ? item.category : ''}
                  </TableCell>
                  <TableCell className="font-medium text-foreground flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-success shrink-0" />
                    {item.feature}
                  </TableCell>
                  <TableCell className="text-muted-foreground">{item.description}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
