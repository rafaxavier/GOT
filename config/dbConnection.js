/* importando o modulo do mongoDB*/
var mongo = require('mongodb');

var connMongoDB = function(){
	console.log('conexão com banco de dados estabelecida');
	// instanciando a classe de conexão 'Db' que espera 3 param
	var db = new mongo.Db(
		//* nome do banco
		'got', 

		//** obj com param básico para conexao
		new mongo.Server(

			'localhost', //endereço do servidor do BD
			27017,       //porta de conexão   
			{}			 //opções de conf do servidor (opcional)	
		),

		//*** opções de conf do servidor (opcional)
		{} 
	);

	return db;
}


module.exports = function(){
	return connMongoDB;

}
