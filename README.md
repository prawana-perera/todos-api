# TODOsApi

BE for TODOs app

Learning objectives:

- Infra as code on AWS (using CDK)
- Design of NoSQL db, using single table pattern
- Graph QL and using managed GraphQL
- Serverless architectures on AWS
- Authentication and Authorization on AWS using Cognito
- Setup CI/CD pipelines (GitHub Actions) for BE code + infra deployed

## Useful links

### DynamoDB

- https://edward-huang.com/best-practice/database/2021/04/13/how-to-model-any-relational-data-in-dynamodb-to-maximize-performance/
- https://www.sensedeep.com/blog/posts/2021/dynamodb-singletable-design.html
- https://aws.amazon.com/blogs/compute/creating-a-single-table-design-with-amazon-dynamodb/
- https://www.serverlesslife.com/DynamoDB_Design_Patterns_for_Single_Table_Design.html
- https://www.profit4cloud.nl/blog/designing-for-amazon-dynamodb/
- Use KSUID instead of GUUID - https://www.npmjs.com/package/ksuid
- https://www.alexdebrie.com/posts/dynamodb-condition-expressions/
- https://www.alexdebrie.com/posts/dynamodb-transactions/

### AppSync + DynamoDB Design

- https://www.alexdebrie.com/posts/dynamodb-single-table/#graphql--single-table-design
- https://benoitboure.com/how-to-use-dynamodb-single-table-design-with-appsync

### GraphQL

- https://engineering.zalando.com/posts/2021/04/modeling-errors-in-graphql.html
- https://blog.logrocket.com/handling-graphql-errors-like-a-champ-with-unions-and-interfaces/

### AppSync + Auth

- https://github.com/dabit3/build-an-authenticated-api-with-cdk
- https://github.com/deekob/appsync_reference

### Serverless

- https://event-driven-architecture.workshop.aws/2-event-bridge.html
- https://serverlessland.com/

### Local development and testing

- https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-cdk-getting-started.html
- https://medium.com/contino-engineering/increase-your-aws-cdk-lambda-development-speed-by-testing-locally-with-aws-sam-48a70987515c
  - Need docker (no need docker desktop) - https://dhwaneetbhatt.com/blog/run-docker-without-docker-desktop-on-macos
  - Fix cred store error - https://basiliocode.medium.com/error-docker-credential-desktop-not-installed-or-not-available-in-path-1e969f7bdfbc
