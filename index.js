const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 3000;

// 示例数据库，实际中应该使用数据库来存储用户信息
const users = [];

app.use(bodyParser.json());

// 注册路由
app.post('/register', (req, res) => {
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

// 登录路由
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // 查找用户
  const user = users.find(user => user.username === username);

  if (!user) {
    return res.status(400).send('User not found');
  }

  // 验证密码
  if (!bcrypt.compareSync(password, user.password)) {
    return res.status(401).send('Incorrect password');
  }

  // 生成JWT令牌
  const token = jwt.sign({ username }, 'secretKey', { expiresIn: '1h' });

  res.status(200).json({ token });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
