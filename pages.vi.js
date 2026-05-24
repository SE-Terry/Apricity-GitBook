// ============================================================
// pages.vi.js  — Vietnamese documentation pages
// ============================================================

const PAGES_VI = {

introduction: `
<div class="page">
  <div class="page-header">
    <div class="breadcrumb">Bắt đầu</div>
    <h1>Chào mừng đến với Apricity</h1>
    <p class="subtitle">Tài liệu kỹ thuật cho nền tảng thương mại điện tử <strong>Apricity #YourLove</strong>, một storefront thời trang vận hành bằng Pancake POS.</p>
  </div>

  <h2>Apricity là gì?</h2>
  <p>Apricity là hệ thống bán hàng full-stack cho thương hiệu thời trang Việt Nam. Hệ thống gồm hai repository chính hoạt động cùng nhau:</p>

  <div class="feature-grid">
    <div class="feature-card">
      <span class="emoji">🎨</span>
      <h4>Apricity Frontend</h4>
      <p>Storefront React 19 + Vite 7, Tailwind CSS, i18n, lazy-loaded pages và giao diện responsive mobile-first.</p>
    </div>
    <div class="feature-card">
      <span class="emoji">⚙️</span>
      <h4>Apricity Backend</h4>
      <p>Express 5 REST API proxy Pancake POS, xử lý thanh toán QR SePay và gửi email xác nhận đơn hàng.</p>
    </div>
    <div class="feature-card">
      <span class="emoji">🛍️</span>
      <h4>Tích hợp Pancake POS</h4>
      <p>Sản phẩm, tồn kho, đơn hàng và dữ liệu địa chỉ được đồng bộ từ Pancake POS, là nguồn dữ liệu chính của catalog.</p>
    </div>
    <div class="feature-card">
      <span class="emoji">💳</span>
      <h4>Thanh toán QR SePay</h4>
      <p>Chuyển khoản ngân hàng qua QR, xác thực IPN webhook, giữ tồn kho tạm thời và job tự động dọn đơn hết hạn.</p>
    </div>
    <div class="feature-card">
      <span class="emoji">🌐</span>
      <h4>Hỗ trợ song ngữ</h4>
      <p>Website chính hỗ trợ tiếng Việt mặc định và tiếng Anh qua i18next. Text giao diện nằm trong locale JSON.</p>
    </div>
    <div class="feature-card">
      <span class="emoji">☁️</span>
      <h4>Deploy Cloudflare Tunnel</h4>
      <p>Triển khai bằng Docker Compose và Cloudflare Tunnel để route HTTPS cho frontend/backend.</p>
    </div>
  </div>

  <h2>Liên kết nhanh</h2>
  <div class="table-wrapper">
    <table>
      <thead><tr><th>Khu vực</th><th>Nội dung</th></tr></thead>
      <tbody>
        <tr><td><a href="#" data-page="quickstart">Bắt đầu nhanh</a></td><td>Chạy frontend và backend local trong vài phút</td></tr>
        <tr><td><a href="#" data-page="architecture">Kiến trúc</a></td><td>Tổng quan hệ thống, routing và data flow</td></tr>
        <tr><td><a href="#" data-page="frontend-checkout-flow">Checkout &amp; vận chuyển</a></td><td>Quote phí GHTK, fallback và luồng tạo đơn</td></tr>
        <tr><td><a href="#" data-page="shop-operator-guide">Store Guide</a></td><td>Cách nhập sản phẩm/category trong Pancake để khớp với website</td></tr>
        <tr><td><a href="#" data-page="api-products">Products API</a></td><td>Endpoint catalog và tồn kho</td></tr>
        <tr><td><a href="#" data-page="api-payments">Payments API</a></td><td>Luồng chuyển khoản QR SePay</td></tr>
        <tr><td><a href="#" data-page="deployment-docker">Deployment</a></td><td>Docker, Compose và Cloudflare Tunnel</td></tr>
      </tbody>
    </table>
  </div>

  <div class="page-nav">
    <div></div>
    <a class="page-nav-btn next" data-page="architecture" href="#">
      <span class="label">Tiếp theo →</span>
      <span class="title">Kiến trúc</span>
    </a>
  </div>
</div>
`,

architecture: `
<div class="page">
  <div class="page-header">
    <div class="breadcrumb">Bắt đầu</div>
    <h1>Kiến trúc</h1>
    <p class="subtitle">Tổng quan cách các thành phần của Apricity kết nối với nhau.</p>
  </div>

  <h2>Sơ đồ hệ thống</h2>
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

  <h2>Chiến lược routing</h2>
  <p>Ở production, frontend và backend dùng chung domain. Cloudflare Tunnel route request theo path:</p>
  <div class="table-wrapper">
    <table>
      <thead><tr><th>Request path</th><th>Route tới</th></tr></thead>
      <tbody>
        <tr><td><code>apricity.com.vn/api/*</code></td><td>Backend container Express, port 5000</td></tr>
        <tr><td><code>apricity.com.vn/*</code></td><td>Frontend container Nginx, port 8080</td></tr>
        <tr><td><code>www.apricity.com.vn/*</code></td><td>Cùng rule với domain chính</td></tr>
      </tbody>
    </table>
  </div>

  <h2>Luồng dữ liệu chính</h2>
  <ul>
    <li>Frontend gọi backend để lấy sản phẩm, category, tồn kho và địa chỉ.</li>
    <li>Backend proxy Pancake POS API. Website không có database sản phẩm riêng.</li>
    <li>Khi checkout, frontend validate tồn kho, quote phí vận chuyển, sau đó tạo order trong Pancake.</li>
    <li>Thanh toán QR tạo reservation SePay; webhook xác nhận thanh toán sẽ cập nhật trạng thái đơn.</li>
  </ul>

  <h2>Cấu trúc repository</h2>
  <div class="code-block">
    <div class="code-block-header"><span>structure</span><button class="code-block-copy" onclick="copyCode(this)">Sao chép</button></div>
    <pre>Apricity/
├── Apricity-FrontEnd/     # React storefront
├── Apricity-BackEnd/      # Express API
└── Apricity-GitBook/      # Tài liệu này</pre>
  </div>

  <div class="page-nav">
    <a class="page-nav-btn prev" data-page="introduction" href="#"><span class="label">← Trước</span><span class="title">Giới thiệu</span></a>
    <a class="page-nav-btn next" data-page="quickstart" href="#"><span class="label">Tiếp theo →</span><span class="title">Bắt đầu nhanh</span></a>
  </div>
</div>
`,

quickstart: `
<div class="page">
  <div class="page-header">
    <div class="breadcrumb">Bắt đầu</div>
    <h1>Bắt đầu nhanh</h1>
    <p class="subtitle">Các bước chạy Apricity frontend và backend trên máy local.</p>
  </div>

  <h2>Yêu cầu</h2>
  <ul>
    <li>Node.js và npm</li>
    <li>Tài khoản Pancake POS có API key và Shop ID</li>
    <li>Cấu hình SMTP nếu muốn gửi email đơn hàng</li>
    <li>Cấu hình SePay nếu muốn test thanh toán QR</li>
  </ul>

  <h2>Chạy backend</h2>
  <div class="code-block">
    <div class="code-block-header"><span>bash</span><button class="code-block-copy" onclick="copyCode(this)">Sao chép</button></div>
    <pre>cd Apricity-BackEnd
npm install
cp .env.example .env
npm run dev</pre>
  </div>
  <p>Sau khi chạy, kiểm tra <code>http://localhost:5000/api/pancake-products/products</code> để chắc chắn backend lấy được dữ liệu Pancake.</p>

  <h2>Chạy frontend</h2>
  <div class="code-block">
    <div class="code-block-header"><span>bash</span><button class="code-block-copy" onclick="copyCode(this)">Sao chép</button></div>
    <pre>cd Apricity-FrontEnd
npm install
npm run dev</pre>
  </div>
  <p>Frontend mặc định chạy bằng Vite. Trong production, frontend tự dùng <code>window.location.origin</code> làm API base khi frontend/backend cùng domain.</p>

  <h2>Lệnh thường dùng</h2>
  <div class="table-wrapper">
    <table>
      <thead><tr><th>Lệnh</th><th>Ý nghĩa</th></tr></thead>
      <tbody>
        <tr><td><code>npm run dev</code></td><td>Chạy development server</td></tr>
        <tr><td><code>npm run build</code></td><td>Build production</td></tr>
        <tr><td><code>npm run preview</code></td><td>Preview bản build frontend</td></tr>
      </tbody>
    </table>
  </div>

  <div class="page-nav">
    <a class="page-nav-btn prev" data-page="architecture" href="#"><span class="label">← Trước</span><span class="title">Kiến trúc</span></a>
    <a class="page-nav-btn next" data-page="shop-operator-guide" href="#"><span class="label">Tiếp theo →</span><span class="title">Store Guide</span></a>
  </div>
</div>
`,

"shop-operator-guide": `
<div class="page">
  <div class="page-header">
    <div class="breadcrumb">Bắt đầu › Store Guide</div>
    <h1>Store Guide</h1>
    <p class="subtitle">Hướng dẫn nhập sản phẩm và category trong Pancake POS để website render đúng catalog, collection, chi tiết sản phẩm, biến thể, tồn kho, chất liệu, bảng kích thước và hình ảnh.</p>
  </div>

  <div class="callout callout-warn">
    <div class="callout-title">Nguồn dữ liệu chính</div>
    Pancake POS là nguồn dữ liệu catalog. Website không có database sản phẩm riêng; dữ liệu được đọc qua <code>/api/pancake-products</code>.
  </div>

  <h2>Checklist nhập sản phẩm</h2>
  <div class="table-wrapper">
    <table>
      <thead><tr><th>Trường trong Pancake</th><th>Field trên website</th><th>Quy tắc nhập</th></tr></thead>
      <tbody>
        <tr><td>Tên sản phẩm</td><td><code>product.name</code></td><td>Tên khách hàng nhìn thấy trên card và trang chi tiết.</td></tr>
        <tr><td>Product ID hoặc <code>custom_id</code></td><td>Slug trang chi tiết</td><td>Dùng <code>custom_id</code> khi muốn URL dễ đọc và ổn định.</td></tr>
        <tr><td>Hình sản phẩm</td><td>Card / gallery</td><td>Cần ít nhất một ảnh. Ảnh đầu tiên dùng làm <code>bannerImage</code>; ảnh biến thể có thể đổi theo lựa chọn khách.</td></tr>
        <tr><td>Categories</td><td>Collections / filter</td><td>Gắn sản phẩm vào category đúng. Root category được website xem là collection.</td></tr>
        <tr><td>Variations</td><td>Màu, size, giá, tồn kho</td><td>Dùng đúng field name <code>color</code> / <code>màu</code> và <code>size</code>.</td></tr>
        <tr><td>Retail price</td><td><code>product.price</code></td><td>Website lấy giá hiển thị từ retail price khác 0 đầu tiên trong variation.</td></tr>
        <tr><td>Description / <code>note_product</code></td><td>Mô tả, kích thước, chất liệu</td><td>Dùng format JSON bên dưới. Website tự tách <code>Kích thước:</code> và <code>Chất liệu:</code>.</td></tr>
        <tr><td>Product note / material attribute</td><td><code>product.material</code></td><td>Ưu tiên: product note, attribute <code>material</code>/<code>chất liệu</code>/<code>fabric</code>, rồi dữ liệu material từ Pancake.</td></tr>
      </tbody>
    </table>
  </div>

  <h2>Format mô tả</h2>
  <p>Dán JSON song ngữ vào trường description / <code>note_product</code> của Pancake. Frontend chấp nhận JSON chuẩn và một số dạng JSON-like bị escape khi copy/paste.</p>
  <div class="code-block">
    <div class="code-block-header"><span>Product description template</span><button class="code-block-copy" onclick="copyCode(this)">Sao chép</button></div>
    <pre>{
  "vi": "Túi tote với 2 tầng voan bèo nhún\\nKích thước: 32cm x 20cm\\nChất liệu: Sự kết hợp giữa vải chính kate và vải voan có độ bắt sáng nhẹ với họa tiết hoa ẩn. Bên trong có lớp lót kín đáo, đi kèm cùng một miếng lót đế túi.",
  "en": "Tote bag with 2 layers of ruffled organza\\nSize: 32cm x 20cm\\nMaterial: A combination of kate fabric as the main material and lightly shimmering organza with subtle hidden floral patterns. The inside is fully lined for coverage and comes with a base insert."
}</pre>
  </div>

  <h3>Cách website xử lý mô tả</h3>
  <ul>
    <li>Phần text còn lại hiển thị trong <strong>Mô tả / Description</strong>.</li>
    <li>Dòng bắt đầu bằng <code>Kích thước:</code> hoặc <code>Size:</code> được đưa sang <strong>Bảng kích thước / Size Guide</strong>.</li>
    <li>Dòng bắt đầu bằng <code>Chất liệu:</code> hoặc <code>Material:</code> được đưa sang <strong>Thông tin sản phẩm / Product Information</strong>.</li>
    <li>Nếu không có dòng kích thước, website dùng bảng size mặc định trong code.</li>
  </ul>

  <h2>Quy tắc variation</h2>
  <div class="table-wrapper">
    <table>
      <thead><tr><th>Khái niệm</th><th>Field trong Pancake</th><th>Ví dụ</th><th>Ghi chú</th></tr></thead>
      <tbody>
        <tr><td>Màu</td><td><code>color</code> hoặc <code>màu</code></td><td><code>Pink</code>, <code>#f7cadc</code>, <code>Hồng</code></td><td>Hex color là lựa chọn an toàn nhất.</td></tr>
        <tr><td>Size</td><td><code>size</code></td><td><code>S</code>, <code>M</code>, <code>L</code>, <code>32cm x 20cm</code></td><td>Không dùng <code>kích cỡ</code> nếu code chưa được mở rộng.</td></tr>
        <tr><td>Tồn kho</td><td>Số lượng variation</td><td>Số không âm</td><td>Checkout validate lại với Pancake trước khi tạo đơn.</td></tr>
        <tr><td>Giá</td><td>Retail price</td><td><code>150000</code></td><td>Nhập số VND, website tự format.</td></tr>
      </tbody>
    </table>
  </div>

  <h2>Categories as Collections</h2>
  <p>Trang collection được dựng từ Pancake categories. Backend map mỗi root category thành một storefront collection.</p>
  <ul>
    <li>Root category name trở thành tên collection.</li>
    <li>Child node chứa URL <code>http://</code> hoặc <code>https://</code> trở thành ảnh collection.</li>
    <li>Child node chứa text thường trở thành mô tả collection.</li>
    <li>Sản phẩm gắn vào root hoặc category con đều thuộc collection đó.</li>
  </ul>

  <h2>QA trước khi publish</h2>
  <ol>
    <li>Mở trang chi tiết sản phẩm trên website.</li>
    <li>Kiểm tra card có ảnh, tên, giá và nút add-to-cart đúng.</li>
    <li>Kiểm tra mô tả không hiển thị JSON raw.</li>
    <li>Kiểm tra <strong>Chất liệu / Material</strong> hiển thị đúng.</li>
    <li>Kiểm tra <strong>Bảng kích thước / Size Guide</strong> hiển thị text hoặc bảng đúng.</li>
    <li>Chọn từng màu/size và kiểm tra tồn kho.</li>
  </ol>

  <div class="page-nav">
    <a class="page-nav-btn prev" data-page="quickstart" href="#"><span class="label">← Trước</span><span class="title">Bắt đầu nhanh</span></a>
    <a class="page-nav-btn next" data-page="backend-overview" href="#"><span class="label">Tiếp theo →</span><span class="title">Tổng quan Backend</span></a>
  </div>
</div>
`,

"backend-overview": `
<div class="page">
  <div class="page-header">
    <div class="breadcrumb">Backend</div>
    <h1>Tổng quan Backend</h1>
    <p class="subtitle">Express 5 REST API server cho Apricity, proxy Pancake POS và xử lý thanh toán.</p>
  </div>

  <h2>Tech stack</h2>
  <div class="table-wrapper">
    <table>
      <thead><tr><th>Thành phần</th><th>Vai trò</th></tr></thead>
      <tbody>
        <tr><td>Express 5</td><td>HTTP API server</td></tr>
        <tr><td>Axios</td><td>HTTP client gọi Pancake POS và SePay</td></tr>
        <tr><td>dotenv</td><td>Nạp biến môi trường</td></tr>
        <tr><td>Nodemailer</td><td>Gửi email xác nhận đơn hàng</td></tr>
      </tbody>
    </table>
  </div>

  <h2>Cấu trúc chính</h2>
  <div class="code-block">
    <div class="code-block-header"><span>backend</span><button class="code-block-copy" onclick="copyCode(this)">Sao chép</button></div>
    <pre>server/
├── controllers/      # Product, order, payment, address controllers
├── routes/           # Express routers
├── services/         # Email, inventory, SePay services
└── server.js         # App bootstrap</pre>
  </div>

  <h2>Route mounting</h2>
  <p>Backend mount các router dưới prefix <code>/api</code>. Frontend chỉ gọi backend, backend chịu trách nhiệm gọi Pancake/SePay bằng credential server-side.</p>

  <div class="page-nav">
    <a class="page-nav-btn prev" data-page="shop-operator-guide" href="#"><span class="label">← Trước</span><span class="title">Store Guide</span></a>
    <a class="page-nav-btn next" data-page="api-products" href="#"><span class="label">Tiếp theo →</span><span class="title">Products API</span></a>
  </div>
</div>
`,

"api-products": `
<div class="page">
  <div class="page-header">
    <div class="breadcrumb">Backend › API</div>
    <h1>Products API</h1>
    <p class="subtitle">Endpoint lấy sản phẩm, category và validate tồn kho, toàn bộ proxy từ Pancake POS.</p>
  </div>

  <h2>Endpoint đọc cho frontend</h2>
  <div class="table-wrapper">
    <table>
      <thead><tr><th>Method</th><th>Path</th><th>Ý nghĩa</th></tr></thead>
      <tbody>
        <tr><td><span class="method method-get">GET</span></td><td><code>/api/pancake-products/products</code></td><td>Danh sách sản phẩm đã map cho storefront</td></tr>
        <tr><td><span class="method method-get">GET</span></td><td><code>/api/pancake-products/products/:id</code></td><td>Chi tiết sản phẩm theo Pancake ID hoặc custom ID</td></tr>
        <tr><td><span class="method method-get">GET</span></td><td><code>/api/pancake-products/categories</code></td><td>Danh sách category/collection từ Pancake</td></tr>
        <tr><td><span class="method method-post">POST</span></td><td><code>/api/pancake-products/inventory/check</code></td><td>Validate tồn kho trước checkout</td></tr>
      </tbody>
    </table>
  </div>

  <h2>Mapping quan trọng</h2>
  <ul>
    <li>Tên, ảnh, giá và biến thể được chuẩn hóa để frontend không phụ thuộc trực tiếp vào shape Pancake raw.</li>
    <li>Category root được map thành collection; descendant IDs dùng cho filtering.</li>
    <li>Material ưu tiên product note, attribute material/chất liệu/fabric, rồi material data từ Pancake.</li>
    <li>Inventory check luôn query Pancake realtime để tránh bán vượt tồn.</li>
  </ul>

  <div class="page-nav">
    <a class="page-nav-btn prev" data-page="backend-overview" href="#"><span class="label">← Trước</span><span class="title">Tổng quan Backend</span></a>
    <a class="page-nav-btn next" data-page="api-orders" href="#"><span class="label">Tiếp theo →</span><span class="title">Orders API</span></a>
  </div>
</div>
`,

"api-orders": `
<div class="page">
  <div class="page-header">
    <div class="breadcrumb">Backend › API</div>
    <h1>Orders API</h1>
    <p class="subtitle">Tạo, đọc và quản lý đơn hàng thông qua Pancake POS.</p>
  </div>

  <h2>Endpoint chính</h2>
  <div class="table-wrapper">
    <table>
      <thead><tr><th>Method</th><th>Path</th><th>Ý nghĩa</th></tr></thead>
      <tbody>
        <tr><td><span class="method method-post">POST</span></td><td><code>/api/pancake-orders/orders</code></td><td>Tạo order storefront trong Pancake</td></tr>
        <tr><td><span class="method method-get">GET</span></td><td><code>/api/pancake-orders/orders/:id</code></td><td>Lấy chi tiết order</td></tr>
      </tbody>
    </table>
  </div>

  <h2>Payload checkout</h2>
  <p>Frontend gửi thông tin khách hàng, địa chỉ đã resolve Pancake ID, phí vận chuyển, phương thức thanh toán và cart items. Backend tạo order trong Pancake và có thể arrange shipment qua GHTK.</p>

  <h2>Ghi chú vận chuyển</h2>
  <ul>
    <li>Checkout UI đơn giản hóa thành 2 cấp: Tỉnh/Thành phố và Phường/Xã.</li>
    <li>Frontend vẫn load district metadata ngầm để gửi đúng dữ liệu cho Pancake và GHTK.</li>
    <li>Thêm <code>?debug=1</code> khi cần xem shipping address Pancake trong response debug.</li>
  </ul>

  <div class="page-nav">
    <a class="page-nav-btn prev" data-page="api-products" href="#"><span class="label">← Trước</span><span class="title">Products API</span></a>
    <a class="page-nav-btn next" data-page="api-payments" href="#"><span class="label">Tiếp theo →</span><span class="title">Payments API</span></a>
  </div>
</div>
`,

"api-payments": `
<div class="page">
  <div class="page-header">
    <div class="breadcrumb">Backend › API</div>
    <h1>Payments API</h1>
    <p class="subtitle">Luồng thanh toán QR SePay, reservation đơn hàng và IPN webhook.</p>
  </div>

  <h2>Luồng SePay</h2>
  <ol>
    <li>Frontend tạo payment reservation cho cart hiện tại.</li>
    <li>Backend tạo QR SePay và lưu order tạm trong file store.</li>
    <li>Khách chuyển khoản theo QR.</li>
    <li>SePay gọi webhook IPN về backend.</li>
    <li>Backend xác thực chữ ký, cập nhật trạng thái và tạo/hoàn tất order.</li>
  </ol>

  <h2>Endpoint thường dùng</h2>
  <div class="table-wrapper">
    <table>
      <thead><tr><th>Method</th><th>Path</th><th>Ý nghĩa</th></tr></thead>
      <tbody>
        <tr><td><span class="method method-post">POST</span></td><td><code>/api/sepay/create</code></td><td>Tạo QR/payment reservation</td></tr>
        <tr><td><span class="method method-post">POST</span></td><td><code>/api/sepay/ipn</code></td><td>Webhook SePay gọi về</td></tr>
        <tr><td><span class="method method-get">GET</span></td><td><code>/api/sepay/orders/:id</code></td><td>Kiểm tra trạng thái order tạm</td></tr>
      </tbody>
    </table>
  </div>

  <div class="callout callout-warn">
    <div class="callout-title">Lưu ý bảo mật</div>
    Không expose secret SePay ở frontend. IPN phải verify bằng secret key từ biến môi trường.
  </div>

  <div class="page-nav">
    <a class="page-nav-btn prev" data-page="api-orders" href="#"><span class="label">← Trước</span><span class="title">Orders API</span></a>
    <a class="page-nav-btn next" data-page="api-address" href="#"><span class="label">Tiếp theo →</span><span class="title">Address API</span></a>
  </div>
</div>
`,

"api-address": `
<div class="page">
  <div class="page-header">
    <div class="breadcrumb">Backend › API</div>
    <h1>Address API</h1>
    <p class="subtitle">Lookup tỉnh/thành, quận/huyện và phường/xã cho checkout.</p>
  </div>

  <h2>Endpoint</h2>
  <div class="table-wrapper">
    <table>
      <thead><tr><th>Method</th><th>Path</th><th>Ý nghĩa</th></tr></thead>
      <tbody>
        <tr><td><span class="method method-get">GET</span></td><td><code>/api/pancake-address/provinces</code></td><td>Danh sách tỉnh/thành phố</td></tr>
        <tr><td><span class="method method-get">GET</span></td><td><code>/api/pancake-address/districts/:provinceId</code></td><td>Danh sách quận/huyện theo tỉnh</td></tr>
        <tr><td><span class="method method-get">GET</span></td><td><code>/api/pancake-address/communes/:provinceId</code></td><td>Danh sách phường/xã theo tỉnh</td></tr>
      </tbody>
    </table>
  </div>

  <h2>Cách frontend dùng</h2>
  <p>Checkout chỉ hiển thị selector đơn giản cho khách, nhưng store nội bộ vẫn giữ province/district/commune IDs để tạo order Pancake và quote GHTK chính xác hơn.</p>

  <div class="page-nav">
    <a class="page-nav-btn prev" data-page="api-payments" href="#"><span class="label">← Trước</span><span class="title">Payments API</span></a>
    <a class="page-nav-btn next" data-page="backend-services" href="#"><span class="label">Tiếp theo →</span><span class="title">Services & Jobs</span></a>
  </div>
</div>
`,

"backend-services": `
<div class="page">
  <div class="page-header">
    <div class="breadcrumb">Backend</div>
    <h1>Services & Background Jobs</h1>
    <p class="subtitle">Các service nội bộ và job chạy nền cùng Express server.</p>
  </div>

  <h2>Services</h2>
  <ul>
    <li><code>orderEmailService.js</code>: gửi email xác nhận đơn hàng bằng Nodemailer.</li>
    <li><code>pancakeInventoryService.js</code>: validate tồn kho realtime trước checkout.</li>
    <li><code>sepayOrderStore.js</code>: lưu payment reservation thành file JSON.</li>
    <li><code>sepayService.js</code>: tạo QR, verify IPN và lookup payment SePay.</li>
  </ul>

  <h2>Background jobs</h2>
  <p>Job expiry sweep chạy định kỳ để đánh dấu reservation quá hạn là <code>expired</code> và restore tồn kho Pancake nếu cần. Khoảng thời gian cấu hình bằng <code>SEPAY_ORDER_EXPIRY_SWEEP_INTERVAL_MS</code>.</p>

  <div class="page-nav">
    <a class="page-nav-btn prev" data-page="api-address" href="#"><span class="label">← Trước</span><span class="title">Address API</span></a>
    <a class="page-nav-btn next" data-page="backend-env" href="#"><span class="label">Tiếp theo →</span><span class="title">Biến môi trường</span></a>
  </div>
</div>
`,

"backend-env": `
<div class="page">
  <div class="page-header">
    <div class="breadcrumb">Backend</div>
    <h1>Biến môi trường</h1>
    <p class="subtitle">Các biến cấu hình quan trọng cho backend Apricity.</p>
  </div>

  <h2>Server</h2>
  <div class="table-wrapper">
    <table>
      <thead><tr><th>Biến</th><th>Ý nghĩa</th></tr></thead>
      <tbody>
        <tr><td><code>PORT</code></td><td>Port backend Express</td></tr>
        <tr><td><code>NODE_ENV</code></td><td>Môi trường chạy</td></tr>
        <tr><td><code>FRONTEND_URL</code></td><td>Origin frontend cho CORS/email link</td></tr>
      </tbody>
    </table>
  </div>

  <h2>Pancake POS</h2>
  <div class="table-wrapper">
    <table>
      <thead><tr><th>Biến</th><th>Ý nghĩa</th></tr></thead>
      <tbody>
        <tr><td><code>PANCAKE_API_KEY</code></td><td>API key của Pancake</td></tr>
        <tr><td><code>PANCAKE_SHOP_ID</code></td><td>Shop ID trong Pancake</td></tr>
      </tbody>
    </table>
  </div>

  <h2>SePay / Email</h2>
  <p>Các biến SePay dùng cho QR và webhook; SMTP dùng để gửi email xác nhận đơn hàng. Không commit file env có credential thật.</p>

  <div class="page-nav">
    <a class="page-nav-btn prev" data-page="backend-services" href="#"><span class="label">← Trước</span><span class="title">Services & Jobs</span></a>
    <a class="page-nav-btn next" data-page="frontend-overview" href="#"><span class="label">Tiếp theo →</span><span class="title">Tổng quan Frontend</span></a>
  </div>
</div>
`,

"frontend-overview": `
<div class="page">
  <div class="page-header">
    <div class="breadcrumb">Frontend</div>
    <h1>Tổng quan Frontend</h1>
    <p class="subtitle">React storefront dùng Vite, Tailwind CSS và i18next.</p>
  </div>

  <h2>Tech stack</h2>
  <div class="table-wrapper">
    <table>
      <thead><tr><th>Thành phần</th><th>Vai trò</th></tr></thead>
      <tbody>
        <tr><td>React 19</td><td>UI component model</td></tr>
        <tr><td>Vite 7</td><td>Dev server và build tool</td></tr>
        <tr><td>Tailwind CSS</td><td>Utility styling</td></tr>
        <tr><td>i18next</td><td>Tiếng Việt / tiếng Anh</td></tr>
      </tbody>
    </table>
  </div>

  <h2>Chức năng chính</h2>
  <ul>
    <li>Catalog và collection lấy từ Pancake POS.</li>
    <li>Trang chi tiết sản phẩm có ảnh, biến thể, tồn kho, mô tả, chất liệu và size guide.</li>
    <li>Cart/checkout validate tồn kho và tạo order qua backend.</li>
    <li>UI song ngữ dùng locale JSON trong <code>src/i18n/locales</code>.</li>
  </ul>

  <h2>Cấu trúc source</h2>
  <div class="code-block">
    <div class="code-block-header"><span>frontend</span><button class="code-block-copy" onclick="copyCode(this)">Sao chép</button></div>
    <pre>src/
├── components/
├── pages/
├── services/
├── stores/
├── i18n/
└── data/</pre>
  </div>

  <div class="page-nav">
    <a class="page-nav-btn prev" data-page="backend-env" href="#"><span class="label">← Trước</span><span class="title">Biến môi trường</span></a>
    <a class="page-nav-btn next" data-page="frontend-routes" href="#"><span class="label">Tiếp theo →</span><span class="title">Routes Frontend</span></a>
  </div>
</div>
`,

"frontend-routes": `
<div class="page">
  <div class="page-header">
    <div class="breadcrumb">Frontend</div>
    <h1>Routes Frontend</h1>
    <p class="subtitle">Các route chính của storefront và component xử lý.</p>
  </div>

  <div class="table-wrapper">
    <table>
      <thead><tr><th>Route</th><th>Page</th><th>Ý nghĩa</th></tr></thead>
      <tbody>
        <tr><td><code>/</code></td><td>Home</td><td>Trang chủ, featured products và collection preview</td></tr>
        <tr><td><code>/collections</code></td><td>Collection</td><td>Danh sách collection/category từ Pancake</td></tr>
        <tr><td><code>/products/:id</code></td><td>Detail</td><td>Chi tiết sản phẩm, variants, material, size guide</td></tr>
        <tr><td><code>/cart</code></td><td>Cart</td><td>Giỏ hàng và chỉnh số lượng</td></tr>
        <tr><td><code>/checkout</code></td><td>Checkout</td><td>Thông tin khách, vận chuyển, thanh toán</td></tr>
        <tr><td><code>/policies</code></td><td>Policies</td><td>Chính sách vận chuyển, đổi hàng, bảo mật</td></tr>
      </tbody>
    </table>
  </div>

  <p>Routes dùng React Router. Các page lazy-load để giảm bundle initial và giữ trải nghiệm mượt hơn.</p>

  <div class="page-nav">
    <a class="page-nav-btn prev" data-page="frontend-overview" href="#"><span class="label">← Trước</span><span class="title">Tổng quan Frontend</span></a>
    <a class="page-nav-btn next" data-page="frontend-checkout-flow" href="#"><span class="label">Tiếp theo →</span><span class="title">Checkout & vận chuyển</span></a>
  </div>
</div>
`,

"frontend-checkout-flow": `
<div class="page">
  <div class="page-header">
    <div class="breadcrumb">Frontend</div>
    <h1>Checkout & vận chuyển</h1>
    <p class="subtitle">Luồng Pancake address lookup, quote phí GHTK và submit order từ checkout.</p>
  </div>

  <h2>State checkout</h2>
  <p>Form hiển thị đơn giản, nhưng store giữ thêm province/district/commune IDs để gửi đúng shape cho Pancake và GHTK.</p>

  <h2>Quote phí vận chuyển</h2>
  <ol>
    <li>Khách chọn tỉnh/thành và phường/xã.</li>
    <li>Frontend load district metadata từ Pancake ở background.</li>
    <li>Frontend gọi <code>GET /api/shipping/fee</code> với province, district, ward, address, weight và value.</li>
    <li>Nếu quote lỗi hoặc endpoint chưa sẵn sàng, checkout dùng fallback fee.</li>
  </ol>

  <h2>Submit order</h2>
  <ul>
    <li>Trước khi tạo order, frontend gọi inventory check.</li>
    <li>COD submit trực tiếp tới <code>/api/pancake-orders/orders</code>.</li>
    <li>Bank transfer tạo payment reservation và QR trước.</li>
    <li>Backend arrange shipment qua GHTK sau khi tạo order thành công.</li>
  </ul>

  <div class="page-nav">
    <a class="page-nav-btn prev" data-page="frontend-routes" href="#"><span class="label">← Trước</span><span class="title">Routes Frontend</span></a>
    <a class="page-nav-btn next" data-page="frontend-components" href="#"><span class="label">Tiếp theo →</span><span class="title">Components</span></a>
  </div>
</div>
`,

"frontend-components": `
<div class="page">
  <div class="page-header">
    <div class="breadcrumb">Frontend</div>
    <h1>Components</h1>
    <p class="subtitle">Các component UI chính trong storefront.</p>
  </div>

  <div class="table-wrapper">
    <table>
      <thead><tr><th>Component</th><th>Vai trò</th></tr></thead>
      <tbody>
        <tr><td><strong>Header</strong></td><td>Navigation, logo, menu, language switcher và cart icon</td></tr>
        <tr><td><strong>Footer</strong></td><td>Thông tin liên hệ, link chính sách và social</td></tr>
        <tr><td><strong>ProductCard</strong></td><td>Card sản phẩm dùng ở catalog và section featured</td></tr>
        <tr><td><strong>checkout-section</strong></td><td>Form checkout, address lookup, shipping fee và payment branching</td></tr>
        <tr><td><strong>AppAlert</strong></td><td>Alert/toast global qua context API</td></tr>
      </tbody>
    </table>
  </div>

  <p>Ưu tiên dùng component shared để Collection, Home và các list khác giữ cùng style card, tên và giá.</p>

  <div class="page-nav">
    <a class="page-nav-btn prev" data-page="frontend-checkout-flow" href="#"><span class="label">← Trước</span><span class="title">Checkout & vận chuyển</span></a>
    <a class="page-nav-btn next" data-page="frontend-state" href="#"><span class="label">Tiếp theo →</span><span class="title">State & Logic</span></a>
  </div>
</div>
`,

"frontend-state": `
<div class="page">
  <div class="page-header">
    <div class="breadcrumb">Frontend</div>
    <h1>State & Logic</h1>
    <p class="subtitle">Client state, API service và logic checkout/cart.</p>
  </div>

  <h2>API client</h2>
  <p>Frontend gọi backend qua service layer, ví dụ:</p>
  <div class="table-wrapper">
    <table>
      <thead><tr><th>Function</th><th>Endpoint</th></tr></thead>
      <tbody>
        <tr><td><code>getPancakeProducts()</code></td><td><code>GET /api/pancake-products/products</code></td></tr>
        <tr><td><code>getPancakeProductById(id)</code></td><td><code>GET /api/pancake-products/products/:id</code></td></tr>
        <tr><td><code>checkPancakeInventory(items)</code></td><td><code>POST /api/pancake-products/inventory/check</code></td></tr>
        <tr><td><code>createPancakeOrder(data)</code></td><td><code>POST /api/pancake-orders/orders</code></td></tr>
      </tbody>
    </table>
  </div>

  <h2>Cart store</h2>
  <ul>
    <li>Lưu sản phẩm, variation, số lượng và giá.</li>
    <li>Reconcile cart khi tồn kho thay đổi.</li>
    <li>Validate trước checkout để tránh oversell.</li>
  </ul>

  <h2>Localized content</h2>
  <p><code>lib/localized-content.ts</code> resolve nội dung đa ngôn ngữ từ Pancake, bao gồm mô tả sản phẩm dạng JSON có <code>vi</code> và <code>en</code>.</p>

  <div class="page-nav">
    <a class="page-nav-btn prev" data-page="frontend-components" href="#"><span class="label">← Trước</span><span class="title">Components</span></a>
    <a class="page-nav-btn next" data-page="frontend-i18n" href="#"><span class="label">Tiếp theo →</span><span class="title">Đa ngôn ngữ</span></a>
  </div>
</div>
`,

"frontend-i18n": `
<div class="page">
  <div class="page-header">
    <div class="breadcrumb">Frontend</div>
    <h1>Đa ngôn ngữ</h1>
    <p class="subtitle">Website dùng i18next cho tiếng Việt mặc định và tiếng Anh.</p>
  </div>

  <h2>Cấu trúc locale</h2>
  <div class="code-block">
    <div class="code-block-header"><span>i18n</span><button class="code-block-copy" onclick="copyCode(this)">Sao chép</button></div>
    <pre>src/i18n/
├── config.js
├── language.js
└── locales/
    ├── en.json
    └── vi.json</pre>
  </div>

  <h2>Quy tắc thêm text mới</h2>
  <ul>
    <li>Không hard-code text user-facing trong component nếu text cần dịch.</li>
    <li>Thêm key vào cả <code>en.json</code> và <code>vi.json</code>.</li>
    <li>Dùng <code>useTranslation()</code> trong component React.</li>
    <li>Backend error message phổ biến được map sang translation key để UI hiển thị đúng ngôn ngữ.</li>
  </ul>

  <h2>Mô tả sản phẩm song ngữ</h2>
  <p>Product description từ Pancake có thể là JSON chứa <code>vi</code> và <code>en</code>. Frontend sẽ chọn field theo ngôn ngữ hiện tại.</p>

  <div class="page-nav">
    <a class="page-nav-btn prev" data-page="frontend-state" href="#"><span class="label">← Trước</span><span class="title">State & Logic</span></a>
    <a class="page-nav-btn next" data-page="deployment-docker" href="#"><span class="label">Tiếp theo →</span><span class="title">Docker & Compose</span></a>
  </div>
</div>
`,

"deployment-docker": `
<div class="page">
  <div class="page-header">
    <div class="breadcrumb">Deployment</div>
    <h1>Docker & Compose</h1>
    <p class="subtitle">Triển khai frontend, backend và cloudflared bằng container.</p>
  </div>

  <h2>Container riêng lẻ</h2>
  <ul>
    <li>Frontend build thành static asset và serve bằng Nginx.</li>
    <li>Backend chạy Node.js Express API.</li>
    <li>Cloudflared route traffic HTTPS từ Cloudflare về container local/VPS.</li>
  </ul>

  <h2>Docker Compose</h2>
  <div class="code-block">
    <div class="code-block-header"><span>bash</span><button class="code-block-copy" onclick="copyCode(this)">Sao chép</button></div>
    <pre>docker compose -f docker-compose.tunnel.yml up -d --build</pre>
  </div>

  <h2>Kiểm tra cấu hình</h2>
  <div class="code-block">
    <div class="code-block-header"><span>bash</span><button class="code-block-copy" onclick="copyCode(this)">Sao chép</button></div>
    <pre>docker compose -f docker-compose.tunnel.yml config</pre>
  </div>

  <div class="callout callout-warn">
    <div class="callout-title">Không commit secret</div>
    Không commit file env production, tunnel credential hoặc API key thật vào Git.
  </div>

  <div class="page-nav">
    <a class="page-nav-btn prev" data-page="frontend-i18n" href="#"><span class="label">← Trước</span><span class="title">Đa ngôn ngữ</span></a>
    <a class="page-nav-btn next" data-page="deployment-cloudflare" href="#"><span class="label">Tiếp theo →</span><span class="title">Cloudflare Tunnel</span></a>
  </div>
</div>
`,

"deployment-cloudflare": `
<div class="page">
  <div class="page-header">
    <div class="breadcrumb">Deployment</div>
    <h1>Cloudflare Tunnel</h1>
    <p class="subtitle">Thiết lập Cloudflare Tunnel để expose Apricity qua HTTPS mà không cần mở port trực tiếp.</p>
  </div>

  <h2>1. Chuẩn bị domain</h2>
  <ol>
    <li>Thêm domain vào Cloudflare.</li>
    <li>Đổi nameserver ở registrar sang nameserver của Cloudflare.</li>
    <li>Chờ zone chuyển sang trạng thái <strong>Active</strong>.</li>
  </ol>

  <h2>2. Tạo tunnel</h2>
  <div class="code-block">
    <div class="code-block-header"><span>bash</span><button class="code-block-copy" onclick="copyCode(this)">Sao chép</button></div>
    <pre>cloudflared tunnel login
cloudflared tunnel create apricity-production
cloudflared tunnel route dns apricity-production apricity.com.vn
cloudflared tunnel route dns apricity-production www.apricity.com.vn</pre>
  </div>

  <h2>3. Cấu hình tunnel</h2>
  <p>Copy credential JSON vào thư mục deploy và cập nhật <code>deploy/cloudflared/config.yml</code> với tunnel UUID và path credential.</p>

  <h2>4. Validate và deploy</h2>
  <div class="code-block">
    <div class="code-block-header"><span>bash</span><button class="code-block-copy" onclick="copyCode(this)">Sao chép</button></div>
    <pre>docker run --rm \\
  -v "$PWD/deploy/cloudflared:/etc/cloudflared:ro" \\
  cloudflare/cloudflared:latest \\
  tunnel --config /etc/cloudflared/config.yml ingress validate

docker compose -f docker-compose.tunnel.yml up -d --build</pre>
  </div>

  <h2>Lỗi thường gặp</h2>
  <div class="table-wrapper">
    <table>
      <thead><tr><th>Vấn đề</th><th>Nguyên nhân thường gặp</th></tr></thead>
      <tbody>
        <tr><td>Không publish được hostname</td><td>Domain chưa trỏ nameserver về Cloudflare</td></tr>
        <tr><td>Backend boot error</td><td>Thiếu <code>deploy/env/backend.env</code> trên server</td></tr>
        <tr><td>Cloudflared không start</td><td>Thiếu credential <code>deploy/cloudflared/*.json</code></td></tr>
        <tr><td>Visitor thấy error 1016</td><td>DNS có record nhưng cloudflared container đang down</td></tr>
        <tr><td>Product API lỗi</td><td>Thiếu <code>PANCAKE_SHOP_ID</code> hoặc <code>PANCAKE_API_KEY</code></td></tr>
      </tbody>
    </table>
  </div>

  <div class="page-nav">
    <a class="page-nav-btn prev" data-page="deployment-docker" href="#"><span class="label">← Trước</span><span class="title">Docker & Compose</span></a>
    <div></div>
  </div>
</div>
`
};

const PAGES_BY_LANG = {
  en: PAGES,
  vi: PAGES_VI
};
