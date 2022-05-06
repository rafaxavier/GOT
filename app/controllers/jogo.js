module.exports.jogo = function(application, req, res){
	if(req.session.autorizado !== true){
		res.send('Usuário precisa efetuar o login');
		return;
	}

	var connection = application.config.dbConnection;

	var JogoDAO = new application.app.models.JogoDAO(connection);
	var usuario = req.session.usuario;
	var casa = req.session.casa;
	var msg = req.query.msg;
	
	JogoDAO.iniciaJogo(usuario, casa, res, req, msg);

}

module.exports.sair = function(application, req, res){
	req.session.destroy(function(err){
		res.render('index',{dados:{}, validacao:{}});
	});
	
}

module.exports.suditos = function(application, req, res){
	if(req.session.autorizado !== true){
		res.send('Usuário precisa efetuar o login');
		return;
	}
	res.render('aldeoes');
	
}

module.exports.pergaminhos = function(application, req, res){
	if(req.session.autorizado !== true){
		res.send('Usuário precisa efetuar o login');
		return;
	}

	var connection = application.config.dbConnection;

	var JogoDAO = new application.app.models.JogoDAO(connection);

	var usuario = req.session.usuario;
	JogoDAO.getAcoes(usuario, res);	
	
}

// função que controla a requisição para add uma nova ação para os suditos
module.exports.acoes = function(application, req, res){
	if(req.session.autorizado !== true){
		res.send('Usuário precisa efetuar o login');
		return;
	}
	// recuperando dados salvos nas variaveis de sessão
	var usuario = req.session.usuario;
	var casa = req.session.casa;
	var jogo = req.session.jogo;
	// recuperando dados preenchidos no formulário
	var dadosForm = req.body;

	// validando dados do formulario
	req.assert('acoes','selecione uma ação').notEmpty();
	req.assert('aldeoes','Insira quantidade de aldeoes').notEmpty();

	var erros = req.validationErrors();

	if(erros){
		res.render('jogo', {img_casa:casa, jogo:jogo,  validacao:erros});
		return;
	}

	var connection = application.config.dbConnection;

	var JogoDAO = new application.app.models.JogoDAO(connection);
	// incluindo mais uma chave no Json para incluir o usuário
	dadosForm.usuario = usuario;
	JogoDAO.acoes(dadosForm);

	// redirecionando para a rota jogo com msg como parametro
	res.redirect('jogo?msg=Ação efetuada com sucesso');
	
}

// função que revoga as ordens para suditos
module.exports.revogar = function(application, req, res){
	if(req.session.autorizado !== true){
		res.send('Usuário precisa efetuar o login');
		return;
	}
	// recebendo o id do documento a ser apagado
	var id = req.query.id;
	var connection = application.config.dbConnection;
	var JogoDAO = new application.app.models.JogoDAO(connection);
	JogoDAO.revogaOrdem(id, res);
	// console.log(id);
	
}
