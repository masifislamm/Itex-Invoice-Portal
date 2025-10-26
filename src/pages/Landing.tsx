import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { motion } from "framer-motion";
import { 
  BarChart3, 
  CheckCircle, 
  DollarSign, 
  FileText, 
  Globe, 
  Loader2, 
  Zap,
  ArrowRight,
  Users,
  Shield,
  Clock
} from "lucide-react";
import { useNavigate } from "react-router";

export default function Landing() {
  const { isLoading, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate("/dashboard");
    } else {
      navigate("/auth");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="flex items-center space-x-4">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <span className="text-lg text-gray-700">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 pt-16"
    >
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-white/20 fixed top-0 inset-x-0 z-50 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="flex items-center space-x-3"
            >
              <div className="p-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                ITEX GLOBAL SOURCING
              </span>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Button onClick={handleGetStarted} size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                {isAuthenticated ? "Go to Dashboard" : "Get Started"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </motion.div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mb-8"
            >
              <div className="inline-flex items-center px-4 py-2 bg-blue-100 rounded-full text-blue-800 text-sm font-medium mb-6">
                <Zap className="h-4 w-4 mr-2" />
                Professional Invoice Management
              </div>
              
              <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 tracking-tight">
                Invoice Generator
                <span className="block bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  & Analytics
                </span>
              </h1>
              
              <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed">
                Create professional invoices with live preview, track payments, and gain insights 
                into your business performance with powerful analytics dashboard.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
            >
              <Button 
                onClick={handleGetStarted} 
                size="lg" 
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-lg px-8 py-4"
              >
                {isAuthenticated ? "Go to Dashboard" : "Start Creating Invoices"}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="text-lg px-8 py-4 border-2"
                onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Learn More
              </Button>
            </motion.div>

            {/* Hero Image/Preview - Realistic Invoice Mockup */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="relative max-w-5xl mx-auto"
            >
              <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-white/30 rounded-full"></div>
                    <div className="w-3 h-3 bg-white/30 rounded-full"></div>
                    <div className="w-3 h-3 bg-white/30 rounded-full"></div>
                  </div>
                </div>
                <div className="p-8">
                  {/* Invoice Header */}
                  <div className="flex justify-between items-start mb-8">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">INVOICE</h3>
                      <p className="text-sm text-gray-600 mt-1">INV-2024-0001</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-gray-900">ITEX GLOBAL SOURCING</p>
                      <p className="text-xs text-gray-600">123 Business Street</p>
                      <p className="text-xs text-gray-600">New York, NY 10001</p>
                    </div>
                  </div>

                  {/* Bill To Section */}
                  <div className="grid grid-cols-2 gap-8 mb-8">
                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Bill To</p>
                      <p className="text-sm font-semibold text-gray-900">Client Company Name</p>
                      <p className="text-xs text-gray-600">456 Client Avenue</p>
                      <p className="text-xs text-gray-600">Los Angeles, CA 90210</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Invoice Details</p>
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-600">Issue Date:</span>
                          <span className="text-gray-900">Jan 15, 2024</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-600">Due Date:</span>
                          <span className="text-gray-900">Feb 15, 2024</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Items Table */}
                  <div className="mb-6">
                    <table className="w-full text-xs">
                      <thead className="bg-gray-50 border-b-2 border-gray-200">
                        <tr>
                          <th className="text-left py-2 px-3 font-semibold text-gray-700">Description</th>
                          <th className="text-right py-2 px-3 font-semibold text-gray-700">Qty</th>
                          <th className="text-right py-2 px-3 font-semibold text-gray-700">Rate</th>
                          <th className="text-right py-2 px-3 font-semibold text-gray-700">Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-gray-100">
                          <td className="py-2 px-3 text-gray-900">Professional Services</td>
                          <td className="text-right py-2 px-3 text-gray-600">10</td>
                          <td className="text-right py-2 px-3 text-gray-600">$150.00</td>
                          <td className="text-right py-2 px-3 text-gray-900 font-medium">$1,500.00</td>
                        </tr>
                        <tr className="border-b border-gray-100">
                          <td className="py-2 px-3 text-gray-900">Consulting Hours</td>
                          <td className="text-right py-2 px-3 text-gray-600">5</td>
                          <td className="text-right py-2 px-3 text-gray-600">$200.00</td>
                          <td className="text-right py-2 px-3 text-gray-900 font-medium">$1,000.00</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* Totals */}
                  <div className="flex justify-end">
                    <div className="w-64 space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-600">Subtotal:</span>
                        <span className="text-gray-900">$2,500.00</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-600">Tax (10%):</span>
                        <span className="text-gray-900">$250.00</span>
                      </div>
                      <div className="flex justify-between text-sm font-bold border-t-2 border-gray-200 pt-2">
                        <span className="text-gray-900">Total:</span>
                        <span className="text-blue-600">$2,750.00</span>
                      </div>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div className="mt-6 flex justify-end">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Paid
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything You Need for Invoice Management
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Streamline your billing process with our comprehensive invoice generator and analytics platform
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: FileText,
                title: "Live Invoice Preview",
                description: "See your invoice in real-time as you fill out the form. What you see is what your clients get.",
                color: "from-blue-500 to-blue-600"
              },
              {
                icon: BarChart3,
                title: "Advanced Analytics",
                description: "Track revenue, payment rates, and business performance with detailed analytics and insights.",
                color: "from-green-500 to-green-600"
              },
              {
                icon: DollarSign,
                title: "Payment Tracking",
                description: "Monitor invoice status from draft to paid. Never lose track of outstanding payments.",
                color: "from-purple-500 to-purple-600"
              },
              {
                icon: Globe,
                title: "Professional Templates",
                description: "Beautiful, professional invoice templates that make your business look credible and trustworthy.",
                color: "from-indigo-500 to-indigo-600"
              },
              {
                icon: Users,
                title: "Client Management",
                description: "Store client information and easily create invoices for repeat customers with saved details.",
                color: "from-pink-500 to-pink-600"
              },
              {
                icon: Shield,
                title: "Secure & Reliable",
                description: "Your data is encrypted and securely stored. Access your invoices anytime, anywhere.",
                color: "from-teal-500 to-teal-600"
              }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow duration-300 border-0 shadow-md">
                  <CardHeader>
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${feature.color} flex items-center justify-center mb-4`}>
                      <feature.icon className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">Trusted by Businesses Worldwide</h2>
            <p className="text-xl opacity-90">Join thousands of companies using our invoice management platform</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { number: "10K+", label: "Invoices Created" },
              { number: "99.9%", label: "Uptime" },
              { number: "24/7", label: "Support" },
              { number: "50+", label: "Countries" }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="text-4xl font-bold mb-2">{stat.number}</div>
                <div className="text-lg opacity-90">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Ready to Streamline Your Invoicing?
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Start creating professional invoices today and take control of your business finances 
              with powerful analytics and insights.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={handleGetStarted} 
                size="lg" 
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-lg px-8 py-4"
              >
                {isAuthenticated ? "Go to Dashboard" : "Get Started Free"}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="p-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold">ITEX GLOBAL SOURCING</span>
            </div>
            <div className="text-center md:text-right">
              <p className="text-gray-400">
                © 2024 ITEX Global Sourcing. All rights reserved.
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Developed by{" "}
                <a
                  href="https://www.masif.dev"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 transition-colors"
                >
                  Md Asif Islam
                </a>
              </p>
            </div>
          </div>
        </div>
      </footer>
    </motion.div>
  );
}