import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Calendar, DollarSign, BarChart3, Save, Download, RotateCcw, Plus, Trash2, Sparkles, Users, Clock, Loader2, Check, Award, UserCheck, GripVertical, ChevronUp, ChevronDown, Trophy, Printer, Radio, FileText, ClipboardList, CircleDollarSign, CheckCircle2, Circle, Play, Pause, SkipForward, Volume2, LayoutGrid, ListChecks, Presentation, Camera, Mic, AlertCircle, Search, ChevronRight, Home, Menu, X } from 'lucide-react';

const APP_VERSION = 'V5';
const STORAGE_KEY = 'fule_yellow_party_v5';
const EVENT_DATETIME = new Date('2025-06-12T17:30:00+08:00').getTime();

// ============== 預設資料 ==============
const DEFAULT_FLOW = [
  { id: 1, time: "15:30-17:30", title: "場地布置", detail: "1. 場地布置 15:30 進場\n2. 音響設備 16:00 進場\n3. 16:30 大螢幕畫面內容及燈光音響等測試\n4. 16:30 簡報手進場測試投影、確認所有簡報檔順序\n5. 17:00 現場硬軟體交場\n6. 黃色派對主題佈置確認（拍照區、桌花、氣球裝飾）\n7. 攝影師 17:00 到場準備", music: "", note: "" },
  { id: 2, time: "17:30-18:30", title: "迎賓報到", detail: "報到 / 入席 / 交流\n※ 提醒伙伴 Dress Code：黃色系服裝\n※ 報到處提供黃色小配件（胸花/領結）\n※ 攝影組拍攝伙伴進場花絮、主題牆合影", music: "迎賓音樂", note: "簡報手：待機 + 確認簡報" },
  { id: 3, time: "18:30-18:40", title: "大合照", detail: "全體伙伴黃色派對主題大合照\n攝影師就定位、主持人引導隊形", music: "", note: "" },
  { id: 4, time: "18:40-18:43", title: "主持人開場", detail: "會員主持人開場（芋頭）\n歡迎詞 + 介紹本次黃色派對 11 周年主題", music: "01. 開場樂", note: "簡報手：開場畫面 / 芋頭" },
  { id: 5, time: "18:43-18:46", title: "介紹與會夥伴/核心", detail: "本次為內部活動，介紹重點夥伴：\n1. 現任主席 + 核心幹部\n2. 歷屆主席\n3. 創始會員", music: "02. 介紹音樂", note: "簡報手：夥伴照片輪播 / PUMA" },
  { id: 6, time: "18:46-18:50", title: "播放精彩回顧影片", detail: "11 周年經典回顧特輯（兩段，進場播11年回顧，入座後播一整年回顧）", music: "03. 回顧影片", note: "簡報手：播放影片" },
  { id: 7, time: "18:50-18:53", title: "主席致詞", detail: "邀請主席 上台致詞", music: "04. 致詞音樂", note: "遞麥克風" },
  { id: 8, time: "18:53-18:56", title: "富樂董事顧問致詞", detail: "董事顧問 上台致詞", music: "04. 致詞音樂", note: "遞麥克風" },
  { id: 9, time: "18:56-19:01", title: "11 周年慶切蛋糕", detail: "1. 推出 11 周年蛋糕（經典橋段，靜方姐幫問）\n2. 邀請核心群上台一同歡慶 11 周年慶\n3. 切蛋糕 + 合影", music: "生日快樂歌", note: "簡報手：生日畫面 / 攝影：合影 / PUMA" },
  { id: 10, time: "19:01-19:25", title: "上菜 / 用餐交流", detail: "1. 有請餐廳上菜\n2. 伙伴用餐、交流時間\n3. (19:20 請參加走秀者集合)", music: "輕音樂 / 背景音樂", note: "PUMA" },
  { id: 11, time: "19:25-19:40", title: "黃色派對造型走秀 / 票選", detail: "1. 主持群上台加入主持\n2. 參賽者持號碼牌登場走秀\n3. APP 連結票選評分\n4. 頒獎類別：\n   ★ 黃金閃耀獎\n   ★ 創意亮點獎\n   ★ 人氣王", music: "06. 走秀音樂", note: "簡報手：投影號碼、QR Code / 攝影：拍攝 / PUMA" },
  { id: 12, time: "19:40-19:48", title: "頒獎 — 業績類", detail: "1. 引薦單第一名\n2. 一對一第一名\n3. 引薦金額冠軍\n4. 來賓王\n5. 培訓王\n※ 詳見「得獎名單」分頁", music: "05. 頒獎音樂", note: "簡報手：投影得獎者 / 攝影：合影 / 明勳" },
  { id: 13, time: "19:48-19:54", title: "頒獎 — 全勤獎", detail: "1. 一年全勤獎\n2. 二年全勤獎\n3. 五年全勤獎\n※ 詳見「得獎名單」分頁", music: "05. 頒獎音樂", note: "簡報手：投影得獎者 / 攝影：合影" },
  { id: 14, time: "19:54-19:58", title: "頒獎 — 金拖鞋獎", detail: "打不死的小強（宣樺哥、小歐哥）\n遠的要命王國：每星期都從外縣市來參加例會", music: "05. 頒獎音樂", note: "簡報手：投影得獎者 / 明勳" },
  { id: 15, time: "19:58-20:15", title: "百萬大歌星", detail: "聽音樂前奏猜歌名\n黃色派對特別版：黃色主題歌曲\n（小黃人、黃色潛水艇、小蜜蜂等）\n禮物數：10-15 份", music: "07. 猜歌音樂", note: "簡報手：播放前奏、揭曉答案 / 芋頭" },
  { id: 16, time: "20:15-20:30", title: "趣味競答", detail: "富樂分會知識 + 會員大小事競答\n範例：\n  • 富樂成立至今幾位主席？\n  • 全勤出席王是誰？\n  • 本年度引薦金額冠軍？", music: "08. 競答音樂", note: "簡報手：題目切換 / 10-15 題 / 芋頭" },
  { id: 17, time: "20:30-20:45", title: "音樂時光 + 帶動跳", detail: "1. 播放音樂熱場\n2. 邀請大家到舞池跳舞\n3. 投影歷屆核心照片輪播\n4. 自由交流、拍照", music: "熱舞歌單", note: "簡報手：照片輪播 / 攝影：花絮 / 文昱" },
  { id: 18, time: "20:45-20:57", title: "總敬酒致謝", detail: "1. 邀請核心群上台\n2. 向全體伙伴敬酒感謝\n3. 合影留念", music: "08. 舉杯音樂", note: "簡報手：感謝畫面 / 攝影：大合照" },
  { id: 19, time: "20:57-21:00", title: "圓滿結束", detail: "主持人結尾\n歡送伙伴 / 散場音樂", music: "09. 謝客音樂", note: "簡報手：結尾畫面" },
];

const DEFAULT_BUDGET = {
  assumptions: { tables: 5, perTable: 10, perPerson: 1500, tableCost: 10000, subsidyCap: 40000 },
  expenses: [
    { name: "飯店餐費及場地費", qty: "={tables}", unit: "桌", price: "={tableCost}", lastYear: 200000, note: "10週年：20桌×10,000" },
    { name: "工作人員便當", qty: 3, unit: "份", price: 200, lastYear: 1600, note: "簡報手1+攝影2" },
    { name: "桌卡牌製作", qty: "={tables}+2", unit: "張", price: 30, lastYear: 510, note: "沿用單價" },
    { name: "紅酒費用（餐廳）", qty: "=CEIL({tables}*0.8)", unit: "瓶", price: 480, lastYear: 5760, note: "" },
    { name: "紅酒費用（代購）", qty: 3, unit: "組", price: 1000, lastYear: 12000, note: "1000元/3瓶" },
    { name: "晚會獎盃（造型獎3座）", qty: 1, unit: "式", price: 4500, lastYear: 14300, note: "精簡為3座" },
    { name: "走秀手舉牌", qty: 1, unit: "式", price: 1050, lastYear: 1050, note: "沿用" },
    { name: "猜歌+競答小禮物", qty: 1, unit: "式", price: 2500, lastYear: 1500, note: "含競答" },
    { name: "主題拍照區佈置（黃色）", qty: 1, unit: "式", price: 9000, lastYear: 9000, note: "" },
    { name: "周年慶大蛋糕（雙層）", qty: 1, unit: "式", price: 5500, lastYear: 7800, note: "雙層即可" },
    { name: "活動攝影—平面", qty: 1, unit: "式", price: 9000, lastYear: 9000, note: "" },
    { name: "簡報手費用", qty: 1, unit: "式", price: 3000, lastYear: 0, note: "內部會員可免" },
    { name: "其他雜支", qty: 1, unit: "式", price: 1500, lastYear: 0, note: "預備金" },
  ]
};

const AWARD_CATEGORY_ORDER = ['造型走秀', '業績類', '全勤獎', '金拖鞋獎', '其他獎項'];

const DEFAULT_AWARDS = [
  { category: "造型走秀", name: "黃金閃耀獎", winner: "", note: "整體黃色元素最完整、最吸睛" },
  { category: "造型走秀", name: "創意亮點獎", winner: "", note: "巧思結合黃色元素、造型最有創意" },
  { category: "造型走秀", name: "人氣王", winner: "", note: "票選最高人氣" },
  { category: "業績類", name: "引薦單第一名", winner: "", note: "" },
  { category: "業績類", name: "一對一第一名", winner: "", note: "" },
  { category: "業績類", name: "引薦金額冠軍", winner: "", note: "" },
  { category: "業績類", name: "來賓王", winner: "", note: "" },
  { category: "業績類", name: "培訓王", winner: "", note: "" },
  { category: "全勤獎", name: "一年全勤獎", winner: "", note: "週二反射動作" },
  { category: "全勤獎", name: "二年全勤獎", winner: "", note: "全勤體質" },
  { category: "全勤獎", name: "五年全勤獎", winner: "", note: "出席王" },
  { category: "金拖鞋獎", name: "打不死的小強", winner: "宣樺、小歐", note: "外縣市每週出席" },
  { category: "金拖鞋獎", name: "遠的要命王國", winner: "", note: "" },
];

const DEFAULT_STAFF = [
  { role: "活動主席", name: "", phone: "", responsibility: "整體統籌、場控決策" },
  { role: "主持 - 開場", name: "芋頭", phone: "", responsibility: "開場、百萬大歌星、趣味競答" },
  { role: "主持 - 介紹/活動", name: "PUMA", phone: "", responsibility: "介紹夥伴、切蛋糕、走秀、用餐" },
  { role: "主持 - 頒獎", name: "明勳", phone: "", responsibility: "業績獎、金拖鞋獎" },
  { role: "主持 - 音樂時光", name: "文昱", phone: "", responsibility: "音樂時光、帶動跳" },
  { role: "簡報手", name: "", phone: "", responsibility: "全程投影、影片、QR、題目操作" },
  { role: "攝影師（平面）", name: "", phone: "", responsibility: "進場、頒獎、合影、活動花絮" },
  { role: "迎賓報到", name: "", phone: "", responsibility: "報到、發放黃色配件、引導入席" },
  { role: "場地總協調", name: "", phone: "", responsibility: "與林皇宮對接、進場交場" },
  { role: "蛋糕負責", name: "靜方", phone: "", responsibility: "預訂與現場確認" },
  { role: "獎座/獎品", name: "", phone: "", responsibility: "獎座準備、走秀禮物、競答禮物" },
  { role: "走秀統籌", name: "", phone: "", responsibility: "報名、號碼牌、走秀順序" },
];

// ============== 工具 ==============
const evalFormula = (val, ctx) => {
  if (typeof val === 'number') return val;
  if (typeof val !== 'string' || !val.startsWith('=')) return Number(val) || 0;
  try {
    let expr = val.slice(1);
    expr = expr.replace(/\{(\w+)\}/g, (_, k) => ctx[k] ?? 0);
    expr = expr.replace(/CEIL\(([^)]+)\)/g, 'Math.ceil($1)');
    return Function('"use strict";return (' + expr + ')')() || 0;
  } catch { return 0; }
};
const fmt = (n) => (n ?? 0).toLocaleString('zh-TW');
const ensureIds = (arr) => arr.map((x, i) => x.id ? x : { ...x, id: Date.now() + i });
const parseTimeRange = (timeStr, baseDate) => {
  if (!timeStr) return null;
  const parts = timeStr.split('-');
  if (parts.length !== 2) return null;
  const p = (s) => {
    const [h, m] = s.trim().split(':').map(Number);
    if (isNaN(h) || isNaN(m)) return null;
    const d = new Date(baseDate); d.setHours(h, m, 0, 0); return d.getTime();
  };
  const start = p(parts[0]), end = p(parts[1]);
  if (start === null || end === null) return null;
  return { start, end };
};

