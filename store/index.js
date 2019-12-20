export const state = () => ({
  todos: [],
  currentToDo: {},
  loggedIn: false
})

export const mutations = {
  ADD_TODO(state, text) {
    state.todos.push({
      text,
      done: false
    })
  },
  REMOVE_TODO(state, { todo }) {
    state.todos.splice(state.todos.indexOf(todo), 1)
  },
  UPDATE_TODO(state){
    console.log("its working!");
  },
  GET_ALL_TODOS(){
    console.log("its working!");
  },
  ADD_USER(state, payload){
    console.log(payload);
    fetch('api/addUser', {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(payload)})
    .then(res => res.json())
    .then(res => {
      if(JSON.parse(res.status) === 1){
        console.log(res.message);
      }
    })
    .catch(err => console.log("Error: ", err));
  },
  LOGIN(state, payload){
    console.log(payload);
    fetch('api/login', {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(payload)})
    .then(res => res.json())
    .then(res => {
      if(JSON.parse(res.status) === 1){
        state = {...state, loggedIn: true}
      }
    })
    .catch(err => {
      console.log("Error: ", err);
    });
  }
}
