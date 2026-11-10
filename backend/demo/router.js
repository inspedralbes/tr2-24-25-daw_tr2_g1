import { Router } from 'express';
import multer from 'multer';
import { copyFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { pool } from '../api/db.js';
import { savePdfController } from '../api/save/savePdf.js';
import analysis from './analysis.json' with {type:'json'};

const sampleFile=fileURLToPath(new URL('./informe-demo.pdf',import.meta.url));
const uploadPath=fileURLToPath(new URL('../uploads/',import.meta.url));
const validRalc=value=>/^99\d{6}$/.test(String(value || ''));
export const demoRouter=Router();
demoRouter.use((req,res,next)=>{
  res.set('X-Robots-Tag','noindex, nofollow');
  res.set('Cache-Control','no-store');
  if (req.path.startsWith('/admin/') && req.method!=='GET') return res.status(403).json({error:'Demostració de només lectura.'});
  if (req.path==='/login-google') return res.status(403).json({error:'Utilitza els accessos de demostració.'});
  const ralc=req.params.ralc || req.body?.ralc;
  if (ralc && !validRalc(ralc)) return res.status(400).json({error:'Utilitza un RALC fictici de la demo (99 + 6 dígits).'});
  next();
});
demoRouter.get(['/pdf/:ralc','/uploads/:filename'],async(req,res,next)=>{
  try {
    const ralc=req.params.ralc;
    if(ralc && !validRalc(ralc))return res.status(400).json({error:'RALC fictici invàlid.'});
    if(req.params.filename && !/^(informe-demo|99\d{6})\.pdf$/.test(req.params.filename))return res.sendStatus(404);
    if(ralc) {
      const [[{total}]]=await pool.query('SELECT COUNT(*) AS total FROM alumnes WHERE ralc=?',[ralc]);
      if(!total)return res.sendStatus(404);
    }
    res.type('application/pdf').sendFile(sampleFile);
  }catch(error){next(error);}
});
demoRouter.get('/demo/profile',async(req,res,next)=>{
  try {
    const [centres]=await pool.query("SELECT * FROM centres WHERE codi_centre='DEMO0001'");
    const centre=centres[0];
    if (!centre) return res.status(503).json({error:'Demo no inicialitzada.'});
    res.json({success:true,centre:{id:centre.id,nom:centre.denominacio_completa,codi:centre.codi_centre,
      email:req.query.role==='professor'?'professor@example.invalid':centre.email_centre,
      ...(req.query.role==='professor'?{esProfesor:true,profesorNom:'Professor Demo'}:{})}});
  } catch(error){next(error);}
});
demoRouter.post('/alumne',async(req,res,next)=>{
  try {
    const [[{total}]]=await pool.query('SELECT COUNT(*) AS total FROM alumnes');
    if(total>=200)return res.status(429).json({error:'Límit de dades de demostració assolit.'});
    req.body={ralc:req.body.ralc,name:'Alumne Demo',surname:'Exemple Fictici',dni:'00000000T',
      date:'2012-01-01',course:'1 ESO',group:'A',centre_procedencia_id:835};
    next();
  }catch(error){next(error);}
});
demoRouter.post('/alumne/plan_individualitzat',(req,res,next)=>{
  req.body={ralc:req.body.ralc,professor_id:1,...analysis,ruta_pdf:'informe-demo.pdf'};next();
});
const upload=multer({storage:multer.memoryStorage(),limits:{fileSize:1024*1024,files:1,fields:12,fieldSize:4096}});
demoRouter.post('/save-pi',upload.single('pdfFile'),async(req,res,next)=>{
  try {
    const ralc=String(req.body.ralc || '');
    if(!validRalc(ralc))return res.status(400).json({error:'RALC fictici invàlid.'});
    const [[{total}]]=await pool.query('SELECT COUNT(*) AS total FROM alumnes WHERE ralc=?',[ralc]);
    if(!total)return res.status(404).json({error:'Alumne de demostració no trobat.'});
    const destination=path.join(uploadPath,ralc+'.pdf');
    // Always save our fixture, never persist visitor-uploaded files or free text.
    await copyFile(sampleFile,destination);
    req.body={ralc,professor_email:'professor@example.invalid',...analysis,proposta:analysis.proposta_educativa};
    req.file={path:destination,filename:ralc+'.pdf',mimetype:'application/pdf'};
    return savePdfController(req,res);
  }catch(error){next(error);}
});
demoRouter.use((error,req,res,next)=>{
  if(error instanceof multer.MulterError)return res.status(400).json({error:'Fitxer de demostració massa gran.'});
  next(error);
});