// ============== 主元件 ==============
export default function App() {
  const [tab, setTab] = useState('overview');
  const [flow, setFlow] = useState(DEFAULT_FLOW);
  const [budget, setBudget] = useState(DEFAULT_BUDGET);
  const [awards, setAwards] = useState(DEFAULT_AWARDS);
  const [staff, setStaff] = useState(DEFAULT_STAFF);
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState('idle');
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [liveMode, setLiveMode] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const r = await window.storage.get(STORAGE_KEY, true);
        if (r?.value) {
          const d = JSON.parse(r.value);
          if (d.flow) setFlow(ensureIds(d.flow));
          if (d.budget) setBudget(d.budget);
          if (d.awards) setAwards(d.awards);
          if (d.staff) setStaff(d.staff);
          if (d.registrations) setRegistrations(ensureIds(d.registrations));
        }
      } catch (e) {}
      setLoading(false);
    })();
  }, []);

  const saveData = useCallback(async (data) => {
    setSaveStatus('saving');
    try {
      await window.storage.set(STORAGE_KEY, JSON.stringify(data), true);
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 1500);
    } catch (e) { setSaveStatus('idle'); }
  }, []);

  useEffect(() => {
    if (loading) return;
    const t = setTimeout(() => saveData({ flow, budget, awards, staff, registrations }), 800);
    return () => clearTimeout(t);
  }, [flow, budget, awards, staff, registrations, loading, saveData]);

  const calc = useMemo(() => {
    const ctx = budget.assumptions;
    const exp = budget.expenses.map(e => {
      const q = evalFormula(e.qty, ctx);
      const p = evalFormula(e.price, ctx);
      return { ...e, _qty: q, _price: p, _total: q * p };
    });
    const expTotal = exp.reduce((a, b) => a + b._total, 0);
    const income = ctx.tables * ctx.perTable * ctx.perPerson;
    return { expensesWithTotal: exp, expTotal, income, gap: expTotal - income, balance: income + ctx.subsidyCap - expTotal };
  }, [budget]);

  const scenarios = useMemo(() => {
    const ctx = budget.assumptions;
    const v = ctx.tableCost + 30 + 0.8 * 480;
    return [5, 7, 10].map(t => {
      const inc = t * ctx.perTable * ctx.perPerson;
      const exp = calc.expTotal + (t - ctx.tables) * v;
      return { tables: t, persons: t * ctx.perTable, income: inc, expense: exp, need: exp - inc, withinCap: (exp - inc) <= ctx.subsidyCap };
    });
  }, [budget, calc.expTotal]);

  // 自動聚合待辦
  const todos = useMemo(() => {
    const list = [];
    // 得獎名單待填
    awards.forEach((a, i) => {
      if (!a.winner.trim()) list.push({ id: `a-${i}`, category: '得獎', priority: 'medium', task: `填寫「${a.category} — ${a.name}」得獎者`, goTo: 'awards' });
    });
    // 分工待指派
    staff.forEach((s, i) => {
      if (!s.name.trim()) list.push({ id: `s-${i}`, category: '分工', priority: 'high', task: `指派「${s.role}」負責人`, goTo: 'staff' });
    });
    // 報名未繳費
    registrations.forEach((r) => {
      if (r.name.trim() && !r.paid) {
        list.push({ id: `r-${r.id}`, category: '繳費', priority: 'medium', task: `催繳：${r.name}`, goTo: 'registration' });
      }
    });
    // 預算超支
    if (calc.balance < 0) {
      list.push({ id: 'budget-over', category: '預算', priority: 'high', task: `預算超支 $${fmt(Math.abs(calc.balance))}，需調整`, goTo: 'budget' });
    }
    // 沒有報名資料
    if (registrations.length === 0) {
      list.push({ id: 'reg-empty', category: '報名', priority: 'high', task: '尚未建立報名名單', goTo: 'registration' });
    }
    return list;
  }, [awards, staff, registrations, calc.balance]);

  const handleReset = () => {
    setFlow(DEFAULT_FLOW); setBudget(DEFAULT_BUDGET); setAwards(DEFAULT_AWARDS); setStaff(DEFAULT_STAFF); setRegistrations([]);
    setShowResetConfirm(false);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center" style={{ background: '#FFFBEA' }}><Loader2 className="w-8 h-8 animate-spin" style={{ color: '#F5B800' }} /></div>;
  if (liveMode) return <LiveMode flow={flow} awards={awards} staff={staff} onExit={() => setLiveMode(false)} />;

  const tabs = [
    { id: 'overview', label: '總覽', icon: Home },
    { id: 'flow', label: '流程', icon: Calendar },
    { id: 'registration', label: '報名', icon: ClipboardList },
    { id: 'awards', label: '得獎', icon: Award },
    { id: 'staff', label: '分工', icon: UserCheck },
    { id: 'budget', label: '預算', icon: DollarSign },
    { id: 'stats', label: '統計', icon: BarChart3 },
    { id: 'todos', label: '待辦', icon: ListChecks },
  ];

  const currentTab = tabs.find(t => t.id === tab);

  const navigateTo = (targetTab) => {
    setTab(targetTab);
    setMenuOpen(false);
  };

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #FFFBEA 0%, #FFF4CC 100%)', fontFamily: '"Noto Sans TC", "PingFang TC", "Microsoft JhengHei", sans-serif' }}>
      <style>{`
        @media print { body { background: white !important; } .no-print { display: none !important; } }
        input, textarea { -webkit-appearance: none; }
      `}</style>

      {/* 頂部列（精簡版） */}
      <header className="sticky top-0 z-30 backdrop-blur-md border-b no-print" style={{ background: 'rgba(255, 251, 234, 0.95)', borderColor: '#F5B800' }}>
        <div className="max-w-4xl mx-auto px-3 py-2.5">
          <div className="flex items-center justify-between gap-2">
            {/* 左：選單 + 標題 */}
            <div className="flex items-center gap-2 min-w-0">
              <button onClick={() => setMenuOpen(true)} className="p-2 -ml-1 rounded-lg active:bg-yellow-100 transition md:hidden">
                <Menu className="w-5 h-5" style={{ color: '#92400E' }} />
              </button>
              <div className="min-w-0">
                <div className="text-sm md:text-base font-bold leading-tight truncate" style={{ color: '#1F2937' }}>
                  {currentTab?.label}
                </div>
                <div className="text-[10px] md:text-xs truncate" style={{ color: '#92400E' }}>
                  黃色派對 · 06/12 · 林皇宮
                </div>
              </div>
            </div>
            {/* 右：現場模式 + 狀態 */}
            <div className="flex items-center gap-1.5 shrink-0">
              <CountdownBadgeMini target={EVENT_DATETIME} />
              <SaveDot status={saveStatus} />
              <button onClick={() => setLiveMode(true)} className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-white text-xs font-bold shadow-sm active:scale-95 transition" style={{ background: 'linear-gradient(135deg, #DC2626, #EA580C)' }}>
                <Radio className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">現場</span>
              </button>
            </div>
          </div>

          {/* 桌面 Tab 導覽 */}
          <nav className="hidden md:flex gap-1 mt-2 -mb-px overflow-x-auto">
            {tabs.map(({ id, label, icon: Icon }) => {
              const count = id === 'todos' ? todos.length : null;
              return (
                <button key={id} onClick={() => setTab(id)} className="flex items-center gap-2 px-3 py-2 rounded-t-lg text-sm font-medium transition whitespace-nowrap relative"
                  style={{ background: tab === id ? '#F5B800' : 'transparent', color: tab === id ? 'white' : '#78350F', borderBottom: tab === id ? '3px solid #B45309' : '3px solid transparent' }}>
                  <Icon className="w-4 h-4" />{label}
                  {count !== null && count > 0 && (
                    <span className="ml-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-bold" style={{ background: tab === id ? 'white' : '#DC2626', color: tab === id ? '#DC2626' : 'white' }}>{count}</span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </header>

      {/* 手機側邊抽屜選單 */}
      {menuOpen && (
        <div className="fixed inset-0 z-40 md:hidden" onClick={() => setMenuOpen(false)}>
          <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.5)' }}></div>
          <div className="absolute left-0 top-0 bottom-0 w-72 bg-white shadow-2xl flex flex-col" onClick={e => e.stopPropagation()} style={{ animation: 'slideIn 0.2s ease-out' }}>
            <style>{`@keyframes slideIn { from { transform: translateX(-100%); } to { transform: translateX(0); } }`}</style>
            <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: '#FCD34D', background: '#FFFBEA' }}>
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #F5B800, #FF9F1C)' }}>
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="font-bold text-sm" style={{ color: '#1F2937' }}>BNI 富樂 11 週年</div>
                  <div className="text-[10px]" style={{ color: '#92400E' }}>黃色派對籌備</div>
                </div>
              </div>
              <button onClick={() => setMenuOpen(false)} className="p-2 rounded-lg active:bg-yellow-100">
                <X className="w-4 h-4" style={{ color: '#92400E' }} />
              </button>
            </div>
            <nav className="flex-1 overflow-y-auto py-2">
              {tabs.map(({ id, label, icon: Icon }) => {
                const count = id === 'todos' ? todos.length : null;
                return (
                  <button key={id} onClick={() => navigateTo(id)} className="w-full flex items-center justify-between px-4 py-3 text-left transition"
                    style={{ background: tab === id ? '#FEF3C7' : 'transparent', color: tab === id ? '#92400E' : '#1F2937', borderLeft: tab === id ? '4px solid #F5B800' : '4px solid transparent' }}>
                    <div className="flex items-center gap-3">
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {count !== null && count > 0 && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold text-white" style={{ background: '#DC2626' }}>{count}</span>
                      )}
                      <ChevronRight className="w-4 h-4 opacity-40" />
                    </div>
                  </button>
                );
              })}
            </nav>
            <div className="p-3 border-t" style={{ borderColor: '#FEF3C7' }}>
              <button onClick={() => { setShowResetConfirm(true); setMenuOpen(false); }} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-red-600 hover:bg-red-50 transition">
                <RotateCcw className="w-4 h-4" />還原為預設資料
              </button>
              <div className="text-center text-[10px] mt-2" style={{ color: '#92400E', opacity: 0.5 }}>工具 {APP_VERSION}</div>
            </div>
          </div>
        </div>
      )}

      {/* 主內容區 */}
      <main className="max-w-4xl mx-auto px-3 md:px-4 py-4 md:py-6 pb-24 md:pb-8">
        {tab === 'overview' && <OverviewTab flow={flow} calc={calc} registrations={registrations} awards={awards} staff={staff} todos={todos} onNavigate={setTab} />}
        {tab === 'flow' && <FlowTab flow={flow} setFlow={setFlow} />}
        {tab === 'registration' && <RegistrationTab registrations={registrations} setRegistrations={setRegistrations} budget={budget} calc={calc} />}
        {tab === 'awards' && <AwardsTab awards={awards} setAwards={setAwards} />}
        {tab === 'staff' && <StaffTab staff={staff} setStaff={setStaff} />}
        {tab === 'budget' && <BudgetTab budget={budget} setBudget={setBudget} calc={calc} />}
        {tab === 'stats' && <StatsTab budget={budget} calc={calc} scenarios={scenarios} flow={flow} awards={awards} staff={staff} registrations={registrations} />}
        {tab === 'todos' && <TodosTab todos={todos} onNavigate={setTab} />}
      </main>

      {/* 手機底部導覽列（5 個主要） */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-20 bg-white border-t shadow-lg no-print" style={{ borderColor: '#FCD34D', paddingBottom: 'env(safe-area-inset-bottom)' }}>
        <div className="grid grid-cols-5">
          {[
            { id: 'overview', label: '總覽', icon: Home },
            { id: 'flow', label: '流程', icon: Calendar },
            { id: 'registration', label: '報名', icon: ClipboardList },
            { id: 'todos', label: '待辦', icon: ListChecks, badge: todos.length },
            { id: 'stats', label: '統計', icon: BarChart3 },
          ].map(({ id, label, icon: Icon, badge }) => (
            <button key={id} onClick={() => setTab(id)} className="flex flex-col items-center gap-0.5 py-2 relative active:bg-yellow-50 transition"
              style={{ color: tab === id ? '#F5B800' : '#92400E' }}>
              <Icon className="w-5 h-5" strokeWidth={tab === id ? 2.5 : 2} />
              <span className="text-[10px] font-medium">{label}</span>
              {tab === id && <div className="absolute top-0 left-1/4 right-1/4 h-0.5 rounded-full" style={{ background: '#F5B800' }}></div>}
              {badge > 0 && (
                <span className="absolute top-1 right-1/4 px-1 min-w-[16px] h-4 rounded-full text-[9px] font-bold text-white flex items-center justify-center" style={{ background: '#DC2626' }}>{badge}</span>
              )}
            </button>
          ))}
        </div>
      </nav>

      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.5)' }} onClick={() => setShowResetConfirm(false)}>
          <div className="bg-white rounded-2xl p-5 max-w-sm w-full shadow-2xl" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold mb-2">還原為預設資料？</h3>
            <p className="text-sm text-gray-600 mb-4">所有編輯內容會被覆蓋，不可復原。</p>
            <div className="flex gap-2 justify-end">
              <button onClick={() => setShowResetConfirm(false)} className="px-4 py-2 rounded-lg border hover:bg-gray-50">取消</button>
              <button onClick={handleReset} className="px-4 py-2 rounded-lg text-white" style={{ background: '#DC2626' }}>確認</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function CountdownBadgeMini({ target }) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => { const t = setInterval(() => setNow(Date.now()), 60000); return () => clearInterval(t); }, []);
  const diff = target - now;
  if (diff <= 0) return <div className="hidden xs:flex items-center gap-1 text-[10px] px-2 py-1 rounded-md font-bold" style={{ background: '#F5B800', color: 'white' }}>進行中</div>;
  const days = Math.floor(diff / 86400000);
  return <div className="flex items-center gap-1 text-[10px] md:text-xs px-2 py-1 rounded-md font-bold shadow-sm" style={{ background: 'linear-gradient(135deg, #F5B800, #FF9F1C)', color: 'white' }}>
    <Clock className="w-3 h-3" />{days}天
  </div>;
}

function SaveDot({ status }) {
  const color = status === 'saving' ? '#F5B800' : status === 'saved' ? '#10B981' : '#9CA3AF';
  const text = status === 'saving' ? '儲存中' : status === 'saved' ? '已儲存' : '已連線';
  return (
    <div className="hidden sm:flex items-center gap-1 text-[10px] px-2 py-1 rounded-md" style={{ background: '#F9FAFB', color }}>
      <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: color }}></div>
      {text}
    </div>
  );
}

