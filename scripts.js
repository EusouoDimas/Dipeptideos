/* scripts.js — imagens substituídas conforme solicitado
   Mantém carrinho, rolagem entre seções e lógica de preços.
*/

const EXCHANGE_RATE = 5.20;
const CART_KEY = 'dipeptides_cart_v1';

let currentProductId = null;
let cart = loadCart();

const PRODUCTS = [
  {
    id: 'semax',
    name: 'Semax 300mcg (intranasal)',
    img: 'https://images-na.ssl-images-amazon.com/images/I/61C-pe3A77L._AC_UL600_SR600,600_.jpg',
    marketPriceUSD: 49.99,
    category: 'Nootrópicos',
    short: 'Análogo do ACTH — foco, recuperação neural e nootrópico.',
    longDesc: 'Semax é um peptídeo nootrópico desenvolvido para modular a expressão de fatores neurotróficos e apoiar funções cognitivas. Estudos pré-clínicos e dados clínicos limitados indicam benefício em atenção e recuperação neurológica em contextos específicos.',
    dosage: 'Uso comum: 300mcg via intranasal, até 2x ao dia (protocolos variados). Consulte especialista.',
    usage: 'Indicado para suporte cognitivo e protocolos clínicos sob supervisão.',
    storage: 'Armazenar refrigerado (2–8°C). Protegido da luz.',
    warnings: 'Não usar sem orientação médica; evitar em gravidez e amamentação.',
    certification: 'Relatórios de pureza por lote (HPLC).'
  },
  {
    id: 'selank',
    name: 'Selank 250mcg (intranasal)',
    img: 'https://m.media-amazon.com/images/I/6134OLWY99L.jpg',
    marketPriceUSD: 39.99,
    category: 'Ansiedade & Foco',
    short: 'Peptídeo ansiolítico com efeitos cognitivos.',
    longDesc: 'Selank é um heptapeptídeo com ação ansiolítica e moduladora da neuroquímica. Estudos indicam redução de ansiedade sem sedação marcante e potencial melhora de concentração em alguns protocolos.',
    dosage: 'Uso comum: 250mcg intranasal, 1–3x por dia conforme protocolo.',
    usage: 'Utilizado em esquemas de suporte a ansiedade sob supervisão.',
    storage: 'Refrigerar; manter em embalagem original.',
    warnings: 'Avaliar interações com psicotrópicos. Não indicado sem avaliação médica.',
    certification: 'Relatórios analíticos por lote.'
  },
  {
    id: 'bpc157',
    name: 'BPC-157 5mg (ampola)',
    img: 'https://m.media-amazon.com/images/I/610zfTAtzgL._UF1000,1000_QL80_.jpg',
    marketPriceUSD: 29.99,
    category: 'Recuperação',
    short: 'Peptídeo de reparo tecidual e anti-inflamatório (dados pré-clínicos).',
    longDesc: 'BPC-157 é um pentadecapeptídeo com forte sinal em estudos animais para reparo de tecidos, tendões e mucosas. A tradução clínica ainda é limitada; protocolos humanos variam bastante.',
    dosage: 'Ex.: 5mg diluído conforme instruções do laboratório.',
    usage: 'Uso em protocolos de recuperação e reparo tecidual sob supervisão profissional.',
    storage: 'Armazenar refrigerado; descartar após reconstituição conforme instruções.',
    warnings: 'Dados humanos de longo prazo insuficientes; consultar especialista.',
    certification: 'Análises de pureza e endotoxinas por lote.'
  },
  {
    id: 'cjc-ipamorelin',
    name: 'CJC-1295 + Ipamorelin (combo)',
    img: 'https://shop.hydrationroom.com/cdn/shop/files/CJC-1295_530x@2x.png?v=1753123784',
    marketPriceUSD: 79.99,
    category: 'Regulação Hormonal',
    short: 'Estimula picos de GH de forma pulsátil — usado em protocolos controlados.',
    longDesc: 'Combinação de GHRH análogo com secretagogo para aumentar pulsos de GH. Potencial em composição corporal, recuperação e qualidade de sono, mas requer acompanhamento médico.',
    dosage: 'Protocolos variam; administração intermitente. Monitoramento laboratorial requerido.',
    usage: 'Somente em protocolos clínicos/controle médico.',
    storage: 'Refrigerado conforme instruções do fabricante.',
    warnings: 'Monitorar IGF-1 e marcadores relevantes.',
    certification: 'Relatórios analíticos por lote.'
  },
  {
    id: 'epitalon',
    name: 'Epitalon 10mg (ampola)',
    img: 'https://m.media-amazon.com/images/I/61Jas92TY4L.jpg',
    marketPriceUSD: 59.00,
    category: 'Antienvelhecimento',
    short: 'Tetrapeptídeo estudado por efeitos em telômeros e marcadores do envelhecimento.',
    longDesc: 'Epitalon é um tetrapeptídeo com literatura pré-clínica sobre telomerase e marcadores do envelhecimento. Estudos em humanos são limitados; uso requer avaliação técnica.',
    dosage: 'Protocolos variados; consultar referência técnica.',
    usage: 'Uso em pesquisa e protocolos anti-idade sob supervisão.',
    storage: 'Refrigerar; proteger da luz.',
    warnings: 'Evidência clínica limitada; avaliar risco/benefício.',
    certification: 'Documentos analíticos por lote.'
  },
  {
    id: 'motsc',
    name: 'MOTS-c 5mg (ampola)',
    img: 'https://5.imimg.com/data5/SELLER/Default/2025/6/519272153/QX/DX/RY/202184625/mots-c-5mg-injecation-500x500.jpg',
    marketPriceUSD: 69.00,
    category: 'Mitocondrial',
    short: 'Peptídeo mitocondrial com papel no metabolismo e resistência ao estresse.',
    longDesc: 'MOTS-c é uma mitocina que tem demonstrado efeitos metabólicos em modelos animais — potencial para melhorar sensibilidade à insulina e resistência ao estresse oxidativo.',
    dosage: 'Protocolos experimentais; uso com supervisão.',
    usage: 'Pesquisa e protocolos especializados com supervisão médica.',
    storage: 'Refrigerar; seguir instruções do fabricante.',
    warnings: 'Dados clínicos limitados; evitar uso sem avaliação.',
    certification: 'Relatórios de cromatografia por lote.'
  },
  {
    id: 'humanin',
    name: 'Humanin (análogos) 5mg (ampola)',
    img: 'https://www.limitlesslifenootropics.com/wp-content/uploads/2021/02/humanin-5mg-1.png',
    marketPriceUSD: 64.50,
    category: 'Neuroproteção',
    short: 'Peptídeo com efeitos neuroprotetores e sinalização mitocondrial.',
    longDesc: 'Humanin e análogos são estudados por proteção mitocondrial e possível papel em doenças neurodegenerativas; pesquisa ativa em modelos pré-clínicos.',
    dosage: 'Protocolos experimentais; seguir orientação especializada.',
    usage: 'Uso restrito a ensaios clínicos e protocolos sob supervisão profissional.',
    storage: 'Refrigerar; controlar integridade do lote.',
    warnings: 'Uso experimental; consultar equipe médica antes de qualquer administração.',
    certification: 'Documentos analíticos por lote disponíveis.'
  }
];

