class CommandRepository {
  constructor(dao) {
    this.dao = dao
  }

  createTable() {
    const sql = `
    CREATE TABLE IF NOT EXISTS commands (
      name TEXT PRIMARY KEY,
      value TEXT)`
    return this.dao.run(sql);
  }

  create(name, value) {
    return this.dao.run(
      `INSERT INTO commands (name, value)
        VALUES (?, ?)`,
      [name, value]);
  }

  update(command) {
    console.log(command);
    let name = command.commandName;
    let value = command.commandValue;
    return this.dao.run(
      `UPDATE commands
      SET value = ?
      WHERE name = ?`,
      [value, name]
    );
  }

  delete(name) {
    return this.dao.run(
      `DELETE FROM commands WHERE name = ?`,
      [name]
    );
  }

  getByName(name) {
    return this.dao.get(
      `SELECT * FROM commands WHERE name = ?`,
      [name]
    );
  }

  /*getAll() {
    return this.dao.all(`SELECT * FROM commands`);
  }*/
}

module.exports = CommandRepository;