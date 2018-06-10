import React from 'react';
import PropTypes from 'prop-types';
import { Input, Form, Button, Icon } from 'antd';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import * as AuthModule from 'modules/auth';
import style from './style.css';

const FormItem = Form.Item;

class Reset extends React.Component {
  static propTypes = {
    form: PropTypes.object.isRequired,
    reset: PropTypes.func.isRequired,
    email: PropTypes.string.isRequired,
    isLoggedIn: PropTypes.string.isRequired,
  }

  state = {
    error: {},
  }

  reset = async (values) => {
    try {
      await this.props.reset(values);
    } catch (error) {
      if (error.status === 403) {
        this.setState({
          error: {
            ...this.state.error,
            oldPassword: 'Password is wrong',
          },
        }, () => {
          this.props.form.validateFields(['oldPassword'], { force: true });
        });
      } else if (error.status === 401 || error.status === 400) {
        const { response: { body: { message } = {} } = {} } = error;
        this.setState({
          error: {
            ...this.state.error,
            newPassword: message,
          },
        }, () => {
          this.props.form.validateFields(['newPassword'], { force: true });
        });
      }
    }
  }

  checkPasswordResult = (rule, value, callback) => {
    const { error: { oldPassword } = {} } = this.state;
    if (oldPassword) {
      callback(oldPassword);
    } else {
      callback();
    }
  }

  validateToNextPassword = (rule, value, callback) => {
    const { error: { newPassword } = {} } = this.state;
    if (newPassword) {
      callback(newPassword);
    } else {
      callback();
    }
  }

  compareToFirstPassword = (rule, value, callback) => {
    const { form } = this.props;
    if (value && value !== form.getFieldValue('newPassword')) {
      callback('Two passwords that you enter is inconsistent!');
    } else {
      callback();
    }
  }

  handleBlur = filed => () => {
    this.setState({ error: {
      ...this.state.error,
      [filed]: undefined,
    } }, () => {
      this.props.form.validateFields([filed], { force: true });
    });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.reset(values);
      }
    });
  }

  render () {
    const { getFieldDecorator } = this.props.form;
    const { email, isLoggedIn } = this.props;

    if (isLoggedIn) return (<Redirect to="/home/" />);

    return (
      <div className={style.page} >
        <div className={style.reset}>
          <div className={style.header}>
            Reset Password
          </div>
          <Form className={style.form} onSubmit={this.handleSubmit}>
            <Input type="email" value={email} disabled prefix={<Icon type="mail" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Email" />,

            <FormItem>
              {getFieldDecorator('oldPassword', {
                rules: [
                  { required: true, message: 'Please input your old password!' },
                  { validator: this.checkPasswordResult },
                ],
              })(
                <Input
                  prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  type="password"
                  placeholder="Password"
                  onBlur={this.handleBlur('oldPassword')}
                />,
              )}
            </FormItem>

            <FormItem>
              {getFieldDecorator('newPassword', {
                rules: [
                  { required: true, message: 'Please input your new password!' },
                  { validator: this.validateToNextPassword },
                ],
              })(
                <Input
                  prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  type="password"
                  placeholder="Password"
                  onBlur={this.handleBlur('newPassword')}
                />,
              )}
            </FormItem>

            <FormItem>
              {getFieldDecorator('confirm', {
                rules: [{
                  required: true, message: 'Please confirm your new password!',
                }, {
                  validator: this.compareToFirstPassword,
                }],
              })(
                <Input
                  prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  type="password"
                  placeholder="Confirm Password"
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

const mapState = state => ({
  email: AuthModule.getLoginWithoutResetAuth(state),
  isLoggedIn: AuthModule.isLoggedIn(state),
});
const mapDispatch = ({
  reset: AuthModule.reset,
});

const WrappedReset = Form.create()(Reset);


export default connect(mapState, mapDispatch)(WrappedReset);
