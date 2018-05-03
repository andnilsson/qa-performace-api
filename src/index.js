const { GraphQLServer } = require('graphql-yoga')
const { Prisma } = require('prisma-binding')
const Query = require('./resolvers/Query')
const Mutation = require('./resolvers/Mutation')
const config = require('./config')

const resolvers = {
  Query,
  Mutation,
}
const server = new GraphQLServer({
  typeDefs: config.schemapath,
  resolvers,
  context: req => ({
    ...req,
    db: new Prisma({
      typeDefs: config.prismapath,
      endpoint: 'https://eu1.prisma.sh/public-orangeoriole-374/qa-performance-api/dev', // the endpoint of the Prisma DB service
      secret: 'mysecret123', // specified in database/prisma.yml
      debug: true, // log all GraphQL queryies & mutations
    }),
  }),
})

server.start(() => console.log('Server is running on http://localhost:4000'))
