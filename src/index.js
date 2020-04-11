/**
 * 
 */

const express = require('express');
const { uuid, isUuid } = require('uuidv4')

const app = express();

app.use(express.json());

//Middleware para pegar a URL dos métodos 
function logRequests(req,res,next) {
  const { method, url } = req;//Não preciso retornar o parametro, eu quero a URL e o methodo da requisição

  const logLabel = `[${method.toUpperCase()}] ${url}`;

  console.log(logLabel)

  return next()
}

//Middleware para fazer a validação do ID
function checkId(req,res,next){
  const { id } = req.params;
  
  if(!isUuid(id )){
    return res.status(400).json({  Error : "Project not found."})
  }
   
  return next()
}

//Chamando os Middlewares
app.use(logRequests);

app.use('/projects/:id',checkId);

const projects = []

app.get('/projects',(req,res) => {
  const { title } = req.query;

  const results = title 
    ? projects.filter(project => project.title.includes(title))
    : projects;

  return res.json(results);
  
    /**
     * Caso não queira retornar com nenhum filtro, descomentar a linha comentada abaixo 
     */

  //return res.json(projects);
});

app.post('/projects', (req,res) => {
  const {title, owner} = req.body;

  const project =  {id:uuid() , title, owner};
  
  projects.push(project);
  
  return res.json([project]);
});

app.put('/projects/:id', (req,res) => {
  const { id } = req.params;
  const {title, owner} = req.body;

  const projectIndex = projects.findIndex(project => project.id === id)

  const project = {
    id,
    title,
    owner
  };

  projects[projectIndex] = project

  return res.json([project]);
});

app.delete('/projects/:id',(req,res) => {
  const { id } = req.params;

  const projectIndex = projects.findIndex(project => project.id === id);

  if(projectIndex < 0 ){
    return res.status(400).json({  Error : "Project not found."})
  }

  projects.splice(projectIndex, 1);

  return res.status(204).send();
});


app.listen(3333, ()=>{
  console.log('back-end started')//Para mostrar que o server deu start 
});