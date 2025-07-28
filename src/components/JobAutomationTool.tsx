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
import { Bot, FileText, Globe, Zap, CheckCircle, AlertCircle, Code, Download } from "lucide-react";
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

  const simulateProcessing = async () => {
    setIsProcessing(true);
    
    for (let i = 0; i < processingSteps.length; i++) {
      setCurrentStep(i);
      updateStepStatus(i, 'processing');
      
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      updateStepStatus(i, 'completed');
    }
    
    setIsProcessing(false);
    toast({
      title: "Automation Ready!",
      description: "Your job application automation script has been generated."
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

    await simulateProcessing();
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
                      <Button size="sm" className="bg-success hover:bg-success/90">
                        <Download className="w-4 h-4 mr-2" />
                        Download Script
                      </Button>
                      <Button variant="outline" size="sm">
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
    </div>
  );
};