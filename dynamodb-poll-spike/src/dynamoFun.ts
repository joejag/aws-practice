import * as AWS from "aws-sdk";
import * as uuidv4 from "uuid/v4";

AWS.config.update({ region: "eu-west-2" });
const TABLE_NAME =
  process.env.TABLE_NAME || "DynamoStack-Votes58095409-1G0VD3PB0GPL";
const POLL_ID = "7f61b587-ebbc-408a-baba-43d9dc57b3bf";

const db = new AWS.DynamoDB.DocumentClient();

// create poll
var param = {
  TableName: TABLE_NAME,
  Item: {
    ID: uuidv4(),
    TITLE: "Who should be primeminster?",
    OPTIONS: ["Boris", "Nicola", "Bob"],
    VOTE_TYPE: "LIMIT",
    LIMIT: 1,
    IS_ANON: false,
    IS_OPEN: true,
    CREATED_AT: new Date().toISOString(),
    CREATED_BY: "joewright",
    VOTES: {},
  },
};
// db.put(param, (err) => {
//   if (err) {
//     console.log("Error", err);
//   }
// });

// MANY VOTE: add vote
db.update({
  TableName: TABLE_NAME,
  Key: { ID: POLL_ID },
  ReturnValues: "ALL_NEW",
  UpdateExpression: "ADD VOTES.#poller :OPTION",
  ExpressionAttributeNames: {
    "#poller": "george",
  },
  ExpressionAttributeValues: {
    ":OPTION": db.createSet(["Boris"]),
  },
})
  .promise()
  .catch(console.log);

// MANY VOTE: add vote
db.update({
  TableName: TABLE_NAME,
  Key: { ID: POLL_ID },
  ReturnValues: "ALL_NEW",
  UpdateExpression: "ADD VOTES.#poller :OPTION",
  ExpressionAttributeNames: {
    "#poller": "george",
  },
  ExpressionAttributeValues: {
    ":OPTION": db.createSet(["Nicola"]),
  },
})
  .promise()
  .catch(console.log);

// MANY VOTE: remove vote
db.update({
  TableName: TABLE_NAME,
  Key: { ID: POLL_ID },
  ReturnValues: "ALL_NEW",
  UpdateExpression: "DELETE VOTES.#poller :OPTION",
  ExpressionAttributeNames: {
    "#poller": "george",
  },
  ExpressionAttributeValues: {
    ":OPTION": db.createSet(["Boris"]),
  },
})
  .promise()
  .catch(console.log);

// Close a poll down
db.update({
  TableName: TABLE_NAME,
  Key: { ID: POLL_ID },
  ReturnValues: "ALL_NEW",
  UpdateExpression: "SET IS_OPEN = :MODE",
  ExpressionAttributeValues: {
    ":MODE": false,
  },
})
  .promise()
  .catch(console.log);

// 1 VOTE ALLOWED - clear existing votes
db.update({
  TableName: TABLE_NAME,
  Key: { ID: POLL_ID },
  ReturnValues: "ALL_NEW",
  UpdateExpression: "SET VOTES.#poller = :OPTION",
  ExpressionAttributeNames: {
    "#poller": "george",
  },
  ExpressionAttributeValues: {
    ":OPTION": db.createSet(["Tom"]),
  },
})
  .promise()
  .catch(console.log);

const util = require("util");

// READ VOTES
db.scan({
  TableName: TABLE_NAME,
})
  .promise()
  .then((d) => console.log(util.inspect(d.Items[0], false, null, true)));
