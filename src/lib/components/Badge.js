import React from 'react';

const Badge = (props) => {
    return (
        <div className={`badge ${!props.value ? 'badge--none' :''} `}  style={{backgroundColor:"lightBlue",width:"30px",textAlign:"center",border:"1.5px solid black",borderRadius:"50%"}}>
            <h4>{props.value || 0}</h4>
        </div>
    );
}
 
export default Badge;