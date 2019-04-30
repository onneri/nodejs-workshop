// dependencies
const _data = require('./data');
// define handlers
const handlers = {
  todos: function(data, callback){
    const acceptableMethods = ['post', 'get', 'put', 'delete'];
    if(acceptableMethods.indexOf(data.method) > -1){
      _todos[data.method](data, callback)
    }else{
      callback(405); // method not allowed
    }
  },
  notFound: function (data, callback) {
    callback(404);
  }
};

/** handlers.js */
const _todos = {
  // post
  post: function(data, callback){
    const id = typeof(data.payload.id) === 'string' && data.payload.id.trim().length > 0 ? data.payload.id : false;
    const todo = typeof(data.payload.todo) === 'string' && data.payload.todo.trim().length > 0 ? data.payload.todo : false;
    const done = false;

    if(id && todo)
      _data.read('todos', id, function(err){
        if(err)
          _data.create('todos', id, {id, todo, done}, function (err) {
            if (!err)
              callback(201);
            else callback(500, {'Error': 'Could not create todo'});
          });
        else callback(400, {'Error': 'todo with that id already exists'})
      });
    else callback(400, {'Error':'Missing fields'});
  },
  // get
  get: function(data, callback){
    const id = typeof(data.queryStringObject.id) === 'string' && data.queryStringObject.id.trim().length > 0 ? data.queryStringObject.id : false;

    if(id){
      _data.read('todos', id, function (err, data) {
        if(!err && data){
          callback(200, data);
        }else{
          callback(404);
        }
      });
    }else{
      callback(400, {'Error':'Missing required field'})
    }

  },
  // put
  put: function(data, callback){
    const id = typeof(data.payload.id) === 'string' && data.payload.id.trim().length > 0 ? data.payload.id : false;
    const todo = typeof(data.payload.todo) === 'string' && data.payload.todo.trim().length > 0 ? data.payload.todo : false;
    const done = typeof(data.payload.done) === 'boolean' ? data.payload.done : null;
    if(id)
      if(todo || done !== null)
        _data.read('todos', id, function(err, todoData){
          if(!err && todoData) {
            if (todo)
              todoData.todo = todo;
            if (done !== null)
              todoData.done = done;
            _data.update('todos', id, todoData, function (err) {
              if (!err)
                callback(200);
              else callback(500, {'Error': 'Could not update todo'});
              });
            } else {
              callback(400, {'Error': 'Specified todo does not exist'});
            }
          });
      else callback(400, {'Error': 'Missing fields to update'});
    else callback(400, {'Error':'Missing required field'});

  },
  // delete
  delete: function(data, callback){
    const id = typeof(data.queryStringObject.id) === 'string' && data.queryStringObject.id.trim().length > 0 ?		 data.queryStringObject.id : false;
    if(id)
      _data.read('todos', id, function (err, data) {
        if(!err && data)
          _data.delete('todos', id, function(err){
            if(!err)
              callback(200);
            else callback(500, {'Error': 'Could not delete specified todo'})
          });
        else callback(404, {'Error:': 'Could not find todo' });
      })
    else callback(400, {'Error':'Missing required field'});
  }
};


module.exports = handlers;
