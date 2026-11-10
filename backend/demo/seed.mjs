import mysql from 'mysql2/promise';
import { readFile } from 'node:fs/promises';
import 'dotenv/config';
import { pathToFileURL } from 'node:url';

export async function seedDemo() {
  if (process.env.DEMO_MODE !== 'true' || process.env.DB_NAME !== 'plapi_demo') {
    throw new Error('Demo initialization requires DEMO_MODE=true and DB_NAME=plapi_demo.');
  }
  const connection = await mysql.createConnection({
    host:process.env.DB_HOST, port:Number(process.env.DB_PORT || 4000),
    user:process.env.DB_USER,password:process.env.DB_PASSWORD,
    ...(process.env.DB_SSL === 'true' ? {ssl:{rejectUnauthorized:true,minVersion:'TLSv1.2'}} : {})
  });
  try {
    await connection.query('CREATE DATABASE IF NOT EXISTS plapi_demo CHARACTER SET utf8mb4');
    await connection.changeUser({database:'plapi_demo'});
    const [tables] = await connection.query('SHOW TABLES');
    if (tables.length) {
      const [markers] = await connection.query("SELECT id FROM centres WHERE codi_centre='DEMO0001'");
      if (!markers.length) throw new Error('Existing database is not the isolated demo. Nothing was changed.');
      console.log('Existing synthetic demo preserved.');
      return;
    }
    const schema = (await readFile(new URL('../db/crear.sql',import.meta.url),'utf8'))
      .replace(/--[^\n]*/g,'').replace(/DROP TABLE[^;]+;/gi,'');
    for (const statement of schema.split(';').map(s=>s.trim()).filter(Boolean)) await connection.query(statement);
    await connection.query("INSERT INTO centres (id,codi_centre,denominacio_completa,email_centre,telefon,nom_naturalesa,codi_postal,adreca,nom_municipi) VALUES (835,'DEMO0001','Centre Demo Barcelona','centre@example.invalid','000000000','Fictici','00000','Adreça fictícia','Barcelona'),(836,'DEMO0002','Centre Demo Girona','girona@example.invalid','000000000','Fictici','00000','Adreça fictícia','Girona')");
    await connection.query("INSERT INTO professors (id,nom,email,password,centre_id) VALUES (1,'Professor Demo','professor@example.invalid','DEMO_NO_PASSWORD_LOGIN',835),(2,'Professora Demo','professora@example.invalid','DEMO_NO_PASSWORD_LOGIN',835)");
    for (let i=1;i<=3;i++) {
      await connection.query("INSERT INTO alumnes (ralc,nom,cognom,dni,data_naixement,curs,grup,centre_procedencia_id) VALUES (?,?,?,?,?,?,?,835)",
        ['9900000'+i,'Alumne Demo '+i,'Exemple Fictici','00000000T','2012-01-01','1 ESO','A']);
    }
    const analysis=JSON.parse(await readFile(new URL('./analysis.json',import.meta.url),'utf8'));
    await connection.query("INSERT INTO pis (alumne_ralc,professor_id,dificultat,gravetat,justificacio,proposta_educativa,observacio,ruta_pdf,estado) VALUES ('99000001',1,?,?,?,?,?,'informe-demo.pdf','actiu')",
      [analysis.dificultat,analysis.gravetat,analysis.justificacio,analysis.proposta_educativa,analysis.observacio]);
    console.log('Synthetic PlaPI database initialized.');
  } finally { await connection.end(); }
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  seedDemo().catch(error=>{console.error('Demo database initialization failed:',error.code || error.message);process.exitCode=1;});
}
