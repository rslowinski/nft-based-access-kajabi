import {Alert, Button, Card, Checkbox, Image, Typography} from "antd";
import React, {useEffect, useState} from "react";
import {useMoralis} from "react-moralis";
import {ReactComponent as PlusIcon} from "../plus.svg";
import {useHistory} from "react-router";
import {Link} from "react-router-dom";
import Account from "./Account/Account";

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
        minWidth: "18rem",
        minHeight: "12rem",
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
    const {user, Moralis, isAuthenticated} = useMoralis();
    const history = useHistory()
    const [projects, setProjects] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    function addNewProject() {
        history.push("/new-project")
    }

    useEffect(async () => {
        async function f() {
            setIsLoading(true)
            try {
                const Project = Moralis.Object.extend("Project");
                const query = new Moralis.Query(Project);
                query.equalTo("owner", user);
                const projects = await query.find();
                setProjects(projects)
            } catch (e) {
                console.error("Sth went wrong. " + e)
            } finally {
                setIsLoading(false)
            }
        };
        f();
    }, [user])

    function editProject(project) {
        history.push('/new-project', {project: project.attributes, id: project.id})
    }

    return (
        <div>
            {isAuthenticated && <div style={{display: "flex", flexDirection: "column", gap: "10px"}}>
                <Card hoverable style={styles.card} onClick={addNewProject}>
                    <div style={styles.cardContent}>
                        <PlusIcon style={styles.plusIcon}/>
                        <br/>
                        <p><strong>Add a new project</strong></p>
                    </div>
                </Card>
                {isLoading && <Card style={styles.card} loading={isLoading}/>}
                {isLoading && <Card style={styles.card} loading={isLoading}/>}
                {projects.map(p => {
                    return <Card title={p.get("name")} hoverable style={styles.card} onClick={() => editProject(p)}>
                        <div style={styles.cardContent}>
                            <span>is publicly available: <Checkbox disabled checked={p.get("isPublic")}/></span>
                            <span>Required NFT: {p.get("requiredNftName") || (p.get("requiredNftAddress") || "?")}</span>
                            {p.get("isPublic") && <span onClick={(e) => {
                                e.stopPropagation()
                            }}><Link to={"/project/" + p.id}>Project page</Link></span>}
                        </div>
                    </Card>
                })}
            </div>}
            {!isAuthenticated && <Card>
                <Alert type={"error"} message={"Authentication is required to create and list projects"}/>
                <br/>
                <Button style={{width: "100%"}}><Account/></Button>
            </Card>}
        </div>
    );
}
