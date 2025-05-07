
import React from 'react';
import { useMemory } from '@/contexts/MemoryContext';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

const Step1BasicInfo: React.FC = () => {
  const { memory, setTitle, setText, setDate, nextStep } = useMemory();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    nextStep();
  };

  return (
    <div className="memory-step">
      <h2 className="text-2xl font-serif font-medium mb-6 text-memory-600">Comece sua memória</h2>
      <p className="text-gray-600 mb-6">
        Comece contando um pouco sobre essa memória especial. Qual é o título? Quando aconteceu? O que faz dela tão especial?
      </p>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Título da memória
          </label>
          <input
            id="title"
            type="text"
            value={memory.title}
            onChange={(e) => setTitle(e.target.value)}
            className="memory-input"
            placeholder="Ex: Nosso primeiro encontro"
            required
          />
        </div>
        
        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
            Data da memória
          </label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal memory-input",
                  !memory.date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {memory.date ? (
                  format(memory.date, "PPP", { locale: ptBR })
                ) : (
                  <span>Escolha uma data</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 pointer-events-auto">
              <Calendar
                mode="single"
                selected={memory.date || undefined}
                onSelect={setDate}
                initialFocus
                locale={ptBR}
                className="p-3 pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>
        
        <div>
          <label htmlFor="text" className="block text-sm font-medium text-gray-700 mb-1">
            Conte sua história
          </label>
          <textarea
            id="text"
            value={memory.text}
            onChange={(e) => setText(e.target.value)}
            className="memory-input min-h-[150px]"
            placeholder="Descreva esse momento especial com detalhes que te fazem lembrar e sentir..."
            required
          />
        </div>
        
        <div className="flex justify-end pt-4">
          <Button 
            type="submit" 
            className="memory-button-primary"
            disabled={!memory.title || !memory.date || !memory.text}
          >
            Próximo Passo
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Step1BasicInfo;
