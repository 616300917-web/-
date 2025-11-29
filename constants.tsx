import { LearningTask, ColumnDef, TableField } from './types';

export const MOCK_COLUMNS: ColumnDef[] = [
  { key: 'step', header: '学习步骤', width: 'w-24' },
  { key: 'hours', header: '步骤学时', width: 'w-24' },
  { key: 'content', header: '学习内容', width: 'w-64' },
  { key: 'studentActivity', header: '学生活动', width: 'w-64' },
  { key: 'teacherActivity', header: '教师活动', width: 'w-64' },
  { key: 'outcome', header: '学习成果', width: 'w-48' },
  { key: 'resources', header: '学习资源', width: 'w-48' },
];

const createField = (id: string, key: string, value: string, depType: 'reference' | 'copy' | 'logic' = 'reference'): TableField => ({
  id,
  key,
  value,
  dependencies: [
    {
      id: `dep-${id}-1`,
      source: '课程目标与标准 > 职业素养',
      type: depType,
      content: '学生应具备严谨细致的职业态度，严格遵守安全操作规程，养成工具归位的好习惯。',
      affected: false,
    },
    {
      id: `dep-${id}-2`,
      source: '前置课程 > 基础电路',
      type: 'expand',
      content: '需掌握欧姆定律基本计算，理解串并联电路特性。',
      affected: false,
    }
  ]
});

export const MOCK_TASKS: LearningTask[] = [
  {
    id: 'task-1',
    name: '任务 1：升降机配电箱装配',
    rows: [
      {
        id: 'row-1',
        _fields: {
          step: createField('r1-step', 'step', '1. 解析升降机配电箱装配任务单'),
          hours: createField('r1-hours', 'hours', '2'),
          content: createField('r1-content', 'content', '低压配电设备用途分类（临时用电）；任务单结构（任务名称、需求、工期）。', 'copy'),
          studentActivity: createField('r1-sa', 'studentActivity', '阅读任务单，识别关键信息（设备功率、安装位置、工期）；主动向车间负责人询问。'),
          teacherActivity: createField('r1-ta', 'teacherActivity', '指导学生解析任务单的核心要素；示范如何向客户询问关键细节。'),
          outcome: createField('r1-out', 'outcome', '明确升降机配电箱装配的核心信息：设备功率3kW、安装位置车间角落、工期1周。'),
          resources: createField('r1-res', 'resources', '升降机配电箱装配任务单；笔、笔记本。')
        }
      },
      {
        id: 'row-2',
        _fields: {
          step: createField('r2-step', 'step', '2. 计算升降机设备功率对应的电流'),
          hours: createField('r2-hours', 'hours', '2'),
          content: createField('r2-content', 'content', '功率与电流的计算公式（P=UI）；低压断路器选型原则（额定电流大于设备电流）。', 'logic'),
          studentActivity: createField('r2-sa', 'studentActivity', '用计算器计算升降机的额定电流（3kW/220V≈13.6A）；讨论并确定选用10A微断还是16A微断。'),
          teacherActivity: createField('r2-ta', 'teacherActivity', '讲解功率与电流的计算方法；提供《施工现场临时用电安全技术规范》。'),
          outcome: createField('r2-out', 'outcome', '升降机配电箱装配方案（含元件清单、布局设计）；导线规格选型说明。'),
          resources: createField('r2-res', 'resources', '计算器；《施工现场临时用电安全技术规范》(JGJ 46-2005)。')
        }
      },
      {
        id: 'row-3',
        _fields: {
          step: createField('r3-step', 'step', '3. 准备升降机配电箱装配的工具材料'),
          hours: createField('r3-hours', 'hours', '1'),
          content: createField('r3-content', 'content', '工具材料清单的核对方法；常用电工工具的检查要点。'),
          studentActivity: createField('r3-sa', 'studentActivity', '对照材料清单清点剥线钳、万用表、断路器、导线、线槽等物品；测试万用表的电压档。'),
          teacherActivity: createField('r3-ta', 'teacherActivity', '检查学生的清点结果，核对工具材料的规格是否符合方案要求；示范如何测试万用表。'),
          outcome: createField('r3-out', 'outcome', '齐全且状态良好的工具材料（剥线钳、万用表、断路器、导线等）；设置完成的安全措施。'),
          resources: createField('r3-res', 'resources', '工具材料清单；万用表；“断电作业”标识牌。')
        }
      }
    ]
  },
  {
    id: 'task-2',
    name: '任务 2：照明电路安装与调试',
    rows: [
        {
        id: 'row-2-1',
        _fields: {
          step: createField('r21-step', 'step', '1. 勘察现场'),
          hours: createField('r21-hours', 'hours', '4'),
          content: createField('r21-content', 'content', '现场勘察记录表的使用；安全隐患排查。'),
          studentActivity: createField('r21-sa', 'studentActivity', '分组进入现场，记录光源位置，开关高度。'),
          teacherActivity: createField('r21-ta', 'teacherActivity', '强调现场安全规范，指导测量工具使用。'),
          outcome: createField('r21-out', 'outcome', '现场勘察报告。'),
          resources: createField('r21-res', 'resources', '卷尺，照度计。')
        }
      }
    ]
  }
];

export const SIDEBAR_ITEMS = [
  { name: '1 工学一体化课程标准', active: false },
  { name: '2 教学条件分析', active: false },
  { name: '3 参考性学习任务', active: false },
  { name: '4 课程目标与学习内容', active: false },
  { name: '5 教学实施建议', active: false },
  { name: '6 工学一体化课程考核', active: false },
  { name: '7 学习任务教学活动', active: true }, // Current Active
  { name: '8 学习任务考核方案', active: false },
];