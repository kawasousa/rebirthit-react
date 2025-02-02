import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/pt-br'

dayjs.extend(relativeTime);
dayjs.locale('pt-br')

function Timestamp( {createdAt, extraClasses} ){
    return <span className={extraClasses}>{ dayjs(createdAt).fromNow() }</span>
}

export default Timestamp;   