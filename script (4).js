/* ============================================================
   SCRIPT.JS — Al Baik Pizza | Shared Interactivity
   ============================================================ */

/* ── PRODUCT DATA ───────────────────────────────────────── */
const PRODUCTS = [
  { id:'p1',  cat:'pizza',   name:'Chicken Tikka Pizza', price:650,  emoji:'🍕', img:'images/pizza-tikka.svg',   desc:'Spicy chicken tikka, fresh capsicum, tomato & extra mozzarella on a crispy hand-tossed crust.',   tags:['Spicy','Best Seller','Chicken'], detail:'Our most-loved pizza. Tender chicken tikka marinated in our house spice blend, topped with fresh capsicum, red onion, juicy tomatoes and a generous stretch of mozzarella — all on our hand-tossed crust baked to a perfect golden crisp.' },
  { id:'p2',  cat:'pizza',   name:'BBQ Chicken Pizza',   price:700,  emoji:'🍕', img:'images/pizza-bbq.svg',     desc:'Smoky BBQ sauce, grilled chicken strips & triple mozzarella — a family favourite.',                  tags:['BBQ','Chicken','Family'],       detail:'Rich smoky BBQ sauce smothered on our signature crust, layered with grilled chicken strips, caramelised onions and three types of cheese melted to bubbly perfection.' },
  { id:'p3',  cat:'pizza',   name:'Double Cheese Pizza', price:750,  emoji:'🍕', img:'images/pizza-cheese.svg',  desc:'Double mozzarella pull, garlic-herb base, golden crispy edges.',                                    tags:['Cheese','Vegetarian','Special'], detail:'For the cheese obsessed. A rich garlic-herb sauce base loaded with double mozzarella and a blend of cheddar, baked until the edges are golden and the cheese pull is glorious.' },
  { id:'p4',  cat:'pizza',   name:'Veggie Supreme',      price:550,  emoji:'🍕', img:'images/pizza-veggie.svg',  desc:'Capsicum, black olives, mushrooms, tomatoes, red onion & fresh herbs.',                              tags:['Vegetarian','Healthy','Fresh'],  detail:'A celebration of fresh vegetables. Crisp capsicum, earthy mushrooms, black olives, juicy tomatoes and red onion over a tangy tomato base, finished with fresh herbs.' },
  { id:'p5',  cat:'burger',  name:'Zinger Burger',       price:400,  emoji:'🍔', img:'images/burger-zinger.svg', desc:'Our spicy signature zinger fillet — hot, crunchy & utterly irresistible.',                           tags:['Spicy','Best Seller','Hot'],     detail:'Khairpur\'s favourite burger. Our secret-spiced zinger fillet, perfectly fried to a fiery crisp, served in a toasted brioche bun with tangy slaw and zinger mayo.' },
  { id:'p6',  cat:'burger',  name:'Crispy Chicken',      price:350,  emoji:'🍔', img:'images/burger-crispy.svg', desc:'Crispy fried fillet, fresh lettuce, pickles & signature mayo.',                                     tags:['Chicken','Classic','Crispy'],   detail:'A classic done right. Golden-crispy chicken fillet seasoned simply and fried to crunch, topped with cool lettuce, crunchy pickles and our house mayo in a soft sesame bun.' },
  { id:'p7',  cat:'burger',  name:'Double Patty Burger', price:500,  emoji:'🍔', img:'images/burger-double.svg', desc:'Two beef patties, cheddar, caramelised onions & secret sauce.',                                     tags:['Beef','Double','Premium'],      detail:'Stack up. Two seasoned beef patties grilled to juicy perfection, layered with melted cheddar, sweet caramelised onions, crisp lettuce and our proprietary burger sauce.' },
  { id:'p8',  cat:'sides',   name:'Loaded Fries',        price:250,  emoji:'🍟', img:'images/fries-loaded.svg',  desc:'Crispy fries topped with cheese sauce, jalapeños & mayo drizzle.',                                  tags:['Spicy','Cheese','Loaded'],      detail:'Golden crispy fries buried under a waterfall of warm cheese sauce, pickled jalapeños and a zigzag of mayo. The side that steals the show.' },
  { id:'p9',  cat:'sides',   name:'Regular Fries',       price:150,  emoji:'🍟', img:'images/fries-regular.svg', desc:'Golden, salted, perfectly crispy — the classic side.',                                              tags:['Classic','Vegetarian','Simple'],detail:'Sometimes simple is best. Our fries are cut fresh daily, double-fried for maximum crunch and seasoned with just the right amount of salt.' },
  { id:'p10', cat:'sides',   name:'Chicken Nuggets',     price:280,  emoji:'🍗', img:'images/nuggets.svg',       desc:'6 tender chicken nuggets with smoky dipping sauce.',                                               tags:['Chicken','Kids','Snack'],       detail:'Six pieces of tender chicken in a crispy seasoned coating, served with our smoky house dipping sauce. Perfect for sharing — or not.' },
  { id:'p11', cat:'drinks',  name:'Fresh Lemonade',      price:120,  emoji:'🧃', img:'images/lemonade.svg',       desc:'Freshly squeezed with mint & a hint of chat masala.',                                               tags:['Fresh','Cold','Popular'],       detail:'Made to order. Fresh lemons squeezed and blended with chilled water, a handful of mint, a pinch of chat masala and just enough sugar. Refreshing every single time.' },
  { id:'p12', cat:'drinks',  name:'Cold Drink (500ml)',  price:80,   emoji:'🥤', img:'images/lemonade.svg',       desc:'Pepsi, 7UP or Mirinda — ice cold and refreshing.',                                                  tags:['Cold','Classic','Drink'],       detail:'Pepsi, 7UP or Mirinda — served ice-cold. The perfect companion to any meal.' },
];

