import {Alert, Button, Card, Checkbox, Form, Input, Typography} from "antd";
import React, {useState} from "react";
import {useMoralis} from "react-moralis";
import {ReactComponent as PlusIcon} from "../plus.svg";
import Moralis from "moralis";

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
    const [alertInfo, setAlertInfo] = useState('')
    const [componentSize, setComponentSize] = useState('default');
    const [isLoading, setIsLoading] = useState(false)

    const onFormLayoutChange = ({size}) => {
        setComponentSize(size);
    };

    async function onCreateClick(e) {
        setIsLoading(true)
        setAlertInfo("")
        e.preventDefault();

        try {
            const result = await Moralis.Cloud.run("HelloWorld")
            setAlertInfo(result);

        } catch(e) {
            setAlertInfo("Sth went wrong :(")
            console.error("Sth went wrong :( " + e)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div style={{display: "flex"}}>
            <Card title={"New Project"} style={styles.card}>
                {alertInfo && <Alert message={JSON.stringify(alertInfo)}/>}
                <Form
                    labelCol={{
                        span: 28,
                    }}
                    wrapperCol={{
                        span: 28,
                    }}
                    layout="vertical"
                    initialValues={{
                        size: componentSize,
                    }}
                    onValuesChange={onFormLayoutChange}
                    size={componentSize}
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
                        <Input/>
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
                        <Input
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
                        <Input
                            placeholder={"https://checkout.kajabi.com/webhooks/offers/Z6agK6y75YFThX5K/2147948158/deactivate"}/>
                    </Form.Item>

                    <Form.Item
                        label="Make project publicly available:"
                        name="isPublic"
                    >
                        <Checkbox/>
                    </Form.Item>

                    <Button disabled={isLoading} type="primary" onClick={onCreateClick}>
                        Create
                    </Button>
                </Form>
            </Card>
        </div>
    );
}
