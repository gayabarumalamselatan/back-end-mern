import { Response } from "express";
import { IpaginationQuery, IreqUser } from "../utils/interface";
import response from "../utils/response";
import eventModel, { eventDAO, TEvent } from "../models/event.model";
import { FilterQuery } from "mongoose";

export default {
  async create(req: IreqUser, res: Response) {
    try {
      const payload = { ...req.body, createdBy: req.user?.id } as TEvent;
      await eventDAO.validate(payload);
      const result = await eventModel.create(payload);
      response.success(res, result, "Success create an event");
    } catch (error) {
      response.error(res, error, 'failed to create an event');
    }
  },
  async findAll(req: IreqUser, res: Response) {
    try {
      const {limit = 10, page = 1, search} = req.query as unknown as IpaginationQuery;
      const query: FilterQuery<TEvent> = {};
      if(search){
        Object.assign(query, {
          ...query,
          $text: {
            $search: search,
          }
        })
      }
      const result = await eventModel.find(query).limit(limit).skip((page - 1) * limit).sort({createdAt: -1}).exec();
      const count = await eventModel.countDocuments(query);
      response.pagination(res, result, {
        current: page, 
        total: count, 
        totalPages: Math.ceil(count/limit),
      }, "Success fetch all events")
    } catch (error) {
      response.error(res, error, 'failed to find all events');
    }
  },
  async findOne(req: IreqUser, res: Response) {
    try {
      const { id } = req.params;
      const result = await eventModel.findById(id);
      response.success(res, result, "Success find one event");
    } catch (error) {
      response.error(res, error, 'failed to find one event');
    }
  },
  async update(req: IreqUser, res: Response) {
    try {
      const { id } = req.params;
      const result = await eventModel.findByIdAndUpdate(id, req.body, {new: true});
      response.success(res, result, "Success update an event");
    } catch (error) {
      response.error(res, error, 'failed to update an event');
    }
  },
  async remove(req: IreqUser, res: Response) {
    try {
      const { id } = req.params;
      const result = await eventModel.findByIdAndDelete(id, {new: true});
      response.success(res, result, "Success delete an event");
    } catch (error) {
      response.error(res, error, 'failed to delete an event');
    }
  },
  async findOneBySlug(req: IreqUser, res: Response) {
    try {
      const { slug } = req.params;
      const result = await eventModel.findOne({
        slug
      });
      response.success(res, result, "Success find one by slug event");
    } catch (error) {
      response.error(res, error, 'failed to find one by slug an event');
    }
  },
}