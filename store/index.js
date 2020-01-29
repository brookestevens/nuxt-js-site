import todosDb from '../assets/openIndexDB';

export const state = () => ({
  todos: [], //indexDB
  currentToDo: {}, //indexDB
  loggedIn: 'false', //localstorage
  sort: 'all', //localstorage
  dark: 'false' //localstorage
})

export const mutations = {
  GET_ALL_TODOS(state, payload) {
    state.todos = payload;
    state.sort = 'all';
  },
  LOGIN(state) {
    state.loggedIn = localStorage.getItem('login'); //set local storage
  },
  LOGOUT(state) {
    localStorage.setItem('login', 'false');
    state.loggedIn = 'false'; //set local storage
  },
  UPDATE(state, payload) {
    state.todos = payload;
  },
  GET_SORTED_TODOS(state, payload) {
    state.sort = localStorage.getItem('sort');
    state.todos = payload.data;
  },
  SET_CURRENT_ITEM(state, payload) {
    state.currentToDo = payload;
  },
  DELETE(state, payload) {
    state.todos = payload;
  },
  ADD(state, payload) {
    state.todos.push(payload);
  },
  DARK_MODE(state) {
    state.dark = localStorage.getItem('dark');
  }
}

export const actions = {
  addTodo({ commit }, payload) {
    //format payload to what indexed db wants
    let f = { ...payload, id: "tempID-" + Math.floor(Math.random() * 100000), status: false }; //add these 2 props for IDB
    f = pgToIDB(f); //if the added task has sub tasks, then children need to be formatted
    console.log(f);
    todosDb.connect()
      .then(db => {
        //add to indexed db with response
        const tx = db.transaction('all-todos', 'readwrite');
        tx.store.add(f)
        .then(() => commit('ADD', f))
        .then(() => tx.done)
        .then(() =>{
          fetch('/api/addTask', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
          .catch(err => console.log("Error adding to PG: ", err))
        })
      }).catch(err => console.log(err));
  },
  addNibble({ commit }, payload) {
    console.log("adding nibble: ", payload);
    return;
  },
  delete({ commit }, payload) {
    let deletedList = deleteTask(this.state.todos, payload);
    todosDb.connect().then(db => {
        db.delete('all-todos', payload.id)
          .then(() => {
            fetch('/api/delete', {method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({id: payload.id})})
            .catch(err => console.log("Offline, or deletion error in PG: ", err))
          })
          .then(() => commit('DELETE', deletedList));
      })
      .catch(err => console.log("Error deleting: ", err));
  },
  setCurrentItem({ commit }, payload) {
    todosDb.connect().then(db => {
      db.add('curr-todo', payload)
        .catch(err => db.put('curr-todo', payload))
    })
      .then(() => commit('SET_CURRENT_ITEM', payload))
      .catch(err => console.log('couldnt set todo: ', err));
  },
  update({ commit }, payload) {
    let updatedList = updateTask(this.state.todos, payload);
    todosDb.connect().then(db => {
      db.put('all-todos', payload)
      .then(() => {
        fetch('/api/updateTask', {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(payload)})
        .then(res => res.json()).catch(err => console.log("Offline or PG update error: ", err)); //network error, background sync
      })
      .then(() => {
        commit('UPDATE', updatedList);
      });
    }).catch(err => console.log('couldnt set todo: ', err));
  },
  getAllTodos({ commit }) {
    fetch('/api/getEverything') //this route is intercepted by SW
      .then(res => res.json())
      .then(res => {
        commit('GET_ALL_TODOS', res.results); //set state to either server / IDB response
        return res;
      })
      .then(res => {
        if (res.status === 1) { //if the response came back from the network, update state
          todosDb.connect().then(db => {
            const tx = db.transaction('all-todos', 'readwrite');
            tx.objectStore('all-todos').clear().then(() => {
              //delete old contents and batch insert the array
              for (let i = 0; i < res.results.length; i++) {
                tx.store.add(res.results[i]);
              }
            }).then(() => tx.done) //close the transaction
          })
          .catch(err => console.log("Error adding all todos to IDB: ", err));
        }
        else if(res.status === 2){
          // no need to update IDB
          console.log("Data came from IDB, not updating");
        }
      }).catch(err => console.log(err));
  },
  getSortedTodos({ commit }, payload) {
    localStorage.setItem('sort', payload);
    switch (payload) {
      case 'all':
        this.getAllTodos();
        return;
      case 'recent':
        fetch('/api/getFirstDueList')
          .then(res => res.json())
          .then(res => {
            if (res.status === 1) {
              commit('GET_SORTED_TODOS', { data: res.results, option: payload });
            }
          }).catch(err => console.log(err))
        return;
      case 'priority':
        fetch('/api/getPriorityList')
          .then(res => res.json())
          .then(res => {
            if (res.status === 1) {
              commit('GET_SORTED_TODOS', { data: res.results, option: payload });
            }
          }).catch(err => console.log(err))
        return;
      default:
        return null;
    }
  },
  login({ commit }, payload) {
    return fetch('api/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      .then(res => res.json())
      .then(res => {
        if (res.status === 1) {
          localStorage.setItem('login', 'true');
          commit('LOGIN');
        }
        return res.status;
      })
      .catch(err => {
        console.log("Error: ", err);
      });
  },
  logout({ commit }) {
    commit('LOGOUT');
  },
  changeView({ commit }) {
    let s = !JSON.parse(this.state.dark);
    localStorage.setItem('dark', s.toString());
    commit('DARK_MODE');
  }

}

//format the data's children array
function pgToIDB(payload) {
  let copy = { ...payload };
  if (copy.children.length > 0) {
    for (let i = 0; i < copy.children.length; i++) {
      // properties needed: id, name, desc, start, stop, status, children
      copy.children[i] = {
        id: "tempID-" + Math.floor(Math.random() * 100000),
        name: copy.children[i].subtask_name,
        desc: copy.children[i].subtask_desc,
        start: copy.children[i].subtask_start_date,
        end: copy.children[i].subtask_end_date,
        status: false,
        children: []
      }
    }
  }
  return copy;
}

function deleteTask(state, payload) {
  for (let i = 0; i < state.length; i++) {
    if (state[i].id === payload.id) {
      let copy = [...state];
      copy.splice(state.indexOf(state[i]), 1); //delete the index
      return copy;
    }
    else if (state[i].children.length > 0) {
      deleteTask(state[i].children, payload);
    }
  }
}

function updateTask(state, payload) {
  for (let i = 0; i < state.length; i++) {
    if (state[i].id === payload.id) {
      let copy = [...state];
      copy.splice(state.indexOf(state[i]), 1, payload); //replace the whole object
      return copy;
    }
    else if (state[i].children.length > 0) {
      updateTask(state[i].children, payload);
    }
  }
}
