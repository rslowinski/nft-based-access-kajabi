import {useEffect} from "react";
import {useMoralis} from "react-moralis";
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import Account from "components/Account/Account";
import {Layout} from "antd";
import "antd/dist/antd.css";
import "./style.css";
import Text from "antd/lib/typography/Text";
import MenuItems from "./components/MenuItems";
import {ReactComponent as AppLogo} from './logo.svg';
import Projects from "./components/Projects";
import NewProject from "./components/NewProject";
import PublicProjectDetails from "./components/PublicProjectDetails";
import Start from "./components/Start";

const {Header, Footer} = Layout;

const styles = {
    content: {
        display: "flex",
        justifyContent: "center",
        fontFamily: "Roboto, sans-serif",
        color: "#041836",
        marginTop: "130px",
        padding: "10px",
    },
    header: {
        position: "fixed",
        zIndex: 1,
        width: "100%",
        background: "#fff",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        fontFamily: "Roboto, sans-serif",
        borderBottom: "2px solid rgba(0, 0, 0, 0.06)",
        padding: "0 10px",
        boxShadow: "0 1px 10px rgb(151 164 175 / 10%)",
    },
    headerRight: {
        display: "flex",
        gap: "20px",
        alignItems: "center",
        fontSize: "15px",
        fontWeight: "600",
    },
};
const App = ({isServerInfo}) => {
    const {isWeb3Enabled, enableWeb3, isAuthenticated, isWeb3EnableLoading} = useMoralis();

    useEffect(() => {
        const connectorId = window.localStorage.getItem("connectorId");
        if (isAuthenticated && !isWeb3Enabled && !isWeb3EnableLoading) enableWeb3({provider: connectorId});
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isAuthenticated, isWeb3Enabled]);

    return (
        <Layout style={{height: "100vh", overflow: "auto"}}>
            <Router>
                <Header style={styles.header}>
                    <AppLogo/>
                    <MenuItems/>
                    <div style={styles.headerRight}>
                        {/*<Chains />*/}
                        <Account/>
                    </div>
                </Header>

                <div style={styles.content}>
                    <Switch>
                        <Route exact path={"/"}>
                            <Start/>
                        </Route>
                        <Route path="/projects">
                            <Projects/>
                        </Route>
                        <Route path="/new-project">
                            <NewProject/>
                        </Route>
                        <Route path="/project/:projectId" component={PublicProjectDetails}/>
                    </Switch>
                </div>
            </Router>
            <Footer style={{textAlign: "center"}}>

                <Text style={{display: "block"}}>
                    🙋 Questions? Write an e-mail to radslow97@gmail.com
                </Text>
            </Footer>
        </Layout>
    );
};


export default App;
