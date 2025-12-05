# 🛡️ Trabalho 4 – Defesas Arquiteturais em Aplicações Web

**Disciplina:**  DCC704 - ARQUITETURA E TECNOLOGIAS DE SISTEMAS WEB

**Professor:**  JEAN BERTRAND PAIXÃO DA SILVA

**Aluno:** SHELLY DA COSTA LEAL
 

Este trabalho tem como foco adicionar camadas reais de segurança em uma aplicação baseada em Node.js, Express e MongoDB.  
As proteções incluem prevenção contra CSRF, XSS, ataques de força bruta, injeção NoSQL e outras vulnerabilidades comuns em aplicações web.

Todas as medidas implementadas foram testadas individualmente e apresentadas neste documento.

---

# ⚙️ 1. Configuração do Projeto

## 📌 1.1 Requisitos Necessários
Antes de executar o sistema, é necessário ter instalado:

- **Node.js** (versão LTS recomendada)
- **npm**
- **MongoDB Community Server**
- **PowerShell** (para executar os testes com `curl.exe`)

---

## 📦 1.2 Instalação e Execução

### 1. Instale as dependências do projeto:
```bash
npm install
