import { GetUser } from './user.decorator';
import { ROUTE_ARGS_METADATA } from '@nestjs/common/constants';
import * as httpMocks from 'node-mocks-http';
import { ExecutionContextHost } from '@nestjs/core/helpers/execution-context-host';
import { mockUsers } from '../../../test/mock.data';

describe('GetUser Decorator', () => {
  function getParamsDecoratorFactory(
    decorator: Function, //eslint-disable-line
  ) {
    class Test {
      public test(
        @decorator() _value: any, //eslint-disable-line
      ) {}
    }

    const args = Reflect.getMetadata(
      ROUTE_ARGS_METADATA,
      Test,
      'test',
    );
    return args[Object.keys(args)[0]]
      .factory;
  }

  const req = httpMocks.createRequest();
  const res =
    httpMocks.createResponse();
  const getUser =
    getParamsDecoratorFactory(GetUser);
  const mockUser = mockUsers[0];
  req.user = mockUser;
  const ctx = new ExecutionContextHost([
    req,
    res,
  ]);
  it('should return the current user if no data is passed', () => {
    const result = getUser(null, ctx);
    expect(result).toBeDefined();
  });

  it('should return the correct field for any given data', () => {
    const email = getUser('email', ctx);
    const id = getUser('id', ctx);
    const firstName = getUser(
      'firstName',
      ctx,
    );
    const lastName = getUser(
      'lastName',
      ctx,
    );
    expect(email).toEqual(
      mockUser.email,
    );
    expect(id).toEqual(mockUser.id);
    expect(firstName).toEqual(
      mockUser.firstName,
    );
    expect(lastName).toEqual(
      mockUser.lastName,
    );
  });
});
