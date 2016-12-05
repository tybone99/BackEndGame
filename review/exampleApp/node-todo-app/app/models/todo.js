// var mongoose = require('mongoose');

// mongoose.model('Todo', {
// 	text : String,
// 	done : Boolean
// });

// mongoose.find = function(){
// 	console.log('getting a list of things to do');
// 	return {text: 'wash car', done: false};
// }

// module.exports = mongoose.model('Todo', {
// 	text : String,
// 	done : Boolean
// });

//module.exports = mongoose;
var todos = [{_id: 1, text: 'wash car', done: false}];
module.exports = {
	
	find: function(callback){
		console.log('returning a list of things to do');
		callback(null, todos );
	},
	create: function(todo, callback){
		console.log('adding a new todo item :' + todo.text + ' done :'+ todo.done);
		var len = todos.length;
		todo._id = len;
		todos.push(todo);
		callback(null, todos );
	},
	remove: function(ids, callback)
	{
		console.log( ids );
		callback(null, todos );
	}
};
