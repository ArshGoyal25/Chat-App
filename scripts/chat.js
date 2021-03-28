// adding new chat documents
// setting up a real-time listener to get new chats
// updating the username
// updating the room

class Chatroom{
    constructor(room,username){
        this.room = room;
        this.username = username;
        this.chats = db.collection('chats');
        this.unsub;
    }

    async addChat(message){
        const now = new Date();
        const chat = {
            message,
            username : this.username,
            room : this.room,
            created_at : firebase.firestore.Timestamp.fromDate(now)
        };

        const response = await this.chats.add(chat);
        return response;
    }

    getChats(callback){
        this.unsub = this.chats
            .where('room' , '==' , this.room)
            .orderBy('created_at')
            .onSnapshot(snapshot =>{
                //console.log(snapshot.docChanges());
                snapshot.docChanges().forEach(change => {
                    console.log(change);
                    if(change.type === 'added')
                        callback(change.doc.data());
                });
            });
    }

    updateName(username){
        this.username = username;
        localStorage.setItem('username' , username)
    }

    updateRoom(room){
        this.room = room;
        console.log("room updated");
        if(this.unsub){
            this.unsub();
        }
    }

}

// const chatroom = new Chatroom('gaming','shaun');

// chatroom.addChat('Hello everyone')
//     .then(() => console.log('chat added'))
//     .catch(err => console.log(err));

// chatroom.getChats(data => {
//     console.log(data);
// });

// setTimeout(() => {
//     chatroom.updateRoom('general');
//     chatroom.updateName('yoshi');
//     chatroom.getChats(data => console.log(data));
//     chatroom.addChat('hello');
//   }, 3000);