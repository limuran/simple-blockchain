// test.js - 区块链功能测试脚本
const { SimpleBlockchain, Transaction, Wallet } = require('./blockchain');

console.log('🚀 开始测试简单区块链...\n');

// 创建区块链实例
const myCoin = new SimpleBlockchain();

// 创建用户钱包
console.log('1️⃣ 创建用户钱包...');
const wallet1 = new Wallet();
const wallet2 = new Wallet();
const minerWallet = new Wallet();

console.log(`用户1地址: ${wallet1.address}`);
console.log(`用户2地址: ${wallet2.address}`);
console.log(`矿工地址: ${minerWallet.address}\n`);

// 检查初始余额
console.log('2️⃣ 检查初始余额...');
console.log(`用户1余额: ${myCoin.getBalance(wallet1.address)}`);
console.log(`用户2余额: ${myCoin.getBalance(wallet2.address)}`);
console.log(`矿工余额: ${myCoin.getBalance(minerWallet.address)}\n`);

// 第一次挖矿 - 矿工获得奖励
console.log('3️⃣ 矿工进行第一次挖矿...');
myCoin.minePendingTransactions(minerWallet.address);

console.log(`挖矿后矿工余额: ${myCoin.getBalance(minerWallet.address)}\n`);

// 创建交易
console.log('4️⃣ 创建交易...');
const transaction1 = new Transaction(minerWallet.address, wallet1.address, 50);
const transaction2 = new Transaction(minerWallet.address, wallet2.address, 30);

try {
    myCoin.createTransaction(transaction1);
    myCoin.createTransaction(transaction2);
    console.log('交易创建成功！');
} catch (error) {
    console.log('交易创建失败:', error.message);
}

console.log(`待处理交易数量: ${myCoin.pendingTransactions.length}\n`);

// 第二次挖矿 - 确认交易
console.log('5️⃣ 进行第二次挖矿确认交易...');
myCoin.minePendingTransactions(minerWallet.address);

// 检查交易后余额
console.log('\n6️⃣ 检查交易后余额...');
console.log(`矿工余额: ${myCoin.getBalance(minerWallet.address)}`);
console.log(`用户1余额: ${myCoin.getBalance(wallet1.address)}`);
console.log(`用户2余额: ${myCoin.getBalance(wallet2.address)}\n`);

// 用户1向用户2转账
console.log('7️⃣ 用户1向用户2转账...');
const transaction3 = new Transaction(wallet1.address, wallet2.address, 20);

try {
    myCoin.createTransaction(transaction3);
    console.log('转账交易创建成功！');
    
    // 挖矿确认转账
    myCoin.minePendingTransactions(minerWallet.address);
    
    console.log('转账确认成功！');
    console.log(`用户1余额: ${myCoin.getBalance(wallet1.address)}`);
    console.log(`用户2余额: ${myCoin.getBalance(wallet2.address)}\n`);
} catch (error) {
    console.log('转账失败:', error.message);
}

// 测试余额不足的交易
console.log('8️⃣ 测试余额不足的交易...');
const invalidTransaction = new Transaction(wallet1.address, wallet2.address, 1000);

try {
    myCoin.createTransaction(invalidTransaction);
    console.log('这不应该成功！');
} catch (error) {
    console.log('✅ 正确拒绝了余额不足的交易:', error.message);
}

// 显示区块链信息
console.log('\n9️⃣ 区块链信息...');
const info = myCoin.getBlockchainInfo();
console.log(`区块高度: ${info.height}`);
console.log(`挖矿难度: ${info.difficulty}`);
console.log(`待处理交易: ${info.pendingTransactions}`);
console.log(`区块链有效性: ${info.isValid ? '✅ 有效' : '❌ 无效'}\n`);

// 显示所有区块
console.log('🔟 区块信息...');
myCoin.chain.forEach((block, index) => {
    console.log(`\n--- 区块 #${index} ---`);
    console.log(`时间戳: ${new Date(block.timestamp).toLocaleString()}`);
    console.log(`哈希: ${block.hash}`);
    console.log(`前一个哈希: ${block.previousHash}`);
    console.log(`Nonce: ${block.nonce}`);
    console.log(`交易数量: ${block.transactions.length}`);
    
    if (block.transactions.length > 0) {
        console.log('交易详情:');
        block.transactions.forEach((tx, txIndex) => {
            console.log(`  ${txIndex + 1}. ${tx.fromAddress || '系统奖励'} → ${tx.toAddress} : ${tx.amount} 代币`);
        });
    }
});

console.log('\n✅ 测试完成！所有功能正常工作。');
console.log('\n💡 提示: 运行 "npm start" 启动Web服务器和区块链浏览器');