// ============== 總覽（活動全貌） ==============
function OverviewTab({ flow, calc, registrations, awards, staff, todos, onNavigate }) {
  const duration = useMemo(() => {
    if (flow.length === 0) return '—';
    const f = flow[0].time?.split('-')[0] || '';
    const l = flow[flow.length - 1].time?.split('-')[1] || '';
    return `${f} - ${l}`;
  }, [flow]);

  const regStats = useMemo(() => {
    const tp = registrations.reduce((s, r) => s + 1 + (Number(r.companions) || 0), 0);
    const td = registrations.reduce((s, r) => s + (Number(r.fee) || 0) * (1 + (Number(r.companions) || 0)), 0);
    const tpd = registrations.reduce((s, r) => r.paid ? s + (Number(r.fee) || 0) * (1 + (Number(r.companions) || 0)) : s, 0);
    return { totalPeople: tp, totalDue: td, totalPaid: tpd };
  }, [registrations]);

  const awardsFilled = awards.filter(a => a.winner.trim()).length;
  const staffFilled = staff.filter(s => s.name.trim()).length;

  return (
    <div className="space-y-4">
      {/* Hero：活動卡片 */}
      <section className="rounded-2xl p-5 text-white shadow-lg" style={{ background: 'linear-gradient(135deg, #F5B800 0%, #FF9F1C 100%)' }}>
        <div className="flex items-center gap-1.5 mb-1 opacity-90 text-xs">
          <Sparkles className="w-3.5 h-3.5" />BNI 富樂 11 週年
        </div>
        <h2 className="text-2xl font-bold mb-1 leading-tight">黃色派對</h2>
        <p className="text-sm opacity-95">2025/06/12 (六) {duration}</p>
        <p className="text-sm opacity-90">高雄林皇宮 · 內部活動 · 黃色 Dress Code</p>

        <div className="grid grid-cols-3 gap-2 mt-4">
          <div className="bg-white/20 backdrop-blur rounded-lg p-2.5 text-center">
            <div className="text-xs opacity-80">環節</div>
            <div className="text-lg font-bold">{flow.length}</div>
          </div>
          <div className="bg-white/20 backdrop-blur rounded-lg p-2.5 text-center">
            <div className="text-xs opacity-80">報名</div>
            <div className="text-lg font-bold">{regStats.totalPeople}</div>
          </div>
          <div className="bg-white/20 backdrop-blur rounded-lg p-2.5 text-center">
            <div className="text-xs opacity-80">預估支出</div>
            <div className="text-lg font-bold">${fmt(calc.expTotal).replace(/\d{3}$/, 'k')}</div>
          </div>
        </div>
      </section>

      {/* 待辦提醒（如果有） */}
      {todos.length > 0 && (
        <button onClick={() => onNavigate('todos')} className="w-full bg-white rounded-2xl p-4 shadow-sm border-2 text-left active:scale-[0.98] transition" style={{ borderColor: '#F59E0B' }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: '#FEF3C7' }}>
                <AlertCircle className="w-5 h-5" style={{ color: '#D97706' }} />
              </div>
              <div>
                <div className="font-bold text-sm" style={{ color: '#92400E' }}>還有 {todos.length} 項待辦</div>
                <div className="text-xs" style={{ color: '#B45309' }}>
                  {todos.filter(t => t.priority === 'high').length > 0 && `${todos.filter(t => t.priority === 'high').length} 項高優先　`}
                  點擊查看詳情
                </div>
              </div>
            </div>
            <ChevronRight className="w-5 h-5" style={{ color: '#92400E' }} />
          </div>
        </button>
      )}

      {/* 完整活動流程時間軸 */}
      <section className="bg-white rounded-2xl shadow-sm border overflow-hidden" style={{ borderColor: '#FCD34D' }}>
        <div className="px-4 py-3 border-b flex items-center justify-between" style={{ borderColor: '#FEF3C7', background: '#FFFBEA' }}>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" style={{ color: '#F5B800' }} />
            <h3 className="font-bold text-sm" style={{ color: '#1F2937' }}>活動流程</h3>
            <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: '#F5B800', color: 'white' }}>{flow.length}</span>
          </div>
          <button onClick={() => onNavigate('flow')} className="text-xs font-medium px-2 py-1 rounded-md hover:bg-yellow-100 transition" style={{ color: '#92400E' }}>
            編輯 →
          </button>
        </div>
        <div className="divide-y" style={{ borderColor: '#FEF3C7' }}>
          {flow.map((row, idx) => <TimelineRow key={row.id} row={row} idx={idx} awards={awards} />)}
        </div>
      </section>

      {/* 彙整資訊卡片群 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* 得獎名單 */}
        <button onClick={() => onNavigate('awards')} className="bg-white rounded-2xl p-4 shadow-sm border text-left active:scale-[0.98] transition" style={{ borderColor: '#FCD34D' }}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Trophy className="w-4 h-4" style={{ color: '#F5B800' }} />
              <h3 className="font-bold text-sm">得獎名單</h3>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </div>
          <div className="text-2xl font-bold mb-1" style={{ color: '#92400E' }}>{awardsFilled} / {awards.length}</div>
          <div className="h-1.5 rounded-full overflow-hidden" style={{ background: '#FEF3C7' }}>
            <div className="h-full" style={{ width: `${awards.length > 0 ? (awardsFilled / awards.length * 100) : 0}%`, background: 'linear-gradient(90deg, #F5B800, #FF9F1C)' }}></div>
          </div>
          <div className="text-xs mt-1.5 text-gray-500">{awardsFilled === awards.length ? '✓ 全部填寫完成' : `還有 ${awards.length - awardsFilled} 位待確認`}</div>
        </button>

        {/* 工作分工 */}
        <button onClick={() => onNavigate('staff')} className="bg-white rounded-2xl p-4 shadow-sm border text-left active:scale-[0.98] transition" style={{ borderColor: '#FCD34D' }}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <UserCheck className="w-4 h-4" style={{ color: '#F5B800' }} />
              <h3 className="font-bold text-sm">工作分工</h3>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </div>
          <div className="text-2xl font-bold mb-1" style={{ color: '#92400E' }}>{staffFilled} / {staff.length}</div>
          <div className="h-1.5 rounded-full overflow-hidden" style={{ background: '#FEF3C7' }}>
            <div className="h-full" style={{ width: `${staff.length > 0 ? (staffFilled / staff.length * 100) : 0}%`, background: 'linear-gradient(90deg, #F5B800, #FF9F1C)' }}></div>
          </div>
          <div className="text-xs mt-1.5 text-gray-500">{staffFilled === staff.length ? '✓ 全部分派完成' : `還有 ${staff.length - staffFilled} 個角色待指派`}</div>
        </button>

        {/* 報名繳費 */}
        <button onClick={() => onNavigate('registration')} className="bg-white rounded-2xl p-4 shadow-sm border text-left active:scale-[0.98] transition" style={{ borderColor: '#FCD34D' }}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <ClipboardList className="w-4 h-4" style={{ color: '#F5B800' }} />
              <h3 className="font-bold text-sm">報名繳費</h3>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </div>
          <div className="text-2xl font-bold mb-1" style={{ color: '#0891B2' }}>{regStats.totalPeople} <span className="text-sm font-normal text-gray-500">人</span></div>
          <div className="flex justify-between text-xs">
            <span className="text-gray-500">已收 ${fmt(regStats.totalPaid)}</span>
            <span className="text-gray-500">/ ${fmt(regStats.totalDue)}</span>
          </div>
          <div className="h-1.5 rounded-full overflow-hidden mt-1.5" style={{ background: '#FEF3C7' }}>
            <div className="h-full" style={{ width: `${regStats.totalDue > 0 ? (regStats.totalPaid / regStats.totalDue * 100) : 0}%`, background: 'linear-gradient(90deg, #10B981, #059669)' }}></div>
          </div>
        </button>

        {/* 預算 */}
        <button onClick={() => onNavigate('budget')} className="bg-white rounded-2xl p-4 shadow-sm border text-left active:scale-[0.98] transition" style={{ borderColor: '#FCD34D' }}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4" style={{ color: '#F5B800' }} />
              <h3 className="font-bold text-sm">預算結算</h3>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </div>
          <div className="text-2xl font-bold mb-0.5" style={{ color: calc.balance >= 0 ? '#059669' : '#DC2626' }}>
            {calc.balance >= 0 ? '+' : ''}${fmt(calc.balance)}
          </div>
          <div className="text-xs text-gray-500">
            {calc.balance >= 0 ? '✓ 補貼後結餘' : '⚠ 超出上限'}
          </div>
        </button>
      </div>
    </div>
  );
}

