// product-loader.js - 商品データを JSON から読み込んでページに反映

async function loadProductData() {
  try {
    const response = await fetch('./data/products.json');
    if (!response.ok) {
      console.error('Failed to load products.json:', response.status);
      return null;
    }
    return await response.json();
  } catch (error) {
    console.error('Error loading products:', error);
    return null;
  }
}

// 個別商品ページ用：URL パラメータから商品 ID を取得して データを表示
async function renderProductDetail(productId) {
  const products = await loadProductData();
  if (!products) {
    console.error('Could not load products');
    return;
  }

  const product = products.find(p => p.id === productId);
  if (!product) {
    console.error('Product not found:', productId);
    return;
  }

  // ページタイトル
  document.title = `${product.name} — 海峡堂`;

  // 画像
  const img = document.querySelector('.product-image img');
  if (img) {
    img.src = product.image;
    img.alt = product.name;
  }

  // 商品名
  const h1 = document.querySelector('.product-info h1');
  if (h1) h1.textContent = product.name;

  // 価格
  const priceEl = document.querySelector('.product-info .price');
  if (priceEl) priceEl.textContent = `¥${product.price.toLocaleString('ja-JP')}`;

  // 短い説明
  const excerptEl = document.querySelector('.product-info .excerpt');
  if (excerptEl) excerptEl.textContent = product.excerpt;

  // 長い説明
  const descP = document.querySelector('.product-info h2 + p');
  if (descP) descP.textContent = product.description;

  // 仕様リスト
  const specsList = document.querySelector('.product-info ul');
  if (specsList) {
    specsList.innerHTML = '';
    product.specs.forEach(spec => {
      const li = document.createElement('li');
      li.textContent = spec;
      specsList.appendChild(li);
    });
  }

  // Square 購入ボタン
  const buyBtn = document.querySelector('.btn.buy');
  if (buyBtn) buyBtn.href = product.squareUrl;
}

// 商品一覧ページ用：すべての商品カードを動的生成
async function renderProductCards(containerId = '.grid.cards') {
  const products = await loadProductData();
  if (!products) {
    console.error('Could not load products');
    return;
  }

  const container = document.querySelector(containerId);
  if (!container) {
    console.error('Container not found:', containerId);
    return;
  }

  container.innerHTML = '';
  products.forEach(product => {
    const card = document.createElement('article');
    card.className = 'card';
    card.innerHTML = `
      <img src="${product.image}" alt="${product.name}">
      <h3>${product.name}</h3>
      <p class="price">¥${product.price.toLocaleString('ja-JP')}</p>
      <p><a href="${product.page}" class="btn small">詳細</a></p>
    `;
    container.appendChild(card);
  });
}

// 最新商品（トップページ用）：最初の6商品を表示
async function renderLatestProducts(containerId = '.grid.cards') {
  const products = await loadProductData();
  if (!products) {
    console.error('Could not load products');
    return;
  }

  const container = document.querySelector(containerId);
  if (!container) {
    console.error('Container not found:', containerId);
    return;
  }

  container.innerHTML = '';
  const latest = products.slice(0, 6);
  latest.forEach(product => {
    const card = document.createElement('article');
    card.className = 'card';
    card.innerHTML = `
      <img src="${product.image}" alt="${product.name}">
      <h3>${product.name}</h3>
      <p class="price">¥${product.price.toLocaleString('ja-JP')}</p>
      <p><a href="${product.page}" class="btn small">詳細を見る</a></p>
    `;
    container.appendChild(card);
  });
}
