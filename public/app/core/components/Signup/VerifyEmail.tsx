import React, { FC, useState } from 'react';
import { Form, Field, Input, Button, Legend, Container, HorizontalGroup, LinkButton } from '@grafana/ui';
import { getConfig } from 'app/core/config';
import { getBackendSrv } from '@grafana/runtime';
import appEvents from 'app/core/app_events';
import { AppEvents } from '@grafana/data';

interface EmailDTO {
  email: string;
}

export const VerifyEmail: FC = () => {
  const [emailSent, setEmailSent] = useState(false);

  const onSubmit = (formModel: EmailDTO) => {
    getBackendSrv()
      .post('/api/user/signup', formModel)
      .then(() => {
        setEmailSent(true);
      })
      .catch((err) => {
        const msg = err.data?.message || err;
        appEvents.emit(AppEvents.alertWarning, [msg]);
      });
  };

  if (emailSent) {
    return (
      <div>
        <p>一个带有验证链接的邮件已经发送到了您的邮箱地址。您应该很快就能收到。</p>
        <Container margin="md" />
        <LinkButton variant="primary" href={getConfig().appSubUrl + '/signup'}>
          Complete Signup
        </LinkButton>
      </div>
    );
  }

  return (
    <Form onSubmit={onSubmit}>
      {({ register, errors }) => (
        <>
          <Legend>Verify Email</Legend>
          <Field
            label="Email"
            description="输入您的邮箱地址来获取验证链接"
            invalid={!!errors.email}
            error={errors.email?.message}
          >
            <Input
              id="email"
              {...register('email', {
                required: '需要邮箱',
                pattern: {
                  value: /^\S+@\S+$/,
                  message: '无效邮箱',
                },
              })}
              placeholder="邮箱"
            />
          </Field>
          <HorizontalGroup>
            <Button>Send verification email</Button>
            <LinkButton fill="text" href={getConfig().appSubUrl + '/login'}>
              返回登入界面
            </LinkButton>
          </HorizontalGroup>
        </>
      )}
    </Form>
  );
};
