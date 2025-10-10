import { useState } from 'react';
import { getRoomShareUrl, copyToClipboard, getEnvironmentType } from '@/utils/url';

interface ShareButtonProps {
  roomId: string;
  className?: string;
}

export default function ShareButton({ roomId, className = '' }: ShareButtonProps) {
  const [isSharing, setIsSharing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [shareUrl, setShareUrl] = useState<string>('');
  const [copySuccess, setCopySuccess] = useState(false);

  const handleShare = async () => {
    setIsSharing(true);
    
    try {
      const url = getRoomShareUrl(roomId);
      setShareUrl(url);
      
      const envType = getEnvironmentType();
      
      // Tentar copiar para área de transferência
      const success = await copyToClipboard(url);
      
      if (success) {
        // Feedback visual de sucesso
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
        
        console.log(`Link copiado com sucesso! Ambiente: ${envType}, URL: ${url}`);
      } else {
        // Fallback: mostrar modal
        setShowModal(true);
      }
    } catch (error) {
      console.error('Erro ao compartilhar sala:', error);
      setShareUrl(getRoomShareUrl(roomId));
      setShowModal(true);
    } finally {
      setIsSharing(false);
    }
  };

  const handleManualCopy = async () => {
    try {
      const input = document.getElementById('room-url-input') as HTMLInputElement;
      if (input) {
        input.select();
        input.setSelectionRange(0, 99999); // Para mobile
        
        // Tentar usar API moderna primeiro
        if (navigator.clipboard) {
          await navigator.clipboard.writeText(shareUrl);
        } else {
          // Fallback para browsers antigos
          document.execCommand('copy');
        }
        
        setCopySuccess(true);
        setTimeout(() => {
          setCopySuccess(false);
          setShowModal(false);
        }, 1000);
      }
    } catch (error) {
      console.error('Erro ao copiar:', error);
    }
  };

  return (
    <>
      <button
        onClick={handleShare}
        disabled={isSharing}
        className={`
          px-4 py-2 rounded-lg transition-colors duration-200
          ${copySuccess 
            ? 'bg-green-600 hover:bg-green-700' 
            : 'bg-blue-600 hover:bg-blue-700'
          }
          text-white
          disabled:bg-blue-400 disabled:cursor-not-allowed
          ${className}
        `}
      >
        {isSharing ? (
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            <span>Compartilhando...</span>
          </div>
        ) : copySuccess ? (
          <div className="flex items-center space-x-2">
            <span>✓</span>
            <span>Copiado!</span>
          </div>
        ) : (
          'Compartilhar Sala'
        )}
      </button>

      {/* Modal para cópia manual */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md mx-4">
            <h3 className="text-lg font-bold mb-4">Compartilhar Sala</h3>
            <p className="text-gray-600 mb-4">Copie o link abaixo:</p>
            <div className="flex items-center space-x-2 mb-4">
              <input 
                type="text" 
                value={shareUrl} 
                readOnly 
                className="flex-1 p-2 border border-gray-300 rounded text-sm"
                id="room-url-input"
              />
              <button 
                onClick={handleManualCopy}
                className={`
                  px-3 py-2 rounded text-sm transition-colors
                  ${copySuccess 
                    ? 'bg-green-600 hover:bg-green-700' 
                    : 'bg-blue-600 hover:bg-blue-700'
                  }
                  text-white
                `}
              >
                {copySuccess ? '✓' : 'Copiar'}
              </button>
            </div>
            <button 
              onClick={() => setShowModal(false)}
              className="w-full py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </>
  );
}