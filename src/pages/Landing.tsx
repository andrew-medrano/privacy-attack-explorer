
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from 'react-router-dom';
import { FileSearch, Shield, Info } from 'lucide-react';

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-6">Membership Inference Attack Simulator</h1>
          <p className="text-xl text-muted-foreground mb-8">
            Discover how machine learning models can unintentionally expose private information about individuals in their training data. Through this interactive simulator, you'll learn about privacy vulnerabilities and protection techniques.
          </p>
          
          <div className="max-w-3xl mx-auto mb-12 text-left space-y-4">
            <h2 className="text-2xl font-semibold">What are Membership Inference Attacks?</h2>
            <p className="text-muted-foreground">
              A membership inference attack allows an attacker to determine whether a specific individual's data was used to train a machine learning model. This can reveal sensitive information about people in the training dataset - for example, if a model was trained on medical records, an attacker might discover that someone was part of a particular medical study.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-center gap-2">
                  <Info className="h-5 w-5" />
                  Interactive Learning
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Train a simple machine learning model on medical data and see how its predictions can reveal whether a patient's data was used in training
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-center gap-2">
                  <FileSearch className="h-5 w-5" />
                  Run Attacks
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Perform membership inference attacks yourself and see how model confidence scores can be used to determine training set membership
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-center gap-2">
                  <Shield className="h-5 w-5" />
                  Privacy Protection
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Learn how differential privacy techniques can protect individual privacy by adding carefully calibrated noise to the model's training process
                </CardDescription>
              </CardContent>
            </Card>
          </div>

          <div className="max-w-3xl mx-auto mb-12 text-left space-y-4">
            <h2 className="text-2xl font-semibold">Why This Matters</h2>
            <p className="text-muted-foreground">
              As machine learning becomes more prevalent in handling sensitive data (healthcare, financial, personal), understanding privacy vulnerabilities is crucial. This simulator demonstrates how these attacks work and how we can protect against them using differential privacy - a mathematical framework that provides strong privacy guarantees.
            </p>
          </div>

          <Button size="lg" onClick={() => navigate('/simulator')}>
            Start Exploring
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Landing;
