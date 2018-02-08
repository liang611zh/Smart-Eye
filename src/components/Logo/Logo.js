import React from 'react';
import Tilt from 'react-tilt'
import Eye from './eye.png'

const Logo=()=>{
    return(
            <div className='ma4 mt0'>
            <Tilt className="Tilt br2 shadow-2" options={{ max : 50 }} style={{ height: 150, width: 150 }} >
                <div className="Tilt-inner">
                <img src={Eye} alt="eye" height="150" width="150" />
                </div>
            </Tilt>
            </div>
    );
}

export default Logo;