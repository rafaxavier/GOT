/* incluindo função ObjectID existente no modulo mongodb, para buscar 
o _id do documento como object e não como simplismente uma string */
var ObjectID = require('mongodb').ObjectId;

function JogoDAO(connection){
	this._connection = connection();
}

// função que gera os dados inicias para o jogo, como moedas, suditos, magia....
JogoDAO.prototype.gerarParametroJogo = function(usuario){
	this._connection.open(function(err, mongoclient){
		mongoclient.collection("jogo", function(err, collection){
			// inserindo os dados do jogo no documento
			collection.insert({
				usuario: usuario,
				moeda:15,
				suditos:10,
				temor: Math.floor(Math.random() * 1000),
				sabedoria: Math.floor(Math.random() * 1000),
				comercio: Math.floor(Math.random() * 1000),
				magia: Math.floor(Math.random() * 1000)
			});

			//fecha a conexão apos inserir 
			mongoclient.close();
		});
	});
}

// função que inicia o jogo recuperando os dados do jogador no BD, como a casa, e os seus atributos gerados na função a cima
JogoDAO.prototype.iniciaJogo = function(usuario, casa, res, req, msg){
	this._connection.open(function(err, mongoclient){
		mongoclient.collection("jogo", function(err, collection){
			// buscando os dados do usuario no documento passando um json
			collection.find({
				usuario: usuario
			//convertento result em array 
			}).toArray(function(err, result){
				req.session.jogo = result[0];
				res.render('jogo',{img_casa: casa, jogo:req.session.jogo, msg:msg});
			});

			//fecha a conexão apos inserir 
			mongoclient.close();
		});
	});
}

// função que delega ações aos súditos
JogoDAO.prototype.acoes = function(acoes){
	this._connection.open(function(err, mongoclient){
		mongoclient.collection("acoes", function(err, collection){
			// instanciando obj Date do JS
			var date = new Date();
			var tempo = null;
			switch(parseInt(acoes.acoes)){
				case 1: tempo = 1 * 60 * 60000; 
					break;

				case 2: tempo = 2 * 60 * 60000; 
					break;

				case 3: tempo = 5 * 60 * 60000; 
					break;

				case 4: tempo = 5 * 60 * 60000; 
					break;
			}

			/* criando um campo chamado acao_termina_em e attrb o tempo atual atraves da func getTime 
			do obj Date() em ms mais tempo calculado a cima */
			acoes.acoes_termina_em = date.getTime() + tempo;

			// inserindo os dados das acoes no documento
			collection.insert(acoes);
		});


		mongoclient.collection("jogo", function(err, collection){
			var moedas = null;
			switch(parseInt(acoes.acoes)){
				case 1: moedas = -2 * acoes.aldeoes;
				break;

				case 2: moedas = -3 * acoes.aldeoes;
				break;

				case 3: moedas = -1 * acoes.aldeoes;
				break;

				case 4: moedas = -1 * acoes.aldeoes;
				break;
			}

			// atualizando os dados jogo no documento
			collection.update({usuario: acoes.usuario},{$inc:{moeda: moedas} } );

			//fecha a conexão apos inserir 
			mongoclient.close();
		});

	});
}

// função que recupera as ações delegadas e exibe na pag pergaminhos com tempo restante para ação ser concluida
JogoDAO.prototype.getAcoes = function(usuario, res){
	var date = new Date();
	var momento_atual = date.getTime();
	this._connection.open(function(err, mongoclient){
		mongoclient.collection("acoes", function(err, collection){
			// buscando os dados do usuario no documento passando um json
			collection.find({
				usuario: usuario,
				acoes_termina_em: {$gt: momento_atual} ,
			//convertento result em array 
			}).toArray(function(err, result){

				res.render('pergaminhos',{acoes:result});
				// res.render('pergaminhos',{img_casa: casa, jogo:req.session.jogo, sucesso:{msg:sucesso}});

			});

			//fecha a conexão apos inserir 
			mongoclient.close();
		});
	});
}

// função que revoga (remove ) as ordens aos suditos 
JogoDAO.prototype.revogaOrdem = function(id, res){
	this._connection.open(function(err, mongoclient){
		mongoclient.collection("acoes", function(err, collection){
			// removendo documento cujo a chave _id coicide com o object _id passado
			collection.remove(
				//utilizando a função incluída na linha 3, para converter a string para object para efetuar a comparação
				{_id: ObjectID(id)}, 
				function(err, result){
					// redirecionando para a pagina jogo passando msg como parametro
					res.redirect("jogo?msg=Ordem revogada com sucesso");
					//fecha a conexão 
					mongoclient.close();
				}
			);
		});
	});
}

module.exports = function(){
	return JogoDAO;
}
