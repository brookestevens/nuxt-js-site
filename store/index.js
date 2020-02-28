import todosDb from '../assets/openIndexDB';
const check = String.fromCharCode(9989);
const cancel = String.fromCharCode(0x274C);

export const state = () => ({
  todos: [], //indexDB
  currentToDo: null, //indexDB
  taskInProgress: 'false',
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
  },
  TOGGLE_TASK(state){
    state.taskInProgress = localStorage.getItem('taskInProgress');
  }
}

export const actions = {
  addTodo({ commit }, payload) {
    // format payload to what indexed db wants
    let format = pgToIDB(payload);
    console.log('Payload: ', payload);
    //console.log('Formatting', pgToIDB(payload)); //if the added task has sub tasks, then children need to be formatted
    todosDb.connect()
      .then(db => {
        //add to indexed db with response
        const tx = db.transaction('all-todos', 'readwrite');
        tx.store.add(format)
        .then(() => commit('ADD', format))
        .then(() => tx.done)
        .then(() =>{
          fetch('/api/addTask', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
          .catch(err => console.error("Error adding to PG: ", err))
        })
      }).catch(err => console.error(err)); //idb not available
  },
  addSingleTask({commit}, payload){
      todosDb.connect()
      .then(db => {
        //add to indexed db with response
        const tx = db.transaction('all-todos', 'readwrite');
        // need to format this for IDB
        let f = {...payload, id: "tempID-" + Math.floor(Math.random() * 100000), status: false, children: []}
        tx.store.add(f)
        .then(() => commit('ADD', f))
        .then(() => tx.done)
        .then(() =>{
          fetch('/api/addSingleTask', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
          .catch(err => console.error("Error adding to PG: ", err))
        })
      }).catch(err => console.error(err)); //idb not available
  },
  //want to update the task index and delete
  delete({ commit }, payload) {
    return todosDb.connect().then(db => {
        const tx = db.transaction('all-todos', 'readwrite');
        tx.objectStore('all-todos').getAll()
        .then(results => {
          deleteTask(results, payload);
          commit('DELETE', results); //REPLACE THE WHOLE ARRAY
          console.log(check + " Deleted array: ", results );
          let result = results.filter(i => i.id === payload.taskID);
          return {
            idToDelete: payload.id,
            taskID: payload.taskID,
            index: result[0] //for replacement
          };
        })
        .then( ids => {
          if(ids.idToDelete.substring(0,4) === 'task' ){
            console.log("DELETE THE WHOLE INDEX");
            tx.store.delete(ids.taskID);
          }
          else{
            console.log("updating the index instead with: ", ids.index);
            tx.store.put(ids.index);
          }
        })
        .then(() => tx.done )
        .then(() => {
            fetch('/api/delete', {method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({id: payload.id})})
            .catch(err => console.error("Offline, or deletion error in PG: ", err))
        })
      })
      .catch(err => console.error("Error deleting: ", err));
  },
  setCurrentItem({ commit }, payload) {
    return todosDb.connect().then(db => {
      db.add('curr-todo', payload)
        .catch(err => db.put('curr-todo', payload))
    })
      .then(() => commit('SET_CURRENT_ITEM', payload))
      .catch(err => console.error('couldnt set todo: ', err));
  },
  update({ commit }, payload) {
    todosDb.connect().then(db => {
      const tx = db.transaction('all-todos', 'readwrite');
      tx.objectStore('all-todos').getAll()
      .then(results => {
        updateTask(results, payload.form);
        commit('UPDATE', results); //REPLACE THE WHOLE ARRAY
        console.log(check + " UPDATED ARRAY: ", results);
        console.log(check + " updating this index: ", payload.taskID);
        //need to find the updated index
        let result = results.filter(i => i.id === payload.taskID);
        return result[0]; // only 1 index because the index is always UNIQUE
      })
      .then(result => tx.store.put(result))
      .then(() => tx.done)
      .then(() => {
        // SEND TO SERVER 
        fetch('/api/updateTask', {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(payload)})
        .then(res => res.json())
        .catch(err => console.log("Offline or PG update error: ", err)); //network error, background sync
      })
    }).catch(err => console.error('couldnt set todo: ', err));
  },
  getAllTodos({ commit }) {
    fetch('/api/getEverything') //this route is intercepted by SW
      .then(res => res.json())
      .then(res => {
        console.log(check + " Server response: ", res.results);
        commit('GET_ALL_TODOS', res.results); //set state to either server / IDB response
        return res;
      })
      .then(res => {
        if (res.responseCode === 1) {
          todosDb.connect().then(db => {
            const tx = db.transaction('all-todos', 'readwrite');
            tx.objectStore('all-todos').clear().then(() => {
              // Delete old contents and batch insert the array
              // Inserting in order is not reliable for some reason...
              for(let i=0; i< res.results.length; i++){
                tx.store.add(res.results[i]).catch(err => console.error(err));
              }
            }).then(() => tx.done) //close the transaction
          })
          .catch(err => console.error("Error adding all todos to IDB: ", err));
        }
        else if(res.responseCode === 2){
          // no need to update IDB
          console.log("Data came from IDB, not updating");
        }
      }).catch(err => console.error(err));
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
          }).catch(err => console.error(err))
        return;
      case 'priority':
        fetch('/api/getPriorityList')
          .then(res => res.json())
          .then(res => {
            if (res.status === 1) {
              commit('GET_SORTED_TODOS', { data: res.results, option: payload });
            }
          }).catch(err => console.error(err))
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
        console.error("Error: ", err);
      });
  },
  logout({ commit }) {
    commit('LOGOUT');
  },
  toggleTask({commit}){
    let s = !JSON.parse(this.state.taskInProgress);
    localStorage.setItem('taskInProgress', s.toString());
    commit('TOGGLE_TASK');
  },
  changeView({ commit }) {
    let s = !JSON.parse(this.state.dark);
    localStorage.setItem('dark', s.toString());
    commit('DARK_MODE');
  }

}

