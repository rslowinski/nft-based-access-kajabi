import {Card, Checkbox, Descriptions, Image, Typography} from "antd";
import React, {useEffect, useState} from "react";
import {useMoralis} from "react-moralis";
import {ReactComponent as PlusIcon} from "../plus.svg";
import {useHistory, useLocation} from "react-router";

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
        height: "12rem",
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

export default function PublicProjectDetails(props) {
    const {Moralis} = useMoralis();
    const history = useHistory();
    const projectId = props?.match?.params?.projectId
    const [isLoading, setIsLoading] = useState(true)
    const [project, setProject] = useState();

    useEffect(async () => {
        try {
            const Project = Moralis.Object.extend("Project");
            const query = new Moralis.Query(Project);
            query.equalTo("isPublic", true)
            query.get(projectId)
            const result = await query.first()
            setProject(result)
        } catch (e) {
            console.log(e)
        } finally {

        }

    }, [props.match])

    return (
        <div style={{display: "flex", flexDirection: "column", gap: "10px"}}>
            {project && <Card style={styles.card}>

                <Descriptions title={"Project info"}>
                    <Descriptions.Item label={"project name"}>{project.get("name")}</Descriptions.Item>
                    <Descriptions.Item label={"required nft"}>{project.get("requiredNftName")}</Descriptions.Item>
                </Descriptions>

            </Card>}
        </div>
    );
}
