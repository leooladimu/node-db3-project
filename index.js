const server = require('./api/server.js')

const PORT = process.env.PORT || 9020

server.listen(PORT, () => {
  console.log(`Listening on port ${ PORT }...`)
})
