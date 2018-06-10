import React from 'react';
import PropTypes from 'prop-types';
import { Input, Form, Button, Icon } from 'antd';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import * as AuthModule from 'modules/auth';
import style from './style.css';

const FormItem = Form.Item;

class Login extends React.Component {
  static propTypes = {
    form: PropTypes.object.isRequired,
    login: PropTypes.func.isRequired,
    setLoggedInWithoutReset: PropTypes.func.isRequired,
    verify: PropTypes.func.isRequired,
    loginWithoutReset: PropTypes.bool.isRequired,
    isLoggedIn: PropTypes.bool.isRequired,
  }

  state = {
    error: {},
  }
  componentDidMount () {
    this.props.verify();
  }

  login = async (values) => {
    try {
      await this.props.login(values);
    } catch (error) {
      if (error.status === 403) {
        this.setState({
          error: {
            ...this.state.error,
            password: 'password is wrong',
          },
        }, () => {
          this.props.form.validateFields(['password'], { force: true });
        });
      } else if (error.status === 401) {
        this.props.setLoggedInWithoutReset(values);
      }
    }
  }

  checkPasswordResult = (rule, value, callback) => {
    const { error: { password } = {} } = this.state;
    if (password) {
      callback(password);
    } else {
      callback();
    }
  }

handlePasswordChange =() => {
  const { error: { password } } = this.state;

  if (password) {
    this.setState({
      error: {
        ...this.state.error,
        password: undefined,
      },
    }, () => {
      this.props.form.validateFields(['password'], { force: true });
    });
  }
}

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.login(values);
      }
    });
  }

  render () {
    const { getFieldDecorator } = this.props.form;
    const { loginWithoutReset, isLoggedIn } = this.props;

    if (loginWithoutReset) return <Redirect to="/reset/" />;
    if (isLoggedIn) return <Redirect to="/home/" />;

    return (
      <div className={style.page} >
        <div className={style.login}>
          <div className={style.logo} />
          <Form className={style.form} onSubmit={this.handleSubmit}>
            <FormItem>
              {getFieldDecorator('email', {
                rules: [{
                  type: 'email', message: 'The input is not valid E-mail!',
                }, {
                  required: true, message: 'Please input your email!',
                }],
              })(
                <Input type="email" prefix={<Icon type="mail" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Email" />,
              )}
            </FormItem>

            <FormItem>
              {getFieldDecorator('password', {
                rules: [
                  { required: true, message: 'Please input your Password!' },
                  { validator: this.checkPasswordResult },
                ],
              })(
                <Input
                  prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  type="password"
                  placeholder="Password"
                  onChange={this.handlePasswordChange}
                />,
              )}
            </FormItem>
            <div className={style.submit}>
              <Button type="primary" htmlType="submit">Submit</Button>
            </div>
          </Form>
        </div>
      </div>
    );
  }
}

const WrappedLogin = Form.create()(Login);

const mapState = state => ({
  loginWithoutReset: AuthModule.getLoginWithoutReset(state),
  isLoggedIn: AuthModule.isLoggedIn(state),
});

const mapDispatch = ({
  login: AuthModule.login,
  verify: AuthModule.verify,
  setLoggedInWithoutReset: AuthModule.setLoggedInWithoutReset,
});

export default connect(mapState, mapDispatch)(WrappedLogin);
