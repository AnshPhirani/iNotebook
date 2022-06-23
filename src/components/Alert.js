import React from 'react'

export default function Alert(props) {
    
  return (
    <div style={{height : "50px"}}>
        {props.info && <div className={`alert alert-${props.info.type} alert-dismissible fade show`} role="alert">
          <strong>{props.info.type === "danger" ?  "ERROR" :  props.info.type.toUpperCase()}!</strong> {props.info.message}
      </div>}
    </div>
  )
}
