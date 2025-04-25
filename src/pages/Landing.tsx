
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
          <p className="text-xl text-muted-foreground mb-12">
            Explore how machine learning models can inadvertently reveal information about their training data,
            and learn how differential privacy helps protect against these privacy attacks.
          </p>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-center gap-2">
                  <Info className="h-5 w-5" />
                  Learn
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Understand how machine learning models can leak information about individual training examples
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-center gap-2">
                  <FileSearch className="h-5 w-5" />
                  Experiment
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Try different attacks on a simple model and see how membership inference works in practice
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-center gap-2">
                  <Shield className="h-5 w-5" />
                  Protect
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Learn how differential privacy can help protect against these attacks while maintaining model utility
                </CardDescription>
              </CardContent>
            </Card>
          </div>

          <Button size="lg" onClick={() => navigate('/simulator')}>
            Start Learning
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Landing;
