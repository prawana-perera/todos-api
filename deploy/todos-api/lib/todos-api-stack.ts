import * as cdk from '@aws-cdk/core';
import * as appsync from '@aws-cdk/aws-appsync';
import * as ddb from '@aws-cdk/aws-dynamodb';
import * as lambda from '@aws-cdk/aws-lambda';
import * as cognito from '@aws-cdk/aws-cognito';
import { RemovalPolicy } from '@aws-cdk/core';

// https://aws.amazon.com/blogs/mobile/building-scalable-graphql-apis-on-aws-with-cdk-and-aws-appsync/
export class TodosApiStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const userPool = new cognito.UserPool(this, 'todos-api-userpool', {
      selfSignUpEnabled: false,
      accountRecovery: cognito.AccountRecovery.NONE,
      userVerification: {
        emailStyle: cognito.VerificationEmailStyle.CODE,
      },
      autoVerify: {
        email: true,
      },
      standardAttributes: {
        email: {
          required: true,
          mutable: false,
        },
      },
    });

    new cognito.UserPoolClient(this, 'todos-app-client', {
      userPool,
      userPoolClientName: 'todos-app-client',
    });

    // Creates the AppSync API
    const api = new appsync.GraphqlApi(this, 'TodosApi', {
      name: 'todos-api',
      schema: appsync.Schema.fromAsset('../../lib/graphql/schema.graphql'),
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: appsync.AuthorizationType.USER_POOL,
          userPoolConfig: {
            userPool,
          },
        },
      },
      xrayEnabled: true,
    });

    // Create Lambda
    const todosApiLambda = new lambda.Function(this, 'TodosApiHandler', {
      runtime: lambda.Runtime.NODEJS_14_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset('../../lib/todos-api-handler'),
      memorySize: 1024,
    });

    // Set the new Lambda function as a data source for the AppSync API
    const lambdaDs = api.addLambdaDataSource(
      'TodosApiHandlerDs',
      todosApiLambda
    );

    // Add resolver to each query/mutation/subscription
    lambdaDs.createResolver({
      typeName: 'Query',
      fieldName: 'getById',
    });

    lambdaDs.createResolver({
      typeName: 'Query',
      fieldName: 'getAll',
    });

    lambdaDs.createResolver({
      typeName: 'Mutation',
      fieldName: 'create',
    });

    lambdaDs.createResolver({
      typeName: 'Mutation',
      fieldName: 'update',
    });

    lambdaDs.createResolver({
      typeName: 'Mutation',
      fieldName: 'delete',
    });

    lambdaDs.createResolver({
      typeName: 'Subscription',
      fieldName: 'onTodoAdded',
    });

    lambdaDs.createResolver({
      typeName: 'Subscription',
      fieldName: 'onTodoUpdated',
    });

    lambdaDs.createResolver({
      typeName: 'Subscription',
      fieldName: 'onTodoDeleted',
    });

    const todosTable = new ddb.Table(this, 'TodosTable', {
      tableName: 'TodosTable',
      billingMode: ddb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: RemovalPolicy.DESTROY,
      partitionKey: {
        name: 'pk',
        type: ddb.AttributeType.STRING,
      },
      sortKey: {
        name: 'sk',
        type: ddb.AttributeType.STRING,
      },
    });

    todosTable.addGlobalSecondaryIndex({
      indexName: 'gsi1',
      partitionKey: {
        name: 'pk',
        type: ddb.AttributeType.STRING,
      },
      sortKey: {
        name: 'gsi1sk',
        type: ddb.AttributeType.STRING,
      },
    });

    todosTable.addGlobalSecondaryIndex({
      indexName: 'gsi2',
      partitionKey: {
        name: 'pk',
        type: ddb.AttributeType.STRING,
      },
      sortKey: {
        name: 'gsi2sk',
        type: ddb.AttributeType.STRING,
      },
    });

    // enable the Lambda function to access the DynamoDB table (using IAM)
    todosTable.grantReadWriteData(todosApiLambda);

    // Create an environment variable that we will use in the function code
    todosApiLambda.addEnvironment('TODOS_TABLE', todosTable.tableName);

    // Prints out the AppSync GraphQL endpoint to the terminal
    new cdk.CfnOutput(this, 'GraphQLApiUrl', {
      value: api.graphqlUrl,
    });

    // Prints out the stack region to the terminal
    new cdk.CfnOutput(this, 'StackRegion', {
      value: this.region,
    });
  }
}
