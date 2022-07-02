import { useLocation } from 'react-router-dom';


const OneToOneDM = () => {
    const location = useLocation();

    return (
        <>
            <p>{location.state.prof[0].nickName}から{location.state.myprof.nickName}へ</p>
            <p>ID:{location.state.myprof.userPro}</p>
            
            {location.state.dms.map((dm) => (
                <p>
                    {dm.sender === location.state.prof[0].userPro ? (
                        dm.message
                    ) : (
                            <p></p>
                    )
                }
                </p>
            ))}
        </>
    )
}

export default OneToOneDM
