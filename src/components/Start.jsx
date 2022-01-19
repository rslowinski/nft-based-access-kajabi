import {Typography} from "antd";
import React from "react";

const {Text} = Typography;

const styles = {
    title: {
        fontSize: "20px",
        fontWeight: "700",
    },
    text: {
        fontSize: "16px",
    },
    card: {
        boxShadow: "0 0.5rem 1.2rem rgb(189 197 209 / 20%)",
        border: "1px solid #e7eaf3",
        borderRadius: "0.5rem",
        width: "32rem",
        height: "24rem",
        minHeight: "10rem",
    },
    cardContent: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center"
    },
    plusIcon: {
        width: "5rem",
        height: "5rem"
    }
};

export default function Start() {


    return (
        <div style={{display: "flex", flexDirection: "column", gap: "10px", justifyContent: "center"}}>
            <span><strong>EVERSE</strong> aim is to revolutionize way of accessing digital content.</span>
            <span>You can grant access for your Kajebi content based on NFT collection ownership of your choice.</span>
            <span>TBD...</span>
            <br/>
            <br/>
            <br/>
            <br/>
        </div>
    );
}
