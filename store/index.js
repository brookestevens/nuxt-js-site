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
    updateTask(state.todos, payload); //function to update local, save on requests being made
  },
  GET_SORTED_TODOS(state, payload){
    state.sort = localStorage.getItem('sort');
    state.todos = payload.data;
  },
  SET_CURRENT_ITEM(state, payload){
    state.currentToDo = payload;
  },
  DELETE(state, payload){
    deleteTask(state.todos, payload); //function to delete local, save on requests being made
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
    commit('DELETE', payload);
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
    commit('SET_CURRENT_ITEM', payload);
    todosDb.connect().then(db => {
      console.log(db);
      db.add('curr-todo', payload).catch(err => console.log("error adding to db: ", err));
    }).catch(err => console.log("error connecting to DB: ", err));
  },
  update({commit}, payload){
    commit('UPDATE', payload);
    todosDb.connect().then(db => {
      db.put('curr-todo', payload).catch(err => console.log("error adding to db: ", err));
    }).catch(err => console.log("error connecting to DB: ", err));
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
        commit('GET_ALL_TODOS', res.results);
      }
    })
    .then(()=>{
      const db = todosDb.connect();
      db.then(() => console.log('new db conn')).catch(err => console.log(err));
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
      state.splice(state.indexOf(state[i]),1); //delete the index
      return;
    }
    else if(state[i].children.length > 0){
      deleteTask(state[i].children, payload);
    }
  }
}

function updateTask(state, payload){
  for(let i=0; i< state.length; i++ ){
    if(state[i].id === payload.id){
      console.log('state: ', {...state[i], ...payload} );
      state.splice(state.indexOf(state[i]),1, payload); //replace the whole object
      return;
    }
    else if(state[i].children.length > 0){
      updateTask(state[i].children, payload);
    }
  }
}
