const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 3000;
const secretKey = 'yourSecretKey'; // 用于签名JWT令牌的密钥，应该是一个安全的随机字符串

// 示例数据库，实际中应该使用数据库来存储用户信息
const users = [];

app.use(bodyParser.json());

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
  const token = jwt.sign({ username }, secretKey, { expiresIn: '1h' });

  res.status(200).json({ token });
});

// 修改密码路由
app.post('/change-password', (req, res) => {
  const { token, oldPassword, newPassword } = req.body;  

  // 验证JWT令牌
  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(401).send('Invalid token');
    }

    // 查找用户
    const user = users.find(user => user.username === decoded.username);

    if (!user) {
      return res.status(400).send('User not found');
    }

    // 验证旧密码
    if (!bcrypt.compareSync(oldPassword, user.password)) {
      return res.status(401).send('Incorrect old password');
    }

    // 更新密码
    const hashedNewPassword = bcrypt.hashSync(newPassword, 10);
    user.password = hashedNewPassword;

    res.status(200).send('Password changed successfully');
  });
});

// 修改密码路由
app.post('/change-username', (req, res) => {
  const { token, oldusername, newusername } = req.body;  

  // 验证JWT令牌
  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(401).send('Invalid token');
    }

    // 查找用户
    const user = users.find(user => user.username === decoded.username);

    if (!user) {
      return res.status(400).send('User not found');
    }

    const user1 = users.find(user => user.username === newusername);

    if (user1) {
      return res.status(400).send('Use name repet');
    }

    console.log('user.username: ', user.username);
    console.log('oldusername: ', oldusername);

    // 验证旧密码
    if (oldusername !== user.username) {
      return res.status(401).send('Incorrect old username');
    }

    // 更新密码
    user.username = newusername;

    res.status(200).send('Password changed successfully');
  });
});

// 仅用于测试目的，注册一个示例用户
app.post('/register', (req, res) => {
  const { username, password } = req.body;

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

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
