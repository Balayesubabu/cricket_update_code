const express = require('express')
const app = express()
const {open} = require('sqlite')
const sqlite3 = require('sqlite3')
const path = require('path')
app.use(express.json())
let db = null
const dbPath = path.join(__dirname, 'cricketTeam.db')
const initializerDBserver = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    })
    app.listen(3000, () => {
      console.log('Server is running at http://localhost:3000')
    })
  } catch (error) {
    console.log(`DB is ${error.message}`)
    process.exit(1)
  }
}

initializerDBserver()

const cricketDbObject = object => {
  return {
    playerId: object.player_Id,
    playerName: object.player_name,
    jerseyNumber: object.jersey_number,
    role: object.role,
  }
}

//Api 1

app.get('/players/', async (request, response) => {
  const getPlayerQuery = `select * from cricket_team`
  const getPlayerQueryResponse = await db.all(getPlayerQuery)
  response.send(
    getPlayerQueryResponse.map(eachPlayer => cricketDbObject(eachPlayer)),
  )
})

//Api 2

app.post('/players/', async (request, response) => {
  const {playerName, jerseyNumber, role} = request.body
  const insertValues = `insert into cricket_team(player_name, jersey_number, role);
  values('${playerName}', ${jerseyNumber}, '${role}');`
  const insertValuedbResponse = await db.run(insertValues)
  response.send('Player Added to Team')
})
//Api 3

app.get('/players/:playerId/', async (request, response) => {
  const {playerId} = request.params
  const single_player = `select * from cricket_team where player_id = ${playerId};`
  const singlePlayerResponse = await db.get(single_player)
  response.send(cricketDbObject(singlePlayerResponse))
})

//Api 4
app.put('players/:playerId/', async (request, response) => {
  const {playerId} = request.params
  const {playerName, jerseyNumber, role} = request.body
  const updatePlayerDetails = `update cricket_team set player_name = '${player_name}', jersey_number = ${jerseyNumber}, role = '${role}'
  where player_id = ${playerId};`
  await db.run(updatePlayerDetails)
  response.send('Player Details Updated')
})

//Api 5
app.delete('/players/:playerId/', async (request, response) => {
  const {playerId} = request.params
  const deleteQuery = `delte from cricket_team where player_id = ${playerId};`
  await db.run(deleteQuery)
  response.send('Player Removed')
})
module.exports = app
