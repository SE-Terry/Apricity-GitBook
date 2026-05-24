// ============================================================
// pages.js  — every documentation page as a JS object
// ============================================================

const PAGES = {

/* =========================================================
   INTRODUCTION
   ========================================================= */
introduction: `
<div class="page">
  <div class="page-header">
    <div class="breadcrumb">Getting Started</div>
    <h1>Welcome to Apricity</h1>
    <p class="subtitle">Technical documentation for the <strong>Apricity #YourLove</strong> e-commerce platform — a fashion &amp; style storefront powered by Pancake POS.</p>
  </div>

  <h2>What is Apricity?</h2>
  <p>Apricity is a full-stack e-commerce platform built for a Vietnamese fashion brand. It consists of two repositories working together:</p>

  <div class="feature-grid">
    <div class="feature-card">
      <span class="emoji">🎨</span>
      <h4>Apricity Frontend</h4>
      <p>React 19 + Vite 7 storefront with Tailwind CSS, i18n, lazy-loaded pages, and a responsive mobile-first design.</p>
    </div>
    <div class="feature-card">
      <span class="emoji">⚙️</span>
      <h4>Apricity Backend</h4>
      <p>Express 5 REST API server that proxies Pancake POS, handles SePay QR payments, and sends order email notifications.</p>
    </div>
    <div class="feature-card">
      <span class="emoji">🛍️</span>
      <h4>Pancake POS Integration</h4>
      <p>Products, inventory, orders, and address data are all synced from Pancake POS — the single source of truth for catalog management.</p>
    </div>
    <div class="feature-card">
      <span class="emoji">💳</span>
      <h4>SePay QR Payments</h4>
      <p>Vietnamese bank transfer via QR code with IPN webhook verification, reservation expiry, and automatic cleanup jobs.</p>
    </div>
    <div class="feature-card">
      <span class="emoji">🌐</span>
      <h4>Bilingual Support</h4>
      <p>Vietnamese (default) and English via i18next. All UI strings are externalized in locale JSON files.</p>
    </div>
    <div class="feature-card">
      <span class="emoji">☁️</span>
      <h4>Cloudflare Tunnel Deploy</h4>
      <p>Full-stack containerized deployment with Docker Compose and Cloudflare Tunnel for zero-config HTTPS routing.</p>
    </div>
  </div>

  <h2>Quick Links</h2>
  <div class="table-wrapper">
    <table>
      <thead><tr><th>Area</th><th>Description</th></tr></thead>
      <tbody>
        <tr><td><a href="#" data-page="quickstart">Quick Start</a></td><td>Get both services running locally in 5 minutes</td></tr>
        <tr><td><a href="#" data-page="architecture">Architecture</a></td><td>High-level system topology and data flow</td></tr>
        <tr><td><a href="#" data-page="frontend-checkout-flow">Checkout &amp; Shipment</a></td><td>Live GHTK fee quote, fallback logic, and order submission flow</td></tr>
        <tr><td><a href="#" data-page="shop-operator-guide">Store Guide</a></td><td>How to enter Pancake products/categories so the storefront maps them correctly</td></tr>
        <tr><td><a href="#" data-page="api-products">Products API</a></td><td>Catalog &amp; inventory endpoints</td></tr>
        <tr><td><a href="#" data-page="api-payments">Payments API</a></td><td>SePay QR bank-transfer flow</td></tr>
        <tr><td><a href="#" data-page="deployment-docker">Deployment</a></td><td>Docker, Compose, and Cloudflare Tunnel guides</td></tr>
      </tbody>
    </table>
  </div>

  <div class="page-nav">
    <div></div>
    <a class="page-nav-btn next" data-page="architecture" href="#">
      <span class="label">Next →</span>
      <span class="title">Architecture</span>
    </a>
  </div>
</div>
`,

/* =========================================================
   ARCHITECTURE
   ========================================================= */
architecture: `
<div class="page">
  <div class="page-header">
    <div class="breadcrumb">Getting Started</div>
    <h1>Architecture</h1>
    <p class="subtitle">High-level overview of how the Apricity platform components connect.</p>
  </div>

  <h2>System Diagram</h2>
  <div class="arch-diagram">
    <div class="arch-box client">🌐 Browser / Client</div>
    <div class="arch-arrow">⬇</div>
    <div class="arch-box tunnel">☁ Cloudflare Tunnel</div>
    <div class="arch-arrow">⬇</div>
    <div class="arch-row">
      <div class="arch-box frontend">🎨 React Frontend<br><span class="text-sm">Nginx · port 8080</span></div>
      <div class="arch-box backend">⚙️ Express API<br><span class="text-sm">Node.js · port 5000</span></div>
    </div>
    <div class="arch-arrow">⬇</div>
    <div class="arch-row">
      <div class="arch-box external">🥞 Pancake POS API</div>
      <div class="arch-box external">💰 SePay API</div>
      <div class="arch-box external">📧 SMTP Server</div>
    </div>
  </div>

  <h2>Routing Strategy</h2>
  <p>In production, both frontend and backend share the same domain. Cloudflare Tunnel routes requests based on path:</p>
  <div class="table-wrapper">
    <table>
      <thead><tr><th>Request Path</th><th>Routed To</th></tr></thead>
      <tbody>
        <tr><td><code>apricity.com.vn/api/*</code></td><td>Backend container (Express, port 5000)</td></tr>
        <tr><td><code>apricity.com.vn/*</code></td><td>Frontend container (Nginx, port 8080)</td></tr>
        <tr><td><code>www.apricity.com.vn/*</code></td><td>Same rules as above</td></tr>
      </tbody>
    </table>
  </div>

  <h2>Data Flow</h2>
  <h3>Product Catalog</h3>
  <p>The frontend fetches products from the backend, which proxies the Pancake POS API. No local database is used — Pancake POS is the single source of truth for all product data, inventory, and categories.</p>

  <h3>Order Lifecycle</h3>
  <ol>
    <li>Customer fills checkout form, selects Province/City and Ward/Commune, and the frontend loads district metadata from Pancake in the background.</li>
    <li>Once the address is specific enough, the frontend debounces a live quote request to <code>GET /api/shipping/fee</code> for the GHTK shipping fee.</li>
    <li>If the quote succeeds, the checkout summary uses the returned fee; if the quote fails, the UI falls back to the store default shipping fee.</li>
    <li>Before submission, the frontend calls <code>POST /api/pancake-products/inventory/check</code> to validate stock in real time.</li>
    <li>For COD, the frontend calls <code>POST /api/pancake-orders/orders</code>; for bank transfer, it calls <code>POST /api/payments/sepay/create</code>.</li>
    <li>After the Pancake order is created, the backend attempts to arrange shipment with GHTK using Pancake's <code>arrange_shipment</code> flow (<code>partner_id = 1</code>).</li>
    <li>If payment is SePay, SePay sends an IPN webhook to <code>POST /api/payments/sepay/ipn</code> when payment is confirmed, and the backend then finalizes downstream actions such as email confirmation.</li>
  </ol>

  <h3>Inventory Validation</h3>
  <p>Before checkout, the frontend calls <code>POST /api/pancake-products/inventory/check</code> to validate that all cart items are still in stock. The backend queries Pancake POS in real-time for the latest variant quantities.</p>

  <h2>Repository Structure</h2>
  <div class="file-tree">
<span class="dir">Apricity/</span>                            <span class="comment"># Deployment wrapper (root)</span>
├── <span class="dir">Apricity-BackEnd/</span>                 <span class="comment"># Backend repo (submodule)</span>
│   └── <span class="dir">server/</span>                       <span class="comment"># Express app</span>
├── <span class="dir">Apricity-FrontEnd/</span>                <span class="comment"># Frontend repo (submodule)</span>
│   └── <span class="dir">client/</span>                       <span class="comment"># Vite + React app</span>
├── <span class="dir">deploy/</span>                           <span class="comment"># Cloudflare Tunnel configs</span>
│   ├── <span class="dir">cloudflared/</span>                  <span class="comment"># Tunnel config &amp; credentials</span>
│   └── <span class="dir">env/</span>                          <span class="comment"># Environment files</span>
├── <span class="file">docker-compose.tunnel.yml</span>        <span class="comment"># Full-stack compose</span>
└── <span class="file">DEPLOY_CLOUDFLARE_TUNNEL.md</span>      <span class="comment"># Deploy guide</span>
  </div>

  <div class="page-nav">
    <a class="page-nav-btn prev" data-page="introduction" href="#">
      <span class="label">← Previous</span>
      <span class="title">Introduction</span>
    </a>
    <a class="page-nav-btn next" data-page="quickstart" href="#">
      <span class="label">Next →</span>
      <span class="title">Quick Start</span>
    </a>
  </div>
</div>
`,

/* =========================================================
   QUICK START
   ========================================================= */
quickstart: `
<div class="page">
  <div class="page-header">
    <div class="breadcrumb">Getting Started</div>
    <h1>Quick Start</h1>
    <p class="subtitle">Get both the frontend and backend running locally in under 5 minutes.</p>
  </div>

  <h2>Prerequisites</h2>
  <ul>
    <li><strong>Node.js</strong> ≥ 18</li>
    <li><strong>npm</strong> ≥ 9</li>
    <li>A Pancake POS account with an API key and Shop ID</li>
  </ul>

  <h2>1. Clone the Repositories</h2>
  <div class="code-block">
    <div class="code-block-header"><span>bash</span><button class="code-block-copy" onclick="copyCode(this)">Copy</button></div>
    <pre>git clone &lt;your-backend-repo-url&gt; Apricity-BackEnd
git clone &lt;your-frontend-repo-url&gt; Apricity-FrontEnd</pre>
  </div>

  <h2>2. Start the Backend</h2>
  <div class="code-block">
    <div class="code-block-header"><span>bash</span><button class="code-block-copy" onclick="copyCode(this)">Copy</button></div>
    <pre>cd Apricity-BackEnd/server

# Copy environment template
cp .env.example .env

# Edit .env and fill in:
#   PANCAKE_API_KEY, PANCAKE_SHOP_ID
#   SEPAY_ACCOUNT_NUMBER, SEPAY_BANK_CODE (if using payments)

# Install dependencies
npm install

# Start dev server with hot-reload
npm run dev</pre>
  </div>
  <p>The backend will start on <code>http://localhost:5000</code>. You should see <code>"Server is running on port 5000"</code> in the console.</p>

  <h2>3. Start the Frontend</h2>
  <div class="code-block">
    <div class="code-block-header"><span>bash</span><button class="code-block-copy" onclick="copyCode(this)">Copy</button></div>
    <pre>cd Apricity-FrontEnd/client

# Create .env file
echo "VITE_SERVER_URL=http://localhost:5000" > .env

# Install dependencies
npm install

# Start Vite dev server
npm run dev</pre>
  </div>
  <p>The frontend will start on <code>http://localhost:5173</code> and proxy API calls to the backend.</p>

  <div class="callout callout-tip">
    <div class="callout-title">💡 Tip</div>
    In production the frontend automatically uses <code>window.location.origin</code> as the API base URL, so no environment variable is needed when both services share the same domain.
  </div>

  <h2>4. Verify</h2>
  <ul>
    <li>Open <code>http://localhost:5173</code> — you should see the Apricity storefront</li>
    <li>Open <code>http://localhost:5000</code> — you should see <code>"API is running!"</code></li>
    <li>Try <code>http://localhost:5000/api/pancake-products/products</code> — should return product JSON from Pancake</li>
  </ul>

  <h2>Available Scripts</h2>
  <div class="table-wrapper">
    <table>
      <thead><tr><th>Command</th><th>Backend</th><th>Frontend</th></tr></thead>
      <tbody>
        <tr><td><code>npm run dev</code></td><td>Nodemon hot-reload on :5000</td><td>Vite dev server on :5173</td></tr>
        <tr><td><code>npm start</code></td><td>Production server</td><td>—</td></tr>
        <tr><td><code>npm run build</code></td><td>—</td><td>Production Vite build</td></tr>
        <tr><td><code>npm run preview</code></td><td>—</td><td>Preview production build</td></tr>
        <tr><td><code>npm run lint</code></td><td>ESLint</td><td>ESLint</td></tr>
      </tbody>
    </table>
  </div>

  <div class="page-nav">
    <a class="page-nav-btn prev" data-page="architecture" href="#">
      <span class="label">← Previous</span>
      <span class="title">Architecture</span>
    </a>
    <a class="page-nav-btn next" data-page="shop-operator-guide" href="#">
      <span class="label">Next →</span>
      <span class="title">Store Guide</span>
    </a>
  </div>
</div>
`,

/* =========================================================
   SHOP OPERATOR GUIDE
   ========================================================= */
"shop-operator-guide": `
<div class="page">
  <div class="page-header">
    <div class="breadcrumb">Getting Started › Store Guide</div>
    <h1>Store Guide</h1>
    <p class="subtitle">How to enter products and categories in Pancake POS so Apricity's frontend mapping renders the expected catalog, collection, product detail, variants, stock, material, size guide, and images.</p>
  </div>

  <div class="callout callout-warning">
    <div class="callout-title">Source of truth</div>
    Pancake POS is the catalog source of truth. The website does not have a separate product database; it reads Pancake products and categories through <code>/api/pancake-products</code>.
  </div>

  <h2>Product Setup Checklist</h2>
  <div class="table-wrapper">
    <table>
      <thead><tr><th>Pancake field / area</th><th>Website field</th><th>Operator rule</th></tr></thead>
      <tbody>
        <tr><td>Product name</td><td><code>product.name</code></td><td>Customer-facing name shown on cards and detail pages.</td></tr>
        <tr><td>Product ID or <code>custom_id</code></td><td>Detail URL slug</td><td>Use <code>custom_id</code> when a readable stable URL is needed. Detail lookup accepts Pancake ID first, then falls back to matching <code>custom_id</code>.</td></tr>
        <tr><td>Product images</td><td>Card/detail gallery</td><td>Add at least one image. The first product image is used as <code>bannerImage</code>; variation images are used in the gallery and can change when the customer selects a variant.</td></tr>
        <tr><td>Categories</td><td>Collections and filtering</td><td>Assign every product to the correct Pancake category. The storefront treats Pancake root categories as collections and includes descendant category IDs when filtering.</td></tr>
        <tr><td>Variations</td><td>Colors, sizes, price, stock</td><td>Use exact field names <code>color</code> / <code>màu</code> and <code>size</code>. The website reads stock from each variation's remaining quantity.</td></tr>
        <tr><td>Retail price on variation</td><td><code>product.price</code></td><td>The displayed product price uses the first non-zero variation retail price found by the mapper.</td></tr>
        <tr><td>Product description / <code>note_product</code></td><td>Description, size text, material fallback</td><td>Use the JSON format below. The frontend extracts <code>Kích thước:</code> / <code>Size:</code> into the size guide and <code>Chất liệu:</code> / <code>Material:</code> into product information.</td></tr>
        <tr><td>Product note, material attribute, or materials product endpoint</td><td><code>product.material</code></td><td>Material priority is product note first, then product attribute named <code>material</code>, <code>chất liệu</code>, or <code>fabric</code>, then Pancake materials product data on detail fetch.</td></tr>
      </tbody>
    </table>
  </div>

  <h2>Description Format</h2>
  <p>For bilingual product descriptions, paste a JSON object into Pancake's product description / <code>note_product</code> field. The frontend accepts both real JSON and JSON-like pasted text with escaped quotes.</p>
  <div class="code-block">
    <div class="code-block-header"><span>Product description template</span><button class="code-block-copy" onclick="copyCode(this)">Copy</button></div>
    <pre>{
  "vi": "Túi tote với 2 tầng voan bèo nhún\\nKích thước: 32cm x 20cm\\nChất liệu: Sự kết hợp giữa vải chính kate và vải voan có độ bắt sáng nhẹ với họa tiết hoa ẩn. Bên trong có lớp lót kín đáo, đi kèm cùng một miếng lót đế túi.",
  "en": "Tote bag with 2 layers of ruffled organza\\nSize: 32cm x 20cm\\nMaterial: A combination of kate fabric as the main material and lightly shimmering organza with subtle hidden floral patterns. The inside is fully lined for coverage and comes with a base insert."
}</pre>
  </div>

  <h3>How the website uses description lines</h3>
  <ul>
    <li>The remaining text is shown under <strong>Mô tả / Description</strong>.</li>
    <li>A line starting with <code>Kích thước:</code> or <code>Size:</code> is removed from the description and rendered inside <strong>Bảng kích thước / Size Guide</strong> as text.</li>
    <li>A line starting with <code>Chất liệu:</code> or <code>Material:</code> is removed from the description and rendered inside <strong>Thông tin sản phẩm / Product Information</strong>.</li>
    <li>If no size line exists, the website renders its default size table from code.</li>
  </ul>

  <h2>Variation Rules</h2>
  <p>Variants drive selectable colors/sizes, stock validation, cart payloads, and selected-image behavior. The backend only maps specific Pancake variation field names.</p>
  <div class="table-wrapper">
    <table>
      <thead><tr><th>Website concept</th><th>Pancake variation field name</th><th>Accepted examples</th><th>Notes</th></tr></thead>
      <tbody>
        <tr><td>Color selector</td><td><code>color</code> or <code>màu</code></td><td><code>Pink</code>, <code>#f7cadc</code>, <code>Hồng</code></td><td>Color values are rendered as swatches. Hex values are safest.</td></tr>
        <tr><td>Size selector</td><td><code>size</code></td><td><code>S</code>, <code>M</code>, <code>L</code>, <code>32cm x 20cm</code></td><td>Do not use <code>kích cỡ</code> or <code>kích thước</code> as the variation field name unless the code is extended.</td></tr>
        <tr><td>Stock</td><td>Variation quantity / remaining quantity</td><td>Any non-negative number</td><td>Checkout validates this against Pancake before order creation.</td></tr>
        <tr><td>Price</td><td>Variation retail price</td><td><code>150000</code></td><td>Use VND numeric values. The storefront formats the display.</td></tr>
        <tr><td>Variant image</td><td>Variation images</td><td>Upload per variation where useful</td><td>Detail page switches image when a selected variant has an image.</td></tr>
      </tbody>
    </table>
  </div>

  <h3>Size table behavior</h3>
  <ul>
    <li>If the product description includes <code>Kích thước:</code> / <code>Size:</code>, the size guide shows that text and does not show the hardcoded table.</li>
    <li>If a clothing product has only <code>S</code> and <code>M</code> variations, the default table uses the S/M range values: S chest 83-86, waist 64-67, hip 88-91; M chest 87-90, waist 68-71, hip 92-95.</li>
    <li>If a product has <code>S</code>, <code>M</code>, and <code>L</code>, the default table shows the standard S/M/L columns.</li>
  </ul>

  <h2>Categories as Collections</h2>
  <p>The collection page is built from Pancake categories. The backend maps each root Pancake category into one storefront collection.</p>
  <div class="table-wrapper">
    <table>
      <thead><tr><th>Pancake category tree item</th><th>Storefront behavior</th><th>Operator rule</th></tr></thead>
      <tbody>
        <tr><td>Root category text/name</td><td>Collection name</td><td>Name the root category exactly as the storefront collection should appear.</td></tr>
        <tr><td>Child node containing an <code>http://</code> or <code>https://</code> URL</td><td>Collection image</td><td>Add one child category/node under the root whose text is the image URL.</td></tr>
        <tr><td>Child node containing normal text</td><td>Collection description</td><td>Add one child category/node under the root whose text is the collection description. If multiple text children exist, the mapper uses the last one.</td></tr>
        <tr><td>Root and all descendant category IDs</td><td>Product filtering</td><td>Products assigned to the root or any descendant category are included in that collection.</td></tr>
      </tbody>
    </table>
  </div>

  <div class="callout callout-tip">
    <div class="callout-title">Recommended category pattern</div>
    Create one root category per collection. Under it, keep one image URL child and one description child, then place real merchandising categories below that same root. Assign products to the root or descendants.
  </div>

  <h2>Images and Upload Links</h2>
  <ul>
    <li>Use optimized web images for product media. Large 4000px PNG files should be resized/compressed before upload.</li>
    <li>For transparent model/cutout assets, keep PNG with alpha. For normal product detail photos, JPEG is usually smaller.</li>
    <li>If hosting on Cloudflare Pages, place static files under the frontend <code>public/</code> folder. A file at <code>public/images/example.png</code> becomes <code>/images/example.png</code> on the deployed site.</li>
  </ul>

  <h2>Operator QA Before Publishing</h2>
  <ol>
    <li>Open the product on the storefront detail page.</li>
    <li>Confirm the product card shows name, price, image, and add-to-cart button correctly.</li>
    <li>Confirm the description does not show raw JSON.</li>
    <li>Confirm <strong>Chất liệu / Material</strong> appears under product information.</li>
    <li>Confirm <strong>Bảng kích thước / Size Guide</strong> shows either the extracted size text or the correct S/M/L table.</li>
    <li>Select every color/size combination and confirm unavailable variants are disabled or stock behaves correctly.</li>
    <li>Add the product to cart and proceed to checkout far enough to trigger inventory validation.</li>
  </ol>

  <div class="page-nav">
    <a class="page-nav-btn prev" data-page="quickstart" href="#">
      <span class="label">← Previous</span>
      <span class="title">Quick Start</span>
    </a>
    <a class="page-nav-btn next" data-page="backend-overview" href="#">
      <span class="label">Next →</span>
      <span class="title">Backend Overview</span>
    </a>
  </div>
</div>
`,

/* =========================================================
   BACKEND OVERVIEW
   ========================================================= */
"backend-overview": `
<div class="page">
  <div class="page-header">
    <div class="breadcrumb">Backend</div>
    <h1>Backend Overview</h1>
    <p class="subtitle">Express 5 REST API server for Apricity, proxying Pancake POS and handling payments.</p>
  </div>

  <h2>Tech Stack</h2>
  <div class="table-wrapper">
    <table>
      <thead><tr><th>Technology</th><th>Version</th><th>Purpose</th></tr></thead>
      <tbody>
        <tr><td>Node.js</td><td>24</td><td>JavaScript runtime</td></tr>
        <tr><td>Express</td><td>5.1</td><td>Web framework</td></tr>
        <tr><td>Axios</td><td>1.13</td><td>HTTP client for Pancake POS / SePay</td></tr>
        <tr><td>Nodemailer</td><td>8.0</td><td>SMTP email notifications</td></tr>
        <tr><td>dotenv</td><td>17.2</td><td>Environment variable loading</td></tr>
        <tr><td>cookie-parser</td><td>1.4</td><td>Cookie parsing middleware</td></tr>
        <tr><td>cors</td><td>2.8</td><td>Cross-origin resource sharing</td></tr>
      </tbody>
    </table>
  </div>

  <h2>Project Structure</h2>
  <div class="file-tree">
<span class="dir">server/</span>
├── <span class="file">server.js</span>                      <span class="comment"># App entry point &amp; background jobs</span>
├── <span class="dir">controllers/</span>
│   ├── <span class="file">addressPCController.js</span>     <span class="comment"># Province / commune lookup</span>
│   ├── <span class="file">orderPCController.js</span>       <span class="comment"># Order creation &amp; management</span>
│   ├── <span class="file">paymentController.js</span>       <span class="comment"># Payment facade</span>
│   ├── <span class="file">productPCControler.js</span>      <span class="comment"># Product data from Pancake</span>
│   └── <span class="file">sepayController.js</span>        <span class="comment"># SePay QR payment &amp; IPN webhook</span>
├── <span class="dir">routes/</span>
│   ├── <span class="file">pancakeAddressRoutes.js</span>    <span class="comment"># /api/pancake-address</span>
│   ├── <span class="file">pancakeFrontendRoutes.js</span>   <span class="comment"># /api/pancake-products</span>
│   ├── <span class="file">pancakeOrderRoutes.js</span>      <span class="comment"># /api/pancake-orders</span>
│   ├── <span class="file">pancakeRoutes.js</span>           <span class="comment"># /api/pancake</span>
│   ├── <span class="file">paymentRoute.js</span>            <span class="comment"># /api/payments</span>
│   └── <span class="file">productRoute.js</span>            <span class="comment"># /api/products</span>
├── <span class="dir">services/</span>
│   ├── <span class="file">orderEmailService.js</span>       <span class="comment"># Email dispatch via SMTP</span>
│   ├── <span class="file">orderEmailTemplates.js</span>     <span class="comment"># HTML email templates</span>
│   ├── <span class="file">pancakeInventoryService.js</span> <span class="comment"># Stock validation</span>
│   ├── <span class="file">sepayOrderStore.js</span>         <span class="comment"># File-based order persistence</span>
│   └── <span class="file">sepayService.js</span>            <span class="comment"># SePay API integration</span>
├── <span class="dir">utils/</span>
│   └── <span class="file">status.js</span>                 <span class="comment"># HTTP status constants</span>
├── <span class="dir">data/</span>
│   └── <span class="dir">sepay-orders/</span>              <span class="comment"># Persistent SePay order JSONs</span>
└── <span class="file">package.json</span>
  </div>

  <h2>Route Mounting</h2>
  <p>All routes are mounted in <code>server.js</code> under the <code>/api</code> prefix:</p>
  <div class="code-block">
    <div class="code-block-header"><span>server.js</span><button class="code-block-copy" onclick="copyCode(this)">Copy</button></div>
    <pre>app.use("/api/products",         productRouter);
app.use("/api/payments",         paymentRouter);
app.use("/api/pancake",          pancakeRouter);
app.use("/api/pancake-products", pancakeFrontendRouter);
app.use("/api/pancake-orders",   pancakeOrderRouter);
app.use("/api/pancake-address",  pancakeAddressRouter);</pre>
  </div>

  <h2>CORS Configuration</h2>
  <p>Allowed origins are derived from two env vars: <code>ORIGIN</code> (comma-separated list) and <code>FRONTEND_URL</code>. Both are merged and deduplicated at startup.</p>

  <div class="page-nav">
    <a class="page-nav-btn prev" data-page="shop-operator-guide" href="#">
      <span class="label">← Previous</span>
      <span class="title">Store Guide</span>
    </a>
    <a class="page-nav-btn next" data-page="api-products" href="#">
      <span class="label">Next →</span>
      <span class="title">Products API</span>
    </a>
  </div>
</div>
`,

/* =========================================================
   PRODUCTS API
   ========================================================= */
"api-products": `
<div class="page">
  <div class="page-header">
    <div class="breadcrumb">Backend › API Reference</div>
    <h1>Products API</h1>
    <p class="subtitle">Endpoints for fetching products, categories, and validating inventory — all proxied from Pancake POS.</p>
  </div>

  <h2>Frontend Products — <code>/api/pancake-products</code></h2>
  <p>Read-only endpoints optimized for frontend consumption. The <code>PANCAKE_SHOP_ID</code> environment variable is used automatically.</p>

  <div class="table-wrapper">
    <table>
      <thead><tr><th>Method</th><th>Endpoint</th><th>Description</th></tr></thead>
      <tbody>
        <tr><td><span class="method method-get">GET</span></td><td><code>/categories</code></td><td>List all categories / collections</td></tr>
        <tr><td><span class="method method-get">GET</span></td><td><code>/products</code></td><td>List all products (paginated)</td></tr>
        <tr><td><span class="method method-get">GET</span></td><td><code>/products/:productId</code></td><td>Get a single product by ID</td></tr>
        <tr><td><span class="method method-post">POST</span></td><td><code>/inventory/check</code></td><td>Validate inventory for cart items</td></tr>
      </tbody>
    </table>
  </div>

  <h3>GET /products</h3>
  <p>Returns a paginated list of products from Pancake POS.</p>
  <div class="table-wrapper">
    <table>
      <thead><tr><th>Query Param</th><th>Type</th><th>Default</th><th>Description</th></tr></thead>
      <tbody>
        <tr><td><code>page</code></td><td>integer</td><td>1</td><td>Page number</td></tr>
        <tr><td><code>page_size</code></td><td>integer</td><td>100</td><td>Items per page</td></tr>
        <tr><td><code>search</code></td><td>string</td><td>""</td><td>Search filter</td></tr>
      </tbody>
    </table>
  </div>

  <h3>POST /inventory/check</h3>
  <p>Validates that all cart items are in stock before checkout. Returns <code>409 Conflict</code> if any item is out of stock or has insufficient quantity.</p>
  <div class="code-block">
    <div class="code-block-header"><span>Request Body</span><button class="code-block-copy" onclick="copyCode(this)">Copy</button></div>
    <pre>{
  "items": [
    {
      "productId": "12345",
      "variantId": "67890",
      "quantity": 2
    }
  ]
}</pre>
  </div>
  <div class="code-block">
    <div class="code-block-header"><span>Response (409 Conflict)</span><button class="code-block-copy" onclick="copyCode(this)">Copy</button></div>
    <pre>{
  "success": false,
  "error": "INVENTORY_INSUFFICIENT",
  "message": "Some items are out of stock",
  "items": [...],
  "issues": [...]
}</pre>
  </div>

  <hr>

  <h2>Admin Products — <code>/api/pancake</code></h2>
  <p>Full CRUD endpoints for Pancake POS product management. Requires <code>shopId</code> in the URL path.</p>

  <div class="table-wrapper">
    <table>
      <thead><tr><th>Method</th><th>Endpoint</th><th>Description</th></tr></thead>
      <tbody>
        <tr><td><span class="method method-get">GET</span></td><td><code>/shops</code></td><td>List all shops</td></tr>
        <tr><td><span class="method method-get">GET</span></td><td><code>/shops/:shopId/products</code></td><td>List products for a shop</td></tr>
        <tr><td><span class="method method-get">GET</span></td><td><code>/shops/:shopId/products/:productId</code></td><td>Get single product</td></tr>
        <tr><td><span class="method method-post">POST</span></td><td><code>/shops/:shopId/products</code></td><td>Create a product</td></tr>
        <tr><td><span class="method method-put">PUT</span></td><td><code>/shops/:shopId/products/:productId</code></td><td>Update a product</td></tr>
        <tr><td><span class="method method-delete">DELETE</span></td><td><code>/shops/:shopId/products/:productId</code></td><td>Delete a product</td></tr>
        <tr><td><span class="method method-post">POST</span></td><td><code>/shops/:shopId/sync</code></td><td>Sync all products from Pancake</td></tr>
      </tbody>
    </table>
  </div>

  <hr>

  <h2>Legacy Products — <code>/api/products</code></h2>
  <p>Simplified read-only endpoint using <code>PANCAKE_SHOP_ID</code> from env. Write operations return <code>405 Method Not Allowed</code> with a message redirecting to Pancake POS.</p>

  <div class="table-wrapper">
    <table>
      <thead><tr><th>Method</th><th>Endpoint</th><th>Description</th></tr></thead>
      <tbody>
        <tr><td><span class="method method-get">GET</span></td><td><code>/</code></td><td>List all products</td></tr>
        <tr><td><span class="method method-get">GET</span></td><td><code>/:slug</code></td><td>Get product by slug/ID</td></tr>
      </tbody>
    </table>
  </div>

  <div class="page-nav">
    <a class="page-nav-btn prev" data-page="backend-overview" href="#">
      <span class="label">← Previous</span>
      <span class="title">Backend Overview</span>
    </a>
    <a class="page-nav-btn next" data-page="api-orders" href="#">
      <span class="label">Next →</span>
      <span class="title">Orders API</span>
    </a>
  </div>
</div>
`,

/* =========================================================
   ORDERS API
   ========================================================= */
"api-orders": `
<div class="page">
  <div class="page-header">
    <div class="breadcrumb">Backend › API Reference</div>
    <h1>Orders API</h1>
    <p class="subtitle">Order creation, retrieval, and management through Pancake POS.</p>
  </div>

  <h2>Frontend Orders — <code>/api/pancake-orders</code></h2>

  <h3>Create Order (Frontend-friendly)</h3>
  <p>This is the primary endpoint used by the storefront. It reads <code>PANCAKE_SHOP_ID</code> from the environment.</p>
  <div class="table-wrapper">
    <table>
      <thead><tr><th>Method</th><th>Endpoint</th><th>Description</th></tr></thead>
      <tbody>
        <tr><td><span class="method method-post">POST</span></td><td><code>/orders</code></td><td>Create an order (uses env SHOP_ID)</td></tr>
      </tbody>
    </table>
  </div>

  <div class="code-block">
    <div class="code-block-header"><span>POST /api/pancake-orders/orders</span><button class="code-block-copy" onclick="copyCode(this)">Copy</button></div>
    <pre>{
  "customerName": "Nguyễn Văn A",
  "customerPhone": "0901234567",
  "customerEmail": "email@example.com",
  "address": "123 Đường ABC",
  "provinceId": 1,
  "communeId": 100,
  "items": [
    {
      "productId": "12345",
      "variantId": "67890",
      "quantity": 2,
      "price": 350000
    }
  ],
  "paymentMethod": "bank_transfer",
  "note": "Giao giờ hành chính"
}</pre>
  </div>

  <div class="callout callout-info">
    <div class="callout-title">ℹ️ Debug Mode</div>
    Append <code>?debug=1</code> to the URL or pass <code>"debug": true</code> in the body to receive the Pancake shipping address in the response.
  </div>

  <div class="callout callout-tip">
    <div class="callout-title">🚚 Shipment Arrangement</div>
    After a storefront order is successfully created, the backend attempts to arrange shipment through Pancake using GHTK as the default partner (<code>partner_id = 1</code>). The storefront-calculated <code>shippingFee</code> is included in the order payload, so the order and shipment flow stay aligned.
  </div>

  <hr>

  <h2>Admin Orders — <code>/api/pancake-orders</code></h2>
  <p>Full CRUD endpoints requiring <code>shopId</code> in the URL path.</p>

  <div class="table-wrapper">
    <table>
      <thead><tr><th>Method</th><th>Endpoint</th><th>Description</th></tr></thead>
      <tbody>
        <tr><td><span class="method method-get">GET</span></td><td><code>/shops/:shopId/orders</code></td><td>List orders (paginated, filterable)</td></tr>
        <tr><td><span class="method method-get">GET</span></td><td><code>/shops/:shopId/orders/:orderId</code></td><td>Get single order</td></tr>
        <tr><td><span class="method method-post">POST</span></td><td><code>/shops/:shopId/orders</code></td><td>Create order with explicit shop ID</td></tr>
        <tr><td><span class="method method-put">PUT</span></td><td><code>/shops/:shopId/orders/:orderId</code></td><td>Update order</td></tr>
        <tr><td><span class="method method-get">GET</span></td><td><code>/shops/:shopId/order_source</code></td><td>Get order sources</td></tr>
        <tr><td><span class="method method-get">GET</span></td><td><code>/shops/:shopId/partners</code></td><td>Get shipping partners</td></tr>
        <tr><td><span class="method method-get">GET</span></td><td><code>/shops/:shopId/warehouses</code></td><td>Get warehouses</td></tr>
      </tbody>
    </table>
  </div>

  <h3>List Orders Query Parameters</h3>
  <div class="table-wrapper">
    <table>
      <thead><tr><th>Param</th><th>Type</th><th>Default</th><th>Description</th></tr></thead>
      <tbody>
        <tr><td><code>page</code></td><td>integer</td><td>1</td><td>Page number</td></tr>
        <tr><td><code>page_size</code></td><td>integer</td><td>30</td><td>Items per page</td></tr>
        <tr><td><code>search</code></td><td>string</td><td>""</td><td>Search filter</td></tr>
        <tr><td><code>status</code></td><td>string</td><td>—</td><td>Filter by status</td></tr>
        <tr><td><code>startDate</code></td><td>string</td><td>—</td><td>Start date filter</td></tr>
        <tr><td><code>endDate</code></td><td>string</td><td>—</td><td>End date filter</td></tr>
        <tr><td><code>sort</code></td><td>string</td><td>inserted_at_desc</td><td>Sort order</td></tr>
      </tbody>
    </table>
  </div>

  <div class="page-nav">
    <a class="page-nav-btn prev" data-page="api-products" href="#">
      <span class="label">← Previous</span>
      <span class="title">Products API</span>
    </a>
    <a class="page-nav-btn next" data-page="api-payments" href="#">
      <span class="label">Next →</span>
      <span class="title">Payments API</span>
    </a>
  </div>
</div>
`,

/* =========================================================
   PAYMENTS API
   ========================================================= */
"api-payments": `
<div class="page">
  <div class="page-header">
    <div class="breadcrumb">Backend › API Reference</div>
    <h1>Payments API</h1>
    <p class="subtitle">SePay QR bank-transfer payment flow with IPN webhook verification.</p>
  </div>

  <h2>Endpoints — <code>/api/payments</code></h2>

  <div class="table-wrapper">
    <table>
      <thead><tr><th>Method</th><th>Endpoint</th><th>Description</th></tr></thead>
      <tbody>
        <tr><td><span class="method method-post">POST</span></td><td><code>/sepay/create</code></td><td>Create a SePay bank-transfer QR</td></tr>
        <tr><td><span class="method method-post">POST</span></td><td><code>/sepay/ipn</code></td><td>SePay IPN webhook callback</td></tr>
        <tr><td><span class="method method-get">GET</span></td><td><code>/sepay/order/:orderId</code></td><td>Get SePay order details</td></tr>
        <tr><td><span class="method method-get">GET</span></td><td><code>/sepay/status/:orderId</code></td><td>Poll SePay payment status</td></tr>
      </tbody>
    </table>
  </div>

  <h2>Payment Flow</h2>
  <ol>
    <li>Frontend calls <code>POST /sepay/create</code> with order details</li>
    <li>Backend generates a unique transfer description prefix and creates a QR code</li>
    <li>Frontend displays the QR code and polls <code>GET /sepay/status/:orderId</code> every few seconds</li>
    <li>When the customer completes the bank transfer, SePay sends an IPN to <code>POST /sepay/ipn</code></li>
    <li>Backend verifies the IPN signature using <code>SEPAY_IPN_SECRET_KEY</code></li>
    <li>Upon successful verification, the order status is updated and an email confirmation is sent</li>
  </ol>

  <h3>POST /sepay/create</h3>
  <p>Creates a new SePay payment reservation. The order data is persisted as a JSON file in <code>data/sepay-orders/</code>.</p>

  <h3>POST /sepay/ipn</h3>
  <p>Webhook endpoint called by SePay when a bank transfer is confirmed. The request is verified using the <code>SEPAY_WEBHOOK_API_KEY</code> header and optionally the <code>SEPAY_IPN_SECRET_KEY</code> signature.</p>

  <div class="callout callout-warn">
    <div class="callout-title">⚠️ Security</div>
    <p>Set <code>SEPAY_ALLOW_UNSIGNED_IPN=false</code> in production to reject IPN callbacks without a valid signature.</p>
  </div>

  <h3>GET /sepay/status/:orderId</h3>
  <p>Used by the frontend to poll payment status. Returns one of these statuses:</p>
  <div class="table-wrapper">
    <table>
      <thead><tr><th>Status</th><th>Description</th></tr></thead>
      <tbody>
        <tr><td><code>pending</code></td><td>Waiting for bank transfer</td></tr>
        <tr><td><code>paid</code></td><td>Payment confirmed by IPN</td></tr>
        <tr><td><code>expired</code></td><td>Payment window expired</td></tr>
        <tr><td><code>voided</code></td><td>Transaction voided or canceled</td></tr>
        <tr><td><code>late_payment</code></td><td>Payment received after reservation expired</td></tr>
      </tbody>
    </table>
  </div>

  <h2>File-Based Persistence</h2>
  <p>SePay orders are stored as individual JSON files in <code>data/sepay-orders/</code> rather than a database. This simplifies deployment and eliminates the need for a database service.</p>

  <div class="callout callout-info">
    <div class="callout-title">ℹ️ Docker Volume</div>
    <p>In production, mount a Docker volume to <code>/app/data</code> to persist SePay order files across container restarts. The <code>docker-compose.tunnel.yml</code> already configures the <code>backend_data</code> volume for this.</p>
  </div>

  <div class="page-nav">
    <a class="page-nav-btn prev" data-page="api-orders" href="#">
      <span class="label">← Previous</span>
      <span class="title">Orders API</span>
    </a>
    <a class="page-nav-btn next" data-page="api-address" href="#">
      <span class="label">Next →</span>
      <span class="title">Address API</span>
    </a>
  </div>
</div>
`,

/* =========================================================
   ADDRESS API
   ========================================================= */
"api-address": `
<div class="page">
  <div class="page-header">
    <div class="breadcrumb">Backend › API Reference</div>
    <h1>Address API</h1>
    <p class="subtitle">Province, district, and commune lookup for the checkout address form.</p>
  </div>

  <h2>Endpoints — <code>/api/pancake-address</code></h2>

  <div class="table-wrapper">
    <table>
      <thead><tr><th>Method</th><th>Endpoint</th><th>Description</th></tr></thead>
      <tbody>
        <tr><td><span class="method method-get">GET</span></td><td><code>/provinces</code></td><td>List all provinces / cities (Vietnam)</td></tr>
        <tr><td><span class="method method-get">GET</span></td><td><code>/districts/:provinceId</code></td><td>List districts for a province</td></tr>
        <tr><td><span class="method method-get">GET</span></td><td><code>/communes/:provinceId</code></td><td>List communes / wards for a province</td></tr>
      </tbody>
    </table>
  </div>

  <h3>GET /communes/:provinceId</h3>
  <p>Returns communes for the given province. Accepts an optional query parameter:</p>
  <div class="table-wrapper">
    <table>
      <thead><tr><th>Query Param</th><th>Type</th><th>Description</th></tr></thead>
      <tbody>
        <tr><td><code>district_id</code></td><td>string</td><td>Optional. Filter communes by district</td></tr>
      </tbody>
    </table>
  </div>

  <div class="callout callout-tip">
    <div class="callout-title">💡 Checkout Flow</div>
    The checkout UI still exposes a 2-level selector: Province/City → Ward/Commune. However, after a province is selected the frontend also loads district data in the background so it can derive <code>districtId</code> / district name for Pancake order payloads and GHTK fee quoting.
  </div>

  <div class="page-nav">
    <a class="page-nav-btn prev" data-page="api-payments" href="#">
      <span class="label">← Previous</span>
      <span class="title">Payments API</span>
    </a>
    <a class="page-nav-btn next" data-page="backend-services" href="#">
      <span class="label">Next →</span>
      <span class="title">Services & Jobs</span>
    </a>
  </div>
</div>
`,

/* =========================================================
   SERVICES & JOBS
   ========================================================= */
"backend-services": `
<div class="page">
  <div class="page-header">
    <div class="breadcrumb">Backend</div>
    <h1>Services & Background Jobs</h1>
    <p class="subtitle">Internal services and periodic tasks that run alongside the Express server.</p>
  </div>

  <h2>Services</h2>

  <h3>Order Email Service</h3>
  <p><code>services/orderEmailService.js</code> — Dispatches order confirmation emails via SMTP using Nodemailer. HTML templates are defined in <code>orderEmailTemplates.js</code>.</p>

  <h3>Pancake Inventory Service</h3>
  <p><code>services/pancakeInventoryService.js</code> — Validates cart items against real-time Pancake POS inventory. Called before checkout to prevent overselling.</p>

  <h3>SePay Order Store</h3>
  <p><code>services/sepayOrderStore.js</code> — File-based persistence layer for SePay payment reservations. Each order is saved as a JSON file in <code>data/sepay-orders/</code>. Provides read, write, update, and cleanup operations.</p>

  <h3>SePay Service</h3>
  <p><code>services/sepayService.js</code> — Integration layer with the SePay API. Handles QR code generation, IPN signature verification, and payment lookups.</p>

  <hr>

  <h2>Background Jobs</h2>
  <p>The server starts two periodic tasks on boot. Both use <code>setInterval</code> with <code>.unref()</code> so they don't prevent the process from exiting gracefully.</p>

  <div class="table-wrapper">
    <table>
      <thead><tr><th>Job</th><th>Interval</th><th>Description</th></tr></thead>
      <tbody>
        <tr><td><strong>SePay Order Cleanup</strong></td><td>24 hours</td><td>Deletes old SePay order JSON files that have passed the retention period</td></tr>
        <tr><td><strong>SePay Expiry Sweep</strong></td><td>60 seconds</td><td>Marks stale <code>pending</code> reservations as <code>expired</code> and restores Pancake inventory</td></tr>
      </tbody>
    </table>
  </div>

  <div class="callout callout-info">
    <div class="callout-title">ℹ️ Configuration</div>
    The expiry sweep interval is configurable via <code>SEPAY_ORDER_EXPIRY_SWEEP_INTERVAL_MS</code> env var (minimum 1000ms).
  </div>

  <div class="page-nav">
    <a class="page-nav-btn prev" data-page="api-address" href="#">
      <span class="label">← Previous</span>
      <span class="title">Address API</span>
    </a>
    <a class="page-nav-btn next" data-page="backend-env" href="#">
      <span class="label">Next →</span>
      <span class="title">Environment Vars</span>
    </a>
  </div>
</div>
`,

/* =========================================================
   ENVIRONMENT VARS
   ========================================================= */
"backend-env": `
<div class="page">
  <div class="page-header">
    <div class="breadcrumb">Backend</div>
    <h1>Environment Variables</h1>
    <p class="subtitle">Complete reference for all backend configuration variables.</p>
  </div>

  <p>Copy <code>.env.example</code> to <code>.env</code> and fill in the values:</p>
  <div class="code-block">
    <div class="code-block-header"><span>bash</span><button class="code-block-copy" onclick="copyCode(this)">Copy</button></div>
    <pre>cp .env.example .env</pre>
  </div>

  <h2>Server</h2>
  <div class="table-wrapper">
    <table>
      <thead><tr><th>Variable</th><th>Description</th><th>Default</th></tr></thead>
      <tbody>
        <tr><td><code>PORT</code></td><td>Server port</td><td><code>5000</code></td></tr>
        <tr><td><code>ORIGIN</code></td><td>Allowed CORS origins (comma-separated)</td><td><code>http://localhost:5173</code></td></tr>
        <tr><td><code>FRONTEND_URL</code></td><td>Frontend URL for CORS</td><td><code>http://localhost:5173</code></td></tr>
      </tbody>
    </table>
  </div>

  <h2>SMTP / Email</h2>
  <div class="table-wrapper">
    <table>
      <thead><tr><th>Variable</th><th>Description</th><th>Default</th></tr></thead>
      <tbody>
        <tr><td><code>SMTP_HOST</code></td><td>SMTP server hostname</td><td>—</td></tr>
        <tr><td><code>SMTP_PORT</code></td><td>SMTP port</td><td><code>587</code></td></tr>
        <tr><td><code>SMTP_SECURE</code></td><td>Use SSL/TLS</td><td><code>false</code></td></tr>
        <tr><td><code>SMTP_USER</code></td><td>SMTP username</td><td>—</td></tr>
        <tr><td><code>SMTP_PASS</code></td><td>SMTP password</td><td>—</td></tr>
        <tr><td><code>SMTP_IGNORE_TLS</code></td><td>Ignore TLS</td><td><code>false</code></td></tr>
        <tr><td><code>SMTP_REQUIRE_TLS</code></td><td>Require TLS</td><td><code>false</code></td></tr>
        <tr><td><code>EMAIL_FROM_ADDRESS</code></td><td>Sender email address</td><td>—</td></tr>
        <tr><td><code>EMAIL_FROM_NAME</code></td><td>Sender display name</td><td><code>Apricity</code></td></tr>
        <tr><td><code>EMAIL_REPLY_TO</code></td><td>Reply-to address</td><td>—</td></tr>
        <tr><td><code>EMAIL_ORDER_CONFIRMATION_SUBJECT_PREFIX</code></td><td>Email subject prefix</td><td><code>Apricity</code></td></tr>
      </tbody>
    </table>
  </div>

  <h2>SePay</h2>
  <div class="table-wrapper">
    <table>
      <thead><tr><th>Variable</th><th>Description</th><th>Default</th></tr></thead>
      <tbody>
        <tr><td><code>SEPAY_ACCOUNT_NUMBER</code></td><td>Bank account number</td><td>—</td></tr>
        <tr><td><code>SEPAY_ACCOUNT_NAME</code></td><td>Account holder name</td><td><code>Apricity</code></td></tr>
        <tr><td><code>SEPAY_BANK_CODE</code></td><td>Bank code</td><td><code>ACB</code></td></tr>
        <tr><td><code>SEPAY_BANK_NAME</code></td><td>Bank display name</td><td><code>ACB</code></td></tr>
        <tr><td><code>SEPAY_BANK_SHORT_NAME</code></td><td>Bank short name</td><td><code>ACB</code></td></tr>
        <tr><td><code>SEPAY_TRANSFER_PREFIX</code></td><td>Transfer description prefix</td><td><code>WEB</code></td></tr>
        <tr><td><code>SEPAY_IPN_SECRET_KEY</code></td><td>IPN signature secret</td><td>—</td></tr>
        <tr><td><code>SEPAY_WEBHOOK_API_KEY</code></td><td>Webhook authentication key</td><td>—</td></tr>
        <tr><td><code>SEPAY_ALLOW_UNSIGNED_IPN</code></td><td>Accept unsigned IPN callbacks</td><td><code>false</code></td></tr>
      </tbody>
    </table>
  </div>

  <h2>Pancake POS</h2>
  <div class="table-wrapper">
    <table>
      <thead><tr><th>Variable</th><th>Description</th><th>Default</th></tr></thead>
      <tbody>
        <tr><td><code>PANCAKE_API_KEY</code></td><td>Pancake API key</td><td>—</td></tr>
        <tr><td><code>PANCAKE_SHOP_ID</code></td><td>Pancake Shop ID</td><td>—</td></tr>
      </tbody>
    </table>
  </div>

  <div class="callout callout-warn">
    <div class="callout-title">⚠️ Security</div>
    Never commit <code>.env</code> files to version control. The <code>.gitignore</code> already excludes them.
  </div>

  <div class="page-nav">
    <a class="page-nav-btn prev" data-page="backend-services" href="#">
      <span class="label">← Previous</span>
      <span class="title">Services & Jobs</span>
    </a>
    <a class="page-nav-btn next" data-page="frontend-overview" href="#">
      <span class="label">Next →</span>
      <span class="title">Frontend Overview</span>
    </a>
  </div>
</div>
`,

/* =========================================================
   FRONTEND OVERVIEW
   ========================================================= */
"frontend-overview": `
<div class="page">
  <div class="page-header">
    <div class="breadcrumb">Frontend</div>
    <h1>Frontend Overview</h1>
    <p class="subtitle">React 19 + Vite 7 storefront with Tailwind CSS 4, bilingual support, and responsive mobile-first design.</p>
  </div>

  <h2>Tech Stack</h2>
  <div class="table-wrapper">
    <table>
      <thead><tr><th>Technology</th><th>Version</th><th>Purpose</th></tr></thead>
      <tbody>
        <tr><td>React</td><td>19.1</td><td>UI framework</td></tr>
        <tr><td>TypeScript</td><td>—</td><td>Type safety</td></tr>
        <tr><td>Vite</td><td>7.0</td><td>Build tool &amp; dev server</td></tr>
        <tr><td>Tailwind CSS</td><td>4.1</td><td>Utility-first styling</td></tr>
        <tr><td>React Router</td><td>7.6</td><td>Client-side routing</td></tr>
        <tr><td>i18next</td><td>25.3</td><td>Internationalization (vi / en)</td></tr>
        <tr><td>Axios</td><td>1.10</td><td>HTTP client</td></tr>
        <tr><td>@iconify/react</td><td>6.0</td><td>Icon library</td></tr>
        <tr><td>@dnd-kit/core</td><td>6.3</td><td>Drag-and-drop interactions</td></tr>
        <tr><td>Radix UI</td><td>1.2</td><td>Accessible primitives</td></tr>
      </tbody>
    </table>
  </div>

  <h2>Key Features</h2>
  <div class="feature-grid">
    <div class="feature-card">
      <span class="emoji">🛍️</span>
      <h4>Product Catalog</h4>
      <p>Products fetched from Pancake POS with category filtering and search.</p>
    </div>
    <div class="feature-card">
      <span class="emoji">🛒</span>
      <h4>Client-Side Cart</h4>
      <p>Persistent cart state with inventory validation before checkout.</p>
    </div>
    <div class="feature-card">
      <span class="emoji">💳</span>
      <h4>Multiple Payments</h4>
      <p>SePay QR bank transfer and card payment methods.</p>
    </div>
    <div class="feature-card">
      <span class="emoji">🌐</span>
      <h4>Bilingual</h4>
      <p>Vietnamese (default) and English via i18next.</p>
    </div>
    <div class="feature-card">
      <span class="emoji">📱</span>
      <h4>Responsive</h4>
      <p>Mobile-first design that adapts to all screen sizes.</p>
    </div>
    <div class="feature-card">
      <span class="emoji">⚡</span>
      <h4>Lazy-Loaded Pages</h4>
      <p>All pages are lazy-loaded with React.lazy() for optimal performance.</p>
    </div>
  </div>

  <h2>Project Structure</h2>
  <div class="file-tree">
<span class="dir">src/</span>
├── <span class="dir">assets/</span>              <span class="comment"># Images, fonts, static files</span>
├── <span class="dir">components/</span>
│   ├── <span class="dir">layout/</span>          <span class="comment"># Header, Footer</span>
│   ├── <span class="dir">ui/</span>              <span class="comment"># Button, ProductCard, VariantSelector, AppAlert</span>
│   ├── <span class="dir">about-us-section/</span>
│   ├── <span class="dir">checkout-section/</span>
│   ├── <span class="dir">featured-products-section/</span>
│   ├── <span class="dir">mannequin-section/</span>
│   ├── <span class="dir">pancake-products-section/</span>
│   └── <span class="dir">payment-section/</span>
├── <span class="dir">config/</span>              <span class="comment"># App configuration (shipping, etc.)</span>
├── <span class="dir">data/</span>                <span class="comment"># Static data (policies, provinces, about-us)</span>
├── <span class="dir">hooks/</span>               <span class="comment"># Custom hooks (useCartCount)</span>
├── <span class="dir">i18n/</span>
│   ├── <span class="file">config.js</span>        <span class="comment"># i18next setup</span>
│   ├── <span class="file">language.js</span>      <span class="comment"># Language utilities</span>
│   └── <span class="dir">locales/</span>         <span class="comment"># en.json, vi.json</span>
├── <span class="dir">lib/</span>                 <span class="comment"># Core logic</span>
│   ├── <span class="file">api-client.js</span>    <span class="comment"># Axios instance &amp; API functions</span>
│   ├── <span class="file">cart-store.ts</span>    <span class="comment"># Cart state management</span>
│   ├── <span class="file">cart-addition.ts</span>
│   ├── <span class="file">inventory.ts</span>     <span class="comment"># Inventory tracking</span>
│   ├── <span class="file">localized-content.ts</span>
│   └── <span class="file">utils.ts</span>
├── <span class="dir">pages/</span>               <span class="comment"># Lazy-loaded page components</span>
├── <span class="dir">styles/</span>              <span class="comment"># Global CSS</span>
├── <span class="dir">types/</span>               <span class="comment"># TypeScript definitions</span>
└── <span class="dir">utils/</span>               <span class="comment"># Constants &amp; helpers</span>
  </div>

  <h2>Environment Variables</h2>
  <div class="table-wrapper">
    <table>
      <thead><tr><th>Variable</th><th>Description</th><th>Default</th></tr></thead>
      <tbody>
        <tr><td><code>VITE_SERVER_URL</code></td><td>Backend API base URL</td><td><code>http://localhost:5000</code> (dev) / <code>window.location.origin</code> (prod)</td></tr>
      </tbody>
    </table>
  </div>

  <div class="page-nav">
    <a class="page-nav-btn prev" data-page="backend-env" href="#">
      <span class="label">← Previous</span>
      <span class="title">Environment Vars</span>
    </a>
    <a class="page-nav-btn next" data-page="frontend-routes" href="#">
      <span class="label">Next →</span>
      <span class="title">Pages & Routes</span>
    </a>
  </div>
</div>
`,

/* =========================================================
   FRONTEND ROUTES
   ========================================================= */
"frontend-routes": `
<div class="page">
  <div class="page-header">
    <div class="breadcrumb">Frontend</div>
    <h1>Pages & Routes</h1>
    <p class="subtitle">All client-side routes and their corresponding page components.</p>
  </div>

  <h2>Route Table</h2>
  <div class="table-wrapper">
    <table>
      <thead><tr><th>Route</th><th>Page Component</th><th>Description</th></tr></thead>
      <tbody>
        <tr><td><code>/</code></td><td>HomePage</td><td>Landing page with featured products, mannequin section, and about-us</td></tr>
        <tr><td><code>/about</code></td><td>AboutPage</td><td>Brand story and team information</td></tr>
        <tr><td><code>/collection</code></td><td>CollectionPage</td><td>Full product catalog with category filters</td></tr>
        <tr><td><code>/detail/:slug</code></td><td>DetailPage</td><td>Single product detail: images, variants, add-to-cart</td></tr>
        <tr><td><code>/policies</code></td><td>PoliciesPage</td><td>Store policies (shipping, returns, privacy)</td></tr>
        <tr><td><code>/cart</code></td><td>CartPage</td><td>Shopping cart with quantity controls and inventory checks</td></tr>
        <tr><td><code>/checkout</code></td><td>CheckoutPage</td><td>Multi-step checkout: customer info, address, payment method</td></tr>
        <tr><td><code>/bank-transfer</code></td><td>BankTransferPage</td><td>SePay QR code display with status polling</td></tr>
        <tr><td><code>/card-payment</code></td><td>CardPaymentPage</td><td>Card payment processing</td></tr>
        <tr><td><code>/payment/success</code></td><td>PaymentSuccessPage</td><td>Order confirmation and thank-you page</td></tr>
      </tbody>
    </table>
  </div>

  <h2>Lazy Loading</h2>
  <p>All page components are lazy-loaded using <code>React.lazy()</code> with a <code>Suspense</code> fallback. This ensures the initial bundle only contains the shell (Header, Footer, routing logic) while pages are loaded on demand.</p>

  <div class="code-block">
    <div class="code-block-header"><span>App.tsx</span><button class="code-block-copy" onclick="copyCode(this)">Copy</button></div>
    <pre>const HomePage = lazy(() => import('@/pages/Home'))
const CollectionPage = lazy(() => import('@/pages/Collection'))
// ... all pages follow this pattern

&lt;Suspense fallback={&lt;div&gt;{t('common.loading')}&lt;/div&gt;}&gt;
  &lt;Routes&gt;
    &lt;Route path="/" element={&lt;HomePage /&gt;} /&gt;
    &lt;Route path="/collection" element={&lt;CollectionPage /&gt;} /&gt;
    {/* ... */}
  &lt;/Routes&gt;
&lt;/Suspense&gt;</pre>
  </div>

  <h2>Layout</h2>
  <p>Every page is wrapped in a common layout with:</p>
  <ul>
    <li><code>Header</code> — Navigation bar with logo, menu links, language switcher, and cart icon</li>
    <li><code>main.main-content</code> — Page-specific content</li>
    <li><code>Footer</code> — Site footer with links and brand info</li>
  </ul>

  <div class="page-nav">
    <a class="page-nav-btn prev" data-page="frontend-overview" href="#">
      <span class="label">← Previous</span>
      <span class="title">Frontend Overview</span>
    </a>
    <a class="page-nav-btn next" data-page="frontend-checkout-flow" href="#">
      <span class="label">Next →</span>
      <span class="title">Checkout &amp; Shipment</span>
    </a>
  </div>
</div>
`,

/* =========================================================
   FRONTEND CHECKOUT FLOW
   ========================================================= */
"frontend-checkout-flow": `
<div class="page">
  <div class="page-header">
    <div class="breadcrumb">Frontend</div>
    <h1>Checkout &amp; Shipment Flow</h1>
    <p class="subtitle">End-to-end flow for Pancake address lookup, live GHTK shipping quotes, and order submission from the checkout page.</p>
  </div>

  <h2>Primary Files</h2>
  <div class="table-wrapper">
    <table>
      <thead><tr><th>File</th><th>Responsibility</th></tr></thead>
      <tbody>
        <tr><td><code>pages/Checkout/index.tsx</code></td><td>Owns fee fetching, debounce logic, order submission, and SePay branching</td></tr>
        <tr><td><code>components/checkout-section/customer-information/customer-information-section.tsx</code></td><td>Loads Pancake provinces, communes, and background district metadata</td></tr>
        <tr><td><code>components/checkout-section/shipping-information/shipping-information-section.tsx</code></td><td>Shows the live fee, loading state, and fallback/error note</td></tr>
        <tr><td><code>components/checkout-section/checkout-summary/checkout-summary-section.tsx</code></td><td>Displays subtotal, shipping fee, total, and submit CTA</td></tr>
        <tr><td><code>config/shipping.ts</code></td><td>Defines the default fallback fee (<code>BASE_SHIPPING_FEE = 24000</code>)</td></tr>
      </tbody>
    </table>
  </div>

  <h2>Address Mapping</h2>
  <p>The visible checkout form stays intentionally simple, but the store keeps extra derived fields so Pancake and GHTK can receive the data shape they expect.</p>
  <div class="table-wrapper">
    <table>
      <thead><tr><th>Checkout UI</th><th>Stored Value</th><th>Used For</th></tr></thead>
      <tbody>
        <tr><td>Tỉnh / Thành phố</td><td><code>customerInfo.city</code>, <code>provinceId</code>, <code>provinceLegacyId</code></td><td>Displayed address, Pancake shipping address, GHTK <code>province</code> param</td></tr>
        <tr><td>Phường / Xã</td><td><code>customerInfo.commune</code>, <code>communeId</code>, <code>communeLegacyId</code></td><td>Displayed address and GHTK <code>ward</code> param</td></tr>
        <tr><td>Derived quận / huyện</td><td><code>customerInfo.province</code>, <code>districtId</code>, <code>districtLegacyId</code></td><td>Pancake district fields and GHTK <code>district</code> param</td></tr>
      </tbody>
    </table>
  </div>

  <div class="callout callout-info">
    <div class="callout-title">ℹ️ District Fallback</div>
    When Pancake's newer address shape does not directly expose a district label that the checkout can use, the frontend falls back to the selected ward/commune name for the GHTK <code>district</code> request parameter. This keeps live fee quoting working even with imperfect address mapping data.
  </div>

  <h2>Live GHTK Quote Flow</h2>
  <ol>
    <li>Customer selects a province. The frontend loads both communes and districts for that province from Pancake.</li>
    <li>Customer selects a ward/commune. The frontend derives the matching district ID and district name from the cached district list.</li>
    <li>When <code>city</code> and an effective district value are available, checkout starts a <code>600ms</code> debounce timer.</li>
    <li>After the debounce window, the frontend calls <code>GET /api/shipping/fee</code> with <code>province</code>, <code>district</code>, optional <code>ward</code>, optional <code>address</code>, <code>weight=500</code>, and <code>value=&lt;subtotal&gt;</code>.</li>
    <li>While the request is in flight, both the shipping method row and the order summary show a translated “calculating” state.</li>
    <li>If the API returns <code>{ success: true, fee }</code>, the fee is used in the checkout total. If the API fails or returns <code>success: false</code>, the UI falls back to the configured base fee and shows a warning note that the live GHTK quote is unavailable.</li>
  </ol>

  <div class="code-block">
    <div class="code-block-header"><span>HTTP sequence</span><button class="code-block-copy" onclick="copyCode(this)">Copy</button></div>
    <pre>GET /api/pancake-address/provinces
GET /api/pancake-address/communes/:provinceId
GET /api/pancake-address/districts/:provinceId
GET /api/shipping/fee?province=...&amp;district=...&amp;ward=...&amp;address=...&amp;weight=500&amp;value=&lt;subtotal&gt;</pre>
  </div>

  <h2>Order Submission Paths</h2>
  <ol>
    <li>The checkout validates required fields and normalizes customer input.</li>
    <li>It runs inventory validation with <code>POST /api/pancake-products/inventory/check</code>. If stock changed, the cart is reconciled and order submission stops until the customer reviews it.</li>
    <li>For COD, the frontend submits <code>POST /api/pancake-orders/orders</code> with the resolved <code>shippingFee</code>, full address, Pancake IDs, and cart items.</li>
    <li>For bank transfer, the frontend submits <code>POST /api/payments/sepay/create</code> with the same order context and then redirects to <code>/bank-transfer</code> for QR payment.</li>
    <li>On the backend, Pancake order creation is followed by shipment arrangement through GHTK when order creation succeeds.</li>
  </ol>

  <h2>Operational Notes</h2>
  <ul>
    <li>The frontend intentionally does not block checkout when the live GHTK quote fails; it uses the default fee so order creation can still continue.</li>
    <li>The summary total is recalculated immediately whenever the dynamic fee changes.</li>
    <li>The shipping quote request is aborted and replaced whenever the customer changes address inputs again before the previous quote completes.</li>
    <li>The frontend expects a backend <code>GET /api/shipping/fee</code> endpoint; if that integration is missing or temporarily unavailable, the fallback fee path becomes the default behavior.</li>
  </ul>

  <div class="page-nav">
    <a class="page-nav-btn prev" data-page="frontend-routes" href="#">
      <span class="label">← Previous</span>
      <span class="title">Pages &amp; Routes</span>
    </a>
    <a class="page-nav-btn next" data-page="frontend-components" href="#">
      <span class="label">Next →</span>
      <span class="title">Components</span>
    </a>
  </div>
</div>
`,

/* =========================================================
   FRONTEND COMPONENTS
   ========================================================= */
"frontend-components": `
<div class="page">
  <div class="page-header">
    <div class="breadcrumb">Frontend</div>
    <h1>Components</h1>
    <p class="subtitle">Reusable UI components and section-level compositions.</p>
  </div>

  <h2>Layout Components</h2>
  <div class="table-wrapper">
    <table>
      <thead><tr><th>Component</th><th>Path</th><th>Description</th></tr></thead>
      <tbody>
        <tr><td><strong>Header</strong></td><td><code>components/layout/Header</code></td><td>Top navigation bar with logo, menu, language switcher, cart count badge</td></tr>
        <tr><td><strong>Footer</strong></td><td><code>components/layout/Footer</code></td><td>Site footer with links, social media, and branding</td></tr>
      </tbody>
    </table>
  </div>

  <h2>UI Components</h2>
  <div class="table-wrapper">
    <table>
      <thead><tr><th>Component</th><th>Path</th><th>Description</th></tr></thead>
      <tbody>
        <tr><td><strong>Button</strong></td><td><code>components/ui/Button</code></td><td>Styled button with variants using class-variance-authority</td></tr>
        <tr><td><strong>ProductCard</strong></td><td><code>components/ui/ProductCard</code></td><td>Product preview card used in catalog and featured sections</td></tr>
        <tr><td><strong>VariantSelector</strong></td><td><code>components/ui/VariantSelector</code></td><td>Size/color variant picker on product detail pages</td></tr>
        <tr><td><strong>AppAlert</strong></td><td><code>components/ui/app-alert</code></td><td>Global alert/notification provider with context API</td></tr>
      </tbody>
    </table>
  </div>

  <h2>Section Components</h2>
  <p>Section components are larger compositions used within pages:</p>
  <div class="table-wrapper">
    <table>
      <thead><tr><th>Section</th><th>Used In</th><th>Description</th></tr></thead>
      <tbody>
        <tr><td><strong>featured-products-section</strong></td><td>Home</td><td>Highlighted products carousel/grid</td></tr>
        <tr><td><strong>mannequin-section</strong></td><td>Home</td><td>Visual mannequin showcase with drag-and-drop</td></tr>
        <tr><td><strong>about-us-section</strong></td><td>Home / About</td><td>Brand story content block</td></tr>
        <tr><td><strong>pancake-products-section</strong></td><td>Collection</td><td>Paginated product grid with category filters</td></tr>
        <tr><td><strong>checkout-section</strong></td><td>Checkout</td><td>Multi-step checkout form with customer info, Pancake address lookup, live GHTK fee state, and payment branching</td></tr>
        <tr><td><strong>payment-section</strong></td><td>BankTransfer / CardPayment</td><td>Payment UI and status polling components</td></tr>
      </tbody>
    </table>
  </div>

  <div class="page-nav">
    <a class="page-nav-btn prev" data-page="frontend-checkout-flow" href="#">
      <span class="label">← Previous</span>
      <span class="title">Checkout &amp; Shipment</span>
    </a>
    <a class="page-nav-btn next" data-page="frontend-state" href="#">
      <span class="label">Next →</span>
      <span class="title">State & Logic</span>
    </a>
  </div>
</div>
`,

/* =========================================================
   STATE & LOGIC
   ========================================================= */
"frontend-state": `
<div class="page">
  <div class="page-header">
    <div class="breadcrumb">Frontend</div>
    <h1>State & Logic</h1>
    <p class="subtitle">Core business logic, checkout state management, and API integration in the <code>lib/</code> and <code>pages/Checkout</code> modules.</p>
  </div>

  <h2>API Client</h2>
  <p><code>lib/api-client.js</code> — Central Axios instance and all API call functions.</p>

  <h3>API Host Resolution</h3>
  <div class="code-block">
    <div class="code-block-header"><span>api-client.js</span><button class="code-block-copy" onclick="copyCode(this)">Copy</button></div>
    <pre>const resolveApiHost = () => {
  // 1. Use VITE_SERVER_URL if set
  // 2. Use localhost:5000 in development
  // 3. Use window.location.origin in production
}</pre>
  </div>

  <h3>Exported API Functions</h3>
  <div class="table-wrapper">
    <table>
      <thead><tr><th>Function</th><th>API Endpoint</th></tr></thead>
      <tbody>
        <tr><td><code>getPancakeProducts()</code></td><td><code>GET /api/pancake-products/products</code></td></tr>
        <tr><td><code>getPancakeProductById(id)</code></td><td><code>GET /api/pancake-products/products/:id</code></td></tr>
        <tr><td><code>getPancakeCategories()</code></td><td><code>GET /api/pancake-products/categories</code></td></tr>
        <tr><td><code>checkPancakeInventory(items)</code></td><td><code>POST /api/pancake-products/inventory/check</code></td></tr>
        <tr><td><code>createPancakeOrder(data)</code></td><td><code>POST /api/pancake-orders/orders</code></td></tr>
        <tr><td><code>createSePayPayment(payload)</code></td><td><code>POST /api/payments/sepay/create</code></td></tr>
        <tr><td><code>getSePayPayment(orderId)</code></td><td><code>GET /api/payments/sepay/order/:id</code></td></tr>
        <tr><td><code>getSePayPaymentStatus(orderId)</code></td><td><code>GET /api/payments/sepay/status/:id</code></td></tr>
        <tr><td><code>getPancakeProvinces()</code></td><td><code>GET /api/pancake-address/provinces</code></td></tr>
        <tr><td><code>getPancakeDistricts(provinceId)</code></td><td><code>GET /api/pancake-address/districts/:provinceId</code></td></tr>
        <tr><td><code>getPancakeCommunes(pId, districtId?)</code></td><td><code>GET /api/pancake-address/communes/:pId</code></td></tr>
        <tr><td><code>calculateGHTKShippingFee(params)</code></td><td><code>GET /api/shipping/fee</code></td></tr>
      </tbody>
    </table>
  </div>

  <h3>Error Handling</h3>
  <p>The API client includes a <code>translateKnownUiMessage()</code> function that maps backend error strings to i18n translation keys. This ensures error messages are always displayed in the user's language.</p>

  <hr>

  <h2>Checkout Store &amp; Shipping Logic</h2>
  <p><code>pages/Checkout/store.ts</code> stores customer info, payment method, order code, and derived address IDs. The checkout page then combines that state with live shipping fee data fetched from GHTK.</p>
  <ul>
    <li><code>city</code> stores the selected Province/City name, while <code>province</code> stores the derived district name used for shipping integration.</li>
    <li><code>config/shipping.ts</code> exposes <code>BASE_SHIPPING_FEE</code> and a resolver that prefers the live fee when available.</li>
    <li><code>pages/Checkout/index.tsx</code> uses an abortable, debounced request flow so stale fee responses do not overwrite newer address input.</li>
    <li>If the live quote fails, the UI preserves checkout continuity by falling back to the default configured shipping fee.</li>
  </ul>

  <h2>Cart Store</h2>
  <p><code>lib/cart-store.ts</code> — Client-side cart state management with localStorage persistence. Handles:</p>
  <ul>
    <li>Add / remove / update cart items</li>
    <li>Quantity validation against inventory</li>
    <li>Cart total calculation</li>
    <li>Persistence across browser sessions</li>
  </ul>

  <h2>Inventory Module</h2>
  <p><code>lib/inventory.ts</code> — Real-time inventory tracking and validation. Called before checkout to ensure all items are still available.</p>

  <h2>Cart Addition</h2>
  <p><code>lib/cart-addition.ts</code> — Logic for adding items to cart with variant selection, duplicate detection, and quantity merging.</p>

  <h2>Localized Content</h2>
  <p><code>lib/localized-content.ts</code> — Utilities for resolving content that differs between languages (e.g., product descriptions stored in multiple languages in Pancake POS).</p>

  <div class="page-nav">
    <a class="page-nav-btn prev" data-page="frontend-components" href="#">
      <span class="label">← Previous</span>
      <span class="title">Components</span>
    </a>
    <a class="page-nav-btn next" data-page="frontend-i18n" href="#">
      <span class="label">Next →</span>
      <span class="title">Internationalization</span>
    </a>
  </div>
</div>
`,

/* =========================================================
   INTERNATIONALIZATION
   ========================================================= */
"frontend-i18n": `
<div class="page">
  <div class="page-header">
    <div class="breadcrumb">Frontend</div>
    <h1>Internationalization</h1>
    <p class="subtitle">Bilingual support with i18next — Vietnamese (default) and English.</p>
  </div>

  <h2>Setup</h2>
  <p>i18next is configured in <code>src/i18n/config.js</code> and initialized before the React app mounts. Translation files live in <code>src/i18n/locales/</code>:</p>

  <div class="file-tree">
<span class="dir">i18n/</span>
├── <span class="file">config.js</span>          <span class="comment"># i18next initialization</span>
├── <span class="file">language.js</span>        <span class="comment"># Language utilities</span>
└── <span class="dir">locales/</span>
    ├── <span class="file">en.json</span>        <span class="comment"># English translations</span>
    └── <span class="file">vi.json</span>        <span class="comment"># Vietnamese translations</span>
  </div>

  <h2>Usage in Components</h2>
  <div class="code-block">
    <div class="code-block-header"><span>tsx</span><button class="code-block-copy" onclick="copyCode(this)">Copy</button></div>
    <pre>import { useTranslation } from 'react-i18next'

const MyComponent = () => {
  const { t } = useTranslation()

  return &lt;h1&gt;{t('home.hero_title')}&lt;/h1&gt;
}</pre>
  </div>

  <h2>Translation Key Structure</h2>
  <p>Keys are organized by page/feature namespace:</p>
  <div class="code-block">
    <div class="code-block-header"><span>en.json (excerpt)</span><button class="code-block-copy" onclick="copyCode(this)">Copy</button></div>
    <pre>{
  "common": {
    "loading": "Loading...",
    "add_to_cart": "Add to Cart"
  },
  "home": {
    "hero_title": "Apricity #YourLove"
  },
  "checkout": {
    "order_error": {
      "message": "Failed to create order",
      "payment_setup_failed": "Payment setup failed"
    }
  },
  "bank_transfer": {
    "errors": {
      "expired_before_confirmation": "Payment window expired"
    }
  }
}</pre>
  </div>

  <h2>Backend Error Translation</h2>
  <p>The API client's <code>translateKnownUiMessage()</code> function maps known backend error messages to i18n keys. This ensures consistent user-facing messages regardless of the API language.</p>

  <div class="callout callout-tip">
    <div class="callout-title">💡 Adding New Translations</div>
    <p>When adding new UI text, always add the key to <strong>both</strong> <code>en.json</code> and <code>vi.json</code>. Use <code>npm run lint</code> to catch common issues.</p>
  </div>

  <div class="page-nav">
    <a class="page-nav-btn prev" data-page="frontend-state" href="#">
      <span class="label">← Previous</span>
      <span class="title">State & Logic</span>
    </a>
    <a class="page-nav-btn next" data-page="deployment-docker" href="#">
      <span class="label">Next →</span>
      <span class="title">Docker & Compose</span>
    </a>
  </div>
</div>
`,

/* =========================================================
   DOCKER & COMPOSE
   ========================================================= */
"deployment-docker": `
<div class="page">
  <div class="page-header">
    <div class="breadcrumb">Deployment</div>
    <h1>Docker & Compose</h1>
    <p class="subtitle">Containerized deployment for both frontend and backend services.</p>
  </div>

  <h2>Individual Containers</h2>

  <h3>Backend</h3>
  <p>Node.js container running Express in production mode on port 5000.</p>
  <div class="code-block">
    <div class="code-block-header"><span>bash</span><button class="code-block-copy" onclick="copyCode(this)">Copy</button></div>
    <pre>cd Apricity-BackEnd/server
docker build -t apricity-backend .
docker run -p 5000:5000 --env-file .env apricity-backend</pre>
  </div>
  <p>To persist SePay order data across restarts:</p>
  <div class="code-block">
    <div class="code-block-header"><span>bash</span><button class="code-block-copy" onclick="copyCode(this)">Copy</button></div>
    <pre>docker run -p 5000:5000 --env-file .env \\
  -v apricity_data:/app/data \\
  apricity-backend</pre>
  </div>

  <h3>Frontend</h3>
  <p>Multi-stage build: Node 24 Alpine builds the Vite bundle → Nginx 1.29 Alpine serves static files on port 8080.</p>
  <div class="code-block">
    <div class="code-block-header"><span>bash</span><button class="code-block-copy" onclick="copyCode(this)">Copy</button></div>
    <pre>cd Apricity-FrontEnd/client
docker build -t apricity-frontend .
docker run -p 8080:8080 apricity-frontend</pre>
  </div>
  <p>The included <code>nginx.conf</code> handles SPA routing (all routes fall back to <code>index.html</code>) and exposes a <code>/healthz</code> endpoint.</p>

  <hr>

  <h2>Docker Compose — Full Stack</h2>
  <p>The root-level <code>docker-compose.tunnel.yml</code> orchestrates all three services:</p>
  <div class="code-block">
    <div class="code-block-header"><span>docker-compose.tunnel.yml</span><button class="code-block-copy" onclick="copyCode(this)">Copy</button></div>
    <pre>services:
  frontend:
    build:
      context: ./Apricity-FrontEnd/client
      dockerfile: Dockerfile
    restart: unless-stopped

  backend:
    build:
      context: ./Apricity-BackEnd/server
      dockerfile: Dockerfile
    env_file:
      - ./deploy/env/backend.env
    restart: unless-stopped
    volumes:
      - backend_data:/app/data

  cloudflared:
    image: cloudflare/cloudflared:latest
    depends_on:
      - backend
    restart: unless-stopped
    command: tunnel --config /etc/cloudflared/config.yml run
    volumes:
      - ./deploy/cloudflared:/etc/cloudflared:ro

volumes:
  backend_data:</pre>
  </div>

  <h3>Build & Run</h3>
  <div class="code-block">
    <div class="code-block-header"><span>bash</span><button class="code-block-copy" onclick="copyCode(this)">Copy</button></div>
    <pre># Build and start all services
docker compose -f docker-compose.tunnel.yml up -d --build

# Check status
docker compose -f docker-compose.tunnel.yml ps

# View logs
docker compose -f docker-compose.tunnel.yml logs -f backend
docker compose -f docker-compose.tunnel.yml logs -f cloudflared</pre>
  </div>

  <div class="page-nav">
    <a class="page-nav-btn prev" data-page="frontend-i18n" href="#">
      <span class="label">← Previous</span>
      <span class="title">Internationalization</span>
    </a>
    <a class="page-nav-btn next" data-page="deployment-cloudflare" href="#">
      <span class="label">Next →</span>
      <span class="title">Cloudflare Tunnel</span>
    </a>
  </div>
</div>
`,

/* =========================================================
   CLOUDFLARE TUNNEL
   ========================================================= */
"deployment-cloudflare": `
<div class="page">
  <div class="page-header">
    <div class="breadcrumb">Deployment</div>
    <h1>Cloudflare Tunnel</h1>
    <p class="subtitle">Zero-config HTTPS deployment using Cloudflare Tunnel to route traffic to your frontend and backend containers.</p>
  </div>

  <h2>Overview</h2>
  <p>Cloudflare Tunnel creates a secure outbound-only connection from your server to Cloudflare's edge network. No open ports or firewall rules required.</p>
  <div class="table-wrapper">
    <table>
      <thead><tr><th>Host</th><th>Path</th><th>Destination</th></tr></thead>
      <tbody>
        <tr><td><code>apricity.com.vn</code></td><td><code>/api/*</code></td><td>Backend container</td></tr>
        <tr><td><code>apricity.com.vn</code></td><td><code>/*</code></td><td>Frontend container</td></tr>
        <tr><td><code>www.apricity.com.vn</code></td><td><code>/api/*</code></td><td>Backend container</td></tr>
        <tr><td><code>www.apricity.com.vn</code></td><td><code>/*</code></td><td>Frontend container</td></tr>
      </tbody>
    </table>
  </div>

  <h2>Setup Steps</h2>

  <h3>1. Prepare Domain on Cloudflare</h3>
  <ol>
    <li>Add the domain zone to your Cloudflare account</li>
    <li>Change nameservers at your domain registrar to Cloudflare-assigned nameservers</li>
    <li>Wait for the zone status to become <strong>Active</strong></li>
  </ol>

  <h3>2. Server Prerequisites</h3>
  <ul>
    <li>Linux VPS with Docker and Docker Compose plugin</li>
    <li>Outbound internet access (cloudflared needs to reach Cloudflare edge)</li>
  </ul>

  <h3>3. Create Tunnel</h3>
  <div class="code-block">
    <div class="code-block-header"><span>bash</span><button class="code-block-copy" onclick="copyCode(this)">Copy</button></div>
    <pre>cloudflared tunnel login
cloudflared tunnel create apricity-production
cloudflared tunnel route dns apricity-production apricity.com.vn
cloudflared tunnel route dns apricity-production www.apricity.com.vn</pre>
  </div>
  <p>After <code>create</code>, Cloudflare generates a credentials file at <code>~/.cloudflared/&lt;TUNNEL_UUID&gt;.json</code>.</p>

  <h3>4. Configure Tunnel</h3>
  <div class="code-block">
    <div class="code-block-header"><span>bash</span><button class="code-block-copy" onclick="copyCode(this)">Copy</button></div>
    <pre># Copy config template
cp deploy/cloudflared/config.yml.example deploy/cloudflared/config.yml

# Copy credentials file
cp ~/.cloudflared/&lt;UUID&gt;.json deploy/cloudflared/</pre>
  </div>
  <p>Edit <code>deploy/cloudflared/config.yml</code> and set your tunnel UUID and credentials file path.</p>

  <h3>5. Validate Ingress</h3>
  <div class="code-block">
    <div class="code-block-header"><span>bash</span><button class="code-block-copy" onclick="copyCode(this)">Copy</button></div>
    <pre>docker run --rm \\
  -v "$PWD/deploy/cloudflared:/etc/cloudflared:ro" \\
  cloudflare/cloudflared:latest \\
  tunnel --config /etc/cloudflared/config.yml ingress validate</pre>
  </div>

  <h3>6. Deploy</h3>
  <div class="code-block">
    <div class="code-block-header"><span>bash</span><button class="code-block-copy" onclick="copyCode(this)">Copy</button></div>
    <pre>docker compose -f docker-compose.tunnel.yml up -d --build</pre>
  </div>

  <hr>

  <h2>Common Issues</h2>
  <div class="table-wrapper">
    <table>
      <thead><tr><th>Problem</th><th>Cause</th></tr></thead>
      <tbody>
        <tr><td>Can't create/publish hostname</td><td>Domain nameservers not changed to Cloudflare</td></tr>
        <tr><td>Backend boot error</td><td>Missing <code>deploy/env/backend.env</code> on server</td></tr>
        <tr><td>Cloudflared won't start</td><td>Missing <code>deploy/cloudflared/*.json</code> credentials</td></tr>
        <tr><td>Visitor sees error 1016</td><td>DNS record exists but cloudflared container is down</td></tr>
        <tr><td>Product API errors</td><td>Missing <code>PANCAKE_SHOP_ID</code> or <code>PANCAKE_API_KEY</code></td></tr>
        <tr><td>IPN returns 401</td><td>Missing SePay webhook secret key</td></tr>
        <tr><td>SePay data lost after restart</td><td>No persistent volume for <code>/app/data</code></td></tr>
      </tbody>
    </table>
  </div>

  <div class="callout callout-warn">
    <div class="callout-title">⚠️ Security Reminder</div>
    <p>Never commit <code>backend.env</code> or <code>deploy/cloudflared/*.json</code> credentials to version control.</p>
  </div>

  <div class="page-nav">
    <a class="page-nav-btn prev" data-page="deployment-docker" href="#">
      <span class="label">← Previous</span>
      <span class="title">Docker & Compose</span>
    </a>
    <div></div>
  </div>
</div>
`
};
