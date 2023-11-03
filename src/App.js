import Button from './lib/components/Button';
import Badge from './lib/components/Badge';
import { useState } from 'react';
import { DemoTwilio, VideoCall } from './lib';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import './App.css'

function App() {
    const [count, setCount] = useState(0)
    const handleClick = () => {
        setCount(count + 1);
    }

    const getTokenFromServer = async (roomName) => {
        const response = await axios.post('http://localhost:3000/join-room', {
            roomName: roomName,
            identity: uuidv4()
        });
        console.log(response)
        return response.data.token;
    };
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'start',
            justifyContent: 'center',
            gap: '1.5rem',
            padding: '5rem'
        }}>
            {/* <p>Wow, look at this component library.</p>
            <h5>A notification badge:</h5>
            <Badge value={3} />
            <br />
            <h5>A button:</h5>
            <Button label={`Total Count ${count}`} kind="primary" handleClick={handleClick} /> */}
            <DemoTwilio getTokenFromServer = {getTokenFromServer}/>
            {/* <VideoCall getTokenFromServer = {getTokenFromServer}/> */}
        </div>
    );
}

export default App;