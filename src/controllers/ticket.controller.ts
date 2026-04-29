import { Response } from "express";
import { IpaginationQuery, IreqUser } from "../utils/interface";
import response from "../utils/response";
import TicektModel, { ticketDAO, TypeTicket } from "../models/ticket.model";
import { FilterQuery, isValidObjectId } from "mongoose";

export default {
  async create(req: IreqUser, res: Response) {
    try {
      await ticketDAO.validate(req.body);
      const result = await TicektModel.create(req.body);
      response.success(res, result, "success create a ticket");
    } catch (error) {
      response.error(res, error, "failed to create a ticket");
    }
  },
  async findAll(req: IreqUser, res: Response) {
    try {
      const {
        limit = 10,
        page = 1,
        search,
      } = req.query as unknown as IpaginationQuery;

      const query: FilterQuery<TypeTicket> = {};

      if (search) {
        Object.assign(query, {
          ...query,
          $text: {
            $search: search,
          },
        });
      }

      const result = await TicektModel.find(query)
        .populate("events")
        .limit(limit)
        .skip((page - 1) * limit)
        .sort({ createdAt: -1 })
        .exec();

      const count = await TicektModel.countDocuments(query);
      response.pagination(
        res,
        result,
        {
          total: count,
          current: page,
          totalPages: Math.ceil(count / limit),
        },
        "success find all ticket",
      );
    } catch (error) {
      response.error(res, error, "failed to find all tickets");
    }
  },
  async findOne(req: IreqUser, res: Response) {
    try {
      const { id } = req.params;
      const result = await TicektModel.findById(id);
      response.success(res, result, "success find one ticket");
    } catch (error) {
      response.error(res, error, "failed to find one ticket");
    }
  },
  async update(req: IreqUser, res: Response) {
    try {
      const { id } = req.params;
      const result = await TicektModel.findByIdAndUpdate(id, req.body, {
        new: true,
      });
      response.success(res, result, "success update one ticket");
    } catch (error) {
      response.error(res, error, "failed to update a ticket");
    }
  },
  async remove(req: IreqUser, res: Response) {
    try {
      const { id } = req.params;
      const result = await TicektModel.findByIdAndDelete(id, {
        new: true,
      });
      response.success(res, result, "success remove one ticket");
    } catch (error) {
      response.error(res, error, "failed to remove a ticket");
    }
  },
  async findAllByEvent(req: IreqUser, res: Response) {
    try {
      const { eventId } = req.params;
      if (!isValidObjectId(eventId)) {
        return response.error(res, null, "ticket not found");
      }
      const result = await TicektModel.find({ events: eventId }).exec();
      response.success(res, result, "success find all tickets by an event");
    } catch (error) {
      response.error(res, error, "failed to find all tickets by event");
    }
  },
};
