// controllers/authController.js

const User = require('../models/User');
const bcrypt = require('bcrypt');

const getLoginForm = (req, res) => {
    const error = req.query.erro || null;
    res.render('login', { error });
};

// --- Lógica de Login (POST) ---
const login = async (req, res) => {
  const { email, senha } = req.body;
if (!email || !senha) {
    return res.status(400).render('login', { error: 'Preencha e-mail e senha.' });
}

  try {
    const user = await User.findOne({ email: email }).exec();
    if (!user) return res.status(401).render('login', { error: 'Credenciais incorretas.' });

    const isMatch = await bcrypt.compare(senha, user.password || user.senha || '');
    if (!isMatch) return res.status(401).render('login', { error: 'Credenciais incorretas.' });

    req.session.userId = user._id;
    req.session.userName = user.nome;
    req.session.save(err => {
        if (err) console.error("Erro ao salvar sessão:", err);
        res.redirect('/users');
    });
  } catch (err) {
    console.error("Erro no login:", err);
    res.status(500).render('login', { error: "Erro interno no servidor."});
  }
};

// --- Lógica de Logout (GET) ---
const logout = (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error('Erro ao destruir sessão:', err);
    }
    res.clearCookie('connect.sid'); 
    res.redirect('/login');
  });
};

// --- Lógica de Registro (GET: Renderizar form) ---
const getRegisterForm = (req, res) => {
    const error = req.query.erro || null;
    res.render('register', { error });
};

// --- Lógica de Registro (POST: Criar usuário) ---
const registerUser = async (req, res) => {
    const { nome, email, senha, cargo } = req.body;
    if (!nome || !email || !senha || !cargo) {
        return res.status(400).render('register', { error: 'Preencha todos os campos.' });
    }

    try {
        const hashedPassword = await bcrypt.hash(senha, 10); 

        await User.create({
            nome,
            email,
            password: hashedPassword,
            cargo
        });

        // Redireciona para login com mensagem de sucesso
        res.redirect('/login?sucesso=cadastro');

    } catch (error) {
        // Trata erro de e-mail duplicado (unique: true)
        if (error.code === 11000) {
            return res.redirect('/register?erro=email_existente');
        }
        console.error("Erro ao registrar usuário:", error);
        return res.status(500).render('register', { error: "Erro interno ao registrar."});
    }
};

// [CRUCIAL] Exporta todas as funções de uma vez só
module.exports = {
    getLoginForm, 
    login, 
    logout, 
    getRegisterForm, 
    registerUser 
};