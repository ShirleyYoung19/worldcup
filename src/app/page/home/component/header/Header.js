import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { Menu, Dropdown, Button, Input, Select } from 'antd';

import * as HomeModule from 'modules/home';
import * as AuthModule from 'modules/auth';
import style from './style.css';

const hasInput = value => (value !== undefined && value !== null);
const { Option } = Select;

class Header extends React.Component {
  static propTypes = {
    user: PropTypes.object.isRequired,
    tz: PropTypes.arrayOf(PropTypes.object).isRequired,
    postUser: PropTypes.func.isRequired,
    init: PropTypes.func.isRequired,
    logout: PropTypes.func.isRequired,
  }

  static defaultProps = {

  }

  state = {
    visible: false,
    nickNameEdit: false,
    timezoneEdit: false,
  }
  componentDidMount () {

  }

  getValue = (field) => {
    const stateValue = this.state[field];
    const propsValue = this.props.user[field];

    return hasInput(field) ? stateValue : propsValue;
  }

  handleVisibleChange = (flag) => {
    this.setState({
      visible: flag,
      nickNameEdit: false,
    });
  }

  handleNickNameEditClick = () => {
    this.setState({
      nickNameEdit: !this.state.nickNameEdit,
    });
  }

  handleTimezoneEditClick = () => {
    this.setState({
      timezoneEdit: !this.state.timezoneEdit,
    });
  }

  handleUserSubmit = field => async () => {
    await this.props.postUser(field, this.state[field]);

    if (field === 'timezone') this.props.init();
    this.setState({
      nickNameEdit: false,
      timezoneEdit: false,
    });
  }

  handleNickNameChange = (e) => {
    const { value } = e.target;
    if (!value) return;
    this.setState({
      nickName: value,
    });
  }
 handleTimezoneChange = (value) => {
   this.setState({
     timezone: value,
   }, () => {
     this.handleUserSubmit('timezone')();
   });
 }

 handleLogoutClick = () => {
   this.props.logout();
 }


 render () {
   const { user = {}, tz = [] } = this.props;
   const { nickNameEdit, timezoneEdit } = this.state;

   const nickName = this.getValue('nickName');
   //  const timezone = this.getValue('timezone');

   const nickNameInputRender = (
     <Input
       placehoder="NickName"
       onChange={this.handleNickNameChange}
       value={nickName}
     />
   );

   const nickNameDisplayRender = user.nickName ? user.nickName : 'NickName';

   const timezoneSelectRender = (
     <Select
       className={style.timezone}
       showSearch
       placeholder="Select timezone"
       optionFilterProp="children"
       onChange={this.handleTimezoneChange}
       value={user.timezone}
     >
       { tz.map(({ value, offset, _id } = {}) => (
         <Option value={value} key={_id}>
           {`${value} (UTC${offset})`}
         </Option>
       ))}
     </Select>
   );

   const timezoneDisplayRender = user.timezone ? user.timezone : 'Timezone';


   const menu = (
     <Menu className={style.menu}>
       <Menu.Item key="0" className={style.item}>
         {nickNameEdit ? nickNameInputRender : nickNameDisplayRender}
         {
           !nickNameEdit
             ?
             (<Button className={style.edit} onClick={this.handleNickNameEditClick}>Edit</Button>)
             :
             (<Button className={style.edit} onClick={this.handleUserSubmit('nickName')}>Submit</Button>)
         }
       </Menu.Item>

       <Menu.Item key="1" className={style.item}>
         {timezoneEdit ? timezoneSelectRender : timezoneDisplayRender}
         {
           !timezoneEdit
             &&
             (<Button className={style.edit} onClick={this.handleTimezoneEditClick}>Edit</Button>)
         }
       </Menu.Item>
       <Menu.Item key="1" className={style.item}>
         <Button className={style.logout} onClick={this.handleLogoutClick}>Logout</Button>
       </Menu.Item>
     </Menu>
   );
   return (
     <div className={style.header}>
       <div className={style.left}>
          Seedlink World Cup 2018
       </div>

       <div className={style.right}>
         <Dropdown.Button
           className={style.info}
           overlay={menu}
           trigger={['click']}
           onVisibleChange={this.handleVisibleChange}
           visible={this.state.visible}
         >
           <span>{user.email}</span>
         </Dropdown.Button>
       </div>
     </div>
   );
 }
}

const mapState = state => ({
  user: HomeModule.getUser(state),
  tz: HomeModule.getTz(state),
});

const mapDispath = ({
  postUser: HomeModule.postUser,
  init: HomeModule.init,
  logout: AuthModule.logout,
});

export default connect(mapState, mapDispath)(Header);
