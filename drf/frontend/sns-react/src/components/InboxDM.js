import { RiUserReceivedLine } from "react-icons/ri";
import CardMedia from '@material-ui/core/CardMedia';
import { Link, useHistory } from 'react-router-dom';


const InboxDM = ({ dms, dm, prof, myprof }) => {
    const history = useHistory();

    const oneToOneClick = () => {
        history.push({
            pathname: '/onetoonedm',
            state: {
                dms: dms,
                prof: prof,
                myprof: myprof,
            }
        })
    }

    return (
        <Link onClick={oneToOneClick}>
            <li className="list-item">
                {prof[0].img ? (
                    <CardMedia style={{ minWidth: 30 }} image={prof[0].img} />
                ):(
                    <CardMedia style={{ minWidth: 30 }} image='http://127.0.0.1:8000/media/image/null.png' />
                )}
                {prof[0] && <h4>{dm.message}</h4>}
                {prof[0] && (
                    <h4>
                    <RiUserReceivedLine className='badge' />
                        {prof[0].nickName}
                    </h4>
                    )}
            </li>
        </Link>
    )
}

export default InboxDM