// ===== utilitários de preço =====
function computePrices(usd){
  const brl = usd * EXCHANGE_RATE;
  const previous = brl * 1.5;
  const current = previous * 0.25;
  return { brl: round(brl), previous: round(previous), current: round(current) };
}
function round(v){ return Number(v.toFixed(2)); }
function formatBRL(v){ return v.toLocaleString('pt-BR', {style:'currency', currency:'BRL'}); }
function escapeHtml(str) { return String(str).replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[m]); }

// ===== elementos =====
const grid = document.getElementById('productGrid');
const prodImg = document.getElementById('prod-img');
const prodName = document.getElementById('prod-name');
const prodCategory = document.getElementById('prod-category');
const prodLong = document.getElementById('prod-long');
const prodSpecs = document.getElementById('prod-specs');
const prodCert = document.getElementById('prod-cert');
const priceAside = document.getElementById('price-aside');
const pricePrevEl = document.getElementById('price-previous');
const priceCurrEl = document.getElementById('price-current');
const priceSaveEl = document.getElementById('price-save');
const buyButton = document.getElementById('buy-button');

const cartBtn = document.getElementById('cart-btn');
const cartCountEl = document.getElementById('cart-count');
const cartDrawer = document.getElementById('cart-drawer');
const cartItemsEl = document.getElementById('cart-items');
const cartTotalEl = document.getElementById('cart-total');
const closeCartBtn = document.getElementById('close-cart');
const clearCartBtn = document.getElementById('clear-cart');
const checkoutBtn = document.getElementById('checkout');

