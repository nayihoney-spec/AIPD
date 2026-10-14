const { Pool } = require("pg");
const mysql = require("mysql2/promise");

const dialect = (process.env.DB_DIALECT || "postgres").toLowerCase();
let client;

function pgSql(sql) {
  let i = 0;
  return sql.replace(/\?/g, () => "$" + (++i));
}

async function getClient() {
  if (client) return client;
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is required");
  if (dialect === "mysql") {
    client = mysql.createPool({ uri: url, connectionLimit: 8, waitForConnections: true });
  } else {
    client = new Pool({
      connectionString: url,
      max: 8,
      ssl: url.includes("localhost") || url.includes("127.0.0.1") ? false : { rejectUnauthorized: false }
    });
  }
  return client;
}

async function query(sql, params = []) {
  const c = await getClient();
  if (dialect === "mysql") {
    const [rows] = await c.execute(sql, params);
    return { rows: Array.isArray(rows) ? rows : [], raw: rows };
  }
  const result = await c.query(pgSql(sql), params);
  return { rows: result.rows || [], raw: result };
}

async function exec(sql, params = []) {
  const c = await getClient();
  if (dialect === "mysql") {
    const [result] = await c.execute(sql, params);
    return result;
  }
  return c.query(pgSql(sql), params);
}

async function close() {
  if (!client) return;
  await client.end();
  client = null;
}

module.exports = { dialect, query, exec, close };