/* ── CART STATE ─────────────────────────────────────────── */
let cart = JSON.parse(sessionStorage.getItem('ab_cart') || '[]');

function saveCart() { sessionStorage.setItem('ab_cart', JSON.stringify(cart)); }

function addToCart(id) {
  const p = PRODUCTS.find(x => x.id === id);
  if (!p) return;
  const ex = cart.find(x => x.id === id);
  ex ? ex.qty++ : cart.push({ id, qty:1 });
  saveCart(); updateCartUI();
  showToast(`${p.emoji} ${p.name} added to order!`);
}

function changeQty(id, delta) {
  const idx = cart.findIndex(x => x.id === id);
  if (idx < 0) return;
  cart[idx].qty += delta;
  if (cart[idx].qty <= 0) cart.splice(idx, 1);
  saveCart(); updateCartUI(); renderCartModal();
}

function updateCartUI() {
  const total = cart.reduce((s,i)=>s+i.qty,0);
  document.querySelectorAll('.cart-count-badge').forEach(el => { el.textContent=total; });
  const fab = document.querySelector('.cart-fab');
  if (fab) fab.classList.toggle('show', total > 0);
}

function renderCartModal() {
  const body = document.getElementById('cartModalBody');
  const tot  = document.getElementById('cartModalTotal');
  if (!body) return;
  if (!cart.length) {
    body.innerHTML = '<p style="text-align:center;color:var(--muted);padding:24px 0">Your cart is empty.</p>';
    if (tot) tot.textContent = 'Rs. 0';
    return;
  }
  body.innerHTML = cart.map((ci,idx)=>{
    const p = PRODUCTS.find(x=>x.id===ci.id);
    if (!p) return '';
    return `<div class="cart-item-row">
      <span class="ci-emoji">${p.emoji}</span>
      <div class="ci-info">
        <div class="ci-name">${p.name}</div>
        <div class="ci-price">Rs. ${(p.price*ci.qty).toLocaleString()}</div>
      </div>
      <div class="ci-qty">
        <button class="qty-btn" onclick="changeQty('${p.id}',-1)">−</button>
        <span style="color:#fff;font-weight:700;min-width:20px;text-align:center">${ci.qty}</span>
        <button class="qty-btn" onclick="changeQty('${p.id}',1)">+</button>
      </div>
    </div>`;
  }).join('');
  const total = cart.reduce((s,ci)=>{ const p=PRODUCTS.find(x=>x.id===ci.id); return p?s+p.price*ci.qty:s; },0);
  if (tot) tot.textContent = `Rs. ${total.toLocaleString()}`;
}

