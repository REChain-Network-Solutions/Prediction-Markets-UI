# 📊 Prediction Markets UI – Wiki

Welcome to the Wiki for the **Prediction Markets UI**, a modern frontend interface for decentralized prediction markets built by REChain Network Solutions.

---

## 🔍 Overview

**Prediction-Markets-UI** is the web-based frontend for interacting with the REChain Prediction Markets Protocol. It allows users to:
- Browse available markets
- Create and resolve predictions
- Place and manage bets
- Track market performance

---

## 📦 Repository Structure

```plaintext
Prediction-Markets-UI/
├── public/                 # Static files
├── src/                    # Main application code
│   ├── components/         # React components
│   ├── hooks/              # Custom React hooks
│   ├── pages/              # Next.js pages
│   ├── utils/              # Utility functions
│   └── services/           # API & blockchain interaction
├── .env.example            # Environment variables sample
├── package.json            # Dependencies and scripts
└── README.md               # Project introduction
```

---

## 🚀 Getting Started

### ✅ Prerequisites
- Node.js v18+
- Yarn or npm
- Metamask or compatible wallet
- REChain Prediction Markets backend running

### 🛠️ Installation

```bash
git clone https://github.com/REChain-Network-Solutions/Prediction-Markets-UI.git
cd Prediction-Markets-UI
cp .env.example .env.local
npm install
npm run dev
```

Visit `http://localhost:3000` to start using the UI.

---

## ⚙️ Configuration

Update the `.env.local` file with:

```env
NEXT_PUBLIC_MARKET_API=https://your-backend-api-url
NEXT_PUBLIC_CHAIN_ID=your_chain_id
NEXT_PUBLIC_RPC_URL=https://your_rpc_url
```

---

## 🧩 Core Features

| Feature | Description |
|--------|-------------|
| Market List | Displays all available prediction markets |
| Market Detail | Detailed view with bet options |
| Wallet Connect | Connect wallet via MetaMask |
| Create Market | Launch a new prediction market |
| Resolve Market | Close and settle market outcomes |
| Transaction History | View past user activity |

---

## 🛡️ Security Practices

- Input validation
- Wallet permission checks
- HTTPS API and RPC endpoints recommended
- Rate limiting for backend endpoints (handled server-side)

---

## 🧪 Testing

Basic testing uses:

```bash
npm run test
```

End-to-end testing can be integrated with Playwright or Cypress.

---

## 🤝 Contributing

1. Fork the repository
2. Create a new branch
3. Submit a pull request with detailed changes

---

## 📜 License

MIT – See [LICENSE.md](LICENSE.md) for full details.

---

## 📞 Contact

- Project Lead: [REChain Network Solutions](https://github.com/REChain-Network-Solutions)
- Telegram: [@rechainofficial](https://t.me/rechainofficial)

---