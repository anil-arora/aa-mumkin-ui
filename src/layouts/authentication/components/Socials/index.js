/**
 =========================================================
 * BalAsha - Nurture - v4.0.2
 =========================================================

 * Product Page: https://balasha-nurture.web.app/product/soft-ui-dashboard-react
 * Copyright 2024 BalAsha - Nurture (https://balasha-nurture.web.app)

 =========================================================

 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 */

// BalAsha - Nurture components
import SoftButton from "components/SoftButton";
import SoftBox from "components/SoftBox";


import {
    signInWithPopup,
    getAdditionalUserInfo,
    GoogleAuthProvider,
} from "firebase/auth";
import {auth, googleProvider} from "../../../../platform/firebase";
import {useNavigate} from "react-router-dom";
import axiosInstance from "../../../../platform/axiosConfig";


function Socials() {

    const navigate = useNavigate();
    const setAuthToken = (token) => {
        //axios.defaults.baseURL= 'http://localhost:8080'
        if (token) {
            setTokenCookie(token);
            // Apply the token to all requests' headers
            axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        } else {
            // If there's no token, remove the Authorization header
            delete axiosInstance.defaults.headers.common['Authorization'];
        }
    };

    function setTokenCookie(token) {
        // Set the token cookie with a 1-hour expiration time
        document.cookie = `access_token=${token}; max-age=3600; path=/; secure; samesite=strict`;
      }

    function getTokenCookie() {
        const match = document.cookie.match('/(^| )access_token=([^;]+)/');
        return match ? match[2] : null;
      }

    function loginToUpdateClaim(token, user) {
        const loginUri = '/api/v1/auth/login';
        axiosInstance.post(loginUri)
            .then(() => {
                user.getIdToken(true) // 'true' forces a refresh of the token
                .then((newIdToken) => {
                    // Store the updated token in localStorage or cookies
                    setAuthToken(newIdToken);
                    navigate('/dashboards/default');
                })
                .catch((error) => {
                    console.error(error)
                    navigate('/error');
                });
            })
            .catch((err) => {
                console.error(err)
            });
    }

    const loginViaGoogle = (event) => {
        signInWithPopup(auth, googleProvider)
            .then((result) => {
                // This gives you a Google Access Token. You can use it to access the Google API.
                const credential = GoogleAuthProvider.credentialFromResult(result);
                const token = credential.accessToken;
                // The signed-in user info.
                const user = result.user;

                user.getIdToken(true).then(token => {
                    loginToUpdateClaim(token, user);
                })

                let additionalUserInfo = getAdditionalUserInfo(result);
                // IdP data available using getAdditionalUserInfo(result)
                // ...
                // window.location.href = '/dashboards/default';
                //navigate('/dashboards/default');
            }).catch((error) => {
            // Handle Errors here.
            const errorCode = error.code;
            const errorMessage = error.message;
            // The email of the user's account used.
            const email = error.customData.email;
            // The AuthCredential type that was used.
            const credential = GoogleAuthProvider.credentialFromError(error);
            console.error(error);
            // ...
        });
        console.log("Trying to login Via Google");
    };

    /* const [, dispatch] = useSoftUIController();
     const { pathname } = useLocation();
     useEffect(() => {
       setLayout(dispatch, "dashboard");
     }, [pathname]);*/

    return (
        <SoftBox display="flex" justifyContent="center">
            
            <SoftButton variant="outlined" color="light" onClick={loginViaGoogle}>

                <svg width="24px" height="32px" viewBox="0 0 64 64" version="1.1">
                    <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                        <g transform="translate(3.000000, 2.000000)" fillRule="nonzero">
                            <path
                                d="M57.8123233,30.1515267 C57.8123233,27.7263183 57.6155321,25.9565533 57.1896408,24.1212666 L29.4960833,24.1212666 L29.4960833,35.0674653 L45.7515771,35.0674653 C45.4239683,37.7877475 43.6542033,41.8844383 39.7213169,44.6372555 L39.6661883,45.0037254 L48.4223791,51.7870338 L49.0290201,51.8475849 C54.6004021,46.7020943 57.8123233,39.1313952 57.8123233,30.1515267"
                                fill="#4285F4"
                            />
                            <path
                                d="M29.4960833,58.9921667 C37.4599129,58.9921667 44.1456164,56.3701671 49.0290201,51.8475849 L39.7213169,44.6372555 C37.2305867,46.3742596 33.887622,47.5868638 29.4960833,47.5868638 C21.6960582,47.5868638 15.0758763,42.4415991 12.7159637,35.3297782 L12.3700541,35.3591501 L3.26524241,42.4054492 L3.14617358,42.736447 C7.9965904,52.3717589 17.959737,58.9921667 29.4960833,58.9921667"
                                fill="#34A853"
                            />
                            <path
                                d="M12.7159637,35.3297782 C12.0932812,33.4944915 11.7329116,31.5279353 11.7329116,29.4960833 C11.7329116,27.4640054 12.0932812,25.4976752 12.6832029,23.6623884 L12.6667095,23.2715173 L3.44779955,16.1120247 L3.14617358,16.2554937 C1.14708246,20.2539019 0,24.7439491 0,29.4960833 C0,34.2482175 1.14708246,38.7380388 3.14617358,42.736447 L12.7159637,35.3297782"
                                fill="#FBBC05"
                            />
                            <path
                                d="M29.4960833,11.4050769 C35.0347044,11.4050769 38.7707997,13.7975244 40.9011602,15.7968415 L49.2255853,7.66898166 C44.1130815,2.91684746 37.4599129,0 29.4960833,0 C17.959737,0 7.9965904,6.62018183 3.14617358,16.2554937 L12.6832029,23.6623884 C15.0758763,16.5505675 21.6960582,11.4050769 29.4960833,11.4050769"
                                fill="#EB4335"
                            />
                        </g>
                    </g>
                </svg>

            </SoftButton>
        </SoftBox>
    );
}

export default Socials;
