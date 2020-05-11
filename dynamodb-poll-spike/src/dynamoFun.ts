import * as AWS from "aws-sdk";
import * as uuidv4 from "uuid/v4";
import * as util from "util";

AWS.config.update({ region: "eu-west-2" });
const TABLE_NAME =
  process.env.TABLE_NAME || "DynamoStack-Votes58095409-M9SW1M06IH2V";

const db = new AWS.DynamoDB.DocumentClient();

const createPoll = (
  title: string,
  options: string[],
  voteType: string,
  limit: number,
  createdBy: string,
  anon: boolean
) => {
  const id = uuidv4();
  var param = {
    TableName: TABLE_NAME,
    Item: {
      ID: id,
      TITLE: title,
      OPTIONS: options,
      VOTE_TYPE: voteType,
      LIMIT: limit,
      IS_ANON: anon,
      CREATED_BY: createdBy,
      IS_OPEN: true,
      CREATED_AT: new Date().toISOString(),
      VOTES: {},
    },
  };
  return db
    .put(param)
    .promise()
    .then(() => id);
};

const closePollDown = (pollId: string) => {
  return db
    .update({
      TableName: TABLE_NAME,
      Key: { ID: pollId },
      ReturnValues: "ALL_NEW",
      UpdateExpression: "SET IS_OPEN = :MODE",
      ExpressionAttributeValues: {
        ":MODE": false,
      },
    })
    .promise()
    .catch((err) => {
      if (err.name !== "ConditionalCheckFailedException") console.log(err);
    });
};

const addVotesForMany = (pollId: string, poller: string, option: string) => {
  return db
    .update({
      TableName: TABLE_NAME,
      Key: { ID: pollId },
      ReturnValues: "ALL_NEW",
      UpdateExpression: "ADD VOTES.#poller :OPTION",
      ConditionExpression: "IS_OPEN = :DESIRED_OPEN",
      ExpressionAttributeNames: {
        "#poller": poller,
      },
      ExpressionAttributeValues: {
        ":OPTION": db.createSet([option]),
        ":DESIRED_OPEN": true,
      },
    })
    .promise()
    .catch((err) => {
      if (err.name !== "ConditionalCheckFailedException") console.log(err);
    });
};

const addVotesForSingle = (pollId: string, poller: string, option: string) => {
  return db
    .update({
      TableName: TABLE_NAME,
      Key: { ID: pollId },
      ReturnValues: "ALL_NEW",
      UpdateExpression: "SET VOTES.#poller = :OPTION",
      ConditionExpression: "IS_OPEN = :DESIRED_OPEN",
      ExpressionAttributeNames: {
        "#poller": poller,
      },
      ExpressionAttributeValues: {
        ":OPTION": db.createSet([option]),
        ":DESIRED_OPEN": true,
      },
    })
    .promise()
    .catch((err) => {
      if (err.name !== "ConditionalCheckFailedException") console.log(err);
    });
};

const removeVote = (pollId: string, poller: string, option: string) => {
  return db
    .update({
      TableName: TABLE_NAME,
      Key: { ID: pollId },
      ReturnValues: "ALL_NEW",
      UpdateExpression: "DELETE VOTES.#poller :OPTION",
      ConditionExpression: "IS_OPEN = :DESIRED_OPEN",
      ExpressionAttributeNames: {
        "#poller": poller,
      },
      ExpressionAttributeValues: {
        ":OPTION": db.createSet([option]),
        ":DESIRED_OPEN": true,
      },
    })
    .promise()
    .catch((err) => {
      if (err.name !== "ConditionalCheckFailedException") console.log(err);
    });
};

const printVotes = (id2: string) => {
  db.get({
    TableName: TABLE_NAME,
    Key: {
      ID: id2,
    },
  })
    .promise()
    .then((d) => console.log(util.inspect(d, false, null, true)));
};

createPoll(
  "Lockdown going well?",
  ["Yup", "Nope", "Save Me"],
  "LIMIT",
  1,
  "Boris",
  true
).then((id) => {
  Promise.resolve()
    .then(() => addVotesForMany(id, "v1", "Yup"))
    .then(() => addVotesForMany(id, "v1", "Yup"))
    .then(() => addVotesForMany(id, "v1", "Nope"))
    .then(() => addVotesForSingle(id, "v2", "Save Me"))
    .then(() => removeVote(id, "v1", "Nope"))
    .then(() => closePollDown(id))
    .then(() => removeVote(id, "v1", "Yup"))
    .then(() => addVotesForMany(id, "v1", "Yup"))
    .then(() => addVotesForSingle(id, "v1", "Yup"))
    .then(() => printVotes(id));
});
