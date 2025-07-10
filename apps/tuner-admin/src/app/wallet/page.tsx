'use client';

import WalletTabs from './components/WalletTabs';
import ContractManager from './components/ContractManager';

export default function WalletPage() {
    return (
        <main>
            <div className="w-full font-bold text-black text-2xl py-3 ">
                Admin Wallet Dashboard
            </div>
            <div className="p-6">
                <WalletTabs />
                <ContractManager />
            </div>
        </main>
    );
}
