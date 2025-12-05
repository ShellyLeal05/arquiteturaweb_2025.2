# 🛡️ Trabalho 4 – Defesas Arquiteturais em Aplicações Web

**Disciplina:**  DCC704 - ARQUITETURA E TECNOLOGIAS DE SISTEMAS WEB

**Professor:**  JEAN BERTRAND PAIXÃO DA SILVA

**Aluno:** SHELLY DA COSTA LEAL


---

Este trabalho tem como foco adicionar camadas reais de segurança em uma aplicação baseada em Node.js, Express e MongoDB.  
As proteções incluem prevenção contra CSRF, XSS, ataques de força bruta, injeção NoSQL e outras vulnerabilidades comuns em aplicações web.


---

# ⚙️ 1. Como executar o projeto

### 🔧 Requisitos
- Node.js (≥ 14)
- NPM
- MongoDB local ou Atlas
- PowerShell (Windows)

### ▶️ Executando
1. Instale dependências:
    ```npm install```

2. Crie um arquivo ```.env```na raiz:
    PORT=3000
    MONGO_URI=mongodb://127.0.0.1:27017/arquiteturaWeb
    SESSION_SECRET=troque_esse_valor_por_um_segredo

3. Inicie o servidor:
    ```node server.js```

4. Acesse em:
    ```http://localhost:3000```

---    

🛡️ 2. Defesas Arquiteturais Implementadas

✔ 2.1 Proteção CSRF (Cross-Site Request Forgery)

- Implementado com o middleware ```csurf```.

- Token ```_csrf``` gerado por requisição.

- Token injetado automaticamente nas views via ```res.locals.csrfToken.```

- Todos os formulários POST possuem: 
    <input type="hidden" name="_csrf" value="<%= csrfToken %>">
        
- Requisições sem token ou com token incorreto são rejeitadas.

✔ 2.2 Rate limiting no login (proteção contra brute-force)

- Rota ```/login``` limitada a 5 tentativas por minuto por IP.

- Na 6ª tentativa → 429 Too Many Requests.

- Implementado com ```express-rate-limit.```

✔ 2.3 Helmet — Segurança de cabeçalhos HTTP

Protege contra:

- Clickjacking

- MIME Sniffing

- Políticas inseguras de conteúdo

- Outras ameaças baseadas em headers

Headlines confirmados via:

```curl.exe -I http://localhost:3000```

✔ 2.4 Hash de senha com Bcrypt

- Senhas nunca são armazenadas em texto puro.

- Registro utiliza:

    ```bcrypt.hash(senha, 10)```
    
- Login utiliza:

    ```bcrypt.compare(senhaDigitada, senhaHash)```

✔ 2.5 Sessões mais seguras

Configuração de cookie:

    cookie: {
    httpOnly: true,
    sameSite: true,
    secure: false  // deve ser true em produção com HTTPS
    }    

Proteções:

- Navegador não permite acesso por JavaScript → evita roubo de sessão.

- Evita envio de cookies entre domínios (CSRF reduzido).

✔ 2.6 Mitigação de XSS (Cross-Site Scripting)

- Todas as variáveis de usuários são renderizadas com ```<%= %>``` (escape automático).

- Teste com ```<script>alert("XSS")</script>``` **não executa**.

- EJS converte para ```&lt;script&gt;...```

✔ 2.7 Proteção contra NoSQL Injection

- Consultas feitas com objetos fixos:
    
    ```User.findOne({ email: email })```

- Tentativas de injeção como ```email[$ne]=``` não burlam autenticação.

🧪 3. Testes Realizados (Windows – PowerShell)

Todos os testes foram executados usando curl.exe (não curl alias do PowerShell).

---

🏁 4. Conclusão

Todas as defesas solicitadas no Trabalho 4 foram implementadas com sucesso:

- CSRF

- Rate limiting

- Helmet

- Hash de senhas

- Sessões seguras

- Mitigação de XSS

- Mitigação de NoSQL Injection


A aplicação encontra-se significativamente mais segura e robusta contra ataques comuns, com testes completos confirmando cada proteção.