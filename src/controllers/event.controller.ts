import { Response } from "express";
import { IpaginationQuery, IreqUser } from "../utils/interface";
import response from "../utils/response";
import eventModel, { eventDAO, TypeEvent } from "../models/event.model";
import { FilterQuery, isValidObjectId } from "mongoose";

export default {
  async create(req: IreqUser, res: Response) {
    try {
      const payload = { ...req.body, createdBy: req.user?.id } as TypeEvent;
      await eventDAO.validate(payload);
      const result = await eventModel.create(payload);
      response.success(res, result, "Success create an event");
    } catch (error) {
      response.error(res, error, "failed to create an event");
    }
  },
  async findAll(req: IreqUser, res: Response) {
    try {
      const buildQuery = (filter: any) => {
        let query: FilterQuery<TypeEvent> = {};

        if (filter.search) query.$text = { $search: filter.search };
        if (filter.category) query.category = filter.category;
        if (filter.isOnline) query.isOnline = filter.isOnline;
        if (filter.isPublish) query.isPublish = filter.isPublish;
        if (filter.isFeature) query.isFeature = filter.isFeature;

        return query;
      };

      const {
        limit = 10,
        page = 1,
        search,
        category,
        isOnline,
        isFeature,
        isPublish,
      } = req.query;

      const query = buildQuery({
        search,
        category,
        isPublish,
        isFeature,
        isOnline,
      });

      const result = await eventModel
        .find(query)
        .limit(+limit)
        .skip((+page - 1) * +limit)
        .sort({ createdAt: -1 })
        .exec();
      const count = await eventModel.countDocuments(query);
      response.pagination(
        res,
        result,
        {
          current: +page,
          total: count,
          totalPages: Math.ceil(count / +limit),
        },
        "Success fetch all events",
      );
    } catch (error) {
      response.error(res, error, "failed to find all events");
    }
  },
  async findOne(req: IreqUser, res: Response) {
    try {
      const { id } = req.params;
      if (!isValidObjectId(id)) {
        return response.notFound(res, "failed to find one event");
      }
      const result = await eventModel.findById(id);
      if (!result) {
        return response.notFound(res, "failed to find one event");
      }
      response.success(res, result, "Success to find one event");
    } catch (error) {
      response.error(res, error, "failed to find one event");
    }
  },
  async update(req: IreqUser, res: Response) {
    try {
      const { id } = req.params;
      if (!isValidObjectId(id)) {
        return response.notFound(res, "failed to update one event");
      }
      const result = await eventModel.findByIdAndUpdate(id, req.body, {
        new: true,
      });
      response.success(res, result, "success to update one event");
    } catch (error) {
      response.error(res, error, "failed to update one event");
    }
  },
  async remove(req: IreqUser, res: Response) {
    try {
      const { id } = req.params;
      if (!isValidObjectId(id)) {
        return response.notFound(res, "failed to delete one event");
      }
      const result = await eventModel.findByIdAndDelete(id, { new: true });
      response.success(res, result, "success to delete one event");
    } catch (error) {
      response.error(res, error, "failed to delete one event");
    }
  },
  async findOneBySlug(req: IreqUser, res: Response) {
    try {
      const { slug } = req.params;
      const result = await eventModel.findOne({
        slug,
      });
      response.success(res, result, "Success find one by slug event");
    } catch (error) {
      response.error(res, error, "failed to find one by slug an event");
    }
  },
};
