function UsuariosDAO(connection){
	this._connection = connection();
}

UsuariosDAO.prototype.inserirUsuario = function(usuario){
	this._connection.open(function(err, mongoclient){
		mongoclient.collection("usuarios", function(err, collection){
			// inserindo os dados do usuario no documento
			collection.insert(usuario);

			//fecha a conexão apos inserir 
			mongoclient.close();
		});
	});
}

UsuariosDAO.prototype.autenticar = function(usuario, req, res){
	this._connection.open(function(err, mongoclient){
		mongoclient.collection("usuarios", function(err, collection){
			// buscando os dados do usuario no documento passando um json
			collection.find({
				usuario: {$eq: usuario.usuario},
				senha: {$eq: usuario.senha}
			//convertento result em array 
			}).toArray(function(err, result){

				// se resultado for diferente de indefinido
				if(result[0] != undefined){
					// cria uma variavel de sessão 
					req.session.autorizado = true;
					req.session.usuario = result[0].usuario;
					req.session.casa = result[0].casa;
				}

				if(req.session.autorizado){
					res.redirect('jogo');
				}else{

					res.render("index",{validacao:{}});
				}
			});

			//fecha a conexão apos inserir 
			mongoclient.close();
		});
	});
}

module.exports = function(){
	return UsuariosDAO;
}