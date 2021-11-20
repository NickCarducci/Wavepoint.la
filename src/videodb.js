import PouchDB from "pouchdb";

export default class VDB {
  constructor(name) {
    this.db = new PouchDB("videos");
  }
  async getAllNotes() {
    let allNotes = await this.db
      .allDocs({ include_docs: true })
      .catch((err) => console.log(err.message));
    let notes = {};

    allNotes.rows.forEach((n) => (notes[n.id] = n.doc));

    return notes;
  }

  async createNote(note) {
    note.createdAt = new Date();
    note.updatedAt = new Date();

    const res = note._id
      ? await this.db.put({ ...note }).catch((err) => console.log(err.message))
      : await this.db
          .post({ ...note })
          .catch((err) => console.log(err.message));

    return res;
  }
  async updateNote(note) {
    note.updatedAt = new Date();

    console.log(note);
    const res = await this.db
      .put({ ...note })
      .catch((err) => console.log(err.message));
    return res;
  }

  async deleteNote(note) {
    await this.db.remove(note).catch((err) => console.log(err.message));
  }
}
