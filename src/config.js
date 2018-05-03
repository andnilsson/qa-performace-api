const config = {
    schemapath: process.env.schemapath ? process.env.schemapath : './src/schema.graphql',
    prismapath: process.env.prismapath ? process.env.prismapath : 'src/generated/prisma.graphql'
}

module.exports = config