import React, { useState, useEffect } from 'react';
import { Layout, Layers, RefreshCw, Wand2, ArrowLeft, Menu, MessageSquarePlus } from 'lucide-react';
import SmartTable from './components/SmartTable';
import ContextDrawer from './components/ContextDrawer';
import RegenerateDialog from './components/RegenerateDialog';
import { MOCK_TASKS, MOCK_COLUMNS, SIDEBAR_ITEMS } from './constants';
import { TableField, LearningTask } from './types';
import { generateContent } from './services/geminiService';

const App = () => {
  // State
  const [tasks, setTasks] = useState<LearningTask[]>(MOCK_TASKS);
  const [activeTab, setActiveTab] = useState(MOCK_TASKS[0].id);
  const [activeField, setActiveField] = useState<TableField | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  
  // AI Regeneration State
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationContext, setGenerationContext] = useState<{ type: 'row' | 'page', id?: string } | null>(null);
  
  // Cascading Logic State
  const [cascadingAlert, setCascadingAlert] = useState(false);

  const activeTask = tasks.find(t => t.id === activeTab) || tasks[0];
  const tableData = activeTask.rows;

  // Handlers
  const handleSelectField = (field: TableField) => {
    setActiveField(field);
    if (!isDrawerOpen) setIsDrawerOpen(true);
    setCascadingAlert(false); // Reset alert when manually switching
  };

  const handleRegenerateRow = (rowId: string) => {
    setGenerationContext({ type: 'row', id: rowId });
    setDialogOpen(true);
  };

  const handleRegeneratePage = () => {
    setGenerationContext({ type: 'page' });
    setDialogOpen(true);
  };

  const executeGeneration = async (prompt: string) => {
    setIsGenerating(true);
    
    // Simulate API call
    const result = await generateContent({
      prompt: prompt,
      rowId: generationContext?.id,
      isFullPage: generationContext?.type === 'page'
    });

    setIsGenerating(false);
    setDialogOpen(false);

    // Mock Update Logic
    if (generationContext?.type === 'row' && generationContext.id) {
       setTasks(prev => prev.map(task => {
         if (task.id !== activeTab) return task;
         return {
           ...task,
           rows: task.rows.map(row => {
             if (row.id !== generationContext.id) return row;
             // Update the 'content' field as a demo of change
             return {
               ...row,
               _fields: {
                 ...row._fields,
                 content: { ...row._fields.content, value: result } // Update value with AI result
               }
             };
           })
         };
       }));
       
       // Trigger Cascading Alert
       // In a real app, backend would return affected dependencies
       if (activeField) {
         // Create a fake effect on current active field dependencies for demo
         const updatedField = {
            ...activeField,
            dependencies: activeField.dependencies.map(d => ({...d, affected: true}))
         };
         setActiveField(updatedField);
         setIsDrawerOpen(true);
         setCascadingAlert(true);
       }
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      
      {/* Sidebar (Left) */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col shrink-0 z-20">
        <div className="p-4 flex items-center gap-2 border-b border-gray-100">
           <div className="bg-primary-500 text-white p-1.5 rounded-lg">
             <Layout size={20} />
           </div>
           <span className="font-bold text-lg text-gray-800 tracking-tight">AI 工学匠</span>
        </div>
        <nav className="flex-1 overflow-y-auto py-4">
           {SIDEBAR_ITEMS.map((item, idx) => (
             <div 
               key={idx} 
               className={`
                 flex items-center gap-3 px-6 py-3 cursor-pointer text-sm font-medium transition-colors
                 ${item.active ? 'text-primary-600 bg-primary-50 border-r-2 border-primary-500' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'}
               `}
             >
               {item.active ? <CheckCircleIcon /> : <div className="w-4 h-4 border border-gray-300 rounded-full" />}
               {item.name}
             </div>
           ))}
        </nav>
      </aside>

      {/* Main Layout */}
      <div className="flex-1 flex flex-col min-w-0 relative">
        
        {/* Header */}
        <header className="h-16 bg-white border-b border-gray-200 px-6 flex items-center justify-between shrink-0 z-10">
          <div className="flex items-center gap-4">
             <h1 className="text-xl font-bold text-gray-800">学习任务教学活动策划</h1>
             <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded">所属文件: 1工学一体化课程标准转化建议</span>
          </div>
          <div className="flex items-center gap-3">
             <button 
               onClick={handleRegeneratePage}
               className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium rounded-lg shadow-sm transition-all active:scale-95"
             >
               <Wand2 size={16} />
               整页重新生成
             </button>
             <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 text-sm font-medium rounded-lg transition-colors">
               <RefreshCw size={16} />
               全部重写
             </button>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-hidden flex flex-col p-6">
          
          {/* Tabs for "Item N" (Tasks) */}
          <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-1 no-scrollbar shrink-0">
             {tasks.map(task => (
               <button
                 key={task.id}
                 onClick={() => setActiveTab(task.id)}
                 className={`
                   px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all border
                   ${activeTab === task.id 
                     ? 'bg-primary-600 text-white border-primary-600 shadow-md shadow-primary-500/20' 
                     : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50 hover:border-gray-300'}
                 `}
               >
                 {task.name}
               </button>
             ))}
             <button className="p-2 text-primary-600 hover:bg-primary-50 rounded-full transition-colors ml-2" title="添加新任务">
               <MessageSquarePlus size={20} />
             </button>
          </div>

          {/* Table Container */}
          <SmartTable 
            columns={MOCK_COLUMNS}
            data={tableData}
            onRegenerateRow={handleRegenerateRow}
            onSelectField={handleSelectField}
            activeFieldId={activeField?.id}
          />
          
        </main>
      </div>

      {/* Right Drawer */}
      <ContextDrawer 
        isOpen={isDrawerOpen} 
        onToggle={() => setIsDrawerOpen(!isDrawerOpen)}
        activeField={activeField}
        cascadingAlert={cascadingAlert}
        onResolveCascade={() => {
          setCascadingAlert(false);
          // Logic to update dependents would go here
          alert("已同步更新相关依赖项内容。");
        }}
      />

      {/* AI Dialog */}
      <RegenerateDialog 
        isOpen={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onConfirm={executeGeneration}
        title={generationContext?.type === 'page' ? "AI 整页重新规划" : "AI 单行内容优化"}
        loading={isGenerating}
      />

    </div>
  );
};

const CheckCircleIcon = () => (
  <svg className="w-4 h-4 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
  </svg>
);

export default App;
