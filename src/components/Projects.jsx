import {Card, Image, Typography} from "antd";
import React from "react";
import {useMoralis} from "react-moralis";
import {ReactComponent as PlusIcon} from "../plus.svg";
import {useHistory} from "react-router";

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
        width: "16rem",
        height: "100%",
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

export default function Projects() {
    const {Moralis} = useMoralis();
    const history = useHistory()

    function addNewProject() {
        history.push("/new-project")
    }

    return (
        <div style={{display: "flex", gap: "10px"}}>
            <Card hoverable style={styles.card} onClick={addNewProject} >
                <div style={styles.cardContent}>
                    <PlusIcon style={styles.plusIcon}/>
                    <br/>
                    <p><strong>Add a new project</strong></p>
                </div>
            </Card>
        </div>
    );
}
