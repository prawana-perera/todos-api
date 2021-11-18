const { create, getAll, update, getById, deleteById } = require('./lib');

// https://dynobase.dev/dynamodb-nodejs/
exports.handler = async (event) => {
  console.log('>>>>>> event', event);
  const userId = event.identity.sub;

  switch (event.info.fieldName) {
    case 'create':
      return create(userId, event.arguments.input);
    case 'getAll':
      return getAll(userId, event.arguments);
    case 'update':
      return update(userId, event.arguments.input);
    case 'getById':
      return getById(userId, event.arguments.id);
    case 'delete':
      return deleteById(userId, event.arguments.id);
    // TODO: for subscriptions check owner === identity
    case 'onTodoAdded':
      console.log(
        `subscription = onTodoAdded - user = ${event.arguments.owner}`
      );
      enforceSubscriptionDataOwner(event);
      break;
    case 'onTodoUpdated':
      console.log(
        `subscription = onTodoUpdated - user = ${event.arguments.owner}`
      );
      enforceSubscriptionDataOwner(event);
      break;
    case 'onTodoDeleted':
      console.log(
        `subscription = onTodoDeleted - user = ${event.arguments.owner}`
      );
      enforceSubscriptionDataOwner(event);
      break;
    default:
      throw new Error(
        `Unrecognized request, fieldName = ${event.info.fieldName}`
      );
  }
};

const enforceSubscriptionDataOwner = (event) => {
  const userId = event.identity.sub;
  if (event.arguments.owner !== userId) {
    throw `Forbidden`;
  }
};
