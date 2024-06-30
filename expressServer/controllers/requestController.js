let { requests } = require("../models");

const getAll = (req, res) => {
  res.json(requests);
};

const create = (req, res) => {
  const newRequest = { ...req.body, id: (requests.length + 1).toString() };
  requests.push(newRequest);
  res.status(201).json({ message: "Request added" });
};

const update = (req, res) => {
  const requestId = req.params.id;
  const updatedRequest = { ...req.body, id: requestId };
  requests = requests.map((req) =>
    req.id === requestId ? updatedRequest : req
  );
  res.status(200).json({ message: "Request updated" });
};

const getById = (req, res) => {
  const requestId = req.params.id;
  const request = requests.find((req) => req.id === requestId);
  if (request) {
    res.json(request);
  } else {
    res.status(404).json({ message: "Request not found" });
  }
};

module.exports = { getAll, create, update, getById };
