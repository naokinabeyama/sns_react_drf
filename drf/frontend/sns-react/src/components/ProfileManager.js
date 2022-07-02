import {useContext} from 'react'
import { ApiContext } from '../context/ApiContext';
import { makeStyles } from '@material-ui/core/styles';
import LocationOn from '@material-ui/icons/LocationOn';
import { BsFillPersonCheckFill } from 'react-icons/bs';
import { MdAddAPhoto } from 'react-icons/md';
import { BsTrash } from 'react-icons/bs';
import { BsPersonPlus } from 'react-icons/bs';
import { FaUserEdit } from 'react-icons/fa';
import { IconButton } from '@material-ui/core';


const useStyles = makeStyles((theme) => ({
    profile: {
        '& .image-wrapper': {
            textAlign: 'center',
            position: 'relative',
            '& button': {
                position: 'absolute',
                top: '80%',
                left: '70%',
            },
            margin: 6,
        },
        '& .profile-image': {
            width: 150,
            height: 150,
            objectFit: 'cover',
            maxWidth: '100%',
            borderRadius: '50%',
            backgroundColor: 'white',
        },
        '& .profile-details': {
            textAlign: 'center',
            '& span, svg': {
                verticalAlign: 'middle',
                color: 'lightgrey',
                fontFamily: '"Comic Neue", cursive',
            },
        },
        '& hr': {
            border: 'none',
            margin: '0 0 7px 0'
        },
    },
}));


const ProfileManager = () => {
    const classes = useStyles();
    const { profile, editedProfile, setEditedProfile, deleteProfile, cover, setCover, createProfile, editProfile } = useContext(ApiContext);
    
    // 画像ファイルを表示
    const handleEditPicture = () => {
        const fileInput = document.getElementById('imageInput');
        fileInput.click();
    };

    // editedProfileの中にあるニックネームを変更する
    const handleInputChange = () => event => {
        const value = event.target.value;
        const name = event.target.name;
        setEditedProfile({ ...editedProfile, [name]: value });
    };
    
    return (
        <div className={classes.profile}>
            <div className='image-wrapper'>
                {/* アバター画像の有無 */}
                {profile.id ?
                    <img src={profile.img} alt='profile' className='profile-image' />
                :
                    <img src='http://127.0.0.1:8000/media/image/null.png' alt='profile' className='profile-image' />
                }
                {/* hidden='hidden' inputを表示させず代わりにiconを表示 */}
                <input type='file' id='imageInput' hidden='hidden' onChange={(event) => { setCover(event.target.files[0]); event.target.value = '' }} />
                <IconButton onClick={handleEditPicture}>
                    <MdAddAPhoto className='photo' />
                </IconButton>
            </div>
            
            {/* idがある場合(新規登録されている) 
                更新ボタン
            */}
            {editedProfile.id ?
                // ニックネームがある場合ボタンを有効化
                (editedProfile.nickName ?
                    <button className='user' onClick={()=>editProfile()} ><FaUserEdit /></button>
                :
                    <button className='user-invalid' disabled ><FaUserEdit /></button>
                )
            :
            // idがない場合(新規登録) 
                //ニックネームとアバター画像が入力された場合ボタンを有効化
                (editedProfile.nickName && cover.name ?
                    <button className='user' onClick={()=>createProfile()} ><BsPersonPlus /></button>
                :
                    <button className='user-invalid' disabled ><BsPersonPlus /></button>
                )
            }

            {/* 削除ボタン */}
            <button className='trash' onClick={() => deleteProfile()}><BsTrash /></button>
            
            <div className='profile-details'>
                {/* ニックネーム */}
                <BsFillPersonCheckFill className='badge' />
                {profile && <span>{profile.nickName}</span>}

                <hr />
                
                <input type='text' value={editedProfile.nickName} name='nickName' onChange={handleInputChange()} />

                <hr />
                {/* 作成日時 */}
                <span>Joined at {profile.created_on}</span>

                <hr />

                <LocationOn /><span>JAPAN</span>
            </div>

        </div>
    );
};

export default ProfileManager
