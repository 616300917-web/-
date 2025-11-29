import React, { useState } from 'react';
import { Sparkles, X } from 'lucide-react';

interface RegenerateDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (prompt: string) => void;
  title?: string;
  loading?: boolean;
}

const RegenerateDialog: React.FC<RegenerateDialogProps> = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = "AI 重新生成",
  loading = false
}) => {
  const [prompt, setPrompt] = useState('');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-[500px] p-6 animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2 text-primary-700">
            <Sparkles size={20} />
            <h3 className="font-bold text-lg">{title}</h3>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        <p className="text-sm text-gray-600 mb-3">
          请输入您的调整要求，AI 将根据现有内容及您的指示重新生成。
        </p>

        <textarea
          className="w-full h-32 p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none resize-none text-sm"
          placeholder="例如：请让学生活动更加具体，增加关于安全操作的描述..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          autoFocus
        />

        <div className="flex justify-end gap-3 mt-6">
          <button 
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg text-sm font-medium transition-colors"
          >
            取消
          </button>
          <button 
            onClick={() => onConfirm(prompt)}
            disabled={!prompt.trim() || loading}
            className={`px-4 py-2 rounded-lg text-sm font-medium text-white flex items-center gap-2 transition-all
              ${!prompt.trim() || loading ? 'bg-primary-300 cursor-not-allowed' : 'bg-primary-600 hover:bg-primary-700 shadow-lg shadow-primary-500/30'}
            `}
          >
            {loading ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                生成中...
              </>
            ) : (
              <>
                <Sparkles size={16} />
                开始生成
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegenerateDialog;
