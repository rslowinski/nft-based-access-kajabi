import {Alert, Button, Card, Checkbox, Form, Input} from "antd";
import React, {useCallback, useRef, useState} from "react";
import {useMoralis} from "react-moralis";
import {useHistory, useLocation} from "react-router";
import Moralis from "moralis";

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
        height: "100%",
        minHeight: "32rem",
        width: "32rem"
    },
    plusIcon: {
        width: "5rem",
        height: "5rem"
    }
};

export default function NewProject() {
    const {user} = useMoralis();
    const [alertInfo, setAlertInfo] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const projectNameRef = useRef();
    const activationUrlRef = useRef();
    const deactivationUrlRef = useRef();
    const isPublicRef = useRef();
    const history = useHistory();
    const location = useLocation();
    const existingProject = location.state?.project;


    async function onCreateClick(e) {
        setIsLoading(true)
        setAlertInfo("")
        e.preventDefault();

        try {
            // const result = await Moralis.Cloud.run("HelloWorld")
            const Project = new Moralis.Object.extend("Project");
            let project = new Project();

            if (existingProject) {
                project.set("id", location.state.id)
            }

            if (!project.isDataAvailable()) {
                project = await project.fetch();
            }

            project.set("owner", user)
            project.set("name", projectNameRef.current.input.value)
            project.set("kajabiActivationUrl", activationUrlRef.current.input.value)
            project.set("kajabiDeactivationUrl", deactivationUrlRef.current.input.value)
            project.set("isPublic", isPublicRef.current.input.checked || false)

            await project.save()

            if (existingProject) {
                setAlertInfo("Updated successfuly")
            } else {
                history.push("/projects")
            }

        } catch (e) {
            setAlertInfo("Sth went wrong :(")
            console.error("Sth went wrong :( " + e)
        } finally {
            setIsLoading(false)
        }
    };

    return (
        <div style={{display: "flex"}}>
            <Card title={"New Project"} style={styles.card}>
                {alertInfo && <Alert message={alertInfo}/>}
                <Form
                    labelCol={{
                        span: 28,
                    }}
                    wrapperCol={{
                        span: 28,
                    }}
                    layout="vertical"
                    initialValues={{
                        projectName: existingProject?.name || "",
                        activationUrl: existingProject?.kajabiActivationUrl || "",
                        deactivationUrl: existingProject?.kajabiDeactivationUrl || "",
                        isPublic: existingProject?.isPublic || false,
                    }}
                >

                    <Form.Item
                        label="Project name:"
                        name="projectName"
                        rules={[
                            {
                                required: true,
                                message: 'Please provide project name.',
                            },
                        ]}
                    >
                        <Input ref={projectNameRef}/>
                    </Form.Item>

                    <Form.Item
                        label="Kajabi Webhook Activation URL:"
                        name="activationUrl"
                        tooltip={"https://help.kajabi.com/hc/en-us/articles/360037245374-How-to-Use-Webhooks-on-Kajabi"}
                        rules={[
                            {
                                required: true,
                                message: 'Please provide Kajabi Inbound Webhook for user activation. Help https://help.kajabi.com/hc/en-us/articles/360037245374-How-to-Use-Webhooks-on-Kajabi',
                            },
                        ]}
                    >
                        <Input ref={activationUrlRef}
                               placeholder={"https://checkout.kajabi.com/webhooks/offers/Z6agK6y75YFThX5K/2147948158/activate"}/>
                    </Form.Item>
                    <Form.Item
                        label="Kajabi Webhook Deactivation URL:"
                        name="deactivationUrl"
                        tooltip={"https://help.kajabi.com/hc/en-us/articles/360037245374-How-to-Use-Webhooks-on-Kajabi"}
                        rules={[
                            {
                                required: true,
                                message: 'Please provide Kajabi Inbound Webhook for user deactivation. Help https://help.kajabi.com/hc/en-us/articles/360037245374-How-to-Use-Webhooks-on-Kajabi',
                            },
                        ]}
                    >
                        <Input ref={deactivationUrlRef}
                               placeholder={"https://checkout.kajabi.com/webhooks/offers/Z6agK6y75YFThX5K/2147948158/deactivate"}/>
                    </Form.Item>

                    <Form.Item
                        valuePropName="checked"
                        label="Make project publicly available:"
                        name="isPublic"
                    >
                        <Checkbox ref={isPublicRef}/>
                    </Form.Item>

                    <Button disabled={isLoading} type="primary" onClick={onCreateClick}>
                        {existingProject && "Update"}
                        {!existingProject && "Create"}
                    </Button>
                </Form>
            </Card>
        </div>
    );
}
