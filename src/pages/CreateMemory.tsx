
import React from 'react';
import Layout from '@/components/layout/Layout';
import MemoryStepper from '@/components/memory/MemoryStepper';
import Step1BasicInfo from '@/components/memory/steps/Step1BasicInfo';
import Step2Photos from '@/components/memory/steps/Step2Photos';
import Step3MusicEmoji from '@/components/memory/steps/Step3MusicEmoji';
import Step4VideoGeneration from '@/components/memory/steps/Step4VideoGeneration';
import Step5Share from '@/components/memory/steps/Step5Share';
import Step6Payment from '@/components/memory/steps/Step6Payment';
import { MemoryProvider, useMemory } from '@/contexts/MemoryContext';

const MemorySteps: React.FC = () => {
  const { currentStep } = useMemory();
  
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1BasicInfo />;
      case 2:
        return <Step2Photos />;
      case 3:
        return <Step3MusicEmoji />;
      case 4:
        return <Step4VideoGeneration />;
      case 5:
        return <Step5Share />;
      case 6:
        return <Step6Payment />;
      default:
        return <Step1BasicInfo />;
    }
  };
  
  return (
    <div className="page-container">
      <h1 className="text-3xl md:text-4xl font-serif text-center font-medium text-memory-700 mb-8">
        Criar Nova Memória
      </h1>
      <MemoryStepper />
      <div className="max-w-3xl mx-auto">
        {renderStep()}
      </div>
    </div>
  );
};

const CreateMemory: React.FC = () => {
  return (
    <Layout>
      <MemoryProvider>
        <MemorySteps />
      </MemoryProvider>
    </Layout>
  );
};

export default CreateMemory;
