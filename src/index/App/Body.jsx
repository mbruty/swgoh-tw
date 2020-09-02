import React, { useState } from "react";
import { registerCallBack } from "./data";
import { Spinner, Accordion } from "react-bootstrap";
import GuildInfo from './Body/GuildInfo'
import MemberInfo from './Body/MemberInfo'
const Body = (props) => {
    const [data, setData] = useState();
    registerCallBack((data) => { setData(data)})
    // Display the data if we have it
    if(data) {
        console.log(data);
        return (
            <div class="body">
                <h1>Guild Data: {data.name}</h1>
                <h3>Description: {data.desc}</h3>
                <Accordion>
                    <GuildInfo/>
                    <MemberInfo />
                </Accordion>
            </div>
        );
    }
    // Display a spinner if not
    else return (
        <div class="body">
            <div className="loading">
                <Spinner animation="border" size="m" />
                <h1>Loading data...</h1>
            </div>
        </div>
    )
};

export default Body;
