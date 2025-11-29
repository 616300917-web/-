import React, { useState, useEffect } from 'react';
import { Network, FileText, ChevronRight, ChevronDown, CheckCircle2, AlertTriangle, ExternalLink, Copy } from 'lucide-react';
import { TableField, Dependency } from '../types';

interface ContextDrawerProps {
  isOpen: boolean;
  onToggle: () => void;
  activeField: TableField | null;
  cascadingAlert: boolean; // Triggers the "Impact Analysis" mode
  onResolveCascade: () => void;
}

const ContextDrawer: React.FC<ContextDrawerProps> = ({ 
  isOpen, 
  onToggle, 
  activeField,
  cascadingAlert,
  onResolveCascade
}) => {
  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>({});

  const toggleNode = (id: string) => {
    setExpandedNodes(prev => ({ ...prev, [id]: !prev[id] }));
  };

  useEffect(() => {
    if (activeField?.dependencies) {
       // Auto expand affected nodes if in alert mode
       if (cascadingAlert) {
           const affected = activeField.dependencies.filter(d => d.affected).reduce((acc, curr) => ({...acc, [curr.id]: true}), {});
           setExpandedNodes(affected);
       }
    }
  }, [cascadingAlert, activeField]);

  return (
    <div 
      className={`
        fixed right-0 top-[64px] bottom-0 bg-white border-l border-gray-200 shadow-xl z-30 transition-all duration-300 ease-in-out flex flex-col
        ${isOpen ? 'w-80 translate-x-0' : 'w-12 translate-x-0 bg-gray-50'}
      `}
    >
      {/* Toggle Handle (Vertical strip when closed) */}
      {!isOpen && (
        <button 
          onClick={onToggle}
          className="h-full w-full flex flex-col items-center pt-6 gap-4 text-gray-400 hover:text-primary-600 hover:bg-primary-50 transition-colors"
        >
          <Network size={20} />
          <span className="vertical-rl text-xs tracking-widest font-medium uppercase">依赖关系</span>
        </button>
      )}

      {/* Drawer Content */}
      {isOpen && (
        <>
          <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
             <div className="flex items-center gap-2 text-gray-700">
                <Network size={18} />
                <h3 className="font-bold text-sm">内容依赖关系</h3>
             </div>
             <button onClick={onToggle} className="text-gray-400 hover:text-gray-600">
                <ChevronRight size={18} />
             </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            
            {cascadingAlert && (
               <div className="mb-6 p-3 bg-amber-50 border border-amber-200 rounded-lg animate-pulse-once">
                  <div className="flex gap-2 items-start text-amber-700 mb-2">
                     <AlertTriangle size={16} className="mt-1" />
                     <span className="text-sm font-bold">检测到依赖变更</span>
                  </div>
                  <p className="text-xs text-amber-600 mb-3 leading-relaxed">
                     您刚刚重新生成了内容，以下依赖项可能需要更新以保持一致性。
                  </p>
                  <button 
                    onClick={onResolveCascade}
                    className="w-full py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-800 text-xs font-semibold rounded transition-colors"
                  >
                     确认并同步更新
                  </button>
               </div>
            )}

            {!activeField ? (
               <div className="text-center text-gray-400 mt-10">
                  <FileText size={48} className="mx-auto mb-2 opacity-20" />
                  <p className="text-sm">点击表格单元格<br/>查看相关依赖</p>
               </div>
            ) : (
              <div className="space-y-4">
                <div className="pb-4 border-b border-gray-100">
                   <span className="text-xs font-semibold text-gray-400 uppercase">当前选中</span>
                   <p className="text-sm font-medium text-gray-800 mt-1 line-clamp-2">{activeField.value}</p>
                </div>

                <div>
                   <span className="text-xs font-semibold text-gray-400 uppercase mb-3 block">依赖项 ({activeField.dependencies.length})</span>
                   <div className="space-y-2">
                      {activeField.dependencies.map(dep => {
                          const isExpanded = expandedNodes[dep.id];
                          const TagIcon = dep.type === 'copy' ? Copy : ExternalLink;
                          return (
                            <div key={dep.id} className={`border rounded-lg transition-all ${dep.affected && cascadingAlert ? 'border-amber-300 ring-1 ring-amber-100' : 'border-gray-200'}`}>
                               <div 
                                 className="flex items-center p-2.5 cursor-pointer hover:bg-gray-50 rounded-t-lg"
                                 onClick={() => toggleNode(dep.id)}
                               >
                                  <div className={`mr-2 transition-transform ${isExpanded ? 'rotate-90' : ''}`}>
                                     <ChevronRight size={14} className="text-gray-400" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                     <p className="text-xs font-medium text-gray-700 truncate">{dep.source}</p>
                                  </div>
                                  <div className={`
                                     ml-2 px-1.5 py-0.5 rounded text-[10px] font-bold uppercase flex items-center gap-1
                                     ${dep.type === 'reference' ? 'bg-blue-100 text-blue-600' : ''}
                                     ${dep.type === 'copy' ? 'bg-purple-100 text-purple-600' : ''}
                                     ${dep.type === 'expand' ? 'bg-green-100 text-green-600' : ''}
                                     ${dep.type === 'logic' ? 'bg-orange-100 text-orange-600' : ''}
                                  `}>
                                     {dep.type === 'copy' ? '复用' : dep.type === 'reference' ? '参考' : dep.type === 'expand' ? '展开' : '逻辑'}
                                  </div>
                               </div>
                               
                               {/* Expanded Content */}
                               {isExpanded && (
                                  <div className="p-3 pt-0 text-xs text-gray-600 bg-gray-50/50 rounded-b-lg border-t border-gray-100">
                                     <div className="py-2 leading-relaxed">
                                        {dep.content}
                                     </div>
                                     <div className="flex justify-end gap-2 mt-1">
                                         <button className="text-primary-600 hover:text-primary-700 flex items-center gap-1 hover:underline">
                                            <ExternalLink size={10} /> 跳转来源
                                         </button>
                                     </div>
                                  </div>
                               )}
                            </div>
                          );
                      })}
                   </div>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ContextDrawer;
