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
    state.loggedIn = localStorage.getItem('login'); //set local storage
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
    state.todos = payload;
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
        fetch('/api/addTask', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
          .then(res => res.json())
          .then(res => {
            if (res.status === 1) {
              //add to indexed db with response
              const tx = db.transaction('all-todos', 'readwrite');
              tx.store.add(f)
                .then(() => {
                  tx.objectStore('all-todos').getAll().then(data => {
                    commit('ADD', data);
                  })
                })
                .then(() => tx.done)
            }
          })
          .catch(err => {
            //no connection add to indexed db with user data
            db.add({ id: f.id, results: f }).then(() => commit('ADD', f));
          })
      }).catch(err => console.log(err));
  },
  addNibble({ commit }, payload) {
    console.log("adding nibble: ", payload);
    return;
  },
  delete({ commit }, payload) {
    let deletedList = deleteTask(this.state.todos, payload);
    todosDb.connect()
      .then(db => {
        db.delete('all-todos', payload.id)
          .then(() => commit('DELETE', deletedList));
      })
      .then(() => {
        fetch(`/api/delete?id=${payload.id}`).catch(err => console.log("Offline, or deletion error in PG: ", err))
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
        .then(res => res.json()).catch(err => console.log(err))
      })
      .then(() => {
        commit('UPDATE', updatedList);
      });
    }).catch(err => console.log('couldnt set todo: ', err));
  },
  getAllTodos({ commit }) {
    fetch('/api/getEverything')
      .then(res => res.json())
      .then(res => {
        if (res.status === 1) {
          commit('GET_ALL_TODOS', res.results); //commit the resposnse from server
          return res.results;
        }
      })
      .then(results => {
        todosDb.connect()
          .then(db => {
            const tx = db.transaction('all-todos', 'readwrite');
            tx.objectStore('all-todos').clear().then(() => {
              //delte old contents and batch insert the array
              for (let i = 0; i < results.length; i++) {
                tx.store.add(results[i]);
              }
            })
              .then(() => {
                tx.done;
              }).catch(err => console.log("Error adding all todos to IDB: ", err));
          }).catch(err => console.log("error connecting to IDB ", err));
      })
      .catch(err => { //offline request handler => set state.todos to the IDB
        console.log("Offline, couldn't fetch, setting state to whats in IDB");
        todosDb.connect()
          .then(db => {
            const tx = db.transaction('all-todos', 'readwrite');
            tx.objectStore('all-todos').getAll().then(res => {
              commit('GET_ALL_TODOS', res);
            })
              .then(() => tx.done);
          });
      });
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
    localStorage.setItem('login', 'false');
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
