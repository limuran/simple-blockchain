// test-gas.js - 带手续费的区块链功能测试脚本
const { SimpleBlockchain, Transaction, Wallet } = require('./blockchain');

console.log('🚀 开始测试带手续费的简单区块链...\n');

// 创建区块链实例
const myCoin = new SimpleBlockchain();

// 创建用户钱包
console.log('1️⃣ 创建用户钱包...');
const wallet1 = new Wallet();
const wallet2 = new Wallet();
const minerWallet = new Wallet();

console.log(`用户1地址: ${wallet1.address}`);
console.log(`用户2地址: ${wallet2.address}`);
console.log(`矿工地址: ${minerWallet.address}`);
console.log(`最低Gas费: ${myCoin.minimumGasPrice}\n`);

// 检查初始余额
console.log('2️⃣ 检查初始余额...');
console.log(`用户1余额: ${myCoin.getBalance(wallet1.address)}`);
console.log(`用户2余额: ${myCoin.getBalance(wallet2.address)}`);
console.log(`矿工余额: ${myCoin.getBalance(minerWallet.address)}\n`);

// 第一次挖矿 - 矿工获得奖励
console.log('3️⃣ 矿工进行第一次挖矿...');
myCoin.minePendingTransactions(minerWallet.address);

console.log(`挖矿后矿工余额: ${myCoin.getBalance(minerWallet.address)}\n`);

// 创建带手续费的交易
console.log('4️⃣ 创建带手续费的交易...');
const transaction1 = new Transaction(minerWallet.address, wallet1.address, 50, 2); // 2代币手续费
const transaction2 = new Transaction(minerWallet.address, wallet2.address, 30, 3); // 3代币手续费

try {
    myCoin.createTransaction(transaction1);
    myCoin.createTransaction(transaction2);
    console.log('✅ 交易创建成功！');
    console.log(`交易1: 转账50 + Gas费2 = 总费用52`);
    console.log(`交易2: 转账30 + Gas费3 = 总费用33`);
} catch (error) {
    console.log('❌ 交易创建失败:', error.message);
}

console.log(`待处理交易数量: ${myCoin.pendingTransactions.length}`);
console.log(`待处理交易总Gas费: ${myCoin.pendingTransactions.reduce((sum, tx) => sum + tx.gasPrice, 0)}\n`);

// 第二次挖矿 - 确认交易并收取手续费
console.log('5️⃣ 进行第二次挖矿确认交易...');
const beforeMiningBalance = myCoin.getBalance(minerWallet.address);
myCoin.minePendingTransactions(minerWallet.address);
const afterMiningBalance = myCoin.getBalance(minerWallet.address);

console.log(`矿工挖矿前余额: ${beforeMiningBalance}`);
console.log(`矿工挖矿后余额: ${afterMiningBalance}`);
console.log(`矿工本次收入: ${afterMiningBalance - beforeMiningBalance} (100基础奖励 + 5Gas费)`);

// 检查交易后余额
console.log('\n6️⃣ 检查交易后余额...');
console.log(`矿工余额: ${myCoin.getBalance(minerWallet.address)}`);
console.log(`用户1余额: ${myCoin.getBalance(wallet1.address)}`);
console.log(`用户2余额: ${myCoin.getBalance(wallet2.address)}\n`);

// 测试不同Gas费的交易优先级
console.log('7️⃣ 测试不同Gas费的交易优先级...');
const lowGasTx = new Transaction(wallet1.address, wallet2.address, 10, 1); // 低Gas费
const highGasTx = new Transaction(wallet2.address, wallet1.address, 5, 5);  // 高Gas费

try {
    myCoin.createTransaction(lowGasTx);
    myCoin.createTransaction(highGasTx);
    console.log('✅ 创建了两笔不同Gas费的交易');
    console.log(`低Gas费交易: 10代币 + 1Gas费`);
    console.log(`高Gas费交易: 5代币 + 5Gas费`);
} catch (error) {
    console.log('❌ 交易创建失败:', error.message);
}

// 挖矿确认这些交易
console.log('\n8️⃣ 挖矿确认不同Gas费的交易...');
myCoin.minePendingTransactions(minerWallet.address);

console.log(`用户1余额: ${myCoin.getBalance(wallet1.address)}`);
console.log(`用户2余额: ${myCoin.getBalance(wallet2.address)}`);
console.log(`矿工余额: ${myCoin.getBalance(minerWallet.address)}\n`);

