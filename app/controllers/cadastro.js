module.exports.cadastro = function(application,req, res){
	res.render('cadastro',{dados:''});
}

module.exports.cadastrar = function(application,req, res){
	var formData = req.body;

	req.assert('nome', 'Nome não pode ser vazio').notEmpty();
	req.assert('usuario', 'Usuário não pode ser vazio').notEmpty();
	req.assert('senha', 'Senha não pode ser vazio').notEmpty();
	req.assert('casa', 'Casa não pode ser vazio').notEmpty();

	var erros = req.validationErrors();

	if(erros){
		res.render('cadastro', {validacao:erros, dados:formData});
		return;
	}

	var connection = application.config.dbConnection;

	var UsuariosDAO = new application.app.models.UsuariosDAO(connection);
	UsuariosDAO.inserirUsuario(formData);

	// geração de parametros do jogo
	var JogoDAO = new application.app.models.JogoDAO(connection);
	JogoDAO.gerarParametroJogo(formData.usuario);

	res.render('welcome');

}