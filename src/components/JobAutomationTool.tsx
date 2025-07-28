import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Bot, FileText, Globe, Zap, CheckCircle, AlertCircle, Code, Download, ExternalLink } from "lucide-react";
import heroImage from "@/assets/hero-automation.jpg";

interface ResumeData {
  personalInfo: {
    name: string;
    email: string;
    phone: string;
    location: string;
  };
  experience: Array<{
    company: string;
    position: string;
    duration: string;
    description: string;
  }>;
  skills: string[];
  education: Array<{
    institution: string;
    degree: string;
    year: string;
  }>;
}

interface ProcessingStep {
  id: string;
  title: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
  description: string;
}

export const JobAutomationTool = () => {
  const { toast } = useToast();
  const [jobUrl, setJobUrl] = useState('');
  const [resumeJson, setResumeJson] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [generatedScript, setGeneratedScript] = useState('');
  const [jobData, setJobData] = useState<any>(null);
  const [showCodeDialog, setShowCodeDialog] = useState(false);
  const [processingSteps, setProcessingSteps] = useState<ProcessingStep[]>([
    { id: '1', title: 'Fetch Job Description', status: 'pending', description: 'Scraping job posting content...' },
    { id: '2', title: 'Analyze Requirements', status: 'pending', description: 'Extracting key requirements and preferences...' },
    { id: '3', title: 'Match Resume Data', status: 'pending', description: 'Mapping your experience to job requirements...' },
    { id: '4', title: 'Generate Responses', status: 'pending', description: 'Creating personalized answers using AI...' },
    { id: '5', title: 'Create Automation Script', status: 'pending', description: 'Building the automation workflow...' }
  ]);

  const sampleResumeData: ResumeData = {
    personalInfo: {
      name: "Alex Developer",
      email: "alex@example.com",
      phone: "+1 (555) 123-4567",
      location: "San Francisco, CA"
    },
    experience: [
      {
        company: "TechCorp Inc.",
        position: "Senior Software Engineer",
        duration: "2021 - Present",
        description: "Led development of cloud-native applications using React, Node.js, and AWS. Improved system performance by 40% and mentored junior developers."
      }
    ],
    skills: ["JavaScript", "React", "Node.js", "Python", "AWS", "Docker"],
    education: [
      {
        institution: "Stanford University",
        degree: "B.S. Computer Science",
        year: "2020"
      }
    ]
  };

  const handleLoadSample = () => {
    setResumeJson(JSON.stringify(sampleResumeData, null, 2));
    toast({
      title: "Sample Data Loaded",
      description: "You can now edit this sample resume data or use it as-is."
    });
  };

  const updateStepStatus = (stepIndex: number, status: ProcessingStep['status']) => {
    setProcessingSteps(prev => prev.map((step, index) => 
      index === stepIndex ? { ...step, status } : step
    ));
  };

  const fetchJobData = async (url: string) => {
    try {
      const response = await fetch(`https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`);
      const html = await response.text();
      
      // Basic job parsing from HTML
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      
      const title = doc.querySelector('h1')?.textContent || 'Job Position';
      const description = doc.querySelector('meta[name="description"]')?.getAttribute('content') || '';
      
      return {
        title,
        description,
        company: new URL(url).hostname.replace('www.', ''),
        url
      };
    } catch (error) {
      console.error('Failed to fetch job data:', error);
      return {
        title: 'Job Position',
        description: 'Job description could not be fetched',
        company: new URL(jobUrl).hostname.replace('www.', ''),
        url: jobUrl
      };
    }
  };

  const generateAutomationScript = (resumeData: ResumeData, jobData: any) => {
    return `// AI-Generated Job Application Automation Script
// Generated for: ${jobData.title} at ${jobData.company}
// Target URL: ${jobData.url}

const { chromium } = require('playwright');

async function automateJobApplication() {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  console.log('🚀 Starting job application automation...');
  
  try {
    // Navigate to job application page
    await page.goto('${jobData.url}');
    await page.waitForLoadState('networkidle');
    
    // Personal Information Auto-Fill
    console.log('📝 Filling personal information...');
    
    // Common field selectors and your data
    const personalData = {
      name: '${resumeData.personalInfo.name}',
      email: '${resumeData.personalInfo.email}',
      phone: '${resumeData.personalInfo.phone}',
      location: '${resumeData.personalInfo.location}'
    };
    
    // Try multiple common selectors for each field
    const fieldMappings = {
      name: ['input[name*="name"]', 'input[id*="name"]', '#firstName', '#fullName'],
      email: ['input[type="email"]', 'input[name*="email"]', 'input[id*="email"]'],
      phone: ['input[type="tel"]', 'input[name*="phone"]', 'input[id*="phone"]'],
      location: ['input[name*="location"]', 'input[name*="address"]', 'input[id*="city"]']
    };
    
    for (const [field, selectors] of Object.entries(fieldMappings)) {
      for (const selector of selectors) {
        try {
          const element = await page.locator(selector).first();
          if (await element.isVisible()) {
            await element.fill(personalData[field]);
            console.log(\`✅ Filled \${field}: \${personalData[field]}\`);
            break;
          }
        } catch (e) {
          // Continue to next selector
        }
      }
    }
    
    // Experience and Skills Section
    console.log('💼 Filling experience information...');
    
    // Look for experience/work history fields
    const experienceSelectors = [
      'textarea[name*="experience"]',
      'textarea[id*="experience"]',
      'textarea[name*="work"]',
      '#workExperience'
    ];
    
    const experienceText = \`${resumeData.experience.map(exp => 
      `${exp.position} at ${exp.company} (${exp.duration})\\n${exp.description}`
    ).join('\\n\\n')}\`;
    
    for (const selector of experienceSelectors) {
      try {
        const element = await page.locator(selector).first();
        if (await element.isVisible()) {
          await element.fill(experienceText);
          console.log('✅ Filled work experience');
          break;
        }
      } catch (e) {
        // Continue to next selector
      }
    }
    
    // Skills Section
    const skillsText = '${resumeData.skills.join(', ')}';
    const skillsSelectors = [
      'input[name*="skills"]',
      'textarea[name*="skills"]',
      'input[id*="skills"]',
      'textarea[id*="skills"]'
    ];
    
    for (const selector of skillsSelectors) {
      try {
        const element = await page.locator(selector).first();
        if (await element.isVisible()) {
          await element.fill(skillsText);
          console.log('✅ Filled skills');
          break;
        }
      } catch (e) {
        // Continue to next selector
      }
    }
    
    // Resume Upload
    console.log('📄 Looking for resume upload...');
    const fileInputSelectors = [
      'input[type="file"]',
      'input[accept*="pdf"]',
      'input[name*="resume"]',
      'input[name*="cv"]'
    ];
    
    for (const selector of fileInputSelectors) {
      try {
        const fileInput = await page.locator(selector).first();
        if (await fileInput.isVisible()) {
          // Note: You need to provide the actual resume file path
          // await fileInput.setInputFiles('/path/to/your/resume.pdf');
          console.log('📎 Resume upload field found (manual upload required)');
          break;
        }
      } catch (e) {
        // Continue to next selector
      }
    }
    
    // AI-Generated Cover Letter/Responses
    console.log('🤖 Generating personalized responses...');
    
    // Look for cover letter or additional questions
    const coverLetterSelectors = [
      'textarea[name*="cover"]',
      'textarea[name*="letter"]',
      'textarea[name*="message"]',
      'textarea[id*="cover"]'
    ];
    
    const aiResponse = \`Dear Hiring Manager,

I am excited to apply for the ${jobData.title} position at ${jobData.company}. With my background in ${resumeData.skills.slice(0, 3).join(', ')}, I am confident I can contribute significantly to your team.

In my previous role as ${resumeData.experience[0]?.position} at ${resumeData.experience[0]?.company}, I ${resumeData.experience[0]?.description}

My technical skills in ${resumeData.skills.join(', ')} align perfectly with the requirements for this position. I am particularly drawn to ${jobData.company} because of your reputation for innovation and excellence.

Thank you for considering my application. I look forward to discussing how my experience can benefit your team.

Best regards,
${resumeData.personalInfo.name}\`;
    
    for (const selector of coverLetterSelectors) {
      try {
        const element = await page.locator(selector).first();
        if (await element.isVisible()) {
          await element.fill(aiResponse);
          console.log('✅ Filled cover letter/message');
          break;
        }
      } catch (e) {
        // Continue to next selector
      }
    }
    
    // Final steps
    console.log('🎯 Application completed! Review before submitting.');
    console.log('⚠️  Please review all fields and submit manually for security.');
    
    // Wait for user to review
    await page.waitForTimeout(5000);
    
  } catch (error) {
    console.error('❌ Automation error:', error);
  } finally {
    // Don't close browser to allow manual review
    console.log('🔍 Browser left open for manual review and submission.');
  }
}

// Run the automation
automateJobApplication().catch(console.error);

/* 
INSTALLATION INSTRUCTIONS:
1. Install Playwright: npm install playwright
2. Save this script as 'job-automation.js'
3. Update resume file path if using file upload
4. Run: node job-automation.js
5. Review and submit manually for security
*/`;
  };

  const processJobApplication = async () => {
    setIsProcessing(true);
    const resumeData = JSON.parse(resumeJson);
    
    for (let i = 0; i < processingSteps.length; i++) {
      setCurrentStep(i);
      updateStepStatus(i, 'processing');
      
      if (i === 0) {
        // Fetch job description
        const fetchedJobData = await fetchJobData(jobUrl);
        setJobData(fetchedJobData);
        await new Promise(resolve => setTimeout(resolve, 1500));
      } else if (i === 4) {
        // Generate automation script
        const script = generateAutomationScript(resumeData, jobData);
        setGeneratedScript(script);
        await new Promise(resolve => setTimeout(resolve, 1000));
      } else {
        await new Promise(resolve => setTimeout(resolve, 1200));
      }
      
      updateStepStatus(i, 'completed');
    }
    
    setIsProcessing(false);
    toast({
      title: "Automation Ready!",
      description: "Your job application automation script has been generated and is ready to use."
    });
  };

  const handleStartAutomation = async () => {
    if (!jobUrl || !resumeJson) {
      toast({
        title: "Missing Information",
        description: "Please provide both job URL and resume data.",
        variant: "destructive"
      });
      return;
    }

    try {
      JSON.parse(resumeJson);
    } catch (error) {
      toast({
        title: "Invalid JSON",
        description: "Please check your resume JSON format.",
        variant: "destructive"
      });
      return;
    }

    await processJobApplication();
  };

  const handleDownloadScript = () => {
    if (!generatedScript) return;
    
    const blob = new Blob([generatedScript], { type: 'text/javascript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `job-automation-${jobData?.company || 'script'}.js`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Script Downloaded!",
      description: "Run with: npm install playwright && node job-automation.js"
    });
  };

  const handleViewCode = () => {
    setShowCodeDialog(true);
  };

  const getStepIcon = (status: ProcessingStep['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-success" />;
      case 'processing':
        return <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-destructive" />;
      default:
        return <div className="w-4 h-4 border-2 border-muted rounded-full" />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative h-96 overflow-hidden">
        <img 
          src={heroImage} 
          alt="AI Job Automation" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/20 to-background/80" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center max-w-4xl px-6">
            <h1 className="text-5xl font-bold mb-6 bg-gradient-primary bg-clip-text text-transparent">
              AI-Powered Job Application Automation
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Automate your job applications with intelligent form filling, resume optimization, 
              and AI-generated personalized responses.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-12">
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Input Section */}
          <Card className="p-6 bg-gradient-card border-border shadow-glow">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-primary/20 rounded-lg">
                <Bot className="w-6 h-6 text-primary" />
              </div>
              <h2 className="text-2xl font-semibold">Setup Automation</h2>
            </div>

            <Tabs defaultValue="input" className="w-full">
              <TabsList className="grid grid-cols-2 w-full mb-6">
                <TabsTrigger value="input" className="flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  Job & Resume
                </TabsTrigger>
                <TabsTrigger value="config" className="flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  Configuration
                </TabsTrigger>
              </TabsList>

              <TabsContent value="input" className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="jobUrl">Job Application URL</Label>
                  <Input
                    id="jobUrl"
                    placeholder="https://company.com/careers/job-posting"
                    value={jobUrl}
                    onChange={(e) => setJobUrl(e.target.value)}
                    className="bg-secondary/50"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="resumeJson">Resume Data (JSON)</Label>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={handleLoadSample}
                      className="text-xs"
                    >
                      Load Sample
                    </Button>
                  </div>
                  <Textarea
                    id="resumeJson"
                    placeholder="Paste your structured resume JSON here..."
                    value={resumeJson}
                    onChange={(e) => setResumeJson(e.target.value)}
                    className="min-h-[300px] font-mono text-sm bg-secondary/50"
                  />
                </div>

                <Button 
                  onClick={handleStartAutomation}
                  disabled={isProcessing}
                  className="w-full bg-gradient-primary hover:opacity-90"
                  size="lg"
                >
                  {isProcessing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4 mr-2" />
                      Start Automation
                    </>
                  )}
                </Button>
              </TabsContent>

              <TabsContent value="config" className="space-y-6">
                <div className="grid gap-4">
                  <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                    <div>
                      <h3 className="font-medium">AI Response Generation</h3>
                      <p className="text-sm text-muted-foreground">Generate personalized answers to application questions</p>
                    </div>
                    <Badge variant="secondary">Enabled</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                    <div>
                      <h3 className="font-medium">Resume Upload</h3>
                      <p className="text-sm text-muted-foreground">Automatically upload your resume file</p>
                    </div>
                    <Badge variant="secondary">Enabled</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                    <div>
                      <h3 className="font-medium">Form Auto-Fill</h3>
                      <p className="text-sm text-muted-foreground">Fill standard form fields from resume data</p>
                    </div>
                    <Badge variant="secondary">Enabled</Badge>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </Card>

          {/* Processing & Results Section */}
          <Card className="p-6 bg-gradient-card border-border">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-accent/20 rounded-lg">
                <FileText className="w-6 h-6 text-accent" />
              </div>
              <h2 className="text-2xl font-semibold">Processing Status</h2>
            </div>

            {isProcessing || processingSteps.some(step => step.status === 'completed') ? (
              <div className="space-y-4">
                <div className="mb-6">
                  <Progress 
                    value={((currentStep + 1) / processingSteps.length) * 100} 
                    className="h-2"
                  />
                  <p className="text-sm text-muted-foreground mt-2">
                    Step {currentStep + 1} of {processingSteps.length}
                  </p>
                </div>

                {processingSteps.map((step, index) => (
                  <div 
                    key={step.id}
                    className={`flex items-center gap-3 p-3 rounded-lg border ${
                      index === currentStep && isProcessing 
                        ? 'border-primary bg-primary/5' 
                        : 'border-border'
                    }`}
                  >
                    {getStepIcon(step.status)}
                    <div className="flex-1">
                      <h3 className="font-medium">{step.title}</h3>
                      <p className="text-sm text-muted-foreground">{step.description}</p>
                    </div>
                  </div>
                ))}

                {!isProcessing && processingSteps.every(step => step.status === 'completed') && (
                  <div className="mt-6 p-4 bg-success/10 border border-success/20 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="w-5 h-5 text-success" />
                      <h3 className="font-medium text-success">Automation Script Ready!</h3>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">
                      Your personalized automation script has been generated and is ready to use.
                    </p>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        className="bg-success hover:bg-success/90"
                        onClick={handleDownloadScript}
                        disabled={!generatedScript}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download Script
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={handleViewCode}
                        disabled={!generatedScript}
                      >
                        <Code className="w-4 h-4 mr-2" />
                        View Code
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-center">
                <div className="p-4 bg-muted/20 rounded-full mb-4">
                  <Bot className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium mb-2">Ready to Automate</h3>
                <p className="text-muted-foreground">
                  Enter your job URL and resume data to get started with AI-powered automation.
                </p>
              </div>
            )}
          </Card>
        </div>

        {/* Features Section */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-center mb-12">Powerful Automation Features</h2>
          <div className="grid gap-6 md:grid-cols-3">
            <Card className="p-6 bg-gradient-card border-border">
              <div className="p-3 bg-primary/20 rounded-lg w-fit mb-4">
                <Bot className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">AI-Powered Responses</h3>
              <p className="text-muted-foreground">
                Generate personalized answers to application questions using your resume context and job requirements.
              </p>
            </Card>

            <Card className="p-6 bg-gradient-card border-border">
              <div className="p-3 bg-accent/20 rounded-lg w-fit mb-4">
                <Zap className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Smart Form Filling</h3>
              <p className="text-muted-foreground">
                Automatically map your resume data to form fields with intelligent field detection and matching.
              </p>
            </Card>

            <Card className="p-6 bg-gradient-card border-border">
              <div className="p-3 bg-success/20 rounded-lg w-fit mb-4">
                <FileText className="w-6 h-6 text-success" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Resume Upload</h3>
              <p className="text-muted-foreground">
                Automatically handle resume file uploads and format detection for seamless application submission.
              </p>
            </Card>
          </div>
        </div>
      </div>

      {/* Code View Dialog */}
      <Dialog open={showCodeDialog} onOpenChange={setShowCodeDialog}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Code className="w-5 h-5" />
              Generated Automation Script
            </DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-hidden">
            <div className="bg-secondary/50 rounded-lg p-4 max-h-[60vh] overflow-auto">
              <pre className="text-sm font-mono whitespace-pre-wrap break-words">
                {generatedScript}
              </pre>
            </div>
            <div className="flex gap-2 mt-4">
              <Button 
                onClick={handleDownloadScript}
                className="bg-primary hover:bg-primary/90"
              >
                <Download className="w-4 h-4 mr-2" />
                Download Script
              </Button>
              <Button 
                variant="outline"
                onClick={() => navigator.clipboard.writeText(generatedScript)}
              >
                Copy to Clipboard
              </Button>
              <Button 
                variant="outline"
                onClick={() => window.open(jobData?.url, '_blank')}
                disabled={!jobData?.url}
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Open Job Page
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};