function openCartModal() {
  renderCartModal();
  const m = document.getElementById('cartModal');
  if (m) m.classList.add('open');
}
function closeCartModal() {
  const m = document.getElementById('cartModal');
  if (m) m.classList.remove('open');
}

function placeOrderFromCart() {
  if (!cart.length) { showToast('Your cart is empty!'); return; }
  const name  = document.getElementById('oName')?.value.trim();
  const phone = document.getElementById('oPhone')?.value.trim();
  const addr  = document.getElementById('oAddr')?.value.trim();
  const type  = document.getElementById('oType')?.value || 'Delivery';
  if (!name || !phone) { showToast('Please enter your name & phone first!'); return; }
  const total = cart.reduce((s,ci)=>{ const p=PRODUCTS.find(x=>x.id===ci.id); return p?s+p.price*ci.qty:s; },0);
  let msg = `🍕 *New Order — Al Baik Pizza*\n\n👤 *Name:* ${name}\n📞 *Phone:* ${phone}\n🏠 *${type}:* ${addr||type}\n\n*Items:*\n`;
  cart.forEach(ci=>{ const p=PRODUCTS.find(x=>x.id===ci.id); if(p) msg+=`• ${p.emoji} ${p.name} ×${ci.qty} = Rs. ${(p.price*ci.qty).toLocaleString()}\n`; });
  msg += `\n💰 *Total: Rs. ${total.toLocaleString()}*`;
  window.open(`https://wa.me/923001234567?text=${encodeURIComponent(msg)}`, '_blank');
  cart = []; saveCart(); updateCartUI(); closeCartModal();
  showToast('✅ Order sent via WhatsApp!');
}

/* ── TOAST ──────────────────────────────────────────────── */
function showToast(msg) {
  let t = document.getElementById('toast');
  if (!t) { t = document.createElement('div'); t.id='toast'; document.body.appendChild(t); }
  t.textContent = msg; t.classList.add('show');
  clearTimeout(t._t); t._t = setTimeout(()=>t.classList.remove('show'), 3000);
}

/* ── NAV ────────────────────────────────────────────────── */
function initNav() {
  const nav = document.querySelector('.nav');
  const ham = document.querySelector('.hamburger');
  const mob = document.querySelector('.mob-nav');

  window.addEventListener('scroll', ()=>{
    nav?.classList.toggle('solid', window.scrollY > 50);
  });

  ham?.addEventListener('click',()=>{
    mob?.classList.toggle('open');
    const sp = ham.querySelectorAll('span'); const op = mob?.classList.contains('open');
    if(op){ sp[0].style.transform='rotate(45deg) translate(5px,5px)'; sp[1].style.opacity='0'; sp[2].style.transform='rotate(-45deg) translate(5px,-5px)'; }
    else { sp.forEach(s=>{s.style.transform='';s.style.opacity='';}); }
  });

  // active link
  const page = location.pathname.split('/').pop()||'index.html';
  document.querySelectorAll('.nav-links a, .mob-nav a').forEach(a=>{
    if(a.getAttribute('href')===page || (page===''&&a.getAttribute('href')==='index.html')) a.classList.add('active');
  });
}

/* ── SCROLL REVEAL ──────────────────────────────────────── */
function initScrollReveal() {
  const obs = new IntersectionObserver(entries=>{
    entries.forEach(e=>{
      if(e.isIntersecting){
        const d = parseInt(e.target.dataset.delay||0);
        setTimeout(()=>e.target.classList.add('visible'), d);
        obs.unobserve(e.target);
      }
    });
  }, { threshold:0.1 });
  document.querySelectorAll('[data-sr]').forEach(el=>obs.observe(el));
}

/* ── COUNTER ────────────────────────────────────────────── */
function initCounters() {
  const obs = new IntersectionObserver(entries=>{
    entries.forEach(e=>{
      if(!e.isIntersecting) return;
      const el=e.target; const end=parseInt(el.dataset.count); const suf=el.dataset.suffix||'';
      let cur=0; const step=Math.ceil(end/80);
      const tick=()=>{ cur=Math.min(cur+step,end); el.textContent=cur.toLocaleString()+suf; if(cur<end)requestAnimationFrame(tick); };
      requestAnimationFrame(tick); obs.unobserve(el);
    });
  },{threshold:.5});
  document.querySelectorAll('[data-count]').forEach(c=>obs.observe(c));
}

