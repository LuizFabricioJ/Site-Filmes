/// Conexão com banco
const express = require('express');
const app = express();
const port = 3000;
const bodyparser = require('body-parser');
const Bcrypt = require('bcrypt');
const connection = require('./database/conection');
const cadastrouser = require('./database/cadastro_usuario');
const usuario = require('./database/cadastro_usuario');




//Uma nota  - Caso precise instalar o xampp denovo, precisa criar banco de dados "cadastrouser" e desativa 
//o bloco de codigo que faz o insert de cadastro para funcionar a criação da tabela da linha 49 a 62 está codigo

//configurando body-parser
app.use(bodyparser.urlencoded({extended:false}));
app.use(bodyparser.json());

//configurando ejs
app.set('view engine', 'ejs');

//configurando arquivos staticos
app.use(express.static('public'));

//////// Configuração da coneção com o banco de dados ///////////////////////////////////////
connection
    .authenticate()
    .then(()=>{
        console.log('Conexão com o banco de Dados feita com Sucesso!')
    }).catch((error)=>{
        console.log(error)
    });

//////// CODIGO A BAIXO SÃO ROTAS DE PAGES DO SITE /////////

//Rota Prncipal
app.get('/', (req, res)=>{
    res.render('index')
});

//Rota Login
app.get('/login', (req,res)=>{
    res.render('login')
});

//Rota Cadastro isto seria a tela de cadastro apenas
app.get('/cadastro', (req , res)=>{
    res.render('cadastro')
});


//ROTA DE CADASTRO cadastro-user
app.post('/cadastro' , (req , res)=>{

    var email = req.body.email
    var senha = req.body.senha

    var salt = Bcrypt.genSaltSync(5)
    var hash = Bcrypt.hashSync(senha , salt)

    cadastrouser.create({
        email: email,
        senha: hash,
        senha_2: req.body.senha_2
    }).then(function(){
        res.send("Cadastro efetuado com sucesso!")
        //res.redirect("/login")
        
    }).catch(function(erro){
        res.send("Houve erro no cadastro! , cadastro não efetuado" + erro)
    })
});

/// ROTA  LOGAR ACESSO

app.post('/logado', (req , res)=>{
    var email = req.body.email;
    var senha = req.body.senha;


    cadastrouser.findOne({where:{email:email}}).then(usuario =>{
        if(usuario!=undefined){
            var correct = Bcrypt.compareSync(senha, usuario.senha)
            if(correct){
                alert('TESTE');
                res.send('Seja bem vindo, Você logou com Sucesso!')
            }else{
                res.redirect('/cadastro')
            }
         } else{
             res.redirect('/cadastro')
        }
    })

})






//Rota main
app.get('/main', (req,res)=>{
    res.render('page/main')
});


// para dar start ao site codigo no terminal - nodemon index.js




////////Iniciando o servidor/////////
app.listen(port , ()=>{
    console.log('Servidor Online!')
});