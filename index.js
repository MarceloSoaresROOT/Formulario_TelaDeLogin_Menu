import express from 'express';

const host = 'localhost';
const port = 3000;
const app = express();

app.use(express.urlencoded({ extended: true }));

let empresas = [
    { 
        cnpj: '11.111.111/0001-11', 
        razaoSocial: 'Gato Net CIA', 
        nomeFantasia: 'Internet do Gato', 
        endereco: 'Rua dos paulistas, 123',
        cidade: 'São Paulo',
        uf: 'SP',
        cep: '01000-000',
        email: 'contato@gatonet.com.br',
        telefone: '(99) 99999-9999'
    },
    { 
        cnpj: '22.222.222/0001-22', 
        razaoSocial: 'Riquinho', 
        nomeFantasia: 'Banco do Riquinho', 
        endereco: 'Avenida Paulista, 1000',
        cidade: 'São Paulo',
        uf: 'SP',
        cep: '13000-000',
        email: 'contato@riquinho.com.br',
        telefone: '(99) 99999-9999'
    },
    { 
        cnpj: '33.333.333/0001-33', 
        razaoSocial: 'jcaré', 
        nomeFantasia: 'Desemtupirda do Zé Jacaré', 
        endereco: 'Travessa das Rosas, 456',
        cidade: 'Rio de Janeiro',
        uf: 'RJ',
        cep: '20000-000',
        email: 'contato@zjcare.com.br',
        telefone: '(21) 97777-7777'
    },
];

