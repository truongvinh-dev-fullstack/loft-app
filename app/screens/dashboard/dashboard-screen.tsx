import React, {useEffect, useState} from 'react';
import {observer} from 'mobx-react-lite';
import {
    View,
    ViewStyle,
    StyleSheet,
    TouchableOpacity,
    FlatList,
    Dimensions,
    TextInput,
    ScrollView,
    Modal,
} from 'react-native';
import {Header, MButton, Screen, Text, BtnBack} from '../../components';
import {useIsFocused, useNavigation, useRoute} from '@react-navigation/native';
import {color} from '../../theme';
import CenterSpinner from "../../components/center-spinner/center-spinner";
import {formatDate, showToast} from "../../services";
import {useQuery} from "@apollo/react-hooks";
import Ionicons from 'react-native-vector-icons/Ionicons';

import {useStores} from "../../models";
// import QRCodeScanner from 'react-native-qrcode-scanner';
import DatePicker from 'react-native-date-picker'
import SelectDropdown from 'react-native-select-dropdown'

const ROOT: ViewStyle = {
    flex: 1,
};

const layout = Dimensions.get('window');

export const DashboardScreen = observer(function DashboardScreen() {
    const {params}: any = useRoute();
    const navigation = useNavigation();
    const [dashboard, setDashboard] = useState<any>(null);
    const [isLoading, setLoading] = useState(false);
    const [isRefresh, setRefresh] = useState(false);
    const [showResult, setShowResult] = useState(false);
    const isFocused = useIsFocused();
    const {loft3DiModel} = useStores();
    const [modalVisible, setModalVisible] = useState<any>({
        viewInfo_general: false,
        recall: false,
        date_recall: false,
        maintenance: false
    });
    const [date_recall, setDate_recall] = useState(new Date())
    const [isShow, setShow] = useState<any>({
        fromDate: false,
        toDate: false,
    });
    const [datetime, setDatetime] = useState<any>({
        fromDate: new Date(),
        toDate: new Date(),
    });
    const [showScan, setShowScan] = useState(false)
    const [result, setResult] = useState()

    useEffect(() => {
        if(params?.params?.show_QR){
            setShowResult(true)
        }
    }, [params]);
 

    const countries = ["Egypt", "Canada", "Australia", "Ireland"]

    const onSuccess = (e) => {
        if(e?.data){
          setResult(e?.data)
          setShowScan(false)
        }
      }

      const setChangeModal = (type, value) => {
        let _modalVisible = {...modalVisible};
        _modalVisible[type] = value;
        setModalVisible(_modalVisible);
    };

    const setChangeShow = (type, value) => {
        let _isShow = {...isShow};
        _isShow[type] = value;
        setShow(_isShow);
    };
    const setChangeDatetime = (type, value) => {
        let _datetime = {...datetime};
        _datetime[type] = value;
        setDatetime(_datetime);
    };


    const onRefresh = () => {
        setRefresh(true)
    };

    const goToPage = (page) => {
        navigation.navigate(page)
    }

    const topComponent = () => {    
        console.log('showResult ',  showResult);
        
        return (
            <>
              <View style={styles.container}>
                {showResult ? 
                <View style={{marginTop: 120}}>
                    {/* <QRCodeScanner
                    reactivate={true}
                    showMarker={true}
                    onRead={(e) => onSuccess(e)}
                    // flashMode={RNCamera.Constants.FlashMode.torch}   
                    /> */}
                     <TouchableOpacity 
                        onPress={()=> setShowResult(false)}
                        style={{marginTop: 70, padding: 10, borderRadius:10, backgroundColor: color.green, alignItems:'center'}}>
                        <Text>Result</Text>
                     </TouchableOpacity>
                </View>
                : 
                <>
                  <ScrollView 
                  showsVerticalScrollIndicator={false}
                    style={{backgroundColor: color.green}}>
                      <View style={styles.box}>
                         <View style={[styles.item, {justifyContent: "space-between", marginBottom: 10}]}>
                            <Text>Thông tin chung:</Text>
                            <TouchableOpacity onPress={() => setChangeModal('viewInfo_general', true)}>
                                <Text>Chi tiết</Text>
                            </TouchableOpacity>
                         </View>
                         <View style={styles.item}>
                            <Text style={{width: layout.width/10 * 3}}>Tên tài sản:</Text>
                            <Text>Máy tính laptop dell</Text>
                         </View>
                         <View style={styles.item}>
                            <Text style={{width: layout.width/10 * 3}}>Mã tài sản:</Text>
                            <Text>VADND</Text>
                         </View>
                         <View style={styles.item}>
                            <Text style={{width: layout.width/10 * 3}}>Phân loại:</Text>
                            <Text>Máy tính</Text>
                         </View>
                         <View style={styles.item}>
                            <Text style={{width: layout.width/10 * 3}}>Số serial:</Text>
                            <Text>V12331313131</Text>
                         </View>
                         <View style={styles.item}>
                            <Text style={{width: layout.width/10 * 3}}>Model:</Text>
                            <Text>V21313131231</Text>
                         </View>
                      </View>
                      <View style={styles.box}>
                         <View style={[styles.item, {justifyContent: "space-between", marginBottom: 10}]}>
                            <Text>Thông tin phân bổ:</Text>
                            <TouchableOpacity onPress={() => goToPage('dispatchInformation')}>
                                <Text>Chi tiết</Text>
                            </TouchableOpacity>
                         </View>
                         <View style={styles.item}>
                            <Text style={{width: layout.width/10 * 3}}>NV:</Text>
                            <Text>BM123 - Nguyễn Văn A</Text>
                         </View>
                         <View style={styles.item}>
                            <Text style={{width: layout.width/10 * 3}}>Phòng ban:</Text>
                            <Text>Phòng nhân sự</Text>
                         </View>
                         <View style={styles.item}>
                            <Text style={{width: layout.width/10 * 3}}>Vị trí làm việc:</Text>
                            <Text>B12</Text>
                         </View>
                         <View style={{alignItems: 'center', marginTop: 15}}>
                            <MButton
                            onPress={() => setChangeModal('recall', true)}
                            text='Thu hồi'
                            style={{width: layout.width/10*4}}
                            />
                         </View>
                         
                      </View>

                      <View style={styles.box}>
                         <View style={[styles.item, {justifyContent: "space-between", marginBottom: 10}]}>
                            <Text>Bảo trì/bảo dưỡng:</Text>
                            <TouchableOpacity onPress={() => goToPage('maintenanceInformation')}>
                                 <Text>Chi tiết</Text>
                            </TouchableOpacity>
                           
                         </View>
                         <View style={[styles.item, {justifyContent:'space-between'}]}>
                            <Text>Từ ngày:</Text>
                            <Text>12/12/2020</Text>
                            <Text>Đến ngày:</Text>
                            <Text>15/12/2020</Text>
                         </View>
                         <View style={styles.item}>
                            <Text style={{width: '20%'}}>Lý do:</Text>
                            <Text style={{width: '80%'}}>Bảo dưỡng định kì hàng tháng và máy tính cần được vệ sinh</Text>
                         </View>
                         <View style={{alignItems: 'center', marginTop: 15}}>
                            <MButton
                            onPress={() => setChangeModal('maintenance',true)}
                            text='Thêm mới'
                            style={{width: layout.width/10*4}}
                            />
                         </View>
                         
                         
                      </View>
                      <View style={styles.box}>
                         <View style={[styles.item, {justifyContent: "space-between", marginBottom: 10}]}>
                            <Text>Thông tin khấu hao:</Text>
                            <TouchableOpacity onPress={() => goToPage('depreciationInfomation')}>
                                 <Text >Chi tiết</Text>
                            </TouchableOpacity>
                           
                         </View>
                         <View style={styles.item}>
                            <Text style={{width: layout.width/10 * 4}}>Giá tính khấu hao:</Text>
                            <Text>120,000,000</Text>
                         </View>
                         <View style={styles.item}>
                            <Text style={{width: layout.width/10 * 4}}>Khấu hao luỹ kế:</Text>
                            <Text>120,000,000</Text>
                         </View>
                      </View>

                      <View style={styles.box}>
                        <Text>Ghi chú</Text>
                        <TextInput style={{borderWidth: 1, marginTop: 10}}>
                        </TextInput>
                        <View style={{alignItems: 'flex-end', marginTop: 15}}>
                            <MButton 
                            text='Lưu'
                            style={{width: layout.width/10*4}}
                            />
                         </View>
                      </View>
                      <View style={styles.box}>
                        <Text>Dòng thời gian</Text>
                        <View style={{borderWidth: 1, borderColor: color.black, padding: 10 }}>
                            <View style={{flexDirection: 'row', borderBottomColor: color.black, borderBottomWidth: 1, paddingBottom: 10}}>
                                <Ionicons name={'person-circle-outline'} color="white" size={30}/>
                                <View>
                                    <Text>Admin</Text>
                                    <Text>Đã thêm ghi chú lúc 11:43 ngày 15/08/2022</Text>
                                </View> 
                            </View>
                            <Text style={{}}>Ghi chú 1</Text>
                        </View>
                      </View>
                  </ScrollView>
                </>}
              </View>
            </>
        );
    };

    const footerComponent = () => {
        return (
            <View style={{}}/>
        );
    };

    return (
        <>
            {isLoading && <CenterSpinner/>}
            <Screen style={[ROOT, {marginTop: 0}]} preset="fixed">
                <View style={{flex: 1}}>
                    <Header headerText='LOGO' onLeftPress={() => setShowResult(false)}/>
                    <View style={{flex: 1}}>
                        <FlatList
                            contentContainerStyle={{flexGrow: 1}}
                            refreshing={isRefresh}
                            onRefresh={() => onRefresh()}
                            // showsVerticalScrollIndicator={false}
                            // showsHorizontalScrollIndicator={false}
                            style={{flex: 1}}
                            renderItem={null}
                            data={[]}
                            ListHeaderComponent={topComponent()}
                            ListFooterComponent={footerComponent()}
                            keyExtractor={(item, index) => 'dashboard-' + index + String(item)}
                        />
                    </View>
                </View>
                <Modal
                    animationType={"slide"}
                    transparent={true}
                    visible={modalVisible?.viewInfo_general}
                    onRequestClose={() => {
                    }}
                >
                    <View style={styles.centeredView}>
                        <>
                            {/* {isLoading && <CenterSpinner/>} */}
                            <View style={styles.modalView}>
                                <FlatList
                                    showsVerticalScrollIndicator={false}
                                    showsHorizontalScrollIndicator={false}
                                    style={{flex: 1}}
                                    renderItem={null}
                                    data={[]}
                                    ListHeaderComponent={() => {
                                        return (
                                            <View>
                                                <BtnBack title='Thông tin chung' goBack={() => setChangeModal('viewInfo_general', false)} />
                                                <View style={{paddingLeft: 10}}>
                                                    <Text style={{fontSize: 17, marginBottom: 7}}>Tên tài sản*</Text>
                                                    <Text style={styles.input_item}>Máy tính laptop dell</Text>
                                                    <Text style={{fontSize: 17, marginBottom: 7}}>Mã tài sản*</Text>
                                                    <Text style={styles.input_item}>VADND</Text>
                                                    <View style={{flexDirection: 'row'}}>
                                                        <View style={{width: '50%'}}>
                                                            <Text style={{fontSize: 17, marginBottom: 7}}>Phân loại</Text>
                                                            <Text style={styles.input_item}>Máy tính</Text>
                                                        </View>
                                                        <View style={{width: '50%'}}>
                                                            <Text style={{fontSize: 17, marginBottom: 7}}>Ngày vào sổ</Text>
                                                            <Text style={styles.input_item}>20/12/2022</Text>
                                                        </View>
                                                    </View>
                                                    <Text style={{fontSize: 17, marginBottom: 7}}>Số serial*</Text>
                                                    <Text style={styles.input_item}>123123</Text>
                                                    <Text style={{fontSize: 17, marginBottom: 7}}>Model*</Text>
                                                    <Text style={styles.input_item}>123123</Text>
                                                    <Text style={{fontSize: 17, marginBottom: 7}}>Số hiệu*</Text>
                                                    <Text style={styles.input_item}>123123</Text>
                                                    <View style={{flexDirection: 'row'}}>
                                                        <View style={{width: '50%'}}>
                                                            <Text style={{fontSize: 17, marginBottom: 7}}>Nước sản xuất</Text>
                                                            <Text style={styles.input_item}>Việt Nam</Text>
                                                        </View>
                                                        <View style={{width: '50%'}}>
                                                            <Text style={{fontSize: 17, marginBottom: 7}}>Hãng sản xuất</Text>
                                                            <Text style={styles.input_item}>VND</Text>
                                                        </View>
                                                    </View>
                                                    <View style={{flexDirection: 'row'}}>
                                                        <View style={{width: '50%'}}>
                                                            <Text style={{fontSize: 17, marginBottom: 7}}>Năm sản xuất</Text>
                                                            <Text style={styles.input_item}>2021</Text>
                                                        </View>
                                                        <View style={{width: '50%'}}>
                                                            <Text style={{fontSize: 17, marginBottom: 7}}>Ngày sản xuất</Text>
                                                            <Text style={styles.input_item}>15/08/2020</Text>
                                                        </View>
                                                    </View>
                                                    <View style={{flexDirection: 'row'}}>
                                                        <View style={{width: '50%'}}>
                                                            <Text style={{fontSize: 17, marginBottom: 7}}>Hạn bảo dưỡng(tháng)</Text>
                                                            <Text style={styles.input_item}>15/8/2023</Text>
                                                        </View>
                                                        <View style={{width: '50%'}}>
                                                            <Text style={{fontSize: 17, marginBottom: 7}}>Hạn bảo hành(tháng)</Text>
                                                            <Text style={styles.input_item}>12</Text>
                                                        </View>
                                                    </View>
                                                    <Text style={{fontSize: 17, marginBottom: 7}}>Mô tả tài sản</Text>
                                                    <View style={styles.input_item}></View>
                                                    <Text style={{fontSize: 17, marginBottom: 7}}>Thông tin nơi mua</Text>
                                                    <View style={styles.input_item}></View>
                                                    <Text style={{fontSize: 17, marginBottom: 7}}>Thông tin nơi bảo hành/bảo dưỡng</Text>
                                                    <View style={styles.input_item}></View>
                                                </View>
                                            </View>
                                        )
                                    }}
                                    keyExtractor={(item, index) => 'view-info-general-' + index + String(item)}
                                />
                            </View>
                        </>
                    </View>
                </Modal>

                <Modal
                    animationType={"slide"}
                    transparent={true}
                    visible={modalVisible?.recall}
                    onRequestClose={() => {
                    }}
                >
                    <View style={styles.centeredView}>
                        <>
                            {/* {isLoading && <CenterSpinner/>} */}
                            <View style={styles.modalView}>
                                <FlatList
                                    showsVerticalScrollIndicator={false}
                                    showsHorizontalScrollIndicator={false}
                                    style={{flex: 1}}
                                    renderItem={null}
                                    data={[]}
                                    ListHeaderComponent={() => {
                                        return (
                                            <View>      
                                                <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginHorizontal: 16, marginTop: 16, marginBottom: 16,}}>
                                                    <TouchableOpacity style={styles.backWrapper} onPress={() => setChangeModal('recall', false)}>
                                                        <Ionicons name='arrow-back-outline' color={color.white} size={30}/>
                                                    </TouchableOpacity>
                                                    <Text style={{fontSize: 17, textTransform: 'capitalize'}} fonts={'DemiBold'}>Thu hồi tài sản</Text>
                                                    <MButton text='Lưu' style={[styles.btnWrapper, {width: '20%'}]}/>
                                                </View>
                                                <View>
                                                    <Text>Tên tài sản:  Máy tính laptop dell</Text>
                                                    <Text>Mã tài sản:  VADND</Text>
                                                    <Text>Ngày thu hồi*:</Text>
                                                    <TouchableOpacity style={styles.inputDate} onPress={() => setChangeModal('date_recall', true)}>                                          
                                                        <Text>{formatDate(date_recall)}</Text>
                                                        <Ionicons name={'calendar-outline'} color="white" size={24}/>
                                                    </TouchableOpacity>
                                                    <DatePicker
                                                        mode="date"
                                                        modal
                                                        open={modalVisible?.date_recall}
                                                        date={date_recall}
                                                        onConfirm={(date) => {
                                                            setChangeModal('date_recall', false);
                                                            setDate_recall(date);               
                                                        }}
                                                        onCancel={() => {
                                                            setChangeModal('date_recall', false);
                                                        }}
                                                    />
                                                </View>
                                                <Text>Lý do thu hồi</Text>
                                                <TextInput style={{borderWidth: 1, marginTop: 10}} />
                                            </View>
                                        )
                                    }}
                                    keyExtractor={(item, index) => 'view-info-general-' + index + String(item)}
                                />
                            </View>
                        </>
                    </View>
                </Modal>

                <Modal
                    animationType={"slide"}
                    transparent={true}
                    visible={modalVisible?.maintenance}
                    onRequestClose={() => {
                    }}
                >
                    <View style={styles.centeredView}>
                        <>
                            {/* {isLoading && <CenterSpinner/>} */}
                            <View style={styles.modalView}>
                                <FlatList
                                    showsVerticalScrollIndicator={false}
                                    showsHorizontalScrollIndicator={false}
                                    style={{flex: 1}}
                                    renderItem={null}
                                    data={[]}
                                    ListHeaderComponent={() => {
                                        return (
                                            <View>      
                                                <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginHorizontal: 16, marginTop: 16, marginBottom: 16,}}>
                                                    <TouchableOpacity style={styles.backWrapper} onPress={() => setChangeModal('maintenance', false)}>
                                                        <Ionicons name='arrow-back-outline' color={color.white} size={30}/>
                                                    </TouchableOpacity>
                                                    <Text style={{fontSize: 17, textTransform: 'capitalize'}} fonts={'DemiBold'}>Bảo trì/Bảo dưỡng</Text>
                                                    <MButton text='Lưu' style={[styles.btnWrapper, {width: '20%'}]}/>
                                                </View>
                                                <View>
                                                    <Text>Tên tài sản:  Máy tính laptop dell</Text>
                                                    <Text>Mã tài sản:  VADND</Text>
                                                    <View style={{flexDirection: 'row'}}>
                                                        <View style={{width: '50%'}}>
                                                            <Text>Từ ngày</Text>
                                                            <View>
                                                                <TouchableOpacity style={styles.inputDate} onPress={() => setChangeShow('fromDate', true)}>
                                                                   <Text>{formatDate(datetime?.fromDate)}</Text>
                                                                   <Ionicons name={'calendar-outline'} color="white" size={24}/>
                                                                </TouchableOpacity>
                                                                <DatePicker
                                                                    mode="date"
                                                                    modal
                                                                    open={isShow?.fromDate}
                                                                    date={datetime?.fromDate}
                                                                    onConfirm={(date) => {
                                                                        setChangeShow('fromDate', false);
                                                                        setChangeDatetime('fromDate', date);               
                                                                    }}
                                                                    onCancel={() => {
                                                                        setChangeShow('fromDate', false);
                                                                    }}
                                                                />
                                                            </View>
                                                        </View>
                                                        <View style={{width: '50%'}}>
                                                            <Text>Đến ngày</Text>
                                                            <View>
                                                                <TouchableOpacity style={styles.inputDate} onPress={() => setChangeShow('toDate', true)}>
                                                                   <Text>{formatDate(datetime?.toDate)}</Text>
                                                                   <Ionicons name={'calendar-outline'} color="white" size={24}/>
                                                                </TouchableOpacity>
                                                                <DatePicker
                                                                    mode="date"
                                                                    modal
                                                                    open={isShow?.toDate}
                                                                    date={datetime?.toDate}
                                                                    onConfirm={(date) => {
                                                                        setChangeShow('toDate', false);
                                                                        setChangeDatetime('toDate', date);               
                                                                    }}
                                                                    onCancel={() => {
                                                                        setChangeShow('toDate', false);
                                                                    }}
                                                                />
                                                            </View>
                                                        </View>
                                                    </View>
                                                </View>
                                                <Text>Người phụ trách*:</Text>
                                                <SelectDropdown 
                                                         data={countries}
                                                         onSelect={(selectedItem, index) => {
                                                             console.log(selectedItem, index)
                                                         }}
                                                         renderDropdownIcon={() => {
                                                            return (
                                                                <Ionicons name='chevron-down-outline' size={20} color={color.white}/>
                                                            )
                                                         }}
                                                         defaultButtonText={'  '} 
                                                         buttonStyle={{width: '100%', backgroundColor: color.black, marginVertical: 10}}
                                                         buttonTextStyle={{color: color.white}}
                                                         search={true}
                                                         renderCustomizedButtonChild={(selectedItem, index) => {
                                                            return (
                                                                <Text>{selectedItem}</Text>
                                                            )
                                                         }}
                                                     />
                                                <Text>Lý do bảo trì/bảo dưỡng</Text>
                                                <TextInput style={{borderWidth: 1, marginTop: 10}} />
                                            </View>
                                        )
                                    }}
                                    keyExtractor={(item, index) => 'view-info-general-' + index + String(item)}
                                />
                            </View>
                        </>
                    </View>
                </Modal>
            </Screen>
        </>
    );
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
      },
      btn: {
        padding: 10,
        backgroundColor: '#00FF00',
        borderRadius: 5
      },
    btnBlue: {
        backgroundColor: color.blue,
        maxWidth: layout.width / 2,
    },
    btnOrange: {
        backgroundColor: color.orange,
        maxWidth: layout.width / 2,
    },
    textWhite: {
        color: color.white
    },
    backWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        position: 'absolute',
        left: 0,
    },
    btnWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        position: 'absolute',
        left: 0,
        borderRadius: 10,
        marginLeft: layout.width - 120
    },
    appsWrapper: {
        backgroundColor: color.tabbar,
        marginTop: 16,
        marginHorizontal: 16,
        paddingHorizontal: 16,
        borderRadius: 12,
        paddingTop: 16,
        paddingBottom: 4
    },
    activityDetailWrapper: {
        borderColor: color.danger,
        borderWidth: 1,
        paddingHorizontal: 12,
        paddingVertical: 16,
        marginBottom: 16,
        borderRadius: 12
    },
    donationsWrapper: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 4,
        marginHorizontal: -8
    },
    donationsItem: {
        width: '30%',
        marginHorizontal: '1.5%',
        borderWidth: 1,
        borderColor: color.danger,
        paddingHorizontal: 12,
        paddingVertical: 16,
        borderRadius: 12,
    },
    donationsText: {
        textAlign: 'center'
    },
    donationsValue: {
        textAlign: 'center',
        fontSize: 16,
        marginBottom: 8,
        color: color.danger
    },
    box: {
      marginHorizontal: 10,
      marginVertical: 10,
      borderColor: color.black,
      borderWidth: 1,
      borderRadius: 15,
      padding: 10,

    },
    item: {
        flexDirection: 'row',
    },
    centeredView: {
        flex: 1,
    },
    modalView: {
        flex: 1,
        backgroundColor: color.primary,
        paddingHorizontal: 16,
    },
    input_item: {
        backgroundColor: color.black,
        paddingLeft: 10,
        paddingVertical: 7,
        marginBottom: 10
    },
    inputDate: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginRight: 8,
        // borderWidth: 1,
        borderColor: color.white,
        // paddingHorizontal: 12,
        backgroundColor: color.tabbar,
        paddingLeft: 16,
        paddingRight: 8,
        paddingVertical: 8,
        borderRadius: 4
    },
});
