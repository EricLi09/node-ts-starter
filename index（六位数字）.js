const readline = require('readline');
const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 3000;
const secretKey = 'yourSecretKey';

// 创建 readline 接口
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// 示例用户数据，用于验证用户名和token
const users = [
  { username: 'user1', token: 'abcdef123456' },
  { username: 'user2', token: '123456abcdef' }
];

// 注册路由
app.post('/Six-digit', (req, res) => {
  const { username, password } = req.body;

  console.log('username: ', username);
  console.log('password: ', password);

  // 检查用户名是否已存在
  if (users.find(user => user.username === username)) {
    return res.status(400).send('Username already exists');
  }

  // 加密密码
  const hashedPassword = bcrypt.hashSync(password, 10);

  // 将用户信息存储到数据库
  users.push({ username, password: hashedPassword });

  res.status(201).send('User registered successfully');
});
// 生成一个六位随机数字
function generateSixDigit() {
  return Math.floor(100000 + Math.random() * 900000);
}