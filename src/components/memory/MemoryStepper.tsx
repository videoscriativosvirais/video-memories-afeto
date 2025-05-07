
import React from 'react';
import { useMemory } from '@/contexts/MemoryContext';
import { Check, ChevronsRight } from 'lucide-react';

const steps = [
  { id: 1, label: 'Dados básicos' },
  { id: 2, label: 'Fotos' },
  { id: 3, label: 'Música e emoji' },
  { id: 4, label: 'Geração de vídeo' },
  { id: 5, label: 'Compartilhar' },
  { id: 6, label: 'Pagamento' },
];

const MemoryStepper: React.FC = () => {
  const { currentStep, goToStep } = useMemory();

  return (
    <div className="py-6 px-4">
      <div className="flex flex-col sm:flex-row justify-between mb-8">
        {steps.map((step) => (
          <div
            key={step.id}
            className={`flex items-center mb-4 sm:mb-0 ${step.id < currentStep ? 'text-memory-600' : step.id === currentStep ? 'text-memory-500' : 'text-gray-400'}`}
          >
            <div
              className={`flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full mr-2 ${
                step.id < currentStep
                  ? 'bg-memory-500 text-white'
                  : step.id === currentStep
                  ? 'border-2 border-memory-500 text-memory-500'
                  : 'border-2 border-gray-300 text-gray-400'
              }`}
              onClick={() => step.id < currentStep && goToStep(step.id)}
              style={{ cursor: step.id < currentStep ? 'pointer' : 'default' }}
            >
              {step.id < currentStep ? (
                <Check className="h-4 w-4" />
              ) : (
                <span className="text-sm">{step.id}</span>
              )}
            </div>
            <span className="text-sm hidden sm:inline">{step.label}</span>
            {step.id !== steps.length && <ChevronsRight className="h-4 w-4 mx-1 hidden sm:inline" />}
          </div>
        ))}
      </div>
      <div className="sm:hidden">
        <p className="text-center font-medium text-memory-600">
          Passo {currentStep}: {steps.find(s => s.id === currentStep)?.label}
        </p>
      </div>
    </div>
  );
};

export default MemoryStepper;
