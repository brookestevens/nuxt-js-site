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
    constructor(){
        this.db = null;
    }
    static get DB_NAME() {
        return 'todos-db';
    }
    static get ALL_TODOS_STORE(){
        return 'all-todos';
    }
    static get CURR_TODO(){
        return 'curr-todo';
    }
    static get TIMER(){
        return 'timer'
    }
    getError(){
        return new Promise((resolve, reject) => {
            reject(this);
        });
    }
    //already looged in
    async setTimerData(){
        try{
            let res = await fetch('/api/getUserTaskData');
            return res;
        }
        catch(Error){
            return Error;
        }
    }

    async connect() { //make a new DB and stores, return a promise
        if(window.indexedDB){
            this.db = await openDB( todosDB.DB_NAME, 1,{
                upgrade(db){
                    console.log("making a new object store");
                    if(!db.objectStoreNames.contains(todosDB.ALL_TODOS_STORE)) {
                        db.createObjectStore(todosDB.ALL_TODOS_STORE, {keyPath: 'id'});
                    }
                    if(!db.objectStoreNames.contains(todosDB.CURR_TODO)){
                        db.createObjectStore(todosDB.CURR_TODO, {keyPath: 'id'});
                    }
                    if(!db.objectStoreNames.contains(todosDB.TIMER)){
                        let objectStore = db.createObjectStore(todosDB.TIMER, {keyPath: 'name'});
                        //console.log(data); //should be the user data to init the table
                        objectStore.add({name: 'timeInt',  value: 25});
                        objectStore.add({name: 'goal',  value: 5});
                        objectStore.add({name: 'completed',  value: 0}); //this value is reset to 0 every day
                    }
                }
            });
            return this.db;
        }
        else{
            console.log("Browser doesnt support indexedDB");
            return this.getError();
        }
    }

}

export default new todosDB()