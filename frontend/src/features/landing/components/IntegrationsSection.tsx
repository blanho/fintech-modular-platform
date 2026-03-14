import { motion } from 'framer-motion';
import { Copy, Check, Terminal, Code2, Braces } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/shared/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { cn } from '@/shared/lib/utils';

const codeExamples = {
  javascript: `// Initialize FinTech Client
import { FinTech } from '@fintech/sdk';

const client = new FinTech({
  apiKey: process.env.FINTECH_API_KEY,
});

const wallet = await client.wallets.create({
  currency: 'USD',
  name: 'Primary Account',
});

const transfer = await client.transactions.transfer({
  sourceWalletId: wallet.id,
  targetWalletId: 'wal_target_123',
  amount: '100.00',
  currency: 'USD',
});

console.log(\`Transfer completed: \${transfer.id}\`);`,
  python: `# Initialize FinTech Client
from fintech import FinTech

client = FinTech(api_key=os.environ["FINTECH_API_KEY"])

# Create a wallet
wallet = client.wallets.create(
    currency="USD",
    name="Primary Account"
)

# Transfer funds
transfer = client.transactions.transfer(
    source_wallet_id=wallet.id,
    target_wallet_id="wal_target_123",
    amount="100.00",
    currency="USD"
)

print(f"Transfer completed: {transfer.id}")`,
  curl: `# Create a wallet
curl -X POST https://api.fintech.com/v1/wallets \\
  -H "Authorization: Bearer $FINTECH_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "currency": "USD",
    "name": "Primary Account"
  }'

# Transfer funds
curl -X POST https://api.fintech.com/v1/transactions/transfer \\
  -H "Authorization: Bearer $FINTECH_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "sourceWalletId": "wal_source_123",
    "targetWalletId": "wal_target_123",
    "amount": "100.00",
    "currency": "USD"
  }'`,
};

const features = [
  {
    icon: Terminal,
    title: 'RESTful API',
    description: 'Clean, predictable REST endpoints with comprehensive documentation.',
  },
  {
    icon: Code2,
    title: 'SDK Support',
    description: 'Official SDKs for JavaScript, Python, Ruby, Go, and more.',
  },
  {
    icon: Braces,
    title: 'Webhooks',
    description: 'Real-time event notifications for transaction updates.',
  },
];

export function IntegrationsSection() {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('javascript');

  const handleCopy = () => {
    navigator.clipboard.writeText(codeExamples[activeTab as keyof typeof codeExamples]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="py-24 lg:py-32 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-sm font-medium text-indigo-600 mb-3">Developer Experience</p>
          <h2 className="text-3xl lg:text-4xl font-semibold text-slate-900 mb-4">
            Integrate in minutes, not months
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Our APIs are designed with developers in mind. Clean interfaces,
            comprehensive documentation, and SDKs in your favorite languages.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            {}
            <div className="space-y-6 mb-12">
              {features.map((feature, i) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex gap-4"
                >
                  <div className="flex-shrink-0 w-10 h-10 bg-white border border-slate-200 rounded-lg flex items-center justify-center">
                    <feature.icon className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">{feature.title}</h3>
                    <p className="text-sm text-slate-600 mt-1">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-slate-200">
              {[
                { value: '99.99%', label: 'API Uptime' },
                { value: '<50ms', label: 'Avg Response' },
                { value: '24/7', label: 'Support' },
              ].map((stat) => (
                <div key={stat.label}>
                  <div className="text-2xl font-semibold text-slate-900">{stat.value}</div>
                  <div className="text-sm text-slate-500">{stat.label}</div>
                </div>
              ))}
            </div>
          </motion.div>

          {}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="bg-slate-900 rounded-xl overflow-hidden border border-slate-800">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                {}
                <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800">
                  <TabsList className="bg-transparent border-0 gap-1">
                    {Object.keys(codeExamples).map((lang) => (
                      <TabsTrigger
                        key={lang}
                        value={lang}
                        className={cn(
                          'text-xs font-medium px-3 py-1.5 rounded-md transition-colors',
                          'data-[state=active]:bg-slate-800 data-[state=active]:text-white',
                          'data-[state=inactive]:text-slate-400 data-[state=inactive]:hover:text-slate-300'
                        )}
                      >
                        {lang === 'javascript'
                          ? 'JavaScript'
                          : lang === 'python'
                            ? 'Python'
                            : 'cURL'}
                      </TabsTrigger>
                    ))}
                  </TabsList>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCopy}
                    className="text-slate-400 hover:text-white hover:bg-slate-800"
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4 mr-1.5 text-emerald-500" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 mr-1.5" />
                        Copy
                      </>
                    )}
                  </Button>
                </div>

                {}
                {Object.entries(codeExamples).map(([lang, code]) => (
                  <TabsContent key={lang} value={lang} className="m-0">
                    <pre className="p-6 overflow-x-auto text-sm leading-relaxed max-h-[400px]">
                      <code className="text-slate-300 font-mono">{code}</code>
                    </pre>
                  </TabsContent>
                ))}
              </Tabs>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}