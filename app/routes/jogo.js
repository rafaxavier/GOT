module.exports = function(application){
	application.get('/jogo', function(req, res){
		application.app.controllers.jogo.jogo(application, req, res);		
	});

	application.get('/sair', function(req, res){
		application.app.controllers.jogo.sair(application, req, res);		
	});

	application.get('/suditos', function(req, res){
		application.app.controllers.jogo.suditos(application, req, res);		
	});

	application.get('/pergaminhos', function(req, res){
		application.app.controllers.jogo.pergaminhos(application, req, res);		
	});

	application.post('/acoes', function(req, res){
		application.app.controllers.jogo.acoes(application, req, res);		
	});

	application.get('/revogar_ordem', function(req, res){
		application.app.controllers.jogo.revogar(application, req, res);		
	});
}
