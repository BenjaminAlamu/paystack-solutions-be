import { injectable } from "tsyringe";
import { Request, Response } from "express";
import OrderService from "../services/order.service";
import { SuccessResponse } from "@shared/utils/response.util";
import httpStatus from "http-status";
import NotFoundError from "@shared/error/not-found.error";

@injectable()
class OrderController {
  constructor(
    private readonly orderService: OrderService,
  ) {
 
  }

  async paystackCallback(request: Request, response: Response) {
    const data = await this.orderService.paystackCallback(request.body);

    return response
      .status(httpStatus.OK)
      .send(SuccessResponse("Operation successful", data));
  }

  async getAll(request: Request, response: Response) {
    const data = await this.orderService.getAll(request);

    return response
      .status(httpStatus.OK)
      .send(SuccessResponse("Operation successful", data));
  }

  async getByCode(request: Request, response: Response) {
    const code = request.params.code;
  
    if (!code) {
      throw new NotFoundError("Order not found.");
    }
  
    const data = await this.orderService.getSingleOrder(code);
  
    return response
      .status(httpStatus.OK)
      .send(SuccessResponse("Operation successful", data));
  }

  async attachDynamicVirtualAccount(request: Request, response: Response) {
    const code = request.body.code;
  
    if (!code) {
      throw new NotFoundError("Order not found.");
    }
  
    const data = await this.orderService.attachDynamicVirtualAccount(code);
  
    return response
      .status(httpStatus.OK)
      .send(SuccessResponse("Operation successful", data));
  }
  

  async mockCallback(request: Request, response: Response) {
    const code = request.body.code;
    if (!code) {
      throw new NotFoundError("Order not found.");
    }
  
    await new Promise((resolve) => setTimeout(resolve, 2000));
  
    const data = await this.orderService.mockCallback(code);
  
    return response
      .status(httpStatus.OK)
      .send(SuccessResponse("Operation successful", data));
  }
  


  async createOrder(request: Request, response: Response) {
    const data = await this.orderService.createOrder({
      ...request.body,
      userId: request?.user?.id,
    });


    return response
      .status(httpStatus.CREATED)
      .send(SuccessResponse("Order has been created", data));
  }

}

export default OrderController;
