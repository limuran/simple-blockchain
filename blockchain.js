// 简化区块链实现
const crypto = require('crypto');

// 1. 区块类
class Block {
    constructor(timestamp, transactions, previousHash = '') {
        this.timestamp = timestamp;
        this.transactions = transactions;
        this.previousHash = previousHash;
        this.nonce = 0;
        this.hash = this.calculateHash();
    }

    calculateHash() {
        return crypto.createHash('sha256')
            .update(this.previousHash + this.timestamp + JSON.stringify(this.transactions) + this.nonce)
            .digest('hex');
    }

    // 挖矿 - 工作量证明
    mineBlock(difficulty) {
        const target = Array(difficulty + 1).join("0");
        
        while (this.hash.substring(0, difficulty) !== target) {
            this.nonce++;
            this.hash = this.calculateHash();
        }
        
        console.log(`挖矿成功! Hash: ${this.hash}`);
    }
}

// 2. 交易类
class Transaction {
    constructor(fromAddress, toAddress, amount) {
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;
        this.timestamp = Date.now();
    }
}

// 3. 区块链类
class SimpleBlockchain {
    constructor() {
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 2; // 挖矿难度
        this.pendingTransactions = [];
        this.miningReward = 100; // 挖矿奖励
    }

    // 创世区块
    createGenesisBlock() {
        return new Block(Date.now(), [], "0");
    }

    // 获取最新区块
    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    // 挖矿 - 处理待处理交易
    minePendingTransactions(miningRewardAddress) {
        // 添加挖矿奖励交易
        const rewardTransaction = new Transaction(null, miningRewardAddress, this.miningReward);
        this.pendingTransactions.push(rewardTransaction);

        // 创建新区块
        let block = new Block(
            Date.now(),
            this.pendingTransactions,
            this.getLatestBlock().hash
        );
        
        // 挖矿
        block.mineBlock(this.difficulty);

        console.log('区块挖矿成功!');
        this.chain.push(block);

        // 清空待处理交易
        this.pendingTransactions = [];
    }

    // 创建交易
    createTransaction(transaction) {
        // 简单验证
        if (transaction.fromAddress !== null) {
            const balance = this.getBalance(transaction.fromAddress);
            if (balance < transaction.amount) {
                throw new Error('余额不足!');
            }
        }
        
        this.pendingTransactions.push(transaction);
    }

    // 获取地址余额
    getBalance(address) {
        let balance = 0;

        for (const block of this.chain) {
            for (const trans of block.transactions) {
                if (trans.fromAddress === address) {
                    balance -= trans.amount;
                }
                if (trans.toAddress === address) {
                    balance += trans.amount;
                }
            }
        }

        return balance;
    }

    // 验证区块链
    isChainValid() {
        for (let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

            if (currentBlock.hash !== currentBlock.calculateHash()) {
                return false;
            }

            if (currentBlock.previousHash !== previousBlock.hash) {
                return false;
            }
        }

        return true;
    }

    // 获取区块链信息
    getBlockchainInfo() {
        return {
            height: this.chain.length,
            difficulty: this.difficulty,
            pendingTransactions: this.pendingTransactions.length,
            isValid: this.isChainValid()
        };
    }

    // 根据高度获取区块
    getBlock(height) {
        if (height >= 0 && height < this.chain.length) {
            return this.chain[height];
        }
        return null;
    }
}

// 4. 用户钱包类
class Wallet {
    constructor() {
        this.privateKey = crypto.randomBytes(32).toString('hex');
        this.publicKey = crypto.createHash('sha256').update(this.privateKey).digest('hex');
        this.address = this.publicKey.substring(0, 40); // 简化地址
    }

    // 获取钱包信息
    getWalletInfo() {
        return {
            address: this.address,
            privateKey: this.privateKey,
            publicKey: this.publicKey
        };
    }
}

// 5. 简单的区块链浏览器服务
const express = require('express');
const app = express();
app.use(express.json());

// 初始化区块链
const myCoin = new SimpleBlockchain();
const wallets = new Map(); // 存储用户钱包

// API路由

// 创建新用户
app.post('/api/user/create', (req, res) => {
    const wallet = new Wallet();
    const userId = 'user_' + Date.now();
    wallets.set(userId, wallet);
    
    res.json({
        success: true,
        userId: userId,
        address: wallet.address,
        message: '用户创建成功'
    });
});

// 获取用户信息
app.get('/api/user/:userId', (req, res) => {
    const wallet = wallets.get(req.params.userId);
    if (!wallet) {
        return res.status(404).json({ error: '用户不存在' });
    }
    
    res.json({
        userId: req.params.userId,
        address: wallet.address,
        balance: myCoin.getBalance(wallet.address)
    });
});

// 创建交易
app.post('/api/transaction', (req, res) => {
    try {
        const { fromUserId, toAddress, amount } = req.body;
        
        const fromWallet = wallets.get(fromUserId);
        if (!fromWallet) {
            return res.status(404).json({ error: '发送方用户不存在' });
        }

        const transaction = new Transaction(fromWallet.address, toAddress, amount);
        myCoin.createTransaction(transaction);
        
        res.json({
            success: true,
            message: '交易创建成功，等待矿工确认',
            transaction: transaction
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// 挖矿
app.post('/api/mine', (req, res) => {
    const { minerUserId } = req.body;
    
    const minerWallet = wallets.get(minerUserId);
    if (!minerWallet) {
        return res.status(404).json({ error: '矿工用户不存在' });
    }

    try {
        myCoin.minePendingTransactions(minerWallet.address);
        
        res.json({
            success: true,
            message: '挖矿成功!',
            reward: myCoin.miningReward,
            newBalance: myCoin.getBalance(minerWallet.address)
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 获取区块链信息
app.get('/api/blockchain/info', (req, res) => {
    res.json(myCoin.getBlockchainInfo());
});

// 获取指定区块
app.get('/api/block/:height', (req, res) => {
    const height = parseInt(req.params.height);
    const block = myCoin.getBlock(height);
    
    if (!block) {
        return res.status(404).json({ error: '区块不存在' });
    }
    
    res.json(block);
});

// 获取所有区块
app.get('/api/blocks', (req, res) => {
    res.json({
        blocks: myCoin.chain,
        height: myCoin.chain.length
    });
});

// 获取地址余额
app.get('/api/balance/:address', (req, res) => {
    const balance = myCoin.getBalance(req.params.address);
    res.json({
        address: req.params.address,
        balance: balance
    });
});

// 静态文件服务 - 区块链浏览器前端
app.use(express.static('public'));

// 启动服务器
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`区块链服务器运行在端口 ${PORT}`);
    console.log(`区块链浏览器: http://localhost:${PORT}`);
    console.log('API接口:');
    console.log('- POST /api/user/create - 创建用户');
    console.log('- GET /api/user/:userId - 获取用户信息');
    console.log('- POST /api/transaction - 创建交易');
    console.log('- POST /api/mine - 挖矿');
    console.log('- GET /api/blockchain/info - 区块链信息');
    console.log('- GET /api/block/:height - 获取指定区块');
    console.log('- GET /api/blocks - 获取所有区块');
    console.log('- GET /api/balance/:address - 获取地址余额');
});

// 导出模块供测试使用
module.exports = { SimpleBlockchain, Block, Transaction, Wallet };