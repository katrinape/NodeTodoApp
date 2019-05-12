const morgan = require('morgan');
const express = require('express');
const app = express();

app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('tiny'));

var tasks = [
  { title: "Odebrać auto z warsztatu", description: "Sprawdź czy jest naprawione!" },
  { title: "Wizyta u stomatologa", description: "Wyrywanie ósemek..." }
];

var errMessage = '';

app.get("/", (req, res) => res.render('index', { tasks: tasks, errMessage: errMessage }));

app.post('/addtask', function (req, res) {
  if (!req.body.title || req.body.title.length < 10 || req.body.title.length > 255) {
    errMessage = '"Title" is required and should have more than 10 and less than 255 characters. ';
    console.log('Error message: ', errMessage);
    return res.redirect("/");
  }
  if (req.body.description.length > 255) {
    errMessage = '"Description" should have less than 255 characters.';
    console.log('Error message: ', errMessage);
    return res.redirect("/");
  }
  errMessage = '';
  tasks.push({ title: req.body.title, description: req.body.description });
  return res.redirect("/");
});

app.post("/removetask", function (req, res) {
  errMessage = '';
  if (tasks.length > 0) tasks.pop();
  else errMessage = 'Operation not allowed. Task list is empty!';
  return res.redirect("/");
});

app.post("/clearTasks", function (req, res) {
  errMessage = '';
  if (tasks.length > 0) tasks = [];
  else errMessage = 'Operation not allowed. Task list is empty!';
  return res.redirect("/");
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));