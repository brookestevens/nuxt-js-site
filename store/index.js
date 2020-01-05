import todosDb from '../assets/openIndexDB';

export const state = () => ({
  todos: [], //indexDB
  currentToDo: {}, //indexDB
  loggedIn: 'false', //localstorage
  sort: 'all', //localstorage
  dark: 'false' //localstorage
})

export const mutations = {
  GET_ALL_TODOS(state, payload){
    state.todos = payload;
    state.sort = 'all';
  },
  LOGIN(state){
    state.loggedIn = localStorage.getItem('login'); //set local storage
  },
  LOGOUT(state){
    state.loggedIn = localStorage.getItem('login'); //set local storage
  },
  UPDATE(state, payload){
    state.todos = payload;
  },
  GET_SORTED_TODOS(state, payload){
    state.sort = localStorage.getItem('sort');
    state.todos = payload.data;
  },
  SET_CURRENT_ITEM(state, payload){
    state.currentToDo = payload;
  },
  DELETE(state, payload){
    state.todos = payload; 
  },
  ADD(state, payload){
    state.todos = payload;
  },
  DARK_MODE(state){
    state.dark = localStorage.getItem('dark');
  }
}

export const actions = {
  addTodo({commit}, payload) {
    console.log(payload);
    // fetch('/api/addTask', {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(payload)})
    // .then( res => res.json())
    // .then( res => {
    //   if(res.status === 1){
    //     return this.getSortedTodos(this.state.sort);
    //   }
    // })
    // .then(data => data.json())
    // .then(data => commit('ADD', data.results))
    // .catch(err => console.log(err))
  },
  delete({commit}, payload) {
    let deletedList = deleteTask(this.state.todos, payload);
    todosDb.connect()
    .then(db => {
      db.put('all-todos', {name: "all-todos",  results: deletedList})
      .then(() =>  commit('DELETE', deletedList));
    })
    .catch(err => console.log("Error deleting: ", err));
    // fetch(`/api/delete?id=${payload.id}`)
    // .then(res => res.json())
    // .then(res => {
    //   if(res.status === 1){
    //     commit('DELETE', payload);
    //   }
    // })
    // .catch(err => console.log(err))
  },
  setCurrentItem({commit}, payload){
    todosDb.connect().then(db => {
      db.add('curr-todo', payload)
      .then(() => commit('SET_CURRENT_ITEM', payload))
      .catch(err => db.put('curr-todo', payload))
    })
    .catch(err => console.log('couldnt set todo: ', err));
  },
  update({commit}, payload){
    let updatedList = updateTask(this.state.todos, payload); 
    todosDb.connect().then(db => {
      db.put('all-todos', {name: "all-todos",  results: updatedList}).then(() =>{
        commit('UPDATE', updatedList);
      });
    })
    .catch(err => console.log('couldnt set todo: ', err));
    // fetch('/api/updateTask', {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(payload)})
    // .then(res => res.json())
    // .then(res => {
    //   if(res.status === 1){
    //     commit('UPDATE', payload)
    //   }
    // })
    // .catch(err => console.log(err))
  },
  getAllTodos({commit}){
    fetch('/api/getEverything')
    .then(res => res.json())
    .then(res => {
      if(res.status === 1){
        return res.results;
      }
    })
    .then( results =>{
        todosDb.connect()
        .then( db => {
          const tx = db.transaction('all-todos', 'readwrite');
          tx.objectStore('all-todos').get('all-todos').then(res => {
            if(res === undefined){
              tx.store.add({name: "all-todos", results : results})
              commit('GET_ALL_TODOS', results);
            }
            else{
              commit('GET_ALL_TODOS', res.results);
            }
          })
          .then(() => tx.done)
          .catch(err => console.log(err));
        })
        .catch(err => console.log("error adding all todos: ", err));
    })
    .catch(err => console.log(err))
  },
  getSortedTodos({commit},payload){
    localStorage.setItem('sort', payload);
    switch(payload){
      case 'all':
        this.getAllTodos();
        return;
      case 'recent':
        fetch('/api/getFirstDueList')
        .then(res=>res.json())
        .then(res=> {
          if(res.status === 1){
            commit('GET_SORTED_TODOS', {data: res.results, option: payload});
          }
        }).catch(err => console.log(err))
        return;
      case 'priority':
        fetch('/api/getPriorityList')
        .then(res=>res.json())
        .then(res=> {
          if(res.status === 1){
            commit('GET_SORTED_TODOS', {data: res.results, option: payload});
          }
        }).catch(err => console.log(err))
        return;
      default:
        return null;
    }
  },
  login({commit}, payload){
      return fetch('api/login', {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(payload)})
      .then(res => res.json())
      .then(res => {
        if(res.status === 1){
          localStorage.setItem('login', 'true');
          commit('LOGIN');
        }
        return res.status;
      })
      .catch(err => {
        console.log("Error: ", err);
      });
  },
  logout({commit}){
    localStorage.setItem('login', 'false');
    commit('LOGOUT');
  },
  changeView({commit}){
    let s = !JSON.parse(this.state.dark);
    localStorage.setItem('dark', s.toString());
    commit('DARK_MODE');
  }

}

function deleteTask(state, payload){
  for(let i=0; i< state.length; i++ ){
    if(state[i].id === payload.id){
      let copy = [...state];
      copy.splice(state.indexOf(state[i]),1); //delete the index
      return copy;
    }
    else if(state[i].children.length > 0){
      deleteTask(state[i].children, payload);
    }
  }
}

function updateTask(state, payload){
  for(let i=0; i< state.length; i++ ){
    if(state[i].id === payload.id){
      let copy = [...state];
      copy.splice(state.indexOf(state[i]),1, payload); //replace the whole object
      return copy;
    }
    else if(state[i].children.length > 0){
      updateTask(state[i].children, payload);
    }
  }
}
