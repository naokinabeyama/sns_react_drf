import {createContext, useState, useEffect} from 'react'
import { withCookies } from 'react-cookie'
import axios from 'axios'


export const ApiContext = createContext();


const ApiContextProvider = (props) => {
    // current-token ログイン認証が成功したトークンが格納されている
    const token = props.cookies.get('current-token');
    // ログインユーザーのプロフィール
    const [profile, setProfile] = useState([]);
    // 全ユーザーのプロフィール
    const [profiles, setProfiles] = useState([]);
    // プロフィール更新
    const [editedProfile, setEditedProfile] = useState({ id: '', nickName: '' });
    // 友達申請リスト(自分宛)
    const [askList, setAskList] = useState([]);
    // 友達申請リスト(自分宛) + 自分が友達申請したリスト
    const [askListFull, setAskListFull] = useState([]);
    // 受信ボックス
    const [inbox, setInbox] = useState([]);
    // プロフィール画像
    const [cover, setCover] = useState([]);

    // 初期画面
    useEffect(() => {
        // ログインユーザーのプロフィール
        const getMyProfile = async () => {
            try {
                const resmy = await axios.get('http://localhost:8000/api/user/myprofile/', {
                    headers: {
                        'Authorization': `Token ${token}`
                    }
                });
                // 友達申請リスト
                const res = await axios.get('http://localhost:8000/api/user/approval/', {
                    headers: {
                        'Authorization': `Token ${token}`
                    }
                });
                // プロフィール
                resmy.data[0] && setProfile(resmy.data[0]);
                // プロフィール更新
                resmy.data[0] && setEditedProfile({ id: resmy.data[0].id, nickName: resmy.data[0].nickName });
                // 自分宛の友達リスト
                resmy.data[0] && setAskList(res.data.filter((ask) => { return resmy.data[0].userPro === ask.askTo }));
                // 友達申請リスト(自分宛) + 自分が友達申請したリスト
                setAskListFull(res.data);
            } catch {
                console.log('error');
            };
        };

        // 全ユーザープロフィール
        const getProfile = async () => {
            try {
                const res = await axios.get('http://localhost:8000/api/user/profile/', {
                    headers: {
                        'Authorization': `Token ${token}`
                    }
                });
                // 全ユーザーのプロフィール
                setProfiles(res.data);
            } catch {
                console.log('error');
            };
        };

        // 受信ボックス
        const getInbox = async () => {
            try {
                const res = await axios.get('http://localhost:8000/api/dm/inbox/', {
                    headers: {
                        'Authorization': `Token ${token}`
                    }
                });
                // 受信ボックス
                setInbox(res.data);
            } catch {
                console.log('error');
            };
        };
        getMyProfile();
        getProfile();
        getInbox();
    }, [token, profile.id]);

    // 新規プロフィール作成
    const createProfile = async () => {
        const createData = new FormData();
        // 現在格納されているニックネーム
        createData.append('nickName', editedProfile.nickName);
        // 現在格納されている画像
        cover.name && createData.append('img', cover, cover.name);
        try {
            const res = await axios.post('http://localhost:8000/api/user/profile/', createData, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${token}`
                }
            })
            // ログインユーザーのプロフィール
            setProfile(res.data);
            // プロフィール更新
            setEditedProfile({ id: res.data.id, nickName: res.data.nickName });
        } catch {
            console.log('error');
        };
    };

    // プロフィール削除
    const deleteProfile = async () => {
        try {
            await axios.delete(`http://localhost:8000/api/user/profile/${profile.id}/`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${token}`
                }
            });
            // 自分以外のユーザーを再設定
            setProfile(profiles.filter(dev => dev.id !== profile.id));
            // 初期化
            // 自分のプロフィール
            setProfile([]);
            // 更新
            setEditedProfile({ id: '', nickName: '' });
            // アバター画像
            setCover([]);
            // 友達リスト
            setAskList([]);
        } catch {
            console.log('error');
        };
    };

    // プロフィール更新
    const editProfile = async () => {
        const editData = new FormData();
        // 現在格納されているニックネーム
        editData.append('nickName', editedProfile.nickName);
        // 現在格納されている画像
        cover.name && editData.append('img', cover, cover.name);
        try {
            const res = await axios.put(`http://localhost:8000/api/user/profile/${profile.id}/`, editData, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${token}`
                }
            })
            // 自分のプロフィール
            setProfile(res.data)
        } catch {
            console.log('error')
        };
    };

    // 友達申請
    const newRequestFriend = async (askData) => {
        try {
            const res = await axios.post('http://localhost:8000/api/user/approval', askData, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${token}`
                }
            })
            setAskListFull([...askListFull, res.data]);
        } catch {
            console.log('error');
        };
    };


    // メッセージ
    const sendDmCont = async (uploadDM) => {
        try {
            await axios.post('http://localhost:8000/api/dm/message', uploadDM, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${token}`
                }
            });
        } catch {
            console.log('error');
        }
    };


    // 友達申請の承認
    // 引数 ask 申請したデータ
    // uploadDataAsk 申請されたデータのapprovalをtrueに変えたデータ
    const changeApprovalRequest = async (uploadDataAsk, ask) => {
        try {
            const res = await axios.post(`http://localhost:8000/api/user/approval/${ask.id}`, uploadDataAsk, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${token}`
                }
            });
            // 友達申請リスト
            setAskList(askList.map(item => (item.id === ask.id ? res.data : item)));
            
            // 申請をtrueにした後fromとtoを逆にする
            const newDataAsk = new FormData();
            newDataAsk.append('askTo', ask.askFrom);
            newDataAsk.append('approved', true);

            // 同時申請の場合
            const newDataAskPut = new FormData();
            newDataAskPut.append('askTo', ask.askFrom);
            newDataAskPut.append('askFrom', ask.askTo);
            newDataAskPut.append('approved', true);

            // 同時に申請をしてしまった場合の処理
            const resp = askListFull.filter(item => { return (item.askFrom === profile.userPro && item.askTo === ask.askFrom) });
            // 申請
            !resp[0] ?
                await axios.post('http://localhost:8000/api/user/approval/', newDataAsk, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Token ${token}`
                    }
                })
                :
                //同時申請
                await axios.post(`http://localhost:8000/api/user/approval/${resp[0].id}`, newDataAskPut, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Token ${token}`
                    }
                })

        } catch {
            console.log('error');
        };
    };


    return (
        // valueの中に追記することで他のコンポーネントで共有できる
        <ApiContext.Provider value={{
            profile,
            profiles,
            cover,
            setCover,
            askList,
            askListFull,
            inbox,
            newRequestFriend,
            createProfile,
            editProfile,
            deleteProfile,
            changeApprovalRequest,
            sendDmCont,
            editedProfile,
            setEditedProfile,
        }}>
            {props.children}
        </ApiContext.Provider>
    );
};

export default withCookies(ApiContextProvider);
