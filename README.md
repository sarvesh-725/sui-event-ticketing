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
### ✅ Key Features

#### 👩‍💼 For Event Organizers
- Create permanent on-chain event objects
- Full control and ownership of event data
- Real-time ticket sales tracking from the blockchain

#### 🧑‍🤝‍🧑 For Event Attendees
- Browse all live events directly from the Sui blockchain
- Secure, on-chain ticket purchases with availability checks
- Tickets are **soulbound** and permanently tied to the buyer’s wallet
- View owned tickets as non-transferable proof of entry


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
---

## 🚀 Usage

### 🔗 Connect Wallet  
Click the **"Connect Wallet"** button to link your Sui wallet.  
💡 Make sure you have the **Slush Wallet browser extension** installed to manage your Sui accounts.


### 👩‍💼 Organizer Workflow  
1. Create a new event by filling in event details and publishing it on-chain.  
2. Manage your event data and monitor ticket sales in real-time directly from the blockchain.  


### 🧑‍🤝‍🧑 Attendee (Buyer) Workflow  
1. Browse live events dynamically fetched from the Sui network.  
2. Select an event and purchase a ticket by initiating a secure on-chain transaction.  
3. The system verifies ticket availability and mints a **soulbound Ticket object**.  
4. View your owned tickets in your Sui wallet as permanent proof of ownership (non-transferable).