// ===== render grid =====
function renderGrid(list){
  grid.innerHTML = '';
  list.forEach(p => {
    const prices = computePrices(p.marketPriceUSD);
    const el = document.createElement('article');
    el.className = 'product-card';
    el.innerHTML = `
      <div class="imgwrap">
        <img src="${p.img}" alt="${escapeHtml(p.name)}" loading="lazy">
        <div class="promo-badge">Promo</div>
      </div>
      <div class="product-info">
        <h3>${escapeHtml(p.name)}</h3>
        <p>${escapeHtml(p.short)}</p>
        <div class="price-row">
          <div>
            <div class="previous">${formatBRL(prices.previous)}</div>
            <div class="current">${formatBRL(prices.current)}</div>
          </div>
          <div class="product-actions">
            <button class="small-btn" data-id="${p.id}">Ver</button>
            <button class="small-muted" data-add="${p.id}">Adicionar</button>
          </div>
        </div>
      </div>
    `;
    const imgEl = el.querySelector('img');
    imgEl.onerror = () => { imgEl.src = 'https://via.placeholder.com/1200x800.png?text=Dipept%C3%ADdeos'; imgEl.style.objectFit = 'cover'; };
    grid.appendChild(el);
  });

  document.querySelectorAll('.small-btn').forEach(btn => btn.addEventListener('click', () => openProduct(btn.dataset.id)));
  document.querySelectorAll('.small-muted').forEach(btn => btn.addEventListener('click', (e) => addToCart(e.currentTarget.dataset.add, 1)));
}

// ===== rolagem suave entre seções =====
function showRoute(name){
  if(name === 'product' && !currentProductId) name = 'shop';
  const el = document.getElementById(name);
  if(el){
    el.classList.add('active');
    document.querySelectorAll('.route').forEach(r => { if(r.id !== name) r.classList.remove('active'); });
    el.scrollIntoView({ behavior:'smooth', block:'start' });
  }
}
document.querySelectorAll('.nav-btn').forEach(b => b.addEventListener('click', ()=> showRoute(b.dataset.route)));
document.querySelectorAll('[data-route]').forEach(b => b.addEventListener('click', ()=> showRoute(b.dataset.route)));

// ===== busca =====
document.getElementById('search').addEventListener('input', (e) => {
  const q = e.target.value.trim().toLowerCase();
  const filtered = PRODUCTS.filter(p => (p.name + ' ' + p.category).toLowerCase().includes(q));
  renderGrid(filtered);
});

// ===== abrir produto =====
function openProduct(id){
  const p = PRODUCTS.find(x => x.id === id);
  if(!p) return;
  currentProductId = id;

  prodImg.src = p.img; prodImg.alt = p.name;
  prodName.textContent = p.name;
  prodCategory.textContent = 'Categoria: ' + p.category;
  prodLong.innerHTML = `<h4>Descrição</h4><p class="muted">${escapeHtml(p.longDesc)}</p>`;
  prodSpecs.innerHTML = `
    <div class="feature"><h4>Dosagem</h4><p class="muted">${escapeHtml(p.dosage)}</p></div>
    <div class="feature"><h4>Modo de uso</h4><p class="muted">${escapeHtml(p.usage)}</p></div>
    <div class="feature"><h4>Armazenamento</h4><p class="muted">${escapeHtml(p.storage)}</p></div>
    <div class="feature"><h4>Advertências</h4><p class="muted">${escapeHtml(p.warnings)}</p></div>
  `;
  prodCert.textContent = p.certification || '';

  const prices = computePrices(p.marketPriceUSD);
  pricePrevEl.textContent = formatBRL(prices.previous);
  priceCurrEl.textContent = formatBRL(prices.current);
  priceSaveEl.textContent = 'Economize ' + formatBRL(prices.previous - prices.current);

  priceAside.style.display = 'block';
  buyButton.onclick = () => { addToCart(p.id, 1); openCart(); };

  showRoute('product');
}

// ===== CARRINHO (localStorage) =====
function loadCart(){ try{ const raw = localStorage.getItem(CART_KEY); return raw ? JSON.parse(raw) : []; } catch(e){ return []; } }
function saveCart(){ localStorage.setItem(CART_KEY, JSON.stringify(cart)); }
function findCartItem(id){ return cart.find(i => i.id === id); }

