/**
 * Utilitários para gerenciamento de URLs em diferentes ambientes
 */

/**
 * Detecta a URL base apropriada para o ambiente atual
 * Funciona em desenvolvimento local, Docker e Kubernetes
 */
export function getBaseUrl(): string {
  if (typeof window === 'undefined') {
    // Server-side rendering
    return '';
  }

  const { protocol, hostname, port } = window.location;

  // Ambientes de desenvolvimento local
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return window.location.origin;
  }

  // Ambientes containerizados (Docker/Kubernetes)
  // Verificar se é um IP interno do cluster
  if (hostname.match(/^\d+\.\d+\.\d+\.\d+$/)) {
    // Se for um IP e tivermos um port específico, usar como está
    return window.location.origin;
  }

  // Para domínios reais ou hostnames de cluster
  // Construir URL baseada no protocolo e hostname atual
  let baseUrl = `${protocol}//${hostname}`;
  
  // Adicionar porta apenas se não for a porta padrão
  if (port && port !== '80' && port !== '443') {
    baseUrl += `:${port}`;
  }

  return baseUrl;
}

/**
 * Gera URL da sala para compartilhamento
 */
export function getRoomShareUrl(roomId: string): string {
  const baseUrl = getBaseUrl();
  return `${baseUrl}/room/${roomId}`;
}

/**
 * Copia texto para a área de transferência com fallbacks
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    // Método moderno (HTTPS necessário)
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }

    // Fallback para browsers antigos ou HTTP
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    const success = document.execCommand('copy');
    document.body.removeChild(textArea);
    
    return success;
  } catch (error) {
    console.error('Erro ao copiar para área de transferência:', error);
    return false;
  }
}

/**
 * Detecta se está rodando em ambiente Kubernetes
 */
export function isKubernetesEnvironment(): boolean {
  if (typeof window === 'undefined') return false;
  
  const hostname = window.location.hostname;
  
  // Padrões comuns de hostnames em Kubernetes
  const k8sPatterns = [
    /^[a-z0-9-]+\.[a-z0-9-]+\.svc\.cluster\.local$/,  // DNS interno do cluster
    /^[a-z0-9-]+-[a-z0-9]{5}$/, // Pods com sufixo aleatório
    /^\d+\.\d+\.\d+\.\d+$/, // IPs diretos
  ];
  
  return k8sPatterns.some(pattern => pattern.test(hostname)) ||
         hostname.includes('svc.cluster') ||
         hostname.includes('.local');
}

/**
 * Detecta tipo de ambiente
 */
export function getEnvironmentType(): 'development' | 'docker' | 'kubernetes' | 'production' {
  if (typeof window === 'undefined') return 'production';
  
  const hostname = window.location.hostname;
  
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return 'development';
  }
  
  if (isKubernetesEnvironment()) {
    return 'kubernetes';
  }
  
  if (hostname.match(/^\d+\.\d+\.\d+\.\d+$/)) {
    return 'docker';
  }
  
  return 'production';
}