let usuarioLogado = false;
function renderizarPagina(titulo, conteudo, mensagem = '') {
    let menuHTML = '';
    if (usuarioLogado) {
        menuHTML = `
        <nav>
            <a href="/">Home</a>
            <a href="/cadastro">Cadastro de Fornecedor</a>
            <a href="/logout">Logout</a>
        </nav>
        `;
    }
    return `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
        <meta charset="UTF-8">
        <title>${titulo}</title>
        <style>
            body { font-family: sans-serif; margin: 0; background-color: #f4f4f4; color: #333; }
            nav { background-color: #2c3e50; padding: 15px 30px; display: flex; gap: 20px; }
            nav a { color: white; text-decoration: none; font-weight: bold; padding: 8px 12px; border-radius: 4px; transition: background 0.3s; }
            nav a:hover { background-color: #1abc9c; }
            .container { max-width: 900px; margin: 30px auto; background: white; padding: 30px; border-radius: 8px; box-shadow: 0 4px 15px rgba(0,0,0,0.1); }
            h1, h2 { color: #2c3e50; margin-top: 0; }
            .alerta { padding: 15px; margin-bottom: 20px; border-radius: 4px; font-weight: bold; }
            .sucesso { background-color: #d4edda; color: #155724; border: 1px solid #c3e6cb; }
            .erro { background-color: #f8d7da; color: #721c24; border: 1px solid #f5c6cb; }
            .erro ul { margin: 5px 0 0 0; padding-left: 20px; }
            .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
            .campo { display: flex; flex-direction: column; }
            .full-width { grid-column: span 2; }
            label { font-weight: bold; margin-bottom: 5px; color: #555; }
            input { width: 100%; padding: 10px; border: 2px solid #ccc; border-radius: 4px; box-sizing: border-box; outline: none; transition: 0.3s; }
            input:focus { border-color: #2ecc71; }
            button { grid-column: span 2; width: 100%; padding: 12px; background-color: #2ecc71; color: white; border: none; border-radius: 4px; font-weight: bold; font-size: 16px; cursor: pointer; transition: 0.3s; margin-top: 10px; }
            button:hover { background-color: #27ae60; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 14px; }
            th, td { border: 1px solid #ddd; padding: 10px; text-align: left; }
            th { background-color: #2c3e50; color: white; }
            tr:nth-child(even) { background-color: #f9f9f9; }
        </style>
    </head>
    <body>
        ${menuHTML}
        <div class="container">
            ${mensagem}
            ${conteudo}
        </div>
    </body>
    </html>
    `;
}
app.get('/', (req, res) => {
    if (!usuarioLogado) return res.redirect('/login');

    let mensagemHTML = '';
    if (req.query.msg === 'logado') {
        mensagemHTML = '<div class="alerta sucesso">Login efetuado com sucesso! Bem-vindo.</div>';
    }
    const conteudo = `<h1>Página Inicial</h1><p>Bem-vindo ao sistema de gestão. Utilize o menu acima para cadastrar novos fornecedores e empresas.</p>`;
    res.send(renderizarPagina('Home', conteudo, mensagemHTML));
});
app.get('/login', (req, res) => {
    if (usuarioLogado) return res.redirect('/');
    let mensagemHTML = '';
    if (req.query.msg === 'logout') {
        mensagemHTML = '<div class="alerta sucesso">Logout efetuado com sucesso!</div>';
    }
    const conteudo = `
        <h2>Acesso ao Sistema</h2>
        <form action="/login" method="POST">
            <div class="campo" style="margin-bottom: 15px;"><label>Usuário:</label><input type="text" name="usuario" placeholder="admin"></div>
            <div class="campo" style="margin-bottom: 15px;"><label>Senha:</label><input type="password" name="senha" placeholder="123"></div>
            <button type="submit" style="grid-column: span 1;">Entrar</button>
        </form>
    `;
    res.send(renderizarPagina('Login', conteudo, mensagemHTML));
});
app.post('/login', (req, res) => {
    const { usuario, senha } = req.body;
    if (usuario === 'admin' && senha === '123') {
        usuarioLogado = true;
        res.redirect('/?msg=logado');
    } else {
        const conteudo = `
        <h2>Acesso ao Sistema</h2>
        <form action="/login" method="POST">
            <div class="campo" style="margin-bottom: 15px;"><label>Usuário:</label><input type="text" name="usuario"></div>
            <div class="campo" style="margin-bottom: 15px;"><label>Senha:</label><input type="password" name="senha"></div>
            <button type="submit" style="grid-column: span 1;">Entrar</button>
        </form>`;
        res.send(renderizarPagina('Login', conteudo, '<div class="alerta erro">Falha no login! Usuário ou senha incorretos.</div>'));
    }
});
app.get('/logout', (req, res) => {
    usuarioLogado = false; 
    res.redirect('/login?msg=logout');
});
function gerarTabela() {
    if (empresas.length === 0) return '<p>Nenhuma empresa cadastrada.</p>';
    let linhas = empresas.map(emp => `
        <tr>
            <td>${emp.cnpj}</td>
            <td>${emp.razaoSocial}</td>
            <td>${emp.nomeFantasia}</td>
            <td>${emp.cidade}/${emp.uf}</td>
            <td>${emp.telefone}</td>
        </tr>
    `).join('');
    return `
        <h3>Fornecedores Cadastrados</h3>
        <table>
            <thead>
                <tr>
                    <th>CNPJ</th>
                    <th>Razão Social</th>
                    <th>Nome Fantasia</th>
                    <th>Localidade</th>
                    <th>Telefone</th>
                </tr>
            </thead>
            <tbody>${linhas}</tbody>
        </table>
    `;
}
app.get('/cadastro', (req, res) => {
    if (!usuarioLogado) return res.redirect('/login');
    const conteudo = `
        <h2>Registrar Fornecedor / Empresa</h2>
        <form action="/cadastro" method="POST" class="form-grid">
            <div class="campo full-width"><label>CNPJ:</label><input type="text" name="cnpj" placeholder="Ex: 00.000.000/0001-00"></div>
            <div class="campo"><label>Razão Social:</label><input type="text" name="razaoSocial" placeholder="Ex: Moraes & irmãos Ltda"></div>
            <div class="campo"><label>Nome Fantasia:</label><input type="text" name="nomeFantasia" placeholder="Ex: Loja do 1,99"></div>
            <div class="campo full-width"><label>Endereço:</label><input type="text" name="endereco" placeholder="Rua, Número, Bairro"></div>
            <div class="campo"><label>Cidade:</label><input type="text" name="cidade"></div>
            <div class="campo"><label>UF:</label><input type="text" name="uf" maxlength="2" placeholder="Ex: SP"></div>
            <div class="campo"><label>CEP:</label><input type="text" name="cep" placeholder="00000-000"></div>
            <div class="campo"><label>E-mail:</label><input type="text" name="email" placeholder="contato@empresa.com"></div>
            <div class="campo"><label>Telefone:</label><input type="text" name="telefone" placeholder="(00) 00000-0000"></div>
            
            <button type="submit">Cadastrar Fornecedor</button>
        </form>
        <hr style="margin: 30px 0; border: 1px solid #eee;">
        ${gerarTabela()}
    `;
    res.send(renderizarPagina('Cadastro de Fornecedor', conteudo));
});
app.post('/cadastro', (req, res) => {
    if (!usuarioLogado) return res.redirect('/login');
    const dados = req.body;
    let camposVazios = [];

    if (!dados.cnpj || dados.cnpj.trim() === '') camposVazios.push('CNPJ');
    if (!dados.razaoSocial || dados.razaoSocial.trim() === '') camposVazios.push('Razão Social');
    if (!dados.nomeFantasia || dados.nomeFantasia.trim() === '') camposVazios.push('Nome Fantasia');
    if (!dados.endereco || dados.endereco.trim() === '') camposVazios.push('Endereço');
    if (!dados.cidade || dados.cidade.trim() === '') camposVazios.push('Cidade');
    if (!dados.uf || dados.uf.trim() === '') camposVazios.push('UF');
    if (!dados.cep || dados.cep.trim() === '') camposVazios.push('CEP');
    if (!dados.email || dados.email.trim() === '') camposVazios.push('E-mail');
    if (!dados.telefone || dados.telefone.trim() === '') camposVazios.push('Telefone');
    let mensagemHTML = '';

    if (camposVazios.length > 0) {
        let listaErros = camposVazios.map(campo => `<li>O campo <b>${campo}</b> não foi preenchido.</li>`).join('');
        mensagemHTML = `<div class="alerta erro">Todos os campos são obrigatórios. Corrija abaixo:<ul>${listaErros}</ul></div>`;
    } else {
        empresas.push(dados);
        mensagemHTML = `<div class="alerta sucesso">Fornecedor <b>${dados.nomeFantasia}</b> cadastrado com sucesso!</div>`;
    }
    const conteudo = `
        <h2>Registrar Fornecedor / Empresa</h2>
        <form action="/cadastro" method="POST" class="form-grid">
            <div class="campo full-width"><label>CNPJ:</label><input type="text" name="cnpj" value="${dados.cnpj || ''}"></div>
            <div class="campo"><label>Razão Social:</label><input type="text" name="razaoSocial" value="${dados.razaoSocial || ''}"></div>
            <div class="campo"><label>Nome Fantasia:</label><input type="text" name="nomeFantasia" value="${dados.nomeFantasia || ''}"></div>
            <div class="campo full-width"><label>Endereço:</label><input type="text" name="endereco" value="${dados.endereco || ''}"></div>
            <div class="campo"><label>Cidade:</label><input type="text" name="cidade" value="${dados.cidade || ''}"></div>
            <div class="campo"><label>UF:</label><input type="text" name="uf" value="${dados.uf || ''}" maxlength="2"></div>
            <div class="campo"><label>CEP:</label><input type="text" name="cep" value="${dados.cep || ''}"></div>
            <div class="campo"><label>E-mail:</label><input type="text" name="email" value="${dados.email || ''}"></div>
            <div class="campo"><label>Telefone:</label><input type="text" name="telefone" value="${dados.telefone || ''}"></div>
            <button type="submit">Cadastrar Fornecedor</button>
        </form>
        <hr style="margin: 30px 0; border: 1px solid #eee;">
        ${gerarTabela()}
    `;
    res.send(renderizarPagina('Cadastro de Fornecedor', conteudo, mensagemHTML));
});
app.listen(port, host, () => {
    console.log(`Servidor rodando! Acesse http://${host}:${port}`);
});