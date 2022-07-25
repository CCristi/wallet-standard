import { initialize, WalletAccount, WalletsWindow } from '@solana/wallet-standard';
import { EthereumWallet } from './ethereumWallet';
import { MultiChainWallet } from './multiChainWallet';
import { SolanaWallet } from './solanaWallet';

declare const window: WalletsWindow<WalletAccount>;

(function () {
    // The dapp hasn't loaded yet, so any wallet to load creates a queue or uses one if found
    window.wallets = window.wallets || [];

    // The first wallet to load registers itself on the window
    window.wallets.push({ method: 'register', wallets: [new SolanaWallet()] });

    // The second wallet to load registers itself on the window
    window.wallets.push({ method: 'register', wallets: [new EthereumWallet()] });

    // ... time passes, the dapp loads ...

    // The dapp replaces the queue with a push function, and runs any queued commands
    initialize();

    // The dapp adds an event listener for new wallets that get registered after this point
    window.wallets.push({
        method: 'on',
        event: 'register',
        listener(...wallets) {
            // The dapp can add new wallets to its own state context as they are registered
        },
        callback(unsubscribe) {
            // The dapp will receive the unsubscribe function when this runs, which it can later use to remove the listener
        },
    });

    // The dapp gets all the wallets that have been registered so far
    window.wallets.push({
        method: 'get',
        callback(...wallets) {
            // The dapp will receive all the registered wallets when this runs, and can add them to its own state context
        },
    });

    // ... time passes, other wallets load ...

    // The third wallet to load registers itself on the window
    window.wallets.push({ method: 'register', wallets: [new MultiChainWallet()] });

    // The dapp has an event listener now, so it sees new wallets immediately and doesn't need to poll or list them again
    // This also works if the dapp loads before any wallets (it will initialize the push function, see no wallets on the first call, then see wallets as they load)
})();