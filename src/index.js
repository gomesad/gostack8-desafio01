const express = require("express");

const server = express();

server.use(express.json());

const projects = [];
let requests = 0;

function addRequest(req, res, next) {
  requests++;
  console.log(`Total requests: ${requests}`);
  return next();
}

function checkProjectPost(req, res, next) {
  const { id, title } = req.body;
  const projectIndex = projects
    .map(el => {
      return el.id;
    })
    .indexOf(id);

  if (!(id && title)) {
    return res.status(400).json({ error: "Required field is missing!" });
  }

  if (!typeof id === "string") {
    return res.status(400).json({ error: "Id Field must be String Type!" });
  }

  if (!typeof title === "string") {
    return res.status(400).json({ error: "Title Field must be String Type!" });
  }

  if (projectIndex >= 0) {
    return res.status(400).json({ error: "Project already exists!" });
  }

  return next();
}

function checkProjectPut(req, res, next) {
  const { id } = req.params;
  const { title } = req.body;

  if (!(id && title)) {
    return res.status(400).json({ error: "Required field is missing!" });
  }

  if (!typeof id === "string") {
    return res.status(400).json({ error: "Id Field must be String Type!" });
  }

  if (!typeof title === "string") {
    return res.status(400).json({ error: "Title Field must be String Type!" });
  }

  return next();
}

function checkProjectExists(req, res, next) {
  const { id } = req.params;
  const projectIndex = projects
    .map(el => {
      return el.id;
    })
    .indexOf(id);

  if (projectIndex < 0) {
    return res.status(400).json({ error: "Project not found!" });
  }

  req.projectIndex = projectIndex;

  return next();
}

server.post("/projects", addRequest, checkProjectPost, (req, res) => {
  const { id, title } = req.body;
  const project = { id, title, tasks: [] };

  projects.push(project);

  return res.json(project);
});

server.get("/projects", addRequest, (req, res) => {
  return res.json(projects);
});

server.get("/projects/:id", addRequest, checkProjectExists, (req, res) => {
  const index = req.projectIndex;

  return res.json(projects[index]);
});

server.put(
  "/projects/:id",
  addRequest,
  checkProjectExists,
  checkProjectPut,
  (req, res) => {
    const { title } = req.body;
    const index = req.projectIndex;

    projects[index].title = title;

    return res.json(projects[index]);
  }
);

server.delete("/projects/:id", addRequest, checkProjectExists, (req, res) => {
  const index = req.projectIndex;

  projects.splice(index, 1);

  return res.json();
});

server.post(
  "/projects/:id/tasks",
  addRequest,
  checkProjectExists,
  (req, res) => {
    const { title } = req.body;
    const index = req.projectIndex;

    projects[index].tasks.push(title);

    return res.json(projects[index]);
  }
);

server.listen(3333);
