import { openDB, deleteDB, wrap, unwrap } from 'idb';

/*

RESOURCES!!!
https://github.com/K0H205/Nuxt.js-indexedDB-PWA/blob/306df0cbc66f2785fbc88ada85ced1777fd7efb4/assets/word-db.js => example code
https://itnext.io/indexeddb-your-second-step-towards-progressive-web-apps-pwa-dcbcd6cc2076 => PWA and Indexed DB concept
https://developers.google.com/web/ilt/pwa/live-data-in-the-service-worker => google example
https://dev.to/adrienshen/indexeddb-with-push-notifications-aei => indexDB and push notifications overview
https://medium.com/the-web-tub/build-a-pwa-using-workbox-2eda1ef51d88 => PWA with Workbox
https://medium.com/@mario.brendel1990/vuejs-pwa-and-indexeddb-74e6b9699cef => the one with the cute flowchart!

*/

//replace with the idb module or put it all in the store?
class todosDB {
    static get DB_NAME() {
      return 'todos-db';
    }
    static get ALL_TODOS_STORE(){
        return 'all-todos';
    }
    static get CURR_TODO(){
        return 'curr-todo';
    }

    getError(){
        return new Promise((resolve, reject) => {
            resolve(this);
        });
    }

    connect() { //make a new DB and stores, return a promise
        if(window.indexedDB){
            return openDB( todosDB.DB_NAME, 1,{
                upgrade(db){
                    console.log("making a new object store");
                    if(!db.objectStoreNames.contains(todosDB.ALL_TODOS_STORE)) {
                        db.createObjectStore(todosDB.ALL_TODOS_STORE, {keyPath: 'id'});
                    }
                    if(!db.objectStoreNames.contains(todosDB.CURR_TODO)){
                        db.createObjectStore(todosDB.CURR_TODO, {keyPath: 'id'});
                    }
                }
            });
        }
        else{
            console.log("Browser doesnt support indexedDB");
            return this.getError();
        }
    }
    setCookie(){
        //put the cookie in the DB
    }
    // getTransaction(stores, readWrite = 'readwrite') {
    //   return this.db.transaction(stores, readWrite)
    // }
    
    // async getAll() {
    //   return new Promise((resolve, reject) => {
    //     let words = []
    //     const store = this.getWordsStore()
    //     store.openCursor().onsuccess = event => {
    //       let cursor = event.target.result
    //       if (cursor) {
    //         words.push(cursor.value)
    //         cursor.continue()
    //       }
    //       resolve(words)
    //     }
    //     store.openCursor().onerror = () => {
    //       reject(this)
    //     }
    //   })
    // }
    
    //add current Todo
    addCurrTodo(payload){
        this.add('curr-todo', payload, 'currentTodo');
    }
    //update current todo
    updateCurrTodo(payload){
        this.put(payload, 'currentTodo');
    }

}
//     async put(work) {
//       return new Promise((resolve, reject) => {
//         const req = this.getWordsStore().put(work)
//         req.onsuccess = () => {
//           resolve(work)
//         }
//         req.onerror = () => {
//           reject(this)
//         }
//       })
//     }
  
//     remove(wordId) {
//       this.getWordsStore().delete(wordId)
//     }
//   }
  
export default new todosDB()