/* ── FAQ ────────────────────────────────────────────────── */
function initFAQ() {
  document.querySelectorAll('.faq-item').forEach(item=>{
    item.querySelector('.faq-q')?.addEventListener('click',()=>{
      const isOpen=item.classList.contains('open');
      document.querySelectorAll('.faq-item').forEach(i=>{i.classList.remove('open');i.querySelector('.faq-a').style.maxHeight=null;});
      if(!isOpen){ item.classList.add('open'); item.querySelector('.faq-a').style.maxHeight=item.querySelector('.faq-a').scrollHeight+'px'; }
    });
  });
}

/* ── FILTER TABS ────────────────────────────────────────── */
function initFilterTabs() {
  document.querySelectorAll('.filter-tab').forEach(btn=>{
    btn.addEventListener('click',()=>{
      document.querySelectorAll('.filter-tab').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      const cat=btn.dataset.cat;
      document.querySelectorAll('[data-cat]').forEach(card=>{
        card.style.display=(cat==='all'||card.dataset.cat===cat)?'':'none';
      });
    });
  });
}

/* ── CONTACT FORM ───────────────────────────────────────── */
function initContactForm() {
  const f=document.getElementById('contactForm');
  f?.addEventListener('submit',e=>{
    e.preventDefault();
    const name=document.getElementById('cf-name')?.value.trim();
    const phone=document.getElementById('cf-phone')?.value.trim();
    const sub=document.getElementById('cf-subject')?.value.trim();
    const msg=document.getElementById('cf-msg')?.value.trim();
    if(!name||!phone||!msg){showToast('Please fill all required fields');return;}
    const text=`Hi Al Baik Pizza! 👋\n\n*Name:* ${name}\n*Phone:* ${phone}\n*Subject:* ${sub||'General'}\n\n${msg}`;
    window.open(`https://wa.me/923001234567?text=${encodeURIComponent(text)}`,'_blank');
    showToast('✅ Message sent via WhatsApp!'); f.reset();
  });
}

/* ── ORDER FORM ─────────────────────────────────────────── */
function initOrderForm() {
  const f=document.getElementById('orderForm');
  f?.addEventListener('submit',e=>{
    e.preventDefault();
    const name=document.getElementById('of-name')?.value.trim();
    const phone=document.getElementById('of-phone')?.value.trim();
    const addr=document.getElementById('of-addr')?.value.trim();
    const type=document.getElementById('of-type')?.value||'Delivery';
    const note=document.getElementById('of-note')?.value.trim();
    if(!name||!phone){showToast('Please fill name & phone');return;}
    if(!cart.length){showToast('Your cart is empty — add items first!');return;}
    const total=cart.reduce((s,ci)=>{const p=PRODUCTS.find(x=>x.id===ci.id);return p?s+p.price*ci.qty:s;},0);
    let msg=`🍕 *Order — Al Baik Pizza*\n\n👤 *Name:* ${name}\n📞 *Phone:* ${phone}\n🏠 *${type}:* ${addr||type}\n`;
    if(note) msg+=`📝 *Note:* ${note}\n`;
    msg+=`\n*Items:*\n`;
    cart.forEach(ci=>{const p=PRODUCTS.find(x=>x.id===ci.id);if(p)msg+=`• ${p.emoji} ${p.name} ×${ci.qty} = Rs. ${(p.price*ci.qty).toLocaleString()}\n`;});
    msg+=`\n💰 *Total: Rs. ${total.toLocaleString()}*`;
    window.open(`https://wa.me/923001234567?text=${encodeURIComponent(msg)}`,'_blank');
    cart=[];saveCart();updateCartUI();
    showToast('✅ Order sent via WhatsApp!'); f.reset();
    renderOrderSummary();
  });
}

