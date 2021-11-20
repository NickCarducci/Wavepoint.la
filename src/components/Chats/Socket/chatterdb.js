/*import PouchDB from "pouchdb";

export default class CDB {
  constructor(name) {
    this.db = new PouchDB("react-chats");
  }
  async getAllNotes() {
    let allNotes = await this.db
      .allDocs({ include_docs: true })
      .catch((err) => console.log(err.message));
    let messages = {};

    allNotes.rows.map((n) => (messages[n.id] = n.doc));
    //console.log(allNotes)
    //console.log(messages);
    //messages = {first}
    return messages;
  }

  async saveChat(note) {
    const createdAt = new Date().getTime();
    const updatedAt = new Date().getTime();
    note.createdAt = createdAt;
    note.updatedAt = updatedAt;
    const res = await this.db
      .post({
        note
      })
      .catch((err) => console.log(err.message));

    return res;
  }
  async updateNote(message) {
    message.updatedAt = new Date();

    const res = await this.db
      .put({ ...message })
      .catch((err) => console.log(err.message));
    return res;
  }

  async deleteNote(message) {
    await this.db.remove(message).catch((err) => console.log(err.message));
  }
}
*/
