# FolioChef — Cooking with Commis Chefs

Trình quản lý terminal trên web, được tái hiện như một căn bếp chuyên nghiệp.  
**Bếp trưởng** (bạn) chỉ huy tại pass. Các **Phụ bếp** (AI của bạn) châm lửa terminal, xử lý dữ liệu và giữ mọi station luôn nóng.

## Căn bếp

- **Đa station trên pass** — Mỗi tab terminal là một station. Bật bao nhiêu tuỳ ý.
- **Bếp lửa PTY thật** — Shell process thực, nấu nướng real-time qua WebSocket.
- **Gia vị riêng** — Chọn mood (Expedition 33, Dracula, Nord, Solarized Dark) hoặc tự pha màu nền.
- **Mise en place** — Cỡ chữ, font chữ — chọn dụng cụ vừa tay cho từng station.
- **Tủ mát** — Tab và lịch sử output được lưu đĩa. Đi đâu quay lại vẫn còn nguyên.
- **Nhóm lửa / Dọn bàn** — Khởi động lại process ì ạch hoặc xoá output không cần đóng station.
- **Order riêng** — Launch station với lệnh và thư mục tuỳ chỉnh.
- **API mở** — Thực đơn REST đầy đủ để quản lý mọi ticket.

## Đội bếp

| Station | Công cụ |
|---------|---------|
| Pass (Frontend) | React 19, Vite, Tailwind CSS, xterm.js, Zustand |
| Bếp (Backend) | Express 5, ws, node-pty |
| Kho (Persistence) | File JSON trên đĩa (`data/`) |

## Vào bếp

### Mài dao

- **Node.js** >= 18
- **npm** >= 9

### Chuẩn bị nguyên liệu

```bash
# Nhập kho (server deps)
npm install

# Dựng pass (client deps)
cd client && npm install && cd ..
```

### Nấu menu

```bash
npm run build
```

### Phục vụ (Phát triển)

```bash
npm run dev
```

Chạy song song bếp (server, cổng 3001) và pass (Vite dev server, cổng 5173). Pass proxy `/api` và `/ws` thẳng tới bếp.

### Phục vụ (Production)

```bash
npm run build
npm start
```

Mở `http://localhost:3001` — giờ service đã lên.

## Sơ đồ bếp

```
├── client/                    # Pass (React frontend)
│   ├── src/
│   │   ├── components/
│   │   │   ├── Terminal.jsx       # Bếp lửa — xterm.js
│   │   │   ├── Sidebar.jsx        # Danh sách station
│   │   │   ├── SettingsPanel.jsx  # Kệ gia vị
│   │   │   ├── NewTabDialog.jsx   # Mở station mới
│   │   │   └── Footer.jsx         # Trạng thái service
│   │   ├── App.jsx                # Bảng điều khiển bếp trưởng
│   │   ├── store.js               # Vòng quay order
│   │   └── index.css              # Nội quy bếp
│   └── ...
├── server/                    # Bếp (Express + WebSocket)
│   ├── index.js               # Station của bếp trưởng
│   ├── restRouter.js          # Phiếu order (REST)
│   ├── sessionManager.js      # Rotation station
│   ├── ptyManager.js          # Bếp ga (PTY)
│   └── historyStore.js        # Sổ nhật ký
├── data/                      # Tủ mát (dữ liệu runtime)
└── package.json               # Công thức nấu ăn
```

## Thực đơn (API)

| Method | Món | Mô tả |
|--------|-----|-------|
| GET | `/api/tabs` | Danh sách mọi station trên pass |
| POST | `/api/tabs` | Mở station mới |
| DELETE | `/api/tabs/:id` | Đóng station |
| PATCH | `/api/tabs/:id` | Đổi tên hoặc sửa order |
| GET | `/api/history/:id` | Xem nhật ký station |
| DELETE | `/api/history/:id` | Xoá bảng station |
| POST | `/api/tabs/:id/restart` | Nhóm lửa lại |
| WS | `/ws?tabId=&cols=&rows=&command=&cwd=` | Kết nối trực tiếp tới bếp |

## Giấy phép

ISC — giờ quay lại pass đi Bếp trưởng.
