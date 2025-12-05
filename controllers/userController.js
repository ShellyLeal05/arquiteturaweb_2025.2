const User = require('../models/User');
const bcrypt = require('bcrypt');

const userController = {
  listUsers: async (req, res) => {
    try {
      const users = await User.find().lean().exec();
      res.render('usersList', { usuarios: users, userName: req.session.userName });
    } catch (error) {
      console.error('Erro listando usuários:', error);
      res.status(500).send('Erro Interno');
    }
  },

    // Renderizar form de criação 
    getNewUserForm: (req, res) => {
      res.render('formUsuario', { error: null});
    },
  
  createNewUser: async (req, res) => { 
    try { 
      const { nome, email, cargo, senha } = req.body;
      if (!nome || !email || !cargo || !senha) {
        return res.status(400).render('formUsuario', { error: 'Preencha todos os campos.' });
      }
      const hashedPassword = await bcrypt.hash(senha, 10);  

      // 2. Criar usuário com a senha CRIPTOGRAFADA 
      await User.create({ 
        nome, 
        email, 
        cargo, 
        password: hashedPassword 
      }); 
 
      res.redirect('/users');
    } catch (error) {
      console.error('Erro criando usuário:', error); 
      res.status(500).send("Erro ao criar usuário: " + error.message); 
    } 
  },

  // READ: Buscar todos (Esta rota é protegida pelo middleware isAuth no server.js)
  getAllUsers: async (req, res) => {
    try {
      // Captura o nome do usuário logado da sessão
      const loggedInUserName = req.session.userName; // <-- NOVO

      // O Mongoose busca no banco (aguarda a promessa)
      const users = await User.find(); 

      // Passa a lista de usuários E o nome do usuário logado para a View
      res.render('usersList', { 
        usuarios: users,
        userName: req.session.userName
      });
    } catch (error) {
      res.status(500).send("Erro ao buscar usuários: " + error.message);
    }
  },


  // --- DELETE ---
  deleteUser: async (req, res) => {
    try {
      const id = req.params.id; 
      await User.findByIdAndDelete(id); 
      res.redirect('/users');
    } catch (error) {
      console.error('Erro deletando usuário:', error);
      res.status(500).send("Erro ao deletar: " + error.message);
    }
  },

  // --- UPDATE (Parte 1 - Mostrar o Form Preenchido) ---
  getEditUserForm: async (req, res) => {
    try {
      const id = req.params.id;
      const user = await User.findById(id).lean().exec();
      if (!user) return res.status(404).send("Usuário não encontrado");
      res.render('editUsuario', { user });
    } catch (error) {
      console.error('Erro obtendo usuário:', error);
      res.status(500).send("Erro ao buscar para editar");
    }
  },

  // --- UPDATE (Parte 2 - Salvar Alteração) ---
  updateUser: async (req, res) => {
    try {
      const id = req.params.id;
      const dadosAtualizados = {
        nome: req.body.nome_usuario,
        cargo: req.body.cargo_usuario
      };
      await User.findByIdAndUpdate(id, dadosAtualizados).exec();
      res.redirect('/users');
    } catch (error) {
      console.error('Erro atualizando usuário:', error);
      res.status(500).send("Erro ao atualizar");
    }
  }
};

module.exports = userController;