//format the data for IDB, also how PG returns data to client
function pgToIDB(payload) {
  let copy = { //format the task
    name: payload.name,
    id: "tempID-" + Math.floor(Math.random() * 100000), 
    status: false,
    children: []
  };

  //format the nibbles
  function findNibble(name){
    let n = [];
    let copyN = [...payload.nibbles];
    if(payload.nibbles.length === 0){
      return n;
    }
    console.log("name: ", name);
    console.log("nibble array: ", copyN);
    //use filter array method? 
    for(let i=0; i< copyN.length; i++){
      console.log(copyN[i]);
      if(copyN[i].subtask_name === name){
        console.log('matched');
        n.push({
          id: "tempID-" + Math.floor(Math.random() * 100000),
          name: copyN[i].nibble_name,
          status: false,
          children: []
        });
      }
      else{
        console.log('no match');
      }
    }
    return n;
  }
  
  if(payload.subtasks.length > 0) {
    //add in the subtasks if exists
    for(let i = 0; i < payload.subtasks.length; i++) {
      let n = findNibble(payload.subtasks[i].subtask_name); //find nibble if exists
      // properties needed: id, name, status, children
      copy.children.push({
        id: "tempID-" + Math.floor(Math.random() * 100000),
        name: payload.subtasks[i].subtask_name,
        status: false,
        children: n
      });
    }
  }
  return copy;
}

//Depth first serach => no early break from recursion
//Delete the specified index

function deleteTask(s, payload) {
  // console.log("looking for ID: ", payload.id);
  for (let i = 0; i < s.length; i++) {
    if (s[i].id === payload.id) {
      s.splice(s.indexOf(s[i]), 1); //remove
      return;
    }
    else if (s[i].children.length > 0) {
      deleteTask(s[i].children, payload);
    }
  }
}

function updateTask(state, form ) {
  // console.log("FORM: ", form);
  for (let i = 0; i < state.length; i++) {
    if (state[i].id === form.id) {
      console.log(check + "updating found id: ", state[i].id);
      state.splice(state.indexOf(state[i]), 1, form); //replace the whole object
      return;
    }
    else if (state[i].children.length > 0) {
      updateTask(state[i].children, form);
    }
  }
}