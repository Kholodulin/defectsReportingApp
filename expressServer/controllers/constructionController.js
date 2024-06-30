let { constructionObjects } = require("../models");

const getAll = (req, res) => {
  res.json(constructionObjects);
};

const create = (req, res) => {
  const newObject = {
    ...req.body,
    id: (constructionObjects.length + 1).toString(),
  };
  constructionObjects.push(newObject);
  res.status(201).json({ message: "Construction object added" });
};

const update = (req, res) => {
  const objectId = req.params.id;
  const updatedObject = { ...req.body, id: objectId };
  constructionObjects = constructionObjects.map((obj) =>
    obj.id === objectId ? updatedObject : obj
  );
  res.status(200).json({ message: "Construction object updated" });
};

const remove = (req, res) => {
  const objectId = req.params.id;
  constructionObjects = constructionObjects.filter(
    (obj) => obj.id !== objectId
  );
  res.status(200).json({ message: "Construction object deleted" });
};

const getById = (req, res) => {
  const objectId = req.params.id;
  const object = constructionObjects.find((obj) => obj.id === objectId);
  if (object) {
    res.json(object);
  } else {
    res.status(404).json({ message: "Construction object not found" });
  }
};

module.exports = { getAll, create, update, remove, getById };