/* ── RENDER ORDER SUMMARY ───────────────────────────────── */
function renderOrderSummary() {
  const list=document.getElementById('orderList');
  const tot=document.getElementById('orderTotal');
  if(!list) return;
  if(!cart.length){list.innerHTML='<p style="color:var(--muted);font-size:13px">No items yet. Browse the menu!</p>';if(tot)tot.textContent='Rs. 0';return;}
  list.innerHTML=cart.map(ci=>{
    const p=PRODUCTS.find(x=>x.id===ci.id); if(!p) return '';
    return `<div class="os-item"><div><div class="os-name">${p.emoji} ${p.name}</div><div class="os-qty">×${ci.qty}</div></div><div class="os-price">Rs. ${(p.price*ci.qty).toLocaleString()}</div></div>`;
  }).join('');
  const total=cart.reduce((s,ci)=>{const p=PRODUCTS.find(x=>x.id===ci.id);return p?s+p.price*ci.qty:s;},0);
  if(tot) tot.textContent=`Rs. ${total.toLocaleString()}`;
}

/* ── PRODUCT PAGE RENDER ────────────────────────────────── */
function renderProducts(containerId) {
  const c=document.getElementById(containerId); if(!c) return;
  c.innerHTML=PRODUCTS.map(p=>`
    <div class="card product-card" data-cat="${p.cat}" data-sr>
      <div class="img-wrap"><img src="${p.img}" alt="${p.name}" loading="lazy"/><span class="badge-cat">${p.cat}</span></div>
      <div class="body">
        <div class="pname">${p.name}</div>
        <div class="pdesc">${p.desc}</div>
        <div class="foot">
          <div class="price">Rs.&nbsp;${p.price.toLocaleString()} <sub>/item</sub></div>
          <div class="actions">
            <a href="product-details.html?id=${p.id}" class="btn btn-ghost btn-sm">Details</a>
            <button class="btn btn-red btn-sm" onclick="addToCart('${p.id}')">+ Add</button>
          </div>
        </div>
      </div>
    </div>`).join('');
  initScrollReveal();
}

/* ── PRODUCT DETAIL RENDER ──────────────────────────────── */
function renderProductDetail() {
  const params=new URLSearchParams(location.search);
  const id=params.get('id');
  const p=PRODUCTS.find(x=>x.id===id);
  const el=document.getElementById('pdContent'); if(!el) return;
  if(!p){el.innerHTML='<p style="color:var(--muted);text-align:center">Product not found.</p>';return;}
  el.innerHTML=`
    <div class="pd-grid">
      <div class="pd-img-box"><img src="${p.img}" alt="${p.name}"/></div>
      <div>
        <span class="pd-badge">${p.cat}</span>
        <h1>${p.name}</h1>
        <div class="pd-price">Rs. ${p.price.toLocaleString()}</div>
        <div class="pd-tags">${p.tags.map(t=>`<span class="pd-tag">${t}</span>`).join('')}</div>
        <p class="pd-desc">${p.detail}</p>
        <div class="pd-actions">
          <button class="btn btn-red" onclick="addToCart('${p.id}')">🛒 Add to Order</button>
          <a href="products.html" class="btn btn-ghost">← Back to Menu</a>
        </div>
      </div>
    </div>`;
  // related
  const rel=document.getElementById('relatedProducts');
  if(rel){
    const same=PRODUCTS.filter(x=>x.cat===p.cat&&x.id!==p.id).slice(0,3);
    rel.innerHTML=same.map(rp=>`
      <div class="card product-card" data-sr>
        <div class="img-wrap"><img src="${rp.img}" alt="${rp.name}" loading="lazy"/></div>
        <div class="body">
          <div class="pname">${rp.name}</div>
          <div class="pdesc">${rp.desc}</div>
          <div class="foot">
            <div class="price">Rs. ${rp.price.toLocaleString()}</div>
            <div class="actions">
              <a href="product-details.html?id=${rp.id}" class="btn btn-ghost btn-sm">View</a>
              <button class="btn btn-red btn-sm" onclick="addToCart('${rp.id}')">+ Add</button>
            </div>
          </div>
        </div>
      </div>`).join('');
  }
}

