import { createParamDecorator, ExecutionContext } from '@nestjs/common';
export const getUser = createParamDecorator((data: string, context: ExecutionContext) => {
  const request = context.switchToHttp().getRequest();
    return data ? request.user?.[data] : request.user;
});