import { notiTypeEnum } from "../NotiTypeEnum"

const Notify = ({notification, type}) => {
    if ( !notification ) {
      return null
    }
    else if (type === notiTypeEnum.ERROR) {
      return (
        <div style={{color: 'red'}}>
          {notification}
        </div>
      )
    }
    else if (type === notiTypeEnum.SUCCESS) {
      return (
        <div style={{color: 'green'}}>
          {notification}
        </div>
      )
    }
    else if (type === notiTypeEnum.INFO) {
      return (
        <div style={{color: 'blue'}}>
          {notification}
        </div>
      )
    }
}

export default Notify