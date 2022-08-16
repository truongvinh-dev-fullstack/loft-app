// @ts-ignore
import jwtDecoder from 'jwt-decode';
import React, {useEffect, useRef, useState} from 'react';
import {observer} from 'mobx-react-lite';
import {
    Animated,
    Dimensions, FlatList, Image,
    StyleSheet,
    TouchableOpacity, View,
    ViewStyle, Modal
} from 'react-native';
import {MButton, Input, Screen, Text, Checkbox} from '../../components';
import {useNavigation} from '@react-navigation/native';
import {color} from '../../theme';
import {regexString, showToast} from '../../services';
import {login, signup} from '../../services/authActions';
import CenterSpinner from '../../components/center-spinner/center-spinner';
import {images} from '../../images';
import {useStores} from '../../models';

const ROOT: ViewStyle = {
    backgroundColor: color.primary,
    flex: 1,
};

const layout = Dimensions.get('window');

const IMAGE_HEIGHT = Dimensions.get('window').width / 2.5;
const IMAGE_HEIGHT_SMALL = Dimensions.get('window').width / 5;

export const LoginScreen = observer(function LoginScreen() {
    const [isLoading, setLoading] = useState(false);
    const [isSubmit, setSubmit] = useState(false);
    const [tabIndex, setTabIndex] = useState(0);
    const [registe_mobile, setRegiste_mobile]=useState(false)
    const [confirmModal, setConfirmModal]=useState(false)
    
    const [formData, setFormData] = useState<any>({
        username: '',
        password: '',
        passwordSecure: true,
    });
    const navigation = useNavigation();
    const {loft3DiModel} = useStores();
    const [imageHeight, setImageHeight] = useState(new Animated.Value(IMAGE_HEIGHT));

    const ref_input_password = useRef();

    

    useEffect(() => {
        if (tabIndex) {
            Animated.timing(imageHeight, {
                toValue: IMAGE_HEIGHT_SMALL,
                useNativeDriver: false,
            }).start();
        } else {
            Animated.timing(imageHeight, {
                toValue: IMAGE_HEIGHT,
                useNativeDriver: false,
            }).start();
        }
    }, [tabIndex]);

    const resetFormData = (isLogin) => {
        if (isLogin) {
            setFormData({
                username: '',
                password: '',
                passwordSecure: true,
            });
        } else {
            setFormData({
                surname: '',
                forename: '',
                email: '',
                phone: '',
                password: '',
                passwordConfirm: '',
                passwordSecure: true,
                passwordConfirmSecure: true,
                agree_1: false,
                agree_2: false,
            });
        }
        setSubmit(false);
    };

    const setChangeText = (type, value) => {
        let _formData = {...formData};
        _formData[type] = value;
        setFormData(_formData);
    };

    const checkSubmit = () => {
        console.log(formData);
        
        setSubmit(true);
        if (regexString(formData?.username)) {
            showToast('error', 'username cannot be empty');
            return false;
        }
        if (regexString(formData?.password)) {
            showToast('error', 'password cannot be empty');
            return false;
        }
        return true;
    };

    const goToPage = (page) => {
        navigation.navigate(page);
    };

    const topComponent = () => {
        return (
            <View style={styles.container}>
                <Animated.Image source={images.login_1} style={[styles.login_1, {height: imageHeight}]}/>           
                        <View style={{alignItems: 'center'}}> 
                            <Input
                                // onSubmitEditing={() => ref_input_password.current?.focus()}
                                blurOnSubmit={false}
                                placeholder='username' type='email-address'
                                status={isSubmit && regexString(formData?.username) ? 'danger' : ''}
                                value={formData?.username}
                                onChangeText={(value) => setChangeText('username', value)}/>
                            <Input
                                innerRef={ref_input_password}
                                // onSubmitEditing={() => submit()}
                                blurOnSubmit={false}
                                placeholder='password'
                                secureTextEntry={formData?.passwordSecure}
                                onChangeSecure={() => setChangeText('passwordSecure', !formData?.passwordSecure)}
                                status={isSubmit && regexString(formData?.password) ? 'danger' : ''}
                                value={formData?.password}
                                onChangeText={(value) => setChangeText('password', value)}/>
                            <TouchableOpacity style={styles.forgotPasswordWrapper}>
                                <Text style={styles.forgotPasswordText}>forgot your password?</Text>
                            </TouchableOpacity>
                            {/* <MButton text='log in' onPress={submit}/> */}
                            <MButton text='log in' onPress={submit}/>
                            <TouchableOpacity style={styles.forgotPasswordWrapper}>
                                <Text style={{marginBottom: 4}}>don't have an account?</Text>
                                <Text style={styles.signUpText}>sign up</Text>
                            </TouchableOpacity>
                        </View>
            </View>
        );
    };

    const submit = async () => {
        if (checkSubmit()) {
            console.log("Ok");
            
            setLoading(true);
            const successCallback = async (response) => {
                resetFormData(true);
                setLoading(false);
                let {user, messageCode, message} = response;
                if (!tabIndex) {
                const decodedToken = jwtDecoder(user?.token);
                await loft3DiModel.setUserInfo({
                    username: formData?.username,
                    // password: formData?.password,
                    token: user?.refreshToken,
                    surname: user?.Surname,
                    forename: user?.Forename,
                    id: user?.User_ID,
                    exp: decodedToken?.exp,
                    email: user?.User_Email,
                    phone: user?.User_Phone_Number,
                    avatar: user?.User_Avatar,
                    createdDate: user?.Created_Date,
                });

                } else {
                    showToast('success', message);
                }
                // if(!user?.Is_Mobile_App_User && user?.Is_Web_App_User){
                //     setRegiste_mobile(true)
                // }
                goToPage('dashboardScreen');
            };
            const errorCallback = (e) => {
                setLoading(false);
                if(e?.isExistsWeb){
                    setConfirmModal(true)
                }else{
                    showToast('error', e.message);
                }
            };
            if (tabIndex) {
                signup(formData?.forename, formData?.surname, formData?.email, formData?.phone, formData?.password, successCallback, errorCallback);
            } else {
                if(!registe_mobile){
                    login(formData?.username, formData?.password, successCallback, errorCallback, false);
                }
                else{
                    login(formData?.username, formData?.password, successCallback, errorCallback, true);
                }
            }
        }
    };

    return (
        <>
            {isLoading && <CenterSpinner/>}
            <Screen style={ROOT} preset="fixed">
                <FlatList
                    contentContainerStyle={{
                        flexGrow: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                    showsVerticalScrollIndicator={false}
                    showsHorizontalScrollIndicator={false}
                    style={{flex: 1, zIndex: 1}}
                    renderItem={null}
                    data={[]}
                    ListHeaderComponent={topComponent()}
                    keyExtractor={(item, index) => 'login-' + index + String(item)}
                />
                <Image resizeMode={'contain'} style={styles.login_2} source={images.login_2}/>
            </Screen>
        </>
    );
});

const styles = StyleSheet.create({
    login_1: {
        marginBottom: 32,
        resizeMode: 'contain',
    },
    login_2: {
        position: 'absolute',
        width: layout.width,
        bottom: -32,
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    forgotPasswordWrapper: {
        marginBottom: 16,
        alignItems: 'center',
    },
    forgotPasswordText: {
        color: color.danger,
    },
    signUpText: {
        color: color.danger,
    },
    passDescription: {
        width: layout.width * 3 / 4,
        marginBottom: 16,
        fontSize: 12,
        marginTop: -8,
        color: color.danger,
        textAlign: 'center'
    },
    centeredView: {
        marginTop: layout.height/10*3,
        width: layout.width / 10 * 8,
        height: layout.height/10*3,
        alignItems:'center',
        marginLeft: layout.width / 10 - 5

    },
    modalView: {
        flex: 1,
        backgroundColor: color.white,
        paddingVertical: 15,
        paddingHorizontal: 15
    },
});
