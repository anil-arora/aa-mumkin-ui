/**
 =========================================================
 * BalAsha - Nurture - v4.0.2
 =========================================================

 * Product Page: https://balasha-nurture.web.app/product/soft-ui-dashboard-react
 * Copyright 2024 BalAsha - Nurture (https://balasha-nurture.web.app)

 =========================================================

 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 */

import {useState, useEffect, useMemo} from "react";

import Success from "layouts/pages/sweet-alerts/components/Success";
import CustomHtml from "layouts/pages/sweet-alerts/components/CustomHtml";
import GithubAvatarRequest from "layouts/pages/sweet-alerts/components/GithubAvatarRequest";
import TitleWithText from "layouts/pages/sweet-alerts/components/TitleWithText";
import AutoClose from "layouts/pages/sweet-alerts/components/AutoClose";
import WithAttachedFunction from "layouts/pages/sweet-alerts/components/WithAttachedFunction";
import WithSuccessAttachedFunction from "layouts/pages/sweet-alerts/components/WithSuccessAttachedFunction";
import RtlLanguarge from "layouts/pages/sweet-alerts/components/RtlLanguarge";

import Grid from "@mui/material/Grid";

// react-router components
import {Routes, Route, Navigate, useLocation, useNavigate} from "react-router-dom";

// @mui material components
import {ThemeProvider} from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Icon from "@mui/material/Icon";

// BalAsha - Nurture components
import SoftBox from "components/SoftBox";

// BalAsha - Nurture example components
import Sidenav from "examples/Sidenav";
import Configurator from "examples/Configurator";

// BalAsha - Nurture themes
import theme from "assets/theme";
import themeRTL from "assets/theme/theme-rtl";

// RTL plugins
import rtlPlugin from "stylis-plugin-rtl";
import {CacheProvider} from "@emotion/react";
import createCache from "@emotion/cache";

// BalAsha - Nurture routes
import routes from "routes";

// BalAsha - Nurture contexts
import {useSoftUIController, setMiniSidenav, setOpenConfigurator} from "context";

// Images
import brand from "assets/images/logo-ct.png";
import {useAuthState} from "react-firebase-hooks/auth";
import {auth} from "./platform/firebase";
import SignInBasic from "layouts/authentication/sign-in/basic";

import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import Widgets from "./layouts/pages/widgets";
import LoginScreen from "./custom/LoginScreen";
import axiosInstance, {setupResponseInterceptor} from "./platform/axiosConfig";
import UnAuthorizedUser from "./layouts/default/error";
import { UserContext } from "custom/UserContext";

export default function App() {
    const [controller, dispatch] = useSoftUIController();
    const {miniSidenav, direction, layout, openConfigurator, sidenavColor} = controller;
    const [onMouseEnter, setOnMouseEnter] = useState(false);
    const [rtlCache, setRtlCache] = useState(null);
    const {pathname} = useLocation();
    const [loggedUser, setLoggedUser] = useState(null);
    const [responseInterceptor, setResponseInterceptor] = useState(false)
    const [user] = useAuthState(auth);

    //Setup the Response Interceptor globally for once
    const navigate = useNavigate()
    if (!responseInterceptor) {
        setResponseInterceptor(true)
        setupResponseInterceptor(navigate)
    }

    // Cache for the rtl
    useMemo(() => {
        const cacheRtl = createCache({
            key: "rtl",
            stylisPlugins: [rtlPlugin],
        });

        setRtlCache(cacheRtl);
    }, []);
    // Open sidenav when mouse enter on mini sidenav
    const handleOnMouseEnter = () => {
        if (miniSidenav && !onMouseEnter) {
            setMiniSidenav(dispatch, false);
            setOnMouseEnter(true);
        }

    };
    // Close sidenav when mouse leave mini sidenav
    const handleOnMouseLeave = () => {
        if (onMouseEnter) {
            setMiniSidenav(dispatch, true);
            setOnMouseEnter(false);
        }

    };
    // Change the openConfigurator state
    const handleConfiguratorOpen = () => setOpenConfigurator(dispatch, !openConfigurator);

    const getRoutes = (allRoutes) =>
        allRoutes.map((route) => {
            if (route.collapse) {
                return getRoutes(route.collapse);
            }

            if (route.route) {
                return <Route exact path={route.route} element={route.component} key={route.key}/>;
            }

            return null;
        });

    function loginToUpdateClaim(user) {
        const loginUri = '/api/v1/auth/login';
        axiosInstance.post(loginUri)
            .then(() => {
                navigate('/dashboards/default');
            })
            .catch((err) => {
                navigate('/error');
                console.error(err)
            });
    }

    useEffect(() => {

        auth.onAuthStateChanged(user => {
            if (user) {
                user.getIdToken(true).then(token => {
                    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                    loginToUpdateClaim(user);
                })
            }
            setLoggedUser(user);
        })
    }, []);

    
    // Setting the dir attribute for the body element

    useEffect(() => {
        document.body.setAttribute("dir", direction);
    }, [direction]);
    // Setting page scroll to 0 when changing the route

    useEffect(() => {
        document.documentElement.scrollTop = 0;
        document.scrollingElement.scrollTop = 0;
    }, [pathname]);

    const configsButton = (
        <SoftBox
            display="flex"
            justifyContent="center"
            alignItems="center"
            width="3.5rem"
            height="3.5rem"
            bgColor="white"
            shadow="sm"
            borderRadius="50%"
            position="fixed"
            right="2rem"
            bottom="2rem"
            zIndex={99}
            color="dark"
            sx={{cursor: "pointer"}}
            onClick={handleConfiguratorOpen}
        >
            <Icon fontSize="default" color="inherit">
                settings
            </Icon>
        </SoftBox>
    );


    if (!loggedUser) {
        return (
            <LoginScreen/>
        );

    } else {
        return direction === "rtl" ? (
            <CacheProvider value={rtlCache}>
                <ThemeProvider theme={themeRTL}>
                    <CssBaseline/>
                    {layout === "dashboard" && (
                        <>
                            <Sidenav
                                color={sidenavColor}
                                brand={brand}
                                brandName="Mumkin"
                                routes={routes}
                                onMouseEnter={handleOnMouseEnter}
                                onMouseLeave={handleOnMouseLeave}
                            />
                            <Configurator/>
                            {configsButton}
                        </>
                    )}
                    {layout === "vr" && <Configurator/>}
                    <Routes>
                        {getRoutes(routes)}
                        <Route path="*" element={<Navigate to="/dashboards/default"/>}/>
                        <Route path="/error" element={<UnAuthorizedUser/>}/>
                    </Routes>
                </ThemeProvider>
            </CacheProvider>
        ) : (
            <ThemeProvider theme={theme}>
                <CssBaseline/>
                {layout === "dashboard" && (
                    <>
                        <Sidenav
                            color={sidenavColor}
                            brand={brand}
                            brandName="Mumkin"
                            routes={routes}
                            onMouseEnter={handleOnMouseEnter}
                            onMouseLeave={handleOnMouseLeave}
                        />
                        <Configurator/>
                        {configsButton}
                    </>
                )}
                {layout === "vr" && <Configurator/>}
                <UserContext.Provider value={{"userName":loggedUser.displayName,"userEmail":loggedUser.email}}>
                <Routes>
                    {getRoutes(routes)}
                    <Route path="*" element={<Navigate to="/dashboards/default"/>}/>
                    <Route path="/error" element={<UnAuthorizedUser/>}/>
                </Routes>
                </UserContext.Provider>
            </ThemeProvider>
        );
    }

}
