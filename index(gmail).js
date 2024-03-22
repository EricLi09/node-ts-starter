const express = require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const app = express();
const PORT = process.env.PORT || 3000;
const GOOGLE_CLIENT_ID = 'your_google_client_id';
const GOOGLE_CLIENT_SECRET = 'your_google_client_secret';
const SESSION_SECRET = 'your_session_secret';

// 使用session
app.use(require('express-session')({ secret: SESSION_SECRET, resave: true, saveUninitialized: true }));

// 使用passport初始化
app.use(passport.initialize());
app.use(passport.session());

// 定义Google策略
passport.use(new GoogleStrategy({
  clientID: GOOGLE_CLIENT_ID,
  clientSecret: GOOGLE_CLIENT_SECRET,
  callbackURL: '/auth/google/callback'
}, (accessToken, refreshToken, profile, done) => {
  // 在这里可以处理用户授权成功后的逻辑，例如将用户信息保存到数据库中
  return done(null, profile);
}));

// 序列化用户信息
passport.serializeUser((user, done) => {
  done(null, user);
});

// 反序列化用户信息
passport.deserializeUser((obj, done) => {
  done(null, obj);
});

// 认证路由
app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] }));

// 认证回调路由
app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    // 认证成功后的重定向或其他操作
    res.redirect('/profile');
  });

// 保护的资源路由，需要用户登录
app.get('/profile', (req, res) => {
  if (!req.isAuthenticated()) {
    return res.redirect('/');
  }
  // 在这里可以访问登录用户的信息
  res.send(`Welcome, ${req.user.displayName}!`);
});

// 登出路由
app.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

// 主页路由
app.get('/', (req, res) => {
  res.send('Welcome to the main page! <a href="/auth/google">Login with Google</a>');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
