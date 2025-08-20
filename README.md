# 简单区块链项目

一个使用 Node.js 和 JavaScript 实现的简化区块链，包含代币生产、用户管理、转账、挖矿和区块链浏览器功能。

## 🚀 功能特性

- ✅ **代币生产**: 通过挖矿奖励产生新代币
- ✅ **用户管理**: 创建新用户和钱包地址
- ✅ **代币转账**: 用户间转账功能
- ✅ **挖矿系统**: 工作量证明挖矿机制
- ✅ **区块链浏览器**: Web界面查看区块信息

## 📋 项目结构

```
simple-blockchain/
├── blockchain.js       # 主要区块链实现和API服务器
├── public/
│   └── index.html     # 区块链浏览器前端页面
├── test.js            # 功能测试脚本
├── package.json       # 项目配置文件
└── README.md          # 使用说明
```

## 🛠️ 安装和运行

### 1. 克隆项目
```bash
git clone https://github.com/limuran/simple-blockchain.git
cd simple-blockchain
```

### 2. 安装依赖
```bash
npm install
```

### 3. 运行测试
```bash
npm test
```

### 4. 启动服务器
```bash
npm start
```

服务器启动后，在浏览器访问: `http://localhost:3000`

## 📖 API 接口说明

### 用户管理
- `POST /api/user/create` - 创建新用户
- `GET /api/user/:userId` - 获取用户信息

### 交易相关
- `POST /api/transaction` - 创建交易
- `GET /api/balance/:address` - 查询地址余额

### 挖矿
- `POST /api/mine` - 执行挖矿

### 区块链信息
- `GET /api/blockchain/info` - 获取区块链状态
- `GET /api/blocks` - 获取所有区块
- `GET /api/block/:height` - 获取指定高度区块

## 🎯 使用示例

### 1. 创建用户
```bash
curl -X POST http://localhost:3000/api/user/create
```

返回:
```json
{
  "success": true,
  "userId": "user_1234567890",
  "address": "a1b2c3d4e5f6...",
  "message": "用户创建成功"
}
```

### 2. 挖矿获得代币
```bash
curl -X POST http://localhost:3000/api/mine \
  -H "Content-Type: application/json" \
  -d '{"minerUserId": "user_1234567890"}'
```

### 3. 创建转账交易
```bash
curl -X POST http://localhost:3000/api/transaction \
  -H "Content-Type: application/json" \
  -d '{
    "fromUserId": "user_1234567890",
    "toAddress": "target_address",
    "amount": 50
  }'
```

### 4. 查询余额
```bash
curl http://localhost:3000/api/balance/a1b2c3d4e5f6...
```

## 🔧 核心概念

### 区块结构
```javascript
{
  timestamp: 1234567890,      // 时间戳
  transactions: [...],        // 交易列表
  previousHash: "abc123...",  // 前一个区块哈希
  nonce: 12345,              // 挖矿随机数
  hash: "def456..."          // 当前区块哈希
}
```

### 交易结构
```javascript
{
  fromAddress: "sender...",   // 发送方地址 (null表示挖矿奖励)
  toAddress: "receiver...",   // 接收方地址
  amount: 100,               // 转账金额
  timestamp: 1234567890      // 交易时间戳
}
```

### 挖矿机制
- 使用工作量证明 (Proof of Work)
- 默认难度为 2 (可调整)
- 挖矿奖励为 100 代币
- 需要找到满足难度要求的哈希值

## 🌐 区块链浏览器功能

Web界面提供以下功能：
- 📊 实时区块链状态监控
- 👤 创建和查询用户
- 💰 余额查询
- 💸 创建转账交易
- ⛏️ 执行挖矿操作
- 📋 查看所有区块和交易记录

## 🔒 安全特性

- 数字签名验证 (简化版)
- 余额验证防止双花
- 区块链完整性验证
- 哈希链保护防止篡改

## ⚠️ 注意事项

这是一个**教育目的**的简化区块链实现，不适用于生产环境：

1. **安全性限制**: 没有完整的数字签名实现
2. **网络功能**: 当前为单节点版本，无P2P网络
3. **持久化**: 数据存储在内存中，重启后丢失
4. **性能**: 未做优化，仅适合学习和测试

## 📚 学习资源

- [区块链基础概念](https://zh.wikipedia.org/wiki/区块链)
- [工作量证明算法](https://zh.wikipedia.org/wiki/工作量证明)
- [Merkle树结构](https://zh.wikipedia.org/wiki/默克尔树)
- [数字签名原理](https://zh.wikipedia.org/wiki/数字签名)

## 🛡️ 许可证

MIT License - 可自由使用和修改

## 🤝 贡献

欢迎提交 Issue 和 Pull Request 来改进这个项目！

## 🔗 在线演示

如果你想快速查看效果，可以按照上述步骤在本地运行，或者直接查看源码了解实现原理。

---

**Powered by Node.js & Express** 💻