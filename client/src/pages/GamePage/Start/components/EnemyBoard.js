import React, {useState, useEffect} from 'react'
import socket from '../../../../helpers/socket'

function EnemyBoard({data, handleAttackEnemy, attackFlag}) {
  console.log(data, `ini data dari enemy board`)
  let allShipsCoordinate = []
  data.coordinates.ships.forEach(ship => {
    ship.isAlive && ship.coordinates.forEach(el => {
      allShipsCoordinate.push([el, true])
    })
    !ship.isAlive && ship.coordinates.forEach(el => {
      allShipsCoordinate.push([el, false])
    })
  })
  
  const atlantisCoordinate = data.coordinates.atlantis
  const plusBombCoordinate = data.coordinates.bombCount
  const plusPowerCoordinate = data.coordinates.bombPower
  const [attacked, setAttacked] = useState(data.coordinates.attacked)

  useEffect(() => {
    setAttacked(data.coordinates.attacked)
  }, [data])

  const [isAttack, setIsAttack] = useState(false)
  const [styleBtn, setStyleBtn] = useState('btn')
  const [attackEnemy, setAttackEnemy] = useState({})
  const [attackCoordinateTemp, setAttackCoordinateTemp] = useState([])

  // DUMMY BOARDS
  const [boards, setBoards] = useState([])
  const [isBoardFilled, setIsBoardFilled] = useState(attackFlag)
  const alphabeth = "_ABCDEFGHIJKLMNO"
  const numbers = ["",1,2,3,4,5,6,7,8,9,10,11,12,13,14,15]

  // Place Buff
  useEffect(() => {
    function generateBoard() {
      let boards = []
      for(let i = 0; i < 16; i++){
        let temp = []
        for(let j = 0; j < 16; j++){
          // Place atlantis
          if(i === atlantisCoordinate[0] && j === atlantisCoordinate[1]) temp.push(['atlantis'])
          
          // Place Plus Bomb
          else if(i === plusBombCoordinate[0][0] && j === plusBombCoordinate[0][1]) temp.push(['bomb'])
          else if(i === plusBombCoordinate[1][0] && j === plusBombCoordinate[1][1]) temp.push(['bomb'])
          
          // Place Plus Power
          else if(i === plusPowerCoordinate[0] && j === plusPowerCoordinate[1]) temp.push(['power'])

          else temp.push(['none'])
        }
        console.log(temp)
        boards.push(temp)
      }
      setIsBoardFilled(true)
      setBoards(boards)
    }
    generateBoard()
  }, [])

  // Place Attacked
  // useEffect(() => {
  //   function placeAttack() {
  //     let newBoard = JSON.parse(JSON.stringify(boards))
  //     attacked.forEach(atkCoor => {
  //       newBoard[atkCoor[0]][atkCoor[1]] = ['hit']
  //     })
  //     setBoards(newBoard)
  //   }
  //   attacked.length > 0 && placeAttack()
  // }, [attacked])

  // Place Kapal
  useEffect(() => {
    function placeShips(){
      let newBoard = JSON.parse(JSON.stringify(boards))
      allShipsCoordinate.forEach((coor, i) => {
        newBoard[coor[0][0]][coor[0][1]] = ['ship', coor[1]]
      })
      setBoards(newBoard)
    }
    boards.length > 1 && placeShips()
  }, [isBoardFilled])

  // Reveal Attack Temp
  useEffect(() => {
    function revealAttackTemp() {
      let newBoards = JSON.parse(JSON.stringify(boards))
      // newBoards[attackCoordinateTemp[0]][attackCoordinateTemp[1]] = ['hit']
      setBoards(newBoards)
    }
    attackCoordinateTemp.length > 0 && revealAttackTemp()
  }, [attackCoordinateTemp])

  const handleAttack = (row, coll, socket) => {
    if(!isAttack){
      // setIsAttack(true)
      // setStyleBtn('')
      setAttackEnemy({...attackEnemy, [socket]: [row, coll]})
      setAttackCoordinateTemp([row, coll])
      handleAttackEnemy({socketId: socket, coordinate: [row, coll]})
    }
  }
  
  return (
    <div>
      <h1>Ini enemy {boards.length}</h1>
      <div className="container">
        {
          boards.map((row, rowIdx) => {
            return <div key={rowIdx} className="d-flex flex-wrap" style={{width: "640px"}}>
                {
                  row.map((coll, collIdx) => {
                    return (
                      <div key={collIdx}>
                        {
                          rowIdx === 0 && collIdx !== 0 && <div key={collIdx} className="border border-white bg-dark text-white column align-items-center justify-content-center align-items-center" style={{backgroundColor: "#fff", width: "40px", height: "40px"}}>{alphabeth[collIdx]}</div>
                        }
                        {
                          collIdx === 0 && <div key={collIdx} className="border border-white bg-dark text-white" style={{backgroundColor: "#fff", width: "40px", height: "40px"}}>{numbers[rowIdx]}</div>
                        }
                        {
                          rowIdx !== 0 
                          && collIdx !== 0 
                          && coll[0] === 'atlantis' && <div onClick={() => handleAttack(rowIdx, collIdx, data.socketId)} key={collIdx} className={`border border-white ${styleBtn}`} style={{backgroundColor: "#1B9CC6", width: "40px", height: "40px"}}></div>
                        }
                        {
                          rowIdx !== 0 
                          && collIdx !== 0 
                          && coll[0] === 'bomb' && <div onClick={() => handleAttack(rowIdx, collIdx, data.socketId)} key={collIdx} className={`border border-white ${styleBtn}`} style={{backgroundColor: "#1B9CC6", width: "40px", height: "40px"}}></div>
                        }
                        {
                          rowIdx !== 0 
                          && collIdx !== 0 
                          && coll[0] === 'power' && <div onClick={() => handleAttack(rowIdx, collIdx, data.socketId)} key={collIdx} className={`border border-white ${styleBtn}`} style={{backgroundColor: "#1B9CC6", width: "40px", height: "40px"}}></div>
                        }
                        {
                          rowIdx !== 0 
                          && collIdx !== 0 
                          && coll[0] === 'ship' && coll[1] && <div onClick={() => handleAttack(rowIdx, collIdx, data.socketId)} key={collIdx} className={`border border-white ${styleBtn}`} style={{color: "red", backgroundColor: "#1B9CC6", width: "40px", height: "40px"}}></div>
                        }
                        {
                          rowIdx !== 0 
                          && collIdx !== 0 
                          && coll[0] === 'ship' && !coll[1] && <div onClick={() => handleAttack(rowIdx, collIdx, data.socketId)} key={collIdx} className={`border border-white ${styleBtn}`} style={{color: "red", backgroundColor: "red", width: "40px", height: "40px"}}></div>
                        }
                        {
                          rowIdx !== 0 
                          && collIdx !== 0 
                          && coll[0] === 'none' && <div onClick={() => handleAttack(rowIdx, collIdx, data.socketId)} key={collIdx}  className={`border border-white ${styleBtn}`} style={{backgroundColor: "#1B9CC6", width: "40px", height: "40px"}}></div>
                        }
                        {
                          rowIdx !== 0 
                          && collIdx !== 0 
                          && coll[0] === 'hit' && <div onClick={() => handleAttack(rowIdx, collIdx, data.socketId)} key={collIdx}  className={`border border-white ${styleBtn}`} style={{backgroundColor: "red", width: "40px", height: "40px"}}></div>
                        }
                      </div>
                    )
                  })
                }
            </div>
          })
        }
      </div>
    </div>
  )
}

export default EnemyBoard