/* ── HOME FEATURED PRODUCTS ─────────────────────────────── */
function renderFeatured(containerId, count) {
  const c=document.getElementById(containerId); if(!c) return;
  const featured=PRODUCTS.filter(p=>['p1','p5','p8','p11'].includes(p.id)).slice(0,count||4);
  c.innerHTML=featured.map(p=>`
    <div class="card product-card" data-sr>
      <div class="img-wrap"><img src="${p.img}" alt="${p.name}" loading="lazy"/><span class="badge-cat">${p.cat}</span></div>
      <div class="body">
        <div class="pname">${p.name}</div>
        <div class="pdesc">${p.desc}</div>
        <div class="foot">
          <div class="price">Rs.&nbsp;${p.price.toLocaleString()}</div>
          <div class="actions">
            <a href="product-details.html?id=${p.id}" class="btn btn-ghost btn-sm">View</a>
            <button class="btn btn-red btn-sm" onclick="addToCart('${p.id}')">+ Add</button>
          </div>
        </div>
      </div>
    </div>`).join('');
}

/* ── REVIEW DATA & RENDER ───────────────────────────────── */
const REVIEWS = [
  { name:'Ahmed Khan',     init:'A', stars:5, date:'Jan 2025', text:'Best pizza in Khairpur! The Chicken Tikka Pizza is absolutely amazing — loads of cheese and spice exactly right. Will order again and again!' },
  { name:'Sara Mirza',     init:'S', stars:4, date:'Feb 2025', text:'Ordered the zinger burger and loaded fries. Both were delicious and came piping hot. Great value for money, highly recommended!' },
  { name:'Raza Ali',       init:'R', stars:5, date:'Dec 2024', text:'Had their catering for a family wedding. The team was professional, food was exceptional and everyone loved it. 10/10 service!' },
  { name:'Faisal Soomro',  init:'F', stars:4, date:'Jan 2025', text:'Really cosy dine-in place, family-friendly atmosphere. Kids absolutely loved the nuggets and we loved the BBQ pizza. Our go-to now.' },
  { name:'Nadia Baloch',   init:'N', stars:5, date:'Mar 2025', text:'The double cheese pizza is a dream — seriously the best I have had in the city. Crispy edges and so much cheese pull!' },
  { name:'Usman Sheikh',   init:'U', stars:5, date:'Feb 2025', text:'Fast delivery, hot food, great prices. What else could you ask for? The zinger burger is my weekly staple now.' },
  { name:'Hira Ansari',    init:'H', stars:4, date:'Mar 2025', text:'Love the fresh lemonade with the loaded fries combo. The food is always consistent, every single time. Keep it up!' },
  { name:'Bilal Chandio',  init:'B', stars:5, date:'Jan 2025', text:'Ordered catering for a corporate event — 40 people and every single one was satisfied. Very professional and delicious!' },
];

function renderReviews(containerId) {
  const c=document.getElementById(containerId); if(!c) return;
  c.innerHTML=REVIEWS.map(r=>`
    <div class="card review-card" data-sr>
      <div class="review-stars">${'★'.repeat(r.stars)}${'☆'.repeat(5-r.stars)}</div>
      <p class="review-text">"${r.text}"</p>
      <div class="review-author">
        <div class="review-avatar">${r.init}</div>
        <div><div class="review-name">${r.name}</div><div class="review-date">${r.date} · Verified Customer</div></div>
      </div>
    </div>`).join('');
}

/* ── INIT ───────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded',()=>{
  initNav();
  initScrollReveal();
  initCounters();
  initFAQ();
  initFilterTabs();
  initContactForm();
  initOrderForm();
  updateCartUI();
  renderOrderSummary();
  renderProductDetail();

  const fp=document.getElementById('featuredProducts');
  if(fp) renderFeatured('featuredProducts', 4);

  const pp=document.getElementById('productsGrid');
  if(pp) renderProducts('productsGrid');

  const rv=document.getElementById('reviewsGrid');
  if(rv) renderReviews('reviewsGrid');

  const rv2=document.getElementById('homeReviews');
  if(rv2){ renderReviews('homeReviews'); }

  // modal close on overlay click
  document.getElementById('cartModal')?.addEventListener('click', e=>{
    if(e.target.id==='cartModal') closeCartModal();
  });
});
