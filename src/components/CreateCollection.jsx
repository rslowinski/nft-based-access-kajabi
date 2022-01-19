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

export default function CreateCollection() {


    return (
        <div style={{display: "flex", flexDirection: "column", gap: "10px", justifyContent: "center"}}>
            <span>You will be able to create your own NFT collection. It could later be used as a custom collection with access to your digital content.</span>
            <span>Another usage is the collection will be distributed to your existing customers.</span>
            <span>in progress...</span>
            <br/>
            <br/>
            <br/>
            <br/>
        </div>
    );
}
