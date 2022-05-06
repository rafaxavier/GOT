module.exports.index = function(application, req, res){
	res.render('index', {validacao:'',dados:''});
}

module.exports.autenticar = function(application, req, res){
	
	var formData = req.body;

	// validando dados da requisição
	req.assert('usuario','Usuário não deve ser vazio').notEmpty();
	req.assert('senha','Senha não deve ser vazio').notEmpty();

	// recuperando erros de validação
	var erros = req.validationErrors();

	if(erros){
		res.render('index',{validacao:erros, dados:formData});
		return;
	}

	var connection = application.config.dbConnection;

	var UsuariosDAO = new application.app.models.UsuariosDAO(connection);
	UsuariosDAO.autenticar(formData, req, res);
}