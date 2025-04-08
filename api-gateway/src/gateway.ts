import express from 'express';
import cors from 'cors';
const { createProxyMiddleware } = require("http-proxy-middleware");

const app = express();

app.use(cors({
  origin: 'http://localhost:4200',  
  credentials: true
}));

app.options('*', cors({
  origin: 'http://localhost:4200',
  credentials: true
}));


app.use("/exam/dohvProfesore", createProxyMiddleware({
  target: "http://localhost:5001",  
  changeOrigin: true,
  pathRewrite: {
    '^/exam/dohvProfesore': '/auth/dohvProfesore'  
  },
  logLevel: 'debug'
}));


app.use("/auth", createProxyMiddleware({
  target: "http://localhost:5001",
  changeOrigin: true,
  logLevel: 'debug'
}));

app.use("/exam", createProxyMiddleware({
  target: "http://localhost:5002",
  changeOrigin: true,
  logLevel: 'debug'
}));

app.use("/payments", createProxyMiddleware({
  target: "http://localhost:5003",
  changeOrigin: true,
  logLevel: 'debug'
}));

app.use(express.json());

app.use((req, res, next) => {
  console.log(`Global middleware: ${req.method} ${req.url}`);
  next();
});

app.use((req, res, next) => {
  console.log(`After proxy: ${req.method} ${req.url}`);
  next();
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`API Gateway je pokrenut na portu ${PORT}`);
});
