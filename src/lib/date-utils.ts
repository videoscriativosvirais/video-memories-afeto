/**
 * Utilitários para formatação de datas
 */

/**
 * Formata uma data para exibição no formato brasileiro com hora
 * @param dateString String de data para formatar
 * @returns Data formatada no padrão brasileiro com hora (DD/MM/YYYY às HH:MM)
 */
export function formatDateWithTime(dateString: string): string {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  return `${date.toLocaleDateString('pt-BR')} às ${date.toLocaleTimeString('pt-BR', { 
    hour: '2-digit', 
    minute: '2-digit' 
  })}`;
}

/**
 * Formata uma data para exibição no formato brasileiro
 * @param dateString String de data para formatar
 * @returns Data formatada no padrão brasileiro (DD/MM/YYYY)
 */
export function formatDate(dateString: string): string {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR');
}

/**
 * Formata uma hora para exibição
 * @param dateString String de data para formatar
 * @returns Hora formatada (HH:MM)
 */
export function formatTime(dateString: string): string {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  return date.toLocaleTimeString('pt-BR', { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
}

/**
 * Formata uma data relativa (quanto tempo atrás)
 * @param dateString String de data para formatar
 * @returns Texto indicando quanto tempo atrás (ex: "há 2 horas", "há 3 dias")
 */
export function formatRelativeTime(dateString: string): string {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  
  // Converter para segundos
  const diffSec = Math.floor(diffMs / 1000);
  
  // Menos de 1 minuto
  if (diffSec < 60) {
    return 'agora mesmo';
  }
  
  // Menos de 1 hora
  if (diffSec < 3600) {
    const minutes = Math.floor(diffSec / 60);
    return `há ${minutes} ${minutes === 1 ? 'minuto' : 'minutos'}`;
  }
  
  // Menos de 1 dia
  if (diffSec < 86400) {
    const hours = Math.floor(diffSec / 3600);
    return `há ${hours} ${hours === 1 ? 'hora' : 'horas'}`;
  }
  
  // Menos de 1 semana
  if (diffSec < 604800) {
    const days = Math.floor(diffSec / 86400);
    return `há ${days} ${days === 1 ? 'dia' : 'dias'}`;
  }
  
  // Menos de 1 mês
  if (diffSec < 2592000) {
    const weeks = Math.floor(diffSec / 604800);
    return `há ${weeks} ${weeks === 1 ? 'semana' : 'semanas'}`;
  }
  
  // Menos de 1 ano
  if (diffSec < 31536000) {
    const months = Math.floor(diffSec / 2592000);
    return `há ${months} ${months === 1 ? 'mês' : 'meses'}`;
  }
  
  // Mais de 1 ano
  const years = Math.floor(diffSec / 31536000);
  return `há ${years} ${years === 1 ? 'ano' : 'anos'}`;
}
