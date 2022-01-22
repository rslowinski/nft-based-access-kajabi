import {Alert, Button, Card, Checkbox, Descriptions, Form, Image, Input, Typography} from "antd";
import React, {useCallback, useEffect, useRef, useState} from "react";
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
        width: "22rem",
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

export default function PublicProjectDetails(props) {
    const {Moralis, isAuthenticated} = useMoralis();
    const [project, setProject] = useState();
    const [projectId, setProjectId] = useState();
    const [isEligible, setIsEligible] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [nothingFound, setNothingFound] = useState();
    const [info, setInfo] = useState();
    const emailRef = useRef();

    useEffect(async () => {
        async function f() {
            try {
                setIsLoading(true)
                await fetchProject(projectId)
            } catch (e) {
                console.log(e)
                setNothingFound(true)
            } finally {
                setIsLoading(false)
            }
        }

        f()

    }, [projectId])

    useEffect(() => {
        if (props?.match?.params?.projectId) {
            setProjectId(props.match.params.projectId)
        }
    }, [props.match.params])

    const submitEmail = async (e) => {
        e.preventDefault();
        setInfo("")

        if (emailRef.current?.input?.value) {
            try {
                await Moralis.Cloud.run("blah", {projectId: projectId, email: emailRef.current.input.value})
                setInfo("Email added successfuly - wait for further instruction")
            } catch (err) {
                setInfo("Sth went wrong... (" + (err || "") + ")")
            }
        }
    }


    const fetchProject = (async () => {
        try {
            const result = await Moralis.Cloud.run("HelloWorld", {projectId: projectId})
            setProject(result)
            await checkEligibility()
        } catch (e) {
            console.log(e)
        }
    })

    const checkEligibility = (async () => {
        if (!project) return
        try {
            setIsLoading(true)
            const requiredNfts = await Moralis.Web3API.account.getNFTsForContract({token_address: project.requiredNftAddress})
            console.log("has required nfts:" + requiredNfts.result.join(","))
            setIsEligible(requiredNfts.result.length > 0)
        } catch (e) {
        } finally {
            setIsLoading(false)
        }
    });

    return (
        <div style={{display: "flex", flexDirection: "column", gap: "10px"}}>
            {info && <Alert message={info}/>}
            {project && <Card style={styles.card}>

                <Descriptions title={"Project info"}>
                    <Descriptions.Item label={"project name"}>{project.name || "?"}</Descriptions.Item>
                    <Descriptions.Item
                        label={"required nft"}>{project.requiredNftName || (project.requiredNftAddress || "?")}</Descriptions.Item>
                </Descriptions>

                {!isAuthenticated &&
                <span>Sign in with your wallet to check for eligibility:
                    <div><Button><Account/></Button></div>
                </span>}

                {isAuthenticated &&
                <Card loading={isLoading}>

                    {!isEligible &&
                    <div> Eligibility status: <CloseCircleOutlined
                        style={{marginLeft: "0.5rem", fontSize: '20px', color: 'red', marginRight: "1rem"}}/><Button
                        disabled={isLoading} onClick={checkEligibility}>Refresh</Button></div>}
                    {isEligible &&
                    <div>
                        Eligibility status: <CheckCircleOutlined
                        style={{marginLeft: "0.5rem", fontSize: '20px', color: 'green'}}/>
                        <Form layout="vertical">
                            <Form.Item label="E-mail that will receive access to the project:">
                                <Input.Group compact>
                                    <Form.Item email name="email" style={{width: 'calc(100% - 8rem)'}}
                                               rules={[
                                                   {
                                                       required: true,
                                                       type: "email",
                                                       message: "Incorrect email"
                                                   },
                                               ]}
                                    >
                                        <Input ref={emailRef}/>
                                    </Form.Item>
                                    <Button style={{width: '8rem'}} onClick={submitEmail}>Submit</Button>
                                </Input.Group>
                            </Form.Item>

                        </Form>
                    </div>
                    }
                </Card>}

            </Card>}
            {!project && nothingFound && <h3>Nothing here...</h3>}
        </div>
    );
}
