import { Response } from "express";
import { IpaginationQuery, IreqUser } from "../utils/interface";
import CategoryModel, { categoryDAO } from "../models/category.model";
import response from "../utils/response";
import { isValidObjectId } from "mongoose";

export default {
  async create(req: IreqUser, res: Response) {
    try {
      await categoryDAO.validate(req.body);
      const result = await CategoryModel.create(req.body);
      response.success(res, result, "Category successfully created.");
    } catch (error) {
      response.error(res, error, "Failed create category");
    }
  },

  async findAll(req: IreqUser, res: Response) {
    const {
      page = 1,
      limit = 10,
      search,
    } = req.query as unknown as IpaginationQuery;
    try {
      const query = {};

      if (search) {
        Object.assign(query, {
          $or: [
            {
              name: { $regex: search, $options: "i" },
            },
            {
              description: { $regex: search, $options: "i" },
            },
          ],
        });
      }

      const result = await CategoryModel.find(query)
        .limit(limit)
        .skip((page - 1) * limit)
        .sort({ createdAt: -1 })
        .exec();

      const count = await CategoryModel.countDocuments(query);

      response.pagination(
        res,
        result,
        {
          total: count,
          totalPages: Math.ceil(count / limit),
          current: page,
        },
        "Success find all category",
      );
    } catch (error) {
      response.error(res, error, "Failed find all category");
    }
  },

  async findOne(req: IreqUser, res: Response) {
    try {
      const { id } = req.params;
      if (!isValidObjectId(id)) {
        return response.notFound(res, "failed to find one category");
      }
      const result = await CategoryModel.findById(id);
      if (!result) {
        return response.notFound(res, "failed find one category");
      }
      response.success(res, result, "Success find a category");
    } catch (error) {
      response.error(res, error, "Failed find a category");
    }
  },

  async update(req: IreqUser, res: Response) {
    try {
      const { id } = req.params;
      if (!isValidObjectId(id)) {
        return response.notFound(res, "failed to update one category");
      }
      const result = await CategoryModel.findByIdAndUpdate(id, req.body, {
        new: true,
      });
      response.success(res, result, "success update one category");
    } catch (error) {
      response.error(res, error, "failed update one category");
    }
  },

  async remove(req: IreqUser, res: Response) {
    try {
      const { id } = req.params;
      if (!isValidObjectId(id)) {
        return response.notFound(res, "failed to remove one category");
      }
      const result = await CategoryModel.findByIdAndDelete(id, { new: true });
      response.success(res, result, "Success to remove one category");
    } catch (error) {
      response.error(res, error, "failed to remove one category");
    }
  },
};
