import * as AWS from "aws-sdk";
import * as uuidv4 from "uuid/v4";

AWS.config.update({ region: "eu-west-2" });
const TABLE_NAME =
  process.env.TABLE_NAME || "DynamoStack-TableCD117FA1-Z4O6HSYY9B7W";

const db = new AWS.DynamoDB.DocumentClient();

var param = {
  TableName: TABLE_NAME,
  Item: {
    id: uuidv4(),
    TITLE: "Who should be primeminster?",
    OPTIONS: ["Boris", "Nicola", "Bob"],
    VOTE_TYPE: "LIMIT",
    LIMIT: 1,
    ANON: false,
    OPEN: true,
    CREATED_AT: "date",
    CREATED_BY: "joewright",
    VOTES: {},
  },
};
// db.put(param, (err) => {
//   if (err) {
//     console.log("Error", err);
//   }
// });

// db.scan({
//   TableName: TABLE_NAME,
// })
//   .promise()
//   .then((d) => console.log(d.Items[0]));

db.update({
  TableName: TABLE_NAME,
  Key: { id: "293b1de1-d14d-4816-8a5f-43550a8f21b0" },
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
  .then(console.log)
  .catch(console.log);

db.update({
  TableName: TABLE_NAME,
  Key: { id: "293b1de1-d14d-4816-8a5f-43550a8f21b0" },
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
  .then(console.log)
  .catch(console.log);

db.update({
  TableName: TABLE_NAME,
  Key: { id: "293b1de1-d14d-4816-8a5f-43550a8f21b0" },
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
  .then(console.log)
  .catch(console.log);
