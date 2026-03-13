export const MOCK_PROJECTS = [
  {
    id: '1',
    title: 'Implantação Wake E-commerce',
    client: 'Lojas Renner',
    status: 'Em Design',
    branch: 'Curitiba',
  },
  {
    id: '2',
    title: 'Migração Tray',
    client: 'Boutique Z',
    status: 'Desenvolvimento',
    branch: 'Blumenau',
  },
  {
    id: '3',
    title: 'Campanha Black Friday',
    client: 'TechStore',
    status: 'Backlog',
    branch: 'Consolidado',
  },
  {
    id: '4',
    title: 'Nova Home Nuvemshop',
    client: 'Moda Praia',
    status: 'Aprovação Cliente',
    branch: 'Curitiba',
  },
  {
    id: '5',
    title: 'SEO e Performance',
    client: 'AutoPeças 10',
    status: 'Finalizado',
    branch: 'Blumenau',
  },
]

export const MOCK_FINANCE = [
  {
    id: '1',
    date: '2023-10-25',
    description: 'Setup Wake Lojas Renner',
    type: 'Entrada',
    value: 15000,
    branch: 'Curitiba',
  },
  {
    id: '2',
    date: '2023-10-26',
    description: 'Licenças Adobe CC',
    type: 'Saída',
    value: 850,
    category: 'Software',
    branch: 'Consolidado',
  },
  {
    id: '3',
    date: '2023-10-28',
    description: 'Mensalidade TechStore',
    type: 'Entrada',
    value: 4500,
    branch: 'Consolidado',
    recurring: true,
  },
  {
    id: '4',
    date: '2023-10-30',
    description: 'Folha de Pagamento',
    type: 'Saída',
    value: 32000,
    category: 'RH',
    branch: 'Blumenau',
  },
]

export const MOCK_AGENDA = [
  { id: '1', time: '09:00', title: 'Kickoff Nova Nuvemshop', type: 'Reunião Externa' },
  { id: '2', time: '11:30', title: 'Sync de Performance', type: 'Interna' },
  { id: '3', time: '14:00', title: 'Apresentação de Layout', type: 'Reunião Externa' },
  { id: '4', time: '16:00', title: 'Entrevista Dev Front-end', type: 'RH' },
]

export const MOCK_EMPLOYEES = [
  {
    id: '1',
    name: 'Ana Silva',
    role: 'UX/UI Designer',
    contract: 'CLT',
    salary: 6500,
    branch: 'Curitiba',
    status: 'Em Atividade',
    attendanceScore: 98,
    recentLogs: [
      { date: 'Hoje', entry: '08:50', exit: '-', hours: 'Em andamento' },
      { date: 'Ontem', entry: '09:00', exit: '18:00', hours: '8h 00m' },
      { date: '2 dias atrás', entry: '08:55', exit: '18:10', hours: '8h 15m' },
    ],
  },
  {
    id: '2',
    name: 'Carlos Santos',
    role: 'Dev Front-end',
    contract: 'PJ',
    rate: 85,
    hours: 160,
    branch: 'Blumenau',
    status: 'Offline',
    attendanceScore: 85,
    recentLogs: [
      { date: 'Hoje', entry: '10:00', exit: '16:00', hours: '6h 00m' },
      { date: 'Ontem', entry: '09:30', exit: '18:30', hours: '8h 00m' },
    ],
  },
  {
    id: '3',
    name: 'Marina Costa',
    role: 'Gerente de Projetos',
    contract: 'CLT',
    salary: 8000,
    branch: 'Curitiba',
    status: 'Em Pausa',
    attendanceScore: 92,
    recentLogs: [
      { date: 'Hoje', entry: '09:00', exit: '-', hours: 'Pausa (Almoço)' },
      { date: 'Ontem', entry: '08:45', exit: '18:00', hours: '8h 15m' },
    ],
  },
]

export const MOCK_HOURS_PER_PROJECT_WEEK = [
  { project: 'Implantação Wake', hours: 15 },
  { project: 'Migração Tray', hours: 10 },
  { project: 'Campanha Black Friday', hours: 8 },
  { project: 'Reuniões / Interno', hours: 7 },
]

export const MOCK_HOURS_PER_PROJECT_MONTH = [
  { project: 'Implantação Wake', hours: 45 },
  { project: 'Migração Tray', hours: 30 },
  { project: 'Campanha Black Friday', hours: 25 },
  { project: 'Reuniões / Interno', hours: 20 },
  { project: 'Nova Home Nuvemshop', hours: 40 },
]
