import db from './db.js';
import express from 'express'
import cors from 'cors'

const app = express();
app.use(cors());
app.use(express.json());




app.get('/produto', async(req,resp)=>{
    try {
        let u = await db.tb_produto.findAll({order:[['id_produto','desc']]});
        resp.send(u);
    } catch (error) {
        resp.send({erro:error.toString()})
    }   
})


function productValidator(prod, cat, preD, preP, ava, desc, est, img){
    let msg=""; 
   let preDint = parseInt(preD);
   let prePint = parseInt(preP);
   let avaInt = parseInt(ava);
   let estInt = parseInt(est);
    if(prod.length ==0 || prod.length > 255)
        msg= '🎃Credenciais de produto inválidas!\n ';
    if(cat.length == 0 || cat.length >255)
        msg+='🎃Credenciais de categoria inválidas!\n ';
    if(desc.length == 0 || desc.length >255)
        msg+='🎃Credenciais de descrição inválidas!\n ';
    if(img.length == 0 || img.length>800)
        msg+='🎃Campo de url inválido!\n '
    if(preDint ==0 || preDint<prePint ||preDint.toString().length > 10 || preD.length ==0)
        msg+='🎃Campo de [preço de] inválido!\n '
    if(prePint==0 || prePint.toString().length >10 || preP.length ==0)
        msg+='🎃Campo de [preço por] inválido!\n '
    if(avaInt<=0 || avaInt >10)
        msg+='🎃Campo de avaliação inválido!\n '
    if(estInt<=0 || estInt.toString().length >10)
        msg+='🎃Campo de estoque inválido!\n '
   return msg;
}

app.post('/produto',async(req,resp)=>{
    
    try{

        let {produto,categoria,precode,precopor,avaliacao,descricao,estoque,imagem} = req.body;

        let r1= await db.tb_produto.findOne({ where:{nm_produto: produto} });
        if(r1 != null)
        return resp.send({erro:'Produto já existe no banco de dados'});
        var msg = productValidator(produto, categoria, precode, precopor, avaliacao, descricao,estoque,imagem);
        if(msg.length > 0)
        return resp.send({erro:msg})   
       
     
        let r = await db.tb_produto.create(
           {
               nm_produto: produto,
               ds_categoria:categoria,
               vl_preco_de:precode,
               vl_preco_por:precopor,
               vl_avaliacao:avaliacao,
               ds_produto:descricao,
               qtd_estoque:estoque,
               img_produto:imagem

           }
        )
     
        resp.send(r);
    } catch (error) {
        resp.send({erro:error.toString()})
    }
})


app.put('/produto/:id', async(req,resp)=>{
   
     
    try {
    let p = req.params.id;
    let {produto,categoria,precode,precopor,avaliacao,descricao,estoque,imagem} = req.body;
    
    await db.tb_produto.findOne({ where:{nm_produto: produto} });
    var msg = productValidator(produto, categoria, precode, precopor, avaliacao, descricao,estoque,imagem);
    if(msg != "")
    return resp.send({erro:msg}) 
        await db.tb_produto.update(
            {
                nm_produto: produto,
                ds_categoria:categoria,
                vl_preco_de:precode,
                vl_preco_por:precopor,
                vl_avaliacao:avaliacao,
                ds_produto:descricao,
                qtd_estoque:estoque,
                img_produto:imagem
                },
                {where:{id_produto:p}}
        )
        
        resp.sendStatus(200);
    } catch (error) {
        resp.send({erro:error.toString()});
    }
})

app.delete('/produto/:id', async(req,resp)=>{
    let p = req.params.id;
    try {
        let r = await db.tb_produto.destroy({where:{id_produto:p}});
        resp.sendStatus(200);
    } catch (error) {
        resp.send({erro:error.toString()})
    }
    
})






app.listen(process.env.PORT,

x => console.log(`Server up at port ${process.env.PORT}`))