function addToCart(id, qty = 1){
  const p = PRODUCTS.find(x => x.id === id); if(!p) return;
  const prices = computePrices(p.marketPriceUSD);
  const existing = findCartItem(id);
  if(existing) existing.qty += qty; else cart.push({ id: p.id, name: p.name, price: prices.current, img: p.img, qty });
  saveCart(); renderCart(); showToast(`${p.name} adicionado ao carrinho`);
}
function removeFromCart(id){ cart = cart.filter(i => i.id !== id); saveCart(); renderCart(); }
function updateQty(id, newQty){ const it = findCartItem(id); if(!it) return; it.qty = Math.max(0, Math.floor(newQty)); if(it.qty === 0) removeFromCart(id); saveCart(); renderCart(); }
function clearCart(){ cart = []; saveCart(); renderCart(); }
function cartTotal(){ return cart.reduce((s,i) => s + (i.price * i.qty), 0); }

function renderCart(){
  const totalItems = cart.reduce((s,i) => s + i.qty, 0);
  cartCountEl.textContent = totalItems;
  if(cart.length === 0){
    cartItemsEl.innerHTML = '<div class="muted" style="padding:12px">Seu carrinho está vazio.</div>';
    cartTotalEl.textContent = formatBRL(0);
    return;
  }
  cartItemsEl.innerHTML = '';
  cart.forEach(item => {
    const div = document.createElement('div'); div.className = 'cart-item';
    div.innerHTML = `
      <img src="${item.img}" alt="${escapeHtml(item.name)}" loading="lazy">
      <div style="flex:1">
        <h4>${escapeHtml(item.name)}</h4>
        <div class="muted">${formatBRL(item.price)} cada</div>
        <div class="qty-controls">
          <button data-action="dec" data-id="${item.id}">−</button>
          <div class="muted" style="min-width:28px;text-align:center">${item.qty}</div>
          <button data-action="inc" data-id="${item.id}">+</button>
          <button style="margin-left:10px" data-action="remove" data-id="${item.id}" class="small-muted">Remover</button>
        </div>
      </div>
    `;
    cartItemsEl.appendChild(div);
  });
  cartItemsEl.querySelectorAll('[data-action]').forEach(b => {
    b.addEventListener('click', (e) => {
      const id = e.currentTarget.dataset.id;
      const action = e.currentTarget.dataset.action;
      const it = findCartItem(id); if(!it) return;
      if(action === 'inc') updateQty(id, it.qty + 1);
      if(action === 'dec') updateQty(id, it.qty - 1);
      if(action === 'remove') removeFromCart(id);
    });
  });
  cartTotalEl.textContent = formatBRL(cartTotal());
}

function openCart(){ cartDrawer.classList.add('open'); cartDrawer.setAttribute('aria-hidden','false'); renderCart(); }
function closeCart(){ cartDrawer.classList.remove('open'); cartDrawer.setAttribute('aria-hidden','true'); }

cartBtn.addEventListener('click', openCart);
closeCartBtn.addEventListener('click', closeCart);
clearCartBtn.addEventListener('click', () => { if(confirm('Limpar carrinho?')) clearCart(); });
checkoutBtn.addEventListener('click', () => {
  if(cart.length === 0){ alert('Seu carrinho está vazio.'); return; }
  alert('Operação simulada: pedido criado. Total: ' + formatBRL(cartTotal()));
  clearCart(); closeCart();
});

// ===== TOAST =====
function showToast(msg){
  const t = document.createElement('div');
  t.style.position='fixed'; t.style.right='18px'; t.style.bottom='18px';
  t.style.background='linear-gradient(90deg,#34d399,#7c5cff)'; t.style.color='#021'; t.style.padding='10px 14px';
  t.style.borderRadius='10px'; t.style.fontWeight='700'; t.style.boxShadow='0 8px 30px rgba(2,6,23,0.6)';
  t.textContent = msg; document.body.appendChild(t);
  setTimeout(()=>{ t.style.opacity='0'; setTimeout(()=>t.remove(),350); }, 1800);
}

// ===== Footer links (rolagem designada) =====
document.getElementById('jobs-link').addEventListener('click', ()=> showRoute('contact'));
document.getElementById('privacy-link').addEventListener('click', ()=> showRoute('about'));
document.getElementById('tech-support').addEventListener('click', ()=> showRoute('contact'));
document.getElementById('institutional').addEventListener('click', ()=> showRoute('contact'));

// inicialização
renderGrid(PRODUCTS);
renderCart();
showRoute('home');

// mobile menu quick feedback
document.querySelector('.mobile-menu')?.addEventListener('click', ()=> alert('Menu móvel — use o topo em telas grandes.'));
