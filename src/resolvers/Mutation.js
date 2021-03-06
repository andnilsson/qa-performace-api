const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { APP_SECRET, getUserId } = require('../utils')

function post(parent, args, context, info) {
    const userId = getUserId(context)
    const { url, description } = args
    return context.db.mutation.createLink({ data: { url, description, postedBy: { connect: { id: userId } } } }, info)
}

async function signup(parent, args, context, info) {
    const password = await bcrypt.hash(args.password, 10)
    const user = await context.db.mutation.createUser({
        data: { ...args, password },
    })

    const token = jwt.sign({ userId: user.id }, APP_SECRET)

    return {
        token,
        user,
    }
}

async function login(parent, args, context, info) {
    const user = await context.db.query.user({ where: { email: args.email } })
    if (!user) {
        throw new Error(`Could not find user with email: ${args.email}`)
    }

    const valid = await bcrypt.compare(args.password, user.password)
    if (!valid) {
        throw new Error('Invalid password')
    }

    const token = jwt.sign({ userId: user.id }, APP_SECRET)

    return {
        token,
        user,
    }
}

module.exports = {
    post,
    signup,
    login
}
