const https = require('https');
const fs = require('fs');
const path = require('path');
const WebSocket = require('ws');

const PORT = 12345;

// 读取 SSL 证书（Certbot 默认安装路径）
const options = {
  key: fs.readFileSync('/etc/letsencrypt/live/tongtongtong.21wb.com/privkey.pem'),
  cert: fs.readFileSync('/etc/letsencrypt/live/tongtongtong.21wb.com/fullchain.pem'),
};

// 启动 HTTPS 服务
const server = https.createServer(options, (req, res) => {
  const filePath = req.url === '/' ? '/index.html' : req.url;
  const fullPath = path.join(__dirname, 'public', filePath);

  fs.readFile(fullPath, (err, content) => {
    if (err) {
      res.writeHead(404);
      res.end('404 Not Found');
    } else {
      const ext = path.extname(fullPath);
      const type = ext === '.html' ? 'text/html' :
                   ext === '.js'   ? 'text/javascript' :
                   ext === '.css'  ? 'text/css' : 'text/plain';
      res.writeHead(200, { 'Content-Type': type });
      res.end(content);
    }
  });
});

// 启动 WSS WebSocket 服务
const wss = new WebSocket.Server({ server });
let clients = [];

wss.on('connection', (ws) => {
  console.log('🔌 客户端已连接');
  clients.push(ws);

  ws.on('message', (msg) => {
    // 广播消息给其他客户端（排除发送者）
    for (const client of clients) {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(msg);
      }
    }
  });

  ws.on('close', () => {
    console.log('❌ 客户端断开');
    clients = clients.filter(c => c !== ws);
  });
});

server.listen(PORT, () => {
  console.log(`✅ 服务已启动： 端口${PORT}`);
});
