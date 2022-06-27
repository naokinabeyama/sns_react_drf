import { useState, useContext } from 'react';
import { ApiContext } from '../context/ApiContext';
import Button from '@material-ui/core/Button';
import Modal from 'react-modal';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import makeStyles from '@material-ui/core/styles';
import { RiMailAddLine } from 'react-icons/ri';
import { IoIosSend } from 'react-icons/io';
import { IoMdClose } from 'react-icons/io';


const useStyles = makeStyles((theme) => ({
    button: {
        margin: theme.spacing(1),
    },
    text: {
        margin: theme.spacing(3),
    },
})
);

// prof 友達申請を送ってきたユーザー
const Ask = ({ask, prof}) => {
    const classes = useStyles();
    Modal.setAppElement('#root');
    const { changeApprovalRequest, sendDMCont } = useContext(ApiContext);
    // Modal(ポップアップ)が開いているか閉じているか
    const [modalIsOpen, setModalIsOpen] = useState(false);
    // ダイレクトメッセージのテキスト
    const [text, setText] = useState('');

    const customStyles = {
        context: {
            top: '50%',
            left: '42%',
            light: 'auto',
            bottom: 'auto',
        }
    };

    // メッセージ内容
    const handleInputChange = () => event => {
        const value = event.target.value;
        setText(value);
    };

    // メッセージ送信
    const sendDM = () => {
        const uploadDM = new FormData();
        uploadDM.append('receiver', ask.askFrom);
        uploadDM.append('message', text);
        sendDMCont(uploadDM);
        setModalIsOpen(false);
    }


    const changeApproval = () => {
        const uploadDataAsk = new FormData();
        uploadDataAsk.append('askTo', ask.aksTo);
        uploadDataAsk.append('approved', true);
        changeApprovalRequest(uploadDataAsk, ask);
    }


    return (
        <li className='list-item'>
            <h4>{prof[0].nickName}</h4>
            {/* 友達承認していない場合承認ボタンを表示
                承認している場合メッセージボタンを表示
            */}
            {!ask.approved ?
                <Button size='samll' className={classes.button} variant='contained' color='primary' onClick={() => changeApproval()}>Approve</Button>
            :
                <button className='mail' onClick={()=>setModalIsOpen(true)}><RiMailAddLine /></button>
            }
            {/* ポップアップ画面外をクリックしたらfalseになり閉じる */}
            <Modal isOpen={modalIsOpen} onRequestClose={() => setModalIsOpen(false)} style={customStyles}>
                <Typography>Message</Typography>
                {/* メッセージ入力ボックス */}
                <TextField className={classes.text} type='text' onChange={handleInputChange()} />
                <br />
                {/* メッセージを送る */}
                <button className='btn-modal' onClick={() => sendDM()}><IoIosSend /></button>
                {/* ポップアップを閉じる */}
                <button className='btn-modal' onClick={()=> setModalIsOpen(false) }><IoMdClose /></button>
            </Modal>
        </li>
    )
}

export default Ask