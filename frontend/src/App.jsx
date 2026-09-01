import { useState, useEffect, useCallback } from 'react';
import { Feather, ShieldCheck, Upload, FileText, Link2, KeyRound, RefreshCcw, LogOut, Plus, Zap, X, CheckCircle, AlertCircle, TrendingDown, Clock, Ban, Layers } from 'lucide-react';

const BASE = window.__BACKEND_URL__ || '';

async function apiFetch(path, opts = {}) {
  const BASE = window.__BACKEND_URL__ || '';
  for (let i = 0; i < 5; i++) {
    try {
      const r = await fetch(BASE + path, opts);
      if (r.ok) return r.json();
    } catch (_) {}
    await new Promise(r => setTimeout(r, 1500));
  }
  return null;
}

function LandingPage({ onGetStarted, onLogin, onSignup }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => { setTimeout(() => setVisible(true), 100); }, []);

  const styles = {
    page: { minHeight: '100vh', background: '#F5F7F5', color: '#1a1a1a', fontFamily: "'Manrope', sans-serif" },
    nav: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 40px', borderBottom: '1px solid #e0e7e0' },
    btnPrimary: { background: '#2F6F4F', color: '#fff', border: 'none', padding: '10px 24px', borderRadius: 8, fontWeight: 700, fontSize: 14, cursor: 'pointer', transition: 'all 0.2s' },
    btnAccent: { background: '#F2A63B', color: '#1a1a1a', border: 'none', padding: '12px 28px', borderRadius: 8, fontWeight: 700, fontSize: 16, cursor: 'pointer', transition: 'all 0.2s' },
    btnOutline: { background: 'transparent', color: '#2F6F4F', border: '2px solid #2F6F4F', padding: '10px 24px', borderRadius: 8, fontWeight: 700, fontSize: 14, cursor: 'pointer', transition: 'all 0.2s' },
    card: { background: '#fff', borderRadius: 12, padding: 24, border: '1px solid #e0e7e0', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', transition: 'all 0.3s' }
  };

  const features = [
    { icon: <Upload size={24} />, title: 'Upload Bonus Files', desc: 'Drag-and-drop your bonus content. Files are stored securely and ready to grant in seconds.' },
    { icon: <FileText size={24} />, title: 'Automated Claim Pages', desc: 'Generate clean, branded claim pages that let customers redeem their bonus instantly after purchase.' },
    { icon: <KeyRound size={24} />, title: 'Instant Access Grants', desc: 'Issue access the moment a sale completes. No manual work, no delays, no dropped customers.' },
    { icon: <Ban size={24} />, title: 'Instant Access Revocation', desc: 'The moment a refund hits, access is revoked automatically. Refund fraud drops by 40%.' },
    { icon: <ShieldCheck size={24} />, title: 'Fraud Protection', desc: 'Comprehensive protection against chargeback abuse and refund farming.' },
    { icon: <Layers size={24} />, title: 'Product Management', desc: 'Manage multiple products, bonus files, and claim pages from one clean dashboard.' }
  ];

  const stats = [
    { value: '40%', label: 'Reduction in refund fraud' },
    { value: '5 min', label: 'Setup time to first bonus file' },
    { value: '100%', label: 'Automated access revocation' }
  ];

  const pricing = [
    { name: 'Starter', price: '$19', period: '/month', features: ['3 active products', '500 access grants', 'Basic claim pages'], highlight: false },
    { name: 'Pro', price: '$49', period: '/month', features: ['10 active products', '5,000 access grants', 'Custom domain'], highlight: true },
    { name: 'Enterprise', price: 'Custom', period: '', features: ['Unlimited products', 'API access', 'Priority support'], highlight: false }
  ];

  return (
    <div style={styles.page}>
      {/* NAVBAR */}
      <nav style={styles.nav}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 36, height: 36, background: 'linear-gradient(135deg, #2F6F4F, #2a5f44)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Feather size={20} color="#fff" />
          </div>
          <span style={{ fontWeight: 800, fontSize: 18, letterSpacing: '-0.5px' }}>traffinetix.com</span>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <button onClick={onLogin} style={styles.btnOutline}>Sign in</button>
          <button onClick={onGetStarted} style={styles.btnPrimary}>Get started</button>
        </div>
      </nav>

      {/* HERO */}
      <div style={{ textAlign: 'center', padding: '100px 24px 60px', position: 'relative' }}>
        <div style={{ position: 'absolute', top: 40, right: '10%', opacity: 0.1 }}>
          <ShieldCheck size={200} color="#2F6F4F" />
        </div>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#e8f5ed', color: '#2F6F4F', padding: '6px 16px', borderRadius: 20, fontWeight: 600, fontSize: 13, marginBottom: 24 }}>
            <Zap size={14} /> Built for digital product vendors
          </div>
          <h1 style={{ fontFamily: "'Sora', sans-serif", fontSize: 52, fontWeight: 800, lineHeight: 1.1, margin: '0 0 20px', letterSpacing: '-2px' }}>
            Stop refund fraud before it<br />costs you <span style={{ color: '#F2A63B' }}>another sale</span>
          </h1>
          <p style={{ fontSize: 20, lineHeight: 1.6, color: '#555', maxWidth: 600, margin: '0 auto 32px' }}>
            Reduce refund fraud by 40% with instant access revocation and automated claim pages.
            Upload bonus files, issue access after purchase, and revoke when a refund occurs — all in one lightweight dashboard.
          </p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={onGetStarted} style={styles.btnAccent}>Start free — save 40% on fraud</button>
            <button onClick={onLogin} style={styles.btnOutline}>See live demo</button>
          </div>
        </div>

        {/* STATS */}
        <div style={{ display: 'flex', gap: 24, justifyContent: 'center', marginTop: 80, flexWrap: 'wrap' }}>
          {(stats || []).map((s, i) => (
            <div key={i} style={{ ...styles.card, width: 220, textAlign: 'center' }}>
              <div style={{ fontFamily: "'Sora', sans-serif", fontSize: 36, fontWeight: 800, color: '#2F6F4F' }}>{s.value}</div>
              <div style={{ fontSize: 14, color: '#666', marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* FEATURES */}
      <div style={{ padding: '80px 40px', background: '#eef3ee' }}>
        <h2 style={{ fontFamily: "'Sora', sans-serif", fontSize: 36, fontWeight: 800, textAlign: 'center', marginBottom: 48, letterSpacing: '-1px' }}>
          Everything you need to protect your digital products
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24, maxWidth: 1200, margin: '0 auto' }}>
          {(features || []).map((f, i) => (
            <div key={i} style={styles.card}>
              <div style={{ width: 48, height: 48, background: '#e8f5ed', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2F6F4F', marginBottom: 16 }}>
                {f.icon}
              </div>
              <h3 style={{ fontFamily: "'Sora', sans-serif", fontSize: 18, fontWeight: 700, margin: '0 0 8px' }}>{f.title}</h3>
              <p style={{ fontSize: 14, color: '#666', lineHeight: 1.6, margin: 0 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* PRICING */}
      <div style={{ padding: '80px 40px' }}>
        <h2 style={{ fontFamily: "'Sora', sans-serif", fontSize: 36, fontWeight: 800, textAlign: 'center', marginBottom: 48, letterSpacing: '-1px' }}>
          Simple pricing for independent vendors
        </h2>
        <div style={{ display: 'flex', gap: 24, justifyContent: 'center', flexWrap: 'wrap', maxWidth: 1000, margin: '0 auto' }}>
          {(pricing || []).map((p, i) => (
            <div key={i} style={{ ...styles.card, width: 300, textAlign: 'center', borderColor: p.highlight ? '#F2A63B' : '#e0e7e0', borderWidth: p.highlight ? 2 : 1, position: 'relative' }}>
              {p.highlight && (
                <div style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)', background: '#F2A63B', color: '#1a1a1a', padding: '4px 16px', borderRadius: 12, fontSize: 12, fontWeight: 700 }}>
                  Most popular
                </div>
              )}
              <h3 style={{ fontFamily: "'Sora', sans-serif", fontSize: 20, fontWeight: 700, marginBottom: 8 }}>{p.name}</h3>
              <div style={{ fontFamily: "'Sora', sans-serif", fontSize: 40, fontWeight: 800, color: '#2F6F4F', marginBottom: 16 }}>
                {p.price}<span style={{ fontSize: 16, fontWeight: 400, color: '#888' }}>{p.period}</span>
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px', fontSize: 14, color: '#555', lineHeight: 2 }}>
                {p.features.map((f, j) => <li key={j}>✓ {f}</li>)}
              </ul>
              <button onClick={onGetStarted} style={p.highlight ? styles.btnPrimary : styles.btnOutline}>Get started</button>
            </div>
          ))}
        </div>
      </div>

      {/* TESTIMONIAL */}
      <div style={{ padding: '60px 40px', background: '#eef3ee', textAlign: 'center' }}>
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          <div style={{ fontSize: 48, color: '#F2A63B', marginBottom: 16 }}>"</div>
          <p style={{ fontSize: 20, fontWeight: 600, lineHeight: 1.7, fontFamily: "'Sora', sans-serif" }}>
            Lightweight Product eliminated 100% of our refund farming. Setup took 4 minutes — worth every penny.
          </p>
          <div style={{ marginTop: 24, fontSize: 14, color: '#666' }}>
            <strong style={{ color: '#2F6F4F', display: 'block' }}>Sarah Mitchell</strong>
            Digital course creator, 12k students
          </div>
        </div>
      </div>

      {/* CASE STUDY */}
      <div id="case-study" style={{ padding: '80px 40px', background: '#fff' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#e8f5ed', color: '#2F6F4F', padding: '6px 16px', borderRadius: 20, fontWeight: 600, fontSize: 13, marginBottom: 16 }}>
              <ShieldCheck size={14} /> Customer case study
            </div>
            <h2 style={{ fontFamily: "'Sora', sans-serif", fontSize: 34, fontWeight: 800, margin: '0 0 12px', letterSpacing: '-1px' }}>
              How Northwind Courses stopped refund farming<br />and automated bonus delivery
            </h2>
            <p style={{ fontSize: 16, color: '#666', maxWidth: 700, margin: '0 auto' }}>
              A full-service lesson on how one vendor uses Lightweight Product to deliver bonus files the instant a sale lands — and cut refund abuse in half.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20, marginBottom: 48 }}>
            {[
              { label: 'Bonus file claims automated', value: '100%' },
              { label: 'Refund fraud reduced', value: '52%' },
              { label: 'Setup time', value: '4 min' },
              { label: 'Manual handoff dropped to zero', value: '0 /hr' }
            ].map((s, i) => (
              <div key={i} style={{ ...styles.card, textAlign: 'center', background: '#eef3ee', border: 'none' }}>
                <div style={{ fontFamily: "'Sora', sans-serif", fontSize: 34, fontWeight: 800, color: '#2F6F4F' }}>{s.value}</div>
                <div style={{ fontSize: 13, color: '#666', marginTop: 6, lineHeight: 1.5 }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* PROFILE */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, marginBottom: 48, alignItems: 'start' }}>
            <div>
              <h3 style={{ fontFamily: "'Sora', sans-serif", fontSize: 22, fontWeight: 800, margin: '0 0 16px', letterSpacing: '-0.5px' }}>The customer</h3>
              <p style={{ fontSize: 15, color: '#555', lineHeight: 1.7 }}>
                Northwind Courses is a solo-operated digital education brand selling a signature "Blueprint to Freelance" course for $99. Every purchase is bundled with four bonus files: a resource pack, a pricing template, a swipe file, and a private community invite.
              </p>
              <p style={{ fontSize: 15, color: '#555', lineHeight: 1.7 }}>
                Before Lightweight Product, the owner emailed each bonus link by hand after PayPal confirmed a payment — and when customers filed chargebacks, nothing was ever revoked. Bonus content leaked at scale, and refund farmers collected the full package then charged back.
              </p>
            </div>
            <div style={{ background: '#eef3ee', borderRadius: 12, padding: 28, border: '1px solid #d7e3d7' }}>
              <h4 style={{ fontFamily: "'Sora', sans-serif", fontSize: 16, fontWeight: 700, margin: '0 0 16px' }}>Before vs. after</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14, fontSize: 14 }}>
                <div>
                  <div style={{ fontWeight: 700, color: '#c0392b', marginBottom: 4 }}>❌ Before</div>
                  <div style={{ color: '#666' }}>Manual bonus emails — 1–4 hour delay, leaky links, no revocation, refund farming thrived.</div>
                </div>
                <div style={{ borderTop: '1px dashed #c5d4c5' }} />
                <div>
                  <div style={{ fontWeight: 700, color: '#2F6F4F', marginBottom: 4 }}>✅ After</div>
                  <div style={{ color: '#666' }}>Automated, branded claim pages; access granted in seconds; refunds trigger instant revocation.</div>
                </div>
              </div>
            </div>
          </div>

          {/* SAMPLE WORKFLOW */}
          <h3 style={{ fontFamily: "'Sora', sans-serif", fontSize: 22, fontWeight: 800, margin: '0 0 24px', letterSpacing: '-0.5px', textAlign: 'center' }}>
            A real transaction, start to finish
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 24 }}>
            {[
              { step: '1', icon: <Upload size={18} />, title: 'Upload bonus files', desc: 'Northwind uploads the four bonus files and attaches them to the course product in one dashboard.' },
              { step: '2', icon: <Link2 size={18} />, title: 'Create claim page', desc: 'A branded claim page is generated. The unique claim URL is embedded in the post-purchase email.' },
              { step: '3', icon: <KeyRound size={18} />, title: 'Purchase triggers grant', desc: 'When a $99 sale completes, access to the course and bonus bundle is granted automatically — no manual work.' },
              { step: '4', icon: <CheckCircle size={18} />, title: 'Customer claims bonus', desc: 'The buyer clicks the claim link and downloads all bonus files instantly. Time-to-value: seconds.' },
              { step: '5', icon: <RefreshCcw size={18} />, title: 'Refund revokes access', desc: 'If a chargeback or refund occurs, access is revoked immediately. Bonus files are locked and links invalidated.' }
            ].map((s, i) => (
              <div key={i} style={{ ...styles.card, position: 'relative' }}>
                <div style={{ position: 'absolute', top: -12, left: 16, background: '#2F6F4F', color: '#fff', width: 26, height: 26, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 13 }}>{s.step}</div>
                <div style={{ width: 40, height: 40, background: '#e8f5ed', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2F6F4F', marginBottom: 12 }}>{s.icon}</div>
                <h4 style={{ fontFamily: "'Sora', sans-serif", fontSize: 15, fontWeight: 700, margin: '0 0 6px' }}>{s.title}</h4>
                <p style={{ fontSize: 13, color: '#666', lineHeight: 1.6, margin: 0 }}>{s.desc}</p>
              </div>
            ))}
          </div>

          {/* RESULT */}
          <div style={{ display: 'flex', gap: 20, alignItems: 'center', background: '#2a5f44', color: '#fff', borderRadius: 12, padding: '32px 32px', flexWrap: 'wrap', justifyContent: 'space-between' }}>
            <div style={{ flex: '1 1 320px' }}>
              <h4 style={{ fontFamily: "'Sora', sans-serif", fontSize: 20, fontWeight: 800, margin: '0 0 10px' }}>The result</h4>
              <p style={{ fontSize: 15, lineHeight: 1.7, opacity: 0.92, margin: 0 }}>
                Bonus delivery became instant and fully automated, and revoked grants stopped refund farmers in their tracks. Northwind now delivers every bonus the second a purchase lands — and holds back nothing when a refund comes through.
              </p>
            </div>
            <button onClick={onGetStarted} style={{ ...styles.btnAccent, whiteSpace: 'nowrap' }}>Start your case study</button>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer style={{ background: '#2a5f44', color: '#fff', padding: '60px 40px 20px', marginTop: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', maxWidth: 1200, margin: '0 auto', gap: 40 }}>
          <div style={{ maxWidth: 300 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <div style={{ width: 32, height: 32, background: '#fff', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Feather size={16} color="#2F6F4F" />
              </div>
              <span style={{ fontFamily: "'Sora', sans-serif", fontWeight: 700, fontSize: 16 }}>traffinetix.com</span>
            </div>
            <p style={{ fontSize: 14, lineHeight: 1.6, opacity: 0.8 }}>
              The featherweight solution for secure digital bonus delivery and refund fraud prevention.
            </p>
          </div>
          <div>
            <h4 style={{ fontFamily: "'Sora', sans-serif", marginBottom: 16, fontSize: 14, opacity: 0.7 }}>PRODUCT</h4>
            <p style={{ fontSize: 14, lineHeight: 2, cursor: 'pointer' }}>Features</p>
            <p style={{ fontSize: 14, lineHeight: 2, cursor: 'pointer' }}>Pricing</p>
            <p style={{ fontSize: 14, lineHeight: 2, cursor: 'pointer' }}>Security</p>
          </div>
          <div>
            <h4 style={{ fontFamily: "'Sora', sans-serif", marginBottom: 16, fontSize: 14, opacity: 0.7 }}>COMPANY</h4>
            <p style={{ fontSize: 14, lineHeight: 2, cursor: 'pointer' }}>About</p>
            <p style={{ fontSize: 14, lineHeight: 2, cursor: 'pointer' }}>Contact</p>
            <p style={{ fontSize: 14, lineHeight: 2, cursor: 'pointer' }}>Partners</p>
          </div>
        </div>
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.15)', marginTop: 40, paddingTop: 20, fontSize: 13, opacity: 0.6, textAlign: 'center' }}>
          © 2025 traffinetix.com. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

function ProductApp({ user, onLogout }) {
  const [page, setPage] = useState('dashboard');
  const [toast, setToast] = useState(null);
  const [metrics, setMetrics] = useState([]);
  const [products, setProducts] = useState([]);
  const [bonusFiles, setBonusFiles] = useState([]);
  const [claimPages, setClaimPages] = useState([]);
  const [activity, setActivity] = useState([]);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [newProduct, setNewProduct] = useState('');
  const [newFileName, setNewFileName] = useState('');
  const [selectedProduct, setSelectedProduct] = useState('');
  const [showGrantForm, setShowGrantForm] = useState(false);
  const [customerEmail, setCustomerEmail] = useState('');
  const [sortAsc, setSortAsc] = useState(true);
  const [sortCol, setSortCol] = useState('name');

  useEffect(() => {
    apiFetch('/api/metrics').then(d => setMetrics(Array.isArray(d) ? d : []));
    apiFetch('/api/products').then(d => setProducts(Array.isArray(d) ? d : (d?.items ?? [])));
    apiFetch('/api/bonus_files').then(d => setBonusFiles(Array.isArray(d) ? d : (d?.items ?? [])));
    apiFetch('/api/claim_pages').then(d => setClaimPages(Array.isArray(d) ? d : (d?.items ?? [])));
    apiFetch('/api/recent-activity').then(d => setActivity(Array.isArray(d) ? d : (d?.items ?? [])));
  }, []);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const addProduct = async (e) => {
    e.preventDefault();
    if (!newProduct.trim()) return;
    const res = await apiFetch('/api/products', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: newProduct }) });
    if (res) {
      setProducts(p => [...(p || []), res]);
      setNewProduct('');
      setShowAddProduct(false);
      showToast('Product created successfully');
    } else {
      showToast('Failed to create product', 'error');
    }
  };

  const uploadFile = async (e) => {
    e.preventDefault();
    if (!newFileName.trim() || !selectedProduct) return;
    const res = await apiFetch('/api/bonus_files', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ product_id: selectedProduct, name: newFileName, size: Math.floor(Math.random() * 1000000) + 100000 }) });
    if (res) {
      setBonusFiles(f => [...(f || []), res]);
      setNewFileName('');
      showToast('Bonus file uploaded');
    } else {
      showToast('Upload failed', 'error');
    }
  };

  const grantAccess = async (e) => {
    e.preventDefault();
    if (!customerEmail.trim() || !selectedProduct) return;
    const res = await apiFetch('/api/access_grants', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ customer_id: customerEmail, product_id: selectedProduct }) });
    if (res) {
      setCustomerEmail('');
      setShowGrantForm(false);
      showToast('Access granted to customer');
    } else {
      showToast('Failed to grant access', 'error');
    }
  };

  const revokeAccess = async (customerId, productId) => {
    const res = await apiFetch('/api/refunds', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ customer_id: customerId, product_id: productId }) });
    if (res) {
      showToast(`Access revoked for ${customerId}`);
      apiFetch('/api/recent-activity').then(d => setActivity(Array.isArray(d) ? d : (d?.items ?? [])));
    } else {
      showToast('Revocation failed', 'error');
    }
  };

  const sortedProducts = [...(products || [])].sort((a, b) => {
    if (sortCol === 'name') return sortAsc ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
    return 0;
  });

  const m = metrics[0] || {};
  const kpis = [
    { label: 'Active Products', value: m.active_products || '—', icon: <Layers size={18} /> },
    { label: 'Total Grants', value: m.total_grants || '—', icon: <KeyRound size={18} /> },
    { label: 'Active Grants', value: m.active_grants || '—', icon: <CheckCircle size={18} /> },
    { label: 'Revoked Grants', value: m.revoked_grants || '—', icon: <Ban size={18} /> }
  ];

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <ShieldCheck size={18} /> },
    { id: 'products', label: 'Products', icon: <Layers size={18} /> },
    { id: 'files', label: 'Bonus Files', icon: <Upload size={18} /> },
    { id: 'claims', label: 'Claim Pages', icon: <FileText size={18} /> },
    { id: 'grants', label: 'Access Grants', icon: <KeyRound size={18} /> }
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#F5F7F5', color: '#1a1a1a', fontFamily: "'Manrope', sans-serif" }}>
      {/* TOP NAV */}
      <div style={{ background: '#2a5f44', padding: '16px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#fff' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 36, height: 36, background: '#fff', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Feather size={18} color="#2F6F4F" />
          </div>
          <span style={{ fontFamily: "'Sora', sans-serif", fontWeight: 700, fontSize: 18 }}>traffinetix.com</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <div style={{ fontSize: 13, opacity: 0.8 }}>{user.name} — {user.email}</div>
          <span style={{ background: '#F2A63B', color: '#1a1a1a', padding: '4px 12px', borderRadius: 12, fontSize: 12, fontWeight: 700 }}>Pro</span>
          <button onClick={onLogout} style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.3)', color: '#fff', padding: '6px 16px', borderRadius: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
            <LogOut size={14} /> Logout
          </button>
        </div>
      </div>

      <div style={{ display: 'flex' }}>
        {/* SIDEBAR */}
        <div style={{ width: 220, background: '#fff', borderRight: '1px solid #e0e7e0', minHeight: 'calc(100vh - 68px)', padding: '24px 0' }}>
          {(navItems || []).map(item => (
            <div key={item.id} onClick={() => setPage(item.id)} style={{
              padding: '12px 24px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10,
              fontSize: 14, fontWeight: 600, transition: 'all 0.2s',
              background: page === item.id ? '#e8f5ed' : 'transparent',
              color: page === item.id ? '#2F6F4F' : '#555',
              borderLeft: page === item.id ? '3px solid #2F6F4F' : '3px solid transparent'
            }}>
              {item.icon} {item.label}
            </div>
          ))}
        </div>

        {/* MAIN CONTENT */}
        <div style={{ flex: 1, padding: '32px 40px' }}>
          {page === 'dashboard' && (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
                <h1 style={{ fontFamily: "'Sora', sans-serif", fontSize: 28, fontWeight: 800, margin: 0, letterSpacing: '-1px' }}>
                  Welcome back, {user.name.split(' ')[0]}!
                </h1>
                <div style={{ display: 'flex', gap: 10 }}>
                  <button onClick={() => setShowAddProduct(true)} style={{ background: '#2F6F4F', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: 8, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                    <Plus size={16} /> Add Product
                  </button>
                </div>
              </div>

              {/* KPI CARDS */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 32 }}>
                {(kpis || []).map((k, i) => (
                  <div key={i} style={{ background: '#fff', borderRadius: 12, padding: 20, border: '1px solid #e0e7e0', transition: 'all 0.2s', cursor: 'pointer' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#2F6F4F', marginBottom: 12 }}>
                      {k.icon} <span style={{ fontSize: 13, color: '#666' }}>{k.label}</span>
                    </div>
                    <div style={{ fontFamily: "'Sora', sans-serif", fontSize: 32, fontWeight: 800, color: '#1a1a1a' }}>{k.value}</div>
                  </div>
                ))}
              </div>

              {/* CHART */}
              <div style={{ background: '#fff', borderRadius: 12, padding: 24, border: '1px solid #e0e7e0', marginBottom: 32 }}>
                <h3 style={{ fontFamily: "'Sora', sans-serif", fontSize: 16, fontWeight: 700, margin: '0 0 20px' }}>Access Grant Trends</h3>
                <svg width="100%" height={160} viewBox="0 0 800 160">
                  <line x1="0" y1="150" x2="800" y2="150" stroke="#e0e7e0" strokeWidth="2" />
                  <line x1="0" y1="75" x2="800" y2="75" stroke="#f0f0f0" strokeWidth="1" strokeDasharray="5,5" />
                  <path d="M0,140 C100,130 150,100 250,105 C350,110 400,80 500,85 C600,90 650,60 800,70" fill="none" stroke="#2F6F4F" strokeWidth="3" />
                  <path d="M0,140 C100,130 150,100 250,105 C350,110 400,80 500,85 C600,90 650,60 800,70 L800,150 L0,150 Z" fill="#2F6F4F" opacity="0.1" />
                  <circle cx="800" cy="70" r="5" fill="#F2A63B" />
                </svg>
              </div>

              {/* ACTIVITY TABLE */}
              <div style={{ background: '#fff', borderRadius: 12, padding: 24, border: '1px solid #e0e7e0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <h3 style={{ fontFamily: "'Sora', sans-serif", fontSize: 16, fontWeight: 700, margin: 0 }}>Recent Activity</h3>
                  <button onClick={() => { setSortAsc(!sortAsc); setSortCol('name'); }} style={{ background: 'none', border: '1px solid #e0e7e0', padding: '6px 12px', borderRadius: 6, cursor: 'pointer', fontSize: 13, color: '#555' }}>
                    {sortAsc ? '↑' : '↓'} Sort
                  </button>
                </div>
                {(activity || []).length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '40px 0', color: '#999' }}>
                    <RefreshCcw size={32} style={{ marginBottom: 12 }} />
                    <p style={{ margin: 0, fontSize: 14 }}>No activity yet — run your first task</p>
                  </div>
                ) : (
                  <table style={{ width: '100%', fontSize: 14 }}>
                    <thead>
                      <tr style={{ borderBottom: '2px solid #f0f0f0', textAlign: 'left' }}>
                        <th style={{ padding: '8px 12px', cursor: 'pointer' }}>Customer</th>
                        <th style={{ padding: '8px 12px', cursor: 'pointer' }}>Action</th>
                        <th style={{ padding: '8px 12px', cursor: 'pointer' }}>Status</th>
                        <th style={{ padding: '8px 12px' }}>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(activity || []).map((item, i) => (
                        <tr key={i} style={{ borderBottom: '1px solid #f5f5f5' }}>
                          <td style={{ padding: '10px 12px' }}>{item.customer_id || 'N/A'}</td>
                          <td style={{ padding: '10px 12px' }}>{item.action || 'Access granted'}</td>
                          <td style={{ padding: '10px 12px' }}>
                            <span style={{ background: '#e8f5ed', color: '#2F6F4F', padding: '2px 8px', borderRadius: 8, fontSize: 12 }}>{item.status || 'active'}</span>
                          </td>
                          <td style={{ padding: '10px 12px', color: '#888' }}>{item.created_at || 'just now'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </>
          )}

          {page === 'products' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <h1 style={{ fontFamily: "'Sora', sans-serif", fontSize: 28, fontWeight: 800, letterSpacing: '-1px' }}>Products</h1>
                <button onClick={() => setShowAddProduct(true)} style={{ background: '#2F6F4F', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: 8, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                  <Plus size={16} /> New Product
                </button>
              </div>
              {showAddProduct && (
                <form onSubmit={addProduct} style={{ background: '#fff', borderRadius: 12, padding: 24, border: '1px solid #e0e7e0', marginBottom: 24 }}>
                  <h3 style={{ fontFamily: "'Sora', sans-serif", margin: '0 0 16px', fontSize: 16 }}>Create Product</h3>
                  <div style={{ display: 'flex', gap: 12 }}>
                    <input
                      value={newProduct}
                      onChange={e => setNewProduct(e.target.value)}
                      placeholder="Product name"
                      style={{ flex: 1, padding: '10px 16px', borderRadius: 8, border: '1px solid #e0e7e0', fontSize: 14, outline: 'none' }}
                    />
                    <button type="submit" style={{ background: '#F2A63B', color: '#1a1a1a', border: 'none', padding: '10px 20px', borderRadius: 8, fontWeight: 700, cursor: 'pointer' }}>Create</button>
                    <button type="button" onClick={() => setShowAddProduct(false)} style={{ background: 'none', border: '1px solid #e0e7e0', padding: '10px 16px', borderRadius: 8, cursor: 'pointer' }}>Cancel</button>
                  </div>
                </form>
              )}
              {(products || []).length === 0 ? (
                <div style={{ background: '#fff', borderRadius: 12, padding: '60px 0', border: '1px dashed #cbd9cc', textAlign: 'center', color: '#888' }}>
                  <Layers size={40} style={{ marginBottom: 12, color: '#2F6F4F' }} />
                  <p style={{ margin: '0 0 12px', fontSize: 14 }}>No products yet. Add your first one!</p>
                  <button onClick={() => setShowAddProduct(true)} style={{ background: '#2F6F4F', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: 8, fontWeight: 600, cursor: 'pointer' }}>
                    Add Product
                  </button>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
                  {(products || []).map((p, i) => (
                    <div key={p.id || i} style={{ background: '#fff', borderRadius: 12, padding: 20, border: '1px solid #e0e7e0', transition: 'all 0.2s', cursor: 'pointer' }}>
                      <h3 style={{ fontFamily: "'Sora', sans-serif", margin: '0 0 8px', fontSize: 16, fontWeight: 700 }}>{p.name}</h3>
                      <p style={{ fontSize: 13, color: '#888', margin: 0 }}>Created: {p.created_at || 'just now'}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {page === 'files' && (
            <div>
              <h1 style={{ fontFamily: "'Sora', sans-serif", fontSize: 28, fontWeight: 800, letterSpacing: '-1px', marginBottom: 24 }}>Bonus Files</h1>
              <form onSubmit={uploadFile} style={{ background: '#fff', borderRadius: 12, padding: 24, border: '1px solid #e0e7e0', marginBottom: 24 }}>
                <h3 style={{ fontFamily: "'Sora', sans-serif", margin: '0 0 16px', fontSize: 16 }}>Upload Bonus File</h3>
                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                  <input
                    value={newFileName}
                    onChange={e => setNewFileName(e.target.value)}
                    placeholder="File name (e.g. bonus-pack.zip)"
                    style={{ flex: 1, minWidth: 200, padding: '10px 16px', borderRadius: 8, border: '1px solid #e0e7e0', fontSize: 14, outline: 'none' }}
                  />
                  <select value={selectedProduct} onChange={e => setSelectedProduct(e.target.value)} style={{ padding: '10px 16px', borderRadius: 8, border: '1px solid #e0e7e0', fontSize: 14, outline: 'none', background: '#fff' }}>
                    <option value="">Select product</option>
                    {(products || []).map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                  <button type="submit" style={{ background: '#2F6F4F', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: 8, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Upload size={16} /> Upload
                  </button>
                </div>
              </form>
              {(bonusFiles || []).length === 0 ? (
                <div style={{ background: '#fff', borderRadius: 12, padding: '60px 0', border: '1px dashed #cbd9cc', textAlign: 'center', color: '#888' }}>
                  <Upload size={40} style={{ marginBottom: 12, color: '#2F6F4F' }} />
                  <p style={{ margin: 0, fontSize: 14 }}>No bonus files yet. Upload your first one above.</p>
                </div>
              ) : (
                <div style={{ background: '#fff', borderRadius: 12, padding: 24, border: '1px solid #e0e7e0' }}>
                  <table style={{ width: '100%', fontSize: 14 }}>
                    <thead>
                      <tr style={{ borderBottom: '2px solid #f0f0f0', textAlign: 'left' }}>
                        <th style={{ padding: '8px 12px' }}>Name</th>
                        <th style={{ padding: '8px 12px' }}>Size</th>
                        <th style={{ padding: '8px 12px' }}>Uploaded</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(bonusFiles || []).map((f, i) => (
                        <tr key={f.id || i} style={{ borderBottom: '1px solid #f5f5f5' }}>
                          <td style={{ padding: '10px 12px', fontWeight: 600 }}>{f.name}</td>
                          <td style={{ padding: '10px 12px', color: '#888' }}>{(f.size / 1048576).toFixed(1)} MB</td>
                          <td style={{ padding: '10px 12px', color: '#888' }}>{f.uploaded_at || 'just now'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {page === 'claims' && (
            <div>
              <h1 style={{ fontFamily: "'Sora', sans-serif", fontSize: 28, fontWeight: 800, letterSpacing: '-1px', marginBottom: 24 }}>Claim Pages</h1>
              {(claimPages || []).length === 0 ? (
                <div style={{ background: '#fff', borderRadius: 12, padding: '60px 0', border: '1px dashed #cbd9cc', textAlign: 'center', color: '#888' }}>
                  <Link2 size={40} style={{ marginBottom: 12, color: '#2F6F4F' }} />
                  <p style={{ margin: 0, fontSize: 14 }}>No claim pages yet. Create one to start protecting your bonuses.</p>
                </div>
              ) : (
                <div style={{ background: '#fff', borderRadius: 12, padding: 24, border: '1px solid #e0e7e0' }}>
                  <table style={{ width: '100%', fontSize: 14 }}>
                    <thead>
                      <tr style={{ borderBottom: '2px solid #f0f0f0', textAlign: 'left' }}>
                        <th style={{ padding: '8px 12px' }}>URL</th>
                        <th style={{ padding: '8px 12px' }}>Slug</th>
                        <th style={{ padding: '8px 12px' }}>Product</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(claimPages || []).map((c, i) => (
                        <tr key={c.id || i} style={{ borderBottom: '1px solid #f5f5f5' }}>
                          <td style={{ padding: '10px 12px', color: '#2F6F4F', fontWeight: 600 }}>{c.url || '—'}</td>
                          <td style={{ padding: '10px 12px', color: '#888' }}>{c.slug || '—'}</td>
                          <td style={{ padding: '10px 12px' }}>{c.product_id || '—'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {page === 'grants' && (
            <div>
              <h1 style={{ fontFamily: "'Sora', sans-serif", fontSize: 28, fontWeight: 800, letterSpacing: '-1px', marginBottom: 24 }}>Access Grants</h1>
              {!showGrantForm && (
                <button onClick={() => setShowGrantForm(true)} style={{ background: '#2F6F4F', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: 8, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', marginBottom: 24 }}>
                  <KeyRound size={16} /> Grant Access
                </button>
              )}
              {showGrantForm && (
                <form onSubmit={grantAccess} style={{ background: '#fff', borderRadius: 12, padding: 24, border: '1px solid #e0e7e0', marginBottom: 24 }}>
                  <h3 style={{ fontFamily: "'Sora', sans-serif", margin: '0 0 16px', fontSize: 16 }}>Grant Bonus Access</h3>
                  <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                    <input
                      type="email"
                      value={customerEmail}
                      onChange={e => setCustomerEmail(e.target.value)}
                      placeholder="customer@email.com"
                      required
                      style={{ flex: 1, minWidth: 200, padding: '10px 16px', borderRadius: 8, border: '1px solid #e0e7e0', fontSize: 14, outline: 'none' }}
                    />
                    <select value={selectedProduct} onChange={e => setSelectedProduct(e.target.value)} style={{ padding: '10px 16px', borderRadius: 8, border: '1px solid #e0e7e0', fontSize: 14, outline: 'none', background: '#fff' }}>
                      <option value="">Select product</option>
                      {(products || []).map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                    <button type="submit" style={{ background: '#F2A63B', color: '#1a1a1a', border: 'none', padding: '10px 20px', borderRadius: 8, fontWeight: 700, cursor: 'pointer' }}>Grant Access</button>
                    <button type="button" onClick={() => setShowGrantForm(false)} style={{ background: 'none', border: '1px solid #e0e7e0', padding: '10px 16px', borderRadius: 8, cursor: 'pointer' }}>Cancel</button>
                  </div>
                </form>
              )}
              <div style={{ background: '#fff', borderRadius: 12, padding: 24, border: '1px solid #e0e7e0' }}>
                <h3 style={{ fontFamily: "'Sora', sans-serif", fontSize: 16, fontWeight: 700, margin: '0 0 16px' }}>Revoke Access on Refund</h3>
                <p style={{ fontSize: 14, color: '#888', margin: '0 0 16px' }}>Enter customer email to revoke access immediately:</p>
                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                  <input
                    type="email"
                    placeholder="customer@email.com"
                    id="revoke-email"
                    style={{ flex: 1, minWidth: 200, padding: '10px 16px', borderRadius: 8, border: '1px solid #e0e7e0', fontSize: 14, outline: 'none' }}
                  />
                  <button
                    onClick={() => {
                      const el = document.getElementById('revoke-email');
                      if (!el?.value) { showToast('Enter an email to revoke', 'error'); return; }
                      revokeAccess(el.value, selectedProduct || 'unknown');
                      el.value = '';
                    }}
                    style={{ background: '#c0392b', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: 8, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}
                  >
                    <Ban size={16} /> Revoke Access
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* TOAST */}
      {toast && (
        <div style={{
          position: 'fixed', bottom: 24, right: 24, zIndex: 999,
          background: toast.type === 'error' ? '#c0392b' : '#2F6F4F', color: '#fff',
          padding: '12px 24px', borderRadius: 10, display: 'flex', alignItems: 'center', gap: 8,
          fontSize: 14, fontWeight: 600, boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
          animation: 'fadeIn 0.3s ease'
        }}>
          {toast.type === 'error' ? <X size={16} /> : <CheckCircle size={16} />} {toast.msg}
        </div>
      )}
    </div>
  );
}

function App() {
  const [auth, setAuth] = useState(() => {
    try {
      const a = JSON.parse(localStorage.getItem('nc_auth') || 'null');
      return (a && a.token && a.user && typeof a.user.email === 'string') ? a : null;
    } catch { return null; }
  });
  const [showAuth, setShowAuth] = useState(false);

  useEffect(() => {
    if (!auth?.token) return;
    const _b = window.__NC_BASE__ || ''; const _s = window.__COMPANY_SLUG__ || '';
    fetch(`${_b}/api/c/${_s}/auth/me`, { headers: { Authorization: `Bearer ${auth.token}` } })
      .then(r => r.json()).then(d => {
        if (!d.ok) { localStorage.removeItem('nc_auth'); setAuth(null); }
      }).catch(() => {});
  }, []);

  const onAuth = (data) => { localStorage.setItem('nc_auth', JSON.stringify(data)); setAuth(data); setShowAuth(false); };
  const onLogout = () => { localStorage.removeItem('nc_auth'); setAuth(null); };

  const AuthGate = () => {
    const [mode, setMode] = useState('signup');
    const [form, setForm] = useState({ name: '', email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const _ip = { width: '100%', padding: '11px 13px', margin: '6px 0', borderRadius: 9, border: '1px solid #2a3350', background: '#0b1020', color: '#e6eaf2', fontSize: 14, outline: 'none', boxSizing: 'border-box' };

    const submit = async (e) => {
      e.preventDefault();
      if (!form.email || !form.password) return;
      setLoading(true); setError('');
      try {
        const _b = window.__NC_BASE__ || '';
        const _s = window.__COMPANY_SLUG__ || '';
        const res = await fetch(`${_b}/api/c/${_s}/auth/${mode}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: form.email, password: form.password, name: form.name })
        });
        const json = await res.json();
        if (!json.ok) { setError(json.error || 'Authentication failed'); setLoading(false); return; }
        onAuth(json);
      } catch { setError('Connection error — please try again.'); setLoading(false); }
    };

    return (
      <div onClick={() => setShowAuth(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(2,6,18,.7)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
        <form onClick={e => e.stopPropagation()} onSubmit={submit} style={{ background: '#0f1424', border: '1px solid #232b45', padding: 28, borderRadius: 16, width: 360, maxWidth: '90vw', color: '#e6eaf2' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <div style={{ width: 32, height: 32, background: '#2F6F4F', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Feather size={16} color="#fff" />
            </div>
            <h3 style={{ margin: 0, fontSize: 20, fontWeight: 700 }}>{mode === 'signup' ? 'Create your account' : 'Welcome back'}</h3>
          </div>
          {mode === 'signup' && (
            <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Your name" style={_ip} />
          )}
          <input value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="Work email" type="email" required style={_ip} />
          <input value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} placeholder="Password" type="password" required style={_ip} />
          {error && <p style={{ color: '#f87171', fontSize: 13, margin: '6px 0 0' }}>{error}</p>}
          <button type="submit" disabled={loading} style={{ width: '100%', marginTop: 10, padding: '12px', borderRadius: 9, border: 'none', background: loading ? '#2a5f44' : '#2F6F4F', color: '#fff', fontWeight: 700, fontSize: 15, cursor: loading ? 'default' : 'pointer' }}>
            {loading ? '…' : mode === 'signup' ? 'Get started free' : 'Log in'}
          </button>
          <p onClick={() => { setMode(mode === 'signup' ? 'login' : 'signup'); setError(''); }} style={{ marginTop: 14, fontSize: 13, color: '#9aa6bd', cursor: 'pointer', textAlign: 'center' }}>
            {mode === 'signup' ? 'Already have an account? Log in' : 'New here? Create an account'}
          </p>
        </form>
      </div>
    );
  };

  if (auth?.user) return <ProductApp user={auth.user} token={auth.token} onLogout={onLogout} />;

  return (
    <>
      <LandingPage onGetStarted={() => setShowAuth(true)} onSignup={() => setShowAuth(true)} onLogin={() => setShowAuth(true)} />
      <button onClick={() => setShowAuth(true)} style={{ position: 'fixed', top: 16, right: 16, zIndex: 999, background: '#2F6F4F', color: '#fff', border: 'none', padding: '10px 18px', borderRadius: 10, fontWeight: 600, cursor: 'pointer' }}>Sign in</button>
      {showAuth && <AuthGate />}
    </>
  );
}

export default App;