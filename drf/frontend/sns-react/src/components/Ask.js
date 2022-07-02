import { useState, useContext } from 'react';
import { ApiContext } from '../context/ApiContext';
import Button from '@material-ui/core/Button';
import Modal from 'react-modal';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import { RiMailAddLine } from 'react-icons/ri';
import { IoIosSend } from 'react-icons/io';
import { IoMdClose } from 'react-icons/io';
import CardMedia from '@material-ui/core/CardMedia';


const useStyles = makeStyles((theme) => ({
    button: {
        margin: theme.spacing(1),
    },
    text: {
        margin: theme.spacing(3),
    },
})
);

// prof 友達申請を送ってきたユーザープロフィール
// ask 自分宛に送られてきた友達申請
const Ask = ({ ask, prof }) => {
    const classes = useStyles();
    Modal.setAppElement('#root');
    const { changeApprovalRequest, sendDmCont } = useContext(ApiContext);
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
    const handleInputChange = () => (event) => {
        const value = event.target.value;
        setText(value);
    };

    // メッセージ送信
    const sendDM = () => {
        const uploadDM = new FormData();
        uploadDM.append('receiver', ask.askFrom);
        uploadDM.append('message', text);
        sendDmCont(uploadDM);
        setModalIsOpen(false);
    }


    const changeApproval = () => {
        const uploadDataAsk = new FormData();
        uploadDataAsk.append('askTo', ask.askTo);
        uploadDataAsk.append('approved', true);
        changeApprovalRequest(uploadDataAsk, ask);
    }

    return (
        <li className='list-item'>
            {prof[0].img ? (
                <CardMedia style={{ minWidth: 30 }} image={prof[0].img} />
            ):(
                <CardMedia style={{ minWidth: 30 }} image='http://127.0.0.1:8000/media/image/null.png' />
            )}
            <h4>{prof[0].nickName}</h4>
            {/* 友達承認していない場合承認ボタンを表示
                承認している場合メッセージボタンを表示
            */}
            {!ask.approved ? (
                <Button size='small' className={classes.button} variant='contained' color='primary' onClick={() => changeApproval()}>Approve</Button>
            ) : (
                <button className='mail' onClick={()=>setModalIsOpen(true)}><RiMailAddLine /></button>
            )}
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
