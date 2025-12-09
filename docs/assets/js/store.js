// store.js - simple client-side product modal and cart
(async function(){
  async function loadProducts(){
    try{
      const res = await fetch('./data/products.json');
      if(!res.ok) return [];
      return await res.json();
    }catch(e){console.error(e);return []}
  }

  const products = await loadProducts();

  // Utilities
  function findProduct(id){ return products.find(p=>p.id===id); }

  // Modal root
  const modalRoot = document.createElement('div');
  modalRoot.id = 'modal-root';
  document.body.appendChild(modalRoot);

  function openModal(contentHtml){
    modalRoot.innerHTML = `
      <div class="modal-backdrop" id="product-modal">
        <div class="modal-window">
          <button class="modal-close" aria-label="閉じる">✕</button>
          <div class="modal-body">${contentHtml}</div>
        </div>
      </div>
    `;
    document.body.classList.add('modal-open');
    modalRoot.querySelector('.modal-close').addEventListener('click', closeModal);
    modalRoot.querySelector('.modal-backdrop').addEventListener('click', function(e){ if(e.target===this) closeModal(); });
  }
  function closeModal(){ modalRoot.innerHTML=''; document.body.classList.remove('modal-open'); }

  // Cart
  const CART_KEY = 'kaikyoudou_cart_v1';
  function loadCart(){ try{ return JSON.parse(localStorage.getItem(CART_KEY)||'[]'); }catch(e){ return []; } }
  function saveCart(cart){ localStorage.setItem(CART_KEY, JSON.stringify(cart)); updateCartCount(); }
  function addToCart(id, qty=1){ const cart = loadCart(); const item = cart.find(i=>i.id===id); if(item){ item.qty += qty; } else { cart.push({id, qty}); } saveCart(cart); showAddedToast(findProduct(id)); }
  function removeFromCart(id){ let cart = loadCart(); cart = cart.filter(i=>i.id!==id); saveCart(cart); }
  function updateQty(id, qty){ const cart = loadCart(); const item = cart.find(i=>i.id===id); if(!item) return; item.qty = qty; if(item.qty<=0) removeFromCart(id); saveCart(cart); }

  function updateCartCount(){ const cart = loadCart(); const total = cart.reduce((s,i)=>s+i.qty,0); const el = document.querySelector('.cart-count'); if(el) el.textContent = String(total); }

  function renderCartHtml(){ const cart = loadCart(); if(cart.length===0) return '<p>カートに商品が入っていません。</p>';
    let html = '<div class="cart-items">';
    let sum = 0;
    cart.forEach(it=>{
      const p = findProduct(it.id);
      if(!p) return;
      const line = p.price * it.qty;
      sum += line;
      html += `
        <div class="cart-item">
          <img src="${p.image}" alt="${p.name}">
          <div class="cart-info">
            <h4>${p.name}</h4>
            <p class="cart-price">¥${p.price.toLocaleString('ja-JP')} × ${it.qty} = ¥${(p.price*it.qty).toLocaleString('ja-JP')}</p>
            <div class="cart-actions">
              <button class="qty-decrease" data-id="${p.id}">−</button>
              <input type="number" class="qty-input" data-id="${p.id}" value="${it.qty}" min="0">
              <button class="qty-increase" data-id="${p.id}">＋</button>
              <button class="remove-item" data-id="${p.id}">削除</button>
            </div>
          </div>
        </div>
      `;
    });
    html += `</div><div class="cart-footer"><p class="cart-total">合計: ¥${sum.toLocaleString('ja-JP')}</p><div class="cart-cta"><button class="btn btn-primary checkout">購入へ（ダミー）</button><button class="btn btn-outline close-cart">閉じる</button></div></div>`;
    return html;
  }

  function openCart(){
    openModal(`<h3>カート</h3>${renderCartHtml()}`);
    // attach handlers
    modalRoot.querySelectorAll('.remove-item').forEach(btn=>btn.addEventListener('click', function(){ removeFromCart(this.dataset.id); refreshCartModal(); }));
    modalRoot.querySelectorAll('.qty-decrease').forEach(btn=>btn.addEventListener('click', function(){ const id=this.dataset.id; const cart=loadCart(); const item=cart.find(i=>i.id===id); if(item){ updateQty(id, Math.max(0, item.qty-1)); refreshCartModal(); }}));
    modalRoot.querySelectorAll('.qty-increase').forEach(btn=>btn.addEventListener('click', function(){ const id=this.dataset.id; const cart=loadCart(); const item=cart.find(i=>i.id===id); if(item){ updateQty(id, item.qty+1); refreshCartModal(); }}));
    modalRoot.querySelectorAll('.qty-input').forEach(inp=>inp.addEventListener('change', function(){ const id=this.dataset.id; const n = parseInt(this.value||'0',10); updateQty(id, n); refreshCartModal(); }));
    modalRoot.querySelectorAll('.close-cart').forEach(btn=>btn.addEventListener('click', closeModal));
    modalRoot.querySelectorAll('.checkout').forEach(btn=>btn.addEventListener('click', function(){ alert('購入フローは未実装です（ダミー）'); }));
  }

  function refreshCartModal(){ if(document.getElementById('product-modal')){ // open
      modalRoot.querySelector('.modal-body').innerHTML = `<h3>カート</h3>${renderCartHtml()}`;
      openCart();
    }
    updateCartCount();
  }

  function showAddedToast(product){
    const t = document.createElement('div');
    t.className = 'cart-toast';
    t.textContent = `${product.name} をカートに追加しました`;
    document.body.appendChild(t);
    setTimeout(()=>{ t.classList.add('visible'); }, 50);
    setTimeout(()=>{ t.classList.remove('visible'); setTimeout(()=>t.remove(),300); }, 2500);
    updateCartCount();
  }

  // Wire up buttons
  function initButtons(){
    document.querySelectorAll('.open-detail').forEach(btn=>{
      btn.addEventListener('click', function(){ const id=this.dataset.id; const p=findProduct(id); if(!p) return; openProductDetail(p); });
    });
    document.querySelectorAll('.add-cart').forEach(btn=>{
      btn.addEventListener('click', function(){ const id=this.dataset.id; addToCart(id,1); });
    });
    const cartBtn = document.querySelector('.cart-button');
    if(cartBtn){ cartBtn.addEventListener('click', openCart); }
  }

  function openProductDetail(p){
    const specsHtml = (p.specs||[]).map(s=>`<li>${s}</li>`).join('');
    const html = `
      <div class="detail-grid">
        <div class="detail-media"><img src="${p.image}" alt="${p.name}"></div>
        <div class="detail-info">
          <h3>${p.name}</h3>
          <p class="price">¥${p.price.toLocaleString('ja-JP')}</p>
          <p class="desc">${p.excerpt}</p>
          <p>${p.description}</p>
          <h4>仕様</h4>
          <ul>${specsHtml}</ul>
          <div class="detail-actions">
            <button class="btn btn-primary modal-add" data-id="${p.id}">カートに入れる</button>
            <button class="btn btn-outline modal-close-btn">閉じる</button>
          </div>
        </div>
      </div>
    `;
    openModal(html);
    // attach modal add
    modalRoot.querySelector('.modal-body .modal-add').addEventListener('click', function(){ addToCart(this.dataset.id,1); });
    modalRoot.querySelectorAll('.modal-close-btn').forEach(b=>b.addEventListener('click', closeModal));
  }

  // init
  initButtons();
  updateCartCount();

  // expose for debugging
  window.__kaikyoudou = { addToCart, openCart, loadCart };

})();
