import React, { useState, useRef, useEffect } from 'react';
import { MoreHorizontal, Sparkles, RefreshCw, Maximize2, Link2, Trash2 } from 'lucide-react';
import { ColumnDef, TableRow, TableField } from '../types';

interface SmartTableProps {
  columns: ColumnDef[];
  data: TableRow[];
  onRegenerateRow: (rowId: string) => void;
  onSelectField: (field: TableField) => void;
  activeFieldId?: string;
}

const SmartTable: React.FC<SmartTableProps> = ({ columns, data, onRegenerateRow, onSelectField, activeFieldId }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll logic if needed, or synchronization
  
  return (
    <div className="relative flex-1 flex flex-col min-h-0 bg-white rounded-lg shadow border border-gray-200">
       {/* Scrollable Container with custom scrollbars */}
      <div 
        ref={scrollContainerRef}
        className="overflow-auto flex-1 w-full relative custom-scrollbar scroll-smooth"
        style={{ maxHeight: 'calc(100vh - 240px)' }} // Adjust based on header/tabs
      >
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 sticky top-0 z-20 shadow-sm text-xs font-semibold text-gray-500 uppercase tracking-wider">
            <tr>
              <th className="p-4 w-12 text-center border-b border-gray-200 bg-gray-50 sticky left-0 z-30">#</th>
              {columns.map((col) => (
                <th 
                  key={col.key} 
                  className={`p-4 border-b border-gray-200 border-r border-gray-100 last:border-r-0 whitespace-nowrap bg-gray-50 ${col.width || 'w-auto'}`}
                >
                  <div className="flex items-center justify-between gap-2">
                    {col.header}
                    {/* Optional Column Menu */}
                    <MoreHorizontal size={14} className="text-gray-300 hover:text-gray-600 cursor-pointer" />
                  </div>
                </th>
              ))}
              <th className="p-4 w-24 text-center border-b border-gray-200 bg-gray-50 sticky right-0 z-30 shadow-[-4px_0_8px_-4px_rgba(0,0,0,0.1)]">
                操作
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
            {data.map((row, index) => (
              <tr 
                key={row.id} 
                className="group hover:bg-primary-50/30 transition-colors duration-150"
              >
                <td className="p-4 text-center text-gray-400 font-mono text-xs border-r border-gray-100 sticky left-0 bg-white group-hover:bg-primary-50/30 z-10">
                  {index + 1}
                </td>
                {columns.map((col) => {
                  const field = row._fields[col.key];
                  const isActive = activeFieldId === field?.id;
                  return (
                    <td 
                      key={`${row.id}-${col.key}`} 
                      className={`
                        p-4 border-r border-gray-100 last:border-r-0 align-top relative transition-all
                        ${isActive ? 'bg-primary-100 ring-2 ring-inset ring-primary-400' : ''}
                      `}
                      onClick={() => field && onSelectField(field)}
                    >
                      {field ? (
                        <ExpandableCell text={field.value} isActive={isActive} />
                      ) : (
                        <span className="text-gray-300 italic">--</span>
                      )}
                      
                      {/* Dependency Indicator Dot */}
                      {field?.dependencies && field.dependencies.length > 0 && (
                        <div className="absolute top-2 right-2 flex gap-1">
                             <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-primary-600' : 'bg-primary-300'}`} title="有依赖项"></div>
                        </div>
                      )}
                    </td>
                  );
                })}
                {/* Sticky Action Column */}
                <td className="p-2 align-middle text-center sticky right-0 bg-white group-hover:bg-primary-50/30 z-10 shadow-[-4px_0_8px_-4px_rgba(0,0,0,0.05)] border-l border-gray-50">
                   <div className="flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => onRegenerateRow(row.id)}
                        className="p-2 text-primary-600 hover:bg-primary-100 rounded-full transition-colors tooltip-trigger relative"
                        title="AI 重新生成此行"
                      >
                        <Sparkles size={16} />
                      </button>
                      <button 
                        className="p-2 text-red-400 hover:bg-red-50 hover:text-red-600 rounded-full transition-colors"
                        title="删除"
                      >
                        <Trash2 size={16} />
                      </button>
                   </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Styles for custom scrollbar within this component */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 10px;
          height: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f5f9;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 5px;
          border: 2px solid #f1f5f9;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
    </div>
  );
};

// Sub-component for cell text with "Read More"
const ExpandableCell: React.FC<{ text: string, isActive: boolean }> = ({ text, isActive }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const shouldTruncate = text.length > 80;

  return (
    <div className="relative group/cell">
      <div className={`transition-all duration-200 ${isExpanded ? '' : 'line-clamp-3'}`}>
        {text}
      </div>
      {shouldTruncate && (
        <button 
          onClick={(e) => {
            e.stopPropagation(); // Prevent triggering parent click immediately
            setIsExpanded(!isExpanded);
          }}
          className={`
            mt-1 text-xs font-medium flex items-center gap-1
            ${isActive ? 'text-primary-700' : 'text-primary-600 opacity-0 group-hover/cell:opacity-100'} 
            transition-opacity
          `}
        >
          {isExpanded ? '收起' : '展开阅读'}
          {isExpanded ? null : <Maximize2 size={10} />}
        </button>
      )}
    </div>
  );
};

export default SmartTable;
