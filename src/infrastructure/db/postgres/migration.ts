import {createConnection, getConnectionManager} from "typeorm";

export const run = async () => {
  let connection;
  try {
    connection = getConnectionManager().get('default');
  } catch (error) {
    connection = await createConnection();
  }


  connection


  const result = await connection.runMigrations({
    transaction: "none",
  });
  await connection.close();
  return result;
}

export const revert = async () => {
  let connection;
  try {
    connection = getConnectionManager().get('default');
  } catch (error) {
    connection = await createConnection();
  }
  const result = await connection.undoLastMigration({
    transaction: "none",
  });
  await connection.close();
  return result;
}