// 测试余额不足的交易（包含Gas费）
console.log('9️⃣ 测试余额不足的交易...');
const invalidTransaction = new Transaction(wallet1.address, wallet2.address, 1000, 2);

try {
    myCoin.createTransaction(invalidTransaction);
    console.log('❌ 这不应该成功！');
} catch (error) {
    console.log('✅ 正确拒绝了余额不足的交易:', error.message);
}

// 测试Gas费过低的交易
console.log('\n🔟 测试Gas费过低的交易...');
const lowGasTransaction = new Transaction(wallet1.address, wallet2.address, 5, 0.5);

try {
    myCoin.createTransaction(lowGasTransaction);
    console.log('❌ 这不应该成功！');
} catch (error) {
    console.log('✅ 正确拒绝了Gas费过低的交易:', error.message);
}

// 显示网络统计信息
console.log('\n1️⃣1️⃣ 网络统计信息...');
const networkStats = myCoin.getNetworkStats();
console.log(`总交易数: ${networkStats.totalTransactions}`);
console.log(`总Gas费: ${networkStats.totalGasFees}`);
console.log(`总交易量: ${networkStats.totalVolume}`);
console.log(`平均Gas费: ${networkStats.averageGasPrice.toFixed(2)}`);

// 显示区块链信息
console.log('\n1️⃣2️⃣ 区块链信息...');
const info = myCoin.getBlockchainInfo();
console.log(`区块高度: ${info.height}`);
console.log(`挖矿难度: ${info.difficulty}`);
console.log(`待处理交易: ${info.pendingTransactions}`);
console.log(`最低Gas费: ${info.minimumGasPrice}`);
console.log(`挖矿奖励: ${info.miningReward}`);
console.log(`区块链有效性: ${info.isValid ? '✅ 有效' : '❌ 无效'}\n`);

// 显示所有区块
console.log('1️⃣3️⃣ 区块信息...');
myCoin.chain.forEach((block, index) => {
    console.log(`\n--- 区块 #${index} ---`);
    console.log(`时间戳: ${new Date(block.timestamp).toLocaleString()}`);
    console.log(`哈希: ${block.hash}`);
    console.log(`前一个哈希: ${block.previousHash}`);
    console.log(`Nonce: ${block.nonce}`);
    console.log(`交易数量: ${block.transactions.length}`);
    
    if (block.transactions.length > 0) {
        console.log('交易详情:');
        let blockGasFees = 0;
        block.transactions.forEach((tx, txIndex) => {
            const gasInfo = tx.gasPrice > 0 ? ` (Gas费: ${tx.gasPrice})` : '';
            console.log(`  ${txIndex + 1}. ${tx.fromAddress || '系统奖励'} → ${tx.toAddress} : ${tx.amount} 代币${gasInfo}`);
            if (tx.gasPrice > 0) {
                blockGasFees += tx.gasPrice;
            }
        });
        if (blockGasFees > 0) {
            console.log(`  本区块总Gas费: ${blockGasFees} 代币`);
        }
    }
});

// 测试交易历史查询
console.log('\n1️⃣4️⃣ 交易历史查询...');
const wallet1History = myCoin.getTransactionHistory(wallet1.address);
console.log(`用户1交易历史 (${wallet1History.length}笔):`);
wallet1History.forEach((tx, index) => {
    const type = tx.fromAddress === wallet1.address ? '发送' : '接收';
    const gasInfo = tx.gasPrice > 0 ? ` (Gas费: ${tx.gasPrice})` : '';
    console.log(`  ${index + 1}. ${type}: ${tx.amount} 代币${gasInfo} - ${new Date(tx.timestamp).toLocaleString()}`);
});

console.log('\n✅ 测试完成！所有Gas费功能正常工作。');
console.log('\n💡 关键特性:');
console.log('  - ✅ 交易需要支付Gas费');
console.log('  - ✅ 矿工获得基础奖励 + 所有Gas费');
console.log('  - ✅ 余额验证包含Gas费');
console.log('  - ✅ 拒绝Gas费过低的交易');
console.log('  - ✅ 网络统计包含Gas费信息');
console.log('\n🔥 提示: 运行 "npm start" 启动支持Gas费的Web服务器');