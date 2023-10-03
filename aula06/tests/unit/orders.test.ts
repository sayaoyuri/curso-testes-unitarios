import { faker } from "@faker-js/faker";

import { createOrder, getOrderByProtocol } from "../../src/order-service";
import * as orderRepository from "../../src/order-repository";
import { OrderInput } from "../../src/validator";
import { Order, Status } from "@prisma/client";

describe("Order Service Tests", () => {
  it("should create an order", async () => {
    const orderSpy = {
      protocol: 'ABC',
      status: Status.IN_PREPARATION
    };

    jest.spyOn(orderRepository, 'create').mockImplementationOnce((): any => orderSpy);

    const order: OrderInput = {
      client: 'Josefino',
      description: 'Description do Josefino'
    };

    const createdOrder = await createOrder(order);
    
    expect(createdOrder).toEqual(orderSpy);
  });

  it("should return an order based on the protocol", async () => {
    const protocol= 'ABC';

    jest.spyOn(orderRepository, 'getByProtocol').mockImplementationOnce((): any => {
      return {
        protocol,
        status: Status.READY,
      };
    });

    const order =  await getOrderByProtocol(protocol);
    expect(order).toEqual({
      protocol,
      status: Status.READY,
    });
  });

  it("should return status INVALID when protocol doesn't exists", async () => {
    jest.spyOn(orderRepository, 'getByProtocol').mockImplementationOnce((): any => null);

    const protocol = 'ABCD';
    
    const order = await getOrderByProtocol(protocol);
    expect(order).toEqual({
      protocol, 
      status: 'INVALID',
    });
  });
});