const AWS = require('aws-sdk');

const { STATUS, PRIORITY } = require('./enums');

const docClient = new AWS.DynamoDB.DocumentClient();

const getAll = async (userId, options) => {
  const pk = `USER#${userId}`;

  const params = {
    TableName: process.env.TODOS_TABLE,
    KeyConditionExpression: 'pk = :userId and begins_with(sk, :todosType)',
    ExpressionAttributeValues: {
      ':userId': pk,
      ':todosType': 'TODO#',
    },
    Limit: options?.limit || 10,
  };

  if (options?.nextToken) {
    params.ExclusiveStartKey = {
      pk,
      sk: `TODO#${options.nextToken}`,
    };
  }

  try {
    const results = await docClient.query(params).promise();
    console.log('>>>> getAll', results);

    const nextToken = results?.LastEvaluatedKey?.sk
      ? results.LastEvaluatedKey.sk.split('#')[1]
      : null;

    return {
      items: results.Items.map(
        ({
          id,
          title,
          priority,
          status,
          description,
          createdAt,
          modifiedAt,
          owner,
        }) => ({
          id,
          title,
          priority: PRIORITY[priority],
          status: STATUS[status],
          description,
          createdAt,
          modifiedAt,
          owner,
        })
      ),
      nextToken,
    };
  } catch (err) {
    console.log('DynamoDB error: ', err);
    throw err;
  }
};

module.exports = getAll;
