const AWS = require('aws-sdk');
const KSUID = require('ksuid');

const { STATUS, PRIORITY } = require('./enums');

const docClient = new AWS.DynamoDB.DocumentClient();

const create = async (userId, { title, priority, description }) => {
  const id = (await KSUID.random()).string;

  const todo = {
    id,
    title,
    priority: PRIORITY[priority],
    status: STATUS.PENDING,
    owner: userId,
    description,
    createdAt: new Date().toISOString(),
  };

  const params = {
    TableName: process.env.TODOS_TABLE,
    Item: {
      pk: `USER#${userId}`,
      sk: `TODO#${id}`,
      type: 'TODO',
      gs1sk: `TODO#PRIORITY#${PRIORITY[priority]}`,
      gs2sk: `TODO#STATUS#${STATUS.PENDING}`,
      ...todo,
    },
  };
  try {
    await docClient.put(params).promise();
    return {
      ...todo,
      priority: PRIORITY[todo.priority],
      status: STATUS[todo.status],
    };
  } catch (err) {
    console.log('DynamoDB error: ', err);
    throw err;
  }
};

module.exports = create;
