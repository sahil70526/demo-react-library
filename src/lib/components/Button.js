import React from 'react';

const Button = (props) => {
    return (
        <button className={`btn btn--${props.kind} CTA`}
            data-id={props.id}
            type={props.type}
            name={props.name}
            value={props.value}
            disabled={props.disabled}
            onClick={props.handleClick}
            style={{width:150, borderRadius:8, backgroundColor:"tomato"}}
        >
            <h4>
                {props.label}
            </h4>
        </button>
    );
}

export default Button;