// 時間軸單項
function TimelineRow({ row, idx, awards }) {
  const [expanded, setExpanded] = useState(false);
  // 嘗試從 awards 找到對應此環節的得獎者
  const relatedAwards = useMemo(() => {
    if (row.title.includes('業績')) return awards.filter(a => a.category === '業績類' && a.winner.trim());
    if (row.title.includes('全勤')) return awards.filter(a => a.category === '全勤獎' && a.winner.trim());
    if (row.title.includes('金拖鞋')) return awards.filter(a => a.category === '金拖鞋獎' && a.winner.trim());
    if (row.title.includes('走秀')) return awards.filter(a => a.category === '造型走秀' && a.winner.trim());
    return [];
  }, [row, awards]);

  return (
    <div className="active:bg-yellow-50/50 transition">
      <button onClick={() => setExpanded(!expanded)} className="w-full flex items-start gap-3 p-3 text-left">
        {/* 時間 + 編號 */}
        <div className="shrink-0 w-16 text-center">
          <div className="text-[10px] text-gray-400 font-bold">#{idx + 1}</div>
          <div className="text-xs font-mono font-bold leading-tight" style={{ color: '#92400E' }}>{row.time.split('-')[0]}</div>
          <div className="text-[10px] font-mono text-gray-400 leading-tight">{row.time.split('-')[1]}</div>
        </div>
        {/* 內容 */}
        <div className="flex-1 min-w-0">
          <div className="font-bold text-sm mb-0.5" style={{ color: '#1F2937' }}>{row.title}</div>
          {row.detail && !expanded && (
            <div className="text-xs text-gray-500 line-clamp-1">{row.detail.split('\n')[0]}</div>
          )}
          {row.music && !expanded && (
            <div className="flex items-center gap-1 mt-1">
              <Volume2 className="w-3 h-3 text-purple-400" />
              <span className="text-[10px] text-purple-500">{row.music}</span>
            </div>
          )}
          {expanded && (
            <div className="mt-2 space-y-2">
              {row.detail && (
                <div className="text-xs text-gray-600 whitespace-pre-wrap leading-relaxed p-2 rounded bg-gray-50">{row.detail}</div>
              )}
              {row.music && (
                <div className="flex items-center gap-1.5 text-xs" style={{ color: '#7C3AED' }}>
                  <Volume2 className="w-3.5 h-3.5" />{row.music}
                </div>
              )}
              {row.note && (
                <div className="text-xs text-green-700 bg-green-50 rounded p-2">
                  <span className="font-medium">備註：</span>{row.note}
                </div>
              )}
              {relatedAwards.length > 0 && (
                <div className="mt-2 pt-2 border-t" style={{ borderColor: '#FEF3C7' }}>
                  <div className="text-[10px] font-bold mb-1" style={{ color: '#92400E' }}>本環節頒獎</div>
                  <div className="space-y-1">
                    {relatedAwards.map((a, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs">
                        <Award className="w-3 h-3 shrink-0" style={{ color: '#F5B800' }} />
                        <span className="text-gray-600">{a.name}：</span>
                        <span className="font-bold" style={{ color: '#92400E' }}>{a.winner}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        {/* 展開指示 */}
        <ChevronRight className="w-4 h-4 shrink-0 text-gray-400 mt-1 transition-transform" style={{ transform: expanded ? 'rotate(90deg)' : 'none' }} />
      </button>
    </div>
  );
}

// ============== 待辦分頁 ==============
function TodosTab({ todos, onNavigate }) {
  const byCategory = useMemo(() => {
    const m = {};
    todos.forEach(t => { if (!m[t.category]) m[t.category] = []; m[t.category].push(t); });
    return m;
  }, [todos]);

  const categoryColors = {
    '預算': { bg: '#FEE2E2', border: '#EF4444', text: '#991B1B', icon: DollarSign },
    '分工': { bg: '#DBEAFE', border: '#3B82F6', text: '#1E40AF', icon: UserCheck },
    '得獎': { bg: '#FEF3C7', border: '#F59E0B', text: '#92400E', icon: Award },
    '繳費': { bg: '#D1FAE5', border: '#10B981', text: '#065F46', icon: CircleDollarSign },
    '報名': { bg: '#E0E7FF', border: '#6366F1', text: '#3730A3', icon: ClipboardList },
  };

  if (todos.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-8 md:p-12 shadow-sm border text-center" style={{ borderColor: '#FCD34D' }}>
        <div className="w-16 h-16 mx-auto mb-3 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #D1FAE5, #A7F3D0)' }}>
          <CheckCircle2 className="w-8 h-8" style={{ color: '#059669' }} />
        </div>
        <h3 className="text-xl font-bold mb-1" style={{ color: '#059669' }}>全部完成！</h3>
        <p className="text-sm text-gray-600">所有籌備項目都已就緒，準備迎接黃色派對 🎉</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl p-4 shadow-sm border" style={{ borderColor: '#FCD34D' }}>
        <div className="flex items-center gap-2 mb-1">
          <ListChecks className="w-5 h-5" style={{ color: '#F5B800' }} />
          <h2 className="text-xl font-bold">待辦事項</h2>
        </div>
        <p className="text-sm text-gray-600">共 {todos.length} 項需處理，高優先 <b style={{ color: '#DC2626' }}>{todos.filter(t => t.priority === 'high').length}</b> 項</p>
      </div>

      {Object.entries(byCategory).map(([cat, items]) => {
        const c = categoryColors[cat] || { bg: '#F3F4F6', border: '#9CA3AF', text: '#374151', icon: AlertCircle };
        const Icon = c.icon;
        return (
          <section key={cat} className="bg-white rounded-2xl shadow-sm border overflow-hidden" style={{ borderColor: c.border }}>
            <div className="px-4 py-2.5 flex items-center justify-between" style={{ background: c.bg }}>
              <div className="flex items-center gap-2">
                <Icon className="w-4 h-4" style={{ color: c.text }} />
                <h3 className="font-bold text-sm" style={{ color: c.text }}>{cat}</h3>
                <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'white', color: c.text }}>{items.length}</span>
              </div>
            </div>
            <div className="divide-y" style={{ borderColor: '#F3F4F6' }}>
              {items.map(t => (
                <button key={t.id} onClick={() => onNavigate(t.goTo)} className="w-full flex items-center gap-3 p-3 text-left active:bg-gray-50 transition">
                  <div className="w-2 h-2 rounded-full shrink-0" style={{ background: t.priority === 'high' ? '#DC2626' : '#F5B800' }}></div>
                  <div className="flex-1 text-sm">{t.task}</div>
                  <ChevronRight className="w-4 h-4 text-gray-400 shrink-0" />
                </button>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}

// ============== 流程分頁（卡片式） ==============
function FlowTab({ flow, setFlow }) {
  const [draggedId, setDraggedId] = useState(null);
  const [dragOverId, setDragOverId] = useState(null);
  const [editingId, setEditingId] = useState(null);

  const updateRow = (id, f, v) => setFlow(flow.map(r => r.id === id ? { ...r, [f]: v } : r));
  const addRow = (id) => {
    const i = flow.findIndex(r => r.id === id);
    const newRow = { id: Date.now(), time: "", title: "新環節", detail: "", music: "", note: "" };
    setFlow([...flow.slice(0, i + 1), newRow, ...flow.slice(i + 1)]);
    setEditingId(newRow.id);
  };
  const removeRow = (id) => flow.length > 1 && setFlow(flow.filter(r => r.id !== id));
  const moveUp = (id) => { const i = flow.findIndex(r => r.id === id); if (i > 0) { const n = [...flow]; [n[i-1], n[i]] = [n[i], n[i-1]]; setFlow(n); } };
  const moveDown = (id) => { const i = flow.findIndex(r => r.id === id); if (i < flow.length - 1) { const n = [...flow]; [n[i], n[i+1]] = [n[i+1], n[i]]; setFlow(n); } };

  const exportWord = () => {
    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>流程</title><style>body{font-family:"微軟正黑體",sans-serif;padding:20px}h1{color:#F5B800;text-align:center}table{width:100%;border-collapse:collapse}th{background:#F5B800;color:white;padding:10px;border:1px solid #ccc}td{padding:10px;border:1px solid #ccc;vertical-align:top;white-space:pre-wrap}tr:nth-child(even){background:#FFFBEA}</style></head><body><h1>2025/06/12 BNI 富樂 11 週年黃色派對 晚宴流程</h1><table><thead><tr><th>時間</th><th>內容</th><th>細節</th><th>音樂</th><th>備註</th></tr></thead><tbody>${flow.map(r => `<tr><td>${r.time}</td><td><b>【${r.title}】</b></td><td>${r.detail}</td><td>${r.music}</td><td>${r.note}</td></tr>`).join('')}</tbody></table></body></html>`;
    const b = new Blob(['\ufeff', html], { type: 'application/msword' });
    const u = URL.createObjectURL(b); const a = document.createElement('a');
    a.href = u; a.download = '11週年黃色派對_流程表.doc'; a.click();
    URL.revokeObjectURL(u);
  };

  return (
    <div>
      {/* 頂部工具列 */}
      <div className="flex items-center justify-between mb-3 gap-2">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5" style={{ color: '#F5B800' }} />
          <h2 className="text-lg font-bold">晚宴流程</h2>
          <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: '#FEF3C7', color: '#92400E' }}>{flow.length}</span>
        </div>
        <button onClick={exportWord} className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-white text-xs font-medium shadow-sm active:scale-95 transition" style={{ background: 'linear-gradient(135deg, #F5B800, #FF9F1C)' }}>
          <Download className="w-3.5 h-3.5" />Word
        </button>
      </div>
      <div className="text-xs mb-3 px-3 py-2 rounded-lg" style={{ background: '#DBEAFE', color: '#1E40AF' }}>
        💡 點擊卡片展開編輯，拖曳 <GripVertical className="w-3 h-3 inline" /> 可調整順序
      </div>

      <div className="space-y-2">
        {flow.map((row, idx) => (
          <FlowCard key={row.id} row={row} idx={idx} total={flow.length}
            isEditing={editingId === row.id}
            isDragging={draggedId === row.id}
            isDragOver={dragOverId === row.id}
            onToggleEdit={() => setEditingId(editingId === row.id ? null : row.id)}
            onUpdate={updateRow} onAdd={addRow} onRemove={removeRow} onMoveUp={moveUp} onMoveDown={moveDown}
            onDragStart={(e) => { setDraggedId(row.id); e.dataTransfer.effectAllowed = 'move'; }}
            onDragOver={(e) => { e.preventDefault(); if (row.id !== draggedId) setDragOverId(row.id); }}
            onDragLeave={() => setDragOverId(null)}
            onDrop={(e) => {
              e.preventDefault();
              if (!draggedId || draggedId === row.id) { setDraggedId(null); setDragOverId(null); return; }
              const di = flow.findIndex(r => r.id === draggedId);
              const ti = flow.findIndex(r => r.id === row.id);
              const n = [...flow]; const [m] = n.splice(di, 1); n.splice(ti, 0, m);
              setFlow(n); setDraggedId(null); setDragOverId(null);
            }}
            onDragEnd={() => { setDraggedId(null); setDragOverId(null); }}
          />
        ))}
      </div>
    </div>
  );
}

function FlowCard({ row, idx, total, isEditing, isDragging, isDragOver, onToggleEdit, onUpdate, onAdd, onRemove, onMoveUp, onMoveDown, onDragStart, onDragOver, onDragLeave, onDrop, onDragEnd }) {
  return (
    <div draggable
      onDragStart={onDragStart} onDragOver={onDragOver} onDragLeave={onDragLeave} onDrop={onDrop} onDragEnd={onDragEnd}
      className="bg-white rounded-xl shadow-sm border transition"
      style={{ borderColor: isDragOver ? '#F5B800' : '#FCD34D', borderWidth: isDragOver ? 2 : 1, opacity: isDragging ? 0.4 : 1, boxShadow: isDragOver ? '0 8px 16px -4px rgba(245, 184, 0, 0.3)' : undefined }}>
      {/* 摘要列 */}
      <button onClick={onToggleEdit} className="w-full flex items-start gap-2 p-3 text-left active:bg-yellow-50/50 transition">
        <div className="flex flex-col items-center cursor-grab active:cursor-grabbing pt-0.5 shrink-0">
          <GripVertical className="w-4 h-4" style={{ color: '#92400E' }} />
          <div className="text-[10px] mt-0.5 font-bold" style={{ color: '#92400E' }}>{idx + 1}</div>
        </div>
        <div className="shrink-0 w-14 text-center">
          <div className="text-[10px] font-mono text-gray-400 leading-tight">{row.time.split('-')[0]}</div>
          <div className="text-[10px] font-mono text-gray-400 leading-tight">{row.time.split('-')[1]}</div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-bold text-sm truncate" style={{ color: '#1F2937' }}>{row.title || '(未命名)'}</div>
          {!isEditing && row.detail && <div className="text-xs text-gray-500 line-clamp-1 mt-0.5">{row.detail.split('\n')[0]}</div>}
        </div>
        <ChevronRight className="w-4 h-4 shrink-0 text-gray-400 transition-transform mt-1" style={{ transform: isEditing ? 'rotate(90deg)' : 'none' }} />
      </button>

      {/* 展開編輯區 */}
      {isEditing && (
        <div className="border-t" style={{ borderColor: '#FEF3C7' }}>
          <div className="p-3 space-y-3" style={{ background: '#FFFEF7' }}>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] font-bold uppercase" style={{ color: '#92400E' }}>時間</label>
                <input value={row.time} onChange={e => onUpdate(row.id, 'time', e.target.value)} placeholder="18:40-18:43" className="w-full mt-0.5 px-2 py-1.5 rounded-lg border text-sm outline-none focus:border-yellow-400" style={{ borderColor: '#FCD34D' }} />
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase" style={{ color: '#92400E' }}>環節</label>
                <input value={row.title} onChange={e => onUpdate(row.id, 'title', e.target.value)} placeholder="名稱" className="w-full mt-0.5 px-2 py-1.5 rounded-lg border text-sm outline-none focus:border-yellow-400" style={{ borderColor: '#FCD34D' }} />
              </div>
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase" style={{ color: '#92400E' }}>細節</label>
              <textarea value={row.detail} onChange={e => onUpdate(row.id, 'detail', e.target.value)} placeholder="細節安排及人員" rows={Math.max(3, row.detail.split('\n').length)} className="w-full mt-0.5 px-2 py-1.5 rounded-lg border text-sm outline-none focus:border-yellow-400 resize-none" style={{ borderColor: '#FCD34D' }} />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] font-bold uppercase" style={{ color: '#92400E' }}>音樂</label>
                <textarea value={row.music} onChange={e => onUpdate(row.id, 'music', e.target.value)} placeholder="音樂" rows={2} className="w-full mt-0.5 px-2 py-1.5 rounded-lg border text-sm outline-none focus:border-yellow-400 resize-none" style={{ borderColor: '#FCD34D' }} />
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase" style={{ color: '#92400E' }}>備註</label>
                <textarea value={row.note} onChange={e => onUpdate(row.id, 'note', e.target.value)} placeholder="備註 / 負責人" rows={2} className="w-full mt-0.5 px-2 py-1.5 rounded-lg border text-sm outline-none focus:border-yellow-400 resize-none" style={{ borderColor: '#FCD34D' }} />
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-1 px-2 py-2 border-t" style={{ borderColor: '#FEF3C7', background: '#FFFBEA' }}>
            <button onClick={() => onMoveUp(row.id)} disabled={idx === 0} className="p-2 rounded-lg hover:bg-yellow-100 active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed transition" aria-label="上移">
              <ChevronUp className="w-4 h-4" style={{ color: '#92400E' }} />
            </button>
            <button onClick={() => onMoveDown(row.id)} disabled={idx === total - 1} className="p-2 rounded-lg hover:bg-yellow-100 active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed transition" aria-label="下移">
              <ChevronDown className="w-4 h-4" style={{ color: '#92400E' }} />
            </button>
            <div className="flex-1"></div>
            <button onClick={() => onAdd(row.id)} className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-yellow-100 active:scale-95 transition" style={{ color: '#92400E' }}>
              <Plus className="w-3.5 h-3.5" />新增環節
            </button>
            {total > 1 && (
              <button onClick={() => { if (confirm(`確定刪除「${row.title}」？`)) onRemove(row.id); }} className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-red-50 active:scale-95 transition" style={{ color: '#DC2626' }}>
                <Trash2 className="w-3.5 h-3.5" />刪除
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ============== 報名繳費（卡片式） ==============
function RegistrationTab({ registrations, setRegistrations, budget, calc }) {
  const [bulk, setBulk] = useState('');
  const [showBulk, setShowBulk] = useState(false);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all'); // all | paid | unpaid

  const up = (id, f, v) => setRegistrations(registrations.map(r => r.id === id ? { ...r, [f]: v } : r));
  const add = () => {
    const newReg = { id: Date.now(), name: "", companions: 0, fee: budget.assumptions.perPerson, paid: false, note: "" };
    setRegistrations([newReg, ...registrations]);
  };
  const rm = (id) => setRegistrations(registrations.filter(r => r.id !== id));
  const togAll = (s) => setRegistrations(registrations.map(r => ({ ...r, paid: s })));

  const handleBulk = () => {
    const names = bulk.split(/[\n,，、]/).map(n => n.trim()).filter(Boolean);
    const news = names.map((name, i) => ({ id: Date.now() + i, name, companions: 0, fee: budget.assumptions.perPerson, paid: false, note: "" }));
    setRegistrations([...news, ...registrations]);
    setBulk(''); setShowBulk(false);
  };

  const stats = useMemo(() => {
    const tp = registrations.reduce((s, r) => s + 1 + (Number(r.companions) || 0), 0);
    const td = registrations.reduce((s, r) => s + (Number(r.fee) || 0) * (1 + (Number(r.companions) || 0)), 0);
    const tpd = registrations.reduce((s, r) => r.paid ? s + (Number(r.fee) || 0) * (1 + (Number(r.companions) || 0)) : s, 0);
    const pc = registrations.filter(r => r.paid).length;
    return { totalPeople: tp, totalDue: td, totalPaid: tpd, unpaid: td - tpd, paidCount: pc, unpaidCount: registrations.length - pc };
  }, [registrations]);

  const splitCalc = useMemo(() => {
    const c = budget.assumptions;
    const supposed = stats.totalDue + c.subsidyCap;
    const shortfall = Math.max(0, calc.expTotal - supposed);
    const extra = stats.totalPeople > 0 ? Math.ceil(shortfall / stats.totalPeople / 100) * 100 : 0;
    return { shortfall, extra };
  }, [stats, budget.assumptions, calc.expTotal]);

  const filtered = useMemo(() => {
    return registrations.filter(r => {
      if (filter === 'paid' && !r.paid) return false;
      if (filter === 'unpaid' && r.paid) return false;
      if (search && !r.name.includes(search) && !r.note.includes(search)) return false;
      return true;
    });
  }, [registrations, filter, search]);

  const exportExcel = () => {
    const rows = [
      ['11週年黃色派對 報名繳費明細'], [`匯出時間：${new Date().toLocaleString('zh-TW')}`], [],
      ['序', '姓名', '攜伴', '總人', '單價', '應繳', '已繳', '備註'],
      ...registrations.map((r, i) => { const f = Number(r.fee) || 0, c = Number(r.companions) || 0; return [i + 1, r.name, c, 1 + c, f, f * (1 + c), r.paid ? '✓' : '', r.note]; }),
      [], ['總人數', stats.totalPeople], ['應收', stats.totalDue], ['已收', stats.totalPaid], ['未收', stats.unpaid],
    ];
    const t = rows.map(r => r.map(x => x ?? '').join('\t')).join('\n');
    const b = new Blob(['\ufeff' + t], { type: 'application/vnd.ms-excel;charset=utf-8' });
    const u = URL.createObjectURL(b); const a = document.createElement('a');
    a.href = u; a.download = '11週年_報名繳費.xls'; a.click();
    URL.revokeObjectURL(u);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <ClipboardList className="w-5 h-5" style={{ color: '#F5B800' }} />
          <h2 className="text-lg font-bold">報名繳費</h2>
          <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: '#FEF3C7', color: '#92400E' }}>{registrations.length}</span>
        </div>
        <button onClick={exportExcel} className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-white text-xs font-medium shadow-sm active:scale-95 transition" style={{ background: 'linear-gradient(135deg, #F5B800, #FF9F1C)' }}>
          <Download className="w-3.5 h-3.5" />Excel
        </button>
      </div>

      {/* 統計卡（2x2） */}
      <div className="grid grid-cols-2 gap-2">
        <div className="bg-white rounded-xl p-3 shadow-sm border" style={{ borderColor: '#FCD34D' }}>
          <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase" style={{ color: '#0891B2' }}>
            <Users className="w-3 h-3" />報名人數
          </div>
          <div className="text-2xl font-bold mt-0.5" style={{ color: '#0891B2' }}>{stats.totalPeople}</div>
          <div className="text-[10px] text-gray-500">含 {stats.totalPeople - registrations.length} 攜伴</div>
        </div>
        <div className="bg-white rounded-xl p-3 shadow-sm border" style={{ borderColor: '#FCD34D' }}>
          <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase" style={{ color: '#F5B800' }}>
            <CircleDollarSign className="w-3 h-3" />應收
          </div>
          <div className="text-2xl font-bold mt-0.5" style={{ color: '#F5B800' }}>${fmt(stats.totalDue)}</div>
        </div>
        <div className="bg-white rounded-xl p-3 shadow-sm border-2" style={{ borderColor: '#10B981' }}>
          <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase" style={{ color: '#059669' }}>
            <CheckCircle2 className="w-3 h-3" />已收
          </div>
          <div className="text-2xl font-bold mt-0.5" style={{ color: '#059669' }}>${fmt(stats.totalPaid)}</div>
          <div className="text-[10px] text-gray-500">{stats.paidCount} 位</div>
        </div>
        <div className="bg-white rounded-xl p-3 shadow-sm border-2" style={{ borderColor: '#DC2626' }}>
          <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase" style={{ color: '#DC2626' }}>
            <Circle className="w-3 h-3" />未收
          </div>
          <div className="text-2xl font-bold mt-0.5" style={{ color: '#DC2626' }}>${fmt(stats.unpaid)}</div>
          <div className="text-[10px] text-gray-500">{stats.unpaidCount} 位待催</div>
        </div>
      </div>

      {/* 分攤警示 */}
      {splitCalc.shortfall > 0 && (
        <div className="rounded-xl p-3 border-2" style={{ borderColor: '#F59E0B', background: 'linear-gradient(135deg, #FEF3C7, #FDE68A)' }}>
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" style={{ color: '#D97706' }} />
            <div className="flex-1 text-xs">
              <div className="font-bold mb-1" style={{ color: '#92400E' }}>經費尚缺 ${fmt(splitCalc.shortfall)}</div>
              <div style={{ color: '#78350F' }}>建議每人加收 <b style={{ color: '#DC2626' }}>+${fmt(splitCalc.extra)}</b></div>
            </div>
          </div>
        </div>
      )}

      {/* 操作列 */}
      <div className="flex gap-2 flex-wrap">
        <button onClick={add} className="flex-1 flex items-center justify-center gap-1 px-3 py-2.5 rounded-xl text-sm font-bold text-white shadow-sm active:scale-95 transition" style={{ background: 'linear-gradient(135deg, #F5B800, #FF9F1C)' }}>
          <Plus className="w-4 h-4" />新增報名
        </button>
        <button onClick={() => setShowBulk(!showBulk)} className="px-3 py-2.5 rounded-xl text-sm font-medium border active:scale-95 transition" style={{ borderColor: '#F5B800', color: '#92400E' }}>
          批次
        </button>
      </div>

      {showBulk && (
        <div className="bg-white rounded-xl p-3 border" style={{ borderColor: '#FCD34D' }}>
          <textarea value={bulk} onChange={e => setBulk(e.target.value)} placeholder="一行一個名字，或用逗號分隔" rows={3} className="w-full px-2 py-1.5 rounded-lg border text-sm outline-none focus:border-yellow-400" style={{ borderColor: '#FCD34D' }} />
          <div className="flex gap-2 mt-2">
            <button onClick={handleBulk} disabled={!bulk.trim()} className="flex-1 px-3 py-2 rounded-lg text-white text-sm font-bold disabled:opacity-40 active:scale-95 transition" style={{ background: 'linear-gradient(135deg, #F5B800, #FF9F1C)' }}>加入</button>
            <button onClick={() => { setShowBulk(false); setBulk(''); }} className="px-3 py-2 rounded-lg text-sm border" style={{ borderColor: '#E5E7EB' }}>取消</button>
          </div>
        </div>
      )}

      {/* 搜尋 + 過濾 */}
      {registrations.length > 0 && (
        <>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="搜尋姓名或備註" className="w-full pl-9 pr-3 py-2 rounded-xl border text-sm outline-none focus:border-yellow-400" style={{ borderColor: '#FCD34D', background: 'white' }} />
          </div>
          <div className="flex gap-1 overflow-x-auto">
            {[
              { id: 'all', label: `全部 (${registrations.length})` },
              { id: 'paid', label: `✓ 已繳 (${stats.paidCount})` },
              { id: 'unpaid', label: `⏳ 未繳 (${stats.unpaidCount})` },
            ].map(f => (
              <button key={f.id} onClick={() => setFilter(f.id)} className="shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition"
                style={{ background: filter === f.id ? '#F5B800' : 'white', color: filter === f.id ? 'white' : '#92400E', border: `1px solid ${filter === f.id ? '#F5B800' : '#FCD34D'}` }}>
                {f.label}
              </button>
            ))}
            <div className="flex-1"></div>
            <button onClick={() => togAll(true)} className="shrink-0 text-[10px] px-2 py-1.5 rounded-full" style={{ color: '#059669' }}>全已繳</button>
            <button onClick={() => togAll(false)} className="shrink-0 text-[10px] px-2 py-1.5 rounded-full" style={{ color: '#DC2626' }}>全未繳</button>
          </div>
        </>
      )}

      {/* 報名卡片列表 */}
      {registrations.length === 0 ? (
        <div className="bg-white rounded-2xl p-8 text-center border" style={{ borderColor: '#FCD34D' }}>
          <ClipboardList className="w-12 h-12 mx-auto mb-2 opacity-30" style={{ color: '#92400E' }} />
          <div className="text-sm text-gray-500 mb-3">尚未有報名記錄</div>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-xl p-6 text-center border" style={{ borderColor: '#FCD34D' }}>
          <div className="text-sm text-gray-500">沒有符合條件的項目</div>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((r, idx) => <RegCard key={r.id} reg={r} onUpdate={up} onRemove={rm} />)}
        </div>
      )}
    </div>
  );
}

function RegCard({ reg, onUpdate, onRemove }) {
  const [expanded, setExpanded] = useState(false);
  const fee = Number(reg.fee) || 0;
  const comp = Number(reg.companions) || 0;
  const total = fee * (1 + comp);

  return (
    <div className="bg-white rounded-xl shadow-sm border transition" style={{ borderColor: reg.paid ? '#10B981' : '#FCD34D', borderWidth: reg.paid ? 2 : 1 }}>
      <div className="flex items-center gap-2 p-3">
        {/* 繳費勾選（大按鈕） */}
        <button onClick={() => onUpdate(reg.id, 'paid', !reg.paid)} className="shrink-0 p-1 active:scale-90 transition" aria-label={reg.paid ? '已繳' : '未繳'}>
          {reg.paid
            ? <CheckCircle2 className="w-8 h-8" style={{ color: '#059669' }} />
            : <Circle className="w-8 h-8" style={{ color: '#D1D5DB' }} />
          }
        </button>
        <button onClick={() => setExpanded(!expanded)} className="flex-1 text-left min-w-0 active:bg-gray-50/50 rounded-lg p-1 -m-1 transition">
          <input value={reg.name} onChange={e => onUpdate(reg.id, 'name', e.target.value)} onClick={e => e.stopPropagation()} placeholder="姓名" className="w-full font-bold bg-transparent outline-none border-b border-transparent focus:border-yellow-400 transition" style={{ color: '#1F2937' }} />
          <div className="flex items-center gap-3 text-xs mt-0.5">
            <span className="text-gray-500">{1 + comp} 人</span>
            <span className="font-bold" style={{ color: reg.paid ? '#059669' : '#92400E' }}>${fmt(total)}</span>
            {reg.note && <span className="text-gray-400 truncate">· {reg.note}</span>}
          </div>
        </button>
        <button onClick={() => setExpanded(!expanded)} className="shrink-0 p-1">
          <ChevronRight className="w-4 h-4 text-gray-400 transition-transform" style={{ transform: expanded ? 'rotate(90deg)' : 'none' }} />
        </button>
      </div>

      {expanded && (
        <div className="border-t p-3 space-y-2" style={{ borderColor: '#FEF3C7', background: '#FFFEF7' }}>
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="text-[10px] font-bold uppercase" style={{ color: '#92400E' }}>攜伴</label>
              <input type="number" min="0" value={reg.companions} onChange={e => onUpdate(reg.id, 'companions', e.target.value)} className="w-full mt-0.5 px-2 py-1.5 rounded-lg border text-sm text-center outline-none focus:border-yellow-400" style={{ borderColor: '#FCD34D' }} />
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase" style={{ color: '#92400E' }}>單價</label>
              <input type="number" value={reg.fee} onChange={e => onUpdate(reg.id, 'fee', e.target.value)} className="w-full mt-0.5 px-2 py-1.5 rounded-lg border text-sm text-right outline-none focus:border-yellow-400" style={{ borderColor: '#FCD34D' }} />
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase" style={{ color: '#92400E' }}>總計</label>
              <div className="mt-0.5 px-2 py-1.5 rounded-lg text-sm text-right font-bold" style={{ background: '#FEF3C7', color: '#92400E' }}>{fmt(total)}</div>
            </div>
          </div>
          <div>
            <label className="text-[10px] font-bold uppercase" style={{ color: '#92400E' }}>備註</label>
            <input value={reg.note} onChange={e => onUpdate(reg.id, 'note', e.target.value)} placeholder="如：匯款、現金、桌號" className="w-full mt-0.5 px-2 py-1.5 rounded-lg border text-sm outline-none focus:border-yellow-400" style={{ borderColor: '#FCD34D' }} />
          </div>
          <button onClick={() => { if (confirm(`確定刪除「${reg.name || '此筆'}」？`)) onRemove(reg.id); }} className="flex items-center gap-1 text-xs font-medium px-2 py-1 rounded hover:bg-red-50 transition" style={{ color: '#DC2626' }}>
            <Trash2 className="w-3 h-3" />刪除此筆
          </button>
        </div>
      )}
    </div>
  );
}

// ============== 得獎名單（卡片式） ==============
function AwardsTab({ awards, setAwards }) {
  const up = (i, f, v) => setAwards(awards.map((a, x) => x === i ? { ...a, [f]: v } : a));
  const add = (cat) => setAwards([...awards, { category: cat, name: "新獎項", winner: "", note: "" }]);
  const rm = (i) => setAwards(awards.filter((_, x) => x !== i));

  const grouped = useMemo(() => {
    const m = {};
    awards.forEach((a, i) => { if (!m[a.category]) m[a.category] = []; m[a.category].push({ ...a, _idx: i }); });
    const o = {};
    AWARD_CATEGORY_ORDER.forEach(c => { if (m[c]) o[c] = m[c]; });
    Object.keys(m).forEach(c => { if (!o[c]) o[c] = m[c]; });
    return o;
  }, [awards]);

  const colors = {
    '造型走秀': { bg: '#FEF3C7', border: '#F59E0B', text: '#92400E' },
    '業績類': { bg: '#DBEAFE', border: '#3B82F6', text: '#1E40AF' },
    '全勤獎': { bg: '#D1FAE5', border: '#10B981', text: '#065F46' },
    '金拖鞋獎': { bg: '#FCE7F3', border: '#EC4899', text: '#9F1239' },
    '其他獎項': { bg: '#F3F4F6', border: '#9CA3AF', text: '#374151' },
  };

  const filled = awards.filter(a => a.winner.trim()).length;
  const pct = awards.length > 0 ? Math.round((filled / awards.length) * 100) : 0;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5" style={{ color: '#F5B800' }} />
          <h2 className="text-lg font-bold">得獎名單</h2>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-xs font-bold" style={{ color: '#92400E' }}>{filled}/{awards.length}</div>
          <div className="w-20 h-2 rounded-full overflow-hidden" style={{ background: '#FEF3C7' }}>
            <div className="h-full" style={{ width: `${pct}%`, background: 'linear-gradient(90deg, #F5B800, #FF9F1C)' }}></div>
          </div>
        </div>
      </div>

      {Object.entries(grouped).map(([cat, items]) => {
        const c = colors[cat] || colors['其他獎項'];
        return (
          <section key={cat} className="bg-white rounded-2xl shadow-sm border overflow-hidden" style={{ borderColor: c.border }}>
            <div className="px-3 py-2 flex items-center justify-between" style={{ background: c.bg }}>
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4" style={{ color: c.text }} />
                <h3 className="font-bold text-sm" style={{ color: c.text }}>{cat}</h3>
                <span className="text-[10px] px-1.5 py-0.5 rounded-full" style={{ background: 'white', color: c.text }}>{items.length}</span>
              </div>
              <button onClick={() => add(cat)} className="flex items-center gap-1 px-2 py-0.5 rounded text-xs hover:bg-white/50 transition" style={{ color: c.text }}>
                <Plus className="w-3 h-3" />新增
              </button>
            </div>
            <div className="divide-y" style={{ borderColor: c.bg }}>
              {items.map(item => <AwardCard key={item._idx} item={item} onUpdate={up} onRemove={rm} />)}
            </div>
          </section>
        );
      })}

      <button onClick={() => add('其他獎項')} className="w-full py-3 rounded-xl border-2 border-dashed text-sm hover:bg-yellow-50 transition" style={{ borderColor: '#FCD34D', color: '#92400E' }}>
        <Plus className="w-4 h-4 inline mr-1" />新增獎項類別
      </button>
    </div>
  );
}

function AwardCard({ item, onUpdate, onRemove }) {
  return (
    <div className="p-3 space-y-2">
      <input value={item.name} onChange={e => onUpdate(item._idx, 'name', e.target.value)} placeholder="獎項名稱" className="w-full font-medium bg-transparent outline-none border-b border-transparent focus:border-yellow-400 text-sm transition" style={{ color: '#1F2937' }} />
      <input value={item.winner} onChange={e => onUpdate(item._idx, 'winner', e.target.value)} placeholder="得獎者姓名" className="w-full px-2 py-1.5 rounded-lg outline-none border text-sm transition"
        style={{ background: item.winner ? '#FFFBEA' : 'white', borderColor: item.winner ? '#F5B800' : '#E5E7EB', color: item.winner ? '#92400E' : '#9CA3AF', fontWeight: item.winner ? 600 : 400 }} />
      <div className="flex items-center gap-2">
        <input value={item.note} onChange={e => onUpdate(item._idx, 'note', e.target.value)} placeholder="備註" className="flex-1 text-xs bg-transparent outline-none border-b border-transparent focus:border-yellow-400 text-gray-600" />
        <button onClick={() => { if (confirm(`刪除「${item.name}」？`)) onRemove(item._idx); }} className="p-1 rounded hover:bg-red-50"><Trash2 className="w-3.5 h-3.5" style={{ color: '#DC2626' }} /></button>
      </div>
    </div>
  );
}

// ============== 工作分工（卡片式） ==============
function StaffTab({ staff, setStaff }) {
  const up = (i, f, v) => setStaff(staff.map((s, x) => x === i ? { ...s, [f]: v } : s));
  const add = () => setStaff([...staff, { role: "新角色", name: "", phone: "", responsibility: "" }]);
  const rm = (i) => setStaff(staff.filter((_, x) => x !== i));

  const filled = staff.filter(s => s.name.trim()).length;
  const pct = staff.length > 0 ? Math.round((filled / staff.length) * 100) : 0;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <UserCheck className="w-5 h-5" style={{ color: '#F5B800' }} />
          <h2 className="text-lg font-bold">工作分工</h2>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-xs font-bold" style={{ color: '#92400E' }}>{filled}/{staff.length}</div>
          <div className="w-20 h-2 rounded-full overflow-hidden" style={{ background: '#FEF3C7' }}>
            <div className="h-full" style={{ width: `${pct}%`, background: 'linear-gradient(90deg, #F5B800, #FF9F1C)' }}></div>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        {staff.map((s, i) => <StaffCard key={i} staff={s} onUpdate={(f, v) => up(i, f, v)} onRemove={() => { if (confirm(`刪除「${s.role}」？`)) rm(i); }} />)}
      </div>

      <button onClick={add} className="w-full py-3 rounded-xl border-2 border-dashed text-sm hover:bg-yellow-50 transition" style={{ borderColor: '#FCD34D', color: '#92400E' }}>
        <Plus className="w-4 h-4 inline mr-1" />新增角色
      </button>
    </div>
  );
}

function StaffCard({ staff, onUpdate, onRemove }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="bg-white rounded-xl shadow-sm border transition" style={{ borderColor: staff.name ? '#F5B800' : '#FCD34D', borderWidth: staff.name ? 2 : 1 }}>
      <button onClick={() => setExpanded(!expanded)} className="w-full flex items-center gap-2 p-3 text-left active:bg-yellow-50/50 transition">
        <div className="shrink-0 w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: staff.name ? 'linear-gradient(135deg, #F5B800, #FF9F1C)' : '#F3F4F6' }}>
          {staff.name ? <UserCheck className="w-4 h-4 text-white" /> : <Circle className="w-4 h-4 text-gray-400" />}
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-bold text-sm" style={{ color: '#1F2937' }}>{staff.role}</div>
          <div className="text-xs" style={{ color: staff.name ? '#92400E' : '#9CA3AF' }}>{staff.name || '未指派'}{staff.phone && ` · ${staff.phone}`}</div>
        </div>
        <ChevronRight className="w-4 h-4 text-gray-400 transition-transform" style={{ transform: expanded ? 'rotate(90deg)' : 'none' }} />
      </button>
      {expanded && (
        <div className="border-t p-3 space-y-2" style={{ borderColor: '#FEF3C7', background: '#FFFEF7' }}>
          <div>
            <label className="text-[10px] font-bold uppercase" style={{ color: '#92400E' }}>角色名稱</label>
            <input value={staff.role} onChange={e => onUpdate('role', e.target.value)} className="w-full mt-0.5 px-2 py-1.5 rounded-lg border text-sm outline-none focus:border-yellow-400" style={{ borderColor: '#FCD34D' }} />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[10px] font-bold uppercase" style={{ color: '#92400E' }}>負責人</label>
              <input value={staff.name} onChange={e => onUpdate('name', e.target.value)} placeholder="姓名" className="w-full mt-0.5 px-2 py-1.5 rounded-lg border text-sm outline-none focus:border-yellow-400" style={{ borderColor: '#FCD34D' }} />
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase" style={{ color: '#92400E' }}>聯絡方式</label>
              <input value={staff.phone} onChange={e => onUpdate('phone', e.target.value)} placeholder="手機/Line" className="w-full mt-0.5 px-2 py-1.5 rounded-lg border text-sm outline-none focus:border-yellow-400" style={{ borderColor: '#FCD34D' }} />
            </div>
          </div>
          <div>
            <label className="text-[10px] font-bold uppercase" style={{ color: '#92400E' }}>職責內容</label>
            <textarea value={staff.responsibility} onChange={e => onUpdate('responsibility', e.target.value)} rows={2} className="w-full mt-0.5 px-2 py-1.5 rounded-lg border text-sm outline-none focus:border-yellow-400 resize-none" style={{ borderColor: '#FCD34D' }} />
          </div>
          <button onClick={onRemove} className="flex items-center gap-1 text-xs font-medium px-2 py-1 rounded hover:bg-red-50 transition" style={{ color: '#DC2626' }}>
            <Trash2 className="w-3 h-3" />刪除角色
          </button>
        </div>
      )}
    </div>
  );
}

// ============== 預算分頁（手機優先） ==============
function BudgetTab({ budget, setBudget, calc }) {
  const ua = (k, v) => setBudget({ ...budget, assumptions: { ...budget.assumptions, [k]: Number(v) || 0 } });
  const ue = (idx, f, v) => {
    const n = budget.expenses.map((e, i) => {
      if (i !== idx) return e;
      if (f === 'qty' || f === 'price') {
        const nv = Number(v);
        return { ...e, [f]: !isNaN(nv) && v !== '' && !v.startsWith?.('=') ? nv : v };
      }
      return { ...e, [f]: v };
    });
    setBudget({ ...budget, expenses: n });
  };
  const addE = () => setBudget({ ...budget, expenses: [...budget.expenses, { name: "新項目", qty: 1, unit: "式", price: 0, lastYear: 0, note: "" }] });
  const rmE = (i) => setBudget({ ...budget, expenses: budget.expenses.filter((_, x) => x !== i) });

  const exportExcel = () => {
    const c = budget.assumptions;
    const rows = [
      ['富樂 11 週年黃色派對 收支預算表'],
      [`日期：2025/06/12　${c.tables} 桌 ${c.tables * c.perTable} 人`], [],
      ['【關鍵假設】'],
      ['桌數', c.tables], ['每桌人數', c.perTable], ['每人收費', c.perPerson], ['每桌餐費', c.tableCost], ['補貼上限', c.subsidyCap], [],
      ['【支出明細】'],
      ['項目', '數量', '單位', '單價', '總價', '10週年', '備註'],
      ...calc.expensesWithTotal.map(e => [e.name, e._qty, e.unit, e._price, e._total, e.lastYear, e.note]),
      ['', '', '', '總計', calc.expTotal], [],
      ['【結算】'], ['報名費收入', calc.income], ['支出總計', calc.expTotal], ['缺口', calc.gap], ['結餘', calc.balance],
    ];
    const t = rows.map(r => r.map(x => x ?? '').join('\t')).join('\n');
    const b = new Blob(['\ufeff' + t], { type: 'application/vnd.ms-excel;charset=utf-8' });
    const u = URL.createObjectURL(b); const a = document.createElement('a');
    a.href = u; a.download = '11週年_預算表.xls'; a.click();
    URL.revokeObjectURL(u);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <DollarSign className="w-5 h-5" style={{ color: '#F5B800' }} />
          <h2 className="text-lg font-bold">預算</h2>
        </div>
        <button onClick={exportExcel} className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-white text-xs font-medium shadow-sm active:scale-95 transition" style={{ background: 'linear-gradient(135deg, #F5B800, #FF9F1C)' }}>
          <Download className="w-3.5 h-3.5" />Excel
        </button>
      </div>

      {/* 關鍵假設 - 可摺疊 */}
      <details className="bg-white rounded-2xl shadow-sm border" style={{ borderColor: '#FCD34D' }} open>
        <summary className="px-3 py-2.5 font-bold text-sm cursor-pointer flex items-center justify-between" style={{ color: '#1F2937' }}>
          <span className="flex items-center gap-2"><Users className="w-4 h-4" style={{ color: '#F5B800' }} />關鍵假設</span>
          <span className="text-[10px] font-normal px-2 py-0.5 rounded-full" style={{ background: '#DBEAFE', color: '#1E40AF' }}>改數字即時更新</span>
        </summary>
        <div className="px-3 pb-3 pt-1 grid grid-cols-2 gap-2">
          <AC label="桌數" value={budget.assumptions.tables} unit="桌" onChange={v => ua('tables', v)} />
          <AC label="每桌人數" value={budget.assumptions.perTable} unit="人" onChange={v => ua('perTable', v)} />
          <AC label="每人收費" value={budget.assumptions.perPerson} unit="元" onChange={v => ua('perPerson', v)} />
          <AC label="每桌餐費" value={budget.assumptions.tableCost} unit="元" onChange={v => ua('tableCost', v)} />
          <AC label="補貼上限" value={budget.assumptions.subsidyCap} unit="元" onChange={v => ua('subsidyCap', v)} highlight span2 />
        </div>
      </details>

      {/* 結算摘要（2x2） */}
      <div className="grid grid-cols-2 gap-2">
        <SC label="支出" value={calc.expTotal} color="#DC2626" />
        <SC label="收入" value={calc.income} color="#0891B2" />
        <SC label="缺口" value={calc.gap} color="#D97706" />
        <SC label="結餘" value={calc.balance} color={calc.balance >= 0 ? "#059669" : "#DC2626"} highlight />
      </div>

      {/* 支出明細（卡片式） */}
      <section className="bg-white rounded-2xl shadow-sm border overflow-hidden" style={{ borderColor: '#FCD34D' }}>
        <div className="px-3 py-2.5 border-b flex items-center justify-between" style={{ borderColor: '#FEF3C7', background: '#FFFBEA' }}>
          <h3 className="font-bold text-sm">支出明細（{budget.expenses.length}）</h3>
          <button onClick={addE} className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium hover:bg-yellow-100" style={{ color: '#92400E' }}>
            <Plus className="w-3.5 h-3.5" />新增
          </button>
        </div>
        <div className="divide-y" style={{ borderColor: '#FEF3C7' }}>
          {calc.expensesWithTotal.map((e, i) => <BudgetCard key={i} expense={e} idx={i} onUpdate={ue} onRemove={rmE} />)}
        </div>
        <div className="p-3 border-t text-right" style={{ borderColor: '#FEF3C7', background: '#FEF3C7' }}>
          <div className="text-xs mb-0.5" style={{ color: '#92400E' }}>支出總計</div>
          <div className="text-xl font-bold" style={{ color: '#DC2626' }}>${fmt(calc.expTotal)}</div>
        </div>
      </section>

      <div className="text-[10px] text-gray-500 px-2">
        💡 公式範例：<code className="px-1 rounded" style={{ background: '#FEF3C7' }}>{'={tables}'}</code>
        <code className="px-1 rounded ml-1" style={{ background: '#FEF3C7' }}>{'=CEIL({tables}*0.8)'}</code>
      </div>
    </div>
  );
}

function AC({ label, value, unit, onChange, highlight, span2 }) {
  return (
    <div className={`rounded-xl p-2 border-2 ${span2 ? 'col-span-2' : ''}`} style={{ borderColor: highlight ? '#F5B800' : '#FCD34D', background: highlight ? '#FEF3C7' : '#FFFBEA' }}>
      <div className="text-[10px] mb-0.5 font-bold" style={{ color: '#92400E' }}>{label}</div>
      <div className="flex items-baseline gap-1">
        <input type="number" inputMode="numeric" value={value} onChange={e => onChange(e.target.value)} className="w-full text-base font-bold bg-transparent outline-none" style={{ color: '#1F2937' }} />
        <span className="text-[10px] shrink-0" style={{ color: '#92400E' }}>{unit}</span>
      </div>
    </div>
  );
}

function SC({ label, value, color, highlight }) {
  return (
    <div className="bg-white rounded-xl p-3 shadow-sm border" style={{ borderColor: highlight ? color : '#FCD34D', borderWidth: highlight ? 2 : 1 }}>
      <div className="text-[10px] mb-0.5" style={{ color: '#6B7280' }}>{label}</div>
      <div className="text-xl font-bold" style={{ color }}>${fmt(value)}</div>
    </div>
  );
}

function BudgetCard({ expense: e, idx, onUpdate, onRemove }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div>
      <button onClick={() => setExpanded(!expanded)} className="w-full flex items-center gap-2 p-3 text-left active:bg-yellow-50/50 transition">
        <div className="flex-1 min-w-0">
          <div className="font-medium text-sm truncate" style={{ color: '#1F2937' }}>{e.name}</div>
          <div className="text-[10px] text-gray-500">{e._qty} {e.unit} × ${fmt(e._price)}</div>
        </div>
        <div className="text-right shrink-0">
          <div className="font-bold text-sm" style={{ color: '#92400E' }}>${fmt(e._total)}</div>
          {e.lastYear > 0 && <div className="text-[10px] text-gray-400">去年 ${fmt(e.lastYear)}</div>}
        </div>
        <ChevronRight className="w-4 h-4 text-gray-400 transition-transform" style={{ transform: expanded ? 'rotate(90deg)' : 'none' }} />
      </button>
      {expanded && (
        <div className="px-3 pb-3 space-y-2" style={{ background: '#FFFEF7' }}>
          <div>
            <label className="text-[10px] font-bold uppercase" style={{ color: '#92400E' }}>項目名稱</label>
            <input value={e.name} onChange={v => onUpdate(idx, 'name', v.target.value)} className="w-full mt-0.5 px-2 py-1.5 rounded-lg border text-sm outline-none focus:border-yellow-400" style={{ borderColor: '#FCD34D' }} />
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="text-[10px] font-bold uppercase" style={{ color: '#92400E' }}>數量</label>
              <input value={e.qty} onChange={v => onUpdate(idx, 'qty', v.target.value)} className="w-full mt-0.5 px-2 py-1.5 rounded-lg border text-sm text-center outline-none focus:border-yellow-400" style={{ borderColor: '#FCD34D' }} />
              {typeof e.qty === 'string' && e.qty.startsWith('=') && <div className="text-[10px] text-gray-500 text-center mt-0.5">= {e._qty}</div>}
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase" style={{ color: '#92400E' }}>單位</label>
              <input value={e.unit} onChange={v => onUpdate(idx, 'unit', v.target.value)} className="w-full mt-0.5 px-2 py-1.5 rounded-lg border text-sm text-center outline-none focus:border-yellow-400" style={{ borderColor: '#FCD34D' }} />
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase" style={{ color: '#92400E' }}>單價</label>
              <input value={e.price} onChange={v => onUpdate(idx, 'price', v.target.value)} className="w-full mt-0.5 px-2 py-1.5 rounded-lg border text-sm text-right outline-none focus:border-yellow-400" style={{ borderColor: '#FCD34D' }} />
            </div>
          </div>
          <div>
            <label className="text-[10px] font-bold uppercase" style={{ color: '#92400E' }}>備註</label>
            <input value={e.note} onChange={v => onUpdate(idx, 'note', v.target.value)} className="w-full mt-0.5 px-2 py-1.5 rounded-lg border text-sm outline-none focus:border-yellow-400" style={{ borderColor: '#FCD34D' }} />
          </div>
          <button onClick={() => { if (confirm(`刪除「${e.name}」？`)) onRemove(idx); }} className="flex items-center gap-1 text-xs font-medium px-2 py-1 rounded hover:bg-red-50 transition" style={{ color: '#DC2626' }}>
            <Trash2 className="w-3 h-3" />刪除
          </button>
        </div>
      )}
    </div>
  );
}

// ============== 統計分頁 ==============
function StatsTab({ budget, calc, scenarios, flow, awards, staff, registrations }) {
  const ctx = budget.assumptions;
  const regStats = useMemo(() => {
    const tp = registrations.reduce((s, r) => s + 1 + (Number(r.companions) || 0), 0);
    const td = registrations.reduce((s, r) => s + (Number(r.fee) || 0) * (1 + (Number(r.companions) || 0)), 0);
    const tpd = registrations.reduce((s, r) => r.paid ? s + (Number(r.fee) || 0) * (1 + (Number(r.companions) || 0)) : s, 0);
    return { totalPeople: tp, totalDue: td, totalPaid: tpd };
  }, [registrations]);

  const awardsFilled = awards.filter(a => a.winner.trim()).length;
  const staffFilled = staff.filter(s => s.name.trim()).length;

  const exportPDF = () => {
    const w = window.open('', '_blank');
    const days = Math.max(0, Math.ceil((EVENT_DATETIME - Date.now()) / 86400000));
    const duration = flow.length > 0 ? `${flow[0].time?.split('-')[0] || ''} - ${flow[flow.length - 1].time?.split('-')[1] || ''}` : '';
    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>一頁報告</title><style>
      @page { size: A4; margin: 1.2cm; }
      body { font-family: "微軟正黑體", sans-serif; margin: 0; color: #1F2937; }
      .hero { background: linear-gradient(135deg, #F5B800, #FF9F1C); color: white; padding: 16px 20px; border-radius: 12px; margin-bottom: 14px; }
      .hero h1 { margin: 0 0 4px; font-size: 22px; }
      .hero .sub { font-size: 12px; opacity: 0.9; }
      .hero .stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; margin-top: 10px; }
      .hero .stat { background: rgba(255,255,255,0.2); padding: 8px; border-radius: 8px; }
      .hero .stat-label { font-size: 10px; opacity: 0.9; }
      .hero .stat-value { font-size: 14px; font-weight: bold; margin-top: 2px; }
      .section { background: white; border: 1px solid #FCD34D; border-radius: 10px; padding: 12px 14px; margin-bottom: 10px; page-break-inside: avoid; }
      .section h2 { margin: 0 0 8px; font-size: 14px; color: #92400E; border-bottom: 2px solid #F5B800; padding-bottom: 4px; }
      table { width: 100%; border-collapse: collapse; font-size: 10px; }
      th { background: #FEF3C7; color: #92400E; padding: 4px 6px; text-align: left; }
      td { padding: 4px 6px; border-bottom: 1px solid #FEF3C7; }
      .right { text-align: right; }
      .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
      .kpi { padding: 8px; border-radius: 6px; }
      .kpi-label { font-size: 10px; }
      .kpi-value { font-size: 16px; font-weight: bold; margin-top: 2px; }
      .balance-good { background: linear-gradient(135deg, #D1FAE5, #A7F3D0); }
      .balance-good .kpi-value { color: #059669; }
      .balance-bad { background: linear-gradient(135deg, #FEE2E2, #FECACA); }
      .balance-bad .kpi-value { color: #DC2626; }
      .progress-bar { height: 5px; background: #FEF3C7; border-radius: 3px; margin-top: 2px; overflow: hidden; }
      .progress-fill { height: 100%; background: linear-gradient(90deg, #F5B800, #FF9F1C); }
    </style></head><body>
      <div class="hero">
        <h1>✨ BNI 富樂 11 週年「黃色派對」</h1>
        <div class="sub">2025/06/12（六）17:30 · 高雄林皇宮 · 內部活動</div>
        <div class="stats">
          <div class="stat"><div class="stat-label">時長</div><div class="stat-value">${duration}</div></div>
          <div class="stat"><div class="stat-label">環節</div><div class="stat-value">${flow.length}</div></div>
          <div class="stat"><div class="stat-label">人數</div><div class="stat-value">${ctx.tables * ctx.perTable}</div></div>
          <div class="stat"><div class="stat-label">距活動</div><div class="stat-value">${days} 天</div></div>
        </div>
      </div>
      <div class="grid-2">
        <div class="section">
          <h2>💰 收支結算</h2>
          <table>
            <tr><td>報名費收入</td><td class="right">$${fmt(calc.income)}</td></tr>
            <tr><td>支出總計</td><td class="right" style="color:#DC2626">-$${fmt(calc.expTotal)}</td></tr>
            <tr><td>支出缺口</td><td class="right">$${fmt(calc.gap)}</td></tr>
            <tr><td>補貼上限</td><td class="right">$${fmt(ctx.subsidyCap)}</td></tr>
          </table>
          <div class="kpi ${calc.balance >= 0 ? 'balance-good' : 'balance-bad'}" style="margin-top:8px">
            <div class="kpi-label">${calc.balance >= 0 ? '✓ 補貼後結餘' : '⚠ 超出上限'}</div>
            <div class="kpi-value">${calc.balance >= 0 ? '+' : ''}$${fmt(calc.balance)}</div>
          </div>
        </div>
        <div class="section">
          <h2>📊 籌備進度</h2>
          <div style="font-size:11px">
            <div style="margin-bottom:6px"><div style="display:flex;justify-content:space-between"><span>得獎名單</span><span><b>${awardsFilled}/${awards.length}</b></span></div><div class="progress-bar"><div class="progress-fill" style="width:${awards.length > 0 ? (awardsFilled / awards.length * 100) : 0}%"></div></div></div>
            <div style="margin-bottom:6px"><div style="display:flex;justify-content:space-between"><span>工作分工</span><span><b>${staffFilled}/${staff.length}</b></span></div><div class="progress-bar"><div class="progress-fill" style="width:${staff.length > 0 ? (staffFilled / staff.length * 100) : 0}%"></div></div></div>
            ${registrations.length > 0 ? `<div><div style="display:flex;justify-content:space-between"><span>報名繳費</span><span><b>$${fmt(regStats.totalPaid)}/$${fmt(regStats.totalDue)}</b></span></div><div class="progress-bar"><div class="progress-fill" style="width:${regStats.totalDue > 0 ? (regStats.totalPaid / regStats.totalDue * 100) : 0}%"></div></div></div>` : ''}
          </div>
        </div>
      </div>
      <div class="section">
        <h2>📅 活動流程</h2>
        <table>
          <thead><tr><th style="width:80px">時間</th><th style="width:140px">環節</th><th>細節</th></tr></thead>
          <tbody>${flow.map(r => `<tr><td>${r.time}</td><td><b>${r.title}</b></td><td style="font-size:9px">${(r.detail || '').replace(/\n/g, '<br>')}</td></tr>`).join('')}</tbody>
        </table>
      </div>
      <div class="section">
        <h2>💵 支出明細</h2>
        <table>
          <thead><tr><th>項目</th><th class="right">金額</th><th style="font-size:9px">備註</th></tr></thead>
          <tbody>${calc.expensesWithTotal.map(e => `<tr><td>${e.name}</td><td class="right">$${fmt(e._total)}</td><td style="font-size:9px;color:#666">${e.note || '-'}</td></tr>`).join('')}<tr style="background:#FEF3C7;font-weight:bold"><td>支出總計</td><td class="right">$${fmt(calc.expTotal)}</td><td></td></tr></tbody>
        </table>
      </div>
      ${awardsFilled > 0 ? `<div class="section"><h2>🏆 得獎名單</h2><table><thead><tr><th style="width:90px">類別</th><th>獎項</th><th>得獎者</th></tr></thead><tbody>${awards.filter(a => a.winner.trim()).map(a => `<tr><td style="font-size:10px;color:#92400E">${a.category}</td><td>${a.name}</td><td><b>${a.winner}</b></td></tr>`).join('')}</tbody></table></div>` : ''}
      ${staffFilled > 0 ? `<div class="section"><h2>👥 工作人員</h2><table><thead><tr><th>角色</th><th>負責人</th><th>職責</th></tr></thead><tbody>${staff.filter(s => s.name.trim()).map(s => `<tr><td>${s.role}</td><td><b>${s.name}</b></td><td style="font-size:10px;color:#666">${s.responsibility || '-'}</td></tr>`).join('')}</tbody></table></div>` : ''}
      <div style="text-align:center;font-size:9px;color:#9CA3AF;margin-top:8px">BNI 富樂鑽石名人堂 · 匯出：${new Date().toLocaleString('zh-TW')}</div>
    </body></html>`;
    w.document.write(html); w.document.close();
    setTimeout(() => w.print(), 500);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5" style={{ color: '#F5B800' }} />
          <h2 className="text-lg font-bold">統計儀表板</h2>
        </div>
        <button onClick={exportPDF} className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-white text-xs font-medium shadow-sm active:scale-95 transition" style={{ background: 'linear-gradient(135deg, #F5B800, #FF9F1C)' }}>
          <FileText className="w-3.5 h-3.5" />PDF
        </button>
      </div>

      {/* 收支結算 */}
      <section className="bg-white rounded-2xl shadow-sm border p-4" style={{ borderColor: '#FCD34D' }}>
        <h3 className="font-bold text-sm mb-3 flex items-center gap-2"><DollarSign className="w-4 h-4" style={{ color: '#F5B800' }} />收支結算</h3>
        <div className="space-y-2">
          <div className="flex items-center justify-between py-1">
            <div>
              <div className="text-sm font-medium">報名費收入</div>
              <div className="text-[10px] text-gray-500">{ctx.tables}桌 × {ctx.perTable}人 × ${fmt(ctx.perPerson)}</div>
            </div>
            <div className="text-lg font-bold" style={{ color: '#0891B2' }}>${fmt(calc.income)}</div>
          </div>
          <div className="flex items-center justify-between py-1">
            <div>
              <div className="text-sm font-medium">支出總計</div>
              <div className="text-[10px] text-gray-500">{budget.expenses.length} 項</div>
            </div>
            <div className="text-lg font-bold" style={{ color: '#DC2626' }}>-${fmt(calc.expTotal)}</div>
          </div>
          <div className="border-t pt-2" style={{ borderColor: '#FEF3C7' }}>
            <div className="flex items-center justify-between py-1">
              <div className="text-sm text-gray-600">支出缺口</div>
              <div className="text-sm font-medium" style={{ color: '#D97706' }}>${fmt(calc.gap)}</div>
            </div>
            <div className="flex items-center justify-between py-1">
              <div className="text-sm text-gray-600">補貼上限</div>
              <div className="text-sm font-medium" style={{ color: '#7C3AED' }}>${fmt(ctx.subsidyCap)}</div>
            </div>
          </div>
          <div className="rounded-xl p-3 mt-1" style={{ background: calc.balance >= 0 ? 'linear-gradient(135deg, #D1FAE5, #A7F3D0)' : 'linear-gradient(135deg, #FEE2E2, #FECACA)' }}>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs mb-0.5 font-bold" style={{ color: calc.balance >= 0 ? '#065F46' : '#991B1B' }}>{calc.balance >= 0 ? '✓ 補貼後結餘' : '⚠ 超出補貼上限'}</div>
                <div className="text-[10px]" style={{ color: calc.balance >= 0 ? '#047857' : '#B91C1C' }}>{calc.balance >= 0 ? '收入+補貼 ≥ 支出' : '需另籌經費'}</div>
              </div>
              <div className="text-2xl font-bold" style={{ color: calc.balance >= 0 ? '#059669' : '#DC2626' }}>{calc.balance >= 0 ? '+' : ''}${fmt(calc.balance)}</div>
            </div>
          </div>
        </div>
      </section>

      {/* 桌數情境 */}
      <section className="bg-white rounded-2xl shadow-sm border p-4" style={{ borderColor: '#FCD34D' }}>
        <h3 className="font-bold text-sm mb-3 flex items-center gap-2"><BarChart3 className="w-4 h-4" style={{ color: '#F5B800' }} />桌數情境分析</h3>
        <div className="space-y-2">
          {scenarios.map(s => (
            <div key={s.tables} className="rounded-xl p-3 border" style={{ borderColor: s.withinCap ? '#86EFAC' : '#FCA5A5', background: s.withinCap ? '#F0FDF4' : '#FEF2F2' }}>
              <div className="flex items-baseline justify-between mb-1.5">
                <span className="font-bold">{s.tables} 桌 <span className="text-xs font-normal text-gray-500">/ {s.persons} 人</span></span>
                <div className="text-[10px] px-2 py-0.5 rounded-full font-medium" style={{ background: s.withinCap ? '#22C55E' : '#EF4444', color: 'white' }}>
                  {s.withinCap ? '✓ 在上限' : `⚠ 超出 $${fmt(Math.round(s.need - ctx.subsidyCap))}`}
                </div>
              </div>
              <div className="grid grid-cols-3 gap-1 text-xs">
                <div><span className="text-gray-600">收入</span><div className="font-medium">${fmt(s.income)}</div></div>
                <div><span className="text-gray-600">支出</span><div className="font-medium">${fmt(Math.round(s.expense))}</div></div>
                <div><span className="text-gray-600">補貼</span><div className="font-bold" style={{ color: s.withinCap ? '#059669' : '#DC2626' }}>${fmt(Math.round(s.need))}</div></div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* vs. 10 週年 */}
      <section className="bg-white rounded-2xl shadow-sm border p-4" style={{ borderColor: '#FCD34D' }}>
        <h3 className="font-bold text-sm mb-3">vs. 10 週年</h3>
        <div className="space-y-1.5 text-xs">
          {[
            { item: '規模', last: '20桌 189人', now: `${ctx.tables}桌 ${ctx.tables * ctx.perTable}人` },
            { item: '餐費場地', last: '$200,000', now: `$${fmt(ctx.tables * ctx.tableCost)}` },
            { item: '樂團主持', last: '$49,000', now: '$0' },
            { item: '攝影', last: '$9,000', now: '$9,000' },
            { item: '佈置', last: '$9,000', now: '$9,000' },
          ].map((row, i) => (
            <div key={i} className="grid grid-cols-3 py-1 border-b last:border-0" style={{ borderColor: '#FEF3C7' }}>
              <div className="text-gray-600">{row.item}</div>
              <div className="text-right text-gray-400">{row.last}</div>
              <div className="text-right font-medium" style={{ color: '#92400E' }}>{row.now}</div>
            </div>
          ))}
          <div className="grid grid-cols-3 py-1.5 pt-2 border-t-2" style={{ borderColor: '#F5B800' }}>
            <div className="font-bold">支出總計</div>
            <div className="text-right text-gray-400">$311,520</div>
            <div className="text-right font-bold" style={{ color: '#92400E' }}>${fmt(calc.expTotal)}</div>
          </div>
        </div>
      </section>
    </div>
  );
}

// ============== 現場模式（角色切換） ==============
function LiveMode({ flow, awards, staff, onExit }) {
  const [now, setNow] = useState(Date.now());
  const [manualIdx, setManualIdx] = useState(null);
  const [isPaused, setIsPaused] = useState(false);
  const [role, setRole] = useState('all'); // all | host | slides | photo

  useEffect(() => {
    if (isPaused) return;
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, [isPaused]);

  const baseDate = new Date('2025-06-12T00:00:00+08:00');

  const currentInfo = useMemo(() => {
    if (manualIdx !== null) return { index: manualIdx, row: flow[manualIdx], range: parseTimeRange(flow[manualIdx]?.time, baseDate), isManual: true };
    for (let i = 0; i < flow.length; i++) {
      const range = parseTimeRange(flow[i].time, baseDate);
      if (!range) continue;
      if (now < range.end) return { index: i, row: flow[i], range, isManual: false };
    }
    return { index: flow.length - 1, row: flow[flow.length - 1], range: parseTimeRange(flow[flow.length - 1]?.time, baseDate), isEnded: true };
  }, [flow, now, manualIdx]);

  const currentRow = currentInfo?.row;
  const currentIdx = currentInfo?.index;
  const nextRow = flow[currentIdx + 1];
  const nextRange = nextRow ? parseTimeRange(nextRow.time, baseDate) : null;

  const progress = useMemo(() => {
    if (!currentInfo?.range) return { pct: 0, elapsed: 0, remaining: 0 };
    const { start, end } = currentInfo.range;
    const total = end - start;
    const elapsed = Math.max(0, Math.min(total, now - start));
    return { pct: total > 0 ? (elapsed / total) * 100 : 0, elapsed, remaining: Math.max(0, end - now) };
  }, [currentInfo, now]);

  const toNext = nextRange ? Math.max(0, nextRange.start - now) : null;

  const eventState = useMemo(() => {
    const first = parseTimeRange(flow[0]?.time, baseDate);
    const last = parseTimeRange(flow[flow.length - 1]?.time, baseDate);
    if (!first || !last) return 'unknown';
    if (now < first.start) return 'before';
    if (now > last.end) return 'after';
    return 'during';
  }, [flow, now]);

  const fmtMs = (ms) => {
    const s = Math.floor(ms / 1000);
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
    return `${m}:${String(sec).padStart(2, '0')}`;
  };

  const timeNow = new Date(now).toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });

  // 本環節相關得獎者
  const relatedAwards = useMemo(() => {
    if (!currentRow) return [];
    const title = currentRow.title;
    if (title.includes('業績')) return awards.filter(a => a.category === '業績類' && a.winner.trim());
    if (title.includes('全勤')) return awards.filter(a => a.category === '全勤獎' && a.winner.trim());
    if (title.includes('金拖鞋')) return awards.filter(a => a.category === '金拖鞋獎' && a.winner.trim());
    if (title.includes('走秀')) return awards.filter(a => a.category === '造型走秀' && a.winner.trim());
    return [];
  }, [currentRow, awards]);

  // 角色視圖過濾
  const getRoleContent = () => {
    if (!currentRow) return null;
    const note = currentRow.note || '';
    if (role === 'host') {
      // 主持人：需要說的話、帶的環節
      return {
        focus: '主持重點',
        content: currentRow.detail,
        extra: note.includes('芋頭') || note.includes('PUMA') || note.includes('明勳') || note.includes('文昱') ? `👤 主持：${note.split('/').find(s => ['芋頭', 'PUMA', '明勳', '文昱'].some(n => s.includes(n)))?.trim()}` : null,
        showAwards: relatedAwards.length > 0,
      };
    }
    if (role === 'slides') {
      // 簡報手：該投影什麼
      const slidesHint = note.match(/簡報手[:：]([^/]+)/)?.[1]?.trim();
      return {
        focus: '簡報操作',
        content: slidesHint || '等待下一個環節',
        extra: currentRow.music ? `🎵 音樂：${currentRow.music}` : null,
        showAwards: relatedAwards.length > 0,
      };
    }
    if (role === 'photo') {
      // 攝影師：該拍什麼
      const photoHint = note.match(/攝影[組師]?[:：]([^/]+)/)?.[1]?.trim();
      return {
        focus: '拍攝重點',
        content: photoHint || (currentRow.title.includes('頒獎') ? '頒獎合影、得獎者特寫' : currentRow.title.includes('合照') ? '引導隊形、全體合影' : '記錄精彩瞬間'),
        extra: null,
        showAwards: false,
      };
    }
    return null;
  };

  const roleContent = getRoleContent();

  const roleConfigs = {
    all: { label: '全部', icon: LayoutGrid, color: '#F5B800' },
    host: { label: '主持人', icon: Mic, color: '#EC4899' },
    slides: { label: '簡報手', icon: Presentation, color: '#8B5CF6' },
    photo: { label: '攝影師', icon: Camera, color: '#10B981' },
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'linear-gradient(135deg, #0F0F0F 0%, #1F1509 100%)', fontFamily: '"Noto Sans TC", sans-serif' }}>
      {/* 頂部列 */}
      <header className="flex items-center justify-between px-3 md:px-6 py-2.5 border-b" style={{ borderColor: '#F5B800' }}>
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center animate-pulse" style={{ background: 'linear-gradient(135deg, #F5B800, #FF9F1C)' }}>
            <Radio className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="text-[10px]" style={{ color: '#F5B800' }}>現場模式</div>
            <div className="text-white font-bold text-sm">黃色派對</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-xl md:text-2xl font-mono font-bold tabular-nums" style={{ color: '#F5B800' }}>{timeNow}</div>
          <button onClick={onExit} className="px-3 py-1.5 rounded-lg text-xs font-medium transition hover:bg-white/10" style={{ color: 'white', border: '1px solid rgba(255,255,255,0.3)' }}>離開</button>
        </div>
      </header>

      {/* 角色切換 */}
      <div className="px-3 md:px-6 py-2 border-b overflow-x-auto" style={{ borderColor: 'rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.3)' }}>
        <div className="flex gap-1.5 min-w-max">
          {Object.entries(roleConfigs).map(([key, cfg]) => {
            const Icon = cfg.icon;
            const active = role === key;
            return (
              <button key={key} onClick={() => setRole(key)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap"
                style={{ background: active ? cfg.color : 'rgba(255,255,255,0.05)', color: active ? 'white' : '#CBD5E1', border: `1px solid ${active ? cfg.color : 'rgba(255,255,255,0.1)'}` }}>
                <Icon className="w-3.5 h-3.5" />{cfg.label}
              </button>
            );
          })}
        </div>
      </div>

      <main className="flex-1 flex flex-col p-3 md:p-6 max-w-4xl mx-auto w-full overflow-y-auto">
        {eventState === 'before' && (
          <div className="rounded-xl p-4 mb-3 text-center" style={{ background: 'rgba(245, 184, 0, 0.15)', border: '1px solid #F5B800' }}>
            <div className="text-xs mb-1" style={{ color: '#FEF3C7' }}>活動尚未開始</div>
            <div className="text-2xl font-bold" style={{ color: '#F5B800' }}>距開場還有 {fmtMs(parseTimeRange(flow[0]?.time, baseDate)?.start - now || 0)}</div>
          </div>
        )}
        {eventState === 'after' && (
          <div className="rounded-xl p-6 text-center" style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid #10B981' }}>
            <Sparkles className="w-10 h-10 mx-auto mb-2" style={{ color: '#10B981' }} />
            <div className="text-xl font-bold text-white mb-1">活動圓滿結束</div>
            <div className="text-sm text-green-200">感謝所有夥伴參與！</div>
          </div>
        )}

        {eventState !== 'after' && currentRow && (
          <>
            {/* 主要卡片 */}
            <div className="rounded-2xl p-4 md:p-6 mb-3 shadow-2xl" style={{ background: 'linear-gradient(135deg, rgba(245, 184, 0, 0.15), rgba(255, 159, 28, 0.1))', border: '2px solid #F5B800' }}>
              <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="px-2 py-0.5 rounded-full text-[10px] font-bold" style={{ background: '#F5B800', color: '#1A1A1A' }}>{currentIdx + 1} / {flow.length}</div>
                  {currentInfo.isManual && <div className="px-2 py-0.5 rounded-full text-[10px]" style={{ background: 'rgba(59, 130, 246, 0.3)', color: '#93C5FD' }}>手動</div>}
                  {role !== 'all' && <div className="px-2 py-0.5 rounded-full text-[10px] font-bold" style={{ background: roleConfigs[role].color, color: 'white' }}>{roleConfigs[role].label}視角</div>}
                </div>
                <div className="text-base md:text-xl font-mono font-bold" style={{ color: '#F5B800' }}>{currentRow.time}</div>
              </div>

              <h2 className="text-2xl md:text-4xl font-bold text-white mt-2 mb-3 leading-tight">【{currentRow.title}】</h2>

              {role === 'all' ? (
                <>
                  {currentRow.detail && <div className="rounded-xl p-3 mb-3 text-white text-sm whitespace-pre-wrap leading-relaxed" style={{ background: 'rgba(0,0,0,0.3)' }}>{currentRow.detail}</div>}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-3">
                    {currentRow.music && (
                      <div className="rounded-lg px-3 py-2 flex items-center gap-2" style={{ background: 'rgba(139, 92, 246, 0.2)', border: '1px solid #8B5CF6' }}>
                        <Volume2 className="w-4 h-4 shrink-0" style={{ color: '#C4B5FD' }} />
                        <div>
                          <div className="text-[10px]" style={{ color: '#C4B5FD' }}>音樂</div>
                          <div className="text-white font-medium text-sm">{currentRow.music}</div>
                        </div>
                      </div>
                    )}
                    {currentRow.note && (
                      <div className="rounded-lg px-3 py-2" style={{ background: 'rgba(16, 185, 129, 0.2)', border: '1px solid #10B981' }}>
                        <div className="text-[10px]" style={{ color: '#A7F3D0' }}>備註 / 負責人</div>
                        <div className="text-white font-medium text-sm">{currentRow.note}</div>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <div className="mb-3">
                    <div className="text-[10px] mb-1 font-bold" style={{ color: roleConfigs[role].color }}>{roleContent.focus}</div>
                    <div className="rounded-xl p-3 text-white text-sm md:text-base whitespace-pre-wrap leading-relaxed" style={{ background: 'rgba(0,0,0,0.3)', borderLeft: `4px solid ${roleConfigs[role].color}` }}>
                      {roleContent.content}
                    </div>
                  </div>
                  {roleContent.extra && (
                    <div className="rounded-lg px-3 py-2 mb-3 text-sm" style={{ background: 'rgba(0,0,0,0.3)', color: '#FEF3C7' }}>
                      {roleContent.extra}
                    </div>
                  )}
                </>
              )}

              {/* 本環節得獎者 */}
              {(role === 'all' || roleContent?.showAwards) && relatedAwards.length > 0 && (
                <div className="rounded-xl p-3 mb-3" style={{ background: 'rgba(245, 184, 0, 0.1)', border: '1px solid rgba(245, 184, 0, 0.3)' }}>
                  <div className="flex items-center gap-1.5 text-[10px] font-bold mb-2" style={{ color: '#F5B800' }}>
                    <Trophy className="w-3.5 h-3.5" />本環節頒獎（{relatedAwards.length} 位）
                  </div>
                  <div className="space-y-1">
                    {relatedAwards.map((a, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm">
                        <Award className="w-3.5 h-3.5 shrink-0" style={{ color: '#F5B800' }} />
                        <span className="text-gray-300">{a.name}：</span>
                        <span className="font-bold text-white">{a.winner}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 進度條 */}
              {!currentInfo.isManual && !currentInfo.isEnded && eventState === 'during' && (
                <div>
                  <div className="flex items-center justify-between text-[10px] mb-1" style={{ color: '#FEF3C7' }}>
                    <span>已進行 {fmtMs(progress.elapsed)}</span>
                    <span className="font-bold" style={{ color: '#F5B800' }}>剩餘 {fmtMs(progress.remaining)}</span>
                  </div>
                  <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(0,0,0,0.4)' }}>
                    <div className="h-full transition-all duration-1000" style={{ width: `${progress.pct}%`, background: 'linear-gradient(90deg, #F5B800, #FF9F1C)' }}></div>
                  </div>
                </div>
              )}
            </div>

            {/* 下一環節 */}
            {nextRow && (
              <div className="rounded-xl p-3 mb-3" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 text-[10px] mb-0.5" style={{ color: '#94A3B8' }}><SkipForward className="w-3 h-3" />下一環節</div>
                    <div className="text-white font-bold truncate">{nextRow.title}</div>
                    <div className="text-xs" style={{ color: '#CBD5E1' }}>{nextRow.time}</div>
                  </div>
                  {toNext !== null && !currentInfo.isManual && (
                    <div className="text-right shrink-0">
                      <div className="text-[10px]" style={{ color: '#94A3B8' }}>倒數</div>
                      <div className="text-xl md:text-2xl font-mono font-bold" style={{ color: '#93C5FD' }}>{fmtMs(toNext)}</div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 控制列 */}
            <div className="rounded-xl p-2 flex items-center gap-1 mt-auto" style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <button onClick={() => currentIdx > 0 && setManualIdx(currentIdx - 1)} disabled={currentIdx === 0} className="flex-1 py-2 rounded-lg text-xs text-white transition hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed" style={{ border: '1px solid rgba(255,255,255,0.2)' }}>← 上一個</button>
              <button onClick={() => currentIdx < flow.length - 1 && setManualIdx(currentIdx + 1)} disabled={currentIdx === flow.length - 1} className="flex-1 py-2 rounded-lg text-xs text-white transition hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed" style={{ border: '1px solid rgba(255,255,255,0.2)' }}>下一個 →</button>
              {currentInfo.isManual ? (
                <button onClick={() => setManualIdx(null)} className="flex-1 py-2 rounded-lg text-xs text-white" style={{ background: '#3B82F6' }}>回到自動</button>
              ) : (
                <button onClick={() => setIsPaused(!isPaused)} className="px-3 py-2 rounded-lg text-xs text-white transition hover:bg-white/10" style={{ border: '1px solid rgba(255,255,255,0.2)' }}>
                  {isPaused ? <Play className="w-3.5 h-3.5 inline" /> : <Pause className="w-3.5 h-3.5 inline" />}
                </button>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
