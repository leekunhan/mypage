import { useState, useEffect, useCallback } from "react";

// ────────────────────────────────────────────
// 密碼保護
// SHA-256("finance") = eab762a...
// 要換密碼：console.log(await crypto.subtle.digest('SHA-256', new TextEncoder().encode('你的密碼')).then(b=>[...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,'0')).join('')))
// ────────────────────────────────────────────
const FINANCE_HASH = "eab762a03fd979a04cc4706e6536d382bc89d2d1356afcd054a16b2235ecd471";

function PasswordGate({ onUnlock }) {
  const [input, setInput] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const check = async () => {
    if (!input) return;
    setLoading(true);
    const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(input));
    const hex = Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, "0")).join("");
    if (hex === FINANCE_HASH) {
      sessionStorage.setItem("finance_unlocked", "1");
      onUnlock();
    } else {
      setError(true);
      setInput("");
      setTimeout(() => setError(false), 2000);
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#080810", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Georgia', serif" }}>
      <div style={{ background: "#0f0f1a", border: "1px solid #1e2e50", borderRadius: 16, padding: "44px 52px", width: 340, textAlign: "center" }}>
        <div style={{ fontSize: 10, letterSpacing: 4, color: "#76c442", textTransform: "uppercase", marginBottom: 10 }}>FINANCIAL DASHBOARD</div>
        <div style={{ fontSize: 28, marginBottom: 6 }}>🔒</div>
        <div style={{ fontSize: 18, color: "#f0ede4", marginBottom: 4 }}>存取限制</div>
        <div style={{ fontSize: 12, color: "#4a5a7b", marginBottom: 28 }}>請輸入密碼繼續</div>
        <input
          type="password"
          value={input}
          onChange={e => { setInput(e.target.value); setError(false); }}
          onKeyDown={e => e.key === "Enter" && check()}
          placeholder="密碼"
          autoFocus
          style={{
            width: "100%", background: "#1a2a3e",
            border: `1px solid ${error ? "#ef5350" : "#2a3a5a"}`,
            borderRadius: 8, color: "#e8f4ff", fontSize: 14,
            padding: "10px 14px", outline: "none", textAlign: "center",
            marginBottom: error ? 8 : 14, boxSizing: "border-box",
            transition: "border-color 0.2s"
          }}
        />
        {error && <div style={{ color: "#ef5350", fontSize: 12, marginBottom: 10 }}>密碼錯誤，請再試</div>}
        <button
          onClick={check}
          disabled={!input || loading}
          style={{
            width: "100%", background: input ? "#1a3a6e" : "#13131f",
            border: `1px solid ${input ? "#3a5a9e" : "#2a2a40"}`,
            color: input ? "#e8f4ff" : "#4a5a7b",
            borderRadius: 8, padding: "10px 0", fontSize: 13,
            cursor: input ? "pointer" : "default", transition: "all 0.2s"
          }}
        >
          {loading ? "驗證中..." : "進入"}
        </button>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────
// 預設資料
// ────────────────────────────────────────────
const DEFAULT_SALARY_MONTHS = [
  { month: "2025/10", netPay: 462202, esppAmount: 0, subtotalA: 505609, subtotalB: 43407, note: "到任獎金月" },
  { month: "2025/11", netPay: 64290, esppAmount: 22080, subtotalA: 89849, subtotalB: 25559, note: "" },
  { month: "2025/12", netPay: 66452, esppAmount: 22080, subtotalA: 92077, subtotalB: 25625, note: "" },
  { month: "2026/01", netPay: 144538, esppAmount: 46529, subtotalA: 198574, subtotalB: 54036, note: "年節獎金月" },
  { month: "2026/02", netPay: 79433, esppAmount: 28572, subtotalA: 115632, subtotalB: 36199, note: "" },
  { month: "2026/03", netPay: 80765, esppAmount: 28572, subtotalA: 116964, subtotalB: 36199, note: "" },
  { month: "2026/04", netPay: null, esppAmount: null, subtotalA: null, subtotalB: null, note: "待輸入" },
  { month: "2026/05", netPay: null, esppAmount: null, subtotalA: null, subtotalB: null, note: "轉正月（預估）" },
  { month: "2026/06", netPay: null, esppAmount: null, subtotalA: null, subtotalB: null, note: "端午獎金月" },
];

const DEFAULT_ASSETS = {
  cash: 185298,
  investment: 1576973,
  debt: 828807,
  etf0050: 0,
  lastUpdated: "2026/04/03",
};

const DEFAULT_STOCKS = {
  NVDA: { shares: 140, price: 177, color: "#76c442", range: [50, 600] },
  TSLA: { shares: 37, price: 361, color: "#ef5350", range: [50, 800] },
  PLTR: { shares: 28, price: 147, color: "#4fc3f7", range: [20, 400] },
  TSM:  { shares: 10, price: 339, color: "#ffb74d", range: [100, 600] },
  NBIS: { shares: 13, price: 107, color: "#ce93d8", range: [10, 300] },
  ASTS: { shares: 9,  price: 90,  color: "#81d4fa", range: [5, 200] },
  SOFI: { shares: 50, price: 16,  color: "#a5d6a7", range: [2, 60] },
  RKLB: { shares: 11, price: 68,  color: "#ff8a65", range: [5, 150] },
};

const DEFAULT_SETTINGS = {
  fxRate: 32,
  baseSalary: 128571,
  esppRate: 25,
  taxRate: 12,
  monthlyRent: 25000,
  mgmtFee: 2000,
  loanPayment: 10000,
  telecom: 1000,
  utilities: 1000,
  etfMonthly: 15000,
  livingExpense: 22700,
  rsuShares: 368,
  focalRsuShares: 10,
  loanBalance: 718000,
  loanRate: 2.5,
  loanTerm: 72,
};

const FX_DEFAULT = 32;
const fmt = (n) => {
  if (n === null || n === undefined || isNaN(n)) return "—";
  return Math.abs(Math.round(n)).toLocaleString("zh-TW");
};
const fmtSign = (n) => {
  if (!n) return "—";
  return (n >= 0 ? "+" : "") + Math.round(n).toLocaleString("zh-TW");
};

// ────────────────────────────────────────────
// 計算工具
// ────────────────────────────────────────────
function calcFuture(m, y, r) {
  const mr = r / 12, n = y * 12;
  return m * ((Math.pow(1 + mr, n) - 1) / mr) * (1 + mr);
}
function calcLoanBalance(P, annualRate, totalMonths, paidMonths) {
  const r = annualRate / 100 / 12;
  const monthly = P * r * Math.pow(1 + r, totalMonths) / (Math.pow(1 + r, totalMonths) - 1);
  let bal = P;
  for (let i = 0; i < paidMonths; i++) bal -= (monthly - bal * r);
  return Math.max(0, Math.round(bal));
}

// ────────────────────────────────────────────
// 子元件：可編輯數字
// ────────────────────────────────────────────
function EditableNum({ value, onChange, color = "#b8d4ff", prefix = "", suffix = "", min = 0, fontSize = 14, bold = false }) {
  const [editing, setEditing] = useState(false);
  const [tmp, setTmp] = useState("");

  const start = () => { setTmp(value !== null ? String(value) : ""); setEditing(true); };
  const commit = () => {
    const v = parseFloat(tmp.replace(/,/g, ""));
    if (!isNaN(v)) onChange(v);
    setEditing(false);
  };

  if (editing) return (
    <input
      autoFocus
      value={tmp}
      onChange={e => setTmp(e.target.value)}
      onBlur={commit}
      onKeyDown={e => { if (e.key === "Enter") commit(); if (e.key === "Escape") setEditing(false); }}
      style={{ width: 110, background: "#1a2a3e", border: "1px solid #4fc3f7", borderRadius: 4, color: "#e8f4ff", fontSize, padding: "2px 6px", textAlign: "right" }}
    />
  );

  return (
    <span
      onClick={start}
      title="點擊編輯"
      style={{ color: value === null ? "#3a4a5c" : color, fontWeight: bold ? "bold" : "normal", fontSize, cursor: "pointer", borderBottom: "1px dashed " + (value === null ? "#3a4a5c" : color + "80"), paddingBottom: 1 }}
    >
      {prefix}{value !== null && value !== undefined ? fmt(value) : "點擊輸入"}{suffix}
    </span>
  );
}

// ────────────────────────────────────────────
// 子元件：滑桿 + 輸入框
// ────────────────────────────────────────────
function SliderInput({ label, value, min, max, step = 1, onChange, color, unit = "" }) {
  const [inputVal, setInputVal] = useState(String(value));
  useEffect(() => { setInputVal(String(value)); }, [value]);

  return (
    <div style={{ background: "#0f0f1a", borderRadius: 8, padding: "10px 12px", border: `1px solid ${color}22` }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
        <span style={{ color, fontWeight: "bold", fontSize: 12 }}>{label}</span>
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <input
            value={inputVal}
            onChange={e => { setInputVal(e.target.value); const v = parseFloat(e.target.value); if (!isNaN(v) && v >= min && v <= max) onChange(v); }}
            onBlur={() => { const v = parseFloat(inputVal); if (isNaN(v) || v < min || v > max) setInputVal(String(value)); else onChange(v); }}
            style={{ width: 65, background: "#1a2a3e", border: "1px solid #3a3a5a", borderRadius: 4, color: "#e8f4ff", fontSize: 12, padding: "2px 5px", textAlign: "right" }}
          />
          <span style={{ color: "#6a7a9b", fontSize: 11 }}>{unit}</span>
        </div>
      </div>
      <input
        type="range" min={min} max={max} step={step} value={value}
        onChange={e => onChange(Number(e.target.value))}
        style={{ width: "100%", accentColor: color, height: 4 }}
      />
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 2 }}>
        <span style={{ fontSize: 9, color: "#3a4a5c" }}>{min}{unit}</span>
        <span style={{ fontSize: 9, color: "#3a4a5c" }}>{max}{unit}</span>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────
// 主元件
// ────────────────────────────────────────────
const TABS = [
  { id: "dashboard", label: "🏠 總覽" },
  { id: "salary", label: "💼 薪資" },
  { id: "assets", label: "💰 資產" },
  { id: "forecast2712", label: "🎯 2027/12" },
  { id: "rsu", label: "📈 RSU" },
  { id: "cashflow", label: "💸 現金流" },
  { id: "settings", label: "⚙️ 設定" },
];

export default function Dashboard() {
  const [tab, setTab] = useState("dashboard");
  const [unlocked, setUnlocked] = useState(false);

  // ── 持久化狀態 ──
  const [salaryMonths, setSalaryMonths] = useState(DEFAULT_SALARY_MONTHS);
  const [assets, setAssets] = useState(DEFAULT_ASSETS);
  const [stocks, setStocks] = useState(DEFAULT_STOCKS);
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [loaded, setLoaded] = useState(false);

  // 檢查 session 是否已解鎖
  useEffect(() => {
    if (sessionStorage.getItem("finance_unlocked") === "1") setUnlocked(true);
  }, []);

  // 從 localStorage 載入
  useEffect(() => {
    if (!unlocked) return;
    try {
      const r1 = localStorage.getItem("salary_months");
      if (r1) setSalaryMonths(JSON.parse(r1));
      const r2 = localStorage.getItem("assets");
      if (r2) setAssets(JSON.parse(r2));
      const r3 = localStorage.getItem("stocks");
      if (r3) setStocks(JSON.parse(r3));
      const r4 = localStorage.getItem("settings");
      if (r4) setSettings(JSON.parse(r4));
    } catch (e) { /* 第一次使用，忽略 */ }
    setLoaded(true);
  }, [unlocked]);

  // 儲存到 localStorage
  const save = useCallback((key, data) => {
    try { localStorage.setItem(key, JSON.stringify(data)); } catch (e) { console.error("儲存失敗", e); }
  }, []);

  const updateSalaryMonth = (idx, field, val) => {
    const updated = salaryMonths.map((m, i) => i === idx ? { ...m, [field]: val } : m);
    setSalaryMonths(updated);
    save("salary_months", updated);
  };

  const updateAsset = (field, val) => {
    const updated = { ...assets, [field]: val, lastUpdated: new Date().toLocaleDateString("zh-TW") };
    setAssets(updated);
    save("assets", updated);
  };

  const updateStock = (ticker, field, val) => {
    const updated = { ...stocks, [ticker]: { ...stocks[ticker], [field]: val } };
    setStocks(updated);
    save("stocks", updated);
  };

  const updateSettings = (field, val) => {
    const updated = { ...settings, [field]: val };
    setSettings(updated);
    save("settings", updated);
  };

  const addSalaryMonth = () => {
    const last = salaryMonths[salaryMonths.length - 1];
    const [y, m] = last.month.split("/").map(Number);
    const nm = m === 12 ? `${y + 1}/01` : `${y}/${String(m + 1).padStart(2, "0")}`;
    const updated = [...salaryMonths, { month: nm, netPay: null, esppAmount: null, subtotalA: null, subtotalB: null, note: "" }];
    setSalaryMonths(updated);
    save("salary_months", updated);
  };

  if (!unlocked) return <PasswordGate onUnlock={() => setUnlocked(true)} />;
  if (!loaded) return <div style={{ background: "#080810", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", color: "#76c442", fontSize: 14 }}>載入中...</div>;

  // ── 計算派生數值 ──
  const FX = settings.fxRate || FX_DEFAULT;
  const currentStockVal = Object.entries(stocks).reduce((s, [t, d]) => s + (d.shares || 0) * (d.price || 0) * FX, 0);
  const currentNetWorth = (assets.cash || 0) + currentStockVal + (assets.etf0050 || 0) - (assets.debt || 0);

  const validMonths = salaryMonths.filter(m => m.netPay !== null);
  const totalNetPay = validMonths.reduce((s, m) => s + (m.netPay || 0), 0);
  const totalEspp = validMonths.reduce((s, m) => s + (m.esppAmount || 0), 0);

  const monthlyFixed = (settings.monthlyRent || 0) + (settings.mgmtFee || 0) + (settings.loanPayment || 0) + (settings.telecom || 0) + (settings.utilities || 0);
  const monthlyIncome = settings.baseSalary || 0;
  const esppMonthly = Math.round(monthlyIncome * (settings.esppRate || 0) / 100);
  const monthlyNetEst = monthlyIncome - esppMonthly - 5700 + 1346;
  const monthlySurplus = monthlyNetEst - monthlyFixed - (settings.etfMonthly || 0) - (settings.livingExpense || 0);

  // 2027/12 預估
  const espp2608 = Math.floor(((22080 + 22080 + 46529 + 28572 + 28572 + esppMonthly * 3) / FX) / (stocks.NVDA.price * 0.85));
  const espp2702 = Math.floor((esppMonthly * 9 / FX) / (stocks.NVDA.price * 0.85));
  const rsuVests = [
    { date: "2026/09", q: "Q1", shares: Math.round(settings.rsuShares * 0.10), isFocal: false },
    { date: "2026/12", q: "Q2", shares: Math.round(settings.rsuShares * 0.10), isFocal: false },
    { date: "2027/03", q: "Q3", shares: Math.round(settings.rsuShares * 0.10), isFocal: false },
    { date: "2027/06", q: "Q4", shares: Math.round(settings.rsuShares * 0.10), isFocal: false },
    { date: "2027/06", q: "Focal Q1", shares: settings.focalRsuShares || 10, isFocal: true },
    { date: "2027/09", q: "Q5", shares: Math.round(settings.rsuShares * 0.075), isFocal: false },
    { date: "2027/12", q: "Q6", shares: Math.round(settings.rsuShares * 0.075), isFocal: false },
  ];
  const totalRsuShares = rsuVests.reduce((s, v) => s + v.shares, 0);
  const totalNvda2712 = (stocks.NVDA.shares || 0) + espp2608 + totalRsuShares + espp2702;
  const rsuTaxDyn = Math.round(rsuVests.reduce((s, v) => s + v.shares * stocks.NVDA.price * FX * (settings.taxRate / 100), 0));

  const cashFlowItems = [
    { label: "現有現金", value: assets.cash || 0 },
    { label: "2026/04~05 結餘（2個月）", value: Math.max(0, monthlySurplus) * 2 },
    { label: "2026/06 端午獎金", value: Math.round(settings.baseSalary * 0.5) },
    { label: "2026/06~12 月結餘（7個月）", value: Math.max(0, monthlySurplus) * 7 },
    { label: "2026/09 中秋獎金", value: Math.round(settings.baseSalary * 0.5) },
    { label: "2027/01 年終獎金", value: settings.baseSalary },
    { label: "2027/01~12 月結餘（12個月）", value: Math.max(0, monthlySurplus) * 12 },
    { label: "2027/06 端午獎金", value: Math.round(settings.baseSalary * 0.5) },
    { label: "2027/09 中秋獎金", value: Math.round(settings.baseSalary * 0.5) },
  ];
  const totalCash2712 = cashFlowItems.reduce((s, i) => s + i.value, 0);

  const otherStock2712 = Object.entries(stocks).filter(([t]) => t !== "NVDA").reduce((s, [t, d]) => s + (d.shares || 0) * (d.price || 0) * FX, 0);
  const nvdaStock2712 = totalNvda2712 * (stocks.NVDA.price || 0) * FX;
  const totalStock2712 = nvdaStock2712 + otherStock2712;

  const etf2712 = calcFuture(settings.etfMonthly || 0, 21 / 12, 0.12);
  const loan2712 = calcLoanBalance(settings.loanBalance || 0, settings.loanRate || 2.5, settings.loanTerm || 72, 12);
  const netWorth2712 = totalCash2712 + totalStock2712 + etf2712 - rsuTaxDyn - loan2712;

  // RSU 完整時間表
  const rsuSchedule = (() => {
    const pcts = [...Array(4).fill(10), ...Array(4).fill(7.5), ...Array(4).fill(5), ...Array(4).fill(2.5)];
    const dates = ["2026/09/17","2026/12/10","2027/03/17","2027/06/18","2027/09/17","2027/12/10","2028/03/19","2028/06/18","2028/09/17","2028/12/10","2029/03/19","2029/06/18","2029/09/17","2029/12/10","2030/03/19","2030/06/18"];
    const yls = [...Array(4).fill("第1年(40%)"),...Array(4).fill("第2年(30%)"),...Array(4).fill("第3年(20%)"),...Array(4).fill("第4年(10%)")];
    let cum = 0;
    return pcts.map((p, i) => { const sh = Math.round((settings.rsuShares || 0) * p / 100); cum += sh; return { q: i + 1, date: dates[i], year: yls[i], pct: p, shares: sh, cumulative: cum }; });
  })();

  // ── UI helpers ──
  const SectionTitle = ({ children, color = "#8a9bb8" }) => (
    <div style={{ fontSize: 10, letterSpacing: 3, color, textTransform: "uppercase", marginBottom: 10 }}>{children}</div>
  );

  const Card = ({ label, value, color, sub, editable, onEdit }) => (
    <div style={{ background: "#13131f", border: `1px solid ${color}22`, borderRadius: 11, padding: "14px 16px", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: color }} />
      <div style={{ fontSize: 10, color: "#4a5a7b", marginBottom: 2 }}>{sub}</div>
      <div style={{ fontSize: 11, color: "#8a9bb8", marginBottom: 4 }}>{label}</div>
      {editable
        ? <EditableNum value={value} onChange={onEdit} color={color} fontSize={20} bold />
        : <div style={{ fontSize: 20, color, fontWeight: "bold" }}>{fmt(value)}</div>
      }
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "#080810", color: "#e8e4d9", fontFamily: "'Georgia', serif" }}>
      {/* Header */}
      <div style={{ background: "linear-gradient(135deg,#10102a,#0d1f3c)", padding: "16px 20px 11px", borderBottom: "1px solid #1e2e50" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 10, letterSpacing: 4, color: "#76c442", textTransform: "uppercase", marginBottom: 2 }}>NVIDIA · Lee, Kun-Han · ID 53740</div>
            <h1 style={{ margin: 0, fontSize: 17, fontWeight: "normal", color: "#f0ede4" }}>個人財務總覽</h1>
            <div style={{ fontSize: 10, color: "#4a5a7b", marginTop: 1 }}>最後更新：{assets.lastUpdated}</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 10, color: "#6a7a9b", marginBottom: 1 }}>現在淨資產</div>
            <div style={{ fontSize: 22, color: "#76c442", fontWeight: "bold" }}>NT$ {fmt(currentNetWorth)}</div>
            <div style={{ fontSize: 10, color: "#4a8a4a", marginTop: 1 }}>→ 2027/12 預估 NT$ {fmt(netWorth2712)}</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ padding: "8px 20px 0", display: "flex", gap: 3, flexWrap: "wrap" }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{ background: tab === t.id ? "#1a3a6e" : "transparent", border: tab === t.id ? "1px solid #3a5a9e" : "1px solid #2a2a40", color: tab === t.id ? "#e8f4ff" : "#6a7a9b", borderRadius: 7, padding: "5px 11px", fontSize: 11, cursor: "pointer" }}>{t.label}</button>
        ))}
      </div>

      {/* ── 總覽 ── */}
      {tab === "dashboard" && (
        <div style={{ padding: "14px 20px 40px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 9, marginBottom: 14 }}>
            <Card label="流動現金" value={assets.cash} color="#4fc3f7" sub="郵局・台新・LINEBANK" editable onEdit={v => updateAsset("cash", v)} />
            <Card label="股票投資" value={currentStockVal} color="#76c442" sub="嘉信（按當前股價）" />
            <Card label="0050 ETF" value={assets.etf0050} color="#ce93d8" sub="定期定額累計" editable onEdit={v => updateAsset("etf0050", v)} />
            <Card label="負債" value={assets.debt} color="#ef5350" sub="信貸+信用卡" editable onEdit={v => updateAsset("debt", v)} />
          </div>

          {/* 淨資產 */}
          <div style={{ background: "linear-gradient(135deg,#0a1a0a,#0d2a1a)", border: "1px solid #2a5a2a", borderRadius: 12, padding: "15px 20px", marginBottom: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <div>
                <div style={{ fontSize: 10, color: "#4a8a4a", letterSpacing: 2, textTransform: "uppercase" }}>淨資產</div>
                <div style={{ fontSize: 11, color: "#6a8a6a", marginTop: 1 }}>負債比 {assets.debt > 0 ? ((assets.debt / (assets.cash + currentStockVal)) * 100).toFixed(1) : 0}%</div>
              </div>
              <div style={{ fontSize: 28, color: "#76c442", fontWeight: "bold" }}>NT$ {fmt(currentNetWorth)}</div>
            </div>
            <div style={{ display: "flex", gap: 2, height: 14, borderRadius: 3, overflow: "hidden" }}>
              {[{ v: assets.cash, c: "#4fc3f7", l: "現金" }, { v: currentStockVal - assets.debt, c: "#76c442", l: "淨投資" }].map(s => {
                const total = Math.max(1, currentNetWorth);
                const pct = Math.max(0, (s.v / total) * 100);
                return <div key={s.l} style={{ width: `${pct}%`, background: s.c, opacity: 0.8, display: "flex", alignItems: "center", justifyContent: "center" }}><span style={{ fontSize: 8, color: "#000", fontWeight: "bold" }}>{s.l}</span></div>;
              })}
            </div>
          </div>

          {/* 持股 */}
          <div style={{ background: "#13131f", border: "1px solid #2a2a40", borderRadius: 12, overflow: "hidden", marginBottom: 14 }}>
            <div style={{ padding: "9px 13px", borderBottom: "1px solid #2a2a40", background: "#1a1a2e", display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontSize: 10, letterSpacing: 2, color: "#8a9bb8", textTransform: "uppercase" }}>嘉信持股（點擊編輯）</span>
              <span style={{ fontSize: 10, color: "#4a5a7b" }}>股數 / 股價 / 市值</span>
            </div>
            {Object.entries(stocks).map(([ticker, d], i) => {
              const val = (d.shares || 0) * (d.price || 0) * FX;
              const pct = currentStockVal > 0 ? (val / currentStockVal * 100) : 0;
              return (
                <div key={ticker} style={{ display: "flex", alignItems: "center", padding: "7px 13px", borderBottom: "1px solid #1a1a2e", background: i % 2 === 0 ? "#0f0f1a" : "#13131f", gap: 8 }}>
                  <div style={{ width: 40, color: d.color, fontWeight: "bold", fontSize: 11 }}>{ticker}</div>
                  <EditableNum value={d.shares} onChange={v => updateStock(ticker, "shares", Math.round(v))} color="#6a7a9b" fontSize={11} suffix="股" />
                  <span style={{ color: "#3a4a5c", fontSize: 10 }}>@</span>
                  <EditableNum value={d.price} onChange={v => updateStock(ticker, "price", v)} color={d.color} fontSize={11} prefix="$" />
                  <div style={{ flex: 1, margin: "0 6px" }}><div style={{ height: 3, background: "#1a2a3e", borderRadius: 2, overflow: "hidden" }}><div style={{ width: `${pct}%`, height: "100%", background: d.color, opacity: 0.7 }} /></div></div>
                  <div style={{ width: 38, textAlign: "right", color: "#6a7a9b", fontSize: 10 }}>{pct.toFixed(0)}%</div>
                  <div style={{ width: 78, textAlign: "right", color: d.color, fontSize: 11, fontWeight: "bold" }}>{fmt(val)}</div>
                </div>
              );
            })}
            <div style={{ display: "flex", justifyContent: "space-between", padding: "9px 13px", background: "#1a1a2e" }}>
              <span style={{ color: "#76c442", fontSize: 11, fontWeight: "bold" }}>合計</span>
              <span style={{ color: "#76c442", fontSize: 13, fontWeight: "bold" }}>{fmt(currentStockVal)}</span>
            </div>
          </div>

          {/* 薪資摘要 */}
          <div style={{ background: "#13131f", border: "1px solid #2a2a40", borderRadius: 12, overflow: "hidden" }}>
            <div style={{ padding: "9px 13px", borderBottom: "1px solid #2a2a40", background: "#1a1a2e" }}><span style={{ fontSize: 10, letterSpacing: 2, color: "#8a9bb8", textTransform: "uppercase" }}>薪資記錄摘要</span></div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 0 }}>
              {[{ label: "累計實領", value: totalNetPay, color: "#76c442" }, { label: "累計ESPP", value: totalEspp, color: "#4fc3f7" }, { label: "已記錄月份", value: `${validMonths.length} 個月`, color: "#ffb74d", noFmt: true }].map(c => (
                <div key={c.label} style={{ padding: "12px 14px", borderRight: "1px solid #2a2a40" }}>
                  <div style={{ fontSize: 10, color: "#4a5a7b", marginBottom: 2 }}>{c.label}</div>
                  <div style={{ fontSize: 16, color: c.color, fontWeight: "bold" }}>{c.noFmt ? c.value : fmt(c.value)}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── 薪資 ── */}
      {tab === "salary" && (
        <div style={{ padding: "14px 20px 40px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <SectionTitle>月薪記錄（點擊數字可編輯）</SectionTitle>
            <button onClick={addSalaryMonth} style={{ background: "#1a3a6e", border: "1px solid #3a5a9e", color: "#4fc3f7", borderRadius: 7, padding: "5px 13px", fontSize: 11, cursor: "pointer" }}>+ 新增月份</button>
          </div>

          <div style={{ background: "#13131f", border: "1px solid #2a2a40", borderRadius: 12, overflow: "hidden", marginBottom: 14 }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
              <thead>
                <tr style={{ background: "#1a1a2e" }}>
                  {["月份", "應發(A)", "應扣(B)", "實領", "ESPP", "備註"].map(h => (
                    <th key={h} style={{ padding: "8px 11px", textAlign: ["應發(A)", "應扣(B)", "實領", "ESPP"].includes(h) ? "right" : "left", color: "#6a7a9b", fontWeight: "normal", fontSize: 10, borderBottom: "1px solid #2a2a40" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {salaryMonths.map((m, i) => (
                  <tr key={m.month} style={{ background: i % 2 === 0 ? "#0f0f1a" : "#13131f" }}>
                    <td style={{ padding: "8px 11px", color: "#e8e4d9", fontWeight: "bold", fontSize: 12 }}>{m.month}</td>
                    <td style={{ padding: "8px 11px", textAlign: "right" }}>
                      <EditableNum value={m.subtotalA} onChange={v => updateSalaryMonth(i, "subtotalA", v)} color="#b8d4ff" />
                    </td>
                    <td style={{ padding: "8px 11px", textAlign: "right" }}>
                      <EditableNum value={m.subtotalB} onChange={v => updateSalaryMonth(i, "subtotalB", v)} color="#ef9a9a" />
                    </td>
                    <td style={{ padding: "8px 11px", textAlign: "right" }}>
                      <EditableNum value={m.netPay} onChange={v => updateSalaryMonth(i, "netPay", v)} color="#76c442" bold />
                    </td>
                    <td style={{ padding: "8px 11px", textAlign: "right" }}>
                      <EditableNum value={m.esppAmount} onChange={v => updateSalaryMonth(i, "esppAmount", v)} color="#4fc3f7" />
                    </td>
                    <td style={{ padding: "8px 11px" }}>
                      <input
                        value={m.note || ""}
                        onChange={e => updateSalaryMonth(i, "note", e.target.value)}
                        placeholder="備註"
                        style={{ background: "transparent", border: "none", borderBottom: "1px dashed #2a2a40", color: "#6a7a9b", fontSize: 10, width: "100%", outline: "none" }}
                      />
                    </td>
                  </tr>
                ))}
                <tr style={{ background: "#1a1a2e", borderTop: "2px solid #3a5a9e" }}>
                  <td style={{ padding: "8px 11px", color: "#8a9bb8", fontWeight: "bold" }}>合計</td>
                  <td style={{ padding: "8px 11px", textAlign: "right", color: "#b8d4ff", fontWeight: "bold" }}>{fmt(validMonths.reduce((s, m) => s + (m.subtotalA || 0), 0))}</td>
                  <td style={{ padding: "8px 11px", textAlign: "right", color: "#ef9a9a", fontWeight: "bold" }}>{fmt(validMonths.reduce((s, m) => s + (m.subtotalB || 0), 0))}</td>
                  <td style={{ padding: "8px 11px", textAlign: "right", color: "#76c442", fontWeight: "bold", fontSize: 13 }}>{fmt(totalNetPay)}</td>
                  <td style={{ padding: "8px 11px", textAlign: "right", color: "#4fc3f7", fontWeight: "bold" }}>{fmt(totalEspp)}</td>
                  <td />
                </tr>
              </tbody>
            </table>
          </div>

          <div style={{ background: "#0f1a2e", border: "1px solid #1a2a4e", borderRadius: 10, padding: "12px 14px", fontSize: 11, color: "#6a8ab8", lineHeight: 2 }}>
            <div style={{ color: "#7aacdc", marginBottom: 4, fontSize: 10, letterSpacing: 2 }}>💡 使用說明</div>
            <div>• 點擊任何數字可直接編輯，Enter 確認，Esc 取消</div>
            <div>• 點擊「+ 新增月份」可新增下個月的記錄</div>
            <div>• 所有資料自動儲存，下次開啟仍會保留</div>
            <div>• 「待輸入」欄位顯示為灰色虛線，點擊後輸入實際金額</div>
          </div>
        </div>
      )}

      {/* ── 資產 ── */}
      {tab === "assets" && (
        <div style={{ padding: "14px 20px 40px" }}>
          <SectionTitle>資產負債（點擊數字可編輯）</SectionTitle>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 11, marginBottom: 14 }}>
            <div style={{ background: "#13131f", border: "1px solid #2a3a5c", borderRadius: 12, overflow: "hidden" }}>
              <div style={{ padding: "9px 13px", background: "#1a1a2e", borderBottom: "1px solid #2a3a5c" }}><span style={{ fontSize: 10, letterSpacing: 2, color: "#4fc3f7", textTransform: "uppercase" }}>資產</span></div>
              {[
                { label: "流動現金（郵局+台新+LINEBANK）", field: "cash", color: "#4fc3f7" },
                { label: "0050 ETF 累計市值", field: "etf0050", color: "#ce93d8" },
              ].map(r => (
                <div key={r.field} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 13px", borderBottom: "1px solid #1a1a2e" }}>
                  <span style={{ color: "#8a9bb8", fontSize: 12 }}>{r.label}</span>
                  <EditableNum value={assets[r.field]} onChange={v => updateAsset(r.field, v)} color={r.color} bold />
                </div>
              ))}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 13px", borderBottom: "1px solid #1a1a2e" }}>
                <span style={{ color: "#8a9bb8", fontSize: 12 }}>股票帳戶（嘉信，自動計算）</span>
                <span style={{ color: "#76c442", fontWeight: "bold", fontSize: 13 }}>{fmt(currentStockVal)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 13px", background: "#0a1a2a" }}>
                <span style={{ color: "#4fc3f7", fontSize: 12, fontWeight: "bold" }}>資產合計</span>
                <span style={{ color: "#4fc3f7", fontSize: 14, fontWeight: "bold" }}>{fmt((assets.cash || 0) + currentStockVal + (assets.etf0050 || 0))}</span>
              </div>
            </div>
            <div style={{ background: "#13131f", border: "1px solid #3a2a2a", borderRadius: 12, overflow: "hidden" }}>
              <div style={{ padding: "9px 13px", background: "#1a1a2e", borderBottom: "1px solid #3a2a2a" }}><span style={{ fontSize: 10, letterSpacing: 2, color: "#ef5350", textTransform: "uppercase" }}>負債</span></div>
              {[
                { label: "台新信貸（長期負債）", field: "debt", color: "#ef5350" },
              ].map(r => (
                <div key={r.field} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 13px", borderBottom: "1px solid #1a1a2e" }}>
                  <span style={{ color: "#8a9bb8", fontSize: 12 }}>{r.label}</span>
                  <EditableNum value={assets[r.field]} onChange={v => updateAsset(r.field, v)} color={r.color} bold />
                </div>
              ))}
              <div style={{ padding: "10px 13px", fontSize: 10, color: "#4a5a7b", lineHeight: 1.7 }}>
                ※ 信用卡每月全額繳清，不計入長期負債<br />
                ※ 每月底收到帳單後更新此數字
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 13px", background: "#1a0d0d" }}>
                <span style={{ color: "#ef5350", fontSize: 12, fontWeight: "bold" }}>負債合計</span>
                <span style={{ color: "#ef5350", fontSize: 14, fontWeight: "bold" }}>{fmt(assets.debt || 0)}</span>
              </div>
            </div>
          </div>

          {/* 股票編輯 + 滑桿 */}
          <SectionTitle>股票持倉（股數 + 股價滑桿）</SectionTitle>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
            {Object.entries(stocks).map(([ticker, d]) => {
              const val = (d.shares || 0) * (d.price || 0) * FX;
              return (
                <div key={ticker} style={{ background: "#0f0f1a", borderRadius: 9, padding: "11px 12px", border: `1px solid ${d.color}22` }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ color: d.color, fontWeight: "bold", fontSize: 13 }}>{ticker}</span>
                      <EditableNum value={d.shares} onChange={v => updateStock(ticker, "shares", Math.round(v))} color="#6a7a9b" fontSize={11} suffix="股" />
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: 13, color: d.color, fontWeight: "bold" }}>{fmt(val)}</div>
                      <div style={{ fontSize: 10, color: "#6a7a9b" }}>@${d.price}</div>
                    </div>
                  </div>
                  <input
                    type="range"
                    min={d.range[0]} max={d.range[1]}
                    step={ticker === "SOFI" ? 0.5 : 5}
                    value={d.price || 0}
                    onChange={e => updateStock(ticker, "price", Number(e.target.value))}
                    style={{ width: "100%", accentColor: d.color, height: 4 }}
                  />
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: 2 }}>
                    <span style={{ fontSize: 9, color: "#3a4a5c" }}>${d.range[0]}</span>
                    <span style={{ fontSize: 9, color: "#3a4a5c" }}>${d.range[1]}</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#13131f", border: "1px solid #2a2a40", borderRadius: 10, padding: "12px 16px" }}>
            <span style={{ fontSize: 12, color: "#8a9bb8" }}>最後更新：{assets.lastUpdated}</span>
            <button onClick={() => updateAsset("lastUpdated", new Date().toLocaleDateString("zh-TW"))} style={{ background: "#1a3a6e", border: "1px solid #3a5a9e", color: "#4fc3f7", borderRadius: 6, padding: "5px 13px", fontSize: 11, cursor: "pointer" }}>📅 更新日期</button>
          </div>
        </div>
      )}

      {/* ── 2027/12 ── */}
      {tab === "forecast2712" && (
        <div style={{ padding: "14px 20px 40px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 9, marginBottom: 13 }}>
            {[
              { label: "現金累積", value: totalCash2712, color: "#4fc3f7", sub: "含獎金結餘" },
              { label: "美股總值", value: totalStock2712, color: "#76c442", sub: "NVDA+其他" },
              { label: "0050 ETF", value: etf2712, color: "#ce93d8", sub: "21個月12%複利" },
              { label: "信貸餘額", value: loan2712, color: "#ef5350", sub: "轉貸後還12期" },
            ].map(c => (
              <div key={c.label} style={{ background: "#13131f", border: `1px solid ${c.color}22`, borderRadius: 10, padding: "12px 13px", position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: c.color }} />
                <div style={{ fontSize: 10, color: "#4a5a7b", marginBottom: 2 }}>{c.sub}</div>
                <div style={{ fontSize: 11, color: "#8a9bb8", marginBottom: 3 }}>{c.label}</div>
                <div style={{ fontSize: 17, color: c.color, fontWeight: "bold" }}>{fmt(c.value)}</div>
              </div>
            ))}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 11, marginBottom: 13 }}>
            {/* 現金流 */}
            <div style={{ background: "#13131f", border: "1px solid #2a3a5c", borderRadius: 12, overflow: "hidden" }}>
              <div style={{ padding: "9px 13px", background: "#1a1a2e", borderBottom: "1px solid #2a3a5c" }}><span style={{ fontSize: 10, letterSpacing: 2, color: "#4fc3f7", textTransform: "uppercase" }}>💵 現金流明細</span></div>
              {cashFlowItems.map((item, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "6px 13px", borderBottom: "1px solid #1a1a2e", background: i % 2 === 0 ? "#0f0f1a" : "#13131f" }}>
                  <span style={{ color: "#8a9bb8", fontSize: 10 }}>{item.label}</span>
                  <span style={{ color: "#4fc3f7", fontSize: 11, fontWeight: "bold" }}>+{fmt(item.value)}</span>
                </div>
              ))}
              <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 13px", background: "#0a1a2e" }}>
                <span style={{ color: "#4fc3f7", fontWeight: "bold", fontSize: 11 }}>現金合計</span>
                <span style={{ color: "#4fc3f7", fontWeight: "bold", fontSize: 13 }}>{fmt(totalCash2712)}</span>
              </div>
            </div>

            {/* 股票預估 */}
            <div style={{ background: "#13131f", border: "1px solid #2a5a2a", borderRadius: 12, overflow: "hidden" }}>
              <div style={{ padding: "9px 13px", background: "#1a1a2e", borderBottom: "1px solid #2a5a2a" }}><span style={{ fontSize: 10, letterSpacing: 2, color: "#76c442", textTransform: "uppercase" }}>📈 股票預估（NVDA @${stocks.NVDA.price}）</span></div>
              {[
                { label: `現有 NVDA（${stocks.NVDA.shares}股）`, value: stocks.NVDA.shares * stocks.NVDA.price * FX, color: "#76c442" },
                { label: `ESPP 26/08（估${espp2608}股）`, value: espp2608 * stocks.NVDA.price * FX, color: "#76c442" },
                { label: `RSU Vest（${totalRsuShares}股）`, value: totalRsuShares * stocks.NVDA.price * FX, color: "#ffb74d" },
                { label: `ESPP 27/02（估${espp2702}股）`, value: espp2702 * stocks.NVDA.price * FX, color: "#76c442" },
                { label: "其他持股", value: otherStock2712, color: "#4fc3f7" },
              ].map((r, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "6px 13px", borderBottom: "1px solid #1a1a2e", background: i % 2 === 0 ? "#0f0f1a" : "#13131f" }}>
                  <span style={{ color: "#8a9bb8", fontSize: 10 }}>{r.label}</span>
                  <span style={{ color: r.color, fontSize: 11, fontWeight: "bold" }}>{fmt(r.value)}</span>
                </div>
              ))}
              <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 13px", background: "#0a1a0a" }}>
                <span style={{ color: "#76c442", fontWeight: "bold", fontSize: 11 }}>股票合計 ({totalNvda2712}股NVDA+其他)</span>
                <span style={{ color: "#76c442", fontWeight: "bold", fontSize: 13 }}>{fmt(totalStock2712)}</span>
              </div>
            </div>
          </div>

          {/* RSU 稅 */}
          <div style={{ background: "#13131f", border: "1px solid #ef535040", borderRadius: 12, overflow: "hidden", marginBottom: 13 }}>
            <div style={{ padding: "9px 13px", background: "#1a1a2e", borderBottom: "1px solid #2a2a40" }}><span style={{ fontSize: 10, letterSpacing: 2, color: "#ef5350", textTransform: "uppercase" }}>⚠️ RSU Vest 稅負（{settings.taxRate}%）</span></div>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
              <thead><tr style={{ background: "#111120" }}>{["日期", "季次", "股數", "市值", "稅額"].map(h => <th key={h} style={{ padding: "6px 11px", textAlign: ["市值", "稅額"].includes(h) ? "right" : "left", color: "#6a7a9b", fontWeight: "normal", fontSize: 10, borderBottom: "1px solid #2a2a40" }}>{h}</th>)}</tr></thead>
              <tbody>
                {rsuVests.map((v, i) => {
                  const val = v.shares * (stocks.NVDA.price || 0) * FX;
                  const tax = Math.round(val * settings.taxRate / 100);
                  return (
                    <tr key={i} style={{ background: i % 2 === 0 ? "#0f0f1a" : "#13131f" }}>
                      <td style={{ padding: "6px 11px", color: "#b0c4de" }}>{v.date}</td>
                      <td style={{ padding: "6px 11px", color: v.isFocal ? "#ce93d8" : "#ffb74d", fontWeight: "bold" }}>{v.q}</td>
                      <td style={{ padding: "6px 11px", color: "#8a9bb8" }}>{v.shares}</td>
                      <td style={{ padding: "6px 11px", textAlign: "right", color: "#b8d4ff" }}>{fmt(val)}</td>
                      <td style={{ padding: "6px 11px", textAlign: "right", color: "#ef9a9a", fontWeight: "bold" }}>{fmt(tax)}</td>
                    </tr>
                  );
                })}
                <tr style={{ background: "#1a1a2e", borderTop: "2px solid #3a2a2a" }}>
                  <td colSpan={4} style={{ padding: "7px 11px", color: "#ef5350", fontWeight: "bold" }}>合計</td>
                  <td style={{ padding: "7px 11px", textAlign: "right", color: "#ef5350", fontWeight: "bold" }}>{fmt(rsuTaxDyn)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* 總結 */}
          <div style={{ background: "linear-gradient(135deg,#0a1f0a,#0d2a1a)", border: "1px solid #2a5a2a", borderRadius: 12, padding: "15px 19px" }}>
            <div style={{ fontSize: 10, letterSpacing: 3, color: "#4a8a4a", textTransform: "uppercase", marginBottom: 10 }}>🎯 2027/12 淨資產總結</div>
            {[
              { label: "現金合計", value: totalCash2712, color: "#4fc3f7", sign: "+" },
              { label: "美股合計", value: totalStock2712, color: "#76c442", sign: "+" },
              { label: "0050 ETF", value: etf2712, color: "#ce93d8", sign: "+" },
              { label: "RSU 稅負", value: rsuTaxDyn, color: "#ef9a9a", sign: "−" },
              { label: "信貸餘額", value: loan2712, color: "#ef5350", sign: "−" },
            ].map(r => (
              <div key={r.label} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid #1a3a1a" }}>
                <span style={{ color: "#8a9ab8", fontSize: 12 }}>{r.sign} {r.label}</span>
                <span style={{ color: r.color, fontSize: 13, fontWeight: "bold" }}>{fmt(r.value)}</span>
              </div>
            ))}
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10, paddingTop: 10, borderTop: "2px solid #3a6a3a" }}>
              <div>
                <div style={{ fontSize: 11, color: "#4a8a4a" }}>預估淨資產</div>
                <div style={{ fontSize: 11, color: "#4a6a4a", marginTop: 1 }}>vs 現在 +{fmt(netWorth2712 - currentNetWorth)}</div>
              </div>
              <div style={{ fontSize: 28, color: "#76c442", fontWeight: "bold" }}>NT$ {fmt(netWorth2712)}</div>
            </div>
            <div style={{ marginTop: 7, fontSize: 10, color: "#3a5a3a", lineHeight: 1.6 }}>※ 股票以資產頁面設定股價估算 ／ RSU稅以設定頁稅率粗估 ／ 所有數字可在設定頁調整</div>
          </div>
        </div>
      )}

      {/* ── RSU ── */}
      {tab === "rsu" && (
        <div style={{ padding: "14px 20px 40px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 13 }}>
            {[
              { label: "總股數", value: `${settings.rsuShares} 股`, color: "#76c442", sub: "New Hire RSU（可在設定修改）" },
              { label: "Grant 日", value: "2026/06", color: "#ffb74d", sub: "5月入職→6月第6個工作天" },
              { label: "第一次 Vest", value: "2026/09", color: "#4fc3f7", sub: "4~6月grant→9月首次vest" },
            ].map(c => (
              <div key={c.label} style={{ background: "#13131f", border: `1px solid ${c.color}22`, borderRadius: 10, padding: "12px 13px", position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: c.color }} />
                <div style={{ fontSize: 10, color: "#4a5a7b", marginBottom: 2 }}>{c.sub}</div>
                <div style={{ fontSize: 11, color: "#8a9bb8", marginBottom: 3 }}>{c.label}</div>
                <div style={{ fontSize: 15, color: c.color, fontWeight: "bold" }}>{c.value}</div>
              </div>
            ))}
          </div>

          <div style={{ background: "#13131f", border: "1px solid #2a2a40", borderRadius: 12, overflow: "hidden", marginBottom: 13 }}>
            <div style={{ padding: "9px 13px", borderBottom: "1px solid #2a2a40", background: "#1a1a2e", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 10, letterSpacing: 2, color: "#8a9bb8", textTransform: "uppercase" }}>RSU 16季時間表</span>
              <span style={{ fontSize: 10, color: "#4a5a7b" }}>NVDA @${stocks.NVDA.price} × {FX} = NT${fmt(stocks.NVDA.price * FX)}/股</span>
            </div>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
              <thead><tr style={{ background: "#111120" }}>{["季", "Vest日", "年份", "%", "股數", "累計", "估值(TWD)"].map(h => <th key={h} style={{ padding: "7px 10px", textAlign: ["%", "股數", "累計", "估值(TWD)"].includes(h) ? "right" : "left", color: "#6a7a9b", fontWeight: "normal", fontSize: 10, borderBottom: "1px solid #2a2a40" }}>{h}</th>)}</tr></thead>
              <tbody>
                {rsuSchedule.map((r, i) => {
                  const yc = ["#4fc3f7", "#76c442", "#ffb74d", "#ce93d8"][Math.floor(i / 4)];
                  return (
                    <tr key={r.q} style={{ background: i % 4 === 0 ? "#111120" : (i % 2 === 0 ? "#0f0f1a" : "#13131f"), borderTop: i % 4 === 0 && i > 0 ? `1px solid ${yc}30` : "none" }}>
                      <td style={{ padding: "6px 10px", color: yc, fontWeight: "bold" }}>Q{r.q}</td>
                      <td style={{ padding: "6px 10px", color: "#b0c4de" }}>{r.date}</td>
                      <td style={{ padding: "6px 10px" }}>{i % 4 === 0 && <span style={{ fontSize: 9, color: yc, background: yc + "20", padding: "1px 5px", borderRadius: 3 }}>{r.year}</span>}</td>
                      <td style={{ padding: "6px 10px", textAlign: "right", color: "#6a7a9b" }}>{r.pct}%</td>
                      <td style={{ padding: "6px 10px", textAlign: "right", color: yc, fontWeight: "bold" }}>{r.shares}</td>
                      <td style={{ padding: "6px 10px", textAlign: "right", color: "#6a7a9b" }}>{r.cumulative}</td>
                      <td style={{ padding: "6px 10px", textAlign: "right", color: "#76c442" }}>{fmt(r.shares * (stocks.NVDA.price || 0) * FX)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div style={{ background: "#1a1a0a", border: "1px solid #3a3a1a", borderRadius: 12, padding: "13px 14px" }}>
            <div style={{ fontSize: 10, letterSpacing: 2, color: "#8a8a4a", textTransform: "uppercase", marginBottom: 9 }}>🎯 Focal RSU（2027年起）</div>
            {[
              { step: "1", text: "5月底入職 < 9/1，2027年Focal有資格", c: "#76c442" },
              { step: "2", text: "2027/3月：Focal meeting → 調薪幅度 + Focal RSU（預設10股，可在設定修改）", c: "#ffb74d" },
              { step: "3", text: "2027/3月中：Schwab EAC 出現grant，記得按 Accept", c: "#4fc3f7" },
              { step: "4", text: "2027/6月起：每季 vest 6.25% × F股，連續16季", c: "#ce93d8" },
            ].map(s => (
              <div key={s.step} style={{ display: "flex", gap: 8, marginBottom: 6, alignItems: "flex-start" }}>
                <div style={{ width: 17, height: 17, borderRadius: "50%", background: s.c + "30", border: `1px solid ${s.c}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, color: s.c, flexShrink: 0 }}>{s.step}</div>
                <div style={{ fontSize: 11, color: "#8a9ab8", lineHeight: 1.6 }}>{s.text}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── 現金流 ── */}
      {tab === "cashflow" && (
        <div style={{ padding: "14px 20px 40px" }}>
          <SectionTitle>每月現金流（數字來自設定頁，可調整）</SectionTitle>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 11, marginBottom: 14 }}>
            <div style={{ background: "#13131f", border: "1px solid #2a3a5c", borderRadius: 12, overflow: "hidden" }}>
              <div style={{ padding: "9px 13px", background: "#0d1f0d", borderBottom: "1px solid #2a3a5c" }}><span style={{ fontSize: 10, letterSpacing: 2, color: "#76c442", textTransform: "uppercase" }}>每月收入</span></div>
              {[
                { label: "底薪", value: settings.baseSalary, color: "#76c442", field: "baseSalary" },
                { label: "手機補助（估）", value: 1346, color: "#b8d4ff" },
              ].map(r => (
                <div key={r.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "9px 13px", borderBottom: "1px solid #1a1a2e" }}>
                  <span style={{ color: "#8a9bb8", fontSize: 12 }}>{r.label}</span>
                  {r.field ? <EditableNum value={r.value} onChange={v => updateSettings(r.field, v)} color={r.color} bold /> : <span style={{ color: r.color, fontSize: 13 }}>{fmt(r.value)}</span>}
                </div>
              ))}
              <div style={{ display: "flex", justifyContent: "space-between", padding: "9px 13px", background: "#0a1f0a" }}>
                <span style={{ color: "#76c442", fontSize: 12, fontWeight: "bold" }}>估算實領</span>
                <span style={{ color: "#76c442", fontSize: 14, fontWeight: "bold" }}>{fmt(monthlyNetEst)}</span>
              </div>
            </div>

            <div style={{ background: "#13131f", border: "1px solid #3a2a2a", borderRadius: 12, overflow: "hidden" }}>
              <div style={{ padding: "9px 13px", background: "#2a0d0d", borderBottom: "1px solid #3a2a2a" }}><span style={{ fontSize: 10, letterSpacing: 2, color: "#ef5350", textTransform: "uppercase" }}>每月支出</span></div>
              {[
                { label: "房租", field: "monthlyRent", color: "#ef9a9a" },
                { label: "管理費", field: "mgmtFee", color: "#ef9a9a" },
                { label: "信貸還款", field: "loanPayment", color: "#ef9a9a" },
                { label: "手機電信", field: "telecom", color: "#ef9a9a" },
                { label: "水電瓦斯", field: "utilities", color: "#ef9a9a" },
                { label: "0050 定期定額", field: "etfMonthly", color: "#4fc3f7" },
                { label: "ESPP 扣款", value: esppMonthly, color: "#ce93d8" },
                { label: "日常生活費", field: "livingExpense", color: "#ffb74d" },
              ].map(r => (
                <div key={r.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "7px 13px", borderBottom: "1px solid #1a1a2e" }}>
                  <span style={{ color: "#8a9bb8", fontSize: 11 }}>{r.label}</span>
                  {r.field
                    ? <EditableNum value={settings[r.field]} onChange={v => updateSettings(r.field, v)} color={r.color} />
                    : <span style={{ color: r.color, fontSize: 12 }}>{fmt(r.value)}</span>
                  }
                </div>
              ))}
              <div style={{ display: "flex", justifyContent: "space-between", padding: "9px 13px", background: monthlySurplus >= 0 ? "#0a1f0a" : "#1a0d0d" }}>
                <span style={{ color: monthlySurplus >= 0 ? "#76c442" : "#ef5350", fontSize: 12, fontWeight: "bold" }}>每月結餘</span>
                <span style={{ color: monthlySurplus >= 0 ? "#76c442" : "#ef5350", fontSize: 14, fontWeight: "bold" }}>{fmt(monthlySurplus)}</span>
              </div>
            </div>
          </div>

          <div style={{ background: "#0f1a2e", border: "1px solid #1a2a4e", borderRadius: 10, padding: "12px 14px", fontSize: 11, color: "#6a8ab8", lineHeight: 1.9 }}>
            <div style={{ color: "#7aacdc", marginBottom: 4, fontSize: 10, letterSpacing: 2 }}>💡 備註</div>
            <div>• ESPP 扣款 = 底薪 × {settings.esppRate}%（可在設定頁調整比例）</div>
            <div>• 所有紅色數字點擊可直接編輯</div>
            <div>• 轉正後月結餘約 <strong style={{ color: "#76c442" }}>{fmt(monthlySurplus)}</strong>，全年加上獎金後可存更多</div>
          </div>
        </div>
      )}

      {/* ── 設定 ── */}
      {tab === "settings" && (
        <div style={{ padding: "14px 20px 40px" }}>
          <SectionTitle>⚙️ 全域設定（調整後所有頁面即時更新）</SectionTitle>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 11, marginBottom: 14 }}>
            {/* 薪資設定 */}
            <div style={{ background: "#13131f", border: "1px solid #2a3a5c", borderRadius: 12, overflow: "hidden" }}>
              <div style={{ padding: "9px 13px", background: "#1a1a2e", borderBottom: "1px solid #2a3a5c" }}><span style={{ fontSize: 10, letterSpacing: 2, color: "#76c442", textTransform: "uppercase" }}>薪資設定</span></div>
              {[
                { label: "底薪（轉正後）", field: "baseSalary", min: 80000, max: 200000, step: 1000, unit: "元" },
                { label: "ESPP 扣款比例", field: "esppRate", min: 1, max: 25, step: 1, unit: "%" },
                { label: "RSU 總股數", field: "rsuShares", min: 100, max: 800, step: 1, unit: "股" },
                { label: "Focal RSU 假設股數", field: "focalRsuShares", min: 0, max: 200, step: 1, unit: "股" },
              ].map(s => (
                <div key={s.field} style={{ padding: "10px 13px", borderBottom: "1px solid #1a1a2e" }}>
                  <SliderInput label={s.label} value={settings[s.field] || 0} min={s.min} max={s.max} step={s.step} onChange={v => updateSettings(s.field, v)} color="#76c442" unit={s.unit} />
                </div>
              ))}
            </div>

            {/* 生活開銷 */}
            <div style={{ background: "#13131f", border: "1px solid #3a2a2a", borderRadius: 12, overflow: "hidden" }}>
              <div style={{ padding: "9px 13px", background: "#1a1a2e", borderBottom: "1px solid #3a2a2a" }}><span style={{ fontSize: 10, letterSpacing: 2, color: "#ef5350", textTransform: "uppercase" }}>生活開銷</span></div>
              {[
                { label: "房租", field: "monthlyRent", min: 5000, max: 80000, step: 1000, unit: "元" },
                { label: "管理費", field: "mgmtFee", min: 0, max: 10000, step: 100, unit: "元" },
                { label: "信貸月付", field: "loanPayment", min: 0, max: 30000, step: 500, unit: "元" },
                { label: "手機電信", field: "telecom", min: 0, max: 5000, step: 100, unit: "元" },
                { label: "水電瓦斯", field: "utilities", min: 0, max: 5000, step: 100, unit: "元" },
                { label: "日常生活費", field: "livingExpense", min: 5000, max: 80000, step: 1000, unit: "元" },
              ].map(s => (
                <div key={s.field} style={{ padding: "10px 13px", borderBottom: "1px solid #1a1a2e" }}>
                  <SliderInput label={s.label} value={settings[s.field] || 0} min={s.min} max={s.max} step={s.step} onChange={v => updateSettings(s.field, v)} color="#ef5350" unit={s.unit} />
                </div>
              ))}
            </div>

            {/* 投資設定 */}
            <div style={{ background: "#13131f", border: "1px solid #ce93d840", borderRadius: 12, overflow: "hidden" }}>
              <div style={{ padding: "9px 13px", background: "#1a1a2e", borderBottom: "1px solid #2a2a40" }}><span style={{ fontSize: 10, letterSpacing: 2, color: "#ce93d8", textTransform: "uppercase" }}>投資設定</span></div>
              {[
                { label: "0050 每月定期定額", field: "etfMonthly", min: 0, max: 50000, step: 1000, unit: "元" },
              ].map(s => (
                <div key={s.field} style={{ padding: "10px 13px", borderBottom: "1px solid #1a1a2e" }}>
                  <SliderInput label={s.label} value={settings[s.field] || 0} min={s.min} max={s.max} step={s.step} onChange={v => updateSettings(s.field, v)} color="#ce93d8" unit={s.unit} />
                </div>
              ))}
            </div>

            {/* 其他參數 */}
            <div style={{ background: "#13131f", border: "1px solid #ffb74d40", borderRadius: 12, overflow: "hidden" }}>
              <div style={{ padding: "9px 13px", background: "#1a1a2e", borderBottom: "1px solid #2a2a40" }}><span style={{ fontSize: 10, letterSpacing: 2, color: "#ffb74d", textTransform: "uppercase" }}>其他參數</span></div>
              {[
                { label: "台幣匯率（USD→TWD）", field: "fxRate", min: 28, max: 40, step: 0.1, unit: "" },
                { label: "RSU 稅率", field: "taxRate", min: 5, max: 40, step: 1, unit: "%" },
                { label: "轉貸餘額", field: "loanBalance", min: 0, max: 1500000, step: 10000, unit: "元" },
                { label: "轉貸利率", field: "loanRate", min: 1, max: 8, step: 0.1, unit: "%" },
                { label: "轉貸期數", field: "loanTerm", min: 12, max: 120, step: 12, unit: "期" },
              ].map(s => (
                <div key={s.field} style={{ padding: "10px 13px", borderBottom: "1px solid #1a1a2e" }}>
                  <SliderInput label={s.label} value={settings[s.field] || 0} min={s.min} max={s.max} step={s.step} onChange={v => updateSettings(s.field, v)} color="#ffb74d" unit={s.unit} />
                </div>
              ))}
            </div>
          </div>

          {/* 重置按鈕 */}
          <div style={{ display: "flex", gap: 10 }}>
            <button
              onClick={() => { setSettings(DEFAULT_SETTINGS); save("settings", DEFAULT_SETTINGS); }}
              style={{ background: "#1a1a2e", border: "1px solid #3a3a5a", color: "#6a7a9b", borderRadius: 7, padding: "8px 18px", fontSize: 12, cursor: "pointer" }}
            >↺ 重置設定</button>
            <button
              onClick={() => { setSalaryMonths(DEFAULT_SALARY_MONTHS); setAssets(DEFAULT_ASSETS); setStocks(DEFAULT_STOCKS); save("salary_months", DEFAULT_SALARY_MONTHS); save("assets", DEFAULT_ASSETS); save("stocks", DEFAULT_STOCKS); }}
              style={{ background: "#1a1a2e", border: "1px solid #3a3a5a", color: "#6a7a9b", borderRadius: 7, padding: "8px 18px", fontSize: 12, cursor: "pointer" }}
            >↺ 重置全部資料</button>
          </div>
        </div>
      )}
    </div>
  );
}
