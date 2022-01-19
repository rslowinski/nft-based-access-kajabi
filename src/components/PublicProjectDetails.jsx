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
    // const projectId = props?.match?.params?.projectId
    const [project, setProject] = useState();
    const [projectId, setProjectId] = useState();
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

    }, [projectId])

    useEffect(() => {
        if (props?.match?.params?.projectId) {
            setProjectId(props.match.params.projectId)
        }
    }, [props.match.params])


    const fetchProject = useCallback(async () => {
        const result = await Moralis.Cloud.run("HelloWorld", {projectId: projectId})
        setProject(result)
        await checkEligibility()
    }, [projectId])

    const checkEligibility = useCallback(async () => {
        const requiredNfts = await Moralis.Web3API.account.getNFTsForContract({token_address: project.requiredNftAddress})
        console.log("has required nfts:" + requiredNfts.result.join(","))
        setIsEligible(requiredNfts.result.length > 0)

    }, [project]);

    return (
        <div style={{display: "flex", flexDirection: "column", gap: "10px"}}>
            {project && <Card style={styles.card}>

                <Descriptions title={"Project info"}>
                    <Descriptions.Item label={"project name"}>{project.name}</Descriptions.Item>
                    <Descriptions.Item label={"required nft"}>{project.requiredNftName}</Descriptions.Item>
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
