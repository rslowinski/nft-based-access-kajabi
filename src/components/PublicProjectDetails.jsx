import {Button, Card, Checkbox, Descriptions, Image, Typography} from "antd";
import React, {useCallback, useEffect, useState} from "react";
import {useMoralis} from "react-moralis";
import {ReactComponent as PlusIcon} from "../plus.svg";
import {useHistory, useLocation} from "react-router";
import Account from "./Account/Account";
import {CheckCircleOutlined, CloseCircleOutlined} from "@ant-design/icons";

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
    const {Moralis, isAuthenticated} = useMoralis();
    const projectId = props?.match?.params?.projectId
    const [project, setProject] = useState();
    const [isEligible, setIsEligible] = useState(false);
    const [nothingFound, setNothingFound] = useState();

    useEffect(async () => {
        try {
            await fetchProject(projectId)
        } catch (e) {
            console.log(e)
            setNothingFound(true)
        } finally {
        }

    }, [props.match.params])

    const fetchProject = useCallback(async () => {
        const Project = Moralis.Object.extend("Project");
        const query = new Moralis.Query(Project);
        query.equalTo("isPublic", true)
        query.equalTo("objectId", projectId)
        const result = await query.first()
        setProject(result)
        await checkEligibility()
    }, [])

    const checkEligibility = useCallback(async () => {
        const requiredNfts = await Moralis.Web3API.account.getNFTsForContract({token_address: project.get("requiredNftAddress")})
        setIsEligible(requiredNfts.result.length > 0)

    }, [project]);

    return (
        <div style={{display: "flex", flexDirection: "column", gap: "10px"}}>
            {project && <Card style={styles.card}>

                <Descriptions title={"Project info"}>
                    <Descriptions.Item label={"project name"}>{project.get("name")}</Descriptions.Item>
                    <Descriptions.Item label={"required nft"}>{project.get("requiredNftName")}</Descriptions.Item>
                </Descriptions>

                {!isAuthenticated &&
                <span>Sign in with your wallet to check for eligibility:
                    <div><Button><Account/></Button></div>
                </span>}

                {isAuthenticated &&
                <div>
                    Eligibility status:
                    {!isEligible &&
                    <CloseCircleOutlined style={{marginLeft: "0.5rem", fontSize: '20px', color: 'red'}}/>}
                    {isEligible &&
                    <CheckCircleOutlined style={{marginLeft: "0.5rem", fontSize: '20px', color: 'green'}}/>}
                </div>}

            </Card>}
            {!project && nothingFound && <h3>Nothing here...</h3>}
        </div>
    );
}
