import {Alert, Button, Card, Checkbox, Descriptions, Form, Input, Modal, Popconfirm, Space, Table} from "antd";
import React, {useEffect, useRef, useState} from "react";
import {useMoralis} from "react-moralis";
import {useHistory, useLocation} from "react-router";
import Moralis from "moralis";
import AddressInput from "./AddressInput";

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
    nftCard: {
        boxShadow: "0 0.5rem 1.2rem rgb(189 197 209 / 20%)",
        border: "1px solid #e7eaf3",
        borderRadius: "0.5rem",
        height: "100%",
        width: "32rem",
        // marginTop: "6rem",
        // marginLeft: "0.5rem"
    },
    plusIcon: {
        width: "5rem",
        height: "5rem"
    },
    deleteButton: {
        width: "100%",
        marginTop: "1rem",
    },
    updateButton: {
        width: "100%"
    }
};

export default function NewProject() {
    const {user} = useMoralis();
    const [alertInfo, setAlertInfo] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [isSearching, setIsSearching] = useState(false)
    const [showModal, setShowModal] = useState(false)
    const [foundNfts, setFoundNfts] = useState([])
    const [nftMeta, setNftMeta] = useState('')
    const [selectedNftAddr, setSelectedNftAddr] = useState('')
    const [nftContractAddress, setNftContractAddress] = useState();
    const projectNameRef = useRef();
    const activationUrlRef = useRef();
    const deactivationUrlRef = useRef();
    const requiredNftRef = useRef();
    const nftSearchInput = useRef();
    const isPublicRef = useRef();
    const history = useHistory();
    const location = useLocation();
    const existingProject = location.state?.project;
    const [form] = Form.useForm();

    useEffect(async () => {
        try {
            const result = await Moralis.Web3API.token.getNFTMetadata({address: selectedNftAddr})
            setNftMeta({name: result.name, symbol: result.symbol, address: selectedNftAddr})
        } catch (e) {
            console.log()
        } finally {

        }
    }, [selectedNftAddr]);

    useEffect(async () => {
        if (existingProject) {
            const Project = new Moralis.Object.extend("Project");
            let project = new Project();
            project.set("id", location.state.id)

            if (!project.isDataAvailable()) {
                project = await project.fetch();
            }
            setNftMeta(setNftMeta({
                name: project.get("requiredNftName"),
                symbol: project.get("requiredNftSymbol"),
                address: project.get("requiredNftAddress")
            }))

            form.setFieldsValue({requiredNftAddress: project.get("requiredNftAddress")})
            setSelectedNftAddr(project.get("requiredNftAddress"))
        }
    }, [])

    async function onDeleteClick(e) {
        e.preventDefault();
        setIsLoading(true)
        setAlertInfo("")

        try {
            const Project = new Moralis.Object.extend("Project");
            let project = new Project();
            project.set("id", location.state.id)

            if (!project.isDataAvailable()) {
                project = await project.fetch();
            }

            await project.destroy()
            history.push("/projects")
        } catch (e) {
            setAlertInfo("Sth went wrong - can't delete")
            console.error(e)
        } finally {
            setIsLoading(false)
        }
    }


    async function nftSearch(e) {
        setIsSearching(true)
        setAlertInfo("")
        e.preventDefault();

        try {
            if (!nftContractAddress && nftSearchInput?.current?.input?.value) {
                const result = await Moralis.Web3API.token.searchNFTs(
                    {
                        q: nftSearchInput.current.input.value,
                        chain: "eth",
                        filter: "name"
                    }
                )
                const collections = new Array(...new Set(result.result.map(nft => nft.token_address)))
                setFoundNfts(collections)
            }

            if (nftContractAddress) {
                const result = await Moralis.Web3API.token.getNFTMetadata(
                    {
                        address: nftContractAddress
                    }
                )
                setFoundNfts([result.token_address])
            }

        } catch (e) {
            setAlertInfo("Sth went wrong :(")
            console.error(e)
        } finally {
            setIsSearching(false)
        }
    }

    async function onCreateClick(e) {
        e.preventDefault();
        if (!(projectNameRef?.current?.input?.value && activationUrlRef?.current?.input?.value && deactivationUrlRef?.current?.input?.value)) {
            setAlertInfo("Not all fields are filled")
            return
        }

        setIsLoading(true)
        setAlertInfo("")




        try {
            // const result = await Moralis.Cloud.run("HelloWorld")
            const Project = new Moralis.Object.extend("Project");
            let project = new Project();

            if (existingProject) {
                project.set("id", location.state.id)
            }

            if (existingProject && !project.isDataAvailable()) {
                project = await project.fetch();
            }

            project.set("owner", user)
            project.set("name", projectNameRef.current.input.value)
            project.set("kajabiActivationUrl", activationUrlRef.current.input.value)
            project.set("kajabiDeactivationUrl", deactivationUrlRef.current.input.value)
            project.set("isPublic", isPublicRef.current.input.checked || false)

            project.set("requiredNftAddress", nftMeta.address)
            project.set("requiredNftName", nftMeta.name)
            project.set("requiredNftSymbol", nftMeta.symbol)

            await project.save()

            if (existingProject) {
                setAlertInfo("Updated successfuly")
            } else {
                history.push("/projects")
            }

        } catch (e) {
            setAlertInfo("Sth went wrong :(")
            console.error("Sth went wrong." + e)
        } finally {
            setIsLoading(false)
        }
    };

    return (
        <div style={{display: "flex"}}>
            <Card title={"New Project"} style={styles.card}>
                {alertInfo && <Alert message={alertInfo}/>}
                <Form form={form}
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
                        type="url"
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
                        label="Make project publicly visible:"
                        name="isPublic"
                    >
                        <Checkbox ref={isPublicRef}/>
                    </Form.Item>

                    <Form.Item label="Require NFT from collection:">
                        <Input.Group compact>
                            <Form.Item name="requiredNftAddress" style={{width: 'calc(100% - 8rem)'}}>
                                <Input disabled ref={requiredNftRef}/>
                            </Form.Item>
                            <Button style={{width: '8rem'}} onClick={() => setShowModal(true)}>NFT Search </Button>
                            {nftMeta && <Descriptions title={"NFT Collection Info:"}>
                                <Descriptions.Item label={"name"}>{nftMeta.name || "?"}</Descriptions.Item>
                                <Descriptions.Item label={"symbol"}>{nftMeta.symbol || "?"}</Descriptions.Item>
                            </Descriptions>}
                        </Input.Group>
                    </Form.Item>

                    <Button style={styles.updateButton} disabled={isLoading || isSearching} type="primary"
                            onClick={onCreateClick}>
                        {existingProject && "Update"}
                        {!existingProject && "Create"}
                    </Button>

                    {existingProject &&
                    <Popconfirm disabled={isLoading || isSearching} title="It can't be reverted, are you sure?"
                                onConfirm={onDeleteClick}>
                        <Button danger style={styles.deleteButton}>
                            Delete project
                        </Button>
                    </Popconfirm>}
                </Form>
            </Card>
            <Modal width={"35rem"} visible={showModal} onOk={() => setShowModal(false)}
                   onCancel={() => setShowModal(false)}>
                <div>
                    <Card title="NFT Requirements" style={styles.nftCard}>
                        <Form
                            labelCol={{
                                span: 28,
                            }}
                            wrapperCol={{
                                span: 28,
                            }}
                            layout="vertical">

                            <Form.Item
                                label="Search collection by name:"
                                name="nftSearchInput"
                            >
                                <Input ref={nftSearchInput} placeholder={"fancy bears"}/>
                            </Form.Item>

                            <Form.Item
                                label="Alternatively search collection by it's contract address:"
                                name="nftContractAddress"
                            >
                                <AddressInput onChange={setNftContractAddress}
                                              placeholder={"0x87084ec881d5A15C918057F326790dB177D218F2"}/>
                            </Form.Item>

                            <Button loading={isSearching} type="secondary" onClick={nftSearch}>Search</Button>
                        </Form>
                        <br/>
                        {foundNfts &&
                        <div>
                            <Table
                                columns={[
                                    {title: 'Address', dataIndex: 'address', 'key': 'address'},
                                    {
                                        title: 'Action', key: 'action', render: (text, record) => (
                                            <Space size="middle"
                                                   onClick={() => {
                                                       form.setFieldsValue({requiredNftAddress: record.address})
                                                       setSelectedNftAddr(record.address)
                                                       setShowModal(false)
                                                   }}><a>select</a></Space>
                                        )
                                    },
                                ]}
                                dataSource={foundNfts.map(nft => {
                                    return {address: nft, dataIndex: nft, 'key': nft}
                                })}/>
                        </div>
                        }
                    </Card>
                </div>
            </Modal>

        </div>
    );
}
