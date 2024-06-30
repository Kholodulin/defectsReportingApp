let users = [
  {
    email: "mail@mail.ru",
    password: "$2a$10$8A7mg5qBHn2H5uo2GFthF.s1RGnThxRqXVEpJii8rHAZl1wwlW80C",
    fullName: "name",
    id: 1,
    role: "Manager",
  },
  {
    email: "m@m.ru",
    password: "$2a$10$adDUGpH6WBgCgPb5Vk4yvuNh6eGhb3fv8U99jg2Rquxb14UMwKVWW",
    fullName: "testName",
    role: "User",
    id: 2,
  },
];

let constructionObjects = [
  {
    id: "1",
    name: "Building A",
    address: "123 Main St",
    registrationDate: "2023-01-01T00:00:00.000Z",
    requestsCount: 2,
  },
  {
    id: "2",
    name: "Building B",
    address: "456 Elm St",
    registrationDate: "2023-02-01T00:00:00.000Z",
    requestsCount: 1,
  },
  {
    id: "3",
    name: "Building A2",
    address: "123 Main St",
    registrationDate: "2023-01-01T00:00:00.000Z",
    requestsCount: 2,
  },
  {
    id: "4",
    name: "Building B copy",
    address: "456 Elm St",
    registrationDate: "2023-02-01T00:00:00.000Z",
    requestsCount: 1,
  },
];

let requests = [
  {
    id: "1",
    title: "Fix Roof Leak",
    description: "Tiles in building A are cracked.",
    email: "user1@example.com",
    submissionDate: "2024-01-01T12:00:00.000Z",
    status: "Completed",
    objectId: 1,
  },
  {
    id: "2",
    title: "Repair Window",
    description: "A window in Building A is broken",
    email: "user2@example.com",
    submissionDate: "2024-01-02T12:00:00.000Z",
    status: "Pending",
    objectId: 1,
  },
  {
    id: "3",
    title: "Paint Wall",
    description: "The wall in Building B needs painting",
    email: "user3@example.com",
    submissionDate: "2024-01-03T12:00:00.000Z",
    status: "Pending",
    objectId: 2,
  },
  {
    id: "4",
    title: "Fix Roof Leak (Copy)",
    description: "Tiles in building A are cracked.",
    email: "user1@example.com",
    submissionDate: "2024-01-01T12:00:00.000Z",
    status: "Pending",
    objectId: 1,
  },
  {
    id: "5",
    title: "Repair Window (Copy)",
    description: "A window in Building A is broken",
    email: "user2@example.com",
    submissionDate: "2024-01-02T12:00:00.000Z",
    status: "Pending",
    objectId: 1,
  },
  {
    id: "6",
    title: "Paint Wall (Copy)",
    description: "The wall in Building B needs painting",
    email: "user3@example.com",
    submissionDate: "2024-01-03T12:00:00.000Z",
    status: "Pending",
    objectId: 2,
  },
];

module.exports = { constructionObjects, requests, users };
