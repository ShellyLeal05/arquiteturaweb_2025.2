require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const session = require('express-session'); 
const mongoose = require('mongoose');
const rateLimit = require('express-rate-limit');
const csrf = require('csurf');
const path = require('path');

const authController = require('./controllers/authController');
const userController = require('./controllers/userController');
const isAuth = require('./middleware/auth'); // Importa o segurança

const app = express();

app.use(helmet());

// Body Parsers
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Views
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Conexão com Mongo usando MONGO_URI do .env
const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/arquiteturaWeb';
mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(()=> console.log('MongoDB conectado 🔥'))
  .catch(err => {
    console.error('Erro ao conectar no MongoDB:', err);
    process.exit(1);
  });

// // 2. Conectar ao MongoDB (Substitua pela SUA string de conexão)
// mongoose.connect('mongodb://usuario:senha@host:porta/nome_db')
//   .then(() => console.log('🔥 Conectado ao MongoDB!'))
//   .catch(err => console.error('Erro ao conectar no Mongo:', err));

// Sessão
if (!process.env.SESSION_SECRET) {
  console.warn('SESSION_SECRET não encontrado em .env — definir é recomendado.');
}
app.use(session({
  secret: process.env.SESSION_SECRET || 'SUA SENHA SECRETA',
  resave: false,
  saveUninitialized: false,
  cookie: {
    // Em produção com HTTPS, ajuste secure: true
    httpOnly: true,
    secure: false,
    sameSite: true
  }
}));

// // Configuração do Middleware de Sessão
// app.use(session({
//     secret: 'seu-segredo-aqui', 
//     resave: false, 
//     saveUninitialized: false, 
//     cookie: { secure: false } 
// }));

// ===== Rate limiter específico para rota de login (proteção contra brute force) =====
const loginLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minuto
  max: 5,              // max 5 tentativas por IP por minute
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    return res.status(429).render('login', { error: 'Muitas tentativas. Tente novamente em 1 minuto.' });
  }
});

// --- ROTAS PÚBLICAS (LOGIN/LOGOUT/REGISTRO) ---


// ===== Ativa proteção CSRF globalmente =====
const csrfProtection = csrf();
app.use(csrfProtection);

// middleware que disponibiliza o token para todas as views
app.use((req, res, next) => {
  try {
    res.locals.csrfToken = req.csrfToken();
  } catch (err) {
    res.locals.csrfToken = null;
  }
  next();
});
// Rota de Login (Passa query params de erro/sucesso para a view)
app.get('/login', authController.getLoginForm);
app.post('/login', loginLimiter, authController.login);

// Rotas de REGISTRO PÚBLICO
app.get('/register', authController.getRegisterForm);
app.post('/register', authController.registerUser);

// --- ROTAS PROTEGIDAS (CRUD) ---
app.get('/', (req, res) => res.redirect('/users'));

app.get('/users', isAuth, userController.listUsers);
app.get('/users/new', isAuth, userController.getNewUserForm);
app.post('/users', isAuth, userController.createNewUser);

// Rota para DELETAR
app.post('/users/delete/:id', isAuth, userController.deleteUser);

// Rotas para EDITAR
app.get('/users/edit/:id', isAuth, userController.getEditUserForm);
app.post('/users/update/:id', isAuth, userController.updateUser);

app.get('/logout', authController.logout);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Servidor rodando na porta ${port}`));