import {Button, Form, Input, Modal, Space, Table} from "antd";
import styled from "styled-components";
import {useState} from "react";
import Moralis from "moralis";
import AddressInput from "./boilerplate-components/AddressInput";

const StyledModal = styled(Modal)`
`
const StyledButton = styled(Button)`
  margin: 0 0 1rem 0;
`

export default function NftSearchModal(props) {
    const [isLoading, setIsLoading] = useState(false);
    const [foundNfts, setFoundNfts] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [searchAddress, setSearchAddress] = useState("");

    const nftSearch = async () => {
        console.log("HEJA")
        console.log("HEJA")
        setIsLoading(true)

        try {
            if (!searchAddress && searchTerm) {
                const result = await Moralis.Web3API.token.searchNFTs(
                    {
                        q: searchTerm,
                        chain: "eth",
                        filter: "name"
                    }
                )
                const collections = new Array(...new Set(result.result.map(nft => nft.token_address)))
                setFoundNfts(collections)
            }

            if (searchAddress) {
                const result = await Moralis.Web3API.token.getNFTMetadata(
                    {
                        address: searchAddress
                    }
                )
                setFoundNfts([result.token_address])
            }

        } catch (e) {
            console.error(e)
        } finally {
            setIsLoading(false)
        }
    }

    const onSearchTermChange = (e) => {
        setSearchTerm(e.target.value);
    }

    return (
        <StyledModal
            visible={props.isVisible}
            onCancel={props.onOk}
            title="NFT Search"
            footer={null}
        >
            <div>

                <Form layout="vertical">
                    <Form.Item>
                        <Form.Item
                            label="Search collection by name:"
                            name="nftSearchInput"
                        >
                            <Input placeholder={"fancy bears"} onChange={onSearchTermChange}/>
                        </Form.Item>
                    </Form.Item>
                    <Form.Item
                        label="Alternatively search collection by it's contract address:"
                        name="nftContractAddress"
                    >
                        <AddressInput onChange={setSearchAddress}
                                      placeholder={"0x87084ec881d5A15C918057F326790dB177D218F2"}/>
                    </Form.Item>
                </Form>
                <StyledButton loading={isLoading} type="secondary" onClick={nftSearch}>Search</StyledButton>
            </div>
            <div>
                <Table scroll={{x: 'max-content'}} style={{width: "auto"}}
                       columns={[
                           {
                               title: 'Action', key: 'action', render: (text, record) => (
                                   <Space size="middle"
                                          onClick={() => {
                                              props.onAddressSelected(record.address)
                                              // form.setFieldsValue({requiredNftAddress: record.address})
                                              // setSelectedNftAddr(record.address)
                                              // setShowModal(false)
                                          }}><a>select</a></Space>
                               )
                           },
                           {title: 'Address', dataIndex: 'address', 'key': 'address'},
                       ]}
                       dataSource={foundNfts.map(nft => {
                           return {address: nft, dataIndex: nft, 'key': nft}
                       })}/>
            </div>
        </StyledModal>
    )

}