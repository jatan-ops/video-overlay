import { useEffect, useState } from "react";
import './index.css'

import ReactPlayer from 'react-player'

import { v4 as uuidv4 } from "uuid";
import { Rnd } from "react-rnd";

function App() {

  const [squares, setSquares] = useState([]);
  const [displaySquareId, setDisplaySquareId] = useState(null)
  
  const [screenHeight, setScreenHeight] = useState(null)
  const [screenWidth, setScreenWidth] = useState(null)

  useEffect(() => {

    const current_vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)
    setScreenWidth(current_vw)

    const current_vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)
    setScreenHeight(current_vh)

    if(localStorage.getItem('squares') !== null) {
      const squareString = localStorage.getItem('squares')
      const squareArray = JSON.parse(squareString)

      let newTempSquares = []
      squareArray.map(square => {
        const w_scale = current_vw / square.screenWidth
        const h_scale = current_vh / square.screenHeight
        const tempSquare = square
        tempSquare.x = tempSquare.x * w_scale
        tempSquare.y = tempSquare.y * h_scale
        tempSquare.width = tempSquare.width * w_scale
        tempSquare.height = tempSquare.height * h_scale
        newTempSquares.push(tempSquare)
      })
      setSquares(newTempSquares)
    }
    
  },[])

  return (
    <div>
       <button
        onClick={() => {
          const newTempSquares = [...squares, {
            id: uuidv4(),
            timeStamp: null, // change this in production
            screenHeight: screenHeight,
            screenWidth: screenWidth,
            width: 100,
            height: 100,
            x: 0,
            y: 0
          }]
          setSquares(newTempSquares);
          localStorage.setItem('squares',JSON.stringify(newTempSquares))
        }}
      >
        Add square
      </button>

      {screenWidth !== null && screenHeight !== null &&
        <div
          style={{
            position:'relative', top:'0px', left:'0px'
          }}
        > 
          <img 
            className='thread-video' 
            width={screenWidth*0.6}
            height={screenHeight*0.7} // screen height and width can be manipulated any which way but 
            // when aspect ratio changes, box does not remain aligned ie once box is added -> change screen size -> refresh and box sticks
            // -> change aspect ratio -> box does not stick
            src='https://wallpaper.dog/large/5478316.jpg'          
          />
          <div
            style={{
              position:'absolute',
              top: '0px',
              left: '0px'
            }} 
          >
            {squares.length > 0 &&
              squares.map((square, i) => {          
              return (
                <span key={square.id}>
                  {
                    // displaySquareId === square.id &&
                    <Rnd
                      style={{
                        border: "solid 4px pink",
                        borderRadius: "10px",
                        zIndex:999
                      }}
                      size={{ width: square.width, height: square.height }}
                      position={{ x: square.x, y: square.y }}
                      bounds='.thread-video'
                      onDragStop={(e, d) => {
                        square.x = d.x
                        square.y = d.y
                        square.screenHeight = screenHeight
                        square.screenWidth = screenWidth       
                        const tempSquares = [...squares]
                        tempSquares[i] = square
                        setSquares(tempSquares)
                        localStorage.setItem('squares',JSON.stringify(tempSquares))
                      }}
                      onResizeStop={(e, direction, ref, delta, position) => {
                        const tempSquare = {
                          id: square.id,
                          timeStamp: square.timeStamp,
                          screenHeight: screenHeight,
                          screenWidth: screenWidth,
                          width: parseInt(ref.style.width.slice(0,-2)),
                          height: parseInt(ref.style.height.slice(0,-2)),
                          ...position
                        }
                        const tempSquares = [...squares]
                        tempSquares[i] = tempSquare              
                        setSquares(tempSquares);
                        localStorage.setItem('squares',JSON.stringify(tempSquares))
                      }}
                    />
                  }
                </span>
              )
              })
            } 
          </div>
      </div>
      }
      
      {
        squares.map((square, i) => {
          return <button
            className="show-square"
            style={{
              border: displaySquareId === square.id && 'solid 1px red'
            }}
            onClick={() => {
              setDisplaySquareId(square.id)
            }}
          >
            Show square
          </button>
        })
      }
    </div>
  );
}

export default App;

// <ReactPlayer 
//   className='thread-video' 
//   width={screenWidth*0.8} 
//   height={screenHeight*0.8}
//   controls={true} 
//   url='https://www.youtube.com/watch?v=ysz5S6PUM-U' 
// />    