# Sui Event Ticketing dApp

A decentralized event ticketing application built on the Sui blockchain using Move smart contracts and a React frontend.

---

## 📁 Project Structure

```plaintext
sui-event-ticketing/
├─ move/event_ticketing/            # Move smart contract package
│  ├─ Move.toml                     
│  ├─ sources/
│  │  └─ event_ticketing.move        # Main Move module
│  └─ tests/
│     └─ event_ticketing_tests.move  
│
├─ frontend/                         # React frontend application
│  ├─ src/
│  │  ├─ main.jsx                   
│  │  ├─ App.tsx                     
│  │  ├─ constants.ts                
│  │  ├─ networkConfig.ts            
│  │  ├─ hooks/
│  │  │  └─ useSui.ts                 
│  │  ├─ components/
│  │  │  ├─ ConnectWallet.tsx         
│  │  │  ├─ OrganizerPanel.tsx        
│  │  │  └─ BuyerPanel.tsx            
│  │  └─ utils/
│  │     └─ suiHelpers.ts            
│  └─ package.json
│
└─ README.md
```
# ✅ Features

## 🎫 Organizer Tab
- **Create new events** with details:
  - Name
  - Description
  - Date
  - Location
  - Image
  - Max tickets
- **View and manage** your created events
- **Track ticket sales** progress in real time

---

## 🛒 Buyer Tab
- Browse all available events
- Purchase tickets for events
- View owned tickets
- Real-time ticket availability updates

---

# ⚙️ Setup Instructions

### 1️⃣ Contract Setup

```bash
# Navigate to contract directory
cd move/event_ticketing

# Build the contract
sui move build

# Check active env
sui client active-env

# Import your private key
sui keytool import <your-private-key> ed25519

# Switch to your address. The <address-name> should be a complete name with a hyphen separating two words, e.g. modest-jet.
sui client switch --address <address-name>

# Publish contract to Sui testnet
sui client publish --gas-budget 20000000
```

### 2️⃣ Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Build frontend
npm run build

# Start development server
npm run dev
```

## 🚀 Usage

### 🔗 Connect Wallet  
Click the **"Connect Wallet"** button to link your Sui wallet.
💡 Make sure you have the **Slush Wallet browser extension** installed to manage your Sui accounts.

---

### 👩‍💼 Organizer Actions  
In the **Organizer** tab:
- Create and manage events  
- Track ticket sales in real time

---

### 🧑‍🤝‍🧑 Buyer Actions  
In the **Buyer** tab:
- Browse available events  
- Purchase tickets  
- View owned tickets

